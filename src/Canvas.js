const Cell = require('./Cell');
const Color = require('./Color');
const encodeToVT100 = require('./encodeToVT100');

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
class Canvas {
  /**
   * Creates canvas that writes direct to `stdout` by default.
   * You can override destination stream with another Writable stream.
   * Also, you can specify custom width and height of viewport where cursor will render the frame.
   *
   * @constructor
   * @param {Object} [options]
   * @param {Stream} [options.stream=process.stdout] Writable stream
   * @param {Number} [options.width=stream.columns] Number of columns (width)
   * @param {Number} [options.height=stream.rows] Number of rows (height)
   * @example
   * Canvas.create({stream: fs.createWriteStream(), width: 20, height: 20});
   */
  constructor(options = {}) {
    const {stream = process.stdout, width = stream.columns, height = stream.rows} = options;

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
   * Write to the buffer.
   * It doesn't applies immediately, but stores in virtual terminal that represented as array of {@link Cell} instances.
   * For applying changes, you need to call {@link flush} method.
   *
   * @param {String} data Data to write to the terminal
   * @returns {Canvas}
   * @example
   * canvas.write('Hello, world').flush();
   */
  write(data) {
    const width = this._width;
    const height = this._height;
    const background = this._background;
    const foreground = this._foreground;
    const display = this._display;

    for (let i = 0; i < data.length; i++) {
      const char = data[i];
      const x = this._x;
      const y = this._y;
      const pointer = this.getPointerFromXY(x, y);

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
   * Flush changes to the real terminal, taking only modified cells.
   * Firstly, we get modified cells that have been affected by {@link write} method.
   * Secondly, we compare these modified cells with the last frame.
   * If cell has changes that doesn't equal to the cell from the last frame - write to the stream.
   *
   * @returns {Canvas}
   */
  flush() {
    let payload = '';

    for (let i = 0; i < this._cells.length; i++) {
      if (this._cells[i].isModified()) {
        const cellSeq = this._cells[i].setModified(false).toString();

        if (cellSeq !== this._lastFrame[i]) {
          this._lastFrame[i] = cellSeq;
          payload += cellSeq;
        }
      }
    }

    this._stream.write(payload);

    return this;
  }

  /**
   * Get index of the virtual terminal representation from (x, y) coordinates.
   *
   * @param {Number} [x] X coordinate on the terminal
   * @param {Number} [y] Y coordinate on the terminal
   * @returns {Number} Returns index in the buffer array
   * @example
   * canvas.getPointerFromXY(0, 0); // returns 0
   * canvas.getPointerFromXY(); // x and y in this case is current position of the cursor
   */
  getPointerFromXY(x = this._x, y = this._y) {
    return y * this._width + x;
  }

  /**
   * Get (x, y) coordinate from the virtual terminal pointer.
   *
   * @param {Number} index Index in the buffer
   * @returns {Array} Returns an array [x, y]
   * @example
   * canvas.getXYFromPointer(0); // returns [0, 0]
   */
  getXYFromPointer(index) {
    return [index - (Math.floor(index / this._width) * this._width), Math.floor(index / this._width)];
  }

  /**
   * Move the cursor up.
   *
   * @param {Number} [y=1]
   * @returns {Canvas}
   * @example
   * canvas.up(); // moves cursor up by one cell
   * canvas.up(5); // moves cursor up by five cells
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
   * @example
   * canvas.down(); // moves cursor down by one cell
   * canvas.down(5); // moves cursor down by five cells
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
   * @example
   * canvas.right(); // moves cursor right by one cell
   * canvas.right(5); // moves cursor right by five cells
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
   * @example
   * canvas.left(); // moves cursor left by one cell
   * canvas.left(5); // moves cursor left by five cells
   */
  left(x = 1) {
    this._x -= Math.floor(x);
    return this;
  }

  /**
   * Move the cursor position relative to the current coordinates.
   *
   * @param {Number} x Offset by X coordinate
   * @param {Number} y Offset by Y coordinate
   * @returns {Canvas}
   * @example
   * canvas.moveBy(5, 5); // moves cursor to the right and down by five cells
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
   * @example
   * canvas.moveTo(10, 10); // moves cursor to the (10, 10) coordinate
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
   * @param {String|Boolean} color Color name, rgb, hex or false if you want to disable foreground filling
   * @returns {Canvas}
   * @example
   * canvas.foreground('white');
   * canvas.foreground('#000000');
   * canvas.foreground('rgb(255, 255, 255)');
   * canvas.foreground(false); // disables foreground filling (will be used default filling)
   */
  foreground(color) {
    const newColor = color ? Color.create(color).toRgb() : {r: -1, g: -1, b: -1};

    this._foreground.r = newColor.r;
    this._foreground.g = newColor.g;
    this._foreground.b = newColor.b;

    return this;
  }

  /**
   * Set the background color.
   * This color is used for filling the whole cell in the TTY.
   *
   * @param {String|Boolean} color Color name, rgb, hex or false if you want to disable background filling
   * @returns {Canvas}
   * @example
   * canvas.background('white');
   * canvas.background('#000000');
   * canvas.background('rgb(255, 255, 255)');
   * canvas.background(false); // disables background filling (will be used default filling)
   */
  background(color) {
    const newColor = color ? Color.create(color).toRgb() : {r: -1, g: -1, b: -1};

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
   * @example
   * canvas.bold(); // enable bold mode
   * canvas.bold(false); // disable bold mode
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
   * @example
   * canvas.dim(); // enable dim mode
   * canvas.dim(false); // disable dim mode
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
   * @example
   * canvas.underlined(); // enable underlined mode
   * canvas.underlined(false); // disable underlined mode
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
   * @example
   * canvas.blink(); // enable blink mode
   * canvas.blink(false); // disable blink mode
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
   * @example
   * canvas.reverse(); // enable reverse mode
   * canvas.reverse(false); // disable reverse mode
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
   * @example
   * canvas.hidden(); // enable hidden mode
   * canvas.hidden(false); // disable hidden mode
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
   * @example
   * canvas.erase(0, 0, 5, 5);
   */
  erase(x1, y1, x2, y2) {
    for (let y = y1; y <= y2; y++) {
      for (let x = x1; x <= x2; x++) {
        const pointer = this.getPointerFromXY(x, y);
        this._cells[pointer] && this._cells[pointer].reset();
      }
    }

    return this;
  }

  /**
   * Erase from current position to end of the line.
   *
   * @returns {Canvas}
   * @example
   * canvas.eraseToEnd();
   */
  eraseToEnd() {
    return this.erase(this._x, this._y, this._width - 1, this._y);
  }

  /**
   * Erase from current position to start of the line.
   *
   * @returns {Canvas}
   * @example
   * canvas.eraseToStart();
   */
  eraseToStart() {
    return this.erase(0, this._y, this._x, this._y);
  }

  /**
   * Erase from current line to down.
   *
   * @returns {Canvas}
   * @example
   * canvas.eraseToDown();
   */
  eraseToDown() {
    return this.erase(0, this._y, this._width - 1, this._height - 1);
  }

  /**
   * Erase from current line to up.
   *
   * @returns {Canvas}
   * @example
   * canvas.eraseToUp();
   */
  eraseToUp() {
    return this.erase(0, 0, this._width - 1, this._y);
  }

  /**
   * Erase current line.
   *
   * @returns {Canvas}
   * @example
   * canvas.eraseLine();
   */
  eraseLine() {
    return this.erase(0, this._y, this._width - 1, this._y);
  }

  /**
   * Erase the entire screen.
   *
   * @returns {Canvas}
   * @example
   * canvas.eraseScreen();
   */
  eraseScreen() {
    return this.erase(0, 0, this._width - 1, this._height - 1);
  }

  /**
   * Save current terminal state into the buffer.
   * Applies immediately without calling {@link flush} method.
   *
   * @returns {Canvas}
   * @example
   * canvas.saveScreen();
   */
  saveScreen() {
    this._stream.write(encodeToVT100('[?47h'));
    return this;
  }

  /**
   * Restore terminal state from the buffer.
   * Applies immediately without calling {@link flush}.
   *
   * @returns {Canvas}
   * @example
   * canvas.restoreScreen();
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
   * @example
   * canvas.hideCursor();
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
   * @example
   * canvas.showCursor();
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
   * @example
   * canvas.reset();
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

module.exports = Canvas;
