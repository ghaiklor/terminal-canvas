"use strict";

const Cursor = require('../lib/Cursor');
const cursor = new Cursor();

cursor.write('HELLO').flush();
