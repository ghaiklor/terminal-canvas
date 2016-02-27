/**
 * Bytes to encode to VT100 control sequence.
 *
 * @param {String} string Control code that you want to encode
 * @returns {Buffer} Returns encoded bytes
 */
export const encodeToVT100 = string => new Buffer([0x1b].concat(string.split('').map(char => char.charCodeAt(0))));
