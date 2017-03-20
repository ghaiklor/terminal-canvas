const Canvas = require('../src/Canvas');
const canvas = Canvas.create().reset();

canvas.write('HELLO').flush();
