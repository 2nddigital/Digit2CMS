function Module(moduleObject){
  var extendedModuleObject = {
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
  this.content = "deze demo is slechts {test} een demonstratie {boe} voor een demo";

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
  console.log(propertyName);
  return "--fillin--";
};

Module.prototype.render = function(){
  //demo for property rendering
  var self = this;
  return this.content.replace(/{(\S+)}/g, function(totalMatch, groupMatch){
    return self.propertyLookup(groupMatch);
  });
};

module.exports = Module;
