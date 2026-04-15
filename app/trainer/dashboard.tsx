import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { AvatarFrame, RankBadge, StatBar } from '@/components';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '@/constants/theme';
import { MOCK_STUDENTS, MOCK_TRAINER } from '@/services/mockData';
import { userService } from '@/services/userService';

type Tab = 'roster' | 'analytics' | 'billing';

export default function TrainerDashboard() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('roster');
  const [trainer, setTrainer] = useState(MOCK_TRAINER);

  useEffect(() => {
    userService.getTrainer().then((t) => {
      if (t) setTrainer(t as any);
    });
  }, []);

  const totalRevenue = MOCK_STUDENTS.filter((s) => s.paymentStatus === 'paid').length * (trainer.pricingMonthly || 3500);
  const overdueCount = MOCK_STUDENTS.filter((s) => s.paymentStatus === 'overdue').length;

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/community');
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={handleBack} hitSlop={16} style={styles.backBtn}>
          <MaterialIcons name="chevron-left" size={30} color={Colors.TextPrimary} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>COMMAND CENTER</Text>
          <Text style={styles.headerSub}>{trainer.mavrSignature}</Text>
        </View>
        <AvatarFrame letter={(trainer.avatar || 'V').charAt(0)} tier={trainer.tier} size={40} animated />
      </View>

      {/* Trainer Card */}
      <View style={styles.trainerCard}>
        <View style={styles.trainerLeft}>
          <Text style={styles.trainerName}>{trainer.displayName || trainer.name}</Text>
          <Text style={styles.trainerSpec}>{trainer.specialization}</Text>
          <View style={styles.trainerMeta}>
            <View style={styles.metaChip}>
              <MaterialIcons name="group" size={12} color={Colors.Primary} />
              <Text style={styles.metaChipText}>{MOCK_STUDENTS.length} students</Text>
            </View>
            <View style={styles.metaChip}>
              <MaterialIcons name="star" size={12} color="#FFD700" />
              <Text style={styles.metaChipText}>{trainer.rating}</Text>
            </View>
          </View>
        </View>
        <View style={styles.revenueBox}>
          <Text style={styles.revenueLabel}>MONTHLY</Text>
          <Text style={styles.revenueAmount}>₹{totalRevenue.toLocaleString()}</Text>
        </View>
      </View>

      {/* Summary Row */}
      <View style={styles.summaryRow}>
        <SummaryCard label="Active" value={MOCK_STUDENTS.length} icon="person" color={Colors.Primary} />
        <SummaryCard label="Paid" value={MOCK_STUDENTS.filter((s) => s.paymentStatus === 'paid').length} icon="check-circle" color="#22C55E" />
        <SummaryCard label="Overdue" value={overdueCount} icon="warning" color={Colors.Error} />
        <SummaryCard label="Avg Score" value={Math.round(MOCK_STUDENTS.reduce((a, s) => a + s.adherenceScore, 0) / MOCK_STUDENTS.length)} icon="bar-chart" color="#818CF8" unit="%" />
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {(['roster', 'analytics', 'billing'] as Tab[]).map((tab) => (
          <Pressable
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: 40 }]} showsVerticalScrollIndicator={false}>
        {activeTab === 'roster' && <RosterTab router={router} />}
        {activeTab === 'analytics' && <AnalyticsTab />}
        {activeTab === 'billing' && <BillingTab trainer={trainer} />}
      </ScrollView>
    </View>
  );
}

function SummaryCard({ label, value, icon, color, unit = '' }: any) {
  return (
    <View style={[styles.summaryCard, { borderColor: color + '33' }]}>
      <MaterialIcons name={icon} size={16} color={color} />
      <Text style={[styles.summaryValue, { color }]}>{value}{unit}</Text>
      <Text style={styles.summaryLabel}>{label}</Text>
    </View>
  );
}

function RosterTab({ router }: { router: any }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>STUDENT ROSTER</Text>
      {MOCK_STUDENTS.map((student) => (
        <Pressable
          key={student.id}
          style={({ pressed }) => [styles.studentCard, pressed && { opacity: 0.82 }]}
          onPress={() => router.push({ pathname: '/trainer/student', params: { id: student.id } })}
        >
          <AvatarFrame letter={student.avatar} tier={student.tier} size={44} animated />
          <View style={{ flex: 1, gap: 4 }}>
            <View style={styles.studentHeaderRow}>
              <Text style={styles.studentName}>{student.name}</Text>
              <View style={[styles.paymentDot, { backgroundColor: student.paymentStatus === 'paid' ? '#22C55E' : student.paymentStatus === 'overdue' ? Colors.Error : '#F59E0B' }]} />
            </View>
            <Text style={styles.studentGoal}>{student.goal} · {student.city}</Text>
            <View style={styles.studentMeta}>
              <View style={styles.metaChip}>
                <MaterialIcons name="bolt" size={11} color={Colors.Primary} />
                <Text style={styles.metaChipText}>{student.redlineScore}%</Text>
              </View>
              <View style={styles.metaChip}>
                <MaterialIcons name="local-fire-department" size={11} color={Colors.Primary} />
                <Text style={styles.metaChipText}>{student.streak}d</Text>
              </View>
              <Text style={styles.lastCheckin}>Last: {student.lastCheckIn}</Text>
            </View>
          </View>
          <MaterialIcons name="chevron-right" size={20} color={Colors.TextMuted} />
        </Pressable>
      ))}
    </View>
  );
}

function AnalyticsTab() {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>REDLINE ADHERENCE</Text>
      {MOCK_STUDENTS.map((s) => (
        <View key={s.id} style={styles.analyticsRow}>
          <Text style={styles.analyticsName}>{s.name.split(' ')[0]}</Text>
          <View style={{ flex: 1 }}>
            <StatBar label="" value={s.redlineScore} color={s.redlineScore >= 80 ? '#22C55E' : s.redlineScore >= 65 ? '#F59E0B' : Colors.Error} />
          </View>
          <Text style={[styles.analyticsScore, { color: s.redlineScore >= 80 ? '#22C55E' : s.redlineScore >= 65 ? '#F59E0B' : Colors.Error }]}>
            {s.redlineScore}%
          </Text>
        </View>
      ))}

      {/* Sub-metrics */}
      <Text style={[styles.sectionLabel, { marginTop: Spacing.md }]}>TRAINING VOLUME (DAILY TONNAGE)</Text>
      {MOCK_STUDENTS.map((s) => (
        <View key={s.id} style={styles.tonnageRow}>
          <Text style={styles.tonnageName}>{s.name.split(' ')[0]}</Text>
          <Text style={styles.tonnageVal}>{s.dailyTonnage.toLocaleString()} kg</Text>
          <Text style={styles.tonnageSets}>{s.setsLogged}/{s.setsPlanned} sets</Text>
        </View>
      ))}

      <Text style={[styles.sectionLabel, { marginTop: Spacing.md }]}>DRIFT ALERTS</Text>
      {MOCK_STUDENTS.filter((s) => s.redlineScore < 70).map((s) => (
        <View key={s.id} style={styles.inactiveCard}>
          <MaterialIcons name="warning" size={16} color={Colors.Warning} />
          <View style={{ flex: 1 }}>
            <Text style={styles.inactiveName}>{s.name}</Text>
            <Text style={styles.inactiveSub}>
              Redline: {s.redlineScore}% · Sets: {s.setsLogged}/{s.setsPlanned} · Sleep: {s.sleepHours}h
            </Text>
          </View>
          <Pressable style={styles.nudgeBtn}>
            <Text style={styles.nudgeBtnText}>NUDGE</Text>
          </Pressable>
        </View>
      ))}
    </View>
  );
}

function BillingTab({ trainer }: { trainer: any }) {
  return (
    <View style={styles.section}>
      <View style={styles.billingCard}>
        <Text style={styles.sectionLabel}>COACHING FEE</Text>
        <Text style={styles.billingRate}>₹{(trainer.pricingMonthly || 3500).toLocaleString()} / student / month</Text>
      </View>

      <Text style={styles.sectionLabel}>PAYMENT LEDGER</Text>
      {MOCK_STUDENTS.map((s) => (
        <View key={s.id} style={styles.billingRow}>
          <Text style={styles.billingName}>{s.name}</Text>
          <View style={[styles.paymentBadge, {
            backgroundColor: s.paymentStatus === 'paid' ? '#22C55E22' : s.paymentStatus === 'overdue' ? Colors.Error + '22' : '#F59E0B22'
          }]}>
            <Text style={[styles.paymentBadgeText, {
              color: s.paymentStatus === 'paid' ? '#22C55E' : s.paymentStatus === 'overdue' ? Colors.Error : '#F59E0B'
            }]}>
              {s.paymentStatus.toUpperCase()}
            </Text>
          </View>
          <Text style={styles.billingDue}>{s.nextPaymentDue}</Text>
        </View>
      ))}

      <View style={styles.splitInfo}>
        <Text style={styles.sectionLabel}>TRANSPARENT FEE SPLIT</Text>
        {[
          { label: 'Trainer Payout', value: '87%', color: '#22C55E' },
          { label: 'MAVR Platform Fee', value: '10%', color: Colors.Primary },
          { label: 'Processing Fee', value: '3%', color: Colors.TextMuted },
        ].map((item) => (
          <View key={item.label} style={styles.splitRow}>
            <View style={[styles.splitDot, { backgroundColor: item.color }]} />
            <Text style={styles.splitLabel}>{item.label}</Text>
            <Text style={[styles.splitValue, { color: item.color }]}>{item.value}</Text>
          </View>
        ))}
      </View>
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
  backBtn: {
    width: 40, height: 40,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.SurfaceElevated,
    borderRadius: Radius.md,
  },
  headerTitle: { fontSize: FontSize.lg, color: Colors.TextPrimary, fontWeight: FontWeight.black, letterSpacing: 2 },
  headerSub: { fontSize: FontSize.xs, color: Colors.Primary, fontWeight: FontWeight.bold },
  trainerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.SurfaceBorder,
  },
  trainerLeft: { flex: 1, gap: 4 },
  trainerName: { fontSize: FontSize.xl, color: Colors.TextPrimary, fontWeight: FontWeight.black },
  trainerSpec: { fontSize: FontSize.sm, color: Colors.TextSecondary },
  trainerMeta: { flexDirection: 'row', gap: Spacing.sm, marginTop: 4 },
  metaChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 8, paddingVertical: 3,
    backgroundColor: Colors.SurfaceElevated, borderRadius: Radius.full,
  },
  metaChipText: { fontSize: FontSize.xs, color: Colors.TextSecondary, fontWeight: FontWeight.medium },
  revenueBox: {
    alignItems: 'flex-end',
    backgroundColor: Colors.PrimaryGlow,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.Primary + '33',
  },
  revenueLabel: { fontSize: FontSize.xs, color: Colors.TextMuted, fontWeight: FontWeight.bold, letterSpacing: 1 },
  revenueAmount: { fontSize: FontSize.xl, color: Colors.Primary, fontWeight: FontWeight.black },
  summaryRow: { flexDirection: 'row', paddingHorizontal: Spacing.md, gap: Spacing.sm, paddingVertical: Spacing.md },
  summaryCard: {
    flex: 1, alignItems: 'center',
    backgroundColor: Colors.SurfaceCard,
    borderRadius: Radius.md, padding: Spacing.sm,
    borderWidth: 1, gap: 3,
  },
  summaryValue: { fontSize: FontSize.xl, fontWeight: FontWeight.black },
  summaryLabel: { fontSize: FontSize.xs - 1, color: Colors.TextMuted, fontWeight: FontWeight.medium },
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
  sectionLabel: { fontSize: FontSize.xs, color: Colors.TextMuted, fontWeight: FontWeight.black, letterSpacing: 2 },
  studentCard: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.SurfaceCard, borderRadius: Radius.lg,
    padding: Spacing.md, borderWidth: 1, borderColor: Colors.SurfaceBorder,
  },
  studentHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  studentName: { fontSize: FontSize.md, color: Colors.TextPrimary, fontWeight: FontWeight.bold },
  paymentDot: { width: 8, height: 8, borderRadius: 4 },
  studentGoal: { fontSize: FontSize.sm, color: Colors.TextSecondary },
  studentMeta: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  lastCheckin: { fontSize: FontSize.xs, color: Colors.TextMuted, marginLeft: 'auto' },
  analyticsRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingVertical: 4 },
  analyticsName: { width: 60, fontSize: FontSize.sm, color: Colors.TextPrimary, fontWeight: FontWeight.medium },
  analyticsScore: { width: 40, fontSize: FontSize.sm, fontWeight: FontWeight.black, textAlign: 'right' },
  tonnageRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.SurfaceCard, borderRadius: Radius.md,
    padding: Spacing.md, borderWidth: 1, borderColor: Colors.SurfaceBorder,
    gap: Spacing.sm,
  },
  tonnageName: { flex: 1, fontSize: FontSize.sm, color: Colors.TextPrimary, fontWeight: FontWeight.medium },
  tonnageVal: { fontSize: FontSize.sm, color: Colors.Primary, fontWeight: FontWeight.black },
  tonnageSets: { fontSize: FontSize.xs, color: Colors.TextMuted },
  inactiveCard: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.SurfaceCard, borderRadius: Radius.md,
    padding: Spacing.md, borderWidth: 1, borderColor: Colors.Warning + '33',
  },
  inactiveName: { fontSize: FontSize.md, color: Colors.TextPrimary, fontWeight: FontWeight.semibold },
  inactiveSub: { fontSize: FontSize.xs, color: Colors.TextMuted },
  nudgeBtn: {
    backgroundColor: Colors.Warning + '22', borderRadius: Radius.md,
    paddingHorizontal: Spacing.md, paddingVertical: 6,
    borderWidth: 1, borderColor: Colors.Warning + '44',
  },
  nudgeBtnText: { fontSize: FontSize.xs, color: Colors.Warning, fontWeight: FontWeight.black, letterSpacing: 1 },
  billingCard: {
    backgroundColor: Colors.SurfaceCard, borderRadius: Radius.lg,
    padding: Spacing.md, borderWidth: 1, borderColor: Colors.SurfaceBorder, gap: Spacing.sm,
  },
  billingRate: { fontSize: FontSize.xxl, color: Colors.Primary, fontWeight: FontWeight.black },
  billingRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.SurfaceCard, borderRadius: Radius.md,
    padding: Spacing.md, borderWidth: 1, borderColor: Colors.SurfaceBorder,
  },
  billingName: { flex: 1, fontSize: FontSize.md, color: Colors.TextPrimary, fontWeight: FontWeight.medium },
  paymentBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: Radius.full },
  paymentBadgeText: { fontSize: FontSize.xs, fontWeight: FontWeight.black, letterSpacing: 1 },
  billingDue: { fontSize: FontSize.xs, color: Colors.TextMuted },
  splitInfo: {
    backgroundColor: Colors.SurfaceCard, borderRadius: Radius.lg,
    padding: Spacing.md, borderWidth: 1, borderColor: Colors.SurfaceBorder,
    gap: Spacing.md, marginTop: Spacing.sm,
  },
  splitRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  splitDot: { width: 8, height: 8, borderRadius: 4 },
  splitLabel: { flex: 1, fontSize: FontSize.md, color: Colors.TextPrimary, fontWeight: FontWeight.medium },
  splitValue: { fontSize: FontSize.md, fontWeight: FontWeight.black },
});
