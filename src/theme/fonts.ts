export type FontWeightName = 'regular' | 'strong';

type FontFace = Record<FontWeightName, string>;

/**
 * Font families a theme may name; each maps to the loaded font face per weight.
 * Every face listed here must also be in FONT_ASSETS (fontAssets.ts).
 */
export const FONT_FACES = {
  Marcellus: { regular: 'Marcellus_400Regular', strong: 'Marcellus_400Regular' },
  'Hanken Grotesk': {
    regular: 'HankenGrotesk_400Regular',
    strong: 'HankenGrotesk_600SemiBold',
  },
  Manrope: { regular: 'Manrope_400Regular', strong: 'Manrope_700Bold' },
  'IBM Plex Sans': { regular: 'IBMPlexSans_400Regular', strong: 'IBMPlexSans_600SemiBold' },
} as const satisfies Record<string, FontFace>;

export type FontFamilyName = keyof typeof FONT_FACES;

export const FONT_FAMILY_NAMES = Object.keys(FONT_FACES) as [FontFamilyName, ...FontFamilyName[]];
