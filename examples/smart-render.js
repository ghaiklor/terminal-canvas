"use strict";

const Cursor = require('../lib/Cursor');
const cursor = new Cursor().resetTTY();

let x = 0;
let y = 0;

setInterval(() => {
  cursor.moveTo(x, y).background('yellow').foreground('black').write('ABCDEFGHIJKLMNOP');
  cursor.moveTo(x * 2, y).background('yellow').foreground('black').write('ABCDEFGHIJKLMNOP');
  cursor.moveTo(x * 3, y).background('yellow').foreground('black').write('ABCDEFGHIJKLMNOP');
  cursor.flush().eraseScreen();

  x = x > process.stdout.columns ? 0 : x + 1;
  y = y > process.stdout.rows ? 0 : y + 1;
}, 1);
