import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Platform,
  KeyboardAvoidingView,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUser } from '@/hooks/useUser';
import { Button } from '@/components';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '@/constants/theme';
import { GOALS, DIET_PREFERENCES, EQUIPMENT_OPTIONS } from '@/constants/config';

const STEPS = [
  { id: 'basics', title: 'YOUR BASICS', subtitle: 'Let MAVR know who you are' },
  { id: 'body', title: 'BODY METRICS', subtitle: 'Your current physical state' },
  { id: 'training', title: 'TRAINING PROFILE', subtitle: 'Your gym experience and setup' },
  { id: 'nutrition', title: 'NUTRITION PROFILE', subtitle: 'Your diet preferences and habits' },
  { id: 'identity', title: 'MAVR IDENTITY', subtitle: 'Your athlete classification' },
];

export default function IndividualOnboarding() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { completeOnboarding, role } = useUser();

  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const [form, setForm] = useState({
    name: '',
    age: '',
    city: '',
    height: '',
    weight: '',
    targetWeight: '',
    goal: 'Muscle Gain',
    trainingAge: '',
    workoutFrequency: '4',
    gymType: 'Gym',
    equipment: 'Full Gym',
    dietPreference: 'Non-Vegetarian',
    mealsPerDay: '4',
    sleep: '7',
    water: '3',
    tier: 'starter',
  });

  const update = (key: string, val: string) => setForm((f) => ({ ...f, [key]: val }));

  const animateForward = () => {
    Animated.sequence([
      Animated.timing(slideAnim, { toValue: -20, duration: 150, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
    ]).start();
  };

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      animateForward();
      setCurrentStep((s) => s + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
    else router.back();
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      await completeOnboarding({
        name: form.name || 'Athlete',
        age: parseInt(form.age) || 22,
        city: form.city || 'Mumbai',
        height: parseInt(form.height) || 175,
        weight: parseInt(form.weight) || 75,
        targetWeight: parseInt(form.targetWeight) || 80,
        goal: form.goal,
        trainingAge: parseInt(form.trainingAge) || 1,
        workoutFrequency: parseInt(form.workoutFrequency) || 4,
        gymType: form.gymType,
        dietPreference: form.dietPreference,
        tier: 'starter',
        rank: 'STARTER',
        points: 0,
        streak: 0,
        adherenceScore: 0,
        badges: [],
        connectedTrainer: null,
        avatar: (form.name || 'A').charAt(0).toUpperCase(),
        role: (role as any) || 'individual',
      });

      if (role === 'student') {
        router.replace('/onboarding/connect');
      } else {
        router.replace('/(tabs)');
      }
    } catch {
      setLoading(false);
    }
  };

  const SelectOption = ({ options, selected, onSelect }: { options: string[]; selected: string; onSelect: (v: string) => void }) => (
    <View style={styles.optionGrid}>
      {options.map((opt) => (
        <Pressable
          key={opt}
          style={[styles.option, selected === opt && styles.optionSelected]}
          onPress={() => onSelect(opt)}
        >
          <Text style={[styles.optionText, selected === opt && styles.optionTextSelected]}>{opt}</Text>
        </Pressable>
      ))}
    </View>
  );

  const renderStep = () => {
    switch (STEPS[currentStep].id) {
      case 'basics':
        return (
          <View style={styles.fields}>
            <FieldInput label="FULL NAME" value={form.name} onChangeText={(v) => update('name', v)} placeholder="e.g. Arjun Mehta" />
            <FieldInput label="AGE" value={form.age} onChangeText={(v) => update('age', v)} placeholder="e.g. 24" keyboardType="numeric" />
            <FieldInput label="CITY" value={form.city} onChangeText={(v) => update('city', v)} placeholder="e.g. Mumbai" />
          </View>
        );
      case 'body':
        return (
          <View style={styles.fields}>
            <FieldInput label="HEIGHT (cm)" value={form.height} onChangeText={(v) => update('height', v)} placeholder="e.g. 178" keyboardType="numeric" />
            <FieldInput label="CURRENT WEIGHT (kg)" value={form.weight} onChangeText={(v) => update('weight', v)} placeholder="e.g. 78" keyboardType="numeric" />
            <FieldInput label="TARGET WEIGHT (kg)" value={form.targetWeight} onChangeText={(v) => update('targetWeight', v)} placeholder="e.g. 85" keyboardType="numeric" />
          </View>
        );
      case 'training':
        return (
          <View style={styles.fields}>
            <Text style={styles.fieldLabel}>PRIMARY GOAL</Text>
            <SelectOption options={GOALS} selected={form.goal} onSelect={(v) => update('goal', v)} />
            <Text style={styles.fieldLabel}>GYM TYPE</Text>
            <SelectOption options={['Gym', 'Home', 'Hybrid']} selected={form.gymType} onSelect={(v) => update('gymType', v)} />
            <Text style={styles.fieldLabel}>AVAILABLE EQUIPMENT</Text>
            <SelectOption options={EQUIPMENT_OPTIONS} selected={form.equipment} onSelect={(v) => update('equipment', v)} />
            <FieldInput label="TRAINING AGE (years)" value={form.trainingAge} onChangeText={(v) => update('trainingAge', v)} placeholder="e.g. 2" keyboardType="numeric" />
          </View>
        );
      case 'nutrition':
        return (
          <View style={styles.fields}>
            <Text style={styles.fieldLabel}>DIET PREFERENCE</Text>
            <SelectOption options={DIET_PREFERENCES} selected={form.dietPreference} onSelect={(v) => update('dietPreference', v)} />
            <FieldInput label="MEALS PER DAY" value={form.mealsPerDay} onChangeText={(v) => update('mealsPerDay', v)} placeholder="e.g. 4" keyboardType="numeric" />
            <FieldInput label="SLEEP (hours)" value={form.sleep} onChangeText={(v) => update('sleep', v)} placeholder="e.g. 7" keyboardType="numeric" />
            <FieldInput label="DAILY WATER (liters)" value={form.water} onChangeText={(v) => update('water', v)} placeholder="e.g. 3" keyboardType="numeric" />
          </View>
        );
      case 'identity':
        return (
          <View style={styles.fields}>
            <View style={styles.identityCard}>
              <MaterialIcons name="shield" size={48} color={Colors.Primary} />
              <Text style={styles.identityTitle}>MAVR ATHLETE</Text>
              <Text style={styles.identitySubtitle}>Your MAVR identity is being calibrated. You will start at the STARTER tier and unlock higher ranks through consistency and performance.</Text>
              <View style={styles.tiers}>
                {['STARTER', 'CORE', 'REDLINE', 'ASCEND', 'ELITE'].map((tier, i) => (
                  <View key={tier} style={[styles.tierPip, i === 0 && styles.tierPipActive]}>
                    <Text style={[styles.tierLabel, i === 0 && styles.tierLabelActive]}>{tier}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Progress */}
        <View style={styles.progressWrap}>
          <Pressable onPress={prevStep} hitSlop={12} style={styles.backBtn}>
            <MaterialIcons name="chevron-left" size={28} color={Colors.TextSecondary} />
          </Pressable>
          <View style={styles.progressBar}>
            {STEPS.map((s, i) => (
              <View key={s.id} style={[styles.progressDot, i <= currentStep && styles.progressDotActive, i === currentStep && styles.progressDotCurrent]} />
            ))}
          </View>
          <Text style={styles.stepCount}>{currentStep + 1}/{STEPS.length}</Text>
        </View>

        {/* Header */}
        <Animated.View style={[styles.stepHeader, { transform: [{ translateX: slideAnim }] }]}>
          <Text style={styles.stepTitle}>{STEPS[currentStep].title}</Text>
          <Text style={styles.stepSubtitle}>{STEPS[currentStep].subtitle}</Text>
        </Animated.View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <Animated.View style={{ transform: [{ translateX: slideAnim }] }}>
            {renderStep()}
          </Animated.View>
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: insets.bottom + Spacing.md }]}>
          {currentStep < STEPS.length - 1 ? (
            <Button label="CONTINUE" onPress={nextStep} />
          ) : (
            <Button label="ENTER MAVR" onPress={handleFinish} loading={loading} />
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

function FieldInput({ label, value, onChangeText, placeholder, keyboardType }: any) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.TextMuted}
        keyboardType={keyboardType || 'default'}
        autoCapitalize="words"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.Background },
  progressWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  backBtn: { padding: 4 },
  progressBar: { flex: 1, flexDirection: 'row', gap: 6, alignItems: 'center' },
  progressDot: { flex: 1, height: 3, borderRadius: 2, backgroundColor: Colors.SurfaceElevated },
  progressDotActive: { backgroundColor: Colors.Primary + '66' },
  progressDotCurrent: { backgroundColor: Colors.Primary },
  stepCount: { fontSize: FontSize.sm, color: Colors.TextMuted, fontWeight: FontWeight.medium },
  stepHeader: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.md, gap: 4 },
  stepTitle: { fontSize: FontSize.xxl, color: Colors.TextPrimary, fontWeight: FontWeight.black, letterSpacing: 2 },
  stepSubtitle: { fontSize: FontSize.md, color: Colors.TextSecondary },
  scroll: { paddingHorizontal: Spacing.md, paddingBottom: 100 },
  fields: { gap: Spacing.md },
  fieldWrap: { gap: 8 },
  fieldLabel: { fontSize: FontSize.xs, color: Colors.TextMuted, fontWeight: FontWeight.bold, letterSpacing: 1.5 },
  input: {
    backgroundColor: Colors.SurfaceCard,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.SurfaceBorder,
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    color: Colors.TextPrimary,
    fontSize: FontSize.base,
    fontWeight: FontWeight.medium,
  },
  optionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  option: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.SurfaceBorder,
    backgroundColor: Colors.SurfaceCard,
  },
  optionSelected: { backgroundColor: Colors.PrimaryGlow, borderColor: Colors.Primary },
  optionText: { fontSize: FontSize.sm, color: Colors.TextSecondary, fontWeight: FontWeight.medium },
  optionTextSelected: { color: Colors.Primary, fontWeight: FontWeight.bold },
  footer: { paddingHorizontal: Spacing.md, paddingTop: Spacing.md },
  identityCard: {
    alignItems: 'center',
    backgroundColor: Colors.SurfaceCard,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.Primary + '33',
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
  identityTitle: { fontSize: FontSize.xxxl, color: Colors.TextPrimary, fontWeight: FontWeight.black, letterSpacing: 4 },
  identitySubtitle: { fontSize: FontSize.md, color: Colors.TextSecondary, textAlign: 'center', lineHeight: 22 },
  tiers: { flexDirection: 'row', gap: Spacing.xs, marginTop: Spacing.sm },
  tierPip: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.full,
    backgroundColor: Colors.SurfaceElevated,
  },
  tierPipActive: { backgroundColor: Colors.Primary + '22', borderWidth: 1, borderColor: Colors.Primary },
  tierLabel: { fontSize: FontSize.xs, color: Colors.TextMuted, fontWeight: FontWeight.bold },
  tierLabelActive: { color: Colors.Primary },
});
