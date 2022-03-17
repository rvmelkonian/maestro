const Maestro = require('./utils/maestro.ts');
const m = new Maestro([0,10,7,1,11]);

//console.log(m.transpose(12));
//console.log(m.findIntervals());
//console.log(m.findIntervals())
const rotations = m.rotateSetStrav();
console.log(rotations)
