import React from 'react';

// ============================================
// BADGE COMPONENT
// Variants: default, secondary, destructive, outline, success, warning
// ============================================

const Badge = React.forwardRef(({ 
  children, 
  variant = 'default',
  size = 'default',
  dot = false,
  className = '',
  style = {},
  ...props 
}, ref) => {
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    borderRadius: '9999px',
    fontWeight: '500',
    lineHeight: '1',
    whiteSpace: 'nowrap',
    transition: 'all 0.15s ease',
  };

  const sizeStyles = {
    sm: { padding: '2px 8px', fontSize: '11px' },
    default: { padding: '4px 10px', fontSize: '12px' },
    lg: { padding: '6px 14px', fontSize: '13px' },
  };

  const variantStyles = {
    default: {
      backgroundColor: 'var(--primary)',
      color: 'var(--primary-foreground)',
      border: 'none',
    },
    secondary: {
      backgroundColor: 'var(--secondary)',
      color: 'var(--secondary-foreground)',
      border: 'none',
    },
    destructive: {
      backgroundColor: 'var(--destructive)',
      color: 'var(--destructive-foreground)',
      border: 'none',
    },
    outline: {
      backgroundColor: 'transparent',
      color: 'var(--foreground)',
      border: '1px solid var(--border)',
    },
    success: {
      backgroundColor: 'hsl(142 76% 36% / 0.15)',
      color: 'hsl(142 76% 36%)',
      border: '1px solid hsl(142 76% 36% / 0.3)',
    },
    warning: {
      backgroundColor: 'hsl(38 92% 50% / 0.15)',
      color: 'hsl(38 92% 50%)',
      border: '1px solid hsl(38 92% 50% / 0.3)',
    },
    info: {
      backgroundColor: 'hsl(221 83% 53% / 0.15)',
      color: 'hsl(221 83% 53%)',
      border: '1px solid hsl(221 83% 53% / 0.3)',
    },
  };

  return (
    <span
      ref={ref}
      style={{
        ...baseStyles,
        ...sizeStyles[size],
        ...variantStyles[variant],
        ...style,
      }}
      {...props}
    >
      {dot && (
        <span style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: 'currentColor',
          flexShrink: 0,
        }} />
      )}
      {children}
    </span>
  );
});

Badge.displayName = 'Badge';

// ============================================
// CATEGORY BADGE (Pre-styled for expense categories)
// ============================================

const CategoryBadge = ({ 
  category, // { value, label, color, emoji }
  showEmoji = false,
  size = 'default',
  style = {},
  isDark = false,
  ...props 
}) => {
  if (!category) return null;

  const badgeStyle = {
    backgroundColor: `${category.color}${isDark ? '20' : '15'}`,
    color: category.color,
    border: `1px solid ${category.color}${isDark ? '40' : '30'}`,
  };

  return (
    <Badge
      variant="outline"
      size={size}
      style={{ ...badgeStyle, ...style }}
      {...props}
    >
      {showEmoji && category.emoji && (
        <span style={{ fontSize: size === 'sm' ? '10px' : '12px' }}>{category.emoji}</span>
      )}
      {category.label}
    </Badge>
  );
};

// ============================================
// STATUS BADGE (For recurring, due soon, etc.)
// ============================================

const StatusBadge = ({ 
  status, // 'recurring' | 'due-soon' | 'overdue' | 'paid' | 'pending'
  label,
  size = 'sm',
  style = {},
  ...props 
}) => {
  const statusConfig = {
    recurring: { variant: 'info', defaultLabel: 'Recurring' },
    'due-soon': { variant: 'warning', defaultLabel: 'Due Soon' },
    overdue: { variant: 'destructive', defaultLabel: 'Overdue' },
    paid: { variant: 'success', defaultLabel: 'Paid' },
    pending: { variant: 'secondary', defaultLabel: 'Pending' },
    weekly: { variant: 'info', defaultLabel: 'Weekly' },
    monthly: { variant: 'info', defaultLabel: 'Monthly' },
    yearly: { variant: 'info', defaultLabel: 'Yearly' },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <Badge
      variant={config.variant}
      size={size}
      style={style}
      {...props}
    >
      {label || config.defaultLabel}
    </Badge>
  );
};

export { Badge, CategoryBadge, StatusBadge };
