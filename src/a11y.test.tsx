import { act, fireEvent, screen, within } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';

import IndexRoute from '@/app/index';
import { HomeScreen } from '@/home/HomeScreen';
import i18n from '@/i18n/i18n';
import { useAppStore } from '@/state/store';
import { renderWithTheme, resetStore } from '@/test-utils/renderWithTheme';
import { contrastRatio, MIN_TEXT_CONTRAST } from '@/theme/contrast';
import { THEMES } from '@/theme/registry';
import { MIN_TOUCH_SIZE } from '@/ui/a11y';

type HostElement = ReturnType<typeof screen.getByRole>;

const INTERACTIVE_ROLES = ['button', 'tab', 'radio'] as const;

/** What a screen reader announces: the label, or else the text inside the control. */
function accessibleName(element: HostElement): string {
  const label: unknown = element.props.accessibilityLabel;
  if (typeof label === 'string' && label.trim() !== '') {
    return label;
  }
  return within(element)
    .queryAllByText(/\S/)
    .map((text) => [text.props.children].flat().join(''))
    .join(' ')
    .trim();
}

function expectAccessibleControls() {
  const controls = INTERACTIVE_ROLES.flatMap((role) => screen.queryAllByRole(role));
  expect(controls.length).toBeGreaterThan(0);
  for (const control of controls) {
    const name = accessibleName(control);
    expect(name).toMatch(/\S/);

    const style = StyleSheet.flatten(control.props.style) ?? {};
    // The full-screen backdrop behind a sheet is a tap-anywhere area, not a sized control.
    if (style.position === 'absolute') {
      continue;
    }
    const height = Math.max(Number(style.minHeight ?? 0), Number(style.height ?? 0));
    expect({ name, tallEnough: height >= MIN_TOUCH_SIZE }).toEqual({ name, tallEnough: true });
  }
}

beforeEach(async () => {
  resetStore();
  await i18n.changeLanguage('pt-BR');
});

describe.each(THEMES.map((theme) => [theme.id]))('theme %s', (themeId) => {
  beforeEach(() => {
    useAppStore.setState({ themeId, onboardingDone: true });
  });

  test('every control on the home screen has a name and a 44pt touch target', async () => {
    await renderWithTheme(<HomeScreen />);
    expectAccessibleControls();
  });

  test('every control in the edit and themes sheets has a name and a 44pt touch target', async () => {
    await renderWithTheme(<HomeScreen />);
    await act(() => fireEvent.press(screen.getByRole('button', { name: 'Editar valores' })));
    expectAccessibleControls();
    await act(() => fireEvent.press(screen.getAllByRole('button', { name: 'Fechar' }).at(-1)!));
    await act(() => fireEvent.press(screen.getByRole('button', { name: 'Temas' })));
    expectAccessibleControls();
  });
});

test('onboarding button has a name and a 44pt touch target', async () => {
  await renderWithTheme(<IndexRoute />);
  expectAccessibleControls();
});

test('the fixed badge colors meet text contrast', () => {
  expect(contrastRatio('#1A1400', '#FFD84D')).toBeGreaterThanOrEqual(MIN_TEXT_CONTRAST);
});

test('a hidden balance is announced as hidden, not read out', async () => {
  useAppStore.setState({ onboardingDone: true, balanceHidden: true });
  await renderWithTheme(<HomeScreen />);
  expect(screen.getByTestId('balance-amount').props.accessibilityLabel).toBe('Valor oculto');
});
