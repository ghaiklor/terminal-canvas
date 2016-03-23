## Constants

<dl>
<dt><a href="#COLORS">COLORS</a> : <code>Object</code></dt>
<dd><p>Dictionary of colors which can be used for instantiating the <a href="Color">Color</a> instance.</p>
</dd>
<dt><a href="#DISPLAY_MODES">DISPLAY_MODES</a> : <code>Object</code></dt>
<dd><p>Map of the display modes that can be used in Cursor API.
There are the most commonly supported control sequences for formatting text and their resetting.</p>
</dd>
<dt><a href="#encodeToVT100">encodeToVT100</a> ⇒ <code>String</code></dt>
<dd><p>Bytes to encode to VT100 control sequence.</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#write">write(data)</a> ⇒ <code>Canvas</code></dt>
<dd><p>Write to the stream.
It doesn&#39;t applies immediately but stores in virtual terminal that represented as array of <a href="Cell">Cell</a> instances.
For applying changes you need to <a href="#flush">flush</a> changes.</p>
</dd>
<dt><a href="#flush">flush()</a> ⇒ <code>Canvas</code></dt>
<dd><p>Takes only modified cells from virtual terminal and flush changes to the real terminal.
There is no requirements to build diff or something, we have the markers for each cell that has been modified.</p>
</dd>
<dt><a href="#getPointerFromXY">getPointerFromXY([x], [y])</a> ⇒ <code>Number</code></dt>
<dd><p>Get index of the virtual terminal representation from (x, y) coordinates.</p>
</dd>
<dt><a href="#getXYFromPointer">getXYFromPointer(index)</a> ⇒ <code>Array</code></dt>
<dd><p>Get (x, y) coordinate from the virtual terminal pointer.</p>
</dd>
<dt><a href="#up">up([y])</a> ⇒ <code>Canvas</code></dt>
<dd><p>Move the cursor up.</p>
</dd>
<dt><a href="#down">down([y])</a> ⇒ <code>Canvas</code></dt>
<dd><p>Move the cursor down.</p>
</dd>
<dt><a href="#right">right([x])</a> ⇒ <code>Canvas</code></dt>
<dd><p>Move the cursor right.</p>
</dd>
<dt><a href="#left">left([x])</a> ⇒ <code>Canvas</code></dt>
<dd><p>Move the cursor left.</p>
</dd>
<dt><a href="#moveBy">moveBy(x, y)</a> ⇒ <code>Canvas</code></dt>
<dd><p>Move the cursor position relative current coordinates.</p>
</dd>
<dt><a href="#moveTo">moveTo(x, y)</a> ⇒ <code>Canvas</code></dt>
<dd><p>Set the cursor position by absolute coordinates.</p>
</dd>
<dt><a href="#foreground">foreground(color)</a> ⇒ <code>Canvas</code></dt>
<dd><p>Set the foreground color.
This color is used when text is rendering.</p>
</dd>
<dt><a href="#background">background(color)</a> ⇒ <code>Canvas</code></dt>
<dd><p>Set the background color.
This color is used for filling the whole cell in the TTY.</p>
</dd>
<dt><a href="#bold">bold([isBold])</a> ⇒ <code>Canvas</code></dt>
<dd><p>Toggle bold display mode.</p>
</dd>
<dt><a href="#dim">dim([isDim])</a> ⇒ <code>Canvas</code></dt>
<dd><p>Toggle dim display mode.</p>
</dd>
<dt><a href="#underlined">underlined([isUnderlined])</a> ⇒ <code>Canvas</code></dt>
<dd><p>Toggle underlined display mode.</p>
</dd>
<dt><a href="#blink">blink([isBlink])</a> ⇒ <code>Canvas</code></dt>
<dd><p>Toggle blink display mode.</p>
</dd>
<dt><a href="#reverse">reverse([isReverse])</a> ⇒ <code>Canvas</code></dt>
<dd><p>Toggle reverse display mode.</p>
</dd>
<dt><a href="#hidden">hidden([isHidden])</a> ⇒ <code>Canvas</code></dt>
<dd><p>Toggle hidden display mode.</p>
</dd>
<dt><a href="#erase">erase(x1, y1, x2, y2)</a> ⇒ <code>Canvas</code></dt>
<dd><p>Erase the specified region.
The region describes the rectangle shape which need to erase.</p>
</dd>
<dt><a href="#eraseToEnd">eraseToEnd()</a> ⇒ <code>Canvas</code></dt>
<dd><p>Erase from current position to end of the line.</p>
</dd>
<dt><a href="#eraseToStart">eraseToStart()</a> ⇒ <code>Canvas</code></dt>
<dd><p>Erase from current position to start of the line.</p>
</dd>
<dt><a href="#eraseToDown">eraseToDown()</a> ⇒ <code>Canvas</code></dt>
<dd><p>Erase from current line to down.</p>
</dd>
<dt><a href="#eraseToUp">eraseToUp()</a> ⇒ <code>Canvas</code></dt>
<dd><p>Erase from current line to up.</p>
</dd>
<dt><a href="#eraseLine">eraseLine()</a> ⇒ <code>Canvas</code></dt>
<dd><p>Erase current line.</p>
</dd>
<dt><a href="#eraseScreen">eraseScreen()</a> ⇒ <code>Canvas</code></dt>
<dd><p>Erase the entire screen.</p>
</dd>
<dt><a href="#saveScreen">saveScreen()</a> ⇒ <code>Canvas</code></dt>
<dd><p>Save current terminal contents into the buffer.
Applies immediately without calling <a href="#flush">flush</a>.</p>
</dd>
<dt><a href="#restoreScreen">restoreScreen()</a> ⇒ <code>Canvas</code></dt>
<dd><p>Restore terminal contents to previously saved via <a href="#saveScreen">saveScreen</a>.
Applies immediately without calling <a href="#flush">flush</a>.</p>
</dd>
<dt><a href="#hideCursor">hideCursor()</a> ⇒ <code>Canvas</code></dt>
<dd><p>Set the terminal cursor invisible.
Applies immediately without calling <a href="#flush">flush</a>.</p>
</dd>
<dt><a href="#showCursor">showCursor()</a> ⇒ <code>Canvas</code></dt>
<dd><p>Set the terminal cursor visible.
Applies immediately without calling <a href="#flush">flush</a>.</p>
</dd>
<dt><a href="#reset">reset()</a> ⇒ <code>Canvas</code></dt>
<dd><p>Reset all terminal settings.
Applies immediately without calling <a href="#flush">flush</a>.</p>
</dd>
<dt><a href="#create">create()</a> ⇒ <code>Canvas</code></dt>
<dd><p>Wrapper around <code>new Canvas()</code>.</p>
</dd>
<dt><a href="#getChar">getChar()</a> ⇒ <code>String</code></dt>
<dd><p>Get current char.</p>
</dd>
<dt><a href="#setChar">setChar([char])</a> ⇒ <code>Cell</code></dt>
<dd><p>Set new char to cell.
If char is longer than 1 char, it slices string to 1 char.</p>
</dd>
<dt><a href="#getX">getX()</a> ⇒ <code>Number</code></dt>
<dd><p>Get X coordinate of this cell.</p>
</dd>
<dt><a href="#setX">setX([x])</a> ⇒ <code>Cell</code></dt>
<dd><p>Set new X coordinate for cell.</p>
</dd>
<dt><a href="#getY">getY()</a> ⇒ <code>Number</code></dt>
<dd><p>Get Y coordinate.</p>
</dd>
<dt><a href="#setY">setY([y])</a> ⇒ <code>Cell</code></dt>
<dd><p>Set new Y coordinate for cell.</p>
</dd>
<dt><a href="#getBackground">getBackground()</a> ⇒ <code>Object</code></dt>
<dd><p>Get current background color.</p>
</dd>
<dt><a href="#setBackground">setBackground([r], [g], [b])</a> ⇒ <code>Cell</code></dt>
<dd><p>Set new background color.</p>
</dd>
<dt><a href="#getForeground">getForeground()</a> ⇒ <code>Object</code></dt>
<dd><p>Get current foreground color.</p>
</dd>
<dt><a href="#setForeground">setForeground([r], [g], [b])</a> ⇒ <code>Cell</code></dt>
<dd><p>Set new foreground color.</p>
</dd>
<dt><a href="#getDisplay">getDisplay()</a> ⇒ <code>Object</code></dt>
<dd><p>Get current display modes.</p>
</dd>
<dt><a href="#setDisplay">setDisplay([bold], [dim], [underlined], [blink], [reverse], [hidden])</a> ⇒ <code>Cell</code></dt>
<dd><p>Set new display modes to cell.</p>
</dd>
<dt><a href="#setModified">setModified([isModified])</a> ⇒ <code>Cell</code></dt>
<dd><p>Mark cell as modified or not.
It useful when you need to filter out only modified cells without building the diff.</p>
</dd>
<dt><a href="#isModified">isModified()</a> ⇒ <code>Boolean</code></dt>
<dd><p>Check if cell has been modified.</p>
</dd>
<dt><a href="#reset">reset()</a> ⇒ <code>Cell</code></dt>
<dd><p>Reset display settings.
It resets char, background, foreground and display mode.</p>
</dd>
<dt><a href="#toString">toString()</a> ⇒ <code>String</code></dt>
<dd><p>Convert cell to ASCII control sequence.
Disables flag which marks cell as modified.</p>
</dd>
<dt><a href="#create">create()</a> ⇒ <code>Cell</code></dt>
<dd><p>Wrapper around <code>new Cell()</code>.</p>
</dd>
<dt><a href="#getR">getR()</a> ⇒ <code>Number</code></dt>
<dd><p>Get rounded value of red channel.</p>
</dd>
<dt><a href="#setR">setR(value)</a> ⇒ <code>Color</code></dt>
<dd><p>Set clamped value of red channel.</p>
</dd>
<dt><a href="#getG">getG()</a> ⇒ <code>Number</code></dt>
<dd><p>Get rounded value of green channel.</p>
</dd>
<dt><a href="#setG">setG(value)</a> ⇒ <code>Color</code></dt>
<dd><p>Set clamped value of green channel.</p>
</dd>
<dt><a href="#getB">getB()</a> ⇒ <code>Number</code></dt>
<dd><p>Get rounded value of blue channel.</p>
</dd>
<dt><a href="#setB">setB(value)</a> ⇒ <code>Color</code></dt>
<dd><p>Set clamped value of blue channel.</p>
</dd>
<dt><a href="#toRgb">toRgb()</a> ⇒ <code>Object</code></dt>
<dd><p>Convert color to RGB representation.</p>
</dd>
<dt><a href="#toHex">toHex()</a> ⇒ <code>String</code></dt>
<dd><p>Convert color to HEX representation.</p>
</dd>
<dt><a href="#isNamed">isNamed(color)</a> ⇒ <code>Boolean</code></dt>
<dd><p>Check if provided color is named color.</p>
</dd>
<dt><a href="#isRgb">isRgb(rgb)</a> ⇒ <code>Boolean</code></dt>
<dd><p>Check if provided color written in RGB representation.</p>
</dd>
<dt><a href="#isHex">isHex(hex)</a> ⇒ <code>Boolean</code></dt>
<dd><p>Check if provided color written in HEX representation.</p>
</dd>
<dt><a href="#fromRgb">fromRgb(rgb)</a> ⇒ <code>Color</code></dt>
<dd><p>Parse RGB color and return Color instance.</p>
</dd>
<dt><a href="#fromHex">fromHex(hex)</a> ⇒ <code>Color</code></dt>
<dd><p>Parse HEX color and return Color instance.</p>
</dd>
<dt><a href="#create">create()</a> ⇒ <code>Color</code></dt>
<dd><p>Wrapper around <code>new Color()</code>.</p>
</dd>
</dl>

<a name="COLORS"></a>

## COLORS : <code>Object</code>
Dictionary of colors which can be used for instantiating the [Color](Color) instance.

**Kind**: global constant  
<a name="DISPLAY_MODES"></a>

## DISPLAY_MODES : <code>Object</code>
Map of the display modes that can be used in Cursor API.
There are the most commonly supported control sequences for formatting text and their resetting.

**Kind**: global constant  
<a name="encodeToVT100"></a>

## encodeToVT100 ⇒ <code>String</code>
Bytes to encode to VT100 control sequence.

**Kind**: global constant  
**Returns**: <code>String</code> - Returns encoded string  

| Param | Type | Description |
| --- | --- | --- |
| code | <code>String</code> | Control code that you want to encode |

<a name="write"></a>

## write(data) ⇒ <code>Canvas</code>
Write to the stream.
It doesn't applies immediately but stores in virtual terminal that represented as array of [Cell](Cell) instances.
For applying changes you need to [flush](#flush) changes.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>String</code> | Data to write to the terminal |

<a name="flush"></a>

## flush() ⇒ <code>Canvas</code>
Takes only modified cells from virtual terminal and flush changes to the real terminal.
There is no requirements to build diff or something, we have the markers for each cell that has been modified.

**Kind**: global function  
<a name="getPointerFromXY"></a>

## getPointerFromXY([x], [y]) ⇒ <code>Number</code>
Get index of the virtual terminal representation from (x, y) coordinates.

**Kind**: global function  
**Returns**: <code>Number</code> - Returns index in the buffer array  

| Param | Type | Description |
| --- | --- | --- |
| [x] | <code>Number</code> | X coordinate on the terminal |
| [y] | <code>Number</code> | Y coordinate on the terminal |

<a name="getXYFromPointer"></a>

## getXYFromPointer(index) ⇒ <code>Array</code>
Get (x, y) coordinate from the virtual terminal pointer.

**Kind**: global function  
**Returns**: <code>Array</code> - Returns an array [x, y]  

| Param | Type | Description |
| --- | --- | --- |
| index | <code>Number</code> | Index in the buffer |

<a name="up"></a>

## up([y]) ⇒ <code>Canvas</code>
Move the cursor up.

**Kind**: global function  

| Param | Type | Default |
| --- | --- | --- |
| [y] | <code>Number</code> | <code>1</code> | 

<a name="down"></a>

## down([y]) ⇒ <code>Canvas</code>
Move the cursor down.

**Kind**: global function  

| Param | Type | Default |
| --- | --- | --- |
| [y] | <code>Number</code> | <code>1</code> | 

<a name="right"></a>

## right([x]) ⇒ <code>Canvas</code>
Move the cursor right.

**Kind**: global function  

| Param | Type | Default |
| --- | --- | --- |
| [x] | <code>Number</code> | <code>1</code> | 

<a name="left"></a>

## left([x]) ⇒ <code>Canvas</code>
Move the cursor left.

**Kind**: global function  

| Param | Type | Default |
| --- | --- | --- |
| [x] | <code>Number</code> | <code>1</code> | 

<a name="moveBy"></a>

## moveBy(x, y) ⇒ <code>Canvas</code>
Move the cursor position relative current coordinates.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>Number</code> | Offset by X coordinate |
| y | <code>Number</code> | Offset by Y coordinate |

<a name="moveTo"></a>

## moveTo(x, y) ⇒ <code>Canvas</code>
Set the cursor position by absolute coordinates.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>Number</code> | X coordinate |
| y | <code>Number</code> | Y coordinate |

<a name="foreground"></a>

## foreground(color) ⇒ <code>Canvas</code>
Set the foreground color.
This color is used when text is rendering.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| color | <code>String</code> &#124; <code>Boolean</code> | Color name or false if you want to disable foreground filling |

<a name="background"></a>

## background(color) ⇒ <code>Canvas</code>
Set the background color.
This color is used for filling the whole cell in the TTY.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| color | <code>String</code> &#124; <code>Boolean</code> | Color name or false if you want to disable background filling |

<a name="bold"></a>

## bold([isBold]) ⇒ <code>Canvas</code>
Toggle bold display mode.

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [isBold] | <code>Boolean</code> | <code>true</code> | If false, disables bold mode |

<a name="dim"></a>

## dim([isDim]) ⇒ <code>Canvas</code>
Toggle dim display mode.

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [isDim] | <code>Boolean</code> | <code>true</code> | If false, disables dim mode |

<a name="underlined"></a>

## underlined([isUnderlined]) ⇒ <code>Canvas</code>
Toggle underlined display mode.

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [isUnderlined] | <code>Boolean</code> | <code>true</code> | If false, disables underlined mode |

<a name="blink"></a>

## blink([isBlink]) ⇒ <code>Canvas</code>
Toggle blink display mode.

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [isBlink] | <code>Boolean</code> | <code>true</code> | If false, disables blink mode |

<a name="reverse"></a>

## reverse([isReverse]) ⇒ <code>Canvas</code>
Toggle reverse display mode.

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [isReverse] | <code>Boolean</code> | <code>true</code> | If false, disables reverse display mode |

<a name="hidden"></a>

## hidden([isHidden]) ⇒ <code>Canvas</code>
Toggle hidden display mode.

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [isHidden] | <code>Boolean</code> | <code>true</code> | If false, disables hidden display mode |

<a name="erase"></a>

## erase(x1, y1, x2, y2) ⇒ <code>Canvas</code>
Erase the specified region.
The region describes the rectangle shape which need to erase.

**Kind**: global function  

| Param | Type |
| --- | --- |
| x1 | <code>Number</code> | 
| y1 | <code>Number</code> | 
| x2 | <code>Number</code> | 
| y2 | <code>Number</code> | 

<a name="eraseToEnd"></a>

## eraseToEnd() ⇒ <code>Canvas</code>
Erase from current position to end of the line.

**Kind**: global function  
<a name="eraseToStart"></a>

## eraseToStart() ⇒ <code>Canvas</code>
Erase from current position to start of the line.

**Kind**: global function  
<a name="eraseToDown"></a>

## eraseToDown() ⇒ <code>Canvas</code>
Erase from current line to down.

**Kind**: global function  
<a name="eraseToUp"></a>

## eraseToUp() ⇒ <code>Canvas</code>
Erase from current line to up.

**Kind**: global function  
<a name="eraseLine"></a>

## eraseLine() ⇒ <code>Canvas</code>
Erase current line.

**Kind**: global function  
<a name="eraseScreen"></a>

## eraseScreen() ⇒ <code>Canvas</code>
Erase the entire screen.

**Kind**: global function  
<a name="saveScreen"></a>

## saveScreen() ⇒ <code>Canvas</code>
Save current terminal contents into the buffer.
Applies immediately without calling [flush](#flush).

**Kind**: global function  
<a name="restoreScreen"></a>

## restoreScreen() ⇒ <code>Canvas</code>
Restore terminal contents to previously saved via [saveScreen](#saveScreen).
Applies immediately without calling [flush](#flush).

**Kind**: global function  
<a name="hideCursor"></a>

## hideCursor() ⇒ <code>Canvas</code>
Set the terminal cursor invisible.
Applies immediately without calling [flush](#flush).

**Kind**: global function  
<a name="showCursor"></a>

## showCursor() ⇒ <code>Canvas</code>
Set the terminal cursor visible.
Applies immediately without calling [flush](#flush).

**Kind**: global function  
<a name="reset"></a>

## reset() ⇒ <code>Canvas</code>
Reset all terminal settings.
Applies immediately without calling [flush](#flush).

**Kind**: global function  
<a name="create"></a>

## create() ⇒ <code>Canvas</code>
Wrapper around `new Canvas()`.

**Kind**: global function  
<a name="getChar"></a>

## getChar() ⇒ <code>String</code>
Get current char.

**Kind**: global function  
<a name="setChar"></a>

## setChar([char]) ⇒ <code>Cell</code>
Set new char to cell.
If char is longer than 1 char, it slices string to 1 char.

**Kind**: global function  

| Param | Type | Default |
| --- | --- | --- |
| [char] | <code>String</code> | <code> </code> | 

<a name="getX"></a>

## getX() ⇒ <code>Number</code>
Get X coordinate of this cell.

**Kind**: global function  
<a name="setX"></a>

## setX([x]) ⇒ <code>Cell</code>
Set new X coordinate for cell.

**Kind**: global function  

| Param | Type | Default |
| --- | --- | --- |
| [x] | <code>Number</code> | <code>0</code> | 

<a name="getY"></a>

## getY() ⇒ <code>Number</code>
Get Y coordinate.

**Kind**: global function  
<a name="setY"></a>

## setY([y]) ⇒ <code>Cell</code>
Set new Y coordinate for cell.

**Kind**: global function  

| Param | Type | Default |
| --- | --- | --- |
| [y] | <code>Number</code> | <code>0</code> | 

<a name="getBackground"></a>

## getBackground() ⇒ <code>Object</code>
Get current background color.

**Kind**: global function  
<a name="setBackground"></a>

## setBackground([r], [g], [b]) ⇒ <code>Cell</code>
Set new background color.

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [r] | <code>Number</code> | <code>-1</code> | Red channel |
| [g] | <code>Number</code> | <code>-1</code> | Green channel |
| [b] | <code>Number</code> | <code>-1</code> | Blue channel |

<a name="getForeground"></a>

## getForeground() ⇒ <code>Object</code>
Get current foreground color.

**Kind**: global function  
<a name="setForeground"></a>

## setForeground([r], [g], [b]) ⇒ <code>Cell</code>
Set new foreground color.

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [r] | <code>Number</code> | <code>-1</code> | Red channel |
| [g] | <code>Number</code> | <code>-1</code> | Green channel |
| [b] | <code>Number</code> | <code>-1</code> | Blue channel |

<a name="getDisplay"></a>

## getDisplay() ⇒ <code>Object</code>
Get current display modes.

**Kind**: global function  
<a name="setDisplay"></a>

## setDisplay([bold], [dim], [underlined], [blink], [reverse], [hidden]) ⇒ <code>Cell</code>
Set new display modes to cell.

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [bold] | <code>Boolean</code> | <code>false</code> | Bold style |
| [dim] | <code>Boolean</code> | <code>false</code> | Dim style |
| [underlined] | <code>Boolean</code> | <code>false</code> | Underlined style |
| [blink] | <code>Boolean</code> | <code>false</code> | Blink style |
| [reverse] | <code>Boolean</code> | <code>false</code> | Reverse style |
| [hidden] | <code>Boolean</code> | <code>false</code> | Hidden style |

<a name="setModified"></a>

## setModified([isModified]) ⇒ <code>Cell</code>
Mark cell as modified or not.
It useful when you need to filter out only modified cells without building the diff.

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [isModified] | <code>Boolean</code> | <code>true</code> | Flag shows if cell is modified |

<a name="isModified"></a>

## isModified() ⇒ <code>Boolean</code>
Check if cell has been modified.

**Kind**: global function  
<a name="reset"></a>

## reset() ⇒ <code>Cell</code>
Reset display settings.
It resets char, background, foreground and display mode.

**Kind**: global function  
<a name="toString"></a>

## toString() ⇒ <code>String</code>
Convert cell to ASCII control sequence.
Disables flag which marks cell as modified.

**Kind**: global function  
<a name="create"></a>

## create() ⇒ <code>Cell</code>
Wrapper around `new Cell()`.

**Kind**: global function  
<a name="getR"></a>

## getR() ⇒ <code>Number</code>
Get rounded value of red channel.

**Kind**: global function  
<a name="setR"></a>

## setR(value) ⇒ <code>Color</code>
Set clamped value of red channel.

**Kind**: global function  

| Param | Type |
| --- | --- |
| value | <code>Number</code> | 

<a name="getG"></a>

## getG() ⇒ <code>Number</code>
Get rounded value of green channel.

**Kind**: global function  
<a name="setG"></a>

## setG(value) ⇒ <code>Color</code>
Set clamped value of green channel.

**Kind**: global function  

| Param | Type |
| --- | --- |
| value | <code>Number</code> | 

<a name="getB"></a>

## getB() ⇒ <code>Number</code>
Get rounded value of blue channel.

**Kind**: global function  
<a name="setB"></a>

## setB(value) ⇒ <code>Color</code>
Set clamped value of blue channel.

**Kind**: global function  

| Param | Type |
| --- | --- |
| value | <code>Number</code> | 

<a name="toRgb"></a>

## toRgb() ⇒ <code>Object</code>
Convert color to RGB representation.

**Kind**: global function  
<a name="toHex"></a>

## toHex() ⇒ <code>String</code>
Convert color to HEX representation.

**Kind**: global function  
<a name="isNamed"></a>

## isNamed(color) ⇒ <code>Boolean</code>
Check if provided color is named color.

**Kind**: global function  

| Param | Type |
| --- | --- |
| color | <code>String</code> | 

<a name="isRgb"></a>

## isRgb(rgb) ⇒ <code>Boolean</code>
Check if provided color written in RGB representation.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| rgb | <code>String</code> | RGB color |

<a name="isHex"></a>

## isHex(hex) ⇒ <code>Boolean</code>
Check if provided color written in HEX representation.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| hex | <code>String</code> | HEX color |

<a name="fromRgb"></a>

## fromRgb(rgb) ⇒ <code>Color</code>
Parse RGB color and return Color instance.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| rgb | <code>String</code> | RGB color |

<a name="fromHex"></a>

## fromHex(hex) ⇒ <code>Color</code>
Parse HEX color and return Color instance.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| hex | <code>String</code> | HEX color |

<a name="create"></a>

## create() ⇒ <code>Color</code>
Wrapper around `new Color()`.

**Kind**: global function  
