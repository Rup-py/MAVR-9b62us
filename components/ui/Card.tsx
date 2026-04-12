import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle, Pressable } from 'react-native';
import { Colors, Radius, Spacing } from '@/constants/theme';

interface CardProps {
  children: ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  elevated?: boolean;
  glowRed?: boolean;
}

export function Card({ children, style, onPress, elevated = false, glowRed = false }: CardProps) {
  const content = (
    <View style={[styles.card, elevated && styles.elevated, glowRed && styles.glowRed, style]}>
      {children}
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [pressed && { opacity: 0.85 }]}>
        {content}
      </Pressable>
    );
  }
  return content;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.SurfaceCard,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.SurfaceBorder,
  },
  elevated: {
    backgroundColor: Colors.SurfaceElevated,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  glowRed: {
    borderColor: Colors.Primary,
    shadowColor: Colors.Primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
});
