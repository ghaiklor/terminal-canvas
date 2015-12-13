var Cursor = require('../lib/Cursor').Cursor;
var cursor = new Cursor().resetTTY();

cursor
  .moveTo(15, 5)
  .write('15, 5')
  .moveBy(15, 5)
  .write('30, 10')
  .down(5)
  .write('30, 15')
  .up(10)
  .write('30, 5')
  .right(15)
  .write('45, 5')
  .left(10)
  .write('40, 5')
  .flush();
