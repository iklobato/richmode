import { createContext, useContext, type ReactNode } from 'react';

import { FONT_FACES, type FontWeightName } from './fonts';
import type { Theme } from './schema';

const ThemeContext = createContext<Theme | null>(null);

export function ThemeProvider({ theme, children }: { theme: Theme; children: ReactNode }) {
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Theme {
  const theme = useContext(ThemeContext);
  if (!theme) {
    throw new Error('useTheme must be used inside a ThemeProvider');
  }
  return theme;
}

/** Loaded font face for the theme's brand or body family at the given weight. */
export function fontFace(theme: Theme, role: 'marca' | 'corpo', weight: FontWeightName): string {
  return FONT_FACES[theme.fontes[role]][weight];
}
