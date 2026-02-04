import React from 'react';
import { Wallet, CreditCard } from '@phosphor-icons/react';

const TabNavigation = ({
  activeTab,
  setActiveTab,
  dashboardSubTab,
  setDashboardSubTab,
  entries,
  theme,
  isDark,
  isSmall,
}) => {
  const tabStyle = (active) => ({
    padding: isSmall ? '12px 14px' : '14px 18px',
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: active ? `2px solid ${isDark ? '#fafafa' : '#18181b'}` : '2px solid transparent',
    fontSize: isSmall ? '13px' : '15px',
    fontWeight: '500',
    color: active ? theme.text : theme.textMuted,
    cursor: 'pointer',
    transition: 'color 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    whiteSpace: 'nowrap'
  });

  const subTabStyle = (active) => ({
    padding: isSmall ? '8px 12px' : '8px 16px',
    fontSize: '13px',
    backgroundColor: active ? theme.toggleActive : 'transparent',
    border: 'none',
    borderRadius: '6px',
    fontWeight: '500',
    color: active ? theme.text : theme.textSubtle,
    cursor: 'pointer',
    boxShadow: active && !isDark ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
    transition: 'all 0.15s'
  });

  const badgeStyle = (active, color = null) => ({
    backgroundColor: active 
      ? (color || (isDark ? '#3b82f6' : '#2563eb'))
      : (isDark ? '#3f3f46' : '#e4e4e7'),
    color: active ? '#fff' : theme.textMuted,
    fontSize: '11px',
    fontWeight: '600',
    padding: '2px 7px',
    borderRadius: '10px',
    minWidth: '18px',
    textAlign: 'center'
  });

  const recurringCount = entries.filter(e => e.recurring).length;

  return (
    <>
      {/* Main Tab Navigation */}
      <div style={{
        backgroundColor: isDark ? '#0a0a0b' : '#ffffff',
        borderBottom: `1px solid ${theme.cardBorder}`,
        padding: isSmall ? '0 12px' : '0 24px'
      }}>
        <div style={{ maxWidth: '1600px', margin: '0 auto', display: 'flex', gap: '4px', padding: '0 16px', overflowX: 'auto' }}>
          <button
            onClick={() => setActiveTab('dashboard')}
            style={tabStyle(activeTab === 'dashboard')}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('wallets')}
            style={tabStyle(activeTab === 'wallets')}
          >
            <Wallet style={{ width: '16px', height: '16px' }} />
            {!isSmall && 'Multi-Wallet'}
            {isSmall && 'Wallets'}
          </button>
          <button
            onClick={() => setActiveTab('entries')}
            style={tabStyle(activeTab === 'entries')}
          >
            All Entries
            {entries.length > 0 && (
              <span style={badgeStyle(activeTab === 'entries')}>
                {entries.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Dashboard Sub-tabs */}
      {activeTab === 'dashboard' && (
        <div style={{
          backgroundColor: isDark ? '#0a0a0b' : '#ffffff',
          borderBottom: `1px solid ${theme.cardBorder}`,
          padding: isSmall ? '8px 12px' : '12px 24px'
        }}>
          <div style={{ 
            maxWidth: '1600px', 
            margin: '0 auto', 
            display: 'flex', 
            gap: '8px', 
            padding: '0 16px',
            overflowX: 'auto'
          }}>
            <div style={{
              display: 'flex',
              gap: '4px',
              padding: '4px',
              backgroundColor: theme.statBg,
              borderRadius: '8px'
            }}>
              <button
                onClick={() => setDashboardSubTab('add-entry')}
                style={subTabStyle(dashboardSubTab === 'add-entry')}
              >
                Add Entry
              </button>
              <button
                onClick={() => setDashboardSubTab('analytics')}
                style={subTabStyle(dashboardSubTab === 'analytics')}
              >
                Analytics
              </button>
              <button
                onClick={() => setDashboardSubTab('bills')}
                style={{
                  ...subTabStyle(dashboardSubTab === 'bills'),
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <CreditCard style={{ width: '14px', height: '14px' }} />
                Bills
                {recurringCount > 0 && (
                  <span style={badgeStyle(dashboardSubTab === 'bills', isDark ? '#8b5cf6' : '#7c3aed')}>
                    {recurringCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TabNavigation;
