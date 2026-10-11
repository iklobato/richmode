import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

/**
 * Fixed rule: this label sits next to every balance, in every theme, and cannot be turned off.
 * Its text and colors live here, not in themes or translation files, so no theme or setting
 * can hide, restyle or blank it.
 */
const BADGE_TEXT: Record<string, string> = {
  'pt-BR': 'Saldo fictício',
  en: 'Fictional balance',
};

export const BADGE_TEXT_DEFAULT = 'Saldo fictício';

export function FictionalBadge() {
  const { i18n } = useTranslation();
  return (
    <View style={styles.badge} testID="fictional-badge">
      <Text style={styles.text}>{BADGE_TEXT[i18n.language] ?? BADGE_TEXT_DEFAULT}</Text>
    </View>
  );
}

// Dark text on bright yellow: 14:1 contrast, readable on any theme background.
const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFD84D',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  text: {
    color: '#1A1400',
    fontSize: 12,
    fontWeight: '700',
  },
});
