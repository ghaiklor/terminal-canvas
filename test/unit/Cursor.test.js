import { assert } from 'chai';
import sinon from 'sinon';
import Cursor from '../../src/Cursor';

describe('Cursor', () => {
  it('Should properly initialize with default arguments', () => {
    const cursor = new Cursor();

    assert.instanceOf(cursor, Cursor);
    assert.equal(cursor._width, process.stdout.columns);
    assert.equal(cursor._height, process.stdout.rows);
    assert.equal(cursor._x, 0);
    assert.equal(cursor._y, 0);
    assert.notOk(cursor._background);
    assert.notOk(cursor._foreground);
    assert.notOk(cursor._display.bold);
    assert.notOk(cursor._display.dim);
    assert.notOk(cursor._display.underlined);
    assert.notOk(cursor._display.blink);
    assert.notOk(cursor._display.reverse);
    assert.notOk(cursor._display.hidden);
    assert.equal(cursor._terminal.length, process.stdout.columns * process.stdout.rows);
    assert.equal(cursor._lastFrame.size, 1);
  });

  it('Should properly write to the cursor', () => {
    const cursor = new Cursor();

    assert.equal(cursor._terminal[0], ' ');

    cursor.write('test');
    assert.equal(cursor._terminal[0], '\u001b[1;1ft\u001b[0m');
    assert.equal(cursor._terminal[1], '\u001b[1;2fe\u001b[0m');
    assert.equal(cursor._terminal[2], '\u001b[1;3fs\u001b[0m');
    assert.equal(cursor._terminal[3], '\u001b[1;4ft\u001b[0m');
  });

  it('Should properly ignore write if out of the bounding box', () => {
    const cursor = new Cursor();

    assert.equal(cursor._terminal[0], ' ');

    cursor.write('test');
    assert.equal(cursor._terminal[0], '\u001b[1;1ft\u001b[0m');
    assert.equal(cursor._terminal[1], '\u001b[1;2fe\u001b[0m');
    assert.equal(cursor._terminal[2], '\u001b[1;3fs\u001b[0m');
    assert.equal(cursor._terminal[3], '\u001b[1;4ft\u001b[0m');

    cursor.moveTo(-5, -5).write('do not print');
    assert.equal(cursor._terminal[0], '\u001b[1;1ft\u001b[0m');
    assert.equal(cursor._terminal[1], '\u001b[1;2fe\u001b[0m');
    assert.equal(cursor._terminal[2], '\u001b[1;3fs\u001b[0m');
    assert.equal(cursor._terminal[3], '\u001b[1;4ft\u001b[0m');
    assert.equal(cursor._terminal[4], ' ');
  });

  it('Should properly flush the buffer into the stream', () => {
    const cursor = new Cursor();
    const mock = sinon.mock(process.stdout);

    mock.expects('write').once();

    assert.instanceOf(cursor.write('test'), Cursor);
    assert.instanceOf(cursor.flush(), Cursor);
    mock.verify();
  });

  it('Should properly calculate buffer pointer', () => {
    const cursor = new Cursor();

    assert.equal(cursor.getPointerFromXY(), 0);
    assert.instanceOf(cursor.moveTo(10, 10), Cursor);
    assert.equal(cursor.getPointerFromXY(), 10 * process.stdout.columns + 10);
    assert.equal(cursor.getPointerFromXY(20, 20), 20 * process.stdout.columns + 20);
  });

  it('Should properly calculate coordinates from buffer pointer', () => {
    const cursor = new Cursor();

    assert.deepEqual(cursor.getXYFromPointer(0), [0, 0]);
    assert.deepEqual(cursor.getXYFromPointer(1), [1, 0]);
    assert.deepEqual(cursor.getXYFromPointer(10), [10, 0]);
    assert.deepEqual(cursor.getXYFromPointer(200), [200 - (Math.floor(200 / cursor._width) * cursor._width), Math.floor(200 / cursor._width)]);
  });

  it('Should properly move cursor up with default arguments', () => {
    const cursor = new Cursor();

    assert.equal(cursor._y, 0);
    assert.instanceOf(cursor.up(), Cursor);
    assert.equal(cursor._y, -1);
  });

  it('Should properly move cursor up with custom arguments', () => {
    const cursor = new Cursor();

    assert.equal(cursor._y, 0);
    assert.instanceOf(cursor.up(5), Cursor);
    assert.equal(cursor._y, -5);
  });

  it('Should properly move cursor down with default arguments', () => {
    const cursor = new Cursor();

    assert.equal(cursor._y, 0);
    assert.instanceOf(cursor.down(), Cursor);
    assert.equal(cursor._y, 1);
  });

  it('Should properly move cursor down with custom arguments', () => {
    const cursor = new Cursor();

    assert.equal(cursor._y, 0);
    assert.instanceOf(cursor.down(5), Cursor);
    assert.equal(cursor._y, 5);
  });

  it('Should properly move cursor right with default arguments', () => {
    const cursor = new Cursor();

    assert.equal(cursor._x, 0);
    assert.instanceOf(cursor.right(), Cursor);
    assert.equal(cursor._x, 1);
  });

  it('Should properly move cursor right with custom arguments', () => {
    const cursor = new Cursor();

    assert.equal(cursor._x, 0);
    assert.instanceOf(cursor.right(5), Cursor);
    assert.equal(cursor._x, 5);
  });

  it('Should properly move cursor left with default arguments', () => {
    const cursor = new Cursor();

    assert.equal(cursor._x, 0);
    assert.instanceOf(cursor.left(), Cursor);
    assert.equal(cursor._x, -1);
  });

  it('Should properly move cursor left with custom arguments', () => {
    const cursor = new Cursor();

    assert.equal(cursor._x, 0);
    assert.instanceOf(cursor.left(5), Cursor);
    assert.equal(cursor._x, -5);
  });

  it('Should properly set relative position of cursor', () => {
    const cursor = new Cursor();
    const mock = sinon.mock(cursor);

    mock.expects('right').once().withExactArgs(10);
    mock.expects('down').once().withExactArgs(20);
    mock.expects('left').once().withExactArgs(5);
    mock.expects('up').once().withExactArgs(10);

    assert.instanceOf(cursor.moveBy(10, 20), Cursor);
    assert.instanceOf(cursor.moveBy(-5, -10), Cursor);
    mock.verify();
  });

  it('Should properly set absolute position of cursor', () => {
    const cursor = new Cursor();

    assert.equal(cursor._x, 0);
    assert.equal(cursor._y, 0);
    assert.instanceOf(cursor.moveTo(5, 10), Cursor);
    assert.equal(cursor._x, 5);
    assert.equal(cursor._y, 10);
  });

  it('Should properly change foreground color', () => {
    const cursor = new Cursor();

    assert.equal(cursor._foreground, false);
    assert.instanceOf(cursor.foreground('white'), Cursor);
    assert.equal(cursor._foreground, 'white');
  });

  it('Should properly change background color', () => {
    const cursor = new Cursor();

    assert.equal(cursor._background, false);
    assert.instanceOf(cursor.background('black'), Cursor);
    assert.equal(cursor._background, 'black');
  });

  it('Should properly enable bold mode', () => {
    const cursor = new Cursor();

    assert.instanceOf(cursor.bold(), Cursor);
    assert.ok(cursor._display.bold);
    assert.instanceOf(cursor.bold(false), Cursor);
    assert.notOk(cursor._display.bold);
  });

  it('Should properly toggle dim mode', () => {
    const cursor = new Cursor();

    assert.instanceOf(cursor.dim(), Cursor);
    assert.ok(cursor._display.dim);
    assert.instanceOf(cursor.dim(false), Cursor);
    assert.notOk(cursor._display.dim);
  });

  it('Should properly toggle underlined mode', () => {
    const cursor = new Cursor();

    assert.instanceOf(cursor.underlined(), Cursor);
    assert.ok(cursor._display.underlined);
    assert.instanceOf(cursor.underlined(false), Cursor);
    assert.notOk(cursor._display.underlined);
  });

  it('Should properly toggle blink mode', () => {
    const cursor = new Cursor();

    assert.instanceOf(cursor.blink(), Cursor);
    assert.ok(cursor._display.blink);
    assert.instanceOf(cursor.blink(false), Cursor);
    assert.notOk(cursor._display.blink);
  });

  it('Should properly toggle reverse mode', () => {
    const cursor = new Cursor();

    assert.instanceOf(cursor.reverse(), Cursor);
    assert.ok(cursor._display.reverse);
    assert.instanceOf(cursor.reverse(false), Cursor);
    assert.notOk(cursor._display.reverse);
  });

  it('Should properly toggle hidden mode', () => {
    const cursor = new Cursor();

    assert.instanceOf(cursor.hidden(), Cursor);
    assert.ok(cursor._display.hidden);
    assert.instanceOf(cursor.hidden(false), Cursor);
    assert.notOk(cursor._display.hidden);
  });

  it('Should properly erase the specified region', () => {
    const cursor = new Cursor();
    const mock = sinon.mock(cursor);

    mock.expects('getPointerFromXY').exactly(36).returns(cursor);

    assert.instanceOf(cursor.moveTo(5, 5).erase(0, 0, 5, 5), Cursor);
    mock.verify();
  });

  it('Should properly erase from current position to the end of line', () => {
    const cursor = new Cursor();
    const mock = sinon.mock(cursor);

    mock.expects('erase').once().withExactArgs(5, 5, process.stdout.columns - 1, 5).returns(cursor);

    assert.instanceOf(cursor.moveTo(5, 5).eraseToEnd(), Cursor);
    mock.verify();
  });

  it('Should properly erase from current position to the start of line', () => {
    const cursor = new Cursor();
    const mock = sinon.mock(cursor);

    mock.expects('erase').once().withExactArgs(0, 5, 5, 5).returns(cursor);

    assert.instanceOf(cursor.moveTo(5, 5).eraseToStart(), Cursor);
    mock.verify();
  });

  it('Should properly erase from current line to down', () => {
    const cursor = new Cursor();
    const mock = sinon.mock(cursor);

    mock.expects('erase').once().withExactArgs(0, 5, process.stdout.columns - 1, process.stdout.rows - 1).returns(cursor);

    assert.instanceOf(cursor.moveTo(5, 5).eraseToDown(), Cursor);
    mock.verify();
  });

  it('Should properly erase from current line to up', () => {
    const cursor = new Cursor();
    const mock = sinon.mock(cursor);

    mock.expects('erase').once().withExactArgs(0, 0, process.stdout.columns - 1, 5).returns(cursor);

    assert.instanceOf(cursor.moveTo(5, 5).eraseToUp(), Cursor);
    mock.verify();
  });

  it('Should properly erase the current line', () => {
    const cursor = new Cursor();
    const mock = sinon.mock(cursor);

    mock.expects('erase').once().withExactArgs(0, 5, process.stdout.columns - 1, 5).returns(cursor);

    assert.instanceOf(cursor.moveTo(5, 5).eraseLine(), Cursor);
    mock.verify();
  });

  it('Should properly erase the entire screen', () => {
    const cursor = new Cursor();
    const mock = sinon.mock(cursor);

    mock.expects('erase').once().withExactArgs(0, 0, process.stdout.columns - 1, process.stdout.rows - 1).returns(cursor);

    assert.instanceOf(cursor.eraseScreen(), Cursor);
    mock.verify();
  });

  it('Should properly hide the cursor', () => {
    const cursor = new Cursor();
    const mock = sinon.mock(process.stdout);

    mock.expects('write').once().withExactArgs(new Buffer('\u001b[?25l'));

    assert.instanceOf(cursor.hideCursor(), Cursor);
    mock.verify();
  });

  it('Should properly show the cursor', () => {
    const cursor = new Cursor();
    const mock = sinon.mock(process.stdout);

    mock.expects('write').once().withExactArgs(new Buffer('\u001b[?25h'));

    assert.instanceOf(cursor.showCursor(), Cursor);
    mock.verify();
  });

  it('Should properly reset the TTY state', () => {
    const cursor = new Cursor();
    const mock = sinon.mock(process.stdout);

    mock.expects('write').once().withExactArgs(new Buffer('\u001bc'));

    assert.instanceOf(cursor.resetTTY(), Cursor);
    mock.verify();
  });

  it('Should properly wrap the char with control sequence', () => {
    const x = 0;
    const y = 0;
    const background = 'black';
    const foreground = 'white';
    const display = {bold: true, underlined: true};

    assert.equal(Cursor.wrap(' ', {x, y}), '\u001b[1;1f \u001b[0m');
    assert.equal(Cursor.wrap(' ', {x, y, background}), '\u001b[1;1f\u001b[48;5;0m \u001b[0m');
    assert.equal(Cursor.wrap(' ', {x, y, foreground}), '\u001b[1;1f\u001b[38;5;15m \u001b[0m');
    assert.equal(Cursor.wrap(' ', {x, y, display}), '\u001b[1;1f\u001b[1m\u001b[4m \u001b[0m');
  });

  it('Should properly encode to VT100 compatible symbol', () => {
    assert.deepEqual(Cursor.encodeToVT100('[J'), new Buffer('\u001b[J'));
  });

  it('Should properly create new instance from static create()', () => {
    const cursor = Cursor.create();

    assert.instanceOf(cursor, Cursor);
    assert.equal(cursor._width, process.stdout.columns);
    assert.equal(cursor._height, process.stdout.rows);
    assert.equal(cursor._x, 0);
    assert.equal(cursor._y, 0);
    assert.notOk(cursor._background);
    assert.notOk(cursor._foreground);
    assert.notOk(cursor._display.bold);
    assert.notOk(cursor._display.dim);
    assert.notOk(cursor._display.underlined);
    assert.notOk(cursor._display.blink);
    assert.notOk(cursor._display.reverse);
    assert.notOk(cursor._display.hidden);
    assert.equal(cursor._terminal.length, process.stdout.columns * process.stdout.rows);
    assert.equal(cursor._lastFrame.size, 1);
  });
});
