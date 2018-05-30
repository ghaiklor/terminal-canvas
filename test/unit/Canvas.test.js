const {assert} = require('chai');
const sinon = require('sinon');
const Canvas = require('../../src/Canvas');

describe('Canvas', () => {
  it('Should properly initialize with default arguments', () => {
    const canvas = new Canvas();

    assert.instanceOf(canvas, Canvas);
    assert.equal(canvas._stream, process.stdout);
    assert.equal(canvas._width, process.stdout.columns);
    assert.equal(canvas._height, process.stdout.rows);
    assert.equal(canvas._x, 0);
    assert.equal(canvas._y, 0);
    assert.deepEqual(canvas._background, {r: -1, g: -1, b: -1});
    assert.deepEqual(canvas._foreground, {r: -1, g: -1, b: -1});
    assert.notOk(canvas._display.bold);
    assert.notOk(canvas._display.dim);
    assert.notOk(canvas._display.underlined);
    assert.notOk(canvas._display.blink);
    assert.notOk(canvas._display.reverse);
    assert.notOk(canvas._display.hidden);
  });

  it('Should properly initialize with custom arguments', () => {
    const canvas = new Canvas({stream: process.stdout, width: 10, height: 20});

    assert.instanceOf(canvas, Canvas);
    assert.equal(canvas._stream, process.stdout);
    assert.equal(canvas._width, 10);
    assert.equal(canvas._height, 20);
    assert.equal(canvas._x, 0);
    assert.equal(canvas._y, 0);
    assert.deepEqual(canvas._background, {r: -1, g: -1, b: -1});
    assert.deepEqual(canvas._foreground, {r: -1, g: -1, b: -1});
    assert.notOk(canvas._display.bold);
    assert.notOk(canvas._display.dim);
    assert.notOk(canvas._display.underlined);
    assert.notOk(canvas._display.blink);
    assert.notOk(canvas._display.reverse);
    assert.notOk(canvas._display.hidden);
    assert.equal(canvas._cells.length, 10 * 20);
  });

  it('Should properly write to the canvas', () => {
    const canvas = new Canvas({width: 20, height: 10});

    assert.equal(canvas._cells[0].getChar(), ' ');

    canvas.write('test');
    assert.equal(canvas._cells[0].toString(), '\u001b[1;1ft\u001b[0m');
    assert.equal(canvas._cells[1].toString(), '\u001b[1;2fe\u001b[0m');
    assert.equal(canvas._cells[2].toString(), '\u001b[1;3fs\u001b[0m');
    assert.equal(canvas._cells[3].toString(), '\u001b[1;4ft\u001b[0m');
  });

  it('Should properly ignore write if out of the bounding box', () => {
    const canvas = new Canvas({width: 20, height: 10});

    assert.equal(canvas._cells[0].getChar(), ' ');

    canvas.write('test');
    assert.equal(canvas._cells[0].toString(), '\u001b[1;1ft\u001b[0m');
    assert.equal(canvas._cells[1].toString(), '\u001b[1;2fe\u001b[0m');
    assert.equal(canvas._cells[2].toString(), '\u001b[1;3fs\u001b[0m');
    assert.equal(canvas._cells[3].toString(), '\u001b[1;4ft\u001b[0m');

    canvas.moveTo(-5, -5).write('do not print');
    assert.equal(canvas._cells[0].toString(), '\u001b[1;1ft\u001b[0m');
    assert.equal(canvas._cells[1].toString(), '\u001b[1;2fe\u001b[0m');
    assert.equal(canvas._cells[2].toString(), '\u001b[1;3fs\u001b[0m');
    assert.equal(canvas._cells[3].toString(), '\u001b[1;4ft\u001b[0m');
    assert.equal(canvas._cells[4].getChar(), ' ');
  });

  it('Should properly flush the buffer into the stream', () => {
    const canvas = new Canvas({stream: {write: sinon.spy()}, width: 20, height: 10});

    assert.instanceOf(canvas.write('test'), Canvas);
    assert.instanceOf(canvas.flush(), Canvas);
    assert.instanceOf(canvas.moveTo(0, 0).write('1234'), Canvas);
    assert.instanceOf(canvas.flush(), Canvas);
    assert.equal(canvas._stream.write.callCount, 2);
  });

  it('Should properly skip the flush when changes the same', () => {
    const canvas = new Canvas({stream: {write: sinon.spy()}, width: 20, height: 10});

    assert.instanceOf(canvas.write('test'), Canvas);
    assert.instanceOf(canvas.flush(), Canvas);
    assert.instanceOf(canvas.moveTo(0, 0).write('test'), Canvas);
    assert.instanceOf(canvas.flush(), Canvas);
    assert.equal(canvas._stream.write.callCount, 2);
  });

  it('Should properly calculate buffer pointer', () => {
    const canvas = new Canvas({width: 20, height: 10});

    assert.equal(canvas.getPointerFromXY(), 0);
    assert.instanceOf(canvas.moveTo(10, 10), Canvas);
    assert.equal(canvas.getPointerFromXY(), 10 * 20 + 10);
    assert.equal(canvas.getPointerFromXY(20, 20), 20 * 20 + 20);
  });

  it('Should properly calculate coordinates from buffer pointer', () => {
    const canvas = new Canvas({width: 20, height: 10});

    assert.deepEqual(canvas.getXYFromPointer(0), [0, 0]);
    assert.deepEqual(canvas.getXYFromPointer(1), [1, 0]);
    assert.deepEqual(canvas.getXYFromPointer(10), [10, 0]);
    assert.deepEqual(canvas.getXYFromPointer(200), [200 - (Math.floor(200 / canvas._width) * canvas._width), Math.floor(200 / canvas._width)]);
  });

  it('Should properly move cursor up with default arguments', () => {
    const canvas = new Canvas({width: 20, height: 10});

    assert.equal(canvas._y, 0);
    assert.instanceOf(canvas.up(), Canvas);
    assert.equal(canvas._y, -1);
  });

  it('Should properly move cursor up with custom arguments', () => {
    const canvas = new Canvas({width: 20, height: 10});

    assert.equal(canvas._y, 0);
    assert.instanceOf(canvas.up(5), Canvas);
    assert.equal(canvas._y, -5);
  });

  it('Should properly move cursor down with default arguments', () => {
    const canvas = new Canvas({width: 20, height: 10});

    assert.equal(canvas._y, 0);
    assert.instanceOf(canvas.down(), Canvas);
    assert.equal(canvas._y, 1);
  });

  it('Should properly move cursor down with custom arguments', () => {
    const canvas = new Canvas({width: 20, height: 10});

    assert.equal(canvas._y, 0);
    assert.instanceOf(canvas.down(5), Canvas);
    assert.equal(canvas._y, 5);
  });

  it('Should properly move cursor right with default arguments', () => {
    const canvas = new Canvas({width: 20, height: 10});

    assert.equal(canvas._x, 0);
    assert.instanceOf(canvas.right(), Canvas);
    assert.equal(canvas._x, 1);
  });

  it('Should properly move cursor right with custom arguments', () => {
    const canvas = new Canvas({width: 20, height: 10});

    assert.equal(canvas._x, 0);
    assert.instanceOf(canvas.right(5), Canvas);
    assert.equal(canvas._x, 5);
  });

  it('Should properly move cursor left with default arguments', () => {
    const canvas = new Canvas({width: 20, height: 10});

    assert.equal(canvas._x, 0);
    assert.instanceOf(canvas.left(), Canvas);
    assert.equal(canvas._x, -1);
  });

  it('Should properly move cursor left with custom arguments', () => {
    const canvas = new Canvas({width: 20, height: 10});

    assert.equal(canvas._x, 0);
    assert.instanceOf(canvas.left(5), Canvas);
    assert.equal(canvas._x, -5);
  });

  it('Should properly set relative position of cursor', () => {
    const canvas = new Canvas({width: 20, height: 10});
    const mock = sinon.mock(canvas);

    mock.expects('right').once().withExactArgs(10);
    mock.expects('down').once().withExactArgs(20);
    mock.expects('left').once().withExactArgs(5);
    mock.expects('up').once().withExactArgs(10);

    assert.instanceOf(canvas.moveBy(10, 20), Canvas);
    assert.instanceOf(canvas.moveBy(-5, -10), Canvas);
    mock.verify();
  });

  it('Should properly set absolute position of cursor', () => {
    const canvas = new Canvas({width: 20, height: 10});

    assert.equal(canvas._x, 0);
    assert.equal(canvas._y, 0);
    assert.instanceOf(canvas.moveTo(5, 10), Canvas);
    assert.equal(canvas._x, 5);
    assert.equal(canvas._y, 10);
  });

  it('Should properly change foreground color', () => {
    const canvas = new Canvas({width: 20, height: 10});

    assert.deepEqual(canvas._foreground, {r: -1, g: -1, b: -1});
    assert.instanceOf(canvas.foreground('white'), Canvas);
    assert.deepEqual(canvas._foreground, {r: 255, g: 255, b: 255});
    assert.instanceOf(canvas.foreground(false), Canvas);
    assert.deepEqual(canvas._foreground, {r: -1, g: -1, b: -1});
  });

  it('Should properly change background color', () => {
    const canvas = new Canvas({width: 20, height: 10});

    assert.deepEqual(canvas._background, {r: -1, g: -1, b: -1});
    assert.instanceOf(canvas.background('black'), Canvas);
    assert.deepEqual(canvas._background, {r: 0, g: 0, b: 0});
    assert.instanceOf(canvas.background(false), Canvas);
    assert.deepEqual(canvas._background, {r: -1, g: -1, b: -1});
  });

  it('Should properly toggle bold mode', () => {
    const canvas = new Canvas({width: 20, height: 10});

    assert.instanceOf(canvas.bold(), Canvas);
    assert.ok(canvas._display.bold);
    assert.instanceOf(canvas.bold(false), Canvas);
    assert.notOk(canvas._display.bold);
  });

  it('Should properly toggle dim mode', () => {
    const canvas = new Canvas({width: 20, height: 10});

    assert.instanceOf(canvas.dim(), Canvas);
    assert.ok(canvas._display.dim);
    assert.instanceOf(canvas.dim(false), Canvas);
    assert.notOk(canvas._display.dim);
  });

  it('Should properly toggle underlined mode', () => {
    const canvas = new Canvas({width: 20, height: 10});

    assert.instanceOf(canvas.underlined(), Canvas);
    assert.ok(canvas._display.underlined);
    assert.instanceOf(canvas.underlined(false), Canvas);
    assert.notOk(canvas._display.underlined);
  });

  it('Should properly toggle blink mode', () => {
    const canvas = new Canvas({width: 20, height: 10});

    assert.instanceOf(canvas.blink(), Canvas);
    assert.ok(canvas._display.blink);
    assert.instanceOf(canvas.blink(false), Canvas);
    assert.notOk(canvas._display.blink);
  });

  it('Should properly toggle reverse mode', () => {
    const canvas = new Canvas({width: 20, height: 10});

    assert.instanceOf(canvas.reverse(), Canvas);
    assert.ok(canvas._display.reverse);
    assert.instanceOf(canvas.reverse(false), Canvas);
    assert.notOk(canvas._display.reverse);
  });

  it('Should properly toggle hidden mode', () => {
    const canvas = new Canvas({width: 20, height: 10});

    assert.instanceOf(canvas.hidden(), Canvas);
    assert.ok(canvas._display.hidden);
    assert.instanceOf(canvas.hidden(false), Canvas);
    assert.notOk(canvas._display.hidden);
  });

  it('Should properly erase the specified region', () => {
    const canvas = new Canvas({width: 20, height: 10});
    const mock = sinon.mock(canvas);

    mock.expects('getPointerFromXY').exactly(36).returns(0);

    assert.instanceOf(canvas.moveTo(5, 5).erase(0, 0, 5, 5), Canvas);
    mock.verify();
  });

  it('Should properly erase from current position to the end of line', () => {
    const canvas = new Canvas({width: 20, height: 10});
    const mock = sinon.mock(canvas);

    mock.expects('erase').once().withExactArgs(5, 5, 20 - 1, 5).returns(canvas);

    assert.instanceOf(canvas.moveTo(5, 5).eraseToEnd(), Canvas);
    mock.verify();
  });

  it('Should properly erase from current position to the start of line', () => {
    const canvas = new Canvas({width: 20, height: 10});
    const mock = sinon.mock(canvas);

    mock.expects('erase').once().withExactArgs(0, 5, 5, 5).returns(canvas);

    assert.instanceOf(canvas.moveTo(5, 5).eraseToStart(), Canvas);
    mock.verify();
  });

  it('Should properly erase from current line to down', () => {
    const canvas = new Canvas({width: 20, height: 10});
    const mock = sinon.mock(canvas);

    mock.expects('erase').once().withExactArgs(0, 5, 20 - 1, 10 - 1).returns(canvas);

    assert.instanceOf(canvas.moveTo(5, 5).eraseToDown(), Canvas);
    mock.verify();
  });

  it('Should properly erase from current line to up', () => {
    const canvas = new Canvas({width: 20, height: 10});
    const mock = sinon.mock(canvas);

    mock.expects('erase').once().withExactArgs(0, 0, 20 - 1, 5).returns(canvas);

    assert.instanceOf(canvas.moveTo(5, 5).eraseToUp(), Canvas);
    mock.verify();
  });

  it('Should properly erase the current line', () => {
    const canvas = new Canvas({width: 20, height: 10});
    const mock = sinon.mock(canvas);

    mock.expects('erase').once().withExactArgs(0, 5, 20 - 1, 5).returns(canvas);

    assert.instanceOf(canvas.moveTo(5, 5).eraseLine(), Canvas);
    mock.verify();
  });

  it('Should properly erase the entire screen', () => {
    const canvas = new Canvas({width: 20, height: 10});
    const mock = sinon.mock(canvas);

    mock.expects('erase').once().withExactArgs(0, 0, 20 - 1, 10 - 1).returns(canvas);

    assert.instanceOf(canvas.eraseScreen(), Canvas);
    mock.verify();
  });

  it('Should properly save the screen contents', () => {
    const canvas = new Canvas({stream: {write: sinon.spy()}, width: 20, height: 10});

    assert.instanceOf(canvas.saveScreen(), Canvas);
    assert.equal(canvas._stream.write.callCount, 1);
    assert.equal(canvas._stream.write.getCall(0).args[0], '\u001b[?47h');
  });

  it('Should properly restore the screen contents', () => {
    const canvas = new Canvas({stream: {write: sinon.spy()}, width: 20, height: 10});

    assert.instanceOf(canvas.restoreScreen(), Canvas);
    assert.equal(canvas._stream.write.callCount, 1);
    assert.equal(canvas._stream.write.getCall(0).args[0], '\u001b[?47l');
  });

  it('Should properly hide the cursor', () => {
    const canvas = new Canvas({stream: {write: sinon.spy()}, width: 20, height: 10});

    assert.instanceOf(canvas.hideCursor(), Canvas);
    assert.equal(canvas._stream.write.callCount, 1);
    assert.equal(canvas._stream.write.getCall(0).args[0], '\u001b[?25l');
  });

  it('Should properly show the cursor', () => {
    const canvas = new Canvas({stream: {write: sinon.spy()}, width: 20, height: 10});

    assert.instanceOf(canvas.showCursor(), Canvas);
    assert.equal(canvas._stream.write.callCount, 1);
    assert.equal(canvas._stream.write.getCall(0).args[0], '\u001b[?25h');
  });

  it('Should properly reset the TTY state', () => {
    const canvas = new Canvas({stream: {write: sinon.spy()}, width: 20, height: 10});

    assert.instanceOf(canvas.reset(), Canvas);
    assert.equal(canvas._stream.write.callCount, 1);
    assert.equal(canvas._stream.write.getCall(0).args[0], '\u001bc');
  });

  it('Should properly create new instance from static create()', () => {
    const canvas = Canvas.create();

    assert.instanceOf(canvas, Canvas);
    assert.equal(canvas._stream, process.stdout);
    assert.equal(canvas._width, process.stdout.columns);
    assert.equal(canvas._height, process.stdout.rows);
    assert.equal(canvas._x, 0);
    assert.equal(canvas._y, 0);
    assert.deepEqual(canvas._background, {r: -1, g: -1, b: -1});
    assert.deepEqual(canvas._foreground, {r: -1, g: -1, b: -1});
    assert.notOk(canvas._display.bold);
    assert.notOk(canvas._display.dim);
    assert.notOk(canvas._display.underlined);
    assert.notOk(canvas._display.blink);
    assert.notOk(canvas._display.reverse);
    assert.notOk(canvas._display.hidden);
  });
});
