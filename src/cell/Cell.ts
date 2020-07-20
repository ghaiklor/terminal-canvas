import { DISPLAY_MODES } from './DisplayModes';
import { ICellOptions } from './CellOptions';
import { IColor } from '../color/Color';
import { IDisplayOptions } from './DisplayOptions';
import { encodeToVT100 } from '../encodeToVT100';

/**
 * Wrapper for one cell in the terminal.
 * It is used for converting abstract configuration of the cell to the real control sequence.
 *
 * @since 2.0.0
 */
export class Cell implements ICellOptions {
  public isModified = false;
  public char = ' ';
  public x = 0;
  public y = 0;
  public background: IColor = { r: -1, g: -1, b: -1 };
  public foreground: IColor = { r: -1, g: -1, b: -1 };
  public display: IDisplayOptions = {
    blink: false,
    bold: false,
    dim: false,
    hidden: false,
    reverse: false,
    underlined: false,
  };

  /**
   * Create Cell instance which are able to convert itself to ASCII control sequence.
   *
   * @constructor
   * @param {String} char Char that you want to wrap with control sequence
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
  public constructor (char: string, options?: Partial<ICellOptions>) {
    this.setChar(char);

    if (typeof options?.x !== 'undefined') {
      this.setX(options.x);
    }

    if (typeof options?.y !== 'undefined') {
      this.setY(options.y);
    }

    if (typeof options?.background !== 'undefined') {
      this.setBackground(options.background.r, options.background.g, options.background.b);
    }

    if (typeof options?.foreground !== 'undefined') {
      this.setForeground(options.foreground.r, options.foreground.g, options.foreground.b);
    }

    if (typeof options?.display !== 'undefined') {
      this.setDisplay(options.display);
    }
  }

  /**
   * Wrapper around `new Cell()`.
   *
   * @static
   * @returns {Cell}
   */
  public static create (char: string, options?: Partial<ICellOptions>): Cell {
    return new this(char, options);
  }

  /**
   * Returns current character in the cell.
   *
   * @returns {String}
   */
  public getChar (): string {
    return this.char;
  }

  /**
   * Updates the cell with the newly specified character.
   *
   * @param {String} char Char to update in the cell
   */
  public setChar (char: string): Cell {
    this.char = char.slice(0, 1);
    return this;
  }

  /**
   * Get X coordinate of the cell.
   *
   * @returns {Number}
   */
  public getX (): number {
    return this.x;
  }

  /**
   * Set X coordinate.
   *
   * @param {Number} x X coordinate of the cell
   */
  public setX (x: number): Cell {
    this.x = Math.floor(x);
    return this;
  }

  /**
   * Get Y coordinate of the cell.
   *
   * @returns {Number}
   */
  public getY (): number {
    return this.y;
  }

  /**
   * Set Y coordinate.
   *
   * @param {Number} y Y coordinate of the cell
   */
  public setY (y: number): Cell {
    this.y = Math.floor(y);
    return this;
  }

  /**
   * Get current background options of the cell.
   *
   * @returns {IColor}
   */
  public getBackground (): IColor {
    return this.background;
  }

  /**
   * Set a new background for the cell.
   *
   * @param {IColor} background Color to set on the background of the cell
   */
  public setBackground (r: number, g: number, b: number): Cell {
    this.background = { r, g, b };
    return this;
  }

  /**
   * Reset background for the cell.
   *
   * @returns {Cell}
   */
  public resetBackground (): Cell {
    this.background = { r: -1, g: -1, b: -1 };
    return this;
  }

  /**
   * Get current foreground options of the cell.
   *
   * @returns {IColor}
   */
  public getForeground (): IColor {
    return this.foreground;
  }

  /**
   * Set a new foreground for the cell.
   *
   * @param {IColor} foreground Color to set on the foreground of the cell
   */
  public setForeground (r: number, g: number, b: number): Cell {
    this.foreground = { r, g, b };
    return this;
  }

  /**
   * Resets foreground for the cell.
   *
   * @returns {Cell}
   */
  public resetForeground (): Cell {
    this.foreground = { r: -1, g: -1, b: -1 };
    return this;
  }

  /**
   * Get display characteristics of the cell.
   *
   * @returns {IDisplayOptions}
   */
  public getDisplay (): IDisplayOptions {
    return this.display;
  }

  /**
   * Updates display characteristics of the cell.
   *
   * @param {IDisplayOptions} display Options for the display characteristics of the character in cell
   */
  public setDisplay (display: Partial<IDisplayOptions>): Cell {
    this.display = {
      blink: typeof display.blink === 'undefined' ? false : display.blink,
      bold: typeof display.bold === 'undefined' ? false : display.bold,
      dim: typeof display.dim === 'undefined' ? false : display.dim,
      hidden: typeof display.hidden === 'undefined' ? false : display.hidden,
      reverse: typeof display.reverse === 'undefined' ? false : display.reverse,
      underlined: typeof display.underlined === 'undefined' ? false : display.underlined,
    };

    return this;
  }

  /**
   * Resets display characteristics for the cell.
   *
   * @returns {Cell}
   */
  public resetDisplay (): Cell {
    this.display = {
      blink: false,
      bold: false,
      dim: false,
      hidden: false,
      reverse: false,
      underlined: false,
    };

    return this;
  }

  /**
   * Reset all display settings for the cell.
   * It resets char, background, foreground and display mode.
   *
   * @returns {Cell}
   */
  public reset (): Cell {
    this.setChar(' ');
    this.resetBackground();
    this.resetForeground();
    this.resetDisplay();
    this.isModified = true;

    return this;
  }

  /**
   * Convert cell to VT100 control sequence.
   *
   * @returns {String}
   */
  public toString (): string {
    const { background, foreground, char, y, x } = this;
    const { bold, dim, underlined, blink, reverse, hidden } = this.display;

    return (
      encodeToVT100(`[${y + 1};${x + 1}f`) +
      (background.r > -1 ? encodeToVT100(`[48;2;${background.r};${background.g};${background.b}m`) : '') +
      (foreground.r > -1 ? encodeToVT100(`[38;2;${foreground.r};${foreground.g};${foreground.b}m`) : '') +
      (bold ? encodeToVT100(`[${DISPLAY_MODES.BOLD}m`) : '') +
      (dim ? encodeToVT100(`[${DISPLAY_MODES.DIM}m`) : '') +
      (underlined ? encodeToVT100(`[${DISPLAY_MODES.UNDERLINED}m`) : '') +
      (blink ? encodeToVT100(`[${DISPLAY_MODES.BLINK}m`) : '') +
      (reverse ? encodeToVT100(`[${DISPLAY_MODES.REVERSE}m`) : '') +
      (hidden ? encodeToVT100(`[${DISPLAY_MODES.HIDDEN}m`) : '') +
      char +
      encodeToVT100(`[${DISPLAY_MODES.RESET_ALL}m`)
    );
  }
}
