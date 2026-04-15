import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '@/constants/theme';

const SLEEP_OPTIONS = ['5h', '6h', '7h', '8h', '9h+'];
const MOOD_OPTIONS = ['Energized', 'Good', 'Neutral', 'Tired', 'Exhausted'];
const ENERGY_OPTIONS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

export default function MorningCheckIn() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [sleep, setSleep] = useState('7h');
  const [weight, setWeight] = useState('');
  const [mood, setMood] = useState('Good');
  const [energy, setEnergy] = useState('7');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    router.dismiss();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.dismiss()} hitSlop={12}>
          <MaterialIcons name="close" size={24} color={Colors.TextSecondary} />
        </Pressable>
        <Text style={styles.headerTitle}>MORNING CHECK-IN</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: 100 }]} showsVerticalScrollIndicator={false}>
        <View style={styles.timeBlock}>
          <MaterialIcons name="wb-sunny" size={32} color="#F59E0B" />
          <Text style={styles.timeLabel}>Morning Protocol</Text>
          <Text style={styles.timeDesc}>Log your overnight recovery to calibrate today's performance targets.</Text>
        </View>

        <Section label="SLEEP DURATION">
          <OptionRow options={SLEEP_OPTIONS} selected={sleep} onSelect={setSleep} />
        </Section>

        <Section label="CURRENT WEIGHT (kg)">
          <TextInput
            style={styles.input}
            value={weight}
            onChangeText={setWeight}
            placeholder="e.g. 78.2"
            placeholderTextColor={Colors.TextMuted}
            keyboardType="decimal-pad"
          />
        </Section>

        <Section label="MORNING MOOD">
          <OptionRow options={MOOD_OPTIONS} selected={mood} onSelect={setMood} />
        </Section>

        <Section label="ENERGY LEVEL (1-10)">
          <View style={styles.energyRow}>
            {ENERGY_OPTIONS.map((e) => (
              <Pressable
                key={e}
                style={[styles.energyBtn, energy === e && styles.energyBtnActive]}
                onPress={() => setEnergy(e)}
              >
                <Text style={[styles.energyText, energy === e && styles.energyTextActive]}>{e}</Text>
              </Pressable>
            ))}
          </View>
        </Section>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + Spacing.md }]}>
        <Button label="SUBMIT CHECK-IN" onPress={handleSubmit} loading={saving} />
      </View>
    </View>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>{label}</Text>
      {children}
    </View>
  );
}

function OptionRow({ options, selected, onSelect }: { options: string[]; selected: string; onSelect: (v: string) => void }) {
  return (
    <View style={styles.optionRow}>
      {options.map((opt) => (
        <Pressable
          key={opt}
          style={[styles.option, selected === opt && styles.optionActive]}
          onPress={() => onSelect(opt)}
        >
          <Text style={[styles.optionText, selected === opt && styles.optionTextActive]}>{opt}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.Background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.SurfaceBorder,
  },
  headerTitle: { fontSize: FontSize.lg, color: Colors.TextPrimary, fontWeight: FontWeight.black, letterSpacing: 2 },
  scroll: { paddingHorizontal: Spacing.md, gap: Spacing.lg, paddingTop: Spacing.lg },
  timeBlock: { alignItems: 'center', gap: Spacing.sm, paddingVertical: Spacing.lg },
  timeLabel: { fontSize: FontSize.xxl, color: Colors.TextPrimary, fontWeight: FontWeight.black },
  timeDesc: { fontSize: FontSize.md, color: Colors.TextSecondary, textAlign: 'center', lineHeight: 22 },
  section: { gap: Spacing.sm },
  sectionLabel: { fontSize: FontSize.xs, color: Colors.TextMuted, fontWeight: FontWeight.black, letterSpacing: 2 },
  optionRow: { flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap' },
  option: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.SurfaceBorder,
    backgroundColor: Colors.SurfaceCard,
  },
  optionActive: { backgroundColor: Colors.PrimaryGlow, borderColor: Colors.Primary },
  optionText: { fontSize: FontSize.md, color: Colors.TextSecondary, fontWeight: FontWeight.medium },
  optionTextActive: { color: Colors.Primary, fontWeight: FontWeight.bold },
  input: {
    backgroundColor: Colors.SurfaceCard,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.SurfaceBorder,
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    color: Colors.TextPrimary,
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
  },
  energyRow: { flexDirection: 'row', gap: 6 },
  energyBtn: {
    flex: 1,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.sm,
    backgroundColor: Colors.SurfaceCard,
    borderWidth: 1,
    borderColor: Colors.SurfaceBorder,
  },
  energyBtnActive: { backgroundColor: Colors.PrimaryGlow, borderColor: Colors.Primary },
  energyText: { fontSize: FontSize.sm, color: Colors.TextSecondary, fontWeight: FontWeight.bold },
  energyTextActive: { color: Colors.Primary },
  footer: { paddingHorizontal: Spacing.md, paddingTop: Spacing.md },
});
