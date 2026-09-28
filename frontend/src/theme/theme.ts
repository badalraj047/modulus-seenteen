// Central design tokens. Keeping these in one place means the whole app's look
// can be adjusted from a single file, and screens stay visually consistent.

export const colors = {
  background: '#0F1220',
  surface: '#1A1E2E',
  surfaceElevated: '#232842',
  primary: '#7C6CF6',
  primaryDark: '#5B4FD1',
  accent: '#4ECDC4',
  danger: '#FF6B6B',
  success: '#4ECDC4',
  warning: '#FFB84D',

  textPrimary: '#F5F6FA',
  textSecondary: '#9BA0B5',
  textMuted: '#6B7089',
  border: '#2C3150',

  priorityHigh: '#FF6B6B',
  priorityMedium: '#FFB84D',
  priorityLow: '#4ECDC4',

  white: '#FFFFFF',
  overlay: 'rgba(0,0,0,0.55)',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
};

export function priorityColor(priority: 'low' | 'medium' | 'high'): string {
  if (priority === 'high') return colors.priorityHigh;
  if (priority === 'medium') return colors.priorityMedium;
  return colors.priorityLow;
}
