// MAVR Design System — Premium Red-Black Athlete OS
export const Colors = {
  // Core Brand
  Primary: '#C8001A',
  PrimaryDeep: '#990012',
  PrimaryBright: '#FF1A2E',
  PrimaryGlow: 'rgba(200, 0, 26, 0.15)',

  // Backgrounds
  Background: '#000000',
  Surface: '#0D0D0D',
  SurfaceElevated: '#1A1A1A',
  SurfaceCard: '#111111',
  SurfaceBorder: '#222222',

  // Text
  TextPrimary: '#FFFFFF',
  TextSecondary: '#999999',
  TextMuted: '#555555',
  TextAccent: '#CC0000',

  // Graphite / Silver
  Graphite: '#2A2A2A',
  Silver: '#C0C0C0',
  SilverDim: '#666666',

  // Semantic
  Success: '#22C55E',
  Warning: '#F59E0B',
  Error: '#EF4444',
  Info: '#3B82F6',

  // Overlay
  Overlay: 'rgba(0,0,0,0.7)',
  OverlayLight: 'rgba(0,0,0,0.4)',
  RedOverlay: 'rgba(200, 0, 26, 0.08)',

  // Transparent
  Transparent: 'transparent',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Radius = {
  sm: 6,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
};

export const FontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  base: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 28,
  display: 36,
  hero: 48,
};

export const FontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  black: '900' as const,
};

export const Shadow = {
  sm: {
    shadowColor: '#CC0000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  md: {
    shadowColor: '#CC0000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  lg: {
    shadowColor: '#CC0000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
};
