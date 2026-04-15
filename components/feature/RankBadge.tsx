import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, Radius, Spacing } from '@/constants/theme';

interface RankBadgeProps {
  tier: string;
  points?: number;
  showPoints?: boolean;
}

const TIER_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
  starter: { label: 'STARTER', color: '#666666', icon: 'star-outline' },
  core: { label: 'CORE', color: '#888888', icon: 'star-half' },
  redline: { label: 'REDLINE', color: Colors.Primary, icon: 'star' },
  ascend: { label: 'ASCEND', color: '#FF4444', icon: 'auto-awesome' },
  elite: { label: 'ELITE', color: '#FFD700', icon: 'workspace-premium' },
};

export function RankBadge({ tier, points, showPoints = false }: RankBadgeProps) {
  const config = TIER_CONFIG[tier] || TIER_CONFIG.starter;

  return (
    <View style={[styles.container, { borderColor: config.color + '55', backgroundColor: config.color + '15' }]}>
      <MaterialIcons name={config.icon as any} size={12} color={config.color} />
      <Text style={[styles.label, { color: config.color }]}>{config.label}</Text>
      {showPoints && points !== undefined && (
        <Text style={[styles.points, { color: config.color }]}>{points.toLocaleString()} XP</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  label: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.black,
    letterSpacing: 1.5,
  },
  points: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    opacity: 0.8,
  },
});
