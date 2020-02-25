const canvas = require('..').create().reset();
const COLORS = Array.from(require('../dist/color/NamedColors').NAMED_COLORS.keys());

for (let y = 0; y < process.stdout.rows; y++) {
  for (let x = 0; x < process.stdout.columns; x++) {
    canvas.moveTo(x, y).background(COLORS[(y + x) % (COLORS.length - 1)]).write(' ');
  }
}

canvas.flush();
