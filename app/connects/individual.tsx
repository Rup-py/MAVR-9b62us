import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable, TextInput,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '@/constants/theme';
import { AvatarFrame } from '@/components';

export default function IndividualConnects() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [goal, setGoal] = useState('Muscle Gain');
  const [timing, setTiming] = useState('');
  const [mode, setMode] = useState<'Shadow' | 'Vanguard' | 'Symmetry'>('Symmetry');
  const [registered, setRegistered] = useState(false);

  const handleBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/(tabs)/community');
  };

  const handleRegister = () => {
    setRegistered(true);
  };

  if (registered) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <Pressable onPress={handleBack} hitSlop={16} style={styles.backBtn}>
            <MaterialIcons name="chevron-left" size={28} color={Colors.TextPrimary} />
          </Pressable>
          <Text style={styles.headerTitle}>CONNECTS</Text>
        </View>
        <View style={styles.successCard}>
          <MaterialIcons name="sensors" size={48} color={Colors.Primary} />
          <Text style={styles.successTitle}>SIGNAL ACTIVE</Text>
          <Text style={styles.successSub}>
            You are now visible in the MAVR network under {mode} mode. Compatible athletes and Vanguards will appear in your Connects tab.
          </Text>
          <Pressable style={styles.cta} onPress={() => router.replace('/(tabs)/community')}>
            <Text style={styles.ctaText}>VIEW MY CONNECTS</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={handleBack} hitSlop={16} style={styles.backBtn}>
          <MaterialIcons name="chevron-left" size={28} color={Colors.TextPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>INDIVIDUAL CONNECTS</Text>
      </View>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: 100 }]} showsVerticalScrollIndicator={false}>
        <Text style={styles.intro}>
          Register your intent and find gym partners, Vanguards, or athletes in Symmetry with your performance level.
        </Text>

        <Text style={styles.sectionLabel}>YOUR PRIMARY GOAL</Text>
        {['Muscle Gain', 'Fat Loss', 'Strength', 'Endurance', 'Recomp'].map((g) => (
          <Pressable
            key={g}
            style={[styles.optionRow, goal === g && styles.optionActive]}
            onPress={() => setGoal(g)}
          >
            <Text style={[styles.optionText, goal === g && { color: Colors.Primary }]}>{g}</Text>
            {goal === g && <MaterialIcons name="check" size={18} color={Colors.Primary} />}
          </Pressable>
        ))}

        <Text style={styles.sectionLabel}>PREFERRED GYM TIMING</Text>
        <TextInput
          style={styles.input}
          value={timing}
          onChangeText={setTiming}
          placeholder="e.g. 6:00 - 8:00 AM"
          placeholderTextColor={Colors.TextMuted}
        />

        <Text style={styles.sectionLabel}>SELECT INTENT MODE</Text>
        {([
          { mode: 'Shadow' as const, label: 'SHADOW MODE', desc: 'Learn from experienced Vanguard athletes above your rank', icon: 'visibility' },
          { mode: 'Vanguard' as const, label: 'VANGUARD MODE', desc: 'Lead shadow athletes. Earn Influence Points.', icon: 'military-tech' },
          { mode: 'Symmetry' as const, label: 'SYMMETRY MODE', desc: 'Match with ±10% adherence compatibility', icon: 'swap-horiz' },
        ]).map((m) => (
          <Pressable
            key={m.mode}
            style={[styles.modeCard, mode === m.mode && styles.modeCardActive]}
            onPress={() => setMode(m.mode)}
          >
            <MaterialIcons name={m.icon as any} size={22} color={mode === m.mode ? Colors.Primary : Colors.TextMuted} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.modeLabel, mode === m.mode && { color: Colors.Primary }]}>{m.label}</Text>
              <Text style={styles.modeDesc}>{m.desc}</Text>
            </View>
            {mode === m.mode && <View style={styles.modeDot} />}
          </Pressable>
        ))}

        <Pressable style={styles.registerBtn} onPress={handleRegister}>
          <MaterialIcons name="sensors" size={20} color="#fff" />
          <Text style={styles.registerBtnText}>DROP MY SIGNAL</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.Background },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    borderBottomWidth: 1, borderBottomColor: Colors.SurfaceBorder,
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.SurfaceElevated, borderRadius: Radius.md },
  headerTitle: { fontSize: FontSize.lg, color: Colors.TextPrimary, fontWeight: FontWeight.black, letterSpacing: 2 },
  scroll: { paddingHorizontal: Spacing.md, paddingTop: Spacing.md, gap: Spacing.sm },
  intro: { fontSize: FontSize.md, color: Colors.TextSecondary, lineHeight: 22, paddingBottom: Spacing.sm },
  sectionLabel: { fontSize: FontSize.xs, color: Colors.TextMuted, fontWeight: FontWeight.black, letterSpacing: 2, marginTop: Spacing.sm },
  optionRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.SurfaceCard, borderRadius: Radius.md,
    padding: Spacing.md, borderWidth: 1, borderColor: Colors.SurfaceBorder,
  },
  optionActive: { borderColor: Colors.Primary, backgroundColor: Colors.PrimaryGlow },
  optionText: { fontSize: FontSize.md, color: Colors.TextPrimary, fontWeight: FontWeight.medium },
  input: {
    backgroundColor: Colors.SurfaceCard, borderRadius: Radius.md,
    borderWidth: 1, borderColor: Colors.SurfaceBorder,
    paddingHorizontal: Spacing.md, paddingVertical: 14,
    color: Colors.TextPrimary, fontSize: FontSize.md,
  },
  modeCard: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.SurfaceCard, borderRadius: Radius.lg,
    padding: Spacing.md, borderWidth: 1, borderColor: Colors.SurfaceBorder,
  },
  modeCardActive: { borderColor: Colors.Primary + '55', backgroundColor: Colors.PrimaryGlow },
  modeLabel: { fontSize: FontSize.md, color: Colors.TextPrimary, fontWeight: FontWeight.black, letterSpacing: 1 },
  modeDesc: { fontSize: FontSize.xs, color: Colors.TextMuted, marginTop: 2 },
  modeDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.Primary },
  registerBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: Colors.Primary, borderRadius: Radius.lg,
    paddingVertical: 18, marginTop: Spacing.lg,
  },
  registerBtnText: { fontSize: FontSize.md, color: '#fff', fontWeight: FontWeight.black, letterSpacing: 2 },
  successCard: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: Spacing.xl, gap: Spacing.lg,
  },
  successTitle: { fontSize: FontSize.xxxl, color: Colors.TextPrimary, fontWeight: FontWeight.black, letterSpacing: 3 },
  successSub: { fontSize: FontSize.md, color: Colors.TextSecondary, textAlign: 'center', lineHeight: 24 },
  cta: {
    backgroundColor: Colors.Primary, borderRadius: Radius.lg,
    paddingHorizontal: Spacing.xl, paddingVertical: 16,
  },
  ctaText: { fontSize: FontSize.md, color: '#fff', fontWeight: FontWeight.black, letterSpacing: 2 },
});
