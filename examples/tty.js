var Cursor = require('../lib/Cursor').Cursor;
var cursor = new Cursor(process.stdout);

console.log(`${cursor.getTTYWidth()}x${cursor.getTTYHeight()}`);
