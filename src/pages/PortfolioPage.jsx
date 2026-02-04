/**
 * PortfolioPage Component
 * Path: /portfolio
 * Clean, editorial-style portfolio — no animations, client-focused copy.
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ScrollReveal from '@/components/ui/ScrollReveal';
import {
  CaretRight,
  CaretDown,
  Code,
  Lightning,
  GearSix,
  Star,
  ArrowSquareOut,
  Envelope,
  Sun,
  Moon,
  Medal,
  ChatCircle,
  CheckCircle,
  Briefcase,
  MapPin,
  CalendarBlank,
  Headphones,
  Wrench,
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
  Timer
} from '@phosphor-icons/react';
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
// SOCIAL ICONS
// ============================================
const FacebookIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const DiscordIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z"/>
  </svg>
);

const LinkedInIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

// ============================================
// MAIN COMPONENT
// ============================================
function PortfolioPage({ isDark, setIsDark }) {
  const navigate = useNavigate();
  const theme = getTheme(isDark);
  const [isScrolled, setIsScrolled] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth < 1024;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ---- DATA ----

  const services = [
    {
      icon: GearSix,
      title: 'GHL CRM Setup',
      description: 'A CRM that works the way your team actually sells. Pipelines, contact management, and custom fields \u2014 all configured around your workflow.',
      features: ['Pipeline Setup', 'Contact Management', 'Custom Fields', 'Team Access'],
      color: BRAND.blue,
    },
    {
      icon: Lightning,
      title: 'GHL Automation',
      description: 'Automated follow-ups, SMS campaigns, and trigger-based workflows that nurture leads while you focus on closing deals.',
      features: ['Email Sequences', 'SMS Campaigns', 'Trigger Actions', 'Lead Scoring'],
      color: BRAND.green,
    },
    {
      icon: Code,
      title: 'Vibe Coding',
      description: 'Custom web applications, dashboards, and internal tools built with React and Supabase \u2014 designed around your specific process.',
      features: ['React Apps', 'Custom Dashboards', 'API Integrations', 'Responsive UI'],
      color: '#8b5cf6',
    },
    {
      icon: Headphones,
      title: 'Customer Support',
      description: '11+ years handling Tier 2 escalations, technical support, and SLA-driven operations across chat, email, and phone.',
      features: ['Tier 2 Escalations', 'Technical Support', 'SLA Management', 'CRM Expert'],
      color: '#f59e0b',
    },
  ];

  const toolCategories = [
    { name: 'CRM & Support', tools: [
      { name: 'Intercom', icon: 'https://cdn.simpleicons.org/intercom/1F8DED' },
      { name: 'Zendesk', icon: 'https://cdn.simpleicons.org/zendesk/03363D' },
      { name: 'HubSpot', icon: 'https://cdn.simpleicons.org/hubspot/FF7A59' },
      { name: 'HighLevel', icon: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Cdefs%3E%3ClinearGradient id="ghl" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23FF5F1F"/%3E%3Cstop offset="50%25" style="stop-color:%23FF8C00"/%3E%3Cstop offset="100%25" style="stop-color:%23FFB347"/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect rx="20" fill="url(%23ghl)" width="100" height="100"/%3E%3Ctext x="50" y="68" font-family="Arial Black" font-size="45" fill="white" text-anchor="middle" font-weight="bold"%3EHL%3C/text%3E%3C/svg%3E' },
    ]},
    { name: 'Communication', tools: [
      { name: 'Slack', icon: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg' },
      { name: 'Zoom', icon: 'https://cdn.simpleicons.org/zoom/0B5CFF' },
      { name: 'Google Meet', icon: 'https://cdn.simpleicons.org/googlemeet/00897B' },
      { name: 'Skype', icon: 'https://upload.wikimedia.org/wikipedia/commons/6/60/Skype_logo_%282019%E2%80%93present%29.svg' },
    ]},
    { name: 'Project Management', tools: [
      { name: 'Trello', icon: 'https://cdn.simpleicons.org/trello/0052CC' },
      { name: 'ClickUp', icon: 'https://cdn.simpleicons.org/clickup/7B68EE' },
      { name: 'Notion', icon: 'https://cdn.simpleicons.org/notion/000000' },
      { name: 'Asana', icon: 'https://cdn.simpleicons.org/asana/F06A6A' },
    ]},
    { name: 'eCommerce', tools: [
      { name: 'Shopify', icon: 'https://cdn.simpleicons.org/shopify/7AB55C' },
      { name: 'WooCommerce', icon: 'https://cdn.simpleicons.org/woocommerce/96588A' },
      { name: 'Lightspeed', icon: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect rx="15" fill="%23E6500E" width="100" height="100"/%3E%3Cpath d="M30 20 L30 80 L70 80 L70 68 L44 68 L44 20 Z" fill="white"/%3E%3C/svg%3E' },
    ]},
    { name: 'Development', tools: [
      { name: 'React', icon: 'https://cdn.simpleicons.org/react/61DAFB' },
      { name: 'Vite', icon: 'https://cdn.simpleicons.org/vite/646CFF' },
      { name: 'Tailwind', icon: 'https://cdn.simpleicons.org/tailwindcss/06B6D4' },
      { name: 'Supabase', icon: 'https://cdn.simpleicons.org/supabase/3FCF8E' },
      { name: 'n8n', icon: 'https://cdn.simpleicons.org/n8n/EA4B71' },
    ]},
    { name: 'Productivity', tools: [
      { name: 'Google Workspace', icon: 'https://cdn.simpleicons.org/google/4285F4' },
      { name: 'Microsoft 365', icon: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"%3E%3Cpath fill="%230078D4" d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z"/%3E%3C/svg%3E' },
      { name: 'ChatGPT', icon: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg' },
      { name: 'Claude', icon: 'https://cdn.simpleicons.org/anthropic/191919' },
    ]},
  ];

  const experience = [
    { role: 'Support Specialist', company: 'Lightspeed', period: 'March 2024 \u2013 Present', description: 'Resolve hardware issues, troubleshoot POS errors for eCommerce and Retail stores. CRM using Intercom, Zendesk, and Purecloud.', current: true },
    { role: 'Customer Support Tier 2 SME', company: 'Concentrix', period: 'April 2022 \u2013 January 2024', description: 'Resolved complex issues via chat/email, worked with Tier 3 teams within SLA requirements.', current: false },
    { role: 'Sales Chat Support', company: 'Concentrix', period: 'October 2017 \u2013 August 2021', description: 'Live web chat support, upselling/cross-selling, order support, returns and exchanges.', current: false },
    { role: 'Chat Support \u2013 US TELCO', company: 'Alorica', period: 'December 2016 \u2013 July 2017', description: 'Billing solutions, troubleshooting, guiding customers to products and services.', current: false },
    { role: 'Customer Service Analyst', company: 'Foundever (Sykes Asia Inc.)', period: 'July 2014 \u2013 December 2016', description: 'Reviewing auto-mobile loan contracts and documents, posting credit card and loan payments.', current: false },
  ];

  const skills = [
    { category: 'Admin', items: ['Calendar Management', 'Email Management', 'Google Sheet Dashboard', 'Scheduling'], color: BRAND.blue },
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
        title="Portfolio | BrewedOps"
        description="View Kenneth V's portfolio - GHL CRM setup, automation, vibe coding, and customer support services. 11+ years customer support experience."
        keywords="BrewedOps portfolio, GHL CRM, automation, web development, Filipino VA services"
      />

      {/* ============================================ */}
      {/* NAV */}
      {/* ============================================ */}
      <nav style={{
        padding: isMobile ? '12px 16px' : '12px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: `1px solid ${theme.cardBorder}`,
        backgroundColor: isScrolled ? (isDark ? 'rgba(13,11,9,0.95)' : 'rgba(255,255,255,0.95)') : theme.bg,
        backdropFilter: isScrolled ? 'blur(12px)' : 'none',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginRight: isMobile ? '0' : '20px', cursor: 'pointer' }}>
            <img src="https://i.imgur.com/R52jwPvt.png" alt="BrewedOps Logo" width={32} height={32} style={{ width: '32px', height: '32px', borderRadius: '8px' }} />
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
              <button onClick={() => navigate('/services')} style={{ height: '40px', padding: '0 12px', backgroundColor: 'transparent', color: theme.textMuted, border: 'none', fontSize: '14px', fontWeight: '500', fontFamily: FONTS.body, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                Services
              </button>
              <ToolsDropdown isDark={isDark} theme={theme} onToolClick={(path) => navigate(path)} onLoginClick={() => navigate('/login')} />
              <button onClick={() => navigate('/fuelyx')} style={{ height: '40px', padding: '0 12px', backgroundColor: 'transparent', color: '#14b8a6', border: 'none', fontSize: '14px', fontWeight: '600', fontFamily: FONTS.body, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                Fuelyx
              </button>
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
          <button onClick={() => setIsDark(!isDark)} aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'} style={{ width: '36px', height: '36px', backgroundColor: 'transparent', border: `1px solid ${theme.cardBorder}`, borderRadius: '8px', color: theme.textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '8px' }}>
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          {!isMobile ? (
            <>
              <button onClick={() => navigate('/login')} style={{ height: '36px', padding: '0 14px', backgroundColor: 'transparent', color: theme.text, border: `1px solid ${theme.cardBorder}`, borderRadius: '8px', fontSize: '13px', fontWeight: '500', fontFamily: FONTS.body, cursor: 'pointer', marginLeft: '4px' }}>Login</button>
              <button onClick={() => navigate('/signup')} style={{ height: '36px', padding: '0 14px', backgroundColor: BRAND.blue, color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', fontFamily: FONTS.body, cursor: 'pointer' }}>Sign Up</button>
            </>
          ) : (
            <button onClick={() => setMobileMenuOpen(true)} aria-label="Open navigation menu" style={{ width: '36px', height: '36px', backgroundColor: 'transparent', border: `1px solid ${theme.cardBorder}`, borderRadius: '8px', color: theme.textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '4px' }}>
              <List size={18} />
            </button>
          )}
        </div>
      </nav>

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
              maskImage: 'radial-gradient(ellipse 85% 80% at 60% 55%, rgba(0,0,0,1) 30%, rgba(0,0,0,0.6) 60%, rgba(0,0,0,0) 80%)',
              WebkitMaskImage: 'radial-gradient(ellipse 85% 80% at 60% 55%, rgba(0,0,0,1) 30%, rgba(0,0,0,0.6) 60%, rgba(0,0,0,0) 80%)',
            }}>
              <img
                src="https://i.imgur.com/Z5kBKUU.png"
                alt=""
                width={750}
                height={900}
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
              bottom: 0,
              left: 0,
              width: '100%',
              height: '80px',
              zIndex: 2,
              display: 'block',
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
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    padding: '10px 16px',
                    backgroundColor: isDark ? 'rgba(81, 175, 67, 0.1)' : 'rgba(81, 175, 67, 0.08)',
                    border: `1px solid ${BRAND.green}30`,
                    borderRadius: '100px',
                  }}>
                    <Medal size={16} style={{ color: BRAND.green }} />
                    <span style={{ fontSize: '13px', color: BRAND.green, fontWeight: '600', fontFamily: FONTS.body }}>HL Accelerator Student</span>
                  </div>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    padding: '10px 16px',
                    backgroundColor: isDark ? 'rgba(0, 74, 172, 0.1)' : 'rgba(0, 74, 172, 0.08)',
                    border: `1px solid ${BRAND.blue}30`,
                    borderRadius: '100px',
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
                  I Build the Systems That Let You Focus on Growth
                </h1>

                <p style={{
                  fontSize: isMobile ? '15px' : '18px',
                  color: theme.textMuted,
                  lineHeight: '1.75',
                  marginBottom: '24px',
                  fontFamily: FONTS.body,
                }}>
                  11 years in customer support taught me exactly where business operations break down. Now I automate CRMs, build custom tools, and create workflows that remove bottlenecks — so you stop firefighting and start scaling.
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: isMobile ? '12px' : '24px', marginBottom: '28px', fontSize: isMobile ? '14px' : '15px', color: theme.textMuted, justifyContent: isMobile ? 'center' : 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><MapPin size={16} /><span>Cabuyao, Laguna, PH</span></div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Envelope size={16} /><span>kvillarmain@gmail.com</span></div>
                </div>

                {/* CTA Buttons */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '28px', justifyContent: isMobile ? 'center' : 'flex-start' }}>
                  <a
                    href="https://ghl.brewedops.com/widget/booking/ZSkJj8URVNZLxTy5nCgc"
                    target="_blank"
                    rel="noopener noreferrer"
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
                  </a>
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
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
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
                      <a key={i} href={social.href} target="_blank" rel="noopener noreferrer" style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: isDark ? '#2a2420' : '#faf8f5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.textMuted, textDecoration: 'none' }} title={social.name}>
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
        <section style={{
          padding: isMobile ? '48px 16px' : '72px 32px',
          backgroundColor: theme.bgAlt,
          borderTop: `1px solid ${theme.cardBorder}`,
          borderBottom: `1px solid ${theme.cardBorder}`,
        }}>
          <ScrollReveal>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: isMobile ? '24px' : '40px' }}>
              <span style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '3px', color: BRAND.green, textTransform: 'uppercase', marginBottom: '10px', display: 'block', fontFamily: FONTS.body }}>Tech Stack</span>
              <h2 style={{ fontSize: isMobile ? '28px' : '40px', fontWeight: '800', fontFamily: FONTS.heading, color: isDark ? '#fff' : BRAND.brown, marginBottom: '10px' }}>Tools I Work With</h2>
              <p style={{ fontSize: isMobile ? '13px' : '15px', color: theme.textMuted, maxWidth: '450px', margin: '0 auto', fontFamily: FONTS.body }}>Platforms and technologies I use daily to deliver exceptional results.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: isMobile ? '12px' : '20px' }}>
              {toolCategories.map((category, i) => (
                <div
                  key={i}
                  style={{
                    padding: isMobile ? '16px' : '24px 28px',
                    backgroundColor: theme.cardBg,
                    border: `1px solid ${theme.cardBorder}`,
                    borderRadius: isMobile ? '12px' : '16px',
                  }}
                >
                  <h3 style={{
                    fontSize: isMobile ? '11px' : '12px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                    marginBottom: isMobile ? '12px' : '16px',
                    color: BRAND.blue,
                    fontFamily: FONTS.heading,
                  }}>
                    {category.name}
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: isMobile ? '6px' : '10px' }}>
                    {category.tools.map((tool, j) => (
                      <div
                        key={j}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: isMobile ? '6px' : '10px',
                          padding: isMobile ? '8px 10px' : '10px 16px',
                          backgroundColor: isDark ? 'rgba(42, 36, 32, 0.8)' : 'rgba(250, 248, 245, 0.8)',
                          borderRadius: isMobile ? '8px' : '10px',
                          border: `1px solid ${isDark ? '#332d26' : '#e8e0d4'}`,
                        }}
                      >
                        <img src={tool.icon} alt={tool.name} style={{ width: isMobile ? '18px' : '22px', height: isMobile ? '18px' : '22px', objectFit: 'contain' }} />
                        <span style={{ fontSize: isMobile ? '12px' : '14px', fontWeight: '600', color: theme.text, fontFamily: FONTS.body }}>{tool.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          </ScrollReveal>
        </section>

        {/* ============================================ */}
        {/* PROJECTS */}
        {/* ============================================ */}
        <section style={{
          padding: isMobile ? '48px 16px' : '80px 32px',
          backgroundColor: theme.bg,
        }}>
          <ScrollReveal>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: isMobile ? '32px' : '56px' }}>
              <span style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '3px', color: BRAND.green, textTransform: 'uppercase', marginBottom: '10px', display: 'block', fontFamily: FONTS.body }}>Portfolio</span>
              <h2 style={{ fontSize: isMobile ? '28px' : '40px', fontWeight: '800', fontFamily: FONTS.heading, color: isDark ? '#fff' : BRAND.brown, marginBottom: '10px' }}>What I've Built</h2>
              <p style={{ fontSize: isMobile ? '14px' : '16px', color: theme.textMuted, maxWidth: '500px', margin: '0 auto', fontFamily: FONTS.body }}>Real products and tools that solve real problems for real users.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: isMobile ? '16px' : '28px' }}>
              {/* BrewedOps Card */}
              <div style={{
                backgroundColor: theme.cardBg,
                border: `1px solid ${theme.cardBorder}`,
                borderRadius: '16px',
                overflow: 'hidden',
              }}>
                <div style={{
                  width: '100%',
                  aspectRatio: '16 / 10',
                  overflow: 'hidden',
                  borderBottom: `1px solid ${theme.cardBorder}`,
                }}>
                  <img
                    src="https://i.imgur.com/NYgLMDT.png"
                    alt="BrewedOps Tools Screenshot"
                    loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'left top' }}
                  />
                </div>
                <div style={{ padding: isMobile ? '20px' : '28px' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', backgroundColor: `${BRAND.green}12`, borderRadius: '100px', marginBottom: '14px' }}>
                    <span style={{ fontSize: '11px', color: BRAND.green, fontWeight: '700', fontFamily: FONTS.body, letterSpacing: '0.5px' }}>FEATURED PROJECT</span>
                  </div>
                  <h3 style={{ fontSize: isMobile ? '22px' : '28px', fontWeight: '800', fontFamily: FONTS.heading, marginBottom: '8px' }}>
                    <span style={{ color: isDark ? '#fff' : BRAND.brown }}>Brewed</span>
                    <span style={{ color: BRAND.blue }}>Ops</span>
                    <span style={{ color: isDark ? '#fff' : BRAND.brown }}> Tools</span>
                  </h3>
                  <p style={{ fontSize: isMobile ? '13px' : '15px', color: theme.textMuted, lineHeight: '1.7', marginBottom: '16px', fontFamily: FONTS.body }}>
                    A productivity hub for Filipino VAs & freelancers with 22+ free tools, finance tracking, task management, and premium features.
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
                    {['React', 'Supabase', 'Tailwind CSS', 'Vite', 'shadcn/ui'].map((tag) => (
                      <span key={tag} style={{
                        fontSize: '12px',
                        padding: '6px 12px',
                        backgroundColor: `${BRAND.blue}10`,
                        color: BRAND.blue,
                        borderRadius: '100px',
                        fontWeight: '600',
                        fontFamily: FONTS.body,
                      }}>{tag}</span>
                    ))}
                  </div>
                  <button
                    onClick={() => navigate('/')}
                    style={{
                      padding: '12px 24px',
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
                    }}
                  >
                    View Project <ArrowSquareOut size={16} />
                  </button>
                </div>
              </div>

              {/* Fuelyx Card */}
              <div style={{
                backgroundColor: theme.cardBg,
                border: `1px solid ${theme.cardBorder}`,
                borderRadius: '16px',
                overflow: 'hidden',
              }}>
                <div style={{
                  width: '100%',
                  aspectRatio: '16 / 10',
                  overflow: 'hidden',
                  borderBottom: `1px solid ${theme.cardBorder}`,
                  background: isDark ? '#0c1929' : '#f0fdfa',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {/* Fuelyx icon + label as visual */}
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '16px',
                      background: 'linear-gradient(135deg, #134e4a, #14b8a6)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 12px',
                    }}>
                      <svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10S2 17.523 2 12" />
                        <path d="M12 2v10l4.5 4.5" />
                        <path d="M2 12h10" />
                      </svg>
                    </div>
                    <div style={{ fontSize: '28px', fontWeight: '800', color: '#14b8a6', fontFamily: FONTS.heading }}>Fuelyx</div>
                    <div style={{ fontSize: '14px', color: isDark ? '#5eead4' : '#0d9488', fontFamily: FONTS.body, marginTop: '4px' }}>Your Nutrition, Simplified</div>
                  </div>
                </div>
                <div style={{ padding: isMobile ? '20px' : '28px' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', backgroundColor: 'rgba(20, 184, 166, 0.1)', borderRadius: '100px', marginBottom: '14px' }}>
                    <span style={{ fontSize: '11px', color: '#14b8a6', fontWeight: '700', fontFamily: FONTS.body, letterSpacing: '0.5px' }}>MOBILE APP</span>
                  </div>
                  <h3 style={{ fontSize: isMobile ? '22px' : '28px', fontWeight: '800', fontFamily: FONTS.heading, color: '#14b8a6', marginBottom: '8px' }}>
                    Fuelyx
                  </h3>
                  <p style={{ fontSize: isMobile ? '13px' : '15px', color: theme.textMuted, lineHeight: '1.7', marginBottom: '16px', fontFamily: FONTS.body }}>
                    Track calories, log Filipino foods, monitor fasting, and achieve your health goals -- all in one beautiful, easy-to-use app built for Filipinos.
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
                    {['React Native', 'Expo', 'Supabase', 'AI Scanner', 'Fasting Timer'].map((tag) => (
                      <span key={tag} style={{
                        fontSize: '12px',
                        padding: '6px 12px',
                        backgroundColor: 'rgba(20, 184, 166, 0.1)',
                        color: '#14b8a6',
                        borderRadius: '100px',
                        fontWeight: '600',
                        fontFamily: FONTS.body,
                      }}>{tag}</span>
                    ))}
                  </div>
                  <button
                    onClick={() => navigate('/fuelyx')}
                    style={{
                      padding: '12px 24px',
                      backgroundColor: '#14b8a6',
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
                    }}
                  >
                    View Project <ArrowSquareOut size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
          </ScrollReveal>
        </section>

        {/* ============================================ */}
        {/* SERVICES */}
        {/* ============================================ */}
        <section style={{
          padding: isMobile ? '48px 16px' : '80px 32px',
          backgroundColor: theme.bgAlt,
        }}>
          <ScrollReveal>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: isMobile ? '32px' : '56px' }}>
              <span style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '3px', color: BRAND.blue, textTransform: 'uppercase', marginBottom: '10px', display: 'block', fontFamily: FONTS.body }}>Services</span>
              <h2 style={{ fontSize: isMobile ? '28px' : '40px', fontWeight: '800', fontFamily: FONTS.heading, color: isDark ? '#fff' : BRAND.brown, marginBottom: '10px' }}>How I Can Help</h2>
              <p style={{ fontSize: isMobile ? '14px' : '16px', color: theme.textMuted, maxWidth: '520px', margin: '0 auto', fontFamily: FONTS.body }}>From automation to customer support, I help businesses scale efficiently.</p>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
              gap: isMobile ? '16px' : '24px',
            }}>
              {services.map((service, i) => (
                <div
                  key={i}
                  style={{
                    padding: isMobile ? '24px 20px' : '32px 24px',
                    backgroundColor: theme.cardBg,
                    border: `1px solid ${theme.cardBorder}`,
                    borderRadius: '16px',
                  }}
                >
                  <div style={{
                    width: isMobile ? '48px' : '56px',
                    height: isMobile ? '48px' : '56px',
                    borderRadius: '14px',
                    backgroundColor: `${service.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: isMobile ? '16px' : '20px',
                  }}>
                    <service.icon size={isMobile ? 24 : 28} style={{ color: service.color }} />
                  </div>
                  <h3 style={{ fontSize: isMobile ? '18px' : '20px', fontWeight: '700', fontFamily: FONTS.heading, marginBottom: '10px', color: isDark ? '#fff' : BRAND.brown }}>{service.title}</h3>
                  <p style={{ fontSize: isMobile ? '13px' : '14px', color: theme.textMuted, lineHeight: '1.65', marginBottom: isMobile ? '16px' : '20px', fontFamily: FONTS.body }}>{service.description}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {service.features.map((feature, j) => (
                      <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: isMobile ? '13px' : '14px', color: theme.textMuted, fontFamily: FONTS.body }}>
                        <CheckCircle size={14} style={{ color: service.color, flexShrink: 0 }} />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '16px' : '20px' }}>
              {experience.map((exp, i) => (
                <div key={i} style={{ position: 'relative', paddingLeft: isMobile ? '20px' : '28px', borderLeft: `3px solid ${exp.current ? BRAND.green : theme.cardBorder}` }}>
                  <div style={{ position: 'absolute', left: isMobile ? '-6px' : '-8px', top: isMobile ? '20px' : '24px', width: isMobile ? '12px' : '13px', height: isMobile ? '12px' : '13px', borderRadius: '50%', backgroundColor: exp.current ? BRAND.green : theme.cardBorder, zIndex: 2 }} />
                  <div style={{
                    padding: isMobile ? '20px 16px' : '24px',
                    backgroundColor: theme.cardBg,
                    border: `1px solid ${theme.cardBorder}`,
                    borderRadius: '12px',
                  }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                      <h3 style={{ fontSize: isMobile ? '16px' : '18px', fontWeight: '700', color: isDark ? '#fff' : BRAND.brown, fontFamily: FONTS.heading }}>{exp.role}</h3>
                      {exp.current && <span style={{ padding: '4px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: '700', backgroundColor: `${BRAND.green}15`, color: BRAND.green }}>Current</span>}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: isMobile ? '12px' : '20px', marginBottom: '10px', fontSize: isMobile ? '12px' : '14px', color: theme.textMuted, fontFamily: FONTS.body }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Briefcase size={14} />{exp.company}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><CalendarBlank size={14} />{exp.period}</div>
                    </div>
                    <p style={{ fontSize: isMobile ? '13px' : '14px', color: theme.textMuted, lineHeight: '1.65', fontFamily: FONTS.body }}>{exp.description}</p>
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
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: isMobile ? '12px' : '20px', alignItems: 'start' }}>
              {skills.map((skill, i) => (
                <div
                  key={i}
                  style={{
                    padding: isMobile ? '16px 14px' : '24px',
                    backgroundColor: theme.cardBg,
                    border: `1px solid ${theme.cardBorder}`,
                    borderRadius: isMobile ? '12px' : '16px',
                  }}
                >
                  <h3 style={{
                    fontSize: isMobile ? '14px' : '16px',
                    fontWeight: '700',
                    marginBottom: isMobile ? '10px' : '14px',
                    color: skill.color,
                    fontFamily: FONTS.heading,
                  }}>
                    {skill.category}
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: isMobile ? '6px' : '8px' }}>
                    {skill.items.map((item, j) => (
                      <span key={j} style={{
                        padding: isMobile ? '6px 10px' : '7px 12px',
                        backgroundColor: isDark ? 'rgba(42, 36, 32, 0.8)' : 'rgba(250, 248, 245, 0.8)',
                        borderRadius: '6px',
                        fontSize: isMobile ? '11px' : '12px',
                        color: theme.textMuted,
                        fontWeight: '500',
                        fontFamily: FONTS.body,
                        border: `1px solid ${isDark ? '#332d26' : '#e8e0d4'}`,
                        lineHeight: '1.4',
                        display: 'inline-flex',
                        alignItems: 'center',
                        whiteSpace: 'nowrap',
                      }}>{item}</span>
                    ))}
                  </div>
                </div>
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
              <a
                href="https://ghl.brewedops.com/widget/booking/ZSkJj8URVNZLxTy5nCgc"
                target="_blank"
                rel="noopener noreferrer"
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
              </a>
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
              <img src="https://i.imgur.com/R52jwPvt.png" alt="BrewedOps Logo" width={28} height={28} style={{ width: '28px', height: '28px', borderRadius: '8px' }} />
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
                  <a key={i} href={social.href} target="_blank" rel="noopener noreferrer" style={{ color: theme.textMuted, textDecoration: 'none' }} title={social.name}>
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
