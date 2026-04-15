import React, { useRef, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Platform, Animated, Image } from 'react-native';
import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, FontSize, FontWeight, Radius } from '@/constants/theme';

const TAB_CONFIG = [
  { name: 'index', label: 'Home', icon: 'home', iconActive: 'home' },
  { name: 'workout', label: 'Workout', icon: 'fitness-center', iconActive: 'fitness-center' },
  { name: 'community', label: 'Connects', icon: null, iconActive: null }, // uses logo
  { name: 'vault', label: 'Vault', icon: 'lock', iconActive: 'lock-open' },
  { name: 'profile', label: 'Profile', icon: 'person-outline', iconActive: 'person' },
];

function TabBarIcon({ name, label, focused }: { name: string; label: string; focused: boolean }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(focused ? 1 : 0.45)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: focused ? 1.12 : 1, tension: 120, friction: 8, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: focused ? 1 : 0.45, duration: 180, useNativeDriver: true }),
    ]).start();
  }, [focused]);

  const config = TAB_CONFIG.find((t) => t.name === name) || TAB_CONFIG[0];
  const isCommunity = name === 'community';

  return (
    <Animated.View style={[styles.tabItem, { opacity: opacityAnim, transform: [{ scale: scaleAnim }] }]}>
      {focused && <View style={styles.activeGlow} />}

      {isCommunity ? (
        <View style={[styles.communityLogo, focused && styles.communityLogoActive]}>
          <Image
            source={require('@/assets/mavr_logo.png')}
            style={{ width: 22, height: 18 }}
            resizeMode="contain"
          />
        </View>
      ) : (
        <MaterialIcons
          name={(focused ? config.iconActive : config.icon) as any}
          size={22}
          color={focused ? Colors.Primary : Colors.SilverDim}
        />
      )}

      <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>{label}</Text>
      {focused && <View style={styles.activeDot} />}
    </Animated.View>
  );
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  const tabBarHeight = Platform.select({
    ios: insets.bottom + 62,
    android: insets.bottom + 62,
    default: 72,
  });

  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} insets={insets} tabBarHeight={tabBarHeight} />}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="workout" options={{ title: 'Workout' }} />
      <Tabs.Screen name="community" options={{ title: 'Connects' }} />
      <Tabs.Screen name="vault" options={{ title: 'Vault' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}

function CustomTabBar({ state, descriptors, navigation, insets, tabBarHeight }: any) {
  return (
    <View
      style={[
        styles.tabBar,
        {
          height: tabBarHeight,
          paddingBottom: Platform.select({ ios: insets.bottom + 8, android: insets.bottom + 8, default: 8 }),
        },
      ]}
    >
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const label = options.title || route.name;
        const isFocused = state.index === index;

        return (
          <Pressable
            key={route.key}
            onPress={() => navigation.navigate(route.name)}
            style={styles.tabButton}
            hitSlop={8}
          >
            <TabBarIcon name={route.name} label={label} focused={isFocused} />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#080808',
    borderTopWidth: 1,
    borderTopColor: Colors.SurfaceBorder,
    paddingTop: 8,
    paddingHorizontal: 4,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    paddingHorizontal: 10,
    paddingVertical: 5,
    position: 'relative',
    minWidth: 48,
    minHeight: 44,
  },
  activeGlow: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    borderRadius: Radius.md,
    backgroundColor: Colors.PrimaryGlow,
  },
  communityLogo: {
    width: 32, height: 28,
    alignItems: 'center', justifyContent: 'center',
    opacity: 0.45,
  },
  communityLogoActive: {
    opacity: 1,
  },
  tabLabel: {
    fontSize: 10,
    color: Colors.SilverDim,
    fontWeight: FontWeight.medium,
    letterSpacing: 0.3,
  },
  tabLabelActive: {
    color: Colors.Primary,
    fontWeight: FontWeight.bold,
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.Primary,
    marginTop: 1,
  },
});
