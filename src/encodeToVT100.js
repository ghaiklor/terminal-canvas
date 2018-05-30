/**
 * Converts string with control code to VT100 control sequence.
 *
 * @private
 * @param {String} code Control code that you want to encode
 * @returns {String} Returns VT100 control sequence
 */
module.exports = code => '\u001b' + code;
