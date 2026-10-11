import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

import { fontFace, useTheme } from '@/theme/ThemeProvider';
import { MIN_TOUCH_SIZE } from '@/ui/a11y';
import { Icon } from '@/ui/Icon';

const SHORTCUTS = ['pix', 'transfer', 'pay', 'deposit'] as const;

type ShortcutsProps = {
  variant: 'circulos' | 'quadrados';
  columns: 2 | 4;
  onPress: () => void;
};

export function Shortcuts({ variant, columns, onPress }: ShortcutsProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const space = theme.forma.espaco;
  const iconBox = MIN_TOUCH_SIZE + space;
  const squares = variant === 'quadrados';

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', rowGap: space * 2 }}>
      {SHORTCUTS.map((shortcut) => (
        <Pressable
          key={shortcut}
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel={t(`shortcuts.${shortcut}`)}
          style={({ pressed }) => ({
            width: `${100 / columns}%`,
            alignItems: 'center',
            flexDirection: squares && columns === 2 ? 'row' : 'column',
            gap: space,
            paddingHorizontal: space / 2,
            opacity: pressed ? 0.6 : 1,
          })}
        >
          <View
            style={{
              width: iconBox,
              height: iconBox,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: squares ? theme.forma.raioLinha : iconBox / 2,
              backgroundColor: theme.cores.superficie,
              borderColor: theme.cores.borda,
              borderWidth: 1,
            }}
          >
            <Icon
              name={shortcut}
              color={theme.cores.destaque}
              size={theme.fontes.tamanhos.titulo + 5}
            />
          </View>
          <Text
            style={{
              flexShrink: 1,
              textAlign: 'center',
              color: theme.cores.texto,
              fontFamily: fontFace(theme, 'corpo', 'regular'),
              fontSize: theme.fontes.tamanhos.legenda,
            }}
          >
            {t(`shortcuts.${shortcut}`)}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
