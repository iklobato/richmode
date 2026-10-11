import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

import { numberLocale } from '@/i18n/i18n';
import { formatMoney, HIDDEN_AMOUNT } from '@/money/money';
import { useAppStore } from '@/state/store';
import { fontFace, useTheme } from '@/theme/ThemeProvider';
import { MIN_TOUCH_SIZE } from '@/ui/a11y';
import { Icon } from '@/ui/Icon';

type InvestmentsProps = { variant: 'linha' | 'cartao'; onPress: () => void };

export function Investments({ variant, onPress }: InvestmentsProps) {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const investedCents = useAppStore((state) => state.investedCents);
  const currency = useAppStore((state) => state.currency);
  const hidden = useAppStore((state) => state.balanceHidden);
  const space = theme.forma.espaco;
  const amount = formatMoney(investedCents, currency, numberLocale(i18n.language));
  const isCard = variant === 'cartao';

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${t('home.investments')}, ${hidden ? t('home.hiddenAmount') : amount}`}
      style={({ pressed }) => ({
        minHeight: MIN_TOUCH_SIZE,
        flexDirection: 'row',
        alignItems: 'center',
        gap: space * 2,
        padding: space * 2,
        borderRadius: isCard ? theme.forma.raioCartao : theme.forma.raioLinha,
        borderColor: theme.cores.borda,
        borderWidth: 1,
        backgroundColor: theme.cores.superficie,
        opacity: pressed ? 0.6 : 1,
      })}
    >
      <Icon name="investir" color={theme.cores.destaque} size={theme.fontes.tamanhos.titulo + 5} />
      <View style={{ flex: 1, gap: space / 2 }}>
        <Text
          style={{
            color: isCard ? theme.cores.textoSuave : theme.cores.texto,
            fontFamily: fontFace(theme, 'corpo', 'regular'),
            fontSize: isCard ? theme.fontes.tamanhos.legenda : theme.fontes.tamanhos.corpo,
          }}
        >
          {isCard ? t('home.investedTotal') : t('home.investments')}
        </Text>
        <Text
          style={{
            color: theme.cores.texto,
            fontFamily: fontFace(theme, 'corpo', 'strong'),
            fontSize: isCard ? theme.fontes.tamanhos.titulo + 5 : theme.fontes.tamanhos.corpo,
          }}
        >
          {hidden ? HIDDEN_AMOUNT : amount}
        </Text>
      </View>
      <Icon
        name="chevronRight"
        color={theme.cores.textoSuave}
        size={theme.fontes.tamanhos.titulo}
      />
    </Pressable>
  );
}
