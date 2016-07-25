Object.prototype.extend = function(ext){
  for(var i in ext){
    if(ext.hasOwnProperty(i)){
      this[i] = ext[i];
    }
  }
};
