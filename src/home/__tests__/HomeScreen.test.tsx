import { act, fireEvent, screen } from '@testing-library/react-native';

import { HomeScreen } from '@/home/HomeScreen';
import i18n from '@/i18n/i18n';
import { HIDDEN_AMOUNT } from '@/money/money';
import { useAppStore } from '@/state/store';
import { renderWithTheme, resetStore } from '@/test-utils/renderWithTheme';
import { THEMES } from '@/theme/registry';

const normalizeSpaces = (text: string) => text.replace(/\s/g, ' ');

beforeEach(async () => {
  resetStore();
  await i18n.changeLanguage('pt-BR');
});

describe.each(THEMES.map((theme) => [theme.id]))('theme %s', (themeId) => {
  beforeEach(() => {
    useAppStore.setState({ themeId });
  });

  test('shows the "Saldo fictício" label next to the balance', async () => {
    await renderWithTheme(<HomeScreen />);
    expect(screen.getByTestId('fictional-badge')).toBeOnTheScreen();
    expect(screen.getByText('Saldo fictício')).toBeOnTheScreen();
  });

  test('keeps the label while the balance is hidden', async () => {
    useAppStore.setState({ balanceHidden: true });
    await renderWithTheme(<HomeScreen />);
    expect(screen.getByText('Saldo fictício')).toBeOnTheScreen();
  });
});

test('label is translated, not removed, in English', async () => {
  await i18n.changeLanguage('en');
  await renderWithTheme(<HomeScreen />);
  expect(screen.getByText('Fictional balance')).toBeOnTheScreen();
});

test('hide button masks the balance and the show button brings it back', async () => {
  useAppStore.setState({ balanceCents: 123456789, currency: 'BRL' });
  await renderWithTheme(<HomeScreen />);
  const amount = () => normalizeSpaces(screen.getByTestId('balance-amount').props.children);
  expect(amount()).toBe('R$ 1.234.567,89');

  await act(() => fireEvent.press(screen.getByRole('button', { name: 'Ocultar saldo' })));
  expect(amount()).toBe(HIDDEN_AMOUNT);
  expect(screen.queryByText(/1\.234\.567,89/)).toBeNull();
  expect(useAppStore.getState().balanceHidden).toBe(true);

  await act(() => fireEvent.press(screen.getByRole('button', { name: 'Mostrar saldo' })));
  expect(amount()).toBe('R$ 1.234.567,89');
});

test('a shortcut with no screen opens the simulation notice', async () => {
  await renderWithTheme(<HomeScreen />);
  expect(screen.queryByText('Isto é uma simulação. Nada acontece de verdade aqui.')).toBeNull();
  await act(() => fireEvent.press(screen.getByRole('button', { name: 'Pix' })));
  expect(
    screen.getByText('Isto é uma simulação. Nada acontece de verdade aqui.'),
  ).toBeOnTheScreen();
});

test('a tab with no screen opens the simulation notice', async () => {
  await renderWithTheme(<HomeScreen />);
  await act(() => fireEvent.press(screen.getByRole('tab', { name: 'Perfil' })));
  expect(
    screen.getByText('Isto é uma simulação. Nada acontece de verdade aqui.'),
  ).toBeOnTheScreen();
});
