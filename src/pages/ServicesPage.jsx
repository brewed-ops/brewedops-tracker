/**
 * ServicesPage Component
 * Path: /services
 * Under-construction services page — clean, branded, highlights offerings.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Headphones,
  Mail,
  Phone,
  MessageCircle,
  Ticket,
  ClipboardList,
  Calendar,
  Inbox,
  UserCheck,
  Zap,
  Settings,
  Database,
  Sun,
  Moon,
  ChevronLeft,
  ChevronDown,
  Construction,
  Menu,
  Bell,
  Image,
  Scissors,
  Move,
  Minimize2,
  RefreshCw,
  Palette,
  FileImage,
  Film,
  FileEdit,
  Merge,
  Split,
  BookOpen,
  QrCode,
  Search,
  Type,
  Hash,
  GitBranch,
  Braces,
  Clock,
  Lock,
  DollarSign,
  StickyNote,
  CheckSquare,
  Globe,
  Timer,
} from 'lucide-react';
import SEO from '@/components/SEO';
const MobileDrawer = React.lazy(() => import('@/components/layout/MobileDrawer'));

// ============================================
// BRAND CONFIG
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

const getTheme = (isDark) => ({
  bg: isDark ? '#0d0b09' : '#faf8f5',
  cardBg: isDark ? '#171411' : '#ffffff',
  cardBorder: isDark ? '#2a2420' : '#e8e0d4',
  text: isDark ? '#f5f0eb' : '#3F200C',
  textMuted: isDark ? '#a09585' : '#7a6652',
});

// ============================================
// TOOLS DATA
// ============================================
const TOOL_CATEGORIES = [
  {
    name: 'Image Tools',
    tools: [
      { icon: Image, title: 'BG Remover', path: '/bgremover' },
      { icon: Scissors, title: 'Image Cropper', path: '/imagecropper' },
      { icon: Move, title: 'Image Resizer', path: '/imageresizer' },
      { icon: Minimize2, title: 'Image Compressor', path: '/imagecompressor' },
      { icon: RefreshCw, title: 'Image Converter', path: '/imageconverter' },
      { icon: Palette, title: 'Color Picker', path: '/colorpicker' },
      { icon: FileImage, title: 'Image to PDF', path: '/imagetopdf' },
    ],
  },
  {
    name: 'Video Tools',
    tools: [
      { icon: Film, title: 'Video Compressor', path: '/videocompressor' },
      { icon: Scissors, title: 'Video Trimmer', path: '/videotrimmer' },
    ],
  },
  {
    name: 'Document Tools',
    tools: [
      { icon: FileEdit, title: 'PDF Editor', path: '/pdfeditor' },
      { icon: Merge, title: 'PDF Merge', path: '/pdfmerge' },
      { icon: Split, title: 'PDF Split', path: '/pdfsplit' },
      { icon: BookOpen, title: 'Markdown Viewer', path: '/markdownviewer' },
    ],
  },
  {
    name: 'Other Tools',
    tools: [
      { icon: QrCode, title: 'QR Generator', path: '/qrgenerator' },
      { icon: Search, title: 'Find & Replace', path: '/findreplace' },
      { icon: Type, title: 'Case Converter', path: '/caseconverter' },
      { icon: Hash, title: 'Word Counter', path: '/wordcounter' },
      { icon: GitBranch, title: 'Mermaid Reader', path: '/mermaid' },
      { icon: Braces, title: 'JSON Formatter', path: '/jsonformatter' },
      { icon: Clock, title: 'Cron Generator', path: '/crongenerator' },
    ],
  },
];

const PRODUCTIVITY_TOOLS = [
  { icon: DollarSign, title: 'Finance Tracker', path: '/finance' },
  { icon: Headphones, title: 'VA Kita', path: '/vakita' },
  { icon: CheckSquare, title: 'Task Manager', path: '/taskmanager' },
  { icon: StickyNote, title: 'Brewed Notes', path: '/brewednotes' },
];

// ============================================
// TOOLS DROPDOWN COMPONENT
// ============================================
const ToolsDropdown = ({ isDark, theme, onToolClick, onLoginClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = React.useRef(null);
  const timeoutRef = React.useRef(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 150);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      ref={dropdownRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ position: 'relative' }}
    >
      <button
        style={{
          height: '40px',
          padding: '0 8px',
          backgroundColor: 'transparent',
          color: isOpen ? BRAND.blue : theme.textMuted,
          border: 'none',
          fontSize: '14px',
          fontWeight: '500',
          fontFamily: FONTS.body,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}
      >
        Tools
        <ChevronDown size={14} style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: '0',
            marginTop: '4px',
            backgroundColor: isDark ? '#111113' : '#ffffff',
            border: `1px solid ${isDark ? '#2a2420' : '#e8e0d4'}`,
            borderRadius: '12px',
            boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.5)' : '0 8px 32px rgba(0,0,0,0.1)',
            padding: '12px',
            zIndex: 1000,
          }}
        >
          <div style={{ display: 'flex', gap: '20px' }}>
            {TOOL_CATEGORIES.map((category) => (
              <div key={category.name} style={{ minWidth: '130px' }}>
                <div style={{ fontSize: '10px', fontWeight: '600', color: theme.textMuted, letterSpacing: '0.5px', marginBottom: '6px', textTransform: 'uppercase', fontFamily: FONTS.body }}>
                  {category.name}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                  {category.tools.map((tool) => {
                    const IconComponent = tool.icon;
                    return (
                      <button
                        key={tool.path}
                        onClick={() => { setIsOpen(false); onToolClick(tool.path); }}
                        style={{ padding: '5px 8px', backgroundColor: 'transparent', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', textAlign: 'left' }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = BRAND.blue; e.currentTarget.querySelector('svg').style.color = '#fff'; e.currentTarget.querySelector('span').style.color = '#fff'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.querySelector('svg').style.color = theme.textMuted; e.currentTarget.querySelector('span').style.color = theme.text; }}
                      >
                        <IconComponent size={13} style={{ color: theme.textMuted, flexShrink: 0 }} />
                        <span style={{ fontSize: '12px', fontWeight: '500', color: theme.text, fontFamily: FONTS.body, whiteSpace: 'nowrap' }}>{tool.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: `1px solid ${theme.cardBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', fontWeight: '600', color: BRAND.blue, fontFamily: FONTS.body }}>
                <Lock size={10} />
                PRODUCTIVITY
              </div>
              {PRODUCTIVITY_TOOLS.map((tool) => {
                const IconComponent = tool.icon;
                return (
                  <div key={tool.path} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: theme.textMuted, fontFamily: FONTS.body }}>
                    <IconComponent size={11} />
                    {tool.title}
                  </div>
                );
              })}
            </div>
            <button onClick={() => { setIsOpen(false); onLoginClick(); }} style={{ fontSize: '11px', color: BRAND.blue, backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontWeight: '600', fontFamily: FONTS.body }}>
              Sign in →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================
// SERVICES DATA
// ============================================
const SERVICES = [
  {
    title: 'Customer Support',
    description: 'Professional customer service solutions to keep your clients happy and your business running smoothly.',
    icon: Headphones,
    color: BRAND.blue,
    colorLight: '#004AAC15',
    colorDark: '#004AAC30',
    items: [
      { icon: Mail, label: 'Email Support' },
      { icon: Phone, label: 'Phone Support' },
      { icon: MessageCircle, label: 'Live Chat' },
      { icon: Ticket, label: 'Ticket Management' },
    ],
  },
  {
    title: 'Admin VA',
    description: 'Dedicated virtual assistant services to handle your day-to-day operations so you can focus on growth.',
    icon: ClipboardList,
    color: BRAND.green,
    colorLight: '#51AF4315',
    colorDark: '#51AF4330',
    items: [
      { icon: Inbox, label: 'Inbox Management' },
      { icon: Calendar, label: 'Calendar Management' },
      { icon: UserCheck, label: 'Admin Tasks' },
      { icon: ClipboardList, label: 'Data Entry & Reports' },
    ],
  },
  {
    title: 'HighLevel (GHL) Automation',
    description: 'End-to-end GoHighLevel CRM setup, automation workflows, and funnel builds tailored to your business.',
    icon: Zap,
    color: '#f59e0b',
    colorLight: '#f59e0b15',
    colorDark: '#f59e0b30',
    items: [
      { icon: Settings, label: 'CRM Build & Setup' },
      { icon: Zap, label: 'Workflow Automation' },
      { icon: Database, label: 'Pipeline Management' },
      { icon: Bell, label: 'Smart Notifications' },
    ],
  },
];

// ============================================
// SERVICES PAGE
// ============================================
const ServicesPage = ({ isDark, setIsDark, onNavigate }) => {
  const navigate = useNavigate();
  const [width, setWidth] = useState(window.innerWidth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isSmall = width < 640;
  const isDesktop = width >= 1024;
  const theme = getTheme(isDark);

  const navLinkStyle = {
    height: '40px',
    padding: '0 12px',
    backgroundColor: 'transparent',
    color: theme.textMuted,
    border: 'none',
    fontSize: '14px',
    fontWeight: '500',
    fontFamily: FONTS.body,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: theme.bg }}>
      <SEO
        title="Services | BrewedOps"
        description="Customer Support, Admin VA, and HighLevel CRM Automation services from BrewedOps. Professional solutions for growing businesses."
        keywords="BrewedOps services, customer support, admin VA, virtual assistant, GoHighLevel, GHL automation, CRM build"
      />

      {/* NAV */}
      <nav style={{
        padding: isSmall ? '12px 16px' : '12px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid ' + theme.cardBorder,
        backgroundColor: theme.bg,
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <button onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginRight: '20px', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            <img src="https://i.imgur.com/R52jwPvt.png" alt="Logo" width={32} height={32} style={{ width: '32px', height: '32px', borderRadius: '8px' }} />
            <span style={{ fontSize: '18px', fontWeight: '700', fontFamily: FONTS.heading }}>
              <span style={{ color: isDark ? '#fff' : BRAND.brown }}>Brewed</span>
              <span style={{ color: BRAND.blue }}>Ops</span>
            </span>
          </button>
          {isDesktop && (
            <>
              <button onClick={() => navigate('/')} style={navLinkStyle}>Home</button>
              <button onClick={() => navigate('/portfolio')} style={navLinkStyle}>Portfolio</button>
              <button onClick={() => navigate('/services')} style={{ ...navLinkStyle, color: BRAND.blue, fontWeight: '600' }}>Services</button>
              <ToolsDropdown isDark={isDark} theme={theme} onToolClick={(path) => navigate(path)} onLoginClick={() => navigate('/login')} />
              <button onClick={() => navigate('/fuelyx')} style={{ ...navLinkStyle, color: '#14b8a6', fontWeight: '600' }}>Fuelyx</button>
            </>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {isDesktop && (
            <>
              <a href="/about" style={navLinkStyle}>About</a>
              <a href="/privacy" style={navLinkStyle}>Privacy</a>
            </>
          )}
          <button onClick={() => setIsDark(!isDark)} aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'} style={{ width: '36px', height: '36px', backgroundColor: 'transparent', border: '1px solid ' + theme.cardBorder, borderRadius: '8px', color: theme.textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '8px' }}>
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          {isDesktop ? (
            <>
              <button onClick={() => navigate('/login')} style={{ height: '36px', padding: '0 14px', backgroundColor: 'transparent', color: theme.text, border: '1px solid ' + theme.cardBorder, borderRadius: '8px', fontSize: '13px', fontWeight: '500', fontFamily: FONTS.body, cursor: 'pointer', marginLeft: '4px' }}>
                Login
              </button>
              <button onClick={() => navigate('/signup')} style={{ height: '36px', padding: '0 14px', backgroundColor: BRAND.blue, color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', fontFamily: FONTS.body, cursor: 'pointer' }}>
                Sign Up
              </button>
            </>
          ) : (
            <button onClick={() => setMobileMenuOpen(true)} aria-label="Open navigation menu" style={{ width: '36px', height: '36px', backgroundColor: 'transparent', border: '1px solid ' + theme.cardBorder, borderRadius: '8px', color: theme.textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '4px' }}>
              <Menu size={18} />
            </button>
          )}
        </div>
      </nav>

      <main id="main-content">
        {/* HERO */}
        <section style={{
          padding: isSmall ? '48px 20px 32px' : '72px 32px 48px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Subtle background pattern */}
          <div style={{
            position: 'absolute',
            inset: 0,
            opacity: isDark ? 0.03 : 0.04,
            backgroundImage: `radial-gradient(${BRAND.blue} 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
            pointerEvents: 'none',
          }} />

          <div style={{ position: 'relative', maxWidth: '700px', margin: '0 auto' }}>
            {/* Under Construction Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 18px',
              backgroundColor: isDark ? '#f59e0b20' : '#f59e0b12',
              border: '1px solid ' + (isDark ? '#f59e0b40' : '#f59e0b30'),
              borderRadius: '100px',
              marginBottom: '28px',
            }}>
              <Construction size={14} style={{ color: '#f59e0b' }} />
              <span style={{
                fontSize: '12px',
                fontWeight: '700',
                color: '#f59e0b',
                fontFamily: FONTS.body,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}>
                Under Construction
              </span>
            </div>

            <h1 style={{
              fontSize: isSmall ? '32px' : '48px',
              fontWeight: '800',
              color: isDark ? '#ffffff' : BRAND.brown,
              lineHeight: '1.15',
              letterSpacing: '-0.03em',
              fontFamily: FONTS.heading,
              margin: '0 0 16px',
            }}>
              Our <span style={{ color: BRAND.blue }}>Services</span>
            </h1>
            <p style={{
              fontSize: isSmall ? '15px' : '17px',
              color: theme.textMuted,
              lineHeight: '1.7',
              fontFamily: FONTS.body,
              margin: '0 auto 8px',
              maxWidth: '560px',
            }}>
              We're putting the finishing touches on our services page. Here's a preview of what we offer to help businesses grow.
            </p>
          </div>
        </section>

        {/* SERVICE CARDS */}
        <section style={{
          padding: isSmall ? '0 16px 48px' : '0 32px 72px',
          maxWidth: '1100px',
          margin: '0 auto',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isSmall ? '1fr' : (width < 1024 ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)'),
            gap: isSmall ? '16px' : '20px',
          }}>
            {SERVICES.map((service) => {
              const IconMain = service.icon;
              return (
                <div
                  key={service.title}
                  style={{
                    backgroundColor: theme.cardBg,
                    border: '1px solid ' + theme.cardBorder,
                    borderRadius: '16px',
                    padding: isSmall ? '24px' : '28px',
                    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = service.color + '50';
                    e.currentTarget.style.boxShadow = `0 8px 32px ${service.color}12`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = theme.cardBorder;
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {/* Icon */}
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    backgroundColor: isDark ? service.colorDark : service.colorLight,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px',
                  }}>
                    <IconMain size={22} style={{ color: service.color }} />
                  </div>

                  {/* Title */}
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: theme.text,
                    margin: '0 0 8px',
                    fontFamily: FONTS.heading,
                  }}>
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p style={{
                    fontSize: '14px',
                    color: theme.textMuted,
                    lineHeight: '1.6',
                    margin: '0 0 20px',
                    fontFamily: FONTS.body,
                  }}>
                    {service.description}
                  </p>

                  {/* Sub-items */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {service.items.map((item) => {
                      const ItemIcon = item.icon;
                      return (
                        <div
                          key={item.label}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '10px 14px',
                            backgroundColor: isDark ? '#1e1a16' : '#faf8f5',
                            borderRadius: '10px',
                            border: '1px solid ' + (isDark ? '#2a2420' : '#f0e8dc'),
                          }}
                        >
                          <ItemIcon size={15} style={{ color: service.color, flexShrink: 0 }} />
                          <span style={{
                            fontSize: '13px',
                            fontWeight: '500',
                            color: theme.text,
                            fontFamily: FONTS.body,
                          }}>
                            {item.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Coming Soon Tag */}
                  <div style={{
                    marginTop: '20px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 14px',
                    backgroundColor: isDark ? '#f59e0b15' : '#f59e0b08',
                    border: '1px solid ' + (isDark ? '#f59e0b30' : '#f59e0b20'),
                    borderRadius: '100px',
                  }}>
                    <div style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: '#f59e0b',
                      animation: 'pulse 2s ease-in-out infinite',
                    }} />
                    <span style={{
                      fontSize: '11px',
                      fontWeight: '600',
                      color: isDark ? '#fbbf24' : '#b45309',
                      fontFamily: FONTS.body,
                      letterSpacing: '0.03em',
                    }}>
                      Coming Soon
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA BANNER */}
        <section style={{
          padding: isSmall ? '40px 20px' : '56px 32px',
          backgroundColor: isDark ? '#100e0b' : BRAND.cream,
          borderTop: '1px solid ' + theme.cardBorder,
          borderBottom: '1px solid ' + theme.cardBorder,
        }}>
          <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
            <h3 style={{
              fontSize: isSmall ? '22px' : '28px',
              fontWeight: '700',
              color: isDark ? '#ffffff' : BRAND.brown,
              margin: '0 0 12px',
              fontFamily: FONTS.heading,
            }}>
              Interested in Our Services?
            </h3>
            <p style={{
              fontSize: '15px',
              color: theme.textMuted,
              margin: '0 0 28px',
              lineHeight: '1.7',
              fontFamily: FONTS.body,
            }}>
              We're still setting things up, but you can reach out now. We'd love to hear about your business needs.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <a
                href="mailto:hello@brewedops.com"
                style={{
                  height: '44px',
                  padding: '0 24px',
                  backgroundColor: BRAND.blue,
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '600',
                  fontFamily: FONTS.body,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  textDecoration: 'none',
                  boxShadow: '0 2px 8px rgba(0,74,172,0.2)',
                  transition: 'all 0.15s ease',
                }}
              >
                <Mail size={16} />
                Get in Touch
              </a>
              <button
                onClick={() => navigate('/')}
                style={{
                  height: '44px',
                  padding: '0 24px',
                  backgroundColor: 'transparent',
                  color: theme.text,
                  border: '1px solid ' + theme.cardBorder,
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '500',
                  fontFamily: FONTS.body,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.15s ease',
                }}
              >
                <ChevronLeft size={16} />
                Back to Home
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer style={{ padding: '24px 32px', borderTop: '1px solid ' + theme.cardBorder, textAlign: 'center', backgroundColor: theme.bg }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginBottom: '12px', flexWrap: 'wrap' }}>
          <a href="/privacy" style={{ fontSize: '13px', color: theme.textMuted, textDecoration: 'none', fontFamily: FONTS.body }}>Privacy Policy</a>
          <a href="/terms" style={{ fontSize: '13px', color: theme.textMuted, textDecoration: 'none', fontFamily: FONTS.body }}>Terms of Service</a>
          <a href="/about" style={{ fontSize: '13px', color: theme.textMuted, textDecoration: 'none', fontFamily: FONTS.body }}>About Us</a>
        </div>
        <p style={{ fontSize: '12px', color: theme.textMuted, margin: 0, fontFamily: FONTS.body }}>
          © 2026 BrewedOps. Made by Kenneth V.
        </p>
      </footer>

      {/* Pulse animation for Coming Soon dot */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <React.Suspense fallback={null}>
          <MobileDrawer
            isOpen={mobileMenuOpen}
            onClose={() => setMobileMenuOpen(false)}
            isDark={isDark}
            navigate={navigate}
            onNavigate={onNavigate}
          />
        </React.Suspense>
      )}
    </div>
  );
};

export default ServicesPage;
