"use strict";

const Canvas = require('../lib/Canvas');
const canvas = Canvas.create().reset();

canvas
  .bold()
  .write('BOLD')
  .bold(false)
  .moveBy(-4, 1)
  .dim()
  .write('DIM')
  .dim(false)
  .moveBy(-3, 1)
  .underlined()
  .write('UNDERLINED')
  .underlined(false)
  .moveBy(-10, 1)
  .blink()
  .write('BLINK')
  .blink(false)
  .moveBy(-5, 1)
  .reverse()
  .write('REVERSE')
  .reverse(false)
  .moveBy(-7, 1)
  .hidden()
  .write('HIDDEN')
  .hidden(false)
  .flush();
