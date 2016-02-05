"use strict";

const Cursor = require('../lib/Cursor');
const cursor = new Cursor().resetTTY();

for (let y = 1; y < process.stdout.rows; y++) {
  for (let x = 1; x < process.stdout.columns; x++) {
    cursor.moveTo(x, y).write('E');
  }
}

cursor.moveTo(process.stdout.columns / 2, process.stdout.rows / 2).flush();

setTimeout(() => cursor.eraseToStart().flush(), 1000);
setTimeout(() => cursor.eraseToEnd().flush(), 2000);
setTimeout(() => cursor.eraseToUp().flush(), 3000);
setTimeout(() => cursor.eraseToDown().flush(), 4000);
setTimeout(() => cursor.eraseScreen().flush(), 5000);
