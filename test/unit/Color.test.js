const assert = require('chai').assert;
const Color = require('../../src/Color');

describe('Color', () => {
  it('Should properly create Color instance from named color', () => {
    const color = new Color('black');

    assert.instanceOf(color, Color);
    assert.equal(color._r, 0);
    assert.equal(color._g, 0);
    assert.equal(color._b, 0);
  });

  it('Should properly create Color instance from RGB color', () => {
    const color = new Color('rgb(0, 100, 200)');

    assert.instanceOf(color, Color);
    assert.equal(color._r, 0);
    assert.equal(color._g, 100);
    assert.equal(color._b, 200);
  });

  it('Should properly create Color instance from HEX color', () => {
    const color = new Color('#001020');

    assert.instanceOf(color, Color);
    assert.equal(color._r, 0);
    assert.equal(color._g, 16);
    assert.equal(color._b, 32);
  });

  it('Should properly throw exception if color is not parsed', () => {
    assert.throws(() => new Color('false color'), Error, `Color false color can't be parsed`);
  });

  it('Should properly get/set red channel', () => {
    const color = new Color('black');

    assert.equal(color.getR(), 0);
    assert.instanceOf(color.setR(20), Color);
    assert.equal(color.getR(), 20);
    assert.instanceOf(color.setR(-50), Color);
    assert.equal(color.getR(), 0);
    assert.instanceOf(color.setR(500), Color);
    assert.equal(color.getR(), 255);
  });

  it('Should properly get/set green channel', () => {
    const color = new Color('black');

    assert.equal(color.getG(), 0);
    assert.instanceOf(color.setG(20), Color);
    assert.equal(color.getG(), 20);
    assert.instanceOf(color.setG(-50), Color);
    assert.equal(color.getG(), 0);
    assert.instanceOf(color.setG(500), Color);
    assert.equal(color.getG(), 255);
  });

  it('Should properly get/set blue channel', () => {
    const color = new Color('black');

    assert.equal(color.getB(), 0);
    assert.instanceOf(color.setB(20), Color);
    assert.equal(color.getB(), 20);
    assert.instanceOf(color.setB(-50), Color);
    assert.equal(color.getB(), 0);
    assert.instanceOf(color.setB(500), Color);
    assert.equal(color.getB(), 255);
  });

  it('Should properly return RGB object', () => {
    const color = new Color('black');

    assert.deepEqual(color.toRgb(), {r: 0, g: 0, b: 0});
    assert.instanceOf(color.setR(10), Color);
    assert.instanceOf(color.setG(20), Color);
    assert.instanceOf(color.setB(30), Color);
    assert.deepEqual(color.toRgb(), {r: 10, g: 20, b: 30});
  });

  it('Should properly return HEX string', () => {
    const color = new Color('black');

    assert.equal(color.toHex(), '#000000');
    assert.instanceOf(color.setR(16), Color);
    assert.instanceOf(color.setG(32), Color);
    assert.instanceOf(color.setB(48), Color);
    assert.deepEqual(color.toHex(), '#102030');
  });

  it('Should properly check if color is named', () => {
    assert.ok(Color.isNamed('black'));
    assert.ok(Color.isNamed('BlAcK'));
    assert.ok(Color.isNamed('BLACK'));
    assert.notOk(Color.isNamed('False Color'));
  });

  it('Should properly check if color in RGB', () => {
    assert.ok(Color.isRgb('rgb(0, 10, 20)'));
    assert.ok(Color.isRgb('RgB(0, 10, 50)'));
    assert.notOk(Color.isRgb('False Color'));
  });

  it('Should properly check if color in HEX', () => {
    assert.ok(Color.isHex('#001020'));
    assert.ok(Color.isHex('#AABBCC'));
    assert.ok(Color.isHex('#aaBbdD'));
    assert.notOk(Color.isHex('False Color'));
  });

  it('Should properly create color from RGB', () => {
    const color = Color.fromRgb('rgb(10, 20, 30)');

    assert.instanceOf(color, Color);
    assert.equal(color._r, 10);
    assert.equal(color._g, 20);
    assert.equal(color._b, 30);
  });

  it('Should properly create color from HEX', () => {
    const color = Color.fromHex('#102030');

    assert.instanceOf(color, Color);
    assert.equal(color._r, 16);
    assert.equal(color._g, 32);
    assert.equal(color._b, 48);
  });

  it('Should properly create Color instance from static create()', () => {
    const color = Color.create('black');

    assert.instanceOf(color, Color);
    assert.equal(color._r, 0);
    assert.equal(color._g, 0);
    assert.equal(color._b, 0);
  });

  it('Should properly convert to 256 color number', () => {
    assert.equal(Color.create('black').to256Color(), 16);
    assert.equal(Color.create('#ff0000').to256Color(), 196);
  });
});
