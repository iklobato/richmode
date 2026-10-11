import { useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, TextInput, View } from 'react-native';

import { numberLocale } from '@/i18n/i18n';
import {
  CURRENCIES,
  formatMoney,
  parseTypedAmount,
  type AmountInCents,
  type Currency,
} from '@/money/money';
import { MAX_DISPLAY_NAME_LENGTH, useAppStore, type DisplayValues } from '@/state/store';
import type { Theme } from '@/theme/schema';
import { fontFace, useTheme } from '@/theme/ThemeProvider';
import { MIN_TOUCH_SIZE } from '@/ui/a11y';
import { Sheet } from '@/ui/Sheet';

type SheetVisibility = { visible: boolean; onClose: () => void };

/** The sheet keeps a draft; the store only changes on Save. */
export function EditValuesSheet({ visible, onClose }: SheetVisibility) {
  const { t } = useTranslation();
  return (
    <Sheet visible={visible} title={t('edit.title')} onClose={onClose}>
      {/* Mounted only while open, so each opening starts from the saved values. */}
      {visible && <EditValuesForm onSaved={onClose} />}
    </Sheet>
  );
}

function EditValuesForm({ onSaved }: { onSaved: () => void }) {
  const theme = useTheme();
  const { t } = useTranslation();
  const saveDisplayValues = useAppStore((state) => state.saveDisplayValues);
  const [draft, setDraft] = useState<DisplayValues>(() => {
    const { displayName, balanceCents, investedCents, currency } = useAppStore.getState();
    return { displayName, balanceCents, investedCents, currency };
  });
  const space = theme.forma.espaco;

  const update = (change: Partial<DisplayValues>) =>
    setDraft((current) => ({ ...current, ...change }));

  const save = () => {
    saveDisplayValues(draft);
    onSaved();
  };

  return (
    <View style={{ gap: space * 3, paddingBottom: space * 2 }}>
      <Field label={t('edit.name')}>
        {(label) => (
          <TextInput
            accessibilityLabel={label}
            value={draft.displayName}
            onChangeText={(displayName) => update({ displayName })}
            placeholder={t('edit.namePlaceholder')}
            placeholderTextColor={theme.cores.textoSuave}
            maxLength={MAX_DISPLAY_NAME_LENGTH}
            autoCapitalize="words"
            autoCorrect={false}
            style={inputStyle(theme)}
          />
        )}
      </Field>
      <MoneyField
        label={t('edit.balance')}
        cents={draft.balanceCents}
        currency={draft.currency}
        onChange={(balanceCents) => update({ balanceCents })}
      />
      <MoneyField
        label={t('edit.invested')}
        cents={draft.investedCents}
        currency={draft.currency}
        onChange={(investedCents) => update({ investedCents })}
      />
      <Field label={t('edit.currency')}>
        {(label) => (
          <View
            accessibilityRole="radiogroup"
            accessibilityLabel={label}
            style={{ flexDirection: 'row', gap: space }}
          >
            {CURRENCIES.map((currency) => (
              <CurrencyOption
                key={currency}
                currency={currency}
                selected={draft.currency === currency}
                onPress={() => update({ currency })}
              />
            ))}
          </View>
        )}
      </Field>
      <Pressable
        onPress={save}
        accessibilityRole="button"
        style={({ pressed }) => ({
          minHeight: MIN_TOUCH_SIZE + space,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: theme.forma.raioBotao,
          backgroundColor: theme.cores.destaque,
          opacity: pressed ? 0.8 : 1,
        })}
      >
        <Text
          style={{
            color: theme.cores.fundo,
            fontFamily: fontFace(theme, 'corpo', 'strong'),
            fontSize: theme.fontes.tamanhos.corpo,
          }}
        >
          {t('common.save')}
        </Text>
      </Pressable>
    </View>
  );
}

function inputStyle(theme: Theme) {
  return {
    minHeight: MIN_TOUCH_SIZE + theme.forma.espaco,
    paddingHorizontal: theme.forma.espaco * 2,
    borderRadius: theme.forma.raioLinha,
    borderColor: theme.cores.borda,
    borderWidth: 1,
    backgroundColor: theme.cores.fundo,
    color: theme.cores.texto,
    fontFamily: fontFace(theme, 'corpo', 'regular'),
    fontSize: theme.fontes.tamanhos.corpo,
  };
}

function Field({ label, children }: { label: string; children: (label: string) => ReactNode }) {
  const theme = useTheme();
  return (
    <View style={{ gap: theme.forma.espaco }}>
      <Text
        style={{
          color: theme.cores.textoSuave,
          fontFamily: fontFace(theme, 'corpo', 'regular'),
          fontSize: theme.fontes.tamanhos.legenda,
        }}
      >
        {label}
      </Text>
      {children(label)}
    </View>
  );
}

type MoneyFieldProps = {
  label: string;
  cents: AmountInCents;
  currency: Currency;
  onChange: (cents: AmountInCents) => void;
};

/** Cash-register entry: each digit typed shifts in from the right, so "1234" reads 12,34. */
function MoneyField({ label, cents, currency, onChange }: MoneyFieldProps) {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const [overLimit, setOverLimit] = useState(false);

  const handleChange = (typed: string) => {
    const parsed = parseTypedAmount(typed);
    setOverLimit(parsed === null);
    if (parsed !== null) {
      onChange(parsed);
    }
  };

  return (
    <Field label={label}>
      {(fieldLabel) => (
        <>
          <TextInput
            accessibilityLabel={fieldLabel}
            accessibilityHint={t('edit.maxHint')}
            value={formatMoney(cents, currency, numberLocale(i18n.language))}
            onChangeText={handleChange}
            keyboardType="number-pad"
            style={inputStyle(theme)}
          />
          {overLimit && (
            <Text
              accessibilityLiveRegion="polite"
              style={{
                color: theme.cores.destaque,
                fontFamily: fontFace(theme, 'corpo', 'regular'),
                fontSize: theme.fontes.tamanhos.legenda,
              }}
            >
              {t('edit.maxHint')}
            </Text>
          )}
        </>
      )}
    </Field>
  );
}

type CurrencyOptionProps = { currency: Currency; selected: boolean; onPress: () => void };

function CurrencyOption({ currency, selected, onPress }: CurrencyOptionProps) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={currency}
      style={({ pressed }) => ({
        flex: 1,
        minHeight: MIN_TOUCH_SIZE,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: theme.forma.raioBotao,
        borderWidth: 1,
        borderColor: selected ? theme.cores.destaque : theme.cores.borda,
        backgroundColor: selected ? theme.cores.destaque : theme.cores.fundo,
        opacity: pressed ? 0.8 : 1,
      })}
    >
      <Text
        style={{
          color: selected ? theme.cores.fundo : theme.cores.texto,
          fontFamily: fontFace(theme, 'corpo', 'strong'),
          fontSize: theme.fontes.tamanhos.corpo,
        }}
      >
        {currency}
      </Text>
    </Pressable>
  );
}
