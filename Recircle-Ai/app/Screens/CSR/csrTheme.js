export const CSR_COLORS = {
  primary: '#2E8B57',
  primaryDark: '#1B5E20',
  primaryLight: '#3DA56A',
  primarySoft: '#D7F1E1',
  secondary: '#2196F3',
  secondaryDark: '#1E3A8A',
  secondarySoft: '#E0F2FE',
  accentGold: '#FFD166',
  accentOrange: '#FF8C42',
  accentCoral: '#FF6B6B',
  accentBlue: '#36D1DC',
  background: '#F6FBF6',
  surface: '#FFFFFF',
  textPrimary: '#1F2937',
  textSecondary: '#6B7280',
  muted: '#E2E8F0',
  border: '#D1D5DB',
  success: '#34D399',
  warning: '#F59E0B',
  danger: '#EF4444',
};

export const CSR_GRADIENTS = {
  hero: ['#2E8B57', '#3DA56A', '#4ECDC4'],
  header: ['#2E8B57', '#3DA56A'],
  soft: ['#E8F6F3', '#D1F2EB'],
  accent: ['#FFD166', '#FF8C42'],
  secondary: ['#5B86E5', '#36D1DC'],
};

export const CSR_CATEGORY_COLORS = {
  Food: CSR_COLORS.primary,
  Clothes: CSR_COLORS.secondary,
  Electronics: CSR_COLORS.accentOrange,
  Furniture: '#9C27B0',
  Books: '#607D8B',
  Energy: CSR_COLORS.accentGold,
  Transport: CSR_COLORS.accentBlue,
  Waste: '#795548',
  Other: CSR_COLORS.muted,
};

export const CSR_STATUS_COLORS = {
  connected: CSR_COLORS.primary,
  error: CSR_COLORS.danger,
  checking: CSR_COLORS.warning,
};

export const getCategoryColor = (category) =>
  CSR_CATEGORY_COLORS[category] || CSR_CATEGORY_COLORS.Other;
