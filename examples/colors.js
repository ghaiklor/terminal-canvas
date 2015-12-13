var Cursor = require('../lib/Cursor').Cursor;
var COLORS = require('../lib/Cursor').COLORS;
var cursor = new Cursor().resetTTY();

// Background colors
cursor.write('BACKGROUND:\n').resetCursor();
Object.keys(COLORS).forEach(key => {
  cursor
    .background(COLORS[key])
    .write(`${key}`)
    .resetCursor()
    .write('  ');
});
cursor.resetCursor().write('\n').flush();

// Foreground colors
cursor.write('FOREGROUND:\n');
Object.keys(cursor.COLORS).forEach(key => {
  cursor
    .foreground(cursor.COLORS[key])
    .write(`${key}`)
    .resetCursor()
    .write('  ');
});
cursor.resetCursor().write('\n').flush();
