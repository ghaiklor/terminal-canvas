var Cursor = require('../lib/Cursor').Cursor;
var cursor = new Cursor().resetTTY();
var colors = [cursor.COLORS.RED, cursor.COLORS.CYAN_1, cursor.COLORS.YELLOW, cursor.COLORS.GREEN, cursor.COLORS.BLUE];
var text = 'Always after me lucky charms.';
var offset = 0;

setInterval(function () {
  var y = 0, dy = 1;

  for (var i = 0; i < 40; i++) {
    var color = colors[(i + offset) % colors.length];
    var c = text[(i + offset) % text.length];

    cursor
      .moveBy(1, dy)
      .foreground(color)
      .write(c);

    y += dy;

    if (y <= 0 || y >= 5) dy *= -1;
  }

  cursor.moveTo(0, 1).flush();
  offset++;
}, 150);
