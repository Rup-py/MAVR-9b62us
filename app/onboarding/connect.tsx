import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, Animated, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { userService } from '@/services/userService';
import { useUser } from '@/hooks/useUser';
import { Button } from '@/components';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '@/constants/theme';

export default function ConnectTrainerScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { completeOnboarding } = useUser();

  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'searching' | 'success' | 'error'>('idle');
  const [trainerName, setTrainerName] = useState('');

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const successAnim = useRef(new Animated.Value(0)).current;

  const startPulse = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.15, duration: 600, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      ]),
      { iterations: 4 }
    ).start();
  };

  const handleConnect = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setStatus('searching');
    startPulse();

    await new Promise((res) => setTimeout(res, 2000));

    const result = await userService.connectToTrainer(code.trim());
    if (result.success && result.trainer) {
      setTrainerName(result.trainer.displayName);
      setStatus('success');
      Animated.timing(successAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
    } else {
      setStatus('error');
    }
    setLoading(false);
  };

  const handleContinue = async () => {
    await userService.setOnboardingComplete();
    router.replace('/(tabs)');
  };

  const handleSkip = async () => {
    await userService.setOnboardingComplete();
    router.replace('/(tabs)');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + Spacing.lg }]}>
      <View style={styles.header}>
        <MaterialIcons name="link" size={40} color={Colors.Primary} />
        <Text style={styles.title}>CONNECT TO TRAINER</Text>
        <Text style={styles.subtitle}>Enter your trainer's MAVR Signature to sync your profile and receive assigned plans.</Text>
      </View>

      <View style={styles.example}>
        <Text style={styles.exampleLabel}>EXAMPLE SIGNATURES</Text>
        <View style={styles.exampleRow}>
          {['MAVR-77RED', 'MAVR-12CORE', 'MAVR-X91PROT'].map((s) => (
            <Pressable key={s} style={styles.exampleChip} onPress={() => setCode(s)}>
              <Text style={styles.exampleText}>{s}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.inputWrap}>
        <Text style={styles.inputLabel}>MAVR SIGNATURE</Text>
        <TextInput
          style={styles.input}
          value={code}
          onChangeText={setCode}
          placeholder="MAVR-XXXXX"
          placeholderTextColor={Colors.TextMuted}
          autoCapitalize="characters"
          autoCorrect={false}
        />
      </View>

      {status === 'searching' && (
        <Animated.View style={[styles.searchingWrap, { transform: [{ scale: pulseAnim }] }]}>
          <View style={styles.searchingOrb} />
          <Text style={styles.searchingText}>SYNCING WITH TRAINER...</Text>
        </Animated.View>
      )}

      {status === 'success' && (
        <Animated.View style={[styles.successCard, { opacity: successAnim }]}>
          <MaterialIcons name="check-circle" size={36} color={Colors.Success} />
          <Text style={styles.successTitle}>TRAINER CONNECTED</Text>
          <Text style={styles.successName}>{trainerName}</Text>
          <Text style={styles.successDesc}>Your trainer has been notified. Assigned plans will appear on your dashboard.</Text>
        </Animated.View>
      )}

      {status === 'error' && (
        <View style={styles.errorCard}>
          <MaterialIcons name="error-outline" size={28} color={Colors.Error} />
          <Text style={styles.errorText}>Invalid MAVR Signature. Verify the code with your trainer and try again.</Text>
        </View>
      )}

      <View style={[styles.footer, { paddingBottom: insets.bottom + Spacing.md }]}>
        {status === 'success' ? (
          <Button label="ENTER MAVR" onPress={handleContinue} />
        ) : (
          <>
            <Button label="CONNECT TRAINER" onPress={handleConnect} loading={loading} disabled={!code.trim()} />
            <Pressable onPress={handleSkip} style={styles.skipBtn}>
              <Text style={styles.skipText}>Skip for now, connect later</Text>
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.Background, paddingHorizontal: Spacing.md },
  header: { alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.xl },
  title: { fontSize: FontSize.xxl, color: Colors.TextPrimary, fontWeight: FontWeight.black, letterSpacing: 3, textAlign: 'center' },
  subtitle: { fontSize: FontSize.md, color: Colors.TextSecondary, textAlign: 'center', lineHeight: 22 },
  example: { gap: Spacing.sm, marginBottom: Spacing.lg },
  exampleLabel: { fontSize: FontSize.xs, color: Colors.TextMuted, fontWeight: FontWeight.bold, letterSpacing: 1.5 },
  exampleRow: { flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap' },
  exampleChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.SurfaceCard,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.SurfaceBorder,
  },
  exampleText: { fontSize: FontSize.sm, color: Colors.TextSecondary, fontWeight: FontWeight.medium },
  inputWrap: { gap: 8, marginBottom: Spacing.lg },
  inputLabel: { fontSize: FontSize.xs, color: Colors.TextMuted, fontWeight: FontWeight.bold, letterSpacing: 1.5 },
  input: {
    backgroundColor: Colors.SurfaceCard,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.Primary + '44',
    paddingHorizontal: Spacing.md,
    paddingVertical: 16,
    color: Colors.Primary,
    fontSize: FontSize.xl,
    fontWeight: FontWeight.black,
    letterSpacing: 3,
    textAlign: 'center',
  },
  searchingWrap: { alignItems: 'center', gap: Spacing.md, paddingVertical: Spacing.lg },
  searchingOrb: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.Primary + '33',
    borderWidth: 2,
    borderColor: Colors.Primary,
  },
  searchingText: { fontSize: FontSize.sm, color: Colors.Primary, fontWeight: FontWeight.bold, letterSpacing: 2 },
  successCard: {
    backgroundColor: Colors.SurfaceCard,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.Success + '44',
    alignItems: 'center',
    gap: Spacing.md,
  },
  successTitle: { fontSize: FontSize.lg, color: Colors.Success, fontWeight: FontWeight.black, letterSpacing: 2 },
  successName: { fontSize: FontSize.xxl, color: Colors.TextPrimary, fontWeight: FontWeight.bold },
  successDesc: { fontSize: FontSize.sm, color: Colors.TextSecondary, textAlign: 'center', lineHeight: 20 },
  errorCard: {
    backgroundColor: Colors.Error + '11',
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.Error + '44',
    padding: Spacing.md,
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'center',
  },
  errorText: { flex: 1, fontSize: FontSize.sm, color: Colors.Error, lineHeight: 20 },
  footer: { marginTop: 'auto', gap: Spacing.md },
  skipBtn: { alignItems: 'center', paddingVertical: Spacing.sm },
  skipText: { fontSize: FontSize.sm, color: Colors.TextMuted, textDecorationLine: 'underline' },
});
