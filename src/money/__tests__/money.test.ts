import { formatMoney, MAX_AMOUNT_CENTS, parseTypedAmount } from '../money';

// Intl puts a no-break space (U+00A0) between symbol and number in some locales.
const normalizeSpaces = (text: string) => text.replace(/\s/g, ' ');

describe('formatMoney', () => {
  test.each([
    ['BRL', 'pt-BR', 123456789, 'R$ 1.234.567,89'],
    ['USD', 'pt-BR', 123456789, 'US$ 1.234.567,89'],
    ['EUR', 'pt-BR', 123456789, '€ 1.234.567,89'],
    ['BRL', 'en-US', 123456789, 'R$1,234,567.89'],
    ['USD', 'en-US', 123456789, '$1,234,567.89'],
    ['EUR', 'en-US', 123456789, '€1,234,567.89'],
  ] as const)('%s in %s', (currency, locale, cents, expected) => {
    expect(normalizeSpaces(formatMoney(cents, currency, locale))).toBe(expected);
  });

  test('always shows two decimals', () => {
    expect(normalizeSpaces(formatMoney(500, 'BRL', 'pt-BR'))).toBe('R$ 5,00');
    expect(normalizeSpaces(formatMoney(0, 'USD', 'en-US'))).toBe('$0.00');
  });

  test('formats the largest allowed amount', () => {
    expect(normalizeSpaces(formatMoney(MAX_AMOUNT_CENTS, 'BRL', 'pt-BR'))).toBe(
      'R$ 999.999.999,00',
    );
  });
});

describe('parseTypedAmount', () => {
  test.each([
    ['1.234,56', 123456],
    ['1,234.56', 123456],
    ['R$ 12,00', 1200],
    ['7', 7],
    ['', 0],
  ])('"%s" is %d cents', (typed, cents) => {
    expect(parseTypedAmount(typed)).toBe(cents);
  });

  test('accepts the maximum and rejects one cent above it', () => {
    expect(parseTypedAmount('999.999.999,00')).toBe(MAX_AMOUNT_CENTS);
    expect(parseTypedAmount('999.999.999,01')).toBeNull();
  });
});
