import { assert } from 'chai';
import { ERASE_REGIONS } from '../../../src/cursor/Cursor';

describe('Cursor::ERASE_REGIONS', () => {
  it('Should properly export erase regions', () => {
    assert.equal(ERASE_REGIONS.FROM_CURSOR_TO_END, 'end');
    assert.equal(ERASE_REGIONS.FROM_CURSOR_TO_START, 'start');
    assert.equal(ERASE_REGIONS.FROM_CURSOR_TO_DOWN, 'down');
    assert.equal(ERASE_REGIONS.FROM_CURSOR_TO_UP, 'up');
    assert.equal(ERASE_REGIONS.CURRENT_LINE, 'line');
    assert.equal(ERASE_REGIONS.ENTIRE_SCREEN, 'screen');
  });
});
