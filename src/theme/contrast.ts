/** WCAG 2.x minimum contrast for normal-size text. */
export const MIN_TEXT_CONTRAST = 4.5;

function channelToLinear(channel: number): number {
  const srgb = channel / 255;
  return srgb <= 0.03928 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;
}

/** Relative luminance of a `#RRGGBB` color, per WCAG 2.x. */
function relativeLuminance(hex: string): number {
  const red = channelToLinear(parseInt(hex.slice(1, 3), 16));
  const green = channelToLinear(parseInt(hex.slice(3, 5), 16));
  const blue = channelToLinear(parseInt(hex.slice(5, 7), 16));
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

/** True when light text reads better than dark text on this background (e.g. for the status bar). */
export function isDarkColor(hex: string): boolean {
  return contrastRatio('#FFFFFF', hex) > contrastRatio('#000000', hex);
}

/** Contrast ratio between two `#RRGGBB` colors, from 1 (same) to 21 (black on white). */
export function contrastRatio(foreground: string, background: string): number {
  const first = relativeLuminance(foreground);
  const second = relativeLuminance(background);
  const lighter = Math.max(first, second);
  const darker = Math.min(first, second);
  return (lighter + 0.05) / (darker + 0.05);
}
