/**
 * Map of erase regions that can be used in Cursor API.
 */
export const ERASE_REGIONS = {
  FROM_CURSOR_TO_END: '[K',
  FROM_CURSOR_TO_START: '[1K',
  FROM_CURSOR_TO_DOWN: '[J',
  FROM_CURSOR_TO_UP: '[1J',
  CURRENT_LINE: '[2K',
  ENTIRE_SCREEN: '[2J'
};
