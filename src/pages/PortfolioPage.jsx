/**
 * PortfolioPage Component
 * Path: /portfolio
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ContainerScroll } from '@/components/ui/container-scroll-animation';
import {
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Code,
  Zap,
  Settings,
  Sparkles,
  Star,
  ExternalLink,
  Mail,
  Sun,
  Moon,
  Coffee,
  Award,
  MessageSquare,
  CheckCircle,
  Play,
  Briefcase,
  MapPin,
  Calendar,
  Headphones,
  Wrench,
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
  Menu
} from 'lucide-react';
import SEO from '@/components/SEO';
const MobileDrawer = React.lazy(() => import('@/components/layout/MobileDrawer'));

// Brand Config
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

// Inject Google Fonts
if (typeof document !== 'undefined' && !document.getElementById('portfolio-fonts')) {
  const link = document.createElement('link');
  link.id = 'portfolio-fonts';
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Poppins:wght@400;500;600;700&display=swap';
  document.head.appendChild(link);
}

const getTheme = (isDark) => ({
  bg: isDark ? '#0d0b09' : '#ffffff',
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
    ]
  },
  {
    name: 'Video Tools',
    tools: [
      { icon: Film, title: 'Video Compressor', path: '/videocompressor' },
      { icon: Scissors, title: 'Video Trimmer', path: '/videotrimmer' },
    ]
  },
  {
    name: 'Document Tools',
    tools: [
      { icon: FileEdit, title: 'PDF Editor', path: '/pdfeditor' },
      { icon: Merge, title: 'PDF Merge', path: '/pdfmerge' },
      { icon: Split, title: 'PDF Split', path: '/pdfsplit' },
      { icon: BookOpen, title: 'Markdown Viewer', path: '/markdownviewer' },
    ]
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
    ]
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

// Social Icons
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

// Featured Projects Carousel with Arrow Navigation
function FeaturedProjectsCarousel({ isDark, theme, isMobile, navigate }) {
  const [currentProject, setCurrentProject] = useState(0);
  const FUELYX = { primary: '#14b8a6', secondary: '#0d9488' };

  const projects = [
    {
      id: 'brewedops',
      badge: 'FEATURED PROJECT',
      badgeColor: BRAND.green,
      title: (
        <>
          <span style={{ color: isDark ? '#fff' : BRAND.brown }}>Brewed</span>
          <span style={{ color: BRAND.blue }}>Ops</span>
          <span style={{ color: isDark ? '#fff' : BRAND.brown }}> Tools</span>
        </>
      ),
      subtitle: '(Vibe Coding)',
      description: 'A productivity hub for Filipino VAs & freelancers with 20+ free tools, finance tracking, task management, and premium features.',
      tags: ['React', 'Supabase', 'Tailwind CSS', 'Vite', 'shadcn/ui'],
      accentColor: BRAND.blue,
      bgColor: isDark ? '#0d0b09' : BRAND.cream,
      image: 'https://i.imgur.com/NYgLMDT.png',
      buttonText: 'View Project',
      onButtonClick: () => navigate('/'),
    },
    {
      id: 'fuelyx',
      badge: 'MOBILE APP',
      badgeColor: FUELYX.primary,
      titleComponent: (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '16px' }}>
          <div style={{
            width: isMobile ? '48px' : '64px',
            height: isMobile ? '48px' : '64px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #134e4a, #14b8a6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 32px rgba(20, 184, 166, 0.3)'
          }}>
            <svg width={isMobile ? 28 : 36} height={isMobile ? 28 : 36} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10S2 17.523 2 12" />
              <path d="M12 2v10l4.5 4.5" />
              <path d="M2 12h10" />
            </svg>
          </div>
          <h2 style={{
            fontSize: isMobile ? '36px' : '56px',
            fontWeight: '800',
            fontFamily: FONTS.heading,
            color: FUELYX.primary,
            lineHeight: '1.1',
            margin: 0
          }}>
            Fuelyx
          </h2>
        </div>
      ),
      subtitle: (
        <span>Your Nutrition, <span style={{ color: FUELYX.primary }}>Simplified</span></span>
      ),
      description: 'Track calories, log Filipino foods, monitor fasting, and achieve your health goals — all in one beautiful, easy-to-use app built for Filipinos.',
      tags: ['React Native', 'Expo', 'Supabase', 'AI Scanner', 'Fasting Timer'],
      accentColor: FUELYX.primary,
      bgColor: isDark ? '#0d0b09' : '#f0fdfa',
      isPhoneMockup: true,
      buttonText: 'View Project',
      onButtonClick: () => navigate('/fuelyx'),
    }
  ];

  const currentData = projects[currentProject];

  const goToPrev = () => {
    setCurrentProject((prev) => (prev === 0 ? projects.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentProject((prev) => (prev === projects.length - 1 ? 0 : prev + 1));
  };

  return (
    <section
      style={{
        backgroundColor: currentData.bgColor,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Navigation Arrows */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: isMobile ? '8px' : '24px',
        transform: 'translateY(-50%)',
        zIndex: 20,
      }}>
        <button
          onClick={goToPrev}
          style={{
            width: isMobile ? '40px' : '56px',
            height: isMobile ? '40px' : '56px',
            borderRadius: '50%',
            backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
            border: `2px solid ${currentData.accentColor}`,
            color: currentData.accentColor,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
            backdropFilter: 'blur(8px)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = currentData.accentColor;
            e.currentTarget.style.color = '#fff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';
            e.currentTarget.style.color = currentData.accentColor;
          }}
        >
          <ChevronLeft size={isMobile ? 20 : 28} />
        </button>
      </div>

      <div style={{
        position: 'absolute',
        top: '50%',
        right: isMobile ? '8px' : '24px',
        transform: 'translateY(-50%)',
        zIndex: 20,
      }}>
        <button
          onClick={goToNext}
          style={{
            width: isMobile ? '40px' : '56px',
            height: isMobile ? '40px' : '56px',
            borderRadius: '50%',
            backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
            border: `2px solid ${currentData.accentColor}`,
            color: currentData.accentColor,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
            backdropFilter: 'blur(8px)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = currentData.accentColor;
            e.currentTarget.style.color = '#fff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';
            e.currentTarget.style.color = currentData.accentColor;
          }}
        >
          <ChevronRight size={isMobile ? 20 : 28} />
        </button>
      </div>

      {/* Dots Indicator */}
      <div style={{
        position: 'absolute',
        bottom: isMobile ? '16px' : '32px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 20,
        display: 'flex',
        gap: '12px',
      }}>
        {projects.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentProject(idx)}
            style={{
              width: currentProject === idx ? '32px' : '12px',
              height: '12px',
              borderRadius: '6px',
              backgroundColor: currentProject === idx ? currentData.accentColor : (isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)'),
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          />
        ))}
      </div>

      {currentData.isPhoneMockup ? (
        /* Phone Mockup for Fuelyx */
        <div
          key={currentData.id}
          className="project-slide"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: isMobile ? '48px 16px 80px' : '80px 32px 120px',
            animation: 'fadeSlideIn 0.5s ease-out',
          }}
        >
          {/* Title Section */}
          <div style={{ textAlign: 'center', marginBottom: isMobile ? '32px' : '48px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 18px', backgroundColor: `${currentData.badgeColor}15`, borderRadius: '100px', marginBottom: '20px' }}>
              <Sparkles size={16} style={{ color: currentData.badgeColor }} />
              <span style={{ fontSize: '12px', color: currentData.badgeColor, fontWeight: '700', fontFamily: FONTS.body, letterSpacing: '1px' }}>{currentData.badge}</span>
            </div>

            {currentData.titleComponent}

            <h3 style={{
              fontSize: isMobile ? '20px' : '32px',
              fontWeight: '600',
              color: theme.textMuted,
              marginBottom: '16px',
              fontFamily: FONTS.heading
            }}>
              {currentData.subtitle}
            </h3>

            <p style={{
              fontSize: isMobile ? '14px' : '18px',
              color: theme.textMuted,
              maxWidth: '600px',
              margin: '0 auto 24px',
              lineHeight: '1.7',
              fontFamily: FONTS.body
            }}>
              {currentData.description}
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', marginBottom: '20px' }}>
              {currentData.tags.map((tag, j) => (
                <span key={j} style={{
                  fontSize: isMobile ? '12px' : '14px',
                  padding: isMobile ? '8px 14px' : '10px 20px',
                  backgroundColor: `${currentData.accentColor}15`,
                  color: currentData.accentColor,
                  borderRadius: '100px',
                  fontWeight: '600',
                  fontFamily: FONTS.body
                }}>{tag}</span>
              ))}
            </div>

            <button
              onClick={currentData.onButtonClick}
              style={{
                padding: isMobile ? '14px 28px' : '16px 36px',
                backgroundColor: currentData.accentColor,
                color: '#fff',
                border: 'none',
                borderRadius: '14px',
                fontWeight: '600',
                fontSize: isMobile ? '15px' : '16px',
                cursor: 'pointer',
                fontFamily: FONTS.body,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: `0 8px 32px ${currentData.accentColor}40`,
                transition: 'all 0.2s ease'
              }}
            >
              {currentData.buttonText} <ExternalLink size={18} />
            </button>
          </div>

          {/* Phone Mockup - Exact match to screenshot */}
          <div style={{
            position: 'relative',
            width: isMobile ? '260px' : '300px',
            height: isMobile ? '520px' : '600px',
          }}>
            {/* Floating Goal Reached Badge - Outside phone on left */}
            <div style={{
              position: 'absolute',
              left: isMobile ? '-40px' : '-60px',
              top: isMobile ? '60px' : '80px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 14px',
              backgroundColor: '#0a1a10',
              borderRadius: '12px',
              border: '1px solid rgba(34, 197, 94, 0.5)',
              zIndex: 30,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
            }}>
              <div style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                backgroundColor: '#22c55e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <CheckCircle size={14} color="#fff" />
              </div>
              <div>
                <div style={{ color: '#22c55e', fontSize: '12px', fontWeight: '700' }}>Goal Reached!</div>
                <div style={{ color: '#4ade80', fontSize: '10px' }}>Protein target hit</div>
              </div>
            </div>

            {/* Floating 7 Day Streak Badge - Outside phone on right */}
            <div style={{
              position: 'absolute',
              right: isMobile ? '-40px' : '-60px',
              bottom: isMobile ? '100px' : '120px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 14px',
              backgroundColor: '#1a1208',
              borderRadius: '12px',
              border: '1px solid rgba(251, 146, 60, 0.5)',
              zIndex: 30,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
            }}>
              <div style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                backgroundColor: '#fb923c',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <span style={{ fontSize: '15px' }}>🔥</span>
              </div>
              <div>
                <div style={{ color: '#fff', fontSize: '12px', fontWeight: '700' }}>7 Day Streak!</div>
                <div style={{ color: '#fdba74', fontSize: '10px' }}>Keep it going</div>
              </div>
            </div>

            {/* Phone Frame */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(145deg, #2a2a2a 0%, #1a1a1a 100%)',
              borderRadius: '44px',
              padding: '10px',
              boxShadow: `
                0 50px 100px -20px rgba(0, 0, 0, 0.5),
                0 30px 60px -30px rgba(0, 0, 0, 0.6),
                inset 0 1px 0 rgba(255, 255, 255, 0.1)
              `,
            }}>
              {/* Screen */}
              <div style={{
                width: '100%',
                height: '100%',
                borderRadius: '34px',
                overflow: 'hidden',
                position: 'relative',
                background: '#0c1929',
              }}>
                {/* Dynamic Island */}
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '90px',
                  height: '26px',
                  backgroundColor: '#000',
                  borderRadius: '16px',
                  zIndex: 10,
                }} />

                {/* App Content */}
                <div style={{
                  width: '100%',
                  height: '100%',
                  background: '#0c1929',
                  padding: '48px 14px 12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}>
                  {/* Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#fff', fontSize: '16px', fontWeight: '700', fontFamily: FONTS.heading }}>Fuelyx</span>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '4px 10px',
                      backgroundColor: 'rgba(251, 146, 60, 0.15)',
                      borderRadius: '16px',
                      border: '1px solid rgba(251, 146, 60, 0.3)',
                    }}>
                      <span style={{ fontSize: '12px' }}>🔥</span>
                      <span style={{ color: '#fb923c', fontSize: '12px', fontWeight: '600' }}>7</span>
                    </div>
                  </div>

                  {/* Calories Card */}
                  <div style={{
                    backgroundColor: 'rgba(20, 184, 166, 0.12)',
                    borderRadius: '14px',
                    padding: '14px',
                    border: '1px solid rgba(20, 184, 166, 0.25)',
                    marginTop: '16px',
                  }}>
                    <div style={{ color: '#5eead4', fontSize: '9px', fontWeight: '600', letterSpacing: '1px', marginBottom: '2px' }}>DAILY INTAKE</div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                      <span style={{ color: '#fff', fontSize: '32px', fontWeight: '800' }}>1,245</span>
                      <span style={{ color: '#64748b', fontSize: '14px' }}>/ 2,100</span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '5px',
                      backgroundColor: 'rgba(20, 184, 166, 0.25)',
                      borderRadius: '3px',
                      marginTop: '8px',
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        width: '59%',
                        height: '100%',
                        backgroundColor: '#14b8a6',
                        borderRadius: '3px',
                      }} />
                    </div>
                  </div>

                  {/* Macros */}
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {[
                      { label: 'Protein', value: '65g', color: '#22c55e' },
                      { label: 'Carbs', value: '142g', color: '#f59e0b' },
                      { label: 'Fat', value: '48g', color: '#ef4444' },
                    ].map((macro, i) => (
                      <div key={i} style={{
                        flex: 1,
                        backgroundColor: 'rgba(255, 255, 255, 0.04)',
                        borderRadius: '10px',
                        padding: '10px 6px',
                        textAlign: 'center',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                      }}>
                        <div style={{ color: macro.color, fontSize: '16px', fontWeight: '700' }}>{macro.value}</div>
                        <div style={{ color: '#64748b', fontSize: '9px', marginTop: '2px' }}>{macro.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* AI Scanner */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                  }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg, #14b8a6, #0d9488)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </div>
                    <div>
                      <div style={{ color: '#fff', fontSize: '13px', fontWeight: '600' }}>AI Scanner</div>
                      <div style={{ color: '#64748b', fontSize: '10px' }}>Snap & log food</div>
                    </div>
                  </div>

                  {/* Spacer to push nav to bottom */}
                  <div style={{ flex: 1 }} />

                  {/* Bottom Nav */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    padding: '12px 0 8px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  }}>
                    <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="#14b8a6" strokeWidth="2">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                    <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                      <path d="M18 20V10M12 20V4M6 20v-6" />
                    </svg>
                    <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12,6 12,12 16,14" />
                    </svg>
                    <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                      <circle cx="12" cy="12" r="3" />
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Teal Glow Effect on the right */}
            <div style={{
              position: 'absolute',
              top: '50%',
              right: '-100px',
              transform: 'translateY(-50%)',
              width: '300px',
              height: '400px',
              background: 'radial-gradient(ellipse, rgba(20, 184, 166, 0.3) 0%, transparent 70%)',
              pointerEvents: 'none',
              zIndex: -1,
              filter: 'blur(40px)',
            }} />
          </div>

          {/* Animation Styles */}
          <style>{`
            @keyframes fadeSlideIn {
              from {
                opacity: 0;
                transform: translateX(30px);
              }
              to {
                opacity: 1;
                transform: translateX(0);
              }
            }
          `}</style>
        </div>
      ) : (
        /* Container Scroll for Web Projects */
        <div
          key={currentData.id}
          className="project-slide"
          style={{ animation: 'fadeSlideIn 0.5s ease-out' }}
        >
          <ContainerScroll
            titleComponent={
              <div style={{ textAlign: 'center' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 18px', backgroundColor: `${currentData.badgeColor}15`, borderRadius: '100px', marginBottom: '20px' }}>
                  <Sparkles size={16} style={{ color: currentData.badgeColor }} />
                  <span style={{ fontSize: '12px', color: currentData.badgeColor, fontWeight: '700', fontFamily: FONTS.body, letterSpacing: '1px' }}>{currentData.badge}</span>
                </div>

                {currentData.titleComponent ? (
                  currentData.titleComponent
                ) : (
                  <h2 style={{
                    fontSize: isMobile ? '32px' : '56px',
                    fontWeight: '800',
                    fontFamily: FONTS.heading,
                    color: isDark ? '#fff' : BRAND.brown,
                    marginBottom: '16px',
                    lineHeight: '1.1'
                  }}>
                    {currentData.title}
                  </h2>
                )}

                {currentData.subtitle && (
                  <h3 style={{
                    fontSize: isMobile ? '20px' : '32px',
                    fontWeight: '600',
                    color: theme.textMuted,
                    marginBottom: '16px',
                    fontFamily: FONTS.heading
                  }}>
                    {currentData.subtitle}
                  </h3>
                )}

                <p style={{
                  fontSize: isMobile ? '14px' : '18px',
                  color: theme.textMuted,
                  maxWidth: '600px',
                  margin: '0 auto 24px',
                  lineHeight: '1.7',
                  fontFamily: FONTS.body
                }}>
                  {currentData.description}
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', marginBottom: '20px' }}>
                  {currentData.tags.map((tag, j) => (
                    <span key={j} style={{
                      fontSize: isMobile ? '12px' : '14px',
                      padding: isMobile ? '8px 14px' : '10px 20px',
                      backgroundColor: `${currentData.accentColor}15`,
                      color: currentData.accentColor,
                      borderRadius: '100px',
                      fontWeight: '600',
                      fontFamily: FONTS.body
                    }}>{tag}</span>
                  ))}
                </div>

                <button
                  onClick={currentData.onButtonClick}
                  style={{
                    padding: isMobile ? '14px 28px' : '16px 36px',
                    backgroundColor: currentData.accentColor,
                    color: '#fff',
                    border: 'none',
                    borderRadius: '14px',
                    fontWeight: '600',
                    fontSize: isMobile ? '15px' : '16px',
                    cursor: 'pointer',
                    fontFamily: FONTS.body,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    boxShadow: `0 8px 32px ${currentData.accentColor}40`,
                    transition: 'all 0.2s ease'
                  }}
                >
                  {currentData.buttonText} <ExternalLink size={18} />
                </button>
              </div>
            }
          >
            <img
              src={currentData.image}
              alt={`${currentData.id} Screenshot`}
              className="mx-auto rounded-2xl object-cover h-full object-left-top"
              draggable={false}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </ContainerScroll>
          {/* Animation Styles */}
          <style>{`
            @keyframes fadeSlideIn {
              from {
                opacity: 0;
                transform: translateX(-30px);
              }
              to {
                opacity: 1;
                transform: translateX(0);
              }
            }
          `}</style>
        </div>
      )}
    </section>
  );
}

// Main Component
function PortfolioPage({ isDark, setIsDark }) {
  console.log('🚀 PortfolioPage is rendering!');
  const navigate = useNavigate();
  const theme = getTheme(isDark);
  const [isScrolled, setIsScrolled] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  
  const isMobile = windowWidth < 768;
  const isTablet = windowWidth < 1024;
  const isDesktop = windowWidth >= 1024;
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

  const services = [
    { icon: Settings, title: 'GHL CRM Setup', description: 'Complete GoHighLevel CRM configuration tailored to your business workflow and sales process.', features: ['Pipeline Setup', 'Contact Management', 'Custom Fields', 'Team Access'], color: BRAND.blue },
    { icon: Zap, title: 'GHL Automation', description: 'Powerful workflow automations that save time and nurture leads on autopilot.', features: ['Email Sequences', 'SMS Campaigns', 'Trigger Actions', 'Lead Scoring'], color: BRAND.green },
    { icon: Code, title: 'Vibe Coding', description: 'Custom web applications and tools built with modern tech stack for your unique needs.', features: ['React Apps', 'Custom Dashboards', 'API Integrations', 'Responsive UI'], color: '#8b5cf6' },
    { icon: Headphones, title: 'Customer Support', description: '11+ years of BPO experience providing excellent chat, email, and phone support.', features: ['Tier 2 Escalations', 'Technical Support', 'SLA Management', 'CRM Expert'], color: '#f59e0b' },
  ];

  const stats = [
    { value: '11+', label: 'Years BPO Experience', icon: Briefcase },
    { value: '20+', label: 'Free Tools Built', icon: Wrench },
    { value: '20+', label: 'Automations Created', icon: Zap },
    { value: '100%', label: 'Client Satisfaction', icon: Star },
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
    { role: 'Support Specialist', company: 'Lightspeed', period: 'March 2024 – Present', description: 'Resolve hardware issues, troubleshoot POS errors for eCommerce and Retail stores. CRM using Intercom, Zendesk, and Purecloud.', current: true },
    { role: 'Customer Support Tier 2 SME', company: 'Concentrix', period: 'April 2022 – January 2024', description: 'Resolved complex issues via chat/email, worked with Tier 3 teams within SLA requirements.', current: false },
    { role: 'Sales Chat Support', company: 'Concentrix', period: 'October 2017 – August 2021', description: 'Live web chat support, upselling/cross-selling, order support, returns and exchanges.', current: false },
    { role: 'Chat Support – US TELCO', company: 'Alorica', period: 'December 2016 – July 2017', description: 'Billing solutions, troubleshooting, guiding customers to products and services.', current: false },
    { role: 'Customer Service Analyst', company: 'Foundever (Sykes Asia Inc.)', period: 'July 2014 – December 2016', description: 'Reviewing auto-mobile loan contracts and documents, posting credit card and loan payments.', current: false },
  ];

  const skills = [
    { category: 'Admin', items: ['Calendar Management', 'Email Management', 'Google Sheet Dashboard', 'Scheduling'], color: BRAND.blue },
    { category: 'Technical', items: ['Troubleshooting', 'CRMs', 'AI Prompts', 'Creating Guides & Articles'], color: BRAND.green },
    { category: 'Specialized', items: ['Email Support', 'Tech Support', 'Chat Support', 'Data Entry'], color: '#8b5cf6' },
  ];

  const testimonials = [
    { name: 'Sarah Chen', role: 'Business Coach', content: 'The automation setup transformed my business. I went from spending 4 hours daily on follow-ups to having everything run on autopilot.', avatar: '👩‍💼' },
    { name: 'Michael Torres', role: 'Agency Owner', content: 'Incredible attention to detail and deep understanding of GHL. My CRM is now perfectly organized and automated.', avatar: '👨‍💻' },
  ];

  const socialLinks = [
    { name: 'Facebook', icon: FacebookIcon, href: 'https://www.facebook.com/BrewedOpsHL' },
    { name: 'LinkedIn', icon: LinkedInIcon, href: 'https://www.linkedin.com/in/kenneth-villar-10a05734a/' },
    { name: 'Discord', icon: DiscordIcon, href: '#', username: '@kapedlvnglgnd' },
  ];

  const navLinkStyle = { fontSize: '14px', fontWeight: '500', color: theme.textMuted, textDecoration: 'none', fontFamily: FONTS.body, padding: '0 8px' };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: theme.bg, color: theme.text, fontFamily: FONTS.body }}>
      <SEO
        title="Portfolio | BrewedOps"
        description="View Kenneth V's portfolio - GHL CRM setup, automation, vibe coding, and customer support services. 11+ years BPO experience."
        keywords="BrewedOps portfolio, GHL CRM, automation, web development, Filipino VA services"
      />
      {/* NAV */}
      <nav style={{ padding: isMobile ? '12px 16px' : '12px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${theme.cardBorder}`, backgroundColor: isScrolled ? (isDark ? 'rgba(13,11,9,0.95)' : 'rgba(255,255,255,0.95)') : theme.bg, backdropFilter: isScrolled ? 'blur(12px)' : 'none', position: 'sticky', top: 0, zIndex: 100, transition: 'all 0.3s ease' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginRight: isMobile ? '0' : '20px', cursor: 'pointer' }}>
            <img src="https://i.imgur.com/R52jwPv.png" alt="Logo" style={{ width: '32px', height: '32px', borderRadius: '8px' }} />
            <span style={{ fontSize: '18px', fontWeight: '700', fontFamily: FONTS.heading }}>
              <span style={{ color: isDark ? '#fff' : BRAND.brown }}>Brewed</span>
              <span style={{ color: BRAND.blue }}>Ops</span>
            </span>
          </div>
          {!isMobile && (
            <>
              <button style={{ height: '40px', padding: '0 12px', backgroundColor: 'transparent', color: BRAND.blue, border: 'none', fontSize: '14px', fontWeight: '600', fontFamily: FONTS.body, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                Portfolio
              </button>
              <button onClick={() => navigate('/#services')} style={{ height: '40px', padding: '0 12px', backgroundColor: 'transparent', color: theme.textMuted, border: 'none', fontSize: '14px', fontWeight: '500', fontFamily: FONTS.body, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                Services <ChevronDown size={14} />
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
              <Menu size={18} />
            </button>
          )}
        </div>
      </nav>

      {/* HERO */}
      <section id="main-content" style={{ minHeight: isMobile ? 'auto' : '100vh', display: 'flex', alignItems: 'center', padding: isMobile ? '60px 20px' : '100px 48px', background: isDark ? 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(0, 74, 172, 0.15), transparent), #0d0b09' : `linear-gradient(180deg, ${BRAND.cream} 0%, #ffffff 60%)`, position: 'relative', overflow: 'hidden' }}>
        {!isMobile && (
          <>
            <div style={{ position: 'absolute', top: '15%', right: '10%', width: '500px', height: '500px', background: `radial-gradient(circle, ${BRAND.blue}18, transparent 70%)`, borderRadius: '50%', filter: 'blur(80px)' }} />
            <div style={{ position: 'absolute', bottom: '15%', left: '5%', width: '400px', height: '400px', background: `radial-gradient(circle, ${BRAND.green}12, transparent 70%)`, borderRadius: '50%', filter: 'blur(80px)' }} />
          </>
        )}

        <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%', position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'flex', gap: isMobile ? '40px' : '100px', alignItems: 'center', flexDirection: isMobile ? 'column-reverse' : 'row', justifyContent: 'space-between' }}>
            <div style={{ flex: '1 1 500px', maxWidth: isMobile ? '100%' : '650px', textAlign: isMobile ? 'center' : 'left' }}>
              {/* Badges */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '24px', justifyContent: isMobile ? 'center' : 'flex-start' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: isMobile ? '10px 14px' : '12px 20px', backgroundColor: isDark ? 'rgba(81, 175, 67, 0.1)' : 'rgba(81, 175, 67, 0.08)', border: `1px solid ${BRAND.green}30`, borderRadius: '100px' }}>
                  <Award size={isMobile ? 16 : 18} style={{ color: BRAND.green }} />
                  <span style={{ fontSize: isMobile ? '13px' : '15px', color: BRAND.green, fontWeight: '600' }}>HL Accelerator Student</span>
                </div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: isMobile ? '10px 14px' : '12px 20px', backgroundColor: isDark ? 'rgba(0, 74, 172, 0.1)' : 'rgba(0, 74, 172, 0.08)', border: `1px solid ${BRAND.blue}30`, borderRadius: '100px' }}>
                  <Briefcase size={isMobile ? 16 : 18} style={{ color: BRAND.blue }} />
                  <span style={{ fontSize: isMobile ? '13px' : '15px', color: BRAND.blue, fontWeight: '600' }}>11+ Years Customer Support</span>
                </div>
              </div>

              <h1 style={{ fontSize: isMobile ? '36px' : '72px', fontWeight: '800', fontFamily: FONTS.heading, lineHeight: '1.1', marginBottom: '20px', color: isDark ? '#ffffff' : BRAND.brown }}>
                Hi, I'm <span style={{ color: BRAND.blue }}>Kenneth</span>
                <br />
                <span style={{ background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.green})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>I Build & Automate</span>
              </h1>

              <p style={{ fontSize: isMobile ? '16px' : '20px', color: theme.textMuted, lineHeight: '1.7', marginBottom: '24px' }}>
                Customer Support Specialist turned GHL Automation/CRM Builder & Vibe Coder. I craft powerful automations and custom tools that help businesses run smoother. Creator of <span style={{ fontWeight: '600' }}><span style={{ color: isDark ? '#fff' : BRAND.brown }}>Brewed</span><span style={{ color: BRAND.blue }}>Ops</span></span>.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: isMobile ? '12px' : '24px', marginBottom: '28px', fontSize: isMobile ? '14px' : '16px', color: theme.textMuted, justifyContent: isMobile ? 'center' : 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><MapPin size={isMobile ? 16 : 20} /><span>Cabuyao, Laguna, PH</span></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Mail size={isMobile ? 16 : 20} /><span>kvillarmain@gmail.com</span></div>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '32px', justifyContent: isMobile ? 'center' : 'flex-start' }}>
                {/* Moving Border Button */}
                <a 
                  href="https://ghl.brewedops.com/widget/booking/ZSkJj8URVNZLxTy5nCgc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="moving-border-btn"
                  style={{ 
                    position: 'relative',
                    padding: '2px',
                    borderRadius: '14px',
                    background: 'transparent',
                    overflow: 'hidden',
                    textDecoration: 'none',
                    display: 'inline-block',
                  }}
                >
                  {/* Animated gradient border */}
                  <div 
                    className="btn-border-gradient"
                    style={{
                      position: 'absolute',
                      inset: '-100%',
                      background: `conic-gradient(from var(--btn-angle, 0deg), ${BRAND.blue}, ${BRAND.green}, #8b5cf6, ${BRAND.blue})`,
                      animation: 'btn-spin 3s linear infinite',
                    }}
                  />
                  <div 
                    style={{ 
                      position: 'relative',
                      zIndex: 1,
                      padding: isMobile ? '14px 24px' : '16px 32px', 
                      backgroundColor: isDark ? '#0d0b09' : '#ffffff',
                      borderRadius: '12px',
                      fontWeight: '600', 
                      fontSize: isMobile ? '15px' : '17px', 
                      cursor: 'pointer', 
                      fontFamily: FONTS.body, 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '10px',
                      color: theme.text,
                    }}
                  >
                    Book a Call <ChevronRight size={20} />
                  </div>
                </a>
                
                {/* WhatsApp Button */}
                <a 
                  href="https://wa.me/639933074618"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ 
                    padding: isMobile ? '14px 24px' : '16px 32px', 
                    backgroundColor: '#25D366',
                    borderRadius: '14px',
                    fontWeight: '600', 
                    fontSize: isMobile ? '15px' : '17px', 
                    cursor: 'pointer', 
                    fontFamily: FONTS.body, 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '10px',
                    color: '#fff',
                    textDecoration: 'none',
                    boxShadow: '0 4px 16px rgba(37, 211, 102, 0.3)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp
                </a>
              </div>
              
              {/* Button animation styles */}
              <style>{`
                @property --btn-angle {
                  syntax: '<angle>';
                  initial-value: 0deg;
                  inherits: false;
                }
                
                @keyframes btn-spin {
                  from { transform: rotate(0deg); }
                  to { transform: rotate(360deg); }
                }
                
                .moving-border-btn:hover .btn-border-gradient {
                  animation-duration: 1.5s;
                }
              `}</style>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', justifyContent: isMobile ? 'center' : 'flex-start' }}>
                <span style={{ fontSize: '14px', color: theme.textMuted, fontFamily: FONTS.body }}>Connect:</span>
                {socialLinks.map((social, i) => (
                  social.username ? (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: isMobile ? '10px 14px' : '12px 18px', borderRadius: '12px', backgroundColor: isDark ? '#2a2420' : '#faf8f5', color: theme.textMuted }}>
                      <social.icon size={isMobile ? 18 : 22} />
                      <span style={{ fontSize: isMobile ? '13px' : '14px', fontWeight: '600', color: theme.text, fontFamily: FONTS.body }}>{social.username}</span>
                    </div>
                  ) : (
                    <a key={i} href={social.href} target="_blank" rel="noopener noreferrer" style={{ width: isMobile ? '42px' : '48px', height: isMobile ? '42px' : '48px', borderRadius: '12px', backgroundColor: isDark ? '#2a2420' : '#faf8f5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.textMuted, textDecoration: 'none', transition: 'all 0.2s ease' }} title={social.name}>
                      <social.icon size={isMobile ? 18 : 22} />
                    </a>
                  )
                ))}
              </div>
            </div>

            {/* Profile Image - Large Square */}
            <div style={{ flex: '0 0 auto', position: 'relative', display: isMobile ? 'flex' : 'block', justifyContent: 'center' }}>
              <div style={{ position: 'relative', width: isMobile ? '200px' : '480px', height: isMobile ? '220px' : '520px' }}>
                {/* Floating badges - hide on mobile */}
                {!isMobile && (
                  <>
                    <div style={{ position: 'absolute', top: '-10px', right: '-30px', padding: '14px 20px', backgroundColor: theme.cardBg, borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.2)', border: `1px solid ${theme.cardBorder}`, display: 'flex', alignItems: 'center', gap: '10px', zIndex: 10, animation: 'float 3s ease-in-out infinite' }}>
                      <Zap size={20} style={{ color: BRAND.green }} />
                      <span style={{ fontSize: '15px', fontWeight: '700' }}>GHL CRM Builder</span>
                    </div>
                    
                    <div style={{ position: 'absolute', bottom: '60px', left: '-40px', padding: '14px 20px', backgroundColor: theme.cardBg, borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.2)', border: `1px solid ${theme.cardBorder}`, display: 'flex', alignItems: 'center', gap: '10px', zIndex: 10, animation: 'float 3.5s ease-in-out infinite' }}>
                      <Code size={20} style={{ color: '#8b5cf6' }} />
                      <span style={{ fontSize: '15px', fontWeight: '700' }}>Vibe Coder</span>
                    </div>

                    <div style={{ position: 'absolute', top: '45%', right: '-50px', transform: 'translateY(-50%)', padding: '14px 20px', backgroundColor: theme.cardBg, borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.2)', border: `1px solid ${theme.cardBorder}`, display: 'flex', alignItems: 'center', gap: '10px', zIndex: 10, animation: 'float 4s ease-in-out infinite' }}>
                      <Headphones size={20} style={{ color: '#f59e0b' }} />
                      <span style={{ fontSize: '15px', fontWeight: '700' }}>Support Pro</span>
                    </div>
                  </>
                )}

                {/* Square profile image */}
                <div style={{ width: '100%', height: '100%', borderRadius: isMobile ? '16px' : '24px', overflow: 'hidden', border: `${isMobile ? '3px' : '4px'} solid ${BRAND.blue}`, boxShadow: `0 20px 60px ${BRAND.blue}30, 0 0 0 ${isMobile ? '4px' : '8px'} ${isDark ? '#171411' : '#faf8f5'}` }}>
                  <img src="https://i.imgur.com/Z5kBKUU.png" alt="Kenneth Villar" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS - Moving Border Effect */}
      <section style={{ padding: isMobile ? '48px 16px' : '80px 32px', backgroundColor: isDark ? '#0f0f10' : BRAND.cream, borderTop: `1px solid ${theme.cardBorder}`, borderBottom: `1px solid ${theme.cardBorder}` }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: isMobile ? '12px' : '24px' }}>
            {stats.map((stat, i) => {
              const colors = [BRAND.blue, BRAND.green, '#8b5cf6', '#f59e0b'];
              const color = colors[i % colors.length];
              return (
                <div 
                  key={i} 
                  className="stat-card-wrapper"
                  style={{ 
                    position: 'relative',
                    padding: '2px',
                    borderRadius: isMobile ? '14px' : '20px',
                    background: isDark ? '#171411' : '#e8e0d4',
                    overflow: 'hidden',
                  }}
                >
                  {/* Moving gradient border */}
                  <div 
                    className="moving-border"
                    style={{
                      position: 'absolute',
                      inset: '-50%',
                      background: `conic-gradient(from var(--angle, 0deg), transparent 0%, ${color} 10%, transparent 20%)`,
                      animation: `spin-border 3s linear infinite`,
                      animationDelay: `${i * 0.2}s`,
                    }}
                  />
                  
                  {/* Card content */}
                  <div 
                    style={{ 
                      position: 'relative',
                      zIndex: 1,
                      backgroundColor: isDark ? theme.cardBg : '#ffffff', 
                      borderRadius: isMobile ? '12px' : '18px',
                      padding: isMobile ? '20px 12px' : '32px 24px',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ 
                      width: isMobile ? '40px' : '56px', 
                      height: isMobile ? '40px' : '56px', 
                      borderRadius: isMobile ? '12px' : '16px', 
                      backgroundColor: `${color}15`, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      margin: '0 auto 12px',
                    }}>
                      <stat.icon size={isMobile ? 20 : 28} style={{ color: color }} />
                    </div>
                    <div style={{ 
                      fontSize: isMobile ? '28px' : '42px', 
                      fontWeight: '800', 
                      fontFamily: FONTS.heading, 
                      color: color,
                      marginBottom: '4px',
                    }}>
                      {stat.value}
                    </div>
                    <div style={{ fontSize: isMobile ? '11px' : '14px', color: theme.textMuted, fontFamily: FONTS.body, fontWeight: '500' }}>{stat.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Moving border animation */}
        <style>{`
          @property --angle {
            syntax: '<angle>';
            initial-value: 0deg;
            inherits: false;
          }
          
          @keyframes spin-border {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          .stat-card-wrapper:hover .moving-border {
            background: conic-gradient(from var(--angle, 0deg), transparent 0%, currentColor 5%, transparent 15%);
            animation-duration: 2s;
          }
        `}</style>
      </section>

      {/* FEATURED PROJECTS CAROUSEL */}
      <FeaturedProjectsCarousel isDark={isDark} theme={theme} isMobile={isMobile} navigate={navigate} />

      {/* TOOLS */}
      <section style={{ padding: isMobile ? '48px 16px' : '80px 32px', backgroundColor: theme.bg }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: isMobile ? '32px' : '48px' }}>
            <span style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '3px', color: BRAND.green, textTransform: 'uppercase', marginBottom: '10px', display: 'block', fontFamily: FONTS.body }}>Tech Stack</span>
            <h2 style={{ fontSize: isMobile ? '24px' : '36px', fontWeight: '800', fontFamily: FONTS.heading, color: isDark ? '#fff' : BRAND.brown, marginBottom: '10px' }}>Tools & Technologies</h2>
            <p style={{ fontSize: isMobile ? '13px' : '15px', color: theme.textMuted, maxWidth: '450px', margin: '0 auto', fontFamily: FONTS.body }}>Platforms and technologies I use daily to deliver exceptional results.</p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: isMobile ? '12px' : '20px' }}>
            {toolCategories.map((category, i) => (
              <div 
                key={i} 
                className="gradient-card"
                style={{ 
                  position: 'relative',
                  padding: '2px',
                  borderRadius: isMobile ? '14px' : '20px',
                  background: isDark 
                    ? 'linear-gradient(135deg, #2a2420, #171411)'
                    : 'linear-gradient(135deg, #e8e0d4, #faf8f5)',
                  overflow: 'hidden',
                }}
              >
                {/* Animated gradient border */}
                <div 
                  className="gradient-border"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: isMobile ? '14px' : '20px',
                    padding: '2px',
                    background: `linear-gradient(var(--gradient-angle, 0deg), ${BRAND.blue}, ${BRAND.green}, #8b5cf6, ${BRAND.blue})`,
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                  }}
                />
                
                {/* Card content */}
                <div style={{ 
                  padding: isMobile ? '16px' : '24px 28px', 
                  backgroundColor: theme.cardBg, 
                  borderRadius: isMobile ? '12px' : '18px',
                  position: 'relative',
                  zIndex: 1,
                }}>
                  <h3 style={{ 
                    fontSize: isMobile ? '11px' : '13px', 
                    fontWeight: '700', 
                    textTransform: 'uppercase', 
                    letterSpacing: '2px', 
                    marginBottom: isMobile ? '12px' : '20px', 
                    color: BRAND.blue, 
                    fontFamily: FONTS.heading 
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
                          borderRadius: isMobile ? '8px' : '12px',
                          border: `1px solid ${isDark ? '#332d26' : '#e8e0d4'}`,
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <img src={tool.icon} alt={tool.name} style={{ width: isMobile ? '18px' : '22px', height: isMobile ? '18px' : '22px', objectFit: 'contain' }} />
                        <span style={{ fontSize: isMobile ? '12px' : '14px', fontWeight: '600', color: theme.text, fontFamily: FONTS.body }}>{tool.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Gradient animation styles */}
        <style>{`
          @property --gradient-angle {
            syntax: '<angle>';
            initial-value: 0deg;
            inherits: false;
          }
          
          @keyframes gradientRotate {
            0% { --gradient-angle: 0deg; }
            100% { --gradient-angle: 360deg; }
          }
          
          .gradient-card:hover .gradient-border {
            opacity: 1 !important;
            animation: gradientRotate 3s linear infinite;
          }
          
          .gradient-card:hover {
            transform: translateY(-4px);
            transition: transform 0.3s ease;
          }
        `}</style>
      </section>

      {/* SERVICES */}
      <section style={{ padding: isMobile ? '48px 16px' : '100px 32px', backgroundColor: isDark ? '#0f0f10' : BRAND.cream }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: isMobile ? '32px' : '64px' }}>
            <span style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '3px', color: BRAND.blue, textTransform: 'uppercase', marginBottom: '12px', display: 'block', fontFamily: FONTS.body }}>What I Do</span>
            <h2 style={{ fontSize: isMobile ? '28px' : '42px', fontWeight: '800', fontFamily: FONTS.heading, color: isDark ? '#fff' : BRAND.brown, marginBottom: '12px' }}>Services</h2>
            <p style={{ fontSize: isMobile ? '14px' : '16px', color: theme.textMuted, maxWidth: '500px', margin: '0 auto', fontFamily: FONTS.body }}>From automation to customer support, I help businesses scale efficiently.</p>
          </div>
          <div 
            className="services-grid"
            style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: isMobile ? '16px' : '24px', position: 'relative' }}
            onMouseMove={(e) => {
              if (isMobile) return;
              const cards = e.currentTarget.querySelectorAll('.service-card');
              cards.forEach((card) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
              });
            }}
          >
            {services.map((service, i) => (
              <div 
                key={i} 
                className="service-card"
                style={{ 
                  position: 'relative',
                  padding: isMobile ? '24px 20px' : '36px 28px', 
                  backgroundColor: theme.cardBg, 
                  border: `1px solid ${theme.cardBorder}`, 
                  borderRadius: isMobile ? '16px' : '24px', 
                  cursor: 'pointer',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                }}
              >
                {/* Hover spotlight effect */}
                {!isMobile && (
                  <>
                    <div 
                      className="card-spotlight"
                      style={{
                        position: 'absolute',
                        inset: 0,
                        opacity: 0,
                        transition: 'opacity 0.3s ease',
                        background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), ${service.color}15, transparent 40%)`,
                        pointerEvents: 'none',
                      }}
                    />
                    {/* Border glow effect */}
                    <div 
                      className="card-border-glow"
                      style={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: '24px',
                        opacity: 0,
                        transition: 'opacity 0.3s ease',
                        background: `radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), ${service.color}40, transparent 40%)`,
                        pointerEvents: 'none',
                        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                        WebkitMaskComposite: 'xor',
                        maskComposite: 'exclude',
                        padding: '1px',
                      }}
                    />
                  </>
                )}
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ width: isMobile ? '48px' : '64px', height: isMobile ? '48px' : '64px', borderRadius: isMobile ? '14px' : '18px', backgroundColor: `${service.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: isMobile ? '16px' : '24px' }}>
                    <service.icon size={isMobile ? 24 : 32} style={{ color: service.color }} />
                  </div>
                  <h3 style={{ fontSize: isMobile ? '18px' : '24px', fontWeight: '700', fontFamily: FONTS.heading, marginBottom: '10px', color: isDark ? '#fff' : BRAND.brown }}>{service.title}</h3>
                  <p style={{ fontSize: isMobile ? '13px' : '16px', color: theme.textMuted, lineHeight: '1.6', marginBottom: isMobile ? '16px' : '24px', fontFamily: FONTS.body }}>{service.description}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {service.features.map((feature, j) => (
                      <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: isMobile ? '13px' : '15px', color: theme.textMuted, fontFamily: FONTS.body }}>
                        <CheckCircle size={isMobile ? 14 : 16} style={{ color: service.color, flexShrink: 0 }} />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Service card hover styles */}
        <style>{`
          .service-card:hover {
            border-color: transparent !important;
            transform: translateY(-4px);
          }
          .service-card:hover .card-spotlight {
            opacity: 1 !important;
          }
          .service-card:hover .card-border-glow {
            opacity: 1 !important;
          }
        `}</style>
      </section>

      {/* EXPERIENCE */}
      <section style={{ padding: isMobile ? '48px 16px' : '100px 32px', backgroundColor: theme.bg }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: isMobile ? '32px' : '64px' }}>
            <span style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '3px', color: '#f59e0b', textTransform: 'uppercase', marginBottom: '12px', display: 'block', fontFamily: FONTS.body }}>Career Journey</span>
            <h2 style={{ fontSize: isMobile ? '28px' : '42px', fontWeight: '800', fontFamily: FONTS.heading, color: isDark ? '#fff' : BRAND.brown }}>Work Experience</h2>
          </div>
          <div 
            className="experience-list"
            style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '16px' : '24px' }}
            onMouseMove={(e) => {
              if (isMobile) return;
              const cards = e.currentTarget.querySelectorAll('.experience-card');
              cards.forEach((card) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
              });
            }}
          >
            {experience.map((exp, i) => (
              <div key={i} style={{ position: 'relative', paddingLeft: isMobile ? '20px' : '32px', borderLeft: `3px solid ${exp.current ? BRAND.green : theme.cardBorder}` }}>
                <div style={{ position: 'absolute', left: isMobile ? '-6px' : '-9px', top: isMobile ? '20px' : '24px', width: isMobile ? '12px' : '15px', height: isMobile ? '12px' : '15px', borderRadius: '50%', backgroundColor: exp.current ? BRAND.green : theme.cardBorder, zIndex: 2 }} />
                <div 
                  className="experience-card"
                  style={{ 
                    position: 'relative',
                    padding: isMobile ? '20px 16px' : '28px', 
                    backgroundColor: theme.cardBg, 
                    border: `1px solid ${theme.cardBorder}`, 
                    borderRadius: isMobile ? '12px' : '16px',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {/* Hover spotlight effect - hide on mobile */}
                  {!isMobile && (
                    <>
                      <div 
                        className="exp-spotlight"
                        style={{
                          position: 'absolute',
                          inset: 0,
                          opacity: 0,
                          transition: 'opacity 0.3s ease',
                          background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), ${exp.current ? BRAND.green : BRAND.blue}12, transparent 40%)`,
                          pointerEvents: 'none',
                        }}
                      />
                      {/* Border glow effect */}
                      <div 
                        className="exp-border-glow"
                        style={{
                          position: 'absolute',
                          inset: 0,
                          borderRadius: '16px',
                          opacity: 0,
                          transition: 'opacity 0.3s ease',
                          background: `radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), ${exp.current ? BRAND.green : BRAND.blue}50, transparent 40%)`,
                          pointerEvents: 'none',
                          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                          WebkitMaskComposite: 'xor',
                          maskComposite: 'exclude',
                          padding: '1px',
                        }}
                      />
                    </>
                  )}
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                      <h3 style={{ fontSize: isMobile ? '16px' : '20px', fontWeight: '700', color: isDark ? '#fff' : BRAND.brown, fontFamily: FONTS.heading }}>{exp.role}</h3>
                      {exp.current && <span style={{ padding: isMobile ? '4px 10px' : '6px 14px', borderRadius: '100px', fontSize: isMobile ? '10px' : '12px', fontWeight: '700', backgroundColor: `${BRAND.green}20`, color: BRAND.green }}>Current</span>}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: isMobile ? '12px' : '20px', marginBottom: '10px', fontSize: isMobile ? '12px' : '14px', color: theme.textMuted, fontFamily: FONTS.body }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Briefcase size={isMobile ? 14 : 16} />{exp.company}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={isMobile ? 14 : 16} />{exp.period}</div>
                    </div>
                    <p style={{ fontSize: isMobile ? '13px' : '15px', color: theme.textMuted, lineHeight: '1.6', fontFamily: FONTS.body }}>{exp.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Experience card hover styles */}
        <style>{`
          .experience-card:hover {
            border-color: transparent !important;
          }
          .experience-card:hover .exp-spotlight {
            opacity: 1 !important;
          }
          .experience-card:hover .exp-border-glow {
            opacity: 1 !important;
          }
        `}</style>
      </section>

      {/* SKILLS */}
      <section style={{ padding: isMobile ? '48px 16px' : '80px 32px', backgroundColor: isDark ? '#0f0f10' : BRAND.cream }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: isMobile ? '24px' : '40px' }}>
            <span style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '3px', color: '#8b5cf6', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Expertise</span>
            <h2 style={{ fontSize: isMobile ? '28px' : '42px', fontWeight: '800', fontFamily: FONTS.heading, color: isDark ? '#fff' : BRAND.brown }}>Skills</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: isMobile ? '12px' : '20px', alignItems: 'start' }}>
            {skills.map((skill, i) => (
              <div 
                key={i} 
                className="gradient-card"
                style={{ 
                  position: 'relative',
                  padding: '2px',
                  borderRadius: isMobile ? '14px' : '20px',
                  background: isDark 
                    ? 'linear-gradient(135deg, #2a2420, #171411)'
                    : 'linear-gradient(135deg, #e8e0d4, #faf8f5)',
                  overflow: 'hidden',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Animated gradient border */}
                <div 
                  className="gradient-border"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: isMobile ? '14px' : '20px',
                    padding: '2px',
                    background: `linear-gradient(var(--gradient-angle, 0deg), ${BRAND.blue}, ${BRAND.green}, #8b5cf6, ${BRAND.blue})`,
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                  }}
                />
                
                {/* Card content */}
                <div style={{ 
                  padding: isMobile ? '16px 14px' : '20px 20px', 
                  backgroundColor: theme.cardBg, 
                  borderRadius: isMobile ? '12px' : '18px',
                  position: 'relative',
                  zIndex: 1,
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                }}>
                  <h3 style={{ 
                    fontSize: isMobile ? '14px' : '16px', 
                    fontWeight: '700', 
                    marginBottom: isMobile ? '10px' : '14px', 
                    color: skill.color, 
                    fontFamily: FONTS.heading 
                  }}>
                    {skill.category}
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: isMobile ? '6px' : '8px', alignItems: 'flex-start', alignContent: 'flex-start' }}>
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
                        minHeight: isMobile ? '24px' : '28px',
                        boxSizing: 'border-box',
                      }}>{item}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Gradient animation styles */}
        <style>{`
          @property --gradient-angle {
            syntax: '<angle>';
            initial-value: 0deg;
            inherits: false;
          }
          
          @keyframes gradientRotate {
            0% { --gradient-angle: 0deg; }
            100% { --gradient-angle: 360deg; }
          }
          
          .gradient-card:hover .gradient-border {
            opacity: 1 !important;
            animation: gradientRotate 3s linear infinite;
          }
          
          .gradient-card:hover {
            transform: translateY(-4px);
            transition: transform 0.3s ease;
          }
        `}</style>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: isMobile ? '48px 16px' : '100px 32px', backgroundColor: isDark ? '#0f0f10' : BRAND.cream }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: isMobile ? '32px' : '64px' }}>
            <span style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '3px', color: BRAND.blue, textTransform: 'uppercase', marginBottom: '12px', display: 'block' }}>Testimonials</span>
            <h2 style={{ fontSize: isMobile ? '28px' : '42px', fontWeight: '800', fontFamily: FONTS.heading, color: isDark ? '#fff' : BRAND.brown }}>What Clients Say</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: isMobile ? '16px' : '28px' }}>
            {testimonials.map((t, i) => (
              <div key={i} style={{ padding: isMobile ? '24px 20px' : '36px', backgroundColor: theme.cardBg, border: `1px solid ${theme.cardBorder}`, borderRadius: isMobile ? '16px' : '24px' }}>
                <div style={{ display: 'flex', gap: '4px', marginBottom: isMobile ? '16px' : '24px' }}>
                  {[...Array(5)].map((_, j) => <Star key={j} size={isMobile ? 14 : 18} fill={BRAND.green} color={BRAND.green} />)}
                </div>
                <p style={{ fontSize: isMobile ? '14px' : '17px', color: theme.text, lineHeight: '1.7', marginBottom: isMobile ? '20px' : '28px', fontStyle: 'italic' }}>"{t.content}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: isMobile ? '40px' : '52px', height: isMobile ? '40px' : '52px', borderRadius: '50%', backgroundColor: isDark ? '#2a2420' : '#faf8f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: isMobile ? '20px' : '26px' }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: isMobile ? '13px' : '15px' }}>{t.name}</div>
                    <div style={{ fontSize: isMobile ? '12px' : '14px', color: theme.textMuted }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: isMobile ? '60px 20px' : '100px 32px', background: `linear-gradient(135deg, ${BRAND.blue} 0%, ${BRAND.blue}dd 100%)`, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.08) 1px, transparent 0)', backgroundSize: '28px 28px' }} />
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 10 }}>
          <h2 style={{ fontSize: isMobile ? '28px' : '48px', fontWeight: '800', fontFamily: FONTS.heading, color: '#fff', marginBottom: '16px' }}>Ready to Automate Your Business?</h2>
          <p style={{ fontSize: isMobile ? '14px' : '18px', color: 'rgba(255,255,255,0.85)', lineHeight: '1.7', marginBottom: '32px', maxWidth: '600px', margin: '0 auto 32px' }}>Let's discuss how I can help streamline your operations with powerful GHL automations and custom solutions.</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <a href="https://ghl.brewedops.com/widget/booking/ZSkJj8URVNZLxTy5nCgc" target="_blank" rel="noopener noreferrer" style={{ padding: isMobile ? '14px 24px' : '18px 36px', backgroundColor: '#fff', color: BRAND.blue, border: 'none', borderRadius: '14px', fontWeight: '700', fontSize: isMobile ? '14px' : '16px', cursor: 'pointer', fontFamily: FONTS.body, display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 8px 32px rgba(0,0,0,0.2)', textDecoration: 'none' }}>
              <MessageSquare size={isMobile ? 18 : 20} />Book a Free Call
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: isMobile ? '32px 16px 20px' : '48px 32px 24px', backgroundColor: theme.bg, borderTop: `1px solid ${theme.cardBorder}` }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'center' : 'center', gap: isMobile ? '20px' : '24px', marginBottom: '24px', textAlign: isMobile ? 'center' : 'left' }}>
            <div onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <img src="https://i.imgur.com/R52jwPv.png" alt="Logo" style={{ width: '28px', height: '28px', borderRadius: '8px' }} />
              <span style={{ fontSize: '16px', fontWeight: '700', fontFamily: FONTS.heading }}>
                <span style={{ color: isDark ? '#fff' : BRAND.brown }}>Brewed</span>
                <span style={{ color: BRAND.blue }}>Ops</span>
              </span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: isMobile ? '16px' : '32px', justifyContent: 'center' }}>
              <a href="/" style={{ color: theme.textMuted, fontSize: isMobile ? '13px' : '14px', textDecoration: 'none' }}>Home</a>
              <a href="/portfolio" style={{ color: theme.textMuted, fontSize: isMobile ? '13px' : '14px', textDecoration: 'none' }}>Portfolio</a>
              <a href="/#services" style={{ color: theme.textMuted, fontSize: isMobile ? '13px' : '14px', textDecoration: 'none' }}>Services</a>
              <a href="/about" style={{ color: theme.textMuted, fontSize: isMobile ? '13px' : '14px', textDecoration: 'none' }}>About</a>
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
            <p style={{ fontSize: isMobile ? '11px' : '13px', color: theme.textMuted }}>© 2025 Kenneth Villar. Built with ☕ and BrewedOps.</p>
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

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
      `}</style>
    </div>
  );
}

export default PortfolioPage;
