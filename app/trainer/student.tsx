import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable, TextInput,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AvatarFrame, RankBadge, StatBar, Button } from '@/components';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '@/constants/theme';
import { MOCK_STUDENTS, MOCK_WORKOUT_PLAN, MOCK_DIET_PLAN, MOCK_TRAINER_REVIEWS, TrainerReview } from '@/services/mockData';

type Tab = 'overview' | 'workout' | 'diet' | 'notes' | 'feedback';

const MOCK_EXERCISES_CUSTOM = [
  { name: 'Barbell Squat', sets: 5, reps: '5', load: '100kg', rest: '240s' },
  { name: 'Romanian Deadlift', sets: 4, reps: '8-10', load: '80kg', rest: '180s' },
  { name: 'Leg Press', sets: 3, reps: '12-15', load: '120kg', rest: '120s' },
  { name: 'Leg Curl', sets: 3, reps: '12', load: '40kg', rest: '90s' },
  { name: 'Calf Raises', sets: 4, reps: '15-20', load: '60kg', rest: '60s' },
];

export default function StudentProfile() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [planAssigned, setPlanAssigned] = useState({ workout: false, diet: false });

  const student = MOCK_STUDENTS.find((s) => s.id === id) || MOCK_STUDENTS[0];
  const isWorkoutAssigned = student.workoutPlanAssigned || planAssigned.workout;
  const isDietAssigned = student.dietPlanAssigned || planAssigned.diet;

  const handleBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/trainer/dashboard');
  };

  const relevantFeedback = MOCK_TRAINER_REVIEWS.find((r) => r.studentName === student.name);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={handleBack} hitSlop={16} style={styles.backBtn}>
          <MaterialIcons name="chevron-left" size={30} color={Colors.TextPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>STUDENT PROFILE</Text>
        <Pressable style={styles.actionBtn} hitSlop={8}>
          <MaterialIcons name="more-vert" size={24} color={Colors.TextSecondary} />
        </Pressable>
      </View>

      {/* Student Hero */}
      <View style={styles.studentHero}>
        <AvatarFrame letter={student.avatar} tier={student.tier} size={56} animated />
        <View style={{ flex: 1, gap: 6 }}>
          <Text style={styles.studentName}>{student.name}</Text>
          <Text style={styles.studentInfo}>{student.goal} · {student.city} · Age {student.age}</Text>
          <View style={styles.heroMeta}>
            <RankBadge tier={student.tier} />
            <View style={[styles.paymentBadge, {
              backgroundColor: student.paymentStatus === 'paid' ? '#22C55E22' : Colors.Error + '22'
            }]}>
              <Text style={[styles.paymentText, { color: student.paymentStatus === 'paid' ? '#22C55E' : Colors.Error }]}>
                {student.paymentStatus.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <QuickStat label="Redline" value={`${student.redlineScore}%`} color={Colors.Primary} />
        <QuickStat label="Streak" value={`${student.streak}d`} color="#F59E0B" />
        <QuickStat label="Tonnage" value={`${(student.dailyTonnage / 1000).toFixed(1)}t`} color="#818CF8" />
        <QuickStat label="Due" value={student.nextPaymentDue.split(' ').slice(0, 2).join(' ')} color={student.paymentStatus === 'overdue' ? Colors.Error : '#22C55E'} />
      </View>

      {/* Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll} contentContainerStyle={styles.tabs}>
        {(['overview', 'workout', 'diet', 'notes', 'feedback'] as Tab[]).map((tab) => (
          <Pressable
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
            {tab === 'feedback' && student.feedbackGiven && (
              <View style={styles.feedbackDot} />
            )}
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: 80 }]} showsVerticalScrollIndicator={false}>
        {activeTab === 'overview' && <OverviewTab student={student} />}
        {activeTab === 'workout' && (
          <WorkoutTab
            student={{ ...student, workoutPlanAssigned: isWorkoutAssigned }}
            onAssign={() => setPlanAssigned((p) => ({ ...p, workout: true }))}
          />
        )}
        {activeTab === 'diet' && (
          <DietTab
            student={{ ...student, dietPlanAssigned: isDietAssigned }}
            onAssign={() => setPlanAssigned((p) => ({ ...p, diet: true }))}
          />
        )}
        {activeTab === 'notes' && <NotesTab />}
        {activeTab === 'feedback' && <FeedbackTab review={relevantFeedback} student={student} />}
      </ScrollView>
    </View>
  );
}

function QuickStat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={styles.quickStat}>
      <Text style={[styles.quickStatValue, { color }]}>{value}</Text>
      <Text style={styles.quickStatLabel}>{label}</Text>
    </View>
  );
}

function FeedbackTab({ review, student }: { review?: TrainerReview; student: any }) {
  if (!student.feedbackGiven || !review) {
    return (
      <View style={styles.section}>
        <View style={styles.emptyCard}>
          <MaterialIcons name="rate-review" size={36} color={Colors.TextMuted} />
          <Text style={styles.emptyTitle}>No Feedback Yet</Text>
          <Text style={styles.emptyDesc}>
            {student.name.split(' ')[0]} has not submitted feedback yet. Feedback impacts your trainer rating.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>STUDENT FEEDBACK</Text>

      <View style={styles.feedbackCard}>
        <View style={styles.feedbackHeader}>
          <AvatarFrame letter={review.studentAvatar} tier={review.studentTier} size={40} animated />
          <View style={{ flex: 1 }}>
            <Text style={styles.feedbackName}>{review.studentName}</Text>
            <Text style={styles.feedbackGoal}>{review.goal} · {review.date}</Text>
          </View>
          <View style={styles.feedbackRatingBlock}>
            <View style={styles.starsRow}>
              {Array.from({ length: 5 }).map((_, i) => (
                <MaterialIcons
                  key={i}
                  name={i < review.rating ? 'star' : 'star-outline'}
                  size={18}
                  color="#FFD700"
                />
              ))}
            </View>
            <Text style={styles.ratingNum}>{review.rating}/5</Text>
          </View>
        </View>

        <View style={styles.feedbackBody}>
          <MaterialIcons name="format-quote" size={20} color={Colors.Primary} style={{ marginRight: 4 }} />
          <Text style={styles.feedbackText}>{review.review}</Text>
        </View>
      </View>

      {/* Impact on rating */}
      <View style={styles.ratingImpactCard}>
        <Text style={styles.sectionLabel}>RATING IMPACT</Text>
        <View style={styles.ratingImpactRow}>
          <Text style={styles.ratingImpactLabel}>This review contributes to your trainer profile rating.</Text>
          <Text style={styles.trainerRatingValue}>4.9</Text>
        </View>
        <View style={styles.ratingBarRow}>
          {[5, 4, 3, 2, 1].map((star) => (
            <View key={star} style={styles.ratingBarItem}>
              <Text style={styles.ratingBarStar}>{star}</Text>
              <View style={styles.ratingBarTrack}>
                <View style={[styles.ratingBarFill, { width: `${star === 5 ? 70 : star === 4 ? 20 : 5}%` }]} />
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

function OverviewTab({ student }: { student: any }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>REDLINE BREAKDOWN</Text>
      <View style={styles.card}>
        <StatBar label="Nutrition Adherence (40%)" value={student.nutritionAdherence} color="#22C55E" />
        <StatBar label="Training Completion (40%)" value={student.trainingCompletion} color={Colors.Primary} />
        <StatBar label="Recovery Score (20%)" value={student.recoveryScore} color="#818CF8" />
      </View>

      <Text style={styles.sectionLabel}>BIOLOGICAL SIGNALS</Text>
      <View style={styles.card}>
        <View style={styles.bioRow}>
          <MaterialIcons name="nights-stay" size={16} color="#818CF8" />
          <Text style={styles.bioLabel}>Sleep</Text>
          <Text style={[styles.bioVal, { color: student.sleepHours >= student.sleepTarget ? '#22C55E' : '#F59E0B' }]}>
            {student.sleepHours}h / {student.sleepTarget}h target
          </Text>
        </View>
        <View style={styles.bioRow}>
          <MaterialIcons name="directions-run" size={16} color={Colors.Primary} />
          <Text style={styles.bioLabel}>Sets Logged</Text>
          <Text style={[styles.bioVal, { color: student.setsLogged >= student.setsPlanned * 0.9 ? '#22C55E' : '#F59E0B' }]}>
            {student.setsLogged} / {student.setsPlanned} planned
          </Text>
        </View>
        <View style={styles.bioRow}>
          <MaterialIcons name="fitness-center" size={16} color="#FFD700" />
          <Text style={styles.bioLabel}>Daily Tonnage</Text>
          <Text style={styles.bioVal}>{student.dailyTonnage.toLocaleString()} kg</Text>
        </View>
        <View style={styles.bioRow}>
          <MaterialIcons name="psychology" size={16} color="#818CF8" />
          <Text style={styles.bioLabel}>Superpower</Text>
          <Text style={[styles.bioVal, { color: '#818CF8' }]}>{student.superpower}</Text>
        </View>
      </View>

      <Text style={styles.sectionLabel}>PLAN STATUS</Text>
      <View style={styles.card}>
        <View style={styles.planStatus}>
          <MaterialIcons name={student.workoutPlanAssigned ? 'check-circle' : 'radio-button-unchecked'} size={20} color={student.workoutPlanAssigned ? '#22C55E' : Colors.TextMuted} />
          <Text style={styles.planStatusText}>Workout Plan {student.workoutPlanAssigned ? 'Assigned' : 'Not Assigned'}</Text>
        </View>
        <View style={styles.planStatus}>
          <MaterialIcons name={student.dietPlanAssigned ? 'check-circle' : 'radio-button-unchecked'} size={20} color={student.dietPlanAssigned ? '#22C55E' : Colors.TextMuted} />
          <Text style={styles.planStatusText}>Diet Plan {student.dietPlanAssigned ? 'Assigned' : 'Not Assigned'}</Text>
        </View>
        <View style={styles.planStatus}>
          <MaterialIcons name={student.feedbackGiven ? 'check-circle' : 'radio-button-unchecked'} size={20} color={student.feedbackGiven ? '#FFD700' : Colors.TextMuted} />
          <Text style={styles.planStatusText}>
            Feedback {student.feedbackGiven ? `Submitted (${student.feedbackRating}/5 stars)` : 'Not Yet Submitted'}
          </Text>
        </View>
      </View>

      <Text style={styles.sectionLabel}>QUICK ACTIONS</Text>
      <Button label="SEND INSTRUCTION" onPress={() => {}} variant="outline" size="md" />
      <Button label="SEND PAYMENT REMINDER" onPress={() => {}} variant="ghost" size="md" />
    </View>
  );
}

function WorkoutTab({ student, onAssign }: { student: any; onAssign: () => void }) {
  const [editMode, setEditMode] = useState(false);
  const [split, setSplit] = useState('Legs — Strength Focus');
  const [days, setDays] = useState('5');

  if (!student.workoutPlanAssigned) {
    return (
      <View style={styles.section}>
        <View style={styles.emptyCard}>
          <MaterialIcons name="fitness-center" size={36} color={Colors.TextMuted} />
          <Text style={styles.emptyTitle}>No Plan Assigned</Text>
          <Text style={styles.emptyDesc}>Assign a custom workout plan to override the student's AI plan.</Text>
          <Button label="ASSIGN WORKOUT PLAN" onPress={onAssign} size="md" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <View style={[styles.card, { borderColor: Colors.Primary + '44' }]}>
        <View style={styles.planHeader}>
          <MaterialIcons name="verified" size={16} color={Colors.Primary} />
          <Text style={styles.planAssignedText}>ASSIGNED BY TRAINER</Text>
        </View>
        {editMode ? (
          <>
            <Text style={styles.fieldLabel}>SPLIT NAME</Text>
            <TextInput style={styles.inputField} value={split} onChangeText={setSplit} placeholderTextColor={Colors.TextMuted} />
            <Text style={styles.fieldLabel}>TRAINING DAYS / WEEK</Text>
            <TextInput style={styles.inputField} value={days} onChangeText={setDays} keyboardType="numeric" placeholderTextColor={Colors.TextMuted} />
          </>
        ) : (
          <>
            <Text style={styles.cardTitle}>{split}</Text>
            <Text style={styles.cardSub}>{days} days/week · Trainer-assigned protocol</Text>
          </>
        )}
        <Pressable style={styles.editToggle} onPress={() => setEditMode(!editMode)}>
          <MaterialIcons name={editMode ? 'check' : 'edit'} size={16} color={Colors.Primary} />
          <Text style={styles.editToggleText}>{editMode ? 'SAVE CHANGES' : 'EDIT PLAN'}</Text>
        </Pressable>
      </View>

      <Text style={styles.sectionLabel}>EXERCISE PROTOCOL</Text>
      {MOCK_EXERCISES_CUSTOM.map((ex, i) => (
        <View key={i} style={styles.exerciseRow}>
          <Text style={styles.exNum}>{String(i + 1).padStart(2, '0')}</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.exName}>{ex.name}</Text>
            <Text style={styles.exDetail}>{ex.sets} sets x {ex.reps} reps · {ex.load} · Rest {ex.rest}</Text>
          </View>
        </View>
      ))}
      <Button label="PUSH UPDATED PROTOCOL" onPress={() => {}} size="md" />
    </View>
  );
}

function DietTab({ student, onAssign }: { student: any; onAssign: () => void }) {
  const dp = MOCK_DIET_PLAN;
  const [editMode, setEditMode] = useState(false);
  const [calories, setCalories] = useState('3200');
  const [protein, setProtein] = useState('180');
  const [carbs, setCarbs] = useState('380');
  const [fat, setFat] = useState('90');

  if (!student.dietPlanAssigned) {
    return (
      <View style={styles.section}>
        <View style={styles.emptyCard}>
          <MaterialIcons name="restaurant" size={36} color={Colors.TextMuted} />
          <Text style={styles.emptyTitle}>No Diet Plan Assigned</Text>
          <Text style={styles.emptyDesc}>Assign a custom diet plan to override the student's AI nutrition plan.</Text>
          <Button label="ASSIGN DIET PLAN" onPress={onAssign} size="md" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <View style={[styles.card, { borderColor: Colors.Primary + '44' }]}>
        <View style={styles.planHeader}>
          <MaterialIcons name="verified" size={16} color={Colors.Primary} />
          <Text style={styles.planAssignedText}>STRUCTURED BY TRAINER</Text>
        </View>
        {editMode ? (
          <View style={{ gap: Spacing.sm }}>
            <View style={styles.macroEditRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.fieldLabel}>CALORIES</Text>
                <TextInput style={styles.inputField} value={calories} onChangeText={setCalories} keyboardType="numeric" placeholderTextColor={Colors.TextMuted} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.fieldLabel}>PROTEIN (g)</Text>
                <TextInput style={styles.inputField} value={protein} onChangeText={setProtein} keyboardType="numeric" placeholderTextColor={Colors.TextMuted} />
              </View>
            </View>
            <View style={styles.macroEditRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.fieldLabel}>CARBS (g)</Text>
                <TextInput style={styles.inputField} value={carbs} onChangeText={setCarbs} keyboardType="numeric" placeholderTextColor={Colors.TextMuted} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.fieldLabel}>FAT (g)</Text>
                <TextInput style={styles.inputField} value={fat} onChangeText={setFat} keyboardType="numeric" placeholderTextColor={Colors.TextMuted} />
              </View>
            </View>
          </View>
        ) : (
          <>
            <Text style={styles.cardTitle}>{calories} kcal / day</Text>
            <Text style={styles.cardSub}>{protein}g Protein · {carbs}g Carbs · {fat}g Fat</Text>
          </>
        )}
        <Pressable style={styles.editToggle} onPress={() => setEditMode(!editMode)}>
          <MaterialIcons name={editMode ? 'check' : 'edit'} size={16} color={Colors.Primary} />
          <Text style={styles.editToggleText}>{editMode ? 'SAVE CHANGES' : 'EDIT TARGETS'}</Text>
        </Pressable>
      </View>

      {dp.meals.map((meal, i) => (
        <View key={i} style={styles.mealRow}>
          <Text style={styles.mealTime}>{meal.time}</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.mealLabel}>{meal.label}</Text>
            <Text style={styles.mealDetail}>{meal.calories} kcal · {meal.protein}g protein</Text>
          </View>
        </View>
      ))}
      <Button label="PUSH DIET PROTOCOL" onPress={() => {}} size="md" />
    </View>
  );
}

function NotesTab() {
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState([
    'Focus on depth in squats. Video review recommended.',
    'Increase calories by 200 kcal starting Week 3.',
  ]);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>TRAINER NOTES</Text>
      {notes.map((n, i) => (
        <View key={i} style={styles.noteCard}>
          <MaterialIcons name="note" size={16} color={Colors.Primary} />
          <Text style={styles.noteText}>{n}</Text>
        </View>
      ))}
      <View style={styles.noteInputWrap}>
        <TextInput
          style={styles.noteInput}
          value={note}
          onChangeText={setNote}
          placeholder="Add coaching note or instruction..."
          placeholderTextColor={Colors.TextMuted}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />
        <Pressable
          style={[styles.noteSubmit, note.length > 0 && { backgroundColor: Colors.Primary }]}
          onPress={() => { if (note) { setNotes([...notes, note]); setNote(''); } }}
        >
          <Text style={styles.noteSubmitText}>ADD</Text>
        </Pressable>
      </View>
      <Button label="SEND INSTRUCTION TO STUDENT" onPress={() => {}} variant="outline" size="md" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.Background },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    borderBottomWidth: 1, borderBottomColor: Colors.SurfaceBorder,
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.SurfaceElevated, borderRadius: Radius.md },
  headerTitle: { flex: 1, fontSize: FontSize.lg, color: Colors.TextPrimary, fontWeight: FontWeight.black, letterSpacing: 2, textAlign: 'center' },
  actionBtn: { padding: 4 },
  studentHero: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: Colors.SurfaceBorder,
  },
  studentName: { fontSize: FontSize.xl, color: Colors.TextPrimary, fontWeight: FontWeight.black },
  studentInfo: { fontSize: FontSize.sm, color: Colors.TextSecondary },
  heroMeta: { flexDirection: 'row', gap: Spacing.sm, alignItems: 'center' },
  paymentBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: Radius.full },
  paymentText: { fontSize: FontSize.xs, fontWeight: FontWeight.black, letterSpacing: 1 },
  statsRow: {
    flexDirection: 'row', paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    borderBottomWidth: 1, borderBottomColor: Colors.SurfaceBorder,
  },
  quickStat: { flex: 1, alignItems: 'center', gap: 2 },
  quickStatValue: { fontSize: FontSize.md, fontWeight: FontWeight.black },
  quickStatLabel: { fontSize: FontSize.xs - 1, color: Colors.TextMuted, fontWeight: FontWeight.medium },
  tabsScroll: { borderBottomWidth: 1, borderBottomColor: Colors.SurfaceBorder, maxHeight: 48 },
  tabs: { paddingHorizontal: Spacing.md, flexDirection: 'row' },
  tab: { paddingVertical: 12, paddingHorizontal: Spacing.sm, borderBottomWidth: 2, borderBottomColor: 'transparent', flexDirection: 'row', alignItems: 'center', gap: 4 },
  tabActive: { borderBottomColor: Colors.Primary },
  tabText: { fontSize: FontSize.sm, color: Colors.TextMuted, fontWeight: FontWeight.medium },
  tabTextActive: { color: Colors.Primary, fontWeight: FontWeight.bold },
  feedbackDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#FFD700' },
  scroll: { paddingHorizontal: Spacing.md, paddingTop: Spacing.md },
  section: { gap: Spacing.md },
  sectionLabel: { fontSize: FontSize.xs, color: Colors.TextMuted, fontWeight: FontWeight.black, letterSpacing: 2 },
  card: {
    backgroundColor: Colors.SurfaceCard, borderRadius: Radius.lg,
    padding: Spacing.md, borderWidth: 1, borderColor: Colors.SurfaceBorder, gap: Spacing.md,
  },
  planHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  planAssignedText: { fontSize: FontSize.xs, color: Colors.Primary, fontWeight: FontWeight.black, letterSpacing: 1.5 },
  cardTitle: { fontSize: FontSize.xl, color: Colors.TextPrimary, fontWeight: FontWeight.black },
  cardSub: { fontSize: FontSize.sm, color: Colors.TextSecondary },
  editToggle: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.PrimaryGlow, borderRadius: Radius.md,
    padding: Spacing.sm, alignSelf: 'flex-start',
    borderWidth: 1, borderColor: Colors.Primary + '33',
  },
  editToggleText: { fontSize: FontSize.xs, color: Colors.Primary, fontWeight: FontWeight.black, letterSpacing: 1 },
  fieldLabel: { fontSize: FontSize.xs, color: Colors.TextMuted, fontWeight: FontWeight.black, letterSpacing: 1.5, marginBottom: 4 },
  inputField: {
    backgroundColor: Colors.Background, borderRadius: Radius.sm,
    borderWidth: 1, borderColor: Colors.SurfaceBorder,
    paddingHorizontal: Spacing.md, paddingVertical: 10,
    color: Colors.TextPrimary, fontSize: FontSize.md,
  },
  macroEditRow: { flexDirection: 'row', gap: Spacing.sm },
  planStatus: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  planStatusText: { fontSize: FontSize.md, color: Colors.TextPrimary },
  bioRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingVertical: 4 },
  bioLabel: { flex: 1, fontSize: FontSize.sm, color: Colors.TextSecondary },
  bioVal: { fontSize: FontSize.sm, color: Colors.TextPrimary, fontWeight: FontWeight.semibold },
  emptyCard: {
    backgroundColor: Colors.SurfaceCard, borderRadius: Radius.xl,
    padding: Spacing.xl, borderWidth: 1, borderColor: Colors.SurfaceBorder,
    alignItems: 'center', gap: Spacing.md,
  },
  emptyTitle: { fontSize: FontSize.lg, color: Colors.TextPrimary, fontWeight: FontWeight.bold },
  emptyDesc: { fontSize: FontSize.sm, color: Colors.TextSecondary, textAlign: 'center', lineHeight: 20 },
  exerciseRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.SurfaceCard, borderRadius: Radius.md,
    padding: Spacing.md, borderWidth: 1, borderColor: Colors.SurfaceBorder,
  },
  exNum: { width: 24, fontSize: FontSize.sm, color: Colors.Primary, fontWeight: FontWeight.black },
  exName: { fontSize: FontSize.md, color: Colors.TextPrimary, fontWeight: FontWeight.semibold },
  exDetail: { fontSize: FontSize.sm, color: Colors.TextSecondary, marginTop: 2 },
  mealRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.SurfaceCard, borderRadius: Radius.md,
    padding: Spacing.md, borderWidth: 1, borderColor: Colors.SurfaceBorder,
  },
  mealTime: { fontSize: FontSize.xs, color: Colors.TextMuted, width: 44 },
  mealLabel: { fontSize: FontSize.md, color: Colors.TextPrimary, fontWeight: FontWeight.semibold },
  mealDetail: { fontSize: FontSize.xs, color: Colors.TextSecondary, marginTop: 2 },
  noteCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm,
    backgroundColor: Colors.SurfaceCard, borderRadius: Radius.md,
    padding: Spacing.md, borderWidth: 1, borderColor: Colors.SurfaceBorder,
  },
  noteText: { flex: 1, fontSize: FontSize.sm, color: Colors.TextPrimary, lineHeight: 20 },
  noteInputWrap: { gap: Spacing.sm },
  noteInput: {
    backgroundColor: Colors.SurfaceCard, borderRadius: Radius.md,
    borderWidth: 1, borderColor: Colors.SurfaceBorder,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.md,
    color: Colors.TextPrimary, fontSize: FontSize.md, minHeight: 88,
  },
  noteSubmit: {
    backgroundColor: Colors.SurfaceElevated, borderRadius: Radius.md,
    paddingVertical: 10, alignItems: 'center',
    borderWidth: 1, borderColor: Colors.SurfaceBorder,
  },
  noteSubmitText: { fontSize: FontSize.sm, color: Colors.Primary, fontWeight: FontWeight.black, letterSpacing: 1 },

  // Feedback
  feedbackCard: {
    backgroundColor: Colors.SurfaceCard, borderRadius: Radius.xl,
    padding: Spacing.lg, borderWidth: 1, borderColor: '#FFD70033', gap: Spacing.md,
  },
  feedbackHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  feedbackName: { fontSize: FontSize.md, color: Colors.TextPrimary, fontWeight: FontWeight.bold },
  feedbackGoal: { fontSize: FontSize.sm, color: Colors.TextSecondary },
  feedbackRatingBlock: { alignItems: 'flex-end', gap: 2 },
  starsRow: { flexDirection: 'row', gap: 2 },
  ratingNum: { fontSize: FontSize.sm, color: '#FFD700', fontWeight: FontWeight.black },
  feedbackBody: { flexDirection: 'row', alignItems: 'flex-start' },
  feedbackText: { flex: 1, fontSize: FontSize.md, color: Colors.TextPrimary, lineHeight: 22, fontStyle: 'italic' },
  ratingImpactCard: {
    backgroundColor: Colors.SurfaceCard, borderRadius: Radius.lg,
    padding: Spacing.md, borderWidth: 1, borderColor: Colors.SurfaceBorder, gap: Spacing.sm,
  },
  ratingImpactRow: { flexDirection: 'row', alignItems: 'center' },
  ratingImpactLabel: { flex: 1, fontSize: FontSize.sm, color: Colors.TextSecondary },
  trainerRatingValue: { fontSize: FontSize.xxxl, color: '#FFD700', fontWeight: FontWeight.black },
  ratingBarRow: { gap: 4 },
  ratingBarItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  ratingBarStar: { width: 12, fontSize: FontSize.sm, color: Colors.TextMuted, fontWeight: FontWeight.bold },
  ratingBarTrack: { flex: 1, height: 6, backgroundColor: Colors.SurfaceElevated, borderRadius: 3, overflow: 'hidden' },
  ratingBarFill: { height: 6, backgroundColor: '#FFD700', borderRadius: 3 },
});
