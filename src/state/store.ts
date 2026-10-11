import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { isValidAmount, type AmountInCents, type Currency } from '@/money/money';
import { DEFAULT_THEME_ID } from '@/theme/registry';

export const MAX_DISPLAY_NAME_LENGTH = 30;

export type DisplayValues = {
  displayName: string;
  balanceCents: AmountInCents;
  investedCents: AmountInCents;
  currency: Currency;
};

type AppState = DisplayValues & {
  themeId: string;
  balanceHidden: boolean;
  onboardingDone: boolean;
  saveDisplayValues: (values: DisplayValues) => void;
  selectTheme: (themeId: string) => void;
  toggleBalanceHidden: () => void;
  finishOnboarding: () => void;
};

export const INITIAL_DISPLAY_VALUES: DisplayValues = {
  displayName: '',
  balanceCents: 2_500_000_00,
  investedCents: 1_200_000_00,
  currency: 'BRL',
};

export function isValidDisplayValues(values: DisplayValues): boolean {
  return (
    values.displayName.length <= MAX_DISPLAY_NAME_LENGTH &&
    isValidAmount(values.balanceCents) &&
    isValidAmount(values.investedCents)
  );
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      ...INITIAL_DISPLAY_VALUES,
      themeId: DEFAULT_THEME_ID,
      balanceHidden: false,
      onboardingDone: false,
      saveDisplayValues: (values) => {
        if (!isValidDisplayValues(values)) {
          throw new RangeError('display values out of range');
        }
        set({ ...values, displayName: values.displayName.trim() });
      },
      selectTheme: (themeId) => set({ themeId }),
      toggleBalanceHidden: () => set((state) => ({ balanceHidden: !state.balanceHidden })),
      finishOnboarding: () => set({ onboardingDone: true }),
    }),
    {
      name: 'richmode-state',
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
