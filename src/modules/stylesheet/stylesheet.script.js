/***
* This function gets called after the project tree is built.
* The module_id variable contains the current unique id of this module instance,
* it can be used to communicate with other modules in the tree using the getModuleById(module_id) function.
***/
module.exports = function(projectLink, moduleId){
  this.onPreRender = function(input){
    var srcRw = this.link.getProperty("src");
    if(srcRw !== null && srcRw.length > 0){
      this.link.setProperty("rw-src", "src=\"" + srcRw + "\"");
    }
    return input;
  };

  this.addCSS = function(cssContent) {
    var txtCssModule = this.link.createModule("content", {"module": "text"}).link;
    txtCssModule.setProperty("content", cssContent);
  };

  return this;
};
