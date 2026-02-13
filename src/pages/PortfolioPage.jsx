/**
 * PortfolioPage Component
 * Path: /portfolio
 * Clean, editorial-style portfolio — no animations, client-focused copy.
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { BentoCard, BentoGrid } from '@/components/ui/bento-grid';
import {
  CaretRight,
  CaretDown,
  Lightning,
  Star,
  ArrowSquareOut,
  Envelope,
  Medal,
  ChatCircle,
  Briefcase,
  MapPin,
  CalendarBlank,
  Headphones,
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
  Lock,
  CurrencyDollar,
  Note,
  CheckSquare,
  List,
  Globe,
  Timer,
  FileMagnifyingGlass,
  DeviceMobile,
  PenNib,
  Gear,
  ChatsCircle,
  Terminal
} from '@phosphor-icons/react';
import ThemeToggle from '../components/ui/ThemeToggle';
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
  bg: isDark ? '#0d0b09' : '#ffffff',
  bgAlt: isDark ? '#0f0d0a' : BRAND.cream,
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
    ]
  },
  {
    name: 'Video Tools',
    tools: [
      { icon: FilmStrip, title: 'Video Compressor', path: '/videocompressor' },
      { icon: Scissors, title: 'Video Trimmer', path: '/videotrimmer' },
    ]
  },
  {
    name: 'Document Tools',
    tools: [
      { icon: NotePencil, title: 'PDF Editor', path: '/pdfeditor' },
      { icon: GitMerge, title: 'PDF Merge', path: '/pdfmerge' },
      { icon: FileDashed, title: 'PDF Split', path: '/pdfsplit' },
      { icon: BookOpen, title: 'Markdown Viewer', path: '/markdownviewer' },
    ]
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
    ]
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
const ToolsDropdown = ({ isDark, theme, onToolClick, onLoginClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const timeoutRef = useRef(null);

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
        <CaretDown size={14} style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
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
  const dropdownRef = useRef(null);
  const timeoutRef = useRef(null);

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
      <button style={{ height: '40px', padding: '0 8px', backgroundColor: 'transparent', color: isOpen ? BRAND.blue : theme.textMuted, border: 'none', fontSize: '14px', fontWeight: '500', fontFamily: FONTS.body, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
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

// ============================================
// SOCIAL ICONS
// ============================================
const FacebookIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const DiscordIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" />
  </svg>
);

const LinkedInIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

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
// MAIN COMPONENT
// ============================================
function PortfolioPage({ isDark, setIsDark }) {
  const navigate = useNavigate();
  const theme = getTheme(isDark);
  const [isScrolled, setIsScrolled] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  const isMobile = windowWidth < 768;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ---- DATA ----

  const toolCategories = [
    {
      name: 'CRM & Support', tools: [
        { name: 'Intercom', icon: '/icons/intercom.svg' },
        { name: 'Zendesk', icon: '/icons/zendesk.svg' },
        { name: 'HubSpot', icon: '/icons/hubspot.svg' },
        { name: 'HighLevel', icon: '/GoHighLevellogo.webp' },
      ]
    },
    {
      name: 'Communication', tools: [
        { name: 'Slack', icon: '/icons/slack.svg' },
        { name: 'Zoom', icon: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"%3E%3Cpath fill="%232D8CFF" d="M24 12c0 6.627-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0s12 5.373 12 12zm-4.35-3.47c-.05.02-.1.05-.15.09l-2.7 1.85V8.8c0-.88-.72-1.6-1.6-1.6H6.4c-.88 0-1.6.72-1.6 1.6v6.4c0 .88.72 1.6 1.6 1.6h8.8c.88 0 1.6-.72 1.6-1.6v-1.67l2.7 1.85c.05.04.1.07.15.09.35.14.75-.1.75-.49V9.02c0-.39-.4-.63-.75-.49z"/%3E%3C/svg%3E' },
        { name: 'Google Meet', icon: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"%3E%3Cpath fill="%2300897B" d="M12 0C5.372 0 0 5.373 0 12s5.372 12 12 12 12-5.373 12-12S18.628 0 12 0zm5.2 16.1l-2.7-2v1.5c0 .6-.4 1-1 1H7.6c-.6 0-1-.4-1-1V8.4c0-.6.4-1 1-1h5.9c.6 0 1 .4 1 1v1.5l2.7-2c.3-.2.6 0 .6.3v7.6c0 .3-.3.5-.6.3z"/%3E%3C/svg%3E' },
        { name: 'Skype', icon: '/skypeicon.png' },
      ]
    },
    {
      name: 'Project Management', tools: [
        { name: 'Trello', icon: '/icons/trello.svg' },
        { name: 'ClickUp', icon: '/icons/clickup.svg' },
        { name: 'Notion', icon: isDark ? '/icons/notion-light.svg' : '/icons/notion-dark.svg' },
        { name: 'Asana', icon: '/icons/asana.svg' },
      ]
    },
    {
      name: 'eCommerce', tools: [
        { name: 'Shopify', icon: '/icons/shopify.svg' },
        { name: 'WooCommerce', icon: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"%3E%3Cpath fill="%2396588A" d="M2.227 4.857A2.228 2.228 0 000 7.088v7.199a2.226 2.226 0 002.227 2.227h7.039l2.712 2.631-.456-2.631h10.251A2.226 2.226 0 0024 14.287V7.088a2.227 2.227 0 00-2.227-2.231H2.227zm1.078 1.572c.387.012.744.217.963.618.725 1.327 1.5 4.074 1.855 5.621.206.896 1.001 3.689 1.512 3.039.698-.89 1.26-3.207 1.688-4.479.152-.453.729-2.358 1.47-2.358.74 0 .763 1.884.897 2.655.203 1.168.542 3.474 1.122 3.474.432 0 1.082-1.614 1.49-2.584a23.51 23.51 0 011.337-2.86c.315-.551.695-.934 1.095-.542.4.392.09 1.57-.143 2.324-.592 1.916-.842 3.397-.44 3.397.3 0 .836-.664 1.327-1.39l-.007.022a.652.652 0 011.109.688 7.293 7.293 0 01-2.219 2.374c-.86.56-1.56.283-1.845-.372-.372-.857-.221-1.922.024-2.867-.467.652-.976 1.221-1.484 1.221-1.075 0-1.437-1.811-1.654-2.953-.125-.659-.255-1.378-.39-1.937-.396 1.292-.74 2.745-1.249 3.975-.377.91-.86 1.95-1.582 1.95C5.846 17.465 5 14.296 4.66 12.963c-.318-1.242-.717-2.921-1.2-4.043-.12-.279-.082-.48.019-.591a.66.66 0 01-.174.1z"/%3E%3C/svg%3E' },
        { name: 'Lightspeed X-Series', icon: '/lightspeedicon.png' },
      ]
    },
    {
      name: 'Development', tools: [
        { name: 'React', icon: '/icons/react.svg' },
        { name: 'Vite', icon: '/icons/vite.svg' },
        { name: 'Tailwind', icon: '/icons/tailwindcss.svg' },
        { name: 'Supabase', icon: '/icons/supabase.svg' },
        { name: 'n8n', icon: '/icons/n8n.svg' },
      ]
    },
    {
      name: 'Productivity', tools: [
        { name: 'Google Workspace', icon: '/icons/google.svg' },
        { name: 'Microsoft 365', icon: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"%3E%3Cpath fill="%230078D4" d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z"/%3E%3C/svg%3E' },
        { name: 'ChatGPT', icon: '/chatgpticon.png' },
        { name: 'Claude', icon: '/icons/anthropic.svg' },
      ]
    },
  ];

  const experience = [
    { role: 'Support Specialist', company: 'Lightspeed X-Series', period: 'March 2024 \u2013 Present', description: 'Resolve hardware issues, troubleshoot POS errors for eCommerce and Retail stores. CRM using Intercom, Zendesk, and Purecloud.', current: true },
    { role: 'Customer Support Tier 2 SME', company: 'Concentrix', period: 'April 2022 \u2013 January 2024', description: 'Resolved complex issues via chat/email, worked with Tier 3 teams within SLA requirements.', current: false },
    { role: 'Sales Chat Support', company: 'Concentrix', period: 'October 2017 \u2013 August 2021', description: 'Live web chat support, upselling/cross-selling, order support, returns and exchanges.', current: false },
    { role: 'Chat Support \u2013 US TELCO', company: 'Alorica', period: 'December 2016 \u2013 July 2017', description: 'Billing solutions, troubleshooting, guiding customers to products and services.', current: false },
    { role: 'Customer Service Analyst', company: 'Foundever (Sykes Asia Inc.)', period: 'July 2014 \u2013 December 2016', description: 'Reviewing auto-mobile loan contracts and documents, posting credit card and loan payments.', current: false },
  ];

  const skills = [
    { category: 'Admin VA', items: ['Calendar Management', 'Email Management', 'Google Sheet Dashboard', 'Scheduling'], color: BRAND.blue },
    { category: 'Technical', items: ['Troubleshooting', 'CRMs', 'AI Prompts', 'Creating Guides & Articles'], color: BRAND.green },
    { category: 'Specialized', items: ['Email Support', 'Tech Support', 'Chat Support', 'Data Entry'], color: '#8b5cf6' },
  ];

  const testimonials = [
    { name: 'Sarah Chen', role: 'Business Coach', content: 'The automation setup transformed my business. I went from spending 4 hours daily on follow-ups to having everything run on autopilot.', avatar: '\uD83D\uDC69\u200D\uD83D\uDCBC' },
    { name: 'Michael Torres', role: 'Agency Owner', content: 'Incredible attention to detail and deep understanding of GHL. My CRM is now perfectly organized and automated.', avatar: '\uD83D\uDC68\u200D\uD83D\uDCBB' },
  ];

  const socialLinks = [
    { name: 'Facebook', icon: FacebookIcon, href: 'https://www.facebook.com/BrewedOpsHL' },
    { name: 'LinkedIn', icon: LinkedInIcon, href: 'https://www.linkedin.com/in/kenneth-villar-10a05734a/' },
    { name: 'Discord', icon: DiscordIcon, href: '#', username: '@kapedlvnglgnd' },
  ];

  const navLinkStyle = { fontSize: '14px', fontWeight: '500', color: theme.textMuted, textDecoration: 'none', fontFamily: FONTS.body, padding: '0 8px' };

  // ---- RENDER ----

  return (
    <div style={{ minHeight: '100vh', backgroundColor: theme.bg, color: theme.text, fontFamily: FONTS.body }}>
      <SEO
        title="Portfolio | BrewedOps - VA Services, GHL Automation & AI Tools"
        description="Kenneth V's portfolio — GHL CRM setup, automation, vibe coding, AI-powered tools, and 11+ years of customer support experience. 26+ free tools and AI utilities."
        keywords="BrewedOps portfolio, GHL CRM, automation, web development, Filipino VA services, AI text extractor, GHL scenario generator"
      />

      {/* ============================================ */}
      {/* NAV */}
      {/* ============================================ */}
      <nav style={{
        padding: isMobile ? '12px 16px' : '12px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: isScrolled ? `1px solid ${theme.cardBorder}` : '1px solid transparent',
        backgroundColor: isScrolled ? (isDark ? 'rgba(13,11,9,0.95)' : 'rgba(255,255,255,0.95)') : theme.bg,
        transition: 'border-color 0.3s',
        backdropFilter: isScrolled ? 'blur(12px)' : 'none',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginRight: isMobile ? '0' : '20px', cursor: 'pointer' }}>
            <img src="/BrewedOpsLogo-64.png" alt="BrewedOps Logo" width={32} height={32} style={{ width: '32px', height: '32px', borderRadius: '8px' }} />
            <span style={{ fontSize: '18px', fontWeight: '700', fontFamily: FONTS.heading }}>
              <span style={{ color: isDark ? '#fff' : BRAND.brown }}>Brewed</span>
              <span style={{ color: BRAND.blue }}>Ops</span>
            </span>
          </div>
          {!isMobile && (
            <>
              <button onClick={() => navigate('/')} style={{ height: '40px', padding: '0 12px', backgroundColor: 'transparent', color: theme.textMuted, border: 'none', fontSize: '14px', fontWeight: '500', fontFamily: FONTS.body, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                Home
              </button>
              <button style={{ height: '40px', padding: '0 12px', backgroundColor: 'transparent', color: BRAND.blue, border: 'none', fontSize: '14px', fontWeight: '600', fontFamily: FONTS.body, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                Portfolio
              </button>
              <ToolsDropdown isDark={isDark} theme={theme} onToolClick={(path) => navigate(path)} onLoginClick={() => navigate('/login')} />
              <AIToolsDropdown isDark={isDark} theme={theme} onToolClick={(path) => navigate(path)} />
              <AppsDropdown isDark={isDark} theme={theme} onAppClick={(path) => navigate(path)} />
            </>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {!isMobile && (
            <>
              <a href="/about" style={navLinkStyle}>About</a>
              <a href="/privacy" style={navLinkStyle}>Privacy</a>
            </>
          )}
          <ThemeToggle isDark={isDark} setIsDark={setIsDark} />
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
            <button onClick={() => setMobileMenuOpen(true)} aria-label="Open navigation menu" style={{ width: '36px', height: '36px', backgroundColor: 'transparent', border: `1px solid ${theme.cardBorder}`, borderRadius: '8px', color: theme.textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '4px' }}>
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
        @keyframes badgeFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .hero-badge-float {
          animation: badgeFloat 3s ease-in-out infinite;
        }
        @keyframes workflowPan {
          0% { transform: translateX(0) translateY(0) scale(1.8); }
          25% { transform: translateX(-15%) translateY(-5%) scale(1.8); }
          50% { transform: translateX(-30%) translateY(0%) scale(1.8); }
          75% { transform: translateX(-15%) translateY(5%) scale(1.8); }
          100% { transform: translateX(0) translateY(0) scale(1.8); }
        }
      `}</style>

      <main>
        {/* ============================================ */}
        {/* HERO */}
        {/* ============================================ */}
        <section id="main-content" style={{
          minHeight: isMobile ? 'auto' : '90vh',
          display: 'flex',
          alignItems: 'center',
          padding: isMobile ? '48px 20px' : '80px 48px',
          backgroundColor: isDark ? '#0d0b09' : '#ffffff',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Background Profile Image - Right Side */}
          {!isMobile && (
            <div style={{
              position: 'absolute',
              right: '4%',
              bottom: 0,
              width: '750px',
              height: '95%',
              pointerEvents: 'none',
              zIndex: 0,
              ...(isDark ? {
                maskImage: 'radial-gradient(ellipse 80% 75% at 55% 50%, black 35%, transparent 70%)',
                WebkitMaskImage: 'radial-gradient(ellipse 80% 75% at 55% 50%, black 35%, transparent 70%)',
              } : {}),
            }}>
              <img
                src={isDark ? "/portfolioimage-dark.webp" : "/portfolioimage-light.webp"}
                alt="Portfolio"
                loading="lazy"
                width={1024}
                height={1536}
                onError={(e) => {
                  e.target.src = isDark ? "/portfolioimage-dark.png" : "/portfolioimage-light.png";
                }}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center top',
                }}
              />
            </div>
          )}
          {/* Wave divider at bottom */}
          <svg
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
            style={{
              position: 'absolute',
              bottom: '-1px',
              left: 0,
              width: '100%',
              height: '80px',
              zIndex: 2,
              display: 'block',
              lineHeight: 0,
            }}
          >
            <path
              d="M0,60 C240,120 480,0 720,60 C960,120 1200,0 1440,60 L1440,120 L0,120 Z"
              fill={isDark ? '#0f0d0a' : BRAND.cream}
            />
          </svg>
          <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', position: 'relative', zIndex: 1 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: isMobile ? 'column' : 'row',
            }}>
              {/* Left: Copy */}
              <div style={{ flex: '1 1 auto', maxWidth: isMobile ? '100%' : '620px', textAlign: isMobile ? 'center' : 'left' }}>
                {/* Badges */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '24px', justifyContent: isMobile ? 'center' : 'flex-start' }}>
                  <div className="hero-badge-float" style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    padding: '10px 16px',
                    backgroundColor: isDark ? 'rgba(81, 175, 67, 0.1)' : 'rgba(81, 175, 67, 0.08)',
                    border: `1px solid ${BRAND.green}30`,
                    borderRadius: '100px',
                    animationDelay: '0s',
                  }}>
                    <Medal size={16} style={{ color: BRAND.green }} />
                    <span style={{ fontSize: '13px', color: BRAND.green, fontWeight: '600', fontFamily: FONTS.body }}>HL Accelerator Student</span>
                  </div>
                  <div className="hero-badge-float" style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    padding: '10px 16px',
                    backgroundColor: isDark ? 'rgba(0, 74, 172, 0.1)' : 'rgba(0, 74, 172, 0.08)',
                    border: `1px solid ${BRAND.blue}30`,
                    borderRadius: '100px',
                    animationDelay: '1.5s',
                  }}>
                    <Briefcase size={16} style={{ color: BRAND.blue }} />
                    <span style={{ fontSize: '13px', color: BRAND.blue, fontWeight: '600', fontFamily: FONTS.body }}>11+ Years Customer Support</span>
                  </div>
                </div>

                <h1 style={{
                  fontSize: isMobile ? '32px' : '52px',
                  fontWeight: '800',
                  fontFamily: FONTS.heading,
                  lineHeight: '1.15',
                  marginBottom: '20px',
                  color: isDark ? '#ffffff' : BRAND.brown,
                }}>
                  Stop Hiring Three People. <span style={{ color: BRAND.blue }}>Hire One.</span>
                </h1>

                <p style={{
                  fontSize: isMobile ? '15px' : '18px',
                  color: theme.textMuted,
                  lineHeight: '1.75',
                  marginBottom: '24px',
                  fontFamily: FONTS.body,
                }}>
                  CRM builds, customer support, and admin ops — handled by one dedicated VA with 11 years of experience. Your systems run, your inbox stays at zero, and your leads actually get followed up.
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: isMobile ? '12px' : '24px', marginBottom: '28px', fontSize: isMobile ? '14px' : '15px', color: theme.textMuted, justifyContent: isMobile ? 'center' : 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><MapPin size={16} /><span>Cabuyao, Laguna, PH</span></div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Envelope size={16} /><span>kvillarmain@gmail.com</span></div>
                </div>

                {/* CTA Buttons */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '28px', justifyContent: isMobile ? 'center' : 'flex-start' }}>
                  <button
                    onClick={() => navigate('/book')}
                    style={{
                      padding: isMobile ? '14px 24px' : '16px 32px',
                      backgroundColor: BRAND.blue,
                      color: '#fff',
                      border: 'none',
                      borderRadius: '12px',
                      fontWeight: '600',
                      fontSize: isMobile ? '15px' : '16px',
                      fontFamily: FONTS.body,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '10px',
                      textDecoration: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    Book a Call <CaretRight size={18} />
                  </button>
                  <a
                    href="https://wa.me/639933074618"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      padding: isMobile ? '14px 24px' : '16px 32px',
                      backgroundColor: '#25D366',
                      color: '#fff',
                      borderRadius: '12px',
                      fontWeight: '600',
                      fontSize: isMobile ? '15px' : '16px',
                      fontFamily: FONTS.body,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '10px',
                      textDecoration: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    WhatsApp
                  </a>
                </div>

                {/* Social */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', justifyContent: isMobile ? 'center' : 'flex-start' }}>
                  <span style={{ fontSize: '14px', color: theme.textMuted, fontFamily: FONTS.body }}>Connect:</span>
                  {socialLinks.map((social, i) => (
                    social.username ? (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', borderRadius: '10px', backgroundColor: isDark ? '#2a2420' : '#faf8f5', color: theme.textMuted }}>
                        <social.icon size={18} />
                        <span style={{ fontSize: '13px', fontWeight: '600', color: theme.text, fontFamily: FONTS.body }}>{social.username}</span>
                      </div>
                    ) : (
                      <a key={i} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.name} style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: isDark ? '#2a2420' : '#faf8f5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.textMuted, textDecoration: 'none' }} title={social.name}>
                        <social.icon size={18} />
                      </a>
                    )
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* TECH STACK */}
        {/* ============================================ */}
        <style>{`
          .tool-card {
            position: relative;
            overflow: hidden;
            border-radius: 10px;
            transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
            cursor: default;
          }
          .tool-card:hover {
            transform: scale(1.03);
            box-shadow: 0 8px 24px ${isDark ? 'rgba(0,0,0,0.4)' : 'rgba(63,32,12,0.1)'};
            border-color: ${isDark ? '#3a3430' : '#d8cfc2'};
          }
          .tool-card::after {
            content: '';
            position: absolute;
            inset: 0;
            background: ${isDark ? 'rgba(0, 74, 172, 0.06)' : 'rgba(0, 74, 172, 0.03)'};
            border-radius: 10px;
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
          }
          .tool-card:hover::after {
            opacity: 1;
          }
          .tool-card .tool-card-header {
            transition: color 0.3s ease;
          }
          .tool-card:hover .tool-card-header {
            color: ${BRAND.blue};
          }
        `}</style>
        <section style={{
          padding: isMobile ? '48px 16px' : '72px 32px',
          backgroundColor: theme.bgAlt,
          borderBottom: `1px solid ${theme.cardBorder}`,
        }}>
          <ScrollReveal>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: isMobile ? '24px' : '40px' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '3px', color: BRAND.green, textTransform: 'uppercase', marginBottom: '10px', display: 'block', fontFamily: FONTS.body }}>Tech Stack</span>
                <h2 style={{ fontSize: isMobile ? '28px' : '40px', fontWeight: '800', fontFamily: FONTS.heading, color: isDark ? '#fff' : BRAND.brown, marginBottom: '10px' }}>Tools I Work With</h2>
                <p style={{ fontSize: isMobile ? '13px' : '15px', color: theme.textMuted, maxWidth: '450px', margin: '0 auto', fontFamily: FONTS.body }}>Platforms and technologies I use daily to deliver exceptional results.</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: isMobile ? '12px' : '16px' }}>
                {toolCategories.map((category, i) => (
                  <ScrollReveal key={i} delay={i * 0.06} style={{ height: '100%' }}>
                    <div
                      className="tool-card"
                      style={{
                        backgroundColor: theme.cardBg,
                        border: `1px solid ${theme.cardBorder}`,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      {/* Header */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: isMobile ? '14px 16px' : '18px 20px',
                        position: 'relative',
                        zIndex: 1,
                      }}>
                        <span className="tool-card-header" style={{
                          fontSize: isMobile ? '13px' : '14px',
                          color: theme.textMuted,
                          fontFamily: FONTS.body,
                          fontWeight: '500',
                        }}>{category.name}</span>
                        <span style={{
                          fontSize: '12px',
                          color: theme.textMuted,
                          fontFamily: FONTS.body,
                        }}>{category.tools.length} tools</span>
                      </div>

                      {/* Tools */}
                      <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: isMobile ? '6px' : '8px',
                        padding: isMobile ? '0 16px 16px' : '0 20px 20px',
                        position: 'relative',
                        zIndex: 1,
                      }}>
                        {category.tools.map((tool, j) => (
                          <div key={j} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: isMobile ? '6px' : '8px',
                            padding: isMobile ? '7px 10px' : '8px 14px',
                            backgroundColor: isDark ? 'rgba(42, 36, 32, 0.6)' : 'rgba(250, 248, 245, 0.8)',
                            borderRadius: '8px',
                            border: `1px solid ${isDark ? '#2a2420' : '#e8e0d4'}`,
                          }}>
                            <img src={tool.icon} alt={tool.name} style={{ width: isMobile ? '16px' : '20px', height: isMobile ? '16px' : '20px', objectFit: 'contain' }} />
                            <span style={{ fontSize: isMobile ? '12px' : '13px', fontWeight: '500', color: theme.text, fontFamily: FONTS.body }}>{tool.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* ============================================ */}
        {/* WHAT YOU GET — BENTO GRID */}
        {/* ============================================ */}
        <section style={{
          padding: isMobile ? '48px 16px' : '80px 32px',
          backgroundColor: theme.bg,
        }}>
          <ScrollReveal>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: isMobile ? '36px' : '56px' }}>
                <span style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '1.5px', color: theme.textMuted, textTransform: 'uppercase', fontFamily: FONTS.body, display: 'block', marginBottom: '12px' }}>What you get</span>
                <h2 style={{ fontSize: isMobile ? '28px' : '40px', fontWeight: '800', fontFamily: FONTS.heading, color: isDark ? '#fff' : BRAND.brown, lineHeight: '1.2', marginBottom: '16px' }}>One person. Three problems solved.</h2>
                <p style={{ fontSize: isMobile ? '14px' : '16px', color: theme.textMuted, lineHeight: '1.7', fontFamily: FONTS.body, maxWidth: '540px', margin: '0 auto' }}>
                  Most teams hire separately for support, automation, and dev. I handle all three — one reliable person who already understands your systems.
                </p>
              </div>

              <BentoGrid className={isMobile ? '!grid-cols-1 !auto-rows-auto' : '!grid-cols-3 !auto-rows-[20rem]'}>
                {/* CRM Card — spans 2 cols */}
                <BentoCard
                  name="Your CRM actually works"
                  className={isMobile ? '!col-span-1' : '!col-span-2'}
                  Icon={Gear}
                  description="GoHighLevel pipelines, automations, and workflows that match how your team sells. Follow-ups fire on time. Leads don't fall through cracks."
                  href="/services"
                  cta="View CRM services"
                  background={
                    <div className="absolute inset-0 overflow-hidden" style={{ opacity: isDark ? 0.6 : 0.45 }}>
                      <img
                        src="/hlflow.png"
                        alt=""
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          animation: 'workflowPan 12s ease-in-out infinite',
                          transformOrigin: 'center center',
                          filter: isDark ? 'brightness(1.2)' : 'none',
                        }}
                      />
                      {/* Bottom fade so text stays readable */}
                      <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '60%',
                        background: `linear-gradient(to top, ${theme.cardBg} 20%, transparent 100%)`,
                        pointerEvents: 'none',
                      }} />
                    </div>
                  }
                />

                {/* Support Card — spans 1 col */}
                <BentoCard
                  name="Your customers get real answers"
                  className="!col-span-1"
                  Icon={ChatsCircle}
                  description="11 years of Tier 2 escalations across Intercom, Zendesk, and live chat. I resolve issues — not just route tickets."
                  href="/services"
                  cta="View support services"
                  background={
                    <div className="absolute inset-0 flex flex-col items-end pr-6 pt-6 transition-opacity duration-300" style={{ opacity: 0.75 }}>
                      {/* Mini chat bubbles */}
                      {[
                        { msg: 'My order hasn\'t arrived yet', align: 'right' },
                        { msg: 'Let me check your tracking #', align: 'left' },
                        { msg: 'Found it — reshipping now', align: 'left' },
                      ].map((chat, i) => (
                        <div key={i} style={{
                          padding: '6px 12px',
                          borderRadius: chat.align === 'left' ? '10px 10px 10px 4px' : '10px 10px 4px 10px',
                          backgroundColor: chat.align === 'left'
                            ? (isDark ? `${BRAND.green}30` : `${BRAND.green}18`)
                            : (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'),
                          border: `1px solid ${chat.align === 'left'
                            ? (isDark ? `${BRAND.green}50` : `${BRAND.green}35`)
                            : (isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)')}`,
                          fontSize: '11px',
                          color: isDark ? '#c4b5a3' : '#5e4d38',
                          fontFamily: FONTS.body,
                          alignSelf: chat.align === 'left' ? 'flex-start' : 'flex-end',
                          marginBottom: '6px',
                          maxWidth: '85%',
                          marginLeft: chat.align === 'left' ? '12px' : '0',
                        }}>
                          {chat.msg}
                        </div>
                      ))}
                    </div>
                  }
                />

                {/* Dev Card — spans full width */}
                <BentoCard
                  name="Your tools get built"
                  className={isMobile ? '!col-span-1' : '!col-span-3'}
                  Icon={Terminal}
                  description="Internal dashboards, client portals, custom tools — production-grade web apps with React and Supabase, designed around your actual process."
                  href="/services"
                  cta="View dev services"
                  background={
                    <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300" style={{ opacity: 0.7 }}>
                      {/* Mini code editor */}
                      <div style={{
                        padding: '16px 20px',
                        borderRadius: '10px',
                        backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                        border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)'}`,
                        fontFamily: "'Courier New', monospace",
                        fontSize: '12px',
                        lineHeight: '1.8',
                        marginTop: '-20px',
                        color: isDark ? '#a09585' : '#7a6652',
                      }}>
                        <div><span style={{ color: '#a78bfa' }}>const</span> <span style={{ color: '#5a9be6' }}>dashboard</span> = <span style={{ color: '#6bc45a' }}>createApp</span>{'({'}</div>
                        <div style={{ paddingLeft: '16px' }}><span style={{ color: '#fbbf24' }}>auth</span>: <span style={{ color: '#6bc45a' }}>'supabase'</span>,</div>
                        <div style={{ paddingLeft: '16px' }}><span style={{ color: '#fbbf24' }}>ui</span>: <span style={{ color: '#6bc45a' }}>'react'</span>,</div>
                        <div style={{ paddingLeft: '16px' }}><span style={{ color: '#fbbf24' }}>deploy</span>: <span style={{ color: '#6bc45a' }}>'vercel'</span></div>
                        <div>{'});'}</div>
                      </div>
                    </div>
                  }
                />
              </BentoGrid>

              {/* CTA */}
              <ScrollReveal delay={0.2}>
                <div style={{
                  marginTop: isMobile ? '28px' : '40px',
                  textAlign: 'center',
                }}>
                  <button
                    onClick={() => navigate('/services')}
                    style={{
                      padding: '14px 28px',
                      backgroundColor: BRAND.blue,
                      color: '#fff',
                      border: 'none',
                      borderRadius: '10px',
                      fontWeight: '600',
                      fontSize: '14px',
                      cursor: 'pointer',
                      fontFamily: FONTS.body,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'opacity 0.2s ease',
                    }}
                  >
                    View services & book a call <ArrowSquareOut size={15} />
                  </button>
                  <p style={{ fontSize: '13px', color: theme.textMuted, fontFamily: FONTS.body, marginTop: '12px' }}>
                    Free intro call — no commitment
                  </p>
                </div>
              </ScrollReveal>
            </div>
          </ScrollReveal>
        </section>

        {/* ============================================ */}
        {/* EXPERIENCE */}
        {/* ============================================ */}
        <section style={{
          padding: isMobile ? '48px 16px' : '80px 32px',
          backgroundColor: theme.bg,
        }}>
          <ScrollReveal>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: isMobile ? '32px' : '56px' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '3px', color: '#f59e0b', textTransform: 'uppercase', marginBottom: '10px', display: 'block', fontFamily: FONTS.body }}>Background</span>
                <h2 style={{ fontSize: isMobile ? '28px' : '40px', fontWeight: '800', fontFamily: FONTS.heading, color: isDark ? '#fff' : BRAND.brown }}>Career History</h2>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '0' : '0' }}>
                {experience.map((exp, i) => (
                  <div key={i} style={{ display: 'flex', gap: isMobile ? '14px' : '20px' }}>
                    {/* Timeline column */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, width: '13px' }}>
                      <div style={{
                        width: exp.current ? '11px' : '9px',
                        height: exp.current ? '11px' : '9px',
                        borderRadius: '50%',
                        backgroundColor: exp.current ? BRAND.green : theme.cardBorder,
                        flexShrink: 0,
                        marginTop: isMobile ? '6px' : '8px',
                      }} />
                      {i < experience.length - 1 && (
                        <div style={{ width: '1px', flex: 1, backgroundColor: theme.cardBorder, minHeight: '20px' }} />
                      )}
                    </div>
                    {/* Content */}
                    <div style={{ paddingBottom: isMobile ? '20px' : '28px', flex: 1 }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '8px', marginBottom: '4px' }}>
                        <h3 style={{ fontSize: isMobile ? '15px' : '16px', fontWeight: '600', color: isDark ? '#fff' : BRAND.brown, fontFamily: FONTS.heading, lineHeight: '1.4' }}>{exp.role}</h3>
                        {exp.current && <span style={{ fontSize: '10px', fontWeight: '600', color: BRAND.green, letterSpacing: '0.5px' }}>NOW</span>}
                      </div>
                      <div style={{ fontSize: isMobile ? '12px' : '13px', color: theme.textMuted, fontFamily: FONTS.body, marginBottom: '6px' }}>
                        {exp.company} &middot; {exp.period}
                      </div>
                      <p style={{ fontSize: isMobile ? '13px' : '14px', color: theme.textMuted, lineHeight: '1.6', fontFamily: FONTS.body, opacity: 0.8 }}>{exp.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </section>


        {/* ============================================ */}
        {/* SKILLS */}
        {/* ============================================ */}
        <section style={{
          padding: isMobile ? '48px 16px' : '80px 32px',
          backgroundColor: theme.bg,
        }}>
          <ScrollReveal>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: isMobile ? '24px' : '40px' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '3px', color: '#8b5cf6', textTransform: 'uppercase', marginBottom: '8px', display: 'block', fontFamily: FONTS.body }}>Expertise</span>
                <h2 style={{ fontSize: isMobile ? '28px' : '40px', fontWeight: '800', fontFamily: FONTS.heading, color: isDark ? '#fff' : BRAND.brown }}>Core Skills</h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: isMobile ? '12px' : '16px' }}>
                {skills.map((skill, i) => (
                  <ScrollReveal key={i} delay={i * 0.08} style={{ height: '100%' }}>
                    <div
                      className="tool-card"
                      style={{
                        backgroundColor: theme.cardBg,
                        border: `1px solid ${theme.cardBorder}`,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      {/* Header */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: isMobile ? '14px 16px' : '18px 20px',
                        position: 'relative',
                        zIndex: 1,
                      }}>
                        <span className="tool-card-header" style={{
                          fontSize: isMobile ? '13px' : '14px',
                          color: theme.textMuted,
                          fontFamily: FONTS.body,
                          fontWeight: '500',
                        }}>{skill.category}</span>
                        <span style={{
                          fontSize: '12px',
                          color: theme.textMuted,
                          fontFamily: FONTS.body,
                        }}>{skill.items.length} skills</span>
                      </div>

                      {/* Skills */}
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: isMobile ? '6px' : '8px',
                        padding: isMobile ? '0 16px 16px' : '0 20px 20px',
                        position: 'relative',
                        zIndex: 1,
                        flex: 1,
                      }}>
                        {skill.items.map((item, j) => (
                          <div key={j} style={{
                            padding: isMobile ? '9px 12px' : '10px 14px',
                            backgroundColor: isDark ? 'rgba(42, 36, 32, 0.6)' : 'rgba(250, 248, 245, 0.8)',
                            borderRadius: '8px',
                            border: `1px solid ${isDark ? '#2a2420' : '#e8e0d4'}`,
                            fontSize: isMobile ? '12px' : '13px',
                            fontWeight: '500',
                            color: theme.text,
                            fontFamily: FONTS.body,
                          }}>{item}</div>
                        ))}
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* ============================================ */}
        {/* TESTIMONIALS */}
        {/* ============================================ */}
        <section style={{
          padding: isMobile ? '48px 16px' : '80px 32px',
          backgroundColor: theme.bgAlt,
        }}>
          <ScrollReveal>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: isMobile ? '32px' : '56px' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '3px', color: BRAND.blue, textTransform: 'uppercase', marginBottom: '10px', display: 'block', fontFamily: FONTS.body }}>Testimonials</span>
                <h2 style={{ fontSize: isMobile ? '28px' : '40px', fontWeight: '800', fontFamily: FONTS.heading, color: isDark ? '#fff' : BRAND.brown }}>What Clients Say</h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: isMobile ? '16px' : '28px' }}>
                {testimonials.map((t, i) => (
                  <div key={i} style={{
                    padding: isMobile ? '24px 20px' : '32px',
                    backgroundColor: theme.cardBg,
                    border: `1px solid ${theme.cardBorder}`,
                    borderRadius: '16px',
                  }}>
                    <div style={{ display: 'flex', gap: '4px', marginBottom: isMobile ? '16px' : '20px' }}>
                      {[...Array(5)].map((_, j) => <Star key={j} size={isMobile ? 14 : 16} fill={BRAND.green} color={BRAND.green} />)}
                    </div>
                    <p style={{ fontSize: isMobile ? '14px' : '16px', color: theme.text, lineHeight: '1.7', marginBottom: isMobile ? '20px' : '24px', fontStyle: 'italic', fontFamily: FONTS.body }}>"{t.content}"</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: isMobile ? '40px' : '48px', height: isMobile ? '40px' : '48px', borderRadius: '50%', backgroundColor: isDark ? '#2a2420' : '#faf8f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: isMobile ? '20px' : '24px' }}>{t.avatar}</div>
                      <div>
                        <div style={{ fontWeight: '600', fontSize: isMobile ? '13px' : '15px', fontFamily: FONTS.body }}>{t.name}</div>
                        <div style={{ fontSize: isMobile ? '12px' : '13px', color: theme.textMuted, fontFamily: FONTS.body }}>{t.role}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* ============================================ */}
        {/* CTA */}
        {/* ============================================ */}
        <section style={{
          padding: isMobile ? '60px 20px' : '80px 32px',
          backgroundColor: BRAND.blue,
        }}>
          <ScrollReveal>
            <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
              <h2 style={{ fontSize: isMobile ? '28px' : '42px', fontWeight: '800', fontFamily: FONTS.heading, color: '#fff', marginBottom: '16px', lineHeight: '1.2' }}>
                Let's Find What's Slowing You Down
              </h2>
              <p style={{ fontSize: isMobile ? '14px' : '17px', color: 'rgba(255,255,255,0.85)', lineHeight: '1.7', marginBottom: '32px', fontFamily: FONTS.body }}>
                Book a free call. I'll map out which manual processes in your business are costing you the most time — and show you how to automate them.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => navigate('/book')}
                  style={{
                    padding: isMobile ? '14px 24px' : '16px 32px',
                    backgroundColor: '#fff',
                    color: BRAND.blue,
                    border: 'none',
                    borderRadius: '12px',
                    fontWeight: '700',
                    fontSize: isMobile ? '14px' : '16px',
                    fontFamily: FONTS.body,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    textDecoration: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <ChatCircle size={isMobile ? 18 : 20} />Book a Free Call
                </button>
              </div>
            </div>
          </ScrollReveal>
        </section>
      </main>

      {/* ============================================ */}
      {/* FOOTER */}
      {/* ============================================ */}
      <footer style={{ padding: isMobile ? '32px 16px 20px' : '48px 32px 24px', backgroundColor: theme.bg, borderTop: `1px solid ${theme.cardBorder}` }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: 'center', gap: isMobile ? '20px' : '24px', marginBottom: '24px', textAlign: isMobile ? 'center' : 'left' }}>
            <div onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <img src="/BrewedOpsLogo-64.png" alt="BrewedOps Logo" width={28} height={28} style={{ width: '28px', height: '28px', borderRadius: '8px' }} />
              <span style={{ fontSize: '16px', fontWeight: '700', fontFamily: FONTS.heading }}>
                <span style={{ color: isDark ? '#fff' : BRAND.brown }}>Brewed</span>
                <span style={{ color: BRAND.blue }}>Ops</span>
              </span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: isMobile ? '16px' : '32px', justifyContent: 'center' }}>
              <a href="/" style={{ color: theme.textMuted, fontSize: isMobile ? '13px' : '14px', textDecoration: 'none', fontFamily: FONTS.body }}>Home</a>
              <a href="/portfolio" style={{ color: theme.textMuted, fontSize: isMobile ? '13px' : '14px', textDecoration: 'none', fontFamily: FONTS.body }}>Portfolio</a>
              <a href="/#services" style={{ color: theme.textMuted, fontSize: isMobile ? '13px' : '14px', textDecoration: 'none', fontFamily: FONTS.body }}>Services</a>
              <a href="/about" style={{ color: theme.textMuted, fontSize: isMobile ? '13px' : '14px', textDecoration: 'none', fontFamily: FONTS.body }}>About</a>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {socialLinks.map((social, i) => (
                social.username ? (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: theme.textMuted }} title={social.name}>
                    <social.icon size={16} />
                    <span style={{ fontSize: '12px', fontFamily: FONTS.body }}>{social.username}</span>
                  </div>
                ) : (
                  <a key={i} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.name} style={{ color: theme.textMuted, textDecoration: 'none' }} title={social.name}>
                    <social.icon size={16} />
                  </a>
                )
              ))}
            </div>
          </div>
          <div style={{ paddingTop: '20px', borderTop: `1px solid ${theme.cardBorder}`, textAlign: 'center' }}>
            <p style={{ fontSize: isMobile ? '11px' : '13px', color: theme.textMuted, fontFamily: FONTS.body }}>
              &copy; 2025 Kenneth Villar. Built with BrewedOps.
            </p>
          </div>
        </div>
      </footer>

      {/* ============================================ */}
      {/* MOBILE DRAWER */}
      {/* ============================================ */}
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
}

export default PortfolioPage;
