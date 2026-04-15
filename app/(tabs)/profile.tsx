import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable, TextInput, Linking,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { AvatarFrame, RankBadge, Badge } from '@/components';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '@/constants/theme';
import { MOCK_USER } from '@/services/mockData';
import { useUser } from '@/hooks/useUser';

type Section = null | 'edit' | 'manage' | 'billing' | 'history' | 'help' | 'privacy';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useUser();
  const currentUser = user || MOCK_USER;
  const [activeSection, setActiveSection] = useState<Section>(null);

  if (activeSection === 'edit') return <EditProfileSection user={currentUser} onBack={() => setActiveSection(null)} />;
  if (activeSection === 'manage') return <ManageProfileSection user={currentUser} onBack={() => setActiveSection(null)} />;
  if (activeSection === 'billing') return <BillingSection onBack={() => setActiveSection(null)} />;
  if (activeSection === 'history') return <DataHistorySection onBack={() => setActiveSection(null)} />;
  if (activeSection === 'help') return <HelpCenterSection onBack={() => setActiveSection(null)} />;
  if (activeSection === 'privacy') return <PrivacySection onBack={() => setActiveSection(null)} />;

  const settingsItems = [
    { key: 'edit', icon: 'edit', label: 'Edit Profile', sub: 'Update name, photo, city' },
    { key: 'manage', icon: 'manage-accounts', label: 'Manage Profile', sub: 'Goals, metrics, trainer link' },
    { key: 'billing', icon: 'credit-card', label: 'Billing', sub: 'Subscription, payments' },
    { key: 'history', icon: 'history', label: 'Data History', sub: 'Check-ins, performance logs' },
    { key: 'help', icon: 'help-outline', label: 'Help Center', sub: 'FAQ, contact support' },
    { key: 'privacy', icon: 'privacy-tip', label: 'Privacy Policy', sub: 'Data usage and rights' },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Top bar with home logo */}
      <View style={styles.topBar}>
        <Pressable onPress={() => router.replace('/(tabs)')} hitSlop={12}>
          <Image source={require('@/assets/mavr_logo.png')} style={styles.topLogo} contentFit="contain" />
        </Pressable>
        <Text style={styles.topBarTitle}>PROFILE</Text>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: 120 }]} showsVerticalScrollIndicator={false}>
        {/* Profile Hero */}
        <View style={styles.hero}>
          <AvatarFrame letter={currentUser.avatar} tier={currentUser.tier} size={72} animated />
          <View style={styles.heroInfo}>
            <Text style={styles.heroName}>{currentUser.name}</Text>
            <Text style={styles.heroCity}>{currentUser.city}</Text>
            <View style={styles.heroBadges}>
              <RankBadge tier={currentUser.tier} points={currentUser.points} showPoints />
              <Badge label={currentUser.role.toUpperCase()} color={Colors.Primary} />
            </View>
          </View>
        </View>

        {/* Trainer Connection */}
        {currentUser.connectedTrainer ? (
          <View style={styles.trainerSection}>
            <View style={styles.trainerHeaderRow}>
              <MaterialIcons name="verified" size={16} color={Colors.Primary} />
              <Text style={styles.trainerHeaderText}>MENTORED BY</Text>
            </View>
            <View style={styles.trainerInfo}>
              <AvatarFrame letter={currentUser.connectedTrainer.avatar} tier={currentUser.connectedTrainer.tier} size={44} animated />
              <View>
                <Text style={styles.trainerName}>{currentUser.connectedTrainer.displayName}</Text>
                <Text style={styles.trainerSpec}>{currentUser.connectedTrainer.specialization}</Text>
              </View>
              <View style={styles.mavrSig}>
                <Text style={styles.mavrSigText}>{currentUser.connectedTrainer.mavrSignature}</Text>
              </View>
            </View>
          </View>
        ) : null}

        {/* Stats */}
        <View style={styles.statsRow}>
          <StatCard label="Streak" value={`${currentUser.streak}d`} icon="local-fire-department" color={Colors.Primary} />
          <StatCard label="Adherence" value={`${currentUser.adherenceScore}%`} icon="track-changes" color="#22C55E" />
          <StatCard label="Points" value={`${(currentUser.points / 1000).toFixed(1)}k`} icon="star" color="#FFD700" />
        </View>

        {/* Badges */}
        {currentUser.badges.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>PERFORMANCE TAGS</Text>
            <View style={styles.badgeGrid}>
              {currentUser.badges.map((b: string) => (
                <View key={b} style={styles.badgeItem}>
                  <MaterialIcons name="verified" size={14} color={Colors.Primary} />
                  <Text style={styles.badgeLabel}>{b}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>SETTINGS</Text>
          {settingsItems.map((item) => (
            <Pressable
              key={item.key}
              style={({ pressed }) => [styles.menuItem, pressed && { backgroundColor: Colors.SurfaceElevated }]}
              onPress={() => setActiveSection(item.key as Section)}
            >
              <View style={styles.menuIcon}>
                <MaterialIcons name={item.icon as any} size={20} color={Colors.Primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Text style={styles.menuSub}>{item.sub}</Text>
              </View>
              <MaterialIcons name="chevron-right" size={20} color={Colors.TextMuted} />
            </Pressable>
          ))}
        </View>

        {/* Sign Out */}
        <Pressable
          style={styles.signOutBtn}
          onPress={async () => {
            const { userService } = require('@/services/userService');
            await userService.resetApp();
            router.replace('/onboarding/role');
          }}
        >
          <MaterialIcons name="logout" size={18} color={Colors.Error} />
          <Text style={styles.signOutText}>Reset App (Dev)</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

// ── Sub-Sections ──────────────────────────────────────────────────────────────
function SectionHeader({ title, onBack }: { title: string; onBack: () => void }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[subStyles.header, { paddingTop: insets.top + 8 }]}>
      <Pressable onPress={onBack} hitSlop={16} style={subStyles.backBtn}>
        <MaterialIcons name="chevron-left" size={28} color={Colors.TextPrimary} />
      </Pressable>
      <Text style={subStyles.title}>{title}</Text>
    </View>
  );
}

function EditProfileSection({ user, onBack }: { user: any; onBack: () => void }) {
  const [name, setName] = useState(user.name);
  const [city, setCity] = useState(user.city);
  const [age, setAge] = useState(String(user.age));
  const [saved, setSaved] = useState(false);

  return (
    <View style={subStyles.container}>
      <SectionHeader title="EDIT PROFILE" onBack={onBack} />
      <ScrollView contentContainerStyle={subStyles.scroll}>
        <View style={subStyles.avatarCenter}>
          <AvatarFrame letter={user.avatar} tier={user.tier} size={64} animated />
          <Pressable style={subStyles.changeAvatarBtn}>
            <Text style={subStyles.changeAvatarText}>CHANGE AVATAR</Text>
          </Pressable>
        </View>
        <FieldInput label="FULL NAME" value={name} onChangeText={setName} />
        <FieldInput label="CITY" value={city} onChangeText={setCity} />
        <FieldInput label="AGE" value={age} onChangeText={setAge} keyboardType="numeric" />
        <Pressable style={subStyles.saveBtn} onPress={() => setSaved(true)}>
          <Text style={subStyles.saveBtnText}>{saved ? 'SAVED' : 'SAVE CHANGES'}</Text>
          {saved && <MaterialIcons name="check" size={18} color="#fff" />}
        </Pressable>
      </ScrollView>
    </View>
  );
}

function ManageProfileSection({ user, onBack }: { user: any; onBack: () => void }) {
  const [goal, setGoal] = useState(user.goal);
  const [weight, setWeight] = useState(String(user.weight));
  const [target, setTarget] = useState(String(user.targetWeight));
  const router = useRouter();

  return (
    <View style={subStyles.container}>
      <SectionHeader title="MANAGE PROFILE" onBack={onBack} />
      <ScrollView contentContainerStyle={subStyles.scroll}>
        <Text style={subStyles.sectionLabel}>TRAINING GOALS</Text>
        {['Muscle Gain', 'Fat Loss', 'Strength', 'Endurance', 'Recomp'].map((g) => (
          <Pressable key={g} style={[subStyles.optionRow, goal === g && subStyles.optionRowActive]} onPress={() => setGoal(g)}>
            <Text style={[subStyles.optionText, goal === g && { color: Colors.Primary }]}>{g}</Text>
            {goal === g && <MaterialIcons name="check" size={18} color={Colors.Primary} />}
          </Pressable>
        ))}

        <Text style={[subStyles.sectionLabel, { marginTop: Spacing.md }]}>BODY METRICS</Text>
        <FieldInput label="CURRENT WEIGHT (kg)" value={weight} onChangeText={setWeight} keyboardType="numeric" />
        <FieldInput label="TARGET WEIGHT (kg)" value={target} onChangeText={setTarget} keyboardType="numeric" />

        <Text style={[subStyles.sectionLabel, { marginTop: Spacing.md }]}>TRAINER CONNECTION</Text>
        <Pressable style={subStyles.linkBtn} onPress={() => router.push('/onboarding/connect')}>
          <MaterialIcons name="link" size={18} color={Colors.Primary} />
          <Text style={subStyles.linkBtnText}>Manage Trainer Connection</Text>
          <MaterialIcons name="chevron-right" size={18} color={Colors.TextMuted} />
        </Pressable>

        <Pressable style={subStyles.saveBtn} onPress={onBack}>
          <Text style={subStyles.saveBtnText}>SAVE CHANGES</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

function BillingSection({ onBack }: { onBack: () => void }) {
  return (
    <View style={subStyles.container}>
      <SectionHeader title="BILLING" onBack={onBack} />
      <ScrollView contentContainerStyle={subStyles.scroll}>
        <View style={subStyles.planCard}>
          <Text style={subStyles.planBadge}>CURRENT PLAN</Text>
          <Text style={subStyles.planName}>MAVR FREE</Text>
          <Text style={subStyles.planDesc}>Basic features. Upgrade to unlock AI-powered plans, advanced analytics and premium identity.</Text>
        </View>

        {[
          { name: 'MAVR CORE', price: '₹299/mo', features: ['AI Workout & Diet Plans', 'Check-in System', 'Basic Analytics'] },
          { name: 'MAVR REDLINE', price: '₹699/mo', features: ['Everything in CORE', 'Trainer Connection', 'Advanced Biometrics', 'Priority AI'] },
          { name: 'MAVR ELITE', price: '₹1499/mo', features: ['Everything in REDLINE', 'Exclusive Identity Frames', 'Elite Apparel Access', 'Custom Protocol AI'] },
        ].map((plan) => (
          <View key={plan.name} style={subStyles.billingPlan}>
            <View style={subStyles.billingPlanHeader}>
              <Text style={subStyles.billingPlanName}>{plan.name}</Text>
              <Text style={subStyles.billingPlanPrice}>{plan.price}</Text>
            </View>
            {plan.features.map((f) => (
              <View key={f} style={subStyles.featureRow}>
                <MaterialIcons name="check" size={14} color={Colors.Primary} />
                <Text style={subStyles.featureText}>{f}</Text>
              </View>
            ))}
            <Pressable style={subStyles.upgradeBtn}>
              <Text style={subStyles.upgradeBtnText}>UPGRADE TO {plan.name.split(' ')[1]}</Text>
            </Pressable>
          </View>
        ))}

        <Text style={[subStyles.sectionLabel, { marginTop: Spacing.md }]}>TRAINER PAYMENT</Text>
        <View style={subStyles.infoCard}>
          <MaterialIcons name="info-outline" size={16} color={Colors.TextMuted} />
          <Text style={subStyles.infoText}>No active trainer plan. Connect to a trainer to view coaching fees and payment schedule.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

function DataHistorySection({ onBack }: { onBack: () => void }) {
  const CHECKINS = [
    { date: 'Today', morning: true, workout: true, night: false },
    { date: 'Yesterday', morning: true, workout: true, night: true },
    { date: '2 days ago', morning: true, workout: false, night: true },
    { date: '3 days ago', morning: true, workout: true, night: true },
    { date: '4 days ago', morning: false, workout: true, night: true },
  ];

  return (
    <View style={subStyles.container}>
      <SectionHeader title="DATA HISTORY" onBack={onBack} />
      <ScrollView contentContainerStyle={subStyles.scroll}>
        <View style={subStyles.statsOverview}>
          <View style={subStyles.overviewStat}>
            <Text style={subStyles.overviewVal}>18</Text>
            <Text style={subStyles.overviewLabel}>DAY STREAK</Text>
          </View>
          <View style={subStyles.overviewStat}>
            <Text style={[subStyles.overviewVal, { color: '#22C55E' }]}>87%</Text>
            <Text style={subStyles.overviewLabel}>30D ADHERENCE</Text>
          </View>
          <View style={subStyles.overviewStat}>
            <Text style={[subStyles.overviewVal, { color: '#FFD700' }]}>2340</Text>
            <Text style={subStyles.overviewLabel}>TOTAL XP</Text>
          </View>
        </View>

        <Text style={subStyles.sectionLabel}>CHECK-IN LOG</Text>
        {CHECKINS.map((c, i) => (
          <View key={i} style={subStyles.checkinRow}>
            <Text style={subStyles.checkinDate}>{c.date}</Text>
            <View style={subStyles.checkinDots}>
              <View style={[subStyles.dot, { backgroundColor: c.morning ? '#22C55E' : Colors.SurfaceElevated }]} />
              <View style={[subStyles.dot, { backgroundColor: c.workout ? Colors.Primary : Colors.SurfaceElevated }]} />
              <View style={[subStyles.dot, { backgroundColor: c.night ? '#818CF8' : Colors.SurfaceElevated }]} />
            </View>
            <Text style={subStyles.checkinScore}>
              {[c.morning, c.workout, c.night].filter(Boolean).length}/3
            </Text>
          </View>
        ))}
        <View style={subStyles.dotLegend}>
          <View style={subStyles.legendItem}><View style={[subStyles.dot, { backgroundColor: '#22C55E' }]} /><Text style={subStyles.legendText}>Morning</Text></View>
          <View style={subStyles.legendItem}><View style={[subStyles.dot, { backgroundColor: Colors.Primary }]} /><Text style={subStyles.legendText}>Workout</Text></View>
          <View style={subStyles.legendItem}><View style={[subStyles.dot, { backgroundColor: '#818CF8' }]} /><Text style={subStyles.legendText}>Night</Text></View>
        </View>
      </ScrollView>
    </View>
  );
}

function HelpCenterSection({ onBack }: { onBack: () => void }) {
  const FAQS = [
    { q: 'How do I connect to a trainer?', a: 'Go to Connects → Trainers → Enter Trainer Signature. Your trainer will share their MAVR Signature code.' },
    { q: 'What is the Redline Score?', a: 'Redline Score = 40% Nutrition + 40% Training Completion + 20% Recovery. It measures your execution accuracy over 24 hours.' },
    { q: 'How do I earn badges?', a: 'Badges are earned through consistent performance over 30 days. Check the Identity tab in Connects for details.' },
    { q: 'Can I change my goal after onboarding?', a: 'Yes — go to Profile → Manage Profile to update your training goal and body metrics.' },
  ];

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <View style={subStyles.container}>
      <SectionHeader title="HELP CENTER" onBack={onBack} />
      <ScrollView contentContainerStyle={subStyles.scroll}>
        <Pressable style={subStyles.contactCard} onPress={() => Linking.openURL('mailto:support@mavr.in')}>
          <MaterialIcons name="email" size={22} color={Colors.Primary} />
          <View style={{ flex: 1 }}>
            <Text style={subStyles.contactTitle}>Contact Support</Text>
            <Text style={subStyles.contactSub}>support@mavr.in · Typically responds in 24h</Text>
          </View>
          <MaterialIcons name="chevron-right" size={20} color={Colors.TextMuted} />
        </Pressable>

        <Text style={subStyles.sectionLabel}>FREQUENTLY ASKED</Text>
        {FAQS.map((faq, i) => (
          <Pressable key={i} style={subStyles.faqCard} onPress={() => setOpenFaq(openFaq === i ? null : i)}>
            <View style={subStyles.faqHeader}>
              <Text style={subStyles.faqQ}>{faq.q}</Text>
              <MaterialIcons name={openFaq === i ? 'expand-less' : 'expand-more'} size={20} color={Colors.TextMuted} />
            </View>
            {openFaq === i && <Text style={subStyles.faqA}>{faq.a}</Text>}
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

function PrivacySection({ onBack }: { onBack: () => void }) {
  return (
    <View style={subStyles.container}>
      <SectionHeader title="PRIVACY POLICY" onBack={onBack} />
      <ScrollView contentContainerStyle={subStyles.scroll}>
        {[
          { title: 'Data We Collect', body: 'MAVR collects profile data, workout logs, diet check-ins, and biometric data you choose to share via smartwatch. This data is used solely to provide personalized athlete intelligence.' },
          { title: 'How We Use Your Data', body: 'Your data is used to calculate your Redline Score, generate AI plans, and improve your athlete experience. We never sell your personal data to third parties.' },
          { title: 'Trainer Data Access', body: 'When connected to a trainer, your workout logs, diet adherence, and check-in data are visible to your trainer. You can revoke trainer access at any time from Manage Profile.' },
          { title: 'Payment Data', body: 'Payment transactions are processed securely. MAVR retains transaction records for billing purposes. Card details are never stored on MAVR servers.' },
          { title: 'Data Deletion', body: 'You may request complete deletion of your account and data at any time by contacting support@mavr.in. Data will be removed within 30 days.' },
          { title: 'Contact', body: 'For privacy concerns or data requests, contact privacy@mavr.in.' },
        ].map((section) => (
          <View key={section.title} style={subStyles.privacySection}>
            <Text style={subStyles.privacyTitle}>{section.title}</Text>
            <Text style={subStyles.privacyBody}>{section.body}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

function FieldInput({ label, value, onChangeText, keyboardType }: any) {
  return (
    <View style={{ gap: 6, marginBottom: Spacing.sm }}>
      <Text style={subStyles.fieldLabel}>{label}</Text>
      <TextInput
        style={subStyles.input}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType || 'default'}
        placeholderTextColor={Colors.TextMuted}
      />
    </View>
  );
}

// Main profile styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.Background },
  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    borderBottomWidth: 1, borderBottomColor: Colors.SurfaceBorder,
  },
  topLogo: { width: 36, height: 30 },
  topBarTitle: { fontSize: FontSize.lg, color: Colors.TextPrimary, fontWeight: FontWeight.black, letterSpacing: 2 },
  scroll: { paddingHorizontal: Spacing.md, gap: Spacing.md, paddingTop: Spacing.md },
  hero: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.SurfaceCard, borderRadius: Radius.xl,
    padding: Spacing.lg, borderWidth: 1, borderColor: Colors.SurfaceBorder,
  },
  heroInfo: { flex: 1, gap: 6 },
  heroName: { fontSize: FontSize.xxl, color: Colors.TextPrimary, fontWeight: FontWeight.black },
  heroCity: { fontSize: FontSize.sm, color: Colors.TextSecondary },
  heroBadges: { flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap' },
  trainerSection: {
    backgroundColor: Colors.PrimaryGlow, borderRadius: Radius.lg,
    padding: Spacing.md, borderWidth: 1, borderColor: Colors.Primary + '33', gap: Spacing.sm,
  },
  trainerHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  trainerHeaderText: { fontSize: FontSize.xs, color: Colors.TextMuted, fontWeight: FontWeight.black, letterSpacing: 1.5 },
  trainerInfo: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  trainerName: { fontSize: FontSize.md, color: Colors.TextPrimary, fontWeight: FontWeight.bold },
  trainerSpec: { fontSize: FontSize.sm, color: Colors.TextSecondary },
  mavrSig: { marginLeft: 'auto', backgroundColor: Colors.Primary + '22', borderRadius: Radius.full, paddingHorizontal: 8, paddingVertical: 4 },
  mavrSigText: { fontSize: FontSize.xs, color: Colors.Primary, fontWeight: FontWeight.black },
  statsRow: { flexDirection: 'row', gap: Spacing.sm },
  section: { gap: Spacing.sm },
  sectionLabel: { fontSize: FontSize.xs, color: Colors.TextMuted, fontWeight: FontWeight.black, letterSpacing: 2 },
  badgeGrid: { flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap' },
  badgeItem: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: Spacing.md, paddingVertical: 6,
    backgroundColor: Colors.PrimaryGlow, borderRadius: Radius.full,
    borderWidth: 1, borderColor: Colors.Primary + '33',
  },
  badgeLabel: { fontSize: FontSize.sm, color: Colors.Primary, fontWeight: FontWeight.bold },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.SurfaceCard, borderRadius: Radius.md,
    padding: Spacing.md, borderWidth: 1, borderColor: Colors.SurfaceBorder,
  },
  menuIcon: { width: 40, height: 40, borderRadius: Radius.sm, backgroundColor: Colors.PrimaryGlow, alignItems: 'center', justifyContent: 'center' },
  menuLabel: { fontSize: FontSize.md, color: Colors.TextPrimary, fontWeight: FontWeight.medium },
  menuSub: { fontSize: FontSize.xs, color: Colors.TextMuted, marginTop: 2 },
  signOutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, paddingVertical: Spacing.md },
  signOutText: { fontSize: FontSize.sm, color: Colors.Error, fontWeight: FontWeight.medium },
});

// Sub-section styles
const subStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.Background },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: Spacing.md, paddingBottom: Spacing.sm,
    borderBottomWidth: 1, borderBottomColor: Colors.SurfaceBorder, gap: Spacing.sm,
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.SurfaceElevated, borderRadius: Radius.md },
  title: { fontSize: FontSize.lg, color: Colors.TextPrimary, fontWeight: FontWeight.black, letterSpacing: 2 },
  scroll: { paddingHorizontal: Spacing.md, paddingTop: Spacing.md, paddingBottom: 100, gap: Spacing.sm },
  sectionLabel: { fontSize: FontSize.xs, color: Colors.TextMuted, fontWeight: FontWeight.black, letterSpacing: 2, marginTop: 4 },
  avatarCenter: { alignItems: 'center', gap: Spacing.md, paddingVertical: Spacing.md },
  changeAvatarBtn: { backgroundColor: Colors.SurfaceElevated, borderRadius: Radius.md, paddingHorizontal: Spacing.md, paddingVertical: 8, borderWidth: 1, borderColor: Colors.SurfaceBorder },
  changeAvatarText: { fontSize: FontSize.xs, color: Colors.Primary, fontWeight: FontWeight.black, letterSpacing: 1 },
  fieldLabel: { fontSize: FontSize.xs, color: Colors.TextMuted, fontWeight: FontWeight.bold, letterSpacing: 1.5 },
  input: {
    backgroundColor: Colors.SurfaceCard, borderRadius: Radius.md,
    borderWidth: 1, borderColor: Colors.SurfaceBorder,
    paddingHorizontal: Spacing.md, paddingVertical: 14,
    color: Colors.TextPrimary, fontSize: FontSize.base,
  },
  saveBtn: {
    backgroundColor: Colors.Primary, borderRadius: Radius.md,
    paddingVertical: 16, alignItems: 'center', justifyContent: 'center',
    flexDirection: 'row', gap: 8, marginTop: Spacing.md,
  },
  saveBtnText: { fontSize: FontSize.md, color: '#fff', fontWeight: FontWeight.black, letterSpacing: 1.5 },
  optionRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.SurfaceCard, borderRadius: Radius.md,
    padding: Spacing.md, borderWidth: 1, borderColor: Colors.SurfaceBorder,
  },
  optionRowActive: { borderColor: Colors.Primary, backgroundColor: Colors.PrimaryGlow },
  optionText: { fontSize: FontSize.md, color: Colors.TextPrimary, fontWeight: FontWeight.medium },
  linkBtn: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.SurfaceCard, borderRadius: Radius.md,
    padding: Spacing.md, borderWidth: 1, borderColor: Colors.SurfaceBorder,
  },
  linkBtnText: { flex: 1, fontSize: FontSize.md, color: Colors.TextPrimary },
  // Billing
  planCard: {
    backgroundColor: Colors.SurfaceCard, borderRadius: Radius.xl,
    padding: Spacing.lg, borderWidth: 1, borderColor: Colors.SurfaceBorder, gap: Spacing.sm,
  },
  planBadge: { fontSize: FontSize.xs, color: Colors.TextMuted, fontWeight: FontWeight.black, letterSpacing: 2 },
  planName: { fontSize: FontSize.xxxl, color: Colors.TextPrimary, fontWeight: FontWeight.black, letterSpacing: 2 },
  planDesc: { fontSize: FontSize.sm, color: Colors.TextSecondary, lineHeight: 20 },
  billingPlan: {
    backgroundColor: Colors.SurfaceCard, borderRadius: Radius.lg,
    padding: Spacing.md, borderWidth: 1, borderColor: Colors.SurfaceBorder, gap: Spacing.sm,
  },
  billingPlanHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  billingPlanName: { fontSize: FontSize.md, color: Colors.TextPrimary, fontWeight: FontWeight.black, letterSpacing: 1 },
  billingPlanPrice: { fontSize: FontSize.md, color: Colors.Primary, fontWeight: FontWeight.black },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  featureText: { fontSize: FontSize.sm, color: Colors.TextSecondary },
  upgradeBtn: {
    backgroundColor: Colors.Primary, borderRadius: Radius.md,
    paddingVertical: 12, alignItems: 'center', marginTop: 4,
  },
  upgradeBtnText: { fontSize: FontSize.sm, color: '#fff', fontWeight: FontWeight.black, letterSpacing: 1 },
  infoCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm,
    backgroundColor: Colors.SurfaceCard, borderRadius: Radius.md,
    padding: Spacing.md, borderWidth: 1, borderColor: Colors.SurfaceBorder,
  },
  infoText: { flex: 1, fontSize: FontSize.sm, color: Colors.TextMuted, lineHeight: 20 },
  // History
  statsOverview: {
    flexDirection: 'row', justifyContent: 'space-around',
    backgroundColor: Colors.SurfaceCard, borderRadius: Radius.xl,
    padding: Spacing.lg, borderWidth: 1, borderColor: Colors.SurfaceBorder,
  },
  overviewStat: { alignItems: 'center', gap: 4 },
  overviewVal: { fontSize: FontSize.xxxl, color: Colors.Primary, fontWeight: FontWeight.black },
  overviewLabel: { fontSize: 9, color: Colors.TextMuted, letterSpacing: 1.5, fontWeight: FontWeight.bold },
  checkinRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.SurfaceCard, borderRadius: Radius.md,
    padding: Spacing.md, borderWidth: 1, borderColor: Colors.SurfaceBorder,
  },
  checkinDate: { flex: 1, fontSize: FontSize.sm, color: Colors.TextPrimary },
  checkinDots: { flexDirection: 'row', gap: 6 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  checkinScore: { width: 24, fontSize: FontSize.sm, color: Colors.TextMuted, textAlign: 'right', fontWeight: FontWeight.bold },
  dotLegend: { flexDirection: 'row', gap: Spacing.md, justifyContent: 'center', marginTop: 4 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendText: { fontSize: FontSize.xs, color: Colors.TextMuted },
  // Help
  contactCard: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.SurfaceCard, borderRadius: Radius.xl,
    padding: Spacing.lg, borderWidth: 1, borderColor: Colors.Primary + '33',
  },
  contactTitle: { fontSize: FontSize.md, color: Colors.TextPrimary, fontWeight: FontWeight.bold },
  contactSub: { fontSize: FontSize.xs, color: Colors.TextMuted },
  faqCard: {
    backgroundColor: Colors.SurfaceCard, borderRadius: Radius.md,
    padding: Spacing.md, borderWidth: 1, borderColor: Colors.SurfaceBorder, gap: Spacing.sm,
  },
  faqHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  faqQ: { flex: 1, fontSize: FontSize.md, color: Colors.TextPrimary, fontWeight: FontWeight.semibold, paddingRight: 8 },
  faqA: { fontSize: FontSize.sm, color: Colors.TextSecondary, lineHeight: 20 },
  // Privacy
  privacySection: { gap: 6 },
  privacyTitle: { fontSize: FontSize.md, color: Colors.TextPrimary, fontWeight: FontWeight.bold },
  privacyBody: { fontSize: FontSize.sm, color: Colors.TextSecondary, lineHeight: 22 },
});

// StatCard helper
function StatCard({ label, value, icon, color }: { label: string; value: string; icon: string; color: string }) {
  return (
    <View style={[styles.statsRow, { flex: 1, flexDirection: 'column', alignItems: 'center', backgroundColor: Colors.SurfaceCard, borderRadius: Radius.lg, padding: Spacing.md, borderWidth: 1, borderColor: color + '33', gap: 4 }]}>
      <MaterialIcons name={icon as any} size={20} color={color} />
      <Text style={[{ fontSize: FontSize.xl, fontWeight: FontWeight.black, color }]}>{value}</Text>
      <Text style={[{ fontSize: FontSize.xs, color: Colors.TextMuted, fontWeight: FontWeight.medium }]}>{label}</Text>
    </View>
  );
}
