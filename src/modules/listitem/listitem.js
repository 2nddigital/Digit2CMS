var Module = require('../../core/module.js');
/***
* This function gets called after the project tree is built.
* The module_id variable contains the current unique id of this module instance,
* it can be used to communicate with other modules in the tree using the getModuleById(module_id) function.
***/
module.exports = function(projectLink, moduleId){
  this.initialize = function(){
    for(var i = 0; i < this.link.getProperty("items"); i++){
      this.link.createModule("content", {"module": "text"}).propertySet("content", "item: " + i);
    }
  };

  return this;
};
