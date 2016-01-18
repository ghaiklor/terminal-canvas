"use strict";

const Cursor = require('../lib/Cursor').default;
const cursor = new Cursor();

cursor.write('HELLO').flush();
