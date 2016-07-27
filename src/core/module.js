var _path = require("path");
var _fs = require("fs");

function Module(moduleObject){
  var extendedModuleObject = {
    "name": null,
    "script": null,
    "content": null,
    "extends": null,
    "properties": [],
    "containers": []
  }.extend(moduleObject);

  var self = this;
  this.Container = require("./container.js");
  this.containers = {};
  this.properties = {};
  this.propertylist = [];
  this.name = null;

  this.content = null;
  this.contentFile = extendedModuleObject.content;

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
        self.containers[containerObject.id] = new self.Container(containerObject);
      }
    });
  }

  return this;
}

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
    if(typeof(this.containers[containerId]) !== 'undefined' && (this.containers[containerId] instanceof this.Container)){
      this.containers[containerId].addChild(childModule);
    }
  }
};

Module.prototype.addChildAt = function(containerId, index, childModule){
  if(childModule instanceof Module){
    if(typeof(this.containers[containerId]) !== 'undefined' && (this.containers[containerId] instanceof this.Container)){
      this.containers[containerId].addChildAt(index, childModule);
    }
  }
};

//TODO: remove getContainer
Module.prototype.getContainer = function(containerId){
  return (typeof(this.containers[containerId]) !== 'undefined') ? this.containers[containerId] : null;
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

Module.prototype.export = function(){

};

Module.prototype.propertyLookup = function(propertyName){
  return this.properties[propertyName];
};

Module.prototype.render = function(){
  var self = this;

  this.contentFile = _path.resolve(__dirname, "..", "modules", this.name, this.contentFile);
  this.content = _fs.readFileSync(this.contentFile, 'UTF-8');

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
