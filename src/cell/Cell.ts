import { encodeToVT100 } from '../encodeToVT100';
import { CellOptions } from './CellOptions';
import { IColor } from '../color/Color';
import { DisplayOptions } from './DisplayOptions';
import { DISPLAY_MODES } from './DisplayModes';

/**
 * Wrapper around one cell in the terminal.
 * Used for filling terminal wrapper in the cursor.
 *
 * @since 2.0.0
 */
export class Cell implements CellOptions {
  private _char = ' ';
  private _x = 0;
  private _y = 0;
  public background: IColor = { r: -1, g: -1, b: -1 };
  public foreground: IColor = { r: -1, g: -1, b: -1 };
  public display: DisplayOptions = { bold: false, dim: false, underlined: false, blink: false, reverse: false, hidden: false };
  public isModified = false;

  /**
   * Create Cell instance which are able to convert itself to ASCII control sequence.
   *
   * @constructor
   * @param {String} [char] Char that you want to wrap with control sequence
   * @param {Object} [options] Options object where you can set additional style to char
   * @param {Number} [options.x] X coordinate
   * @param {Number} [options.y] Y coordinate
   * @param {Object} [options.background] Background color, fill with -1 if you don't want to use background
   * @param {Number} [options.background.r] Red channel
   * @param {Number} [options.background.g] Green channel
   * @param {Number} [options.background.b] Blue channel
   * @param {Object} [options.foreground] Foreground color, fill with -1 if you don't want to use foreground
   * @param {Number} [options.foreground.r] Red channel
   * @param {Number} [options.foreground.g] Green channel
   * @param {Number} [options.foreground.b] Blue channel
   * @param {Object} [options.display] Object with display modes
   * @param {Boolean} [options.display.bold] Bold style
   * @param {Boolean} [options.display.dim] Dim style
   * @param {Boolean} [options.display.underlined] Underlined style
   * @param {Boolean} [options.display.blink] Blink style
   * @param {Boolean} [options.display.reverse] Reverse style
   * @param {Boolean} [options.display.hidden] Hidden style
   */
  constructor (char: string, options?: Partial<CellOptions>) {
    this.char = char;

    if (options !== undefined) {
      if (options.x !== undefined) {
        this.x = options.x;
      }

      if (options.y !== undefined) {
        this.y = options.y;
      }

      if (options.background !== undefined) {
        this.background = options.background;
      }

      if (options.foreground !== undefined) {
        this.foreground = options.foreground;
      }

      if (options.display !== undefined) {
        this.display = options.display;
      }
    }
  }

  get char (): string {
    return this._char;
  }

  set char (char) {
    this._char = char.slice(0, 1);
  }

  get x () {
    return this._x;
  }

  set x (x) {
    this._x = Math.floor(x);
  }

  get y () {
    return this._y;
  }

  set y (y) {
    this._y = Math.floor(y);
  }

  /**
   * Reset display settings.
   * It resets char, background, foreground and display mode.
   *
   * @returns {Cell}
   */
  reset () {
    this.char = ' ';
    this.background = { r: -1, g: -1, b: -1 };
    this.foreground = { r: -1, g: -1, b: -1 };
    this.display = { bold: false, dim: false, underlined: false, blink: false, reverse: false, hidden: false };
    this.isModified = true;
  }

  /**
   * Convert cell to ASCII control sequence.
   * Disables flag which marks cell as modified.
   *
   * @returns {String}
   */
  toString () {
    return (
      encodeToVT100(`[${this.y + 1};${this.x + 1}f`) +
      (this.background.r > -1 ? encodeToVT100(`[48;2;${this.background.r};${this.background.g};${this.background.b}m`) : '') +
      (this.foreground.r > -1 ? encodeToVT100(`[38;2;${this.foreground.r};${this.foreground.g};${this.foreground.b}m`) : '') +
      (this.display.bold ? encodeToVT100(`[${DISPLAY_MODES.BOLD}m`) : '') +
      (this.display.dim ? encodeToVT100(`[${DISPLAY_MODES.DIM}m`) : '') +
      (this.display.underlined ? encodeToVT100(`[${DISPLAY_MODES.UNDERLINED}m`) : '') +
      (this.display.blink ? encodeToVT100(`[${DISPLAY_MODES.BLINK}m`) : '') +
      (this.display.reverse ? encodeToVT100(`[${DISPLAY_MODES.REVERSE}m`) : '') +
      (this.display.hidden ? encodeToVT100(`[${DISPLAY_MODES.HIDDEN}m`) : '') +
      this.char +
      encodeToVT100(`[${DISPLAY_MODES.RESET_ALL}m`)
    );
  }

  /**
   * Wrapper around `new Cell()`.
   *
   * @static
   * @returns {Cell}
   */
  static create (char: string, options?: Partial<CellOptions>) {
    return new this(char, options);
  }
}
