"use strict";

const Cursor = require('../lib/Cursor');
const cursor = new Cursor().resetTTY();

cursor.write('HELLO').flush();
