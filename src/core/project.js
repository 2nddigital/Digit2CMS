var _async = require("async");
var _path = require("path");
var Module = require('./module.js');
var ProjectLink = require('./projectlink.js');

function Project(projectObject){
  var self = this;
  this.projectTree = null;
  this.projectData = projectObject;

  return this;
}

Project.prototype.export = function(){
  var exportedObject = {};
  this.walkSubtree(function(module, id){
    exportedObject[id] = module.export(id);
  });
  return exportedObject;
};

Project.prototype.initializeTree = function(){
  this.projectTree = this.buildSubtree("0"); //starting point of tree: index 0
};

Project.prototype.initializeModules = function(){
  var self = this;
  this.walkSubtree(function(module, id){
    module.initialize(id, new ProjectLink(self, module));
  });
};

Project.prototype.walkSubtree = function(callback){
  if(typeof(callback) !== 'function'){
    callback = function(){};
  }
  this.projectTree.walkSubtree("0", callback);
};

Project.prototype.buildSubtree = function(moduleId){
  var self = this;
  var moduleSettings = {
    "module": "",
    "properties": [],
    "child_containers": [],
    "children": {}
  }.extend(this.projectData[moduleId]);

  var currentNode = Module.create(moduleSettings.module);
  if(currentNode !== null){
    currentNode.initializeProperties(moduleSettings.properties);

    _async.forEachOf(moduleSettings.child_containers, function(containerName, containerIndex, containerCallback){
      _async.forEachOf(moduleSettings.children[containerName], function(childModule, childIndex, childCallback){
        var subTree = self.buildSubtree(childModule);
        currentNode.addChildAt(containerName, childIndex, subTree);
        childCallback(null, childIndex);
      }, function(childError, childResults){
        if(!childError){
          containerCallback(null, containerName);
        }else{
          console.log("something wrong?");
        }
      });
    }, function(containerError, containerResults){
      if(containerError){
        console.log("something wrong?");
      }
    });
  }  

  return currentNode;
};

Project.prototype.communicate = function(){
  this.walkSubtree(function(module, id){
    if(module.moduleEventInstance !== null && typeof(module.moduleEventInstance.onCommunicate) === 'function'){
      module.moduleEventInstance.onCommunicate();
    }
  });
};

Project.prototype.render = function(){
  return this.projectTree.render();
};

Project.prototype.getSubtreeByPath = function(pathList){
  if(typeof(pathList) !== 'undefined' && Array.isArray(pathList)){
    var containerKey = pathList.shift();
    if(pathList.length === 0 && containerKey === "0"){
      return this.projectTree;
    }else if(containerKey === "0"){
      return this.projectTree.getSubtreeByPath(pathList);
    }else{
      console.log("unknown relative key: " + containerKey);
    }
  }else if(typeof(pathList) === 'string'){
    return this.getSubtreeByPath(pathList.split("-"));
  }else{
    console.log("invalid pathlist");
    return null;
  }
};

module.exports = Project;
