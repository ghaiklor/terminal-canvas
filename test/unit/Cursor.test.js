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
    assert.notOk(cursor._display);
    assert.equal(cursor._buffer.length, process.stdout.columns * process.stdout.rows);
    assert.equal(cursor._renderedBuffer.length, cursor._buffer.length);
  });

  it('Should properly wrap the char with control sequence', () => {
    const cursor = new Cursor();
    const x = 0;
    const y = 0;
    const background = 'black';
    const foreground = 'white';
    const display = 8;

    assert.equal(cursor.wrap(' ', {x, y}), '\u001b[1;1f \u001b[0m');
    assert.equal(cursor.wrap(' ', {x, y, background}), '\u001b[1;1f\u001b[48;5;0m \u001b[0m');
    assert.equal(cursor.wrap(' ', {x, y, foreground}), '\u001b[1;1f\u001b[38;5;15m \u001b[0m');
    assert.equal(cursor.wrap(' ', {x, y, display}), '\u001b[1;1f\u001b[8m \u001b[0m');
  });

  it('Should properly calculate buffer pointer', () => {
    const cursor = new Cursor();

    assert.equal(cursor.getPointer(), 0);
    assert.instanceOf(cursor.moveTo(10, 10), Cursor);
    assert.equal(cursor.getPointer(), 10 * process.stdout.columns + 10);
    assert.equal(cursor.getPointer(20, 20), 20 * process.stdout.columns + 20);
  });

  it('Should properly calculate coordinates from buffer pointer', () => {
    const cursor = new Cursor();

    assert.deepEqual(cursor.getXYFromPointer(0), [0, 0]);
    assert.deepEqual(cursor.getXYFromPointer(1), [1, 0]);
    assert.deepEqual(cursor.getXYFromPointer(200), [200 - (Math.floor(200 / cursor._width) * cursor._width), Math.floor(200 / cursor._width)]);
  });

  it('Should properly write to the cursor', () => {
    const cursor = new Cursor();

    assert.equal(cursor._buffer[0], ' ');

    cursor.write('test');
    assert.equal(cursor._buffer[0], '\u001b[1;1ft\u001b[0m');
    assert.equal(cursor._buffer[1], '\u001b[1;2fe\u001b[0m');
    assert.equal(cursor._buffer[2], '\u001b[1;3fs\u001b[0m');
    assert.equal(cursor._buffer[3], '\u001b[1;4ft\u001b[0m');
  });

  it('Should properly ignore write if out of the bounding box', () => {
    const cursor = new Cursor();

    assert.equal(cursor._buffer[0], ' ');

    cursor.write('test');
    assert.equal(cursor._buffer[0], '\u001b[1;1ft\u001b[0m');
    assert.equal(cursor._buffer[1], '\u001b[1;2fe\u001b[0m');
    assert.equal(cursor._buffer[2], '\u001b[1;3fs\u001b[0m');
    assert.equal(cursor._buffer[3], '\u001b[1;4ft\u001b[0m');

    cursor.moveTo(-5, -5).write('do not print');
    assert.equal(cursor._buffer[0], '\u001b[1;1ft\u001b[0m');
    assert.equal(cursor._buffer[1], '\u001b[1;2fe\u001b[0m');
    assert.equal(cursor._buffer[2], '\u001b[1;3fs\u001b[0m');
    assert.equal(cursor._buffer[3], '\u001b[1;4ft\u001b[0m');
    assert.equal(cursor._buffer[4], ' ');
  });

  it('Should properly flush the buffer into the stream', () => {
    const cursor = new Cursor();
    const mock = sinon.mock(process.stdout);

    mock.expects('write').once();

    cursor.write('test');
    cursor.flush();

    mock.verify();
  });

  it('Should properly render image with default options', () => {
    const cursor = new Cursor();
    const mock = sinon.mock(process.stdout);

    mock.expects('write').once().withArgs(new Buffer('\u001b]1337;File=width=auto;height=auto;preserveAspectRatio=1;inline=1:base64Image^G'));

    cursor.image({image: 'base64Image'});

    mock.verify();
  });

  it('Should properly render image with custom options', () => {
    const cursor = new Cursor();
    const mock = sinon.mock(process.stdout);

    mock.expects('write').once().withArgs(new Buffer('\u001b]1337;File=width=200px;height=200px;preserveAspectRatio=0;inline=1:base64Image^G'));

    cursor.image({
      image: 'base64Image',
      width: '200px',
      height: '200px',
      preserveAspectRatio: false
    });

    mock.verify();
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

    mock.expects('right').once().withArgs(5);
    mock.expects('down').once().withArgs(10);
    mock.expects('left').once().withArgs(5);
    mock.expects('up').once().withArgs(10);

    cursor.moveBy(5, 10);
    cursor.moveBy(-5, -10);

    assert.equal(cursor._x, 0);
    assert.equal(cursor._y, 0);
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

  it('Should properly change display mode', () => {
    const cursor = new Cursor();

    assert.equal(cursor._display, false);
    assert.instanceOf(cursor.display(5), Cursor);
    assert.equal(cursor._display, 5);
  });

  it('Should properly enable bold mode', () => {
    const cursor = new Cursor();
    const mock = sinon.mock(cursor);

    mock.expects('display').once().withArgs(1);

    cursor.bold();

    mock.verify();
  });

  it('Should properly disable bold mode', () => {
    const cursor = new Cursor();
    const mock = sinon.mock(cursor);

    mock.expects('display').once().withArgs(21);

    cursor.bold(false);

    mock.verify();
  });

  it('Should properly enable dim mode', () => {
    const cursor = new Cursor();
    const mock = sinon.mock(cursor);

    mock.expects('display').once().withArgs(2);

    cursor.dim();

    mock.verify();
  });

  it('Should properly disable dim mode', () => {
    const cursor = new Cursor();
    const mock = sinon.mock(cursor);

    mock.expects('display').once().withArgs(22);

    cursor.dim(false);

    mock.verify();
  });

  it('Should properly enable underlined mode', () => {
    const cursor = new Cursor();
    const mock = sinon.mock(cursor);

    mock.expects('display').once().withArgs(4);

    cursor.underlined();

    mock.verify();
  });

  it('Should properly disable underlined mode', () => {
    const cursor = new Cursor();
    const mock = sinon.mock(cursor);

    mock.expects('display').once().withArgs(24);

    cursor.underlined(false);

    mock.verify();
  });

  it('Should properly enable blink mode', () => {
    const cursor = new Cursor();
    const mock = sinon.mock(cursor);

    mock.expects('display').once().withArgs(5);

    cursor.blink();

    mock.verify();
  });

  it('Should properly disable blink mode', () => {
    const cursor = new Cursor();
    const mock = sinon.mock(cursor);

    mock.expects('display').once().withArgs(25);

    cursor.blink(false);

    mock.verify();
  });

  it('Should properly enable reverse mode', () => {
    const cursor = new Cursor();
    const mock = sinon.mock(cursor);

    mock.expects('display').once().withArgs(7);

    cursor.reverse();

    mock.verify();
  });

  it('Should properly disable reverse mode', () => {
    const cursor = new Cursor();
    const mock = sinon.mock(cursor);

    mock.expects('display').once().withArgs(27);

    cursor.reverse(false);

    mock.verify();
  });

  it('Should properly enable hidden mode', () => {
    const cursor = new Cursor();
    const mock = sinon.mock(cursor);

    mock.expects('display').once().withArgs(8);

    cursor.hidden();

    mock.verify();
  });

  it('Should properly disable hidden mode', () => {
    const cursor = new Cursor();
    const mock = sinon.mock(cursor);

    mock.expects('display').once().withArgs(28);

    cursor.hidden(false);

    mock.verify();
  });

  it('Should properly erase the specified region', () => {
    const cursor = new Cursor();
    const mock = sinon.mock(cursor);

    mock.expects('getPointer').exactly(2).returns(cursor);
    mock.expects('wrap').exactly(2).returns(cursor);

    cursor.erase(0, 0, 1, 0);

    mock.verify();
  });

  it('Should properly erase from current position to the end of line', () => {
    const cursor = new Cursor();
    const mock = sinon.mock(cursor);

    mock.expects('erase').once().withArgs(0, 0, process.stdout.columns, 0).returns(cursor);

    cursor.eraseToEnd();

    mock.verify();
  });

  it('Should properly erase from current position to the start of line', () => {
    const cursor = new Cursor();
    const mock = sinon.mock(cursor);

    mock.expects('erase').once().withArgs(0, 0, 0, 0).returns(cursor);

    cursor.eraseToStart();

    mock.verify();
  });

  it('Should properly erase from current line to down', () => {
    const cursor = new Cursor();
    const mock = sinon.mock(cursor);

    mock.expects('erase').once().withArgs(0, 0, process.stdout.columns, process.stdout.rows).returns(cursor);

    cursor.eraseToDown();

    mock.verify();
  });

  it('Should properly erase from current line to up', () => {
    const cursor = new Cursor();
    const mock = sinon.mock(cursor);

    mock.expects('erase').once().withArgs(0, 0, process.stdout.columns, 0).returns(cursor);

    cursor.eraseToUp();

    mock.verify();
  });

  it('Should properly erase the current line', () => {
    const cursor = new Cursor();
    const mock = sinon.mock(cursor);

    mock.expects('erase').once().withArgs(0, 0, process.stdout.columns, 0).returns(cursor);

    cursor.eraseLine();

    mock.verify();
  });

  it('Should properly erase the entire screen', () => {
    const cursor = new Cursor();
    const mock = sinon.mock(cursor);

    mock.expects('erase').once().withArgs(0, 0, process.stdout.columns, process.stdout.rows).returns(cursor);

    cursor.eraseScreen();

    mock.verify();
  });

  it('Should properly hide the cursor', () => {
    const cursor = new Cursor();
    const mock = sinon.mock(process.stdout);

    mock.expects('write').once().withArgs(new Buffer('\u001b[?25l'));

    cursor.hideCursor();

    mock.verify();
  });

  it('Should properly show the cursor', () => {
    const cursor = new Cursor();
    const mock = sinon.mock(process.stdout);

    mock.expects('write').once().withArgs(new Buffer('\u001b[?25h'));

    cursor.showCursor();

    mock.verify();
  });

  it('Should properly reset the TTY state', () => {
    const cursor = new Cursor();
    const mock = sinon.mock(process.stdout);

    mock.expects('write').once().withArgs(new Buffer('\u001bc')).returns(cursor);

    cursor.resetTTY();

    mock.verify();
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
    assert.notOk(cursor._display);
    assert.equal(cursor._buffer.length, process.stdout.columns * process.stdout.rows);
    assert.equal(cursor._renderedBuffer.length, cursor._buffer.length);
  });
});
