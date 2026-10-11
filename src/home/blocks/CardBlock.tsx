import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

import { fontFace, useTheme } from '@/theme/ThemeProvider';
import { MIN_TOUCH_SIZE } from '@/ui/a11y';
import { Icon } from '@/ui/Icon';

/** Card art proportions (ISO/IEC 7810 ID-1). */
const CARD_ASPECT_RATIO = 85.6 / 53.98;
/** Keeps the card wallet-sized on tablets instead of stretching to the content width. */
const MAX_CARD_WIDTH = 420;

type CardBlockProps = { variant: 'visual' | 'minimo'; onPress: () => void };

export function CardBlock({ variant, onPress }: CardBlockProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const space = theme.forma.espaco;
  const cardName = t('home.card', { name: theme.marca.cartao });

  if (variant === 'minimo') {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={cardName}
        style={({ pressed }) => ({
          minHeight: MIN_TOUCH_SIZE,
          flexDirection: 'row',
          alignItems: 'center',
          gap: space * 2,
          padding: space * 2,
          borderRadius: theme.forma.raioLinha,
          borderColor: theme.cores.borda,
          borderWidth: 1,
          backgroundColor: theme.cores.superficie,
          opacity: pressed ? 0.6 : 1,
        })}
      >
        <Icon name="cartoes" color={theme.cores.destaque} size={theme.fontes.tamanhos.titulo + 5} />
        <Text
          style={{
            flex: 1,
            color: theme.cores.texto,
            fontFamily: fontFace(theme, 'corpo', 'regular'),
            fontSize: theme.fontes.tamanhos.corpo,
          }}
        >
          {cardName}
        </Text>
        <Icon
          name="chevronRight"
          color={theme.cores.textoSuave}
          size={theme.fontes.tamanhos.titulo}
        />
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={cardName}
      style={({ pressed }) => ({
        width: '100%',
        maxWidth: MAX_CARD_WIDTH,
        alignSelf: 'center',
        aspectRatio: CARD_ASPECT_RATIO,
        minHeight: MIN_TOUCH_SIZE,
        justifyContent: 'space-between',
        padding: space * 3,
        borderRadius: theme.forma.raioCartao,
        borderColor: theme.cores.destaque,
        borderWidth: 1,
        backgroundColor: theme.cores.superficie,
        opacity: pressed ? 0.8 : 1,
      })}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text
          style={{
            color: theme.cores.destaque,
            fontFamily: fontFace(theme, 'marca', 'strong'),
            fontSize: theme.fontes.tamanhos.titulo,
            letterSpacing: 2,
          }}
        >
          {theme.marca.nome}
        </Text>
        <Icon name="cartoes" color={theme.cores.destaque} size={theme.fontes.tamanhos.titulo + 5} />
      </View>
      <View style={{ gap: space / 2 }}>
        <Text
          style={{
            color: theme.cores.texto,
            fontFamily: fontFace(theme, 'marca', 'regular'),
            fontSize: theme.fontes.tamanhos.titulo,
          }}
        >
          {theme.marca.cartao}
        </Text>
        <Text
          style={{
            color: theme.cores.textoSuave,
            fontFamily: fontFace(theme, 'corpo', 'regular'),
            fontSize: theme.fontes.tamanhos.legenda,
          }}
        >
          {t('home.cardNumberHidden')}
        </Text>
      </View>
    </Pressable>
  );
}
