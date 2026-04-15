import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, Pressable, TextInput, Animated, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '@/constants/theme';
import { useUser } from '@/hooks/useUser';

export default function UnlockScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { unlockWithCode, isUnlocked } = useUser();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const glowAnim = useRef(new Animated.Value(0)).current;
  const errorShake = useRef(new Animated.Value(0)).current;
  const successScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration: 1800, useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0.3, duration: 1800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    if (isUnlocked) {
      router.replace('/(tabs)');
    }
  }, [isUnlocked]);

  const handleUnlock = async () => {
    if (!code.trim()) {
      setError('Enter your product code to continue.');
      shakeError();
      return;
    }
    setLoading(true);
    setError('');
    const valid = await unlockWithCode(code);
    if (valid) {
      setSuccess(true);
      Animated.spring(successScale, { toValue: 1, tension: 60, friction: 8, useNativeDriver: true }).start(() => {
        setTimeout(() => router.replace('/(tabs)'), 1200);
      });
    } else {
      setError('Invalid code. Check your purchase confirmation.');
      shakeError();
    }
    setLoading(false);
  };

  const shakeError = () => {
    Animated.sequence([
      Animated.timing(errorShake, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(errorShake, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(errorShake, { toValue: 6, duration: 60, useNativeDriver: true }),
      Animated.timing(errorShake, { toValue: -6, duration: 60, useNativeDriver: true }),
      Animated.timing(errorShake, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const handleSkip = () => {
    router.replace('/(tabs)');
  };

  if (success) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Animated.View style={[styles.successCard, { transform: [{ scale: successScale }] }]}>
          <MaterialIcons name="verified" size={56} color={Colors.Primary} />
          <Text style={styles.successTitle}>ACCESS GRANTED</Text>
          <Text style={styles.successSub}>Full MAVR Ecosystem Unlocked</Text>
        </Animated.View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 40 }]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Glow bg */}
        <Animated.View style={[styles.glowBg, { opacity: glowAnim }]} />

        {/* Logo */}
        <View style={styles.logoBlock}>
          <Image source={require('@/assets/mavr_logo.png')} style={styles.logo} contentFit="contain" />
          <Text style={styles.brand}>MAVR</Text>
          <Text style={styles.tagline}>ATHLETE OPERATING SYSTEM</Text>
        </View>

        {/* Main card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialIcons name="lock" size={22} color={Colors.Primary} />
            <Text style={styles.cardTitle}>ENTER PRODUCT CODE</Text>
          </View>
          <Text style={styles.cardDesc}>
            Enter your unique MAVR product code to unlock full access including Community, Connects, advanced analytics, and the Trainer Ecosystem.
          </Text>

          <Animated.View style={{ transform: [{ translateX: errorShake }] }}>
            <View style={[styles.inputWrap, error ? { borderColor: Colors.Error } : {}]}>
              <MaterialIcons name="vpn-key" size={18} color={error ? Colors.Error : Colors.Primary} style={{ marginRight: 8 }} />
              <TextInput
                style={styles.input}
                value={code}
                onChangeText={(t) => { setCode(t); setError(''); }}
                placeholder="e.g. MAVR-ALPHA-2026"
                placeholderTextColor={Colors.TextMuted}
                autoCapitalize="characters"
                autoCorrect={false}
              />
            </View>
          </Animated.View>

          {error ? (
            <View style={styles.errorRow}>
              <MaterialIcons name="error-outline" size={14} color={Colors.Error} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <Pressable
            style={({ pressed }) => [styles.unlockBtn, pressed && { opacity: 0.85 }, loading && { opacity: 0.6 }]}
            onPress={handleUnlock}
            disabled={loading}
          >
            <MaterialIcons name="lock-open" size={18} color="#fff" />
            <Text style={styles.unlockBtnText}>{loading ? 'VERIFYING...' : 'UNLOCK MAVR'}</Text>
          </Pressable>
        </View>

        {/* What you unlock */}
        <View style={styles.featuresCard}>
          <Text style={styles.featuresTitle}>FULL ACCESS INCLUDES</Text>
          {[
            { icon: 'sensors', text: 'Connects — Partner & Trainer Network' },
            { icon: 'fitness-center', text: 'Advanced Workout & Diet AI System' },
            { icon: 'lock-open', text: 'Vault — Premium Subscriptions & Apparel' },
            { icon: 'military-tech', text: 'Identity System — Ranks, Badges & Frames' },
            { icon: 'dashboard', text: 'Trainer Command Center' },
            { icon: 'analytics', text: 'Redline Analytics & PR Detection' },
          ].map((f) => (
            <View key={f.text} style={styles.featureRow}>
              <MaterialIcons name={f.icon as any} size={16} color={Colors.Primary} />
              <Text style={styles.featureText}>{f.text}</Text>
            </View>
          ))}
        </View>

        {/* Limited access notice */}
        <View style={styles.limitedCard}>
          <MaterialIcons name="info-outline" size={16} color={Colors.TextMuted} />
          <Text style={styles.limitedText}>
            Without a code, you have access to the Home Dashboard only. Upgrade anytime.
          </Text>
        </View>

        <Pressable style={styles.skipBtn} onPress={handleSkip}>
          <Text style={styles.skipText}>Continue with limited access</Text>
          <MaterialIcons name="chevron-right" size={16} color={Colors.TextMuted} />
        </Pressable>

        {/* Demo code hint */}
        <Text style={styles.demoHint}>Demo code: TESTCODE123</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.Background, alignItems: 'center', justifyContent: 'center' },
  scroll: { backgroundColor: Colors.Background, paddingHorizontal: Spacing.lg, gap: Spacing.md, alignItems: 'center' },
  glowBg: {
    position: 'absolute',
    top: '20%', left: '20%',
    width: 300, height: 300, borderRadius: 150,
    backgroundColor: Colors.Primary,
    opacity: 0.06,
  },
  logoBlock: { alignItems: 'center', gap: 8, paddingVertical: Spacing.md },
  logo: { width: 80, height: 66 },
  brand: { fontSize: FontSize.xxxl, color: Colors.TextPrimary, fontWeight: FontWeight.black, letterSpacing: 8 },
  tagline: { fontSize: 10, color: Colors.TextMuted, fontWeight: FontWeight.bold, letterSpacing: 3 },
  card: {
    width: '100%',
    backgroundColor: Colors.SurfaceCard,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.Primary + '44',
    gap: Spacing.md,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cardTitle: { fontSize: FontSize.md, color: Colors.TextPrimary, fontWeight: FontWeight.black, letterSpacing: 2 },
  cardDesc: { fontSize: FontSize.sm, color: Colors.TextSecondary, lineHeight: 22 },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.Background,
    borderRadius: Radius.md,
    borderWidth: 1.5, borderColor: Colors.Primary + '55',
    paddingHorizontal: Spacing.md,
  },
  input: {
    flex: 1, fontSize: FontSize.md, color: Colors.TextPrimary,
    paddingVertical: 14, fontWeight: FontWeight.bold, letterSpacing: 1,
  },
  errorRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  errorText: { fontSize: FontSize.sm, color: Colors.Error },
  unlockBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: Colors.Primary, borderRadius: Radius.md,
    paddingVertical: 16,
  },
  unlockBtnText: { fontSize: FontSize.md, color: '#fff', fontWeight: FontWeight.black, letterSpacing: 2 },
  featuresCard: {
    width: '100%',
    backgroundColor: Colors.SurfaceCard,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    borderWidth: 1, borderColor: Colors.SurfaceBorder,
    gap: Spacing.sm,
  },
  featuresTitle: { fontSize: FontSize.xs, color: Colors.TextMuted, fontWeight: FontWeight.black, letterSpacing: 2, marginBottom: 4 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  featureText: { fontSize: FontSize.sm, color: Colors.TextPrimary, fontWeight: FontWeight.medium },
  limitedCard: {
    width: '100%',
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    backgroundColor: Colors.SurfaceCard, borderRadius: Radius.md,
    padding: Spacing.md, borderWidth: 1, borderColor: Colors.SurfaceBorder,
  },
  limitedText: { flex: 1, fontSize: FontSize.sm, color: Colors.TextMuted, lineHeight: 20 },
  skipBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingVertical: Spacing.sm,
  },
  skipText: { fontSize: FontSize.sm, color: Colors.TextMuted },
  demoHint: { fontSize: FontSize.xs, color: Colors.Primary + '88', letterSpacing: 1, fontWeight: FontWeight.bold },
  successCard: {
    alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.SurfaceCard, borderRadius: Radius.xl,
    padding: Spacing.xl, borderWidth: 1, borderColor: Colors.Primary + '44', margin: Spacing.xl,
  },
  successTitle: { fontSize: FontSize.xxxl, color: Colors.TextPrimary, fontWeight: FontWeight.black, letterSpacing: 3 },
  successSub: { fontSize: FontSize.md, color: Colors.TextSecondary },
});
