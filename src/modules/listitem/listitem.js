var Module = require('../../core/module.js');
/***
* This function gets called after the project tree is built.
* The module_id variable contains the current unique id of this module instance,
* it can be used to communicate with other modules in the tree using the getModuleById(module_id) function.
***/
module.exports = function(projectLink, moduleId){
  this.initialize = function(){

  };

  this.onPreRender = function(input){

    for(var i = 0; i < this.link.getProperty("items"); i++){
      this.link.createModule("content", {"module": "text"}).link.setProperty("content", "item: " + i);
    }
    this.link.getModule("0-body-0-content-1").test();
    return input;
  };

  this.test = function(){
    console.log("it works! i am " + moduleId);
  };

  return this;
};
