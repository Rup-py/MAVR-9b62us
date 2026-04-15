import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '@/constants/theme';

const SUBSCRIPTION_PLANS = [
  {
    id: 'starter',
    label: 'STARTER',
    price: 'Free',
    color: '#666666',
    features: ['AI Workout Plan', 'Diet Structure', 'Basic Check-Ins', 'STARTER Identity'],
    current: true,
  },
  {
    id: 'core',
    label: 'CORE',
    price: '₹499/mo',
    color: Colors.Primary,
    features: ['Everything in Starter', 'Advanced Analytics', 'Trainer Connection', 'CORE Identity + Frame', 'Priority Support'],
    recommended: true,
    current: false,
  },
  {
    id: 'elite',
    label: 'ELITE',
    price: '₹999/mo',
    color: '#FFD700',
    features: ['Everything in Core', 'AI Enhanced Personalization', 'Event Mode Pass', 'ELITE Identity + Premium Frame', 'Exclusive Badge Access', 'Community Leadership'],
    current: false,
  },
];

const ACHIEVEMENTS = [
  { icon: 'local-fire-department', label: '7-Day Streak', unlocked: true, color: Colors.Primary },
  { icon: 'fitness-center', label: '50 Workouts', unlocked: true, color: Colors.Primary },
  { icon: 'track-changes', label: '80% Adherence', unlocked: true, color: '#22C55E' },
  { icon: 'restaurant', label: 'Diet Precision', unlocked: false, color: Colors.TextMuted },
  { icon: 'event', label: 'Event Ready', unlocked: false, color: Colors.TextMuted },
  { icon: 'workspace-premium', label: 'REDLINE Rank', unlocked: true, color: '#FFD700' },
];

export default function VaultScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <MaterialIcons name="lock-open" size={22} color={Colors.Primary} />
        <View>
          <Text style={styles.headerTitle}>VAULT</Text>
          <Text style={styles.headerSub}>Identity, Plans & Premium Access</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: 100 }]} showsVerticalScrollIndicator={false}>

        {/* Current Plan */}
        <View style={styles.currentPlan}>
          <MaterialIcons name="star" size={14} color="#FFD700" />
          <Text style={styles.currentPlanText}>Currently on STARTER — Free Plan</Text>
        </View>

        {/* Plans */}
        <Text style={styles.sectionLabel}>SUBSCRIPTION PLANS</Text>
        {SUBSCRIPTION_PLANS.map((plan) => (
          <View
            key={plan.id}
            style={[
              styles.planCard,
              plan.current && { borderColor: Colors.SurfaceBorder },
              plan.recommended && { borderColor: Colors.Primary + '66' },
              !plan.current && !plan.recommended && { borderColor: Colors.SurfaceBorder, opacity: 0.8 },
            ]}
          >
            {plan.recommended && (
              <View style={styles.recommendedBadge}>
                <Text style={styles.recommendedText}>RECOMMENDED</Text>
              </View>
            )}
            <View style={styles.planHeader}>
              <Text style={[styles.planName, { color: plan.color }]}>{plan.label}</Text>
              <Text style={[styles.planPrice, { color: plan.current ? Colors.TextMuted : plan.color }]}>
                {plan.price}
              </Text>
            </View>
            <View style={styles.planFeatures}>
              {plan.features.map((feature) => (
                <View key={feature} style={styles.planFeature}>
                  <MaterialIcons name="check" size={14} color={plan.current ? Colors.TextMuted : plan.color} />
                  <Text style={[styles.planFeatureText, plan.current && { color: Colors.TextMuted }]}>{feature}</Text>
                </View>
              ))}
            </View>
            {!plan.current ? (
              <Pressable style={[styles.upgradeBtn, { backgroundColor: plan.color }]}>
                <Text style={styles.upgradeBtnText}>UPGRADE</Text>
              </Pressable>
            ) : (
              <View style={styles.currentBadge}>
                <MaterialIcons name="check-circle" size={14} color={Colors.TextMuted} />
                <Text style={styles.currentBadgeText}>ACTIVE PLAN</Text>
              </View>
            )}
          </View>
        ))}

        {/* Achievements */}
        <Text style={styles.sectionLabel}>ACHIEVEMENTS</Text>
        <View style={styles.achievementGrid}>
          {ACHIEVEMENTS.map((a) => (
            <View key={a.label} style={[styles.achievementCard, !a.unlocked && styles.achievementLocked]}>
              <MaterialIcons name={a.icon as any} size={28} color={a.unlocked ? a.color : Colors.TextMuted} />
              <Text style={[styles.achievementLabel, { color: a.unlocked ? Colors.TextPrimary : Colors.TextMuted }]}>{a.label}</Text>
              {!a.unlocked && <MaterialIcons name="lock" size={12} color={Colors.TextMuted} />}
            </View>
          ))}
        </View>

        {/* Trainer Revenue Info */}
        <Text style={styles.sectionLabel}>TRAINER MONETIZATION</Text>
        <View style={styles.infoCard}>
          <MaterialIcons name="payments" size={24} color={Colors.Primary} />
          <View style={{ flex: 1 }}>
            <Text style={styles.infoTitle}>In-App Trainer Payments</Text>
            <Text style={styles.infoDesc}>Students pay trainers directly through MAVR. Set your fee model, track billing, and receive payouts.</Text>
          </View>
        </View>
        <View style={styles.infoCard}>
          <MaterialIcons name="show-chart" size={24} color="#22C55E" />
          <View style={{ flex: 1 }}>
            <Text style={styles.infoTitle}>Transparent Fee Split</Text>
            <Text style={styles.infoDesc}>Platform fee + trainer payout + processing fee. Modular and clearly visible to all parties.</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.Background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.SurfaceBorder,
  },
  headerTitle: { fontSize: FontSize.xl, color: Colors.TextPrimary, fontWeight: FontWeight.black, letterSpacing: 2 },
  headerSub: { fontSize: FontSize.xs, color: Colors.TextMuted },
  scroll: { paddingHorizontal: Spacing.md, gap: Spacing.sm, paddingTop: Spacing.md },
  currentPlan: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.SurfaceCard,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.SurfaceBorder,
  },
  currentPlanText: { fontSize: FontSize.sm, color: Colors.TextSecondary, fontWeight: FontWeight.medium },
  sectionLabel: { fontSize: FontSize.xs, color: Colors.TextMuted, fontWeight: FontWeight.black, letterSpacing: 2, marginTop: Spacing.sm },
  planCard: {
    backgroundColor: Colors.SurfaceCard,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    gap: Spacing.md,
    position: 'relative',
    overflow: 'hidden',
  },
  recommendedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: Colors.Primary,
    borderRadius: Radius.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  recommendedText: { fontSize: FontSize.xs - 1, color: Colors.TextPrimary, fontWeight: FontWeight.black, letterSpacing: 1 },
  planHeader: { gap: 4 },
  planName: { fontSize: FontSize.xl, fontWeight: FontWeight.black, letterSpacing: 2 },
  planPrice: { fontSize: FontSize.xxl, fontWeight: FontWeight.black },
  planFeatures: { gap: 8 },
  planFeature: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  planFeatureText: { fontSize: FontSize.md, color: Colors.TextPrimary },
  upgradeBtn: {
    borderRadius: Radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  upgradeBtnText: { fontSize: FontSize.md, color: Colors.Background, fontWeight: FontWeight.black, letterSpacing: 1.5 },
  currentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: Spacing.md,
  },
  currentBadgeText: { fontSize: FontSize.sm, color: Colors.TextMuted, fontWeight: FontWeight.bold, letterSpacing: 1 },
  achievementGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  achievementCard: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: Colors.SurfaceCard,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.SurfaceBorder,
    padding: Spacing.sm,
  },
  achievementLocked: { opacity: 0.4 },
  achievementLabel: { fontSize: FontSize.xs - 1, textAlign: 'center', fontWeight: FontWeight.medium },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    backgroundColor: Colors.SurfaceCard,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.SurfaceBorder,
  },
  infoTitle: { fontSize: FontSize.md, color: Colors.TextPrimary, fontWeight: FontWeight.bold, marginBottom: 4 },
  infoDesc: { fontSize: FontSize.sm, color: Colors.TextSecondary, lineHeight: 20 },
});
