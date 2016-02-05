"use strict";

const Cursor = require('../lib/Cursor');
const cursor = new Cursor().resetTTY();

// It will print only 4567890 because you have negative X coordinate
cursor.moveTo(-2, 1).write('1234567890').flush();
