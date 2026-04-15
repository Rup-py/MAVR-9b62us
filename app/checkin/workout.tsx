import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '@/constants/theme';
import { MOCK_WORKOUT_PLAN } from '@/services/mockData';

const RATING_OPTIONS = ['1', '2', '3', '4', '5'];

export default function WorkoutCheckIn() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const wp = MOCK_WORKOUT_PLAN;

  const [started, setStarted] = useState<boolean | null>(null);
  const [exercisesDone, setExercisesDone] = useState<number[]>([]);
  const [rating, setRating] = useState('4');
  const [trainerTaskDone, setTrainerTaskDone] = useState<boolean | null>(null);
  const [saving, setSaving] = useState(false);

  const toggleExercise = (i: number) => {
    setExercisesDone((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]
    );
  };

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
        <Text style={styles.headerTitle}>WORKOUT CHECK-IN</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: 100 }]} showsVerticalScrollIndicator={false}>
        <View style={styles.sessionInfo}>
          <MaterialIcons name="fitness-center" size={28} color={Colors.Primary} />
          <Text style={styles.sessionDay}>{wp.today.day} SESSION</Text>
          <Text style={styles.sessionFocus}>{wp.today.focus}</Text>
        </View>

        {/* Started? */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>DID YOU START THIS SESSION?</Text>
          <View style={styles.boolRow}>
            <Pressable
              style={[styles.boolBtn, started === true && styles.boolBtnYes]}
              onPress={() => setStarted(true)}
            >
              <MaterialIcons name="check" size={20} color={started === true ? Colors.Background : Colors.TextMuted} />
              <Text style={[styles.boolText, started === true && styles.boolTextActive]}>Yes, I trained</Text>
            </Pressable>
            <Pressable
              style={[styles.boolBtn, started === false && styles.boolBtnNo]}
              onPress={() => setStarted(false)}
            >
              <MaterialIcons name="close" size={20} color={started === false ? Colors.Background : Colors.TextMuted} />
              <Text style={[styles.boolText, started === false && { color: Colors.TextPrimary }]}>Skipped</Text>
            </Pressable>
          </View>
        </View>

        {started === true && (
          <>
            {/* Exercises Done */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>EXERCISES COMPLETED</Text>
              {wp.today.exercises.map((ex, i) => (
                <Pressable
                  key={i}
                  style={[styles.exerciseCheck, exercisesDone.includes(i) && styles.exerciseCheckDone]}
                  onPress={() => toggleExercise(i)}
                >
                  <MaterialIcons
                    name={exercisesDone.includes(i) ? 'check-box' : 'check-box-outline-blank'}
                    size={22}
                    color={exercisesDone.includes(i) ? Colors.Primary : Colors.TextMuted}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.exName, exercisesDone.includes(i) && { color: Colors.Primary }]}>{ex.name}</Text>
                    <Text style={styles.exDetail}>{ex.sets}×{ex.reps} · {ex.load}</Text>
                  </View>
                </Pressable>
              ))}
            </View>

            {/* Session Rating */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>SESSION RATING</Text>
              <View style={styles.ratingRow}>
                {RATING_OPTIONS.map((r) => (
                  <Pressable
                    key={r}
                    style={[styles.ratingBtn, rating === r && styles.ratingBtnActive]}
                    onPress={() => setRating(r)}
                  >
                    <MaterialIcons name="star" size={20} color={rating >= r ? Colors.Primary : Colors.TextMuted} />
                    <Text style={[styles.ratingText, rating === r && styles.ratingTextActive]}>{r}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Trainer Task */}
            {wp.assignedBy === 'trainer' && (
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>TRAINER TASK COMPLETED?</Text>
                <View style={styles.boolRow}>
                  <Pressable style={[styles.boolBtn, trainerTaskDone === true && styles.boolBtnYes]} onPress={() => setTrainerTaskDone(true)}>
                    <MaterialIcons name="verified" size={18} color={trainerTaskDone === true ? Colors.Background : Colors.TextMuted} />
                    <Text style={[styles.boolText, trainerTaskDone === true && styles.boolTextActive]}>Yes</Text>
                  </Pressable>
                  <Pressable style={[styles.boolBtn, trainerTaskDone === false && styles.boolBtnNo]} onPress={() => setTrainerTaskDone(false)}>
                    <MaterialIcons name="cancel" size={18} color={Colors.TextMuted} />
                    <Text style={styles.boolText}>No</Text>
                  </Pressable>
                </View>
              </View>
            )}
          </>
        )}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + Spacing.md }]}>
        <Button label="SUBMIT CHECK-IN" onPress={handleSubmit} loading={saving} disabled={started === null} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.Background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.md, paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.SurfaceBorder },
  headerTitle: { fontSize: FontSize.lg, color: Colors.TextPrimary, fontWeight: FontWeight.black, letterSpacing: 2 },
  scroll: { paddingHorizontal: Spacing.md, gap: Spacing.lg, paddingTop: Spacing.lg },
  sessionInfo: { alignItems: 'center', gap: Spacing.sm, paddingVertical: Spacing.md },
  sessionDay: { fontSize: FontSize.xxl, color: Colors.TextPrimary, fontWeight: FontWeight.black, letterSpacing: 3 },
  sessionFocus: { fontSize: FontSize.md, color: Colors.TextSecondary },
  section: { gap: Spacing.sm },
  sectionLabel: { fontSize: FontSize.xs, color: Colors.TextMuted, fontWeight: FontWeight.black, letterSpacing: 2 },
  boolRow: { flexDirection: 'row', gap: Spacing.md },
  boolBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, paddingVertical: 16, borderRadius: Radius.md, backgroundColor: Colors.SurfaceCard, borderWidth: 1, borderColor: Colors.SurfaceBorder },
  boolBtnYes: { backgroundColor: Colors.Primary, borderColor: Colors.Primary },
  boolBtnNo: { backgroundColor: Colors.Error, borderColor: Colors.Error },
  boolText: { fontSize: FontSize.md, color: Colors.TextMuted, fontWeight: FontWeight.bold },
  boolTextActive: { color: Colors.Background },
  exerciseCheck: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, backgroundColor: Colors.SurfaceCard, borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.SurfaceBorder },
  exerciseCheckDone: { borderColor: Colors.Primary + '55', backgroundColor: Colors.PrimaryGlow },
  exName: { fontSize: FontSize.md, color: Colors.TextPrimary, fontWeight: FontWeight.medium },
  exDetail: { fontSize: FontSize.xs, color: Colors.TextMuted, marginTop: 2 },
  ratingRow: { flexDirection: 'row', gap: Spacing.sm },
  ratingBtn: { flex: 1, alignItems: 'center', paddingVertical: 12, backgroundColor: Colors.SurfaceCard, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.SurfaceBorder, gap: 4 },
  ratingBtnActive: { backgroundColor: Colors.PrimaryGlow, borderColor: Colors.Primary },
  ratingText: { fontSize: FontSize.xs, color: Colors.TextMuted },
  ratingTextActive: { color: Colors.Primary, fontWeight: FontWeight.bold },
  footer: { paddingHorizontal: Spacing.md, paddingTop: Spacing.md },
});
