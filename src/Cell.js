import { DISPLAY_MODES } from './util/displayModes';
import { encodeToVT100 } from './util/encodeToVT100';

/**
 * Wrapper around one cell in the terminal.
 * Used for filling terminal wrapper in the cursor.
 *
 * @since 3.1.0
 */
export default class Cell {
  /**
   * Create Cell instance which are able to convert itself to ASCII control sequence.
   *
   * @constructor
   * @param {String} char Char that you want to wrap with control sequence
   * @param {Object} options Options object where you can set additional style to char
   * @param {Number} options.x X coordinate
   * @param {Number} options.y Y coordinate
   * @param {Object|Boolean} [options.background] Background color, false if you don't want to fill background
   * @param {Number} [options.background.r] Red channel
   * @param {Number} [options.background.g] Green channel
   * @param {Number} [options.background.b] Blue channel
   * @param {Object|Boolean} [options.foreground] Foreground color, false if you don't want to fill foreground
   * @param {Number} [options.foreground.r] Red channel
   * @param {Number} [options.foreground.g] Green channel
   * @param {Number} [options.foreground.b] Blue channel
   * @param {Object|Boolean} [options.display] Object with display modes, false if you don't want change display mode
   * @param {Boolean} [options.display.bold] Bold style
   * @param {Boolean} [options.display.dim] Dim style
   * @param {Boolean} [options.display.underlined] Underlined style
   * @param {Boolean} [options.display.blink] Blink style
   * @param {Boolean} [options.display.reverse] Reverse style
   * @param {Boolean} [options.display.hidden] Hidden style
   */
  constructor(char, options) {
    const {x, y, background = false, foreground = false, display = false} = options;

    this.setChar(char);
    this.setX(x);
    this.setY(y);
    this.setBackground(background);
    this.setForeground(foreground);
    this.setDisplay(display);
  }

  /**
   * Get current char.
   *
   * @returns {String}
   */
  getChar() {
    return this._char;
  }

  /**
   * Set new char to cell.
   *
   * @param {String} [char]
   * @returns {Cell}
   */
  setChar(char = ' ') {
    this._char = char.slice(0, 1);
    return this;
  }

  /**
   * Get X coordinate of this cell.
   *
   * @returns {Number}
   */
  getX() {
    return this._x;
  }

  /**
   * Set new X coordinate for cell.
   *
   * @param {Number} [x]
   * @returns {Cell}
   */
  setX(x = 0) {
    this._x = Math.floor(x);
    return this;
  }

  /**
   * Get Y coordinate.
   *
   * @returns {Number}
   */
  getY() {
    return this._y;
  }

  /**
   * Set new Y coordinate for cell.
   *
   * @param {Number} [y]
   * @returns {Cell}
   */
  setY(y = 0) {
    this._y = Math.floor(y);
    return this;
  }

  /**
   * Get current background color.
   *
   * @returns {{r: Number, g: Number, b: Number}|Boolean}
   */
  getBackground() {
    return this._background;
  }

  /**
   * Set new background color.
   *
   * @param {Object|Boolean} [background] False if you don't want use background
   * @param {Number} [background.r] Red channel
   * @param {Number} [background.g] Green channel
   * @param {Number} [background.b] Blue channel
   * @returns {Cell}
   */
  setBackground(background = false) {
    this._background = background;
    return this;
  }

  /**
   * Get current foreground color.
   *
   * @returns {{r: Number, g: Number, b: Number}|Boolean}
   */
  getForeground() {
    return this._foreground;
  }

  /**
   * Set new foreground color.
   *
   * @param {Object|Boolean} [foreground] False if you don't want use foreground
   * @param {Number} [foreground.r] Red channel
   * @param {Number} [foreground.g] Green channel
   * @param {Number} [foreground.b] Blue channel
   * @returns {Cell}
   */
  setForeground(foreground = false) {
    this._foreground = foreground;
    return this;
  }

  /**
   * Get current display modes.
   *
   * @returns {Object}
   */
  getDisplay() {
    return this._display;
  }

  /**
   * Set new display modes to cell.
   *
   * @param {Object|Boolean} display False, if you don't want to use display modes
   * @param {Boolean} [display.bold] Bold style
   * @param {Boolean} [display.dim] Dim style
   * @param {Boolean} [display.underlined] Underlined style
   * @param {Boolean} [display.blink] Blink style
   * @param {Boolean} [display.reverse] Reverse style
   * @param {Boolean} [display.hidden] Hidden style
   * @returns {Cell}
   */
  setDisplay(display = false) {
    this._display = display;
    return this;
  }

  /**
   * Convert cell to ASCII control sequence.
   *
   * @returns {String}
   */
  toString() {
    const [char, x, y, background, foreground, display] = [this.getChar(), this.getX(), this.getY(), this.getBackground(), this.getForeground(), this.getDisplay()];

    return (
      encodeToVT100(`[${y + 1};${x + 1}f`) +
      (background ? encodeToVT100(`[48;2;${background.r};${background.g};${background.b}m`) : '') +
      (foreground ? encodeToVT100(`[38;2;${foreground.r};${foreground.g};${foreground.b}m`) : '') +
      (display ? Object.keys(display).filter(i => display[i]).map(i => encodeToVT100(`[${DISPLAY_MODES[i.toUpperCase()]}m`)).join('') : '') +
      char +
      encodeToVT100(`[${DISPLAY_MODES.RESET_ALL}m`)
    );
  }

  /**
   * Wrapper around `new Cell()`.
   *
   * @static
   * @returns {Cell}
   */
  static create(...args) {
    return new this(...args);
  }
}
