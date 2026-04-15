import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useUser } from '@/hooks/useUser';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '@/constants/theme';
import { ROLE_OPTIONS } from '@/constants/config';

export default function RoleSelectionScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setRole } = useUser();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleSelect = (roleId: string) => {
    setRole(roleId);
    if (roleId === 'trainer') {
      router.push('/onboarding/trainer');
    } else {
      router.push('/onboarding/individual');
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Image
        source={require('@/assets/splash_bg.png')}
        style={[StyleSheet.absoluteFillObject, { opacity: 0.3 }]}
        contentFit="cover"
      />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <Image
            source={{ uri: 'https://cdn-ai.onspace.ai/onspace/files/YMmx7ppxujwSbTNEDGDSXD/red_final.png' }}
            style={styles.logo}
            contentFit="contain"
          />
          <Text style={styles.heading}>DEFINE YOUR ROLE</Text>
          <Text style={styles.subheading}>Your position in the MAVR ecosystem determines your access, tools, and experience.</Text>
        </Animated.View>

        <Animated.View style={[styles.roles, { opacity: fadeAnim }]}>
          {ROLE_OPTIONS.map((role, index) => (
            <Animated.View
              key={role.id}
              style={{ opacity: fadeAnim, transform: [{ translateY: Animated.multiply(slideAnim, new Animated.Value(1 + index * 0.3)) }] }}
            >
              <Pressable
                style={({ pressed }) => [styles.roleCard, pressed && styles.roleCardPressed]}
                onPress={() => handleSelect(role.id)}
              >
                <View style={styles.roleIcon}>
                  <MaterialIcons name={role.icon as any} size={28} color={Colors.Primary} />
                </View>
                <View style={styles.roleInfo}>
                  <Text style={styles.roleLabel}>{role.label}</Text>
                  <Text style={styles.roleSubtitle}>{role.subtitle}</Text>
                </View>
                <MaterialIcons name="chevron-right" size={22} color={Colors.TextMuted} />
              </Pressable>
            </Animated.View>
          ))}
        </Animated.View>

        <Text style={styles.footer}>You can change your role later in settings.</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.Background },
  scroll: { paddingHorizontal: Spacing.md, paddingBottom: 48, gap: Spacing.xl },
  header: { alignItems: 'center', paddingTop: Spacing.xl, gap: Spacing.md },
  logo: { width: 80, height: 64 },
  heading: {
    fontSize: FontSize.xxl,
    color: Colors.TextPrimary,
    fontWeight: FontWeight.black,
    letterSpacing: 3,
    textAlign: 'center',
  },
  subheading: {
    fontSize: FontSize.md,
    color: Colors.TextSecondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: Spacing.lg,
  },
  roles: { gap: Spacing.sm },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.SurfaceCard,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.SurfaceBorder,
    gap: Spacing.md,
  },
  roleCardPressed: {
    borderColor: Colors.Primary + '66',
    backgroundColor: Colors.RedOverlay,
    transform: [{ scale: 0.98 }],
  },
  roleIcon: {
    width: 56,
    height: 56,
    borderRadius: Radius.md,
    backgroundColor: Colors.PrimaryGlow,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.Primary + '33',
  },
  roleInfo: { flex: 1, gap: 4 },
  roleLabel: { fontSize: FontSize.lg, color: Colors.TextPrimary, fontWeight: FontWeight.bold },
  roleSubtitle: { fontSize: FontSize.sm, color: Colors.TextSecondary, lineHeight: 18 },
  footer: {
    textAlign: 'center',
    fontSize: FontSize.sm,
    color: Colors.TextMuted,
    marginTop: -Spacing.md,
  },
});
