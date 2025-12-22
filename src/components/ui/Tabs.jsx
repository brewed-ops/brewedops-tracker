import React, { useState, createContext, useContext } from 'react';

// ============================================
// TABS CONTEXT
// ============================================

const TabsContext = createContext(null);

const useTabs = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs components must be used within a Tabs provider');
  }
  return context;
};

// ============================================
// TABS COMPONENT
// ============================================

const Tabs = ({ 
  children, 
  defaultValue, 
  value: controlledValue,
  onValueChange,
  style = {},
  ...props 
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue);
  
  const value = controlledValue !== undefined ? controlledValue : internalValue;
  
  const handleValueChange = (newValue) => {
    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }
    onValueChange?.(newValue);
  };

  return (
    <TabsContext.Provider value={{ value, onValueChange: handleValueChange }}>
      <div style={style} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

// ============================================
// TABS LIST (Container for triggers)
// ============================================

const TabsList = React.forwardRef(({ 
  children, 
  style = {},
  ...props 
}, ref) => (
  <div
    ref={ref}
    role="tablist"
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '4px',
      padding: '4px',
      backgroundColor: 'var(--muted)',
      borderRadius: '10px',
      ...style,
    }}
    {...props}
  >
    {children}
  </div>
));

TabsList.displayName = 'TabsList';

// ============================================
// TAB TRIGGER (Individual tab button)
// ============================================

const TabsTrigger = React.forwardRef(({ 
  children, 
  value,
  disabled = false,
  icon: Icon,
  badge,
  style = {},
  ...props 
}, ref) => {
  const { value: selectedValue, onValueChange } = useTabs();
  const isSelected = selectedValue === value;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      ref={ref}
      role="tab"
      aria-selected={isSelected}
      disabled={disabled}
      onClick={() => onValueChange(value)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: '8px 16px',
        fontSize: '14px',
        fontWeight: '500',
        borderRadius: '8px',
        border: 'none',
        outline: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        backgroundColor: isSelected 
          ? 'var(--background)' 
          : isHovered 
            ? 'var(--accent)' 
            : 'transparent',
        color: isSelected ? 'var(--foreground)' : 'var(--muted-foreground)',
        boxShadow: isSelected ? 'var(--shadow-sm)' : 'none',
        transition: 'all 0.15s ease',
        whiteSpace: 'nowrap',
        ...style,
      }}
      {...props}
    >
      {Icon && <Icon style={{ width: '16px', height: '16px' }} />}
      {children}
      {badge !== undefined && (
        <span style={{
          backgroundColor: isSelected ? 'var(--primary)' : 'var(--secondary)',
          color: isSelected ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
          fontSize: '11px',
          fontWeight: '600',
          padding: '2px 8px',
          borderRadius: '9999px',
          minWidth: '20px',
          textAlign: 'center',
        }}>
          {badge}
        </span>
      )}
    </button>
  );
});

TabsTrigger.displayName = 'TabsTrigger';

// ============================================
// TAB CONTENT (Content panel)
// ============================================

const TabsContent = React.forwardRef(({ 
  children, 
  value,
  style = {},
  ...props 
}, ref) => {
  const { value: selectedValue } = useTabs();
  
  if (selectedValue !== value) {
    return null;
  }

  return (
    <div
      ref={ref}
      role="tabpanel"
      style={{
        marginTop: '16px',
        animation: 'fadeIn 0.2s ease',
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
});

TabsContent.displayName = 'TabsContent';

// ============================================
// NAVIGATION TABS (Underline style - like the app header)
// ============================================

const NavTabs = ({ 
  tabs, // [{ value, label, icon, badge, disabled }]
  value,
  onValueChange,
  style = {},
  ...props 
}) => {
  return (
    <div
      style={{
        display: 'flex',
        gap: '4px',
        borderBottom: '1px solid var(--border)',
        ...style,
      }}
      {...props}
    >
      {tabs.map((tab) => {
        const isSelected = value === tab.value;
        const Icon = tab.icon;
        
        return (
          <button
            key={tab.value}
            onClick={() => !tab.disabled && onValueChange(tab.value)}
            disabled={tab.disabled}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 18px',
              fontSize: '14px',
              fontWeight: '500',
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: isSelected 
                ? '2px solid var(--foreground)' 
                : '2px solid transparent',
              color: isSelected ? 'var(--foreground)' : 'var(--muted-foreground)',
              cursor: tab.disabled ? 'not-allowed' : 'pointer',
              opacity: tab.disabled ? 0.5 : 1,
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap',
              marginBottom: '-1px',
            }}
          >
            {Icon && <Icon style={{ width: '16px', height: '16px' }} />}
            {tab.label}
            {tab.badge !== undefined && tab.badge > 0 && (
              <span style={{
                backgroundColor: isSelected ? 'var(--primary)' : 'var(--muted)',
                color: isSelected ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
                fontSize: '11px',
                fontWeight: '600',
                padding: '2px 8px',
                borderRadius: '9999px',
                minWidth: '20px',
                textAlign: 'center',
              }}>
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

// ============================================
// PILL TABS (Toggle group style)
// ============================================

const PillTabs = ({ 
  options, // [{ value, label }]
  value,
  onValueChange,
  size = 'default',
  style = {},
  ...props 
}) => {
  const sizeStyles = {
    sm: { padding: '4px 10px', fontSize: '12px' },
    default: { padding: '6px 14px', fontSize: '13px' },
    lg: { padding: '8px 18px', fontSize: '14px' },
  };

  return (
    <div
      style={{
        display: 'inline-flex',
        gap: '4px',
        padding: '4px',
        backgroundColor: 'var(--muted)',
        borderRadius: '8px',
        ...style,
      }}
      {...props}
    >
      {options.map((option) => {
        const isSelected = value === option.value;
        
        return (
          <button
            key={option.value}
            onClick={() => onValueChange(option.value)}
            style={{
              ...sizeStyles[size],
              fontWeight: '500',
              backgroundColor: isSelected ? 'var(--background)' : 'transparent',
              color: isSelected ? 'var(--foreground)' : 'var(--muted-foreground)',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              boxShadow: isSelected ? 'var(--shadow-sm)' : 'none',
            }}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};

export { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent,
  NavTabs,
  PillTabs,
};
