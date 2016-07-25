function Container(containerObject){
  var self = this;
  this.Module = require("./module.js");
  this.containerProperties = {
    "id": null,
    "supports": null,
    "size": 0
  }.extend(containerObject);
  this.modules = [];

  return this;
}

Container.prototype.addChild = function(childModule){
  if(childModule instanceof this.Module){

    this.modules.push(childModule);
  }
};

Container.prototype.addChildAt = function(index, childModule){
  if(childModule instanceof this.Module){
    this.modules[index] = childModule;
  }
};

module.exports = Container;
