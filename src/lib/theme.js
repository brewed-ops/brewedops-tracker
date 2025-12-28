// ============================================
// THEME - Theme configuration and helpers
// ============================================

// Get theme colors based on dark/light mode
export const getTheme = (isDark) => ({
  bg: isDark ? '#0a0a0b' : '#f4f4f5',
  cardBg: isDark ? '#18181b' : '#ffffff',
  cardBorder: isDark ? '#27272a' : '#e4e4e7',
  text: isDark ? '#fafafa' : '#18181b',
  textMuted: isDark ? '#a1a1aa' : '#71717a',
  textSubtle: isDark ? '#71717a' : '#a1a1aa',
  textDim: isDark ? '#52525b' : '#a1a1aa',
  inputBg: isDark ? '#27272a' : '#f4f4f5',
  inputBorder: isDark ? '#3f3f46' : '#e4e4e7',
  statBg: isDark ? '#27272a' : '#f4f4f5',
  toggleActive: isDark ? '#27272a' : '#ffffff',
  hoverBg: isDark ? '#3f3f46' : '#e4e4e7',
  successBg: isDark ? '#14532d' : '#dcfce7',
  successText: isDark ? '#22c55e' : '#16a34a',
  warningBg: isDark ? '#7c2d12' : '#fed7aa',
  warningText: isDark ? '#f97316' : '#ea580c',
  errorBg: isDark ? '#7f1d1d' : '#fee2e2',
  errorText: isDark ? '#ef4444' : '#dc2626',
});

// Get CSS variables from theme (for use with CSS-in-JS)
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
  borderRadius: '12px',
  border: `1px solid ${theme.cardBorder}`,
  padding: isSmall ? '16px' : '20px'
});

export const getInputStyle = (theme, isSmall = false) => ({
  width: '100%',
  height: isSmall ? '40px' : '36px',
  backgroundColor: theme.inputBg,
  border: `1px solid ${theme.inputBorder}`,
  borderRadius: '6px',
  padding: '0 12px',
  fontSize: isSmall ? '16px' : '14px',
  color: theme.text,
  outline: 'none',
  boxSizing: 'border-box'
});

export const getButtonStyle = (active, theme, isDark, isSmall = false) => ({
  padding: isSmall ? '8px 12px' : '6px 12px',
  backgroundColor: active ? theme.toggleActive : 'transparent',
  border: active ? `1px solid ${theme.inputBorder}` : '1px solid transparent',
  borderRadius: '6px',
  fontSize: '13px',
  color: active ? theme.text : theme.textSubtle,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  boxShadow: active && !isDark ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
  flex: isSmall ? 1 : 'none'
});

// Button variants
export const buttonPrimary = (isDark) => ({
  height: '40px',
  padding: '0 16px',
  backgroundColor: isDark ? '#fafafa' : '#18181b',
  color: isDark ? '#18181b' : '#fafafa',
  border: 'none',
  borderRadius: '6px',
  fontSize: '14px',
  fontWeight: '500',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  transition: 'opacity 0.2s'
});

export const buttonOutline = (theme) => ({
  height: '40px',
  width: '40px',
  padding: '0',
  backgroundColor: 'transparent',
  border: `1px solid ${theme.cardBorder}`,
  borderRadius: '6px',
  color: theme.textMuted,
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'background-color 0.2s, border-color 0.2s'
});

export const buttonGhost = (theme) => ({
  padding: '8px 12px',
  backgroundColor: 'transparent',
  border: 'none',
  borderRadius: '6px',
  color: theme.textMuted,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  fontSize: '14px',
  transition: 'background-color 0.2s'
});

export const buttonDestructive = {
  height: '40px',
  padding: '0 16px',
  backgroundColor: '#ef4444',
  color: '#ffffff',
  border: 'none',
  borderRadius: '6px',
  fontSize: '14px',
  fontWeight: '500',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
};

export const buttonSuccess = {
  height: '40px',
  padding: '0 16px',
  backgroundColor: '#22c55e',
  color: '#ffffff',
  border: 'none',
  borderRadius: '6px',
  fontSize: '14px',
  fontWeight: '500',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
};
