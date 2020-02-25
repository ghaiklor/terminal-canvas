import { HEX_REGEX } from './HEXRegex';
import { NAMED_COLORS } from './NamedColors';
import { RGB_REGEX } from './RGBRegex';

export interface IColor {
  r: number
  g: number
  b: number
}

/**
 * Color class responsible for converting colors between rgb and hex.
 *
 * @since 2.0.0
 */
export class Color implements IColor {
  r = 0;
  g = 0;
  b = 0;

  /**
   * Create new Color instance.
   * You can use different formats of color: named, rgb or hex.
   * Class will try to parse your provided color, otherwise throws an error.
   *
   * @constructor
   * @param {String|IColor} color String with named color, rgb, hex or object with {r, g, b} properties
   * @param {Number} color.r Red channel
   * @param {Number} color.g Green channel
   * @param {Number} color.b Blue channel
   * @returns {Color}
   *
   * @example
   * Color.create('black');
   * Color.create('rgb(0, 10, 20)');
   * Color.create('#AABBCC');
   * Color.create({r: 0, g: 10, b: 20});
   */
  constructor(color: string | IColor) {
    if (typeof color === 'string') {
      const hex = NAMED_COLORS.get(color.toUpperCase());
      if (hex !== undefined) {
        return Color.fromHex(hex);
      }

      if (Color.isRgb(color)) return Color.fromRgb(color);
      if (Color.isHex(color)) return Color.fromHex(color);

      throw new Error(`Color ${color} can't be parsed`);
    } else {
      this.setR(color.r);
      this.setG(color.g);
      this.setB(color.b);
    }
  }

  /**
   * Get rounded value of red channel.
   *
   * @returns {Number}
   */
  getR(): number {
    return Math.round(this.r);
  }

  /**
   * Set clamped value of red channel.
   *
   * @param {Number} value
   * @returns {Color}
   */
  setR(value: number): Color {
    this.r = Math.max(0, Math.min(value, 255));
    return this;
  }

  /**
   * Get rounded value of green channel.
   *
   * @returns {Number}
   */
  getG(): number {
    return Math.round(this.g);
  }

  /**
   * Set clamped value of green channel.
   *
   * @param {Number} value
   * @returns {Color}
   */
  setG(value: number): Color {
    this.g = Math.max(0, Math.min(value, 255));
    return this;
  }

  /**
   * Get rounded value of blue channel.
   *
   * @returns {Number}
   */
  getB(): number {
    return Math.round(this.b);
  }

  /**
   * Set clamped value of blue channel.
   *
   * @param {Number} value
   * @returns {Color}
   */
  setB(value: number): Color {
    this.b = Math.max(0, Math.min(value, 255));
    return this;
  }

  /**
   * Convert color to RGB representation.
   *
   * @returns {{r: Number, g: Number, b: Number}}
   */
  toRgb(): IColor {
    return { r: this.getR(), g: this.getG(), b: this.getB() };
  }

  /**
   * Convert color to HEX representation.
   *
   * @returns {String}
   */
  toHex(): string {
    const pad2 = (c: string): string => c.length === 1 ? '0' + c : c;
    return '#' + [pad2(this.getR().toString(16)), pad2(this.getG().toString(16)), pad2(this.getB().toString(16))].join('');
  }

  /**
   * Check if provided color is named color.
   *
   * @static
   * @param {String} color
   * @returns {Boolean}
   */
  static isNamed(color: string): boolean {
    return NAMED_COLORS.has(color.toUpperCase());
  }

  /**
   * Check if provided color written in RGB representation.
   *
   * @static
   * @param {String} rgb RGB color
   * @returns {Boolean}
   */
  static isRgb(rgb: string): boolean {
    return RGB_REGEX.test(rgb);
  }

  /**
   * Check if provided color written in HEX representation.
   *
   * @static
   * @param {String} hex HEX color
   * @returns {Boolean}
   */
  static isHex(hex: string): boolean {
    return HEX_REGEX.test(hex);
  }

  /**
   * Parse RGB color and return Color instance.
   *
   * @static
   * @param {String} rgb RGB color
   * @returns {Color}
   */
  static fromRgb(rgb: string): Color {
    const match = RGB_REGEX.exec(rgb);
    if (match === null) {
      throw new Error(`Unrecognized RGB pattern: ${rgb}`);
    }

    const [, r, g, b] = match;
    return this.create({ r: parseInt(r), g: parseInt(g), b: parseInt(b) });
  }

  /**
   * Parse HEX color and return Color instance.
   *
   * @static
   * @param {String} hex HEX color
   * @returns {Color}
   */
  static fromHex(hex: string): Color {
    const match = HEX_REGEX.exec(hex);
    if (match === null) {
      throw new Error(`Unrecognized HEX pattern: ${hex}`);
    }

    const [, r, g, b] = match;
    return this.create({ r: parseInt(r, 16), g: parseInt(g, 16), b: parseInt(b, 16) });
  }

  /**
   * Wrapper around `new Color()`.
   *
   * @static
   * @returns {Color}
   */
  static create(color: string | IColor): Color {
    return new this(color);
  }
}
