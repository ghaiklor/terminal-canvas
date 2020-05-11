import { Canvas } from '../src/canvas/Canvas';

describe('Canvas', () => {
  it('Should properly initialize with default arguments', () => {
    const canvas = new Canvas();

    expect(canvas).toBeInstanceOf(Canvas);
    expect(canvas.stream).toEqual(process.stdout);
    expect(canvas.width).toEqual(process.stdout.columns);
    expect(canvas.height).toEqual(process.stdout.rows);
    expect(canvas.cursorX).toEqual(0);
    expect(canvas.cursorY).toEqual(0);
    expect(canvas.cursorBackground).toEqual({ r: -1, g: -1, b: -1 });
    expect(canvas.cursorForeground).toEqual({ r: -1, g: -1, b: -1 });
    expect(canvas.cursorDisplay.bold).toBeFalsy();
    expect(canvas.cursorDisplay.dim).toBeFalsy();
    expect(canvas.cursorDisplay.underlined).toBeFalsy();
    expect(canvas.cursorDisplay.blink).toBeFalsy();
    expect(canvas.cursorDisplay.reverse).toBeFalsy();
    expect(canvas.cursorDisplay.hidden).toBeFalsy();
  });

  it('Should properly initialize with custom arguments', () => {
    const canvas = new Canvas({ stream: process.stdout, width: 10, height: 20 });

    expect(canvas).toBeInstanceOf(Canvas);
    expect(canvas.stream).toEqual(process.stdout);
    expect(canvas.width).toEqual(10);
    expect(canvas.height).toEqual(20);
    expect(canvas.cursorX).toEqual(0);
    expect(canvas.cursorY).toEqual(0);
    expect(canvas.cursorBackground).toEqual({ r: -1, g: -1, b: -1 });
    expect(canvas.cursorForeground).toEqual({ r: -1, g: -1, b: -1 });
    expect(canvas.cursorDisplay.bold).toBeFalsy();
    expect(canvas.cursorDisplay.dim).toBeFalsy();
    expect(canvas.cursorDisplay.underlined).toBeFalsy();
    expect(canvas.cursorDisplay.blink).toBeFalsy();
    expect(canvas.cursorDisplay.reverse).toBeFalsy();
    expect(canvas.cursorDisplay.hidden).toBeFalsy();
    expect(canvas.cells.length).toEqual(10 * 20);
  });

  it('Should properly initialize with custom width argument', () => {
    const canvas = new Canvas({ width: 10 });

    expect(canvas.stream).toEqual(process.stdout);
    expect(canvas.width).toEqual(10);
    expect(canvas.height).toEqual(process.stdout.rows);
  });

  it('Should properly initialize with custom height argument', () => {
    const canvas = new Canvas({ height: 10 });

    expect(canvas.stream).toEqual(process.stdout);
    expect(canvas.width).toEqual(process.stdout.columns);
    expect(canvas.height).toEqual(10);
  });

  it('Should properly initialize the coordinates for the cells', () => {
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

  it('Should properly write to the canvas', () => {
    const canvas = new Canvas({ width: 20, height: 10 });
    expect(canvas.cells[0].getChar()).toEqual(' ');

    canvas.write('test');
    expect(canvas.cells[0].toString()).toEqual('\u001b[1;1ft\u001b[0m');
    expect(canvas.cells[1].toString()).toEqual('\u001b[1;2fe\u001b[0m');
    expect(canvas.cells[2].toString()).toEqual('\u001b[1;3fs\u001b[0m');
    expect(canvas.cells[3].toString()).toEqual('\u001b[1;4ft\u001b[0m');
  });

  it('Should properly ignore write if out of the bounding box', () => {
    const canvas = new Canvas({ width: 20, height: 10 });
    expect(canvas.cells[0].getChar()).toEqual(' ');

    canvas.write('test');
    expect(canvas.cells[0].toString()).toEqual('\u001b[1;1ft\u001b[0m');
    expect(canvas.cells[1].toString()).toEqual('\u001b[1;2fe\u001b[0m');
    expect(canvas.cells[2].toString()).toEqual('\u001b[1;3fs\u001b[0m');
    expect(canvas.cells[3].toString()).toEqual('\u001b[1;4ft\u001b[0m');

    canvas.moveTo(-5, -5).write('do not print');
    expect(canvas.cells[0].toString()).toEqual('\u001b[1;1ft\u001b[0m');
    expect(canvas.cells[1].toString()).toEqual('\u001b[1;2fe\u001b[0m');
    expect(canvas.cells[2].toString()).toEqual('\u001b[1;3fs\u001b[0m');
    expect(canvas.cells[3].toString()).toEqual('\u001b[1;4ft\u001b[0m');
    expect(canvas.cells[4].getChar()).toEqual(' ');
  });

  it('Should properly flush the buffer into the stream', () => {
    const canvas = new Canvas({ width: 20, height: 10 });
    const spy = jest.spyOn(process.stdout, 'write');

    expect(canvas.write('test')).toBeInstanceOf(Canvas);
    expect(canvas.flush()).toBeInstanceOf(Canvas);
    expect(canvas.moveTo(0, 0).write('1234')).toBeInstanceOf(Canvas);
    expect(canvas.flush()).toBeInstanceOf(Canvas);
    expect(spy.mock.calls.length).toEqual(2);
  });

  it('Should properly skip the flush when changes the same', () => {
    const canvas = new Canvas({ width: 20, height: 10 });
    const spy = jest.spyOn(process.stdout, 'write');

    expect(canvas.write('test')).toBeInstanceOf(Canvas);
    expect(canvas.flush()).toBeInstanceOf(Canvas);
    expect(canvas.moveTo(0, 0).write('test')).toBeInstanceOf(Canvas);
    expect(canvas.flush()).toBeInstanceOf(Canvas);
    expect(spy.mock.calls.length).toEqual(2);
  });

  it('Should properly calculate buffer pointer', () => {
    const canvas = new Canvas({ width: 20, height: 10 });

    expect(canvas.getPointerFromXY()).toEqual(0);
    expect(canvas.moveTo(10, 10)).toBeInstanceOf(Canvas);
    expect(canvas.getPointerFromXY()).toEqual(10 * 20 + 10);
    expect(canvas.getPointerFromXY(20, 20)).toEqual(20 * 20 + 20);
  });

  it('Should properly calculate coordinates from buffer pointer', () => {
    const canvas = new Canvas({ width: 20, height: 10 });

    expect(canvas.getXYFromPointer(0)).toEqual([0, 0]);
    expect(canvas.getXYFromPointer(1)).toEqual([1, 0]);
    expect(canvas.getXYFromPointer(10)).toEqual([10, 0]);
    expect(canvas.getXYFromPointer(200)).toEqual([200 - (Math.floor(200 / canvas.width) * canvas.width), Math.floor(200 / canvas.width)]);
  });

  it('Should properly move cursor up with default arguments', () => {
    const canvas = new Canvas({ width: 20, height: 10 });

    expect(canvas.cursorY).toEqual(0);
    expect(canvas.up()).toBeInstanceOf(Canvas);
    expect(canvas.cursorY).toEqual(-1);
  });

  it('Should properly move cursor up with custom arguments', () => {
    const canvas = new Canvas({ width: 20, height: 10 });

    expect(canvas.cursorY).toEqual(0);
    expect(canvas.up(5)).toBeInstanceOf(Canvas);
    expect(canvas.cursorY).toEqual(-5);
  });

  it('Should properly move cursor down with default arguments', () => {
    const canvas = new Canvas({ width: 20, height: 10 });

    expect(canvas.cursorY).toEqual(0);
    expect(canvas.down()).toBeInstanceOf(Canvas);
    expect(canvas.cursorY).toEqual(1);
  });

  it('Should properly move cursor down with custom arguments', () => {
    const canvas = new Canvas({ width: 20, height: 10 });

    expect(canvas.cursorY).toEqual(0);
    expect(canvas.down(5)).toBeInstanceOf(Canvas);
    expect(canvas.cursorY).toEqual(5);
  });

  it('Should properly move cursor right with default arguments', () => {
    const canvas = new Canvas({ width: 20, height: 10 });

    expect(canvas.cursorX).toEqual(0);
    expect(canvas.right()).toBeInstanceOf(Canvas);
    expect(canvas.cursorX).toEqual(1);
  });

  it('Should properly move cursor right with custom arguments', () => {
    const canvas = new Canvas({ width: 20, height: 10 });

    expect(canvas.cursorX).toEqual(0);
    expect(canvas.right(5)).toBeInstanceOf(Canvas);
    expect(canvas.cursorX).toEqual(5);
  });

  it('Should properly move cursor left with default arguments', () => {
    const canvas = new Canvas({ width: 20, height: 10 });

    expect(canvas.cursorX).toEqual(0);
    expect(canvas.left()).toBeInstanceOf(Canvas);
    expect(canvas.cursorX).toEqual(-1);
  });

  it('Should properly move cursor left with custom arguments', () => {
    const canvas = new Canvas({ width: 20, height: 10 });

    expect(canvas.cursorX).toEqual(0);
    expect(canvas.left(5)).toBeInstanceOf(Canvas);
    expect(canvas.cursorX).toEqual(-5);
  });

  it('Should properly set relative position of cursor', () => {
    const canvas = new Canvas({ width: 20, height: 10 });
    const rightSpy = jest.spyOn(canvas, 'right');
    const downSpy = jest.spyOn(canvas, 'down');
    const leftSpy = jest.spyOn(canvas, 'left');
    const upSpy = jest.spyOn(canvas, 'up');

    expect(canvas.moveBy(10, 20)).toBeInstanceOf(Canvas);
    expect(canvas.moveBy(-5, -10)).toBeInstanceOf(Canvas);
    expect(rightSpy.mock.calls[0][0]).toEqual(10);
    expect(downSpy.mock.calls[0][0]).toEqual(20);
    expect(leftSpy.mock.calls[0][0]).toEqual(5);
    expect(upSpy.mock.calls[0][0]).toEqual(10);
  });

  it('Should properly set absolute position of cursor', () => {
    const canvas = new Canvas({ width: 20, height: 10 });

    expect(canvas.cursorX).toEqual(0);
    expect(canvas.cursorY).toEqual(0);
    expect(canvas.moveTo(5, 10)).toBeInstanceOf(Canvas);
    expect(canvas.cursorX).toEqual(5);
    expect(canvas.cursorY).toEqual(10);
  });

  it('Should properly change foreground color', () => {
    const canvas = new Canvas({ width: 20, height: 10 });

    expect(canvas.cursorForeground).toEqual({ r: -1, g: -1, b: -1 });
    expect(canvas.foreground('white')).toBeInstanceOf(Canvas);
    expect(canvas.cursorForeground).toEqual({ r: 255, g: 255, b: 255 });
    expect(canvas.foreground('none')).toBeInstanceOf(Canvas);
    expect(canvas.cursorForeground).toEqual({ r: -1, g: -1, b: -1 });
  });

  it('Should properly change background color', () => {
    const canvas = new Canvas({ width: 20, height: 10 });

    expect(canvas.cursorBackground).toEqual({ r: -1, g: -1, b: -1 });
    expect(canvas.background('black')).toBeInstanceOf(Canvas);
    expect(canvas.cursorBackground).toEqual({ r: 0, g: 0, b: 0 });
    expect(canvas.background('none')).toBeInstanceOf(Canvas);
    expect(canvas.cursorBackground).toEqual({ r: -1, g: -1, b: -1 });
  });

  it('Should properly toggle bold mode', () => {
    const canvas = new Canvas({ width: 20, height: 10 });

    expect(canvas.bold()).toBeInstanceOf(Canvas);
    expect(canvas.cursorDisplay.bold).toBeTruthy();
    expect(canvas.bold(false)).toBeInstanceOf(Canvas);
    expect(canvas.cursorDisplay.bold).toBeFalsy();
  });

  it('Should properly toggle dim mode', () => {
    const canvas = new Canvas({ width: 20, height: 10 });

    expect(canvas.dim()).toBeInstanceOf(Canvas);
    expect(canvas.cursorDisplay.dim).toBeTruthy();
    expect(canvas.dim(false)).toBeInstanceOf(Canvas);
    expect(canvas.cursorDisplay.dim).toBeFalsy();
  });

  it('Should properly toggle underlined mode', () => {
    const canvas = new Canvas({ width: 20, height: 10 });

    expect(canvas.underlined()).toBeInstanceOf(Canvas);
    expect(canvas.cursorDisplay.underlined).toBeTruthy();
    expect(canvas.underlined(false)).toBeInstanceOf(Canvas);
    expect(canvas.cursorDisplay.underlined).toBeFalsy();
  });

  it('Should properly toggle blink mode', () => {
    const canvas = new Canvas({ width: 20, height: 10 });

    expect(canvas.blink()).toBeInstanceOf(Canvas);
    expect(canvas.cursorDisplay.blink).toBeTruthy();
    expect(canvas.blink(false)).toBeInstanceOf(Canvas);
    expect(canvas.cursorDisplay.blink).toBeFalsy();
  });

  it('Should properly toggle reverse mode', () => {
    const canvas = new Canvas({ width: 20, height: 10 });

    expect(canvas.reverse()).toBeInstanceOf(Canvas);
    expect(canvas.cursorDisplay.reverse).toBeTruthy();
    expect(canvas.reverse(false)).toBeInstanceOf(Canvas);
    expect(canvas.cursorDisplay.reverse).toBeFalsy();
  });

  it('Should properly toggle hidden mode', () => {
    const canvas = new Canvas({ width: 20, height: 10 });

    expect(canvas.hidden()).toBeInstanceOf(Canvas);
    expect(canvas.cursorDisplay.hidden).toBeTruthy();
    expect(canvas.hidden(false)).toBeInstanceOf(Canvas);
    expect(canvas.cursorDisplay.hidden).toBeFalsy();
  });

  it('Should properly erase the specified region', () => {
    const canvas = new Canvas({ width: 20, height: 10 });
    const spy = jest.spyOn(canvas, 'getPointerFromXY').mockImplementation(() => 0);

    expect(canvas.moveTo(5, 5).erase(0, 0, 5, 5)).toBeInstanceOf(Canvas);
    expect(spy.mock.calls.length).toEqual(36);
  });

  it('Should properly ignore reset method on the cell if out of boundaries', () => {
    const canvas = new Canvas({ width: 20, height: 10 });
    expect(canvas.erase(0, 0, 30, 30)).toBeInstanceOf(Canvas);
  });

  it('Should properly erase from current position to the end of line', () => {
    const canvas = new Canvas({ width: 20, height: 10 });
    const spy = jest.spyOn(canvas, 'erase').mockImplementation(() => canvas);

    expect(canvas.moveTo(5, 5).eraseToEnd()).toBeInstanceOf(Canvas);
    expect(spy.mock.calls[0]).toEqual([5, 5, 20 - 1, 5]);
  });

  it('Should properly erase from current position to the start of line', () => {
    const canvas = new Canvas({ width: 20, height: 10 });
    const spy = jest.spyOn(canvas, 'erase').mockImplementation(() => canvas);

    expect(canvas.moveTo(5, 5).eraseToStart()).toBeInstanceOf(Canvas);
    expect(spy.mock.calls[0]).toEqual([0, 5, 5, 5]);
  });

  it('Should properly erase from current line to down', () => {
    const canvas = new Canvas({ width: 20, height: 10 });
    const spy = jest.spyOn(canvas, 'erase').mockImplementation(() => canvas);

    expect(canvas.moveTo(5, 5).eraseToDown()).toBeInstanceOf(Canvas);
    expect(spy.mock.calls[0]).toEqual([0, 5, 20 - 1, 10 - 1]);
  });

  it('Should properly erase from current line to up', () => {
    const canvas = new Canvas({ width: 20, height: 10 });
    const spy = jest.spyOn(canvas, 'erase').mockImplementation(() => canvas);

    expect(canvas.moveTo(5, 5).eraseToUp()).toBeInstanceOf(Canvas);
    expect(spy.mock.calls[0]).toEqual([0, 0, 20 - 1, 5]);
  });

  it('Should properly erase the current line', () => {
    const canvas = new Canvas({ width: 20, height: 10 });
    const spy = jest.spyOn(canvas, 'erase').mockImplementation(() => canvas);

    expect(canvas.moveTo(5, 5).eraseLine()).toBeInstanceOf(Canvas);
    expect(spy.mock.calls[0]).toEqual([0, 5, 20 - 1, 5]);
  });

  it('Should properly erase the entire screen', () => {
    const canvas = new Canvas({ width: 20, height: 10 });
    const spy = jest.spyOn(canvas, 'erase').mockImplementation(() => canvas);

    expect(canvas.eraseScreen()).toBeInstanceOf(Canvas);
    expect(spy.mock.calls[0]).toEqual([0, 0, 20 - 1, 10 - 1]);
  });

  it('Should properly save the screen contents', () => {
    const canvas = new Canvas({ width: 20, height: 10 });
    const spy = jest.spyOn(process.stdout, 'write');

    expect(canvas.saveScreen()).toBeInstanceOf(Canvas);
    expect(spy.mock.calls.length).toEqual(1);
    expect(spy.mock.calls[0][0]).toEqual('\u001b[?47h');
  });

  it('Should properly restore the screen contents', () => {
    const canvas = new Canvas({ width: 20, height: 10 });
    const spy = jest.spyOn(process.stdout, 'write');

    expect(canvas.restoreScreen()).toBeInstanceOf(Canvas);
    expect(spy.mock.calls.length).toEqual(1);
    expect(spy.mock.calls[0][0]).toEqual('\u001b[?47l');
  });

  it('Should properly hide the cursor', () => {
    const canvas = new Canvas({ width: 20, height: 10 });
    const spy = jest.spyOn(process.stdout, 'write');

    expect(canvas.hideCursor()).toBeInstanceOf(Canvas);
    expect(spy.mock.calls.length).toEqual(1);
    expect(spy.mock.calls[0][0]).toEqual('\u001b[?25l');
  });

  it('Should properly show the cursor', () => {
    const canvas = new Canvas({ width: 20, height: 10 });
    const spy = jest.spyOn(process.stdout, 'write');

    expect(canvas.showCursor()).toBeInstanceOf(Canvas);
    expect(spy.mock.calls.length).toEqual(1);
    expect(spy.mock.calls[0][0]).toEqual('\u001b[?25h');
  });

  it('Should properly reset the TTY state', () => {
    const canvas = new Canvas({ width: 20, height: 10 });
    const spy = jest.spyOn(process.stdout, 'write');

    expect(canvas.reset()).toBeInstanceOf(Canvas);
    expect(spy.mock.calls.length).toEqual(1);
    expect(spy.mock.calls[0][0]).toEqual('\u001bc');
  });

  it('Should properly create new instance from static create()', () => {
    const canvas = Canvas.create();

    expect(canvas).toBeInstanceOf(Canvas);
    expect(canvas.stream).toEqual(process.stdout);
    expect(canvas.width).toEqual(process.stdout.columns);
    expect(canvas.height).toEqual(process.stdout.rows);
    expect(canvas.cursorX).toEqual(0);
    expect(canvas.cursorY).toEqual(0);
    expect(canvas.cursorBackground).toEqual({ r: -1, g: -1, b: -1 });
    expect(canvas.cursorForeground).toEqual({ r: -1, g: -1, b: -1 });
    expect(canvas.cursorDisplay.bold).toBeFalsy();
    expect(canvas.cursorDisplay.dim).toBeFalsy();
    expect(canvas.cursorDisplay.underlined).toBeFalsy();
    expect(canvas.cursorDisplay.blink).toBeFalsy();
    expect(canvas.cursorDisplay.reverse).toBeFalsy();
    expect(canvas.cursorDisplay.hidden).toBeFalsy();
  });
});
