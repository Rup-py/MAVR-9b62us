import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, Radius, Spacing } from '@/constants/theme';

interface TrainerBadgeProps {
  trainerName: string;
  tier?: string;
  compact?: boolean;
}

export function TrainerBadge({ trainerName, tier = 'coach', compact = false }: TrainerBadgeProps) {
  if (compact) {
    return (
      <View style={styles.compact}>
        <MaterialIcons name="verified" size={12} color={Colors.Primary} />
        <Text style={styles.compactText}>Mentored by {trainerName}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.icon}>
        <MaterialIcons name="fitness-center" size={16} color={Colors.Primary} />
      </View>
      <View>
        <Text style={styles.label}>MENTORED BY</Text>
        <Text style={styles.name}>{trainerName}</Text>
      </View>
      <MaterialIcons name="verified" size={16} color={Colors.Primary} style={{ marginLeft: 'auto' }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.PrimaryGlow,
    borderWidth: 1,
    borderColor: Colors.Primary + '33',
    borderRadius: Radius.md,
    padding: Spacing.md,
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.Primary + '22',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: FontSize.xs,
    color: Colors.TextMuted,
    fontWeight: FontWeight.bold,
    letterSpacing: 1.2,
  },
  name: {
    fontSize: FontSize.md,
    color: Colors.TextPrimary,
    fontWeight: FontWeight.bold,
  },
  compact: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  compactText: {
    fontSize: FontSize.xs,
    color: Colors.Primary,
    fontWeight: FontWeight.semibold,
  },
});
