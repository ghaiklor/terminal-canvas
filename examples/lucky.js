"use strict";

const Cursor = require('../lib/Cursor');
const cursor = new Cursor().resetTTY();
const colors = ['RED', 'CYAN_1', 'YELLOW', 'GREEN', 'BLUE'];
const text = 'Always after me lucky charms.';

let offset = 0;

setInterval(() => {
  let y = 0, dy = 1;

  for (let i = 0; i < 40; i++) {
    const color = colors[(i + offset) % colors.length];
    const c = text[(i + offset) % text.length];

    cursor.moveBy(1, dy).foreground(color).write(c);

    y += dy;

    if (y <= 0 || y >= 5) dy *= -1;
  }

  cursor.moveTo(0, 1).flush();
  offset++;
}, 150);
