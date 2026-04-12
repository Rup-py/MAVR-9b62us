import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';
import { Colors, Spacing, Radius, FontSize, FontWeight } from '@/constants/theme';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  fullWidth?: boolean;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
  fullWidth = true,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        styles[`size_${size}`],
        fullWidth && styles.fullWidth,
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? Colors.Primary : Colors.TextPrimary} size="small" />
      ) : (
        <Text style={[styles.label, styles[`label_${variant}`], styles[`labelSize_${size}`]]}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  fullWidth: { width: '100%' },
  primary: {
    backgroundColor: Colors.Primary,
  },
  outline: {
    backgroundColor: Colors.Transparent,
    borderWidth: 1.5,
    borderColor: Colors.Primary,
  },
  ghost: {
    backgroundColor: Colors.RedOverlay,
  },
  danger: {
    backgroundColor: Colors.Error,
  },
  size_sm: { height: 40, paddingHorizontal: Spacing.md },
  size_md: { height: 52, paddingHorizontal: Spacing.lg },
  size_lg: { height: 60, paddingHorizontal: Spacing.xl },
  pressed: { opacity: 0.8, transform: [{ scale: 0.98 }] },
  disabled: { opacity: 0.4 },
  label: {
    fontWeight: FontWeight.bold,
    letterSpacing: 0.8,
  },
  label_primary: { color: Colors.TextPrimary },
  label_outline: { color: Colors.Primary },
  label_ghost: { color: Colors.Primary },
  label_danger: { color: Colors.TextPrimary },
  labelSize_sm: { fontSize: FontSize.sm },
  labelSize_md: { fontSize: FontSize.base },
  labelSize_lg: { fontSize: FontSize.lg },
});
