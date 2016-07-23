var mod = require("./core/module.js");

var modInstance = new mod(
  {
    "containers": ["demo"]
  }
);

var modInstance2 = new mod({});

modInstance.setChild("demo", modInstance2);

console.log(modInstance.getChild("demo"));
