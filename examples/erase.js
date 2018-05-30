const Canvas = require('../src/Canvas');
const canvas = Canvas.create().reset().hideCursor();

for (let y = 0; y < process.stdout.rows; y++) canvas.moveTo(0, y).write('E'.repeat(process.stdout.columns));

canvas.moveTo(process.stdout.columns / 2, process.stdout.rows / 2).flush();

setTimeout(() => canvas.eraseToStart().flush(), 1000);
setTimeout(() => canvas.eraseToEnd().flush(), 2000);
setTimeout(() => canvas.eraseToUp().flush(), 3000);
setTimeout(() => canvas.eraseToDown().flush(), 4000);
setTimeout(() => canvas.eraseScreen().flush().showCursor(), 5000);
