// Sidebar.jsx - BrewedOps Sidebar Navigation
import React from 'react';
import { LayoutDashboard, Headphones, Menu, ChevronLeft } from 'lucide-react';

// ============================================
// BREWEDOPS BRAND CONFIGURATION
// ============================================
const BRAND = {
  brown: '#3F200C',
  blue: '#004AAC',
  green: '#51AF43',
  cream: '#FFF0D4',
};

const FONTS = {
  heading: "'Montserrat', sans-serif",
  body: "'Poppins', sans-serif",
};

const Sidebar = ({ 
  collapsed, 
  setCollapsed, 
  activeSection, 
  setActiveSection, 
  isDark 
}) => {
  const theme = {
    bg: isDark ? '#0a0a0a' : '#ffffff',
    cardBg: isDark ? '#141414' : '#ffffff',
    cardBorder: isDark ? '#262626' : '#e4e4e7',
    text: isDark ? '#fafafa' : BRAND.brown,
    textMuted: isDark ? '#a1a1aa' : '#71717a',
  };

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Finance Tracker' },
    { id: 'vakita', icon: Headphones, label: 'VAKita' },
  ];

  return (
    <div
      style={{
        width: collapsed ? '70px' : '260px',
        height: '100vh',
        backgroundColor: isDark ? '#0a0a0a' : '#ffffff',
        borderRight: `1px solid ${theme.cardBorder}`,
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.2s ease',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 40,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: collapsed ? '16px 12px' : '16px 20px',
          borderBottom: `1px solid ${theme.cardBorder}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          minHeight: '64px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img
            src="https://i.imgur.com/R52jwPv.png"
            alt="BrewedOps Logo"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              flexShrink: 0,
            }}
          />
          {!collapsed && (
            <span
              style={{
                fontSize: '18px',
                fontWeight: '700',
                fontFamily: FONTS.heading,
                letterSpacing: '-0.02em',
              }}
            >
              <span style={{ color: isDark ? '#ffffff' : BRAND.brown }}>Brewed</span>
              <span style={{ color: BRAND.blue }}>Ops</span>
            </span>
          )}
        </div>
        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            style={{
              width: '32px',
              height: '32px',
              backgroundColor: 'transparent',
              border: `1px solid ${theme.cardBorder}`,
              borderRadius: '8px',
              color: theme.textMuted,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ChevronLeft style={{ width: '16px', height: '16px' }} />
          </button>
        )}
      </div>

      {/* Collapsed expand button */}
      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: 'transparent',
            border: 'none',
            color: theme.textMuted,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Menu style={{ width: '20px', height: '20px' }} />
        </button>
      )}

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '12px 8px' }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              style={{
                width: '100%',
                padding: collapsed ? '12px' : '12px 16px',
                backgroundColor: isActive ? BRAND.blue : 'transparent',
                border: 'none',
                borderRadius: '10px',
                color: isActive ? '#ffffff' : theme.textMuted,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: collapsed ? 'center' : 'flex-start',
                gap: '12px',
                marginBottom: '4px',
                transition: 'all 0.15s ease',
                fontFamily: FONTS.body,
                fontSize: '14px',
                fontWeight: isActive ? '600' : '500',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = isDark ? '#1a1a1a' : '#f4f4f5';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <Icon style={{ width: '20px', height: '20px', flexShrink: 0 }} />
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div
          style={{
            padding: '16px 20px',
            borderTop: `1px solid ${theme.cardBorder}`,
            fontSize: '11px',
            color: theme.textMuted,
            fontFamily: FONTS.body,
          }}
        >
          © 2025 BrewedOps
        </div>
      )}
    </div>
  );
};

export default Sidebar;
