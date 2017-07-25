require("../src/core/proto.js");
var core = require("../src/core/core.js");
var _path = require("path");
var fs = require("fs");
var zlib = require("zlib");

process.argv.shift();
process.argv.shift();

var projectpath = _path.resolve(process.argv.shift());
var outputpath = _path.join(_path.dirname(projectpath), _path.basename(projectpath, ".min"));

fs.readFile(projectpath, (err, data) => {
    if(!err){
        zlib.unzip(data, (err, buffer) => {
            if(!err){
                fs.writeFile(outputpath, buffer);
            } else {
                console.log("error unzipping");
            }
        });
    } else {
        console.log("error reading file");
    }
});



// process.argv.forEach(function(val, index){
//   if(index > 1){
//     var projectDataPath = _path.resolve(process.cwd(), val);
//     var projectData = require(projectDataPath);
//     var project = new core.Project(projectData);
//     project.initializeTree();
//     project.initializeModules();
//     console.log("-------------EXPORT:----------------");
//     var exportProjectData = JSON.stringify(project.export(), null, 2);
//     console.log(exportProjectData);
//     fs.writeFile(projectDataPath, exportProjectData);
//     console.log("-------------RENDER:----------------");
//     project.communicate();
//     console.log(project.render());
//     console.log("-------------STATS:-----------------");
//     project.walkSubtree(function(module, id){
//       console.log(id + ": " + module.name);
//     });
//     console.log("------------------------------------");
//   }
// });
