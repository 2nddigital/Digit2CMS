const sequelize = require("sequelize");
const Password = require("./password");

function DB(connectionData, done){
  this.sq = new sequelize(connectionData.database, connectionData.username, connectionData.password, {
    host: connectionData.host,
    port: connectionData.port,
    dialect: connectionData.dialect
  });

  this.USER = sq.define("user", {
    username: {
      type: sequelize.STRING(126),
      select: true,
      required: true,
      unique: true
    },
    password: {
      type: sequelize.STRING(256),
      select: false,
      required: true
    },
    salt: {
      type: sequelize.STRING(64),
      select: false,
      required: true
    },
  });

  this.USER.prototype.validatePassword = function(passwd, result) {
    var self = this;
    Password.hash(passwd, this.salt, function(err, hash) {
      console.log({
        input: passwd,
        salt: self.salt,
        password: self.password
      });
      if(err){
        result(err, null);
      } else {
        console.log(hash);
        result(null, self.password == hash);
      }
    });
  };

  this.USER.sync();

  this.sq.authenticate().then(() => {
    console.log("connected");
    done(null, this);
  }).catch(err => {
    console.error("can not connect", err);
    done(err, null);
  });
}

module.exports = DB;
