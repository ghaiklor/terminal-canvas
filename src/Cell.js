import { DISPLAY_MODES } from './util/displayModes';
import { encodeToVT100 } from './util/encodeToVT100';

export default class Cell {
  /**
   * Convert cell to string with all control codes needed for rendering the cell.
   *
   * @param {String} char Char that you want to wrap with control sequence
   * @param {Object} options Options object where you can set additional style to char
   * @param {Number} options.x X coordinate
   * @param {Number} options.y Y coordinate
   * @param {String} [options.background] Background color
   * @param {String} [options.foreground] Foreground color
   * @param {Object} [options.display] Object with display modes
   * @returns {String} Returns ready to flush string with ASCII control codes
   */
  constructor(char, options = {}) {
    this.setChar(char);
    this.setOptions(options);
  }

  getChar() {
    return this._char;
  }

  setChar(char) {
    this._char = char.slice(0, 1);
    return this;
  }

  getOptions() {
    return this._options;
  }

  setOptions(options = {}) {
    this._options = options;
    return this;
  }

  toString() {
    const {x, y, background, foreground, display = {}} = this.getOptions();

    return (
      encodeToVT100(`[${Math.floor(y + 1)};${Math.floor(x + 1)}f`) +
      (background ? encodeToVT100(`[48;2;${background.r};${background.g};${background.b}m`) : '') +
      (foreground ? encodeToVT100(`[38;2;${foreground.r};${foreground.g};${foreground.b}m`) : '') +
      (Object.keys(display).filter(i => display[i]).map(i => encodeToVT100(`[${DISPLAY_MODES[i.toUpperCase()]}m`)).join('')) +
      this.getChar() +
      encodeToVT100(`[${DISPLAY_MODES.RESET_ALL}m`)
    );
  }

  static create(...args) {
    return new this(...args);
  }
}
