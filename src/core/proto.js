Object.prototype.extend = function(ext){
  for(var i in obj){
    if(obj.hasOwnProperty(i)){
      this[i] = obj[i];
    }
  }
};
