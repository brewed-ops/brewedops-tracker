/**
 * HomePage Component
 * [Logo]BrewedOps | Services | Tools ............. About | Privacy | [☀️] [Login] [Sign Up]
 * 
 * Desktop: 3D Marquee showcase
 * Mobile: Tool cards grid
 */

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronDown, Sun, Moon, Image, Video, FileText, Wrench, Lock, Scissors, Move, Minimize2, RefreshCw, Palette, FileImage, Film, FileEdit, Merge, Split, QrCode, Search, Type, Hash, DollarSign, Headphones, CheckSquare, StickyNote, GitBranch, Braces, Clock } from 'lucide-react';
import { createNoise3D } from "simplex-noise";
import { motion } from "framer-motion";
import { PixelatedCanvas } from '@/components/ui/pixelated-canvas';
import { LayoutTextFlip } from '@/components/ui/layout-text-flip';

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
  
  const particlePropCount = 9;
  const particlePropsLength = particleCount * particlePropCount;
  const baseTTL = 50, rangeTTL = 150, rangeHue = 100, noiseSteps = 3;
  const xOff = 0.00125, yOff = 0.00125, zOff = 0.0005;
  
  const tickRef = useRef(0);
  const noise3DRef = useRef(null);
  const particlePropsRef = useRef(new Float32Array(particlePropsLength));
  const centerRef = useRef([0, 0]);

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
    // For light backgrounds, use much darker/more visible colors
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

  const draw = (canvas, ctx, width, height) => {
    tickRef.current++;
    const offscreen = offscreenRef.current;
    const offCtx = offscreen?.getContext("2d");
    if (!offCtx) return;
    offCtx.clearRect(0, 0, width, height);
    for (let i = 0; i < particlePropsLength; i += particlePropCount) updateParticle(i, offCtx, width, height);
    
    // Fill background
    ctx.fillStyle = backgroundColorRef.current;
    ctx.fillRect(0, 0, width, height);
    
    // Different rendering for light vs dark backgrounds
    if (isLightRef.current) {
      // Light mode: draw particles directly with subtle glow
      ctx.save();
      ctx.filter = "blur(8px)";
      ctx.globalAlpha = 0.6;
      ctx.drawImage(offscreen, 0, 0);
      ctx.restore();
      
      ctx.save();
      ctx.filter = "blur(3px)";
      ctx.globalAlpha = 0.8;
      ctx.drawImage(offscreen, 0, 0);
      ctx.restore();
      
      ctx.save();
      ctx.drawImage(offscreen, 0, 0);
      ctx.restore();
    } else {
      // Dark mode: use lighter for glowing particles
      ctx.save(); ctx.filter = "blur(8px) brightness(200%)"; ctx.globalCompositeOperation = "lighter"; ctx.drawImage(offscreen, 0, 0); ctx.restore();
      ctx.save(); ctx.filter = "blur(4px) brightness(150%)"; ctx.globalCompositeOperation = "lighter"; ctx.drawImage(offscreen, 0, 0); ctx.restore();
      ctx.save(); ctx.globalCompositeOperation = "lighter"; ctx.drawImage(offscreen, 0, 0); ctx.restore();
    }
    
    animationFrameId.current = window.requestAnimationFrame(() => draw(canvas, ctx, width, height));
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
    draw(canvas, ctx, dimensions.width, dimensions.height);
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
  bg: isDark ? '#09090b' : '#ffffff',
  cardBg: isDark ? '#18181b' : '#ffffff',
  cardBorder: isDark ? '#27272a' : '#e4e4e7',
  text: isDark ? '#fafafa' : '#09090b',
  textMuted: isDark ? '#a1a1aa' : '#71717a',
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

// All tools flat for marquee
const ALL_TOOLS = [
  { icon: Image, title: 'BG Remover', color: '#8b5cf6' },
  { icon: Scissors, title: 'Image Cropper', color: '#8b5cf6' },
  { icon: Move, title: 'Image Resizer', color: '#8b5cf6' },
  { icon: Minimize2, title: 'Image Compressor', color: '#8b5cf6' },
  { icon: RefreshCw, title: 'Image Converter', color: '#8b5cf6' },
  { icon: Palette, title: 'Color Picker', color: '#8b5cf6' },
  { icon: FileImage, title: 'Image to PDF', color: '#8b5cf6' },
  { icon: Film, title: 'Video Compressor', color: '#ef4444' },
  { icon: Scissors, title: 'Video Trimmer', color: '#ef4444' },
  { icon: FileEdit, title: 'PDF Editor', color: '#22c55e' },
  { icon: Merge, title: 'PDF Merge', color: '#22c55e' },
  { icon: Split, title: 'PDF Split', color: '#22c55e' },
  { icon: QrCode, title: 'QR Generator', color: '#f59e0b' },
  { icon: Search, title: 'Find & Replace', color: '#f59e0b' },
  { icon: Type, title: 'Case Converter', color: '#f59e0b' },
  { icon: Hash, title: 'Word Counter', color: '#f59e0b' },
  { icon: GitBranch, title: 'Mermaid Reader', color: '#06b6d4' },
  { icon: Braces, title: 'JSON Formatter', color: '#3b82f6' },
  { icon: Clock, title: 'Cron Generator', color: '#22c55e' },
  { icon: DollarSign, title: 'Finance Tracker', color: '#004AAC' },
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
  const row1 = ALL_TOOLS.slice(0, 7);
  const row2 = ALL_TOOLS.slice(7, 14);
  const row3 = ALL_TOOLS.slice(14, 21);

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
          backgroundColor: isDark ? '#18181b' : '#ffffff',
          border: `1px solid ${isDark ? '#27272a' : '#e4e4e7'}`,
          borderRadius: '20px',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          transition: 'all 0.3s ease',
          boxShadow: isDark 
            ? '0 4px 24px rgba(0,0,0,0.4)' 
            : '0 4px 24px rgba(0,0,0,0.1)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-6px) scale(1.03)';
          e.currentTarget.style.borderColor = tool.color;
          e.currentTarget.style.boxShadow = isDark 
            ? `0 8px 32px rgba(0,0,0,0.5), 0 0 20px ${tool.color}30`
            : `0 8px 32px rgba(0,0,0,0.15), 0 0 20px ${tool.color}20`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
          e.currentTarget.style.borderColor = isDark ? '#27272a' : '#e4e4e7';
          e.currentTarget.style.boxShadow = isDark 
            ? '0 4px 24px rgba(0,0,0,0.4)' 
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
          background: `linear-gradient(to right, ${isDark ? '#0a0a0b' : BRAND.cream}, transparent)`,
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
          background: `linear-gradient(to left, ${isDark ? '#0a0a0b' : BRAND.cream}, transparent)`,
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
            border: `1px solid ${isDark ? '#27272a' : '#e4e4e7'}`,
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
    <div style={{ minHeight: '100vh', backgroundColor: isDark ? theme.bg : '#ffffff' }}>
      {/* NAV */}
      <nav style={{ padding: isSmall ? '12px 16px' : '12px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid ' + theme.cardBorder, backgroundColor: isDark ? theme.bg : '#ffffff', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginRight: '20px' }}>
            <img src="https://i.imgur.com/R52jwPv.png" alt="Logo" style={{ width: '32px', height: '32px', borderRadius: '8px' }} />
            <span style={{ fontSize: '18px', fontWeight: '700', fontFamily: FONTS.heading }}>
              <span style={{ color: isDark ? '#fff' : BRAND.brown }}>Brewed</span>
              <span style={{ color: BRAND.blue }}>Ops</span>
            </span>
          </div>
          {isDesktop && (
            <>
              <button style={{ height: '40px', padding: '0 12px', backgroundColor: 'transparent', color: theme.textMuted, border: 'none', fontSize: '14px', fontWeight: '500', fontFamily: FONTS.body, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                Services <ChevronDown size={14} />
              </button>
              <ToolsDropdown isDark={isDark} theme={theme} onToolClick={handleToolClick} onLoginClick={handleLoginClick} />
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
          <button onClick={() => setIsDark(!isDark)} style={{ width: '36px', height: '36px', backgroundColor: 'transparent', border: '1px solid ' + theme.cardBorder, borderRadius: '8px', color: theme.textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '8px' }}>
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button onClick={() => onNavigate('login')} style={{ height: '36px', padding: '0 14px', backgroundColor: 'transparent', color: theme.text, border: '1px solid ' + theme.cardBorder, borderRadius: '8px', fontSize: '13px', fontWeight: '500', fontFamily: FONTS.body, cursor: 'pointer', marginLeft: '4px' }}>
            Login
          </button>
          <button onClick={() => onNavigate('signup')} style={{ height: '36px', padding: '0 14px', backgroundColor: BRAND.blue, color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', fontFamily: FONTS.body, cursor: 'pointer' }}>
            Sign Up
          </button>
        </div>
      </nav>

      {/* HERO with Vortex Background */}
      <div style={{ backgroundColor: isDark ? '#09090b' : '#ffffff' }}>
        <Vortex
          backgroundColor={isDark ? '#09090b' : '#ffffff'}
          particleCount={600}
          baseHue={220}
          rangeY={200}
          baseSpeed={0.0}
          rangeSpeed={1.5}
          baseRadius={1}
          rangeRadius={2}
        >
          <section style={{ padding: isSmall ? '60px 20px 40px' : '80px 64px 100px', maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ 
              display: 'flex', 
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: 'center', 
              justifyContent: 'space-between',
              gap: isMobile ? '48px' : '80px',
            }}>
              {/* Left Side - Hero Text */}
              <div style={{ flex: 1, textAlign: isMobile ? 'center' : 'left', maxWidth: isMobile ? '100%' : '650px' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 20px', backgroundColor: isDark ? 'rgba(0, 74, 172, 0.4)' : BRAND.cream, backdropFilter: 'blur(8px)', borderRadius: '100px', marginBottom: '32px', border: isDark ? '1px solid rgba(96, 165, 250, 0.3)' : '1px solid ' + BRAND.blue + '20' }}>
                  <span style={{ fontSize: '15px', color: isDark ? '#93c5fd' : BRAND.blue, fontWeight: '600', fontFamily: FONTS.body }}>☕ 20 Free Tools for Filipino VAs & Freelancers</span>
                </div>
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ 
                    fontSize: isSmall ? '40px' : '64px', 
                    fontWeight: '800', 
                    color: isDark ? '#ffffff' : BRAND.brown, 
                    lineHeight: '1.1', 
                    letterSpacing: '-0.03em', 
                    fontFamily: FONTS.heading,
                    marginBottom: '16px',
                    textAlign: isMobile ? 'center' : 'left',
                  }}>
                    Your All-in-One
                  </div>
                  <div style={{ display: 'flex', justifyContent: isMobile ? 'center' : 'flex-start' }}>
                    <LayoutTextFlip
                      text=""
                      words={["Productivity Hub", "Automation Suite", "VA Toolkit", "Business Hub"]}
                      duration={3000}
                      wordStyle={{
                        fontSize: isSmall ? '36px' : '56px',
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
                <p style={{ fontSize: isSmall ? '16px' : '20px', color: isDark ? 'rgba(255, 255, 255, 0.7)' : theme.textMuted, margin: '0 0 40px', lineHeight: '1.7', fontFamily: FONTS.body }}>
                  Finance tracking, image editing, document tools, and more — everything a Filipino VA and freelancer needs to manage their business.
                </p>
                <div style={{ display: 'flex', gap: '16px', justifyContent: isMobile ? 'center' : 'flex-start', flexWrap: 'wrap' }}>
                  <button onClick={() => onNavigate('signup')} style={{ ...btnPrimary, height: '56px', padding: '0 32px', fontSize: '16px', boxShadow: '0 4px 20px rgba(0, 74, 172, 0.5)' }}>Start Free <ChevronRight size={20} /></button>
                  <button onClick={() => onNavigate('login')} style={{ ...btnOutline, height: '56px', padding: '0 32px', fontSize: '16px', color: isDark ? '#fff' : theme.text, borderColor: isDark ? 'rgba(255, 255, 255, 0.3)' : theme.cardBorder, backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'transparent', backdropFilter: isDark ? 'blur(8px)' : 'none' }}>Sign In</button>
                </div>
                <p style={{ fontSize: '13px', color: isDark ? 'rgba(255, 255, 255, 0.5)' : theme.textMuted, marginTop: '24px', fontFamily: FONTS.body }}>
                  By signing up, you agree to our <a href="/terms" style={{ color: isDark ? '#60a5fa' : BRAND.blue, textDecoration: 'none', fontWeight: '500' }}>Terms</a> and <a href="/privacy" style={{ color: isDark ? '#60a5fa' : BRAND.blue, textDecoration: 'none', fontWeight: '500' }}>Privacy Policy</a>
                </p>
              </div>

              {/* Right Side - Pixelated Logo */}
              {!isSmall && (
                <div style={{ 
                  flex: '0 0 auto', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                }}>
                  <div style={{
                    borderRadius: '24px',
                    overflow: 'hidden',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 80px rgba(99, 102, 241, 0.15)',
                  }}>
                    <PixelatedCanvas
                      src="https://i.imgur.com/R52jwPv.png"
                      width={400}
                      height={400}
                      cellSize={4}
                      dotScale={0.9}
                      shape="square"
                      backgroundColor="#09090b"
                      interactive={true}
                      distortionStrength={4}
                      distortionRadius={100}
                      distortionMode="swirl"
                      followSpeed={0.15}
                      jitterStrength={3}
                      jitterSpeed={3}
                      fadeOnLeave={true}
                      fadeSpeed={0.08}
                    />
                  </div>
                </div>
              )}
            </div>
          </section>
        </Vortex>
      </div>

      {/* TOOLS SHOWCASE */}
      <section style={{ backgroundColor: isDark ? '#0a0a0b' : BRAND.cream, borderTop: '1px solid ' + theme.cardBorder, overflow: 'hidden' }}>
        
        {/* Desktop: 3D Marquee */}
        {isDesktop && (
          <ThreeDMarquee isDark={isDark} theme={theme} />
        )}

        {/* Mobile: Tool Cards Grid */}
        {!isDesktop && (
          <div style={{ padding: isSmall ? '48px 20px' : '64px 32px', maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <h2 style={{ fontSize: isSmall ? '24px' : '28px', fontWeight: '700', color: isDark ? '#fff' : BRAND.brown, margin: '0 0 12px', fontFamily: FONTS.heading }}>
                Free Tools — No Login Required
              </h2>
              <p style={{ fontSize: '15px', color: theme.textMuted, margin: 0, fontFamily: FONTS.body }}>
                Use these tools instantly
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
      <section style={{ padding: isSmall ? '48px 20px' : '64px 32px', backgroundColor: isDark ? theme.bg : '#fff' }}>
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
                <div key={tool.path} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: isDark ? '#27272a' : '#f4f4f5', borderRadius: '100px' }}>
                  <IconComponent size={16} style={{ color: theme.textMuted }} />
                  <span style={{ fontSize: '13px', fontWeight: '500', color: theme.text, fontFamily: FONTS.body }}>{tool.title}</span>
                </div>
              );
            })}
          </div>
          <button onClick={() => onNavigate('signup')} style={{ ...btnPrimary, height: '44px', padding: '0 24px' }}>
            Sign Up Free <ChevronRight size={18} />
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '24px 32px', borderTop: '1px solid ' + theme.cardBorder, textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginBottom: '12px', flexWrap: 'wrap' }}>
          <a href="/privacy" style={{ fontSize: '13px', color: theme.textMuted, textDecoration: 'none', fontFamily: FONTS.body }}>Privacy Policy</a>
          <a href="/terms" style={{ fontSize: '13px', color: theme.textMuted, textDecoration: 'none', fontFamily: FONTS.body }}>Terms of Service</a>
          <a href="/about" style={{ fontSize: '13px', color: theme.textMuted, textDecoration: 'none', fontFamily: FONTS.body }}>About Us</a>
        </div>
        <p style={{ fontSize: '12px', color: theme.textMuted, margin: 0, fontFamily: FONTS.body }}>© 2025 BrewedOps. Made with ☕ for Filipino VAs & Freelancers.</p>
      </footer>
    </div>
  );
};

export default HomePage;
