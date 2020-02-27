# terminal-canvas

![Travis (.com)](https://img.shields.io/travis/com/ghaiklor/terminal-canvas?style=for-the-badge)
![Codecov](https://img.shields.io/codecov/c/gh/ghaiklor/terminal-canvas?style=for-the-badge)
![npm](https://img.shields.io/npm/dt/terminal-canvas?style=for-the-badge)

[![GitHub Follow](https://img.shields.io/github/followers/ghaiklor.svg?label=Follow&style=social)](https://github.com/ghaiklor)
[![Twitter Follow](https://img.shields.io/twitter/follow/ghaiklor.svg?label=Follow&style=social)](https://twitter.com/ghaiklor)

Manipulate the cursor in your terminal via high-performant, low-level, canvas-like API.

Entirely written with TypeScript, terminal-canvas exposes features that you can use for rendering in terminal.
High-performance algorithms and optimizations allow to render only cells which have been changed.
Just look at the demo videos below to see, what you can do with terminal-canvas :smiley:

## Demo

|     Touhou - Bad Apple     | Rick Astley - Never Gonna Give You Up |             Casa Linda             |
| :------------------------: | :-----------------------------------: | :--------------------------------: |
| [![1][Touhou P]][Touhou V] | [![1][Rick Astley P]][Rick Astley V]  | [![1][Casa Linda P]][Casa Linda V] |

## Getting Started

Install it via npm:

```shell
npm install terminal-canvas
```

Include in your project:

```javascript
const Canvas = require('terminal-canvas');
const canvas = new Canvas();

canvas.moveTo(10, 10).write('Hello, world').flush();
```

## Examples

A lot of examples are available to you [here](./examples)

## API Reference

API Reference is accessible [here](https://ghaiklor.github.io/terminal-canvas/)

## How terminal-canvas works

### Control Sequences

terminal-canvas uses VT100 compatible control sequences to manipulate the cursor in the terminal.

You can find a lot of useful information about that here:

- [Terminal codes (ANSI/VT100) introduction](http://wiki.bash-hackers.org/scripting/terminalcodes)
- [ANSI/VT100 Terminal Control Escape Sequences](http://www.termsys.demon.co.uk/vtansi.htm)
- [Colors and formatting (ANSI/VT100 Control sequences)](http://misc.flogisoft.com/bash/tip_colors_and_formatting)
- [Xterm Control Sequences](http://www.x.org/docs/xterm/ctlseqs.pdf)
- [CONSOLE_CODES (man page)](http://man7.org/linux/man-pages/man4/console_codes.4.html)

The next thing which terminal-canvas does is wrap those control codes, so you are able to call JavaScript methods.

### Virtual Terminal

The first releases of the terminal-canvas (which was kittik-cursor) were based on real-time updating terminal cursor, when you are calling some method on the canvas.

This caused performance issues.
So I decided to create my own wrapper around terminal cells.

Each real cell in the terminal has a wrapper (class Cell in the src folder).
The main problem, which Cell resolves, is to render each cell independently from another cells.
So I can grab any cell at any coordinate and render it independently from others.

It works the following way.
Each Cell has style settings and position in the real terminal.
When you are converting Cell to the control sequences, it concatenates the following sequences:

1. Convert cell position to control sequence
2. Convert foreground and background color to control sequence
3. Convert display settings to control sequences
4. Pre-pend the cell char with sequences above
5. Reset all display settings to default

That way, each cell wrapped in own control sequences that can be flushed at any moment.

### Difference between two frames

The last thing I did, was update only cells that really changed.

The algorithm is simple.

When you are writing to the canvas, all write operations mark virtual cells as modified cells.
After some time, you decide to flush changes. When flush() method is called it does 2 things:

1. Iterate through all cells and find only cells with modified marker;
2. Convert modified cell to control sequence and compare that sequence with the sequence that was used at the previous frame;
3. If they are not equal, store new control sequence and write to stream, otherwise, ignore it

That's how I made it possible to render videos in the terminal at 30 FPS.

BTW, if I remove Throttle stream, I'm getting 120 FPS :smiley:

## License

[MIT](./LICENSE)

[Touhou P]: https://img.youtube.com/vi/_KpDKTihgxY/0.jpg
[Rick Astley P]: https://img.youtube.com/vi/JffWhWba2M4/0.jpg
[Casa Linda P]: https://img.youtube.com/vi/ZhN-9Wz97bs/0.jpg
[Touhou V]: https://www.youtube.com/watch?v=_KpDKTihgxY
[Rick Astley V]: https://www.youtube.com/watch?v=JffWhWba2M4
[Casa Linda V]: https://www.youtube.com/watch?v=ZhN-9Wz97bs
