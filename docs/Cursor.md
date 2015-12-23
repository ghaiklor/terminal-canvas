# Global





* * *




## Class: Cursor



## Class: Cursor
By default, creates simple cursor that writes direct to `stdout`.
If you want to work with other streams, you can pass custom `stdout` stream in.

### Cursor.write(data) 

Write to the buffer.
Usually it's just a text that you want to print out but also can be a Buffer with control codes.
Cursor has a feature to buffering data, so when you will be ready to push to the stream, call flush method.

**Parameters**

**data**: `Buffer | String`, Data to write to the stream

**Returns**: `Cursor`

### Cursor.flush() 

Write from the buffer to stream and clear it up.

**Returns**: `Cursor`

### Cursor.image(image, width, height, preserveAspectRatio) 

Draw an image in terminal.

**Parameters**

**image**: `String`, Base64 encoded image contents

**width**: `Number`, Width to render, can be 100 (cells), 100px, 100% or auto

**height**: `Number`, Height to render, can be 100 (cells), 100px, 100% or auto

**preserveAspectRatio**: `Boolean`, If set to 0, the image's aspect ratio will not be respected

**Returns**: `Cursor`

### Cursor.up(y) 

Move the cursor up.

**Parameters**

**y**: `Number`, Rows count must be positive number otherwise it just wouldn't work

**Returns**: `Cursor`

### Cursor.down(y) 

Move the cursor down.

**Parameters**

**y**: `Number`, Rows count must be positive number otherwise it just wouldn't work

**Returns**: `Cursor`

### Cursor.right(x) 

Move the cursor right.

**Parameters**

**x**: `Number`, Columns count must be positive number otherwise it just wouldn't work

**Returns**: `Cursor`

### Cursor.left(x) 

Move the cursor left.

**Parameters**

**x**: `Number`, Columns count must be positive number otherwise it just wouldn't work

**Returns**: `Cursor`

### Cursor.moveBy(x, y) 

Move the cursor position relative current coordinates.

**Parameters**

**x**: `Number`, Offset by X coordinate

**y**: `Number`, Offset by Y coordinate

**Returns**: `Cursor`

### Cursor.moveTo(x, y) 

Set the cursor position by absolute coordinates.

**Parameters**

**x**: `Number`, X coordinate

**y**: `Number`, Y coordinate

**Returns**: `Cursor`

### Cursor.foreground(color) 

Set the foreground color.
This color is used when text is rendering.
Color can be in range 0...255 (256-bit palette).

**Parameters**

**color**: `Number`, Value from COLORS

**Returns**: `Cursor`

### Cursor.background(color) 

Set the background color.
This color is used for filling the whole cell in the TTY.
Color can be in range 0...255 (256-bit palette).

**Parameters**

**color**: `Number`, Value from COLORS

**Returns**: `Cursor`

### Cursor.display(mode) 

Change display mode (format of text).
You can also use helper methods like bold or blink, etc...

**Parameters**

**mode**: `Number`, Mode identifier from DISPLAY_MODES

**Returns**: `Cursor`

### Cursor.bold(isBold) 

Toggle bold display mode.

**Parameters**

**isBold**: `Boolean`, If false, disables bold mode

**Returns**: `Cursor`

### Cursor.dim(isDim) 

Toggle dim display mode.

**Parameters**

**isDim**: `Boolean`, If false, disables dim mode

**Returns**: `Cursor`

### Cursor.underlined(isUnderlined) 

Toggle underlined display mode.

**Parameters**

**isUnderlined**: `Boolean`, If false, disables underlined mode

**Returns**: `Cursor`

### Cursor.blink(isBlink) 

Toggle blink display mode.

**Parameters**

**isBlink**: `Boolean`, If false, disables blink mode

**Returns**: `Cursor`

### Cursor.reverse(isReverse) 

Toggle reverse display mode.

**Parameters**

**isReverse**: `Boolean`, If false, disables reverse display mode

**Returns**: `Cursor`

### Cursor.hidden(isHidden) 

Toggle hidden display mode.

**Parameters**

**isHidden**: `Boolean`, If false, disables hidden display mode

**Returns**: `Cursor`

### Cursor.erase(region) 

Erase a defined region.
Before erase the region it saves cursor attributes to stack and erases the region with default attributes.
Afterwards it restores the cursor attributes as it was before.

**Parameters**

**region**: `String`, Value from ERASE_REGIONS

**Returns**: `Cursor`

### Cursor.eraseToEnd() 

Erase from current position to end of the line.

**Returns**: `Cursor`

### Cursor.eraseToStart() 

Erase from current position to start of the line.

**Returns**: `Cursor`

### Cursor.eraseToDown() 

Erase from current line to down.

**Returns**: `Cursor`

### Cursor.eraseToUp() 

Erase from current line to up.

**Returns**: `Cursor`

### Cursor.eraseLine() 

Erase current line.

**Returns**: `Cursor`

### Cursor.eraseScreen() 

Erase the entire screen.

**Returns**: `Cursor`

### Cursor.hideCursor() 

Set the cursor invisible.

**Returns**: `Cursor`

### Cursor.showCursor() 

Set the cursor visible.

**Returns**: `Cursor`

### Cursor.saveCursor(withAttributes) 

Save current cursor position and attributes in stack.
Doesn't return any information about stack.
You can restore saved information with restoreCursor

**Parameters**

**withAttributes**: `Boolean`, If true, save it with attributes settings too

**Returns**: `Cursor`

### Cursor.restoreCursor(withAttributes) 

Restore cursor position and attributes from stack.

**Parameters**

**withAttributes**: `Boolean`, If true, restore it with attributes settings too

**Returns**: `Cursor`

### Cursor.resetCursor() 

Reset all display modes and cursor attributes to default.

**Returns**: `Cursor`

### Cursor.getTTYSize() 

Get TTY sizes from stream, if it's possible.

**Returns**: `Object`

### Cursor.getTTYWidth() 

Get width of TTY.

**Returns**: `Number`

### Cursor.getTTYHeight() 

Get height of TTY.

**Returns**: `Number`

### Cursor.resetTTY() 

Reset all terminal settings to default.

**Returns**: `Cursor`

### Cursor.encodeToVT100(string) 

Bytes to encode to VT100 standard.

**Parameters**

**string**: `String`, Bytes to encode to VT100 standard.

**Returns**: `Buffer`, Returns encoded bytes

### Cursor.create() 

Wrapper around `new Cursor()`.

**Returns**: `Cursor`



* * *










