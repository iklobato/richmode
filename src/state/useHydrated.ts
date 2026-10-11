import { useSyncExternalStore } from 'react';

import { useAppStore } from './store';

const subscribe = (onChange: () => void) => useAppStore.persist.onFinishHydration(onChange);
const hasHydrated = () => useAppStore.persist.hasHydrated();

/** True once saved state has been read from storage, so the first frame shows the user's values. */
export function useHydrated(): boolean {
  return useSyncExternalStore(subscribe, hasHydrated);
}
