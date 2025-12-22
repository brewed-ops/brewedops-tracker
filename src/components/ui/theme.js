// ============================================
// SHADCN THEME SYSTEM
// ============================================

export const getShadcnTheme = (isDark) => ({
  // Core colors
  background: isDark ? 'hsl(240 10% 3.9%)' : 'hsl(0 0% 100%)',
  foreground: isDark ? 'hsl(0 0% 98%)' : 'hsl(240 10% 3.9%)',
  
  // Card
  card: isDark ? 'hsl(240 10% 3.9%)' : 'hsl(0 0% 100%)',
  cardForeground: isDark ? 'hsl(0 0% 98%)' : 'hsl(240 10% 3.9%)',
  
  // Popover
  popover: isDark ? 'hsl(240 10% 3.9%)' : 'hsl(0 0% 100%)',
  popoverForeground: isDark ? 'hsl(0 0% 98%)' : 'hsl(240 10% 3.9%)',
  
  // Primary
  primary: isDark ? 'hsl(0 0% 98%)' : 'hsl(240 5.9% 10%)',
  primaryForeground: isDark ? 'hsl(240 5.9% 10%)' : 'hsl(0 0% 98%)',
  
  // Secondary
  secondary: isDark ? 'hsl(240 3.7% 15.9%)' : 'hsl(240 4.8% 95.9%)',
  secondaryForeground: isDark ? 'hsl(0 0% 98%)' : 'hsl(240 5.9% 10%)',
  
  // Muted
  muted: isDark ? 'hsl(240 3.7% 15.9%)' : 'hsl(240 4.8% 95.9%)',
  mutedForeground: isDark ? 'hsl(240 5% 64.9%)' : 'hsl(240 3.8% 46.1%)',
  
  // Accent
  accent: isDark ? 'hsl(240 3.7% 15.9%)' : 'hsl(240 4.8% 95.9%)',
  accentForeground: isDark ? 'hsl(0 0% 98%)' : 'hsl(240 5.9% 10%)',
  
  // Destructive
  destructive: 'hsl(0 84.2% 60.2%)',
  destructiveForeground: 'hsl(0 0% 98%)',
  
  // Success
  success: 'hsl(142 76% 36%)',
  successForeground: 'hsl(0 0% 98%)',
  
  // Warning
  warning: 'hsl(38 92% 50%)',
  warningForeground: 'hsl(0 0% 98%)',
  
  // Border & Input & Ring
  border: isDark ? 'hsl(240 3.7% 15.9%)' : 'hsl(240 5.9% 90%)',
  input: isDark ? 'hsl(240 3.7% 15.9%)' : 'hsl(240 5.9% 90%)',
  ring: isDark ? 'hsl(240 4.9% 83.9%)' : 'hsl(240 5.9% 10%)',
  
  // Radius
  radius: '8px',
  
  // Shadows
  shadowSm: isDark 
    ? '0 1px 2px 0 rgb(0 0 0 / 0.3)' 
    : '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  shadow: isDark 
    ? '0 1px 3px 0 rgb(0 0 0 / 0.4), 0 1px 2px -1px rgb(0 0 0 / 0.4)' 
    : '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  shadowMd: isDark 
    ? '0 4px 6px -1px rgb(0 0 0 / 0.4), 0 2px 4px -2px rgb(0 0 0 / 0.4)' 
    : '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  shadowLg: isDark 
    ? '0 10px 15px -3px rgb(0 0 0 / 0.4), 0 4px 6px -4px rgb(0 0 0 / 0.4)' 
    : '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
});

// Generate CSS variables object from theme
export const getThemeVars = (theme) => ({
  '--background': theme.background,
  '--foreground': theme.foreground,
  '--card': theme.card,
  '--card-foreground': theme.cardForeground,
  '--popover': theme.popover,
  '--popover-foreground': theme.popoverForeground,
  '--primary': theme.primary,
  '--primary-foreground': theme.primaryForeground,
  '--secondary': theme.secondary,
  '--secondary-foreground': theme.secondaryForeground,
  '--muted': theme.muted,
  '--muted-foreground': theme.mutedForeground,
  '--accent': theme.accent,
  '--accent-foreground': theme.accentForeground,
  '--destructive': theme.destructive,
  '--destructive-foreground': theme.destructiveForeground,
  '--success': theme.success,
  '--success-foreground': theme.successForeground,
  '--warning': theme.warning,
  '--warning-foreground': theme.warningForeground,
  '--border': theme.border,
  '--input': theme.input,
  '--ring': theme.ring,
  '--radius': theme.radius,
  '--shadow-sm': theme.shadowSm,
  '--shadow': theme.shadow,
  '--shadow-md': theme.shadowMd,
  '--shadow-lg': theme.shadowLg,
});

// Category colors
export const CATEGORIES = [
  { value: 'utilities', label: 'Utilities', color: '#3b82f6', emoji: '⚡' },
  { value: 'subscription', label: 'Subscription', color: '#8b5cf6', emoji: '📱' },
  { value: 'food', label: 'Food', color: '#f97316', emoji: '🍔' },
  { value: 'shopping', label: 'Shopping', color: '#ec4899', emoji: '🛍️' },
  { value: 'healthcare', label: 'Healthcare', color: '#10b981', emoji: '💊' },
  { value: 'entertainment', label: 'Entertainment', color: '#f59e0b', emoji: '🎬' },
  { value: 'other', label: 'Other', color: '#64748b', emoji: '📦' },
];

// Get category badge colors
export const getCategoryBadge = (type, isDark) => {
  const category = CATEGORIES.find(c => c.value === type);
  if (!category) {
    return { 
      bg: isDark ? 'hsl(240 3.7% 15.9%)' : 'hsl(240 4.8% 95.9%)', 
      color: isDark ? 'hsl(0 0% 98%)' : 'hsl(240 5.9% 10%)', 
      border: 'transparent' 
    };
  }
  
  return {
    bg: `${category.color}${isDark ? '20' : '15'}`,
    color: category.color,
    border: `${category.color}${isDark ? '40' : '30'}`,
  };
};

// Currencies
export const CURRENCIES = [
  { symbol: '₱', label: 'PHP (₱)' },
  { symbol: '$', label: 'USD ($)' },
  { symbol: '€', label: 'EUR (€)' },
  { symbol: '£', label: 'GBP (£)' },
  { symbol: '¥', label: 'JPY (¥)' },
  { symbol: '₹', label: 'INR (₹)' },
];
