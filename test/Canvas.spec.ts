import { Canvas } from '../src/canvas/Canvas';

describe('canvas', () => {
  it('should properly initialize with default arguments', () => {
    expect.hasAssertions();

    const canvas = new Canvas();

    expect(canvas).toBeInstanceOf(Canvas);
    expect(canvas.stream).toStrictEqual(process.stdout);
    expect(canvas.width).toStrictEqual(process.stdout.columns);
    expect(canvas.height).toStrictEqual(process.stdout.rows);
    expect(canvas.cursorX).toStrictEqual(0);
    expect(canvas.cursorY).toStrictEqual(0);
    expect(canvas.cursorBackground).toStrictEqual({ r: -1, g: -1, b: -1 });
    expect(canvas.cursorForeground).toStrictEqual({ r: -1, g: -1, b: -1 });
    expect(canvas.cursorDisplay.bold).toBe(false);
    expect(canvas.cursorDisplay.dim).toBe(false);
    expect(canvas.cursorDisplay.underlined).toBe(false);
    expect(canvas.cursorDisplay.blink).toBe(false);
    expect(canvas.cursorDisplay.reverse).toBe(false);
    expect(canvas.cursorDisplay.hidden).toBe(false);
  });

  it('should properly initialize with custom arguments', () => {
    expect.hasAssertions();

    const canvas = new Canvas({ stream: process.stdout, width: 10, height: 20 });

    expect(canvas).toBeInstanceOf(Canvas);
    expect(canvas.stream).toStrictEqual(process.stdout);
    expect(canvas.width).toStrictEqual(10);
    expect(canvas.height).toStrictEqual(20);
    expect(canvas.cursorX).toStrictEqual(0);
    expect(canvas.cursorY).toStrictEqual(0);
    expect(canvas.cursorBackground).toStrictEqual({ r: -1, g: -1, b: -1 });
    expect(canvas.cursorForeground).toStrictEqual({ r: -1, g: -1, b: -1 });
    expect(canvas.cursorDisplay.bold).toBe(false);
    expect(canvas.cursorDisplay.dim).toBe(false);
    expect(canvas.cursorDisplay.underlined).toBe(false);
    expect(canvas.cursorDisplay.blink).toBe(false);
    expect(canvas.cursorDisplay.reverse).toBe(false);
    expect(canvas.cursorDisplay.hidden).toBe(false);
    expect(canvas.cells).toHaveLength(10 * 20);
  });

  it('should properly initialize with custom width argument', () => {
    expect.hasAssertions();

    const canvas = new Canvas({ width: 10 });

    expect(canvas.stream).toStrictEqual(process.stdout);
    expect(canvas.width).toStrictEqual(10);
    expect(canvas.height).toStrictEqual(process.stdout.rows);
  });

  it('should properly initialize with custom height argument', () => {
    expect.hasAssertions();

    const canvas = new Canvas({ height: 10 });

    expect(canvas.stream).toStrictEqual(process.stdout);
    expect(canvas.width).toStrictEqual(process.stdout.columns);
    expect(canvas.height).toStrictEqual(10);
  });

  it('should properly initialize the coordinates for the cells', () => {
    expect.hasAssertions();

    const canvas = new Canvas({ width: 2, height: 2 });

    expect(canvas.cells[0].x).toBe(0);
    expect(canvas.cells[0].y).toBe(0);

    expect(canvas.cells[1].x).toBe(1);
    expect(canvas.cells[1].y).toBe(0);

    expect(canvas.cells[2].x).toBe(0);
    expect(canvas.cells[2].y).toBe(1);

    expect(canvas.cells[3].x).toBe(1);
    expect(canvas.cells[3].y).toBe(1);
  });

  it('should properly write to the canvas', () => {
    expect.hasAssertions();

    const canvas = new Canvas({ width: 20, height: 10 });
    expect(canvas.cells[0].getChar()).toStrictEqual(' ');

    canvas.write('test');
    expect(canvas.cells[0].toString()).toStrictEqual('\u001b[1;1ft\u001b[0m');
    expect(canvas.cells[1].toString()).toStrictEqual('\u001b[1;2fe\u001b[0m');
    expect(canvas.cells[2].toString()).toStrictEqual('\u001b[1;3fs\u001b[0m');
    expect(canvas.cells[3].toString()).toStrictEqual('\u001b[1;4ft\u001b[0m');
  });

  it('should properly ignore write if out of the bounding box', () => {
    expect.hasAssertions();

    const canvas = new Canvas({ width: 20, height: 10 });
    expect(canvas.cells[0].getChar()).toStrictEqual(' ');

    canvas.write('test');
    expect(canvas.cells[0].toString()).toStrictEqual('\u001b[1;1ft\u001b[0m');
    expect(canvas.cells[1].toString()).toStrictEqual('\u001b[1;2fe\u001b[0m');
    expect(canvas.cells[2].toString()).toStrictEqual('\u001b[1;3fs\u001b[0m');
    expect(canvas.cells[3].toString()).toStrictEqual('\u001b[1;4ft\u001b[0m');

    canvas.moveTo(-5, -5).write('do not print');
    expect(canvas.cells[0].toString()).toStrictEqual('\u001b[1;1ft\u001b[0m');
    expect(canvas.cells[1].toString()).toStrictEqual('\u001b[1;2fe\u001b[0m');
    expect(canvas.cells[2].toString()).toStrictEqual('\u001b[1;3fs\u001b[0m');
    expect(canvas.cells[3].toString()).toStrictEqual('\u001b[1;4ft\u001b[0m');
    expect(canvas.cells[4].getChar()).toStrictEqual(' ');
  });

  it('should properly flush the buffer into the stream', () => {
    expect.hasAssertions();

    const canvas = new Canvas({ width: 20, height: 10 });
    const spy = jest.spyOn(process.stdout, 'write');

    expect(canvas.write('test')).toBeInstanceOf(Canvas);
    expect(canvas.flush()).toBeInstanceOf(Canvas);
    expect(canvas.moveTo(0, 0).write('1234')).toBeInstanceOf(Canvas);
    expect(canvas.flush()).toBeInstanceOf(Canvas);
    expect(spy.mock.calls).toHaveLength(2);
  });

  it('should properly skip the flush when changes the same', () => {
    expect.hasAssertions();

    const canvas = new Canvas({ width: 20, height: 10 });
    const spy = jest.spyOn(process.stdout, 'write');

    expect(canvas.write('test')).toBeInstanceOf(Canvas);
    expect(canvas.flush()).toBeInstanceOf(Canvas);
    expect(canvas.moveTo(0, 0).write('test')).toBeInstanceOf(Canvas);
    expect(canvas.flush()).toBeInstanceOf(Canvas);
    expect(spy.mock.calls).toHaveLength(2);
  });

  it('should properly calculate buffer pointer', () => {
    expect.hasAssertions();

    const canvas = new Canvas({ width: 20, height: 10 });

    expect(canvas.getPointerFromXY()).toStrictEqual(0);
    expect(canvas.moveTo(10, 10)).toBeInstanceOf(Canvas);
    expect(canvas.getPointerFromXY()).toStrictEqual(10 * 20 + 10);
    expect(canvas.getPointerFromXY(20, 20)).toStrictEqual(20 * 20 + 20);
  });

  it('should properly calculate coordinates from buffer pointer', () => {
    expect.hasAssertions();

    const canvas = new Canvas({ width: 20, height: 10 });

    expect(canvas.getXYFromPointer(0)).toStrictEqual([0, 0]);
    expect(canvas.getXYFromPointer(1)).toStrictEqual([1, 0]);
    expect(canvas.getXYFromPointer(10)).toStrictEqual([10, 0]);
    expect(canvas.getXYFromPointer(200)).toStrictEqual([
      200 - Math.floor(200 / canvas.width) * canvas.width, Math.floor(200 / canvas.width),
    ]);
  });

  it('should properly move cursor up with default arguments', () => {
    expect.hasAssertions();

    const canvas = new Canvas({ width: 20, height: 10 });

    expect(canvas.cursorY).toStrictEqual(0);
    expect(canvas.up()).toBeInstanceOf(Canvas);
    expect(canvas.cursorY).toStrictEqual(-1);
  });

  it('should properly move cursor up with custom arguments', () => {
    expect.hasAssertions();

    const canvas = new Canvas({ width: 20, height: 10 });

    expect(canvas.cursorY).toStrictEqual(0);
    expect(canvas.up(5)).toBeInstanceOf(Canvas);
    expect(canvas.cursorY).toStrictEqual(-5);
  });

  it('should properly move cursor down with default arguments', () => {
    expect.hasAssertions();

    const canvas = new Canvas({ width: 20, height: 10 });

    expect(canvas.cursorY).toStrictEqual(0);
    expect(canvas.down()).toBeInstanceOf(Canvas);
    expect(canvas.cursorY).toStrictEqual(1);
  });

  it('should properly move cursor down with custom arguments', () => {
    expect.hasAssertions();

    const canvas = new Canvas({ width: 20, height: 10 });

    expect(canvas.cursorY).toStrictEqual(0);
    expect(canvas.down(5)).toBeInstanceOf(Canvas);
    expect(canvas.cursorY).toStrictEqual(5);
  });

  it('should properly move cursor right with default arguments', () => {
    expect.hasAssertions();

    const canvas = new Canvas({ width: 20, height: 10 });

    expect(canvas.cursorX).toStrictEqual(0);
    expect(canvas.right()).toBeInstanceOf(Canvas);
    expect(canvas.cursorX).toStrictEqual(1);
  });

  it('should properly move cursor right with custom arguments', () => {
    expect.hasAssertions();

    const canvas = new Canvas({ width: 20, height: 10 });

    expect(canvas.cursorX).toStrictEqual(0);
    expect(canvas.right(5)).toBeInstanceOf(Canvas);
    expect(canvas.cursorX).toStrictEqual(5);
  });

  it('should properly move cursor left with default arguments', () => {
    expect.hasAssertions();

    const canvas = new Canvas({ width: 20, height: 10 });

    expect(canvas.cursorX).toStrictEqual(0);
    expect(canvas.left()).toBeInstanceOf(Canvas);
    expect(canvas.cursorX).toStrictEqual(-1);
  });

  it('should properly move cursor left with custom arguments', () => {
    expect.hasAssertions();

    const canvas = new Canvas({ width: 20, height: 10 });

    expect(canvas.cursorX).toStrictEqual(0);
    expect(canvas.left(5)).toBeInstanceOf(Canvas);
    expect(canvas.cursorX).toStrictEqual(-5);
  });

  it('should properly set relative position of cursor', () => {
    expect.hasAssertions();

    const canvas = new Canvas({ width: 20, height: 10 });
    const rightSpy = jest.spyOn(canvas, 'right');
    const downSpy = jest.spyOn(canvas, 'down');
    const leftSpy = jest.spyOn(canvas, 'left');
    const upSpy = jest.spyOn(canvas, 'up');

    expect(canvas.moveBy(10, 20)).toBeInstanceOf(Canvas);
    expect(canvas.moveBy(-5, -10)).toBeInstanceOf(Canvas);
    expect(rightSpy.mock.calls[0][0]).toStrictEqual(10);
    expect(downSpy.mock.calls[0][0]).toStrictEqual(20);
    expect(leftSpy.mock.calls[0][0]).toStrictEqual(5);
    expect(upSpy.mock.calls[0][0]).toStrictEqual(10);
  });

  it('should properly set absolute position of cursor', () => {
    expect.hasAssertions();

    const canvas = new Canvas({ width: 20, height: 10 });

    expect(canvas.cursorX).toStrictEqual(0);
    expect(canvas.cursorY).toStrictEqual(0);
    expect(canvas.moveTo(5, 10)).toBeInstanceOf(Canvas);
    expect(canvas.cursorX).toStrictEqual(5);
    expect(canvas.cursorY).toStrictEqual(10);
  });

  it('should properly change foreground color', () => {
    expect.hasAssertions();

    const canvas = new Canvas({ width: 20, height: 10 });

    expect(canvas.cursorForeground).toStrictEqual({ r: -1, g: -1, b: -1 });
    expect(canvas.foreground('white')).toBeInstanceOf(Canvas);
    expect(canvas.cursorForeground).toStrictEqual({ r: 255, g: 255, b: 255 });
    expect(canvas.foreground('none')).toBeInstanceOf(Canvas);
    expect(canvas.cursorForeground).toStrictEqual({ r: -1, g: -1, b: -1 });
  });

  it('should properly change background color', () => {
    expect.hasAssertions();

    const canvas = new Canvas({ width: 20, height: 10 });

    expect(canvas.cursorBackground).toStrictEqual({ r: -1, g: -1, b: -1 });
    expect(canvas.background('black')).toBeInstanceOf(Canvas);
    expect(canvas.cursorBackground).toStrictEqual({ r: 0, g: 0, b: 0 });
    expect(canvas.background('none')).toBeInstanceOf(Canvas);
    expect(canvas.cursorBackground).toStrictEqual({ r: -1, g: -1, b: -1 });
  });

  it('should properly toggle bold mode', () => {
    expect.hasAssertions();

    const canvas = new Canvas({ width: 20, height: 10 });

    expect(canvas.bold()).toBeInstanceOf(Canvas);
    expect(canvas.cursorDisplay.bold).toBe(true);
    expect(canvas.bold(false)).toBeInstanceOf(Canvas);
    expect(canvas.cursorDisplay.bold).toBe(false);
  });

  it('should properly toggle dim mode', () => {
    expect.hasAssertions();

    const canvas = new Canvas({ width: 20, height: 10 });

    expect(canvas.dim()).toBeInstanceOf(Canvas);
    expect(canvas.cursorDisplay.dim).toBe(true);
    expect(canvas.dim(false)).toBeInstanceOf(Canvas);
    expect(canvas.cursorDisplay.dim).toBe(false);
  });

  it('should properly toggle underlined mode', () => {
    expect.hasAssertions();

    const canvas = new Canvas({ width: 20, height: 10 });

    expect(canvas.underlined()).toBeInstanceOf(Canvas);
    expect(canvas.cursorDisplay.underlined).toBe(true);
    expect(canvas.underlined(false)).toBeInstanceOf(Canvas);
    expect(canvas.cursorDisplay.underlined).toBe(false);
  });

  it('should properly toggle blink mode', () => {
    expect.hasAssertions();

    const canvas = new Canvas({ width: 20, height: 10 });

    expect(canvas.blink()).toBeInstanceOf(Canvas);
    expect(canvas.cursorDisplay.blink).toBe(true);
    expect(canvas.blink(false)).toBeInstanceOf(Canvas);
    expect(canvas.cursorDisplay.blink).toBe(false);
  });

  it('should properly toggle reverse mode', () => {
    expect.hasAssertions();

    const canvas = new Canvas({ width: 20, height: 10 });

    expect(canvas.reverse()).toBeInstanceOf(Canvas);
    expect(canvas.cursorDisplay.reverse).toBe(true);
    expect(canvas.reverse(false)).toBeInstanceOf(Canvas);
    expect(canvas.cursorDisplay.reverse).toBe(false);
  });

  it('should properly toggle hidden mode', () => {
    expect.hasAssertions();

    const canvas = new Canvas({ width: 20, height: 10 });

    expect(canvas.hidden()).toBeInstanceOf(Canvas);
    expect(canvas.cursorDisplay.hidden).toBe(true);
    expect(canvas.hidden(false)).toBeInstanceOf(Canvas);
    expect(canvas.cursorDisplay.hidden).toBe(false);
  });

  it('should properly erase the specified region', () => {
    expect.hasAssertions();

    const canvas = new Canvas({ width: 20, height: 10 });
    const spy = jest.spyOn(canvas, 'getPointerFromXY').mockImplementation(() => 0);

    expect(canvas.moveTo(5, 5).erase(0, 0, 5, 5)).toBeInstanceOf(Canvas);
    expect(spy.mock.calls).toHaveLength(36);
  });

  it('should properly ignore reset method on the cell if out of boundaries', () => {
    expect.hasAssertions();

    const canvas = new Canvas({ width: 20, height: 10 });
    expect(canvas.erase(0, 0, 30, 30)).toBeInstanceOf(Canvas);
  });

  it('should properly erase from current position to the end of line', () => {
    expect.hasAssertions();

    const canvas = new Canvas({ width: 20, height: 10 });
    const spy = jest.spyOn(canvas, 'erase').mockImplementation(() => canvas);

    expect(canvas.moveTo(5, 5).eraseToEnd()).toBeInstanceOf(Canvas);
    expect(spy.mock.calls[0]).toMatchObject([5, 5, 20 - 1, 5]);
  });

  it('should properly erase from current position to the start of line', () => {
    expect.hasAssertions();

    const canvas = new Canvas({ width: 20, height: 10 });
    const spy = jest.spyOn(canvas, 'erase').mockImplementation(() => canvas);

    expect(canvas.moveTo(5, 5).eraseToStart()).toBeInstanceOf(Canvas);
    expect(spy.mock.calls[0]).toMatchObject([0, 5, 5, 5]);
  });

  it('should properly erase from current line to down', () => {
    expect.hasAssertions();

    const canvas = new Canvas({ width: 20, height: 10 });
    const spy = jest.spyOn(canvas, 'erase').mockImplementation(() => canvas);

    expect(canvas.moveTo(5, 5).eraseToDown()).toBeInstanceOf(Canvas);
    expect(spy.mock.calls[0]).toMatchObject([0, 5, 20 - 1, 10 - 1]);
  });

  it('should properly erase from current line to up', () => {
    expect.hasAssertions();

    const canvas = new Canvas({ width: 20, height: 10 });
    const spy = jest.spyOn(canvas, 'erase').mockImplementation(() => canvas);

    expect(canvas.moveTo(5, 5).eraseToUp()).toBeInstanceOf(Canvas);
    expect(spy.mock.calls[0]).toMatchObject([0, 0, 20 - 1, 5]);
  });

  it('should properly erase the current line', () => {
    expect.hasAssertions();

    const canvas = new Canvas({ width: 20, height: 10 });
    const spy = jest.spyOn(canvas, 'erase').mockImplementation(() => canvas);

    expect(canvas.moveTo(5, 5).eraseLine()).toBeInstanceOf(Canvas);
    expect(spy.mock.calls[0]).toMatchObject([0, 5, 20 - 1, 5]);
  });

  it('should properly erase the entire screen', () => {
    expect.hasAssertions();

    const canvas = new Canvas({ width: 20, height: 10 });
    const spy = jest.spyOn(canvas, 'erase').mockImplementation(() => canvas);

    expect(canvas.eraseScreen()).toBeInstanceOf(Canvas);
    expect(spy.mock.calls[0]).toMatchObject([0, 0, 20 - 1, 10 - 1]);
  });

  it('should properly save the screen contents', () => {
    expect.hasAssertions();

    const canvas = new Canvas({ width: 20, height: 10 });
    const spy = jest.spyOn(process.stdout, 'write');

    expect(canvas.saveScreen()).toBeInstanceOf(Canvas);
    expect(spy.mock.calls).toHaveLength(1);
    expect(spy.mock.calls[0][0]).toStrictEqual('\u001b[?47h');
  });

  it('should properly restore the screen contents', () => {
    expect.hasAssertions();

    const canvas = new Canvas({ width: 20, height: 10 });
    const spy = jest.spyOn(process.stdout, 'write');

    expect(canvas.restoreScreen()).toBeInstanceOf(Canvas);
    expect(spy.mock.calls).toHaveLength(1);
    expect(spy.mock.calls[0][0]).toStrictEqual('\u001b[?47l');
  });

  it('should properly hide the cursor', () => {
    expect.hasAssertions();

    const canvas = new Canvas({ width: 20, height: 10 });
    const spy = jest.spyOn(process.stdout, 'write');

    expect(canvas.hideCursor()).toBeInstanceOf(Canvas);
    expect(spy.mock.calls).toHaveLength(1);
    expect(spy.mock.calls[0][0]).toStrictEqual('\u001b[?25l');
  });

  it('should properly show the cursor', () => {
    expect.hasAssertions();

    const canvas = new Canvas({ width: 20, height: 10 });
    const spy = jest.spyOn(process.stdout, 'write');

    expect(canvas.showCursor()).toBeInstanceOf(Canvas);
    expect(spy.mock.calls).toHaveLength(1);
    expect(spy.mock.calls[0][0]).toStrictEqual('\u001b[?25h');
  });

  it('should properly reset the TTY state', () => {
    expect.hasAssertions();

    const canvas = new Canvas({ width: 20, height: 10 });
    const spy = jest.spyOn(process.stdout, 'write');

    expect(canvas.reset()).toBeInstanceOf(Canvas);
    expect(spy.mock.calls).toHaveLength(1);
    expect(spy.mock.calls[0][0]).toStrictEqual('\u001bc');
  });

  it('should properly create new instance from static create()', () => {
    expect.hasAssertions();

    const canvas = Canvas.create();

    expect(canvas).toBeInstanceOf(Canvas);
    expect(canvas.stream).toStrictEqual(process.stdout);
    expect(canvas.width).toStrictEqual(process.stdout.columns);
    expect(canvas.height).toStrictEqual(process.stdout.rows);
    expect(canvas.cursorX).toStrictEqual(0);
    expect(canvas.cursorY).toStrictEqual(0);
    expect(canvas.cursorBackground).toStrictEqual({ r: -1, g: -1, b: -1 });
    expect(canvas.cursorForeground).toStrictEqual({ r: -1, g: -1, b: -1 });
    expect(canvas.cursorDisplay.bold).toBe(false);
    expect(canvas.cursorDisplay.dim).toBe(false);
    expect(canvas.cursorDisplay.underlined).toBe(false);
    expect(canvas.cursorDisplay.blink).toBe(false);
    expect(canvas.cursorDisplay.reverse).toBe(false);
    expect(canvas.cursorDisplay.hidden).toBe(false);
  });
});
