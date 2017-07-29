/***
* This function gets called after the project tree is built.
* The module_id variable contains the current unique id of this module instance,
* it can be used to communicate with other modules in the tree using the getModuleById(module_id) function.
*
* HTML component module:
* requires global properties:
* __global__stylesheet
* __global__script
***/
module.exports = function(projectLink, moduleId){
  this.onCommunicate = function() {
    var stylesheetModule = this.link.getProperty("__global__stylesheet");
    var cssContent = this.link.getProperty("css");

    if(stylesheetModule != null && cssContent != null) {      
      var cssOutputContent = this.link.render(cssContent);
      this.link.getModule(stylesheetModule).addCSS(cssOutputContent);
    }

    var scriptModule = this.link.getProperty("__global__script");
    var scriptContent = this.link.getProperty("js");

    if(scriptModule != null && scriptContent != null){
      var scriptOutputContent = this.link.render(scriptContent);
      this.link.getModule(scriptModule).addJS(scriptOutputContent);
    }
  };

  return this;
};
