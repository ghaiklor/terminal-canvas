import { Canvas } from '..';

const canvas = Canvas.create().reset();
const colors = ['red', 'cyan', 'yellow', 'green', 'blue'];
const text = 'Always after me lucky charms.';

let offset = 0;

setInterval(() => {
  let y = 0;
  let dy = 1;

  for (let i = 0; i < 40; i += 1) {
    const color = colors[(i + offset) % colors.length];
    const char = text[(i + offset) % text.length];

    canvas.moveBy(1, dy).foreground(color).write(char);

    y += dy;

    if (y <= 0 || y >= 5) dy *= -1;
  }

  canvas.moveTo(0, 0).flush();
  offset += 1;
}, 150);
