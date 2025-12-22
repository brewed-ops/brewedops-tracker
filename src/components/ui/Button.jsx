import React, { useState } from 'react';

// ============================================
// BUTTON COMPONENT
// Variants: default, destructive, outline, secondary, ghost, link
// Sizes: default, sm, lg, icon
// ============================================

const Button = React.forwardRef(({ 
  children, 
  variant = 'default', 
  size = 'default', 
  disabled = false, 
  loading = false,
  onClick, 
  style = {},
  className = '',
  ...props 
}, ref) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    whiteSpace: 'nowrap',
    borderRadius: 'var(--radius, 8px)',
    fontSize: '14px',
    fontWeight: '500',
    fontFamily: 'inherit',
    transition: 'all 0.15s ease',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    border: 'none',
    outline: 'none',
    textDecoration: 'none',
    position: 'relative',
    overflow: 'hidden',
  };

  const sizeStyles = {
    default: { height: '40px', padding: '0 16px', fontSize: '14px' },
    sm: { height: '36px', padding: '0 12px', fontSize: '13px' },
    lg: { height: '44px', padding: '0 24px', fontSize: '15px' },
    icon: { height: '40px', width: '40px', padding: '0' },
    'icon-sm': { height: '32px', width: '32px', padding: '0' },
    'icon-lg': { height: '44px', width: '44px', padding: '0' },
  };

  const getVariantStyles = () => {
    const hoverScale = isPressed ? 0.98 : isHovered ? 1.01 : 1;
    
    switch (variant) {
      case 'default':
        return {
          backgroundColor: isHovered 
            ? 'var(--primary-hover, hsl(240 5.9% 15%))' 
            : 'var(--primary)',
          color: 'var(--primary-foreground)',
          boxShadow: isHovered ? 'var(--shadow-md)' : 'var(--shadow-sm)',
          transform: `scale(${hoverScale})`,
        };
      case 'destructive':
        return {
          backgroundColor: isHovered ? 'hsl(0 84.2% 55%)' : 'var(--destructive)',
          color: 'var(--destructive-foreground)',
          boxShadow: isHovered ? 'var(--shadow-md)' : 'var(--shadow-sm)',
          transform: `scale(${hoverScale})`,
        };
      case 'outline':
        return {
          backgroundColor: isHovered ? 'var(--accent)' : 'transparent',
          color: 'var(--foreground)',
          border: '1px solid var(--border)',
          boxShadow: isHovered ? 'var(--shadow-sm)' : 'none',
        };
      case 'secondary':
        return {
          backgroundColor: isHovered 
            ? 'var(--secondary-hover, hsl(240 4.8% 90%))' 
            : 'var(--secondary)',
          color: 'var(--secondary-foreground)',
          boxShadow: isHovered ? 'var(--shadow-sm)' : 'none',
        };
      case 'ghost':
        return {
          backgroundColor: isHovered ? 'var(--accent)' : 'transparent',
          color: isHovered ? 'var(--accent-foreground)' : 'var(--muted-foreground)',
        };
      case 'link':
        return {
          backgroundColor: 'transparent',
          color: 'var(--primary)',
          textDecoration: isHovered ? 'underline' : 'none',
          textUnderlineOffset: '4px',
          height: 'auto',
          padding: '0',
        };
      case 'success':
        return {
          backgroundColor: isHovered ? 'hsl(142 76% 32%)' : 'var(--success)',
          color: 'var(--success-foreground)',
          boxShadow: isHovered ? 'var(--shadow-md)' : 'var(--shadow-sm)',
          transform: `scale(${hoverScale})`,
        };
      case 'warning':
        return {
          backgroundColor: isHovered ? 'hsl(38 92% 45%)' : 'var(--warning)',
          color: 'var(--warning-foreground)',
          boxShadow: isHovered ? 'var(--shadow-md)' : 'var(--shadow-sm)',
          transform: `scale(${hoverScale})`,
        };
      default:
        return {};
    }
  };

  return (
    <button
      ref={ref}
      onClick={disabled || loading ? undefined : onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setIsPressed(false); }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      disabled={disabled || loading}
      style={{
        ...baseStyles,
        ...sizeStyles[size],
        ...getVariantStyles(),
        ...style,
      }}
      {...props}
    >
      {loading && (
        <svg 
          style={{ 
            width: '16px', 
            height: '16px', 
            animation: 'spin 1s linear infinite',
          }} 
          viewBox="0 0 24 24" 
          fill="none"
        >
          <circle 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="3" 
            strokeLinecap="round"
            strokeDasharray="32"
            strokeDashoffset="12"
          />
        </svg>
      )}
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export { Button };
