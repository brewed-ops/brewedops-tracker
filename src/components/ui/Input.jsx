import React, { useState } from 'react';

// ============================================
// INPUT COMPONENT
// ============================================

const Input = React.forwardRef(({ 
  type = 'text',
  error = false,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  style = {},
  ...props 
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);

  const inputStyles = {
    display: 'flex',
    height: '40px',
    width: '100%',
    borderRadius: 'var(--radius, 8px)',
    border: '1px solid',
    borderColor: error 
      ? 'var(--destructive)' 
      : isFocused 
        ? 'var(--ring)' 
        : 'var(--input)',
    backgroundColor: 'transparent',
    padding: Icon 
      ? iconPosition === 'left' ? '0 12px 0 40px' : '0 40px 0 12px'
      : '0 12px',
    fontSize: '14px',
    color: 'var(--foreground)',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxShadow: isFocused ? '0 0 0 3px var(--ring-alpha, rgba(0,0,0,0.05))' : 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  };

  if (!Icon) {
    return (
      <input
        ref={ref}
        type={type}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={{ ...inputStyles, ...style }}
        {...props}
      />
    );
  }

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <div style={{
        position: 'absolute',
        [iconPosition]: '12px',
        top: '50%',
        transform: 'translateY(-50%)',
        color: 'var(--muted-foreground)',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Icon style={{ width: '16px', height: '16px' }} />
      </div>
      <input
        ref={ref}
        type={type}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={{ ...inputStyles, ...style }}
        {...props}
      />
    </div>
  );
});

Input.displayName = 'Input';

// ============================================
// SELECT COMPONENT
// ============================================

const Select = React.forwardRef(({ 
  children,
  error = false,
  className = '',
  style = {},
  ...props 
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <select
      ref={ref}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      style={{
        display: 'flex',
        height: '40px',
        width: '100%',
        borderRadius: 'var(--radius, 8px)',
        border: '1px solid',
        borderColor: error 
          ? 'var(--destructive)' 
          : isFocused 
            ? 'var(--ring)' 
            : 'var(--input)',
        backgroundColor: 'transparent',
        padding: '0 32px 0 12px',
        fontSize: '14px',
        color: 'var(--foreground)',
        outline: 'none',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        boxShadow: isFocused ? '0 0 0 3px var(--ring-alpha, rgba(0,0,0,0.05))' : 'none',
        boxSizing: 'border-box',
        fontFamily: 'inherit',
        cursor: 'pointer',
        appearance: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2371717a' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 10px center',
        ...style,
      }}
      {...props}
    >
      {children}
    </select>
  );
});

Select.displayName = 'Select';

// ============================================
// TEXTAREA COMPONENT
// ============================================

const Textarea = React.forwardRef(({ 
  error = false,
  className = '',
  style = {},
  ...props 
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <textarea
      ref={ref}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      style={{
        display: 'flex',
        minHeight: '100px',
        width: '100%',
        borderRadius: 'var(--radius, 8px)',
        border: '1px solid',
        borderColor: error 
          ? 'var(--destructive)' 
          : isFocused 
            ? 'var(--ring)' 
            : 'var(--input)',
        backgroundColor: 'transparent',
        padding: '12px',
        fontSize: '14px',
        color: 'var(--foreground)',
        outline: 'none',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        boxShadow: isFocused ? '0 0 0 3px var(--ring-alpha, rgba(0,0,0,0.05))' : 'none',
        boxSizing: 'border-box',
        fontFamily: 'inherit',
        resize: 'vertical',
        lineHeight: '1.5',
        ...style,
      }}
      {...props}
    />
  );
});

Textarea.displayName = 'Textarea';

// ============================================
// LABEL COMPONENT
// ============================================

const Label = React.forwardRef(({ 
  children,
  required = false,
  className = '',
  style = {},
  ...props 
}, ref) => (
  <label
    ref={ref}
    style={{
      display: 'block',
      fontSize: '14px',
      fontWeight: '500',
      color: 'var(--foreground)',
      marginBottom: '8px',
      ...style,
    }}
    {...props}
  >
    {children}
    {required && (
      <span style={{ color: 'var(--destructive)', marginLeft: '4px' }}>*</span>
    )}
  </label>
));

Label.displayName = 'Label';

// ============================================
// FORM FIELD WRAPPER
// ============================================

const FormField = ({ 
  label,
  required = false,
  error,
  hint,
  children,
  style = {},
  ...props 
}) => (
  <div style={{ marginBottom: '16px', ...style }} {...props}>
    {label && <Label required={required}>{label}</Label>}
    {children}
    {error && (
      <p style={{ 
        fontSize: '13px', 
        color: 'var(--destructive)', 
        margin: '6px 0 0',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        {error}
      </p>
    )}
    {hint && !error && (
      <p style={{ 
        fontSize: '13px', 
        color: 'var(--muted-foreground)', 
        margin: '6px 0 0',
      }}>
        {hint}
      </p>
    )}
  </div>
);

export { Input, Select, Textarea, Label, FormField };
