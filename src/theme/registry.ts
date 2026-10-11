import aldaraOnyx from './themes/aldara-onyx.json';
import tavrisAtlas from './themes/tavris-atlas.json';
import velmoraLinen from './themes/velmora-linen.json';
import { themeSchema, type Theme } from './schema';

export const DEFAULT_THEME_ID = 'aldara-onyx';

export type RejectedTheme = { id: string; problems: string[] };

/** Validates raw theme JSON; a theme that fails the schema or the contrast check is left out. */
export function loadThemes(rawThemes: readonly unknown[]): {
  themes: Theme[];
  rejected: RejectedTheme[];
} {
  const themes: Theme[] = [];
  const rejected: RejectedTheme[] = [];
  for (const raw of rawThemes) {
    const result = themeSchema.safeParse(raw);
    if (result.success) {
      themes.push(result.data);
      continue;
    }
    const id = (raw as { id?: unknown } | null)?.id;
    rejected.push({
      id: typeof id === 'string' ? id : '(no id)',
      problems: result.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`),
    });
  }
  return { themes, rejected };
}

const loaded = loadThemes([aldaraOnyx, velmoraLinen, tavrisAtlas]);

for (const theme of loaded.rejected) {
  console.warn(`Theme "${theme.id}" rejected:\n  ${theme.problems.join('\n  ')}`);
}

export const THEMES: readonly Theme[] = loaded.themes;
export const REJECTED_THEMES: readonly RejectedTheme[] = loaded.rejected;

const defaultTheme = THEMES.find((theme) => theme.id === DEFAULT_THEME_ID);
if (!defaultTheme) {
  throw new Error(`Default theme "${DEFAULT_THEME_ID}" failed validation`);
}
const fallbackTheme: Theme = defaultTheme;

/** The theme with this id, or the default theme when the id is unknown (e.g. a removed theme). */
export function findTheme(id: string): Theme {
  return THEMES.find((theme) => theme.id === id) ?? fallbackTheme;
}
