import charm from 'charm';

export * from './colors';
export * from './eraseRegions';

/**
 * Cursor implements low-level API to terminal control codes.
 *
 * @see http://www.termsys.demon.co.uk/vtansi.htm
 * @since 1.0.0
 * @version 1.0.0
 */
export class Cursor {
  _cursor = charm();

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
    if (stdout.length > 0) stdout.reduce((cursor, pipe) => cursor.pipe(pipe), this._cursor);
    if (stdin.length > 0) stdin.reduce((cursor, pipe) => cursor.pipe(pipe)).pipe(this._cursor);
  }

  /**
   * Sets a listener on cursor stream.
   *
   * @param {String} event Event name
   * @param {Function} handler Handler for the specified event
   * @returns {Cursor}
   */
  on(event, handler) {
    this._cursor.on(event, handler);
    return this;
  }

  /**
   * Removes all listeners or specified listener from the event.
   *
   * If handler is not defined then removes all listeners from the specified event.
   *
   * @param {String} event Event name
   * @param {Function} [handler] Handler that you want to delete from the event
   * @returns {Cursor}
   */
  off(event, handler) {
    handler ? this._cursor.removeListener(event, handler) : this._cursor.removeAllListeners(event);
    return this;
  }

  /**
   * Write to the stream.
   * It can be whatever info you want, but usually it's just a text that you want to print out.
   *
   * @param {String} message Message to write to the stream
   * @returns {Cursor}
   */
  write(message) {
    this._cursor.write(message);
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
    this._cursor.position(x, y);
    return this;
  }

  /**
   * Get the cursor position in absolute coordinates.
   *
   * @returns {Promise}
   * @example
   * let cursor = new Cursor();
   *
   * // Old-fashioned way
   * cursor.getPosition().then(position => {x: position.x, y: position.y});
   *
   * // In async\await style
   * async function myMagicFunction() {
   *   let {x, y} = await cursor.getPosition();
   *   doSomethingWithPosition(x, y);
   * }
   */
  getPosition() {
    return new Promise((resolve, reject) => this._cursor.position((x, y) => resolve({x, y})));
  }

  /**
   * Move the cursor by the relative coordinates starting from the current position of cursor.
   *
   * @param {Number} x Coordinate X
   * @param {Number} y Coordinate Y
   * @returns {Cursor}
   */
  move(x, y) {
    this._cursor.move(x, y);
    return this;
  }

  /**
   * Move the cursor up.
   *
   * @param {Number} [y=1] Rows count
   * @returns {Cursor}
   */
  up(y = 1) {
    this._cursor.up(y);
    return this;
  }

  /**
   * Move the cursor down.
   *
   * @param {Number} [y=1] Rows count
   * @returns {Cursor}
   */
  down(y = 1) {
    this._cursor.down(y);
    return this;
  }

  /**
   * Move the cursor left.
   *
   * @param {Number} [x=1] Columns count
   * @returns {Cursor}
   */
  left(x = 1) {
    this._cursor.left(x);
    return this;
  }

  /**
   * Move the cursor right.
   *
   * @param {Number} [x=1] Columns count
   * @returns {Cursor}
   */
  right(x = 1) {
    this._cursor.right(x);
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
    this._cursor.erase(region);
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
    this._cursor.foreground(color);
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
    this._cursor.background(color);
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
    let filler = symbol.repeat(x2 - x1);

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
   * Set the cursor invisible.
   *
   * @returns {Cursor}
   */
  hide() {
    this._cursor.cursor(false);
    return this;
  }

  /**
   * Set the cursor visible.
   *
   * @returns {Cursor}
   */
  show() {
    this._cursor.cursor(true);
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
    this._cursor.reset();
    return this;
  }

  /**
   * Destroy the cursor.
   *
   * @returns {Cursor}
   */
  destroy() {
    this._cursor.destroy();
    return this;
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
