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

// ============================================
// VORTEX COMPONENT (Embedded to avoid import issues)
// ============================================
const Vortex = ({ children, className, containerClassName, particleCount = 700, rangeY = 100, baseHue = 220, baseSpeed = 0.0, rangeSpeed = 1.5, baseRadius = 1, rangeRadius = 2, backgroundColor = "#000000" }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const offscreenRef = useRef(null);
  const animationFrameId = useRef();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
  const particlePropCount = 9;
  const particlePropsLength = particleCount * particlePropCount;
  const baseTTL = 50;
  const rangeTTL = 150;
  const rangeHue = 100;
  const noiseSteps = 3;
  const xOff = 0.00125;
  const yOff = 0.00125;
  const zOff = 0.0005;
  
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
    ctx.strokeStyle = `hsla(${hue},100%,60%,${fadeInOut(life, ttl)})`;
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
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);
    ctx.save(); ctx.filter = "blur(8px) brightness(200%)"; ctx.globalCompositeOperation = "lighter"; ctx.drawImage(offscreen, 0, 0); ctx.restore();
    ctx.save(); ctx.filter = "blur(4px) brightness(150%)"; ctx.globalCompositeOperation = "lighter"; ctx.drawImage(offscreen, 0, 0); ctx.restore();
    ctx.save(); ctx.globalCompositeOperation = "lighter"; ctx.drawImage(offscreen, 0, 0); ctx.restore();
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
  { icon: DollarSign, title: 'Finance Tracker', color: '#10b981' },
];

// ============================================
// 3D MARQUEE COMPONENT
// ============================================
const ThreeDMarquee = ({ isDark, theme }) => {
  const row1 = ALL_TOOLS.slice(0, 7);
  const row2 = ALL_TOOLS.slice(7, 14);
  const row3 = ALL_TOOLS.slice(14, 21);

  const MarqueeRow = ({ tools, direction = 'left', speed = 30 }) => {
    const doubled = [...tools, ...tools, ...tools, ...tools];
    return (
      <div style={{ display: 'flex', overflow: 'hidden', width: '100%' }}>
        <div style={{ display: 'flex', gap: '16px', animation: `marquee-${direction} ${speed}s linear infinite` }}>
          {doubled.map((tool, idx) => {
            const IconComponent = tool.icon;
            return (
              <div key={idx} style={{ flexShrink: 0, width: '140px', height: '90px', backgroundColor: isDark ? '#18181b' : '#fff', borderRadius: '12px', border: '1px solid ' + theme.cardBorder, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: tool.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <IconComponent size={18} style={{ color: tool.color }} />
                </div>
                <span style={{ fontSize: '11px', fontWeight: '500', color: theme.text, fontFamily: FONTS.body, textAlign: 'center', padding: '0 8px' }}>{tool.title}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div style={{ padding: '60px 0', perspective: '1000px' }}>
      <style>{`
        @keyframes marquee-left { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes marquee-right { from { transform: translateX(-50%); } to { transform: translateX(0); } }
      `}</style>
      <div style={{ transform: 'rotateX(25deg)', transformStyle: 'preserve-3d' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <MarqueeRow tools={row1} direction="left" speed={40} />
          <MarqueeRow tools={row2} direction="right" speed={35} />
          <MarqueeRow tools={row3} direction="left" speed={45} />
        </div>
      </div>
      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <p style={{ fontSize: '14px', color: theme.textMuted, fontFamily: FONTS.body }}>
          ☕ 20 Free Tools — No Login Required
        </p>
      </div>
    </div>
  );
};

// ============================================
// MAIN HOMEPAGE COMPONENT
// ============================================
const HomePage = ({ onNavigate }) => {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('brewedops-theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });
  const [isSmall, setIsSmall] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const toolsRef = useRef(null);
  const servicesRef = useRef(null);

  useEffect(() => {
    const checkSize = () => {
      setIsSmall(window.innerWidth < 640);
      setIsDesktop(window.innerWidth >= 1024);
    };
    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  useEffect(() => {
    localStorage.setItem('brewedops-theme', isDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (toolsRef.current && !toolsRef.current.contains(e.target)) setToolsOpen(false);
      if (servicesRef.current && !servicesRef.current.contains(e.target)) setServicesOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const theme = getTheme(isDark);

  const btnPrimary = {
    display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 28px',
    backgroundColor: BRAND.blue, color: '#fff', border: 'none', borderRadius: '12px',
    fontSize: '15px', fontWeight: '600', cursor: 'pointer', fontFamily: FONTS.body,
    transition: 'all 0.2s ease',
  };

  const btnOutline = {
    display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 28px',
    backgroundColor: 'transparent', color: theme.text, border: '1px solid ' + theme.cardBorder,
    borderRadius: '12px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', fontFamily: FONTS.body,
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: theme.bg, color: theme.text, fontFamily: FONTS.body }}>
      {/* NAV */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, backgroundColor: theme.bg + 'ee', backdropFilter: 'blur(12px)', borderBottom: '1px solid ' + theme.cardBorder }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <div onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: BRAND.brown, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '18px' }}>☕</span>
              </div>
              <span style={{ fontSize: '18px', fontWeight: '700', color: theme.text, fontFamily: FONTS.heading }}>
                Brewed<span style={{ color: BRAND.blue }}>Ops</span>
              </span>
            </div>

            {/* Desktop Nav */}
            {!isSmall && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {/* Services Dropdown */}
                <div ref={servicesRef} style={{ position: 'relative' }}>
                  <button onClick={() => { setServicesOpen(!servicesOpen); setToolsOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '8px 12px', backgroundColor: 'transparent', border: 'none', color: theme.textMuted, fontSize: '14px', fontWeight: '500', cursor: 'pointer', borderRadius: '8px', fontFamily: FONTS.body }}>
                    Services <ChevronDown size={14} style={{ transform: servicesOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                  </button>
                  {servicesOpen && (
                    <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: '8px', backgroundColor: theme.cardBg, border: '1px solid ' + theme.cardBorder, borderRadius: '12px', padding: '8px', minWidth: '200px', boxShadow: '0 10px 40px rgba(0,0,0,0.15)' }}>
                      {PRODUCTIVITY_TOOLS.map((tool) => {
                        const IconComponent = tool.icon;
                        return (
                          <button key={tool.path} onClick={() => { navigate(tool.path); setServicesOpen(false); }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', backgroundColor: 'transparent', border: 'none', borderRadius: '8px', cursor: 'pointer', textAlign: 'left' }}>
                            <IconComponent size={18} style={{ color: BRAND.blue }} />
                            <span style={{ fontSize: '14px', fontWeight: '500', color: theme.text, fontFamily: FONTS.body }}>{tool.title}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Tools Dropdown */}
                <div ref={toolsRef} style={{ position: 'relative' }}>
                  <button onClick={() => { setToolsOpen(!toolsOpen); setServicesOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '8px 12px', backgroundColor: 'transparent', border: 'none', color: theme.textMuted, fontSize: '14px', fontWeight: '500', cursor: 'pointer', borderRadius: '8px', fontFamily: FONTS.body }}>
                    Tools <ChevronDown size={14} style={{ transform: toolsOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                  </button>
                  {toolsOpen && (
                    <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: '8px', backgroundColor: theme.cardBg, border: '1px solid ' + theme.cardBorder, borderRadius: '12px', padding: '16px', minWidth: '500px', boxShadow: '0 10px 40px rgba(0,0,0,0.15)', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                      {TOOL_CATEGORIES.map((category) => (
                        <div key={category.name}>
                          <div style={{ fontSize: '10px', fontWeight: '600', color: theme.textMuted, letterSpacing: '0.5px', marginBottom: '8px', textTransform: 'uppercase', fontFamily: FONTS.body }}>{category.name}</div>
                          {category.tools.map((tool) => {
                            const IconComponent = tool.icon;
                            return (
                              <button key={tool.path} onClick={() => { navigate(tool.path); setToolsOpen(false); }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '8px', backgroundColor: 'transparent', border: 'none', borderRadius: '6px', cursor: 'pointer', textAlign: 'left' }}>
                                <IconComponent size={16} style={{ color: theme.textMuted }} />
                                <span style={{ fontSize: '13px', fontWeight: '500', color: theme.text, fontFamily: FONTS.body }}>{tool.title}</span>
                              </button>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {!isSmall && (
              <>
                <button onClick={() => navigate('/about')} style={{ padding: '8px 12px', backgroundColor: 'transparent', border: 'none', color: theme.textMuted, fontSize: '14px', fontWeight: '500', cursor: 'pointer', fontFamily: FONTS.body }}>About</button>
                <button onClick={() => navigate('/privacy')} style={{ padding: '8px 12px', backgroundColor: 'transparent', border: 'none', color: theme.textMuted, fontSize: '14px', fontWeight: '500', cursor: 'pointer', fontFamily: FONTS.body }}>Privacy</button>
              </>
            )}
            <button onClick={() => setIsDark(!isDark)} style={{ width: '36px', height: '36px', backgroundColor: theme.cardBg, border: '1px solid ' + theme.cardBorder, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: theme.textMuted }}>
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button onClick={() => onNavigate('login')} style={{ padding: '8px 16px', backgroundColor: 'transparent', border: '1px solid ' + theme.cardBorder, borderRadius: '8px', color: theme.text, fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: FONTS.body }}>
              Login
            </button>
            <button onClick={() => onNavigate('signup')} style={{ height: '36px', padding: '0 14px', backgroundColor: BRAND.blue, color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', fontFamily: FONTS.body, cursor: 'pointer' }}>
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      {/* HERO with Vortex Background - Always Dark */}
      <div style={{ backgroundColor: '#09090b' }}>
        <Vortex
          backgroundColor="#09090b"
          particleCount={600}
          baseHue={220}
          rangeY={200}
          baseSpeed={0.0}
          rangeSpeed={1.5}
          baseRadius={1}
          rangeRadius={2}
          containerClassName="min-h-[500px]"
        >
          <section style={{ padding: isSmall ? '80px 20px 60px' : '100px 32px 80px', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', backgroundColor: 'rgba(0, 74, 172, 0.4)', backdropFilter: 'blur(8px)', borderRadius: '100px', marginBottom: '24px', border: '1px solid rgba(96, 165, 250, 0.3)' }}>
              <span style={{ fontSize: '13px', color: '#93c5fd', fontWeight: '600', fontFamily: FONTS.body }}>☕ 20 Free Tools for Filipino VAs & Freelancers</span>
            </div>
            <h1 style={{ fontSize: isSmall ? '36px' : '56px', fontWeight: '800', color: '#ffffff', margin: '0 0 16px', lineHeight: '1.1', letterSpacing: '-0.03em', fontFamily: FONTS.heading }}>
              Your All-in-One<br /><span style={{ color: '#60a5fa' }}>Productivity Hub</span>
            </h1>
            <p style={{ fontSize: isSmall ? '16px' : '18px', color: 'rgba(255, 255, 255, 0.7)', margin: '0 0 36px', lineHeight: '1.7', maxWidth: '650px', marginLeft: 'auto', marginRight: 'auto', fontFamily: FONTS.body }}>
              Finance tracking, image editing, document tools, and more — everything a Filipino VA and freelancer needs to manage their business.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => onNavigate('signup')} style={{ ...btnPrimary, backgroundColor: BRAND.blue, boxShadow: '0 4px 20px rgba(0, 74, 172, 0.5)' }}>Start Free <ChevronRight size={18} /></button>
              <button onClick={() => onNavigate('login')} style={{ ...btnOutline, color: '#fff', borderColor: 'rgba(255, 255, 255, 0.3)', backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(8px)' }}>Sign In</button>
            </div>
            <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.5)', marginTop: '24px', fontFamily: FONTS.body }}>
              By signing up, you agree to our <a href="/terms" style={{ color: '#60a5fa', textDecoration: 'none', fontWeight: '500' }}>Terms</a> and <a href="/privacy" style={{ color: '#60a5fa', textDecoration: 'none', fontWeight: '500' }}>Privacy Policy</a>
            </p>
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
            <span style={{ fontSize: '12px', color: BRAND.blue, fontWeight: '600', fontFamily: FONTS.body }}>Login Required</span>
          </div>
          <h2 style={{ fontSize: isSmall ? '24px' : '32px', fontWeight: '700', color: isDark ? '#fff' : BRAND.brown, margin: '0 0 12px', fontFamily: FONTS.heading }}>
            Unlock Productivity Tools
          </h2>
          <p style={{ fontSize: '15px', color: theme.textMuted, margin: '0 0 32px', lineHeight: '1.7', fontFamily: FONTS.body }}>
            Create a free account to access Finance Tracker, VA Kita, Task Manager, and Brewed Notes.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: isSmall ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: '12px', marginBottom: '32px' }}>
            {PRODUCTIVITY_TOOLS.map((tool) => {
              const IconComponent = tool.icon;
              return (
                <div key={tool.path} style={{ padding: '20px 16px', backgroundColor: theme.cardBg, borderRadius: '12px', border: '1px solid ' + theme.cardBorder, textAlign: 'center' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: BRAND.blue + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                    <IconComponent size={20} style={{ color: BRAND.blue }} />
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: theme.text, fontFamily: FONTS.body }}>{tool.title}</span>
                </div>
              );
            })}
          </div>
          <button onClick={() => onNavigate('signup')} style={btnPrimary}>
            Create Free Account <ChevronRight size={18} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid ' + theme.cardBorder, padding: '32px 24px', backgroundColor: theme.bg }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: isSmall ? 'column' : 'row', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '18px' }}>☕</span>
            <span style={{ fontSize: '14px', fontWeight: '600', color: theme.text, fontFamily: FONTS.heading }}>BrewedOps</span>
          </div>
          <p style={{ fontSize: '13px', color: theme.textMuted, margin: 0, fontFamily: FONTS.body }}>
            © 2025 BrewedOps. Made with ❤️ for Filipino VAs
          </p>
          <div style={{ display: 'flex', gap: '16px' }}>
            <a href="/privacy" style={{ fontSize: '13px', color: theme.textMuted, textDecoration: 'none', fontFamily: FONTS.body }}>Privacy</a>
            <a href="/terms" style={{ fontSize: '13px', color: theme.textMuted, textDecoration: 'none', fontFamily: FONTS.body }}>Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
