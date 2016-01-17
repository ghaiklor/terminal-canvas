var Cursor = require('../lib/Cursor').default;
var cursor = new Cursor();

cursor.write('HELLO').flush();
