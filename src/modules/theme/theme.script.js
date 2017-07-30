/***
* This function gets called after the project tree is built.
* The module_id variable contains the current unique id of this module instance,
* it can be used to communicate with other modules in the tree using the getModuleById(module_id) function.
***/
module.exports = function(module_id){
  this.onCommunicate = function() {
    console.log(this.link.getProperty("css_files"));
  };

  return this;
};
