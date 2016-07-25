var core = require("./core/core.js");

var modInstance = new core.Module(
  {
    "containers": [{"id":"demo1"}]
  }
);


var modInstance2 = new core.Module({
  "containers": [{"id":"demo2"}]
});

var modInstance3 = new core.Module({
  "containers": [{"id":"demo3"}]
});


modInstance.addChild("demo1", modInstance2);
modInstance.addChild("demo1", modInstance3);
modInstance2.addChild("demo2", modInstance3);


console.log(modInstance.getContainer("demo1") instanceof core.Container);

console.log(modInstance2.getContainer("demo2") instanceof core.Container);
