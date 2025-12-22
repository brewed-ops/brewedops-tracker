import React from 'react';

// ============================================
// TOAST COMPONENT
// ============================================

const Toast = ({ 
  message, 
  type = 'default', // 'default' | 'success' | 'error' | 'warning' | 'info'
  onClose,
  action,
  style = {},
  ...props 
}) => {
  const typeConfig = {
    default: {
      bg: 'var(--foreground)',
      color: 'var(--background)',
      icon: null,
    },
    success: {
      bg: 'hsl(142 76% 36%)',
      color: 'white',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
    },
    error: {
      bg: 'hsl(0 84.2% 60.2%)',
      color: 'white',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      ),
    },
    warning: {
      bg: 'hsl(38 92% 50%)',
      color: 'white',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      ),
    },
    info: {
      bg: 'hsl(221 83% 53%)',
      color: 'white',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      ),
    },
  };

  const config = typeConfig[type] || typeConfig.default;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '14px 18px',
        backgroundColor: config.bg,
        color: config.color,
        borderRadius: '10px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
        animation: 'slideInRight 0.3s ease',
        maxWidth: '380px',
        ...style,
      }}
      {...props}
    >
      {config.icon && (
        <div style={{ flexShrink: 0 }}>
          {config.icon}
        </div>
      )}
      <span style={{ 
        fontSize: '14px', 
        fontWeight: '500',
        flex: 1,
        lineHeight: '1.4',
      }}>
        {message}
      </span>
      {action}
      {onClose && (
        <button
          onClick={onClose}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '24px',
            height: '24px',
            backgroundColor: 'transparent',
            border: 'none',
            borderRadius: '4px',
            color: 'inherit',
            opacity: 0.7,
            cursor: 'pointer',
            marginLeft: '4px',
            flexShrink: 0,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
};

// ============================================
// ALERT COMPONENT (Inline alerts)
// ============================================

const Alert = React.forwardRef(({ 
  children,
  title,
  variant = 'default', // 'default' | 'destructive' | 'success' | 'warning' | 'info'
  icon: CustomIcon,
  style = {},
  ...props 
}, ref) => {
  const variantConfig = {
    default: {
      bg: 'var(--secondary)',
      border: 'var(--border)',
      titleColor: 'var(--foreground)',
      textColor: 'var(--muted-foreground)',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      ),
    },
    destructive: {
      bg: 'hsl(0 84.2% 60.2% / 0.1)',
      border: 'hsl(0 84.2% 60.2% / 0.3)',
      titleColor: 'hsl(0 84.2% 60.2%)',
      textColor: 'hsl(0 84.2% 45%)',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="hsl(0 84.2% 60.2%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      ),
    },
    success: {
      bg: 'hsl(142 76% 36% / 0.1)',
      border: 'hsl(142 76% 36% / 0.3)',
      titleColor: 'hsl(142 76% 36%)',
      textColor: 'hsl(142 76% 26%)',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="hsl(142 76% 36%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
    },
    warning: {
      bg: 'hsl(38 92% 50% / 0.1)',
      border: 'hsl(38 92% 50% / 0.3)',
      titleColor: 'hsl(38 92% 40%)',
      textColor: 'hsl(38 92% 30%)',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="hsl(38 92% 50%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      ),
    },
    info: {
      bg: 'hsl(221 83% 53% / 0.1)',
      border: 'hsl(221 83% 53% / 0.3)',
      titleColor: 'hsl(221 83% 53%)',
      textColor: 'hsl(221 83% 40%)',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="hsl(221 83% 53%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      ),
    },
  };

  const config = variantConfig[variant] || variantConfig.default;
  const Icon = CustomIcon ? <CustomIcon style={{ width: '18px', height: '18px' }} /> : config.icon;

  return (
    <div
      ref={ref}
      role="alert"
      style={{
        display: 'flex',
        gap: '12px',
        padding: '16px',
        backgroundColor: config.bg,
        border: `1px solid ${config.border}`,
        borderRadius: '10px',
        ...style,
      }}
      {...props}
    >
      <div style={{ flexShrink: 0, marginTop: '1px' }}>
        {Icon}
      </div>
      <div style={{ flex: 1 }}>
        {title && (
          <h5 style={{
            fontSize: '14px',
            fontWeight: '600',
            color: config.titleColor,
            margin: '0 0 4px',
          }}>
            {title}
          </h5>
        )}
        <div style={{
          fontSize: '14px',
          color: config.textColor,
          lineHeight: '1.5',
        }}>
          {children}
        </div>
      </div>
    </div>
  );
});

Alert.displayName = 'Alert';

export { Toast, Alert };
