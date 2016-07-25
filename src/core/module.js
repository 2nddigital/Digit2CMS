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
  var contentPath = _path.join(__dirname, _path.join(_path.join("../modules", extendedModuleObject.name), extendedModuleObject.content));
  this.content = _fs.readFileSync(contentPath, 'UTF-8');
  console.log(this.content);

  extendedModuleObject.properties.forEach(function(elem){
    self.propertylist.push(elem.name);
    self.properties[elem.name] = {
      "name": null,
      "type": null,
      "value": null,
      "readonly": false
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

Module.prototype.initializeProperties = function(properties){
  var self = this;
  properties.forEach(function(property){
    if(typeof(self.properties[property.name]) !== 'undefined'){
      self.properties[property.name].extend(property);
    }else{
      self.properties[property.name] = property;
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

Module.prototype.getContainer = function(containerId){
  return (typeof(this.containers[containerId]) !== 'undefined') ? this.containers[containerId] : null;
};

Module.prototype.export = function(){

};

Module.prototype.propertyLookup = function(propertyName){
  return this.properties[propertyName];
};

Module.prototype.render = function(){
  //demo for property rendering
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
