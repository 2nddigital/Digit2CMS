var _path = require("path");
var _fs = require("fs");
var Container = require('./container.js');
var DefaultModule = require("./module.default.js");
var _async = require('async');

function Module(moduleObject, moduleName){
  //TODO: extend module object by first initializing the super class. (every function call also checks super class)
  var extendedModuleObject = {
    "name": null,
    "script": null,
    "content": null,
    "extends": null,
    "properties": [],
    "containers": []
  }.extend(moduleObject);

  var self = this;
  this.containers = {};
  this.properties = {};
  this.propertylist = [];
  this.name = moduleName;
  this.$super = null;
  this.$parentContainer = null;
  this.content = "";
  this.script = null;
  this.moduleEventInstance = null;

  this.contentFile = extendedModuleObject.content !== null ? _path.resolve(__dirname, "..", "modules", this.name, extendedModuleObject.content) : null;
  this.scriptFile = extendedModuleObject.script !== null ? _path.resolve(__dirname, "..", "modules", this.name, extendedModuleObject.script) : null;

  extendedModuleObject.properties.forEach(function(elem){
    self.propertylist.push(elem.name);
    self.properties[elem.name] = {
      "name": null,
      "type": null,
      "value": null,
      "readonly": false,
      "inherited": false
    }.extend(elem);
  });

  // Load containers from moduleObject into containers object
  if(typeof(extendedModuleObject.containers) !== 'undefined' && Array.isArray(extendedModuleObject.containers)){
    extendedModuleObject.containers.forEach(function(containerObject){
      if(typeof(containerObject.id) !== 'undefined'){
        self.containers[containerObject.id] = new Container(containerObject, this);
      }
    });
  }

  return this;
}

Module.prototype.getPathToRoot = function(){
  var currentNode = this;
  var path = "";
  while(currentNode instanceof Module || currentNode instanceof Container){
    if(currentNode instanceof Module){
      var newNode = currentNode.$parentContainer;
      path = newNode.containerProperties.id + "-" + newNode.getId(currentNode) + "-" + path;
      currentNode = newNode;
    }else{
      currentNode = currentNode.$parentModule;
    }
  }
  return path;
};

Module.prototype.initialize = function(id, projectLink){
  if(this.contentFile !== null){
    this.content = _fs.readFileSync(this.contentFile, 'UTF-8');
  }
  if(this.scriptFile !== null){
    this.script = require(this.scriptFile);
  }
  if(typeof(this.script) === 'function'){
    this.moduleEventInstance = new this.script(projectLink, id);
  }else{
    this.moduleEventInstance = new DefaultModule(projectLink, id);
  }
  this.moduleEventInstance.link = projectLink;
  if(typeof(this.moduleEventInstance.initialize) === 'function'){
    this.moduleEventInstance.initialize();
  }
  return this;
};

Module.prototype.getContainers = function(){
  var clist = [];
  for(var i in this.containers){
    if(this.containers.hasOwnProperty(i)){
      clist.push(i);
    }
  }
  return clist;
};

Module.prototype.initializeProperties = function(properties, inherited){
  if(typeof(inherited) === 'undefined'){
    inherited = false;
  }
  var self = this;
  properties.forEach(function(property){
    if(typeof(self.properties[property.name]) !== 'undefined'){
      self.properties[property.name].extend(property).inherited = inherited;
    }else{
      self.properties[property.name] = {
        "name": null,
        "type": null,
        "value": null,
        "readonly": false,
        "inherited": false
      }.extend(property);
      self.properties[property.name].inherited = inherited;
      self.propertylist.push(property.name);
    }
  });
};

Module.prototype.addChild = function(containerId, childModule){
  if(childModule instanceof Module){
    if(typeof(this.containers[containerId]) !== 'undefined' && (this.containers[containerId] instanceof Container)){
      this.containers[containerId].addChild(childModule);
    }
  }
};

Module.prototype.createChild = function(containerId, childProperties){
  var self = this;
  if(typeof(childProperties) !== 'object'){
    childProperties = {};
  }
  var extendedChildProperties = {
    "module": "",
    "properties": [],
    "child_containers": [],
    "children": {}
  }.extend(childProperties);

  var modulePath = _path.resolve(__dirname, "..", "modules", extendedChildProperties.module, "module.json");

  if(typeof(this.containers[containerId]) !== 'undefined' && (this.containers[containerId] instanceof Container)){
    var initialProperties = this.propertylist.map(function(propertyName){
      return self.properties[propertyName];
    });

    var moduleObject = require(modulePath);
    var newModule = new Module(moduleObject, extendedChildProperties.module);
    newModule.initializeProperties(initialProperties, true);
    newModule.initializeProperties(extendedChildProperties.properties);

    this.addChild(containerId, newModule);
    return newModule;
  }else{
    return null;
  }
};

Module.prototype.addChildAt = function(containerId, index, childModule){
  if(childModule instanceof Module){
    if(typeof(this.containers[containerId]) !== 'undefined' && (this.containers[containerId] instanceof Container)){
      this.containers[containerId].addChildAt(index, childModule);
    }
  }
};

//TODO: remove getContainer
Module.prototype.getContainer = function(containerId){
  return (typeof(this.containers[containerId]) !== 'undefined') ? this.containers[containerId] : null;
};

Module.prototype.exportContainers = function(containers, parentId){
  var containerExport = {};
  var self = this;
  containers.forEach(function(container){
    containerExport[container] = self.containers[container].export(parentId + "-" + container);
  });
  return containerExport;
};

Module.prototype.getSubtreeByPath = function(pathList){
  if(typeof(pathList) !== 'undefined' && Array.isArray(pathList)){
    var containerKey = pathList.shift();
    if(pathList.length === 0){
      return this.containers[containerKey];
    }else{
      return this.containers[containerKey].getSubtreeByPath(pathList);
    }
  }else if(typeof(pathList) === 'string'){
    return this.getSubtreeByPath(pathList.split("-"));
  }else{
    console.log("invalid pathlist");
    return null;
  }
};

Module.prototype.exportProperties = function(){
  var self = this;
  return this.propertylist.map(function(propertyId){
    var property = self.properties[propertyId];
    return property;
  }).filter(function(property){
    return !property.inherited;
  });
};

Module.prototype.export = function(parentId){
  var self = this;
  var containers = self.getContainers();
  return {
    "module": self.name,
    "child_containers": containers,
    "children": self.exportContainers(containers, parentId),
    "properties": self.exportProperties()
  };
};

Module.prototype.propertyLookup = function(propertyName){
  return this.properties[propertyName];
};

Module.prototype.propertySet = function(propertyName, propertyValue){
  var property = this.propertyLookup(propertyName);
  if(property !== null && property.inherited === false){
    property.value = propertyValue;
    return true;
  }else{
    return false;
  }
};

Module.prototype.walkSubtree = function(parentId, mainCallback){
  var self = this;
  if(typeof(mainCallback) !== 'function'){
    mainCallback = function(){};
  }
  mainCallback(this, parentId);

  this.getContainers().forEach(function(containerId){
    self.containers[containerId].walkSubtree(parentId + "-" + containerId, mainCallback);
  });
};

Module.prototype.render = function(){
  var self = this;
  return this.content.replace(/{(\S+)}/g, function(totalMatch, property){
    return self.propertyLookup(property).value;
  }).replace(/\/\/(\S+)\\\\/g, function(totalMatch, container){
    if(typeof(self.containers[container]) !== 'undefined' && self.containers[container] !== null){
      return self.containers[container].render();
    }else{
      return "";
    }
  });
};

module.exports = Module;
