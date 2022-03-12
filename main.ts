const Maestro = require('./utils/maestro.ts');
const m = new Maestro([0,4,5,9,8]);

//console.log(m.transpose(12));
//console.log(m.findIntervals());
//console.log(m.findIntervals())
const rotations = m.rotateSetStrav();
console.log({ rotations })
