"use strict";

const Cursor = require('../lib/Cursor');
const cursor = new Cursor();

cursor
  .bold()
  .write('BOLD\n')
  .bold(false)
  .dim()
  .write('DIM\n')
  .dim(false)
  .underlined()
  .write('UNDERLINED\n')
  .underlined(false)
  .blink()
  .write('BLINK\n')
  .blink(false)
  .reverse()
  .write('REVERSE\n')
  .reverse(false)
  .hidden()
  .write('HIDDEN\n')
  .hidden(false)
  .flush();
