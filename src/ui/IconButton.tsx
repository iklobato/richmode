import { Pressable } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';

import { MIN_TOUCH_SIZE } from './a11y';
import { Icon, type IconName } from './Icon';

type IconButtonProps = {
  icon: IconName;
  /** Required: an icon-only button is silent to screen readers without it. */
  label: string;
  onPress: () => void;
  color?: string;
};

export function IconButton({ icon, label, onPress, color }: IconButtonProps) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={theme.forma.espaco / 2}
      style={({ pressed }) => ({
        minWidth: MIN_TOUCH_SIZE,
        minHeight: MIN_TOUCH_SIZE,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: theme.forma.raioBotao,
        opacity: pressed ? 0.6 : 1,
      })}
    >
      <Icon
        name={icon}
        color={color ?? theme.cores.texto}
        size={theme.fontes.tamanhos.titulo + 5}
      />
    </Pressable>
  );
}
