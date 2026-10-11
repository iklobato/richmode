import { act, fireEvent, screen } from '@testing-library/react-native';

import IndexRoute from '@/app/index';
import i18n, { languageForDevice } from '@/i18n/i18n';
import en from '@/i18n/locales/en.json';
import ptBR from '@/i18n/locales/pt-BR.json';
import { useAppStore } from '@/state/store';
import { renderWithTheme, resetStore } from '@/test-utils/renderWithTheme';

beforeEach(async () => {
  resetStore();
  await i18n.changeLanguage('pt-BR');
});

test('first launch shows the simulation notice before the home screen', async () => {
  await renderWithTheme(<IndexRoute />);
  expect(screen.getByText(/app de entretenimento/)).toBeOnTheScreen();
  expect(screen.getByText(/Não use o app para enganar ninguém/)).toBeOnTheScreen();
  expect(screen.queryByTestId('balance-amount')).toBeNull();

  await act(() => fireEvent.press(screen.getByRole('button', { name: 'Entendi, começar' })));

  expect(useAppStore.getState().onboardingDone).toBe(true);
  expect(screen.getByTestId('balance-amount')).toBeOnTheScreen();
});

test('later launches go straight to the home screen', async () => {
  useAppStore.setState({ onboardingDone: true });
  await renderWithTheme(<IndexRoute />);
  expect(screen.getByTestId('balance-amount')).toBeOnTheScreen();
});

describe('languages', () => {
  test.each([
    ['pt', 'pt-BR'],
    ['en', 'en'],
    ['es', 'en'],
    [null, 'en'],
  ])('device language %s uses %s', (code, expected) => {
    expect(languageForDevice(code)).toBe(expected);
  });

  test('English has every key Portuguese has', () => {
    const keys = (tree: object, prefix = ''): string[] =>
      Object.entries(tree).flatMap(([key, value]) =>
        typeof value === 'object' ? keys(value, `${prefix}${key}.`) : [`${prefix}${key}`],
      );
    expect(keys(en).sort()).toEqual(keys(ptBR).sort());
  });
});
