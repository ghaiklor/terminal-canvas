import { assert } from 'chai';
import sinon from 'sinon';
import { Cursor, COLORS, DISPLAY_MODES, ERASE_REGIONS } from '../../src/Cursor';

before(() => {
  sinon.stub(console, 'error');
});

after(() => {
  console.error.restore();
});

describe('Cursor', () => {
  it('Should properly initialize with default arguments', () => {
    let cursor = new Cursor();
    assert.instanceOf(cursor, Cursor);
  });

  it('Should properly initialize with custom stdout and stdin', () => {
    let cursor = new Cursor([], [process.stdin, process.stdin]);
    assert.instanceOf(cursor, Cursor);
  });

  it('Should properly write to the cursor', () => {
    let cursor = new Cursor();

    assert.deepEqual(cursor._buffer, []);
    cursor.write('test');
    assert.deepEqual(cursor._buffer, [new Buffer('test')]);
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

  it('Should properly change background color', () => {
    let cursor = new Cursor();
    let mock = sinon.mock(cursor);

    mock.expects('write').once().withArgs(new Buffer('\u001b[48;5;0m'));

    cursor.background(COLORS.BLACK);

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

  it('Should properly reset all display modes/attributes', () => {
    let cursor = new Cursor();
    let mock = sinon.mock(cursor);

    mock.expects('write').once().withArgs(new Buffer('\u001b[0m'));
    cursor.resetCursor();
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

  it('Should properly fill the specified region without optional arguments', () => {
    let cursor = new Cursor();
    let mock = sinon.mock(cursor);

    mock.expects('background').never();
    mock.expects('foreground').never();
    mock.expects('moveTo').exactly(6);
    mock.expects('write').exactly(5).withArgs('     ');

    cursor.fill({x1: 1, y1: 1, x2: 5, y2: 5});

    mock.verify();
  });

  it('Should properly fill the specified region with optional arguments', () => {
    let cursor = new Cursor();
    let mock = sinon.mock(cursor);

    mock.expects('background').once().withArgs(11);
    mock.expects('foreground').once().withArgs(0);
    mock.expects('moveTo').exactly(6);
    mock.expects('write').exactly(5).withArgs('TTTTT');

    cursor.fill({x1: 1, y1: 1, x2: 5, y2: 5, symbol: 'T', background: COLORS.YELLOW, foreground: COLORS.BLACK});

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

  it('Should properly get TTY size based on getWindowSize', () => {
    let cursor = new Cursor();
    let mock = sinon.mock(process.stdout);

    mock.expects('getWindowSize').twice().returns([10, 10]);

    let {width, height} = cursor.getTTYSize();
    assert.equal(width, 10);
    assert.equal(height, 10);

    mock.verify();
  });

  it('Should properly get TTY size based on process columns and rows', () => {
    process.stdout.getWindowSize = null;
    process.stdout.columns = 10;
    process.stdout.rows = 10;

    let cursor = new Cursor();
    let {width, height} = cursor.getTTYSize();
    assert.equal(width, 10);
    assert.equal(height, 10);
  });

  it('Should properly throw error if failed to determine TTY size', () => {
    process.stdout.getWindowSize = null;
    process.stdout.columns = null;
    process.stdout.rows = null;

    let cursor = new Cursor();
    assert.throws(() => cursor.getTTYSize(), Error);
  });

  it('Should properly get TTY width', () => {
    let cursor = new Cursor();
    let mock = sinon.mock(cursor);

    mock.expects('getTTYSize').once().returns({width: 10, height: 10});

    assert.equal(cursor.getTTYWidth(), 10);

    mock.verify();
  });

  it('Should properly get TTY height', () => {
    let cursor = new Cursor();
    let mock = sinon.mock(cursor);

    mock.expects('getTTYSize').once().returns({width: 10, height: 10});

    assert.equal(cursor.getTTYHeight(), 10);

    mock.verify();
  });

  it('Should properly create new instance from static create()', () => {
    let cursor = Cursor.create([], []);
    assert.instanceOf(cursor, Cursor);
  });
});
