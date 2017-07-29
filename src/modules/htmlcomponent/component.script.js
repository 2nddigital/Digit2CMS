/***
* This function gets called after the project tree is built.
* The module_id variable contains the current unique id of this module instance,
* it can be used to communicate with other modules in the tree using the getModuleById(module_id) function.
*
* HTML component module:
* requires global properties:
* __global__stylesheet
***/
module.exports = function(projectLink, moduleId){
  this.onCommunicate = function() {
    console.log("onCommunicate called");

    var stylesheetModule = this.link.getProperty("__global__stylesheet");

    if(stylesheetModule != null) {
      var cssContent = this.link.getProperty("css");
      var cssOutputContent = this.link.render(cssContent);
      this.link.getModule(stylesheetModule).addCSS(cssOutputContent);
    }
  };

  return this;
};
