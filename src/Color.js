import { COLORS } from './util/colors';

/**
 * Regular expression for capturing RGB channels.
 *
 * @type {RegExp}
 * @private
 */
const RGB_REGEX = /rgb\((\d{1,3}), (\d{1,3}), (\d{1,3})\)/i;

/**
 * Regular expression for capturing HEX channels.
 *
 * @type {RegExp}
 * @private
 */
const HEX_REGEX = /#([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})/i;

/**
 * Color class responsible for converting colors between rgb, hsl or hsv.
 *
 * @since 3.1.0
 */
export default class Color {
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
  constructor(color) {
    if (Color.isNamed(color)) return Color.fromHex(COLORS[color.toUpperCase()]);
    if (Color.isRgb(color)) return Color.fromRgb(color);
    if (Color.isHex(color)) return Color.fromHex(color);
    if (!(color.hasOwnProperty('r') || color.hasOwnProperty('g') || color.hasOwnProperty('b'))) throw new Error(`Color ${color} can't be parsed`);

    this.setR(color.r);
    this.setG(color.g);
    this.setB(color.b);
  }

  /**
   * Get rounded value of red channel.
   *
   * @returns {Number}
   */
  getR() {
    return Math.round(this._r);
  }

  /**
   * Set clamped value of red channel.
   *
   * @param {Number} value
   * @returns {Color}
   */
  setR(value) {
    this._r = Math.max(0, Math.min(value, 255));
    return this;
  }

  /**
   * Get rounded value of green channel.
   *
   * @returns {Number}
   */
  getG() {
    return Math.round(this._g);
  }

  /**
   * Set clamped value of green channel.
   *
   * @param {Number} value
   * @returns {Color}
   */
  setG(value) {
    this._g = Math.max(0, Math.min(value, 255));
    return this;
  }

  /**
   * Get rounded value of blue channel.
   *
   * @returns {Number}
   */
  getB() {
    return Math.round(this._b);
  }

  /**
   * Set clamped value of blue channel.
   *
   * @param {Number} value
   * @returns {Color}
   */
  setB(value) {
    this._b = Math.max(0, Math.min(value, 255));
    return this;
  }

  /**
   * Convert color to RGB representation.
   *
   * @returns {{r: (Number), g: Number, b: (Number)}}
   */
  toRgb() {
    return {r: this.getR(), g: this.getG(), b: this.getB()};
  }

  /**
   * Convert color to HEX representation.
   *
   * @returns {String}
   */
  toHex() {
    const pad2 = c => c.length === 1 ? '0' + c : c;
    return '#' + [pad2(this.getR().toString(16)), pad2(this.getG().toString(16)), pad2(this.getB().toString(16))].join('');
  }

  /**
   * Check if provided color is named color.
   *
   * @param {String} color
   * @returns {Boolean}
   */
  static isNamed(color) {
    return (typeof color === 'string' && COLORS[color.toUpperCase()]);
  }

  /**
   * Check if provided color written in RGB representation.
   *
   * @static
   * @param {String} rgb RGB color
   * @returns {Boolean}
   */
  static isRgb(rgb) {
    return RGB_REGEX.test(rgb);
  }

  /**
   * Check if provided color written in HEX representation.
   *
   * @static
   * @param {String} hex HEX color
   * @returns {Boolean}
   */
  static isHex(hex) {
    return HEX_REGEX.test(hex);
  }

  /**
   * Parse RGB color and return Color instance.
   *
   * @static
   * @param {String} rgb RGB color
   * @returns {Color}
   */
  static fromRgb(rgb) {
    const [_, r, g, b] = rgb.match(RGB_REGEX);
    return this.create({r, g, b});
  }

  /**
   * Parse HEX color and return Color instance.
   *
   * @static
   * @param {String} hex HEX color
   * @returns {Color}
   */
  static fromHex(hex) {
    const [_, r, g, b] = hex.match(HEX_REGEX);
    return this.create({r: parseInt(r, 16), g: parseInt(g, 16), b: parseInt(b, 16)});
  }

  /**
   * Wrapper around `new Color()`.
   *
   * @static
   * @returns {Color}
   */
  static create(...args) {
    return new this(...args);
  }
}
