require("../src/core/proto.js");
var core = require("../src/core/core.js");
var _path = require("path");
var fs = require("fs");
var zlib = require("zlib");

process.argv.shift();
process.argv.shift();

var cmd = process.argv.shift();

var projectpath = require.resolve(_path.resolve(process.argv.shift()));
var project = new core.Project(require(projectpath));

if(project == null) throw "invalid project";

project.initializeTree();
project.initializeModules();

if(cmd == "addchild" || cmd == "removechild"){
    var modulePath = process.argv.shift();
    var subtree = project.getSubtreeByPath(modulePath);

    if(cmd == "addchild"){
        var container = process.argv.shift();
        var module = process.argv.shift();

        var moduleProperties = {
            module: module
        };

        subtree.createChild(container, moduleProperties);
    }

    if(cmd == "removechild"){

    }
}

if(cmd == "update"){

}

var exportProjectData = JSON.stringify(project.export(), null, 2);

if(cmd == "compress"){
    zlib.deflate(exportProjectData, (err, buffer) => {
        if(!err){
            fs.writeFile(projectpath + ".min", buffer);
        } else {
            console.log("there was an error compressing");
        }
    });
}

if(exportProjectData != null && exportProjectData.length > 0){
    fs.writeFile(projectpath, exportProjectData);
}



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
