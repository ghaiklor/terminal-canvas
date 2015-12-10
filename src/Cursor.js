import { Transform } from 'stream';
import { COLORS } from './colors';
import { DISPLAY_MODES } from './displayModes';
import { ERASE_REGIONS } from './eraseRegions';

export * from './colors';
export * from './displayModes';
export * from './eraseRegions';

/**
 * Cursor implements low-level API to terminal control codes.
 *
 * @see http://www.termsys.demon.co.uk/vtansi.htm
 * @see http://misc.flogisoft.com/bash/tip_colors_and_formatting
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
   * It can be whatever you want, but usually it's just a text that you want to print out.
   *
   * @param {Buffer|String} data Data to write to the stream
   * @returns {Cursor}
   */
  write(data) {
    this.emit('data', data);
    return this;
  }

  /**
   * Set the cursor position by absolute coordinates.
   *
   * @param {Number} x Coordinate X
   * @param {Number} y Coordinate Y
   * @returns {Cursor}
   */
  position(x, y) {
    this.write(Cursor.encodeToVT100(`[${Math.floor(y)};${Math.floor(x)}f`));
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
    this.write(Cursor.encodeToVT100(`[${Math.floor(y)}A`));
    return this;
  }

  /**
   * Move the cursor down.
   *
   * @param {Number} [y=1] Rows count
   * @returns {Cursor}
   */
  down(y = 1) {
    this.write(Cursor.encodeToVT100(`[${Math.floor(y)}B`));
    return this;
  }

  /**
   * Move the cursor right.
   *
   * @param {Number} [x=1] Columns count
   * @returns {Cursor}
   */
  right(x = 1) {
    this.write(Cursor.encodeToVT100(`[${Math.floor(x)}C`));
    return this;
  }

  /**
   * Move the cursor left.
   *
   * @param {Number} [x=1] Columns count
   * @returns {Cursor}
   */
  left(x = 1) {
    this.write(Cursor.encodeToVT100(`[${Math.floor(x)}D`));
    return this;
  }

  /**
   * Save current cursor position.
   *
   * @param withAttributes
   * @returns {Cursor}
   */
  save(withAttributes = true) {
    this.write(Cursor.encodeToVT100(withAttributes ? '7' : '[s'));
    return this;
  }

  /**
   * Restore cursor position after a save().
   *
   * @param withAttributes
   * @returns {Cursor}
   */
  restore(withAttributes = true) {
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
    this.write(Cursor.encodeToVT100(region));
    return this;
  }

  display(c) {
    this.write(Cursor.encodeToVT100(`[${c}m`));
    return this;
  }

  bold(isBold) {
    this.display(isBold ? DISPLAY_MODES.BOLD : DISPLAY_MODES.RESET_BOLD);
    return this;
  }

  dim(isDim) {
    this.display(isDim ? DISPLAY_MODES.DIM : DISPLAY_MODES.RESET_DIM);
    return this;
  }

  underlined(isUnderlined) {
    this.display(isUnderlined ? DISPLAY_MODES.UNDERLINED : DISPLAY_MODES.RESET_UNDERLINED);
    return this;
  }

  blink(isBlink) {
    this.display(isBlink ? DISPLAY_MODES.BLINK : DISPLAY_MODES.RESET_BLINK);
    return this;
  }

  reverse(isReverse) {
    this.display(isReverse ? DISPLAY_MODES.REVERSE : DISPLAY_MODES.RESET_REVERSE);
    return this;
  }

  hidden(isHidden) {
    this.display(isHidden ? DISPLAY_MODES.HIDDEN : DISPLAY_MODES.RESET_HIDDEN);
    return this;
  }

  resetAllAttributes() {
    this.display(DISPLAY_MODES.RESET_ALL);
    return this;
  }

  /**
   * Text wraps to next line if longer that the length of the display area.
   *
   * @param {Boolean} isEnabled
   * @returns {Cursor}
   */
  lineWrap(isEnabled) {
    this.write(Cursor.encodeToVT100(isEnabled ? '[7h' : '[7l'));
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
    this.write(Cursor.encodeToVT100(`[38;5;${color}m`));
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
    this.write(Cursor.encodeToVT100(`[48;5;${color}m`));
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
   * Reset all terminal settings to default.
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
