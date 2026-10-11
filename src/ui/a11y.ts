/** Smallest touch target allowed for any control, in pt/dp (Apple HIG minimum). */
export const MIN_TOUCH_SIZE = 44;

/**
 * Cap for system font scaling on text that is already display-size (titles, balance, brand).
 * Body text scales without a cap; display text at 3x would push everything else off screen.
 */
export const DISPLAY_TEXT_MAX_SCALE = 1.5;
