var Cursor = require('../lib/Cursor').Cursor;
var cursor = new Cursor().resetTTY();

// It will print only 7890 because you have negative X coordinate
cursor.moveTo(-5, 5).write('1234567890').flush();
