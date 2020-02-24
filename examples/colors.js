const canvas = require('..').create().reset();
const COLORS = require('../dist/color/NamedColors');

for (let y = 0; y < process.stdout.rows; y++) {
  for (let x = 0; x < process.stdout.columns; x++) {
    canvas.moveTo(x, y).background(COLORS[(y + x) % (COLORS.length - 1)]).write(' ');
  }
}

canvas.flush();
