import React, { useState, useRef, useEffect } from 'react';
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
import { userService } from '@/services/userService';
import { useUser } from '@/hooks/useUser';
import { Button } from '@/components';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '@/constants/theme';

const STEPS = [
  { id: 'profile', title: 'TRAINER PROFILE', subtitle: 'Your professional identity on MAVR' },
  { id: 'expertise', title: 'YOUR EXPERTISE', subtitle: 'How you coach and what you charge' },
  { id: 'documents', title: 'VERIFICATION', subtitle: 'Submit for MAVR trainer verification' },
  { id: 'pending', title: 'UNDER REVIEW', subtitle: 'Your application is being processed' },
];

const COACHING_TYPES = ['1:1', 'Online', 'Class-Based', 'Hybrid'];
const SPECIALIZATIONS = ['Hypertrophy', 'Strength', 'Fat Loss', 'Athletic Performance', 'Powerlifting', 'Bodybuilding', 'Functional Fitness', 'Nutrition Only'];

export default function TrainerOnboarding() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setRole, setTrainerVerificationStatus, trainerVerificationStatus } = useUser();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [simulatingApproval, setSimulatingApproval] = useState(false);
  const [certFile, setCertFile] = useState('');
  const [idFile, setIdFile] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const dotAnim = useRef(new Animated.Value(0)).current;

  const [form, setForm] = useState({
    name: '',
    displayName: '',
    city: '',
    specialization: 'Hypertrophy',
    experience: '',
    coachingType: '1:1',
    bio: '',
    pricingMonthly: '',
    certificationBody: '',
    yearsActive: '',
  });

  const update = (key: string, val: string) => setForm((f) => ({ ...f, [key]: val }));

  useEffect(() => {
    // If already verified, skip to dashboard
    if (trainerVerificationStatus === 'verified') {
      router.replace('/trainer/dashboard');
    }
    // If pending, jump to pending step
    if (trainerVerificationStatus === 'pending') {
      setCurrentStep(3);
    }
  }, [trainerVerificationStatus]);

  useEffect(() => {
    if (currentStep === 3) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(dotAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
          Animated.timing(dotAnim, { toValue: 0, duration: 900, useNativeDriver: true }),
        ])
      ).start();
    }
  }, [currentStep]);

  const nextStep = async () => {
    if (currentStep === 1) {
      const code = `MAVR-${Math.floor(Math.random() * 90 + 10)}${['RED', 'CORE', 'PROT', 'APEX'][Math.floor(Math.random() * 4)]}`;
      setGeneratedCode(code);
    }
    if (currentStep < STEPS.length - 2) {
      setCurrentStep((s) => s + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
    else router.back();
  };

  const handleSubmitVerification = async () => {
    if (!agreedToTerms) return;
    setLoading(true);
    try {
      await userService.saveTrainer({
        name: form.name || 'Trainer',
        displayName: form.displayName || form.name || 'Trainer',
        city: form.city || 'Mumbai',
        specialization: form.specialization,
        experience: parseInt(form.experience) || 3,
        coachingType: form.coachingType,
        bio: form.bio,
        pricingMonthly: parseInt(form.pricingMonthly) || 3000,
        mavrSignature: generatedCode,
        tier: 'coach',
      });
      await setTrainerVerificationStatus('pending');
      setCurrentStep(3);
    } catch {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  // Simulate admin verification (for demo)
  const handleSimulateApproval = async () => {
    setSimulatingApproval(true);
    await new Promise((r) => setTimeout(r, 2000));
    await setTrainerVerificationStatus('verified');
    await userService.setOnboardingComplete();
    setRole('trainer');
    setSimulatingApproval(false);
    router.replace('/trainer/dashboard');
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
    switch (currentStep) {
      case 0: // Profile
        return (
          <View style={styles.fields}>
            <FieldInput label="FULL NAME" value={form.name} onChangeText={(v: string) => update('name', v)} placeholder="e.g. Vikram Nair" />
            <FieldInput label="TRAINER DISPLAY NAME" value={form.displayName} onChangeText={(v: string) => update('displayName', v)} placeholder="e.g. Coach Vikram" />
            <FieldInput label="CITY" value={form.city} onChangeText={(v: string) => update('city', v)} placeholder="e.g. Mumbai" />
            <FieldInput label="TRAINER BIO" value={form.bio} onChangeText={(v: string) => update('bio', v)} placeholder="Your coaching philosophy and experience..." multiline />
          </View>
        );

      case 1: // Expertise
        return (
          <View style={styles.fields}>
            <Text style={styles.fieldLabel}>SPECIALIZATION</Text>
            <SelectOption options={SPECIALIZATIONS} selected={form.specialization} onSelect={(v) => update('specialization', v)} />
            <Text style={styles.fieldLabel}>COACHING TYPE</Text>
            <SelectOption options={COACHING_TYPES} selected={form.coachingType} onSelect={(v) => update('coachingType', v)} />
            <FieldInput label="YEARS OF EXPERIENCE" value={form.experience} onChangeText={(v: string) => update('experience', v)} placeholder="e.g. 5" keyboardType="numeric" />
            <FieldInput label="MONTHLY COACHING FEE (INR)" value={form.pricingMonthly} onChangeText={(v: string) => update('pricingMonthly', v)} placeholder="e.g. 3500" keyboardType="numeric" />
          </View>
        );

      case 2: // Verification
        return (
          <View style={styles.fields}>
            <View style={styles.verifyInfo}>
              <MaterialIcons name="info-outline" size={18} color={Colors.Primary} />
              <Text style={styles.verifyInfoText}>
                MAVR verifies all trainer profiles before issuing a MAVR Signature. Submit your credentials below. Review typically takes 24-48 hours.
              </Text>
            </View>

            <Text style={styles.fieldLabel}>CERTIFICATION BODY</Text>
            <TextInput
              style={styles.input}
              value={form.certificationBody}
              onChangeText={(v) => update('certificationBody', v)}
              placeholder="e.g. ACE, NASM, CSCS, or None"
              placeholderTextColor={Colors.TextMuted}
            />

            <Text style={styles.fieldLabel}>YEARS ACTIVELY COACHING</Text>
            <TextInput
              style={styles.input}
              value={form.yearsActive}
              onChangeText={(v) => update('yearsActive', v)}
              placeholder="e.g. 4"
              placeholderTextColor={Colors.TextMuted}
              keyboardType="numeric"
            />

            {/* Document Upload Simulation */}
            <Text style={styles.fieldLabel}>CERTIFICATION DOCUMENT</Text>
            <Pressable
              style={styles.uploadBtn}
              onPress={() => setCertFile('Certificate_Vikram_ACE.pdf')}
            >
              {certFile ? (
                <View style={styles.uploadedRow}>
                  <MaterialIcons name="check-circle" size={18} color="#22C55E" />
                  <Text style={styles.uploadedText}>{certFile}</Text>
                </View>
              ) : (
                <View style={styles.uploadedRow}>
                  <MaterialIcons name="upload-file" size={18} color={Colors.Primary} />
                  <Text style={styles.uploadHint}>Tap to upload certificate (PDF/JPG)</Text>
                </View>
              )}
            </Pressable>

            <Text style={styles.fieldLabel}>GOVERNMENT ID</Text>
            <Pressable
              style={styles.uploadBtn}
              onPress={() => setIdFile('Aadhaar_Vikram.pdf')}
            >
              {idFile ? (
                <View style={styles.uploadedRow}>
                  <MaterialIcons name="check-circle" size={18} color="#22C55E" />
                  <Text style={styles.uploadedText}>{idFile}</Text>
                </View>
              ) : (
                <View style={styles.uploadedRow}>
                  <MaterialIcons name="badge" size={18} color={Colors.Primary} />
                  <Text style={styles.uploadHint}>Tap to upload Aadhaar/PAN (PDF/JPG)</Text>
                </View>
              )}
            </Pressable>

            {/* Preview Signature */}
            <View style={styles.sigPreview}>
              <Text style={styles.sigPreviewLabel}>YOUR MAVR SIGNATURE (pending verification)</Text>
              <Text style={styles.sigPreviewCode}>{generatedCode}</Text>
              <Text style={styles.sigPreviewNote}>This code activates after verification is complete.</Text>
            </View>

            {/* Terms */}
            <Pressable style={styles.termsRow} onPress={() => setAgreedToTerms(!agreedToTerms)}>
              <View style={[styles.checkbox, agreedToTerms && styles.checkboxChecked]}>
                {agreedToTerms && <MaterialIcons name="check" size={14} color="#fff" />}
              </View>
              <Text style={styles.termsText}>
                I confirm all submitted information is accurate. I agree to MAVR Trainer Terms of Service and the 10% platform fee on all coaching transactions.
              </Text>
            </Pressable>
          </View>
        );

      case 3: // Pending
        return (
          <View style={styles.pendingView}>
            <Animated.View style={[styles.pendingGlow, { opacity: dotAnim }]} />
            <MaterialIcons name="pending" size={56} color={Colors.Primary} />
            <Text style={styles.pendingTitle}>APPLICATION SUBMITTED</Text>
            <Text style={styles.pendingDesc}>
              Your trainer profile is under review by the MAVR Verification Team. You will receive a notification once approved. This typically takes 24-48 hours.
            </Text>

            <View style={styles.reviewChecklist}>
              {[
                { label: 'Profile Information', done: true },
                { label: 'Expertise & Pricing', done: true },
                { label: 'Document Verification', done: false },
                { label: 'MAVR Team Review', done: false },
                { label: 'Signature Activation', done: false },
              ].map((item) => (
                <View key={item.label} style={styles.checklistRow}>
                  <MaterialIcons
                    name={item.done ? 'check-circle' : 'radio-button-unchecked'}
                    size={18}
                    color={item.done ? '#22C55E' : Colors.TextMuted}
                  />
                  <Text style={[styles.checklistText, item.done && { color: Colors.TextPrimary }]}>
                    {item.label}
                  </Text>
                </View>
              ))}
            </View>

            {/* Demo: Simulate approval */}
            <View style={styles.demoApprovalCard}>
              <MaterialIcons name="admin-panel-settings" size={18} color={Colors.TextMuted} />
              <Text style={styles.demoApprovalText}>Demo: Simulate MAVR admin approval</Text>
              <Pressable
                style={[styles.demoApprovalBtn, simulatingApproval && { opacity: 0.6 }]}
                onPress={handleSimulateApproval}
                disabled={simulatingApproval}
              >
                <Text style={styles.demoApprovalBtnText}>
                  {simulatingApproval ? 'APPROVING...' : 'APPROVE'}
                </Text>
              </Pressable>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {currentStep < 3 && (
          <View style={styles.progressWrap}>
            <Pressable onPress={prevStep} hitSlop={12}>
              <MaterialIcons name="chevron-left" size={28} color={Colors.TextSecondary} />
            </Pressable>
            <View style={styles.progressBar}>
              {STEPS.slice(0, 3).map((s, i) => (
                <View key={s.id} style={[styles.progressDot, i <= currentStep && styles.progressDotActive, i === currentStep && styles.progressDotCurrent]} />
              ))}
            </View>
            <Text style={styles.stepCount}>{currentStep + 1}/3</Text>
          </View>
        )}

        <View style={styles.stepHeader}>
          <Text style={styles.stepTitle}>{STEPS[currentStep].title}</Text>
          <Text style={styles.stepSubtitle}>{STEPS[currentStep].subtitle}</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {renderStep()}
        </ScrollView>

        {currentStep < 2 && (
          <View style={[styles.footer, { paddingBottom: insets.bottom + Spacing.md }]}>
            <Button label="CONTINUE" onPress={nextStep} />
          </View>
        )}
        {currentStep === 2 && (
          <View style={[styles.footer, { paddingBottom: insets.bottom + Spacing.md }]}>
            <Button
              label={loading ? 'SUBMITTING...' : 'SUBMIT FOR VERIFICATION'}
              onPress={handleSubmitVerification}
              loading={loading}
            />
            {!agreedToTerms && (
              <Text style={styles.termsWarning}>Please agree to the terms above to continue.</Text>
            )}
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

function FieldInput({ label, value, onChangeText, placeholder, keyboardType, multiline }: any) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.inputMulti]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.TextMuted}
        keyboardType={keyboardType || 'default'}
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
        autoCapitalize="words"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.Background },
  progressWrap: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, gap: Spacing.sm },
  progressBar: { flex: 1, flexDirection: 'row', gap: 6 },
  progressDot: { flex: 1, height: 3, borderRadius: 2, backgroundColor: Colors.SurfaceElevated },
  progressDotActive: { backgroundColor: Colors.Primary + '66' },
  progressDotCurrent: { backgroundColor: Colors.Primary },
  stepCount: { fontSize: FontSize.sm, color: Colors.TextMuted, fontWeight: FontWeight.medium },
  stepHeader: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.md, gap: 4 },
  stepTitle: { fontSize: FontSize.xxl, color: Colors.TextPrimary, fontWeight: FontWeight.black, letterSpacing: 2 },
  stepSubtitle: { fontSize: FontSize.md, color: Colors.TextSecondary },
  scroll: { paddingHorizontal: Spacing.md, paddingBottom: 120 },
  fields: { gap: Spacing.md },
  fieldWrap: { gap: 8 },
  fieldLabel: { fontSize: FontSize.xs, color: Colors.TextMuted, fontWeight: FontWeight.bold, letterSpacing: 1.5 },
  input: {
    backgroundColor: Colors.SurfaceCard, borderRadius: Radius.md,
    borderWidth: 1, borderColor: Colors.SurfaceBorder,
    paddingHorizontal: Spacing.md, paddingVertical: 14,
    color: Colors.TextPrimary, fontSize: FontSize.base,
  },
  inputMulti: { height: 90, textAlignVertical: 'top', paddingTop: 14 },
  optionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  option: {
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    borderRadius: Radius.full, borderWidth: 1,
    borderColor: Colors.SurfaceBorder, backgroundColor: Colors.SurfaceCard,
  },
  optionSelected: { backgroundColor: Colors.PrimaryGlow, borderColor: Colors.Primary },
  optionText: { fontSize: FontSize.sm, color: Colors.TextSecondary, fontWeight: FontWeight.medium },
  optionTextSelected: { color: Colors.Primary, fontWeight: FontWeight.bold },
  footer: { paddingHorizontal: Spacing.md, paddingTop: Spacing.md, gap: Spacing.sm },

  // Verification step
  verifyInfo: {
    flexDirection: 'row', gap: Spacing.sm, alignItems: 'flex-start',
    backgroundColor: Colors.PrimaryGlow, borderRadius: Radius.md,
    padding: Spacing.md, borderWidth: 1, borderColor: Colors.Primary + '33',
  },
  verifyInfoText: { flex: 1, fontSize: FontSize.sm, color: Colors.TextSecondary, lineHeight: 20 },
  uploadBtn: {
    backgroundColor: Colors.SurfaceCard, borderRadius: Radius.md,
    borderWidth: 1, borderColor: Colors.SurfaceBorder,
    borderStyle: 'dashed', padding: Spacing.md,
  },
  uploadedRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  uploadedText: { flex: 1, fontSize: FontSize.sm, color: '#22C55E', fontWeight: FontWeight.medium },
  uploadHint: { flex: 1, fontSize: FontSize.sm, color: Colors.TextMuted },
  sigPreview: {
    backgroundColor: Colors.SurfaceCard, borderRadius: Radius.lg,
    padding: Spacing.md, borderWidth: 1, borderColor: Colors.Primary + '33',
    alignItems: 'center', gap: 6,
  },
  sigPreviewLabel: { fontSize: FontSize.xs, color: Colors.TextMuted, fontWeight: FontWeight.bold, letterSpacing: 2 },
  sigPreviewCode: { fontSize: FontSize.xxl, color: Colors.Primary + '88', fontWeight: FontWeight.black, letterSpacing: 4 },
  sigPreviewNote: { fontSize: FontSize.xs, color: Colors.TextMuted },
  termsRow: { flexDirection: 'row', gap: Spacing.sm, alignItems: 'flex-start' },
  checkbox: {
    width: 22, height: 22, borderRadius: 4,
    borderWidth: 1.5, borderColor: Colors.SurfaceBorder,
    backgroundColor: Colors.SurfaceCard,
    alignItems: 'center', justifyContent: 'center', marginTop: 2,
  },
  checkboxChecked: { backgroundColor: Colors.Primary, borderColor: Colors.Primary },
  termsText: { flex: 1, fontSize: FontSize.sm, color: Colors.TextSecondary, lineHeight: 20 },
  termsWarning: { fontSize: FontSize.xs, color: Colors.Error, textAlign: 'center' },

  // Pending step
  pendingView: {
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.xl,
    alignItems: 'center', gap: Spacing.lg, position: 'relative',
  },
  pendingGlow: {
    position: 'absolute', top: 60, width: 200, height: 200, borderRadius: 100,
    backgroundColor: Colors.Primary, opacity: 0.1,
  },
  pendingTitle: { fontSize: FontSize.xxl, color: Colors.TextPrimary, fontWeight: FontWeight.black, letterSpacing: 2, textAlign: 'center' },
  pendingDesc: { fontSize: FontSize.md, color: Colors.TextSecondary, textAlign: 'center', lineHeight: 24 },
  reviewChecklist: {
    width: '100%', gap: Spacing.sm,
    backgroundColor: Colors.SurfaceCard, borderRadius: Radius.xl,
    padding: Spacing.lg, borderWidth: 1, borderColor: Colors.SurfaceBorder,
  },
  checklistRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  checklistText: { fontSize: FontSize.md, color: Colors.TextMuted, fontWeight: FontWeight.medium },
  demoApprovalCard: {
    width: '100%', flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: Colors.SurfaceElevated, borderRadius: Radius.md,
    padding: Spacing.md, borderWidth: 1, borderColor: Colors.SurfaceBorder,
  },
  demoApprovalText: { flex: 1, fontSize: FontSize.xs, color: Colors.TextMuted },
  demoApprovalBtn: {
    backgroundColor: Colors.Primary, borderRadius: Radius.sm,
    paddingHorizontal: Spacing.md, paddingVertical: 6,
  },
  demoApprovalBtnText: { fontSize: FontSize.xs, color: '#fff', fontWeight: FontWeight.black, letterSpacing: 1 },
});
