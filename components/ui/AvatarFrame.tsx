import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { Colors, FontSize, FontWeight } from '@/constants/theme';

interface AvatarFrameProps {
  letter: string;
  tier?: string;
  size?: number;
  animated?: boolean;
}

// Tier definitions: color + animation style
const TIER_STYLES: Record<string, { color: string; style: 'static' | 'pulse' | 'radar' | 'glitch' }> = {
  starter: { color: '#666666', style: 'static' },
  core: { color: '#888888', style: 'pulse' },
  redline: { color: '#CC0000', style: 'pulse' },
  ascend: { color: '#FF4444', style: 'radar' },
  elite: { color: '#FFD700', style: 'glitch' },
  coach: { color: '#888888', style: 'pulse' },
  pro_coach: { color: '#CC0000', style: 'pulse' },
  signature_coach: { color: '#FF4444', style: 'radar' },
  elite_mentor: { color: '#FFD700', style: 'glitch' },
};

export function AvatarFrame({ letter, tier = 'starter', size = 56, animated: isAnimated = true }: AvatarFrameProps) {
  const tierStyle = TIER_STYLES[tier] || TIER_STYLES.starter;
  const color = tierStyle.color;
  const animStyle = tierStyle.style;

  // Pulse anim (Bronze/Silver/Red)
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const borderOpacity = useRef(new Animated.Value(0.6)).current;
  // Radar sweep
  const radarAnim = useRef(new Animated.Value(0)).current;
  // Glitch
  const glitchX = useRef(new Animated.Value(0)).current;
  const glitchOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!isAnimated) return;

    if (animStyle === 'pulse' || animStyle === 'radar' || animStyle === 'glitch') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.07, duration: 1600, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 1600, useNativeDriver: true }),
        ])
      ).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(borderOpacity, { toValue: 1, duration: 1200, useNativeDriver: true }),
          Animated.timing(borderOpacity, { toValue: 0.4, duration: 1200, useNativeDriver: true }),
        ])
      ).start();
    }

    if (animStyle === 'radar') {
      Animated.loop(
        Animated.timing(radarAnim, { toValue: 1, duration: 2000, easing: Easing.linear, useNativeDriver: true })
      ).start();
    }

    if (animStyle === 'glitch') {
      const glitchLoop = () => {
        Animated.sequence([
          Animated.delay(1800 + Math.random() * 600),
          Animated.timing(glitchX, { toValue: 3, duration: 60, useNativeDriver: true }),
          Animated.timing(glitchX, { toValue: -3, duration: 60, useNativeDriver: true }),
          Animated.timing(glitchX, { toValue: 2, duration: 50, useNativeDriver: true }),
          Animated.timing(glitchX, { toValue: 0, duration: 60, useNativeDriver: true }),
          Animated.timing(glitchOpacity, { toValue: 0.5, duration: 40, useNativeDriver: true }),
          Animated.timing(glitchOpacity, { toValue: 1, duration: 40, useNativeDriver: true }),
        ]).start(glitchLoop);
      };
      glitchLoop();
    }
  }, [isAnimated, animStyle]);

  const radarRotation = radarAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const outerSize = size + 14;

  return (
    <Animated.View
      style={[
        styles.wrapper,
        {
          transform: [{ scale: pulseAnim }, { translateX: animStyle === 'glitch' ? glitchX : 0 }],
          opacity: animStyle === 'glitch' ? glitchOpacity : 1,
        },
      ]}
    >
      {/* Outer ring */}
      <Animated.View
        style={[
          styles.outerRing,
          {
            width: outerSize,
            height: outerSize,
            borderRadius: outerSize / 2,
            borderColor: color,
            opacity: borderOpacity,
            shadowColor: color,
          },
        ]}
      />

      {/* Radar sweep ring (ascend+) */}
      {(animStyle === 'radar' || animStyle === 'glitch') && isAnimated && (
        <Animated.View
          style={[
            styles.radarRing,
            {
              width: outerSize + 8,
              height: outerSize + 8,
              borderRadius: (outerSize + 8) / 2,
              borderColor: color,
              transform: [{ rotate: radarRotation }],
            },
          ]}
        />
      )}

      {/* Gold glitch secondary ring */}
      {animStyle === 'glitch' && isAnimated && (
        <Animated.View
          style={[
            styles.glitchRing,
            {
              width: outerSize + 4,
              height: outerSize + 4,
              borderRadius: (outerSize + 4) / 2,
              borderColor: '#FFD700',
              opacity: borderOpacity,
            },
          ]}
        />
      )}

      {/* Avatar circle */}
      <View
        style={[
          styles.avatar,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: color + '1A',
          },
        ]}
      >
        <Text style={[styles.letter, { fontSize: size * 0.38, color }]}>
          {(letter || 'A').charAt(0).toUpperCase()}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerRing: {
    position: 'absolute',
    borderWidth: 2,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,
  },
  radarRing: {
    position: 'absolute',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    opacity: 0.5,
  },
  glitchRing: {
    position: 'absolute',
    borderWidth: 1,
    borderStyle: 'dotted',
    opacity: 0.3,
  },
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  letter: {
    fontWeight: FontWeight.black,
  },
});
