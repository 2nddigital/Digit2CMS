var _async = require('async');

function Container(containerObject, parentModule){
  if(typeof(parentModule) === 'undefined'){
    parentModule = null;
  }
  var self = this;
  this.$parentModule = parentModule;
  this.containerProperties = {
    "id": null,
    "supports": null,
    "size": 0,
    "decorator": null
  }.extend(containerObject);
  this.modules = [];
  return this;
}

Container.prototype.isSupportedModule = function(mod){
  if(mod instanceof module.parent.exports.Module){
    if(this.containerProperties.supports === null || this.containerProperties.supports === "all"){
      return true;
    }else if(Array.isArray(this.containerProperties.supports)){
      if(this.containerProperties.length === 0){
        return true;
      }
      for(var i = 0; i < this.containerProperties.supports; i++){
        if(mod.isType(this.containerProperties.supports[i]) === true){
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
  if(mod instanceof module.parent.exports.Module){
    return this.modules.indexOf(mod);
  }
  return null;
};

Container.prototype.removeModule = function(mod){
  var index = mod;
  if(mod instanceof module.parent.exports.Module){
    index = this.getId(mod);
  }
  this.modules.splice(index, 1);
};

Container.prototype.export = function(parentId){
  return this.modules.map(function(module, index){
    return parentId + "-" + index;
  });
};

Container.prototype.decorate = function(input){
  if(this.containerProperties.decorator != null && typeof this.$parentModule.moduleEventInstance[this.containerProperties.decorator] === "function"){
    input = this.$parentModule.moduleEventInstance[this.containerProperties.decorator](input);
  }
  return input;
};

Container.prototype.render = function(){
  var self = this;

  var result = "";
  this.modules.forEach(function(module){
    result += self.decorate(module.render());
  });
  return result;
};

module.exports = Container;
