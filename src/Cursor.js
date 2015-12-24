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
 * @see http://man7.org/linux/man-pages/man4/console_codes.4.html
 * @see http://www.x.org/docs/xterm/ctlseqs.pdf
 * @since 1.0.0
 */
export class Cursor {
  /**
   * By default, creates simple cursor that writes direct to `stdout`.
   * If you want to work with other streams, you can pass custom `stdout` stream in.
   *
   * @constructor
   * @param {Stream|Array<Stream>} [stream=process.stdout] Streams that will be used as target for cursor
   */
  constructor(stream = process.stdout) {
    this.COLORS = COLORS;
    this.DISPLAY_MODES = DISPLAY_MODES;
    this.ERASE_REGIONS = ERASE_REGIONS;

    this._buffer = [];
    this._stream = Array.isArray(stream) ? stream : [stream];
  }

  /**
   * Write to the buffer.
   * Usually it's just a text that you want to print out but also can be a Buffer with control codes.
   * Cursor has a feature to buffering data, so when you will be ready to push to the stream, call {@link flush} method.
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
    const buffer = this._buffer.join('');
    this._stream.forEach(stream => stream.write(buffer));
    this._buffer = [];
    return this;
  }

  /**
   * Pipe cursor into another stream.
   * Useful when you want to attach cursor to another stream, response stream, for instance.
   *
   * @param {Stream} stream
   * @returns {Cursor}
   */
  pipe(stream) {
    this._stream.push(stream);
    return this;
  }

  /**
   * Draw an image in terminal.
   *
   * @param {String} image Base64 encoded image contents
   * @param {Number|String} [width='auto'] Width to render, can be 100 (cells), 100px, 100% or auto
   * @param {Number|String} [height='auto'] Height to render, can be 100 (cells), 100px, 100% or auto
   * @param {Boolean} [preserveAspectRatio=true] If set to 0, the image's aspect ratio will not be respected
   * @returns {Cursor}
   */
  image({image, width='auto', height='auto', preserveAspectRatio = true}) {
    let args = `width=${width};height=${height};preserveAspectRatio=${preserveAspectRatio ? 1 : 0};inline=1`;
    return this.write(Cursor.encodeToVT100(`]1337;File=${args}:${image}^G`));
  }

  /**
   * Move the cursor up.
   *
   * @param {Number} [y=1] Rows count must be positive number otherwise it just wouldn't work
   * @returns {Cursor}
   */
  up(y = 1) {
    return this.write(Cursor.encodeToVT100(`[${Math.floor(y)}A`));
  }

  /**
   * Move the cursor down.
   *
   * @param {Number} [y=1] Rows count must be positive number otherwise it just wouldn't work
   * @returns {Cursor}
   */
  down(y = 1) {
    return this.write(Cursor.encodeToVT100(`[${Math.floor(y)}B`));
  }

  /**
   * Move the cursor right.
   *
   * @param {Number} [x=1] Columns count must be positive number otherwise it just wouldn't work
   * @returns {Cursor}
   */
  right(x = 1) {
    return this.write(Cursor.encodeToVT100(`[${Math.floor(x)}C`));
  }

  /**
   * Move the cursor left.
   *
   * @param {Number} [x=1] Columns count must be positive number otherwise it just wouldn't work
   * @returns {Cursor}
   */
  left(x = 1) {
    return this.write(Cursor.encodeToVT100(`[${Math.floor(x)}D`));
  }

  /**
   * Move the cursor position relative current coordinates.
   *
   * @param {Number} x Offset by X coordinate
   * @param {Number} y Offset by Y coordinate
   * @returns {Cursor}
   */
  moveBy(x, y) {
    if (x < 0) this.left(-x);
    if (x > 0) this.right(x);

    if (y < 0) this.up(-y);
    if (y > 0) this.down(y);

    return this;
  }

  /**
   * Set the cursor position by absolute coordinates.
   *
   * @param {Number} x X coordinate
   * @param {Number} y Y coordinate
   * @returns {Cursor}
   */
  moveTo(x, y) {
    return this.write(Cursor.encodeToVT100(`[${Math.floor(y)};${Math.floor(x)}f`));
  }

  /**
   * Set the foreground color.
   * This color is used when text is rendering.
   * Color can be in range 0...255 (256-bit palette).
   *
   * @param {Number} color Value from {@link COLORS}
   * @returns {Cursor}
   */
  foreground(color) {
    return this.write(Cursor.encodeToVT100(`[38;5;${color}m`));
  }

  /**
   * Set the background color.
   * This color is used for filling the whole cell in the TTY.
   * Color can be in range 0...255 (256-bit palette).
   *
   * @param {Number} color Value from {@link COLORS}
   * @returns {Cursor}
   */
  background(color) {
    return this.write(Cursor.encodeToVT100(`[48;5;${color}m`));
  }

  /**
   * Change display mode (format of text).
   * You can also use helper methods like {@link bold} or {@link blink}, etc...
   *
   * @param {Number} mode Mode identifier from {@link DISPLAY_MODES}
   * @returns {Cursor}
   */
  display(mode) {
    return this.write(Cursor.encodeToVT100(`[${mode}m`));
  }

  /**
   * Toggle bold display mode.
   *
   * @param {Boolean} [isBold=true] If false, disables bold mode
   * @returns {Cursor}
   */
  bold(isBold = true) {
    return this.display(isBold ? DISPLAY_MODES.BOLD : DISPLAY_MODES.RESET_BOLD);
  }

  /**
   * Toggle dim display mode.
   *
   * @param {Boolean} [isDim=true] If false, disables dim mode
   * @returns {Cursor}
   */
  dim(isDim = true) {
    return this.display(isDim ? DISPLAY_MODES.DIM : DISPLAY_MODES.RESET_DIM);
  }

  /**
   * Toggle underlined display mode.
   *
   * @param {Boolean} [isUnderlined=true] If false, disables underlined mode
   * @returns {Cursor}
   */
  underlined(isUnderlined = true) {
    return this.display(isUnderlined ? DISPLAY_MODES.UNDERLINED : DISPLAY_MODES.RESET_UNDERLINED);
  }

  /**
   * Toggle blink display mode.
   *
   * @param {Boolean} [isBlink=true] If false, disables blink mode
   * @returns {Cursor}
   */
  blink(isBlink = true) {
    return this.display(isBlink ? DISPLAY_MODES.BLINK : DISPLAY_MODES.RESET_BLINK);
  }

  /**
   * Toggle reverse display mode.
   *
   * @param {Boolean} [isReverse=true] If false, disables reverse display mode
   * @returns {Cursor}
   */
  reverse(isReverse = true) {
    return this.display(isReverse ? DISPLAY_MODES.REVERSE : DISPLAY_MODES.RESET_REVERSE);
  }

  /**
   * Toggle hidden display mode.
   *
   * @param {Boolean} [isHidden=true] If false, disables hidden display mode
   * @returns {Cursor}
   */
  hidden(isHidden = true) {
    return this.display(isHidden ? DISPLAY_MODES.HIDDEN : DISPLAY_MODES.RESET_HIDDEN);
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
    if (Object.keys(ERASE_REGIONS).every(key => region !== ERASE_REGIONS[key])) return this;
    return this.saveCursor().resetCursor().write(Cursor.encodeToVT100(region)).restoreCursor();
  }

  /**
   * Erase from current position to end of the line.
   *
   * @returns {Cursor}
   */
  eraseToEnd() {
    return this.erase(ERASE_REGIONS.FROM_CURSOR_TO_END);
  }

  /**
   * Erase from current position to start of the line.
   *
   * @returns {Cursor}
   */
  eraseToStart() {
    return this.erase(ERASE_REGIONS.FROM_CURSOR_TO_START);
  }

  /**
   * Erase from current line to down.
   *
   * @returns {Cursor}
   */
  eraseToDown() {
    return this.erase(ERASE_REGIONS.FROM_CURSOR_TO_DOWN);
  }

  /**
   * Erase from current line to up.
   *
   * @returns {Cursor}
   */
  eraseToUp() {
    return this.erase(ERASE_REGIONS.FROM_CURSOR_TO_UP);
  }

  /**
   * Erase current line.
   *
   * @returns {Cursor}
   */
  eraseLine() {
    return this.erase(ERASE_REGIONS.CURRENT_LINE);
  }

  /**
   * Erase the entire screen.
   *
   * @returns {Cursor}
   */
  eraseScreen() {
    return this.erase(ERASE_REGIONS.ENTIRE_SCREEN);
  }

  /**
   * Set the cursor invisible.
   *
   * @returns {Cursor}
   */
  hideCursor() {
    return this.write(Cursor.encodeToVT100('[?25l'));
  }

  /**
   * Set the cursor visible.
   *
   * @returns {Cursor}
   */
  showCursor() {
    return this.write(Cursor.encodeToVT100('[?25h'));
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
    return this.write(Cursor.encodeToVT100(withAttributes ? '7' : '[s'));
  }

  /**
   * Restore cursor position and attributes from stack.
   *
   * @param {Boolean} [withAttributes=true] If true, restore it with attributes settings too
   * @returns {Cursor}
   */
  restoreCursor(withAttributes = true) {
    return this.write(Cursor.encodeToVT100(withAttributes ? '8' : '[u'));
  }

  /**
   * Reset all display modes and cursor attributes to default.
   *
   * @returns {Cursor}
   */
  resetCursor() {
    return this.display(DISPLAY_MODES.RESET_ALL);
  }

  /**
   * Reset all terminal settings to default.
   *
   * @returns {Cursor}
   */
  resetTTY() {
    return this.resetCursor().eraseScreen().write(Cursor.encodeToVT100('c'));
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
   * Wrapper around `new Cursor()`.
   *
   * @static
   * @returns {Cursor}
   */
  static create(...args) {
    return new this(...args);
  }
}
