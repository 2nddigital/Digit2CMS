var Module = require('../../core/module.js');
/***
* This function gets called after the project tree is built.
* The module_id variable contains the current unique id of this module instance,
* it can be used to communicate with other modules in the tree using the getModuleById(module_id) function.
***/
module.exports = function(projectLink, moduleId){
  console.log(moduleId);
  console.log(projectLink._module.propertyLookup("image"));
  var n = projectLink._module.propertyLookup("items").value;
  console.log("items: " + n);
  for(var i = 0; i < n; i++){
    projectLink._module.createChild("content", {"module": "text"}).propertySet("content", "item: " + i);
  }
  this.test = function(){
    return moduleId;
  };

  return this;
};
