import { Cell } from '../../src/cell/Cell';

describe('Cell', () => {
  it('Should properly create cell with default arguments', () => {
    const cell = new Cell(' ');

    expect(cell.char).toEqual(' ');
    expect(cell.x).toEqual(0);
    expect(cell.y).toEqual(0);
    expect(cell.background).toEqual({ r: -1, g: -1, b: -1 });
    expect(cell.foreground).toEqual({ r: -1, g: -1, b: -1 });
    expect(cell.display).toEqual({
      bold: false,
      dim: false,
      underlined: false,
      blink: false,
      reverse: false,
      hidden: false
    });
  });

  it('Should properly create cell with custom arguments', () => {
    const cell = new Cell('s', {
      x: 10,
      y: 20,
      background: { r: 1, g: 2, b: 3 },
      foreground: { r: 4, g: 5, b: 6 },
      display: { bold: true }
    });

    expect(cell.char).toEqual('s');
    expect(cell.x).toEqual(10);
    expect(cell.y).toEqual(20);
    expect(cell.background).toEqual({ r: 1, g: 2, b: 3 });
    expect(cell.foreground).toEqual({ r: 4, g: 5, b: 6 });
    expect(cell.display).toEqual({
      bold: true,
      dim: false,
      underlined: false,
      blink: false,
      reverse: false,
      hidden: false
    });
  });

  it('Should properly create cell with custom X argument', () => {
    const cell = new Cell('s', { x: 10 });

    expect(cell.char).toEqual('s');
    expect(cell.x).toEqual(10);
    expect(cell.y).toEqual(0);
  });

  it('Should properly create cell with custom Y argument', () => {
    const cell = new Cell('s', { y: 10 });

    expect(cell.char).toEqual('s');
    expect(cell.x).toEqual(0);
    expect(cell.y).toEqual(10);
  });

  it('Should properly get/set char', () => {
    const cell = new Cell(' ');

    expect(cell.getChar()).toEqual(' ');
    expect(cell.setChar('t')).toBeInstanceOf(Cell);
    expect(cell.getChar()).toEqual('t');
    expect(cell.setChar('long text')).toBeInstanceOf(Cell);
    expect(cell.getChar()).toEqual('l');
  });

  it('Should properly get/set X coordinate', () => {
    const cell = new Cell(' ');

    expect(cell.getX()).toEqual(0);
    expect(cell.setX(40)).toBeInstanceOf(Cell);
    expect(cell.getX()).toEqual(40);
    expect(cell.setX(50.99)).toBeInstanceOf(Cell);
    expect(cell.getX()).toEqual(50);
  });

  it('Should properly get/set Y coordinate', () => {
    const cell = new Cell(' ');

    expect(cell.getY()).toEqual(0);
    expect(cell.setY(40)).toBeInstanceOf(Cell);
    expect(cell.getY()).toEqual(40);
    expect(cell.setY(50.99)).toBeInstanceOf(Cell);
    expect(cell.getY()).toEqual(50);
  });

  it('Should properly get/set background color', () => {
    const cell = new Cell(' ');

    expect(cell.getBackground()).toEqual({ r: -1, g: -1, b: -1 });
    expect(cell.setBackground(0, 100, 200)).toBeInstanceOf(Cell);
    expect(cell.getBackground()).toEqual({ r: 0, g: 100, b: 200 });
    expect(cell.resetBackground()).toBeInstanceOf(Cell);
    expect(cell.getBackground()).toEqual({ r: -1, g: -1, b: -1 });
  });

  it('Should properly get/set foreground color', () => {
    const cell = new Cell(' ');

    expect(cell.getForeground()).toEqual({ r: -1, g: -1, b: -1 });
    expect(cell.setForeground(0, 100, 200)).toBeInstanceOf(Cell);
    expect(cell.getForeground()).toEqual({ r: 0, g: 100, b: 200 });
    expect(cell.resetForeground()).toBeInstanceOf(Cell);
    expect(cell.getForeground()).toEqual({ r: -1, g: -1, b: -1 });
  });

  it('Should properly get/set display modes', () => {
    const cell = new Cell(' ');

    expect(cell.getDisplay()).toEqual({
      bold: false,
      dim: false,
      underlined: false,
      blink: false,
      reverse: false,
      hidden: false
    });

    expect(cell.setDisplay({
      bold: true,
      dim: false,
      underlined: true,
      blink: false,
      reverse: false,
      hidden: false
    })).toBeInstanceOf(Cell);

    expect(cell.getDisplay()).toEqual({
      bold: true,
      dim: false,
      underlined: true,
      blink: false,
      reverse: false,
      hidden: false
    });

    expect(cell.resetDisplay()).toBeInstanceOf(Cell);
    expect(cell.getDisplay()).toEqual({
      bold: false,
      dim: false,
      underlined: false,
      blink: false,
      reverse: false,
      hidden: false
    });
  });

  it('Should properly set display options if display is an empty object', () => {
    const cell = new Cell('s', { display: {} });

    expect(cell.display).toEqual({
      bold: false,
      dim: false,
      underlined: false,
      blink: false,
      reverse: false,
      hidden: false
    });
  });

  it('Should properly reset the cell contents and display settings', () => {
    const cell = new Cell('s', {
      x: 10,
      y: 20,
      background: { r: 1, g: 2, b: 3 },
      foreground: { r: 4, g: 5, b: 6 },
      display: { bold: true, dim: true, underlined: true, blink: true, reverse: true, hidden: true }
    });

    expect(cell.char).toEqual('s');
    expect(cell.x).toEqual(10);
    expect(cell.y).toEqual(20);
    expect(cell.background).toEqual({ r: 1, g: 2, b: 3 });
    expect(cell.foreground).toEqual({ r: 4, g: 5, b: 6 });
    expect(cell.display).toEqual({
      bold: true,
      dim: true,
      underlined: true,
      blink: true,
      reverse: true,
      hidden: true
    });

    expect(cell.reset()).toBeInstanceOf(Cell);
    expect(cell.char).toEqual(' ');
    expect(cell.x).toEqual(10);
    expect(cell.y).toEqual(20);
    expect(cell.background).toEqual({ r: -1, g: -1, b: -1 });
    expect(cell.foreground).toEqual({ r: -1, g: -1, b: -1 });
    expect(cell.display).toEqual({
      bold: false,
      dim: false,
      underlined: false,
      blink: false,
      reverse: false,
      hidden: false
    });
  });

  it('Should properly convert Cell into ASCII sequence', () => {
    const cell = new Cell(' ');

    expect(cell.toString()).toEqual('\u001b[1;1f \u001b[0m');
    expect(cell.setX(20)).toBeInstanceOf(Cell);
    expect(cell.toString()).toEqual('\u001b[1;21f \u001b[0m');
    expect(cell.setY(10)).toBeInstanceOf(Cell);
    expect(cell.toString()).toEqual('\u001b[11;21f \u001b[0m');
    expect(cell.setBackground(0, 100, 200)).toBeInstanceOf(Cell);
    expect(cell.toString()).toEqual('\u001b[11;21f\u001b[48;2;0;100;200m \u001b[0m');
    expect(cell.setForeground(200, 100, 0)).toBeInstanceOf(Cell);
    expect(cell.toString()).toEqual('\u001b[11;21f\u001b[48;2;0;100;200m\u001b[38;2;200;100;0m \u001b[0m');
    expect(cell.setDisplay({ bold: true, dim: true, underlined: true, blink: true, reverse: true, hidden: true })).toBeInstanceOf(Cell);
    expect(cell.toString()).toEqual('\u001b[11;21f\u001b[48;2;0;100;200m\u001b[38;2;200;100;0m\u001b[1m\u001b[2m\u001b[4m\u001b[5m\u001b[7m\u001b[8m \u001b[0m');
  });

  it('Should properly create Cell instance from static create()', () => {
    const cell = Cell.create('s', { x: 10, y: 20 });

    expect(cell.char).toEqual('s');
    expect(cell.x).toEqual(10);
    expect(cell.y).toEqual(20);
    expect(cell.background).toEqual({ r: -1, g: -1, b: -1 });
    expect(cell.foreground).toEqual({ r: -1, g: -1, b: -1 });
    expect(cell.display).toEqual({
      bold: false,
      dim: false,
      underlined: false,
      blink: false,
      reverse: false,
      hidden: false
    });
  });
});
