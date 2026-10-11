import { act, fireEvent, screen } from '@testing-library/react-native';

import { HomeScreen } from '@/home/HomeScreen';
import i18n from '@/i18n/i18n';
import { MAX_AMOUNT_CENTS } from '@/money/money';
import { useAppStore } from '@/state/store';
import { renderWithTheme, resetStore } from '@/test-utils/renderWithTheme';

const normalizeSpaces = (text: string) => text.replace(/\s/g, ' ');
const balanceText = () => normalizeSpaces(screen.getByTestId('balance-amount').props.children);
const press = (element: Parameters<typeof fireEvent.press>[0]) =>
  act(() => fireEvent.press(element));
const type = (element: Parameters<typeof fireEvent.changeText>[0], text: string) =>
  act(() => fireEvent.changeText(element, text));

beforeEach(async () => {
  resetStore();
  await i18n.changeLanguage('pt-BR');
});

describe('Temas sheet', () => {
  test('picking a theme switches the home screen at once', async () => {
    await renderWithTheme(<HomeScreen />);
    expect(screen.getAllByText('ALDARA').length).toBeGreaterThan(0);

    await press(screen.getByRole('button', { name: 'Temas' }));
    await press(screen.getByRole('radio', { name: 'TAVRIS Corporate' }));

    expect(useAppStore.getState().themeId).toBe('tavris-atlas');
    expect(screen.getByRole('radio', { name: 'TAVRIS Corporate' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'ALDARA Private' })).not.toBeChecked();
    expect(screen.getByRole('button', { name: 'Cartão Atlas' })).toBeOnTheScreen();
    expect(screen.queryByRole('button', { name: 'Cartão Onyx' })).toBeNull();
  });

  test('the label stays visible after switching theme', async () => {
    await renderWithTheme(<HomeScreen />);
    await press(screen.getByRole('button', { name: 'Temas' }));
    await press(screen.getByRole('radio', { name: 'velmora Essential' }));
    expect(screen.getByText('Saldo fictício')).toBeOnTheScreen();
  });
});

describe('Editar valores sheet', () => {
  test('saves name, balance, invested amount and currency', async () => {
    await renderWithTheme(<HomeScreen />);
    await press(screen.getByRole('button', { name: 'Editar valores' }));

    await type(screen.getByLabelText('Nome exibido'), 'Ana');
    await type(screen.getByLabelText('Saldo'), '7.500.000,00');
    await type(screen.getByLabelText('Valor investido'), '1.000,50');
    await press(screen.getByRole('radio', { name: 'USD' }));
    await press(screen.getByRole('button', { name: 'Salvar' }));

    expect(useAppStore.getState()).toMatchObject({
      displayName: 'Ana',
      balanceCents: 750000000,
      investedCents: 100050,
      currency: 'USD',
    });
    expect(balanceText()).toBe('US$ 7.500.000,00');
    expect(screen.getByText('Olá, Ana')).toBeOnTheScreen();
  });

  test('closing without saving keeps the stored values', async () => {
    await renderWithTheme(<HomeScreen />);
    const before = useAppStore.getState().balanceCents;
    await press(screen.getByRole('button', { name: 'Editar valores' }));
    await type(screen.getByLabelText('Saldo'), '1,00');
    await press(screen.getAllByRole('button', { name: 'Fechar' }).at(-1)!);

    expect(useAppStore.getState().balanceCents).toBe(before);
  });

  test('refuses an amount above 999.999.999,00 and keeps the last valid one', async () => {
    await renderWithTheme(<HomeScreen />);
    await press(screen.getByRole('button', { name: 'Editar valores' }));
    const balanceField = screen.getByLabelText('Saldo');

    await type(balanceField, '999.999.999,00');
    await type(balanceField, '9.999.999.999,00');
    expect(screen.getByText('Máximo: 999.999.999,00')).toBeOnTheScreen();

    await press(screen.getByRole('button', { name: 'Salvar' }));
    expect(useAppStore.getState().balanceCents).toBe(MAX_AMOUNT_CENTS);
  });
});

describe('store guard', () => {
  test('saveDisplayValues throws on an out-of-range amount and leaves state unchanged', () => {
    const before = useAppStore.getState().balanceCents;
    expect(() =>
      useAppStore.getState().saveDisplayValues({
        displayName: '',
        balanceCents: MAX_AMOUNT_CENTS + 1,
        investedCents: 0,
        currency: 'BRL',
      }),
    ).toThrow(RangeError);
    expect(useAppStore.getState().balanceCents).toBe(before);
  });
});
