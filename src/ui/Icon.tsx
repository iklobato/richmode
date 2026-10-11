import { View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

/** One stroke icon set, drawn on a 24×24 grid with round caps and joins. */
const ICONS = {
  eye: (
    <>
      <Path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
      <Circle cx={12} cy={12} r={3} />
    </>
  ),
  eyeOff: (
    <>
      <Path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
      <Path d="M4 4l16 16" />
    </>
  ),
  pix: <Path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" />,
  transfer: <Path d="M4 7h16M16 3l4 4-4 4M20 17H4M8 13l-4 4 4 4" />,
  pay: (
    <>
      <Rect x={3} y={6} width={18} height={13} rx={2} />
      <Path d="M3 10h18M15 15h3" />
    </>
  ),
  deposit: <Path d="M12 3v12M7 10l5 5 5-5M4 20h16" />,
  inicio: <Path d="M3 11l9-8 9 8M5 9.5V21h14V9.5" />,
  cartoes: (
    <>
      <Rect x={2} y={5} width={20} height={14} rx={2} />
      <Path d="M2 10h20" />
    </>
  ),
  investir: <Path d="M3 17l6-6 4 4 8-8M14 7h7v7" />,
  perfil: (
    <>
      <Circle cx={12} cy={8} r={4} />
      <Path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
    </>
  ),
  edit: <Path d="M4 20h4L19 9l-4-4L4 16v4zM13 7l4 4" />,
  themes: <Path d="M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5" />,
  close: <Path d="M6 6l12 12M18 6 6 18" />,
  chevronRight: <Path d="M9 6l6 6-6 6" />,
  check: <Path d="M5 12l5 5 9-10" />,
} as const;

export type IconName = keyof typeof ICONS;

type IconProps = { name: IconName; color: string; size: number };

/** Decorative: the pressable that wraps an icon carries its accessibility label. */
export function Icon({ name, color, size }: IconProps) {
  return (
    <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <Svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {ICONS[name]}
      </Svg>
    </View>
  );
}
