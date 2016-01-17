var Cursor = require('../lib/Cursor').default;
var cursor = new Cursor(process.stdout, 4, 4).resetTTY();

// It will print only 4567 because you have negative X coordinate and cropped viewport
cursor.moveTo(-2, 1).write('1234567890').flush();
