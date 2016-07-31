require("./core/proto.js");
var core = require("./core/core.js");
var _path = require("path");

process.argv.forEach(function(val, index){
  if(index > 1){
    var projectDataPath = _path.resolve(process.cwd(), val);
    var projectData = require(projectDataPath);
    var project = new core.Project(projectData);
    project.initializeTree();
    project.initializeModules();
    console.log(project.getSubtreeByPath("0"));
    console.log("-------------EXPORT:----------------");
    console.log(JSON.stringify(project.export(), null, 2));
    console.log("-------------RENDER:----------------");
    console.log(project.render());
    console.log("-------------STATS:-----------------");
    project.walkSubtree(function(module, id){
      console.log(id + ": " + module.name);
    });
    console.log("------------------------------------");
  }
});
