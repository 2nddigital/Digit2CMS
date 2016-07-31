var _async = require('async');

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
      return this.modules[moduleIndex].getSubtreeByPath(pathList);
    }
  }else{
    console.log("invalid pathlist");
    return null;
  }
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
