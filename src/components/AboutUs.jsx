// AboutUs.jsx - About Us page for BrewedOps
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Code, Heart, Envelope, Phone, Sparkle, Lightning, Users, Target,
  Wallet, CheckSquare, FileText, Headset, Image, FilmStrip, NotePencil, QrCode,
  Coffee, Globe, Shield, DeviceMobile,
  Camera, ForkKnife, Timer, Barbell, ChartBar, Trophy,
  CaretDown, CaretRight, List, Lock,
  Scissors, ArrowsOut, ArrowsIn, ArrowsClockwise, Palette, FileImage,
  GitMerge, FileDashed, BookOpen, MagnifyingGlass, TextT, Hash,
  GitBranch, BracketsCurly, Clock, CurrencyDollar, Note,
  FileMagnifyingGlass, Headphones, GearSix, ClipboardText, CalendarCheck, CheckCircle, Handshake
} from '@phosphor-icons/react';
import ThemeToggle from './ui/ThemeToggle';
import SEO from './SEO';
import ScrollReveal from '@/components/ui/ScrollReveal';
const MobileDrawer = React.lazy(() => import('./layout/MobileDrawer'));

// BREWEDOPS BRAND
const BRAND = { brown: '#3F200C', blue: '#004AAC', green: '#51AF43', cream: '#FFF0D4' };
const FONTS = { heading: "'Montserrat', sans-serif", body: "'Poppins', sans-serif" };

// TOOLS DATA
const TOOL_CATEGORIES = [
  { name: 'Image Tools', tools: [
    { icon: Image, title: 'BG Remover', path: '/bgremover' },
    { icon: Scissors, title: 'Image Cropper', path: '/imagecropper' },
    { icon: ArrowsOut, title: 'Image Resizer', path: '/imageresizer' },
    { icon: ArrowsIn, title: 'Image Compressor', path: '/imagecompressor' },
    { icon: ArrowsClockwise, title: 'Image Converter', path: '/imageconverter' },
    { icon: Palette, title: 'Color Picker', path: '/colorpicker' },
    { icon: FileImage, title: 'Image to PDF', path: '/imagetopdf' },
  ]},
  { name: 'Video Tools', tools: [
    { icon: FilmStrip, title: 'Video Compressor', path: '/videocompressor' },
    { icon: Scissors, title: 'Video Trimmer', path: '/videotrimmer' },
  ]},
  { name: 'Document Tools', tools: [
    { icon: NotePencil, title: 'PDF Editor', path: '/pdfeditor' },
    { icon: GitMerge, title: 'PDF Merge', path: '/pdfmerge' },
    { icon: FileDashed, title: 'PDF Split', path: '/pdfsplit' },
    { icon: BookOpen, title: 'Markdown Viewer', path: '/markdownviewer' },
  ]},
  { name: 'Other Tools', tools: [
    { icon: QrCode, title: 'QR Generator', path: '/qrgenerator' },
    { icon: MagnifyingGlass, title: 'Find & Replace', path: '/findreplace' },
    { icon: TextT, title: 'Case Converter', path: '/caseconverter' },
    { icon: Hash, title: 'Word Counter', path: '/wordcounter' },
    { icon: GitBranch, title: 'Mermaid Reader', path: '/mermaid' },
    { icon: BracketsCurly, title: 'JSON Formatter', path: '/jsonformatter' },
    { icon: Clock, title: 'Cron Generator', path: '/crongenerator' },
    { icon: Globe, title: 'Timezone', path: '/timezoneconverter' },
    { icon: Timer, title: 'Focus Timer', path: '/pomodoro' },
  ]},
];

const PRODUCTIVITY_TOOLS = [
  { icon: CurrencyDollar, title: 'Finance Tracker', path: '/finance' },
  { icon: DeviceMobile, title: 'VA Kita', path: '/vakita' },
  { icon: CheckSquare, title: 'Task Manager', path: '/taskmanager' },
  { icon: Note, title: 'Brewed Notes', path: '/brewednotes' },
];

const AI_TOOLS = [
  { icon: Lightning, title: 'GHL Scenario Generator', path: '/ghl-scenario', description: 'Generate GoHighLevel automation scenarios with AI' },
  { icon: FileMagnifyingGlass, title: 'AI Text Extractor', path: '/text-extractor', description: 'Extract text from images using AI-powered OCR' },
];

// TOOLS DROPDOWN
const ToolsDropdown = ({ isDark, theme, onToolClick }) => {
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
      <button style={{ height: '40px', padding: '0 12px', backgroundColor: 'transparent', color: isOpen ? BRAND.blue : theme.text, border: 'none', fontSize: '14px', fontWeight: '500', fontFamily: FONTS.body, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
        Tools <CaretDown size={14} style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
      </button>
      {isOpen && (
        <div style={{ position: 'absolute', top: '100%', left: '0', marginTop: '4px', backgroundColor: isDark ? '#171411' : '#ffffff', border: `1px solid ${isDark ? '#2a2420' : '#e8e0d4'}`, borderRadius: '12px', boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.5)' : '0 8px 32px rgba(0,0,0,0.1)', padding: '12px', zIndex: 1000 }}>
          <div style={{ display: 'flex', gap: '20px' }}>
            {TOOL_CATEGORIES.map((category) => (
              <div key={category.name} style={{ minWidth: '130px' }}>
                <div style={{ fontSize: '10px', fontWeight: '600', color: theme.textMuted, letterSpacing: '0.5px', marginBottom: '6px', textTransform: 'uppercase', fontFamily: FONTS.body }}>{category.name}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                  {category.tools.map((tool) => {
                    const IconComponent = tool.icon;
                    return (
                      <button key={tool.path} onClick={() => { setIsOpen(false); onToolClick(tool.path); }}
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
          <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: `1px solid ${theme.cardBorder}`, display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', fontWeight: '600', color: BRAND.blue, fontFamily: FONTS.body }}><Lock size={10} /> PRODUCTIVITY</div>
              {PRODUCTIVITY_TOOLS.map((tool) => { const IconComponent = tool.icon; return (<div key={tool.path} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: theme.textMuted, fontFamily: FONTS.body }}><IconComponent size={11} />{tool.title}</div>); })}
            </div>
            <span style={{ fontSize: '10px', color: theme.textMuted, fontFamily: FONTS.body, whiteSpace: 'nowrap' }}>Coming soon</span>
          </div>
        </div>
      )}
    </div>
  );
};

// AI TOOLS DROPDOWN
const AIToolsDropdown = ({ isDark, theme, onToolClick }) => {
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
      <button style={{ height: '40px', padding: '0 12px', backgroundColor: 'transparent', color: isOpen ? BRAND.blue : theme.text, border: 'none', fontSize: '14px', fontWeight: '500', fontFamily: FONTS.body, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
        AI Tools <CaretDown size={14} style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
      </button>
      {isOpen && (
        <div style={{ position: 'absolute', top: '100%', left: '0', marginTop: '4px', backgroundColor: isDark ? '#171411' : '#ffffff', border: `1px solid ${isDark ? '#2a2420' : '#e8e0d4'}`, borderRadius: '12px', boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.5)' : '0 8px 32px rgba(0,0,0,0.1)', padding: '12px', zIndex: 1000, minWidth: '240px' }}>
          <div style={{ fontSize: '10px', fontWeight: '600', color: theme.textMuted, letterSpacing: '0.5px', marginBottom: '6px', textTransform: 'uppercase', fontFamily: FONTS.body }}>AI-Powered Tools</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {AI_TOOLS.map((tool) => { const IconComponent = tool.icon; return (
              <button key={tool.path} onClick={() => { setIsOpen(false); onToolClick(tool.path); }}
                style={{ padding: '8px 10px', backgroundColor: 'transparent', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: '10px', textAlign: 'left' }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = BRAND.blue; Array.from(e.currentTarget.querySelectorAll('svg, span')).forEach(el => el.style.color = '#fff'); }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; const spans = e.currentTarget.querySelectorAll('span'); if (spans[0]) spans[0].style.color = theme.text; if (spans[1]) spans[1].style.color = theme.textMuted; e.currentTarget.querySelector('svg').style.color = BRAND.blue; }}
              >
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: BRAND.blue + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><IconComponent size={16} weight="fill" style={{ color: BRAND.blue }} /></div>
                <div><span style={{ fontSize: '13px', fontWeight: '600', color: theme.text, fontFamily: FONTS.body, display: 'block' }}>{tool.title}</span><span style={{ fontSize: '11px', color: theme.textMuted, fontFamily: FONTS.body, display: 'block', marginTop: '2px' }}>{tool.description}</span></div>
              </button>
            ); })}
          </div>
        </div>
      )}
    </div>
  );
};

// APPS DROPDOWN
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
      <button style={{ height: '40px', padding: '0 12px', backgroundColor: 'transparent', color: isOpen ? '#14b8a6' : theme.text, border: 'none', fontSize: '14px', fontWeight: '500', fontFamily: FONTS.body, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
        Apps <CaretDown size={14} style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
      </button>
      {isOpen && (
        <div style={{ position: 'absolute', top: '100%', left: '0', marginTop: '4px', backgroundColor: isDark ? '#171411' : '#ffffff', border: `1px solid ${isDark ? '#2a2420' : '#e8e0d4'}`, borderRadius: '12px', boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.5)' : '0 8px 32px rgba(0,0,0,0.1)', padding: '12px', zIndex: 1000, minWidth: '200px' }}>
          <div style={{ fontSize: '10px', fontWeight: '600', color: theme.textMuted, letterSpacing: '0.5px', marginBottom: '6px', textTransform: 'uppercase', fontFamily: FONTS.body }}>Mobile Apps</div>
          <button onClick={() => { setIsOpen(false); onAppClick('/fuelyx'); }}
            style={{ padding: '8px 10px', backgroundColor: 'transparent', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: '10px', textAlign: 'left', width: '100%' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#14b8a6'; Array.from(e.currentTarget.querySelectorAll('svg, span')).forEach(el => el.style.color = '#fff'); }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; const spans = e.currentTarget.querySelectorAll('span'); if (spans[0]) spans[0].style.color = theme.text; if (spans[1]) spans[1].style.color = theme.textMuted; e.currentTarget.querySelector('svg').style.color = '#14b8a6'; }}
          >
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#14b8a618', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><DeviceMobile size={16} weight="fill" style={{ color: '#14b8a6' }} /></div>
            <div><span style={{ fontSize: '13px', fontWeight: '600', color: theme.text, fontFamily: FONTS.body, display: 'block' }}>Fuelyx</span><span style={{ fontSize: '11px', color: theme.textMuted, fontFamily: FONTS.body, display: 'block', marginTop: '2px' }}>Filipino nutrition tracker</span></div>
          </button>
        </div>
      )}
    </div>
  );
};

const AboutUs = ({ onBack, onNavigate, isDark, setIsDark }) => {
  const navigate = useNavigate();
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const isMobile = windowWidth < 640;
  const isDesktop = windowWidth >= 1024;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const theme = {
    bg: isDark ? '#0d0b09' : '#faf8f5',
    text: isDark ? '#f5f0eb' : '#3F200C',
    textMuted: isDark ? '#a09585' : '#7a6652',
    cardBg: isDark ? '#171411' : '#ffffff',
    cardBorder: isDark ? '#2a2420' : '#e8e0d4',
  };

  const navLinkStyle = {
    fontSize: '14px',
    fontWeight: '500',
    color: theme.textMuted,
    textDecoration: 'none',
    fontFamily: FONTS.body,
    padding: '0 8px',
  };

  const stats = [
    { value: '3', label: 'Core Services' },
    { value: '22+', label: 'Free Tools' },
    { value: '1', label: 'Mobile App' },
    { value: '24/7', label: 'Available' },
  ];

  const toolCategories = [
    { name: 'Productivity', count: 4, icon: Wallet, color: '#004AAC', tools: 'Finance Tracker, VA Kita, Task Manager, Brewed Notes' },
    { name: 'Image Tools', count: 7, icon: Image, color: '#8b5cf6', tools: 'BG Remover, Cropper, Resizer, Compressor, Converter, Color Picker, Image to PDF' },
    { name: 'Video Tools', count: 2, icon: FilmStrip, color: '#ef4444', tools: 'Video Compressor, Video Trimmer' },
    { name: 'Document Tools', count: 4, icon: NotePencil, color: '#22c55e', tools: 'PDF Editor, PDF Merge, PDF Split, Markdown Viewer' },
    { name: 'Other Tools', count: 9, icon: QrCode, color: '#f59e0b', tools: 'QR Generator, Find & Replace, Case Converter, Word Counter, Mermaid Reader, JSON Formatter, Cron Generator, Timezone, Focus Timer' },
  ];

  return (
    <>
    <SEO
      title="About Us | BrewedOps"
      description="BrewedOps offers HighLevel automation, customer support, and virtual assistant services — plus 22+ free productivity tools for VAs and freelancers."
      keywords="BrewedOps about, GoHighLevel automation, customer support, virtual assistant, Filipino VA, freelancer tools"
    />
    <div style={{
      minHeight: '100vh',
      backgroundColor: theme.bg,
      display: 'flex',
      flexDirection: 'column',
      fontFamily: FONTS.heading
    }}>
      {/* NAV */}
      <nav style={{
        padding: isMobile ? '12px 16px' : '12px 32px',
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
          <div onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginRight: '20px', cursor: 'pointer' }}>
            <img src="/BrewedOpsLogo-64.png" alt="BrewedOps Logo" width={32} height={32} style={{ width: '32px', height: '32px', borderRadius: '8px' }} />
            <span style={{ fontSize: '18px', fontWeight: '700', fontFamily: FONTS.heading }}>
              <span style={{ color: isDark ? '#fff' : BRAND.brown }}>Brewed</span>
              <span style={{ color: BRAND.blue }}>Ops</span>
            </span>
          </div>
          {isDesktop && (
            <>
              <button onClick={() => navigate('/')} style={{ height: '40px', padding: '0 12px', backgroundColor: 'transparent', color: theme.textMuted, border: 'none', fontSize: '14px', fontWeight: '500', fontFamily: FONTS.body, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>Home</button>
              <button onClick={() => navigate('/portfolio')} style={{ height: '40px', padding: '0 12px', backgroundColor: 'transparent', color: theme.textMuted, border: 'none', fontSize: '14px', fontWeight: '500', fontFamily: FONTS.body, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>Portfolio</button>
              <ToolsDropdown isDark={isDark} theme={theme} onToolClick={(path) => navigate(path)} />
              <AIToolsDropdown isDark={isDark} theme={theme} onToolClick={(path) => navigate(path)} />
              <AppsDropdown isDark={isDark} theme={theme} onAppClick={(path) => navigate(path)} />
            </>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {isDesktop && (
            <>
              <button style={{ height: '40px', padding: '0 12px', backgroundColor: 'transparent', color: BRAND.blue, border: 'none', fontSize: '14px', fontWeight: '600', fontFamily: FONTS.body, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>About</button>
              <a href="/privacy" style={navLinkStyle}>Privacy</a>
            </>
          )}
          {setIsDark && (
            <ThemeToggle isDark={isDark} setIsDark={setIsDark} />
          )}
          {isDesktop ? (
            <button
              onClick={() => navigate('/services')}
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
                boxShadow: '0 2px 12px rgba(0,74,172,0.35)',
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

      <style>{`
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
      <React.Suspense fallback={null}>
        <MobileDrawer
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          isDark={isDark}
          navigate={navigate}
          onNavigate={onNavigate}
        />
      </React.Suspense>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '40px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          {/* Hero Section */}
          <ScrollReveal>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <div style={{
              width: '80px',
              height: '80px',
              backgroundColor: isDark ? '#004AAC20' : '#004AAC15',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px'
            }}>
              <Coffee style={{ width: '40px', height: '40px', color: '#004AAC' }} />
            </div>
            <h1 style={{ 
              fontSize: '42px', 
              fontWeight: '800', 
              color: theme.text, 
              margin: '0 0 16px',
              letterSpacing: '-1px'
            }}>
              About <span style={{ color: BRAND.blue }}>BrewedOps</span>
            </h1>
            <p style={{
              fontSize: '18px',
              color: theme.textMuted,
              margin: 0,
              lineHeight: '1.6',
              maxWidth: '640px',
              marginLeft: 'auto',
              marginRight: 'auto'
            }}>
              HighLevel automation, customer support, and virtual assistant services — backed by 22+ free tools built for VAs and freelancers.
            </p>
          </div>
          </ScrollReveal>

          {/* Stats */}
          <ScrollReveal delay={0.1}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '16px',
            marginBottom: '48px'
          }}>
            {stats.map((stat, idx) => (
              <div key={idx} style={{
                padding: '24px 16px',
                backgroundColor: theme.cardBg,
                borderRadius: '12px',
                border: `1px solid ${theme.cardBorder}`,
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '32px', fontWeight: '800', color: BRAND.blue, marginBottom: '4px' }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '13px', color: theme.textMuted, fontWeight: '500' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
          </ScrollReveal>

          {/* Core Services */}
          <ScrollReveal>
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: theme.text, margin: '0 0 20px', textAlign: 'center' }}>
              What We Do
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '16px' }}>
              {[
                {
                  icon: GearSix, color: '#f59e0b', title: 'HighLevel Automation',
                  desc: 'We build GoHighLevel workflows that capture leads, nurture them automatically, and book appointments — zero manual follow-up.',
                  items: ['CRM Setup & Build', 'Workflow Automation', 'Pipeline Management', 'Smart Notifications'],
                },
                {
                  icon: Headphones, color: BRAND.blue, title: 'Customer Support',
                  desc: 'Every email answered. Every chat handled. Every call picked up. Your customers get white-glove service without you lifting a finger.',
                  items: ['Email & Ticket Support', 'Live Chat Handling', 'Phone Support', 'Client Onboarding'],
                },
                {
                  icon: ClipboardText, color: BRAND.green, title: 'Virtual Assistant',
                  desc: 'Inbox drowning? Calendar chaos? We take over the operational tasks that eat your hours so you can run the business.',
                  items: ['Inbox Management', 'Calendar & Scheduling', 'Data Entry & Reporting', 'CRM Updates'],
                },
              ].map((service, idx) => {
                const ServiceIcon = service.icon;
                return (
                  <div key={idx} style={{
                    padding: '28px 24px',
                    backgroundColor: theme.cardBg,
                    borderRadius: '16px',
                    border: `1px solid ${theme.cardBorder}`,
                    borderTop: `3px solid ${service.color}`,
                  }}>
                    <div style={{
                      width: '48px', height: '48px', borderRadius: '12px',
                      backgroundColor: `${service.color}18`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      marginBottom: '16px',
                    }}>
                      <ServiceIcon size={24} weight="fill" style={{ color: service.color }} />
                    </div>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: theme.text, margin: '0 0 10px', fontFamily: FONTS.heading }}>
                      {service.title}
                    </h3>
                    <p style={{ fontSize: '14px', color: theme.textMuted, lineHeight: '1.7', margin: '0 0 16px', fontFamily: FONTS.body }}>
                      {service.desc}
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {service.items.map((item, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <CheckCircle size={14} weight="fill" style={{ color: service.color, flexShrink: 0 }} />
                          <span style={{ fontSize: '13px', color: theme.textMuted, fontFamily: FONTS.body, fontWeight: '500' }}>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ textAlign: 'center', marginTop: '24px' }}>
              <button
                onClick={() => navigate('/services')}
                style={{
                  height: '46px', padding: '0 28px',
                  backgroundColor: BRAND.blue, color: '#fff', border: 'none',
                  borderRadius: '10px', fontSize: '15px', fontWeight: '600',
                  fontFamily: FONTS.body, cursor: 'pointer',
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  boxShadow: '0 4px 16px rgba(0,74,172,0.3)',
                }}
              >
                View All Services <CaretRight size={16} weight="bold" />
              </button>
            </div>
          </div>
          </ScrollReveal>

          {/* Story Section */}
          <ScrollReveal>
          <div style={{
            padding: '32px',
            backgroundColor: theme.cardBg,
            borderRadius: '16px',
            border: '1px solid ' + theme.cardBorder,
            marginBottom: '32px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                backgroundColor: isDark ? '#22c55e20' : '#22c55e15',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Code style={{ width: '22px', height: '22px', color: '#22c55e' }} />
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: '700', color: theme.text, margin: 0 }}>
                The BrewedOps Story
              </h2>
            </div>
            <p style={{
              fontSize: '16px',
              color: theme.textMuted,
              lineHeight: '1.8',
              margin: '0 0 16px'
            }}>
              BrewedOps was created by <strong style={{ color: theme.text }}>Kenneth</strong> — a Filipino virtual assistant
              and developer who understands the daily grind of remote work firsthand. What started as a personal tool to manage
              freelance finances evolved into a full service business offering <strong style={{ color: theme.text }}>GoHighLevel automation,
              customer support, and virtual assistant services</strong> to businesses that want to scale without burning out.
            </p>
            <p style={{
              fontSize: '16px',
              color: theme.textMuted,
              lineHeight: '1.8',
              margin: 0
            }}>
              Along the way, Kenneth built <strong style={{ color: theme.text }}>22+ free productivity tools</strong> and a
              mobile nutrition app (<strong style={{ color: '#14b8a6' }}>Fuelyx</strong>) — all through vibe coding, a creative
              approach where ideas flow naturally into functional software. Every tool and service at BrewedOps was built with
              intention, understanding the unique challenges of working remotely for clients around the world.
            </p>
          </div>
          </ScrollReveal>

          {/* Tools Overview */}
          <ScrollReveal>
          <div style={{
            padding: '32px',
            backgroundColor: isDark ? '#18181b' : '#f9fafb',
            borderRadius: '16px',
            border: '1px solid ' + theme.cardBorder,
            marginBottom: '32px'
          }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: theme.text, margin: '0 0 24px', textAlign: 'center' }}>
              22+ Tools Across 5 Categories
            </h2>
            <div style={{ display: 'grid', gap: '16px' }}>
              {toolCategories.map((cat, idx) => (
                <div key={idx} style={{
                  padding: '20px',
                  backgroundColor: theme.cardBg,
                  borderRadius: '12px',
                  border: `1px solid ${theme.cardBorder}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px'
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: `${cat.color}15`,
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <cat.icon size={24} style={{ color: cat.color }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: '600', color: theme.text, margin: 0 }}>
                        {cat.name}
                      </h3>
                      <span style={{
                        padding: '2px 8px',
                        backgroundColor: `${cat.color}20`,
                        color: cat.color,
                        borderRadius: '100px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        {cat.count} tools
                      </span>
                    </div>
                    <p style={{ fontSize: '13px', color: theme.textMuted, margin: 0 }}>
                      {cat.tools}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          </ScrollReveal>

          {/* Fuelyx Mobile App Section */}
          <ScrollReveal>
          <div style={{
            padding: '32px',
            backgroundColor: isDark ? '#0f172a' : '#f0fdfa',
            borderRadius: '16px',
            border: '1px solid ' + (isDark ? '#14b8a640' : '#14b8a630'),
            marginBottom: '32px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
              <img 
                src="https://i.imgur.com/RufDQlF.png" 
                alt="Fuelyx Logo" 
                style={{ width: '56px', height: '56px', borderRadius: '14px' }}
              />
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: '700', color: theme.text, margin: 0 }}>
                  Fuelyx <span style={{ color: '#14b8a6' }}>Mobile App</span>
                </h2>
                <p style={{ fontSize: '14px', color: theme.textMuted, margin: '4px 0 0' }}>
                  Nutrition & Fitness Tracker for Filipinos
                </p>
              </div>
            </div>
            
            <p style={{ 
              fontSize: '16px', 
              color: theme.textMuted, 
              lineHeight: '1.8',
              margin: '0 0 20px'
            }}>
              <strong style={{ color: theme.text }}>Fuelyx</strong> is our standalone Android mobile app designed to help Filipinos 
              track their nutrition, fitness, and health goals. Built with the same vibe coding approach as BrewedOps, 
              it features a comprehensive database of <strong style={{ color: theme.text }}>200+ Filipino foods</strong>.
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
              {[
                { icon: Camera, title: 'AI Food Scanner', desc: 'Snap & log food instantly', color: '#8b5cf6' },
                { icon: ForkKnife, title: '200+ Filipino Foods', desc: 'Local dishes database', color: '#f97316' },
                { icon: Timer, title: 'Fasting Timer', desc: '6 IF protocols supported', color: '#0ea5e9' },
                { icon: Barbell, title: 'Workout Tracking', desc: 'Log exercises & calories', color: '#ec4899' },
                { icon: ChartBar, title: 'Smart Analytics', desc: 'Charts & progress insights', color: '#10b981' },
                { icon: Trophy, title: 'Achievements', desc: 'Streaks & badge rewards', color: '#f59e0b' },
              ].map((feature, idx) => (
                <div key={idx} style={{
                  padding: '16px',
                  backgroundColor: theme.cardBg,
                  borderRadius: '10px',
                  border: '1px solid ' + theme.cardBorder,
                }}>
                  <feature.icon size={24} style={{ color: feature.color, marginBottom: '8px' }} />
                  <div style={{ fontSize: '14px', fontWeight: '600', color: theme.text, marginBottom: '4px' }}>{feature.title}</div>
                  <div style={{ fontSize: '12px', color: theme.textMuted }}>{feature.desc}</div>
                </div>
              ))}
            </div>
            
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <a 
                href="/fuelyx"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #14b8a6, #10b981)',
                  color: '#fff',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                <DeviceMobile size={18} />
                Learn More & Download
              </a>
            </div>
          </div>
          </ScrollReveal>

          {/* Why BrewedOps */}
          <ScrollReveal>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '32px'
          }}>
            {[
              { icon: Lightning, color: '#f59e0b', title: 'Real Results', desc: 'Automation that saves hours, not just looks pretty' },
              { icon: Handshake, color: BRAND.blue, title: 'Human + Systems', desc: 'Real people backed by smart automation' },
              { icon: Shield, color: BRAND.green, title: 'Reliable & Secure', desc: 'Your operations and data stay safe with us' },
              { icon: CalendarCheck, color: '#8b5cf6', title: 'Free Discovery Call', desc: '30-min call to map your automation roadmap' },
            ].map((item, idx) => {
              const ItemIcon = item.icon;
              return (
                <div key={idx} style={{
                  padding: '24px',
                  backgroundColor: theme.cardBg,
                  borderRadius: '12px',
                  border: '1px solid ' + theme.cardBorder,
                  textAlign: 'center'
                }}>
                  <ItemIcon size={32} weight="fill" style={{ color: item.color, margin: '0 auto 12px', display: 'block' }} />
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: theme.text, margin: '0 0 8px', fontFamily: FONTS.heading }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0, fontFamily: FONTS.body }}>
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
          </ScrollReveal>

          {/* Contact Section */}
          <ScrollReveal>
          <div style={{
            padding: '32px',
            backgroundColor: isDark ? '#004AAC15' : '#004AAC10',
            borderRadius: '16px',
            border: '1px solid #004AAC40',
            textAlign: 'center'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              backgroundColor: isDark ? '#004AAC30' : '#004AAC20',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px'
            }}>
              <Heart style={{ width: '28px', height: '28px', color: '#004AAC' }} />
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: theme.text, margin: '0 0 12px' }}>
              Get in Touch
            </h2>
            <p style={{ 
              fontSize: '15px', 
              color: theme.textMuted, 
              margin: '0 0 24px',
              lineHeight: '1.6'
            }}>
              Have questions, feedback, or just want to say hello? We'd love to hear from you!
            </p>
            
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '16px',
              maxWidth: '320px',
              margin: '0 auto'
            }}>
              <a 
                href="mailto:brewedops@gmail.com"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  padding: '14px 24px',
                  backgroundColor: theme.cardBg,
                  borderRadius: '10px',
                  border: '1px solid ' + theme.cardBorder,
                  textDecoration: 'none',
                  color: theme.text,
                  fontSize: '15px',
                  fontWeight: '500'
                }}
              >
                <Envelope style={{ width: '20px', height: '20px', color: '#004AAC' }} />
                brewedops@gmail.com
              </a>
              <a 
                href="tel:+639933074618"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  padding: '14px 24px',
                  backgroundColor: theme.cardBg,
                  borderRadius: '10px',
                  border: '1px solid ' + theme.cardBorder,
                  textDecoration: 'none',
                  color: theme.text,
                  fontSize: '15px',
                  fontWeight: '500'
                }}
              >
                <Phone style={{ width: '20px', height: '20px', color: '#22c55e' }} />
                +63 993 307 4618
              </a>
            </div>
          </div>
          </ScrollReveal>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ 
        padding: '24px', 
        borderTop: '1px solid ' + theme.cardBorder,
        textAlign: 'center'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '24px', 
          marginBottom: '12px',
          flexWrap: 'wrap'
        }}>
          <button 
            onClick={() => onNavigate('privacy')}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: theme.textMuted, 
              fontSize: '13px', 
              cursor: 'pointer',
              fontFamily: FONTS.body
            }}
          >
            Privacy Policy
          </button>
          <button 
            onClick={() => onNavigate('terms')}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: theme.textMuted, 
              fontSize: '13px', 
              cursor: 'pointer',
              fontFamily: FONTS.body
            }}
          >
            Terms of Service
          </button>
          <button 
            onClick={() => onNavigate('about')}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: '#004AAC', 
              fontSize: '13px', 
              cursor: 'pointer',
              fontWeight: '600',
              fontFamily: FONTS.body
            }}
          >
            About Us
          </button>
        </div>
        <p style={{ fontSize: '13px', color: theme.textMuted, margin: 0 }}>
          © {new Date().getFullYear()} BrewedOps by Kenneth V. All rights reserved.
        </p>
      </footer>
    </div>
    </>
  );
};

export default AboutUs;
