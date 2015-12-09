import { Transform } from 'stream';
import { COLORS } from './colors';
import { DISPLAY_MODES } from './displayModes';
import { ERASE_REGIONS } from './eraseRegions';

/**
 * Cursor implements low-level API to terminal control codes.
 *
 * @see http://www.termsys.demon.co.uk/vtansi.htm
 * @since 1.0.0
 * @version 1.0.0
 */
export class Cursor extends Transform {
  /**
   * By default, creates simple cursor that writes direct to `stdout`.
   *
   * If you want to work with other streams, you can pass custom `stdout` and `stdin` streams in.
   * It's useful when you want to chain few streams before pipe it into the cursor or want to modify what cursor pipes to `stdout`.
   *
   * @constructor
   * @param {Array<Stream.Transform>} [stdout=[process.stdout]] Array of Transform streams that will be used as target source for cursor
   * @param {Array<Stream.Transform>} [stdin=[]] Array of Transform streams that will be used as data source for cursor
   * @example
   * import { Cursor } from './Cursor';
   *
   * // Creates simple cursor that renders direct to `process.stdout`
   * let cursor = new Cursor();
   *
   * // Creates cursor that takes data from `stdin` and pipes to cursor.
   * // Afterwards to some Transform stream and `stdout`.
   * let cursor = new Cursor([new MyTransformStream(), process.stdout], [process.stdin]);
   */
  constructor(stdout = [process.stdout], stdin = []) {
    super();

    if (stdout.length > 0) stdout.reduce((cursor, pipe) => cursor.pipe(pipe), this);
    if (stdin.length > 0) stdin.reduce((cursor, pipe) => cursor.pipe(pipe)).pipe(this);
  }

  /**
   * Write to the stream.
   * It can be whatever info you want, but usually it's just a text that you want to print out.
   *
   * @param {Buffer|String} message Message to write to the stream
   * @returns {Cursor}
   */
  write(message) {
    this.emit('data', message);
    return this;
  }

  /**
   * Set the cursor position by absolute coordinates.
   *
   * @param {Number} x Coordinate X
   * @param {Number} y Coordinate Y
   * @returns {Cursor}
   */
  setPosition(x, y) {
    this.write(Cursor.encodeToVT100('[' + Math.floor(y) + ';' + Math.floor(x) + 'f'));
    return this;
  }

  /**
   * Move the cursor by the relative coordinates starting from the current position of cursor.
   *
   * @param {Number} x Coordinate X
   * @param {Number} y Coordinate Y
   * @returns {Cursor}
   */
  move(x, y) {
    if (y < 0) this.up(-y);
    if (y > 0) this.down(y);

    if (x < 0) this.left(-x);
    if (x > 0) this.right(x);

    return this;
  }

  /**
   * Move the cursor up.
   *
   * @param {Number} [y=1] Rows count
   * @returns {Cursor}
   */
  up(y = 1) {
    this.write(Cursor.encodeToVT100('[' + Math.floor(y) + 'A'));
    return this;
  }

  /**
   * Move the cursor down.
   *
   * @param {Number} [y=1] Rows count
   * @returns {Cursor}
   */
  down(y = 1) {
    this.write(Cursor.encodeToVT100('[' + Math.floor(y) + 'B'));
    return this;
  }

  /**
   * Move the cursor right.
   *
   * @param {Number} [x=1] Columns count
   * @returns {Cursor}
   */
  right(x = 1) {
    this.write(Cursor.encodeToVT100('[' + Math.floor(x) + 'C'));
    return this;
  }

  /**
   * Move the cursor left.
   *
   * @param {Number} [x=1] Columns count
   * @returns {Cursor}
   */
  left(x = 1) {
    this.write(Cursor.encodeToVT100('[' + Math.floor(x) + 'D'));
    return this;
  }

  column(x) {
    this.write(Cursor.encodeToVT100('[' + Math.floor(x) + 'G'));
    return this;
  }

  push(withAttributes) {
    this.write(Cursor.encodeToVT100(withAttributes ? '7' : '[s'));
    return this;
  }

  pop(withAttributes) {
    this.write(Cursor.encodeToVT100(withAttributes ? '8' : '[u'));
    return this;
  }

  /**
   * Erase a defined region.
   *
   * @param {String} region Value from {@link ERASE_REGIONS}
   * @returns {Cursor}
   * @example
   * import { Cursor, ERASE_REGIONS } from './src/Cursor';
   *
   * let cursor = new Cursor();
   * cursor.erase(ERASE_REGIONS.CURRENT_LINE); // Erases current line
   */
  erase(region) {
    if (region === ERASE_REGIONS.FROM_CURSOR_TO_END) return this.write(Cursor.encodeToVT100('[K'));
    if (region === ERASE_REGIONS.FROM_CURSOR_TO_START) return this.write(Cursor.encodeToVT100('[1K'));
    if (region === ERASE_REGIONS.FROM_CURSOR_TO_DOWN) return this.write(Cursor.encodeToVT100('[J'));
    if (region === ERASE_REGIONS.FROM_CURSOR_TO_UP) return this.write(Cursor.encodeToVT100('[1J'));
    if (region === ERASE_REGIONS.CURRENT_LINE) return this.write(Cursor.encodeToVT100('[2K'));
    if (region === ERASE_REGIONS.ENTIRE_SCREEN) return this.write(Cursor.encodeToVT100('[1J'));

    this.emit('error', new Error(`Unknown erase type: ${region}`));
    return this;
  }

  delete(s, n = 1) {
    if (s === 'line') {
      this.write(Cursor.encodeToVT100('[' + n + 'M'));
    } else if (s === 'char') {
      this.write(Cursor.encodeToVT100('[' + n + 'M'));
    } else {
      this.emit('error', new Error('Unknown delete type: ' + s));
    }

    return this;
  }

  insert(mode, n = 1) {
    if (mode === true) {
      this.write(Cursor.encodeToVT100('[4h'));
    } else if (mode === false) {
      this.write(Cursor.encodeToVT100('[l'));
    } else if (mode === 'line') {
      this.write(Cursor.encodeToVT100('[' + n + 'L'));
    } else if (mode === 'char') {
      this.write(Cursor.encodeToVT100('[' + n + '@'));
    } else {
      this.emit('error', new Error('Unknown delete type: ' + s));
    }

    return this;
  }

  display(c) {
    this.write(Cursor.encodeToVT100('[' + c + 'm'));
    return this;
  }

  /**
   * Set the foreground color.
   * This color is used when text is rendering.
   *
   * @param {String} color Value from {@link COLORS}
   * @returns {Cursor}
   * @example
   * import { Cursor, COLORS } from './src/Cursor';
   *
   * let cursor = new Cursor();
   * cursor.foreground(COLORS.BLACK);
   */
  foreground(color) {
    this.write(Cursor.encodeToVT100('[38;5;' + color + 'm'));
    return this;
  }

  /**
   * Set the background color.
   * This color is used for filling the whole cell in the TTY.
   *
   * @param {String} color Value from {@link COLORS}
   * @returns {Cursor}
   * @example
   * import { Cursor, COLORS } from './src/Cursor';
   *
   * let cursor = new Cursor();
   * cursor.background(COLORS.YELLOW);
   */
  background(color) {
    this.write(Cursor.encodeToVT100('[48;5;' + color + 'm'));
    return this;
  }

  /**
   * Set the cursor invisible.
   *
   * @returns {Cursor}
   */
  hide() {
    this.write(Cursor.encodeToVT100('[?25l'));
    return this;
  }

  /**
   * Set the cursor visible.
   *
   * @returns {Cursor}
   */
  show() {
    this.write(Cursor.encodeToVT100('[?25h'));
    return this;
  }

  /**
   * Fill the specified region with symbol.
   * By default this symbol is whitespace but you can change it and fill with another symbol.
   *
   * @param {Object} options
   * @param {Number} options.x1 Start coordinate X
   * @param {Number} options.y1 Start coordinate Y
   * @param {Number} options.x2 End coordinate X
   * @param {Number} options.y2 End coordinate Y
   * @param {String} [options.symbol] Symbol that will be used for filling the region
   * @param {String} [options.background] Background color from {@link COLORS}
   * @param {String} [options.foreground] Foreground color from {@link COLORS}
   * @returns {Cursor}
   * @example
   * let cursor = new Cursor();
   *
   * // Renders the rectangle at top of TTY
   * cursor.fill({x1: 0, y1: 0, x2: Cursor.getTTYWidth(), y2: 4, background: COLORS.YELLOW});
   */
  fill(options) {
    let {x1, y1, x2, y2, symbol = ' ', background, foreground} = options;
    let filler = symbol.repeat(x2 - x1 + 1);

    if (background) this.background(background);
    if (foreground) this.foreground(foreground);

    this.setPosition(x1, y1);

    while (y1 <= y2) {
      this.write(filler);
      this.setPosition(x1, ++y1);
    }

    return this;
  }

  /**
   * Resets the entire screen.
   * It's not the same as {@link Cursor.erase}.
   * reset() resets the TTY settings to default.
   *
   * @returns {Cursor}
   */
  reset() {
    this.write(Cursor.encodeToVT100('[0m'));
    this.write(Cursor.encodeToVT100('[2J'));
    this.write(Cursor.encodeToVT100('c'));
    return this;
  }

  /**
   * Destroy the cursor.
   *
   * @returns {Cursor}
   */
  destroy() {
    this.emit('end');
    return this;
  }

  /**
   * Bytes to encode to VT100 standard.
   *
   * @static
   * @param {String} string
   * @returns {Buffer} Returns encoded bytes
   */
  static encodeToVT100(string) {
    return new Buffer([0x1b].concat(string.split('').map(item => item.charCodeAt(0))));
  }

  /**
   * Get TTY sizes.
   *
   * @static
   * @returns {{width: Number, height: Number}}
   */
  static getTTYSize() {
    if (process.stdout.getWindowSize) {
      return {width: process.stdout.getWindowSize()[0], height: process.stdout.getWindowSize()[1]};
    } else if (process.stdout.columns && process.stdout.rows) {
      return {width: process.stdout.columns, height: process.stdout.rows};
    } else {
      throw new Error('Failed to determine TTY size');
    }
  }

  /**
   * Get width of TTY.
   *
   * @static
   * @returns {Number}
   */
  static getTTYWidth() {
    return Cursor.getTTYSize().width;
  }

  /**
   * Get height of TTY.
   *
   * @static
   * @returns {Number}
   */
  static getTTYHeight() {
    return Cursor.getTTYSize().height;
  }

  /**
   * Wrapper around `new Cursor()`.
   *
   * @static
   * @returns {Cursor}
   */
  static create(...args) {
    return new this(...args);
  }
}
