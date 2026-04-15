import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { useUser } from '@/hooks/useUser';
import { Colors, FontSize, FontWeight } from '@/constants/theme';

const { width, height } = Dimensions.get('window');

// ── Horizontal scan bars ──────────────────────────────────────────────────────
function ScanBar({ delay, opacity }: { delay: number; opacity: number }) {
  const pos = useRef(new Animated.Value(-2)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(pos, { toValue: height, duration: 2400, useNativeDriver: true }),
        Animated.timing(pos, { toValue: -2, duration: 0, useNativeDriver: true }),
        Animated.delay(800),
      ])
    ).start();
  }, []);
  return (
    <Animated.View
      style={[
        splash.scanBar,
        { opacity, transform: [{ translateY: pos }] },
      ]}
    />
  );
}

// ── Corner brackets ───────────────────────────────────────────────────────────
function CornerBracket({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) {
  const isRight = position === 'tr' || position === 'br';
  const isBottom = position === 'bl' || position === 'br';
  return (
    <View
      style={[
        splash.bracket,
        isRight ? { right: 32 } : { left: 32 },
        isBottom ? { bottom: 140 } : { top: 80 },
      ]}
    >
      <View style={[splash.bracketH, isRight && { alignSelf: 'flex-end' }]} />
      <View style={[splash.bracketV, isRight ? { alignSelf: 'flex-end' } : {}]} />
    </View>
  );
}

export default function SplashScreen() {
  const router = useRouter();
  const { isOnboardingComplete, role, isLoading } = useUser();

  // Animation values
  const masterOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.3)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const glowRadius = useRef(new Animated.Value(0)).current;
  const lineExpand = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const barProgress = useRef(new Animated.Value(0)).current;
  const barOpacity = useRef(new Animated.Value(0)).current;
  const bracketOpacity = useRef(new Animated.Value(0)).current;

  const [statusText, setStatusText] = useState('BOOT SEQUENCE INITIATED');
  const statusMessages = [
    'BOOT SEQUENCE INITIATED',
    'LOADING ATHLETE PROFILES',
    'SYNCING REDLINE PROTOCOL',
    'INITIALIZING COMMAND CENTER',
    'MAVR SYSTEM ONLINE',
  ];
  const msgIndex = useRef(0);

  useEffect(() => {
    // Status text cycle
    const msgInterval = setInterval(() => {
      msgIndex.current = (msgIndex.current + 1) % statusMessages.length;
      setStatusText(statusMessages[msgIndex.current]);
    }, 600);

    Animated.sequence([
      // Fade in entire screen
      Animated.timing(masterOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      // Brackets appear
      Animated.timing(bracketOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      // Glow expands + logo bursts in
      Animated.parallel([
        Animated.spring(logoScale, { toValue: 1, tension: 60, friction: 8, useNativeDriver: true }),
        Animated.timing(logoOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(glowRadius, { toValue: 1, duration: 800, useNativeDriver: false }),
      ]),
      Animated.delay(100),
      // Lines expand from center + text fades
      Animated.parallel([
        Animated.spring(lineExpand, { toValue: 1, tension: 80, friction: 10, useNativeDriver: false }),
        Animated.timing(textOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]),
      Animated.delay(200),
      // Progress bar
      Animated.timing(barOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.timing(barProgress, { toValue: 1, duration: 1400, useNativeDriver: false }),
      Animated.delay(300),
    ]).start(() => {
      clearInterval(msgInterval);
      if (!isLoading) navigate();
    });

    return () => clearInterval(msgInterval);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const t = setTimeout(() => navigate(), 3600);
      return () => clearTimeout(t);
    }
  }, [isLoading]);

  const navigate = () => {
    if (isOnboardingComplete) {
      router.replace(role === 'trainer' ? '/trainer/dashboard' : '/(tabs)');
    } else {
      router.replace('/onboarding/role');
    }
  };

  const glowSize = glowRadius.interpolate({ inputRange: [0, 1], outputRange: [0, 300] });
  const lineWidth = lineExpand.interpolate({ inputRange: [0, 1], outputRange: [0, 120] });
  const barW = barProgress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  return (
    <Animated.View style={[splash.container, { opacity: masterOpacity }]}>
      {/* Scan bars */}
      <ScanBar delay={0} opacity={0.06} />
      <ScanBar delay={1200} opacity={0.04} />

      {/* Grid */}
      <View style={splash.grid}>
        {Array.from({ length: 12 }).map((_, i) => (
          <View key={`h${i}`} style={[splash.gridH, { top: (height / 12) * i }]} />
        ))}
        {Array.from({ length: 7 }).map((_, i) => (
          <View key={`v${i}`} style={[splash.gridV, { left: (width / 7) * i }]} />
        ))}
      </View>

      {/* Glow orb */}
      <Animated.View
        style={[
          splash.glowOrb,
          {
            width: glowSize,
            height: glowSize,
            borderRadius: 150,
            marginLeft: glowRadius.interpolate({ inputRange: [0, 1], outputRange: [0, -150] }),
            marginTop: glowRadius.interpolate({ inputRange: [0, 1], outputRange: [0, -150] }),
          },
        ]}
      />

      {/* Corner brackets */}
      <Animated.View style={[{ opacity: bracketOpacity }, StyleSheet.absoluteFillObject]} pointerEvents="none">
        <CornerBracket position="tl" />
        <CornerBracket position="tr" />
        <CornerBracket position="bl" />
        <CornerBracket position="br" />
      </Animated.View>

      {/* Logo */}
      <Animated.View
        style={[
          splash.logoWrap,
          { opacity: logoOpacity, transform: [{ scale: logoScale }] },
        ]}
      >
        <Image
          source={require('@/assets/mavr_logo.png')}
          style={splash.logo}
          contentFit="contain"
        />
      </Animated.View>

      {/* Horizontal lines */}
      <Animated.View style={[splash.lineRow, { marginTop: 24 }]}>
        <Animated.View style={[splash.line, { width: lineWidth }]} />
        <Animated.View style={[splash.textBlock, { opacity: textOpacity }]}>
          <Text style={splash.brand}>MAVR</Text>
          <Text style={splash.tagline}>ATHLETE OPERATING SYSTEM</Text>
        </Animated.View>
        <Animated.View style={[splash.line, { width: lineWidth }]} />
      </Animated.View>

      {/* Progress */}
      <Animated.View style={[splash.barSection, { opacity: barOpacity }]}>
        <Text style={splash.statusText}>{statusText}</Text>
        <View style={splash.barTrack}>
          <Animated.View style={[splash.barFill, { width: barW }]} />
          <View style={splash.barGlow} />
        </View>
        <View style={splash.barLabels}>
          <Text style={splash.barLabelLeft}>0%</Text>
          <Text style={splash.barLabelRight}>100%</Text>
        </View>
      </Animated.View>

      {/* Footer */}
      <View style={splash.footer}>
        <Text style={splash.footerText}>MAVR V1.0 · INDIA · {new Date().getFullYear()}</Text>
        <Text style={splash.footerSub}>PERFORMANCE REDLINE ACTIVE</Text>
      </View>
    </Animated.View>
  );
}

const { StyleSheet } = require('react-native');

const splash = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  grid: { ...StyleSheet.absoluteFillObject },
  gridH: { position: 'absolute', left: 0, right: 0, height: 1, backgroundColor: 'rgba(200,0,26,0.05)' },
  gridV: { position: 'absolute', top: 0, bottom: 0, width: 1, backgroundColor: 'rgba(200,0,26,0.05)' },
  scanBar: {
    position: 'absolute',
    left: 0, right: 0, height: 2,
    backgroundColor: Colors.Primary,
    shadowColor: Colors.Primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  glowOrb: {
    position: 'absolute',
    backgroundColor: Colors.Primary,
    opacity: 0.12,
  },
  bracket: { position: 'absolute', width: 28, height: 28 },
  bracketH: { height: 2, width: '100%', backgroundColor: Colors.Primary, opacity: 0.7 },
  bracketV: { width: 2, height: '100%', backgroundColor: Colors.Primary, opacity: 0.7, marginTop: -2 },
  logoWrap: { alignItems: 'center', justifyContent: 'center' },
  logo: { width: 160, height: 132 },
  lineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  line: { height: 1, backgroundColor: Colors.Primary + '88' },
  textBlock: { alignItems: 'center', gap: 2 },
  brand: {
    fontSize: 28,
    color: Colors.TextPrimary,
    fontWeight: '900',
    letterSpacing: 10,
  },
  tagline: {
    fontSize: 9,
    color: Colors.TextMuted,
    fontWeight: '700',
    letterSpacing: 3.5,
  },
  barSection: {
    position: 'absolute',
    bottom: 110,
    left: 40,
    right: 40,
    gap: 8,
  },
  statusText: {
    fontSize: 9,
    color: Colors.Primary,
    fontWeight: '700',
    letterSpacing: 2,
    textAlign: 'center',
  },
  barTrack: {
    height: 3,
    backgroundColor: '#1a1a1a',
    borderRadius: 2,
    overflow: 'hidden',
  },
  barFill: {
    height: 3,
    backgroundColor: Colors.Primary,
    borderRadius: 2,
  },
  barGlow: {
    position: 'absolute',
    top: 0, bottom: 0, right: 0, width: 20,
    backgroundColor: 'transparent',
  },
  barLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  barLabelLeft: { fontSize: 8, color: Colors.TextMuted, letterSpacing: 1 },
  barLabelRight: { fontSize: 8, color: Colors.TextMuted, letterSpacing: 1 },
  footer: {
    position: 'absolute',
    bottom: 48,
    alignItems: 'center',
    gap: 4,
  },
  footerText: { fontSize: 10, color: Colors.TextMuted, letterSpacing: 2, fontWeight: '600' },
  footerSub: { fontSize: 8, color: Colors.Primary + '88', letterSpacing: 2, fontWeight: '700' },
});
