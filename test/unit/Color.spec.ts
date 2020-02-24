import { Color } from '../../src/color/Color';

describe('Color', () => {
  it('Should properly create Color instance from named color', () => {
    const color = new Color('black');

    expect(color.r).toEqual(0);
    expect(color.g).toEqual(0);
    expect(color.b).toEqual(0);
  });

  it('Should properly create Color instance from RGB color', () => {
    const color = new Color('rgb(0, 100, 200)');

    expect(color.r).toEqual(0);
    expect(color.g).toEqual(100);
    expect(color.b).toEqual(200);
  });

  it('Should properly create Color instance from HEX color', () => {
    const color = new Color('#001020');

    expect(color.r).toEqual(0);
    expect(color.g).toEqual(16);
    expect(color.b).toEqual(32);
  });

  it('Should properly throw exception if color is not parsed', () => {
    expect(() => new Color('false color')).toThrowError(new Error('Color false color can\'t be parsed'));
  });

  it('Should properly get/set red channel', () => {
    const color = new Color('black');

    expect(color.getR()).toEqual(0);
    expect(color.setR(20)).toBeInstanceOf(Color);
    expect(color.getR()).toEqual(20);
    expect(color.setR(-50)).toBeInstanceOf(Color);
    expect(color.getR()).toEqual(0);
    expect(color.setR(500)).toBeInstanceOf(Color);
    expect(color.getR()).toEqual(255);
  });

  it('Should properly get/set green channel', () => {
    const color = new Color('black');

    expect(color.getG()).toEqual(0);
    expect(color.setG(20)).toBeInstanceOf(Color);
    expect(color.getG()).toEqual(20);
    expect(color.setG(-50)).toBeInstanceOf(Color);
    expect(color.getG()).toEqual(0);
    expect(color.setG(500)).toBeInstanceOf(Color);
    expect(color.getG()).toEqual(255);
  });

  it('Should properly get/set blue channel', () => {
    const color = new Color('black');

    expect(color.getB()).toEqual(0);
    expect(color.setB(20)).toBeInstanceOf(Color);
    expect(color.getB()).toEqual(20);
    expect(color.setB(-50)).toBeInstanceOf(Color);
    expect(color.getB()).toEqual(0);
    expect(color.setB(500)).toBeInstanceOf(Color);
    expect(color.getB()).toEqual(255);
  });

  it('Should properly return RGB object', () => {
    const color = new Color('black');

    expect(color.toRgb()).toEqual({ r: 0, g: 0, b: 0 });
    expect(color.setR(10)).toBeInstanceOf(Color);
    expect(color.setG(20)).toBeInstanceOf(Color);
    expect(color.setB(30)).toBeInstanceOf(Color);
    expect(color.toRgb()).toEqual({ r: 10, g: 20, b: 30 });
  });

  it('Should properly return HEX string', () => {
    const color = new Color('black');

    expect(color.toHex()).toEqual('#000000');
    expect(color.setR(16)).toBeInstanceOf(Color);
    expect(color.setG(32)).toBeInstanceOf(Color);
    expect(color.setB(48)).toBeInstanceOf(Color);
    expect(color.toHex()).toEqual('#102030');
  });

  it('Should properly check if color is named', () => {
    expect(Color.isNamed('black')).toBeTruthy();
    expect(Color.isNamed('BlAcK')).toBeTruthy();
    expect(Color.isNamed('BLACK')).toBeTruthy();
    expect(Color.isNamed('False Color')).toBeFalsy();
  });

  it('Should properly check if color in RGB', () => {
    expect(Color.isRgb('rgb(0, 10, 20)')).toBeTruthy();
    expect(Color.isRgb('RgB(0, 10, 50)')).toBeTruthy();
    expect(Color.isRgb('False Color')).toBeFalsy();
  });

  it('Should properly check if color in HEX', () => {
    expect(Color.isHex('#001020')).toBeTruthy();
    expect(Color.isHex('#AABBCC')).toBeTruthy();
    expect(Color.isHex('#aaBbdD')).toBeTruthy();
    expect(Color.isHex('False Color')).toBeFalsy();
  });

  it('Should properly create color from RGB', () => {
    const color = Color.fromRgb('rgb(10, 20, 30)');

    expect(color.r).toEqual(10);
    expect(color.g).toEqual(20);
    expect(color.b).toEqual(30);
  });

  it('Should properly throw an error if RGB pattern is incorrect', () => {
    expect(() => Color.fromRgb('wrong rgb')).toThrowError('Unrecognized RGB pattern: wrong rgb');
  });

  it('Should properly create color from HEX', () => {
    const color = Color.fromHex('#102030');

    expect(color.r).toEqual(16);
    expect(color.g).toEqual(32);
    expect(color.b).toEqual(48);
  });

  it('Should properly throw an error if HEX pattern is incorrect', () => {
    expect(() => Color.fromHex('wrong hex')).toThrowError('Unrecognized HEX pattern: wrong hex');
  });

  it('Should properly create Color instance from static create()', () => {
    const color = Color.create('black');

    expect(color.r).toEqual(0);
    expect(color.g).toEqual(0);
    expect(color.b).toEqual(0);
  });
});
