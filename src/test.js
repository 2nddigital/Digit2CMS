require("./core/proto.js");
var core = require("./core/core.js");

var projectObject = {
  "0": {
    "module": "root",
    "properties": [],
    "child_containers": ["content"],
    "children": {
      "content": ["0-content-0", "0-content-1"]
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
  }
};

var mainProject = new core.Project(projectObject);
mainProject.initialize();
