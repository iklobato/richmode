import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppStore } from '@/state/store';
import { fontFace, useTheme } from '@/theme/ThemeProvider';
import { MIN_TOUCH_SIZE } from '@/ui/a11y';

const MAX_CONTENT_WIDTH = 560;
const POINTS = ['pointFake', 'pointLocal', 'pointHonest'] as const;

/** Shown once, before the home screen, so every user first reads that the app is a simulation. */
export function OnboardingScreen() {
  const theme = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const finishOnboarding = useAppStore((state) => state.finishOnboarding);
  const space = theme.forma.espaco;

  const body = {
    color: theme.cores.texto,
    fontFamily: fontFace(theme, 'corpo', 'regular'),
    fontSize: theme.fontes.tamanhos.corpo,
    lineHeight: theme.fontes.tamanhos.corpo * 1.45,
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.cores.fundo }}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          width: '100%',
          maxWidth: MAX_CONTENT_WIDTH,
          alignSelf: 'center',
          gap: space * 3,
          paddingTop: insets.top + space * 4,
          paddingBottom: space * 3,
          paddingLeft: insets.left + space * 3,
          paddingRight: insets.right + space * 3,
        }}
      >
        <Text
          accessibilityRole="header"
          style={{
            color: theme.cores.destaque,
            fontFamily: fontFace(theme, 'marca', 'strong'),
            fontSize: theme.fontes.tamanhos.saldo * 0.75,
          }}
        >
          {t('onboarding.title')}
        </Text>
        <Text style={body}>{t('onboarding.intro')}</Text>
        <View style={{ gap: space * 2 }}>
          {POINTS.map((point) => (
            <View
              key={point}
              style={{
                padding: space * 2,
                borderRadius: theme.forma.raioLinha,
                borderColor: theme.cores.borda,
                borderWidth: 1,
                backgroundColor: theme.cores.superficie,
              }}
            >
              <Text style={body}>{t(`onboarding.${point}`)}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
      <View
        style={{
          width: '100%',
          maxWidth: MAX_CONTENT_WIDTH,
          alignSelf: 'center',
          paddingHorizontal: space * 3,
          paddingBottom: insets.bottom + space * 2,
        }}
      >
        <Pressable
          onPress={finishOnboarding}
          accessibilityRole="button"
          style={({ pressed }) => ({
            minHeight: MIN_TOUCH_SIZE + space,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: theme.forma.raioBotao,
            backgroundColor: theme.cores.destaque,
            opacity: pressed ? 0.8 : 1,
          })}
        >
          <Text
            style={{
              color: theme.cores.fundo,
              fontFamily: fontFace(theme, 'corpo', 'strong'),
              fontSize: theme.fontes.tamanhos.corpo,
            }}
          >
            {t('onboarding.start')}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
