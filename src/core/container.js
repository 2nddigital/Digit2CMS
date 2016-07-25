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

Container.prototype.export = function(){};

Container.prototype.render = function(){
  var result = "";
  this.modules.forEach(function(module){
    result += module.render();
  });
  return result;
};

module.exports = Container;
