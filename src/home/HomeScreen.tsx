import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { LayoutBlock } from '@/theme/schema';
import { fontFace, useTheme } from '@/theme/ThemeProvider';
import { EditValuesSheet } from '@/sheets/EditValuesSheet';
import { ThemesSheet } from '@/sheets/ThemesSheet';
import { Sheet } from '@/ui/Sheet';

import { Balance } from './blocks/Balance';
import { CardBlock } from './blocks/CardBlock';
import { Header } from './blocks/Header';
import { Investments } from './blocks/Investments';
import { Shortcuts } from './blocks/Shortcuts';
import { TabBar } from './TabBar';

/** Content width cap so the screen stays phone-shaped on tablets. */
const MAX_CONTENT_WIDTH = 560;

type OpenSheet = 'simulation' | 'edit' | 'themes' | null;

type BlockActions = {
  simulate: () => void;
  openEdit: () => void;
  openThemes: () => void;
};

function renderBlock(block: LayoutBlock, actions: BlockActions) {
  switch (block.bloco) {
    case 'cabecalho':
      return (
        <Header variant={block.variante} onEdit={actions.openEdit} onThemes={actions.openThemes} />
      );
    case 'saldo':
      return <Balance variant={block.variante} />;
    case 'atalhos':
      return (
        <Shortcuts variant={block.variante} columns={block.colunas} onPress={actions.simulate} />
      );
    case 'cartao':
      return <CardBlock variant={block.variante} onPress={actions.simulate} />;
    case 'investimentos':
      return <Investments variant={block.variante} onPress={actions.simulate} />;
  }
}

export function HomeScreen() {
  const theme = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [openSheet, setOpenSheet] = useState<OpenSheet>(null);
  const space = theme.forma.espaco;
  const closeSheet = () => setOpenSheet(null);

  const actions: BlockActions = {
    simulate: () => setOpenSheet('simulation'),
    openEdit: () => setOpenSheet('edit'),
    openThemes: () => setOpenSheet('themes'),
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.cores.fundo }}>
      <ScrollView
        contentContainerStyle={{
          width: '100%',
          maxWidth: MAX_CONTENT_WIDTH,
          alignSelf: 'center',
          gap: space * 3,
          paddingTop: insets.top + space * 2,
          paddingBottom: space * 4,
          paddingLeft: insets.left + space * 3,
          paddingRight: insets.right + space * 3,
        }}
      >
        {theme.layout.map((block) => (
          <View key={block.bloco}>{renderBlock(block, actions)}</View>
        ))}
      </ScrollView>
      <TabBar onSimulatedTab={actions.simulate} />

      <Sheet
        visible={openSheet === 'simulation'}
        title={t('simulation.title')}
        onClose={closeSheet}
      >
        <Text
          style={{
            color: theme.cores.texto,
            fontFamily: fontFace(theme, 'corpo', 'regular'),
            fontSize: theme.fontes.tamanhos.corpo,
            paddingBottom: space * 2,
          }}
        >
          {t('simulation.message')}
        </Text>
      </Sheet>
      <EditValuesSheet visible={openSheet === 'edit'} onClose={closeSheet} />
      <ThemesSheet visible={openSheet === 'themes'} onClose={closeSheet} />
    </View>
  );
}
