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
  public r = 0;
  public g = 0;
  public b = 0;

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
   *
   * @example
   * Color.create('black');
   * Color.create('rgb(0, 10, 20)');
   * Color.create('#AABBCC');
   * Color.create({r: 0, g: 10, b: 20});
   */
  public constructor (color: string | IColor) {
    if (typeof color === 'string') {
      const hex = NAMED_COLORS.get(color.toUpperCase());
      if (typeof hex !== 'undefined') {
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
   * Check if provided color is named color.
   *
   * @static
   * @param {String} color
   * @returns {Boolean}
   */
  public static isNamed (color: string): boolean {
    return NAMED_COLORS.has(color.toUpperCase());
  }

  /**
   * Check if provided color written in RGB representation.
   *
   * @static
   * @param {String} rgb RGB color
   * @returns {Boolean}
   */
  public static isRgb (rgb: string): boolean {
    return RGB_REGEX.test(rgb);
  }

  /**
   * Check if provided color written in HEX representation.
   *
   * @static
   * @param {String} hex HEX color
   * @returns {Boolean}
   */
  public static isHex (hex: string): boolean {
    return HEX_REGEX.test(hex);
  }

  /**
   * Parse RGB color and return Color instance.
   *
   * @static
   * @param {String} rgb RGB color
   * @returns {Color}
   */
  public static fromRgb (rgb: string): Color {
    const match = RGB_REGEX.exec(rgb);
    if (match === null || typeof match.groups === 'undefined') {
      throw new Error(`Unrecognized RGB pattern: ${rgb}`);
    }

    const { red, green, blue } = match.groups;
    return this.create({
      r: parseInt(red, 10),
      g: parseInt(green, 10),
      b: parseInt(blue, 10),
    });
  }

  /**
   * Parse HEX color and return Color instance.
   *
   * @static
   * @param {String} hex HEX color
   * @returns {Color}
   */
  public static fromHex (hex: string): Color {
    const match = HEX_REGEX.exec(hex);
    if (match === null || typeof match.groups === 'undefined') {
      throw new Error(`Unrecognized HEX pattern: ${hex}`);
    }

    const { red, green, blue } = match.groups;
    return this.create({
      r: parseInt(red, 16),
      g: parseInt(green, 16),
      b: parseInt(blue, 16),
    });
  }

  /**
   * Wrapper around `new Color()`.
   *
   * @static
   * @returns {Color}
   */
  public static create (color: string | IColor): Color {
    return new this(color);
  }

  /**
   * Get rounded value of red channel.
   *
   * @returns {Number}
   */
  public getR (): number {
    return Math.round(this.r);
  }

  /**
   * Set clamped value of red channel.
   *
   * @param {Number} value
   * @returns {Color}
   */
  public setR (value: number): Color {
    this.r = Math.max(0, Math.min(value, 255));
    return this;
  }

  /**
   * Get rounded value of green channel.
   *
   * @returns {Number}
   */
  public getG (): number {
    return Math.round(this.g);
  }

  /**
   * Set clamped value of green channel.
   *
   * @param {Number} value
   * @returns {Color}
   */
  public setG (value: number): Color {
    this.g = Math.max(0, Math.min(value, 255));
    return this;
  }

  /**
   * Get rounded value of blue channel.
   *
   * @returns {Number}
   */
  public getB (): number {
    return Math.round(this.b);
  }

  /**
   * Set clamped value of blue channel.
   *
   * @param {Number} value
   * @returns {Color}
   */
  public setB (value: number): Color {
    this.b = Math.max(0, Math.min(value, 255));
    return this;
  }

  /**
   * Convert color to RGB representation.
   *
   * @returns {{r: Number, g: Number, b: Number}}
   */
  public toRgb (): IColor {
    return { r: this.getR(), g: this.getG(), b: this.getB() };
  }

  /**
   * Convert color to HEX representation.
   *
   * @returns {String}
   */
  public toHex (): string {
    const red = this.getR().toString(16).padStart(2, '0');
    const green = this.getG().toString(16).padStart(2, '0');
    const blue = this.getB().toString(16).padStart(2, '0');

    return `#${[red, green, blue].join('')}`;
  }
}
