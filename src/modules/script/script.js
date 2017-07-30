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

  this.addJS = function(src){
    var txtJsModule = this.link.createModule("script", {"module": "text"}).link;
    txtJsModule.setProperty("content", src);
  };

  this.scriptDecorator = function(input){
    return input + "\n";
  };

  return this;
};
