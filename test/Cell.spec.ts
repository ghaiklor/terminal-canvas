import { Cell } from '../src/cell/Cell';

describe('cell', () => {
  it('should properly create cell with default arguments', () => {
    expect.hasAssertions();

    const cell = new Cell(' ');

    expect(cell.char).toStrictEqual(' ');
    expect(cell.x).toStrictEqual(0);
    expect(cell.y).toStrictEqual(0);
    expect(cell.background).toStrictEqual({ r: -1, g: -1, b: -1 });
    expect(cell.foreground).toStrictEqual({ r: -1, g: -1, b: -1 });
    expect(cell.display).toStrictEqual({
      blink: false,
      bold: false,
      dim: false,
      hidden: false,
      reverse: false,
      underlined: false,
    });
  });

  it('should properly create cell with custom arguments', () => {
    expect.hasAssertions();

    const cell = new Cell('s', {
      background: { r: 1, g: 2, b: 3 },
      display: { bold: true },
      foreground: { r: 4, g: 5, b: 6 },
      x: 10,
      y: 20,
    });

    expect(cell.char).toStrictEqual('s');
    expect(cell.x).toStrictEqual(10);
    expect(cell.y).toStrictEqual(20);
    expect(cell.background).toStrictEqual({ r: 1, g: 2, b: 3 });
    expect(cell.foreground).toStrictEqual({ r: 4, g: 5, b: 6 });
    expect(cell.display).toStrictEqual({
      blink: false,
      bold: true,
      dim: false,
      hidden: false,
      reverse: false,
      underlined: false,
    });
  });

  it('should properly create cell with custom X argument', () => {
    expect.hasAssertions();

    const cell = new Cell('s', { x: 10 });

    expect(cell.char).toStrictEqual('s');
    expect(cell.x).toStrictEqual(10);
    expect(cell.y).toStrictEqual(0);
  });

  it('should properly create cell with custom Y argument', () => {
    expect.hasAssertions();

    const cell = new Cell('s', { y: 10 });

    expect(cell.char).toStrictEqual('s');
    expect(cell.x).toStrictEqual(0);
    expect(cell.y).toStrictEqual(10);
  });

  it('should properly get/set char', () => {
    expect.hasAssertions();

    const cell = new Cell(' ');

    expect(cell.getChar()).toStrictEqual(' ');
    expect(cell.setChar('t')).toBeInstanceOf(Cell);
    expect(cell.getChar()).toStrictEqual('t');
    expect(cell.setChar('long text')).toBeInstanceOf(Cell);
    expect(cell.getChar()).toStrictEqual('l');
  });

  it('should properly get/set X coordinate', () => {
    expect.hasAssertions();

    const cell = new Cell(' ');

    expect(cell.getX()).toStrictEqual(0);
    expect(cell.setX(40)).toBeInstanceOf(Cell);
    expect(cell.getX()).toStrictEqual(40);
    expect(cell.setX(50.99)).toBeInstanceOf(Cell);
    expect(cell.getX()).toStrictEqual(50);
  });

  it('should properly get/set Y coordinate', () => {
    expect.hasAssertions();

    const cell = new Cell(' ');

    expect(cell.getY()).toStrictEqual(0);
    expect(cell.setY(40)).toBeInstanceOf(Cell);
    expect(cell.getY()).toStrictEqual(40);
    expect(cell.setY(50.99)).toBeInstanceOf(Cell);
    expect(cell.getY()).toStrictEqual(50);
  });

  it('should properly get/set background color', () => {
    expect.hasAssertions();

    const cell = new Cell(' ');

    expect(cell.getBackground()).toStrictEqual({ r: -1, g: -1, b: -1 });
    expect(cell.setBackground(0, 100, 200)).toBeInstanceOf(Cell);
    expect(cell.getBackground()).toStrictEqual({ r: 0, g: 100, b: 200 });
    expect(cell.resetBackground()).toBeInstanceOf(Cell);
    expect(cell.getBackground()).toStrictEqual({ r: -1, g: -1, b: -1 });
  });

  it('should properly get/set foreground color', () => {
    expect.hasAssertions();

    const cell = new Cell(' ');

    expect(cell.getForeground()).toStrictEqual({ r: -1, g: -1, b: -1 });
    expect(cell.setForeground(0, 100, 200)).toBeInstanceOf(Cell);
    expect(cell.getForeground()).toStrictEqual({ r: 0, g: 100, b: 200 });
    expect(cell.resetForeground()).toBeInstanceOf(Cell);
    expect(cell.getForeground()).toStrictEqual({ r: -1, g: -1, b: -1 });
  });

  it('should properly get/set display modes', () => {
    expect.hasAssertions();

    const cell = new Cell(' ');

    expect(cell.getDisplay()).toStrictEqual({
      blink: false,
      bold: false,
      dim: false,
      hidden: false,
      reverse: false,
      underlined: false,
    });

    expect(cell.setDisplay({
      blink: false,
      bold: true,
      dim: false,
      hidden: false,
      reverse: false,
      underlined: true,
    })).toBeInstanceOf(Cell);

    expect(cell.getDisplay()).toStrictEqual({
      blink: false,
      bold: true,
      dim: false,
      hidden: false,
      reverse: false,
      underlined: true,
    });

    expect(cell.resetDisplay()).toBeInstanceOf(Cell);
    expect(cell.getDisplay()).toStrictEqual({
      blink: false,
      bold: false,
      dim: false,
      hidden: false,
      reverse: false,
      underlined: false,
    });
  });

  it('should properly set display options if display is an empty object', () => {
    expect.hasAssertions();

    const cell = new Cell('s', { display: {} });

    expect(cell.display).toStrictEqual({
      blink: false,
      bold: false,
      dim: false,
      hidden: false,
      reverse: false,
      underlined: false,
    });
  });

  it('should properly reset the cell contents and display settings', () => {
    expect.hasAssertions();

    const cell = new Cell('s', {
      background: { r: 1, g: 2, b: 3 },
      display: { blink: true, bold: true, dim: true, hidden: true, reverse: true, underlined: true },
      foreground: { r: 4, g: 5, b: 6 },
      x: 10,
      y: 20,
    });

    expect(cell.char).toStrictEqual('s');
    expect(cell.x).toStrictEqual(10);
    expect(cell.y).toStrictEqual(20);
    expect(cell.background).toStrictEqual({ r: 1, g: 2, b: 3 });
    expect(cell.foreground).toStrictEqual({ r: 4, g: 5, b: 6 });
    expect(cell.display).toStrictEqual({
      blink: true,
      bold: true,
      dim: true,
      hidden: true,
      reverse: true,
      underlined: true,
    });

    expect(cell.reset()).toBeInstanceOf(Cell);
    expect(cell.char).toStrictEqual(' ');
    expect(cell.x).toStrictEqual(10);
    expect(cell.y).toStrictEqual(20);
    expect(cell.background).toStrictEqual({ r: -1, g: -1, b: -1 });
    expect(cell.foreground).toStrictEqual({ r: -1, g: -1, b: -1 });
    expect(cell.display).toStrictEqual({
      blink: false,
      bold: false,
      dim: false,
      hidden: false,
      reverse: false,
      underlined: false,
    });
  });

  it('should properly convert Cell into ASCII sequence', () => {
    expect.hasAssertions();

    const cell = new Cell(' ');

    expect(cell.toString()).toStrictEqual('\u001b[1;1f \u001b[0m');
    expect(cell.setX(20)).toBeInstanceOf(Cell);
    expect(cell.toString()).toStrictEqual('\u001b[1;21f \u001b[0m');
    expect(cell.setY(10)).toBeInstanceOf(Cell);
    expect(cell.toString()).toStrictEqual('\u001b[11;21f \u001b[0m');
    expect(cell.setBackground(0, 100, 200)).toBeInstanceOf(Cell);
    expect(cell.toString()).toStrictEqual('\u001b[11;21f\u001b[48;2;0;100;200m \u001b[0m');
    expect(cell.setForeground(200, 100, 0)).toBeInstanceOf(Cell);
    expect(cell.toString()).toStrictEqual('\u001b[11;21f\u001b[48;2;0;100;200m\u001b[38;2;200;100;0m \u001b[0m');
    expect(cell.setDisplay({
      blink: true,
      bold: true,
      dim: true,
      hidden: true,
      reverse: true,
      underlined: true,
    })).toBeInstanceOf(Cell);

    // eslint-disable-next-line max-len
    expect(cell.toString()).toStrictEqual('\u001b[11;21f\u001b[48;2;0;100;200m\u001b[38;2;200;100;0m\u001b[1m\u001b[2m\u001b[4m\u001b[5m\u001b[7m\u001b[8m \u001b[0m');
  });

  it('should properly create Cell instance from static create()', () => {
    expect.hasAssertions();

    const cell = Cell.create('s', { x: 10, y: 20 });

    expect(cell.char).toStrictEqual('s');
    expect(cell.x).toStrictEqual(10);
    expect(cell.y).toStrictEqual(20);
    expect(cell.background).toStrictEqual({ r: -1, g: -1, b: -1 });
    expect(cell.foreground).toStrictEqual({ r: -1, g: -1, b: -1 });
    expect(cell.display).toStrictEqual({
      blink: false,
      bold: false,
      dim: false,
      hidden: false,
      reverse: false,
      underlined: false,
    });
  });
});
