import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUser } from '@/hooks/useUser';
import { AvatarFrame, RankBadge, TrainerBadge, DashboardCard, CheckInBar, StatBar } from '@/components';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '@/constants/theme';
import { MOCK_USER, MOCK_WORKOUT_PLAN, MOCK_DIET_PLAN, MOCK_BIOMETRICS, computeRedlineScore } from '@/services/mockData';

// ── Redline Gauge ────────────────────────────────────────────────────────────
function RedlineGauge({ score }: { score: number }) {
  const fillAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.timing(fillAnim, { toValue: score / 100, duration: 1400, useNativeDriver: false }).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0.4, duration: 900, useNativeDriver: true }),
      ])
    ).start();
  }, [score]);

  const isDrifting = score < 70;
  const color = isDrifting ? '#666666' : score >= 90 ? '#FF4444' : Colors.Primary;

  return (
    <View style={[gaugeStyles.container, isDrifting && gaugeStyles.driftMode]}>
      <View style={gaugeStyles.topRow}>
        <View>
          <Text style={gaugeStyles.label}>REDLINE ADHERENCE</Text>
          <Text style={[gaugeStyles.score, { color }]}>{score}</Text>
          <Text style={gaugeStyles.unit}>EXECUTION SCORE</Text>
        </View>
        <View style={gaugeStyles.rightCol}>
          {isDrifting ? (
            <Animated.View style={[gaugeStyles.driftAlert, { opacity: glowAnim }]}>
              <MaterialIcons name="warning" size={14} color="#F59E0B" />
              <Text style={gaugeStyles.driftText}>DRIFT ALERT</Text>
            </Animated.View>
          ) : (
            <Animated.View style={[gaugeStyles.statusOk, { opacity: glowAnim }]}>
              <MaterialIcons name="bolt" size={14} color={color} />
              <Text style={[gaugeStyles.statusText, { color }]}>
                {score >= 90 ? 'REDLINE' : 'ON TRACK'}
              </Text>
            </Animated.View>
          )}
          <Text style={gaugeStyles.subscoreLabel}>40% NUTRITION</Text>
          <Text style={gaugeStyles.subscoreLabel}>40% TRAINING</Text>
          <Text style={gaugeStyles.subscoreLabel}>20% RECOVERY</Text>
        </View>
      </View>

      {/* Bar */}
      <View style={gaugeStyles.track}>
        {Array.from({ length: 10 }).map((_, i) => {
          const seg = (i + 1) * 10;
          const filled = seg <= score;
          const segColor = seg <= 70 ? '#F59E0B' : seg <= 90 ? Colors.Primary : '#FF4444';
          return (
            <View
              key={i}
              style={[gaugeStyles.segment, filled && { backgroundColor: segColor }]}
            />
          );
        })}
      </View>

      {/* Sub-scores */}
      <View style={gaugeStyles.subRow}>
        <SubScore label="NUTRITION" value={88} color="#22C55E" />
        <SubScore label="TRAINING" value={91} color={Colors.Primary} />
        <SubScore label="RECOVERY" value={72} color="#818CF8" />
      </View>
    </View>
  );
}

function SubScore({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <View style={gaugeStyles.subScoreItem}>
      <Text style={[gaugeStyles.subScoreVal, { color }]}>{value}%</Text>
      <Text style={gaugeStyles.subScoreLabel}>{label}</Text>
    </View>
  );
}

const gaugeStyles = StyleSheet.create({
  container: {
    backgroundColor: Colors.SurfaceCard,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.Primary + '44',
    gap: Spacing.md,
  },
  driftMode: {
    borderColor: '#F59E0B44',
    backgroundColor: '#111108',
  },
  topRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  label: { fontSize: FontSize.xs, color: Colors.TextMuted, fontWeight: FontWeight.black, letterSpacing: 2 },
  score: { fontSize: 56, fontWeight: FontWeight.black, lineHeight: 60 },
  unit: { fontSize: FontSize.xs, color: Colors.TextMuted, letterSpacing: 1.5 },
  rightCol: { alignItems: 'flex-end', gap: 4 },
  driftAlert: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#F59E0B22', borderRadius: Radius.full,
    paddingHorizontal: 8, paddingVertical: 4,
    borderWidth: 1, borderColor: '#F59E0B44',
    marginBottom: 8,
  },
  driftText: { fontSize: FontSize.xs, color: '#F59E0B', fontWeight: FontWeight.black, letterSpacing: 1 },
  statusOk: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    borderRadius: Radius.full,
    paddingHorizontal: 8, paddingVertical: 4,
    borderWidth: 1, borderColor: Colors.Primary + '44',
    backgroundColor: Colors.PrimaryGlow,
    marginBottom: 8,
  },
  statusText: { fontSize: FontSize.xs, fontWeight: FontWeight.black, letterSpacing: 1 },
  subscoreLabel: { fontSize: 10, color: Colors.TextMuted, letterSpacing: 1 },
  track: { flexDirection: 'row', gap: 3, height: 8 },
  segment: {
    flex: 1,
    height: 8,
    borderRadius: 2,
    backgroundColor: Colors.SurfaceElevated,
  },
  subRow: { flexDirection: 'row', justifyContent: 'space-between' },
  subScoreItem: { alignItems: 'center', gap: 2 },
  subScoreVal: { fontSize: FontSize.xl, fontWeight: FontWeight.black },
  subScoreLabel: { fontSize: 9, color: Colors.TextMuted, letterSpacing: 1.5, fontWeight: FontWeight.bold },
});

// ── Smartwatch Panel ─────────────────────────────────────────────────────────
function SmartWatchPanel() {
  const [connected, setConnected] = useState(false);
  const [scanning, setScanning] = useState(false);
  const scanAnim = useRef(new Animated.Value(0)).current;
  const [bio, setBio] = useState(MOCK_BIOMETRICS);

  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (connected) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.15, duration: 600, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        ])
      ).start();
      // Simulate live data updates
      const interval = setInterval(() => {
        setBio((prev) => ({
          ...prev,
          heartRate: 68 + Math.floor(Math.random() * 12),
          steps: prev.steps + Math.floor(Math.random() * 20),
          caloriesBurned: prev.caloriesBurned + Math.floor(Math.random() * 3),
        }));
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [connected]);

  const handleConnect = () => {
    setScanning(true);
    Animated.loop(
      Animated.timing(scanAnim, { toValue: 1, duration: 1200, useNativeDriver: true })
    ).start();
    setTimeout(() => {
      setScanning(false);
      scanAnim.stopAnimation();
      setConnected(true);
      setBio((prev) => ({ ...prev, connected: true }));
    }, 2800);
  };

  const stressColor = bio.stressLoad < 30 ? '#22C55E' : bio.stressLoad < 60 ? '#F59E0B' : '#EF4444';
  const readiness = Math.round(100 - bio.stressLoad * 0.4 - (bio.sleepDebt * 8));
  const readinessColor = readiness >= 75 ? '#22C55E' : readiness >= 55 ? '#F59E0B' : '#EF4444';

  if (!connected) {
    return (
      <View style={watchStyles.disconnected}>
        <View style={watchStyles.disconnectedHeader}>
          <MaterialIcons name="watch" size={22} color={Colors.TextMuted} />
          <Text style={watchStyles.disconnectedTitle}>SMARTWATCH</Text>
          <View style={watchStyles.offlineDot} />
        </View>
        <Text style={watchStyles.disconnectedSub}>
          Connect your smartwatch to enable live biometric tracking and Readiness Index.
        </Text>
        <Pressable
          style={[watchStyles.connectBtn, scanning && watchStyles.connectBtnScanning]}
          onPress={!scanning ? handleConnect : undefined}
        >
          {scanning ? (
            <>
              <Animated.View style={[watchStyles.scanDot, {
                opacity: scanAnim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 0.2, 1] })
              }]} />
              <Text style={watchStyles.connectBtnText}>SCANNING FOR DEVICE...</Text>
            </>
          ) : (
            <>
              <MaterialIcons name="bluetooth" size={16} color={Colors.Primary} />
              <Text style={watchStyles.connectBtnText}>CONNECT VIA BLUETOOTH</Text>
            </>
          )}
        </Pressable>
      </View>
    );
  }

  return (
    <View style={watchStyles.connected}>
      <View style={watchStyles.connectedHeader}>
        <Animated.View style={[watchStyles.liveDot, { transform: [{ scale: pulseAnim }] }]} />
        <Text style={watchStyles.connectedTitle}>LIVE BIOMETRICS</Text>
        <Text style={watchStyles.deviceName}>Garmin Connect</Text>
      </View>

      <View style={watchStyles.metricsGrid}>
        <BioMetric icon="favorite" label="HEART RATE" value={`${bio.heartRate}`} unit="bpm" color="#EF4444" live />
        <BioMetric icon="psychology" label="HRV" value={`${bio.hrv}`} unit="ms" color="#818CF8" />
        <BioMetric icon="directions-walk" label="STEPS" value={bio.steps.toLocaleString()} unit={`/ ${bio.stepGoal.toLocaleString()}`} color="#22C55E" />
        <BioMetric icon="local-fire-department" label="BURNED" value={`${bio.caloriesBurned}`} unit="kcal" color={Colors.Primary} live />
        <BioMetric icon="nights-stay" label="SLEEP" value={`${bio.sleepHours}`} unit="hrs" color="#818CF8" />
        <BioMetric icon="bloodtype" label="SpO2" value={`${bio.bloodOxygen}`} unit="%" color="#22C55E" />
      </View>

      {/* Readiness Index */}
      <View style={watchStyles.readinessCard}>
        <View style={watchStyles.readinessLeft}>
          <Text style={watchStyles.readinessLabel}>READINESS INDEX</Text>
          <Text style={[watchStyles.readinessScore, { color: readinessColor }]}>{readiness}</Text>
          <Text style={watchStyles.readinessDesc}>
            {readiness >= 75 ? 'Push hard today — body primed.' : readiness >= 55 ? 'Moderate effort. Monitor HRV.' : 'Recovery priority. Reduce load.'}
          </Text>
        </View>
        <View style={watchStyles.readinessRight}>
          <Text style={watchStyles.stressLabel}>STRESS</Text>
          <Text style={[watchStyles.stressValue, { color: stressColor }]}>{bio.stressLoad}</Text>
          <Text style={watchStyles.sleepDebtLabel}>SLEEP DEBT</Text>
          <Text style={watchStyles.sleepDebtValue}>{bio.sleepDebt.toFixed(1)}h</Text>
        </View>
      </View>

      {/* Step Progress */}
      <View style={watchStyles.stepProgress}>
        <View style={watchStyles.stepHeader}>
          <Text style={watchStyles.stepLabel}>STEP GOAL</Text>
          <Text style={watchStyles.stepValue}>{Math.round((bio.steps / bio.stepGoal) * 100)}%</Text>
        </View>
        <View style={watchStyles.stepTrack}>
          <View style={[watchStyles.stepFill, { width: `${Math.min(100, (bio.steps / bio.stepGoal) * 100)}%` }]} />
        </View>
      </View>
    </View>
  );
}

function BioMetric({ icon, label, value, unit, color, live }: any) {
  const blinkAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (!live) return;
    Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnim, { toValue: 0.3, duration: 800, useNativeDriver: true }),
        Animated.timing(blinkAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, [live]);

  return (
    <View style={watchStyles.metric}>
      <View style={watchStyles.metricHeader}>
        <MaterialIcons name={icon} size={14} color={color} />
        {live && <Animated.View style={[watchStyles.liveIndicator, { opacity: blinkAnim, backgroundColor: color }]} />}
      </View>
      <Text style={[watchStyles.metricValue, { color }]}>{value}</Text>
      <Text style={watchStyles.metricUnit}>{unit}</Text>
      <Text style={watchStyles.metricLabel}>{label}</Text>
    </View>
  );
}

const watchStyles = StyleSheet.create({
  disconnected: {
    backgroundColor: Colors.SurfaceCard,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.SurfaceBorder,
    gap: Spacing.md,
  },
  disconnectedHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  disconnectedTitle: { fontSize: FontSize.md, color: Colors.TextMuted, fontWeight: FontWeight.black, letterSpacing: 2, flex: 1 },
  offlineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.SilverDim },
  disconnectedSub: { fontSize: FontSize.sm, color: Colors.TextMuted, lineHeight: 20 },
  connectBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    borderWidth: 1, borderColor: Colors.Primary + '55',
    borderRadius: Radius.md, paddingVertical: 14,
    backgroundColor: Colors.PrimaryGlow,
  },
  connectBtnScanning: { borderColor: Colors.Primary + '88' },
  connectBtnText: { fontSize: FontSize.sm, color: Colors.Primary, fontWeight: FontWeight.black, letterSpacing: 1.5 },
  scanDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.Primary },

  connected: {
    backgroundColor: Colors.SurfaceCard,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: '#22C55E33',
    gap: Spacing.md,
  },
  connectedHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#22C55E' },
  connectedTitle: { fontSize: FontSize.md, color: Colors.TextPrimary, fontWeight: FontWeight.black, letterSpacing: 2, flex: 1 },
  deviceName: { fontSize: FontSize.xs, color: '#22C55E', fontWeight: FontWeight.bold },
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  metric: {
    width: '30%',
    flex: 1,
    backgroundColor: Colors.SurfaceElevated,
    borderRadius: Radius.md,
    padding: Spacing.sm,
    gap: 2,
    minWidth: 90,
  },
  metricHeader: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  liveIndicator: { width: 5, height: 5, borderRadius: 2.5 },
  metricValue: { fontSize: FontSize.xl, fontWeight: FontWeight.black, marginTop: 2 },
  metricUnit: { fontSize: 10, color: Colors.TextMuted },
  metricLabel: { fontSize: 9, color: Colors.TextMuted, letterSpacing: 1, fontWeight: FontWeight.bold, marginTop: 2 },
  readinessCard: {
    flexDirection: 'row',
    backgroundColor: Colors.SurfaceElevated,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.SurfaceBorder,
  },
  readinessLeft: { flex: 1, gap: 4 },
  readinessLabel: { fontSize: FontSize.xs, color: Colors.TextMuted, fontWeight: FontWeight.black, letterSpacing: 2 },
  readinessScore: { fontSize: 40, fontWeight: FontWeight.black },
  readinessDesc: { fontSize: FontSize.xs, color: Colors.TextSecondary, lineHeight: 16, marginTop: 2 },
  readinessRight: { alignItems: 'flex-end', gap: 2 },
  stressLabel: { fontSize: 9, color: Colors.TextMuted, letterSpacing: 1 },
  stressValue: { fontSize: FontSize.xl, fontWeight: FontWeight.black },
  sleepDebtLabel: { fontSize: 9, color: Colors.TextMuted, letterSpacing: 1, marginTop: 8 },
  sleepDebtValue: { fontSize: FontSize.lg, color: '#818CF8', fontWeight: FontWeight.black },
  stepProgress: { gap: 6 },
  stepHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  stepLabel: { fontSize: FontSize.xs, color: Colors.TextMuted, fontWeight: FontWeight.bold, letterSpacing: 1.5 },
  stepValue: { fontSize: FontSize.xs, color: '#22C55E', fontWeight: FontWeight.black },
  stepTrack: { height: 6, backgroundColor: Colors.SurfaceElevated, borderRadius: 3, overflow: 'hidden' },
  stepFill: { height: 6, backgroundColor: '#22C55E', borderRadius: 3 },
});

// ── Training Volume Panel ─────────────────────────────────────────────────────
function TrainingVolumePanel() {
  const tonnage = 14200;
  const prevTonnage = 12800;
  const delta = tonnage - prevTonnage;
  const [prFlash, setPrFlash] = useState(false);
  const prAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      setPrFlash(true);
      Animated.loop(
        Animated.sequence([
          Animated.timing(prAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.timing(prAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
        ]),
        { iterations: 6 }
      ).start();
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={volStyles.container}>
      <View style={volStyles.header}>
        <MaterialIcons name="fitness-center" size={18} color={Colors.Primary} />
        <Text style={volStyles.title}>ENGINE METRICS</Text>
        {prFlash && (
          <Animated.View style={[volStyles.prBadge, { opacity: prAnim }]}>
            <Text style={volStyles.prText}>PR DETECTED</Text>
          </Animated.View>
        )}
      </View>
      <View style={volStyles.grid}>
        <View style={volStyles.metric}>
          <Text style={volStyles.metricVal}>{tonnage.toLocaleString()}</Text>
          <Text style={volStyles.metricUnit}>kg</Text>
          <Text style={volStyles.metricLabel}>DAILY TONNAGE</Text>
          <Text style={[volStyles.delta, { color: delta > 0 ? '#22C55E' : '#EF4444' }]}>
            {delta > 0 ? '+' : ''}{delta.toLocaleString()} vs last
          </Text>
        </View>
        <View style={volStyles.metric}>
          <Text style={volStyles.metricVal}>7.8</Text>
          <Text style={volStyles.metricUnit}>RPE</Text>
          <Text style={volStyles.metricLabel}>AVG INTENSITY</Text>
          <Text style={volStyles.delta}>High output</Text>
        </View>
        <View style={volStyles.metric}>
          <Text style={volStyles.metricVal}>22/24</Text>
          <Text style={volStyles.metricUnit}>sets</Text>
          <Text style={volStyles.metricLabel}>COMPLETION</Text>
          <Text style={[volStyles.delta, { color: '#22C55E' }]}>91%</Text>
        </View>
      </View>
      {/* Optimal rest timer */}
      <View style={volStyles.restTimer}>
        <MaterialIcons name="timer" size={14} color={Colors.Primary} />
        <Text style={volStyles.restLabel}>OPTIMAL REST WINDOW</Text>
        <Text style={volStyles.restValue}>2:30 min</Text>
        <Text style={volStyles.restSub}>(Based on last set intensity)</Text>
      </View>
    </View>
  );
}

const volStyles = StyleSheet.create({
  container: {
    backgroundColor: Colors.SurfaceCard,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.SurfaceBorder,
    gap: Spacing.md,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { fontSize: FontSize.xs, color: Colors.TextMuted, fontWeight: FontWeight.black, letterSpacing: 2, flex: 1 },
  prBadge: {
    backgroundColor: Colors.Primary,
    borderRadius: Radius.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  prText: { fontSize: 9, color: '#fff', fontWeight: FontWeight.black, letterSpacing: 1.5 },
  grid: { flexDirection: 'row', gap: Spacing.sm },
  metric: {
    flex: 1,
    backgroundColor: Colors.SurfaceElevated,
    borderRadius: Radius.md,
    padding: Spacing.sm,
    gap: 1,
    alignItems: 'center',
  },
  metricVal: { fontSize: FontSize.xl, color: Colors.TextPrimary, fontWeight: FontWeight.black },
  metricUnit: { fontSize: 9, color: Colors.TextMuted },
  metricLabel: { fontSize: 9, color: Colors.TextMuted, letterSpacing: 1, fontWeight: FontWeight.bold, marginTop: 2, textAlign: 'center' },
  delta: { fontSize: FontSize.xs, color: Colors.TextMuted, marginTop: 2 },
  restTimer: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.PrimaryGlow,
    borderRadius: Radius.md, padding: Spacing.sm,
    borderWidth: 1, borderColor: Colors.Primary + '33',
  },
  restLabel: { fontSize: FontSize.xs, color: Colors.TextMuted, fontWeight: FontWeight.bold, letterSpacing: 1 },
  restValue: { fontSize: FontSize.md, color: Colors.Primary, fontWeight: FontWeight.black, marginLeft: 'auto' },
  restSub: { fontSize: 10, color: Colors.TextMuted },
});

// ── Nutrition Budget Panel ────────────────────────────────────────────────────
function NutritionBudgetPanel() {
  const consumed = { protein: 122, carbs: 210, fat: 54, calories: 1980 };
  const targets = { protein: 180, carbs: 380, fat: 90, calories: 3200 };
  const budget = 600;
  const spent = 340;
  const remaining = budget - spent;

  const MacroBar = ({ label, current, target, color }: any) => {
    const pct = Math.min(100, (current / target) * 100);
    const deviation = current - target;
    return (
      <View style={nutStyles.macroRow}>
        <Text style={nutStyles.macroLabel}>{label}</Text>
        <View style={nutStyles.macroTrack}>
          <View style={[nutStyles.macroFill, { width: `${pct}%`, backgroundColor: color }]} />
        </View>
        <Text style={nutStyles.macroNumbers}>{current}/{target}g</Text>
        <Text style={[nutStyles.macroDelta, { color: deviation < 0 ? Colors.TextMuted : '#22C55E' }]}>
          {deviation < 0 ? `${Math.abs(deviation)}g rem` : `+${deviation}g`}
        </Text>
      </View>
    );
  };

  return (
    <View style={nutStyles.container}>
      <View style={nutStyles.header}>
        <MaterialIcons name="restaurant" size={18} color="#22C55E" />
        <Text style={nutStyles.title}>NUTRITION & BUDGET EFFICIENCY</Text>
      </View>

      <View style={nutStyles.calorieRow}>
        <View>
          <Text style={nutStyles.calLabel}>CONSUMED</Text>
          <Text style={nutStyles.calValue}>{consumed.calories}</Text>
          <Text style={nutStyles.calUnit}>kcal</Text>
        </View>
        <View style={nutStyles.calDivider} />
        <View>
          <Text style={nutStyles.calLabel}>REMAINING</Text>
          <Text style={[nutStyles.calValue, { color: '#22C55E' }]}>{targets.calories - consumed.calories}</Text>
          <Text style={nutStyles.calUnit}>kcal</Text>
        </View>
        <View style={nutStyles.calDivider} />
        <View>
          <Text style={nutStyles.calLabel}>TARGET</Text>
          <Text style={[nutStyles.calValue, { color: Colors.TextSecondary }]}>{targets.calories}</Text>
          <Text style={nutStyles.calUnit}>kcal</Text>
        </View>
      </View>

      <MacroBar label="PRO" current={consumed.protein} target={targets.protein} color={Colors.Primary} />
      <MacroBar label="CHO" current={consumed.carbs} target={targets.carbs} color="#F59E0B" />
      <MacroBar label="FAT" current={consumed.fat} target={targets.fat} color="#818CF8" />

      {/* Budget */}
      <View style={nutStyles.budgetRow}>
        <MaterialIcons name="currency-rupee" size={14} color="#22C55E" />
        <Text style={nutStyles.budgetLabel}>DAILY BUDGET</Text>
        <Text style={nutStyles.budgetSpent}>₹{spent} spent</Text>
        <Text style={[nutStyles.budgetRemain, { color: '#22C55E' }]}>₹{remaining} left</Text>
      </View>
      <View style={nutStyles.budgetTrack}>
        <View style={[nutStyles.budgetFill, { width: `${(spent / budget) * 100}%` }]} />
      </View>
      <Text style={nutStyles.aiSuggest}>
        AI suggests: Chicken Breast 150g + Rice 100g — best macro-per-rupee with ₹{remaining} remaining.
      </Text>
    </View>
  );
}

const nutStyles = StyleSheet.create({
  container: {
    backgroundColor: Colors.SurfaceCard,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.SurfaceBorder,
    gap: Spacing.sm,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  title: { fontSize: FontSize.xs, color: Colors.TextMuted, fontWeight: FontWeight.black, letterSpacing: 2 },
  calorieRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around',
    backgroundColor: Colors.SurfaceElevated, borderRadius: Radius.md, padding: Spacing.md,
  },
  calLabel: { fontSize: 9, color: Colors.TextMuted, letterSpacing: 1.5, fontWeight: FontWeight.bold },
  calValue: { fontSize: FontSize.xxl, color: Colors.TextPrimary, fontWeight: FontWeight.black },
  calUnit: { fontSize: 10, color: Colors.TextMuted },
  calDivider: { width: 1, height: 40, backgroundColor: Colors.SurfaceBorder },
  macroRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  macroLabel: { width: 28, fontSize: 10, color: Colors.TextMuted, fontWeight: FontWeight.black, letterSpacing: 1 },
  macroTrack: { flex: 1, height: 6, backgroundColor: Colors.SurfaceElevated, borderRadius: 3, overflow: 'hidden' },
  macroFill: { height: 6, borderRadius: 3 },
  macroNumbers: { width: 56, fontSize: 10, color: Colors.TextSecondary, textAlign: 'right' },
  macroDelta: { width: 52, fontSize: 10, textAlign: 'right' },
  budgetRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  budgetLabel: { flex: 1, fontSize: FontSize.xs, color: Colors.TextMuted, fontWeight: FontWeight.bold, letterSpacing: 1 },
  budgetSpent: { fontSize: FontSize.xs, color: Colors.TextSecondary },
  budgetRemain: { fontSize: FontSize.xs, fontWeight: FontWeight.bold },
  budgetTrack: { height: 4, backgroundColor: Colors.SurfaceElevated, borderRadius: 2, overflow: 'hidden' },
  budgetFill: { height: 4, backgroundColor: '#22C55E', borderRadius: 2 },
  aiSuggest: { fontSize: FontSize.xs, color: Colors.TextMuted, lineHeight: 16, fontStyle: 'italic' },
});

// ── Rank Velocity Panel ───────────────────────────────────────────────────────
function RankVelocityPanel({ user }: { user: any }) {
  const streak = user.streak;
  const adherence = user.adherenceScore;
  const velocity = Math.round((streak * adherence) / 100);
  const daysToNext = 14;
  const daysNeeded = Math.max(0, daysToNext - Math.floor(velocity / 10));

  return (
    <View style={rankStyles.container}>
      <View style={rankStyles.header}>
        <MaterialIcons name="trending-up" size={18} color="#FFD700" />
        <Text style={rankStyles.title}>RANK VELOCITY</Text>
        <Text style={rankStyles.tier}>{user.rank}</Text>
      </View>
      <View style={rankStyles.grid}>
        <View style={rankStyles.velMetric}>
          <Text style={rankStyles.velVal}>{velocity}</Text>
          <Text style={rankStyles.velLabel}>VELOCITY</Text>
        </View>
        <View style={rankStyles.velMetric}>
          <Text style={[rankStyles.velVal, { color: '#22C55E' }]}>{daysNeeded}</Text>
          <Text style={rankStyles.velLabel}>DAYS TO NEXT</Text>
        </View>
        <View style={rankStyles.velMetric}>
          <Text style={[rankStyles.velVal, { color: '#FFD700' }]}>18d</Text>
          <Text style={rankStyles.velLabel}>STREAK</Text>
        </View>
      </View>
      <View style={rankStyles.progressBar}>
        <View style={rankStyles.progressFill} />
      </View>
      <Text style={rankStyles.unlockText}>
        {daysNeeded} more days at &gt;90% adherence unlock ASCEND tier + Elite apparel access.
      </Text>
    </View>
  );
}

const rankStyles = StyleSheet.create({
  container: {
    backgroundColor: Colors.SurfaceCard,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: '#FFD70033',
    gap: Spacing.sm,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { flex: 1, fontSize: FontSize.xs, color: Colors.TextMuted, fontWeight: FontWeight.black, letterSpacing: 2 },
  tier: { fontSize: FontSize.xs, color: '#FFD700', fontWeight: FontWeight.black, letterSpacing: 1.5 },
  grid: { flexDirection: 'row', gap: Spacing.sm },
  velMetric: {
    flex: 1, alignItems: 'center',
    backgroundColor: Colors.SurfaceElevated,
    borderRadius: Radius.md, padding: Spacing.sm, gap: 2,
  },
  velVal: { fontSize: FontSize.xl, color: Colors.Primary, fontWeight: FontWeight.black },
  velLabel: { fontSize: 9, color: Colors.TextMuted, letterSpacing: 1, fontWeight: FontWeight.bold },
  progressBar: { height: 6, backgroundColor: Colors.SurfaceElevated, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: 6, width: '56%', backgroundColor: '#FFD700', borderRadius: 3 },
  unlockText: { fontSize: FontSize.xs, color: Colors.TextMuted, lineHeight: 16 },
});

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, workoutPlan, dietPlan } = useUser();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const currentUser = user || MOCK_USER;
  const wp = workoutPlan || MOCK_WORKOUT_PLAN;
  const dp = dietPlan || MOCK_DIET_PLAN;

  const redlineScore = computeRedlineScore(88, 91, 7.2, 8);

  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  const dateStr = now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' });

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <Animated.View style={[styles.topBar, { opacity: fadeAnim, paddingTop: insets.top + 8 }]}>
        <View>
          <Text style={styles.time}>{timeStr}</Text>
          <Text style={styles.date}>{dateStr}</Text>
        </View>
        <View style={styles.topRight}>
          <RankBadge tier={currentUser.tier} />
          <Pressable onPress={() => router.push('/(tabs)/profile')}>
            <AvatarFrame letter={currentUser.avatar} tier={currentUser.tier} animated />
          </Pressable>
        </View>
      </Animated.View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: 120 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting */}
        <View style={styles.greeting}>
          <Text style={styles.greetingSub}>COMMAND CENTER</Text>
          <Text style={styles.name}>{currentUser.name.split(' ')[0].toUpperCase()}</Text>
        </View>

        {/* Trainer Badge */}
        {currentUser.connectedTrainer ? (
          <TrainerBadge trainerName={currentUser.connectedTrainer.displayName} tier={currentUser.connectedTrainer.tier} />
        ) : null}

        {/* PRIMARY: Redline Gauge */}
        <View style={styles.section}>
          <RedlineGauge score={redlineScore} />
        </View>

        {/* Next Action */}
        <View style={styles.nextActionCard}>
          <View style={styles.nextActionHeader}>
            <MaterialIcons name="bolt" size={18} color={Colors.Primary} />
            <Text style={styles.nextActionLabel}>NEXT ACTION</Text>
          </View>
          <Text style={styles.nextActionTitle}>Workout Check-In</Text>
          <Text style={styles.nextActionSub}>
            {wp.today.day} · {wp.today.focus} · {wp.today.estimatedDuration} min
          </Text>
          <Pressable style={styles.nextActionBtn} onPress={() => router.push('/checkin/workout')}>
            <Text style={styles.nextActionBtnText}>BEGIN SESSION</Text>
            <MaterialIcons name="arrow-forward" size={18} color={Colors.Background} />
          </Pressable>
        </View>

        {/* Today Card */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>TODAY</Text>
          <View style={styles.todayRow}>
            <View style={styles.todayCard}>
              <MaterialIcons name="fitness-center" size={20} color={Colors.Primary} />
              <Text style={styles.todayCardLabel}>WORKOUT</Text>
              <Text style={styles.todayCardValue}>{wp.today.day}</Text>
              <View style={[styles.sourcePill, { backgroundColor: wp.assignedBy === 'trainer' ? Colors.Primary + '22' : Colors.SurfaceElevated }]}>
                <Text style={[styles.sourceText, { color: wp.assignedBy === 'trainer' ? Colors.Primary : Colors.TextMuted }]}>
                  {wp.assignedBy === 'trainer' ? `By ${wp.trainerName}` : 'AI Structured'}
                </Text>
              </View>
            </View>
            <View style={styles.todayCard}>
              <MaterialIcons name="restaurant" size={20} color="#22C55E" />
              <Text style={styles.todayCardLabel}>DIET</Text>
              <Text style={styles.todayCardValue}>{dp.targetCalories} kcal</Text>
              <View style={[styles.sourcePill, { backgroundColor: dp.assignedBy === 'trainer' ? Colors.Primary + '22' : Colors.SurfaceElevated }]}>
                <Text style={[styles.sourceText, { color: dp.assignedBy === 'trainer' ? Colors.Primary : Colors.TextMuted }]}>
                  {dp.assignedBy === 'trainer' ? `By ${dp.trainerName}` : 'AI Structured'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Check-In Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CHECK-IN STATUS</Text>
          <View style={styles.sectionCard}>
            <CheckInBar onPress={(id: string) => router.push(`/checkin/${id}` as any)} />
          </View>
        </View>

        {/* Smartwatch */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>BIOMETRIC FEED</Text>
          <SmartWatchPanel />
        </View>

        {/* Training Volume */}
        <View style={styles.section}>
          <TrainingVolumePanel />
        </View>

        {/* Nutrition Budget */}
        <View style={styles.section}>
          <NutritionBudgetPanel />
        </View>

        {/* Rank Velocity */}
        <View style={styles.section}>
          <RankVelocityPanel user={currentUser} />
        </View>

        {/* Identity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>YOUR IDENTITY</Text>
          <View style={styles.identityCard}>
            <AvatarFrame letter={currentUser.avatar} tier={currentUser.tier} size={52} animated />
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={styles.identityName}>{currentUser.name}</Text>
              <RankBadge tier={currentUser.tier} points={currentUser.points} showPoints />
              {currentUser.badges.length > 0 && (
                <View style={styles.badgeRow}>
                  {currentUser.badges.map((b: string) => (
                    <View key={b} style={styles.perfBadge}>
                      <MaterialIcons name="verified" size={10} color={Colors.Primary} />
                      <Text style={styles.perfBadgeText}>{b}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
            <Pressable onPress={() => router.push('/(tabs)/profile')} style={styles.profileBtn}>
              <MaterialIcons name="person" size={18} color={Colors.Primary} />
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.Background },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.SurfaceBorder,
  },
  time: { fontSize: FontSize.xl, color: Colors.TextPrimary, fontWeight: FontWeight.bold },
  date: { fontSize: FontSize.sm, color: Colors.TextMuted },
  topRight: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  scroll: { paddingHorizontal: Spacing.md, gap: Spacing.md, paddingTop: Spacing.md },
  greeting: { gap: 2 },
  greetingSub: { fontSize: FontSize.xs, color: Colors.TextMuted, fontWeight: FontWeight.black, letterSpacing: 2 },
  name: { fontSize: FontSize.display, color: Colors.TextPrimary, fontWeight: FontWeight.black, letterSpacing: 3 },
  section: { gap: Spacing.sm },
  sectionTitle: { fontSize: FontSize.xs, color: Colors.TextMuted, fontWeight: FontWeight.black, letterSpacing: 2 },
  sectionCard: {
    backgroundColor: Colors.SurfaceCard,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.SurfaceBorder,
    padding: Spacing.md,
  },
  nextActionCard: {
    backgroundColor: Colors.Primary,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  nextActionHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  nextActionLabel: { fontSize: FontSize.xs, color: 'rgba(255,255,255,0.7)', fontWeight: FontWeight.bold, letterSpacing: 1.5 },
  nextActionTitle: { fontSize: FontSize.xxl, color: '#fff', fontWeight: FontWeight.black },
  nextActionSub: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.7)' },
  nextActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.Background,
    borderRadius: Radius.md,
    paddingVertical: 12,
    gap: 8,
    marginTop: Spacing.sm,
  },
  nextActionBtnText: { fontSize: FontSize.md, color: Colors.Primary, fontWeight: FontWeight.black, letterSpacing: 1.5 },
  todayRow: { flexDirection: 'row', gap: Spacing.sm },
  todayCard: {
    flex: 1,
    backgroundColor: Colors.SurfaceCard,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.SurfaceBorder,
    gap: 6,
  },
  todayCardLabel: { fontSize: FontSize.xs, color: Colors.TextMuted, fontWeight: FontWeight.bold, letterSpacing: 1.5 },
  todayCardValue: { fontSize: FontSize.xl, color: Colors.TextPrimary, fontWeight: FontWeight.black },
  sourcePill: { borderRadius: Radius.full, paddingHorizontal: 8, paddingVertical: 3 },
  sourceText: { fontSize: 10, fontWeight: FontWeight.bold },
  identityCard: {
    backgroundColor: Colors.SurfaceCard,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.SurfaceBorder,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  identityName: { fontSize: FontSize.md, color: Colors.TextPrimary, fontWeight: FontWeight.bold },
  badgeRow: { flexDirection: 'row', gap: Spacing.xs, flexWrap: 'wrap' },
  perfBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 3,
    backgroundColor: Colors.PrimaryGlow,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.Primary + '33',
  },
  perfBadgeText: { fontSize: 9, color: Colors.Primary, fontWeight: FontWeight.bold },
  profileBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.PrimaryGlow,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
