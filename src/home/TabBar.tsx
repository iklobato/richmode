import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { Theme } from '@/theme/schema';
import { fontFace, useTheme } from '@/theme/ThemeProvider';
import { MIN_TOUCH_SIZE } from '@/ui/a11y';
import { Icon } from '@/ui/Icon';

type TabItem = Theme['navegacao']['itens'][number];

/** Only "inicio" has a screen in v1; every other tab opens the simulation notice. */
export function TabBar({ onSimulatedTab }: { onSimulatedTab: () => void }) {
  const theme = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const space = theme.forma.espaco;

  return (
    <View
      accessibilityRole="tablist"
      style={{
        flexDirection: 'row',
        borderTopColor: theme.cores.divisor,
        borderTopWidth: 1,
        backgroundColor: theme.cores.fundo,
        paddingBottom: insets.bottom,
        paddingHorizontal: space,
      }}
    >
      {theme.navegacao.itens.map((item: TabItem) => {
        const selected = item === 'inicio';
        const color = selected ? theme.cores.destaque : theme.cores.textoSuave;
        return (
          <Pressable
            key={item}
            onPress={selected ? undefined : onSimulatedTab}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            accessibilityLabel={t(`tabs.${item}`)}
            style={({ pressed }) => ({
              flex: 1,
              minHeight: MIN_TOUCH_SIZE + space,
              alignItems: 'center',
              justifyContent: 'center',
              gap: space / 2,
              paddingVertical: space,
              opacity: pressed ? 0.6 : 1,
            })}
          >
            <Icon name={item} color={color} size={theme.fontes.tamanhos.titulo + 5} />
            <Text
              numberOfLines={1}
              style={{
                color,
                fontFamily: fontFace(theme, 'corpo', selected ? 'strong' : 'regular'),
                fontSize: theme.fontes.tamanhos.legenda,
              }}
            >
              {t(`tabs.${item}`)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
