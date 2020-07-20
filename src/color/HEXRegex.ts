/**
 * Regular expression for capturing HEX channels.
 * E.g. "#FFFFFF"
 */
export const HEX_REGEX = /#(?<red>[0-9A-F]{2})(?<green>[0-9A-F]{2})(?<blue>[0-9A-F]{2})/iu;
