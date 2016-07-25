function Container(containerObject){
  var self = this;
  this.Module = require("./module.js");
  this.containerProperties = containerObject;
  this.modules = [];

  return this;
}

Container.prototype.addChild = function(childModule){
  if(childModule instanceof this.Module){

    this.modules.push(childModule);
  }
};

module.exports = Container;
