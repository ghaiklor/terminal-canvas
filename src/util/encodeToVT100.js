/**
 * Bytes to encode to VT100 control sequence.
 *
 * @param {String} code Control code that you want to encode
 * @returns {Buffer} Returns encoded bytes
 */
export const encodeToVT100 = code => `\u001b${code}`;
