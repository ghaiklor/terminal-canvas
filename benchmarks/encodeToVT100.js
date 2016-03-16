"use strict";

const Benchmark = require('benchmark');
const suite = new Benchmark.Suite();

suite
  .add('Buffer#concat', function () {
    return new Buffer([0x1b].concat('test'.split('').map(char => char.charCodeAt(0))));
  })
  .add('String#interpolation', function () {
    return `\u001b${1 + 2}`;
  })
  .add('String#concatenation', function () {
    return '\u001b' + (1 + 2);
  })
  .on('complete', function () {
    console.log(`Fastest is ${this.filter('fastest').map('name')}`);
  })
  .run({async: true});
