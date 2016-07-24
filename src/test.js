var mod = require("./core/module.js");

var modInstance = new mod(
  {
    "containers": [{"id":"demo1"}]
  }
);


var modInstance2 = new mod({
  "containers": [{"id":"demo2"}]
});

var modInstance3 = new mod({
  "containers": [{"id":"demo3"}]
});


modInstance.addChild("demo1", modInstance2);
modInstance.addChild("demo1", modInstance3);
modInstance2.addChild("demo2", modInstance3);


console.log(modInstance.getContainer("demo1").containerProperties.id);

console.log(modInstance2.getContainer("demo2").containerProperties.id);
