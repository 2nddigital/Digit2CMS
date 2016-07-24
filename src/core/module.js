function Module(moduleObject){
  var self = this;
  this.containers = {};
  this.properties = {};
  // Load containers from moduleObject into containers object
  if(typeof(moduleObject.containers) !== 'undefined' && Array.isArray(moduleObject.containers)){
    moduleObject.containers.forEach(function(containerObject){
      if(typeof(containerObject.id) !== 'undefined'){
        self.containers[containerObject.id] = new Module.prototype.Container(containerObject);
      }
    });
  }

  return this;
}

Module.prototype.Container = function(containerObject){
  var self = this;
  this.containerProperties = containerObject;
  this.modules = [];
};

Module.prototype.Container.prototype.addChild = function(childModule){
  if(childModule instanceof Module){
    
    this.modules.push(childModule);
  }
};

Module.prototype.addChild = function(containerId, childModule){
  if(childModule instanceof Module){
    if(typeof(this.containers[containerId]) !== 'undefined' && (this.containers[containerId] instanceof Module.prototype.Container)){
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
