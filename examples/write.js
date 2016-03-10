"use strict";

const Cursor = require('../lib/Cursor');
const cursor = Cursor.create().reset();

cursor.write('HELLO').flush();
