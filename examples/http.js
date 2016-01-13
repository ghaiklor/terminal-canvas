var http = require('http');
var Cursor = require('../lib/Cursor').Cursor;
var radius = 10;
var theta = 0;
var points = [];

http.createServer(function (req, res) {
  res.setHeader('content-type', 'text/plain; charset=us-ascii');

  var cursor = new Cursor(res).resetTTY();
  var colors = ['red', 'yellow', 'green', 'dark_cyan', 'blue', 'magenta'];

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
}).listen(8081);
