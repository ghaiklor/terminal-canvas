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
 */
export class Cursor {
  /**
   * Get list of all available colors for Cursor API.
   *
   * @constructor
   * @returns {COLORS}
   */
  get COLORS() {
    return COLORS;
  }

  /**
   * Get list of all available display modes for Cursor API.
   *
   * @constructor
   * @returns {DISPLAY_MODES}
   */
  get DISPLAY_MODES() {
    return DISPLAY_MODES;
  }

  /**
   * Get list of all available erase regions for Cursor API.
   *
   * @constructor
   * @returns {ERASE_REGIONS}
   */
  get ERASE_REGIONS() {
    return ERASE_REGIONS;
  }

  /**
   * By default, creates simple cursor that writes direct to `stdout`.
   *
   * If you want to work with other streams, you can pass custom `stdout` and `stdin` streams in.
   * It's useful when you want to chain few streams before pipe it into the cursor or want to modify what cursor pipes to `stdout`.
   *
   * @constructor
   * @param {Stream} [stream=process.stdout] Array of Transform streams that will be used as target source for cursor
   */
  constructor(stream = process.stdout) {
    this._stream = stream;
    this._buffer = [];
  }

  /**
   * Write to the stream.
   * Usually it's just a text that you want to print out but also can be a Buffer with control codes.
   *
   * @param {Buffer|String} data Data to write to the stream
   * @returns {Cursor}
   */
  write(data) {
    this._buffer.push(Buffer.isBuffer(data) ? data : new Buffer(data));
    return this;
  }

  /**
   * Write from the buffer to stream and clear it up.
   *
   * @returns {Cursor}
   */
  flush() {
    this._stream.write(this._buffer.join(''));
    this._buffer = [];
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
   * Set the foreground color.
   * This color is used when text is rendering.
   *
   * @param {Number} color Value from {@link COLORS}
   * @returns {Cursor}
   */
  foreground(color) {
    this.write(Cursor.encodeToVT100(`[38;5;${color}m`));
    return this;
  }

  /**
   * Set the background color.
   * This color is used for filling the whole cell in the TTY.
   *
   * @param {Number} color Value from {@link COLORS}
   * @returns {Cursor}
   */
  background(color) {
    this.write(Cursor.encodeToVT100(`[48;5;${color}m`));
    return this;
  }

  /**
   * Change display mode.
   * You can also use helper methods like {@link bold} or {@link blink}, etc...
   *
   * @param {Number} mode Mode identifier from {@link DISPLAY_MODES}
   * @returns {Cursor}
   */
  display(mode) {
    this.write(Cursor.encodeToVT100(`[${mode}m`));
    return this;
  }

  /**
   * Toggle bold display mode.
   *
   * @param {Boolean} [isBold=true] If false, disables bold mode
   * @returns {Cursor}
   */
  bold(isBold = true) {
    this.display(isBold ? DISPLAY_MODES.BOLD : DISPLAY_MODES.RESET_BOLD);
    return this;
  }

  /**
   * Toggle dim display mode.
   *
   * @param {Boolean} [isDim=true] If false, disables dim mode
   * @returns {Cursor}
   */
  dim(isDim = true) {
    this.display(isDim ? DISPLAY_MODES.DIM : DISPLAY_MODES.RESET_DIM);
    return this;
  }

  /**
   * Toggle underlined display mode.
   *
   * @param {Boolean} [isUnderlined=true] If false, disables underlined mode
   * @returns {Cursor}
   */
  underlined(isUnderlined = true) {
    this.display(isUnderlined ? DISPLAY_MODES.UNDERLINED : DISPLAY_MODES.RESET_UNDERLINED);
    return this;
  }

  /**
   * Toggle blink display mode.
   *
   * @param {Boolean} [isBlink=true] If false, disables blink mode
   * @returns {Cursor}
   */
  blink(isBlink = true) {
    this.display(isBlink ? DISPLAY_MODES.BLINK : DISPLAY_MODES.RESET_BLINK);
    return this;
  }

  /**
   * Toggle reverse display mode.
   *
   * @param {Boolean} [isReverse=true] If false, disables reverse display mode
   * @returns {Cursor}
   */
  reverse(isReverse = true) {
    this.display(isReverse ? DISPLAY_MODES.REVERSE : DISPLAY_MODES.RESET_REVERSE);
    return this;
  }

  /**
   * Toggle hidden display mode.
   *
   * @param {Boolean} [isHidden=true] If false, disables hidden display mode
   * @returns {Cursor}
   */
  hidden(isHidden = true) {
    this.display(isHidden ? DISPLAY_MODES.HIDDEN : DISPLAY_MODES.RESET_HIDDEN);
    return this;
  }

  /**
   * Erase a defined region.
   * Before erase the region it saves cursor attributes to stack and erases the region with default attributes.
   * Afterwards it restores the cursor attributes as it was before.
   *
   * @param {String} region Value from {@link ERASE_REGIONS}
   * @returns {Cursor}
   */
  erase(region) {
    this.saveCursor();
    this.resetCursor();
    this.write(Cursor.encodeToVT100(region));
    this.restoreCursor();
    return this;
  }

  /**
   * Erase from current position to end of the line.
   *
   * @returns {Cursor}
   */
  eraseToEnd() {
    this.erase(ERASE_REGIONS.FROM_CURSOR_TO_END);
    return this;
  }

  /**
   * Erase from current position to start of the line.
   *
   * @returns {Cursor}
   */
  eraseToStart() {
    this.erase(ERASE_REGIONS.FROM_CURSOR_TO_START);
    return this;
  }

  /**
   * Erase from current line to down.
   *
   * @returns {Cursor}
   */
  eraseToDown() {
    this.erase(ERASE_REGIONS.FROM_CURSOR_TO_DOWN);
    return this;
  }

  /**
   * Erase from current line to up.
   *
   * @returns {Cursor}
   */
  eraseToUp() {
    this.erase(ERASE_REGIONS.FROM_CURSOR_TO_UP);
    return this;
  }

  /**
   * Erase current line.
   *
   * @returns {Cursor}
   */
  eraseLine() {
    this.erase(ERASE_REGIONS.CURRENT_LINE);
    return this;
  }

  /**
   * Erase the entire screen.
   *
   * @returns {Cursor}
   */
  eraseScreen() {
    this.erase(ERASE_REGIONS.ENTIRE_SCREEN);
    return this;
  }

  /**
   * Set the cursor invisible.
   *
   * @returns {Cursor}
   */
  hideCursor() {
    this.write(Cursor.encodeToVT100('[?25l'));
    return this;
  }

  /**
   * Set the cursor visible.
   *
   * @returns {Cursor}
   */
  showCursor() {
    this.write(Cursor.encodeToVT100('[?25h'));
    return this;
  }

  /**
   * Save current cursor position and attributes in stack.
   * Doesn't return any information about stack.
   * You can restore saved information with {@link restoreCursor}
   *
   * @param {Boolean} [withAttributes=true] If true, save it with attributes settings too
   * @returns {Cursor}
   */
  saveCursor(withAttributes = true) {
    this.write(Cursor.encodeToVT100(withAttributes ? '7' : '[s'));
    return this;
  }

  /**
   * Restore cursor position and attributes from stack.
   *
   * @param {Boolean} [withAttributes=true] If true, restore it with attributes settings too
   * @returns {Cursor}
   */
  restoreCursor(withAttributes = true) {
    this.write(Cursor.encodeToVT100(withAttributes ? '8' : '[u'));
    return this;
  }

  /**
   * Reset all display modes and cursor attributes to default.
   *
   * @returns {Cursor}
   */
  resetCursor() {
    this.display(DISPLAY_MODES.RESET_ALL);
    return this;
  }

  /**
   * Destroy the cursor.
   *
   * @returns {Cursor}
   */
  destroyCursor() {
    this.emit('end');
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
   * @param {Number} [options.background] Background color from {@link COLORS}
   * @param {Number} [options.foreground] Foreground color from {@link COLORS}
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

    if (typeof background !== 'undefined') this.background(background);
    if (typeof foreground !== 'undefined') this.foreground(foreground);

    this.position(x1, y1);

    while (y1 <= y2) {
      this.write(filler);
      this.position(x1, ++y1);
    }

    return this;
  }

  /**
   * Reset all terminal settings to default.
   *
   * @returns {Cursor}
   */
  resetTTY() {
    this.resetCursor();
    this.eraseScreen();
    this.write(Cursor.encodeToVT100('c'));
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
