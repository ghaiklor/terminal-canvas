import { assert } from 'chai';
import module from '../../src/index';

describe('Entry Point', () => {
  it('Should properly export', () => {
    assert.isObject(module);
  });
});
