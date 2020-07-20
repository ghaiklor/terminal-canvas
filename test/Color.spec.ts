import { Color } from '../src/color/Color';

describe('color', () => {
  it('should properly create Color instance from named color', () => {
    expect.hasAssertions();

    const color = new Color('black');

    expect(color.r).toStrictEqual(0);
    expect(color.g).toStrictEqual(0);
    expect(color.b).toStrictEqual(0);
  });

  it('should properly create Color instance from RGB color', () => {
    expect.hasAssertions();

    const color = new Color('rgb(0, 100, 200)');

    expect(color.r).toStrictEqual(0);
    expect(color.g).toStrictEqual(100);
    expect(color.b).toStrictEqual(200);
  });

  it('should properly create Color instance from HEX color', () => {
    expect.hasAssertions();

    const color = new Color('#001020');

    expect(color.r).toStrictEqual(0);
    expect(color.g).toStrictEqual(16);
    expect(color.b).toStrictEqual(32);
  });

  it('should properly throw exception if color is not parsed', () => {
    expect.hasAssertions();
    expect(() => new Color('false color')).toThrow(new Error('Color false color can\'t be parsed'));
  });

  it('should properly get/set red channel', () => {
    expect.hasAssertions();

    const color = new Color('black');

    expect(color.getR()).toStrictEqual(0);
    expect(color.setR(20)).toBeInstanceOf(Color);
    expect(color.getR()).toStrictEqual(20);
    expect(color.setR(-50)).toBeInstanceOf(Color);
    expect(color.getR()).toStrictEqual(0);
    expect(color.setR(500)).toBeInstanceOf(Color);
    expect(color.getR()).toStrictEqual(255);
  });

  it('should properly get/set green channel', () => {
    expect.hasAssertions();

    const color = new Color('black');

    expect(color.getG()).toStrictEqual(0);
    expect(color.setG(20)).toBeInstanceOf(Color);
    expect(color.getG()).toStrictEqual(20);
    expect(color.setG(-50)).toBeInstanceOf(Color);
    expect(color.getG()).toStrictEqual(0);
    expect(color.setG(500)).toBeInstanceOf(Color);
    expect(color.getG()).toStrictEqual(255);
  });

  it('should properly get/set blue channel', () => {
    expect.hasAssertions();

    const color = new Color('black');

    expect(color.getB()).toStrictEqual(0);
    expect(color.setB(20)).toBeInstanceOf(Color);
    expect(color.getB()).toStrictEqual(20);
    expect(color.setB(-50)).toBeInstanceOf(Color);
    expect(color.getB()).toStrictEqual(0);
    expect(color.setB(500)).toBeInstanceOf(Color);
    expect(color.getB()).toStrictEqual(255);
  });

  it('should properly return RGB object', () => {
    expect.hasAssertions();

    const color = new Color('black');

    expect(color.toRgb()).toStrictEqual({ r: 0, g: 0, b: 0 });
    expect(color.setR(10)).toBeInstanceOf(Color);
    expect(color.setG(20)).toBeInstanceOf(Color);
    expect(color.setB(30)).toBeInstanceOf(Color);
    expect(color.toRgb()).toStrictEqual({ r: 10, g: 20, b: 30 });
  });

  it('should properly return HEX string', () => {
    expect.hasAssertions();

    const color = new Color('black');

    expect(color.toHex()).toStrictEqual('#000000');
    expect(color.setR(16)).toBeInstanceOf(Color);
    expect(color.setG(32)).toBeInstanceOf(Color);
    expect(color.setB(48)).toBeInstanceOf(Color);
    expect(color.toHex()).toStrictEqual('#102030');
  });

  it('should properly check if color is named', () => {
    expect.hasAssertions();
    expect(Color.isNamed('black')).toBe(true);
    expect(Color.isNamed('BlAcK')).toBe(true);
    expect(Color.isNamed('BLACK')).toBe(true);
    expect(Color.isNamed('False Color')).toBe(false);
  });

  it('should properly check if color in RGB', () => {
    expect.hasAssertions();
    expect(Color.isRgb('rgb(0, 10, 20)')).toBe(true);
    expect(Color.isRgb('RgB(0, 10, 50)')).toBe(true);
    expect(Color.isRgb('False Color')).toBe(false);
  });

  it('should properly check if color in HEX', () => {
    expect.hasAssertions();
    expect(Color.isHex('#001020')).toBe(true);
    expect(Color.isHex('#AABBCC')).toBe(true);
    expect(Color.isHex('#aaBbdD')).toBe(true);
    expect(Color.isHex('False Color')).toBe(false);
  });

  it('should properly create color from RGB', () => {
    expect.hasAssertions();

    const color = Color.fromRgb('rgb(10, 20, 30)');

    expect(color.r).toStrictEqual(10);
    expect(color.g).toStrictEqual(20);
    expect(color.b).toStrictEqual(30);
  });

  it('should properly throw an error if RGB pattern is incorrect', () => {
    expect.hasAssertions();
    expect(() => Color.fromRgb('wrong rgb')).toThrow('Unrecognized RGB pattern: wrong rgb');
  });

  it('should properly create color from HEX', () => {
    expect.hasAssertions();

    const color = Color.fromHex('#102030');

    expect(color.r).toStrictEqual(16);
    expect(color.g).toStrictEqual(32);
    expect(color.b).toStrictEqual(48);
  });

  it('should properly throw an error if HEX pattern is incorrect', () => {
    expect.hasAssertions();
    expect(() => Color.fromHex('wrong hex')).toThrow('Unrecognized HEX pattern: wrong hex');
  });

  it('should properly create Color instance from static create()', () => {
    expect.hasAssertions();

    const color = Color.create('black');

    expect(color.r).toStrictEqual(0);
    expect(color.g).toStrictEqual(0);
    expect(color.b).toStrictEqual(0);
  });
});
