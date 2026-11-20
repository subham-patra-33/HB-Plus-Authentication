import { Platform, type ViewStyle } from 'react-native';

export const colors = {
  primary: '#2563EB',        // Core vibrant blue
  primaryDark: '#1D4ED8',    // Deep ocean blue
  primaryDeep: '#0F172A',    // Deep slate midnight
  primaryLight: '#EFF6FF',   // Subtle blue tint
  accent: '#38BDF8',         // Cyan accent
  ink: '#0F172A',            // High contrast text
  inkSoft: '#334155',        // Medium body text
  muted: '#64748B',          // Subtle secondary text
  line: '#E2E8F0',           // Crisp border divider
  lineLight: '#F1F5F9',      // Very subtle divider
  surface: '#FFFFFF',        // Pure white card background
  surfaceSoft: '#F8FAFC',    // Soft light background
  canvas: '#F0F4F8',         // Clean canvas backdrop
  canvasGradientStart: '#EEF2F6',
  canvasGradientEnd: '#E2E8F0',
  danger: '#EF4444',         // Alert red
  dangerBg: '#FEF2F2',
  dangerLine: '#FECACA',
  success: '#10B981',        // Emerald success
  successBg: '#ECFDF5',
  warning: '#F59E0B',        // Amber warning
  warningBg: '#FFFBEB',
  white: '#FFFFFF',
} as const;

export const spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radius = {
  xs: 6,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 22,
  pill: 999,
} as const;

export const cardShadow: ViewStyle =
  Platform.OS === 'web'
    ? {
        boxShadow: '0 20px 40px -15px rgba(15, 23, 42, 0.08), 0 0 1px 1px rgba(15, 23, 42, 0.05)',
      }
    : {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.08,
        shadowRadius: 20,
        elevation: 6,
      };

export const softShadow: ViewStyle =
  Platform.OS === 'web'
    ? {
        boxShadow: '0 4px 14px rgba(15, 23, 42, 0.04), 0 0 1px rgba(15, 23, 42, 0.06)',
      }
    : {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
      };
