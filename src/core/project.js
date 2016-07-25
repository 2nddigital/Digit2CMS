var _async = require("async");
var _path = require("path");

function Project(projectObject){
  var self = this;
  this.Module = require("./module.js");
  this.projectTree = null;
  this.projectData = projectObject;

  return this;
}

Project.prototype.export = function(){
  //export tree per layer
};

Project.prototype.initialize = function(){
  this.projectTree = this.buildSubtree("0"); //starting point of tree
  console.log("should be a module: ");
  console.log(this.projectTree);
  _async.parallel(this.projectData["0"].children.content.map(function(elem){
    return function(callback){
      callback(null, elem);
    };
  }), function(err, results){
    console.log(err);
    console.log(results);
  });
};

Project.prototype.buildSubtree = function(moduleId){
  var self = this;
  var moduleSettings = this.projectData[moduleId];

  var modulePath = _path.join(_path.join("../modules", moduleSettings.module), "module.json");
  console.log(modulePath);
  var moduleObject = require(modulePath);
  //TODO: extend module object with settings from project file
  var currentNode = new this.Module(moduleObject);

  moduleSettings.child_containers.forEach(function(containerId){
    _async.parallel(moduleSettings.children[containerId].map(function(child, index){
      return function(callback){
        var subTree = self.buildSubtree(child);
        currentNode.addChildAt(containerId, index, subTree);
        callback(null, child);
      };
    }), function(err, results){
      console.log(err);
      console.log(results);
    });
  });

  return currentNode;
};

module.exports = Project;
