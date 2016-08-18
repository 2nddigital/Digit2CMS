var Module = require('./module.js');

function ProjectLink(project, currentModule){
  this._project = project;
  this._module = currentModule;
}

ProjectLink.prototype.extend({
  getModule: function(path){
    var subTree = this._project.getSubtreeByPath(path);
    return (subTree instanceof Module) ? subTree.moduleEventInstance : null;
  },
  getRawProperty: function(propertyName){
    return this._module.propertyLookup(propertyName);
  },
  getProperty: function(propertyName){
    var p = this.getRawProperty(propertyName);
    return (p !== null) ? p.value : null;
  },
  getPropertyDefault: function(propertyName, defaultValue){
    var p = this.getRawProperty(propertyName);
    return (p !== null) ? p.value : defaultValue;
  },
  setProperty: function(propertyName, propertyValue){
    return this._module.propertySet(propertyName, propertyValue);
  },
  createModule: function(container, moduleConfig){
    var newModule = this._module.createChild(container, moduleConfig);
    var id = newModule.getPathToRoot();
    newModule.initialize(id, new ProjectLink(this._project, newModule));
    return newModule.moduleEventInstance;
  }
});

module.exports = ProjectLink;
