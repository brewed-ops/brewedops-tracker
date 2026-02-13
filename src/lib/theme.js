// ============================================
// THEME - BrewedOps Brand Theme Configuration
// Warm coffee-inspired palette
// ============================================

// Get theme colors based on dark/light mode
export const getTheme = (isDark) => ({
  // Backgrounds
  bg: isDark ? '#0d0b09' : '#faf8f5',
  bgAlt: isDark ? '#100e0b' : '#FFF0D4',
  cardBg: isDark ? '#171411' : '#ffffff',
  cardBorder: isDark ? '#2a2420' : '#e8e0d4',

  // Text
  text: isDark ? '#f5f0eb' : '#3F200C',
  textMuted: isDark ? '#a09585' : '#7a6652',
  textSubtle: isDark ? '#9a8d80' : '#6b5f52',
  textDim: isDark ? '#85796c' : '#7d7062',

  // Inputs
  inputBg: isDark ? '#1e1a16' : '#faf8f5',
  inputBorder: isDark ? '#332d26' : '#e0d6c8',

  // States
  statBg: isDark ? '#1e1a16' : '#faf8f5',
  toggleActive: isDark ? '#1e1a16' : '#ffffff',
  hoverBg: isDark ? '#2a2420' : '#f0e8dc',

  // Status
  successBg: isDark ? '#0a2618' : '#ecfdf5',
  successText: isDark ? '#51AF43' : '#3d8a32',
  warningBg: isDark ? '#261a08' : '#fff8eb',
  warningText: isDark ? '#f59e0b' : '#d97706',
  errorBg: isDark ? '#260a0a' : '#fef2f2',
  errorText: isDark ? '#ef4444' : '#dc2626',
});

// Get CSS variables from theme
export const getThemeVars = (theme) => ({
  '--bg': theme.bg,
  '--card-bg': theme.cardBg,
  '--card-border': theme.cardBorder,
  '--text': theme.text,
  '--text-muted': theme.textMuted,
  '--text-subtle': theme.textSubtle,
  '--input-bg': theme.inputBg,
  '--input-border': theme.inputBorder,
  '--stat-bg': theme.statBg,
});

// Common style generators
export const getCardStyle = (theme, isSmall = false) => ({
  backgroundColor: theme.cardBg,
  borderRadius: '14px',
  border: `1px solid ${theme.cardBorder}`,
  padding: isSmall ? '16px' : '24px',
  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
});

export const getInputStyle = (theme, isSmall = false) => ({
  width: '100%',
  height: isSmall ? '42px' : '40px',
  backgroundColor: theme.inputBg,
  border: `1px solid ${theme.inputBorder}`,
  borderRadius: '10px',
  padding: '0 14px',
  fontSize: isSmall ? '16px' : '14px',
  color: theme.text,
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s ease',
});

export const getButtonStyle = (active, theme, isDark, isSmall = false) => ({
  padding: isSmall ? '8px 14px' : '8px 14px',
  backgroundColor: active ? theme.toggleActive : 'transparent',
  border: active ? `1px solid ${theme.inputBorder}` : '1px solid transparent',
  borderRadius: '8px',
  fontSize: '13px',
  color: active ? theme.text : theme.textSubtle,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  boxShadow: active && !isDark ? '0 1px 3px rgba(63,32,12,0.06)' : 'none',
  flex: isSmall ? 1 : 'none',
  transition: 'all 0.15s ease',
});

// Button variants
export const buttonPrimary = (isDark) => ({
  height: '44px',
  padding: '0 20px',
  backgroundColor: '#004AAC',
  color: '#ffffff',
  border: 'none',
  borderRadius: '10px',
  fontSize: '14px',
  fontWeight: '600',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  transition: 'all 0.15s ease',
});

export const buttonOutline = (theme) => ({
  height: '44px',
  width: '44px',
  padding: '0',
  backgroundColor: 'transparent',
  border: `1px solid ${theme.cardBorder}`,
  borderRadius: '10px',
  color: theme.textMuted,
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.15s ease',
});

export const buttonGhost = (theme) => ({
  padding: '8px 14px',
  backgroundColor: 'transparent',
  border: 'none',
  borderRadius: '8px',
  color: theme.textMuted,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  fontSize: '14px',
  transition: 'all 0.15s ease',
});

export const buttonDestructive = {
  height: '44px',
  padding: '0 20px',
  backgroundColor: '#ef4444',
  color: '#ffffff',
  border: 'none',
  borderRadius: '10px',
  fontSize: '14px',
  fontWeight: '600',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
};

export const buttonSuccess = {
  height: '44px',
  padding: '0 20px',
  backgroundColor: '#51AF43',
  color: '#ffffff',
  border: 'none',
  borderRadius: '10px',
  fontSize: '14px',
  fontWeight: '600',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
};
