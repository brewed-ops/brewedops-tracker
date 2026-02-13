/**
 * HomePage Component
 * [Logo]BrewedOps | Services | Tools ............. About | Privacy | [☀️] [Login] [Sign Up]
 * 
 * Desktop: 3D Marquee showcase
 * Mobile: Tool cards grid
 */

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CaretRight, CaretDown, Image, FileText, Wrench, Lock, Scissors, ArrowsOut, ArrowsIn, ArrowsClockwise, Palette, FileImage, FilmStrip, NotePencil, GitMerge, FileDashed, QrCode, MagnifyingGlass, TextT, Hash, CurrencyDollar, Headphones, CheckSquare, Note, GitBranch, BracketsCurly, Clock, BookOpen, List, Lightning, ClipboardText, Code, Globe, Timer, Heart, LightbulbFilament, ChartLineUp, ShieldCheck, Sparkle, FileMagnifyingGlass, DeviceMobile, CalendarCheck, Handshake, Envelope, ChatCircle, GearSix, PenNib, TextAa, CalendarDots } from '@phosphor-icons/react';
import SEO from './SEO';
import ThemeToggle from './ui/ThemeToggle';
const MobileDrawer = React.lazy(() => import('./layout/MobileDrawer'));
import { createNoise3D } from "simplex-noise";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutTextFlip } from '@/components/ui/layout-text-flip';
import ScrollReveal from '@/components/ui/ScrollReveal';
// ============================================
// VORTEX BACKGROUND COMPONENT
// ============================================
const Vortex = ({ children, className, containerClassName, particleCount = 700, rangeY = 100, baseHue = 220, baseSpeed = 0.0, rangeSpeed = 1.5, baseRadius = 1, rangeRadius = 2, backgroundColor = "#000000" }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const offscreenRef = useRef(null);
  const animationFrameId = useRef();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const backgroundColorRef = useRef(backgroundColor);
  const startedRef = useRef(false);

  // Detect if background is light or dark
  const isLightBg = (color) => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128;
  };

  const isLightRef = useRef(isLightBg(backgroundColor));

  // Update refs when prop changes
  useEffect(() => {
    backgroundColorRef.current = backgroundColor;
    isLightRef.current = isLightBg(backgroundColor);
  }, [backgroundColor]);

  // Cap particles at 150 for performance (3 filter passes per frame)
  const effectiveParticleCount = Math.min(particleCount, 150);
  const particlePropCount = 9;
  const particlePropsLength = effectiveParticleCount * particlePropCount;
  const baseTTL = 50, rangeTTL = 150, rangeHue = 100, noiseSteps = 3;
  const xOff = 0.00125, yOff = 0.00125, zOff = 0.0005;

  const tickRef = useRef(0);
  const noise3DRef = useRef(null);
  const particlePropsRef = useRef(new Float32Array(particlePropsLength));
  const centerRef = useRef([0, 0]);
  const lastFrameTimeRef = useRef(0);

  const TAU = 2 * Math.PI;
  const rand = (n) => n * Math.random();
  const randRange = (n) => n - rand(2 * n);
  const fadeInOut = (t, m) => { let hm = 0.5 * m; return Math.abs(((t + hm) % m) - hm) / hm; };
  const lerp = (n1, n2, speed) => (1 - speed) * n1 + speed * n2;

  const initParticle = (i, width, height) => {
    if (!width || !height) return;
    const x = rand(width);
    const y = centerRef.current[1] + randRange(rangeY);
    particlePropsRef.current.set([x, y, 0, 0, 0, baseTTL + rand(rangeTTL), baseSpeed + rand(rangeSpeed), baseRadius + rand(rangeRadius), baseHue + rand(rangeHue)], i);
  };

  const initParticles = (width, height) => {
    tickRef.current = 0;
    particlePropsRef.current = new Float32Array(particlePropsLength);
    for (let i = 0; i < particlePropsLength; i += particlePropCount) initParticle(i, width, height);
  };

  const drawParticle = (x, y, x2, y2, life, ttl, radius, hue, ctx) => {
    ctx.save();
    ctx.lineCap = "round";
    ctx.lineWidth = radius;
    if (isLightRef.current) {
      ctx.strokeStyle = `hsla(${hue}, 100%, 35%, ${fadeInOut(life, ttl) * 0.9})`;
    } else {
      ctx.strokeStyle = `hsla(${hue}, 100%, 60%, ${fadeInOut(life, ttl)})`;
    }
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
  };

  const updateParticle = (i, ctx, width, height) => {
    if (!width || !height || !noise3DRef.current) return;
    const particleProps = particlePropsRef.current;
    let x = particleProps[i], y = particleProps[i + 1];
    const n = noise3DRef.current(x * xOff, y * yOff, tickRef.current * zOff) * noiseSteps * TAU;
    const vx = lerp(particleProps[i + 2], Math.cos(n), 0.5);
    const vy = lerp(particleProps[i + 3], Math.sin(n), 0.5);
    let life = particleProps[i + 4];
    const ttl = particleProps[i + 5], speed = particleProps[i + 6];
    const x2 = x + vx * speed, y2 = y + vy * speed;
    drawParticle(x, y, x2, y2, life, ttl, particleProps[i + 7], particleProps[i + 8], ctx);
    life++;
    particleProps[i] = x2; particleProps[i + 1] = y2; particleProps[i + 2] = vx; particleProps[i + 3] = vy; particleProps[i + 4] = life;
    if (x2 > width || x2 < 0 || y2 > height || y2 < 0 || life > ttl) initParticle(i, width, height);
  };

  const draw = (canvas, ctx, width, height, timestamp) => {
    // Throttle to ~30fps (33ms between frames) to halve CPU usage
    if (timestamp - lastFrameTimeRef.current < 33) {
      animationFrameId.current = window.requestAnimationFrame((ts) => draw(canvas, ctx, width, height, ts));
      return;
    }
    lastFrameTimeRef.current = timestamp;

    tickRef.current++;
    const offscreen = offscreenRef.current;
    const offCtx = offscreen?.getContext("2d");
    if (!offCtx) return;
    offCtx.clearRect(0, 0, width, height);
    for (let i = 0; i < particlePropsLength; i += particlePropCount) updateParticle(i, offCtx, width, height);

    // Fill background
    ctx.fillStyle = backgroundColorRef.current;
    ctx.fillRect(0, 0, width, height);

    // Reduced to 2 passes (was 3) — drop the heaviest blur pass
    if (isLightRef.current) {
      ctx.save();
      ctx.filter = "blur(4px)";
      ctx.globalAlpha = 0.7;
      ctx.drawImage(offscreen, 0, 0);
      ctx.restore();

      ctx.save();
      ctx.drawImage(offscreen, 0, 0);
      ctx.restore();
    } else {
      ctx.save(); ctx.filter = "blur(4px) brightness(200%)"; ctx.globalCompositeOperation = "lighter"; ctx.drawImage(offscreen, 0, 0); ctx.restore();
      ctx.save(); ctx.globalCompositeOperation = "lighter"; ctx.drawImage(offscreen, 0, 0); ctx.restore();
    }

    animationFrameId.current = window.requestAnimationFrame((ts) => draw(canvas, ctx, width, height, ts));
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const updateDimensions = () => { const rect = container.getBoundingClientRect(); setDimensions({ width: rect.width, height: rect.height }); };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || dimensions.width === 0 || dimensions.height === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    offscreenRef.current = document.createElement("canvas");
    offscreenRef.current.width = dimensions.width;
    offscreenRef.current.height = dimensions.height;
    centerRef.current = [dimensions.width / 2, dimensions.height / 2];
    noise3DRef.current = createNoise3D();
    initParticles(dimensions.width, dimensions.height);

    // Defer animation start so it doesn't block initial paint
    if (!startedRef.current) {
      startedRef.current = true;
      // Fill background immediately so canvas isn't blank
      ctx.fillStyle = backgroundColorRef.current;
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);
      const startAnimation = () => {
        animationFrameId.current = window.requestAnimationFrame((ts) => draw(canvas, ctx, dimensions.width, dimensions.height, ts));
      };
      if (typeof requestIdleCallback !== 'undefined') {
        requestIdleCallback(startAnimation, { timeout: 200 });
      } else {
        setTimeout(startAnimation, 100);
      }
    } else {
      animationFrameId.current = window.requestAnimationFrame((ts) => draw(canvas, ctx, dimensions.width, dimensions.height, ts));
    }

    return () => { if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current); };
  }, [dimensions]);

  return (
    <div className={containerClassName} style={{ position: 'relative', width: '100%', minHeight: '500px', backgroundColor, overflow: 'hidden' }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} ref={containerRef} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor }}>
        <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
      </motion.div>
      <div className={className} style={{ position: 'relative', zIndex: 10 }}>{children}</div>
    </div>
  );
};

// ============================================
// BRAND CONFIGURATION
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

// Custom duotone service tab icons
const SupportTabIcon = ({ size = 24, style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <path d="M21 11.5C21 16.19 16.97 20 12 20C10.82 20 9.69 19.8 8.66 19.42L3 21L4.56 16.44C3.58 15.09 3 13.38 3 11.5C3 6.81 7.03 3 12 3C16.97 3 21 6.81 21 11.5Z" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
    <circle cx="8.5" cy="11.5" r="1.2" fill="currentColor"/>
    <circle cx="12" cy="11.5" r="1.2" fill="currentColor"/>
    <circle cx="15.5" cy="11.5" r="1.2" fill="currentColor"/>
  </svg>
);
const AdminTabIcon = ({ size = 24, style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <rect x="4" y="2" width="16" height="20" rx="3" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M8.5 12L10.5 14L15.5 9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="8.5" y1="18" x2="13" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
    <line x1="8.5" y1="6" x2="15.5" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
  </svg>
);
const AutomationTabIcon = ({ size = 24, style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <circle cx="12" cy="12" r="9.5" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M13.5 6.5L9.5 13H14.5L10.5 19.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const WebDevTabIcon = ({ size = 24, style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <rect x="2" y="3" width="20" height="18" rx="3" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1.8"/>
    <line x1="2" y1="8.5" x2="22" y2="8.5" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="5.5" cy="5.75" r="1" fill="currentColor"/>
    <circle cx="8.5" cy="5.75" r="1" fill="currentColor"/>
    <path d="M8.5 13L6 15.5L8.5 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M15.5 13L18 15.5L15.5 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

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

const TOOL_TIMELINE = [
  {
    name: 'Image Tools',
    icon: Image,
    accent: '#004AAC',
    description: 'Crop, resize, compress, convert, and remove backgrounds from images. Pick colors and export to PDF — all processed locally in your browser.',
    tools: TOOL_CATEGORIES[0].tools,
  },
  {
    name: 'Video Tools',
    icon: FilmStrip,
    accent: '#51AF43',
    description: 'Compress large video files and trim clips to the exact length you need, right from your browser with no uploads required.',
    tools: TOOL_CATEGORIES[1].tools,
  },
  {
    name: 'Document Tools',
    icon: FileText,
    accent: '#3F200C',
    description: 'Edit, merge, and split PDFs without leaving your browser. Preview Markdown files instantly.',
    tools: TOOL_CATEGORIES[2].tools,
  },
  {
    name: 'Utility Tools',
    icon: Wrench,
    accent: '#004AAC',
    description: 'Generate QR codes, format JSON, build cron expressions, count words, convert timezones, stay focused with Pomodoro, and more.',
    tools: TOOL_CATEGORIES[3].tools,
  },
];

const PRODUCTIVITY_TOOLS = [
  { icon: CurrencyDollar, title: 'Finance Tracker', path: '/finance' },
  { icon: Headphones, title: 'VA Kita', path: '/vakita' },
  { icon: CheckSquare, title: 'Task Manager', path: '/taskmanager' },
  { icon: Note, title: 'Brewed Notes', path: '/brewednotes' },
];

const AI_TOOL_CATEGORIES = [
  {
    name: 'GHL / CRM',
    tools: [
      { icon: Lightning, title: 'GHL Scenario Generator', path: '/ghl-scenario' },
      { icon: ChatCircle, title: 'AI GHL Advisor', path: '/ghl-advisor' },
    ]
  },
  {
    name: 'Writing & Docs',
    tools: [
      { icon: TextAa, title: 'Grammar Polisher', path: '/grammar-polisher' },
      { icon: PenNib, title: 'Proposal Writer', path: '/proposal-writer' },
      { icon: FileText, title: 'SOW Generator', path: '/sow-generator' },
    ]
  },
  {
    name: 'Business',
    tools: [
      { icon: ClipboardText, title: 'Onboarding Checklist', path: '/onboarding-checklist' },
      { icon: CalendarDots, title: 'Content Calendar', path: '/content-calendar' },
      { icon: FileMagnifyingGlass, title: 'Text Extractor', path: '/text-extractor' },
    ]
  },
];

// All tools flat for marquee
const ALL_TOOLS = [
  { icon: Image, title: 'BG Remover', color: '#004AAC' },
  { icon: Scissors, title: 'Image Cropper', color: '#004AAC' },
  { icon: ArrowsOut, title: 'Image Resizer', color: '#004AAC' },
  { icon: ArrowsIn, title: 'Image Compressor', color: '#004AAC' },
  { icon: ArrowsClockwise, title: 'Image Converter', color: '#004AAC' },
  { icon: Palette, title: 'Color Picker', color: '#004AAC' },
  { icon: FileImage, title: 'Image to PDF', color: '#004AAC' },
  { icon: FilmStrip, title: 'Video Compressor', color: '#c05621' },
  { icon: Scissors, title: 'Video Trimmer', color: '#c05621' },
  { icon: NotePencil, title: 'PDF Editor', color: '#51AF43' },
  { icon: GitMerge, title: 'PDF Merge', color: '#51AF43' },
  { icon: FileDashed, title: 'PDF Split', color: '#51AF43' },
  { icon: QrCode, title: 'QR Generator', color: '#b8860b' },
  { icon: MagnifyingGlass, title: 'Find & Replace', color: '#b8860b' },
  { icon: TextT, title: 'Case Converter', color: '#b8860b' },
  { icon: Hash, title: 'Word Counter', color: '#b8860b' },
  { icon: GitBranch, title: 'Mermaid Reader', color: '#b8860b' },
  { icon: BracketsCurly, title: 'JSON Formatter', color: '#b8860b' },
  { icon: Clock, title: 'Cron Generator', color: '#b8860b' },
  { icon: Globe, title: 'Timezone', color: '#b8860b' },
  { icon: Timer, title: 'Focus Timer', color: '#b8860b' },
  { icon: CurrencyDollar, title: 'Finance Tracker', color: '#004AAC' },
];

// ============================================
// CUSTOM HOOK - Window Size
// ============================================
const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

// ============================================
// 3D MARQUEE COMPONENT
// ============================================
const ThreeDMarquee = ({ isDark, theme }) => {
  const navigate = useNavigate();

  // Create rows of tools for marquee effect
  const row1 = ALL_TOOLS.slice(0, 8);
  const row2 = ALL_TOOLS.slice(8, 16);
  const row3 = ALL_TOOLS.slice(16, 24);

  const ToolCard = ({ tool, index, reverse }) => {
    const IconComponent = tool.icon;
    return (
      <div
        onClick={() => {
          const path = TOOL_CATEGORIES.flatMap(c => c.tools).find(t => t.title === tool.title)?.path;
          if (path) navigate(path);
        }}
        style={{
          minWidth: '220px',
          padding: '28px 24px',
          backgroundColor: isDark ? '#171411' : '#ffffff',
          border: `1px solid ${isDark ? '#2a2420' : '#e8e0d4'}`,
          borderRadius: '20px',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          transition: 'all 0.3s ease',
          boxShadow: isDark
            ? '0 4px 24px rgba(13,11,9,0.4)'
            : '0 4px 24px rgba(0,0,0,0.1)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-6px) scale(1.03)';
          e.currentTarget.style.borderColor = tool.color;
          e.currentTarget.style.boxShadow = isDark
            ? `0 8px 32px rgba(13,11,9,0.5), 0 0 20px ${tool.color}30`
            : `0 8px 32px rgba(0,0,0,0.15), 0 0 20px ${tool.color}20`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
          e.currentTarget.style.borderColor = isDark ? '#2a2420' : '#e8e0d4';
          e.currentTarget.style.boxShadow = isDark
            ? '0 4px 24px rgba(13,11,9,0.4)'
            : '0 4px 24px rgba(0,0,0,0.1)';
        }}
      >
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '14px',
            backgroundColor: tool.color + '18',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <IconComponent size={28} style={{ color: tool.color }} />
        </div>
        <span
          style={{
            fontSize: '17px',
            fontWeight: '600',
            color: theme.text,
            fontFamily: FONTS.body,
          }}
        >
          {tool.title}
        </span>
      </div>
    );
  };

  const MarqueeRow = ({ tools, reverse, speed = 30 }) => (
    <div
      style={{
        display: 'flex',
        gap: '24px',
        animation: `${reverse ? 'marqueeReverse' : 'marquee'} ${speed}s linear infinite`,
        paddingLeft: reverse ? '0' : '24px',
      }}
    >
      {[...tools, ...tools, ...tools].map((tool, i) => (
        <ToolCard key={i} tool={tool} index={i} reverse={reverse} />
      ))}
    </div>
  );

  return (
    <div
      style={{
        overflow: 'hidden',
        padding: '80px 0',
        position: 'relative',
      }}
    >
      {/* Gradient overlays - Left and Right only */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          width: '200px',
          background: `linear-gradient(to right, ${isDark ? '#0d0b09' : BRAND.cream}, transparent)`,
          zIndex: 10,
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          width: '200px',
          background: `linear-gradient(to left, ${isDark ? '#0d0b09' : BRAND.cream}, transparent)`,
          zIndex: 10,
          pointerEvents: 'none',
        }}
      />

      {/* Horizontal Marquee Container */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        <MarqueeRow tools={row1} reverse={false} speed={45} />
        <MarqueeRow tools={row2} reverse={true} speed={50} />
        <MarqueeRow tools={row3} reverse={false} speed={42} />
      </div>

      {/* CSS Animations */}
      <style>
        {`
          @keyframes marquee {
            from { transform: translateX(0); }
            to { transform: translateX(-33.33%); }
          }
          @keyframes marqueeReverse {
            from { transform: translateX(-33.33%); }
            to { transform: translateX(0); }
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

        /* Hero CTA button */
        .hero-cta-btn {
          --line_color: #004AAC;
          --back_color: rgba(0, 74, 172, 0.15);
          --text_color: ${isDark ? '#ffffff' : '#0d0b09'};
          position: relative;
          z-index: 0;
          width: 240px;
          height: 56px;
          text-decoration: none;
          font-size: 13px;
          font-weight: 700;
          color: var(--text_color);
          letter-spacing: 2px;
          transition: all 0.3s ease;
          display: inline-block;
          cursor: pointer;
          font-family: 'Poppins', sans-serif;
        }
        .hero-cta-text {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;
        }
        .hero-cta-btn::before,
        .hero-cta-btn::after,
        .hero-cta-text::before,
        .hero-cta-text::after {
          content: "";
          position: absolute;
          height: 3px;
          border-radius: 2px;
          background: var(--line_color);
          transition: all 0.5s ease;
        }
        .hero-cta-btn::before {
          top: 0;
          left: 54px;
          width: calc(100% - 56px * 2 - 16px);
        }
        .hero-cta-btn::after {
          top: 0;
          right: 54px;
          width: 8px;
        }
        .hero-cta-text::before {
          bottom: 0;
          right: 54px;
          width: calc(100% - 56px * 2 - 16px);
        }
        .hero-cta-text::after {
          bottom: 0;
          left: 54px;
          width: 8px;
        }
        .hero-cta-line {
          position: absolute;
          top: 0;
          width: 56px;
          height: 100%;
          overflow: hidden;
        }
        .hero-cta-line::before {
          content: "";
          position: absolute;
          top: 0;
          width: 150%;
          height: 100%;
          box-sizing: border-box;
          border-radius: 300px;
          border: solid 3px var(--line_color);
        }
        .hero-cta-line:nth-child(1),
        .hero-cta-line:nth-child(1)::before {
          left: 0;
        }
        .hero-cta-line:nth-child(2),
        .hero-cta-line:nth-child(2)::before {
          right: 0;
        }
        .hero-cta-btn:hover {
          letter-spacing: 6px;
        }
        .hero-cta-btn:hover::before,
        .hero-cta-btn:hover .hero-cta-text::before {
          width: 8px;
        }
        .hero-cta-btn:hover::after,
        .hero-cta-btn:hover .hero-cta-text::after {
          width: calc(100% - 56px * 2 - 16px);
        }
        .hero-cta-drow1,
        .hero-cta-drow2 {
          position: absolute;
          z-index: -1;
          border-radius: 16px;
          transform-origin: 16px 16px;
        }
        .hero-cta-drow1 {
          top: -16px;
          left: 40px;
          width: 32px;
          height: 0;
          transform: rotate(30deg);
        }
        .hero-cta-drow2 {
          top: 44px;
          left: 77px;
          width: 32px;
          height: 0;
          transform: rotate(-127deg);
        }
        .hero-cta-drow1::before,
        .hero-cta-drow1::after,
        .hero-cta-drow2::before,
        .hero-cta-drow2::after {
          content: "";
          position: absolute;
        }
        .hero-cta-drow1::before {
          bottom: 0; left: 0; width: 0; height: 32px;
          border-radius: 16px; transform-origin: 16px 16px; transform: rotate(-60deg);
        }
        .hero-cta-drow1::after {
          top: -10px; left: 45px; width: 0; height: 32px;
          border-radius: 16px; transform-origin: 16px 16px; transform: rotate(69deg);
        }
        .hero-cta-drow2::before {
          bottom: 0; left: 0; width: 0; height: 32px;
          border-radius: 16px; transform-origin: 16px 16px; transform: rotate(-146deg);
        }
        .hero-cta-drow2::after {
          bottom: 26px; left: -40px; width: 0; height: 32px;
          border-radius: 16px; transform-origin: 16px 16px; transform: rotate(-262deg);
        }
        .hero-cta-drow1, .hero-cta-drow1::before, .hero-cta-drow1::after,
        .hero-cta-drow2, .hero-cta-drow2::before, .hero-cta-drow2::after {
          background: var(--back_color);
        }
        .hero-cta-btn:hover .hero-cta-drow1 {
          animation: heroDrow1 ease-in 0.06s forwards;
        }
        .hero-cta-btn:hover .hero-cta-drow1::before {
          animation: heroDrow2 linear 0.08s 0.06s forwards;
        }
        .hero-cta-btn:hover .hero-cta-drow1::after {
          animation: heroDrow3 linear 0.03s 0.14s forwards;
        }
        .hero-cta-btn:hover .hero-cta-drow2 {
          animation: heroDrow4 linear 0.06s 0.2s forwards;
        }
        .hero-cta-btn:hover .hero-cta-drow2::before {
          animation: heroDrow3 linear 0.03s 0.26s forwards;
        }
        .hero-cta-btn:hover .hero-cta-drow2::after {
          animation: heroDrow5 linear 0.06s 0.32s forwards;
        }
        @keyframes heroDrow1 { 0% { height: 0; } 100% { height: 100px; } }
        @keyframes heroDrow2 { 0% { width: 0; opacity: 0; } 10% { opacity: 0; } 11% { opacity: 1; } 100% { width: 120px; } }
        @keyframes heroDrow3 { 0% { width: 0; } 100% { width: 80px; } }
        @keyframes heroDrow4 { 0% { height: 0; } 100% { height: 120px; } }
        @keyframes heroDrow5 { 0% { width: 0; } 100% { width: 124px; } }
        `}
      </style>
    </div>
  );
};

// ============================================
// HORIZONTAL TOOLS DROPDOWN
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
          padding: '0 12px',
          backgroundColor: 'transparent',
          color: isOpen ? BRAND.blue : theme.text,
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
            backgroundColor: isDark ? '#171411' : '#ffffff',
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
// AI TOOLS DROPDOWN
// ============================================
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
    <div
      ref={dropdownRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ position: 'relative' }}
    >
      <button
        style={{
          height: '40px',
          padding: '0 12px',
          backgroundColor: 'transparent',
          color: isOpen ? BRAND.blue : theme.text,
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
        AI Tools
        <CaretDown size={14} style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: '0',
            marginTop: '4px',
            backgroundColor: isDark ? '#171411' : '#ffffff',
            border: `1px solid ${isDark ? '#2a2420' : '#e8e0d4'}`,
            borderRadius: '12px',
            boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.5)' : '0 8px 32px rgba(0,0,0,0.1)',
            padding: '12px',
            zIndex: 1000,
          }}
        >
          <div style={{ display: 'flex', gap: '20px' }}>
            {AI_TOOL_CATEGORIES.map((category) => (
              <div key={category.name} style={{ minWidth: '150px' }}>
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
          padding: '0 12px',
          backgroundColor: 'transparent',
          color: isOpen ? '#14b8a6' : theme.text,
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
        Apps
        <CaretDown size={14} style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: '0',
            marginTop: '4px',
            backgroundColor: isDark ? '#171411' : '#ffffff',
            border: `1px solid ${isDark ? '#2a2420' : '#e8e0d4'}`,
            borderRadius: '12px',
            boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.5)' : '0 8px 32px rgba(0,0,0,0.1)',
            padding: '12px',
            zIndex: 1000,
            minWidth: '200px',
          }}
        >
          <div style={{ fontSize: '10px', fontWeight: '600', color: theme.textMuted, letterSpacing: '0.5px', marginBottom: '6px', textTransform: 'uppercase', fontFamily: FONTS.body }}>
            Mobile Apps
          </div>
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
// MAIN HOMEPAGE
// ============================================
const HomePage = ({ onNavigate, isDark, setIsDark }) => {
  const navigate = useNavigate();
  const theme = getTheme(isDark);
  const { width } = useWindowSize();
  const isMobile = width < 768;
  const isSmall = width < 480;
  const isDesktop = width >= 1024;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [flowActive, setFlowActive] = useState(false);
  const [flowStep, setFlowStep] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeService, setActiveService] = useState(0);

  // Sequential flow animation — each step activates the next element
  useEffect(() => {
    if (!flowActive) { setFlowStep(0); return; }
    const delays = [0, 250, 500, 750, 1000, 1250, 1500, 1800, 2000, 2100, 2250, 2400];
    const timers = delays.map((ms, i) => setTimeout(() => setFlowStep(i + 1), ms));
    return () => timers.forEach(clearTimeout);
  }, [flowActive]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleToolClick = (path) => navigate(path);
  const handleLoginClick = () => onNavigate('login');

  const btnPrimary = {
    height: '48px',
    padding: '0 28px',
    backgroundColor: BRAND.blue,
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '600',
    fontFamily: FONTS.body,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  };

  const btnOutline = {
    height: '48px',
    padding: '0 28px',
    backgroundColor: 'transparent',
    color: theme.text,
    border: '1px solid ' + theme.cardBorder,
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '500',
    fontFamily: FONTS.body,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const navLinkStyle = {
    fontSize: '14px',
    fontWeight: '500',
    color: theme.textMuted,
    textDecoration: 'none',
    fontFamily: FONTS.body,
    padding: '0 8px',
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: isDark ? theme.bg : '#faf8f5' }}>
      <main>
        <SEO
          title="BrewedOps - VA Services, GHL Automation, AI Tools & 26+ Free Productivity Tools"
          description="Expert customer support, admin VA, GoHighLevel CRM automation, and web development services — backed by 11+ years experience. Plus 26+ free tools and AI-powered utilities including GHL Scenario Generator and AI Text Extractor."
          keywords="BrewedOps, virtual assistant services, GHL automation, GoHighLevel, customer support, admin VA, web development, free online tools, AI text extractor, OCR, GHL scenario generator"
        />
        {/* NAV */}
        <nav style={{ padding: isSmall ? '12px 16px' : '12px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: isScrolled ? '1px solid ' + theme.cardBorder : '1px solid transparent', backgroundColor: isDark ? theme.bg : '#faf8f5', position: 'sticky', top: 0, zIndex: 100, transition: 'border-color 0.3s' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginRight: '20px' }}>
              <img src="/BrewedOpsLogo-64.png" alt="Logo" width={32} height={32} style={{ width: '32px', height: '32px', borderRadius: '8px' }} />
              <span style={{ fontSize: '18px', fontWeight: '700', fontFamily: FONTS.heading }}>
                <span style={{ color: isDark ? '#fff' : BRAND.brown }}>Brewed</span>
                <span style={{ color: BRAND.blue }}>Ops</span>
              </span>
            </div>
            {isDesktop && (
              <>
                <button onClick={() => navigate('/')} style={{ height: '40px', padding: '0 12px', backgroundColor: 'transparent', color: BRAND.blue, border: 'none', fontSize: '14px', fontWeight: '600', fontFamily: FONTS.body, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  Home
                </button>
                <button onClick={() => navigate('/portfolio')} style={{ height: '40px', padding: '0 12px', backgroundColor: 'transparent', color: theme.textMuted, border: 'none', fontSize: '14px', fontWeight: '500', fontFamily: FONTS.body, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  Portfolio
                </button>
                <ToolsDropdown isDark={isDark} theme={theme} onToolClick={handleToolClick} onLoginClick={handleLoginClick} />
                <AIToolsDropdown isDark={isDark} theme={theme} onToolClick={handleToolClick} />
                <AppsDropdown isDark={isDark} theme={theme} onAppClick={handleToolClick} />
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
              <button onClick={() => setMobileMenuOpen(true)} aria-label="Open navigation menu" style={{ width: '36px', height: '36px', backgroundColor: 'transparent', border: '1px solid ' + theme.cardBorder, borderRadius: '8px', color: theme.textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '4px' }}>
                <List size={18} />
              </button>
            )}
          </div>
        </nav>

        {/* HERO with Vortex Background */}
        <div id="main-content" style={{ backgroundColor: isDark ? '#0d0b09' : BRAND.cream, overflow: 'hidden' }}>
          <Vortex
            backgroundColor={isDark ? '#0d0b09' : BRAND.cream}
            particleCount={400}
            baseHue={25}
            rangeHue={40}
            baseSaturation={45}
            baseLightness={50}
            rangeY={200}
            baseSpeed={0.0}
            rangeSpeed={1.0}
            baseRadius={1}
            rangeRadius={1.5}
          >
            <section style={{ padding: isSmall ? '40px 20px 0' : '60px 64px 0', maxWidth: '1400px', margin: '0 auto', position: 'relative' }}>
              <div style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: isMobile ? '24px' : '0',
              }}>
                {/* Left: Text content */}
                <div style={{
                  textAlign: isMobile ? 'center' : 'left',
                  maxWidth: isMobile ? '100%' : '50%',
                  flex: isMobile ? 'none' : '0 0 50%',
                  position: 'relative',
                  zIndex: 2,
                }}>
                  <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
                    style={{ marginBottom: '18px' }}
                  >
                    <h1 style={{
                      fontSize: isSmall ? '34px' : (isMobile ? '42px' : '54px'),
                      fontWeight: '800',
                      color: isDark ? '#ffffff' : BRAND.brown,
                      lineHeight: '1.08',
                      letterSpacing: '-0.03em',
                      fontFamily: FONTS.heading,
                      margin: '0 0 14px',
                    }}>
                      Stop Doing It All.{isMobile ? ' ' : <br />}
                      <span style={{ color: isDark ? '#60a5fa' : BRAND.blue }}>Let Me Handle It.</span>
                    </h1>
                    <div style={{ display: 'flex', justifyContent: isMobile ? 'center' : 'flex-start' }}>
                      <LayoutTextFlip
                        text=""
                        words={["Your Business", "Growing Brands", "Digital Agencies", "Remote Teams"]}
                        duration={3000}
                        wordStyle={{
                          fontSize: isSmall ? '24px' : (isMobile ? '30px' : '38px'),
                          fontWeight: '800',
                          fontFamily: FONTS.heading,
                          color: isDark ? '#60a5fa' : BRAND.blue,
                          backgroundColor: isDark ? 'rgba(96, 165, 250, 0.12)' : 'rgba(0, 74, 172, 0.08)',
                          border: isDark ? '1px solid rgba(96, 165, 250, 0.25)' : '1px solid rgba(0, 74, 172, 0.15)',
                          padding: '5px 18px',
                          borderRadius: '12px',
                        }}
                      />
                    </div>
                  </motion.div>

                  <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.35, ease: 'easeOut' }}
                    style={{ fontSize: isSmall ? '14px' : '15px', color: isDark ? 'rgba(255, 255, 255, 0.65)' : theme.textMuted, margin: '0 0 28px', lineHeight: '1.7', fontFamily: FONTS.body, maxWidth: isMobile ? '100%' : '460px' }}
                  >
                    From inbox zero to fully automated CRM pipelines — I help founders and agencies reclaim their time so they can focus on growth, not grunt work.
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.45, ease: 'easeOut' }}
                    style={{ display: 'flex', gap: '12px', justifyContent: isMobile ? 'center' : 'flex-start', flexWrap: 'wrap', alignItems: 'center' }}
                  >
                    <a onClick={(e) => { e.preventDefault(); navigate('/services'); }} className="hero-cta-btn" href="/services">
                      <div className="hero-cta-line" />
                      <div className="hero-cta-line" />
                      <span className="hero-cta-text">VIEW SERVICES</span>
                      <div className="hero-cta-drow1" />
                      <div className="hero-cta-drow2" />
                    </a>
                    <button onClick={() => navigate('/about')} style={{ ...btnOutline, height: '48px', padding: '0 26px', fontSize: '14px', color: isDark ? '#fff' : theme.text, borderColor: isDark ? 'rgba(255, 255, 255, 0.25)' : theme.cardBorder, backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'transparent' }}>About Us</button>
                  </motion.div>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.65 }}
                    style={{ fontSize: '12px', color: isDark ? 'rgba(255, 255, 255, 0.4)' : theme.textMuted, marginTop: '18px', fontFamily: FONTS.body }}
                  >
                    Plus <a href="#free-tools" onClick={(e) => { e.preventDefault(); document.getElementById('free-tools')?.scrollIntoView({ behavior: 'smooth' }); }} style={{ color: isDark ? '#60a5fa' : BRAND.blue, textDecoration: 'none', fontWeight: '500' }}>26+ free tools</a> you can use right now — no sign-up needed.
                  </motion.p>
                </div>

                {/* Right: Hero image with floating badges */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
                  style={{
                    flex: isMobile ? 'none' : '0 0 52%',
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    position: 'relative',
                    alignSelf: 'flex-end',
                    marginRight: isMobile ? 0 : '-32px',
                  }}
                >
                  {/* Glow effect behind image */}
                  <div style={{
                    position: 'absolute',
                    bottom: '5%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '80%',
                    height: '70%',
                    background: isDark
                      ? `radial-gradient(ellipse, ${BRAND.blue}30 0%, transparent 70%)`
                      : `radial-gradient(ellipse, ${BRAND.blue}15 0%, transparent 70%)`,
                    borderRadius: '50%',
                    filter: 'blur(60px)',
                    pointerEvents: 'none',
                  }} />

                  {/* CSS keyframes for GPU-accelerated smooth float */}
                  <style>{`
                  @keyframes floatBadge1 { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
                  @keyframes floatBadge2 { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(12px); } }
                  @keyframes floatBadge3 { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
                  @keyframes floatBadge4 { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(9px); } }
                `}</style>

                  {/* Floating badges */}
                  {!isMobile && (() => {
                    const badgeBase = {
                      zIndex: 10,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 16px',
                      backgroundColor: isDark ? 'rgba(20, 17, 14, 0.9)' : 'rgba(255, 255, 255, 0.95)',
                      border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
                      borderRadius: '12px',
                      backdropFilter: 'blur(12px)',
                      boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 32px rgba(0,0,0,0.08)',
                      willChange: 'transform',
                    };
                    const labelStyle = { fontSize: '12px', fontWeight: '600', fontFamily: FONTS.body, color: isDark ? '#fff' : BRAND.brown };
                    return (
                      <>
                        <motion.div
                          initial={{ opacity: 0, x: -30 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.6, delay: 0.8, ease: 'easeOut' }}
                          style={{ ...badgeBase, position: 'absolute', top: '10%', left: '-5%', animation: 'floatBadge1 3.5s ease-in-out infinite' }}
                        >
                          <Headphones size={18} weight="duotone" style={{ color: BRAND.blue }} />
                          <span style={labelStyle}>Customer Support Pro</span>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, x: 30 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.6, delay: 1.0, ease: 'easeOut' }}
                          style={{ ...badgeBase, position: 'absolute', top: '32%', right: '-2%', animation: 'floatBadge2 4s ease-in-out 0.5s infinite' }}
                        >
                          <Lightning size={18} weight="duotone" style={{ color: '#f59e0b' }} />
                          <span style={labelStyle}>HighLevel Automation</span>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.6, delay: 1.2, ease: 'easeOut' }}
                          style={{ ...badgeBase, position: 'absolute', bottom: '22%', left: '-2%', animation: 'floatBadge3 4.5s ease-in-out 1s infinite' }}
                        >
                          <ChartLineUp size={18} weight="duotone" style={{ color: BRAND.green }} />
                          <span style={labelStyle}>CRM Builder</span>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.6, delay: 1.4, ease: 'easeOut' }}
                          style={{ ...badgeBase, position: 'absolute', bottom: '8%', right: '5%', animation: 'floatBadge4 3.8s ease-in-out 0.8s infinite' }}
                        >
                          <ClipboardText size={18} weight="duotone" style={{ color: '#8b5cf6' }} />
                          <span style={labelStyle}>Admin VA</span>
                        </motion.div>
                      </>
                    );
                  })()}

                  <div style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: isMobile ? '400px' : '600px',
                    minHeight: isMobile ? '300px' : '500px',
                    display: 'flex',
                    alignItems: 'flex-end',
                    maskImage: `linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%), linear-gradient(to bottom, black 0%, black 85%, transparent 100%)`,
                    WebkitMaskImage: `linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%), linear-gradient(to bottom, black 0%, black 85%, transparent 100%)`,
                    maskComposite: 'intersect',
                    WebkitMaskComposite: 'source-in', // More standard for intersection in older WebKit
                  }}>
                    <img
                      src="/herbg2.webp"
                      alt="BrewedOps - Your dedicated virtual assistant"
                      fetchpriority="high"
                      loading="eager"
                      decoding="async"
                      width={600}
                      height={445}
                      onLoad={(e) => {
                        e.target.style.opacity = 1;
                      }}
                      onError={(e) => {
                        e.target.src = "/herbg2.png";
                      }}
                      style={{
                        width: '100%',
                        height: 'auto',
                        display: 'block',
                        position: 'relative',
                        zIndex: 1,
                        transition: 'opacity 0.3s ease-in-out',
                      }}
                    />
                  </div>
                </motion.div>
              </div>
            </section>
          </Vortex>

          {/* Animated Wave Divider */}
          <div style={{ position: 'relative', marginTop: '-2px', lineHeight: 0, overflow: 'hidden' }}>
            <svg
              viewBox="0 0 1440 120"
              preserveAspectRatio="none"
              style={{ display: 'block', width: '100%', height: isMobile ? '50px' : '80px' }}
            >
              <defs>
                <linearGradient id="waveGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={BRAND.blue} stopOpacity="0.3" />
                  <stop offset="50%" stopColor={BRAND.green} stopOpacity="0.2" />
                  <stop offset="100%" stopColor={BRAND.blue} stopOpacity="0.3" />
                </linearGradient>
                <linearGradient id="waveGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={BRAND.blue} stopOpacity="0.15" />
                  <stop offset="50%" stopColor={BRAND.green} stopOpacity="0.1" />
                  <stop offset="100%" stopColor={BRAND.blue} stopOpacity="0.15" />
                </linearGradient>
              </defs>
              {/* Back wave - slower */}
              <path
                fill="url(#waveGrad2)"
                d="M0,60 C180,100 360,20 540,60 C720,100 900,20 1080,60 C1260,100 1440,40 1440,40 L1440,120 L0,120 Z"
                style={{
                  animation: 'waveMove2 8s ease-in-out infinite alternate',
                }}
              />
              {/* Middle wave */}
              <path
                fill="url(#waveGrad1)"
                d="M0,80 C240,40 480,100 720,60 C960,20 1200,90 1440,50 L1440,120 L0,120 Z"
                style={{
                  animation: 'waveMove1 6s ease-in-out infinite alternate',
                }}
              />
              {/* Front wave - matches next section bg */}
              <path
                fill={isDark ? '#080604' : '#f5f0eb'}
                d="M0,90 C160,70 320,110 480,85 C640,60 800,100 960,80 C1120,60 1280,95 1440,75 L1440,120 L0,120 Z"
                style={{
                  animation: 'waveMove3 5s ease-in-out infinite alternate',
                }}
              />
            </svg>
            <style>{`
            @keyframes waveMove1 {
              0% { d: path("M0,80 C240,40 480,100 720,60 C960,20 1200,90 1440,50 L1440,120 L0,120 Z"); }
              100% { d: path("M0,60 C240,90 480,30 720,70 C960,100 1200,40 1440,70 L1440,120 L0,120 Z"); }
            }
            @keyframes waveMove2 {
              0% { d: path("M0,60 C180,100 360,20 540,60 C720,100 900,20 1080,60 C1260,100 1440,40 1440,40 L1440,120 L0,120 Z"); }
              100% { d: path("M0,40 C180,20 360,90 540,50 C720,20 900,80 1080,40 C1260,10 1440,70 1440,70 L1440,120 L0,120 Z"); }
            }
            @keyframes waveMove3 {
              0% { d: path("M0,90 C160,70 320,110 480,85 C640,60 800,100 960,80 C1120,60 1280,95 1440,75 L1440,120 L0,120 Z"); }
              100% { d: path("M0,75 C160,95 320,65 480,90 C640,110 800,70 960,95 C1120,110 1280,75 1440,90 L1440,120 L0,120 Z"); }
            }
          `}</style>
          </div>
        </div>

        {/* ABOUT SECTION */}
        <section style={{
          padding: isMobile ? '60px 20px' : '100px 64px',
          backgroundColor: isDark ? '#080604' : '#f5f0eb',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {/* Top: ABOUT heading + Description */}
            <ScrollReveal>
              <div style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                alignItems: isMobile ? 'flex-start' : 'center',
                gap: isMobile ? '24px' : '60px',
                marginBottom: isMobile ? '48px' : '72px',
              }}>
                <h2 style={{
                  fontSize: isSmall ? '56px' : (isMobile ? '72px' : '120px'),
                  fontWeight: '800',
                  color: isDark ? '#ffffff' : BRAND.brown,
                  fontFamily: FONTS.heading,
                  lineHeight: 1,
                  margin: 0,
                  letterSpacing: '-0.04em',
                  flexShrink: 0,
                }}>
                  ABOUT
                </h2>
                <p style={{
                  fontSize: isSmall ? '17px' : (isMobile ? '20px' : '26px'),
                  lineHeight: 1.45,
                  fontFamily: FONTS.heading,
                  fontWeight: '500',
                  margin: 0,
                  color: isDark ? 'rgba(255,255,255,0.85)' : '#3F200C',
                }}>
                  <span style={{ color: '#FF6B6B' }}>We help growing brands streamline operations and automate workflows</span>
                  , delivering dedicated VA support, CRM automation, and custom-built digital tools with 11+ years of expertise
                </p>
              </div>
            </ScrollReveal>

            {/* Value Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: isSmall ? '1fr 1fr' : (isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)'),
              gap: isSmall ? '12px' : '16px',
            }}>
              {[
                { Icon: Heart, title: 'Passion', description: 'We love what we do and it shows in every project we deliver.', color: '#ef4444', weight: 'fill' },
                { Icon: LightbulbFilament, title: 'Innovation', description: 'Always pushing boundaries to find creative solutions.', color: '#3b82f6', weight: 'fill' },
                { Icon: ChartLineUp, title: 'Growth', description: 'Committed to continuous learning and improvement.', color: '#f59e0b', weight: 'bold' },
                { Icon: ShieldCheck, title: 'Trust', description: 'Building lasting relationships through transparency and reliability.', color: '#22c55e', weight: 'fill' },
              ].map((value, idx) => (
                <ScrollReveal key={value.title} delay={0.1 * idx} style={{ height: '100%' }}>
                  <div style={{
                    padding: isSmall ? '24px 16px' : '36px 28px',
                    backgroundColor: isDark ? '#0e0c09' : '#ffffff',
                    borderRadius: '16px',
                    border: isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid #e8e0d4',
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    height: '100%',
                    boxSizing: 'border-box',
                  }}>
                    {/* Grid pattern */}
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundImage: isDark
                        ? 'linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)'
                        : 'linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)',
                      backgroundSize: '28px 28px',
                      pointerEvents: 'none',
                    }} />
                    <div style={{ position: 'relative', zIndex: 1 }}>
                      <div style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '14px',
                        backgroundColor: `${value.color}15`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 20px',
                      }}>
                        <value.Icon size={28} color={value.color} weight={value.weight} />
                      </div>
                      <h3 style={{
                        fontSize: isSmall ? '16px' : '18px',
                        fontWeight: '700',
                        color: isDark ? '#ffffff' : BRAND.brown,
                        fontFamily: FONTS.heading,
                        margin: '0 0 8px',
                      }}>
                        {value.title}
                      </h3>
                      <p style={{
                        fontSize: isSmall ? '12px' : '14px',
                        color: isDark ? 'rgba(255,255,255,0.55)' : '#7a6652',
                        lineHeight: 1.6,
                        fontFamily: FONTS.body,
                        margin: 0,
                      }}>
                        {value.description}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* AUTOMATION FLOWCHART */}
        {/* ============================================ */}
        <section style={{
          padding: isMobile ? '48px 20px' : '64px 64px',
          backgroundColor: isDark ? '#0d0b09' : '#faf8f5',
        }}>
          <style>{`
            @keyframes triggerGlowHome {
              0%, 100% { box-shadow: 0 2px 8px rgba(0,74,172,0.1); transform: scale(1); }
              50% { box-shadow: 0 4px 20px rgba(0,74,172,0.25); transform: scale(1.02); }
            }
          `}</style>
          <ScrollReveal>
            <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
              <h2 style={{
                fontSize: isMobile ? '26px' : '36px',
                fontWeight: '800',
                fontFamily: FONTS.heading,
                marginBottom: '10px',
                color: isDark ? '#ffffff' : BRAND.brown,
                lineHeight: '1.2',
              }}>
                Your Business on Autopilot
              </h2>
              <p style={{
                fontSize: isMobile ? '16px' : '18px',
                color: theme.textMuted,
                fontFamily: FONTS.body,
                lineHeight: '1.6',
                margin: '0 auto 40px',
                maxWidth: '500px',
              }}>
                One trigger fires. Everything else runs itself.
              </p>

              {/* GHL-style Workflow Builder */}
              <div style={{
                position: 'relative',
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
                {/* Vertical flow — step-based sequential animation */}
                {(() => {
                  const nodeWidth = isSmall ? '220px' : '280px';
                  const lineBg = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.10)';
                  const lineColor = BRAND.blue;         /* all lines = blue */
                  const highlightBorder = '#e8860c';    /* all node borders on highlight = orange */
                  const s = flowStep;

                  /* Connector — line fills blue, circle border turns orange */
                  const renderConnector = (step) => {
                    const active = s >= step;
                    return (
                      <div key={`conn-${step}`} style={{
                        position: 'relative',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        height: '48px', width: '22px',
                      }}>
                        <div style={{
                          position: 'absolute', left: '50%', top: 0, bottom: 0,
                          width: '2px', transform: 'translateX(-50%)',
                          backgroundColor: lineBg, overflow: 'hidden',
                        }}>
                          <div style={{
                            position: 'absolute', inset: 0,
                            backgroundColor: active ? lineColor : 'transparent',
                            transformOrigin: 'top',
                            transform: active ? 'scaleY(1)' : 'scaleY(0)',
                            transition: 'transform 0.45s ease',
                          }} />
                        </div>
                        <div style={{
                          position: 'relative', zIndex: 1,
                          width: '22px', height: '22px', borderRadius: '50%',
                          border: `1.5px solid ${active ? highlightBorder : (isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)')}`,
                          backgroundColor: theme.cardBg,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '12px', fontWeight: '600',
                          color: active ? highlightBorder : theme.textMuted,
                          transition: 'all 0.3s ease 0.2s',
                        }}>+</div>
                      </div>
                    );
                  };

                  /* Action node — border turns orange, icon keeps its own color */
                  const renderActionNode = (Icon, title, subtitle, iconColor, step, iconWeight) => {
                    const active = s >= step;
                    return (
                      <div key={`action-${step}`} style={{
                        display: 'flex', alignItems: 'center', gap: '12px',
                        padding: '14px 18px', width: nodeWidth,
                        backgroundColor: theme.cardBg, borderRadius: '12px',
                        border: `1.5px solid ${active ? highlightBorder : theme.cardBorder}`,
                        boxShadow: active
                          ? `0 4px 20px ${highlightBorder}25, 0 0 0 2px ${highlightBorder}12`
                          : `0 2px 8px ${isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.04)'}`,
                        transform: active ? 'scale(1.03)' : 'scale(1)',
                        transition: 'all 0.4s ease',
                      }}>
                        <div style={{
                          width: '36px', height: '36px', borderRadius: '10px',
                          backgroundColor: `${iconColor}15`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        }}>
                          <Icon size={18} weight={iconWeight || 'duotone'} style={{ color: iconColor }} />
                        </div>
                        <div style={{ flex: 1, textAlign: 'left' }}>
                          <div style={{ fontSize: '14px', fontWeight: '600', color: theme.text, fontFamily: FONTS.body, lineHeight: '1.3' }}>{title}</div>
                          <div style={{ fontSize: '11px', color: theme.textMuted, fontFamily: FONTS.body, lineHeight: '1.4', marginTop: '2px' }}>{subtitle}</div>
                        </div>
                      </div>
                    );
                  };

                  /* Branch line — always fills blue */
                  const renderBranchLine = (step) => {
                    const active = s >= step;
                    return (
                      <div key={`branch-${step}`} style={{
                        width: '2px', height: '24px',
                        backgroundColor: lineBg, overflow: 'hidden',
                        position: 'relative',
                      }}>
                        <div style={{
                          position: 'absolute', inset: 0,
                          backgroundColor: active ? lineColor : 'transparent',
                          transformOrigin: 'top',
                          transform: active ? 'scaleY(1)' : 'scaleY(0)',
                          transition: 'transform 0.35s ease',
                        }} />
                      </div>
                    );
                  };

                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                      {/* Step 1: Trigger Node */}
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: '12px',
                        width: nodeWidth, padding: '14px 18px',
                        backgroundColor: isDark ? `${BRAND.blue}18` : `${BRAND.blue}0a`,
                        borderRadius: '12px',
                        border: `1.5px solid ${s >= 1 ? highlightBorder : (isDark ? `${BRAND.blue}40` : `${BRAND.blue}25`)}`,
                        borderLeft: `4px solid ${BRAND.blue}`,
                        boxShadow: s >= 1
                          ? `0 4px 24px ${highlightBorder}30, 0 0 0 3px ${highlightBorder}15`
                          : `0 2px 8px ${isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.04)'}`,
                        transform: s >= 1 ? 'scale(1.03)' : 'scale(1)',
                        transition: 'all 0.4s ease',
                        cursor: 'pointer',
                        animation: s < 1 ? 'triggerGlowHome 3s ease-in-out infinite' : 'none',
                      }}>
                        <div style={{
                          width: '36px', height: '36px', borderRadius: '10px',
                          background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.blue}cc)`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        }}>
                          <Lightning size={18} weight="fill" style={{ color: '#fff' }} />
                        </div>
                        <div style={{ flex: 1, textAlign: 'left' }}>
                          <div style={{ fontSize: '14px', fontWeight: '700', color: isDark ? '#fff' : BRAND.brown, fontFamily: FONTS.body, lineHeight: '1.3' }}>New Lead Captured</div>
                          <div style={{ fontSize: '11px', color: theme.textMuted, fontFamily: FONTS.body, lineHeight: '1.4', marginTop: '2px' }}>Form Submission</div>
                        </div>
                      </div>

                      {renderConnector(2)}
                      {renderActionNode(Clock, "Instant Follow-Up", "Send SMS & Email", BRAND.blue, 3)}
                      {renderConnector(4)}
                      {renderActionNode(ChartLineUp, "Pipeline Updated", "Move to New Stage", BRAND.blue, 5)}
                      {renderConnector(6)}

                      {/* Step 7: If/Else Condition */}
                      {renderActionNode(BracketsCurly, "If/Else Condition", "Check Lead Score", BRAND.blue, 7, "bold")}

                      {/* Branch section */}
                      <div style={{ width: '100%', maxWidth: isSmall ? '560px' : '640px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {renderBranchLine(8)}

                        {/* Step 9: Horizontal bar — blue */}
                        {!isMobile && (
                          <div style={{
                            width: '70%', height: '2px',
                            backgroundColor: lineBg,
                            position: 'relative', overflow: 'hidden',
                          }}>
                            <div style={{
                              position: 'absolute', inset: 0,
                              backgroundColor: s >= 9 ? lineColor : 'transparent',
                              transformOrigin: 'center',
                              transform: s >= 9 ? 'scaleX(1)' : 'scaleX(0)',
                              transition: 'transform 0.4s ease',
                            }} />
                          </div>
                        )}

                        {/* Branch cards */}
                        <div style={{
                          display: isMobile ? 'flex' : 'grid',
                          gridTemplateColumns: isMobile ? undefined : 'repeat(3, 1fr)',
                          flexDirection: isMobile ? 'column' : undefined,
                          alignItems: isMobile ? 'center' : 'stretch',
                          gap: isMobile ? '0' : '40px',
                          width: '100%',
                        }}>
                          {[
                            { icon: CalendarCheck, title: 'Appointment Set', subtitle: 'Hot lead — book call', iconColor: BRAND.green, step: 10 },
                            { icon: Handshake, title: 'Team Notified', subtitle: 'Assign to sales rep', iconColor: BRAND.blue, step: 11 },
                            { icon: Timer, title: 'Nurture Sequence', subtitle: 'Add to drip campaign', iconColor: '#c4813a', step: 12 },
                          ].map((branch, i) => {
                            const active = s >= branch.step;
                            return (
                              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                {renderBranchLine(branch.step)}
                                <div style={{
                                  padding: '14px 16px',
                                  backgroundColor: theme.cardBg,
                                  borderRadius: '10px',
                                  border: `1.5px solid ${active ? highlightBorder : theme.cardBorder}`,
                                  borderBottom: `3px solid ${active ? highlightBorder : theme.cardBorder}`,
                                  boxShadow: active
                                    ? `0 4px 16px ${highlightBorder}20`
                                    : `0 2px 8px ${isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.04)'}`,
                                  transform: active ? 'scale(1.03)' : 'scale(1)',
                                  transition: 'all 0.4s ease',
                                  textAlign: 'center',
                                  width: isMobile ? nodeWidth : '100%',
                                  flex: 1,
                                }}>
                                  <div style={{
                                    width: '32px', height: '32px', borderRadius: '8px',
                                    backgroundColor: `${branch.iconColor}12`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    margin: '0 auto 8px',
                                  }}>
                                    <branch.icon size={16} weight="duotone" style={{ color: branch.iconColor }} />
                                  </div>
                                  <div style={{ fontSize: '13px', fontWeight: '600', color: theme.text, fontFamily: FONTS.body }}>{branch.title}</div>
                                  <div style={{ fontSize: '11px', color: theme.textMuted, fontFamily: FONTS.body, marginTop: '3px' }}>{branch.subtitle}</div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                    </div>
                  );
                })()}

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
                }}>
                  Hover to activate the flow
                </p>
              </div>

              {/* Footer note */}
              <p style={{
                fontSize: '14px',
                color: theme.textMuted,
                fontFamily: FONTS.body,
                marginTop: '28px',
              }}>
                Powered by <strong style={{ color: isDark ? '#f5f0eb' : BRAND.brown }}>GoHighLevel</strong> automation, built by BrewedOps.
              </p>
            </div>
          </ScrollReveal>
        </section>

        {/* SERVICES OVERVIEW */}
        <section style={{
          padding: isMobile ? '60px 20px' : '80px 64px',
          backgroundColor: isDark ? '#0d0b09' : '#faf8f5',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <ScrollReveal>
            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
              {/* Header */}
              <div style={{ textAlign: 'center', marginBottom: isMobile ? '32px' : '48px' }}>
                <p style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  letterSpacing: '4px',
                  color: isDark ? '#a09585' : '#7a6652',
                  marginBottom: '12px',
                  fontFamily: FONTS.body,
                  textTransform: 'uppercase',
                }}>
                  Services
                </p>
                <h2 style={{
                  fontSize: isMobile ? '28px' : '40px',
                  fontWeight: '800',
                  color: isDark ? '#fff' : BRAND.brown,
                  fontFamily: FONTS.heading,
                  lineHeight: '1.2',
                  margin: '0 0 12px',
                }}>
                  How I Can Help
                </h2>
                <p style={{ fontSize: '16px', color: isDark ? 'rgba(255,255,255,0.6)' : theme.textMuted, fontFamily: FONTS.body, maxWidth: '550px', margin: '0 auto', lineHeight: '1.7' }}>
                  11+ years of customer support experience packaged into services that help your business grow.
                </p>
              </div>

              {/* Icon Tabs */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: isSmall ? '12px' : (isMobile ? '20px' : '40px'), marginBottom: isMobile ? '32px' : '48px' }}>
                {[
                  { icon: SupportTabIcon, label: 'Support', fullLabel: 'Customer Support', color: BRAND.blue },
                  { icon: AdminTabIcon, label: 'Admin', fullLabel: 'Admin VA', color: BRAND.green },
                  { icon: AutomationTabIcon, label: 'GHL', fullLabel: 'GHL Automation', color: '#f59e0b' },
                  { icon: WebDevTabIcon, label: 'WebDev', fullLabel: 'Web Development', color: '#8b5cf6' },
                ].map((tab, i) => {
                  const isActive = activeService === i;
                  const TabIcon = tab.icon;
                  return (
                    <button key={tab.label} onClick={() => setActiveService(i)} aria-label={tab.fullLabel} style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
                      padding: '4px', transition: 'all 0.3s ease',
                      width: isSmall ? '60px' : (isMobile ? '70px' : '120px'),
                    }}>
                      <div style={{
                        width: isSmall ? '42px' : (isMobile ? '50px' : '58px'),
                        height: isSmall ? '42px' : (isMobile ? '50px' : '58px'),
                        borderRadius: '16px',
                        backgroundColor: isActive ? tab.color : (isDark ? '#1e1a16' : '#f0ebe4'),
                        border: isActive ? `2px solid ${tab.color}` : `1px solid ${isDark ? '#2a2420' : '#e0d6c8'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: isActive ? `0 6px 24px ${tab.color}35` : 'none',
                        transform: isActive ? 'scale(1.08)' : 'scale(1)',
                      }}>
                        <TabIcon size={isSmall ? 18 : (isMobile ? 22 : 26)}
                          style={{ color: isActive ? '#fff' : (isDark ? '#9a8d80' : '#6b5f52'), transition: 'color 0.3s ease' }} />
                      </div>
                      <span style={{
                        fontSize: isSmall ? '9px' : (isMobile ? '10px' : '13px'),
                        fontWeight: isActive ? '700' : '500',
                        color: isActive ? tab.color : (isDark ? '#9a8d80' : '#6b5f52'),
                        fontFamily: FONTS.heading, transition: 'all 0.3s ease',
                      }}>
                        {isMobile ? tab.label : tab.fullLabel}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Animated Content Area */}
              <AnimatePresence mode="wait">
                {(() => {
                  const servicesData = [
                    { color: BRAND.blue, title: 'Customer Support', headline: 'Support that keeps customers coming back', description: 'Professional customer service — email, phone, live chat, and ticket management. Fast, friendly, and SLA-tracked.', features: ['Phones', 'Live Chat', 'Email', 'Ticket'], icon: Headphones },
                    { color: BRAND.green, title: 'Admin VA', headline: 'Your back office, fully handled', description: 'Day-to-day operations managed so you can focus on growing your business. Organized, accurate, and proactive.', features: ['Inbox & Calendar Management', 'Data Entry & Reports', 'Travel & Scheduling', 'Process Documentation'], icon: ClipboardText },
                    { color: '#f59e0b', title: 'GHL Automation', headline: 'Automate your entire sales pipeline', description: 'GoHighLevel CRM setup, workflow automation, and pipeline management. Set it up once, let it run 24/7.', features: ['Full CRM Build & Config', 'Automated Follow-ups', 'Pipeline & Lead Scoring', 'SMS & Email Sequences'], icon: Lightning },
                    { color: '#8b5cf6', title: 'Web Development', headline: 'Modern apps, powered by AI', description: 'Web apps, dashboards, and tools — vibe coded with AI-assisted modern tech stacks. Fast delivery, clean code.', features: ['React & Vite Apps', 'AI-Assisted Development', 'Custom Dashboards', 'Responsive Design'], icon: Code },
                  ];
                  const s = servicesData[activeService];
                  const SIcon = s.icon;
                  const cardBase = {
                    backgroundColor: isDark ? '#1a1612' : '#ffffff',
                    borderRadius: '16px',
                    border: `1px solid ${isDark ? '#2a2420' : '#e8e0d4'}`,
                    overflow: 'hidden',
                    boxShadow: `0 0 40px ${s.color}08, 0 8px 32px ${isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.04)'}`,
                  };
                  const cardHeaderEl = (title, subtitle) => (
                    <div style={{ padding: '14px 20px', borderBottom: `1px solid ${isDark ? '#2a2420' : '#e8e0d4'}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '10px', backgroundColor: s.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <SIcon size={16} style={{ color: s.color }} />
                        </div>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: '600', color: isDark ? '#f5f0eb' : BRAND.brown, fontFamily: FONTS.heading }}>{title}</div>
                          {subtitle && <div style={{ fontSize: '10px', color: s.color, fontFamily: FONTS.body, fontWeight: '500' }}>{subtitle}</div>}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: BRAND.green }} />
                      </div>
                    </div>
                  );

                  const showcases = [
                    /* Customer Support - Chat Widget */
                    <div key="chat" style={cardBase}>
                      {cardHeaderEl('Live Support', '● Online')}
                      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', minHeight: isMobile ? '220px' : '280px' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <div style={{ backgroundColor: BRAND.blue, color: '#fff', padding: '10px 14px', borderRadius: '14px 14px 4px 14px', fontSize: '12px', fontFamily: FONTS.body, maxWidth: '78%' }}>
                            Hi! I need help with my subscription billing issue.
                          </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                          <div style={{ backgroundColor: isDark ? '#2a2420' : '#f5f0eb', color: isDark ? '#f5f0eb' : BRAND.brown, padding: '10px 14px', borderRadius: '14px 14px 14px 4px', fontSize: '12px', fontFamily: FONTS.body, maxWidth: '78%' }}>
                            Hi there! I'd be happy to help. Let me pull up your account right away.
                          </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <div style={{ backgroundColor: BRAND.blue, color: '#fff', padding: '10px 14px', borderRadius: '14px 14px 4px 14px', fontSize: '12px', fontFamily: FONTS.body, maxWidth: '78%' }}>
                            That was so fast, thank you!
                          </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                          <div style={{ backgroundColor: isDark ? '#2a2420' : '#f5f0eb', padding: '10px 14px', borderRadius: '14px 14px 14px 4px', fontSize: '12px', fontFamily: FONTS.body, maxWidth: '82%' }}>
                            <span style={{ color: isDark ? '#f5f0eb' : BRAND.brown }}>All sorted! Your billing has been updated.</span>
                            <div style={{ marginTop: '6px', padding: '6px 10px', backgroundColor: BRAND.green + '15', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: BRAND.green }} />
                              <span style={{ fontSize: '10px', color: BRAND.green, fontWeight: '600', fontFamily: FONTS.body }}>Resolved in 2m 14s</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div style={{ padding: '12px 16px', borderTop: `1px solid ${isDark ? '#2a2420' : '#e8e0d4'}`, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ flex: 1, height: '36px', backgroundColor: isDark ? '#0d0b09' : '#faf8f5', borderRadius: '18px', padding: '0 14px', display: 'flex', alignItems: 'center', border: `1px solid ${isDark ? '#332d26' : '#e0d6c8'}` }}>
                          <span style={{ fontSize: '12px', color: isDark ? '#85796c' : '#7d7062', fontFamily: FONTS.body }}>Type a message...</span>
                        </div>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: BRAND.blue, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <CaretRight size={14} weight="bold" style={{ color: '#fff' }} />
                        </div>
                      </div>
                    </div>,

                    /* Admin VA - Task Dashboard */
                    <div key="tasks" style={cardBase}>
                      {cardHeaderEl("Today's Tasks", '3 of 5 done')}
                      <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '2px', minHeight: isMobile ? '220px' : '280px' }}>
                        {[
                          { text: 'Review and respond to emails', done: true },
                          { text: 'Schedule client meeting — 2:00 PM', done: true },
                          { text: 'Update CRM contacts list', done: true },
                          { text: 'Prepare weekly analytics report', done: false },
                          { text: 'Send invoice reminders to 3 clients', done: false },
                        ].map((task, ti) => (
                          <div key={ti} style={{
                            display: 'flex', alignItems: 'center', gap: '10px',
                            padding: '10px 14px', borderRadius: '10px',
                            backgroundColor: task.done ? (isDark ? BRAND.green + '08' : BRAND.green + '06') : 'transparent',
                          }}>
                            <div style={{
                              width: '20px', height: '20px', borderRadius: '6px',
                              border: task.done ? `2px solid ${BRAND.green}` : `2px solid ${isDark ? '#332d26' : '#d4c8b8'}`,
                              backgroundColor: task.done ? BRAND.green : 'transparent',
                              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                            }}>
                              {task.done && <CheckSquare size={12} weight="bold" style={{ color: '#fff' }} />}
                            </div>
                            <span style={{
                              fontSize: '12px', fontFamily: FONTS.body,
                              color: task.done ? (isDark ? '#9a8d80' : '#6b5f52') : (isDark ? '#f5f0eb' : BRAND.brown),
                              textDecoration: task.done ? 'line-through' : 'none',
                            }}>{task.text}</span>
                          </div>
                        ))}
                      </div>
                      <div style={{ padding: '14px 20px', borderTop: `1px solid ${isDark ? '#2a2420' : '#e8e0d4'}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <span style={{ fontSize: '11px', color: isDark ? '#9a8d80' : '#6b5f52', fontFamily: FONTS.body }}>Daily Progress</span>
                          <span style={{ fontSize: '11px', color: BRAND.green, fontWeight: '600', fontFamily: FONTS.body }}>60%</span>
                        </div>
                        <div style={{ height: '4px', backgroundColor: isDark ? '#2a2420' : '#e8e0d4', borderRadius: '2px', overflow: 'hidden' }}>
                          <div style={{ width: '60%', height: '100%', backgroundColor: BRAND.green, borderRadius: '2px' }} />
                        </div>
                      </div>
                    </div>,

                    /* GHL Automation - Pipeline Flow */
                    <div key="pipeline" style={cardBase}>
                      {cardHeaderEl('Lead Nurture Flow', 'Active')}
                      <div style={{ padding: '20px 28px', display: 'flex', flexDirection: 'column', alignItems: 'stretch', minHeight: isMobile ? '220px' : '280px' }}>
                        {[
                          { emoji: '\u26A1', label: 'New Lead Captured', status: 'done' },
                          { emoji: '\u2709\uFE0F', label: 'Welcome Email Sent', status: 'done' },
                          { emoji: '\u23F0', label: 'Wait 2 Days', status: 'active' },
                          { emoji: '\uD83D\uDCF1', label: 'SMS Follow-up', status: 'pending' },
                          { emoji: '\u2705', label: 'Move to Sales Pipeline', status: 'pending' },
                        ].map((step, si, arr) => (
                          <React.Fragment key={si}>
                            <div style={{
                              display: 'flex', alignItems: 'center', gap: '12px',
                              padding: '8px 14px', borderRadius: '10px',
                              backgroundColor: step.status === 'active' ? '#f59e0b15' : 'transparent',
                              border: step.status === 'active' ? '1px solid #f59e0b30' : '1px solid transparent',
                            }}>
                              <div style={{
                                width: '30px', height: '30px', borderRadius: '8px',
                                backgroundColor: step.status === 'done' ? '#f59e0b' : (step.status === 'active' ? '#f59e0b25' : (isDark ? '#2a2420' : '#f0ebe4')),
                                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', flexShrink: 0,
                              }}>
                                {step.status === 'done' ? <span style={{ color: '#fff', fontSize: '12px', fontWeight: '700' }}>{'\u2713'}</span> : step.emoji}
                              </div>
                              <span style={{
                                fontSize: '12px', fontFamily: FONTS.body, fontWeight: step.status === 'active' ? '600' : '400',
                                color: step.status === 'pending' ? (isDark ? '#9a8d80' : '#6b5f52') : (isDark ? '#f5f0eb' : BRAND.brown),
                              }}>{step.label}</span>
                              {step.status === 'active' && (
                                <span style={{ marginLeft: 'auto', fontSize: '8px', padding: '2px 8px', borderRadius: '100px', backgroundColor: '#f59e0b', color: '#fff', fontFamily: FONTS.body, fontWeight: '700', letterSpacing: '0.5px' }}>
                                  RUNNING
                                </span>
                              )}
                            </div>
                            {si < arr.length - 1 && (
                              <div style={{ width: '2px', height: '12px', marginLeft: '22px', backgroundColor: step.status === 'done' ? '#f59e0b' : (isDark ? '#2a2420' : '#e0d6c8') }} />
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>,

                    /* Web Development - Code Editor */
                    <div key="code" style={cardBase}>
                      {cardHeaderEl('Dashboard.jsx', 'React Component')}
                      <div style={{ padding: '16px 20px', minHeight: isMobile ? '200px' : '240px' }}>
                        <pre style={{ margin: 0, fontSize: '12px', lineHeight: '1.9', whiteSpace: 'pre-wrap', color: isDark ? '#d4c8b8' : '#5a4a3a', fontFamily: "'Fira Code', 'Cascadia Code', 'Consolas', monospace" }}>
{`  `}<span style={{ color: '#8b5cf6' }}>const</span>{` `}<span style={{ color: BRAND.blue }}>Dashboard</span>{` = () => {
    `}<span style={{ color: '#8b5cf6' }}>return</span>{` (
      `}<span style={{ color: '#8b5cf6' }}>&lt;</span><span style={{ color: '#ef4444' }}>Layout</span><span style={{ color: '#8b5cf6' }}>&gt;</span>{`
        `}<span style={{ color: '#8b5cf6' }}>&lt;</span><span style={{ color: '#ef4444' }}>Analytics</span>{` `}<span style={{ color: '#f59e0b' }}>data</span>{`=`}<span style={{ color: BRAND.green }}>{'{metrics}'}</span>{` `}<span style={{ color: '#8b5cf6' }}>/&gt;</span>{`
        `}<span style={{ color: '#8b5cf6' }}>&lt;</span><span style={{ color: '#ef4444' }}>Charts</span>{` `}<span style={{ color: '#f59e0b' }}>type</span>{`=`}<span style={{ color: BRAND.green }}>"realtime"</span>{` `}<span style={{ color: '#8b5cf6' }}>/&gt;</span>{`
        `}<span style={{ color: '#8b5cf6' }}>&lt;</span><span style={{ color: '#ef4444' }}>UserTable</span>{` `}<span style={{ color: '#f59e0b' }}>users</span>{`=`}<span style={{ color: BRAND.green }}>{'{data}'}</span>{` `}<span style={{ color: '#8b5cf6' }}>/&gt;</span>{`
      `}<span style={{ color: '#8b5cf6' }}>&lt;/</span><span style={{ color: '#ef4444' }}>Layout</span><span style={{ color: '#8b5cf6' }}>&gt;</span>{`
    )
  }`}
                        </pre>
                      </div>
                      <div style={{ margin: '0 16px 16px', padding: '12px 16px', backgroundColor: isDark ? '#0d0b09' : '#1e1a16', borderRadius: '10px' }}>
                        <div style={{ fontSize: '9px', color: '#9a8d80', marginBottom: '6px', fontFamily: FONTS.body, letterSpacing: '1px', textTransform: 'uppercase' }}>Terminal</div>
                        <div style={{ fontSize: '11px', color: BRAND.green, fontFamily: "'Fira Code', 'Consolas', monospace" }}>{'\u2713'} Built successfully in 1.2s</div>
                        <div style={{ fontSize: '11px', color: '#a09585', fontFamily: "'Fira Code', 'Consolas', monospace" }}>{'\u2192'} Running at localhost:5173</div>
                      </div>
                    </div>,
                  ];

                  return (
                    <motion.div
                      key={activeService}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                      style={{
                        display: 'flex',
                        flexDirection: isMobile ? 'column' : 'row',
                        gap: isMobile ? '24px' : '40px',
                        position: 'relative',
                      }}
                    >
                      {/* Accent glow */}
                      {!isMobile && <div style={{ position: 'absolute', top: '50%', left: '25%', transform: 'translate(-50%, -50%)', width: '400px', height: '300px', background: `radial-gradient(ellipse, ${s.color}06, transparent)`, filter: 'blur(80px)', pointerEvents: 'none' }} />}

                      {/* Left: Showcase */}
                      <div style={{ flex: isMobile ? 'none' : '0 0 48%', position: 'relative' }}>
                        {showcases[activeService]}
                      </div>

                      {/* Right: Details */}
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '20px', position: 'relative' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '100px', backgroundColor: s.color + '15', alignSelf: 'flex-start' }}>
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: s.color, boxShadow: `0 0 8px ${s.color}80, 0 0 16px ${s.color}40` }} />
                          <span style={{ fontSize: '12px', fontWeight: '600', color: s.color, fontFamily: FONTS.body }}>{s.title}</span>
                        </div>
                        <h3 style={{ fontSize: isMobile ? '24px' : '28px', fontWeight: '700', color: isDark ? '#f5f0eb' : BRAND.brown, fontFamily: FONTS.heading, margin: 0, lineHeight: '1.25' }}>
                          {s.headline}
                        </h3>
                        <p style={{ fontSize: '15px', color: isDark ? '#a09585' : '#7a6652', fontFamily: FONTS.body, lineHeight: '1.7', margin: 0 }}>
                          {s.description}
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          {s.features.map((f) => (
                            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6L5 8.5L9.5 3.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                              </div>
                              <span style={{ fontSize: '14px', color: isDark ? '#d4c8b8' : '#5a4a3a', fontFamily: FONTS.body }}>{f}</span>
                            </div>
                          ))}
                        </div>
                        <button
                          onClick={() => navigate('/services')}
                          style={{
                            height: '44px', padding: '0 24px', backgroundColor: s.color, color: '#fff',
                            border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600',
                            fontFamily: FONTS.body, cursor: 'pointer', display: 'inline-flex',
                            alignItems: 'center', justifyContent: 'center', gap: '8px', alignSelf: 'flex-start',
                            boxShadow: `0 4px 16px ${s.color}30`, transition: 'all 0.2s ease',
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = `0 6px 20px ${s.color}40`; }}
                          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 4px 16px ${s.color}30`; }}
                        >
                          View All Services <CaretRight size={16} />
                        </button>
                      </div>
                    </motion.div>
                  );
                })()}
              </AnimatePresence>
            </div>
          </ScrollReveal>
        </section>

        {/* PROJECTS SHOWCASE */}
        <section style={{
          padding: isMobile ? '60px 20px' : '80px 64px',
          backgroundColor: isDark ? '#171411' : '#ffffff',
          borderTop: '1px solid ' + theme.cardBorder,
          borderBottom: '1px solid ' + theme.cardBorder,
        }}>
          <ScrollReveal>
            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                <p style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  letterSpacing: '4px',
                  color: isDark ? '#a09585' : '#7a6652',
                  marginBottom: '12px',
                  fontFamily: FONTS.body,
                  textTransform: 'uppercase',
                }}>
                  Projects
                </p>
                <h2 style={{
                  fontSize: isMobile ? '28px' : '40px',
                  fontWeight: '800',
                  color: isDark ? '#fff' : BRAND.brown,
                  fontFamily: FONTS.heading,
                  lineHeight: '1.2',
                  margin: 0,
                }}>
                  Built by a VA, for VAs
                </h2>
              </div>

              <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '24px' }}>
                {/* BrewedOps Tools */}
                <div style={{
                  flex: 1,
                  padding: isMobile ? '24px' : '32px',
                  backgroundColor: isDark ? '#0d0b09' : '#faf8f5',
                  border: '1px solid ' + (isDark ? '#2a2420' : '#e8e0d4'),
                  borderRadius: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', backgroundColor: BRAND.blue + '15', borderRadius: '100px', marginBottom: '16px', alignSelf: 'flex-start' }}>
                    <Wrench size={12} style={{ color: BRAND.blue }} />
                    <span style={{ fontSize: '11px', fontWeight: '600', color: BRAND.blue, fontFamily: FONTS.body }}>WEB APP</span>
                  </div>
                  <h3 style={{ fontSize: isMobile ? '22px' : '26px', fontWeight: '700', color: isDark ? '#f5f0eb' : BRAND.brown, fontFamily: FONTS.heading, margin: '0 0 12px' }}>
                    BrewedOps Tools
                  </h3>
                  <p style={{ fontSize: '14px', color: isDark ? '#a09585' : '#7a6652', lineHeight: '1.7', fontFamily: FONTS.body, margin: '0 0 20px', flex: 1 }}>
                    A productivity hub with 26+ free tools for Filipino VAs and freelancers — image editing, PDF tools, finance tracking, task management, and more. All browser-based, no installs needed.
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
                    {['React', 'Supabase', 'Vite', 'Tailwind CSS'].map((tech) => (
                      <span key={tech} style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '100px', backgroundColor: isDark ? '#1e1a16' : '#e8e0d4', color: isDark ? '#d4c8b8' : '#5a4a3a', fontFamily: FONTS.body, fontWeight: '500' }}>{tech}</span>
                    ))}
                  </div>
                  <button onClick={() => navigate('/portfolio')} style={{ ...btnPrimary, height: '40px', padding: '0 20px', fontSize: '13px', alignSelf: 'flex-start' }}>
                    View Project <CaretRight size={16} />
                  </button>
                </div>

                {/* Fuelyx */}
                <div style={{
                  flex: 1,
                  padding: isMobile ? '24px' : '32px',
                  backgroundColor: isDark ? '#0d0b09' : '#faf8f5',
                  border: '1px solid ' + (isDark ? '#2a2420' : '#e8e0d4'),
                  borderRadius: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', backgroundColor: '#14b8a615', borderRadius: '100px', marginBottom: '16px', alignSelf: 'flex-start' }}>
                    <Globe size={12} style={{ color: '#14b8a6' }} />
                    <span style={{ fontSize: '11px', fontWeight: '600', color: '#14b8a6', fontFamily: FONTS.body }}>MOBILE APP</span>
                  </div>
                  <h3 style={{ fontSize: isMobile ? '22px' : '26px', fontWeight: '700', color: isDark ? '#f5f0eb' : BRAND.brown, fontFamily: FONTS.heading, margin: '0 0 12px' }}>
                    Fuelyx
                  </h3>
                  <p style={{ fontSize: '14px', color: isDark ? '#a09585' : '#7a6652', lineHeight: '1.7', fontFamily: FONTS.body, margin: '0 0 20px', flex: 1 }}>
                    A calorie tracking and fasting app built for Filipinos. Log local foods, monitor fasting windows, scan meals with AI, and hit your health goals — all in one app.
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
                    {['React Native', 'Expo', 'Supabase', 'AI Scanner'].map((tech) => (
                      <span key={tech} style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '100px', backgroundColor: isDark ? '#1e1a16' : '#e8e0d4', color: isDark ? '#d4c8b8' : '#5a4a3a', fontFamily: FONTS.body, fontWeight: '500' }}>{tech}</span>
                    ))}
                  </div>
                  <button onClick={() => navigate('/fuelyx')} style={{ ...btnPrimary, height: '40px', padding: '0 20px', fontSize: '13px', backgroundColor: '#14b8a6', boxShadow: '0 4px 16px rgba(20,184,166,0.3)', alignSelf: 'flex-start' }}>
                    Learn More <CaretRight size={16} />
                  </button>
                </div>
              </div>

              <div style={{ textAlign: 'center', marginTop: '32px' }}>
                <button onClick={() => navigate('/portfolio')} style={{ ...btnOutline, height: '44px', padding: '0 24px', fontSize: '14px', color: isDark ? '#fff' : BRAND.brown, borderColor: isDark ? 'rgba(255,255,255,0.2)' : theme.cardBorder }}>
                  View Full Portfolio <CaretRight size={16} />
                </button>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* ZIGZAG TOOLS TIMELINE */}
        <section id="free-tools" style={{
          backgroundColor: isDark ? '#0d0b09' : BRAND.cream,
          padding: isMobile ? '60px 20px' : '80px 64px',
          position: 'relative',
        }}>
          {/* Section Header */}
          <ScrollReveal>
            <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 60px' }}>
              <p style={{
                fontSize: '11px',
                fontWeight: '600',
                letterSpacing: '4px',
                color: isDark ? '#a09585' : '#7a6652',
                marginBottom: '12px',
                fontFamily: FONTS.body,
                textTransform: 'uppercase',
              }}>
                Bonus
              </p>
              <h2 style={{
                fontSize: isMobile ? '32px' : '48px',
                fontWeight: '800',
                color: isDark ? '#fff' : BRAND.brown,
                fontFamily: FONTS.heading,
                lineHeight: '1.15',
              }}>
                26+ Free Productivity Tools
              </h2>
            </div>
          </ScrollReveal>

          {/* Timeline Container */}
          <div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative' }}>
            {/* Vertical center line (desktop only) */}
            {!isMobile && (
              <div style={{
                position: 'absolute',
                left: '50%',
                top: '40px',
                bottom: '40px',
                width: '2px',
                background: isDark
                  ? 'linear-gradient(to bottom, transparent, #2a2420 10%, #2a2420 90%, transparent)'
                  : 'linear-gradient(to bottom, transparent, #d4c8b8 10%, #d4c8b8 90%, transparent)',
              }} />
            )}

            {TOOL_TIMELINE.map((category, index) => {
              const isEven = index % 2 === 0;
              const IconComp = category.icon;
              const accentColor = category.accent;
              const accentBg = isDark
                ? `${accentColor}25`
                : `${accentColor}15`;

              return (
                <div
                  key={category.name}
                  style={{
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : (isEven ? 'row' : 'row-reverse'),
                    alignItems: isMobile ? 'flex-start' : 'center',
                    gap: isMobile ? '0' : '60px',
                    marginBottom: index < TOOL_TIMELINE.length - 1 ? (isMobile ? '48px' : '64px') : 0,
                    position: 'relative',
                  }}
                >
                  {/* Text Content */}
                  <div style={{
                    flex: 1,
                    textAlign: isMobile ? 'left' : (isEven ? 'right' : 'left'),
                    paddingLeft: isMobile ? '60px' : 0,
                  }}>
                    <h3 style={{
                      fontSize: isMobile ? '22px' : '28px',
                      fontWeight: '700',
                      color: isDark ? '#f5f0eb' : BRAND.brown,
                      fontFamily: FONTS.heading,
                      marginBottom: '8px',
                    }}>
                      {category.name}
                    </h3>
                    <p style={{
                      fontSize: isMobile ? '14px' : '16px',
                      color: isDark ? '#a09585' : '#7a6652',
                      lineHeight: '1.7',
                      fontFamily: FONTS.body,
                      marginBottom: '16px',
                    }}>
                      {category.description}
                    </p>
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '8px',
                      justifyContent: isMobile ? 'flex-start' : (isEven ? 'flex-end' : 'flex-start'),
                    }}>
                      {category.tools.map((tool) => (
                        <button
                          key={tool.path}
                          onClick={() => navigate(tool.path)}
                          style={{
                            padding: '6px 14px',
                            fontSize: '12px',
                            fontWeight: '500',
                            fontFamily: FONTS.body,
                            color: isDark ? '#d4c8b8' : '#5a4a3a',
                            backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(63,32,12,0.06)',
                            border: `1px solid ${isDark ? '#2a2420' : '#e0d4c4'}`,
                            borderRadius: '100px',
                            cursor: 'pointer',
                            transition: 'all 0.15s',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(63,32,12,0.12)';
                            e.currentTarget.style.borderColor = accentColor;
                            e.currentTarget.style.color = isDark ? '#fff' : accentColor;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(63,32,12,0.06)';
                            e.currentTarget.style.borderColor = isDark ? '#2a2420' : '#e0d4c4';
                            e.currentTarget.style.color = isDark ? '#d4c8b8' : '#5a4a3a';
                          }}
                        >
                          {tool.title}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Icon Circle */}
                  <div style={{
                    width: isMobile ? '40px' : '72px',
                    height: isMobile ? '40px' : '72px',
                    borderRadius: '50%',
                    backgroundColor: accentBg,
                    border: `2px solid ${accentColor}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    position: isMobile ? 'absolute' : 'relative',
                    left: isMobile ? '0' : 'auto',
                    top: isMobile ? '0' : 'auto',
                    zIndex: 2,
                    boxShadow: `0 0 20px ${accentColor}20`,
                  }}>
                    <IconComp size={isMobile ? 18 : 28} style={{ color: accentColor }} />
                  </div>

                  {/* Empty flex spacer for desktop zigzag */}
                  {!isMobile && <div style={{ flex: 1 }} />}
                </div>
              );
            })}
          </div>
        </section>

        {/* TOOLS SHOWCASE */}
        <section style={{ backgroundColor: isDark ? '#0d0b09' : BRAND.cream, borderTop: '1px solid ' + theme.cardBorder, overflow: 'hidden' }}>

          {/* Desktop: 3D Marquee */}
          {isDesktop && (
            <ThreeDMarquee isDark={isDark} theme={theme} />
          )}

          {/* Mobile: Tool Cards Grid */}
          {!isDesktop && (
            <div style={{ padding: isSmall ? '48px 20px' : '64px 32px', maxWidth: '1100px', margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <h2 style={{ fontSize: isSmall ? '24px' : '28px', fontWeight: '700', color: isDark ? '#fff' : BRAND.brown, margin: '0 0 12px', fontFamily: FONTS.heading }}>
                  Free Tools — No Sign-Up Needed
                </h2>
                <p style={{ fontSize: '15px', color: theme.textMuted, margin: 0, fontFamily: FONTS.body }}>
                  Bonus tools to help with your daily workflow
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: isSmall ? '1fr' : 'repeat(2, 1fr)', gap: '16px' }}>
                {TOOL_CATEGORIES.map((category) => (
                  <div key={category.name} style={{ backgroundColor: isDark ? theme.cardBg : '#fff', borderRadius: '12px', border: '1px solid ' + theme.cardBorder, padding: '16px' }}>
                    <div style={{ fontSize: '10px', fontWeight: '600', color: theme.textMuted, letterSpacing: '0.5px', marginBottom: '10px', textTransform: 'uppercase', fontFamily: FONTS.body }}>
                      {category.name}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      {category.tools.map((tool) => {
                        const IconComponent = tool.icon;
                        return (
                          <button
                            key={tool.path}
                            onClick={() => navigate(tool.path)}
                            style={{ padding: '8px', backgroundColor: 'transparent', border: 'none', borderRadius: '6px', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px' }}
                          >
                            <IconComponent size={16} style={{ color: theme.textMuted }} />
                            <span style={{ fontSize: '13px', fontWeight: '500', color: theme.text, fontFamily: FONTS.body }}>{tool.title}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Productivity CTA */}
        <section id="services" style={{ padding: isSmall ? '48px 20px' : '64px 32px', backgroundColor: isDark ? theme.bg : '#faf8f5' }}>
          <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', backgroundColor: isDark ? BRAND.blue + '20' : BRAND.blue + '10', borderRadius: '100px', marginBottom: '16px' }}>
              <Lock size={12} style={{ color: BRAND.blue }} />
              <span style={{ fontSize: '11px', fontWeight: '600', color: BRAND.blue, fontFamily: FONTS.body }}>LOGIN REQUIRED</span>
            </div>
            <h3 style={{ fontSize: isSmall ? '22px' : '28px', fontWeight: '700', color: isDark ? '#fff' : BRAND.brown, margin: '0 0 12px', fontFamily: FONTS.heading }}>
              Unlock the Productivity Suite
            </h3>
            <p style={{ fontSize: '15px', color: theme.textMuted, margin: '0 0 24px', fontFamily: FONTS.body }}>
              Finance Tracker, VA Kita, Task Manager & Brewed Notes — synced across devices
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
              {PRODUCTIVITY_TOOLS.map((tool) => {
                const IconComponent = tool.icon;
                return (
                  <div key={tool.path} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: isDark ? '#2a2420' : '#faf8f5', borderRadius: '100px' }}>
                    <IconComponent size={16} style={{ color: theme.textMuted }} />
                    <span style={{ fontSize: '13px', fontWeight: '500', color: theme.text, fontFamily: FONTS.body }}>{tool.title}</span>
                  </div>
                );
              })}
            </div>
            <span style={{ fontSize: '13px', color: theme.textMuted, fontFamily: FONTS.body }}>
              Account creation coming soon
            </span>
          </div>
        </section>

        {/* FOOTER */}
      </main>
      <footer style={{ padding: '32px 32px 24px', borderTop: '1px solid ' + theme.cardBorder }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <p style={{ fontSize: '13px', color: theme.textMuted, textAlign: 'center', lineHeight: '1.7', fontFamily: FONTS.body, margin: '0 0 20px' }}>
            BrewedOps is built by Kenneth Villar, a Filipino professional with 11+ years of customer support experience — offering VA services, GHL automation, and custom web development.
            Also home to 26+ free productivity tools and AI-powered utilities for virtual assistants, freelancers, and small businesses.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <a href="/privacy" style={{ fontSize: '13px', color: theme.textMuted, textDecoration: 'none', fontFamily: FONTS.body }}>Privacy Policy</a>
            <a href="/terms" style={{ fontSize: '13px', color: theme.textMuted, textDecoration: 'none', fontFamily: FONTS.body }}>Terms of Service</a>
            <a href="/about" style={{ fontSize: '13px', color: theme.textMuted, textDecoration: 'none', fontFamily: FONTS.body }}>About Us</a>
            <a href="/portfolio" style={{ fontSize: '13px', color: theme.textMuted, textDecoration: 'none', fontFamily: FONTS.body }}>Portfolio</a>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '16px' }}>
            <a href="https://www.facebook.com/brewed.ops/" target="_blank" rel="noopener noreferrer" style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: isDark ? '#1e1a16' : '#faf8f5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.textMuted, textDecoration: 'none', border: '1px solid ' + theme.cardBorder }} title="Facebook">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
            </a>
            <a href="https://x.com/BrewedOps" target="_blank" rel="noopener noreferrer" style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: isDark ? '#1e1a16' : '#faf8f5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.textMuted, textDecoration: 'none', border: '1px solid ' + theme.cardBorder }} title="X (Twitter)">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
            </a>
          </div>
          <p style={{ fontSize: '12px', color: theme.textMuted, margin: 0, fontFamily: FONTS.body, textAlign: 'center' }}>© 2026 BrewedOps. Made by Kenneth V.</p>
        </div>
      </footer>

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

export default HomePage;
