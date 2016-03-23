import {assert} from 'chai';
import sinon from 'sinon';
import Cursor from '../../src/Canvas';

describe('Canvas', () => {
  it('Should properly initialize with default arguments', () => {
    const cursor = new Cursor();

    assert.instanceOf(cursor, Cursor);
    assert.equal(cursor._stream, process.stdout);
    assert.equal(cursor._width, process.stdout.columns);
    assert.equal(cursor._height, process.stdout.rows);
    assert.equal(cursor._x, 0);
    assert.equal(cursor._y, 0);
    assert.deepEqual(cursor._background, {r: -1, g: -1, b: -1});
    assert.deepEqual(cursor._foreground, {r: -1, g: -1, b: -1});
    assert.notOk(cursor._display.bold);
    assert.notOk(cursor._display.dim);
    assert.notOk(cursor._display.underlined);
    assert.notOk(cursor._display.blink);
    assert.notOk(cursor._display.reverse);
    assert.notOk(cursor._display.hidden);
    assert.equal(cursor._cells.length, process.stdout.columns * process.stdout.rows);
  });

  it('Should properly initialize with custom arguments', () => {
    const cursor = new Cursor({stream: process.stdout, width: 10, height: 20});

    assert.instanceOf(cursor, Cursor);
    assert.equal(cursor._stream, process.stdout);
    assert.equal(cursor._width, 10);
    assert.equal(cursor._height, 20);
    assert.equal(cursor._x, 0);
    assert.equal(cursor._y, 0);
    assert.deepEqual(cursor._background, {r: -1, g: -1, b: -1});
    assert.deepEqual(cursor._foreground, {r: -1, g: -1, b: -1});
    assert.notOk(cursor._display.bold);
    assert.notOk(cursor._display.dim);
    assert.notOk(cursor._display.underlined);
    assert.notOk(cursor._display.blink);
    assert.notOk(cursor._display.reverse);
    assert.notOk(cursor._display.hidden);
    assert.equal(cursor._cells.length, 10 * 20);
  });

  it('Should properly write to the cursor', () => {
    const cursor = new Cursor({width: 20, height: 10});

    assert.equal(cursor._cells[0].getChar(), ' ');

    cursor.write('test');
    assert.equal(cursor._cells[0].toString(), '\u001b[1;1ft\u001b[0m');
    assert.equal(cursor._cells[1].toString(), '\u001b[1;2fe\u001b[0m');
    assert.equal(cursor._cells[2].toString(), '\u001b[1;3fs\u001b[0m');
    assert.equal(cursor._cells[3].toString(), '\u001b[1;4ft\u001b[0m');
  });

  it('Should properly ignore write if out of the bounding box', () => {
    const cursor = new Cursor({width: 20, height: 10});

    assert.equal(cursor._cells[0].getChar(), ' ');

    cursor.write('test');
    assert.equal(cursor._cells[0].toString(), '\u001b[1;1ft\u001b[0m');
    assert.equal(cursor._cells[1].toString(), '\u001b[1;2fe\u001b[0m');
    assert.equal(cursor._cells[2].toString(), '\u001b[1;3fs\u001b[0m');
    assert.equal(cursor._cells[3].toString(), '\u001b[1;4ft\u001b[0m');

    cursor.moveTo(-5, -5).write('do not print');
    assert.equal(cursor._cells[0].toString(), '\u001b[1;1ft\u001b[0m');
    assert.equal(cursor._cells[1].toString(), '\u001b[1;2fe\u001b[0m');
    assert.equal(cursor._cells[2].toString(), '\u001b[1;3fs\u001b[0m');
    assert.equal(cursor._cells[3].toString(), '\u001b[1;4ft\u001b[0m');
    assert.equal(cursor._cells[4].getChar(), ' ');
  });

  it('Should properly flush the buffer into the stream', () => {
    const cursor = new Cursor({stream: {write: sinon.spy()}, width: 20, height: 10});

    assert.instanceOf(cursor.write('test'), Cursor);
    assert.instanceOf(cursor.flush(), Cursor);
    assert.instanceOf(cursor.moveTo(0, 0).write('1234'), Cursor);
    assert.instanceOf(cursor.flush(), Cursor);
    assert.equal(cursor._stream.write.callCount, 8);
  });

  it('Should properly skip the flush when changes the same', () => {
    const cursor = new Cursor({stream: {write: sinon.spy()}, width: 20, height: 10});

    assert.instanceOf(cursor.write('test'), Cursor);
    assert.instanceOf(cursor.flush(), Cursor);
    assert.instanceOf(cursor.moveTo(0, 0).write('test'), Cursor);
    assert.instanceOf(cursor.flush(), Cursor);
    assert.equal(cursor._stream.write.callCount, 4);
  });

  it('Should properly calculate buffer pointer', () => {
    const cursor = new Cursor({width: 20, height: 10});

    assert.equal(cursor.getPointerFromXY(), 0);
    assert.instanceOf(cursor.moveTo(10, 10), Cursor);
    assert.equal(cursor.getPointerFromXY(), 10 * 20 + 10);
    assert.equal(cursor.getPointerFromXY(20, 20), 20 * 20 + 20);
  });

  it('Should properly calculate coordinates from buffer pointer', () => {
    const cursor = new Cursor({width: 20, height: 10});

    assert.deepEqual(cursor.getXYFromPointer(0), [0, 0]);
    assert.deepEqual(cursor.getXYFromPointer(1), [1, 0]);
    assert.deepEqual(cursor.getXYFromPointer(10), [10, 0]);
    assert.deepEqual(cursor.getXYFromPointer(200), [200 - (Math.floor(200 / cursor._width) * cursor._width), Math.floor(200 / cursor._width)]);
  });

  it('Should properly move cursor up with default arguments', () => {
    const cursor = new Cursor({width: 20, height: 10});

    assert.equal(cursor._y, 0);
    assert.instanceOf(cursor.up(), Cursor);
    assert.equal(cursor._y, -1);
  });

  it('Should properly move cursor up with custom arguments', () => {
    const cursor = new Cursor({width: 20, height: 10});

    assert.equal(cursor._y, 0);
    assert.instanceOf(cursor.up(5), Cursor);
    assert.equal(cursor._y, -5);
  });

  it('Should properly move cursor down with default arguments', () => {
    const cursor = new Cursor({width: 20, height: 10});

    assert.equal(cursor._y, 0);
    assert.instanceOf(cursor.down(), Cursor);
    assert.equal(cursor._y, 1);
  });

  it('Should properly move cursor down with custom arguments', () => {
    const cursor = new Cursor({width: 20, height: 10});

    assert.equal(cursor._y, 0);
    assert.instanceOf(cursor.down(5), Cursor);
    assert.equal(cursor._y, 5);
  });

  it('Should properly move cursor right with default arguments', () => {
    const cursor = new Cursor({width: 20, height: 10});

    assert.equal(cursor._x, 0);
    assert.instanceOf(cursor.right(), Cursor);
    assert.equal(cursor._x, 1);
  });

  it('Should properly move cursor right with custom arguments', () => {
    const cursor = new Cursor({width: 20, height: 10});

    assert.equal(cursor._x, 0);
    assert.instanceOf(cursor.right(5), Cursor);
    assert.equal(cursor._x, 5);
  });

  it('Should properly move cursor left with default arguments', () => {
    const cursor = new Cursor({width: 20, height: 10});

    assert.equal(cursor._x, 0);
    assert.instanceOf(cursor.left(), Cursor);
    assert.equal(cursor._x, -1);
  });

  it('Should properly move cursor left with custom arguments', () => {
    const cursor = new Cursor({width: 20, height: 10});

    assert.equal(cursor._x, 0);
    assert.instanceOf(cursor.left(5), Cursor);
    assert.equal(cursor._x, -5);
  });

  it('Should properly set relative position of cursor', () => {
    const cursor = new Cursor({width: 20, height: 10});
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
    const cursor = new Cursor({width: 20, height: 10});

    assert.equal(cursor._x, 0);
    assert.equal(cursor._y, 0);
    assert.instanceOf(cursor.moveTo(5, 10), Cursor);
    assert.equal(cursor._x, 5);
    assert.equal(cursor._y, 10);
  });

  it('Should properly change foreground color', () => {
    const cursor = new Cursor({width: 20, height: 10});

    assert.deepEqual(cursor._foreground, {r: -1, g: -1, b: -1});
    assert.instanceOf(cursor.foreground('white'), Cursor);
    assert.deepEqual(cursor._foreground, {r: 255, g: 255, b: 255});
    assert.instanceOf(cursor.foreground(false), Cursor);
    assert.deepEqual(cursor._foreground, {r: -1, g: -1, b: -1});
  });

  it('Should properly change background color', () => {
    const cursor = new Cursor({width: 20, height: 10});

    assert.deepEqual(cursor._background, {r: -1, g: -1, b: -1});
    assert.instanceOf(cursor.background('black'), Cursor);
    assert.deepEqual(cursor._background, {r: 0, g: 0, b: 0});
    assert.instanceOf(cursor.background(false), Cursor);
    assert.deepEqual(cursor._background, {r: -1, g: -1, b: -1});
  });

  it('Should properly enable bold mode', () => {
    const cursor = new Cursor({width: 20, height: 10});

    assert.instanceOf(cursor.bold(), Cursor);
    assert.ok(cursor._display.bold);
    assert.instanceOf(cursor.bold(false), Cursor);
    assert.notOk(cursor._display.bold);
  });

  it('Should properly toggle dim mode', () => {
    const cursor = new Cursor({width: 20, height: 10});

    assert.instanceOf(cursor.dim(), Cursor);
    assert.ok(cursor._display.dim);
    assert.instanceOf(cursor.dim(false), Cursor);
    assert.notOk(cursor._display.dim);
  });

  it('Should properly toggle underlined mode', () => {
    const cursor = new Cursor({width: 20, height: 10});

    assert.instanceOf(cursor.underlined(), Cursor);
    assert.ok(cursor._display.underlined);
    assert.instanceOf(cursor.underlined(false), Cursor);
    assert.notOk(cursor._display.underlined);
  });

  it('Should properly toggle blink mode', () => {
    const cursor = new Cursor({width: 20, height: 10});

    assert.instanceOf(cursor.blink(), Cursor);
    assert.ok(cursor._display.blink);
    assert.instanceOf(cursor.blink(false), Cursor);
    assert.notOk(cursor._display.blink);
  });

  it('Should properly toggle reverse mode', () => {
    const cursor = new Cursor({width: 20, height: 10});

    assert.instanceOf(cursor.reverse(), Cursor);
    assert.ok(cursor._display.reverse);
    assert.instanceOf(cursor.reverse(false), Cursor);
    assert.notOk(cursor._display.reverse);
  });

  it('Should properly toggle hidden mode', () => {
    const cursor = new Cursor({width: 20, height: 10});

    assert.instanceOf(cursor.hidden(), Cursor);
    assert.ok(cursor._display.hidden);
    assert.instanceOf(cursor.hidden(false), Cursor);
    assert.notOk(cursor._display.hidden);
  });

  it('Should properly erase the specified region', () => {
    const cursor = new Cursor({width: 20, height: 10});
    const mock = sinon.mock(cursor);

    mock.expects('getPointerFromXY').exactly(36).returns(0);

    assert.instanceOf(cursor.moveTo(5, 5).erase(0, 0, 5, 5), Cursor);
    mock.verify();
  });

  it('Should properly erase from current position to the end of line', () => {
    const cursor = new Cursor({width: 20, height: 10});
    const mock = sinon.mock(cursor);

    mock.expects('erase').once().withExactArgs(5, 5, 20 - 1, 5).returns(cursor);

    assert.instanceOf(cursor.moveTo(5, 5).eraseToEnd(), Cursor);
    mock.verify();
  });

  it('Should properly erase from current position to the start of line', () => {
    const cursor = new Cursor({width: 20, height: 10});
    const mock = sinon.mock(cursor);

    mock.expects('erase').once().withExactArgs(0, 5, 5, 5).returns(cursor);

    assert.instanceOf(cursor.moveTo(5, 5).eraseToStart(), Cursor);
    mock.verify();
  });

  it('Should properly erase from current line to down', () => {
    const cursor = new Cursor({width: 20, height: 10});
    const mock = sinon.mock(cursor);

    mock.expects('erase').once().withExactArgs(0, 5, 20 - 1, 10 - 1).returns(cursor);

    assert.instanceOf(cursor.moveTo(5, 5).eraseToDown(), Cursor);
    mock.verify();
  });

  it('Should properly erase from current line to up', () => {
    const cursor = new Cursor({width: 20, height: 10});
    const mock = sinon.mock(cursor);

    mock.expects('erase').once().withExactArgs(0, 0, 20 - 1, 5).returns(cursor);

    assert.instanceOf(cursor.moveTo(5, 5).eraseToUp(), Cursor);
    mock.verify();
  });

  it('Should properly erase the current line', () => {
    const cursor = new Cursor({width: 20, height: 10});
    const mock = sinon.mock(cursor);

    mock.expects('erase').once().withExactArgs(0, 5, 20 - 1, 5).returns(cursor);

    assert.instanceOf(cursor.moveTo(5, 5).eraseLine(), Cursor);
    mock.verify();
  });

  it('Should properly erase the entire screen', () => {
    const cursor = new Cursor({width: 20, height: 10});
    const mock = sinon.mock(cursor);

    mock.expects('erase').once().withExactArgs(0, 0, 20 - 1, 10 - 1).returns(cursor);

    assert.instanceOf(cursor.eraseScreen(), Cursor);
    mock.verify();
  });

  it('Should properly save the screen contents', () => {
    const cursor = new Cursor({stream: {write: sinon.spy()}, width: 20, height: 10});

    assert.instanceOf(cursor.saveScreen(), Cursor);
    assert.equal(cursor._stream.write.callCount, 1);
    assert.equal(cursor._stream.write.getCall(0).args[0], '\u001b[?47h');
  });

  it('Should properly restore the screen contents', () => {
    const cursor = new Cursor({stream: {write: sinon.spy()}, width: 20, height: 10});

    assert.instanceOf(cursor.restoreScreen(), Cursor);
    assert.equal(cursor._stream.write.callCount, 1);
    assert.equal(cursor._stream.write.getCall(0).args[0], '\u001b[?47l');
  });

  it('Should properly hide the cursor', () => {
    const cursor = new Cursor({stream: {write: sinon.spy()}, width: 20, height: 10});

    assert.instanceOf(cursor.hideCursor(), Cursor);
    assert.equal(cursor._stream.write.callCount, 1);
    assert.equal(cursor._stream.write.getCall(0).args[0], '\u001b[?25l');
  });

  it('Should properly show the cursor', () => {
    const cursor = new Cursor({stream: {write: sinon.spy()}, width: 20, height: 10});

    assert.instanceOf(cursor.showCursor(), Cursor);
    assert.equal(cursor._stream.write.callCount, 1);
    assert.equal(cursor._stream.write.getCall(0).args[0], '\u001b[?25h');
  });

  it('Should properly reset the TTY state', () => {
    const cursor = new Cursor({stream: {write: sinon.spy()}, width: 20, height: 10});

    assert.instanceOf(cursor.reset(), Cursor);
    assert.equal(cursor._stream.write.callCount, 1);
    assert.equal(cursor._stream.write.getCall(0).args[0], '\u001bc');
  });

  it('Should properly create new instance from static create()', () => {
    const cursor = Cursor.create();

    assert.instanceOf(cursor, Cursor);
    assert.equal(cursor._stream, process.stdout);
    assert.equal(cursor._width, process.stdout.columns);
    assert.equal(cursor._height, process.stdout.rows);
    assert.equal(cursor._x, 0);
    assert.equal(cursor._y, 0);
    assert.deepEqual(cursor._background, {r: -1, g: -1, b: -1});
    assert.deepEqual(cursor._foreground, {r: -1, g: -1, b: -1});
    assert.notOk(cursor._display.bold);
    assert.notOk(cursor._display.dim);
    assert.notOk(cursor._display.underlined);
    assert.notOk(cursor._display.blink);
    assert.notOk(cursor._display.reverse);
    assert.notOk(cursor._display.hidden);
    assert.equal(cursor._cells.length, process.stdout.columns * process.stdout.rows);
  });
});
