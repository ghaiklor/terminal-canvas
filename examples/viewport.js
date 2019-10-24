const Canvas = require('../src/Canvas');
const canvas = Canvas.create({ width: 5 }).reset();

// It will print only 34567 because you have negative X coordinate and width equal to 5
canvas.moveTo(-2, 1).write('1234567890').flush();
