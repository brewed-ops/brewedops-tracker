/**
 * FuelyxPage Component
 * Landing page for Fuelyx nutrition tracking app
 * Route: /fuelyx
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CaretRight, CaretDown, Sun, Moon, CaretLeft,
  DeviceMobile, Lightning, Target, TrendUp, Clock, Camera,
  AppleLogo, Barbell, ChartBar, Heart, Shield, Star,
  Download, Play, Check, ArrowRight, Sparkle, Trophy,
  Fire, Scales, ForkKnife, Timer, Pulse, Medal,
  Warning, Info, GearSix, List,
  Image, Scissors, ArrowsOut, ArrowsIn, ArrowsClockwise, Palette, FileImage,
  FilmStrip, NotePencil, GitMerge, FileDashed, BookOpen, QrCode,
  MagnifyingGlass, TextT, Hash, GitBranch, BracketsCurly, Globe,
  Lock, CurrencyDollar, Note, CheckSquare, FileMagnifyingGlass
} from '@phosphor-icons/react';
import SEO from './SEO';
import ScrollReveal from '@/components/ui/ScrollReveal';
const MobileDrawer = React.lazy(() => import('./layout/MobileDrawer'));

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

// Fuelyx brand colors
const FUELYX = {
  primary: '#14b8a6', // Teal
  secondary: '#10b981', // Emerald
  accent: '#0d9488',
  dark: '#0f172a',
  light: '#f0fdfa',
};

const getTheme = (isDark) => ({
  bg: isDark ? '#0d0b09' : '#faf8f5',
  cardBg: isDark ? '#171411' : '#ffffff',
  cardBorder: isDark ? '#2a2420' : '#e8e0d4',
  text: isDark ? '#f5f0eb' : '#3F200C',
  textMuted: isDark ? '#a09585' : '#7a6652',
  textFaint: isDark ? '#6b5f52' : '#a09585',
});

// ============================================
// TOOLS DATA
// ============================================
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

// ============================================
// TOOLS DROPDOWN
// ============================================
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
        Tools
        <CaretDown size={14} style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
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
            <span style={{ fontSize: '10px', color: theme.textMuted, fontFamily: FONTS.body, whiteSpace: 'nowrap' }}>Coming soon</span>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================
// AI TOOLS DROPDOWN
// ============================================
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
                <button key={tool.path} onClick={() => { setIsOpen(false); onToolClick(tool.path); }}
                  style={{ padding: '8px 10px', backgroundColor: 'transparent', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: '10px', textAlign: 'left' }}
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
      <button style={{ height: '40px', padding: '0 12px', backgroundColor: 'transparent', color: isOpen ? '#14b8a6' : theme.text, border: 'none', fontSize: '14px', fontWeight: '500', fontFamily: FONTS.body, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
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
// FUELYX PAGE COMPONENT
// ============================================
const FuelyxPage = ({ isDark, setIsDark }) => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const theme = getTheme(isDark);
  
  // Responsive breakpoints
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const isMobile = windowWidth < 640;
  const isTablet = windowWidth < 1024;
  const isDesktop = windowWidth >= 1024;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Features data
  const features = [
    { icon: Camera, title: 'AI Food Scanner', description: 'Snap a photo and instantly get nutritional info with AI-powered recognition', color: '#8b5cf6' },
    { icon: ForkKnife, title: '200+ Filipino Foods', description: 'Comprehensive database including local dishes, street food, and regional cuisines', color: '#f97316' },
    { icon: Timer, title: 'Fasting Timer', description: 'Built-in intermittent fasting tracker with multiple protocols (16:8, 18:6, 20:4)', color: '#0ea5e9' },
    { icon: Barbell, title: 'Workout Tracking', description: 'Log exercises, track calories burned, and monitor your fitness progress', color: '#ec4899' },
    { icon: ChartBar, title: 'Smart Analytics', description: 'Visualize your progress with beautiful charts and detailed insights', color: '#10b981' },
    { icon: Trophy, title: 'Achievements & Streaks', description: 'Stay motivated with badges, streaks, and milestone celebrations', color: '#f59e0b' },
  ];

  // Benefits data
  const benefits = [
    { icon: Target, text: 'Set personalized calorie & macro goals' },
    { icon: Scales, text: 'Track weight with visual progress charts' },
    { icon: Pulse, text: 'Monitor daily steps with pedometer' },
    { icon: Fire, text: 'Build healthy habits with streak tracking' },
    { icon: Shield, text: 'Your data stays private and secure' },
    { icon: Lightning, text: 'Works offline - no internet required' },
  ];

  // Testimonials
  const testimonials = [
    { name: 'Maria S.', role: 'Lost 12kg in 3 months', text: 'Finally an app that has Filipino foods! Nakaka-track na ng adobo at sinigang ko.', avatar: '👩' },
    { name: 'John D.', role: 'Fitness enthusiast', text: 'The fasting timer and workout tracking combo is perfect for my routine.', avatar: '👨' },
    { name: 'Anna R.', role: 'Busy mom', text: 'Simple and easy to use. The AI scanner saves me so much time logging meals.', avatar: '👩‍👧' },
  ];

  const navLinkStyle = {
    fontSize: '14px',
    fontWeight: '500',
    color: theme.textMuted,
    textDecoration: 'none',
    fontFamily: FONTS.body,
    padding: '0 12px',
    cursor: 'pointer',
    transition: 'color 0.2s',
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: isDark ? '#0a0a0b' : '#ffffff', fontFamily: FONTS.body }}>
      <SEO
        title="Fuelyx - Filipino Food Nutrition Tracker | BrewedOps"
        description="Track Filipino food nutrition, calories, and macros with Fuelyx. AI-powered food scanner built for Pinoy meals. Free download by BrewedOps."
        keywords="Fuelyx, Filipino food tracker, nutrition tracker, calorie counter, Filipino meals, BrewedOps"
      />

      {/* ==================== NAVIGATION ==================== */}
      <nav style={{ 
        padding: isMobile ? '12px 16px' : '12px 32px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        borderBottom: isScrolled ? '1px solid ' + theme.cardBorder : '1px solid transparent',
        backgroundColor: isDark ? 'rgba(10,10,11,0.95)' : 'rgba(255,255,255,0.95)',
        transition: 'border-color 0.3s',
        backdropFilter: 'blur(12px)',
        position: 'sticky', 
        top: 0, 
        zIndex: 100,
        transition: 'all 0.3s',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {/* Logo */}
          <div 
            onClick={() => navigate('/')}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', marginRight: '20px', cursor: 'pointer' }}
          >
            <img src="https://i.imgur.com/R52jwPvt.png" alt="BrewedOps Logo" width={32} height={32} style={{ width: '32px', height: '32px', borderRadius: '8px' }} />
            <span style={{ fontSize: '18px', fontWeight: '700', fontFamily: FONTS.heading }}>
              <span style={{ color: isDark ? '#fff' : BRAND.brown }}>Brewed</span>
              <span style={{ color: BRAND.blue }}>Ops</span>
            </span>
          </div>
          
          {/* Nav Links - Desktop */}
          {!isMobile && (
            <>
              <button onClick={() => navigate('/')} style={{ height: '40px', padding: '0 12px', backgroundColor: 'transparent', color: theme.textMuted, border: 'none', fontSize: '14px', fontWeight: '500', fontFamily: FONTS.body, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                Home
              </button>
              <button onClick={() => navigate('/portfolio')} style={{ height: '40px', padding: '0 12px', backgroundColor: 'transparent', color: theme.textMuted, border: 'none', fontSize: '14px', fontWeight: '500', fontFamily: FONTS.body, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                Portfolio
              </button>
              <ToolsDropdown isDark={isDark} theme={theme} onToolClick={(path) => navigate(path)} />
              <AIToolsDropdown isDark={isDark} theme={theme} onToolClick={(path) => navigate(path)} />
              <AppsDropdown isDark={isDark} theme={theme} onAppClick={(path) => navigate(path)} />
            </>
          )}
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {!isMobile && (
            <>
              <a href="/about" style={navLinkStyle}>About</a>
              <a href="/privacy" style={navLinkStyle}>Privacy</a>
            </>
          )}
          <button
            onClick={() => setIsDark(!isDark)}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            style={{
              width: '36px',
              height: '36px',
              backgroundColor: 'transparent',
              border: '1px solid ' + theme.cardBorder,
              borderRadius: '8px',
              color: theme.textMuted,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          {!isMobile ? (
            <button
              onClick={() => navigate('/services')}
              style={{
                position: 'relative',
                overflow: 'hidden',
                marginLeft: '8px',
                height: '38px',
                padding: '0 22px',
                backgroundColor: '#004AAC',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '500',
                fontFamily: "'Poppins', sans-serif",
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
            <button onClick={() => setMobileMenuOpen(true)} aria-label="Open navigation menu" style={{ width: '36px', height: '36px', backgroundColor: 'transparent', border: '1px solid ' + theme.cardBorder, borderRadius: '8px', color: theme.textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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

      <main>
      {/* ==================== HERO SECTION ==================== */}
      <section id="main-content" style={{
        background: isDark 
          ? 'linear-gradient(135deg, #0a0a0b 0%, #0f172a 50%, #134e4a 100%)'
          : 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 50%, #99f6e4 100%)',
        padding: isMobile ? '60px 20px 80px' : '100px 64px 120px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative elements */}
        <div style={{
          position: 'absolute',
          top: '10%',
          right: '5%',
          width: '400px',
          height: '400px',
          background: `radial-gradient(circle, ${FUELYX.primary}20 0%, transparent 70%)`,
          borderRadius: '50%',
          filter: 'blur(60px)',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '20%',
          left: '10%',
          width: '300px',
          height: '300px',
          background: `radial-gradient(circle, ${FUELYX.secondary}15 0%, transparent 70%)`,
          borderRadius: '50%',
          filter: 'blur(40px)',
        }} />
        
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ 
            display: 'flex', 
            flexDirection: isTablet ? 'column' : 'row',
            alignItems: 'center',
            gap: isTablet ? '48px' : '80px',
          }}>
            {/* Left Content */}
            <div style={{ flex: 1, textAlign: isTablet ? 'center' : 'left' }}>
              {/* Badge */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                backgroundColor: isDark ? 'rgba(20,184,166,0.15)' : 'rgba(20,184,166,0.1)',
                borderRadius: '100px',
                marginBottom: '24px',
                border: `1px solid ${FUELYX.primary}30`,
              }}>
                <Sparkle size={16} style={{ color: FUELYX.primary }} />
                <span style={{ fontSize: '13px', fontWeight: '600', color: FUELYX.primary, fontFamily: FONTS.body }}>
                  Built with Vibe Coding
                </span>
              </div>
              
              {/* App Logo & Name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px', justifyContent: isTablet ? 'center' : 'flex-start' }}>
                <img
                  src="https://i.imgur.com/RufDQlF.png"
                  alt="Fuelyx"
                  width={64}
                  height={64}
                  loading="lazy"
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '16px',
                    boxShadow: '0 8px 32px rgba(20,184,166,0.3)',
                  }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.background = 'linear-gradient(135deg, #14b8a6, #10b981)';
                    e.target.style.display = 'flex';
                    e.target.style.alignItems = 'center';
                    e.target.style.justifyContent = 'center';
                  }}
                />
                <h1 style={{ 
                  fontSize: isMobile ? '42px' : '56px', 
                  fontWeight: '800', 
                  fontFamily: FONTS.heading,
                  margin: 0,
                  background: `linear-gradient(135deg, ${FUELYX.primary} 0%, ${FUELYX.secondary} 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  Fuelyx
                </h1>
              </div>
              
              {/* Tagline */}
              <h2 style={{ 
                fontSize: isMobile ? '28px' : '40px', 
                fontWeight: '700', 
                color: theme.text,
                fontFamily: FONTS.heading,
                margin: '0 0 16px',
                lineHeight: 1.2,
              }}>
                Your Nutrition,{' '}
                <span style={{ color: FUELYX.primary }}>Simplified</span>
              </h2>
              
              <p style={{ 
                fontSize: isMobile ? '16px' : '18px', 
                color: theme.textMuted, 
                lineHeight: 1.7,
                margin: '0 0 32px',
                maxWidth: '520px',
                marginLeft: isTablet ? 'auto' : 0,
                marginRight: isTablet ? 'auto' : 0,
              }}>
                Track calories, log Filipino foods, monitor fasting, and achieve your health goals — all in one beautiful, easy-to-use app built for Filipinos.
              </p>
              
              {/* CTA Buttons */}
              <div style={{ 
                display: 'flex', 
                flexDirection: isMobile ? 'column' : 'row',
                gap: '12px',
                justifyContent: isTablet ? 'center' : 'flex-start',
              }}>
                <a 
                  href="https://github.com/brewed-ops/fuelyx/releases/download/v1.0.0/Fuelyxapp.apk"
                  download
                  style={{
                    height: '56px',
                    padding: '0 32px',
                    background: `linear-gradient(135deg, ${FUELYX.primary} 0%, ${FUELYX.secondary} 100%)`,
                    color: '#fff',
                    border: 'none',
                    borderRadius: '14px',
                    fontSize: '16px',
                    fontWeight: '600',
                    fontFamily: FONTS.body,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    boxShadow: '0 8px 24px rgba(20,184,166,0.35)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    textDecoration: 'none',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 12px 32px rgba(20,184,166,0.45)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(20,184,166,0.35)';
                  }}
                >
                  <Download size={20} />
                  Download APK
                </a>
                
                <a 
                  href="https://www.facebook.com/reel/879934018325124/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    height: '56px',
                    padding: '0 32px',
                    backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                    color: theme.text,
                    border: `2px solid ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'}`,
                    borderRadius: '14px',
                    fontSize: '16px',
                    fontWeight: '600',
                    fontFamily: FONTS.body,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    transition: 'all 0.2s',
                    textDecoration: 'none',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';
                  }}
                >
                  <Play size={20} />
                  Watch Demo
                </a>
              </div>
              
              {/* Stats */}
              <div style={{ 
                display: 'flex', 
                gap: '32px', 
                marginTop: '40px',
                justifyContent: isTablet ? 'center' : 'flex-start',
                flexWrap: 'wrap',
              }}>
                {[
                  { value: '200+', label: 'Filipino Foods' },
                  { value: '6', label: 'Fasting Protocols' },
                  { value: '100%', label: 'Free & Offline' },
                ].map((stat, i) => (
                  <div key={i} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '28px', fontWeight: '800', color: FUELYX.primary, fontFamily: FONTS.heading }}>
                      {stat.value}
                    </div>
                    <div style={{ fontSize: '13px', color: theme.textMuted, fontFamily: FONTS.body }}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Right - Phone Mockup */}
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
              <div style={{
                position: 'relative',
                width: isMobile ? '280px' : '320px',
              }}>
                {/* Phone frame */}
                <div style={{
                  width: '100%',
                  aspectRatio: '9/19',
                  backgroundColor: isDark ? '#1a1a1a' : '#000',
                  borderRadius: '40px',
                  padding: '12px',
                  boxShadow: '0 32px 64px rgba(0,0,0,0.3)',
                }}>
                  {/* Screen */}
                  <div style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#0f172a',
                    borderRadius: '32px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                  }}>
                    {/* Status bar */}
                    <div style={{ 
                      height: '44px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      paddingTop: '8px',
                    }}>
                      <div style={{ 
                        width: '80px', 
                        height: '28px', 
                        backgroundColor: '#000', 
                        borderRadius: '14px' 
                      }} />
                    </div>
                    
                    {/* App content preview */}
                    <div style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {/* Header */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontSize: '18px', fontWeight: '700', color: '#fff' }}>Fuelyx</div>
                          <div style={{ fontSize: '10px', color: '#64748b' }}>Mon, Jan 12</div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <div style={{ 
                            padding: '4px 8px', 
                            backgroundColor: 'rgba(249,115,22,0.2)', 
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}>
                            <Fire size={12} style={{ color: '#f97316' }} />
                            <span style={{ fontSize: '10px', color: '#fb923c', fontWeight: '600' }}>7</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Calorie card */}
                      <div style={{ 
                        background: 'linear-gradient(135deg, #134e4a 0%, #0f766e 100%)',
                        borderRadius: '16px',
                        padding: '16px',
                      }}>
                        <div style={{ fontSize: '10px', color: '#5eead4', marginBottom: '4px' }}>TODAY'S INTAKE</div>
                        <div style={{ fontSize: '28px', fontWeight: '700', color: '#fff' }}>1,245 <span style={{ fontSize: '14px', color: '#99f6e4' }}>/ 2,100</span></div>
                        <div style={{ 
                          height: '6px', 
                          backgroundColor: 'rgba(255,255,255,0.2)', 
                          borderRadius: '3px', 
                          marginTop: '8px',
                          overflow: 'hidden',
                        }}>
                          <div style={{ 
                            width: '59%', 
                            height: '100%', 
                            background: 'linear-gradient(90deg, #14b8a6, #10b981)', 
                            borderRadius: '3px' 
                          }} />
                        </div>
                      </div>
                      
                      {/* Macros */}
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {[
                          { label: 'Protein', value: '65g', color: '#3b82f6' },
                          { label: 'Carbs', value: '142g', color: '#f59e0b' },
                          { label: 'Fat', value: '48g', color: '#ef4444' },
                        ].map((macro, i) => (
                          <div key={i} style={{ 
                            flex: 1, 
                            backgroundColor: '#1e293b', 
                            borderRadius: '12px', 
                            padding: '10px',
                            textAlign: 'center',
                          }}>
                            <div style={{ fontSize: '16px', fontWeight: '700', color: macro.color }}>{macro.value}</div>
                            <div style={{ fontSize: '9px', color: '#64748b' }}>{macro.label}</div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Quick actions */}
                      <div style={{ 
                        backgroundColor: '#1e293b', 
                        borderRadius: '12px', 
                        padding: '12px',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ 
                            width: '36px', 
                            height: '36px', 
                            background: 'linear-gradient(135deg, #14b8a6, #10b981)', 
                            borderRadius: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                            <Camera size={18} style={{ color: '#fff' }} />
                          </div>
                          <div>
                            <div style={{ fontSize: '12px', fontWeight: '600', color: '#fff' }}>AI Scanner</div>
                            <div style={{ fontSize: '9px', color: '#64748b' }}>Snap & log food</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Bottom nav */}
                    <div style={{ 
                      height: '60px', 
                      borderTop: '1px solid #1e293b',
                      display: 'flex',
                      justifyContent: 'space-around',
                      alignItems: 'center',
                      paddingBottom: '8px',
                    }}>
                      {[ForkKnife, ChartBar, Timer, Barbell].map((Icon, i) => (
                        <div key={i} style={{ 
                          padding: '8px',
                          color: i === 0 ? FUELYX.primary : '#64748b',
                        }}>
                          <Icon size={20} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Floating elements */}
                <div style={{
                  position: 'absolute',
                  top: '15%',
                  left: '-60px',
                  backgroundColor: isDark ? '#1e293b' : '#fff',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                  display: isMobile ? 'none' : 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}>
                  <div style={{ 
                    width: '32px', 
                    height: '32px', 
                    backgroundColor: '#10b98120',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Check size={18} style={{ color: '#10b981' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: '600', color: theme.text }}>Goal Reached!</div>
                    <div style={{ fontSize: '9px', color: theme.textMuted }}>Protein target hit</div>
                  </div>
                </div>
                
                <div style={{
                  position: 'absolute',
                  bottom: '25%',
                  right: '-50px',
                  backgroundColor: isDark ? '#1e293b' : '#fff',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                  display: isMobile ? 'none' : 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}>
                  <div style={{ 
                    width: '32px', 
                    height: '32px', 
                    background: 'linear-gradient(135deg, #f97316, #f59e0b)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Fire size={18} style={{ color: '#fff' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: '600', color: theme.text }}>7 Day Streak!</div>
                    <div style={{ fontSize: '9px', color: theme.textMuted }}>Keep it going</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FEATURES SECTION ==================== */}
      <section style={{
        padding: isMobile ? '60px 20px' : '100px 64px',
        backgroundColor: isDark ? '#0a0a0b' : '#fafafa',
      }}>
        <ScrollReveal>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Section header */}
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              backgroundColor: isDark ? 'rgba(20,184,166,0.1)' : 'rgba(20,184,166,0.08)',
              borderRadius: '100px',
              marginBottom: '16px',
            }}>
              <Lightning size={14} style={{ color: FUELYX.primary }} />
              <span style={{ fontSize: '12px', fontWeight: '600', color: FUELYX.primary }}>FEATURES</span>
            </div>
            <h2 style={{ 
              fontSize: isMobile ? '28px' : '40px', 
              fontWeight: '700', 
              color: theme.text,
              fontFamily: FONTS.heading,
              margin: '0 0 16px',
            }}>
              Everything You Need to{' '}
              <span style={{ color: FUELYX.primary }}>Succeed</span>
            </h2>
            <p style={{ 
              fontSize: '16px', 
              color: theme.textMuted, 
              maxWidth: '600px', 
              margin: '0 auto',
              lineHeight: 1.6,
            }}>
              Fuelyx packs powerful features into a simple, intuitive interface designed for your daily health journey.
            </p>
          </div>
          
          {/* Feature grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
            gap: '24px',
          }}>
            {features.map((feature, i) => (
              <div 
                key={i}
                style={{
                  backgroundColor: isDark ? '#18181b' : '#fff',
                  border: `1px solid ${isDark ? '#27272a' : '#e4e4e7'}`,
                  borderRadius: '20px',
                  padding: '28px',
                  transition: 'all 0.3s',
                  cursor: 'pointer',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = `0 12px 32px ${feature.color}20`;
                  e.currentTarget.style.borderColor = `${feature.color}40`;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = isDark ? '#27272a' : '#e4e4e7';
                }}
              >
                <div style={{
                  width: '56px',
                  height: '56px',
                  backgroundColor: `${feature.color}15`,
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                }}>
                  <feature.icon size={28} style={{ color: feature.color }} />
                </div>
                <h3 style={{ 
                  fontSize: '18px', 
                  fontWeight: '700', 
                  color: theme.text,
                  fontFamily: FONTS.heading,
                  margin: '0 0 10px',
                }}>
                  {feature.title}
                </h3>
                <p style={{ 
                  fontSize: '14px', 
                  color: theme.textMuted, 
                  margin: 0,
                  lineHeight: 1.6,
                }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
        </ScrollReveal>
      </section>

      {/* ==================== INSTALLATION NOTICE ==================== */}
      <section style={{
        padding: isMobile ? '40px 20px' : '60px 64px',
        backgroundColor: isDark ? '#0a0a0b' : '#fff',
      }}>
        <ScrollReveal>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{
            backgroundColor: isDark ? '#1e293b' : '#fffbeb',
            border: `1px solid ${isDark ? '#f59e0b40' : '#f59e0b50'}`,
            borderRadius: '20px',
            padding: isMobile ? '24px' : '32px',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                backgroundColor: isDark ? '#f59e0b20' : '#f59e0b15',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Warning size={24} style={{ color: '#f59e0b' }} />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ 
                  fontSize: '18px', 
                  fontWeight: '700', 
                  color: theme.text,
                  fontFamily: FONTS.heading,
                  margin: '0 0 12px',
                }}>
                  Installation Notice
                </h3>
                <p style={{ 
                  fontSize: '15px', 
                  color: theme.textMuted, 
                  margin: '0 0 16px',
                  lineHeight: 1.7,
                }}>
                  Since Fuelyx is not available on the Google Play Store yet, your Android device will show a security warning when installing the APK. This is normal for apps downloaded outside of Play Store.
                </p>
                
                <div style={{
                  backgroundColor: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.8)',
                  borderRadius: '12px',
                  padding: '16px',
                }}>
                  <p style={{ 
                    fontSize: '14px', 
                    fontWeight: '600', 
                    color: theme.text, 
                    margin: '0 0 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}>
                    <GearSix size={16} style={{ color: FUELYX.primary }} />
                    How to Install:
                  </p>
                  <ol style={{ 
                    margin: 0, 
                    paddingLeft: '20px',
                    fontSize: '14px',
                    color: theme.textMuted,
                    lineHeight: 1.8,
                  }}>
                    <li>Download the APK file</li>
                    <li>When prompted with "Install unknown apps", tap <strong style={{ color: theme.text }}>Settings</strong></li>
                    <li>Enable <strong style={{ color: theme.text }}>"Allow from this source"</strong> for your browser/file manager</li>
                    <li>Go back and tap <strong style={{ color: theme.text }}>Install</strong></li>
                    <li>Once installed, you can disable the setting for security</li>
                  </ol>
                </div>
                
                <div style={{ 
                  marginTop: '16px',
                  padding: '12px 16px',
                  backgroundColor: isDark ? '#14b8a615' : '#14b8a610',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}>
                  <Shield size={18} style={{ color: FUELYX.primary, flexShrink: 0 }} />
                  <p style={{ 
                    fontSize: '13px', 
                    color: theme.textMuted, 
                    margin: 0,
                  }}>
                    <strong style={{ color: FUELYX.primary }}>Safe & Secure:</strong> Fuelyx is built by the same developer behind BrewedOps. Your data stays on your device and is never uploaded to external servers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        </ScrollReveal>
      </section>

      {/* ==================== BENEFITS SECTION ==================== */}
      <section style={{
        padding: isMobile ? '60px 20px' : '100px 64px',
        backgroundColor: isDark ? '#0f172a' : '#f0fdfa',
      }}>
        <ScrollReveal>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ 
            display: 'flex',
            flexDirection: isTablet ? 'column' : 'row',
            alignItems: 'center',
            gap: isTablet ? '48px' : '80px',
          }}>
            {/* Left - Benefits list */}
            <div style={{ flex: 1 }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                backgroundColor: isDark ? 'rgba(20,184,166,0.1)' : 'rgba(20,184,166,0.15)',
                borderRadius: '100px',
                marginBottom: '16px',
              }}>
                <Heart size={14} style={{ color: FUELYX.primary }} />
                <span style={{ fontSize: '12px', fontWeight: '600', color: FUELYX.primary }}>WHY FUELYX?</span>
              </div>
              
              <h2 style={{ 
                fontSize: isMobile ? '28px' : '36px', 
                fontWeight: '700', 
                color: theme.text,
                fontFamily: FONTS.heading,
                margin: '0 0 24px',
                lineHeight: 1.2,
              }}>
                Built for <span style={{ color: FUELYX.primary }}>Filipinos</span>,<br />
                By a Filipino
              </h2>
              
              <p style={{ 
                fontSize: '16px', 
                color: theme.textMuted, 
                margin: '0 0 32px',
                lineHeight: 1.7,
              }}>
                Unlike other calorie trackers, Fuelyx understands Filipino food culture. From adobo to sinigang, 
                we've got your local favorites covered.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {benefits.map((benefit, i) => (
                  <div 
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      padding: '16px',
                      backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#fff',
                      borderRadius: '12px',
                      border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#e4e4e7'}`,
                    }}
                  >
                    <div style={{
                      width: '40px',
                      height: '40px',
                      backgroundColor: `${FUELYX.primary}15`,
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <benefit.icon size={20} style={{ color: FUELYX.primary }} />
                    </div>
                    <span style={{ fontSize: '15px', color: theme.text, fontWeight: '500' }}>
                      {benefit.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Right - Testimonials */}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {testimonials.map((testimonial, i) => (
                  <div 
                    key={i}
                    style={{
                      backgroundColor: isDark ? '#1e293b' : '#fff',
                      borderRadius: '20px',
                      padding: '24px',
                      border: `1px solid ${isDark ? '#334155' : '#e4e4e7'}`,
                      boxShadow: isDark ? 'none' : '0 4px 16px rgba(0,0,0,0.06)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                      <div style={{ 
                        width: '48px', 
                        height: '48px', 
                        backgroundColor: isDark ? '#334155' : '#f0fdfa',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '24px',
                      }}>
                        {testimonial.avatar}
                      </div>
                      <div>
                        <div style={{ fontSize: '15px', fontWeight: '600', color: theme.text }}>{testimonial.name}</div>
                        <div style={{ fontSize: '12px', color: FUELYX.primary }}>{testimonial.role}</div>
                      </div>
                      <div style={{ marginLeft: 'auto', display: 'flex', gap: '2px' }}>
                        {[...Array(5)].map((_, j) => (
                          <Star key={j} size={14} style={{ color: '#f59e0b', fill: '#f59e0b' }} />
                        ))}
                      </div>
                    </div>
                    <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0, lineHeight: 1.6, fontStyle: 'italic' }}>
                      "{testimonial.text}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        </ScrollReveal>
      </section>

      {/* ==================== CTA SECTION ==================== */}
      <section style={{
        padding: isMobile ? '60px 20px' : '100px 64px',
        backgroundColor: isDark ? '#0a0a0b' : '#fff',
      }}>
        <ScrollReveal>
        <div style={{ 
          maxWidth: '900px', 
          margin: '0 auto',
          background: `linear-gradient(135deg, ${FUELYX.primary} 0%, ${FUELYX.secondary} 100%)`,
          borderRadius: '32px',
          padding: isMobile ? '48px 24px' : '64px 48px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Decorative circles */}
          <div style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '200px',
            height: '200px',
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderRadius: '50%',
          }} />
          <div style={{
            position: 'absolute',
            bottom: '-30px',
            left: '-30px',
            width: '150px',
            height: '150px',
            backgroundColor: 'rgba(255,255,255,0.08)',
            borderRadius: '50%',
          }} />
          
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{ 
              fontSize: isMobile ? '28px' : '40px', 
              fontWeight: '700', 
              color: '#fff',
              fontFamily: FONTS.heading,
              margin: '0 0 16px',
            }}>
              Start Your Health Journey Today
            </h2>
            <p style={{ 
              fontSize: '16px', 
              color: 'rgba(255,255,255,0.9)', 
              maxWidth: '500px', 
              margin: '0 auto 32px',
              lineHeight: 1.6,
            }}>
              Download Fuelyx for free and take control of your nutrition. No subscriptions, no ads — just results.
            </p>
            
            <a 
              href="https://github.com/brewed-ops/fuelyx/releases/download/v1.0.0/Fuelyxapp.apk"
              download
              style={{
                height: '56px',
                padding: '0 40px',
                backgroundColor: '#fff',
                color: FUELYX.primary,
                border: 'none',
                borderRadius: '14px',
                fontSize: '16px',
                fontWeight: '700',
                fontFamily: FONTS.body,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                transition: 'transform 0.2s',
                textDecoration: 'none',
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <Download size={20} />
              Download Free APK
            </a>
            
            <p style={{ 
              fontSize: '13px', 
              color: 'rgba(255,255,255,0.7)', 
              marginTop: '16px',
            }}>
              Android 7.0+ required • 5MB download
            </p>
          </div>
        </div>
        </ScrollReveal>
      </section>

      </main>

      {/* ==================== FOOTER ==================== */}
      <footer style={{
        padding: isMobile ? '32px 20px' : '48px 64px',
        backgroundColor: isDark ? '#0a0a0b' : '#fafafa',
        borderTop: `1px solid ${theme.cardBorder}`,
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto',
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '20px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="https://i.imgur.com/R52jwPvt.png" alt="BrewedOps Logo" width={28} height={28} style={{ width: '28px', height: '28px', borderRadius: '6px' }} />
            <span style={{ fontSize: '14px', color: theme.textMuted }}>
              © 2025 BrewedOps. Created by <span style={{ color: FUELYX.primary }}>Kenneth V.</span>
            </span>
          </div>
          
          <div style={{ display: 'flex', gap: '24px' }}>
            <a href="/privacy" style={{ fontSize: '13px', color: theme.textMuted, textDecoration: 'none' }}>Privacy</a>
            <a href="/terms" style={{ fontSize: '13px', color: theme.textMuted, textDecoration: 'none' }}>Terms</a>
            <a href="/about" style={{ fontSize: '13px', color: theme.textMuted, textDecoration: 'none' }}>About</a>
            <a href="https://www.brewedops.com/portfolio" target="_blank" rel="noopener noreferrer" style={{ fontSize: '13px', color: FUELYX.primary, textDecoration: 'none' }}>Portfolio</a>
          </div>
        </div>
      </footer>

      {mobileMenuOpen && (
        <React.Suspense fallback={null}>
          <MobileDrawer
            isOpen={mobileMenuOpen}
            onClose={() => setMobileMenuOpen(false)}
            isDark={isDark}
            navigate={navigate}
            onNavigate={() => setMobileMenuOpen(false)}
          />
        </React.Suspense>
      )}
    </div>
  );
};

export default FuelyxPage;
