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
  var self = this;
  var exportQueue = ["0"];
  var exportedObject = {};

  while(exportQueue.length > 0){
    var exportModulePath = exportQueue.shift();
    var exportModule = this.getSubtreeByPath(exportModulePath);
    var exportedModule = exportModule.export(exportModulePath);
    exportedObject[exportModulePath] = exportedModule;

    for(var i in exportedModule.child_containers){
      var containerId = exportedModule.child_containers[i];
      exportQueue.push.apply(exportQueue, exportedModule.children[containerId]);
    }
  }
  return exportedObject;
};

Project.prototype.initialize = function(){
  this.projectTree = this.buildSubtree("0"); //starting point of tree: index 0
};

Project.prototype.buildSubtree = function(moduleId, initialProperties){
  if(typeof(initialProperties) === 'undefined'){
    initialProperties = [];
  }
  var self = this;
  var moduleSettings = {
    "module": "",
    "properties": [],
    "child_containers": [],
    "children": {}
  }.extend(this.projectData[moduleId]);

  var modulePath = _path.resolve(__dirname, "..", "modules", moduleSettings.module, "module.json");

  var moduleObject = require(modulePath);
  var currentNode = new this.Module(moduleObject);
  currentNode.name = moduleSettings.module;
  currentNode.initializeProperties(initialProperties, true);
  currentNode.initializeProperties(moduleSettings.properties);

  moduleSettings.child_containers.forEach(function(containerId){
    _async.parallel(moduleSettings.children[containerId].map(function(child, index){
      return function(callback){
        var forwardProperties = currentNode.propertylist.map(function(propertyName){
          return currentNode.properties[propertyName];
        });
        var subTree = self.buildSubtree(child, forwardProperties);
        currentNode.addChildAt(containerId, index, subTree);
        callback(null, child);
      };
    }), function(err, results){
      if(err)
        console.log(err);
    });
  });

  return currentNode;
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
