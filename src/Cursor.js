import { COLORS } from './colors';
import { DISPLAY_MODES } from './displayModes';

/**
 * Cursor implements low-level API to terminal control codes.
 *
 * @see http://www.termsys.demon.co.uk/vtansi.htm
 * @see http://misc.flogisoft.com/bash/tip_colors_and_formatting
 * @see http://man7.org/linux/man-pages/man4/console_codes.4.html
 * @see http://www.x.org/docs/xterm/ctlseqs.pdf
 * @since 1.0.0
 */
export default class Cursor {
  /**
   * Creates cursor that writes direct to `stdout`.
   *
   * @constructor
   */
  constructor() {
    this._width = process.stdout.columns;
    this._height = process.stdout.rows;

    this._x = 0;
    this._y = 0;

    this._background = false;
    this._foreground = false;
    this._display = false;

    this._buffer = Array.from({length: this._width * this._height}).fill(' ');
    this._renderedBuffer = [].concat(this._buffer);
  }

  /**
   * Wrap char with all control codes needed for rendering the cell.
   *
   * @param {String} char
   * @param {Object} options
   * @returns {String} Returns ready to flush string with ASCII control codes
   */
  wrap(char, options = {}) {
    const {x, y, background, foreground, display} = options;

    return (
      Cursor.encodeToVT100(`[${Math.floor(y + 1)};${Math.floor(x + 1)}f`) +
      (background ? Cursor.encodeToVT100(`[48;5;${COLORS[background.toUpperCase()]}m`) : '') +
      (foreground ? Cursor.encodeToVT100(`[38;5;${COLORS[foreground.toUpperCase()]}m`) : '') +
      (display ? Cursor.encodeToVT100(`[${display}m`) : '') +
      char +
      Cursor.encodeToVT100(`[${DISPLAY_MODES.RESET_ALL}m`)
    );
  }

  /**
   * Get index of the buffer from (x, y) coordinates of from current pointer.
   *
   * @param {Number} [x] X coordinate on the terminal
   * @param {Number} [y] Y coordinate on the terminal
   * @returns {Number} Returns index in the buffer array
   */
  getPointer(x = this._x, y = this._y) {
    return y * this._width + x;
  }

  /**
   * Get (x, y) coordinate from the buffer pointer.
   *
   * @param {Number} index Index in the buffer
   * @returns {Array} Returns an array [x, y]
   */
  getXYFromPointer(index) {
    return [index - (Math.floor(index / this._width) * this._width), Math.floor(index / this._width)];
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
    // TODO: refactor here
    data.split('').forEach(char => {
      const [x, y] = [this._x, this._y];
      const pointer = this.getPointer(x, y);

      if (0 <= x && x < this._width && 0 <= y && y < this._height) {
        this._buffer[pointer] = this.wrap(char, {
          x,
          y,
          background: this._background,
          foreground: this._foreground,
          display: this._display
        });
      }

      this._x++;
    });

    return this;
  }

  /**
   * Write from the buffer to stream and clear it up.
   *
   * @returns {Cursor}
   */
  flush() {
    // TODO: make diff and write only diff
    const prev = new Set(this._renderedBuffer);

    process.stdout.write(this._buffer.filter(item => !prev.has(item)).join(''));

    this._renderedBuffer = [].concat(this._buffer);

    return this;
  }

  /**
   * Draw an image in terminal.
   * Supports only by few terminals, as I know only in iTerm 2 (v2.9).
   *
   * @param {String} image Base64 encoded image content
   * @param {Number|String} [width='auto'] Width to render, can be 100 (cells), 100px, 100% or auto
   * @param {Number|String} [height='auto'] Height to render, can be 100 (cells), 100px, 100% or auto
   * @param {Boolean} [preserveAspectRatio=true] If set to false, the image's aspect ratio will not be respected
   * @returns {Cursor}
   */
  image({image, width='auto', height='auto', preserveAspectRatio = true}) {
    const args = `width=${width};height=${height};preserveAspectRatio=${preserveAspectRatio ? 1 : 0};inline=1`;
    process.stdout.write(Cursor.encodeToVT100(`]1337;File=${args}:${image}^G`));
    return this;
  }

  /**
   * Move the cursor up.
   *
   * @param {Number} [y=1] Rows count must be positive number otherwise it just wouldn't work
   * @returns {Cursor}
   */
  up(y = 1) {
    this._y -= y;
    return this;
  }

  /**
   * Move the cursor down.
   *
   * @param {Number} [y=1] Rows count must be positive number otherwise it just wouldn't work
   * @returns {Cursor}
   */
  down(y = 1) {
    this._y += y;
    return this;
  }

  /**
   * Move the cursor right.
   *
   * @param {Number} [x=1] Columns count must be positive number otherwise it just wouldn't work
   * @returns {Cursor}
   */
  right(x = 1) {
    this._x += x;
    return this;
  }

  /**
   * Move the cursor left.
   *
   * @param {Number} [x=1] Columns count must be positive number otherwise it just wouldn't work
   * @returns {Cursor}
   */
  left(x = 1) {
    this._x -= x;
    return this;
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
    this._x = x;
    this._y = y;

    return this;
  }

  /**
   * Set the foreground color.
   * This color is used when text is rendering.
   *
   * @param {String} color Color name
   * @returns {Cursor}
   */
  foreground(color) {
    this._foreground = color;
    return this;
  }

  /**
   * Set the background color.
   * This color is used for filling the whole cell in the TTY.
   *
   * @param {String} color Color name
   * @returns {Cursor}
   */
  background(color) {
    this._background = color;
    return this;
  }

  /**
   * Change display mode (format of text).
   * You can also use helper methods like {@link bold} or {@link blink}, etc...
   *
   * @param {Number} mode Mode identifier from {@link DISPLAY_MODES}
   * @returns {Cursor}
   */
  display(mode) {
    this._display = mode;
    return this;
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
   * Erase the specified region.
   * The region describes the rectangle shape which need to erase.
   *
   * @param {Number} x1
   * @param {Number} y1
   * @param {Number} x2
   * @param {Number} y2
   * @returns {Cursor}
   */
  erase(x1, y1, x2, y2) {
    for (let y = y1; y <= y2; y++) {
      for (let x = x1; x <= x2; x++) {
        this._buffer[this.getPointer(x, y)] = this.wrap(' ', {x, y});
      }
    }

    return this;
  }

  /**
   * Erase from current position to end of the line.
   *
   * @returns {Cursor}
   */
  eraseToEnd() {
    return this.erase(this._x, this._y, this._width - 1, this._y);
  }

  /**
   * Erase from current position to start of the line.
   *
   * @returns {Cursor}
   */
  eraseToStart() {
    return this.erase(0, this._y, this._x, this._y);
  }

  /**
   * Erase from current line to down.
   *
   * @returns {Cursor}
   */
  eraseToDown() {
    return this.erase(0, this._y, this._width - 1, this._height - 1);
  }

  /**
   * Erase from current line to up.
   *
   * @returns {Cursor}
   */
  eraseToUp() {
    return this.erase(0, 0, this._width - 1, this._y);
  }

  /**
   * Erase current line.
   *
   * @returns {Cursor}
   */
  eraseLine() {
    return this.erase(0, this._y, this._width - 1, this._y);
  }

  /**
   * Erase the entire screen.
   *
   * @returns {Cursor}
   */
  eraseScreen() {
    return this.erase(0, 0, this._width - 1, this._height - 1);
  }

  /**
   * Set the terminal cursor invisible.
   * Applies immediately without calling {@link flush}.
   *
   * @returns {Cursor}
   */
  hideCursor() {
    process.stdout.write(Cursor.encodeToVT100('[?25l'));
    return this;
  }

  /**
   * Set the terminal cursor visible.
   * Applies immediately without calling {@link flush}.
   *
   * @returns {Cursor}
   */
  showCursor() {
    process.stdout.write(Cursor.encodeToVT100('[?25h'));
    return this;
  }

  /**
   * Reset all terminal settings.
   * Applies immediately without calling {@link flush}.
   *
   * @returns {Cursor}
   */
  resetTTY() {
    process.stdout.write(Cursor.encodeToVT100('c'));
    return this;
  }

  /**
   * Bytes to encode to VT100 control sequence.
   *
   * @static
   * @param {String} string Control code that you want to encode
   * @returns {Buffer} Returns encoded bytes
   */
  static encodeToVT100(string) {
    return new Buffer([0x1b].concat(string.split('').map(char => char.charCodeAt(0))));
  }

  /**
   * Wrapper around `new Cursor()`.
   *
   * @static
   * @returns {Cursor}
   */
  static create() {
    return new this();
  }
}
