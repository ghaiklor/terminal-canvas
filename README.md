# terminal-canvas

![Build Status](https://img.shields.io/travis/ghaiklor/terminal-canvas.svg)
![Coverage](https://img.shields.io/coveralls/ghaiklor/terminal-canvas.svg)

![Downloads](https://img.shields.io/npm/dm/terminal-canvas.svg)
![Downloads](https://img.shields.io/npm/dt/terminal-canvas.svg)
![npm version](https://img.shields.io/npm/v/terminal-canvas.svg)
![License](https://img.shields.io/npm/l/terminal-canvas.svg)

[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
![dependencies](https://img.shields.io/david/ghaiklor/terminal-canvas.svg)
![dev dependencies](https://img.shields.io/david/dev/ghaiklor/terminal-canvas.svg)

Entirely written with JavaScript, terminal-canvas exposes features that you can use for rendering in terminal.
High-performance algorithms and optimisations allow to render only cells which have been changed.
Just look at the demo videos below to see, what you can do with terminal-canvas :smiley:

## Demo

| Touhou - Bad Apple  | Rick Astley - Never Gonna Give You Up |
| ------------------- | ------------------------------------- |
| [![Touhou - Bad Apple](https://img.youtube.com/vi/_KpDKTihgxY/0.jpg)](https://www.youtube.com/watch?v=_KpDKTihgxY) | [![ Rick Astley - Never Gonna Give You Up ](https://img.youtube.com/vi/IsD3qn63-i4/0.jpg)](https://www.youtube.com/watch?v=IsD3qn63-i4) |

## Getting Started

Install it via npm:

```shell
npm install terminal-canvas
```

Include in your project:

```javascript
import Canvas from 'terminal-canvas';

const canvas = new Canvas();

canvas.moveTo(10, 10).write('Hello, world').flush();
```

## API

You can find API documentation [here](./API.md)

## Examples

A lot of examples are available to you [here](./examples)

## How terminal-canvas works?

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

In result, I was getting performance issues.
So I decided to implement own wrapper around terminal and cells.

Each real cell in the terminal has a wrapper (class Cell in the src folder).
The main problem, which Cell resolves, is to render each cell independently from another cells.
So I can grab any cell at any coordinate and render only it.

It works the next way.
Each Cell has style settings and position in the real terminal.
When you are converting Cell to the control sequences, it concatenate the following sequences:

- Convert cell position to control sequence
- Convert foreground and background color to control sequence
- Convert display settings to control sequences
- Prepend the cell char with sequences above
- Reset all display settings to default

That way, each cell wrapped in own control sequences that can be flushed at any moment.

### Difference between two frames

The last thing, that I made, is to update only cells, that really was changed.

The algorithm is simple.

When you are writing to the canvas, all write operations mark virtual cells as modified cells.
After some time, you decide to flush changes. When flush() method was called it does 2 things:

- Iterate through all cells and find only cells with modified marker;
- Convert modified cell to control sequence and compare that sequence with the sequence which was used at the previous frame;
- If they are not equal, store new control sequence and write to stream, otherwise, ignore it

That's how I made possible to render videos in the terminal at 30 FPS.
BTW, if I remove Throttle stream, I'm getting 120 FPS :smiley:

## License

The MIT License (MIT)

Copyright (c) 2015-2016 Eugene Obrezkov

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
