/**
 * HomePage Component
 * [Logo]BrewedOps | Services | Tools ............. About | Privacy | [☀️] [Login] [Sign Up]
 * 
 * Desktop: 3D Marquee showcase
 * Mobile: Tool cards grid
 */

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CaretRight, CaretDown, Sun, Moon, Image, FileText, Wrench, Lock, Scissors, ArrowsOut, ArrowsIn, ArrowsClockwise, Palette, FileImage, FilmStrip, NotePencil, GitMerge, FileDashed, QrCode, MagnifyingGlass, TextT, Hash, CurrencyDollar, Headphones, CheckSquare, Note, GitBranch, BracketsCurly, Clock, BookOpen, List, Lightning, ClipboardText, Code, Globe, Timer, Heart, LightbulbFilament, ChartLineUp, ShieldCheck } from '@phosphor-icons/react';
import SEO from './SEO';
const MobileDrawer = React.lazy(() => import('./layout/MobileDrawer'));
import { createNoise3D } from "simplex-noise";
import { motion } from "framer-motion";
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
    let x = particleProps[i], y = particleProps[i+1];
    const n = noise3DRef.current(x * xOff, y * yOff, tickRef.current * zOff) * noiseSteps * TAU;
    const vx = lerp(particleProps[i+2], Math.cos(n), 0.5);
    const vy = lerp(particleProps[i+3], Math.sin(n), 0.5);
    let life = particleProps[i+4];
    const ttl = particleProps[i+5], speed = particleProps[i+6];
    const x2 = x + vx * speed, y2 = y + vy * speed;
    drawParticle(x, y, x2, y2, life, ttl, particleProps[i+7], particleProps[i+8], ctx);
    life++;
    particleProps[i] = x2; particleProps[i+1] = y2; particleProps[i+2] = vx; particleProps[i+3] = vy; particleProps[i+4] = life;
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
        title="BrewedOps - VA Services, GHL Automation & Free Tools"
        description="Expert customer support, admin VA, GoHighLevel CRM automation, and web development services — backed by 11+ years of customer support experience. Plus 22+ free productivity tools."
        keywords="BrewedOps, virtual assistant services, GHL automation, GoHighLevel, customer support, admin VA, web development, free online tools"
      />
      {/* NAV */}
      <nav style={{ padding: isSmall ? '12px 16px' : '12px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid ' + theme.cardBorder, backgroundColor: isDark ? theme.bg : '#faf8f5', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginRight: '20px' }}>
            <img src="https://i.imgur.com/R52jwPvt.png" alt="Logo" width={32} height={32} style={{ width: '32px', height: '32px', borderRadius: '8px' }} />
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
              <button onClick={() => navigate('/services')} style={{ height: '40px', padding: '0 12px', backgroundColor: 'transparent', color: theme.textMuted, border: 'none', fontSize: '14px', fontWeight: '500', fontFamily: FONTS.body, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                Services
              </button>
              <ToolsDropdown isDark={isDark} theme={theme} onToolClick={handleToolClick} onLoginClick={handleLoginClick} />
              <button onClick={() => navigate('/fuelyx')} style={{ height: '40px', padding: '0 12px', backgroundColor: 'transparent', color: '#14b8a6', border: 'none', fontSize: '14px', fontWeight: '600', fontFamily: FONTS.body, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                Fuelyx
              </button>
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
              <button onClick={() => onNavigate('login')} style={{ height: '36px', padding: '0 14px', backgroundColor: 'transparent', color: theme.text, border: '1px solid ' + theme.cardBorder, borderRadius: '8px', fontSize: '13px', fontWeight: '500', fontFamily: FONTS.body, cursor: 'pointer', marginLeft: '4px' }}>
                Login
              </button>
              <button onClick={() => onNavigate('signup')} style={{ height: '36px', padding: '0 14px', backgroundColor: BRAND.blue, color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', fontFamily: FONTS.body, cursor: 'pointer' }}>
                Sign Up
              </button>
            </>
          ) : (
            <button onClick={() => setMobileMenuOpen(true)} aria-label="Open navigation menu" style={{ width: '36px', height: '36px', backgroundColor: 'transparent', border: '1px solid ' + theme.cardBorder, borderRadius: '8px', color: theme.textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '4px' }}>
              <List size={18} />
            </button>
          )}
        </div>
      </nav>

      {/* HERO with Vortex Background */}
      <div id="main-content" style={{ backgroundColor: isDark ? '#0d0b09' : BRAND.cream }}>
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
          <section style={{ padding: isSmall ? '60px 20px 0px' : '80px 64px 0px', maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <div style={{ textAlign: 'center', maxWidth: '800px' }}>
                {/* Service indicator chips */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: isSmall ? '8px' : '10px', marginBottom: '32px', flexWrap: 'wrap' }}>
                  {[
                    { icon: Headphones, label: 'Customer Support', color: BRAND.blue },
                    { icon: ClipboardText, label: 'Admin VA', color: BRAND.green },
                    { icon: Lightning, label: 'GHL Automation', color: '#f59e0b' },
                    { icon: Code, label: 'Web Development', color: '#8b5cf6' },
                  ].map((chip, i) => {
                    const ChipIcon = chip.icon;
                    return (
                      <motion.div
                        key={chip.label}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.15 * i, ease: 'easeOut' }}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: isSmall ? '7px 12px' : '8px 16px',
                          backgroundColor: isDark ? `${chip.color}18` : `${chip.color}10`,
                          backdropFilter: 'blur(8px)',
                          borderRadius: '100px',
                          border: `1px solid ${isDark ? `${chip.color}35` : `${chip.color}25`}`,
                        }}
                      >
                        <ChipIcon size={isSmall ? 13 : 14} style={{ color: chip.color, flexShrink: 0 }} />
                        <span style={{ fontSize: isSmall ? '11px' : '13px', color: isDark ? `${chip.color}cc` : chip.color, fontWeight: '600', fontFamily: FONTS.body, whiteSpace: 'nowrap' }}>{chip.label}</span>
                      </motion.div>
                    );
                  })}
                </div>
                <div style={{ marginBottom: '24px' }}>
                  <h1 style={{
                    fontSize: isSmall ? '36px' : '60px',
                    fontWeight: '800',
                    color: isDark ? '#ffffff' : BRAND.brown,
                    lineHeight: '1.15',
                    letterSpacing: '-0.03em',
                    fontFamily: FONTS.heading,
                    marginBottom: '16px',
                    textAlign: 'center',
                    margin: '0 0 16px',
                  }}>
                    Your Dedicated VA for
                  </h1>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <LayoutTextFlip
                      text=""
                      words={["Your Business", "Growing Brands", "Digital Agencies", "Remote Teams"]}
                      duration={3000}
                      wordStyle={{
                        fontSize: isSmall ? '32px' : '52px',
                        fontWeight: '800',
                        fontFamily: FONTS.heading,
                        color: isDark ? '#60a5fa' : BRAND.blue,
                        backgroundColor: isDark ? 'rgba(96, 165, 250, 0.15)' : 'rgba(0, 74, 172, 0.1)',
                        border: isDark ? '1px solid rgba(96, 165, 250, 0.3)' : '1px solid rgba(0, 74, 172, 0.2)',
                        padding: '8px 24px',
                        borderRadius: '16px',
                      }}
                    />
                  </div>
                </div>
                <p style={{ fontSize: isSmall ? '15px' : '18px', color: isDark ? 'rgba(255, 255, 255, 0.7)' : theme.textMuted, margin: '0 auto 40px', lineHeight: '1.7', fontFamily: FONTS.body, maxWidth: '620px' }}>
                  11+ years of customer support experience, dedicated to helping businesses streamline operations, automate workflows, and grow. Plus 22+ free tools to boost your productivity.
                </p>
                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button onClick={() => navigate('/services')} style={{ ...btnPrimary, height: '56px', padding: '0 32px', fontSize: '16px', boxShadow: '0 4px 20px rgba(0, 74, 172, 0.5)' }}>View Services <CaretRight size={20} /></button>
                  <button onClick={() => onNavigate('login')} style={{ ...btnOutline, height: '56px', padding: '0 32px', fontSize: '16px', color: isDark ? '#fff' : theme.text, borderColor: isDark ? 'rgba(255, 255, 255, 0.3)' : theme.cardBorder, backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'transparent', backdropFilter: isDark ? 'blur(8px)' : 'none' }}>Sign In</button>
                </div>
                <p style={{ fontSize: '13px', color: isDark ? 'rgba(255, 255, 255, 0.5)' : theme.textMuted, marginTop: '24px', fontFamily: FONTS.body }}>
                  Or explore our <a href="#free-tools" onClick={(e) => { e.preventDefault(); document.getElementById('free-tools')?.scrollIntoView({ behavior: 'smooth' }); }} style={{ color: isDark ? '#60a5fa' : BRAND.blue, textDecoration: 'none', fontWeight: '500' }}>22+ free productivity tools</a> — no sign-up needed.
                </p>
              </div>

            </div>
          </section>
        </Vortex>
      </div>

      {/* ABOUT SECTION */}
      <section style={{
        padding: isMobile ? '60px 20px' : '100px 64px',
        backgroundColor: '#080604',
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
              color: '#ffffff',
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
              color: 'rgba(255,255,255,0.85)',
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
                backgroundColor: '#0e0c09',
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.07)',
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
                  backgroundImage: 'linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)',
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
                    color: '#ffffff',
                    fontFamily: FONTS.heading,
                    margin: '0 0 8px',
                  }}>
                    {value.title}
                  </h3>
                  <p style={{
                    fontSize: isSmall ? '12px' : '14px',
                    color: 'rgba(255,255,255,0.55)',
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

      {/* SERVICES OVERVIEW */}
      <section style={{
        padding: isMobile ? '60px 20px' : '80px 64px',
        backgroundColor: isDark ? '#0d0b09' : '#faf8f5',
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

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '20px' }}>
            {[
              {
                icon: Headphones,
                title: 'Customer Support',
                color: BRAND.blue,
                description: 'Professional customer service — email, phone, live chat, and ticket management.',
                features: ['Tier 1 & Tier 2 Support', 'SLA Management', 'CRM-Based Ticketing', 'Quality Monitoring'],
              },
              {
                icon: ClipboardText,
                title: 'Admin VA',
                color: BRAND.green,
                description: 'Day-to-day operations handled so you can focus on growing your business.',
                features: ['Inbox & Calendar Management', 'Data Entry & Reports', 'Travel & Scheduling', 'Process Documentation'],
              },
              {
                icon: Lightning,
                title: 'GHL Automation',
                color: '#f59e0b',
                description: 'GoHighLevel CRM setup, workflow automation, and pipeline management.',
                features: ['Full CRM Build & Config', 'Automated Follow-ups', 'Pipeline & Lead Scoring', 'SMS & Email Sequences'],
              },
              {
                icon: Code,
                title: 'Web Development',
                color: '#8b5cf6',
                description: 'Web apps, dashboards, and tools — vibe coded with AI-assisted modern tech stacks.',
                features: ['React & Vite Apps', 'AI-Assisted Development', 'Custom Dashboards', 'Responsive Design'],
              },
            ].map((service) => {
              const ServiceIcon = service.icon;
              return (
                <div
                  key={service.title}
                  style={{
                    padding: isMobile ? '24px' : '32px',
                    backgroundColor: isDark ? '#171411' : '#ffffff',
                    border: '1px solid ' + (isDark ? '#2a2420' : '#e8e0d4'),
                    borderRadius: '16px',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = service.color; e.currentTarget.style.boxShadow = `0 0 24px ${service.color}15`; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = isDark ? '#2a2420' : '#e8e0d4'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: service.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ServiceIcon size={22} style={{ color: service.color }} />
                    </div>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: isDark ? '#f5f0eb' : BRAND.brown, fontFamily: FONTS.heading, margin: 0 }}>
                      {service.title}
                    </h3>
                  </div>
                  <p style={{ fontSize: '14px', color: isDark ? '#a09585' : '#7a6652', lineHeight: '1.7', fontFamily: FONTS.body, margin: '0 0 16px' }}>
                    {service.description}
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {service.features.map((feature) => (
                      <div key={feature} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: service.color, flexShrink: 0 }} />
                        <span style={{ fontSize: '13px', color: isDark ? '#d4c8b8' : '#5a4a3a', fontFamily: FONTS.body }}>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <button onClick={() => navigate('/services')} style={{ ...btnOutline, height: '44px', padding: '0 24px', fontSize: '14px', color: isDark ? '#fff' : BRAND.brown, borderColor: isDark ? 'rgba(255,255,255,0.2)' : theme.cardBorder }}>
              View All Services <CaretRight size={16} />
            </button>
          </div>
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
                A productivity hub with 22+ free tools for Filipino VAs and freelancers — image editing, PDF tools, finance tracking, task management, and more. All browser-based, no installs needed.
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
            22+ Free Productivity Tools
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
          <button onClick={() => onNavigate('signup')} style={{ ...btnPrimary, height: '44px', padding: '0 24px' }}>
            Sign Up Free <CaretRight size={18} />
          </button>
        </div>
      </section>

      {/* FOOTER */}
      </main>
      <footer style={{ padding: '32px 32px 24px', borderTop: '1px solid ' + theme.cardBorder }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <p style={{ fontSize: '13px', color: theme.textMuted, textAlign: 'center', lineHeight: '1.7', fontFamily: FONTS.body, margin: '0 0 20px' }}>
            BrewedOps is built by Kenneth Villar, a Filipino professional with 11+ years of customer support experience — offering VA services, GHL automation, and custom web development.
            Also home to 22+ free productivity tools for virtual assistants, freelancers, and small businesses.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <a href="/privacy" style={{ fontSize: '13px', color: theme.textMuted, textDecoration: 'none', fontFamily: FONTS.body }}>Privacy Policy</a>
            <a href="/terms" style={{ fontSize: '13px', color: theme.textMuted, textDecoration: 'none', fontFamily: FONTS.body }}>Terms of Service</a>
            <a href="/about" style={{ fontSize: '13px', color: theme.textMuted, textDecoration: 'none', fontFamily: FONTS.body }}>About Us</a>
            <a href="/portfolio" style={{ fontSize: '13px', color: theme.textMuted, textDecoration: 'none', fontFamily: FONTS.body }}>Portfolio</a>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '16px' }}>
            <a href="https://www.facebook.com/brewed.ops/" target="_blank" rel="noopener noreferrer" style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: isDark ? '#1e1a16' : '#faf8f5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.textMuted, textDecoration: 'none', border: '1px solid ' + theme.cardBorder }} title="Facebook">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="https://x.com/BrewedOps" target="_blank" rel="noopener noreferrer" style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: isDark ? '#1e1a16' : '#faf8f5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.textMuted, textDecoration: 'none', border: '1px solid ' + theme.cardBorder }} title="X (Twitter)">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
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
