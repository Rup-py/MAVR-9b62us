import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, Radius, Spacing } from '@/constants/theme';

interface DashboardCardProps {
  title: string;
  subtitle?: string;
  value?: string;
  icon: string;
  color?: string;
  tag?: string;
  tagColor?: string;
  onPress?: () => void;
  children?: React.ReactNode;
}

export function DashboardCard({
  title,
  subtitle,
  value,
  icon,
  color = Colors.Primary,
  tag,
  tagColor,
  onPress,
  children,
}: DashboardCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && onPress ? { opacity: 0.85 } : {}]}
    >
      <View style={styles.header}>
        <View style={[styles.iconWrap, { backgroundColor: color + '18' }]}>
          <MaterialIcons name={icon as any} size={20} color={color} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        {tag ? (
          <View style={[styles.tag, { backgroundColor: (tagColor || color) + '22', borderColor: (tagColor || color) + '55' }]}>
            <Text style={[styles.tagText, { color: tagColor || color }]}>{tag}</Text>
          </View>
        ) : null}
        {onPress ? <MaterialIcons name="chevron-right" size={18} color={Colors.TextMuted} /> : null}
      </View>
      {value ? <Text style={styles.value}>{value}</Text> : null}
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.SurfaceCard,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.SurfaceBorder,
    gap: Spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: FontSize.md,
    color: Colors.TextPrimary,
    fontWeight: FontWeight.semibold,
  },
  subtitle: {
    fontSize: FontSize.sm,
    color: Colors.TextSecondary,
    marginTop: 2,
  },
  value: {
    fontSize: FontSize.xxxl,
    color: Colors.TextPrimary,
    fontWeight: FontWeight.black,
    marginTop: 4,
  },
  tag: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  tagText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
});
