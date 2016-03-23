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

## Demo

<a href="http://www.youtube.com/watch?feature=player_embedded&v=_KpDKTihgxY" target="_blank">
  <img src="http://img.youtube.com/vi/_KpDKTihgxY/0.jpg" alt="Touhou - Bad Apple (Terminal Edition)" width="240" height="180" border="10"/>
</a>

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
