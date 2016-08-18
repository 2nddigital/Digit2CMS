var _async = require('async');

function Container(containerObject, parentModule){
  if(typeof(parentModule) === 'undefined'){
    parentModule = null;
  }
  var self = this;
  this.$parentModule = parentModule;
  this.Module = require("./module.js");
  this.containerProperties = {
    "id": null,
    "supports": null,
    "size": 0
  }.extend(containerObject);
  this.modules = [];
  return this;
}

Container.prototype.isSupportedModule = function(module){
  if(module instanceof this.Module){
    if(this.containerProperties.supports === null || this.containerProperties.supports === "all"){
      return true;
    }else if(Array.isArray(this.containerProperties.supports)){
      for(var i = 0; i < this.containerProperties.supports; i++){
        if(module.isType(this.containerProperties.supports[i]) === true){
          return true;
        }
      }
      return false;
    }else{
      return true;
    }
  }else{
    return false;
  }
};

Container.prototype.addChild = function(childModule){
  if(this.isSupportedModule(childModule) && this.hasCapacity(this.modules.length)){
    childModule.$parentContainer = this;
    this.modules.push(childModule);
    return true;
  }
  return false;
};

Container.prototype.hasCapacity = function(cap){
  return this.containerProperties.size < 1 || (cap < this.containerProperties.size);
};

Container.prototype.addChildAt = function(index, childModule){
  if(this.isSupportedModule(childModule) && this.hasCapacity(Math.max(index, this.modules.length))){
    childModule.$parentContainer = this;
    this.modules[index] = childModule;
    return true;
  }
  return false;
};

Container.prototype.walkSubtree = function(parentId, callback){
  this.modules.forEach(function(module, index){
    module.walkSubtree(parentId + "-" + index, callback);
  });
};

Container.prototype.getSubtreeByPath = function(pathList){
  if(typeof(pathList) !== 'undefined' && Array.isArray(pathList)){
    var moduleIndex = parseInt(pathList.shift(), 10);
    if(pathList.length === 0){
      return this.modules[moduleIndex];
    }else if(typeof(pathList) === 'string'){
      return this.getSubtreeByPath(pathList.split("-"));
    }else{
      return typeof(this.modules[moduleIndex]) !== 'undefined' ? this.modules[moduleIndex].getSubtreeByPath(pathList) : null;
    }
  }else{
    console.log("invalid pathlist");
    return null;
  }
};

Container.prototype.getId = function(mod){
  if(mod instanceof this.Module){
    return this.modules.indexOf(mod);
  }
  return null;
};

Container.prototype.export = function(parentId){
  return this.modules.map(function(module, index){
    return parentId + "-" + index;
  });
};

Container.prototype.render = function(){
  var result = "";
  this.modules.forEach(function(module){
    result += module.render();
  });
  return result;
};

module.exports = Container;
