import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontSize, FontWeight, Radius, Spacing } from '@/constants/theme';

interface BadgeProps {
  label: string;
  color?: string;
  size?: 'sm' | 'md';
  variant?: 'filled' | 'outline';
}

export function Badge({ label, color = Colors.Primary, size = 'sm', variant = 'filled' }: BadgeProps) {
  return (
    <View
      style={[
        styles.badge,
        size === 'md' && styles.badgeMd,
        variant === 'filled' ? { backgroundColor: color + '22', borderColor: color + '55' } : { borderColor: color },
      ]}
    >
      <Text style={[styles.label, size === 'md' && styles.labelMd, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  badgeMd: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 5,
  },
  label: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  labelMd: {
    fontSize: FontSize.sm,
  },
});
