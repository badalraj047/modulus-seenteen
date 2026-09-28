// Central design tokens. Keeping these in one place means the whole app's look
// can be adjusted from a single file, and screens stay visually consistent.

export const colors = {
  background: '#FFF7F3',
  surface: '#FFFFFF',
  surfaceElevated: '#FFF0EA',
  primary: '#E8503A',
  primaryDark: '#D14130',
  accent: '#E88A3A',
  danger: '#EF4444',
  success: '#22C55E',
  warning: '#F59E0B',

  textPrimary: '#1A1A2E',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  border: '#F0E6E0',

  priorityHigh: '#E8503A',
  priorityMedium: '#F59E0B',
  priorityLow: '#22C55E',

  white: '#FFFFFF',
  dark: '#1A1A2E',
  overlay: 'rgba(0,0,0,0.25)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radius = {
  sm: 8,
  md: 14,
  lg: 20,
  full: 999,
};

export const typography = {
  h1: { fontSize: 30, fontWeight: '700' as const },
  h2: { fontSize: 22, fontWeight: '700' as const },
  h3: { fontSize: 18, fontWeight: '600' as const },
  body: { fontSize: 15, fontWeight: '400' as const },
  bodyBold: { fontSize: 15, fontWeight: '600' as const },
  caption: { fontSize: 13, fontWeight: '400' as const },
  small: { fontSize: 11, fontWeight: '500' as const },
};

export const shadow = {
  card: {
    shadowColor: '#D4C4BC',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
};

export function priorityColor(priority: 'low' | 'medium' | 'high'): string {
  if (priority === 'high') return colors.priorityHigh;
  if (priority === 'medium') return colors.priorityMedium;
  return colors.priorityLow;
}
