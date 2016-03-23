import Cell from './Cell';
import Color from './Color';
import {encodeToVT100} from './util/encodeToVT100';

/**
 * Canvas implements low-level API to terminal control codes.
 *
 * @see http://www.termsys.demon.co.uk/vtansi.htm
 * @see http://misc.flogisoft.com/bash/tip_colors_and_formatting
 * @see http://man7.org/linux/man-pages/man4/console_codes.4.html
 * @see http://www.x.org/docs/xterm/ctlseqs.pdf
 * @see http://wiki.bash-hackers.org/scripting/terminalcodes
 * @since 1.0.0
 */
export default class Canvas {
  /**
   * Creates cursor that writes direct to `stdout`.
   * You can override target stream with another one.
   * Also, you can specify custom width and height of viewport where cursor will render the frame.
   *
   * @constructor
   * @param {Object} [options] Object with options
   * @param {Stream} [options.stream=process.stdout] Writable stream
   * @param {Number} [options.width=stream.columns] Number of columns (width)
   * @param {Number} [options.height=stream.rows] Number of rows (height)
   */
  constructor(options = {}) {
    var {stream = process.stdout, width = stream.columns, height = stream.rows} = options;

    this._stream = stream;
    this._width = width;
    this._height = height;

    this._x = 0;
    this._y = 0;
    this._background = {r: -1, g: -1, b: -1};
    this._foreground = {r: -1, g: -1, b: -1};
    this._display = {bold: false, dim: false, underlined: false, blink: false, reverse: false, hidden: false};

    this._cells = Array.from({length: width * height}).map(() => new Cell());
    this._lastFrame = Array.from({length: width * height}).fill('');
  }

  /**
   * Write to the stream.
   * It doesn't applies immediately but stores in virtual terminal that represented as array of {@link Cell} instances.
   * For applying changes you need to {@link flush} changes.
   *
   * @param {String} data Data to write to the terminal
   * @returns {Canvas}
   */
  write(data) {
    var width = this._width;
    var height = this._height;
    var background = this._background;
    var foreground = this._foreground;
    var display = this._display;

    for (var i = 0; i < data.length; i++) {
      var char = data[i];
      var x = this._x;
      var y = this._y;
      var pointer = this.getPointerFromXY(x, y);

      if (0 <= x && x < width && 0 <= y && y < height) {
        this._cells[pointer]
          .setChar(char)
          .setX(x)
          .setY(y)
          .setBackground(background.r, background.g, background.b)
          .setForeground(foreground.r, foreground.g, foreground.b)
          .setDisplay(display.bold, display.dim, display.underlined, display.blink, display.reverse, display.hidden)
          .setModified(true);
      }

      this._x++;
    }

    return this;
  }

  /**
   * Takes only modified cells from virtual terminal and flush changes to the real terminal.
   * There is no requirements to build diff or something, we have the markers for each cell that has been modified.
   *
   * @returns {Canvas}
   */
  flush() {
    for (var i = 0; i < this._cells.length; i++) {
      if (this._cells[i].isModified()) {
        var cellSeq = this._cells[i].setModified(false).toString();

        if (cellSeq !== this._lastFrame[i]) {
          this._lastFrame[i] = cellSeq;
          this._stream.write(cellSeq);
        }
      }
    }

    return this;
  }

  /**
   * Get index of the virtual terminal representation from (x, y) coordinates.
   *
   * @param {Number} [x] X coordinate on the terminal
   * @param {Number} [y] Y coordinate on the terminal
   * @returns {Number} Returns index in the buffer array
   */
  getPointerFromXY(x = this._x, y = this._y) {
    return y * this._width + x;
  }

  /**
   * Get (x, y) coordinate from the virtual terminal pointer.
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
   * @returns {Canvas}
   */
  up(y = 1) {
    this._y -= Math.floor(y);
    return this;
  }

  /**
   * Move the cursor down.
   *
   * @param {Number} [y=1]
   * @returns {Canvas}
   */
  down(y = 1) {
    this._y += Math.floor(y);
    return this;
  }

  /**
   * Move the cursor right.
   *
   * @param {Number} [x=1]
   * @returns {Canvas}
   */
  right(x = 1) {
    this._x += Math.floor(x);
    return this;
  }

  /**
   * Move the cursor left.
   *
   * @param {Number} [x=1]
   * @returns {Canvas}
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
   * @returns {Canvas}
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
   * @returns {Canvas}
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
   * @param {String|Boolean} color Color name or false if you want to disable foreground filling
   * @returns {Canvas}
   */
  foreground(color) {
    var newColor = color ? Color.create(color).toRgb() : {r: -1, g: -1, b: -1};

    this._foreground.r = newColor.r;
    this._foreground.g = newColor.g;
    this._foreground.b = newColor.b;

    return this;
  }

  /**
   * Set the background color.
   * This color is used for filling the whole cell in the TTY.
   *
   * @param {String|Boolean} color Color name or false if you want to disable background filling
   * @returns {Canvas}
   */
  background(color) {
    var newColor = color ? Color.create(color).toRgb() : {r: -1, g: -1, b: -1};

    this._background.r = newColor.r;
    this._background.g = newColor.g;
    this._background.b = newColor.b;

    return this;
  }

  /**
   * Toggle bold display mode.
   *
   * @param {Boolean} [isBold=true] If false, disables bold mode
   * @returns {Canvas}
   */
  bold(isBold = true) {
    this._display.bold = isBold;
    return this;
  }

  /**
   * Toggle dim display mode.
   *
   * @param {Boolean} [isDim=true] If false, disables dim mode
   * @returns {Canvas}
   */
  dim(isDim = true) {
    this._display.dim = isDim;
    return this;
  }

  /**
   * Toggle underlined display mode.
   *
   * @param {Boolean} [isUnderlined=true] If false, disables underlined mode
   * @returns {Canvas}
   */
  underlined(isUnderlined = true) {
    this._display.underlined = isUnderlined;
    return this;
  }

  /**
   * Toggle blink display mode.
   *
   * @param {Boolean} [isBlink=true] If false, disables blink mode
   * @returns {Canvas}
   */
  blink(isBlink = true) {
    this._display.blink = isBlink;
    return this;
  }

  /**
   * Toggle reverse display mode.
   *
   * @param {Boolean} [isReverse=true] If false, disables reverse display mode
   * @returns {Canvas}
   */
  reverse(isReverse = true) {
    this._display.reverse = isReverse;
    return this;
  }

  /**
   * Toggle hidden display mode.
   *
   * @param {Boolean} [isHidden=true] If false, disables hidden display mode
   * @returns {Canvas}
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
   * @returns {Canvas}
   */
  erase(x1, y1, x2, y2) {
    for (var y = y1; y <= y2; y++) {
      for (var x = x1; x <= x2; x++) {
        var pointer = this.getPointerFromXY(x, y);
        this._cells[pointer] && this._cells[pointer].reset();
      }
    }

    return this;
  }

  /**
   * Erase from current position to end of the line.
   *
   * @returns {Canvas}
   */
  eraseToEnd() {
    return this.erase(this._x, this._y, this._width - 1, this._y);
  }

  /**
   * Erase from current position to start of the line.
   *
   * @returns {Canvas}
   */
  eraseToStart() {
    return this.erase(0, this._y, this._x, this._y);
  }

  /**
   * Erase from current line to down.
   *
   * @returns {Canvas}
   */
  eraseToDown() {
    return this.erase(0, this._y, this._width - 1, this._height - 1);
  }

  /**
   * Erase from current line to up.
   *
   * @returns {Canvas}
   */
  eraseToUp() {
    return this.erase(0, 0, this._width - 1, this._y);
  }

  /**
   * Erase current line.
   *
   * @returns {Canvas}
   */
  eraseLine() {
    return this.erase(0, this._y, this._width - 1, this._y);
  }

  /**
   * Erase the entire screen.
   *
   * @returns {Canvas}
   */
  eraseScreen() {
    return this.erase(0, 0, this._width - 1, this._height - 1);
  }

  /**
   * Save current terminal contents into the buffer.
   * Applies immediately without calling {@link flush}.
   *
   * @returns {Canvas}
   */
  saveScreen() {
    this._stream.write(encodeToVT100('[?47h'));
    return this;
  }

  /**
   * Restore terminal contents to previously saved via {@link saveScreen}.
   * Applies immediately without calling {@link flush}.
   *
   * @returns {Canvas}
   */
  restoreScreen() {
    this._stream.write(encodeToVT100('[?47l'));
    return this;
  }

  /**
   * Set the terminal cursor invisible.
   * Applies immediately without calling {@link flush}.
   *
   * @returns {Canvas}
   */
  hideCursor() {
    this._stream.write(encodeToVT100('[?25l'));
    return this;
  }

  /**
   * Set the terminal cursor visible.
   * Applies immediately without calling {@link flush}.
   *
   * @returns {Canvas}
   */
  showCursor() {
    this._stream.write(encodeToVT100('[?25h'));
    return this;
  }

  /**
   * Reset all terminal settings.
   * Applies immediately without calling {@link flush}.
   *
   * @returns {Canvas}
   */
  reset() {
    this._stream.write(encodeToVT100('c'));
    return this;
  }

  /**
   * Wrapper around `new Canvas()`.
   *
   * @static
   * @returns {Canvas}
   */
  static create(...args) {
    return new this(...args);
  }
}
