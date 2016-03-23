"use strict";

const Canvas = require('../lib/Canvas');
const canvas = Canvas.create().reset();

canvas.write('HELLO').flush();
