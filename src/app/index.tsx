import { HomeScreen } from '@/home/HomeScreen';
import { OnboardingScreen } from '@/onboarding/OnboardingScreen';
import { useAppStore } from '@/state/store';

export default function IndexRoute() {
  const onboardingDone = useAppStore((state) => state.onboardingDone);
  return onboardingDone ? <HomeScreen /> : <OnboardingScreen />;
}
