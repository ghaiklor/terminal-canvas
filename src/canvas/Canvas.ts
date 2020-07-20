import { Color, IColor } from '../color/Color';
import { Cell } from '../cell/Cell';
import { ICanvasOptions } from './CanvasOptions';
import { IDisplayOptions } from '../cell/DisplayOptions';
import { WriteStream } from 'tty';
import { encodeToVT100 } from '../encodeToVT100';

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
export class Canvas implements ICanvasOptions {
  public readonly cells: Cell[];
  public lastFrame: string[];
  public stream: WriteStream = process.stdout;
  public width: number;
  public height: number;
  public cursorX = 0;
  public cursorY = 0;
  public cursorBackground: IColor = { r: -1, g: -1, b: -1 };
  public cursorForeground: IColor = { r: -1, g: -1, b: -1 };
  public cursorDisplay: IDisplayOptions = {
    blink: false,
    bold: false,
    dim: false,
    hidden: false,
    reverse: false,
    underlined: false,
  };

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
  public constructor (options?: Partial<ICanvasOptions>) {
    if (typeof options?.stream !== 'undefined') {
      this.stream = options.stream;
    }

    this.width = this.stream.columns;
    if (typeof options?.width !== 'undefined') {
      this.width = options.width;
    }

    this.height = this.stream.rows;
    if (typeof options?.height !== 'undefined') {
      this.height = options.height;
    }

    this.cells = Array
      .from<Cell>({ length: this.width * this.height })
      .map((_, index) => new Cell(' ', { x: this.getXYFromPointer(index)[0], y: this.getXYFromPointer(index)[1] }));

    this.lastFrame = Array.from<string>({ length: this.width * this.height }).fill('');
  }

  /**
   * Wrapper around `new Canvas()`.
   *
   * @static
   * @returns {Canvas}
   */
  public static create (options?: Partial<ICanvasOptions>): Canvas {
    return new this(options);
  }

  /**
   * Write to the buffer.
   * It doesn't apply immediately, but stores in virtual terminal that represented as array of {@link Cell} instances.
   * For applying changes, you need to call {@link flush} method.
   *
   * @param {String} data Data to write to the terminal
   * @returns {Canvas}
   * @example
   * canvas.write('Hello, world').flush();
   */
  public write (data: string): Canvas {
    const { width, height } = this;
    const background = this.cursorBackground;
    const foreground = this.cursorForeground;
    const display = this.cursorDisplay;

    for (const char of data) {
      const x = this.cursorX;
      const y = this.cursorY;
      const pointer = this.getPointerFromXY(x, y);

      if (x >= 0 && x < width && y >= 0 && y < height) {
        const cell = this.cells[pointer];

        cell.setChar(char);
        cell.setX(x);
        cell.setY(y);
        cell.setBackground(background.r, background.g, background.b);
        cell.setForeground(foreground.r, foreground.g, foreground.b);
        cell.setDisplay(display);
        cell.isModified = true;
      }

      this.cursorX += 1;
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
  public flush (): Canvas {
    let payload = '';

    for (let i = 0; i < this.cells.length; i += 1) {
      const cell = this.cells[i];

      if (cell.isModified) {
        cell.isModified = false;
        const cellSeq = cell.toString();

        if (cellSeq !== this.lastFrame[i]) {
          this.lastFrame[i] = cellSeq;
          payload += cellSeq;
        }
      }
    }

    this.stream.write(payload);

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
  public getPointerFromXY (x: number = this.cursorX, y: number = this.cursorY): number {
    return y * this.width + x;
  }

  /**
   * Get (x, y) coordinate from the virtual terminal pointer.
   *
   * @param {Number} index Index in the buffer
   * @returns {Array} Returns an array [x, y]
   * @example
   * canvas.getXYFromPointer(0); // returns [0, 0]
   */
  public getXYFromPointer (index: number): [number, number] {
    return [index - Math.floor(index / this.width) * this.width, Math.floor(index / this.width)];
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
  public up (y = 1): Canvas {
    this.cursorY -= Math.floor(y);
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
  public down (y = 1): Canvas {
    this.cursorY += Math.floor(y);
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
  public right (x = 1): Canvas {
    this.cursorX += Math.floor(x);
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
  public left (x = 1): Canvas {
    this.cursorX -= Math.floor(x);
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
  public moveBy (x: number, y: number): Canvas {
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
  public moveTo (x: number, y: number): Canvas {
    this.cursorX = Math.floor(x);
    this.cursorY = Math.floor(y);

    return this;
  }

  /**
   * Set the foreground color.
   * This color is used when text is rendering.
   *
   * @param {String} color Color name, rgb, hex or none if you want to disable foreground filling
   * @returns {Canvas}
   * @example
   * canvas.foreground('white');
   * canvas.foreground('#000000');
   * canvas.foreground('rgb(255, 255, 255)');
   * canvas.foreground('none'); // disables foreground filling (will be used default filling)
   */
  public foreground (color: string): Canvas {
    this.cursorForeground = color === 'none' ? { r: -1, g: -1, b: -1 } : Color.create(color).toRgb();
    return this;
  }

  /**
   * Set the background color.
   * This color is used for filling the whole cell in the TTY.
   *
   * @param {String} color Color name, rgb, hex or none if you want to disable background filling
   * @returns {Canvas}
   * @example
   * canvas.background('white');
   * canvas.background('#000000');
   * canvas.background('rgb(255, 255, 255)');
   * canvas.background('none'); // disables background filling (will be used default filling)
   */
  public background (color: string): Canvas {
    this.cursorBackground = color === 'none' ? { r: -1, g: -1, b: -1 } : Color.create(color).toRgb();
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
  public bold (isBold = true): Canvas {
    this.cursorDisplay.bold = isBold;
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
  public dim (isDim = true): Canvas {
    this.cursorDisplay.dim = isDim;
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
  public underlined (isUnderlined = true): Canvas {
    this.cursorDisplay.underlined = isUnderlined;
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
  public blink (isBlink = true): Canvas {
    this.cursorDisplay.blink = isBlink;
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
  public reverse (isReverse = true): Canvas {
    this.cursorDisplay.reverse = isReverse;
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
  public hidden (isHidden = true): Canvas {
    this.cursorDisplay.hidden = isHidden;
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
  public erase (x1: number, y1: number, x2: number, y2: number): Canvas {
    for (let y = y1; y <= y2; y += 1) {
      for (let x = x1; x <= x2; x += 1) {
        const pointer = this.getPointerFromXY(x, y);
        this.cells[pointer]?.reset();
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
  public eraseToEnd (): Canvas {
    return this.erase(this.cursorX, this.cursorY, this.width - 1, this.cursorY);
  }

  /**
   * Erase from current position to start of the line.
   *
   * @returns {Canvas}
   * @example
   * canvas.eraseToStart();
   */
  public eraseToStart (): Canvas {
    return this.erase(0, this.cursorY, this.cursorX, this.cursorY);
  }

  /**
   * Erase from current line to down.
   *
   * @returns {Canvas}
   * @example
   * canvas.eraseToDown();
   */
  public eraseToDown (): Canvas {
    return this.erase(0, this.cursorY, this.width - 1, this.height - 1);
  }

  /**
   * Erase from current line to up.
   *
   * @returns {Canvas}
   * @example
   * canvas.eraseToUp();
   */
  public eraseToUp (): Canvas {
    return this.erase(0, 0, this.width - 1, this.cursorY);
  }

  /**
   * Erase current line.
   *
   * @returns {Canvas}
   * @example
   * canvas.eraseLine();
   */
  public eraseLine (): Canvas {
    return this.erase(0, this.cursorY, this.width - 1, this.cursorY);
  }

  /**
   * Erase the entire screen.
   *
   * @returns {Canvas}
   * @example
   * canvas.eraseScreen();
   */
  public eraseScreen (): Canvas {
    return this.erase(0, 0, this.width - 1, this.height - 1);
  }

  /**
   * Save current terminal state into the buffer.
   * Applies immediately without calling {@link flush} method.
   *
   * @returns {Canvas}
   * @example
   * canvas.saveScreen();
   */
  public saveScreen (): Canvas {
    this.stream.write(encodeToVT100('[?47h'));
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
  public restoreScreen (): Canvas {
    this.stream.write(encodeToVT100('[?47l'));
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
  public hideCursor (): Canvas {
    this.stream.write(encodeToVT100('[?25l'));
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
  public showCursor (): Canvas {
    this.stream.write(encodeToVT100('[?25h'));
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
  public reset (): Canvas {
    this.stream.write(encodeToVT100('c'));
    return this;
  }
}
