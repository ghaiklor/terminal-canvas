var Cursor = require('../lib/Cursor').Cursor;
var cursor = new Cursor().resetTTY().flush();
var radius = 10;
var theta = 0;
var points = [];
var colors = ['RED', 'YELLOW', 'GREEN', 'DARK_CYAN', 'BLUE', 'MAGENTA'];

setInterval(function () {
  var x = 2 + (radius + Math.cos(theta) * radius) * 2;
  var y = 2 + radius + Math.sin(theta) * radius;

  points.unshift([x, y]);
  points.forEach(function (p, i) {
    cursor.moveTo(p[0], p[1]);
    cursor.background(colors[Math.floor(i / 12)]).write(' ').flush();
  });

  points = points.slice(0, 12 * colors.length - 1);

  theta += Math.PI / 40;
}, 50);
