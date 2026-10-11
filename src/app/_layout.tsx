import '@/i18n/i18n';

import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { useEffect } from 'react';

import { useAppStore } from '@/state/store';
import { useHydrated } from '@/state/useHydrated';
import { isDarkColor } from '@/theme/contrast';
import { FONT_ASSETS } from '@/theme/fontAssets';
import { findTheme } from '@/theme/registry';
import { ThemeProvider } from '@/theme/ThemeProvider';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts(FONT_ASSETS);
  const hydrated = useHydrated();
  // A font that fails to load falls back to the system font rather than holding the splash forever.
  const ready = (fontsLoaded || fontError !== null) && hydrated;
  const themeId = useAppStore((state) => state.themeId);
  const theme = findTheme(themeId);

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(theme.cores.fundo);
  }, [theme.cores.fundo]);

  useEffect(() => {
    if (ready) {
      SplashScreen.hideAsync();
    }
  }, [ready]);

  if (!ready) {
    return null;
  }

  return (
    <ThemeProvider theme={theme}>
      <StatusBar style={isDarkColor(theme.cores.fundo) ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }} />
    </ThemeProvider>
  );
}
