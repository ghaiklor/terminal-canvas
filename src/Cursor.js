import Cell from './Cell';
import Color from './Color';
import { encodeToVT100 } from './util/encodeToVT100';

/**
 * Cursor implements low-level API to terminal control codes.
 *
 * @see http://www.termsys.demon.co.uk/vtansi.htm
 * @see http://misc.flogisoft.com/bash/tip_colors_and_formatting
 * @see http://man7.org/linux/man-pages/man4/console_codes.4.html
 * @see http://www.x.org/docs/xterm/ctlseqs.pdf
 * @see http://wiki.bash-hackers.org/scripting/terminalcodes
 * @since 1.0.0
 */
export default class Cursor {
  /**
   * Creates cursor that writes direct to `stdout`.
   *
   * @constructor
   * @param {Stream} [stream=process.stdout]
   * @param {Number} [width=stream.columns]
   * @param {Number} [height=stream.rows]
   */
  constructor({stream = process.stdout, width = stream.columns, height = stream.rows} = {}) {
    this._stream = stream;
    this._width = width;
    this._height = height;
    this._cells = Array.from({length: width * height}).map(_ => Cell.create(' ', {x: 0, y: 0}));

    this._x = 0;
    this._y = 0;
    this._background = false;
    this._foreground = false;
    this._display = {bold: false, dim: false, underlined: false, blink: false, reverse: false, hidden: false};
  }

  /**
   * Get stream which attached to cursor.
   * ASCII control sequences writes to this stream.
   *
   * @returns {Writable}
   */
  getStream() {
    return this._stream;
  }

  /**
   * Set stream to the cursor.
   *
   * @param {Writable} stream
   * @returns {Cursor}
   */
  setStream(stream) {
    this._stream = stream;
    return this;
  }

  /**
   * Get current width of the cursor viewport.
   * In case with process.stdout is columns.
   *
   * @returns {Number}
   */
  getWidth() {
    return this._width;
  }

  /**
   * Update width of the cursor viewport.
   *
   * @param {Number} width
   * @returns {Cursor}
   */
  setWidth(width) {
    this._width = Math.floor(width);
    return this;
  }

  /**
   * Get current height of the cursor viewport.
   * In case with process.stdout is rows.
   *
   * @returns {Number}
   */
  getHeight() {
    return this._height;
  }

  /**
   * Update height of the cursor viewport.
   *
   * @param {Number} height
   * @returns {Cursor}
   */
  setHeight(height) {
    this._height = Math.floor(height);
    return this;
  }

  /**
   * Get current cursor position in X axis.
   *
   * @returns {Number}
   */
  getX() {
    return this._x;
  }

  /**
   * Set new cursor position in X axis.
   *
   * @param {Number} x
   * @returns {Cursor}
   */
  setX(x) {
    this._x = Math.floor(x);
    return this;
  }

  /**
   * Get current cursor position in Y axis.
   *
   * @returns {Number}
   */
  getY() {
    return this._y;
  }

  /**
   * Set new cursor position in Y axis.
   *
   * @param {Number} y
   * @returns {Cursor}
   */
  setY(y) {
    this._y = Math.floor(y);
    return this;
  }

  /**
   * Get current cursor background.
   *
   * @returns {{r: Number, g: Number, b: Number}|Boolean}
   */
  getBackground() {
    return this._background;
  }

  /**
   * Set new cursor background.
   *
   * @param {String|Boolean} background
   * @returns {Cursor}
   */
  setBackground(background) {
    this._background = background ? Color.create(background).toRgb() : false;
    return this;
  }

  /**
   * Get current cursor foreground.
   *
   * @returns {Cursor}
   */
  getForeground() {
    return this._foreground;
  }

  /**
   * Set new cursor foreground.
   *
   * @param {String|Boolean} foreground
   * @returns {Cursor}
   */
  setForeground(foreground) {
    this._foreground = foreground ? Color.create(foreground).toRgb() : false;
    return this;
  }

  /**
   * Get current cursor display settings.
   *
   * @returns {{bold: Boolean, dim: Boolean, underlined: Boolean, blink: Boolean, reverse: Boolean, hidden: Boolean}}
   */
  getDisplay() {
    return this._display;
  }

  /**
   * Set new cursor display settings.
   *
   * @param {Boolean} bold
   * @param {Boolean} dim
   * @param {Boolean} underlined
   * @param {Boolean} blink
   * @param {Boolean} reverse
   * @param {Boolean} hidden
   * @returns {Cursor}
   */
  setDisplay({bold = false, dim = false, underlined = false, blink = false, reverse = false, hidden = false}) {
    this._display = {bold, dim, underlined, blink, reverse, hidden};
    return this;
  }

  /**
   * Write to the buffer.
   * Build control sequence for each cell (char) in data and store into the buffer.
   * It allows to render each unique cell separately and build difference between two frames.
   *
   * @param {String} data Data to write to the buffer
   * @returns {Cursor}
   */
  write(data) {
    const width = this.getWidth();
    const height = this.getHeight();
    const background = this.getBackground();
    const foreground = this.getForeground();
    const display = this.getDisplay();

    data.split('').forEach(char => {
      const [x, y] = [this.getX(), this.getY()];
      const pointer = this.getPointerFromXY(x, y);

      if (0 <= x && x < width && 0 <= y && y < height) {
        this._cells[pointer].setChar(char).setX(x).setY(y).setBackground(background).setForeground(foreground).setDisplay(display);
      }

      this.setX(x + 1);
    });

    return this;
  }

  /**
   * Take current buffer and rendered buffer at last flush.
   * Build difference between them.
   * Difference contains new control codes only, optimizing the rendering performance.
   *
   * @returns {Cursor}
   */
  flush() {
    this.getStream().write(this._cells.filter(cell => cell.isModified()).reduce((seq, cell) => seq + cell.toString(), ''));

    return this;
  }

  /**
   * Get index of the buffer from (x, y) coordinates.
   *
   * @param {Number} [x] X coordinate on the terminal
   * @param {Number} [y] Y coordinate on the terminal
   * @returns {Number} Returns index in the buffer array
   */
  getPointerFromXY(x = this._x, y = this._y) {
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
   * Move the cursor up.
   *
   * @param {Number} [y=1]
   * @returns {Cursor}
   */
  up(y = 1) {
    this._y -= Math.floor(y);
    return this;
  }

  /**
   * Move the cursor down.
   *
   * @param {Number} [y=1]
   * @returns {Cursor}
   */
  down(y = 1) {
    this._y += Math.floor(y);
    return this;
  }

  /**
   * Move the cursor right.
   *
   * @param {Number} [x=1]
   * @returns {Cursor}
   */
  right(x = 1) {
    this._x += Math.floor(x);
    return this;
  }

  /**
   * Move the cursor left.
   *
   * @param {Number} [x=1]
   * @returns {Cursor}
   */
  left(x = 1) {
    this._x -= Math.floor(x);
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
    this._x = Math.floor(x);
    this._y = Math.floor(y);

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
    this._foreground = Color.create(color).toRgb();
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
    this._background = Color.create(color).toRgb();
    return this;
  }

  /**
   * Toggle bold display mode.
   *
   * @param {Boolean} [isBold=true] If false, disables bold mode
   * @returns {Cursor}
   */
  bold(isBold = true) {
    this._display.bold = isBold;
    return this;
  }

  /**
   * Toggle dim display mode.
   *
   * @param {Boolean} [isDim=true] If false, disables dim mode
   * @returns {Cursor}
   */
  dim(isDim = true) {
    this._display.dim = isDim;
    return this;
  }

  /**
   * Toggle underlined display mode.
   *
   * @param {Boolean} [isUnderlined=true] If false, disables underlined mode
   * @returns {Cursor}
   */
  underlined(isUnderlined = true) {
    this._display.underlined = isUnderlined;
    return this;
  }

  /**
   * Toggle blink display mode.
   *
   * @param {Boolean} [isBlink=true] If false, disables blink mode
   * @returns {Cursor}
   */
  blink(isBlink = true) {
    this._display.blink = isBlink;
    return this;
  }

  /**
   * Toggle reverse display mode.
   *
   * @param {Boolean} [isReverse=true] If false, disables reverse display mode
   * @returns {Cursor}
   */
  reverse(isReverse = true) {
    this._display.reverse = isReverse;
    return this;
  }

  /**
   * Toggle hidden display mode.
   *
   * @param {Boolean} [isHidden=true] If false, disables hidden display mode
   * @returns {Cursor}
   */
  hidden(isHidden = true) {
    this._display.hidden = isHidden;
    return this;
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
        this._cells[this.getPointerFromXY(x, y)].setChar(' ');
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
   * Save current terminal contents into the buffer.
   * Applies immediately without calling {@link flush}.
   *
   * @returns {Cursor}
   */
  saveScreen() {
    this.getStream().write(encodeToVT100('[?47h'));
    return this;
  }

  /**
   * Restore terminal contents to previously saved via {@link saveScreen}.
   * Applies immediately without calling {@link flush}.
   *
   * @returns {Cursor}
   */
  restoreScreen() {
    this.getStream().write(encodeToVT100('[?47l'));
    return this;
  }

  /**
   * Set the terminal cursor invisible.
   * Applies immediately without calling {@link flush}.
   *
   * @returns {Cursor}
   */
  hideCursor() {
    this.getStream().write(encodeToVT100('[?25l'));
    return this;
  }

  /**
   * Set the terminal cursor visible.
   * Applies immediately without calling {@link flush}.
   *
   * @returns {Cursor}
   */
  showCursor() {
    this.getStream().write(encodeToVT100('[?25h'));
    return this;
  }

  /**
   * Reset all terminal settings.
   * Applies immediately without calling {@link flush}.
   *
   * @returns {Cursor}
   */
  reset() {
    this.getStream().write(encodeToVT100('c'));
    return this;
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
