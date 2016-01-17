var Cursor = require('../lib/Cursor').default;
var cursor = new Cursor().resetTTY();
var colors = ['RED', 'CYAN_1', 'YELLOW', 'GREEN', 'BLUE'];
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
