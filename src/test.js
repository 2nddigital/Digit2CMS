require("./core/proto.js");
var core = require("./core/core.js");

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
        "value": "haaai"
      }
    ]
  },
  "0-content-2-content-1": {
    "module": "listitem",
    "properties": [
      {
        "name": "description",
        "value": "booee"
      }
    ]
  }
};

var mainProject = new core.Project(projectObject);
mainProject.initialize();
console.log(mainProject.render());
