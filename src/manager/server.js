/**
 * HTTP REST API
 */

//http://blog.robertonodi.me/node-authentication-series-email-and-password/

const manager = require("./projectmanager");
const express = require("express");
const app = express();
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const cookieparser = require("cookie-parser");
const bodyparser = require("body-parser");
const cookiesession = require("cookie-session");
const servestatic = require("serve-static");
const flash = require("connect-flash");
const database = require("./db");
const Password = require("./password");
const conf = require("../config");

function loggedIn(req, res, next){
if(req.user){
    next();
  } else {
    res.redirect("/login");
  }
}

database({
  database: conf.database,
  username: conf.username,
  password: conf.password,
  host: conf.host,
  port: conf.port,
  dialect: "mysql"
}, function(err, db){
  if(err) {
    return false;
  }

  passport.use(new localStrategy(function(username, password, done) {
    console.log(username);
    console.log(password);
    db.USER.findOne({ where: {username: username}, select: "+password +salt" }).then(user => {
      if(!user) {
        console.log("no user");
        return done(null, false, { message: "incorrect username" });
      }
      user.validatePassword(password, function(err, result){
        if(err){
          console.error(err);
          return done(null, false, {message: "error validating password"});
        }

        if(!result){
          return done(null, false, { message: "incorrect password" });
        }

        return done(null, user);
      });
    }).catch(err => {
      done(err);
    });
  }));

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    db.USER.findById(id).then(user => {
      done(null, user);
    }).catch(err => {
      done(err);
    });
  });

  app.use(servestatic("public"));
  app.use(bodyparser.urlencoded({extended: false}));
  app.use(bodyparser.json());
  app.use(cookieparser());
  app.use(cookiesession({
    keys: ["key1", "key2"]
  }));
  app.use(flash());
  app.use(passport.initialize());
  app.use(passport.session());

  app.get("/", function(req, res){
    res.send("home");
  });

  app.get("/login", function(req, res){
    res.sendFile("login.html", {root: __dirname});
  });

  app.get("/signup", function(req, res){
    res.sendFile("signup.html", {root: __dirname});
  });

  app.post("/signup", function(req, res, next){
    db.USER.findOne({ where: {username: req.body.username} }).then(user => {
      if(user){
        res.status(403).json({
          message: "username taken"
        });
      } else {
        Password.hash(req.body.password, function(err, passwd, salt){
          if(err){
            next(err);
          } else {
            db.USER.create({
              username: req.body.username,
              password: passwd,
              salt: salt
            }).then(userCreated => {
              res.status(201).json(userCreated);
            }).catch(err => {
              next(err);
            });
          }
        });
      }
    }).catch(err => {
      next(err);
    });

  });

  app.get("/secure", loggedIn, function(req, res) {
    res.send("secret here");
  });

  app.post("/login", passport.authenticate("local", {
    successRedirect: "/secure",
    failureRedirect: "/login"
  }), function(req, res){
    res.send("ok");
  });

  app.listen(3000, function(){
    console.log("server listening");
  });
});
