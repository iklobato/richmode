import { z } from 'zod';

import { contrastRatio, MIN_TEXT_CONTRAST } from './contrast';
import { FONT_FAMILY_NAMES } from './fonts';

const hexColor = z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'expected a #RRGGBB color');

const brandText = z
  .string()
  .min(1)
  .max(24)
  // Fixed rule: no theme may present itself as a bank.
  .refine((text) => !/\b(banco|bank)\b/i.test(text), 'brand text must not say "banco" or "bank"');

export const TAB_ITEMS = ['inicio', 'cartoes', 'investir', 'perfil'] as const;

const blockSchema = z.discriminatedUnion('bloco', [
  z.object({ bloco: z.literal('cabecalho'), variante: z.enum(['logo-esquerda', 'logo-centro']) }),
  z.object({ bloco: z.literal('saldo'), variante: z.enum(['grande', 'compacto']) }),
  z.object({
    bloco: z.literal('atalhos'),
    variante: z.enum(['circulos', 'quadrados']),
    colunas: z.union([z.literal(2), z.literal(4)]),
  }),
  z.object({ bloco: z.literal('cartao'), variante: z.enum(['visual', 'minimo']) }),
  z.object({ bloco: z.literal('investimentos'), variante: z.enum(['linha', 'cartao']) }),
]);

export type LayoutBlock = z.infer<typeof blockSchema>;
export type BlockName = LayoutBlock['bloco'];

const colorsSchema = z.object({
  fundo: hexColor,
  superficie: hexColor,
  borda: hexColor,
  divisor: hexColor,
  texto: hexColor,
  textoSuave: hexColor,
  destaque: hexColor,
});

type ThemeColors = z.infer<typeof colorsSchema>;

type ColorKey = keyof ThemeColors;

/** Every [text, background] pair the UI draws; each must meet the minimum contrast. */
const TEXT_ON_BACKGROUND: readonly (readonly [ColorKey, ColorKey])[] = [
  ['texto', 'fundo'],
  ['texto', 'superficie'],
  ['textoSuave', 'fundo'],
  ['textoSuave', 'superficie'],
  ['destaque', 'fundo'],
  ['destaque', 'superficie'],
  // Primary buttons: fundo-colored label on a destaque fill.
  ['fundo', 'destaque'],
];

export const themeSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'expected a kebab-case id'),
    marca: z.object({ nome: brandText, subtitulo: brandText, cartao: brandText }),
    cores: colorsSchema,
    fontes: z.object({
      marca: z.enum(FONT_FAMILY_NAMES),
      corpo: z.enum(FONT_FAMILY_NAMES),
      tamanhos: z.object({
        saldo: z.number().min(24).max(64),
        titulo: z.number().min(14).max(28),
        corpo: z.number().min(13).max(22),
        legenda: z.number().min(11).max(18),
      }),
    }),
    forma: z.object({
      raioCartao: z.number().min(0).max(40),
      raioLinha: z.number().min(0).max(40),
      raioBotao: z.number().min(0),
      espaco: z.number().min(4).max(16),
    }),
    layout: z
      .array(blockSchema)
      .min(1)
      .refine(
        (blocks) => new Set(blocks.map((block) => block.bloco)).size === blocks.length,
        'each block may appear only once in the layout',
      )
      // The "Saldo fictício" label lives in the balance block, so the block can't be left out.
      .refine(
        (blocks) => blocks.some((block) => block.bloco === 'saldo'),
        'layout must include the "saldo" block',
      ),
    navegacao: z.object({
      tipo: z.literal('abas-inferiores'),
      itens: z
        .array(z.enum(TAB_ITEMS))
        .min(2)
        .max(5)
        .refine((items) => new Set(items).size === items.length, 'tab items must be unique'),
    }),
  })
  .superRefine((theme, context) => {
    for (const [text, background] of TEXT_ON_BACKGROUND) {
      const ratio = contrastRatio(theme.cores[text], theme.cores[background]);
      if (ratio < MIN_TEXT_CONTRAST) {
        context.addIssue({
          code: 'custom',
          path: ['cores', text],
          message: `contrast ${text} on ${background} is ${ratio.toFixed(2)}:1, below ${MIN_TEXT_CONTRAST}:1`,
        });
      }
    }
  });

export type Theme = z.infer<typeof themeSchema>;
