/***
* This function gets called after the project tree is built.
* The module_id variable contains the current unique id of this module instance,
* it can be used to communicate with other modules in the tree using the getModuleById(module_id) function.
*
* HTML module:
* requires global properties:
***/
module.exports = function(projectLink, moduleId){
  this.onPreRender = function(input) {
    return "<!-- BEGIN HTML MODULE - ID:{__id__} - MODULE:{__module__} -->\n" + input + "\n<!-- END HTML MODULE -->\n";
  };

  return this;
};
