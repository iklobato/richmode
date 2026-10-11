import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { fontFace, useTheme } from '@/theme/ThemeProvider';

import { IconButton } from './IconButton';

type SheetProps = {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
};

const BACKDROP_COLOR = 'rgba(0, 0, 0, 0.5)';
const MAX_SHEET_WIDTH = 560;

/** Bottom sheet: a modal panel that slides up over the screen and closes on backdrop tap. */
export function Sheet({ visible, title, onClose, children }: SheetProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const space = theme.forma.espaco;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1, justifyContent: 'flex-end' }}
      >
        <Pressable
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundColor: BACKDROP_COLOR,
          }}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel={t('common.close')}
        />
        <View
          accessibilityViewIsModal
          style={{
            width: '100%',
            maxWidth: MAX_SHEET_WIDTH,
            maxHeight: '90%',
            alignSelf: 'center',
            backgroundColor: theme.cores.superficie,
            borderTopLeftRadius: theme.forma.raioCartao,
            borderTopRightRadius: theme.forma.raioCartao,
            borderColor: theme.cores.borda,
            borderWidth: 1,
            paddingBottom: insets.bottom + space * 2,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingLeft: space * 3,
              paddingRight: space,
              paddingTop: space,
            }}
          >
            <Text
              accessibilityRole="header"
              style={{
                flex: 1,
                color: theme.cores.texto,
                fontFamily: fontFace(theme, 'corpo', 'strong'),
                fontSize: theme.fontes.tamanhos.titulo,
              }}
            >
              {title}
            </Text>
            <IconButton icon="close" label={t('common.close')} onPress={onClose} />
          </View>
          <ScrollView
            contentContainerStyle={{ paddingHorizontal: space * 3, paddingTop: space }}
            keyboardShouldPersistTaps="handled"
          >
            {children}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
