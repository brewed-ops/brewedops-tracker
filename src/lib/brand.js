// ============================================
// BREWEDOPS BRAND CONFIGURATION
// Based on Official Brand Kit
// ============================================

// Brand Colors
export const BRAND = {
  // Primary Colors
  brown: '#3F200C',      // Coffee Brown - Primary text, logo
  blue: '#004AAC',       // Brand Blue - Buttons, links, accents  
  green: '#51AF43',      // Success Green - Arrow icon, success states
  cream: '#FFF0D4',      // Cream - Light backgrounds
  black: '#000000',      // Pure black

  // Extended Palette (derived from brand colors)
  blueDark: '#003d8f',   // Darker blue for hover states
  blueLight: '#3373c4',  // Lighter blue for secondary elements
  blueMuted: '#004AAC20', // Blue with transparency for backgrounds
  
  brownLight: '#5a3a1f', // Lighter brown
  brownMuted: '#3F200C15', // Brown with transparency
  
  greenDark: '#3d8a32',  // Darker green for hover
  greenLight: '#6bc45a', // Lighter green
  greenMuted: '#51AF4320', // Green with transparency
  
  creamDark: '#f5e6c8',  // Slightly darker cream
  
  // Semantic Colors
  success: '#51AF43',    // Green
  error: '#dc2626',      // Red
  warning: '#f59e0b',    // Amber
  info: '#004AAC',       // Blue
};

// Typography
export const FONTS = {
  heading: "'Montserrat', sans-serif",
  body: "'Poppins', sans-serif",
  
  // Font weights
  weights: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  }
};

// Google Fonts import URL
export const GOOGLE_FONTS_URL = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Poppins:wght@400;500;600&display=swap';

// Theme configuration with brand colors
export const getBrandTheme = (isDark) => ({
  // Backgrounds
  bg: isDark ? '#09090b' : '#ffffff',
  bgAlt: isDark ? '#0a0a0b' : BRAND.cream,
  bgMuted: isDark ? '#18181b' : '#fafafa',
  
  // Cards
  cardBg: isDark ? '#18181b' : '#ffffff',
  cardBorder: isDark ? '#27272a' : '#e4e4e7',
  cardHover: isDark ? '#1f1f23' : '#f8f8f8',
  
  // Text
  text: isDark ? '#fafafa' : BRAND.brown,
  textMuted: isDark ? '#a1a1aa' : '#71717a',
  textLight: isDark ? '#71717a' : '#a1a1aa',
  
  // Brand accent
  accent: BRAND.blue,
  accentHover: BRAND.blueDark,
  accentMuted: isDark ? '#004AAC30' : '#004AAC15',
  accentText: '#ffffff',
  
  // Secondary accent (green)
  secondary: BRAND.green,
  secondaryHover: BRAND.greenDark,
  secondaryMuted: isDark ? '#51AF4330' : '#51AF4315',
  
  // Inputs
  inputBg: isDark ? '#27272a' : '#ffffff',
  inputBorder: isDark ? '#3f3f46' : '#e4e4e7',
  inputFocus: BRAND.blue,
  
  // Status colors
  success: BRAND.green,
  successBg: isDark ? '#052e16' : '#f0fdf4',
  successBorder: isDark ? '#166534' : '#86efac',
  
  error: '#ef4444',
  errorBg: isDark ? '#451a1a' : '#fef2f2',
  errorBorder: isDark ? '#7f1d1d' : '#fecaca',
  
  warning: '#f59e0b',
  warningBg: isDark ? '#451a03' : '#fffbeb',
  warningBorder: isDark ? '#92400e' : '#fde68a',
});

// Common button styles with brand colors
export const getButtonStyles = (theme) => ({
  primary: {
    height: '44px',
    padding: '0 24px',
    backgroundColor: BRAND.blue,
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    fontFamily: FONTS.body,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'all 0.15s ease',
  },
  
  secondary: {
    height: '44px',
    padding: '0 24px',
    backgroundColor: BRAND.green,
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    fontFamily: FONTS.body,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'all 0.15s ease',
  },
  
  outline: {
    height: '44px',
    padding: '0 24px',
    backgroundColor: 'transparent',
    color: theme.text,
    border: `1px solid ${theme.cardBorder}`,
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '500',
    fontFamily: FONTS.body,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'all 0.15s ease',
  },
  
  ghost: {
    height: '40px',
    padding: '0 16px',
    backgroundColor: 'transparent',
    color: theme.textMuted,
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    fontFamily: FONTS.body,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    transition: 'all 0.15s ease',
  },
});

// Input styles
export const getInputStyles = (theme, hasError = false) => ({
  width: '100%',
  height: '44px',
  backgroundColor: theme.inputBg,
  border: `1px solid ${hasError ? theme.error : theme.inputBorder}`,
  borderRadius: '10px',
  padding: '0 14px',
  fontSize: '14px',
  fontFamily: FONTS.body,
  color: theme.text,
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
});

// Card styles
export const getCardStyles = (theme) => ({
  backgroundColor: theme.cardBg,
  border: `1px solid ${theme.cardBorder}`,
  borderRadius: '12px',
  padding: '20px',
  transition: 'all 0.15s ease',
});

// Badge/Tag styles with brand colors
export const getBadgeStyles = (variant, isDark) => {
  const variants = {
    blue: {
      bg: isDark ? '#004AAC25' : '#004AAC15',
      color: isDark ? '#6ba3d6' : BRAND.blue,
      border: isDark ? '#004AAC50' : '#004AAC30',
    },
    green: {
      bg: isDark ? '#51AF4325' : '#51AF4315',
      color: isDark ? '#7bc96f' : BRAND.green,
      border: isDark ? '#51AF4350' : '#51AF4330',
    },
    brown: {
      bg: isDark ? '#3F200C25' : '#3F200C10',
      color: isDark ? '#b89a7a' : BRAND.brown,
      border: isDark ? '#3F200C50' : '#3F200C30',
    },
    cream: {
      bg: BRAND.cream,
      color: BRAND.brown,
      border: BRAND.creamDark,
    },
  };
  
  return variants[variant] || variants.blue;
};

export default {
  BRAND,
  FONTS,
  GOOGLE_FONTS_URL,
  getBrandTheme,
  getButtonStyles,
  getInputStyles,
  getCardStyles,
  getBadgeStyles,
};
