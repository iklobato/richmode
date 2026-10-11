import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { useAppStore } from '@/state/store';
import { fontFace, useTheme } from '@/theme/ThemeProvider';
import { IconButton } from '@/ui/IconButton';

type HeaderProps = {
  variant: 'logo-esquerda' | 'logo-centro';
  onEdit: () => void;
  onThemes: () => void;
};

export function Header({ variant, onEdit, onThemes }: HeaderProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const displayName = useAppStore((state) => state.displayName);
  const centered = variant === 'logo-centro';

  const brand = (
    <View style={{ flex: 1, alignItems: centered ? 'center' : 'flex-start' }}>
      <Text
        accessibilityRole="header"
        style={{
          color: theme.cores.destaque,
          fontFamily: fontFace(theme, 'marca', 'strong'),
          fontSize: theme.fontes.tamanhos.titulo + 5,
          letterSpacing: 2,
        }}
      >
        {theme.marca.nome}
      </Text>
      <Text
        style={{
          color: theme.cores.textoSuave,
          fontFamily: fontFace(theme, 'corpo', 'regular'),
          fontSize: theme.fontes.tamanhos.legenda,
          letterSpacing: 1,
        }}
      >
        {theme.marca.subtitulo}
      </Text>
    </View>
  );

  return (
    <View style={{ gap: theme.forma.espaco }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {centered && <IconButton icon="edit" label={t('home.editValues')} onPress={onEdit} />}
        {brand}
        {!centered && <IconButton icon="edit" label={t('home.editValues')} onPress={onEdit} />}
        <IconButton icon="themes" label={t('home.themes')} onPress={onThemes} />
      </View>
      {displayName !== '' && (
        <Text
          style={{
            color: theme.cores.texto,
            fontFamily: fontFace(theme, 'corpo', 'regular'),
            fontSize: theme.fontes.tamanhos.corpo,
            textAlign: centered ? 'center' : 'left',
          }}
        >
          {t('home.greeting', { name: displayName })}
        </Text>
      )}
    </View>
  );
}
