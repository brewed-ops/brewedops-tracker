import React, { useState, useRef, useEffect } from 'react';

// ============================================
// DROPDOWN MENU COMPONENT
// ============================================

const DropdownMenu = ({ 
  children, 
  trigger,
  align = 'end', // 'start' | 'center' | 'end'
  side = 'bottom', // 'top' | 'bottom'
  sideOffset = 8,
  style = {},
  ...props 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close on escape
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const alignStyles = {
    start: { left: 0 },
    center: { left: '50%', transform: 'translateX(-50%)' },
    end: { right: 0 },
  };

  const sideStyles = {
    top: { bottom: '100%', marginBottom: `${sideOffset}px` },
    bottom: { top: '100%', marginTop: `${sideOffset}px` },
  };

  return (
    <div 
      ref={dropdownRef}
      style={{ position: 'relative', display: 'inline-block', ...style }} 
      {...props}
    >
      {/* Trigger */}
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>

      {/* Menu */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            zIndex: 50,
            minWidth: '180px',
            backgroundColor: 'var(--popover)',
            border: '1px solid var(--border)',
            borderRadius: '10px',
            padding: '6px',
            boxShadow: 'var(--shadow-lg)',
            animation: 'fadeIn 0.15s ease',
            ...alignStyles[align],
            ...sideStyles[side],
          }}
        >
          {typeof children === 'function' 
            ? children({ close: () => setIsOpen(false) }) 
            : children
          }
        </div>
      )}
    </div>
  );
};

// ============================================
// DROPDOWN ITEM
// ============================================

const DropdownItem = React.forwardRef(({ 
  children, 
  icon: Icon,
  onClick,
  variant = 'default', // 'default' | 'destructive'
  disabled = false,
  style = {},
  ...props 
}, ref) => {
  const [isHovered, setIsHovered] = useState(false);

  const variantStyles = {
    default: {
      color: isHovered ? 'var(--accent-foreground)' : 'var(--foreground)',
      backgroundColor: isHovered ? 'var(--accent)' : 'transparent',
    },
    destructive: {
      color: 'hsl(0 84.2% 60.2%)',
      backgroundColor: isHovered ? 'hsl(0 84.2% 60.2% / 0.1)' : 'transparent',
    },
  };

  return (
    <button
      ref={ref}
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={disabled}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        width: '100%',
        padding: '10px 12px',
        fontSize: '14px',
        fontWeight: '400',
        border: 'none',
        borderRadius: '6px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        textAlign: 'left',
        transition: 'all 0.1s ease',
        ...variantStyles[variant],
        ...style,
      }}
      {...props}
    >
      {Icon && (
        <Icon style={{ 
          width: '16px', 
          height: '16px', 
          opacity: 0.7,
          flexShrink: 0,
        }} />
      )}
      <span style={{ flex: 1 }}>{children}</span>
    </button>
  );
});

DropdownItem.displayName = 'DropdownItem';

// ============================================
// DROPDOWN SEPARATOR
// ============================================

const DropdownSeparator = ({ style = {}, ...props }) => (
  <div
    style={{
      height: '1px',
      backgroundColor: 'var(--border)',
      margin: '6px -6px',
      ...style,
    }}
    {...props}
  />
);

// ============================================
// DROPDOWN LABEL
// ============================================

const DropdownLabel = ({ children, style = {}, ...props }) => (
  <div
    style={{
      padding: '8px 12px 4px',
      fontSize: '12px',
      fontWeight: '600',
      color: 'var(--muted-foreground)',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      ...style,
    }}
    {...props}
  >
    {children}
  </div>
);

// ============================================
// PROFILE DROPDOWN (Pre-built component)
// ============================================

const ProfileDropdown = ({
  user,
  onEditProfile,
  onFeedback,
  onLogout,
  showFeedback = true,
  style = {},
  ...props
}) => {
  const getInitial = (name) => name ? name.charAt(0).toUpperCase() : 'U';

  return (
    <DropdownMenu
      trigger={
        <button
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            backgroundColor: 'hsl(221.2 83.2% 53.3%)',
            border: 'none',
            color: 'white',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-sm)',
            transition: 'transform 0.15s ease',
          }}
        >
          {getInitial(user?.user_metadata?.nickname || user?.email)}
        </button>
      }
      align="end"
      style={style}
      {...props}
    >
      {({ close }) => (
        <>
          {/* User Info */}
          <div style={{ 
            padding: '12px', 
            borderBottom: '1px solid var(--border)',
            margin: '-6px -6px 6px',
            borderRadius: '10px 10px 0 0',
          }}>
            <p style={{ 
              fontSize: '14px', 
              fontWeight: '600', 
              color: 'var(--foreground)', 
              margin: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {user?.user_metadata?.nickname || 'User'}
            </p>
            <p style={{ 
              fontSize: '12px', 
              color: 'var(--muted-foreground)', 
              margin: '4px 0 0',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {user?.email}
            </p>
          </div>

          {/* Menu Items */}
          <DropdownItem 
            icon={() => (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            )}
            onClick={() => { close(); onEditProfile?.(); }}
          >
            Edit Profile
          </DropdownItem>

          {showFeedback && (
            <DropdownItem 
              icon={() => (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              )}
              onClick={() => { close(); onFeedback?.(); }}
            >
              Send Feedback
            </DropdownItem>
          )}

          <DropdownSeparator />

          <DropdownItem 
            variant="destructive"
            icon={() => (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            )}
            onClick={() => { close(); onLogout?.(); }}
          >
            Log out
          </DropdownItem>
        </>
      )}
    </DropdownMenu>
  );
};

// ============================================
// CATEGORY DROPDOWN (Pre-built for expense categories)
// ============================================

const CategoryDropdown = ({
  categories,
  value,
  onChange,
  placeholder = 'Select category',
  style = {},
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedCategory = categories.find(c => c.value === value);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={dropdownRef} style={{ position: 'relative', ...style }} {...props}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          height: '40px',
          padding: '0 12px',
          backgroundColor: 'transparent',
          border: '1px solid var(--input)',
          borderRadius: 'var(--radius, 8px)',
          fontSize: '14px',
          color: selectedCategory ? 'var(--foreground)' : 'var(--muted-foreground)',
          cursor: 'pointer',
          transition: 'border-color 0.2s',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {selectedCategory ? (
            <>
              <span>{selectedCategory.emoji}</span>
              <span>{selectedCategory.label}</span>
            </>
          ) : (
            placeholder
          )}
        </span>
        <svg 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
          style={{
            transition: 'transform 0.2s',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: '4px',
            backgroundColor: 'var(--popover)',
            border: '1px solid var(--border)',
            borderRadius: '10px',
            padding: '6px',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 50,
            animation: 'fadeIn 0.15s ease',
            maxHeight: '280px',
            overflowY: 'auto',
          }}
        >
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => {
                onChange(category.value);
                setIsOpen(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                width: '100%',
                padding: '10px 12px',
                backgroundColor: value === category.value ? 'var(--accent)' : 'transparent',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                color: 'var(--foreground)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background-color 0.1s',
              }}
            >
              <span style={{ fontSize: '16px' }}>{category.emoji}</span>
              <span style={{ flex: 1 }}>{category.label}</span>
              {value === category.value && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export { 
  DropdownMenu, 
  DropdownItem, 
  DropdownSeparator, 
  DropdownLabel,
  ProfileDropdown,
  CategoryDropdown,
};
