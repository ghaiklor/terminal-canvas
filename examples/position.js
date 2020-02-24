const Canvas = require('..');
const canvas = Canvas.create().reset();

canvas
  .moveTo(15, 5)
  .write('moveTo')
  .moveBy(15, 5)
  .write('moveBy')
  .down(5)
  .write('down')
  .up(10)
  .write('up')
  .left(20)
  .write('left')
  .right(40)
  .write('right')
  .down(10)
  .flush();
