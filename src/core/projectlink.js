var Module = require('./module.js');

function ProjectLink(project, currentModule){
  this._project = project;
  this._module = currentModule;
}

ProjectLink.prototype.extend({
  getModule: function(path){
    var subTree = project.getSubtreeByPath(path);
    return (subTree instanceof Module) ? subTree : null;
  },
  createModule: function(moduleConfig){
    
  }
});

module.exports = ProjectLink;
