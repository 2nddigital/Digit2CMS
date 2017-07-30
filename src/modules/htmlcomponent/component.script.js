/***
* This function gets called after the project tree is built.
* The module_id variable contains the current unique id of this module instance,
* it can be used to communicate with other modules in the tree using the getModuleById(module_id) function.
*
* HTML component module:
* requires global properties:
* __global__stylesheet
* __global__script
* __global__document
***/
module.exports = function(projectLink, moduleId){
  this.onCommunicate = function() {
    var cssContent = this.link.getPropertyDefault("css");
    this.addCSS(cssContent);

    var scriptContent = this.link.getPropertyDefault("js");
    this.addJS(scriptContent);
  };

  this.addCSS = function(content) {
    var stylesheetModule = this.link.getProperty("__global__stylesheet");

    this.addCSSToModule(this.link.getModule(stylesheetModule), content);
  };

  this.addJS = function(content) {
    var scriptModule = this.link.getProperty("__global__script");

    this.addJSToModule(this.link.getModule(scriptModule), content);
  };

  this.addJSFile = function(file){
    var documentModule = this.link.getModule(this.link.getProperty("__global__document"));

    if(documentModule != null && typeof documentModule.addJSFile === "function"){
      documentModule.addJSFile(file);
    }
  };

  this.addCSSFile = function(file){
    var documentModule = this.link.getModule(this.link.getProperty("__global__document"));

    if(documentModule != null && typeof documentModule.addJSFile === "function"){
      documentModule.addCSSFile(file);
    }
  };

  this.addCSSToModule = function(m, cssContent) {
    if(m != null && cssContent != null && typeof m.addCSS === "function") {
      var cssOutputContent = this.link.render(cssContent);
      m.addCSS(cssOutputContent);
    }
  };

  this.addJSToModule = function(m, scriptContent) {
    if(m != null && scriptContent != null && typeof m.addJS === "function") {
      var scriptOutputContent = this.link.render(scriptContent);
      m.addJS(scriptOutputContent);
    }
  };

  return this;
};
