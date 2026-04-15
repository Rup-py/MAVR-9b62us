import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Colors, FontSize, FontWeight, Radius, Spacing } from '@/constants/theme';

interface StatBarProps {
  label: string;
  value: number;
  max?: number;
  color?: string;
  unit?: string;
}

export function StatBar({ label, value, max = 100, color = Colors.Primary, unit = '%' }: StatBarProps) {
  const animWidth = useRef(new Animated.Value(0)).current;
  const percentage = Math.min((value / max) * 100, 100);

  useEffect(() => {
    Animated.timing(animWidth, {
      toValue: percentage,
      duration: 900,
      useNativeDriver: false,
    }).start();
  }, [value]);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.value, { color }]}>{value}{unit}</Text>
      </View>
      <View style={styles.track}>
        <Animated.View
          style={[
            styles.fill,
            {
              backgroundColor: color,
              width: animWidth.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }),
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 6 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  label: { fontSize: FontSize.sm, color: Colors.TextSecondary, fontWeight: FontWeight.medium },
  value: { fontSize: FontSize.sm, fontWeight: FontWeight.bold },
  track: {
    height: 4,
    backgroundColor: Colors.SurfaceElevated,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: Radius.full,
  },
});
