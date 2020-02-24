import { encodeToVT100 } from '../encodeToVT100';
import { ICellOptions } from './CellOptions';
import { IColor } from '../color/Color';
import { IDisplayOptions } from './DisplayOptions';
import { DISPLAY_MODES } from './DisplayModes';

/**
 * Wrapper around one cell in the terminal.
 * Used for filling terminal wrapper in the cursor.
 *
 * @since 2.0.0
 */
export class Cell implements ICellOptions {
  char = ' ';
  x = 0;
  y = 0;
  background: IColor = { r: -1, g: -1, b: -1 };
  foreground: IColor = { r: -1, g: -1, b: -1 };
  display: IDisplayOptions = { bold: false, dim: false, underlined: false, blink: false, reverse: false, hidden: false };
  isModified = false;

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
  constructor (char: string, options?: Partial<ICellOptions>) {
    this.setChar(char);

    if (options !== undefined) {
      if (options.x !== undefined) {
        this.setX(options.x);
      }

      if (options.y !== undefined) {
        this.setY(options.y);
      }

      if (options.background !== undefined) {
        this.setBackground(options.background.r, options.background.g, options.background.b);
      }

      if (options.foreground !== undefined) {
        this.setForeground(options.foreground.r, options.foreground.g, options.foreground.b);
      }

      if (options.display !== undefined) {
        this.setDisplay(options.display);
      }
    }
  }

  /**
   * Returns current character in the cell.
   */
  getChar (): string {
    return this.char;
  }

  /**
   * Updates the cell with the newly specified character.
   *
   * @param char Char to update in the cell
   */
  setChar (char: string): Cell {
    this.char = char.slice(0, 1);
    return this;
  }

  /**
   * Get X coordinate of the cell.
   */
  getX (): number {
    return this.x;
  }

  /**
   * Set X coordinate.
   *
   * @param x X coordinate of the cell
   */
  setX (x: number): Cell {
    this.x = Math.floor(x);
    return this;
  }

  /**
   * Get Y coordinate of the cell.
   */
  getY (): number {
    return this.y;
  }

  /**
   * Set Y coordinate.
   *
   * @param y Y coordinate of the cell
   */
  setY (y: number): Cell {
    this.y = Math.floor(y);
    return this;
  }

  /**
   * Get current background options of the cell.
   */
  getBackground (): IColor {
    return this.background;
  }

  /**
   * Set a new background for the cell.
   *
   * @param background Color to set on the background of the cell
   */
  setBackground (r: number, g: number, b: number): Cell {
    this.background = { r, g, b };
    return this;
  }

  /**
   * Reset background for the cell.
   */
  resetBackground (): Cell {
    this.background = { r: -1, g: -1, b: -1 };
    return this;
  }

  /**
   * Get current foreground options of the cell.
   */
  getForeground (): IColor {
    return this.foreground;
  }

  /**
   * Set a new foreground for the cell.
   *
   * @param foreground Color to set on the foreground of the cell
   */
  setForeground (r: number, g: number, b: number): Cell {
    this.foreground = { r, g, b };
    return this;
  }

  /**
   * Resets foreground for the cell.
   */
  resetForeground (): Cell {
    this.foreground = { r: -1, g: -1, b: -1 };
    return this;
  }

  /**
   * Get display characteristics of the cell.
   */
  getDisplay (): IDisplayOptions {
    return this.display;
  }

  /**
   * Updates display characteristics of the cell.
   *
   * @param display Options for the display characteristics of the character in cell
   */
  setDisplay (display: Partial<IDisplayOptions>): Cell {
    this.display = {
      bold: display.bold === undefined ? false : display.bold,
      dim: display.dim === undefined ? false : display.dim,
      underlined: display.underlined === undefined ? false : display.underlined,
      blink: display.blink === undefined ? false : display.blink,
      reverse: display.reverse === undefined ? false : display.reverse,
      hidden: display.hidden === undefined ? false : display.hidden
    };

    return this;
  }

  /**
   * Resets display characteristics for the cell.
   */
  resetDisplay (): Cell {
    this.display = { bold: false, dim: false, underlined: false, blink: false, reverse: false, hidden: false };
    return this;
  }

  /**
   * Reset display settings.
   * It resets char, background, foreground and display mode.
   *
   * @returns {Cell}
   */
  reset (): Cell {
    this.setChar(' ');
    this.resetBackground();
    this.resetForeground();
    this.resetDisplay();
    this.isModified = true;

    return this;
  }

  /**
   * Convert cell to ASCII control sequence.
   * Disables flag which marks cell as modified.
   *
   * @returns {String}
   */
  toString (): string {
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
  static create (char: string, options?: Partial<ICellOptions>): Cell {
    return new this(char, options);
  }
}
