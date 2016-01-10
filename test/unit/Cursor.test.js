import { assert } from 'chai';
import sinon from 'sinon';
import { Cursor, COLORS, DISPLAY_MODES, ERASE_REGIONS } from '../../src/Cursor';

describe('Cursor', () => {
  it('Should properly export colors, display modes and erase regions', () => {
    let cursor = new Cursor();
    assert.isObject(cursor.COLORS);
    assert.isObject(cursor.DISPLAY_MODES);
    assert.isObject(cursor.ERASE_REGIONS);
  });

  it('Should properly initialize with default arguments', () => {
    let cursor = new Cursor();
    assert.instanceOf(cursor, Cursor);
    assert.deepEqual(cursor._streams, [process.stdout]);
    assert.equal(cursor._buffer, '');
  });

  it('Should properly initialize with custom stdout', () => {
    let cursor = new Cursor(['test', 'another']);
    assert.instanceOf(cursor, Cursor);
    assert.deepEqual(cursor._streams, ['test', 'another']);
  });

  it('Should properly write to the cursor', () => {
    let cursor = new Cursor();

    assert.equal(cursor._buffer, '');
    cursor.write('test');
    assert.equal(cursor._buffer, 'test');
    cursor.write(new Buffer('another'));
    assert.equal(cursor._buffer, 'testanother');
  });

  it('Should properly flush the buffer into the stream', () => {
    let cursor = new Cursor();
    let mock = sinon.mock(cursor._streams[0]);

    mock.expects('write').once().withArgs('testanother');

    cursor.write('test');
    cursor.write('another');
    cursor.flush();

    assert.equal(cursor._buffer, '');
    mock.verify();
  });

  it('Should properly pipe into another stream', () => {
    let cursor = new Cursor();
    assert.deepEqual(cursor._streams, [process.stdout]);
    assert.instanceOf(cursor.pipe('ANOTHER_STREAM'), Cursor);
    assert.deepEqual(cursor._streams, [process.stdout, 'ANOTHER_STREAM']);
  });

  it('Should properly move cursor up with default arguments', () => {
    let cursor = new Cursor();
    let mock = sinon.mock(cursor);

    mock.expects('write').once().withArgs(new Buffer('\u001b[1A'));

    cursor.up();

    mock.verify();
  });

  it('Should properly move cursor up with custom arguments', () => {
    let cursor = new Cursor();
    let mock = sinon.mock(cursor);

    mock.expects('write').once().withArgs(new Buffer('\u001b[5A'));

    cursor.up(5);

    mock.verify();
  });

  it('Should properly move cursor down with default arguments', () => {
    let cursor = new Cursor();
    let mock = sinon.mock(cursor);

    mock.expects('write').once().withArgs(new Buffer('\u001b[1B'));

    cursor.down();

    mock.verify();
  });

  it('Should properly move cursor down with custom arguments', () => {
    let cursor = new Cursor();
    let mock = sinon.mock(cursor);

    mock.expects('write').once().withArgs(new Buffer('\u001b[5B'));

    cursor.down(5);

    mock.verify();
  });

  it('Should properly move cursor right with default arguments', () => {
    let cursor = new Cursor();
    let mock = sinon.mock(cursor);

    mock.expects('write').once().withArgs(new Buffer('\u001b[1C'));

    cursor.right();

    mock.verify();
  });

  it('Should properly move cursor right with custom arguments', () => {
    let cursor = new Cursor();
    let mock = sinon.mock(cursor);

    mock.expects('write').once().withArgs(new Buffer('\u001b[5C'));

    cursor.right(5);

    mock.verify();
  });

  it('Should properly move cursor left with default arguments', () => {
    let cursor = new Cursor();
    let mock = sinon.mock(cursor);

    mock.expects('write').once().withArgs(new Buffer('\u001b[1D'));

    cursor.left();

    mock.verify();
  });

  it('Should properly move cursor left with custom arguments', () => {
    let cursor = new Cursor();
    let mock = sinon.mock(cursor);

    mock.expects('write').once().withArgs(new Buffer('\u001b[5D'));

    cursor.left(5);

    mock.verify();
  });

  it('Should properly set relative position of cursor', () => {
    let cursor = new Cursor();
    let mock = sinon.mock(cursor);

    mock.expects('right').once().withArgs(5);
    mock.expects('down').once().withArgs(10);
    mock.expects('left').once().withArgs(5);
    mock.expects('up').once().withArgs(10);

    cursor.moveBy(5, 10);
    cursor.moveBy(-5, -10);

    mock.verify();
  });

  it('Should properly set absolute position of cursor', () => {
    let cursor = new Cursor();
    let mock = sinon.mock(cursor);

    mock.expects('write').once().withArgs(new Buffer('\u001b[10;5f'));

    cursor.moveTo(5, 10);

    mock.verify();
  });

  it('Should properly change foreground color', () => {
    let cursor = new Cursor();
    let mock = sinon.mock(cursor);

    mock.expects('write').once().withArgs(new Buffer('\u001b[38;5;11m'));

    cursor.foreground(COLORS.YELLOW);

    mock.verify();
  });

  it('Should properly change foreground color via string parameter', () => {
    let cursor = new Cursor();
    let mock = sinon.mock(cursor);

    mock.expects('write').once().withArgs(new Buffer('\u001b[38;5;11m'));

    cursor.foreground('yellow');

    mock.verify();
  });

  it('Should properly change background color', () => {
    let cursor = new Cursor();
    let mock = sinon.mock(cursor);

    mock.expects('write').once().withArgs(new Buffer('\u001b[48;5;0m'));

    cursor.background(COLORS.BLACK);

    mock.verify();
  });

  it('Should properly change background color via string parameter', () => {
    let cursor = new Cursor();
    let mock = sinon.mock(cursor);

    mock.expects('write').once().withArgs(new Buffer('\u001b[48;5;0m'));

    cursor.background('black');

    mock.verify();
  });

  it('Should properly change display mode', () => {
    let cursor = new Cursor();
    let mock = sinon.mock(cursor);

    mock.expects('write').once().withArgs(new Buffer('\u001b[5m'));

    cursor.display(DISPLAY_MODES.BLINK);

    mock.verify();
  });

  it('Should properly enable bold mode', () => {
    let cursor = new Cursor();
    let mock = sinon.mock(cursor);

    mock.expects('write').once().withArgs(new Buffer('\u001b[1m'));
    cursor.bold();
    mock.verify();
  });

  it('Should properly disable bold mode', () => {
    let cursor = new Cursor();
    let mock = sinon.mock(cursor);

    mock.expects('write').once().withArgs(new Buffer('\u001b[21m'));
    cursor.bold(false);
    mock.verify();
  });

  it('Should properly enable dim mode', () => {
    let cursor = new Cursor();
    let mock = sinon.mock(cursor);

    mock.expects('write').once().withArgs(new Buffer('\u001b[2m'));
    cursor.dim();
    mock.verify();
  });

  it('Should properly disable dim mode', () => {
    let cursor = new Cursor();
    let mock = sinon.mock(cursor);

    mock.expects('write').once().withArgs(new Buffer('\u001b[22m'));
    cursor.dim(false);
    mock.verify();
  });

  it('Should properly enable underlined mode', () => {
    let cursor = new Cursor();
    let mock = sinon.mock(cursor);

    mock.expects('write').once().withArgs(new Buffer('\u001b[4m'));
    cursor.underlined();
    mock.verify();
  });

  it('Should properly disable underlined mode', () => {
    let cursor = new Cursor();
    let mock = sinon.mock(cursor);

    mock.expects('write').once().withArgs(new Buffer('\u001b[24m'));
    cursor.underlined(false);
    mock.verify();
  });

  it('Should properly enable blink mode', () => {
    let cursor = new Cursor();
    let mock = sinon.mock(cursor);

    mock.expects('write').once().withArgs(new Buffer('\u001b[5m'));
    cursor.blink();
    mock.verify();
  });

  it('Should properly disable blink mode', () => {
    let cursor = new Cursor();
    let mock = sinon.mock(cursor);

    mock.expects('write').once().withArgs(new Buffer('\u001b[25m'));
    cursor.blink(false);
    mock.verify();
  });

  it('Should properly enable reverse mode', () => {
    let cursor = new Cursor();
    let mock = sinon.mock(cursor);

    mock.expects('write').once().withArgs(new Buffer('\u001b[7m'));
    cursor.reverse();
    mock.verify();
  });

  it('Should properly disable reverse mode', () => {
    let cursor = new Cursor();
    let mock = sinon.mock(cursor);

    mock.expects('write').once().withArgs(new Buffer('\u001b[27m'));
    cursor.reverse(false);
    mock.verify();
  });

  it('Should properly enable hidden mode', () => {
    let cursor = new Cursor();
    let mock = sinon.mock(cursor);

    mock.expects('write').once().withArgs(new Buffer('\u001b[8m'));
    cursor.hidden();
    mock.verify();
  });

  it('Should properly disable hidden mode', () => {
    let cursor = new Cursor();
    let mock = sinon.mock(cursor);

    mock.expects('write').once().withArgs(new Buffer('\u001b[28m'));
    cursor.hidden(false);
    mock.verify();
  });

  it('Should properly ignore wrong erase region', () => {
    let cursor = new Cursor();
    let mock = sinon.mock(cursor);

    mock.expects('saveCursor').never().returns(cursor);
    mock.expects('resetCursor').never().returns(cursor);
    mock.expects('write').never().returns(cursor);
    mock.expects('restoreCursor').never().returns(cursor);

    assert.instanceOf(cursor.erase('wrong'), Cursor);

    mock.verify();
  });

  it('Should properly erase the specified region', () => {
    let cursor = new Cursor();
    let mock = sinon.mock(cursor);

    mock.expects('saveCursor').once().returns(cursor);
    mock.expects('resetCursor').once().returns(cursor);
    mock.expects('write').once().withArgs(new Buffer('\u001b[2J')).returns(cursor);
    mock.expects('restoreCursor').once().returns(cursor);

    cursor.erase(ERASE_REGIONS.ENTIRE_SCREEN);

    mock.verify();
  });

  it('Should properly erase from current position to the end of line', () => {
    let cursor = new Cursor();
    let mock = sinon.mock(cursor);

    mock.expects('saveCursor').once().returns(cursor);
    mock.expects('resetCursor').once().returns(cursor);
    mock.expects('write').once().withArgs(new Buffer('\u001b[K')).returns(cursor);
    mock.expects('restoreCursor').once().returns(cursor);

    cursor.eraseToEnd();

    mock.verify();
  });

  it('Should properly erase from current position to the start of line', () => {
    let cursor = new Cursor();
    let mock = sinon.mock(cursor);

    mock.expects('saveCursor').once().returns(cursor);
    mock.expects('resetCursor').once().returns(cursor);
    mock.expects('write').once().withArgs(new Buffer('\u001b[1K')).returns(cursor);
    mock.expects('restoreCursor').once().returns(cursor);

    cursor.eraseToStart();

    mock.verify();
  });

  it('Should properly erase from current line to down', () => {
    let cursor = new Cursor();
    let mock = sinon.mock(cursor);

    mock.expects('saveCursor').once().returns(cursor);
    mock.expects('resetCursor').once().returns(cursor);
    mock.expects('write').once().withArgs(new Buffer('\u001b[J')).returns(cursor);
    mock.expects('restoreCursor').once().returns(cursor);

    cursor.eraseToDown();

    mock.verify();
  });

  it('Should properly erase from current line to up', () => {
    let cursor = new Cursor();
    let mock = sinon.mock(cursor);

    mock.expects('saveCursor').once().returns(cursor);
    mock.expects('resetCursor').once().returns(cursor);
    mock.expects('write').once().withArgs(new Buffer('\u001b[1J')).returns(cursor);
    mock.expects('restoreCursor').once().returns(cursor);

    cursor.eraseToUp();

    mock.verify();
  });

  it('Should properly erase the current line', () => {
    let cursor = new Cursor();
    let mock = sinon.mock(cursor);

    mock.expects('saveCursor').once().returns(cursor);
    mock.expects('resetCursor').once().returns(cursor);
    mock.expects('write').once().withArgs(new Buffer('\u001b[2K')).returns(cursor);
    mock.expects('restoreCursor').once().returns(cursor);

    cursor.eraseLine();

    mock.verify();
  });

  it('Should properly erase the entire screen', () => {
    let cursor = new Cursor();
    let mock = sinon.mock(cursor);

    mock.expects('saveCursor').once().returns(cursor);
    mock.expects('resetCursor').once().returns(cursor);
    mock.expects('write').once().withArgs(new Buffer('\u001b[2J')).returns(cursor);
    mock.expects('restoreCursor').once().returns(cursor);

    cursor.eraseScreen();

    mock.verify();
  });

  it('Should properly render image with default options', () => {
    let cursor = new Cursor();
    let mock = sinon.mock(cursor);

    mock.expects('write').once().withArgs(new Buffer('\u001b]1337;File=width=auto;height=auto;preserveAspectRatio=1;inline=1:base64Image^G'));

    cursor.image({image: 'base64Image'});

    mock.verify();
  });

  it('Should properly render image with custom options', () => {
    let cursor = new Cursor();
    let mock = sinon.mock(cursor);

    mock.expects('write').once().withArgs(new Buffer('\u001b]1337;File=width=200px;height=200px;preserveAspectRatio=0;inline=1:base64Image^G'));

    cursor.image({
      image: 'base64Image',
      width: '200px',
      height: '200px',
      preserveAspectRatio: false
    });

    mock.verify();
  });

  it('Should properly hide the cursor', () => {
    let cursor = new Cursor();
    let mock = sinon.mock(cursor);

    mock.expects('write').once().withArgs(new Buffer('\u001b[?25l'));

    cursor.hideCursor();

    mock.verify();
  });

  it('Should properly show the cursor', () => {
    let cursor = new Cursor();
    let mock = sinon.mock(cursor);

    mock.expects('write').once().withArgs(new Buffer('\u001b[?25h'));

    cursor.showCursor();

    mock.verify();
  });

  it('Should properly save the cursor state with attributes', () => {
    let cursor = new Cursor();
    let mock = sinon.mock(cursor);

    mock.expects('write').once().withArgs(new Buffer('\u001b7'));

    cursor.saveCursor();

    mock.verify();
  });

  it('Should properly save the cursor state without attributes', () => {
    let cursor = new Cursor();
    let mock = sinon.mock(cursor);

    mock.expects('write').once().withArgs(new Buffer('\u001b[s'));

    cursor.saveCursor(false);

    mock.verify();
  });

  it('Should properly restore the cursor state with attributes', () => {
    let cursor = new Cursor();
    let mock = sinon.mock(cursor);

    mock.expects('write').once().withArgs(new Buffer('\u001b8'));

    cursor.restoreCursor();

    mock.verify();
  });

  it('Should properly restore the cursor state without attributes', () => {
    let cursor = new Cursor();
    let mock = sinon.mock(cursor);

    mock.expects('write').once().withArgs(new Buffer('\u001b[u'));

    cursor.restoreCursor(false);

    mock.verify();
  });

  it('Should properly reset all display modes/attributes', () => {
    let cursor = new Cursor();
    let mock = sinon.mock(cursor);

    mock.expects('write').once().withArgs(new Buffer('\u001b[0m'));
    cursor.resetCursor();
    mock.verify();
  });

  it('Should properly reset the TTY state', () => {
    let cursor = new Cursor();
    let mock = sinon.mock(cursor);

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
    let cursor = Cursor.create(process.stdout);
    assert.instanceOf(cursor, Cursor);
    assert.equal(cursor._buffer, '');
    assert.deepEqual(cursor._streams, [process.stdout]);
  });
});
