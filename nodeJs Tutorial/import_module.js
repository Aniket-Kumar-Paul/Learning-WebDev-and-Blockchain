console.log("This file will import the module");
const mod = require('./module_to_be_exported');
console.log(mod.avg([3,4,5]));
console.log(mod.name);
console.log(mod.age);