"use strict";

const cursor = require('../lib/Cursor').create().resetTTY();
const COLORS = Object.keys(require('../lib/util/colors').COLORS);

for (let y = 0; y < process.stdout.rows; y++) {
  for (let x = 0; x < process.stdout.columns; x++) {
    cursor.moveTo(x, y).background(COLORS[(y + x) % (COLORS.length - 1)]).write(' ');
  }
}

cursor.flush();
