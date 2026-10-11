import '@/i18n/i18n';

import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { useEffect } from 'react';

import { useAppStore } from '@/state/store';
import { useHydrated } from '@/state/useHydrated';
import { isDarkColor } from '@/theme/contrast';
import { FONT_ASSETS } from '@/theme/fontAssets';
import { findTheme } from '@/theme/registry';
import { ThemeProvider } from '@/theme/ThemeProvider';

export default function RootLayout() {
  const [fontsLoaded] = useFonts(FONT_ASSETS);
  const hydrated = useHydrated();
  const themeId = useAppStore((state) => state.themeId);
  const theme = findTheme(themeId);

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(theme.cores.fundo);
  }, [theme.cores.fundo]);

  if (!fontsLoaded || !hydrated) {
    return null;
  }

  return (
    <ThemeProvider theme={theme}>
      <StatusBar style={isDarkColor(theme.cores.fundo) ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }} />
    </ThemeProvider>
  );
}
