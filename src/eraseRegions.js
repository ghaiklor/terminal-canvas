/**
 * Dictionary of regions to use in {@link Cursor.erase}.
 *
 * @property {String} ERASE_REGIONS.FROM_CURSOR_TO_END Erase the region from cursor to the end of line
 * @property {String} ERASE_REGIONS.FROM_CURSOR_TO_START Erase the region from cursor to the start of line
 * @property {String} ERASE_REGIONS.FROM_CURSOR_TO_DOWN Erase the region from cursor to the down of TTY
 * @property {String} ERASE_REGIONS.FROM_CURSOR_TO_UP Erase the region from cursor to the up of TTY
 * @property {String} ERASE_REGIONS.CURRENT_LINE Erase the current line
 * @property {String} ERASE_REGIONS.ENTIRE_SCREEN Erase the entire screen
 * @see {@link Cursor.erase}
 */
export const ERASE_REGIONS = {
  FROM_CURSOR_TO_END: '[K',
  FROM_CURSOR_TO_START: '[1K',
  FROM_CURSOR_TO_DOWN: '[J',
  FROM_CURSOR_TO_UP: '[1J',
  CURRENT_LINE: '[2K',
  ENTIRE_SCREEN: '[2J'
};
