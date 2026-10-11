export const CURRENCIES = ['BRL', 'USD', 'EUR'] as const;
export type Currency = (typeof CURRENCIES)[number];

const CENTS_PER_UNIT = 100;

/** Shown instead of an amount while the user keeps values hidden. */
export const HIDDEN_AMOUNT = '••••••';

/** Largest amount a user may enter: 999.999.999,00, kept in cents. */
export const MAX_AMOUNT_CENTS = 999_999_999 * CENTS_PER_UNIT;

/** Amounts are integer cents so sums and edits never pick up floating-point error. */
export type AmountInCents = number;

export function isValidAmount(cents: number): cents is AmountInCents {
  return Number.isSafeInteger(cents) && cents >= 0 && cents <= MAX_AMOUNT_CENTS;
}

/** Formats cents as money for the locale, e.g. "R$ 1.234.567,89" or "$1,234,567.89". */
export function formatMoney(cents: AmountInCents, currency: Currency, locale: string): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(cents / CENTS_PER_UNIT);
}

/**
 * Reads what the user typed in a money field. Only digits count: "1.234,56", "1,234.56"
 * and "123456" all mean 1234,56. Returns null when the result is out of range.
 */
export function parseTypedAmount(typed: string): AmountInCents | null {
  const digits = typed.replace(/\D/g, '');
  if (digits === '') {
    return 0;
  }
  const cents = Number(digits);
  return isValidAmount(cents) ? cents : null;
}
