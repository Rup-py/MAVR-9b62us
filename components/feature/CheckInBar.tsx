import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, Radius, Spacing } from '@/constants/theme';

interface CheckInItem {
  id: string;
  label: string;
  icon: string;
  completed: boolean;
}

const CHECK_INS: CheckInItem[] = [
  { id: 'morning', label: 'Morning', icon: 'wb-sunny', completed: true },
  { id: 'workout', label: 'Workout', icon: 'fitness-center', completed: false },
  { id: 'night', label: 'Night', icon: 'nights-stay', completed: false },
];

export function CheckInBar({ onPress }: { onPress?: (id: string) => void }) {
  return (
    <View style={styles.container}>
      {CHECK_INS.map((item, index) => (
        <React.Fragment key={item.id}>
          <Pressable
            style={({ pressed }) => [styles.item, item.completed && styles.itemCompleted, pressed && { opacity: 0.7 }]}
            onPress={() => onPress?.(item.id)}
          >
            <MaterialIcons
              name={item.completed ? 'check-circle' : (item.icon as any)}
              size={22}
              color={item.completed ? Colors.Success : Colors.TextMuted}
            />
            <Text style={[styles.label, item.completed && styles.labelCompleted]}>{item.label}</Text>
          </Pressable>
          {index < CHECK_INS.length - 1 && (
            <View style={[styles.connector, item.completed && styles.connectorCompleted]} />
          )}
        </React.Fragment>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
  },
  item: {
    alignItems: 'center',
    gap: 4,
    opacity: 0.5,
  },
  itemCompleted: {
    opacity: 1,
  },
  connector: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.SurfaceBorder,
    marginHorizontal: Spacing.sm,
  },
  connectorCompleted: {
    backgroundColor: Colors.Success + '55',
  },
  label: {
    fontSize: FontSize.xs,
    color: Colors.TextMuted,
    fontWeight: FontWeight.medium,
  },
  labelCompleted: {
    color: Colors.Success,
  },
});
