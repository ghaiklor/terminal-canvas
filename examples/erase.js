"use strict";

const Cursor = require('../lib/Cursor');
const cursor = Cursor.create().reset().hideCursor();

for (var y = 0; y < process.stdout.rows; y++) cursor.moveTo(0, y).write('E'.repeat(process.stdout.columns));

cursor.moveTo(process.stdout.columns / 2, process.stdout.rows / 2).flush();

setTimeout(() => cursor.eraseToStart().flush(), 1000);
setTimeout(() => cursor.eraseToEnd().flush(), 2000);
setTimeout(() => cursor.eraseToUp().flush(), 3000);
setTimeout(() => cursor.eraseToDown().flush(), 4000);
setTimeout(() => cursor.eraseScreen().flush().showCursor(), 5000);
