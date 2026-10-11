import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { numberLocale } from '@/i18n/i18n';
import { formatMoney, HIDDEN_AMOUNT } from '@/money/money';
import { useAppStore } from '@/state/store';
import { fontFace, useTheme } from '@/theme/ThemeProvider';
import { DISPLAY_TEXT_MAX_SCALE } from '@/ui/a11y';
import { FictionalBadge } from '@/ui/FictionalBadge';
import { IconButton } from '@/ui/IconButton';

export function Balance({ variant }: { variant: 'grande' | 'compacto' }) {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const balanceCents = useAppStore((state) => state.balanceCents);
  const currency = useAppStore((state) => state.currency);
  const hidden = useAppStore((state) => state.balanceHidden);
  const toggleHidden = useAppStore((state) => state.toggleBalanceHidden);

  const amount = formatMoney(balanceCents, currency, numberLocale(i18n.language));
  const amountSize =
    variant === 'grande' ? theme.fontes.tamanhos.saldo : theme.fontes.tamanhos.saldo * 0.75;

  return (
    <View
      style={{
        gap: theme.forma.espaco,
        ...(variant === 'compacto' && {
          backgroundColor: theme.cores.superficie,
          borderColor: theme.cores.borda,
          borderWidth: 1,
          borderRadius: theme.forma.raioCartao,
          padding: theme.forma.espaco * 2,
        }),
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: theme.forma.espaco,
        }}
      >
        <Text
          style={{
            color: theme.cores.textoSuave,
            fontFamily: fontFace(theme, 'corpo', 'regular'),
            fontSize: theme.fontes.tamanhos.corpo,
          }}
        >
          {t('home.balanceTitle')}
        </Text>
        <FictionalBadge />
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.forma.espaco }}>
        <Text
          testID="balance-amount"
          maxFontSizeMultiplier={DISPLAY_TEXT_MAX_SCALE}
          accessibilityLabel={hidden ? t('home.hiddenAmount') : amount}
          adjustsFontSizeToFit
          minimumFontScale={0.5}
          numberOfLines={1}
          style={{
            flexShrink: 1,
            color: theme.cores.texto,
            fontFamily: fontFace(theme, 'corpo', 'strong'),
            fontSize: amountSize,
          }}
        >
          {hidden ? HIDDEN_AMOUNT : amount}
        </Text>
        <IconButton
          icon={hidden ? 'eye' : 'eyeOff'}
          label={hidden ? t('home.showBalance') : t('home.hideBalance')}
          onPress={toggleHidden}
          color={theme.cores.textoSuave}
        />
      </View>
    </View>
  );
}
