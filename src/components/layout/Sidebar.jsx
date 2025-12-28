import React from 'react';
import { Receipt, Calculator, PanelLeftClose, PanelLeft } from 'lucide-react';

const Sidebar = ({ 
  collapsed, 
  setCollapsed, 
  activeSection, 
  setActiveSection, 
  isDark, 
  theme 
}) => {
  const sidebarWidth = collapsed ? 70 : 260;
  
  return (
    <div style={{
      position: 'fixed',
      left: 0,
      top: 0,
      bottom: 0,
      width: `${sidebarWidth}px`,
      backgroundColor: isDark ? '#09090b' : '#ffffff',
      borderRight: `1px solid ${theme.cardBorder}`,
      display: 'flex',
      flexDirection: 'column',
      transition: 'width 0.3s ease',
      zIndex: 40,
    }}>
      {/* Header with Logo */}
      <div style={{
        height: '72px',
        padding: collapsed ? '0 12px' : '0 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'flex-start',
        borderBottom: `1px solid ${theme.cardBorder}`,
        flexShrink: 0,
        gap: '12px',
      }}>
        <img 
          src="https://i.imgur.com/R52jwPv.png" 
          alt="Logo" 
          style={{ 
            width: '40px', 
            height: '40px', 
            borderRadius: '50%', 
            flexShrink: 0 
          }} 
        />
        {!collapsed && (
          <span style={{ 
            fontSize: '17px', 
            fontWeight: '700', 
            color: theme.text, 
            whiteSpace: 'nowrap',
          }}>
            BrewedOps
          </span>
        )}
      </div>

      {/* Navigation */}
      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        padding: collapsed ? '16px 8px' : '16px 12px',
      }}>
        {/* Finance Tracker */}
        <button
          onClick={() => setActiveSection('tracker')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: collapsed ? '12px' : '12px 14px',
            justifyContent: collapsed ? 'center' : 'flex-start',
            backgroundColor: activeSection === 'tracker' ? '#22c55e' : 'transparent',
            color: activeSection === 'tracker' ? '#fff' : theme.textMuted,
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            width: '100%',
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '8px',
            transition: 'all 0.15s ease',
          }}
          title={collapsed ? 'Finance Tracker' : undefined}
        >
          <Receipt style={{ width: '20px', height: '20px', flexShrink: 0 }} />
          {!collapsed && <span>Finance Tracker</span>}
        </button>

        {/* VAKita */}
        <button
          onClick={() => setActiveSection('vakita')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: collapsed ? '12px' : '12px 14px',
            justifyContent: collapsed ? 'center' : 'flex-start',
            backgroundColor: activeSection === 'vakita' ? '#8b5cf6' : 'transparent',
            color: activeSection === 'vakita' ? '#fff' : theme.textMuted,
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            width: '100%',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.15s ease',
          }}
          title={collapsed ? 'VAKita' : undefined}
        >
          <Calculator style={{ width: '20px', height: '20px', flexShrink: 0 }} />
          {!collapsed && <span>VAKita</span>}
        </button>
      </div>

      {/* Toggle Button - Always at bottom */}
      <div style={{
        padding: collapsed ? '12px 8px' : '12px 16px',
        borderTop: `1px solid ${theme.cardBorder}`,
        flexShrink: 0,
      }}>
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            width: collapsed ? '100%' : '40px',
            height: '40px',
            borderRadius: '8px',
            backgroundColor: isDark ? '#27272a' : '#f4f4f5',
            border: 'none',
            color: theme.textMuted,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 0.15s ease',
          }}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <PanelLeft style={{ width: '20px', height: '20px' }} />
          ) : (
            <PanelLeftClose style={{ width: '20px', height: '20px' }} />
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
