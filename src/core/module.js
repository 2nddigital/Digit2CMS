function Module(moduleObject){
  var self = this;
  this.containers = {};

  // Load containers from moduleObject into containers object, initialize with null
  if(typeof(moduleObject.containers) === 'object'){
    moduleObject.containers.forEach(function(containerId){
      self.containers[containerId] = null;
    });
  }

  return this;
}

Module.prototype.setChild = function(containerId, childModule){
  if(childModule instanceof Module && typeof(this.containers[containerId]) !== 'undefined'){
    this.containers[containerId] = childModule;
  }
};

Module.prototype.getChild = function(containerId){
  return (typeof(this.containers[containerId]) !== 'undefined') ? this.containers[containerId] : null;
};

module.exports = Module;
