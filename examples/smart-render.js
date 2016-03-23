"use strict";

const Canvas = require('../lib/Canvas');
const canvas = Canvas.create().reset();

let x = 0;
let y = 0;

setInterval(() => {
  canvas.moveTo(1, 0).background('white').foreground('black').write('This example shows how fast builds difference between two frames');
  canvas.moveTo(x, y).background('yellow').foreground('black').write('ABCDEFGHIJKLMNOP');
  canvas.moveTo(x * 2, y).background('yellow').foreground('black').write('ABCDEFGHIJKLMNOP');
  canvas.moveTo(x * 3, y).background('yellow').foreground('black').write('ABCDEFGHIJKLMNOP');

  canvas.flush();

  canvas.erase(x, y, x + 16, y);
  canvas.erase(x * 2, y, x * 2 + 16, y);
  canvas.erase(x * 3, y, x * 3 + 16, y);

  x = x > process.stdout.columns ? 0 : x + 1;
  y = y > process.stdout.rows ? 0 : y + 1;
}, 1);
