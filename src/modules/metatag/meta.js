/***
* This function gets called after the project tree is built.
* The module_id variable contains the current unique id of this module instance,
* it can be used to communicate with other modules in the tree using the getModuleById(module_id) function.
***/
module.exports = function(projectLink, moduleId){
  this.onPreRender = function(input){

    this.encapsulateProperty("name", "rw-name");
	this.encapsulateProperty("content", "rw-content");
	this.encapsulateProperty("charset", "rw-charset");
	this.encapsulateProperty("http-equiv", "rw-http-equiv");
	this.encapsulateProperty("property", "rw-property");

    return input;
  };

  this.encapsulateProperty = function(propertyIn, propertyOut, tagName){
	var propRw = this.link.getProperty(propertyIn);
    if(propRw !== null && propRw.length > 0){
      this.link.setProperty(propertyOut, tagName + "=\"" + propRw + "\"");
    }
  };

  return this;
};