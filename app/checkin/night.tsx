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

const PROTEIN_OPTIONS = ['<100g', '100-120g', '120-150g', '150-180g', '180g+'];
const WATER_OPTIONS = ['<2L', '2L', '2.5L', '3L', '3.5L+'];

export default function NightCheckOut() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [dietFollowed, setDietFollowed] = useState<boolean | null>(null);
  const [trainerDietFollowed, setTrainerDietFollowed] = useState<boolean | null>(null);
  const [protein, setProtein] = useState('150-180g');
  const [water, setWater] = useState('3L');
  const [note, setNote] = useState('');
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
        <Text style={styles.headerTitle}>NIGHT CHECK-OUT</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: 100 }]} showsVerticalScrollIndicator={false}>
        <View style={styles.timeBlock}>
          <MaterialIcons name="nights-stay" size={32} color="#818CF8" />
          <Text style={styles.timeLabel}>Day Debrief</Text>
          <Text style={styles.timeDesc}>Log your nutrition, hydration, and prepare tomorrow's focus.</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>DID YOU FOLLOW YOUR DIET PLAN?</Text>
          <View style={styles.boolRow}>
            <Pressable style={[styles.boolBtn, dietFollowed === true && styles.boolBtnYes]} onPress={() => setDietFollowed(true)}>
              <MaterialIcons name="check" size={20} color={dietFollowed === true ? Colors.Background : Colors.TextMuted} />
              <Text style={[styles.boolText, dietFollowed === true && styles.boolTextActive]}>Yes</Text>
            </Pressable>
            <Pressable style={[styles.boolBtn, dietFollowed === false && styles.boolBtnNo]} onPress={() => setDietFollowed(false)}>
              <MaterialIcons name="close" size={20} color={Colors.TextMuted} />
              <Text style={styles.boolText}>Partially</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>DID YOU FOLLOW TRAINER'S DIET PLAN?</Text>
          <View style={styles.boolRow}>
            <Pressable style={[styles.boolBtn, trainerDietFollowed === true && styles.boolBtnYes]} onPress={() => setTrainerDietFollowed(true)}>
              <MaterialIcons name="verified" size={18} color={trainerDietFollowed === true ? Colors.Background : Colors.TextMuted} />
              <Text style={[styles.boolText, trainerDietFollowed === true && styles.boolTextActive]}>Yes</Text>
            </Pressable>
            <Pressable style={[styles.boolBtn, trainerDietFollowed === false && styles.boolBtnNo]} onPress={() => setTrainerDietFollowed(false)}>
              <MaterialIcons name="cancel" size={18} color={Colors.TextMuted} />
              <Text style={styles.boolText}>No</Text>
            </Pressable>
            <Pressable style={[styles.boolBtn]} onPress={() => setTrainerDietFollowed(null)}>
              <Text style={styles.boolText}>N/A</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>PROTEIN INTAKE</Text>
          <View style={styles.optionRow}>
            {PROTEIN_OPTIONS.map((p) => (
              <Pressable key={p} style={[styles.option, protein === p && styles.optionActive]} onPress={() => setProtein(p)}>
                <Text style={[styles.optionText, protein === p && styles.optionTextActive]}>{p}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>WATER INTAKE</Text>
          <View style={styles.optionRow}>
            {WATER_OPTIONS.map((w) => (
              <Pressable key={w} style={[styles.option, water === w && styles.optionActive]} onPress={() => setWater(w)}>
                <Text style={[styles.optionText, water === w && styles.optionTextActive]}>{w}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>NOTE FOR TOMORROW</Text>
          <TextInput
            style={styles.textArea}
            value={note}
            onChangeText={setNote}
            placeholder="Any notes, blockers, or focus for tomorrow..."
            placeholderTextColor={Colors.TextMuted}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + Spacing.md }]}>
        <Button label="COMPLETE CHECK-OUT" onPress={handleSubmit} loading={saving} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.Background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.md, paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.SurfaceBorder },
  headerTitle: { fontSize: FontSize.lg, color: Colors.TextPrimary, fontWeight: FontWeight.black, letterSpacing: 2 },
  scroll: { paddingHorizontal: Spacing.md, gap: Spacing.lg, paddingTop: Spacing.lg },
  timeBlock: { alignItems: 'center', gap: Spacing.sm, paddingVertical: Spacing.md },
  timeLabel: { fontSize: FontSize.xxl, color: Colors.TextPrimary, fontWeight: FontWeight.black },
  timeDesc: { fontSize: FontSize.md, color: Colors.TextSecondary, textAlign: 'center', lineHeight: 22 },
  section: { gap: Spacing.sm },
  sectionLabel: { fontSize: FontSize.xs, color: Colors.TextMuted, fontWeight: FontWeight.black, letterSpacing: 2 },
  boolRow: { flexDirection: 'row', gap: Spacing.sm },
  boolBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 14, borderRadius: Radius.md, backgroundColor: Colors.SurfaceCard, borderWidth: 1, borderColor: Colors.SurfaceBorder },
  boolBtnYes: { backgroundColor: Colors.Primary, borderColor: Colors.Primary },
  boolBtnNo: { backgroundColor: Colors.Error + '22', borderColor: Colors.Error + '44' },
  boolText: { fontSize: FontSize.md, color: Colors.TextMuted, fontWeight: FontWeight.bold },
  boolTextActive: { color: Colors.Background },
  optionRow: { flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap' },
  option: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: Radius.full, borderWidth: 1, borderColor: Colors.SurfaceBorder, backgroundColor: Colors.SurfaceCard },
  optionActive: { backgroundColor: Colors.PrimaryGlow, borderColor: Colors.Primary },
  optionText: { fontSize: FontSize.sm, color: Colors.TextSecondary, fontWeight: FontWeight.medium },
  optionTextActive: { color: Colors.Primary, fontWeight: FontWeight.bold },
  textArea: { backgroundColor: Colors.SurfaceCard, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.SurfaceBorder, paddingHorizontal: Spacing.md, paddingVertical: Spacing.md, color: Colors.TextPrimary, fontSize: FontSize.md, minHeight: 100 },
  footer: { paddingHorizontal: Spacing.md, paddingTop: Spacing.md },
});
