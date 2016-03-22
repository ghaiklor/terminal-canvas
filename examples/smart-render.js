"use strict";

const Cursor = require('../lib/Cursor');
const cursor = Cursor.create().reset();

let x = 0;
let y = 0;

setInterval(() => {
  cursor.moveTo(1, 0).background('white').foreground('black').write('This example shows how fast builds difference between two frames');
  cursor.moveTo(x, y).background('yellow').foreground('black').write('ABCDEFGHIJKLMNOP');
  cursor.moveTo(x * 2, y).background('yellow').foreground('black').write('ABCDEFGHIJKLMNOP');
  cursor.moveTo(x * 3, y).background('yellow').foreground('black').write('ABCDEFGHIJKLMNOP');

  cursor.flush();

  cursor.erase(x, y, x + 16, y);
  cursor.erase(x * 2, y, x * 2 + 16, y);
  cursor.erase(x * 3, y, x * 3 + 16, y);

  x = x > process.stdout.columns ? 0 : x + 1;
  y = y > process.stdout.rows ? 0 : y + 1;
}, 1);
