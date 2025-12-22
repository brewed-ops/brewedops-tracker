import React from 'react';

// ============================================
// AVATAR COMPONENT
// ============================================

const Avatar = React.forwardRef(({ 
  children,
  src,
  alt = '',
  fallback,
  size = 'default',
  style = {},
  ...props 
}, ref) => {
  const [imageError, setImageError] = React.useState(false);

  const sizeStyles = {
    xs: { width: '24px', height: '24px', fontSize: '10px' },
    sm: { width: '32px', height: '32px', fontSize: '12px' },
    default: { width: '40px', height: '40px', fontSize: '14px' },
    lg: { width: '48px', height: '48px', fontSize: '18px' },
    xl: { width: '64px', height: '64px', fontSize: '24px' },
  };

  const showFallback = !src || imageError;

  return (
    <div
      ref={ref}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        backgroundColor: 'hsl(221.2 83.2% 53.3%)',
        color: 'white',
        fontWeight: '600',
        flexShrink: 0,
        overflow: 'hidden',
        ...sizeStyles[size],
        ...style,
      }}
      {...props}
    >
      {!showFallback ? (
        <img
          src={src}
          alt={alt}
          onError={() => setImageError(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      ) : (
        fallback || children
      )}
    </div>
  );
});

Avatar.displayName = 'Avatar';

// ============================================
// SEPARATOR COMPONENT
// ============================================

const Separator = React.forwardRef(({ 
  orientation = 'horizontal',
  decorative = true,
  style = {},
  ...props 
}, ref) => (
  <div
    ref={ref}
    role={decorative ? 'none' : 'separator'}
    aria-orientation={decorative ? undefined : orientation}
    style={{
      flexShrink: 0,
      backgroundColor: 'var(--border)',
      ...(orientation === 'horizontal' 
        ? { height: '1px', width: '100%' } 
        : { width: '1px', height: '100%' }
      ),
      ...style,
    }}
    {...props}
  />
));

Separator.displayName = 'Separator';

// ============================================
// SKELETON COMPONENT (Loading placeholder)
// ============================================

const Skeleton = React.forwardRef(({ 
  className = '',
  style = {},
  ...props 
}, ref) => (
  <div
    ref={ref}
    style={{
      backgroundColor: 'var(--muted)',
      borderRadius: 'var(--radius)',
      animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      ...style,
    }}
    {...props}
  />
));

Skeleton.displayName = 'Skeleton';

// ============================================
// SPINNER COMPONENT
// ============================================

const Spinner = ({ 
  size = 'default',
  style = {},
  ...props 
}) => {
  const sizeStyles = {
    sm: { width: '16px', height: '16px' },
    default: { width: '24px', height: '24px' },
    lg: { width: '32px', height: '32px' },
    xl: { width: '48px', height: '48px' },
  };

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      style={{
        animation: 'spin 1s linear infinite',
        color: 'var(--muted-foreground)',
        ...sizeStyles[size],
        ...style,
      }}
      {...props}
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
  );
};

// ============================================
// EMPTY STATE COMPONENT
// ============================================

const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
  style = {},
  ...props
}) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 24px',
      textAlign: 'center',
      ...style,
    }}
    {...props}
  >
    {Icon && (
      <div style={{
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        backgroundColor: 'var(--secondary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '20px',
      }}>
        <Icon style={{ 
          width: '36px', 
          height: '36px', 
          color: 'var(--muted-foreground)',
        }} />
      </div>
    )}
    {title && (
      <h3 style={{
        fontSize: '16px',
        fontWeight: '600',
        color: 'var(--foreground)',
        margin: '0 0 8px',
      }}>
        {title}
      </h3>
    )}
    {description && (
      <p style={{
        fontSize: '14px',
        color: 'var(--muted-foreground)',
        margin: '0 0 20px',
        maxWidth: '320px',
        lineHeight: '1.5',
      }}>
        {description}
      </p>
    )}
    {action}
  </div>
);

// ============================================
// PROGRESS BAR COMPONENT
// ============================================

const Progress = React.forwardRef(({ 
  value = 0,
  max = 100,
  color,
  showLabel = false,
  size = 'default',
  style = {},
  ...props 
}, ref) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  const sizeStyles = {
    sm: { height: '4px' },
    default: { height: '8px' },
    lg: { height: '12px' },
  };

  const getColor = () => {
    if (color) return color;
    if (percentage >= 100) return 'var(--destructive)';
    if (percentage >= 80) return 'var(--warning)';
    return 'var(--success)';
  };

  return (
    <div style={{ width: '100%' }}>
      <div
        ref={ref}
        style={{
          width: '100%',
          backgroundColor: 'var(--secondary)',
          borderRadius: '9999px',
          overflow: 'hidden',
          ...sizeStyles[size],
          ...style,
        }}
        {...props}
      >
        <div
          style={{
            height: '100%',
            width: `${percentage}%`,
            backgroundColor: getColor(),
            borderRadius: '9999px',
            transition: 'width 0.3s ease',
          }}
        />
      </div>
      {showLabel && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '6px',
          fontSize: '12px',
          color: 'var(--muted-foreground)',
        }}>
          <span>{value}</span>
          <span>{percentage.toFixed(0)}%</span>
        </div>
      )}
    </div>
  );
});

Progress.displayName = 'Progress';

// ============================================
// TOOLTIP COMPONENT (Simple)
// ============================================

const Tooltip = ({ 
  children, 
  content,
  position = 'top',
  ...props 
}) => {
  const [isVisible, setIsVisible] = React.useState(false);

  const positionStyles = {
    top: { bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: '8px' },
    bottom: { top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: '8px' },
    left: { right: '100%', top: '50%', transform: 'translateY(-50%)', marginRight: '8px' },
    right: { left: '100%', top: '50%', transform: 'translateY(-50%)', marginLeft: '8px' },
  };

  return (
    <div
      style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      {...props}
    >
      {children}
      {isVisible && content && (
        <div
          style={{
            position: 'absolute',
            zIndex: 50,
            padding: '6px 10px',
            backgroundColor: 'var(--foreground)',
            color: 'var(--background)',
            fontSize: '12px',
            fontWeight: '500',
            borderRadius: '6px',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            animation: 'fadeIn 0.15s ease',
            ...positionStyles[position],
          }}
        >
          {content}
        </div>
      )}
    </div>
  );
};

export { Avatar, Separator, Skeleton, Spinner, EmptyState, Progress, Tooltip };
