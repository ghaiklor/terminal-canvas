/**
 * Converts string with control code to VT100 control sequence.
 *
 * @param {String} code Control code that you want to encode
 * @returns {String} Returns VT100 control sequence
 */
export const encodeToVT100 = code => '\u001b' + code;
