"use strict";

const canvas = require('../lib/Canvas').create().reset();
const COLORS = Object.keys(require('../lib/util/colors').COLORS);

for (var y = 0; y < process.stdout.rows; y++) {
  for (var x = 0; x < process.stdout.columns; x++) {
    canvas.moveTo(x, y).background(COLORS[(y + x) % (COLORS.length - 1)]).write(' ');
  }
}

canvas.flush();
