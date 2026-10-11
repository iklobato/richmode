import { getLocales } from 'expo-localization';
import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import ptBR from './locales/pt-BR.json';

export const resources = {
  'pt-BR': { translation: ptBR },
  en: { translation: en },
} as const;

export type AppLanguage = keyof typeof resources;

/** Portuguese devices get pt-BR (the default market); every other language gets English. */
export function languageForDevice(languageCode: string | null | undefined): AppLanguage {
  return languageCode === 'pt' ? 'pt-BR' : 'en';
}

/** Locale used by Intl for money, matching the app language rather than the device region. */
export function numberLocale(language: string): string {
  return language === 'pt-BR' ? 'pt-BR' : 'en-US';
}

const i18n = createInstance();

i18n.use(initReactI18next).init({
  resources,
  lng: languageForDevice(getLocales()[0]?.languageCode),
  fallbackLng: 'pt-BR',
  interpolation: { escapeValue: false },
});

export default i18n;
