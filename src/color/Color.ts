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
  private _r = 0;
  private _g = 0;
  private _b = 0;

  /**
   * Create new Color instance.
   * You can use different formats of color: named, rgb or hex.
   * Class will try to parse your provided color, otherwise throws an error.
   *
   * @constructor
   * @param {String|Object} color String with named color, rgb, hex or object with {r, g, b} properties
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
  constructor (color: string | IColor) {
    if (typeof color === 'string') {
      if (Color.isNamed(color)) {
        const name = NAMED_COLORS.get(color.toUpperCase());
        if (name === undefined) {
          throw new Error(`Unknown color name: ${name}`);
        }

        return Color.fromHex(name);
      }

      if (Color.isRgb(color)) return Color.fromRgb(color);
      if (Color.isHex(color)) return Color.fromHex(color);
    } else {
      this.r = color.r;
      this.g = color.g;
      this.b = color.b;
    }
  }

  /**
   * Get rounded value of red channel.
   *
   * @returns {Number}
   */
  get r (): number {
    return Math.round(this._r);
  }

  /**
   * Set clamped value of red channel.
   *
   * @param {Number} value
   * @returns {Color}
   */
  set r (value: number) {
    this._r = Math.max(0, Math.min(value, 255));
  }

  /**
   * Get rounded value of green channel.
   *
   * @returns {Number}
   */
  get g (): number {
    return Math.round(this._g);
  }

  /**
   * Set clamped value of green channel.
   *
   * @param {Number} value
   * @returns {Color}
   */
  set g (value: number) {
    this._g = Math.max(0, Math.min(value, 255));
  }

  /**
   * Get rounded value of blue channel.
   *
   * @returns {Number}
   */
  get b () {
    return Math.round(this._b);
  }

  /**
   * Set clamped value of blue channel.
   *
   * @param {Number} value
   * @returns {Color}
   */
  set b (value: number) {
    this._b = Math.max(0, Math.min(value, 255));
  }

  /**
   * Convert color to RGB representation.
   *
   * @returns {{r: Number, g: Number, b: Number}}
   */
  toRgb () {
    return { r: this.r, g: this.g, b: this.b };
  }

  /**
   * Convert color to HEX representation.
   *
   * @returns {String}
   */
  toHex (): string {
    const pad2 = (c: string) => c.length === 1 ? '0' + c : c;
    return '#' + [pad2(this.r.toString(16)), pad2(this.g.toString(16)), pad2(this.b.toString(16))].join('');
  }

  /**
   * Check if provided color is named color.
   *
   * @static
   * @param {String} color
   * @returns {Boolean}
   */
  static isNamed (color: string): boolean {
    return NAMED_COLORS.has(color.toUpperCase());
  }

  /**
   * Check if provided color written in RGB representation.
   *
   * @static
   * @param {String} rgb RGB color
   * @returns {Boolean}
   */
  static isRgb (rgb: string): boolean {
    return RGB_REGEX.test(rgb);
  }

  /**
   * Check if provided color written in HEX representation.
   *
   * @static
   * @param {String} hex HEX color
   * @returns {Boolean}
   */
  static isHex (hex: string): boolean {
    return HEX_REGEX.test(hex);
  }

  /**
   * Parse RGB color and return Color instance.
   *
   * @static
   * @param {String} rgb RGB color
   * @returns {Color}
   */
  static fromRgb (rgb: string): Color {
    const match = rgb.match(RGB_REGEX);
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
  static fromHex (hex: string): Color {
    const match = hex.match(HEX_REGEX);
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
  static create (color: string | IColor): Color {
    return new this(color);
  }
}
