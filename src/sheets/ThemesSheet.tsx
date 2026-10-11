import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

import { useAppStore } from '@/state/store';
import { THEMES } from '@/theme/registry';
import type { Theme } from '@/theme/schema';
import { fontFace, useTheme } from '@/theme/ThemeProvider';
import { MIN_TOUCH_SIZE } from '@/ui/a11y';
import { Icon } from '@/ui/Icon';
import { Sheet } from '@/ui/Sheet';

type SheetVisibility = { visible: boolean; onClose: () => void };

/** Picking a theme applies it at once; the sheet stays open so the change is visible. */
export function ThemesSheet({ visible, onClose }: SheetVisibility) {
  const { t } = useTranslation();
  const activeTheme = useTheme();
  const selectTheme = useAppStore((state) => state.selectTheme);

  return (
    <Sheet visible={visible} title={t('themes.title')} onClose={onClose}>
      <View
        accessibilityRole="radiogroup"
        style={{ gap: activeTheme.forma.espaco, paddingBottom: activeTheme.forma.espaco * 2 }}
      >
        {THEMES.map((option) => (
          <ThemeOption
            key={option.id}
            option={option}
            selected={option.id === activeTheme.id}
            onPress={() => selectTheme(option.id)}
          />
        ))}
      </View>
    </Sheet>
  );
}

type ThemeOptionProps = { option: Theme; selected: boolean; onPress: () => void };

function ThemeOption({ option, selected, onPress }: ThemeOptionProps) {
  const theme = useTheme();
  const space = theme.forma.espaco;
  const swatchSize = MIN_TOUCH_SIZE;
  const name = `${option.marca.nome} ${option.marca.subtitulo}`;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={name}
      style={({ pressed }) => ({
        minHeight: MIN_TOUCH_SIZE + space * 2,
        flexDirection: 'row',
        alignItems: 'center',
        gap: space * 2,
        padding: space * 1.5,
        borderRadius: theme.forma.raioLinha,
        borderWidth: selected ? 2 : 1,
        borderColor: selected ? theme.cores.destaque : theme.cores.borda,
        backgroundColor: theme.cores.fundo,
        opacity: pressed ? 0.7 : 1,
      })}
    >
      {/* Preview of the option's own colors: background with its accent stripe. */}
      <View
        style={{
          width: swatchSize,
          height: swatchSize,
          borderRadius: option.forma.raioLinha,
          backgroundColor: option.cores.fundo,
          borderColor: option.cores.borda,
          borderWidth: 1,
          justifyContent: 'flex-end',
          overflow: 'hidden',
        }}
      >
        <View style={{ height: swatchSize / 3, backgroundColor: option.cores.destaque }} />
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            color: theme.cores.texto,
            fontFamily: fontFace(option, 'marca', 'strong'),
            fontSize: theme.fontes.tamanhos.titulo,
            letterSpacing: 1,
          }}
        >
          {option.marca.nome}
        </Text>
        <Text
          style={{
            color: theme.cores.textoSuave,
            fontFamily: fontFace(theme, 'corpo', 'regular'),
            fontSize: theme.fontes.tamanhos.legenda,
          }}
        >
          {option.marca.subtitulo} · {option.marca.cartao}
        </Text>
      </View>
      {selected && (
        <Icon name="check" color={theme.cores.destaque} size={theme.fontes.tamanhos.titulo + 5} />
      )}
    </Pressable>
  );
}
