/**
 * Converts string with control code to VT100 control sequence.
 *
 * @private
 * @param {String} code Control code that you want to encode
 * @returns {String} Returns VT100 control sequence
 */
export function encodeToVT100(code: string): string {
  return '\u001b' + code;
}
