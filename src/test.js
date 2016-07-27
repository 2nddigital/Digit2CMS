require("./core/proto.js");
var core = require("./core/core.js");
var _path = require("path");

var projectObject = {
  "0": {
    "module": "root",
    "properties": [
      {
        "name": "content",
        "value": "test"
      }
    ],
    "child_containers": ["content"],
    "children": {
      "content": ["0-content-0", "0-content-1", "0-content-2"]
    }
  },
  "0-content-0": {
    "module": "text",
    "properties": [],
    "child_containers": [],
    "children": {}
  },
  "0-content-1": {
    "module": "text",
    "properties": [],
    "child_containers": [],
    "children": {}
  },
  "0-content-2": {
    "module": "list",
    "child_containers": ["content"],
    "children": {
      "content": ["0-content-2-content-0", "0-content-2-content-1"]
    }
  },
  "0-content-2-content-0": {
    "module": "listitem",
    "properties": [
      {
        "name": "description",
        "value": "value 1"
      },
      {
        "name": "image",
        "value": "img.jpg"
      }
    ]
  },
  "0-content-2-content-1": {
    "module": "listitem",
    "properties": [
      {
        "name": "description",
        "value": "value 2"
      }
    ]
  }
};

process.argv.forEach(function(val, index){
  if(index > 1){
    var projectDataPath = _path.resolve(process.cwd(), val);
    var projectData = require(projectDataPath);
    var project = new core.Project(projectData);
    project.initialize();
    console.log("------------------------------------");
    console.log(project.getSubtreeByPath("0-content-2-content-1"));
    console.log("------------------------------------");
    console.log(JSON.stringify(project.export()));
    console.log("------------------------------------");
    console.log(project.render());
  }
});
