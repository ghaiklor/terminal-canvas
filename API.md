## Classes

<dl>
<dt><a href="#Canvas">Canvas</a></dt>
<dd><p>Canvas implements low-level API to terminal control codes.</p>
</dd>
<dt><a href="#Cell">Cell</a></dt>
<dd><p>Wrapper around one cell in the terminal.
Used for filling terminal wrapper in the cursor.</p>
</dd>
<dt><a href="#Color">Color</a></dt>
<dd><p>Color class responsible for converting colors between rgb and hex.</p>
</dd>
</dl>

<a name="Canvas"></a>

## Canvas
Canvas implements low-level API to terminal control codes.

**Kind**: global class  
**See**

- http://www.termsys.demon.co.uk/vtansi.htm
- http://misc.flogisoft.com/bash/tip_colors_and_formatting
- http://man7.org/linux/man-pages/man4/console_codes.4.html
- http://www.x.org/docs/xterm/ctlseqs.pdf
- http://wiki.bash-hackers.org/scripting/terminalcodes

**Since**: 1.0.0  

* [Canvas](#Canvas)
    * [new Canvas([options])](#new_Canvas_new)
    * _instance_
        * [.write(data)](#Canvas+write) ⇒ <code>[Canvas](#Canvas)</code>
        * [.flush()](#Canvas+flush) ⇒ <code>[Canvas](#Canvas)</code>
        * [.getPointerFromXY([x], [y])](#Canvas+getPointerFromXY) ⇒ <code>Number</code>
        * [.getXYFromPointer(index)](#Canvas+getXYFromPointer) ⇒ <code>Array</code>
        * [.up([y])](#Canvas+up) ⇒ <code>[Canvas](#Canvas)</code>
        * [.down([y])](#Canvas+down) ⇒ <code>[Canvas](#Canvas)</code>
        * [.right([x])](#Canvas+right) ⇒ <code>[Canvas](#Canvas)</code>
        * [.left([x])](#Canvas+left) ⇒ <code>[Canvas](#Canvas)</code>
        * [.moveBy(x, y)](#Canvas+moveBy) ⇒ <code>[Canvas](#Canvas)</code>
        * [.moveTo(x, y)](#Canvas+moveTo) ⇒ <code>[Canvas](#Canvas)</code>
        * [.foreground(color)](#Canvas+foreground) ⇒ <code>[Canvas](#Canvas)</code>
        * [.background(color)](#Canvas+background) ⇒ <code>[Canvas](#Canvas)</code>
        * [.bold([isBold])](#Canvas+bold) ⇒ <code>[Canvas](#Canvas)</code>
        * [.dim([isDim])](#Canvas+dim) ⇒ <code>[Canvas](#Canvas)</code>
        * [.underlined([isUnderlined])](#Canvas+underlined) ⇒ <code>[Canvas](#Canvas)</code>
        * [.blink([isBlink])](#Canvas+blink) ⇒ <code>[Canvas](#Canvas)</code>
        * [.reverse([isReverse])](#Canvas+reverse) ⇒ <code>[Canvas](#Canvas)</code>
        * [.hidden([isHidden])](#Canvas+hidden) ⇒ <code>[Canvas](#Canvas)</code>
        * [.erase(x1, y1, x2, y2)](#Canvas+erase) ⇒ <code>[Canvas](#Canvas)</code>
        * [.eraseToEnd()](#Canvas+eraseToEnd) ⇒ <code>[Canvas](#Canvas)</code>
        * [.eraseToStart()](#Canvas+eraseToStart) ⇒ <code>[Canvas](#Canvas)</code>
        * [.eraseToDown()](#Canvas+eraseToDown) ⇒ <code>[Canvas](#Canvas)</code>
        * [.eraseToUp()](#Canvas+eraseToUp) ⇒ <code>[Canvas](#Canvas)</code>
        * [.eraseLine()](#Canvas+eraseLine) ⇒ <code>[Canvas](#Canvas)</code>
        * [.eraseScreen()](#Canvas+eraseScreen) ⇒ <code>[Canvas](#Canvas)</code>
        * [.saveScreen()](#Canvas+saveScreen) ⇒ <code>[Canvas](#Canvas)</code>
        * [.restoreScreen()](#Canvas+restoreScreen) ⇒ <code>[Canvas](#Canvas)</code>
        * [.hideCursor()](#Canvas+hideCursor) ⇒ <code>[Canvas](#Canvas)</code>
        * [.showCursor()](#Canvas+showCursor) ⇒ <code>[Canvas](#Canvas)</code>
        * [.reset()](#Canvas+reset) ⇒ <code>[Canvas](#Canvas)</code>
    * _static_
        * [.create()](#Canvas.create) ⇒ <code>[Canvas](#Canvas)</code>

<a name="new_Canvas_new"></a>

### new Canvas([options])
Creates canvas that writes direct to `stdout` by default.
You can override destination stream with another Writable stream.
Also, you can specify custom width and height of viewport where cursor will render the frame.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> |  |  |
| [options.stream] | <code>Stream</code> | <code>process.stdout</code> | Writable stream |
| [options.width] | <code>Number</code> | <code>stream.columns</code> | Number of columns (width) |
| [options.height] | <code>Number</code> | <code>stream.rows</code> | Number of rows (height) |

**Example**  
```js
Canvas.create({stream: fs.createWriteStream(), width: 20, height: 20});
```
<a name="Canvas+write"></a>

### canvas.write(data) ⇒ <code>[Canvas](#Canvas)</code>
Write to the buffer.
It doesn't applies immediately, but stores in virtual terminal that represented as array of [Cell](#Cell) instances.
For applying changes, you need to call [flush](flush) method.

**Kind**: instance method of <code>[Canvas](#Canvas)</code>  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>String</code> | Data to write to the terminal |

**Example**  
```js
canvas.write('Hello, world').flush();
```
<a name="Canvas+flush"></a>

### canvas.flush() ⇒ <code>[Canvas](#Canvas)</code>
Flush changes to the real terminal, taking only modified cells.
Firstly, we get modified cells that have been affected by [write](write) method.
Secondly, we compare these modified cells with the last frame.
If cell has changes that doesn't equal to the cell from the last frame - write to the stream.

**Kind**: instance method of <code>[Canvas](#Canvas)</code>  
<a name="Canvas+getPointerFromXY"></a>

### canvas.getPointerFromXY([x], [y]) ⇒ <code>Number</code>
Get index of the virtual terminal representation from (x, y) coordinates.

**Kind**: instance method of <code>[Canvas](#Canvas)</code>  
**Returns**: <code>Number</code> - Returns index in the buffer array  

| Param | Type | Description |
| --- | --- | --- |
| [x] | <code>Number</code> | X coordinate on the terminal |
| [y] | <code>Number</code> | Y coordinate on the terminal |

**Example**  
```js
canvas.getPointerFromXY(0, 0); // returns 0
canvas.getPointerFromXY(); // x and y in this case is current position of the cursor
```
<a name="Canvas+getXYFromPointer"></a>

### canvas.getXYFromPointer(index) ⇒ <code>Array</code>
Get (x, y) coordinate from the virtual terminal pointer.

**Kind**: instance method of <code>[Canvas](#Canvas)</code>  
**Returns**: <code>Array</code> - Returns an array [x, y]  

| Param | Type | Description |
| --- | --- | --- |
| index | <code>Number</code> | Index in the buffer |

**Example**  
```js
canvas.getXYFromPointer(0); // returns [0, 0]
```
<a name="Canvas+up"></a>

### canvas.up([y]) ⇒ <code>[Canvas](#Canvas)</code>
Move the cursor up.

**Kind**: instance method of <code>[Canvas](#Canvas)</code>  

| Param | Type | Default |
| --- | --- | --- |
| [y] | <code>Number</code> | <code>1</code> | 

**Example**  
```js
canvas.up(); // moves cursor up by one cell
canvas.up(5); // moves cursor up by five cells
```
<a name="Canvas+down"></a>

### canvas.down([y]) ⇒ <code>[Canvas](#Canvas)</code>
Move the cursor down.

**Kind**: instance method of <code>[Canvas](#Canvas)</code>  

| Param | Type | Default |
| --- | --- | --- |
| [y] | <code>Number</code> | <code>1</code> | 

**Example**  
```js
canvas.down(); // moves cursor down by one cell
canvas.down(5); // moves cursor down by five cells
```
<a name="Canvas+right"></a>

### canvas.right([x]) ⇒ <code>[Canvas](#Canvas)</code>
Move the cursor right.

**Kind**: instance method of <code>[Canvas](#Canvas)</code>  

| Param | Type | Default |
| --- | --- | --- |
| [x] | <code>Number</code> | <code>1</code> | 

**Example**  
```js
canvas.right(); // moves cursor right by one cell
canvas.right(5); // moves cursor right by five cells
```
<a name="Canvas+left"></a>

### canvas.left([x]) ⇒ <code>[Canvas](#Canvas)</code>
Move the cursor left.

**Kind**: instance method of <code>[Canvas](#Canvas)</code>  

| Param | Type | Default |
| --- | --- | --- |
| [x] | <code>Number</code> | <code>1</code> | 

**Example**  
```js
canvas.left(); // moves cursor left by one cell
canvas.left(5); // moves cursor left by five cells
```
<a name="Canvas+moveBy"></a>

### canvas.moveBy(x, y) ⇒ <code>[Canvas](#Canvas)</code>
Move the cursor position relative to the current coordinates.

**Kind**: instance method of <code>[Canvas](#Canvas)</code>  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>Number</code> | Offset by X coordinate |
| y | <code>Number</code> | Offset by Y coordinate |

**Example**  
```js
canvas.moveBy(5, 5); // moves cursor to the right and down by five cells
```
<a name="Canvas+moveTo"></a>

### canvas.moveTo(x, y) ⇒ <code>[Canvas](#Canvas)</code>
Set the cursor position by absolute coordinates.

**Kind**: instance method of <code>[Canvas](#Canvas)</code>  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>Number</code> | X coordinate |
| y | <code>Number</code> | Y coordinate |

**Example**  
```js
canvas.moveTo(10, 10); // moves cursor to the (10, 10) coordinate
```
<a name="Canvas+foreground"></a>

### canvas.foreground(color) ⇒ <code>[Canvas](#Canvas)</code>
Set the foreground color.
This color is used when text is rendering.

**Kind**: instance method of <code>[Canvas](#Canvas)</code>  

| Param | Type | Description |
| --- | --- | --- |
| color | <code>String</code> &#124; <code>Boolean</code> | Color name, rgb, hex or false if you want to disable foreground filling |

**Example**  
```js
canvas.foreground('white');
canvas.foreground('#000000');
canvas.foreground('rgb(255, 255, 255)');
canvas.foreground(false); // disables foreground filling (will be used default filling)
```
<a name="Canvas+background"></a>

### canvas.background(color) ⇒ <code>[Canvas](#Canvas)</code>
Set the background color.
This color is used for filling the whole cell in the TTY.

**Kind**: instance method of <code>[Canvas](#Canvas)</code>  

| Param | Type | Description |
| --- | --- | --- |
| color | <code>String</code> &#124; <code>Boolean</code> | Color name, rgb, hex or false if you want to disable background filling |

**Example**  
```js
canvas.background('white');
canvas.background('#000000');
canvas.background('rgb(255, 255, 255)');
canvas.background(false); // disables background filling (will be used default filling)
```
<a name="Canvas+bold"></a>

### canvas.bold([isBold]) ⇒ <code>[Canvas](#Canvas)</code>
Toggle bold display mode.

**Kind**: instance method of <code>[Canvas](#Canvas)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [isBold] | <code>Boolean</code> | <code>true</code> | If false, disables bold mode |

**Example**  
```js
canvas.bold(); // enable bold mode
canvas.bold(false); // disable bold mode
```
<a name="Canvas+dim"></a>

### canvas.dim([isDim]) ⇒ <code>[Canvas](#Canvas)</code>
Toggle dim display mode.

**Kind**: instance method of <code>[Canvas](#Canvas)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [isDim] | <code>Boolean</code> | <code>true</code> | If false, disables dim mode |

**Example**  
```js
canvas.dim(); // enable dim mode
canvas.dim(false); // disable dim mode
```
<a name="Canvas+underlined"></a>

### canvas.underlined([isUnderlined]) ⇒ <code>[Canvas](#Canvas)</code>
Toggle underlined display mode.

**Kind**: instance method of <code>[Canvas](#Canvas)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [isUnderlined] | <code>Boolean</code> | <code>true</code> | If false, disables underlined mode |

**Example**  
```js
canvas.underlined(); // enable underlined mode
canvas.underlined(false); // disable underlined mode
```
<a name="Canvas+blink"></a>

### canvas.blink([isBlink]) ⇒ <code>[Canvas](#Canvas)</code>
Toggle blink display mode.

**Kind**: instance method of <code>[Canvas](#Canvas)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [isBlink] | <code>Boolean</code> | <code>true</code> | If false, disables blink mode |

**Example**  
```js
canvas.blink(); // enable blink mode
canvas.blink(false); // disable blink mode
```
<a name="Canvas+reverse"></a>

### canvas.reverse([isReverse]) ⇒ <code>[Canvas](#Canvas)</code>
Toggle reverse display mode.

**Kind**: instance method of <code>[Canvas](#Canvas)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [isReverse] | <code>Boolean</code> | <code>true</code> | If false, disables reverse display mode |

**Example**  
```js
canvas.reverse(); // enable reverse mode
canvas.reverse(false); // disable reverse mode
```
<a name="Canvas+hidden"></a>

### canvas.hidden([isHidden]) ⇒ <code>[Canvas](#Canvas)</code>
Toggle hidden display mode.

**Kind**: instance method of <code>[Canvas](#Canvas)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [isHidden] | <code>Boolean</code> | <code>true</code> | If false, disables hidden display mode |

**Example**  
```js
canvas.hidden(); // enable hidden mode
canvas.hidden(false); // disable hidden mode
```
<a name="Canvas+erase"></a>

### canvas.erase(x1, y1, x2, y2) ⇒ <code>[Canvas](#Canvas)</code>
Erase the specified region.
The region describes the rectangle shape which need to erase.

**Kind**: instance method of <code>[Canvas](#Canvas)</code>  

| Param | Type |
| --- | --- |
| x1 | <code>Number</code> | 
| y1 | <code>Number</code> | 
| x2 | <code>Number</code> | 
| y2 | <code>Number</code> | 

**Example**  
```js
canvas.erase(0, 0, 5, 5);
```
<a name="Canvas+eraseToEnd"></a>

### canvas.eraseToEnd() ⇒ <code>[Canvas](#Canvas)</code>
Erase from current position to end of the line.

**Kind**: instance method of <code>[Canvas](#Canvas)</code>  
**Example**  
```js
canvas.eraseToEnd();
```
<a name="Canvas+eraseToStart"></a>

### canvas.eraseToStart() ⇒ <code>[Canvas](#Canvas)</code>
Erase from current position to start of the line.

**Kind**: instance method of <code>[Canvas](#Canvas)</code>  
**Example**  
```js
canvas.eraseToStart();
```
<a name="Canvas+eraseToDown"></a>

### canvas.eraseToDown() ⇒ <code>[Canvas](#Canvas)</code>
Erase from current line to down.

**Kind**: instance method of <code>[Canvas](#Canvas)</code>  
**Example**  
```js
canvas.eraseToDown();
```
<a name="Canvas+eraseToUp"></a>

### canvas.eraseToUp() ⇒ <code>[Canvas](#Canvas)</code>
Erase from current line to up.

**Kind**: instance method of <code>[Canvas](#Canvas)</code>  
**Example**  
```js
canvas.eraseToUp();
```
<a name="Canvas+eraseLine"></a>

### canvas.eraseLine() ⇒ <code>[Canvas](#Canvas)</code>
Erase current line.

**Kind**: instance method of <code>[Canvas](#Canvas)</code>  
**Example**  
```js
canvas.eraseLine();
```
<a name="Canvas+eraseScreen"></a>

### canvas.eraseScreen() ⇒ <code>[Canvas](#Canvas)</code>
Erase the entire screen.

**Kind**: instance method of <code>[Canvas](#Canvas)</code>  
**Example**  
```js
canvas.eraseScreen();
```
<a name="Canvas+saveScreen"></a>

### canvas.saveScreen() ⇒ <code>[Canvas](#Canvas)</code>
Save current terminal state into the buffer.
Applies immediately without calling [flush](flush) method.

**Kind**: instance method of <code>[Canvas](#Canvas)</code>  
**Example**  
```js
canvas.saveScreen();
```
<a name="Canvas+restoreScreen"></a>

### canvas.restoreScreen() ⇒ <code>[Canvas](#Canvas)</code>
Restore terminal state from the buffer.
Applies immediately without calling [flush](flush).

**Kind**: instance method of <code>[Canvas](#Canvas)</code>  
**Example**  
```js
canvas.restoreScreen();
```
<a name="Canvas+hideCursor"></a>

### canvas.hideCursor() ⇒ <code>[Canvas](#Canvas)</code>
Set the terminal cursor invisible.
Applies immediately without calling [flush](flush).

**Kind**: instance method of <code>[Canvas](#Canvas)</code>  
**Example**  
```js
canvas.hideCursor();
```
<a name="Canvas+showCursor"></a>

### canvas.showCursor() ⇒ <code>[Canvas](#Canvas)</code>
Set the terminal cursor visible.
Applies immediately without calling [flush](flush).

**Kind**: instance method of <code>[Canvas](#Canvas)</code>  
**Example**  
```js
canvas.showCursor();
```
<a name="Canvas+reset"></a>

### canvas.reset() ⇒ <code>[Canvas](#Canvas)</code>
Reset all terminal settings.
Applies immediately without calling [flush](flush).

**Kind**: instance method of <code>[Canvas](#Canvas)</code>  
**Example**  
```js
canvas.reset();
```
<a name="Canvas.create"></a>

### Canvas.create() ⇒ <code>[Canvas](#Canvas)</code>
Wrapper around `new Canvas()`.

**Kind**: static method of <code>[Canvas](#Canvas)</code>  
<a name="Cell"></a>

## Cell
Wrapper around one cell in the terminal.
Used for filling terminal wrapper in the cursor.

**Kind**: global class  
**Since**: 3.1.0  

* [Cell](#Cell)
    * [new Cell([char], [options])](#new_Cell_new)
    * _instance_
        * [.getChar()](#Cell+getChar) ⇒ <code>String</code>
        * [.setChar([char])](#Cell+setChar) ⇒ <code>[Cell](#Cell)</code>
        * [.getX()](#Cell+getX) ⇒ <code>Number</code>
        * [.setX([x])](#Cell+setX) ⇒ <code>[Cell](#Cell)</code>
        * [.getY()](#Cell+getY) ⇒ <code>Number</code>
        * [.setY([y])](#Cell+setY) ⇒ <code>[Cell](#Cell)</code>
        * [.getBackground()](#Cell+getBackground) ⇒ <code>Object</code>
        * [.setBackground([r], [g], [b])](#Cell+setBackground) ⇒ <code>[Cell](#Cell)</code>
        * [.getForeground()](#Cell+getForeground) ⇒ <code>Object</code>
        * [.setForeground([r], [g], [b])](#Cell+setForeground) ⇒ <code>[Cell](#Cell)</code>
        * [.getDisplay()](#Cell+getDisplay) ⇒ <code>Object</code>
        * [.setDisplay([bold], [dim], [underlined], [blink], [reverse], [hidden])](#Cell+setDisplay) ⇒ <code>[Cell](#Cell)</code>
        * [.setModified([isModified])](#Cell+setModified) ⇒ <code>[Cell](#Cell)</code>
        * [.isModified()](#Cell+isModified) ⇒ <code>Boolean</code>
        * [.reset()](#Cell+reset) ⇒ <code>[Cell](#Cell)</code>
        * [.toString()](#Cell+toString) ⇒ <code>String</code>
    * _static_
        * [.create()](#Cell.create) ⇒ <code>[Cell](#Cell)</code>

<a name="new_Cell_new"></a>

### new Cell([char], [options])
Create Cell instance which are able to convert itself to ASCII control sequence.


| Param | Type | Description |
| --- | --- | --- |
| [char] | <code>String</code> | Char that you want to wrap with control sequence |
| [options] | <code>Object</code> | Options object where you can set additional style to char |
| [options.x] | <code>Number</code> | X coordinate |
| [options.y] | <code>Number</code> | Y coordinate |
| [options.background] | <code>Object</code> | Background color, fill with -1 if you don't want to use background |
| [options.background.r] | <code>Number</code> | Red channel |
| [options.background.g] | <code>Number</code> | Green channel |
| [options.background.b] | <code>Number</code> | Blue channel |
| [options.foreground] | <code>Object</code> | Foreground color, fill with -1 if you don't want to use foreground |
| [options.foreground.r] | <code>Number</code> | Red channel |
| [options.foreground.g] | <code>Number</code> | Green channel |
| [options.foreground.b] | <code>Number</code> | Blue channel |
| [options.display] | <code>Object</code> | Object with display modes |
| [options.display.bold] | <code>Boolean</code> | Bold style |
| [options.display.dim] | <code>Boolean</code> | Dim style |
| [options.display.underlined] | <code>Boolean</code> | Underlined style |
| [options.display.blink] | <code>Boolean</code> | Blink style |
| [options.display.reverse] | <code>Boolean</code> | Reverse style |
| [options.display.hidden] | <code>Boolean</code> | Hidden style |

<a name="Cell+getChar"></a>

### cell.getChar() ⇒ <code>String</code>
Get current char.

**Kind**: instance method of <code>[Cell](#Cell)</code>  
<a name="Cell+setChar"></a>

### cell.setChar([char]) ⇒ <code>[Cell](#Cell)</code>
Set new char to cell.
If char is longer than 1 char, it slices string to 1 char.

**Kind**: instance method of <code>[Cell](#Cell)</code>  

| Param | Type | Default |
| --- | --- | --- |
| [char] | <code>String</code> | <code> </code> | 

<a name="Cell+getX"></a>

### cell.getX() ⇒ <code>Number</code>
Get X coordinate of this cell.

**Kind**: instance method of <code>[Cell](#Cell)</code>  
<a name="Cell+setX"></a>

### cell.setX([x]) ⇒ <code>[Cell](#Cell)</code>
Set new X coordinate for cell.

**Kind**: instance method of <code>[Cell](#Cell)</code>  

| Param | Type | Default |
| --- | --- | --- |
| [x] | <code>Number</code> | <code>0</code> | 

<a name="Cell+getY"></a>

### cell.getY() ⇒ <code>Number</code>
Get Y coordinate.

**Kind**: instance method of <code>[Cell](#Cell)</code>  
<a name="Cell+setY"></a>

### cell.setY([y]) ⇒ <code>[Cell](#Cell)</code>
Set new Y coordinate for cell.

**Kind**: instance method of <code>[Cell](#Cell)</code>  

| Param | Type | Default |
| --- | --- | --- |
| [y] | <code>Number</code> | <code>0</code> | 

<a name="Cell+getBackground"></a>

### cell.getBackground() ⇒ <code>Object</code>
Get current background color.

**Kind**: instance method of <code>[Cell](#Cell)</code>  
<a name="Cell+setBackground"></a>

### cell.setBackground([r], [g], [b]) ⇒ <code>[Cell](#Cell)</code>
Set new background color.

**Kind**: instance method of <code>[Cell](#Cell)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [r] | <code>Number</code> | <code>-1</code> | Red channel |
| [g] | <code>Number</code> | <code>-1</code> | Green channel |
| [b] | <code>Number</code> | <code>-1</code> | Blue channel |

<a name="Cell+getForeground"></a>

### cell.getForeground() ⇒ <code>Object</code>
Get current foreground color.

**Kind**: instance method of <code>[Cell](#Cell)</code>  
<a name="Cell+setForeground"></a>

### cell.setForeground([r], [g], [b]) ⇒ <code>[Cell](#Cell)</code>
Set new foreground color.

**Kind**: instance method of <code>[Cell](#Cell)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [r] | <code>Number</code> | <code>-1</code> | Red channel |
| [g] | <code>Number</code> | <code>-1</code> | Green channel |
| [b] | <code>Number</code> | <code>-1</code> | Blue channel |

<a name="Cell+getDisplay"></a>

### cell.getDisplay() ⇒ <code>Object</code>
Get current display modes.

**Kind**: instance method of <code>[Cell](#Cell)</code>  
<a name="Cell+setDisplay"></a>

### cell.setDisplay([bold], [dim], [underlined], [blink], [reverse], [hidden]) ⇒ <code>[Cell](#Cell)</code>
Set new display modes to cell.

**Kind**: instance method of <code>[Cell](#Cell)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [bold] | <code>Boolean</code> | <code>false</code> | Bold style |
| [dim] | <code>Boolean</code> | <code>false</code> | Dim style |
| [underlined] | <code>Boolean</code> | <code>false</code> | Underlined style |
| [blink] | <code>Boolean</code> | <code>false</code> | Blink style |
| [reverse] | <code>Boolean</code> | <code>false</code> | Reverse style |
| [hidden] | <code>Boolean</code> | <code>false</code> | Hidden style |

<a name="Cell+setModified"></a>

### cell.setModified([isModified]) ⇒ <code>[Cell](#Cell)</code>
Mark cell as modified or not.
It useful when you need to filter out only modified cells without building the diff.

**Kind**: instance method of <code>[Cell](#Cell)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [isModified] | <code>Boolean</code> | <code>true</code> | Flag shows if cell is modified |

<a name="Cell+isModified"></a>

### cell.isModified() ⇒ <code>Boolean</code>
Check if cell has been modified.

**Kind**: instance method of <code>[Cell](#Cell)</code>  
<a name="Cell+reset"></a>

### cell.reset() ⇒ <code>[Cell](#Cell)</code>
Reset display settings.
It resets char, background, foreground and display mode.

**Kind**: instance method of <code>[Cell](#Cell)</code>  
<a name="Cell+toString"></a>

### cell.toString() ⇒ <code>String</code>
Convert cell to ASCII control sequence.
Disables flag which marks cell as modified.

**Kind**: instance method of <code>[Cell](#Cell)</code>  
<a name="Cell.create"></a>

### Cell.create() ⇒ <code>[Cell](#Cell)</code>
Wrapper around `new Cell()`.

**Kind**: static method of <code>[Cell](#Cell)</code>  
<a name="Color"></a>

## Color
Color class responsible for converting colors between rgb and hex.

**Kind**: global class  
**Since**: 3.1.0  

* [Color](#Color)
    * [new Color(color)](#new_Color_new)
    * _instance_
        * [.getR()](#Color+getR) ⇒ <code>Number</code>
        * [.setR(value)](#Color+setR) ⇒ <code>[Color](#Color)</code>
        * [.getG()](#Color+getG) ⇒ <code>Number</code>
        * [.setG(value)](#Color+setG) ⇒ <code>[Color](#Color)</code>
        * [.getB()](#Color+getB) ⇒ <code>Number</code>
        * [.setB(value)](#Color+setB) ⇒ <code>[Color](#Color)</code>
        * [.toRgb()](#Color+toRgb) ⇒ <code>Object</code>
        * [.toHex()](#Color+toHex) ⇒ <code>String</code>
    * _static_
        * [.isNamed(color)](#Color.isNamed) ⇒ <code>Boolean</code>
        * [.isRgb(rgb)](#Color.isRgb) ⇒ <code>Boolean</code>
        * [.isHex(hex)](#Color.isHex) ⇒ <code>Boolean</code>
        * [.fromRgb(rgb)](#Color.fromRgb) ⇒ <code>[Color](#Color)</code>
        * [.fromHex(hex)](#Color.fromHex) ⇒ <code>[Color](#Color)</code>
        * [.create()](#Color.create) ⇒ <code>[Color](#Color)</code>

<a name="new_Color_new"></a>

### new Color(color)
Create new Color instance.
You can use different formats of color: named, rgb or hex.
Class will try to parse your provided color, otherwise throws an error.


| Param | Type | Description |
| --- | --- | --- |
| color | <code>String</code> &#124; <code>Object</code> | String with named color, rgb, hex or object with {r, g, b} properties |
| color.r | <code>Number</code> | Red channel |
| color.g | <code>Number</code> | Green channel |
| color.b | <code>Number</code> | Blue channel |

**Example**  
```js
Color.create('black');
Color.create('rgb(0, 10, 20)');
Color.create('#AABBCC');
Color.create({r: 0, g: 10, b: 20});
```
<a name="Color+getR"></a>

### color.getR() ⇒ <code>Number</code>
Get rounded value of red channel.

**Kind**: instance method of <code>[Color](#Color)</code>  
<a name="Color+setR"></a>

### color.setR(value) ⇒ <code>[Color](#Color)</code>
Set clamped value of red channel.

**Kind**: instance method of <code>[Color](#Color)</code>  

| Param | Type |
| --- | --- |
| value | <code>Number</code> | 

<a name="Color+getG"></a>

### color.getG() ⇒ <code>Number</code>
Get rounded value of green channel.

**Kind**: instance method of <code>[Color](#Color)</code>  
<a name="Color+setG"></a>

### color.setG(value) ⇒ <code>[Color](#Color)</code>
Set clamped value of green channel.

**Kind**: instance method of <code>[Color](#Color)</code>  

| Param | Type |
| --- | --- |
| value | <code>Number</code> | 

<a name="Color+getB"></a>

### color.getB() ⇒ <code>Number</code>
Get rounded value of blue channel.

**Kind**: instance method of <code>[Color](#Color)</code>  
<a name="Color+setB"></a>

### color.setB(value) ⇒ <code>[Color](#Color)</code>
Set clamped value of blue channel.

**Kind**: instance method of <code>[Color](#Color)</code>  

| Param | Type |
| --- | --- |
| value | <code>Number</code> | 

<a name="Color+toRgb"></a>

### color.toRgb() ⇒ <code>Object</code>
Convert color to RGB representation.

**Kind**: instance method of <code>[Color](#Color)</code>  
<a name="Color+toHex"></a>

### color.toHex() ⇒ <code>String</code>
Convert color to HEX representation.

**Kind**: instance method of <code>[Color](#Color)</code>  
<a name="Color.isNamed"></a>

### Color.isNamed(color) ⇒ <code>Boolean</code>
Check if provided color is named color.

**Kind**: static method of <code>[Color](#Color)</code>  

| Param | Type |
| --- | --- |
| color | <code>String</code> | 

<a name="Color.isRgb"></a>

### Color.isRgb(rgb) ⇒ <code>Boolean</code>
Check if provided color written in RGB representation.

**Kind**: static method of <code>[Color](#Color)</code>  

| Param | Type | Description |
| --- | --- | --- |
| rgb | <code>String</code> | RGB color |

<a name="Color.isHex"></a>

### Color.isHex(hex) ⇒ <code>Boolean</code>
Check if provided color written in HEX representation.

**Kind**: static method of <code>[Color](#Color)</code>  

| Param | Type | Description |
| --- | --- | --- |
| hex | <code>String</code> | HEX color |

<a name="Color.fromRgb"></a>

### Color.fromRgb(rgb) ⇒ <code>[Color](#Color)</code>
Parse RGB color and return Color instance.

**Kind**: static method of <code>[Color](#Color)</code>  

| Param | Type | Description |
| --- | --- | --- |
| rgb | <code>String</code> | RGB color |

<a name="Color.fromHex"></a>

### Color.fromHex(hex) ⇒ <code>[Color](#Color)</code>
Parse HEX color and return Color instance.

**Kind**: static method of <code>[Color](#Color)</code>  

| Param | Type | Description |
| --- | --- | --- |
| hex | <code>String</code> | HEX color |

<a name="Color.create"></a>

### Color.create() ⇒ <code>[Color](#Color)</code>
Wrapper around `new Color()`.

**Kind**: static method of <code>[Color](#Color)</code>  
