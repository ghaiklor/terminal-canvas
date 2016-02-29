import Cell from './Cell';
import Cursor from './Cursor';
import { encodeToVT100 } from './util/encodeToVT100';

export default class Terminal {
  constructor(stream, width, height) {
    this.setCursor(Cursor.create());
    this.setStream(stream);
    this.setWidth(width);
    this.setHeight(height);

    this._cells = Array.from({length: this.getWidth() * this.getHeight}).map(_ => Cell.create(' ', {x: 0, y: 0}));
  }

  getCell(x, y) {
    return this._cells[y * this._width + x];
  }

  updateCell(x, y) {
    const cell = this.getCell(x, y);
  }

  resetCell(x, y) {
    const cell = this.getCell(x, y);
    cell.setChar(' ').setBackground(false).setForeground(false).setDisplay(false);
    return this;
  }

  getCursor() {
    return this._cursor;
  }

  setCursor(cursor) {
    this._cursor = cursor;
    return this;
  }

  getStream() {
    return this._stream;
  }

  setStream(stream) {
    this._stream = stream;
    return this;
  }

  getWidth() {
    return this._width;
  }

  setWidth(width) {
    this._width = Math.floor(width);
    return this;
  }

  getHeight() {
    return this._height;
  }

  setHeight(height) {
    this._height = Math.floor(height);
    return this;
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
}
