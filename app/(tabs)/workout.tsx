import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUser } from '@/hooks/useUser';
import { Badge } from '@/components';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '@/constants/theme';
import { MOCK_WORKOUT_PLAN, MOCK_DIET_PLAN } from '@/services/mockData';

type Tab = 'workout' | 'diet';

const WEEK_PLAN = [
  { day: 'MON', focus: 'PUSH', done: true },
  { day: 'TUE', focus: 'PULL', done: true },
  { day: 'WED', focus: 'LEGS', done: false },
  { day: 'THU', focus: 'REST', done: false },
  { day: 'FRI', focus: 'PUSH', done: false, today: true },
  { day: 'SAT', focus: 'PULL', done: false },
  { day: 'SUN', focus: 'REST', done: false },
];

export default function WorkoutScreen() {
  const insets = useSafeAreaInsets();
  const { workoutPlan, dietPlan } = useUser();
  const [activeTab, setActiveTab] = useState<Tab>('workout');

  const wp = workoutPlan || MOCK_WORKOUT_PLAN;
  const dp = dietPlan || MOCK_DIET_PLAN;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>TRAINING SYSTEM</Text>
        <View style={styles.tabToggle}>
          <Pressable
            style={[styles.toggleBtn, activeTab === 'workout' && styles.toggleBtnActive]}
            onPress={() => setActiveTab('workout')}
          >
            <MaterialIcons name="fitness-center" size={16} color={activeTab === 'workout' ? Colors.Primary : Colors.TextMuted} />
            <Text style={[styles.toggleText, activeTab === 'workout' && styles.toggleTextActive]}>Workout</Text>
          </Pressable>
          <Pressable
            style={[styles.toggleBtn, activeTab === 'diet' && styles.toggleBtnActive]}
            onPress={() => setActiveTab('diet')}
          >
            <MaterialIcons name="restaurant" size={16} color={activeTab === 'diet' ? Colors.Primary : Colors.TextMuted} />
            <Text style={[styles.toggleText, activeTab === 'diet' && styles.toggleTextActive]}>Diet</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: 100 }]} showsVerticalScrollIndicator={false}>
        {activeTab === 'workout' ? (
          <>
            {/* Source Badge */}
            <View style={styles.sourceBanner}>
              <MaterialIcons
                name={wp.assignedBy === 'trainer' ? 'verified' : 'psychology'}
                size={16}
                color={wp.assignedBy === 'trainer' ? Colors.Primary : Colors.Info}
              />
              <Text style={[styles.sourceBannerText, { color: wp.assignedBy === 'trainer' ? Colors.Primary : Colors.Info }]}>
                {wp.assignedBy === 'trainer' ? `Assigned by ${wp.trainerName}` : 'AI Structured Plan'}
              </Text>
            </View>

            {/* Split Info */}
            <View style={styles.splitCard}>
              <Text style={styles.splitLabel}>ACTIVE SPLIT</Text>
              <Text style={styles.splitName}>{wp.split}</Text>
            </View>

            {/* Week View */}
            <View style={styles.weekCard}>
              <Text style={styles.cardLabel}>WEEKLY SCHEDULE</Text>
              <View style={styles.weekRow}>
                {WEEK_PLAN.map((d) => (
                  <View key={d.day} style={[styles.weekDay, d.today && styles.weekDayToday, d.done && styles.weekDayDone]}>
                    <Text style={[styles.weekDayLabel, d.today && styles.weekDayLabelToday]}>{d.day}</Text>
                    <Text style={[styles.weekDayFocus, d.today && { color: Colors.Primary }, d.focus === 'REST' && { color: Colors.TextMuted }]}>
                      {d.focus}
                    </Text>
                    {d.done && <MaterialIcons name="check" size={10} color={Colors.Success} />}
                    {d.today && <View style={styles.todayDot} />}
                  </View>
                ))}
              </View>
            </View>

            {/* Today's Session */}
            <View style={styles.sessionCard}>
              <View style={styles.sessionHeader}>
                <View>
                  <Text style={styles.cardLabel}>TODAY'S SESSION</Text>
                  <Text style={styles.sessionTitle}>{wp.today.day} — {wp.today.focus}</Text>
                </View>
                <View style={[styles.intensityBadge, { backgroundColor: Colors.Primary + '22' }]}>
                  <Text style={[styles.intensityText]}>{wp.today.intensity}</Text>
                </View>
              </View>
              <View style={styles.sessionMeta}>
                <View style={styles.metaPill}>
                  <MaterialIcons name="timer" size={14} color={Colors.TextMuted} />
                  <Text style={styles.metaText}>{wp.today.estimatedDuration} min</Text>
                </View>
                <View style={styles.metaPill}>
                  <MaterialIcons name="format-list-numbered" size={14} color={Colors.TextMuted} />
                  <Text style={styles.metaText}>{wp.today.exercises.length} exercises</Text>
                </View>
              </View>

              <View style={styles.exerciseList}>
                {wp.today.exercises.map((ex, i) => (
                  <View key={i} style={styles.exerciseRow}>
                    <Text style={styles.exNum}>{String(i + 1).padStart(2, '0')}</Text>
                    <View style={styles.exInfo}>
                      <Text style={styles.exName}>{ex.name}</Text>
                      <Text style={styles.exDetail}>{ex.sets} sets × {ex.reps} reps · {ex.load}</Text>
                    </View>
                    <View style={styles.exRest}>
                      <Text style={styles.exRestText}>{ex.rest}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </>
        ) : (
          <>
            {/* Diet Source */}
            <View style={styles.sourceBanner}>
              <MaterialIcons name={dp.assignedBy === 'trainer' ? 'verified' : 'psychology'} size={16} color={dp.assignedBy === 'trainer' ? Colors.Primary : Colors.Info} />
              <Text style={[styles.sourceBannerText, { color: dp.assignedBy === 'trainer' ? Colors.Primary : Colors.Info }]}>
                {dp.assignedBy === 'trainer' ? `Structured by ${dp.trainerName}` : 'AI Structured Plan'}
              </Text>
            </View>

            {/* Macro Targets */}
            <View style={styles.macroCard}>
              <Text style={styles.cardLabel}>DAILY TARGETS</Text>
              <Text style={styles.calorieTarget}>{dp.targetCalories} kcal</Text>
              <View style={styles.macroRow}>
                <MacroPill label="Protein" value={dp.targetProtein} unit="g" color={Colors.Primary} />
                <MacroPill label="Carbs" value={dp.targetCarbs} unit="g" color="#F59E0B" />
                <MacroPill label="Fat" value={dp.targetFat} unit="g" color="#818CF8" />
              </View>
            </View>

            {/* Meal Plan */}
            <View style={styles.mealList}>
              {dp.meals.map((meal, i) => (
                <View key={i} style={styles.mealCard}>
                  <View style={styles.mealHeader}>
                    <View style={styles.mealTime}>
                      <MaterialIcons name="schedule" size={14} color={Colors.TextMuted} />
                      <Text style={styles.mealTimeText}>{meal.time}</Text>
                    </View>
                    <Text style={styles.mealLabel}>{meal.label}</Text>
                    <Text style={styles.mealCal}>{meal.calories} kcal</Text>
                  </View>
                  <View style={styles.mealItems}>
                    {meal.items.map((item, j) => (
                      <View key={j} style={styles.mealItem}>
                        <View style={styles.mealDot} />
                        <Text style={styles.mealItemText}>{item}</Text>
                      </View>
                    ))}
                  </View>
                  <Text style={styles.mealProtein}>{meal.protein}g protein</Text>
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

function MacroPill({ label, value, unit, color }: { label: string; value: number; unit: string; color: string }) {
  return (
    <View style={[styles.macroPill, { backgroundColor: color + '15', borderColor: color + '33' }]}>
      <Text style={[styles.macroValue, { color }]}>{value}{unit}</Text>
      <Text style={styles.macroLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.Background },
  header: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.SurfaceBorder,
    gap: Spacing.md,
  },
  headerTitle: { fontSize: FontSize.xl, color: Colors.TextPrimary, fontWeight: FontWeight.black, letterSpacing: 2 },
  tabToggle: {
    flexDirection: 'row',
    backgroundColor: Colors.SurfaceCard,
    borderRadius: Radius.md,
    padding: 4,
    gap: 4,
    borderWidth: 1,
    borderColor: Colors.SurfaceBorder,
  },
  toggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: Radius.sm,
  },
  toggleBtnActive: { backgroundColor: Colors.PrimaryGlow },
  toggleText: { fontSize: FontSize.md, color: Colors.TextMuted, fontWeight: FontWeight.medium },
  toggleTextActive: { color: Colors.Primary, fontWeight: FontWeight.bold },
  scroll: { paddingHorizontal: Spacing.md, gap: Spacing.md, paddingTop: Spacing.md },
  sourceBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.SurfaceCard,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.SurfaceBorder,
  },
  sourceBannerText: { fontSize: FontSize.sm, fontWeight: FontWeight.bold },
  splitCard: {
    backgroundColor: Colors.SurfaceCard,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.SurfaceBorder,
    gap: 4,
  },
  splitLabel: { fontSize: FontSize.xs, color: Colors.TextMuted, fontWeight: FontWeight.bold, letterSpacing: 1.5 },
  splitName: { fontSize: FontSize.xxl, color: Colors.TextPrimary, fontWeight: FontWeight.black },
  weekCard: {
    backgroundColor: Colors.SurfaceCard,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.SurfaceBorder,
    gap: Spacing.sm,
  },
  cardLabel: { fontSize: FontSize.xs, color: Colors.TextMuted, fontWeight: FontWeight.bold, letterSpacing: 1.5 },
  weekRow: { flexDirection: 'row', gap: 4 },
  weekDay: { flex: 1, alignItems: 'center', paddingVertical: Spacing.sm, borderRadius: Radius.sm, gap: 4, opacity: 0.5 },
  weekDayToday: { backgroundColor: Colors.PrimaryGlow, opacity: 1, borderWidth: 1, borderColor: Colors.Primary + '55' },
  weekDayDone: { opacity: 1 },
  weekDayLabel: { fontSize: FontSize.xs - 1, color: Colors.TextMuted, fontWeight: FontWeight.bold },
  weekDayLabelToday: { color: Colors.Primary },
  weekDayFocus: { fontSize: FontSize.xs - 1, color: Colors.TextPrimary, fontWeight: FontWeight.bold },
  todayDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: Colors.Primary },
  sessionCard: {
    backgroundColor: Colors.SurfaceCard,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.SurfaceBorder,
    gap: Spacing.md,
  },
  sessionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  sessionTitle: { fontSize: FontSize.xl, color: Colors.TextPrimary, fontWeight: FontWeight.black, marginTop: 4 },
  intensityBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.full },
  intensityText: { fontSize: FontSize.xs, color: Colors.Primary, fontWeight: FontWeight.black, letterSpacing: 1 },
  sessionMeta: { flexDirection: 'row', gap: Spacing.sm },
  metaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    backgroundColor: Colors.SurfaceElevated,
    borderRadius: Radius.full,
  },
  metaText: { fontSize: FontSize.xs, color: Colors.TextMuted, fontWeight: FontWeight.medium },
  exerciseList: { gap: 1 },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.SurfaceBorder,
  },
  exNum: { fontSize: FontSize.sm, color: Colors.Primary, fontWeight: FontWeight.black, width: 24 },
  exInfo: { flex: 1 },
  exName: { fontSize: FontSize.md, color: Colors.TextPrimary, fontWeight: FontWeight.semibold },
  exDetail: { fontSize: FontSize.sm, color: Colors.TextSecondary, marginTop: 2 },
  exRest: { alignItems: 'flex-end' },
  exRestText: { fontSize: FontSize.xs, color: Colors.TextMuted },
  macroCard: {
    backgroundColor: Colors.SurfaceCard,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.SurfaceBorder,
    gap: Spacing.md,
  },
  calorieTarget: { fontSize: FontSize.hero, color: Colors.TextPrimary, fontWeight: FontWeight.black },
  macroRow: { flexDirection: 'row', gap: Spacing.sm },
  macroPill: { flex: 1, alignItems: 'center', paddingVertical: Spacing.md, borderRadius: Radius.md, borderWidth: 1, gap: 4 },
  macroValue: { fontSize: FontSize.xl, fontWeight: FontWeight.black },
  macroLabel: { fontSize: FontSize.xs, color: Colors.TextMuted, fontWeight: FontWeight.medium },
  mealList: { gap: Spacing.sm },
  mealCard: {
    backgroundColor: Colors.SurfaceCard,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.SurfaceBorder,
    gap: Spacing.sm,
  },
  mealHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  mealTime: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  mealTimeText: { fontSize: FontSize.xs, color: Colors.TextMuted },
  mealLabel: { flex: 1, fontSize: FontSize.md, color: Colors.TextPrimary, fontWeight: FontWeight.bold },
  mealCal: { fontSize: FontSize.sm, color: Colors.Primary, fontWeight: FontWeight.bold },
  mealItems: { gap: 4 },
  mealItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  mealDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: Colors.Primary },
  mealItemText: { fontSize: FontSize.sm, color: Colors.TextSecondary },
  mealProtein: { fontSize: FontSize.xs, color: Colors.Primary, fontWeight: FontWeight.bold },
});
