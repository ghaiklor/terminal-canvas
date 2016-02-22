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
    assert.equal(cursor._buffer.length, cursor._width * cursor._height);
  });

  it('Should properly calculate buffer pointer', () => {
    const cursor = new Cursor();

    assert.equal(cursor.getBufferPointer(), 0);
    assert.instanceOf(cursor.moveTo(10, 10), Cursor);
    assert.equal(cursor.getBufferPointer(), 10 * process.stdout.columns + 10);
    assert.equal(cursor.getBufferPointer(20, 20), 20 * process.stdout.columns + 20);
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
    assert.equal(cursor._buffer[0], 't');
    assert.equal(cursor._buffer[1], 'e');
    assert.equal(cursor._buffer[2], 's');
    assert.equal(cursor._buffer[3], 't');

    cursor.write(new Buffer('another'));
    assert.equal(cursor._buffer[4], ' a');
    assert.equal(cursor._buffer[5], ' n');
    assert.equal(cursor._buffer[6], ' o');
    assert.equal(cursor._buffer[7], ' t');
    assert.equal(cursor._buffer[8], ' h');
    assert.equal(cursor._buffer[9], ' e');
    assert.equal(cursor._buffer[10], ' r');
  });

  it('Should properly ignore write if out of the bounding box', () => {
    const cursor = new Cursor();

    assert.equal(cursor._buffer[0], ' ');

    cursor.write('test');
    assert.equal(cursor._buffer[0], 't');
    assert.equal(cursor._buffer[1], 'e');
    assert.equal(cursor._buffer[2], 's');
    assert.equal(cursor._buffer[3], 't');

    cursor.moveTo(-5, -5).write('do not print');
    assert.equal(cursor._buffer[0], 't');
    assert.equal(cursor._buffer[1], 'e');
    assert.equal(cursor._buffer[2], 's');
    assert.equal(cursor._buffer[3], 't');
    assert.equal(cursor._buffer[4], ' ');
  });

  it('Should properly flush the buffer into the stream', () => {
    const cursor = new Cursor();
    const mock = sinon.mock(process.stdout);

    mock.expects('write').twice();

    cursor.write('test');
    cursor.flush();

    mock.verify();
  });

  it('Should properly render image with default options', () => {
    const cursor = new Cursor();
    const mock = sinon.mock(cursor);

    mock.expects('write').once().withArgs(new Buffer('\u001b]1337;File=width=auto;height=auto;preserveAspectRatio=1;inline=1:base64Image^G'));

    cursor.image({image: 'base64Image'});

    mock.verify();
  });

  it('Should properly render image with custom options', () => {
    const cursor = new Cursor();
    const mock = sinon.mock(cursor);

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
    const mock = sinon.mock(cursor);

    mock.expects('write').once().withArgs(new Buffer('\u001b[5A'));

    cursor.up(5);

    assert.equal(cursor._pointer.y, -4);
    mock.verify();
  });

  it('Should properly move cursor down with default arguments', () => {
    const cursor = new Cursor();
    const mock = sinon.mock(cursor);

    mock.expects('write').once().withArgs(new Buffer('\u001b[1B'));

    cursor.down();

    assert.equal(cursor._pointer.y, 2);
    mock.verify();
  });

  it('Should properly move cursor down with custom arguments', () => {
    const cursor = new Cursor();
    const mock = sinon.mock(cursor);

    mock.expects('write').once().withArgs(new Buffer('\u001b[5B'));

    cursor.down(5);

    assert.equal(cursor._pointer.y, 6);
    mock.verify();
  });

  it('Should properly move cursor right with default arguments', () => {
    const cursor = new Cursor();
    const mock = sinon.mock(cursor);

    mock.expects('write').once().withArgs(new Buffer('\u001b[1C'));

    cursor.right();

    assert.equal(cursor._pointer.x, 2);
    mock.verify();
  });

  it('Should properly move cursor right with custom arguments', () => {
    const cursor = new Cursor();
    const mock = sinon.mock(cursor);

    mock.expects('write').once().withArgs(new Buffer('\u001b[5C'));

    cursor.right(5);

    assert.equal(cursor._pointer.x, 6);
    mock.verify();
  });

  it('Should properly move cursor left with default arguments', () => {
    const cursor = new Cursor();
    const mock = sinon.mock(cursor);

    mock.expects('write').once().withArgs(new Buffer('\u001b[1D'));

    cursor.left();

    assert.equal(cursor._pointer.x, 0);
    mock.verify();
  });

  it('Should properly move cursor left with custom arguments', () => {
    const cursor = new Cursor();
    const mock = sinon.mock(cursor);

    mock.expects('write').once().withArgs(new Buffer('\u001b[5D'));

    cursor.left(5);

    assert.equal(cursor._pointer.x, -4);
    mock.verify();
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

    assert.equal(cursor._pointer.x, 1);
    assert.equal(cursor._pointer.y, 1);
    mock.verify();
  });

  it('Should properly set absolute position of cursor', () => {
    const cursor = new Cursor();
    const mock = sinon.mock(cursor);

    mock.expects('write').once().withArgs(new Buffer('\u001b[10;5f'));

    cursor.moveTo(5, 10);

    assert.equal(cursor._pointer.x, 5);
    assert.equal(cursor._pointer.y, 10);
    mock.verify();
  });

  it('Should properly change foreground color', () => {
    const cursor = new Cursor();
    const mock = sinon.mock(cursor);

    mock.expects('write').once().withArgs(new Buffer('\u001b[38;5;11m'));

    cursor.foreground('yellow');

    mock.verify();
  });

  it('Should properly change background color', () => {
    const cursor = new Cursor();
    const mock = sinon.mock(cursor);

    mock.expects('write').once().withArgs(new Buffer('\u001b[48;5;0m'));

    cursor.background('black');

    mock.verify();
  });

  it('Should properly ignore display() call if wrong parameter', () => {
    const cursor = new Cursor();
    const mock = sinon.mock(cursor);

    mock.expects('write').never();

    cursor.display('It is a wrong display mode');

    mock.verify();
  });

  it('Should properly change display mode', () => {
    const cursor = new Cursor();
    const mock = sinon.mock(cursor);

    mock.expects('write').once().withArgs(new Buffer('\u001b[5m'));

    cursor.display(5);

    mock.verify();
  });

  it('Should properly enable bold mode', () => {
    const cursor = new Cursor();
    const mock = sinon.mock(cursor);

    mock.expects('write').once().withArgs(new Buffer('\u001b[1m'));
    cursor.bold();
    mock.verify();
  });

  it('Should properly disable bold mode', () => {
    const cursor = new Cursor();
    const mock = sinon.mock(cursor);

    mock.expects('write').once().withArgs(new Buffer('\u001b[21m'));
    cursor.bold(false);
    mock.verify();
  });

  it('Should properly enable dim mode', () => {
    const cursor = new Cursor();
    const mock = sinon.mock(cursor);

    mock.expects('write').once().withArgs(new Buffer('\u001b[2m'));
    cursor.dim();
    mock.verify();
  });

  it('Should properly disable dim mode', () => {
    const cursor = new Cursor();
    const mock = sinon.mock(cursor);

    mock.expects('write').once().withArgs(new Buffer('\u001b[22m'));
    cursor.dim(false);
    mock.verify();
  });

  it('Should properly enable underlined mode', () => {
    const cursor = new Cursor();
    const mock = sinon.mock(cursor);

    mock.expects('write').once().withArgs(new Buffer('\u001b[4m'));
    cursor.underlined();
    mock.verify();
  });

  it('Should properly disable underlined mode', () => {
    const cursor = new Cursor();
    const mock = sinon.mock(cursor);

    mock.expects('write').once().withArgs(new Buffer('\u001b[24m'));
    cursor.underlined(false);
    mock.verify();
  });

  it('Should properly enable blink mode', () => {
    const cursor = new Cursor();
    const mock = sinon.mock(cursor);

    mock.expects('write').once().withArgs(new Buffer('\u001b[5m'));
    cursor.blink();
    mock.verify();
  });

  it('Should properly disable blink mode', () => {
    const cursor = new Cursor();
    const mock = sinon.mock(cursor);

    mock.expects('write').once().withArgs(new Buffer('\u001b[25m'));
    cursor.blink(false);
    mock.verify();
  });

  it('Should properly enable reverse mode', () => {
    const cursor = new Cursor();
    const mock = sinon.mock(cursor);

    mock.expects('write').once().withArgs(new Buffer('\u001b[7m'));
    cursor.reverse();
    mock.verify();
  });

  it('Should properly disable reverse mode', () => {
    const cursor = new Cursor();
    const mock = sinon.mock(cursor);

    mock.expects('write').once().withArgs(new Buffer('\u001b[27m'));
    cursor.reverse(false);
    mock.verify();
  });

  it('Should properly enable hidden mode', () => {
    const cursor = new Cursor();
    const mock = sinon.mock(cursor);

    mock.expects('write').once().withArgs(new Buffer('\u001b[8m'));
    cursor.hidden();
    mock.verify();
  });

  it('Should properly disable hidden mode', () => {
    const cursor = new Cursor();
    const mock = sinon.mock(cursor);

    mock.expects('write').once().withArgs(new Buffer('\u001b[28m'));
    cursor.hidden(false);
    mock.verify();
  });

  it('Should properly ignore wrong erase region', () => {
    const cursor = new Cursor();
    const mock = sinon.mock(cursor);

    mock.expects('saveCursor').never().returns(cursor);
    mock.expects('resetCursor').never().returns(cursor);
    mock.expects('write').never().returns(cursor);
    mock.expects('restoreCursor').never().returns(cursor);

    assert.instanceOf(cursor.erase('wrong'), Cursor);

    mock.verify();
  });

  it('Should properly erase the specified region', () => {
    const cursor = new Cursor();
    const mock = sinon.mock(cursor);

    mock.expects('saveCursor').once().returns(cursor);
    mock.expects('resetCursor').once().returns(cursor);
    mock.expects('write').once().withArgs(new Buffer('\u001b[2J')).returns(cursor);
    mock.expects('restoreCursor').once().returns(cursor);

    cursor.erase('[2J');

    mock.verify();
  });

  it('Should properly erase from current position to the end of line', () => {
    const cursor = new Cursor();
    const mock = sinon.mock(cursor);

    mock.expects('saveCursor').once().returns(cursor);
    mock.expects('resetCursor').once().returns(cursor);
    mock.expects('write').once().withArgs(new Buffer('\u001b[K')).returns(cursor);
    mock.expects('restoreCursor').once().returns(cursor);

    cursor.eraseToEnd();

    mock.verify();
  });

  it('Should properly erase from current position to the start of line', () => {
    const cursor = new Cursor();
    const mock = sinon.mock(cursor);

    mock.expects('saveCursor').once().returns(cursor);
    mock.expects('resetCursor').once().returns(cursor);
    mock.expects('write').once().withArgs(new Buffer('\u001b[1K')).returns(cursor);
    mock.expects('restoreCursor').once().returns(cursor);

    cursor.eraseToStart();

    mock.verify();
  });

  it('Should properly erase from current line to down', () => {
    const cursor = new Cursor();
    const mock = sinon.mock(cursor);

    mock.expects('saveCursor').once().returns(cursor);
    mock.expects('resetCursor').once().returns(cursor);
    mock.expects('write').once().withArgs(new Buffer('\u001b[J')).returns(cursor);
    mock.expects('restoreCursor').once().returns(cursor);

    cursor.eraseToDown();

    mock.verify();
  });

  it('Should properly erase from current line to up', () => {
    const cursor = new Cursor();
    const mock = sinon.mock(cursor);

    mock.expects('saveCursor').once().returns(cursor);
    mock.expects('resetCursor').once().returns(cursor);
    mock.expects('write').once().withArgs(new Buffer('\u001b[1J')).returns(cursor);
    mock.expects('restoreCursor').once().returns(cursor);

    cursor.eraseToUp();

    mock.verify();
  });

  it('Should properly erase the current line', () => {
    const cursor = new Cursor();
    const mock = sinon.mock(cursor);

    mock.expects('saveCursor').once().returns(cursor);
    mock.expects('resetCursor').once().returns(cursor);
    mock.expects('write').once().withArgs(new Buffer('\u001b[2K')).returns(cursor);
    mock.expects('restoreCursor').once().returns(cursor);

    cursor.eraseLine();

    mock.verify();
  });

  it('Should properly erase the entire screen', () => {
    const cursor = new Cursor();
    const mock = sinon.mock(cursor);

    mock.expects('saveCursor').once().returns(cursor);
    mock.expects('resetCursor').once().returns(cursor);
    mock.expects('write').once().withArgs(new Buffer('\u001b[2J')).returns(cursor);
    mock.expects('restoreCursor').once().returns(cursor);

    cursor.eraseScreen();

    mock.verify();
  });

  it('Should properly hide the cursor', () => {
    const cursor = new Cursor();
    const mock = sinon.mock(cursor);

    mock.expects('write').once().withArgs(new Buffer('\u001b[?25l'));

    cursor.hideCursor();

    mock.verify();
  });

  it('Should properly show the cursor', () => {
    const cursor = new Cursor();
    const mock = sinon.mock(cursor);

    mock.expects('write').once().withArgs(new Buffer('\u001b[?25h'));

    cursor.showCursor();

    mock.verify();
  });

  it('Should properly save the cursor state with attributes', () => {
    const cursor = new Cursor();
    const mock = sinon.mock(cursor);

    mock.expects('write').once().withArgs(new Buffer('\u001b7'));

    cursor.saveCursor();

    mock.verify();
  });

  it('Should properly save the cursor state without attributes', () => {
    const cursor = new Cursor();
    const mock = sinon.mock(cursor);

    mock.expects('write').once().withArgs(new Buffer('\u001b[s'));

    cursor.saveCursor(false);

    mock.verify();
  });

  it('Should properly restore the cursor state with attributes', () => {
    const cursor = new Cursor();
    const mock = sinon.mock(cursor);

    mock.expects('write').once().withArgs(new Buffer('\u001b8'));

    cursor.restoreCursor();

    mock.verify();
  });

  it('Should properly restore the cursor state without attributes', () => {
    const cursor = new Cursor();
    const mock = sinon.mock(cursor);

    mock.expects('write').once().withArgs(new Buffer('\u001b[u'));

    cursor.restoreCursor(false);

    mock.verify();
  });

  it('Should properly reset all display modes/attributes', () => {
    const cursor = new Cursor();
    const mock = sinon.mock(cursor);

    mock.expects('write').once().withArgs(new Buffer('\u001b[0m'));
    cursor.resetCursor();
    mock.verify();
  });

  it('Should properly reset the TTY state', () => {
    const cursor = new Cursor();
    const mock = sinon.mock(cursor);

    mock.expects('resetCursor').once().returns(cursor);
    mock.expects('eraseScreen').once().returns(cursor);
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
    assert.equal(cursor._buffer, '');
    assert.deepEqual(cursor._pointer, {x: 1, y: 1});
  });
});
