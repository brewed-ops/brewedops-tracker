import React from 'react';
import { 
  Wallet, 
  Headset, 
  CheckSquare, 
  ChevronLeft, 
  ChevronRight,
  MoreHorizontal,
  FileEdit,
  Image,
  Video,
} from 'lucide-react';

// ============================================
// BREWEDOPS BRAND CONFIGURATION
// ============================================
const BRAND = {
  brown: '#3F200C',
  blue: '#004AAC',
  green: '#51AF43',
  cream: '#FFF0D4',
  black: '#000000',
};

const FONTS = {
  heading: "'Montserrat', sans-serif",
  body: "'Poppins', sans-serif",
};

const Sidebar = ({ collapsed, setCollapsed, activeSection, setActiveSection, isDark, theme }) => {
  
  const navItems = [
    { id: 'dashboard', label: 'Finance Tracker', icon: Wallet, color: '#22c55e' },
    { id: 'vakita', label: 'VAKita', icon: Headset, color: BRAND.blue },
    { id: 'tasks', label: 'Task Manager', icon: CheckSquare, color: '#f59e0b' },
  ];

  const moreTools = [
    { id: 'pdf-editor', label: 'PDF Editor', icon: FileEdit, color: '#ef4444', comingSoon: true },
    { id: 'image-tools', label: 'Image Tools', icon: Image, color: '#8b5cf6', comingSoon: true },
    { id: 'video-compress', label: 'Video Compressor', icon: Video, color: '#ec4899', comingSoon: true },
  ];

  const sidebarBg = isDark ? '#0a0a0b' : '#ffffff';
  const borderColor = isDark ? '#27272a' : '#e4e4e7';
  const hoverBg = isDark ? '#18181b' : '#f4f4f5';
  const activeBg = isDark ? '#1f1f23' : '#f0f0f2';
  const textColor = isDark ? '#fafafa' : '#18181b';
  const mutedColor = isDark ? '#71717a' : '#a1a1aa';
  const sectionLabelColor = isDark ? '#52525b' : '#a1a1aa';

  return (
    <div
      style={{
        width: collapsed ? '70px' : '260px',
        height: '100vh',
        backgroundColor: sidebarBg,
        borderRight: `1px solid ${borderColor}`,
        position: 'fixed',
        left: 0,
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s ease',
        zIndex: 30,
        fontFamily: FONTS.body,
      }}
    >
      {/* Logo Header */}
      <div
        style={{
          padding: collapsed ? '16px 12px' : '16px 20px',
          borderBottom: `1px solid ${borderColor}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          height: '72px',
          boxSizing: 'border-box',
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
              objectFit: 'cover',
            }}
          />
          {!collapsed && (
            <div>
              <span
                style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  fontFamily: FONTS.heading,
                }}
              >
                <span style={{ color: textColor }}>Brewed</span>
                <span style={{ color: BRAND.blue }}>Ops</span>
              </span>
            </div>
          )}
        </div>

        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            style={{
              width: '28px',
              height: '28px',
              backgroundColor: 'transparent',
              border: `1px solid ${borderColor}`,
              borderRadius: '6px',
              color: mutedColor,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = hoverBg;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
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
            padding: '12px 0',
            backgroundColor: 'transparent',
            border: 'none',
            borderBottom: `1px solid ${borderColor}`,
            color: mutedColor,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ChevronRight style={{ width: '18px', height: '18px' }} />
        </button>
      )}

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
        {/* Home Section */}
        {!collapsed && (
          <p
            style={{
              fontSize: '11px',
              fontWeight: '600',
              color: sectionLabelColor,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              margin: '0 0 8px 8px',
            }}
          >
            Home
          </p>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                style={{
                  width: '100%',
                  padding: collapsed ? '12px' : '10px 12px',
                  backgroundColor: isActive ? activeBg : 'transparent',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  gap: '12px',
                  transition: 'all 0.15s',
                  position: 'relative',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = hoverBg;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
                title={collapsed ? item.label : undefined}
              >
                {/* Active indicator */}
                {isActive && (
                  <div
                    style={{
                      position: 'absolute',
                      left: '0',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '3px',
                      height: '20px',
                      backgroundColor: item.color,
                      borderRadius: '0 2px 2px 0',
                    }}
                  />
                )}

                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: isActive ? `${item.color}20` : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.15s',
                  }}
                >
                  <Icon
                    style={{
                      width: '18px',
                      height: '18px',
                      color: isActive ? item.color : mutedColor,
                    }}
                  />
                </div>

                {!collapsed && (
                  <span
                    style={{
                      fontSize: '14px',
                      fontWeight: isActive ? '600' : '500',
                      color: isActive ? textColor : mutedColor,
                    }}
                  >
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* More Tools Section */}
        <div style={{ marginTop: '24px' }}>
          {!collapsed && (
            <p
              style={{
                fontSize: '11px',
                fontWeight: '600',
                color: sectionLabelColor,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                margin: '0 0 8px 8px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <MoreHorizontal style={{ width: '12px', height: '12px' }} />
              More Tools
            </p>
          )}

          {collapsed && (
            <div
              style={{
                width: '100%',
                height: '1px',
                backgroundColor: borderColor,
                margin: '8px 0',
              }}
            />
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {moreTools.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  disabled={item.comingSoon}
                  style={{
                    width: '100%',
                    padding: collapsed ? '12px' : '10px 12px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: item.comingSoon ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    gap: '12px',
                    transition: 'all 0.15s',
                    opacity: item.comingSoon ? 0.5 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (!item.comingSoon) {
                      e.currentTarget.style.backgroundColor = hoverBg;
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                  title={collapsed ? `${item.label}${item.comingSoon ? ' (Coming Soon)' : ''}` : undefined}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      backgroundColor: 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon
                      style={{
                        width: '18px',
                        height: '18px',
                        color: mutedColor,
                      }}
                    />
                  </div>

                  {!collapsed && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                      <span
                        style={{
                          fontSize: '14px',
                          fontWeight: '500',
                          color: mutedColor,
                        }}
                      >
                        {item.label}
                      </span>
                      {item.comingSoon && (
                        <span
                          style={{
                            fontSize: '9px',
                            fontWeight: '600',
                            color: isDark ? '#a1a1aa' : '#71717a',
                            backgroundColor: isDark ? '#27272a' : '#e4e4e7',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            textTransform: 'uppercase',
                          }}
                        >
                          Soon
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div
        style={{
          padding: collapsed ? '12px' : '16px 20px',
          borderTop: `1px solid ${borderColor}`,
        }}
      >
        {!collapsed ? (
          <p
            style={{
              fontSize: '11px',
              color: mutedColor,
              margin: 0,
              textAlign: 'center',
            }}
          >
            © 2025 BrewedOps
          </p>
        ) : (
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#22c55e',
              margin: '0 auto',
            }}
            title="BrewedOps"
          />
        )}
      </div>
    </div>
  );
};

export default Sidebar;
