import { Canvas } from '..';
import { NAMED_COLORS } from '../src/color/NamedColors';

const canvas = Canvas.create().reset();
const COLORS = Array.from(NAMED_COLORS.keys());

for (let y = 0; y < process.stdout.rows; y += 1) {
  for (let x = 0; x < process.stdout.columns; x += 1) {
    canvas.moveTo(x, y).background(COLORS[(y + x) % (COLORS.length - 1)]).write(' ');
  }
}

canvas.flush();
