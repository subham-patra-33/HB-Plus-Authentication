import { Platform, type ViewStyle } from 'react-native';

export const colors = {
  primary: '#2563EB',
  primaryDark: '#1E3A8A',
  primaryLight: '#DBEAFE',
  ink: '#0F172A',
  inkSoft: '#334155',
  muted: '#64748B',
  line: '#E2E8F0',
  surface: '#FFFFFF',
  surfaceSoft: '#F8FAFC',
  canvas: '#F1F5F9',
  danger: '#DC2626',
  dangerBg: '#FEF2F2',
  dangerLine: '#FECACA',
  success: '#059669',
  successBg: '#ECFDF5',
  warning: '#B45309',
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
  sm: 8,
  md: 12,
  lg: 18,
  xl: 24,
  pill: 999,
} as const;

export const cardShadow: ViewStyle =
  Platform.OS === 'web'
    ? {
        boxShadow: '0 18px 45px rgba(15, 23, 42, 0.10)',
      }
    : {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 22,
        elevation: 8,
      };

export const softShadow: ViewStyle =
  Platform.OS === 'web'
    ? {
        boxShadow: '0 6px 18px rgba(15, 23, 42, 0.06)',
      }
    : {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 3,
      };
