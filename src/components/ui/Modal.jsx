import React, { useEffect } from 'react';

// ============================================
// MODAL / DIALOG COMPONENT
// ============================================

const Modal = ({ 
  isOpen, 
  onClose, 
  children,
  size = 'default',
  closeOnOverlayClick = true,
  showCloseButton = true,
  style = {},
  ...props 
}) => {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeStyles = {
    sm: { maxWidth: '380px' },
    default: { maxWidth: '450px' },
    lg: { maxWidth: '600px' },
    xl: { maxWidth: '800px' },
    full: { maxWidth: '95vw', maxHeight: '95vh' },
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
      {...props}
    >
      {/* Overlay */}
      <div
        onClick={closeOnOverlayClick ? onClose : undefined}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(4px)',
          animation: 'fadeIn 0.2s ease',
        }}
      />
      
      {/* Modal Content */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          backgroundColor: 'var(--card)',
          borderRadius: '16px',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-lg)',
          animation: 'slideUp 0.25s ease',
          overflow: 'hidden',
          ...sizeStyles[size],
          ...style,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {showCloseButton && (
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '8px',
              color: 'var(--muted-foreground)',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              zIndex: 10,
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'var(--secondary)';
              e.target.style.color = 'var(--foreground)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = 'var(--muted-foreground)';
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
        {children}
      </div>
    </div>
  );
};

// ============================================
// MODAL PARTS
// ============================================

const ModalHeader = ({ 
  children, 
  icon: Icon,
  iconColor,
  iconBg,
  centered = false,
  style = {},
  ...props 
}) => (
  <div
    style={{
      padding: '24px 24px 0',
      display: 'flex',
      flexDirection: centered ? 'column' : 'row',
      alignItems: centered ? 'center' : 'flex-start',
      gap: '16px',
      textAlign: centered ? 'center' : 'left',
      ...style,
    }}
    {...props}
  >
    {Icon && (
      <div style={{
        width: centered ? '56px' : '44px',
        height: centered ? '56px' : '44px',
        borderRadius: '12px',
        backgroundColor: iconBg || 'var(--secondary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Icon style={{ 
          width: centered ? '28px' : '22px', 
          height: centered ? '28px' : '22px', 
          color: iconColor || 'var(--muted-foreground)',
        }} />
      </div>
    )}
    <div style={{ flex: 1, minWidth: 0 }}>
      {children}
    </div>
  </div>
);

const ModalTitle = ({ 
  children, 
  style = {},
  ...props 
}) => (
  <h2
    style={{
      fontSize: '18px',
      fontWeight: '600',
      color: 'var(--foreground)',
      margin: 0,
      letterSpacing: '-0.025em',
      ...style,
    }}
    {...props}
  >
    {children}
  </h2>
);

const ModalDescription = ({ 
  children, 
  style = {},
  ...props 
}) => (
  <p
    style={{
      fontSize: '14px',
      color: 'var(--muted-foreground)',
      margin: '6px 0 0',
      lineHeight: '1.5',
      ...style,
    }}
    {...props}
  >
    {children}
  </p>
);

const ModalContent = ({ 
  children, 
  style = {},
  ...props 
}) => (
  <div
    style={{
      padding: '24px',
      ...style,
    }}
    {...props}
  >
    {children}
  </div>
);

const ModalFooter = ({ 
  children, 
  style = {},
  ...props 
}) => (
  <div
    style={{
      padding: '0 24px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: '12px',
      ...style,
    }}
    {...props}
  >
    {children}
  </div>
);

// ============================================
// CONFIRM DIALOG (Pre-built confirmation modal)
// ============================================

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'destructive', // 'destructive' | 'default' | 'warning'
  icon: Icon,
  loading = false,
  children,
}) => {
  const iconColors = {
    destructive: { bg: 'hsl(0 84.2% 60.2% / 0.15)', color: 'hsl(0 84.2% 60.2%)' },
    warning: { bg: 'hsl(38 92% 50% / 0.15)', color: 'hsl(38 92% 50%)' },
    default: { bg: 'var(--secondary)', color: 'var(--muted-foreground)' },
  };

  const colors = iconColors[variant] || iconColors.default;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" showCloseButton={false}>
      <ModalHeader 
        icon={Icon} 
        iconBg={colors.bg} 
        iconColor={colors.color}
        centered
      >
        <ModalTitle style={{ marginTop: '8px' }}>{title}</ModalTitle>
        {description && <ModalDescription>{description}</ModalDescription>}
      </ModalHeader>
      
      {children && <ModalContent>{children}</ModalContent>}
      
      <ModalFooter style={{ justifyContent: 'center', paddingTop: children ? '0' : '24px' }}>
        <button
          onClick={onClose}
          disabled={loading}
          style={{
            flex: 1,
            height: '42px',
            backgroundColor: 'transparent',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            color: 'var(--foreground)',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          {cancelText}
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          style={{
            flex: 1,
            height: '42px',
            backgroundColor: variant === 'destructive' ? 'var(--destructive)' : 'var(--primary)',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            color: variant === 'destructive' ? 'var(--destructive-foreground)' : 'var(--primary-foreground)',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.15s ease',
          }}
        >
          {loading && (
            <svg 
              style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} 
              viewBox="0 0 24 24" 
              fill="none"
            >
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="32" strokeDashoffset="12" />
            </svg>
          )}
          {confirmText}
        </button>
      </ModalFooter>
    </Modal>
  );
};

export { 
  Modal, 
  ModalHeader, 
  ModalTitle, 
  ModalDescription, 
  ModalContent, 
  ModalFooter,
  ConfirmDialog,
};
