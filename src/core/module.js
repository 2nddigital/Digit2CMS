function Module(moduleObject){
  var self = this;
  this.Container = require("./container.js");
  this.containers = {};
  this.properties = {};
  // Load containers from moduleObject into containers object
  if(typeof(moduleObject.containers) !== 'undefined' && Array.isArray(moduleObject.containers)){
    moduleObject.containers.forEach(function(containerObject){
      if(typeof(containerObject.id) !== 'undefined'){
        self.containers[containerObject.id] = new self.Container(containerObject);
      }
    });
  }

  return this;
}

Module.prototype.addChild = function(containerId, childModule){
  if(childModule instanceof Module){
    if(typeof(this.containers[containerId]) !== 'undefined' && (this.containers[containerId] instanceof this.Container)){
      this.containers[containerId].addChild(childModule);
    }
  }
};

Module.prototype.getContainer = function(containerId){
  return (typeof(this.containers[containerId]) !== 'undefined') ? this.containers[containerId] : null;
};

Module.prototype.export = function(){

};

module.exports = Module;
