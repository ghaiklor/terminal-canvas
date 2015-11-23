import { assert } from 'chai';
import { COLORS } from '../../../src/cursor/Cursor';

describe('Cursor::COLORS', () => {
  it('Should properly export colors', () => {
    assert.equal(COLORS.RED, 'red');
    assert.equal(COLORS.YELLOW, 'yellow');
    assert.equal(COLORS.GREEN, 'green');
    assert.equal(COLORS.BLUE, 'blue');
    assert.equal(COLORS.CYAN, 'cyan');
    assert.equal(COLORS.MAGENTA, 'magenta');
    assert.equal(COLORS.BLACK, 'black');
    assert.equal(COLORS.WHITE, 'white');
  });
});
