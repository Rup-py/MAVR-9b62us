import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable, TextInput, Animated, useRef,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { AvatarFrame, RankBadge } from '@/components';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '@/constants/theme';
import { MOCK_GYM_PARTNERS, MOCK_VANGUARDS } from '@/services/mockData';

type Tab = 'signal' | 'trainer' | 'identity';
type IntentMode = 'Shadow' | 'Vanguard' | 'Symmetry';

export default function CommunityScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('signal');

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header with MAVR logo */}
      <View style={styles.header}>
        <Image
          source={require('@/assets/mavr_logo.png')}
          style={styles.headerLogo}
          contentFit="contain"
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>CONNECTS</Text>
          <Text style={styles.headerSub}>Performance Hub · Structured · Elite</Text>
        </View>
      </View>

      <View style={styles.tabs}>
        {(['signal', 'trainer', 'identity'] as Tab[]).map((tab) => (
          <Pressable
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab === 'signal' ? 'Signal' : tab === 'trainer' ? 'Trainers' : 'Identity'}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: 120 }]} showsVerticalScrollIndicator={false}>
        {activeTab === 'signal' && <SignalTab />}
        {activeTab === 'trainer' && <TrainerTab router={router} />}
        {activeTab === 'identity' && <IdentityTab />}
      </ScrollView>
    </View>
  );
}

// ── Signal Tab ────────────────────────────────────────────────────────────────
function SignalTab() {
  const [signalActive, setSignalActive] = useState(false);
  const [intentMode, setIntentMode] = useState<IntentMode>('Symmetry');
  const [showVanguards, setShowVanguards] = useState(false);
  const [signatureInput, setSignatureInput] = useState('');
  const pulseAnim = React.useRef(new Animated.Value(1)).current;
  const glowAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (signalActive) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.18, duration: 800, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        ])
      ).start();
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
          Animated.timing(glowAnim, { toValue: 0.3, duration: 600, useNativeDriver: true }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
      glowAnim.setValue(0);
    }
  }, [signalActive]);

  const handleSignal = () => {
    setSignalActive(!signalActive);
    if (!signalActive) setShowVanguards(true);
  };

  const INTENT_MODES: { mode: IntentMode; label: string; desc: string; icon: string }[] = [
    { mode: 'Shadow', label: 'SHADOW', desc: 'Learn from a Vanguard above your rank', icon: 'visibility' },
    { mode: 'Vanguard', label: 'VANGUARD', desc: 'Lead shadow athletes. Earn Influence.', icon: 'military-tech' },
    { mode: 'Symmetry', label: 'SYMMETRY', desc: 'Match with ±10% adherence compatibility', icon: 'swap-horiz' },
  ];

  return (
    <View style={styles.section}>
      {/* Trainer Signature Entry */}
      <View style={styles.signatureCard}>
        <View style={styles.signatureHeader}>
          <MaterialIcons name="link" size={18} color={Colors.Primary} />
          <Text style={styles.signatureTitle}>ENTER TRAINER SIGNATURE</Text>
        </View>
        <View style={styles.signatureInputRow}>
          <View style={styles.signatureInputWrap}>
            <Text style={styles.signatureCursor}>|</Text>
            <TextInput
              style={styles.signatureInput}
              value={signatureInput}
              onChangeText={setSignatureInput}
              placeholder="MAVR-77RED"
              placeholderTextColor={Colors.TextMuted}
              autoCapitalize="characters"
            />
          </View>
          <Pressable
            style={[styles.syncBtn, signatureInput.length > 4 && styles.syncBtnActive]}
            onPress={() => {}}
          >
            <Text style={styles.syncBtnText}>SYNC</Text>
          </Pressable>
        </View>
        <Text style={styles.signatureHint}>Your trainer's MAVR Signature initiates a Biological Sync and overrides your AI plans.</Text>
      </View>

      {/* Intent Mode */}
      <Text style={styles.sectionLabel}>SELECT INTENT MODE</Text>
      {INTENT_MODES.map((m) => (
        <Pressable
          key={m.mode}
          style={[styles.intentCard, intentMode === m.mode && styles.intentCardActive]}
          onPress={() => setIntentMode(m.mode)}
        >
          <MaterialIcons name={m.icon as any} size={22} color={intentMode === m.mode ? Colors.Primary : Colors.TextMuted} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.intentLabel, intentMode === m.mode && { color: Colors.Primary }]}>{m.label}</Text>
            <Text style={styles.intentDesc}>{m.desc}</Text>
          </View>
          {intentMode === m.mode && <View style={styles.intentDot} />}
        </Pressable>
      ))}

      {/* Signal Button */}
      <View style={styles.signalCenter}>
        <Animated.View style={[styles.signalGlow, {
          opacity: glowAnim,
          transform: [{ scale: pulseAnim }],
        }]} />
        <Pressable
          style={[styles.signalBtn, signalActive && styles.signalBtnActive]}
          onPress={handleSignal}
        >
          <Animated.View style={{ transform: [{ scale: signalActive ? pulseAnim : new Animated.Value(1) }] }}>
            <MaterialIcons name="sensors" size={36} color={signalActive ? '#fff' : Colors.Primary} />
          </Animated.View>
          <Text style={[styles.signalBtnLabel, signalActive && { color: '#fff' }]}>
            {signalActive ? 'SIGNAL ACTIVE' : 'DROP SIGNAL'}
          </Text>
          <Text style={[styles.signalBtnSub, signalActive && { color: 'rgba(255,255,255,0.7)' }]}>
            {signalActive ? `${intentMode} Mode Broadcasting` : 'Tap to broadcast your presence'}
          </Text>
        </Pressable>
      </View>

      {/* Matched Partners / Vanguards */}
      {showVanguards && intentMode === 'Shadow' && (
        <>
          <Text style={styles.sectionLabel}>VANGUARDS NEARBY</Text>
          {MOCK_VANGUARDS.map((v) => (
            <View key={v.id} style={styles.vanguardCard}>
              <AvatarFrame letter={v.avatar} tier={v.tier} size={48} animated />
              <View style={{ flex: 1, gap: 4 }}>
                <Text style={styles.vanguardName}>{v.name}</Text>
                <Text style={styles.vanguardPower}>{v.superpower}</Text>
                <View style={styles.vanguardMeta}>
                  <Text style={styles.monoText}>{v.trainingAge}YR</Text>
                  <Text style={styles.monoText}>{v.redlineScore}%</Text>
                  <Text style={styles.monoText}>{v.influence} INF</Text>
                </View>
              </View>
              <Pressable style={styles.shadowBtn}>
                <Text style={styles.shadowBtnText}>REQUEST TO SHADOW</Text>
              </Pressable>
            </View>
          ))}
        </>
      )}

      {showVanguards && intentMode !== 'Shadow' && (
        <>
          <Text style={styles.sectionLabel}>
            {intentMode === 'Symmetry' ? 'COMPATIBLE ATHLETES' : 'SHADOW SEEKERS'}
          </Text>
          {MOCK_GYM_PARTNERS.map((p) => (
            <View key={p.id} style={styles.partnerCard}>
              <AvatarFrame letter={p.avatar} tier={p.tier} size={44} animated />
              <View style={{ flex: 1, gap: 4 }}>
                <Text style={styles.partnerName}>{p.name}</Text>
                <Text style={styles.partnerPower}>{p.superpower}</Text>
                <View style={styles.partnerMeta}>
                  <Text style={styles.monoText}>{p.redlineScore}%</Text>
                  <Text style={styles.monoText}>{p.intentMode}</Text>
                  <Text style={styles.monoText}>{p.timing}</Text>
                </View>
              </View>
              <View style={styles.compatBadge}>
                <Text style={styles.compatVal}>{p.compatibility}%</Text>
                <Text style={styles.compatLabel}>MATCH</Text>
              </View>
            </View>
          ))}
        </>
      )}
    </View>
  );
}

// ── Trainer Tab ───────────────────────────────────────────────────────────────
function TrainerTab({ router }: { router: any }) {
  return (
    <View style={styles.section}>
      <Pressable style={styles.actionCard} onPress={() => router.push('/onboarding/connect')}>
        <View style={styles.actionIcon}>
          <MaterialIcons name="link" size={24} color={Colors.Primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.actionTitle}>Connect to Trainer</Text>
          <Text style={styles.actionSub}>Enter a MAVR Signature to initiate Biological Sync</Text>
        </View>
        <MaterialIcons name="chevron-right" size={22} color={Colors.TextMuted} />
      </Pressable>

      <Pressable style={styles.actionCard} onPress={() => router.push('/onboarding/trainer')}>
        <View style={[styles.actionIcon, { backgroundColor: '#22C55E15' }]}>
          <MaterialIcons name="verified" size={24} color="#22C55E" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.actionTitle}>Register as Trainer</Text>
          <Text style={styles.actionSub}>Get your MAVR Signature and start coaching</Text>
        </View>
        <MaterialIcons name="chevron-right" size={22} color={Colors.TextMuted} />
      </Pressable>

      <Pressable style={styles.actionCard} onPress={() => router.push('/trainer/dashboard')}>
        <View style={[styles.actionIcon, { backgroundColor: '#818CF815' }]}>
          <MaterialIcons name="dashboard" size={24} color="#818CF8" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.actionTitle}>Command Center</Text>
          <Text style={styles.actionSub}>Manage students, plans, and billing</Text>
        </View>
        <MaterialIcons name="chevron-right" size={22} color={Colors.TextMuted} />
      </Pressable>

      <Pressable style={styles.actionCard} onPress={() => router.push('/connects/individual')}>
        <View style={[styles.actionIcon, { backgroundColor: Colors.PrimaryGlow }]}>
          <MaterialIcons name="person-add" size={24} color={Colors.Primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.actionTitle}>Register as Individual</Text>
          <Text style={styles.actionSub}>Find gym partners and join the MAVR network</Text>
        </View>
        <MaterialIcons name="chevron-right" size={22} color={Colors.TextMuted} />
      </Pressable>

      {/* Featured Trainers */}
      <Text style={styles.sectionLabel}>FEATURED TRAINERS</Text>
      {[
        { name: 'Coach Vikram Nair', spec: 'Hypertrophy & Strength', sig: 'MAVR-77RED', tier: 'signature_coach', influence: 1240, rating: 4.9 },
        { name: 'Coach Priya Shetty', spec: 'Fat Loss & Nutrition', sig: 'MAVR-45FIT', tier: 'pro_coach', influence: 680, rating: 4.7 },
      ].map((t) => (
        <View key={t.sig} style={styles.trainerCard}>
          <AvatarFrame letter={t.name.charAt(6)} tier={t.tier} size={48} animated />
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={styles.trainerName}>{t.name}</Text>
            <Text style={styles.trainerSpec}>{t.spec}</Text>
            <View style={styles.trainerMetaRow}>
              <Text style={styles.trainerSig}>{t.sig}</Text>
              <Text style={styles.monoText}>{t.influence} INF</Text>
              <View style={styles.ratingPill}>
                <MaterialIcons name="star" size={11} color="#FFD700" />
                <Text style={styles.ratingText}>{t.rating}</Text>
              </View>
            </View>
          </View>
          <Pressable style={styles.connectBtn}>
            <Text style={styles.connectBtnText}>CONNECT</Text>
          </Pressable>
        </View>
      ))}
    </View>
  );
}

// ── Identity Tab ──────────────────────────────────────────────────────────────
function IdentityTab() {
  const TIERS = [
    { label: 'STARTER', color: '#666666', count: '2.4k athletes', frame: 'Static Red' },
    { label: 'CORE', color: '#888888', count: '1.1k athletes', frame: 'Breathing Pulse' },
    { label: 'REDLINE', color: Colors.Primary, count: '380 athletes', frame: 'Breathing Pulse', you: true },
    { label: 'ASCEND', color: '#FF4444', count: '92 athletes', frame: 'Radar Sweep' },
    { label: 'ELITE', color: '#FFD700', count: '18 athletes', frame: 'Kinetic Glitch' },
  ];

  const SUPERPOWERS = [
    { name: 'THE IRON HEART', desc: '30d strength consistency dominance', color: Colors.Primary },
    { name: 'THE ENGINE', desc: 'Highest daily tonnage in past 30d', color: '#EF4444' },
    { name: 'THE METABOLIC GHOST', desc: 'Precise nutrition tracking for 30d', color: '#22C55E' },
    { name: 'THE PRECISION BUILDER', desc: 'Zero missed sets in last 21d', color: '#818CF8' },
    { name: 'THE SOVEREIGN', desc: 'Elite tier + 1000+ Influence Points', color: '#FFD700' },
  ];

  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>TIER NETWORK</Text>
      {TIERS.map((tier) => (
        <View key={tier.label} style={[styles.tierRow, { borderColor: tier.color + '33' }]}>
          <View style={[styles.tierDot, { backgroundColor: tier.color }]} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.tierName, { color: tier.color }]}>{tier.label}</Text>
            <Text style={styles.tierFrame}>{tier.frame}</Text>
          </View>
          <Text style={styles.tierCount}>{tier.count}</Text>
          {tier.you && (
            <View style={styles.youBadge}>
              <Text style={styles.youText}>YOU</Text>
            </View>
          )}
        </View>
      ))}

      <Text style={[styles.sectionLabel, { marginTop: Spacing.md }]}>ANIMATED FRAMES</Text>
      <View style={styles.framesRow}>
        {(['starter', 'core', 'redline', 'ascend', 'elite'] as const).map((tier) => (
          <View key={tier} style={styles.framePreview}>
            <AvatarFrame letter="M" tier={tier} size={36} animated />
            <Text style={styles.frameLabel}>{tier.toUpperCase()}</Text>
          </View>
        ))}
      </View>

      <Text style={[styles.sectionLabel, { marginTop: Spacing.md }]}>SUPERPOWERS</Text>
      {SUPERPOWERS.map((sp) => (
        <View key={sp.name} style={[styles.superpowerCard, { borderColor: sp.color + '33' }]}>
          <View style={[styles.superpowerIcon, { backgroundColor: sp.color + '15' }]}>
            <MaterialIcons name="bolt" size={20} color={sp.color} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.superpowerName, { color: sp.color }]}>{sp.name}</Text>
            <Text style={styles.superpowerDesc}>{sp.desc}</Text>
          </View>
          <MaterialIcons name="lock" size={16} color={Colors.TextMuted} />
        </View>
      ))}

      <Text style={[styles.sectionLabel, { marginTop: Spacing.md }]}>PERFORMANCE TAGS</Text>
      {['Consistent', 'Discipline Locked', 'Precision Builder', 'Recovery Strong', 'Event Ready'].map((tag) => (
        <View key={tag} style={styles.perfTagRow}>
          <MaterialIcons name="verified" size={18} color={Colors.Primary} />
          <Text style={{ flex: 1, fontSize: FontSize.md, color: Colors.TextPrimary, fontWeight: FontWeight.semibold }}>{tag}</Text>
          <MaterialIcons name="lock" size={16} color={Colors.TextMuted} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.Background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.SurfaceBorder,
  },
  headerLogo: { width: 32, height: 28 },
  headerTitle: { fontSize: FontSize.xl, color: Colors.TextPrimary, fontWeight: FontWeight.black, letterSpacing: 2 },
  headerSub: { fontSize: FontSize.xs, color: Colors.TextMuted },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.SurfaceBorder,
  },
  tab: { paddingVertical: 12, paddingHorizontal: Spacing.md, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: Colors.Primary },
  tabText: { fontSize: FontSize.md, color: Colors.TextMuted, fontWeight: FontWeight.medium },
  tabTextActive: { color: Colors.Primary, fontWeight: FontWeight.bold },
  scroll: { paddingHorizontal: Spacing.md, paddingTop: Spacing.md },
  section: { gap: Spacing.sm },
  sectionLabel: { fontSize: FontSize.xs, color: Colors.TextMuted, fontWeight: FontWeight.black, letterSpacing: 2, marginTop: Spacing.sm },

  // Signature
  signatureCard: {
    backgroundColor: Colors.SurfaceCard,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.Primary + '33',
    gap: Spacing.md,
  },
  signatureHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  signatureTitle: { fontSize: FontSize.sm, color: Colors.TextPrimary, fontWeight: FontWeight.black, letterSpacing: 1.5 },
  signatureInputRow: { flexDirection: 'row', gap: Spacing.sm },
  signatureInputWrap: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.Background, borderRadius: Radius.md,
    borderWidth: 1, borderColor: Colors.Primary + '66',
    paddingHorizontal: Spacing.md,
  },
  signatureCursor: { fontSize: FontSize.xl, color: Colors.Primary, fontWeight: FontWeight.black, marginRight: 4 },
  signatureInput: { flex: 1, fontSize: FontSize.md, color: Colors.TextPrimary, fontWeight: FontWeight.bold, paddingVertical: 12 },
  syncBtn: {
    backgroundColor: Colors.SurfaceElevated,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Colors.SurfaceBorder,
  },
  syncBtnActive: { backgroundColor: Colors.Primary, borderColor: Colors.Primary },
  syncBtnText: { fontSize: FontSize.sm, color: Colors.TextPrimary, fontWeight: FontWeight.black, letterSpacing: 1 },
  signatureHint: { fontSize: FontSize.xs, color: Colors.TextMuted, lineHeight: 16 },

  // Intent
  intentCard: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.SurfaceCard, borderRadius: Radius.lg,
    padding: Spacing.md, borderWidth: 1, borderColor: Colors.SurfaceBorder,
  },
  intentCardActive: { borderColor: Colors.Primary + '55', backgroundColor: Colors.PrimaryGlow },
  intentLabel: { fontSize: FontSize.md, color: Colors.TextPrimary, fontWeight: FontWeight.black, letterSpacing: 1 },
  intentDesc: { fontSize: FontSize.xs, color: Colors.TextMuted, marginTop: 2 },
  intentDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.Primary },

  // Signal button
  signalCenter: { alignItems: 'center', paddingVertical: Spacing.xl, position: 'relative' },
  signalGlow: {
    position: 'absolute',
    width: 200, height: 200, borderRadius: 100,
    backgroundColor: Colors.Primary,
    opacity: 0.15,
  },
  signalBtn: {
    width: 180, height: 180, borderRadius: 90,
    backgroundColor: Colors.SurfaceCard,
    borderWidth: 2, borderColor: Colors.Primary + '55',
    alignItems: 'center', justifyContent: 'center',
    gap: 6,
    shadowColor: Colors.Primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
  },
  signalBtnActive: { backgroundColor: Colors.Primary, borderColor: Colors.Primary },
  signalBtnLabel: { fontSize: FontSize.md, color: Colors.Primary, fontWeight: FontWeight.black, letterSpacing: 1.5 },
  signalBtnSub: { fontSize: FontSize.xs, color: Colors.TextMuted, textAlign: 'center', paddingHorizontal: 16 },

  // Partners / Vanguards
  vanguardCard: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.SurfaceCard, borderRadius: Radius.lg,
    padding: Spacing.md, borderWidth: 1, borderColor: '#FFD70033',
  },
  vanguardName: { fontSize: FontSize.md, color: Colors.TextPrimary, fontWeight: FontWeight.bold },
  vanguardPower: { fontSize: FontSize.xs, color: '#FFD700', fontWeight: FontWeight.black, letterSpacing: 1 },
  vanguardMeta: { flexDirection: 'row', gap: Spacing.sm },
  shadowBtn: {
    backgroundColor: Colors.PrimaryGlow, borderRadius: Radius.sm,
    paddingHorizontal: 8, paddingVertical: 6,
    borderWidth: 1, borderColor: Colors.Primary + '44',
  },
  shadowBtnText: { fontSize: 9, color: Colors.Primary, fontWeight: FontWeight.black, letterSpacing: 0.8 },
  partnerCard: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.SurfaceCard, borderRadius: Radius.lg,
    padding: Spacing.md, borderWidth: 1, borderColor: Colors.SurfaceBorder,
  },
  partnerName: { fontSize: FontSize.md, color: Colors.TextPrimary, fontWeight: FontWeight.bold },
  partnerPower: { fontSize: FontSize.xs, color: Colors.Primary, fontWeight: FontWeight.black, letterSpacing: 1 },
  partnerMeta: { flexDirection: 'row', gap: Spacing.sm },
  monoText: { fontSize: 10, color: Colors.TextMuted, fontWeight: FontWeight.bold, letterSpacing: 1 },
  compatBadge: {
    alignItems: 'center', backgroundColor: Colors.PrimaryGlow,
    borderRadius: Radius.md, padding: Spacing.sm,
    borderWidth: 1, borderColor: Colors.Primary + '33',
  },
  compatVal: { fontSize: FontSize.lg, color: Colors.Primary, fontWeight: FontWeight.black },
  compatLabel: { fontSize: 9, color: Colors.Primary },

  // Actions
  actionCard: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.SurfaceCard, borderRadius: Radius.lg,
    padding: Spacing.md, borderWidth: 1, borderColor: Colors.SurfaceBorder,
  },
  actionIcon: { width: 48, height: 48, borderRadius: Radius.md, backgroundColor: Colors.PrimaryGlow, alignItems: 'center', justifyContent: 'center' },
  actionTitle: { fontSize: FontSize.md, color: Colors.TextPrimary, fontWeight: FontWeight.bold },
  actionSub: { fontSize: FontSize.sm, color: Colors.TextSecondary, marginTop: 2 },

  // Trainer cards
  trainerCard: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.SurfaceCard, borderRadius: Radius.lg,
    padding: Spacing.md, borderWidth: 1, borderColor: Colors.SurfaceBorder,
  },
  trainerName: { fontSize: FontSize.md, color: Colors.TextPrimary, fontWeight: FontWeight.bold },
  trainerSpec: { fontSize: FontSize.sm, color: Colors.TextSecondary },
  trainerMetaRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  trainerSig: { fontSize: FontSize.xs, color: Colors.Primary, fontWeight: FontWeight.bold },
  ratingPill: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  ratingText: { fontSize: FontSize.xs, color: '#FFD700', fontWeight: FontWeight.bold },
  connectBtn: {
    backgroundColor: Colors.PrimaryGlow, borderRadius: Radius.md,
    paddingHorizontal: 10, paddingVertical: 7,
    borderWidth: 1, borderColor: Colors.Primary + '44',
  },
  connectBtnText: { fontSize: 10, color: Colors.Primary, fontWeight: FontWeight.black, letterSpacing: 0.8 },

  // Identity
  tierRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.SurfaceCard, borderRadius: Radius.md,
    padding: Spacing.md, borderWidth: 1,
  },
  tierDot: { width: 8, height: 8, borderRadius: 4 },
  tierName: { fontSize: FontSize.md, fontWeight: FontWeight.black, letterSpacing: 1.5 },
  tierFrame: { fontSize: FontSize.xs, color: Colors.TextMuted },
  tierCount: { fontSize: FontSize.sm, color: Colors.TextMuted },
  youBadge: { backgroundColor: Colors.Primary, borderRadius: Radius.full, paddingHorizontal: 8, paddingVertical: 2 },
  youText: { fontSize: FontSize.xs, color: '#fff', fontWeight: FontWeight.black },
  framesRow: { flexDirection: 'row', gap: Spacing.md, backgroundColor: Colors.SurfaceCard, borderRadius: Radius.lg, padding: Spacing.md, borderWidth: 1, borderColor: Colors.SurfaceBorder, justifyContent: 'space-around' },
  framePreview: { alignItems: 'center', gap: 6 },
  frameLabel: { fontSize: 8, color: Colors.TextMuted, letterSpacing: 1, fontWeight: FontWeight.bold },
  superpowerCard: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.SurfaceCard, borderRadius: Radius.md,
    padding: Spacing.md, borderWidth: 1,
  },
  superpowerIcon: { width: 40, height: 40, borderRadius: Radius.sm, alignItems: 'center', justifyContent: 'center' },
  superpowerName: { fontSize: FontSize.sm, fontWeight: FontWeight.black, letterSpacing: 1 },
  superpowerDesc: { fontSize: FontSize.xs, color: Colors.TextMuted, marginTop: 2 },
  perfTagRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.SurfaceCard, borderRadius: Radius.md,
    padding: Spacing.md, borderWidth: 1, borderColor: Colors.SurfaceBorder,
  },
});
