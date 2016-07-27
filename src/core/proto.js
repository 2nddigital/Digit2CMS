Object.prototype.extend = function(ext){
  for(var i in ext){
    if(ext.hasOwnProperty(i)){
      this[i] = ext[i];
    }
  }
  return this;
};

Object.prototype.safeExtend = function(ext){
  var newObject = {};
  for(var i1 in this){
    if(this.hasOwnProperty(i1)){
      newObject[i1] = this[i1];
    }
  }
  for(var i2 in ext){
    if(ext.hasOwnProperty(i2)){
      newObject[i2] = ext[i2];
    }
  }
  return newObject;
};
