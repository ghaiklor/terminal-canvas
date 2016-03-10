"use strict";

const Cursor = require('../lib/Cursor');
const cursor = Cursor.create({width: 5}).reset();

// It will print only 4567 because you have negative X coordinate and width equal to 5
cursor.moveTo(-2, 1).write('1234567890').flush();
