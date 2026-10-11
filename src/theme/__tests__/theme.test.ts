import aldaraOnyx from '../themes/aldara-onyx.json';
import { contrastRatio } from '../contrast';
import { FONT_ASSETS } from '../fontAssets';
import { FONT_FACES } from '../fonts';
import { DEFAULT_THEME_ID, findTheme, loadThemes, REJECTED_THEMES, THEMES } from '../registry';

function validTheme(): Record<string, unknown> {
  return structuredClone(aldaraOnyx) as Record<string, unknown>;
}

function withChange(change: (theme: any) => void): unknown {
  const theme = validTheme();
  change(theme);
  return theme;
}

describe('contrastRatio', () => {
  test('black on white is 21:1', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 5);
  });

  test('a color on itself is 1:1', () => {
    expect(contrastRatio('#C8A96A', '#C8A96A')).toBeCloseTo(1, 5);
  });

  test('order of the two colors does not matter', () => {
    expect(contrastRatio('#777777', '#FFFFFF')).toBeCloseTo(contrastRatio('#FFFFFF', '#777777'), 5);
  });
});

describe('bundled themes', () => {
  test('all three themes pass validation', () => {
    expect(REJECTED_THEMES).toEqual([]);
    expect(THEMES.map((theme) => theme.id)).toEqual([
      'aldara-onyx',
      'velmora-linen',
      'tavris-atlas',
    ]);
  });

  test('every font face a theme can name is loaded at startup', () => {
    const faces = Object.values(FONT_FACES).flatMap((face) => [face.regular, face.strong]);
    for (const face of faces) {
      expect(FONT_ASSETS).toHaveProperty(face);
    }
  });

  test('unknown theme id falls back to the default theme', () => {
    expect(findTheme('removed-theme').id).toBe(DEFAULT_THEME_ID);
    expect(findTheme('tavris-atlas').id).toBe('tavris-atlas');
  });
});

describe('loadThemes', () => {
  test('accepts a valid theme', () => {
    const { themes, rejected } = loadThemes([validTheme()]);
    expect(rejected).toEqual([]);
    expect(themes[0]?.marca.nome).toBe('ALDARA');
  });

  test('rejects text that fails 4.5:1 contrast against the background', () => {
    const lowContrast = withChange((theme) => {
      theme.cores.textoSuave = '#3A4A44';
    });
    const { themes, rejected } = loadThemes([lowContrast]);
    expect(themes).toEqual([]);
    expect(rejected[0]?.problems.join()).toMatch(/textoSuave on fundo/);
  });

  test('rejects a layout without the balance block', () => {
    const noBalance = withChange((theme) => {
      theme.layout = theme.layout.filter((block: { bloco: string }) => block.bloco !== 'saldo');
    });
    expect(loadThemes([noBalance]).rejected[0]?.problems.join()).toMatch(/saldo/);
  });

  test('rejects a block that appears twice', () => {
    const duplicated = withChange((theme) => {
      theme.layout.push({ bloco: 'cartao', variante: 'minimo' });
    });
    expect(loadThemes([duplicated]).rejected).toHaveLength(1);
  });

  test('rejects an unknown block variant', () => {
    const badVariant = withChange((theme) => {
      theme.layout[0].variante = 'carrossel';
    });
    expect(loadThemes([badVariant]).rejected).toHaveLength(1);
  });

  test('rejects a font that the app does not load', () => {
    const badFont = withChange((theme) => {
      theme.fontes.corpo = 'Comic Sans MS';
    });
    expect(loadThemes([badFont]).rejected).toHaveLength(1);
  });

  test.each(['Banco Aldara', 'ALDARA BANK'])('rejects brand name "%s"', (name) => {
    const bankName = withChange((theme) => {
      theme.marca.nome = name;
    });
    expect(loadThemes([bankName]).rejected[0]?.problems.join()).toMatch(/bank/);
  });

  test('rejects invalid input without throwing and keeps valid themes', () => {
    const { themes, rejected } = loadThemes([null, { id: 'half' }, validTheme()]);
    expect(themes).toHaveLength(1);
    expect(rejected.map((theme) => theme.id)).toEqual(['(no id)', 'half']);
  });
});
