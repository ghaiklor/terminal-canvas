var Cursor = require('../lib/Cursor').Cursor;
var cursor = new Cursor().resetTTY();

cursor
  .write('HELLO '.repeat(300))
  .moveTo(20, 5)
  .flush();

setTimeout(() => {
  cursor.eraseToStart().flush();
}, 1000);

setTimeout(() => {
  cursor.eraseToEnd().flush();
}, 2000);

setTimeout(() => {
  cursor.eraseToUp().flush();
}, 3000);

setTimeout(() => {
  cursor.eraseToDown().flush();
}, 4000);

setTimeout(() => {
  cursor.eraseScreen().flush();
}, 5000);
