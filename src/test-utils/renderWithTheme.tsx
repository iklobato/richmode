import '@/i18n/i18n';

import { render } from '@testing-library/react-native';
import type { ReactElement } from 'react';

import { useAppStore } from '@/state/store';
import { findTheme } from '@/theme/registry';
import { ThemeProvider } from '@/theme/ThemeProvider';

/** Renders under the store's active theme, the way the root layout does. */
function ActiveTheme({ children }: { children: ReactElement }) {
  const themeId = useAppStore((state) => state.themeId);
  return <ThemeProvider theme={findTheme(themeId)}>{children}</ThemeProvider>;
}

export function renderWithTheme(ui: ReactElement) {
  return render(<ActiveTheme>{ui}</ActiveTheme>);
}

const initialState = useAppStore.getState();

/** Restores the store between tests so state never leaks from one test to the next. */
export function resetStore() {
  useAppStore.setState(initialState, true);
}
