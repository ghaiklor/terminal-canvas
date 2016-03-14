/**
 * Bytes to encode to VT100 control sequence.
 *
 * @param {String} code Control code that you want to encode
 * @returns {Buffer} Returns encoded bytes
 */
export const encodeToVT100 = code => new Buffer([0x1b].concat(code.split('').map(char => char.charCodeAt(0))));
