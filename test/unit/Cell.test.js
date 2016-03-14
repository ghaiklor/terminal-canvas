import { assert } from 'chai';
import sinon from 'sinon';
import Cell from '../../src/Cell';

describe('Cell', () => {
  it('Should properly create cell with default arguments', () => {
    const cell = new Cell();

    assert.instanceOf(cell, Cell);
    assert.equal(cell._char, ' ');
    assert.equal(cell._x, 0);
    assert.equal(cell._y, 0);
    assert.deepEqual(cell._background, {r: -1, g: -1, b: -1});
    assert.deepEqual(cell._foreground, {r: -1, g: -1, b: -1});
    assert.deepEqual(cell._display, {
      bold: false,
      dim: false,
      underlined: false,
      blink: false,
      reverse: false,
      hidden: false
    });
  });

  it('Should properly get/set char', () => {
    const cell = new Cell();

    assert.equal(cell.getChar(), ' ');
    assert.instanceOf(cell.setChar('t'), Cell);
    assert.equal(cell.getChar(), 't');
    assert.instanceOf(cell.setChar('long text'), Cell);
    assert.equal(cell.getChar(), 'l');
  });

  it('Should properly get/set X coordinate', () => {
    const cell = new Cell();

    assert.equal(cell.getX(), 0);
    assert.instanceOf(cell.setX(40), Cell);
    assert.equal(cell.getX(), 40);
    assert.instanceOf(cell.setX(50.99), Cell);
    assert.equal(cell.getX(), 50);
  });

  it('Should properly get/set Y coordinate', () => {
    const cell = new Cell();

    assert.equal(cell.getY(), 0);
    assert.instanceOf(cell.setY(40), Cell);
    assert.equal(cell.getY(), 40);
    assert.instanceOf(cell.setY(50.99), Cell);
    assert.equal(cell.getY(), 50);
  });

  it('Should properly get/set background color', () => {
    const cell = new Cell();

    assert.deepEqual(cell.getBackground(), {r: -1, g: -1, b: -1});
    assert.instanceOf(cell.setBackground({r: 0, g: 100, b: 200}), Cell);
    assert.deepEqual(cell.getBackground(), {r: 0, g: 100, b: 200});
    assert.instanceOf(cell.setBackground(), Cell);
    assert.deepEqual(cell.getBackground(), {r: -1, g: -1, b: -1});
  });

  it('Should properly get/set foreground color', () => {
    const cell = new Cell();

    assert.deepEqual(cell.getForeground(), {r: -1, g: -1, b: -1});
    assert.instanceOf(cell.setForeground({r: 0, g: 100, b: 200}), Cell);
    assert.deepEqual(cell.getForeground(), {r: 0, g: 100, b: 200});
    assert.instanceOf(cell.setForeground(), Cell);
    assert.deepEqual(cell.getForeground(), {r: -1, g: -1, b: -1});
  });

  it('Should properly get/set display modes', () => {
    const cell = new Cell();

    assert.deepEqual(cell.getDisplay(), {
      bold: false,
      dim: false,
      underlined: false,
      blink: false,
      reverse: false,
      hidden: false
    });

    assert.instanceOf(cell.setDisplay({bold: true, underlined: true, dim: false}), Cell);
    assert.deepEqual(cell.getDisplay(), {
      bold: true,
      dim: false,
      underlined: true,
      blink: false,
      reverse: false,
      hidden: false
    });

    assert.instanceOf(cell.setDisplay(), Cell);
    assert.deepEqual(cell.getDisplay(), {
      bold: false,
      dim: false,
      underlined: false,
      blink: false,
      reverse: false,
      hidden: false
    });
  });

  it('Should properly mark cell as modified', () => {
    const cell = new Cell();

    assert.ok(cell.isModified());
    assert.instanceOf(cell.setModified(false), Cell);
    assert.notOk(cell.isModified());
    assert.instanceOf(cell.setModified(), Cell);
    assert.ok(cell.isModified());
  });

  it('Should properly reset the cell contents and display settings', () => {
    const cell = new Cell();
    const mock = sinon.mock(cell);

    mock.expects('setChar').once().returns(cell);
    mock.expects('setBackground').once().returns(cell);
    mock.expects('setForeground').once().returns(cell);
    mock.expects('setDisplay').once().returns(cell);

    assert.instanceOf(cell.reset(), Cell);
    mock.verify();
  });

  it('Should properly convert Cell into ASCII sequence', () => {
    const cell = new Cell();

    assert.equal(cell.toString(), '\u001b[1;1f\u001b[48;2;-1;-1;-1m\u001b[38;2;-1;-1;-1m \u001b[0m');
    assert.instanceOf(cell.setX(20), Cell);
    assert.equal(cell.toString(), '\u001b[1;21f\u001b[48;2;-1;-1;-1m\u001b[38;2;-1;-1;-1m \u001b[0m');
    assert.instanceOf(cell.setY(10), Cell);
    assert.equal(cell.toString(), '\u001b[11;21f\u001b[48;2;-1;-1;-1m\u001b[38;2;-1;-1;-1m \u001b[0m');
    assert.instanceOf(cell.setBackground({r: 0, g: 100, b: 200}), Cell);
    assert.equal(cell.toString(), '\u001b[11;21f\u001b[48;2;0;100;200m\u001b[38;2;-1;-1;-1m \u001b[0m');
    assert.instanceOf(cell.setForeground({r: 200, g: 100, b: 0}), Cell);
    assert.equal(cell.toString(), '\u001b[11;21f\u001b[48;2;0;100;200m\u001b[38;2;200;100;0m \u001b[0m');
    assert.instanceOf(cell.setDisplay({bold: true, underlined: true, dim: false}), Cell);
    assert.equal(cell.toString(), '\u001b[11;21f\u001b[48;2;0;100;200m\u001b[38;2;200;100;0m\u001b[1m\u001b[4m \u001b[0m');
  });

  it('Should properly create Cell instance from static create()', () => {
    const cell = Cell.create(' ', {x: 10, y: 20});

    assert.instanceOf(cell, Cell);
    assert.equal(cell._char, ' ');
    assert.equal(cell._x, 10);
    assert.equal(cell._y, 20);
    assert.deepEqual(cell._background, {r: -1, g: -1, b: -1});
    assert.deepEqual(cell._foreground, {r: -1, g: -1, b: -1});
    assert.deepEqual(cell._display, {
      bold: false,
      dim: false,
      underlined: false,
      blink: false,
      reverse: false,
      hidden: false
    });
  })
});
