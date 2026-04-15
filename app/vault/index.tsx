import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '@/constants/theme';

export default function VaultIndex() {
  const insets = useSafeAreaInsets();
  return (
    <View style={[{ flex: 1, backgroundColor: Colors.Background, paddingTop: insets.top }]}>
      <View style={styles.header}>
        <MaterialIcons name="lock-open" size={20} color={Colors.Primary} />
        <Text style={styles.title}>VAULT</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: Spacing.md }}>
        <Text style={{ color: Colors.TextSecondary }}>Vault content</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, padding: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.SurfaceBorder },
  title: { fontSize: FontSize.xl, color: Colors.TextPrimary, fontWeight: FontWeight.black, letterSpacing: 2 },
});
