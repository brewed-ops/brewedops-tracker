/**
 * ServicesPage Component
 * Path: /services
 * Under-construction services page — clean, branded, highlights offerings.
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Headphones,
  Envelope,
  Phone,
  ChatCircle,
  Ticket,
  Calendar,
  Tray,
  Lightning,
  GearSix,
  CaretDown,
  List,
  Image,
  Scissors,
  ArrowsOut,
  ArrowsIn,
  ArrowsClockwise,
  Palette,
  FileImage,
  FilmStrip,
  NotePencil,
  GitMerge,
  FileDashed,
  BookOpen,
  QrCode,
  MagnifyingGlass,
  TextT,
  Hash,
  GitBranch,
  BracketsCurly,
  Clock,
  Globe,
  Lock,
  CurrencyDollar,
  Note,
  CheckSquare,
  Timer,
  FileMagnifyingGlass,
  CheckCircle,
  CaretRight,
  ChartLineUp,
  Handshake,
  CalendarCheck,
  PenNib,
  GitFork,
} from '@phosphor-icons/react';
import SEO from '@/components/SEO';
import ScrollReveal from '@/components/ui/ScrollReveal';
import ThemeToggle from '../components/ui/ThemeToggle';
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
      { icon: ArrowsOut, title: 'Image Resizer', path: '/imageresizer' },
      { icon: ArrowsIn, title: 'Image Compressor', path: '/imagecompressor' },
      { icon: ArrowsClockwise, title: 'Image Converter', path: '/imageconverter' },
      { icon: Palette, title: 'Color Picker', path: '/colorpicker' },
      { icon: FileImage, title: 'Image to PDF', path: '/imagetopdf' },
    ],
  },
  {
    name: 'Video Tools',
    tools: [
      { icon: FilmStrip, title: 'Video Compressor', path: '/videocompressor' },
      { icon: Scissors, title: 'Video Trimmer', path: '/videotrimmer' },
    ],
  },
  {
    name: 'Document Tools',
    tools: [
      { icon: NotePencil, title: 'PDF Editor', path: '/pdfeditor' },
      { icon: GitMerge, title: 'PDF Merge', path: '/pdfmerge' },
      { icon: FileDashed, title: 'PDF Split', path: '/pdfsplit' },
      { icon: BookOpen, title: 'Markdown Viewer', path: '/markdownviewer' },
    ],
  },
  {
    name: 'Other Tools',
    tools: [
      { icon: QrCode, title: 'QR Generator', path: '/qrgenerator' },
      { icon: MagnifyingGlass, title: 'Find & Replace', path: '/findreplace' },
      { icon: TextT, title: 'Case Converter', path: '/caseconverter' },
      { icon: Hash, title: 'Word Counter', path: '/wordcounter' },
      { icon: GitBranch, title: 'Mermaid Reader', path: '/mermaid' },
      { icon: BracketsCurly, title: 'JSON Formatter', path: '/jsonformatter' },
      { icon: Clock, title: 'Cron Generator', path: '/crongenerator' },
      { icon: Globe, title: 'Timezone', path: '/timezoneconverter' },
      { icon: Timer, title: 'Focus Timer', path: '/pomodoro' },
    ],
  },
];

const PRODUCTIVITY_TOOLS = [
  { icon: CurrencyDollar, title: 'Finance Tracker', path: '/finance' },
  { icon: Headphones, title: 'VA Kita', path: '/vakita' },
  { icon: CheckSquare, title: 'Task Manager', path: '/taskmanager' },
  { icon: Note, title: 'Brewed Notes', path: '/brewednotes' },
];

// ============================================
// TOOLS DROPDOWN COMPONENT
// ============================================
const ToolsDropdown = ({ isDark, theme, onToolClick }) => {
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
        aria-expanded={isOpen}
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
        <CaretDown size={14} style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: '0',
            marginTop: '4px',
            backgroundColor: theme.cardBg,
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
            <span style={{ fontSize: '10px', color: theme.textMuted, fontFamily: FONTS.body, whiteSpace: 'nowrap' }}>
              Coming soon
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================
// AI TOOLS DATA & DROPDOWN
// ============================================
const AI_TOOLS = [
  { icon: Lightning, title: 'GHL Scenario Generator', path: '/ghl-scenario', description: 'AI-generated GHL CRM practice scenarios with workflow diagrams' },
  { icon: FileMagnifyingGlass, title: 'AI Text Extractor', path: '/text-extractor', description: 'OCR-powered text extraction from images and scanned PDFs' },
  { icon: PenNib, title: 'AI Proposal Writer', path: '/proposal-writer', description: 'Generate tailored Upwork proposals from job descriptions' },
  { icon: ChatCircle, title: 'AI GHL Advisor', path: '/ghl-advisor', description: 'Get expert GoHighLevel CRM advice with screenshot analysis' },
];

const AIToolsDropdown = ({ isDark, theme, onToolClick }) => {
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
    <div ref={dropdownRef} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} style={{ position: 'relative' }}>
      <button aria-expanded={isOpen} style={{ height: '40px', padding: '0 8px', backgroundColor: 'transparent', color: isOpen ? BRAND.blue : theme.textMuted, border: 'none', fontSize: '14px', fontWeight: '500', fontFamily: FONTS.body, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
        AI Tools
        <CaretDown size={14} style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
      </button>
      {isOpen && (
        <div style={{ position: 'absolute', top: '100%', left: '0', marginTop: '4px', backgroundColor: isDark ? '#171411' : '#ffffff', border: `1px solid ${isDark ? '#2a2420' : '#e8e0d4'}`, borderRadius: '12px', boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.5)' : '0 8px 32px rgba(0,0,0,0.1)', padding: '12px', zIndex: 1000, minWidth: '240px' }}>
          <div style={{ fontSize: '10px', fontWeight: '600', color: theme.textMuted, letterSpacing: '0.5px', marginBottom: '6px', textTransform: 'uppercase', fontFamily: FONTS.body }}>AI-Powered Tools</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {AI_TOOLS.map((tool) => {
              const IconComponent = tool.icon;
              return (
                <button key={tool.path} onClick={() => { setIsOpen(false); onToolClick(tool.path); }} style={{ padding: '8px 10px', backgroundColor: 'transparent', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: '10px', textAlign: 'left' }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = BRAND.blue; Array.from(e.currentTarget.querySelectorAll('svg, span')).forEach(el => el.style.color = '#fff'); }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; const spans = e.currentTarget.querySelectorAll('span'); if (spans[0]) spans[0].style.color = theme.text; if (spans[1]) spans[1].style.color = theme.textMuted; e.currentTarget.querySelector('svg').style.color = BRAND.blue; }}
                >
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: BRAND.blue + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <IconComponent size={16} weight="fill" style={{ color: BRAND.blue }} />
                  </div>
                  <div>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: theme.text, fontFamily: FONTS.body, display: 'block' }}>{tool.title}</span>
                    <span style={{ fontSize: '11px', color: theme.textMuted, fontFamily: FONTS.body, display: 'block', marginTop: '2px' }}>{tool.description}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// (Service data moved inline to individual sections below)

// ============================================
// APPS DROPDOWN
// ============================================
const AppsDropdown = ({ isDark, theme, onAppClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const timeoutRef = useRef(null);
  const handleMouseEnter = () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); setIsOpen(true); };
  const handleMouseLeave = () => { timeoutRef.current = setTimeout(() => setIsOpen(false), 150); };
  useEffect(() => {
    const handleClickOutside = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false); };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  return (
    <div ref={dropdownRef} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} style={{ position: 'relative' }}>
      <button aria-expanded={isOpen} style={{ height: '40px', padding: '0 12px', backgroundColor: 'transparent', color: isOpen ? '#14b8a6' : theme.text, border: 'none', fontSize: '14px', fontWeight: '500', fontFamily: FONTS.body, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
        Apps
        <CaretDown size={14} style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
      </button>
      {isOpen && (
        <div style={{ position: 'absolute', top: '100%', left: '0', marginTop: '4px', backgroundColor: isDark ? '#171411' : '#ffffff', border: `1px solid ${isDark ? '#2a2420' : '#e8e0d4'}`, borderRadius: '12px', boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.5)' : '0 8px 32px rgba(0,0,0,0.1)', padding: '12px', zIndex: 1000, minWidth: '200px' }}>
          <div style={{ fontSize: '10px', fontWeight: '600', color: theme.textMuted, letterSpacing: '0.5px', marginBottom: '6px', textTransform: 'uppercase', fontFamily: FONTS.body }}>Mobile Apps</div>
          <button
            onClick={() => { setIsOpen(false); onAppClick('/fuelyx'); }}
            style={{ padding: '8px 10px', backgroundColor: 'transparent', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: '10px', textAlign: 'left', width: '100%' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#14b8a6'; Array.from(e.currentTarget.querySelectorAll('svg, span')).forEach(el => el.style.color = '#fff'); }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; const spans = e.currentTarget.querySelectorAll('span'); if (spans[0]) spans[0].style.color = theme.text; if (spans[1]) spans[1].style.color = theme.textMuted; e.currentTarget.querySelector('svg').style.color = '#14b8a6'; }}
          >
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#14b8a618', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <DeviceMobile size={16} weight="fill" style={{ color: '#14b8a6' }} />
            </div>
            <div>
              <span style={{ fontSize: '13px', fontWeight: '600', color: theme.text, fontFamily: FONTS.body, display: 'block' }}>Fuelyx</span>
              <span style={{ fontSize: '11px', color: theme.textMuted, fontFamily: FONTS.body, display: 'block', marginTop: '2px' }}>Filipino nutrition tracker</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

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
  const isMobile = width < 768;
  const isDesktop = width >= 1024;
  const theme = getTheme(isDark);
  const [flowActive, setFlowActive] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <div style={{ minHeight: '100vh', backgroundColor: theme.bg, display: 'flex', flexDirection: 'column' }}>
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
        borderBottom: isScrolled ? '1px solid ' + theme.cardBorder : '1px solid transparent',
        backgroundColor: theme.bg,
        position: 'sticky',
        top: 0,
        zIndex: 100,
        transition: 'border-color 0.3s',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <button onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginRight: '20px', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            <img src="/BrewedOpsLogo-64.png" alt="Logo" width={32} height={32} style={{ width: '32px', height: '32px', borderRadius: '8px' }} />
            <span style={{ fontSize: '18px', fontWeight: '700', fontFamily: FONTS.heading }}>
              <span style={{ color: isDark ? '#fff' : BRAND.brown }}>Brewed</span>
              <span style={{ color: BRAND.blue }}>Ops</span>
            </span>
          </button>
          {isDesktop && (
            <>
              <button onClick={() => navigate('/')} style={navLinkStyle}>Home</button>
              <button onClick={() => navigate('/portfolio')} style={navLinkStyle}>Portfolio</button>
              <ToolsDropdown isDark={isDark} theme={theme} onToolClick={(path) => navigate(path)} />
              <AIToolsDropdown isDark={isDark} theme={theme} onToolClick={(path) => navigate(path)} />
              <AppsDropdown isDark={isDark} theme={theme} onAppClick={(path) => navigate(path)} />
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
          <ThemeToggle isDark={isDark} setIsDark={setIsDark} />
          {isDesktop ? (
            <button
              onClick={() => {
                const hero = document.getElementById('main-content');
                if (hero) hero.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{
                position: 'relative',
                overflow: 'hidden',
                marginLeft: '8px',
                height: '38px',
                padding: '0 22px',
                backgroundColor: BRAND.blue,
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '500',
                fontFamily: FONTS.body,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                whiteSpace: 'nowrap',
                boxShadow: `0 2px 12px rgba(0,74,172,0.35)`,
                animation: 'servicesBtnPulse 2.5s ease-in-out infinite',
              }}
            >
              <span style={{
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.25) 50%, transparent 100%)',
                animation: 'servicesBtnShimmer 3s ease-in-out infinite',
                pointerEvents: 'none',
              }} />
              Services
              <CaretRight size={14} />
            </button>
          ) : (
            <button onClick={() => setMobileMenuOpen(true)} aria-label="Open navigation menu" style={{ width: '36px', height: '36px', backgroundColor: 'transparent', border: '1px solid ' + theme.cardBorder, borderRadius: '8px', color: theme.textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '4px' }}>
              <List size={18} />
            </button>
          )}
        </div>
      </nav>

      <main id="main-content" style={{ flex: 1 }}>
        {/* ============================================ */}
        {/* HERO */}
        {/* ============================================ */}
        <section style={{
          padding: isSmall ? '56px 20px 40px' : '80px 32px 60px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            opacity: isDark ? 0.03 : 0.04,
            backgroundImage: `radial-gradient(${BRAND.blue} 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
            pointerEvents: 'none',
          }} />
          <ScrollReveal>
            <div style={{ position: 'relative', maxWidth: '900px', margin: '0 auto' }}>
              <h1 style={{
                fontSize: isSmall ? '34px' : '50px',
                fontWeight: '800',
                color: isDark ? '#ffffff' : BRAND.brown,
                lineHeight: '1.1',
                letterSpacing: '-0.03em',
                fontFamily: FONTS.heading,
                margin: '0 0 18px',
              }}>
                Stop Running Your Business{' '}
                <span style={{ color: BRAND.blue }}>Alone.</span>
              </h1>
              <p style={{
                fontSize: isSmall ? '16px' : '18px',
                color: theme.textMuted,
                lineHeight: '1.7',
                fontFamily: FONTS.body,
                margin: '0 auto 32px',
                maxWidth: '580px',
              }}>
                Customer support, admin operations, and CRM automation — handled by real people backed by smart systems.
              </p>
              <div style={{ marginBottom: '20px' }}>
                <span style={{
                  fontSize: '12px',
                  fontWeight: '700',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: BRAND.blue,
                  fontFamily: FONTS.heading,
                  display: 'inline-block',
                  marginBottom: '6px',
                  opacity: 0.85,
                }}>What I Deliver</span>
                <p style={{
                  fontSize: isSmall ? '14px' : '16px',
                  color: theme.textMuted,
                  fontFamily: FONTS.body,
                  fontWeight: '500',
                  margin: 0,
                  lineHeight: '1.5',
                }}>Three services. Zero gaps in your operations.</p>
              </div>
              {/* Segmented Capsule Bar */}
              <div style={{
                display: 'inline-flex',
                flexDirection: isSmall ? 'column' : 'row',
                alignItems: 'center',
                borderRadius: isSmall ? '16px' : '999px',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.08)'}`,
                backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                padding: isSmall ? '6px' : '6px 8px',
                gap: '0',
              }}>
                {[
                  { label: 'HighLevel Automation', color: '#f59e0b' },
                  { label: 'Customer Support', color: BRAND.blue },
                  { label: 'Virtual Assistant', color: BRAND.green },
                ].map((svc, i, arr) => (
                  <React.Fragment key={i}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: isSmall ? '10px 18px' : '10px 22px',
                      borderRadius: isSmall ? '12px' : '999px',
                      cursor: 'default',
                      transition: 'background-color 0.2s ease',
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: svc.color,
                        flexShrink: 0,
                        boxShadow: `0 0 8px ${svc.color}50`,
                      }} />
                      <span style={{
                        fontSize: isSmall ? '13px' : '14px',
                        fontWeight: '600',
                        fontFamily: FONTS.body,
                        color: isDark ? '#ffffff' : BRAND.brown,
                        whiteSpace: 'nowrap',
                      }}>{svc.label}</span>
                    </div>
                    {i < arr.length - 1 && (
                      <div style={{
                        width: isSmall ? '60%' : '1px',
                        height: isSmall ? '1px' : '20px',
                        backgroundColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.10)',
                        flexShrink: 0,
                        alignSelf: 'center',
                      }} />
                    )}
                  </React.Fragment>
                ))}
              </div>
              {/* Services Illustration */}
              <div style={{
                marginTop: '40px',
                display: 'flex',
                justifyContent: 'center',
              }}>
                <img
                  src="/serv1.webp"
                  alt="BrewedOps services — CRM automation, customer support, and virtual assistant"
                  onError={(e) => { e.target.src = "/serv1.jpeg"; }}
                  style={{
                    maxWidth: isSmall ? '100%' : '620px',
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    ...(isDark ? {
                      filter: 'invert(1) hue-rotate(180deg)',
                      mixBlendMode: 'screen',
                    } : {
                      mixBlendMode: 'multiply',
                    }),
                  }}
                />
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* ============================================ */}
        {/* GHL AUTOMATION */}
        {/* ============================================ */}
        <section style={{
          padding: isSmall ? '48px 20px' : '72px 32px',
          backgroundColor: isDark ? '#100e0b' : BRAND.cream,
          borderBottom: `1px solid ${theme.cardBorder}`,
        }}>
          <style>{`
            @keyframes triggerGlowServices {
              0%, 100% { opacity: 0.5; transform: scale(1); }
              50% { opacity: 1; transform: scale(1.08); }
            }
          `}</style>
          <ScrollReveal>
            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
              {/* Header */}
              <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '14px',
                  marginBottom: '20px',
                }}>
                  <div style={{
                    width: '4px',
                    height: isSmall ? '28px' : '36px',
                    borderRadius: '2px',
                    backgroundColor: '#f59e0b',
                    boxShadow: '0 0 12px rgba(245,158,11,0.4)',
                  }} />
                  <span style={{
                    fontSize: isSmall ? '18px' : '22px',
                    fontWeight: '800',
                    color: '#f59e0b',
                    fontFamily: FONTS.heading,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                  }}>
                    GHL Automation
                  </span>
                </div>
                <h2 style={{
                  fontSize: isSmall ? '28px' : '38px',
                  fontWeight: '800',
                  fontFamily: FONTS.heading,
                  lineHeight: '1.15',
                  marginBottom: '16px',
                  color: theme.text,
                  letterSpacing: '-0.02em',
                }}>
                  Automation That Runs{' '}
                  <span style={{ color: '#f59e0b' }}>While You Sleep.</span>
                </h2>
                <p style={{
                  fontSize: isSmall ? '15px' : '17px',
                  color: theme.textMuted,
                  lineHeight: '1.7',
                  fontFamily: FONTS.body,
                  maxWidth: '560px',
                  margin: '0 auto',
                }}>
                  We build GoHighLevel workflows that capture leads, nurture them automatically, and book appointments — zero manual follow-up.
                </p>
              </div>

              {/* n8n-style Workflow Builder */}
              <div
                style={{
                  position: 'relative',
                  maxWidth: '900px',
                  margin: '0 auto',
                  borderRadius: '16px',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
                  backgroundColor: isDark ? 'rgba(0,0,0,0.3)' : `${BRAND.cream}40`,
                  backgroundImage: `radial-gradient(circle, ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'} 1px, transparent 1px)`,
                  backgroundSize: '20px 20px',
                  padding: isSmall ? '24px 16px' : '36px 32px',
                  overflow: 'hidden',
                }}
                onMouseEnter={() => setFlowActive(true)}
                onMouseLeave={() => setFlowActive(false)}
              >
                {/* Main flow row/column */}
                <div style={{
                  display: 'flex',
                  flexDirection: isMobile ? 'column' : 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0',
                }}>

                  {/* Node 1: Trigger */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: isSmall ? '10px 14px' : '12px 16px',
                    backgroundColor: theme.cardBg,
                    borderRadius: '12px',
                    borderLeft: '4px solid #f59e0b',
                    border: `1px solid ${flowActive ? '#f59e0b' : theme.cardBorder}`,
                    borderLeftWidth: '4px',
                    borderLeftColor: '#f59e0b',
                    boxShadow: flowActive
                      ? `0 4px 20px #f59e0b25, 0 0 0 3px #f59e0b15`
                      : `0 2px 8px ${isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.06)'}`,
                    transition: 'all 0.35s ease 0s',
                    flexShrink: 0,
                    ...(!flowActive ? { animation: 'triggerGlowServices 3s ease-in-out infinite' } : {}),
                  }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      backgroundColor: '#f59e0b20',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <Lightning size={18} weight="fill" style={{ color: '#f59e0b' }} />
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: theme.text, fontFamily: FONTS.body, lineHeight: '1.3' }}>New Lead</div>
                      <div style={{ fontSize: '11px', color: theme.textMuted, fontFamily: FONTS.body, lineHeight: '1.3' }}>Form Submission</div>
                    </div>
                  </div>

                  {/* Connector 1: Trigger → Process */}
                  <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', flexShrink: 0 }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: flowActive ? '#f59e0b' : '#f59e0b30', transition: 'all 0.3s ease 0s', boxShadow: flowActive ? '0 0 6px #f59e0b' : 'none', flexShrink: 0 }} />
                    <div style={{ position: 'relative', width: isMobile ? '2px' : '32px', height: isMobile ? '24px' : '2px', backgroundColor: isDark ? '#f59e0b10' : '#f59e0b08', overflow: 'hidden' }}>
                      <div style={{ position: 'absolute', inset: 0, backgroundColor: '#f59e0b', transformOrigin: isMobile ? 'top' : 'left', transform: flowActive ? (isMobile ? 'scaleY(1)' : 'scaleX(1)') : 'scale(0)', transition: 'transform 0.3s ease 0.12s', boxShadow: flowActive ? '0 0 6px #f59e0b' : 'none' }} />
                    </div>
                    <div style={isMobile ? { width: 0, height: 0, borderLeft: '4px solid transparent', borderRight: '4px solid transparent', borderTop: `6px solid ${flowActive ? '#f59e0b' : '#f59e0b25'}`, transition: 'border-top-color 0.3s ease 0.15s', flexShrink: 0 } : { width: 0, height: 0, borderTop: '4px solid transparent', borderBottom: '4px solid transparent', borderLeft: `6px solid ${flowActive ? '#f59e0b' : '#f59e0b25'}`, transition: 'border-left-color 0.3s ease 0.15s', flexShrink: 0 }} />
                  </div>

                  {/* Node 2: Process */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: isSmall ? '10px 14px' : '12px 16px',
                    backgroundColor: theme.cardBg,
                    borderRadius: '12px',
                    borderLeft: `4px solid ${BRAND.blue}`,
                    border: `1px solid ${flowActive ? BRAND.blue : theme.cardBorder}`,
                    borderLeftWidth: '4px',
                    borderLeftColor: BRAND.blue,
                    boxShadow: flowActive
                      ? `0 4px 20px ${BRAND.blue}25, 0 0 0 3px ${BRAND.blue}15`
                      : `0 2px 8px ${isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.06)'}`,
                    transition: 'all 0.35s ease 0.2s',
                    flexShrink: 0,
                  }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      backgroundColor: `${BRAND.blue}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <Envelope size={18} weight="duotone" style={{ color: BRAND.blue }} />
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: theme.text, fontFamily: FONTS.body, lineHeight: '1.3' }}>Auto Follow-Up</div>
                      <div style={{ fontSize: '11px', color: theme.textMuted, fontFamily: FONTS.body, lineHeight: '1.3' }}>Email & SMS</div>
                    </div>
                  </div>

                  {/* Connector 2: Process → Decision */}
                  <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', flexShrink: 0 }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: flowActive ? BRAND.blue : `${BRAND.blue}30`, transition: `all 0.3s ease 0.25s`, boxShadow: flowActive ? `0 0 6px ${BRAND.blue}` : 'none', flexShrink: 0 }} />
                    <div style={{ position: 'relative', width: isMobile ? '2px' : '32px', height: isMobile ? '24px' : '2px', backgroundColor: isDark ? `${BRAND.blue}10` : `${BRAND.blue}08`, overflow: 'hidden' }}>
                      <div style={{ position: 'absolute', inset: 0, backgroundColor: BRAND.blue, transformOrigin: isMobile ? 'top' : 'left', transform: flowActive ? (isMobile ? 'scaleY(1)' : 'scaleX(1)') : 'scale(0)', transition: 'transform 0.3s ease 0.27s', boxShadow: flowActive ? `0 0 6px ${BRAND.blue}` : 'none' }} />
                    </div>
                    <div style={isMobile ? { width: 0, height: 0, borderLeft: '4px solid transparent', borderRight: '4px solid transparent', borderTop: `6px solid ${flowActive ? BRAND.blue : `${BRAND.blue}25`}`, transition: 'border-top-color 0.3s ease 0.3s', flexShrink: 0 } : { width: 0, height: 0, borderTop: '4px solid transparent', borderBottom: '4px solid transparent', borderLeft: `6px solid ${flowActive ? BRAND.blue : `${BRAND.blue}25`}`, transition: 'border-left-color 0.3s ease 0.3s', flexShrink: 0 }} />
                  </div>

                  {/* Node 3: Decision Diamond */}
                  <div style={{ position: 'relative', width: isSmall ? '60px' : '72px', height: isSmall ? '60px' : '72px', flexShrink: 0 }}>
                    <div style={{
                      position: 'absolute',
                      inset: isSmall ? '4px' : '6px',
                      transform: 'rotate(45deg)',
                      backgroundColor: theme.cardBg,
                      border: `2px solid ${flowActive ? BRAND.green : (isDark ? `${BRAND.green}40` : `${BRAND.green}30`)}`,
                      borderRadius: '10px',
                      boxShadow: flowActive
                        ? `0 4px 20px ${BRAND.green}25, 0 0 0 3px ${BRAND.green}15`
                        : `0 2px 8px ${isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.06)'}`,
                      transition: 'all 0.35s ease 0.35s',
                    }} />
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <GitFork size={isSmall ? 18 : 22} weight="bold" style={{ color: BRAND.green, transform: 'rotate(90deg)' }} />
                    </div>
                  </div>

                  {/* Branch outputs after decision */}
                  <div style={{
                    display: 'flex',
                    flexDirection: isMobile ? 'row' : 'column',
                    gap: isMobile ? '16px' : '12px',
                    alignItems: 'flex-start',
                    marginLeft: isMobile ? 0 : '0',
                    marginTop: isMobile ? '0' : '0',
                  }}>
                    {/* True branch */}
                    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', gap: '0' }}>
                      {/* Mini connector with label */}
                      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', flexShrink: 0 }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: flowActive ? BRAND.green : `${BRAND.green}30`, transition: 'all 0.3s ease 0.45s', boxShadow: flowActive ? `0 0 6px ${BRAND.green}` : 'none', flexShrink: 0 }} />
                        <div style={{ position: 'relative' }}>
                          <div style={{ width: isMobile ? '2px' : '20px', height: isMobile ? '16px' : '2px', backgroundColor: isDark ? `${BRAND.green}10` : `${BRAND.green}08`, overflow: 'hidden', position: 'relative' }}>
                            <div style={{ position: 'absolute', inset: 0, backgroundColor: BRAND.green, transformOrigin: isMobile ? 'top' : 'left', transform: flowActive ? (isMobile ? 'scaleY(1)' : 'scaleX(1)') : 'scale(0)', transition: 'transform 0.3s ease 0.47s', boxShadow: flowActive ? `0 0 6px ${BRAND.green}` : 'none' }} />
                          </div>
                          <span style={{
                            position: 'absolute',
                            top: isMobile ? '50%' : '-16px',
                            left: isMobile ? '8px' : '50%',
                            transform: isMobile ? 'translateY(-50%)' : 'translateX(-50%)',
                            fontSize: '9px',
                            fontWeight: '700',
                            color: BRAND.green,
                            fontFamily: FONTS.body,
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                          }}>true</span>
                        </div>
                        <div style={isMobile ? { width: 0, height: 0, borderLeft: '3px solid transparent', borderRight: '3px solid transparent', borderTop: `5px solid ${flowActive ? BRAND.green : `${BRAND.green}25`}`, transition: 'border-top-color 0.3s ease 0.5s', flexShrink: 0 } : { width: 0, height: 0, borderTop: '3px solid transparent', borderBottom: '3px solid transparent', borderLeft: `5px solid ${flowActive ? BRAND.green : `${BRAND.green}25`}`, transition: 'border-left-color 0.3s ease 0.5s', flexShrink: 0 }} />
                      </div>
                      {/* True branch node */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: isSmall ? '8px 10px' : '10px 12px',
                        backgroundColor: theme.cardBg,
                        borderRadius: '10px',
                        borderLeft: `3px solid ${BRAND.green}`,
                        border: `1px solid ${flowActive ? BRAND.green : theme.cardBorder}`,
                        borderLeftWidth: '3px',
                        borderLeftColor: BRAND.green,
                        boxShadow: flowActive
                          ? `0 3px 14px ${BRAND.green}20, 0 0 0 2px ${BRAND.green}10`
                          : `0 1px 4px ${isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.04)'}`,
                        transition: 'all 0.35s ease 0.5s',
                        flexShrink: 0,
                      }}>
                        <div style={{
                          width: '30px',
                          height: '30px',
                          borderRadius: '6px',
                          backgroundColor: `${BRAND.green}20`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}>
                          <CalendarCheck size={15} weight="duotone" style={{ color: BRAND.green }} />
                        </div>
                        <div>
                          <div style={{ fontSize: '12px', fontWeight: '700', color: theme.text, fontFamily: FONTS.body, lineHeight: '1.3' }}>Book Call</div>
                          <div style={{ fontSize: '10px', color: theme.textMuted, fontFamily: FONTS.body, lineHeight: '1.3' }}>Auto-scheduled</div>
                        </div>
                      </div>
                    </div>

                    {/* False branch */}
                    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', gap: '0' }}>
                      {/* Mini connector with label */}
                      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', flexShrink: 0 }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: flowActive ? theme.textMuted : `${theme.textMuted}30`, transition: 'all 0.3s ease 0.5s', boxShadow: flowActive ? `0 0 6px ${theme.textMuted}` : 'none', flexShrink: 0 }} />
                        <div style={{ position: 'relative' }}>
                          <div style={{ width: isMobile ? '2px' : '20px', height: isMobile ? '16px' : '2px', backgroundColor: isDark ? `${BRAND.blue}10` : `${BRAND.blue}08`, overflow: 'hidden', position: 'relative' }}>
                            <div style={{ position: 'absolute', inset: 0, backgroundColor: BRAND.blue, transformOrigin: isMobile ? 'top' : 'left', transform: flowActive ? (isMobile ? 'scaleY(1)' : 'scaleX(1)') : 'scale(0)', transition: 'transform 0.3s ease 0.52s', boxShadow: flowActive ? `0 0 6px ${BRAND.blue}` : 'none' }} />
                          </div>
                          <span style={{
                            position: 'absolute',
                            top: isMobile ? '50%' : '-16px',
                            left: isMobile ? '8px' : '50%',
                            transform: isMobile ? 'translateY(-50%)' : 'translateX(-50%)',
                            fontSize: '9px',
                            fontWeight: '700',
                            color: theme.textMuted,
                            fontFamily: FONTS.body,
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                          }}>false</span>
                        </div>
                        <div style={isMobile ? { width: 0, height: 0, borderLeft: '3px solid transparent', borderRight: '3px solid transparent', borderTop: `5px solid ${flowActive ? BRAND.blue : `${BRAND.blue}25`}`, transition: 'border-top-color 0.3s ease 0.55s', flexShrink: 0 } : { width: 0, height: 0, borderTop: '3px solid transparent', borderBottom: '3px solid transparent', borderLeft: `5px solid ${flowActive ? BRAND.blue : `${BRAND.blue}25`}`, transition: 'border-left-color 0.3s ease 0.55s', flexShrink: 0 }} />
                      </div>
                      {/* False branch node */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: isSmall ? '8px 10px' : '10px 12px',
                        backgroundColor: theme.cardBg,
                        borderRadius: '10px',
                        borderLeft: `3px solid ${BRAND.blue}`,
                        border: `1px solid ${flowActive ? BRAND.blue : theme.cardBorder}`,
                        borderLeftWidth: '3px',
                        borderLeftColor: BRAND.blue,
                        boxShadow: flowActive
                          ? `0 3px 14px ${BRAND.blue}20, 0 0 0 2px ${BRAND.blue}10`
                          : `0 1px 4px ${isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.04)'}`,
                        transition: 'all 0.35s ease 0.55s',
                        flexShrink: 0,
                      }}>
                        <div style={{
                          width: '30px',
                          height: '30px',
                          borderRadius: '6px',
                          backgroundColor: `${BRAND.blue}20`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}>
                          <ChatCircle size={15} weight="duotone" style={{ color: BRAND.blue }} />
                        </div>
                        <div>
                          <div style={{ fontSize: '12px', fontWeight: '700', color: theme.text, fontFamily: FONTS.body, lineHeight: '1.3' }}>Nurture</div>
                          <div style={{ fontSize: '10px', color: theme.textMuted, fontFamily: FONTS.body, lineHeight: '1.3' }}>Drip campaign</div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Connected tools row */}
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  gap: '10px',
                  marginTop: '28px',
                  paddingTop: '20px',
                  borderTop: `1px dashed ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
                }}>
                  {[
                    { icon: GearSix, label: 'GoHighLevel CRM' },
                    { icon: Envelope, label: 'Email & SMS' },
                    { icon: Lightning, label: 'AI Assistant' },
                  ].map((tool, i) => {
                    const ToolIcon = tool.icon;
                    return (
                      <div key={i} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        border: `1px dashed ${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)'}`,
                        backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                      }}>
                        <ToolIcon size={14} style={{ color: theme.textMuted }} />
                        <span style={{ fontSize: '11px', fontWeight: '600', color: theme.textMuted, fontFamily: FONTS.body }}>{tool.label}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Hover hint */}
                <p style={{
                  textAlign: 'center',
                  fontSize: '12px',
                  color: theme.textMuted,
                  fontFamily: FONTS.body,
                  marginTop: '16px',
                  marginBottom: 0,
                  opacity: 0.7,
                }}>
                  Hover to activate the flow
                </p>
              </div>

              {/* What's included checklist */}
              <div style={{
                marginTop: '36px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '20px',
              }}>
                <div style={{
                  display: 'flex',
                  flexDirection: isSmall ? 'column' : 'row',
                  justifyContent: 'center',
                  gap: isSmall ? '10px' : '24px',
                  flexWrap: 'wrap',
                }}>
                  {[
                    'CRM setup & build',
                    'Workflow automation',
                    'Pipeline management',
                    'Smart notifications',
                  ].map((item, i) => (
                    <div key={i} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}>
                      <CheckCircle size={16} weight="fill" style={{ color: '#f59e0b', flexShrink: 0 }} />
                      <span style={{ fontSize: '14px', fontWeight: '500', color: theme.text, fontFamily: FONTS.body }}>{item}</span>
                    </div>
                  ))}
                </div>
                <p style={{
                  fontSize: '13px',
                  color: theme.textMuted,
                  fontFamily: FONTS.body,
                  margin: 0,
                }}>
                  Powered by <strong style={{ color: theme.text }}>GoHighLevel</strong> — built and managed by BrewedOps.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* ============================================ */}
        {/* CUSTOMER SUPPORT */}
        {/* ============================================ */}
        <section style={{
          padding: isSmall ? '48px 20px' : '72px 32px',
          backgroundColor: theme.bg,
        }}>
          <ScrollReveal>
            <div style={{
              maxWidth: '1100px',
              margin: '0 auto',
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: 'center',
              gap: isMobile ? '36px' : '60px',
            }}>
              {/* Text */}
              <div style={{ flex: '1', textAlign: isMobile ? 'center' : 'left' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  marginBottom: '20px',
                  justifyContent: isMobile ? 'center' : 'flex-start',
                }}>
                  <div style={{
                    width: '4px',
                    height: isSmall ? '28px' : '36px',
                    borderRadius: '2px',
                    backgroundColor: BRAND.blue,
                    boxShadow: `0 0 12px ${BRAND.blue}40`,
                  }} />
                  <span style={{
                    fontSize: isSmall ? '18px' : '22px',
                    fontWeight: '800',
                    color: BRAND.blue,
                    fontFamily: FONTS.heading,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                  }}>
                    Customer Support
                  </span>
                </div>
                <h2 style={{
                  fontSize: isSmall ? '28px' : '38px',
                  fontWeight: '800',
                  fontFamily: FONTS.heading,
                  lineHeight: '1.15',
                  marginBottom: '16px',
                  color: theme.text,
                  letterSpacing: '-0.02em',
                }}>
                  Your Customers Deserve{' '}
                  <span style={{ color: BRAND.blue }}>Instant Answers.</span>
                </h2>
                <p style={{
                  fontSize: isSmall ? '15px' : '17px',
                  color: theme.textMuted,
                  lineHeight: '1.7',
                  marginBottom: '24px',
                  fontFamily: FONTS.body,
                }}>
                  Every email answered. Every chat handled. Every call picked up. Your customers get white-glove service — without you lifting a finger.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    'Email & ticket management',
                    'Live chat support',
                    'Phone support coverage',
                    'Response within 2 hours',
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: isMobile ? 'center' : 'flex-start' }}>
                      <CheckCircle size={18} weight="fill" style={{ color: BRAND.green, flexShrink: 0 }} />
                      <span style={{ fontSize: '14px', color: theme.textMuted, fontFamily: FONTS.body, fontWeight: '500' }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Illustration — Support Dashboard */}
              <div style={{ flex: '1.2', width: isMobile ? '100%' : 'auto', maxWidth: isMobile ? '100%' : '520px' }}>
                <div style={{
                  backgroundColor: theme.cardBg,
                  borderRadius: '20px',
                  border: `1px solid ${theme.cardBorder}`,
                  padding: isSmall ? '20px' : '28px',
                  boxShadow: isDark
                    ? '0 12px 48px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.03)'
                    : '0 12px 48px rgba(0,74,172,0.08), 0 0 0 1px rgba(0,74,172,0.04)',
                }}>
                  {/* Dashboard header */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', paddingBottom: '16px', borderBottom: `1px solid ${theme.cardBorder}` }}>
                    <div>
                      <span style={{ fontSize: '15px', fontWeight: '700', color: theme.text, fontFamily: FONTS.heading, display: 'block', lineHeight: '1.2' }}>Support Dashboard</span>
                      <span style={{ fontSize: '11px', color: theme.textMuted, fontFamily: FONTS.body }}>Real-time overview</span>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '4px 12px',
                      borderRadius: '100px',
                      backgroundColor: isDark ? 'rgba(81,175,67,0.12)' : 'rgba(81,175,67,0.08)',
                    }}>
                      <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: BRAND.green, animation: 'pulse 2s ease-in-out infinite', boxShadow: `0 0 6px ${BRAND.green}60` }} />
                      <span style={{ fontSize: '12px', color: BRAND.green, fontFamily: FONTS.body, fontWeight: '700' }}>Live</span>
                    </div>
                  </div>

                  {/* Channel cards */}
                  <div style={{ display: 'grid', gridTemplateColumns: isSmall ? '1fr' : '1fr 1fr', gap: '12px' }}>
                    {[
                      { icon: Envelope, label: 'Email', stat: '24', note: 'replied today', color: BRAND.blue },
                      { icon: ChatCircle, label: 'Chat', stat: '3', note: 'active now', color: BRAND.blue },
                      { icon: Phone, label: 'Phone', stat: '8', note: 'calls handled', color: BRAND.blue },
                      { icon: Ticket, label: 'Tickets', stat: '98%', note: 'resolved', color: BRAND.green },
                    ].map((ch, i) => {
                      const ChIcon = ch.icon;
                      return (
                        <div key={i} style={{
                          padding: isSmall ? '14px' : '18px',
                          backgroundColor: isDark ? '#1e1a16' : '#faf8f5',
                          borderRadius: '12px',
                          border: `1px solid ${isDark ? '#2a2420' : '#f0e8dc'}`,
                          transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                            <div style={{ width: '34px', height: '34px', borderRadius: '8px', backgroundColor: isDark ? `${ch.color}20` : `${ch.color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <ChIcon size={16} weight="duotone" style={{ color: ch.color }} />
                            </div>
                            <span style={{ fontSize: '13px', fontWeight: '600', color: theme.text, fontFamily: FONTS.body }}>{ch.label}</span>
                          </div>
                          <div style={{ fontSize: isSmall ? '26px' : '30px', fontWeight: '800', color: theme.text, fontFamily: FONTS.heading, lineHeight: '1', letterSpacing: '-0.02em' }}>{ch.stat}</div>
                          <div style={{ fontSize: '12px', color: ch.color === BRAND.green ? BRAND.green : theme.textMuted, fontFamily: FONTS.body, fontWeight: '500', marginTop: '6px' }}>{ch.note}</div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Response Time Bar */}
                  <div style={{
                    marginTop: '16px',
                    padding: isSmall ? '14px' : '18px',
                    backgroundColor: isDark ? '#1e1a16' : '#faf8f5',
                    borderRadius: '12px',
                    border: `1px solid ${isDark ? '#2a2420' : '#f0e8dc'}`,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Timer size={15} style={{ color: BRAND.blue }} />
                        <span style={{ fontSize: '12px', fontWeight: '600', color: theme.text, fontFamily: FONTS.body }}>Avg. Response Time</span>
                      </div>
                      <span style={{ fontSize: '14px', fontWeight: '700', color: BRAND.green, fontFamily: FONTS.heading }}>18 min</span>
                    </div>
                    <div style={{
                      height: '8px',
                      backgroundColor: isDark ? '#2a2420' : '#e8e0d4',
                      borderRadius: '100px',
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        height: '100%',
                        width: '85%',
                        borderRadius: '100px',
                        background: `linear-gradient(90deg, ${BRAND.blue}, ${BRAND.green})`,
                        transition: 'width 1s ease-out',
                      }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                      <span style={{ fontSize: '10px', color: theme.textMuted, fontFamily: FONTS.body }}>Target: &lt;2 hours</span>
                      <span style={{ fontSize: '10px', color: BRAND.green, fontFamily: FONTS.body, fontWeight: '600' }}>Excellent</span>
                    </div>
                  </div>

                  {/* Satisfaction Score */}
                  <div style={{
                    marginTop: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: isSmall ? '14px' : '16px 18px',
                    backgroundColor: isDark ? `${BRAND.green}10` : `${BRAND.green}08`,
                    borderRadius: '12px',
                    border: `1px solid ${isDark ? `${BRAND.green}25` : `${BRAND.green}18`}`,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '8px',
                        backgroundColor: isDark ? `${BRAND.green}20` : `${BRAND.green}12`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <Handshake size={16} weight="fill" style={{ color: BRAND.green }} />
                      </div>
                      <div>
                        <span style={{ fontSize: '12px', fontWeight: '600', color: theme.text, fontFamily: FONTS.body, display: 'block', lineHeight: '1.2' }}>Customer Satisfaction</span>
                        <span style={{ fontSize: '11px', color: theme.textMuted, fontFamily: FONTS.body }}>Based on 142 reviews</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '22px', fontWeight: '800', color: BRAND.green, fontFamily: FONTS.heading, lineHeight: '1' }}>4.9</span>
                      <span style={{ fontSize: '12px', color: theme.textMuted, fontFamily: FONTS.body, display: 'block', marginTop: '2px' }}>/5.0</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* ============================================ */}
        {/* ADMIN VA */}
        {/* ============================================ */}
        <section style={{
          padding: isSmall ? '48px 20px' : '72px 32px',
          backgroundColor: isDark ? '#100e0b' : BRAND.cream,
          borderTop: `1px solid ${theme.cardBorder}`,
          borderBottom: `1px solid ${theme.cardBorder}`,
        }}>
          <ScrollReveal>
            <div style={{
              maxWidth: '1100px',
              margin: '0 auto',
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row-reverse',
              alignItems: 'center',
              gap: isMobile ? '36px' : '60px',
            }}>
              {/* Text */}
              <div style={{ flex: '1', textAlign: isMobile ? 'center' : 'left' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  marginBottom: '20px',
                  justifyContent: isMobile ? 'center' : 'flex-start',
                }}>
                  <div style={{
                    width: '4px',
                    height: isSmall ? '28px' : '36px',
                    borderRadius: '2px',
                    backgroundColor: BRAND.green,
                    boxShadow: `0 0 12px ${BRAND.green}40`,
                  }} />
                  <span style={{
                    fontSize: isSmall ? '18px' : '22px',
                    fontWeight: '800',
                    color: BRAND.green,
                    fontFamily: FONTS.heading,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                  }}>
                    Admin VA
                  </span>
                </div>
                <h2 style={{
                  fontSize: isSmall ? '28px' : '38px',
                  fontWeight: '800',
                  fontFamily: FONTS.heading,
                  lineHeight: '1.15',
                  marginBottom: '16px',
                  color: theme.text,
                  letterSpacing: '-0.02em',
                }}>
                  Your Back Office,{' '}
                  <span style={{ color: BRAND.green }}>Under Control.</span>
                </h2>
                <p style={{
                  fontSize: isSmall ? '15px' : '17px',
                  color: theme.textMuted,
                  lineHeight: '1.7',
                  marginBottom: '24px',
                  fontFamily: FONTS.body,
                }}>
                  Inbox drowning? Calendar chaos? We take over the operational tasks that eat your hours — so you run the business, not chase it.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    'Inbox zero management',
                    'Calendar & scheduling',
                    'Data entry & reporting',
                    'CRM updates & follow-ups',
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: isMobile ? 'center' : 'flex-start' }}>
                      <CheckCircle size={18} weight="fill" style={{ color: BRAND.green, flexShrink: 0 }} />
                      <span style={{ fontSize: '14px', color: theme.textMuted, fontFamily: FONTS.body, fontWeight: '500' }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Illustration — Workspace Dashboard */}
              <div style={{ flex: '1.2', width: isMobile ? '100%' : 'auto', maxWidth: isMobile ? '100%' : '520px' }}>
                <div style={{
                  backgroundColor: theme.cardBg,
                  borderRadius: '20px',
                  border: `1px solid ${theme.cardBorder}`,
                  padding: isSmall ? '20px' : '28px',
                  boxShadow: isDark
                    ? '0 12px 48px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.03)'
                    : '0 12px 48px rgba(81,175,67,0.08), 0 0 0 1px rgba(81,175,67,0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                }}>
                  {/* Dashboard header */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px', paddingBottom: '16px', borderBottom: `1px solid ${theme.cardBorder}` }}>
                    <div>
                      <span style={{ fontSize: '15px', fontWeight: '700', color: theme.text, fontFamily: FONTS.heading, display: 'block', lineHeight: '1.2' }}>VA Workspace</span>
                      <span style={{ fontSize: '11px', color: theme.textMuted, fontFamily: FONTS.body }}>Today's operations</span>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '4px 12px',
                      borderRadius: '100px',
                      backgroundColor: isDark ? 'rgba(81,175,67,0.12)' : 'rgba(81,175,67,0.08)',
                    }}>
                      <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: BRAND.green, animation: 'pulse 2s ease-in-out infinite', boxShadow: `0 0 6px ${BRAND.green}60` }} />
                      <span style={{ fontSize: '12px', color: BRAND.green, fontFamily: FONTS.body, fontWeight: '700' }}>Active</span>
                    </div>
                  </div>

                  {/* Quick Stats Row */}
                  <div style={{ display: 'grid', gridTemplateColumns: isSmall ? '1fr' : '1fr 1fr 1fr', gap: '10px' }}>
                    {[
                      { label: 'Emails', value: '47', sub: 'processed' },
                      { label: 'Meetings', value: '6', sub: 'scheduled' },
                      { label: 'Reports', value: '3', sub: 'delivered' },
                    ].map((stat, i) => (
                      <div key={i} style={{
                        padding: isSmall ? '12px' : '14px',
                        backgroundColor: isDark ? '#1e1a16' : '#faf8f5',
                        borderRadius: '12px',
                        border: `1px solid ${isDark ? '#2a2420' : '#f0e8dc'}`,
                        textAlign: 'center',
                      }}>
                        <div style={{ fontSize: isSmall ? '22px' : '26px', fontWeight: '800', color: theme.text, fontFamily: FONTS.heading, lineHeight: '1', letterSpacing: '-0.02em' }}>{stat.value}</div>
                        <div style={{ fontSize: '11px', color: theme.textMuted, fontFamily: FONTS.body, fontWeight: '500', marginTop: '4px' }}>{stat.sub}</div>
                      </div>
                    ))}
                  </div>

                  {/* Inbox card */}
                  <div style={{
                    padding: isSmall ? '14px' : '18px',
                    backgroundColor: isDark ? '#1e1a16' : '#faf8f5',
                    borderRadius: '12px',
                    border: `1px solid ${isDark ? '#2a2420' : '#f0e8dc'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: isDark ? 'rgba(81,175,67,0.2)' : 'rgba(81,175,67,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Tray size={17} weight="duotone" style={{ color: BRAND.green }} />
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: theme.text, fontFamily: FONTS.body }}>Inbox</div>
                        <div style={{ fontSize: '11px', color: theme.textMuted, fontFamily: FONTS.body }}>All caught up</div>
                      </div>
                    </div>
                    <div style={{
                      padding: '5px 14px',
                      backgroundColor: isDark ? 'rgba(81,175,67,0.15)' : 'rgba(81,175,67,0.1)',
                      borderRadius: '100px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}>
                      <CheckCircle size={14} weight="fill" style={{ color: BRAND.green }} />
                      <span style={{ fontSize: '12px', fontWeight: '700', color: BRAND.green, fontFamily: FONTS.body }}>0 unread</span>
                    </div>
                  </div>

                  {/* Calendar card */}
                  <div style={{
                    padding: isSmall ? '14px' : '18px',
                    backgroundColor: isDark ? '#1e1a16' : '#faf8f5',
                    borderRadius: '12px',
                    border: `1px solid ${isDark ? '#2a2420' : '#f0e8dc'}`,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: isDark ? 'rgba(81,175,67,0.2)' : 'rgba(81,175,67,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Calendar size={17} weight="duotone" style={{ color: BRAND.green }} />
                        </div>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: theme.text, fontFamily: FONTS.body }}>Today's Schedule</div>
                      </div>
                      <span style={{ fontSize: '11px', color: theme.textMuted, fontFamily: FONTS.body }}>3 events</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {[
                        { time: '9:00 AM', event: 'Team standup', w: '60%' },
                        { time: '11:00 AM', event: 'Client call', w: '45%' },
                        { time: '2:00 PM', event: 'Review reports', w: '75%' },
                      ].map((item, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '12px', color: theme.textMuted, fontFamily: FONTS.body, minWidth: '64px', fontWeight: '500' }}>{item.time}</span>
                          <div style={{
                            height: '30px',
                            width: item.w,
                            backgroundColor: isDark ? `${BRAND.green}18` : `${BRAND.green}12`,
                            borderRadius: '8px',
                            borderLeft: `3px solid ${BRAND.green}`,
                            display: 'flex',
                            alignItems: 'center',
                            paddingLeft: '10px',
                          }}>
                            <span style={{ fontSize: '12px', fontWeight: '500', color: theme.text, fontFamily: FONTS.body }}>{item.event}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tasks card */}
                  <div style={{
                    padding: isSmall ? '14px' : '18px',
                    backgroundColor: isDark ? '#1e1a16' : '#faf8f5',
                    borderRadius: '12px',
                    border: `1px solid ${isDark ? '#2a2420' : '#f0e8dc'}`,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: isDark ? 'rgba(81,175,67,0.2)' : 'rgba(81,175,67,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <CheckSquare size={17} weight="duotone" style={{ color: BRAND.green }} />
                        </div>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: theme.text, fontFamily: FONTS.body }}>Tasks</div>
                      </div>
                      <span style={{ fontSize: '11px', color: BRAND.green, fontFamily: FONTS.body, fontWeight: '600' }}>4/5 done</span>
                    </div>
                    {/* Progress bar */}
                    <div style={{
                      height: '6px',
                      backgroundColor: isDark ? '#2a2420' : '#e8e0d4',
                      borderRadius: '100px',
                      overflow: 'hidden',
                      marginBottom: '14px',
                    }}>
                      <div style={{
                        height: '100%',
                        width: '80%',
                        borderRadius: '100px',
                        backgroundColor: BRAND.green,
                        transition: 'width 1s ease-out',
                      }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {[
                        { text: 'Send weekly report', done: true },
                        { text: 'Update CRM records', done: true },
                        { text: 'Organize Google Drive', done: true },
                        { text: 'Process expense receipts', done: true },
                        { text: 'Schedule client calls', done: false },
                      ].map((task, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '6px',
                            backgroundColor: task.done ? BRAND.green : 'transparent',
                            border: task.done ? 'none' : `2px solid ${theme.cardBorder}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}>
                            {task.done && <CheckCircle size={13} weight="bold" style={{ color: '#fff' }} />}
                          </div>
                          <span style={{
                            fontSize: '13px',
                            color: task.done ? theme.textMuted : theme.text,
                            fontFamily: FONTS.body,
                            fontWeight: task.done ? '400' : '500',
                            textDecoration: task.done ? 'line-through' : 'none',
                            opacity: task.done ? 0.6 : 1,
                          }}>
                            {task.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Hours Saved Stat */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: isSmall ? '14px' : '16px 18px',
                    backgroundColor: isDark ? `${BRAND.green}10` : `${BRAND.green}08`,
                    borderRadius: '12px',
                    border: `1px solid ${isDark ? `${BRAND.green}25` : `${BRAND.green}18`}`,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '8px',
                        backgroundColor: isDark ? `${BRAND.green}20` : `${BRAND.green}12`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <ChartLineUp size={16} weight="fill" style={{ color: BRAND.green }} />
                      </div>
                      <div>
                        <span style={{ fontSize: '12px', fontWeight: '600', color: theme.text, fontFamily: FONTS.body, display: 'block', lineHeight: '1.2' }}>Hours Saved This Week</span>
                        <span style={{ fontSize: '11px', color: theme.textMuted, fontFamily: FONTS.body }}>vs. doing it yourself</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '22px', fontWeight: '800', color: BRAND.green, fontFamily: FONTS.heading, lineHeight: '1' }}>18h</span>
                      <span style={{ fontSize: '11px', color: BRAND.green, fontFamily: FONTS.body, display: 'block', marginTop: '2px', fontWeight: '600' }}>+24%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* ============================================ */}
        {/* BOOK NOW CTA */}
        {/* ============================================ */}
        <section style={{
          padding: isSmall ? '56px 20px' : '80px 32px',
          backgroundColor: theme.bg,
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            opacity: isDark ? 0.04 : 0.05,
            backgroundImage: `radial-gradient(${BRAND.blue} 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
            pointerEvents: 'none',
          }} />
          <ScrollReveal>
            <div style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center', position: 'relative' }}>
              <h2 style={{
                fontSize: isSmall ? '30px' : '42px',
                fontWeight: '800',
                fontFamily: FONTS.heading,
                lineHeight: '1.15',
                marginBottom: '18px',
                color: theme.text,
                letterSpacing: '-0.02em',
              }}>
                Ready to Stop Doing{' '}
                <span style={{ color: BRAND.blue }}>Everything Yourself?</span>
              </h2>
              <p style={{
                fontSize: isSmall ? '16px' : '18px',
                color: theme.textMuted,
                lineHeight: '1.7',
                marginBottom: '32px',
                fontFamily: FONTS.body,
              }}>
                Book a free 30-minute discovery call. We'll find the bottlenecks and map out your automation roadmap — no pitch, just clarity.
              </p>
              <button
                onClick={() => navigate('/book')}
                style={{
                  height: '52px',
                  padding: '0 36px',
                  backgroundColor: BRAND.blue,
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '17px',
                  fontWeight: '700',
                  fontFamily: FONTS.body,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  boxShadow: '0 4px 16px rgba(0,74,172,0.3)',
                  transition: 'all 0.2s ease',
                  letterSpacing: '0.01em',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,74,172,0.4)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,74,172,0.3)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Book Now!
                <CaretRight size={18} weight="bold" />
              </button>
              <div style={{ display: 'flex', justifyContent: 'center', gap: isSmall ? '16px' : '28px', marginTop: '28px', flexWrap: 'wrap' }}>
                {[
                  'Free 30-min call',
                  'No obligation',
                  'Custom roadmap',
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle size={14} weight="fill" style={{ color: BRAND.green }} />
                    <span style={{ fontSize: '13px', color: theme.textMuted, fontFamily: FONTS.body, fontWeight: '500' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
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

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes servicesBtnPulse {
          0%, 100% { box-shadow: 0 2px 12px rgba(0,74,172,0.35); transform: scale(1); }
          50% { box-shadow: 0 4px 20px rgba(0,74,172,0.55), 0 0 0 4px rgba(0,74,172,0.12); transform: scale(1.04); }
        }
        @keyframes servicesBtnShimmer {
          0% { left: -100%; }
          60% { left: 100%; }
          100% { left: 100%; }
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
