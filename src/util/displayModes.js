/**
 * Map of the display modes that can be used in Cursor API.
 * There are the most commonly supported control sequences for formatting text and their resetting.
 *
 * @type {Object}
 */
export const DISPLAY_MODES = {
  RESET_ALL: 0,
  BOLD: 1,
  DIM: 2,
  UNDERLINED: 4,
  BLINK: 5,
  REVERSE: 7,
  HIDDEN: 8,
  RESET_BOLD: 21,
  RESET_DIM: 22,
  RESET_UNDERLINED: 24,
  RESET_BLINK: 25,
  RESET_REVERSE: 27,
  RESET_HIDDEN: 28
};
