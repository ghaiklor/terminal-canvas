const Canvas = require('../src/Canvas');
const canvas = Canvas.create().reset();
const colors = ['red', 'cyan', 'yellow', 'green', 'blue'];
const text = 'Always after me lucky charms.';

let offset = 0;

setInterval(() => {
  var y = 0, dy = 1;

  for (var i = 0; i < 40; i++) {
    var color = colors[(i + offset) % colors.length];
    var c = text[(i + offset) % text.length];

    canvas.moveBy(1, dy).foreground(color).write(c);

    y += dy;

    if (y <= 0 || y >= 5) dy *= -1;
  }

  canvas.moveTo(0, 0).flush();
  offset++;
}, 150);
