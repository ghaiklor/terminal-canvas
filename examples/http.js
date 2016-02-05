"use strict";

const http = require('http');
const url = require('url');
const Cursor = require('../lib/Cursor');
const radius = 10;

let theta = 0;
let points = [];

http.createServer((req, res) => {
  res.setHeader('content-type', 'text/plain; charset=us-ascii');

  const query = url.parse(req.url).query;
  const columns = query.match(/columns=(\d+)/)[1];
  const rows = query.match(/rows=(\d+)/)[1];
  const cursor = new Cursor(res, columns, rows).resetTTY();
  const colors = ['red', 'yellow', 'green', 'dark_cyan', 'blue', 'magenta'];

  setInterval(() => {
    const x = (columns / 2 - radius) + (radius + Math.cos(theta) * radius) * 2;
    const y = (rows / 2 - radius) + radius + Math.sin(theta) * radius;

    points.unshift([x, y]);
    points.forEach((p, i) => cursor.moveTo(p[0], p[1]).background(colors[Math.floor(i / 12)]).write(' ').flush());
    points = points.slice(0, 12 * colors.length - 1);

    theta += Math.PI / 40;
  }, 50);
}).listen(8081);
