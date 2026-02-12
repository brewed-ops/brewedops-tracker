import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CaretDown, Lock, Lightning, FileMagnifyingGlass, Image, Scissors, ArrowsOut, ArrowsIn, ArrowsClockwise, Palette, FileImage, FilmStrip, NotePencil, GitMerge, FileDashed, BookOpen, QrCode, MagnifyingGlass, TextT, Hash, GitBranch, BracketsCurly, Clock, Globe, Timer, PenNib, ChatCircle } from '@phosphor-icons/react';

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

const AI_TOOLS = [
  { icon: Lightning, title: 'GHL Scenario Generator', path: '/ghl-scenario' },
  { icon: FileMagnifyingGlass, title: 'AI Text Extractor', path: '/text-extractor' },
  { icon: PenNib, title: 'AI Proposal Writer', path: '/proposal-writer' },
  { icon: ChatCircle, title: 'AI GHL Advisor', path: '/ghl-advisor' },
];

const MobileDrawer = ({ isOpen, onClose, isDark, navigate, onNavigate }) => {
  const [toolsExpanded, setToolsExpanded] = useState(false);
  const [aiToolsExpanded, setAiToolsExpanded] = useState(false);
  const [appsExpanded, setAppsExpanded] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const theme = {
    bg: isDark ? '#0d0b09' : '#faf8f5',
    cardBg: isDark ? '#171411' : '#ffffff',
    cardBorder: isDark ? '#2a2420' : '#e8e0d4',
    text: isDark ? '#f5f0eb' : '#3F200C',
    textMuted: isDark ? '#a09585' : '#7a6652',
  };

  const handleNav = (path) => {
    onClose();
    navigate(path);
  };

  const handleAction = (action) => {
    onClose();
    if (onNavigate) onNavigate(action);
  };

  const navItemStyle = {
    width: '100%',
    padding: '14px 24px',
    backgroundColor: 'transparent',
    border: 'none',
    color: theme.text,
    fontSize: '15px',
    fontWeight: '500',
    fontFamily: FONTS.body,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    textAlign: 'left',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 200,
            }}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: '300px',
              maxWidth: '85vw',
              backgroundColor: theme.cardBg,
              borderLeft: `1px solid ${theme.cardBorder}`,
              zIndex: 201,
              display: 'flex',
              flexDirection: 'column',
              overflowY: 'auto',
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: `1px solid ${theme.cardBorder}`,
              }}
            >
              <span
                style={{
                  fontSize: '16px',
                  fontWeight: '700',
                  fontFamily: FONTS.heading,
                }}
              >
                <span style={{ color: isDark ? '#fff' : BRAND.brown }}>Brewed</span>
                <span style={{ color: BRAND.blue }}>Ops</span>
              </span>
              <button
                onClick={onClose}
                aria-label="Close navigation menu"
                style={{
                  width: '36px',
                  height: '36px',
                  backgroundColor: 'transparent',
                  border: `1px solid ${theme.cardBorder}`,
                  borderRadius: '8px',
                  color: theme.textMuted,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Nav Items */}
            <div style={{ flex: 1, paddingTop: '8px' }}>
              <button onClick={() => handleNav('/')} style={navItemStyle}>
                Home
              </button>

              <button onClick={() => handleNav('/portfolio')} style={navItemStyle}>
                Portfolio
              </button>

              <button onClick={() => handleNav('/services')} style={navItemStyle}>
                Services
              </button>

              {/* Tools (expandable) */}
              <button
                onClick={() => setToolsExpanded(!toolsExpanded)}
                style={navItemStyle}
              >
                <span>Tools</span>
                <CaretDown
                  size={16}
                  style={{
                    transform: toolsExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s',
                    color: theme.textMuted,
                  }}
                />
              </button>

              {toolsExpanded && (
                <div style={{ paddingLeft: '16px', paddingBottom: '8px' }}>
                  {TOOL_CATEGORIES.map((category) => (
                    <div key={category.name} style={{ marginBottom: '12px' }}>
                      <div
                        style={{
                          fontSize: '10px',
                          fontWeight: '600',
                          color: theme.textMuted,
                          letterSpacing: '0.5px',
                          textTransform: 'uppercase',
                          fontFamily: FONTS.body,
                          padding: '4px 24px',
                        }}
                      >
                        {category.name}
                      </div>
                      {category.tools.map((tool) => {
                        const IconComponent = tool.icon;
                        return (
                          <button
                            key={tool.path}
                            onClick={() => handleNav(tool.path)}
                            style={{
                              width: '100%',
                              padding: '8px 24px',
                              backgroundColor: 'transparent',
                              border: 'none',
                              color: theme.text,
                              fontSize: '13px',
                              fontWeight: '500',
                              fontFamily: FONTS.body,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              textAlign: 'left',
                            }}
                          >
                            <IconComponent size={14} style={{ color: theme.textMuted }} />
                            {tool.title}
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              )}

              {/* AI Tools (expandable) */}
              <button
                onClick={() => setAiToolsExpanded(!aiToolsExpanded)}
                style={navItemStyle}
              >
                <span>AI Tools</span>
                <CaretDown
                  size={16}
                  style={{
                    transform: aiToolsExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s',
                    color: theme.textMuted,
                  }}
                />
              </button>

              {aiToolsExpanded && (
                <div style={{ paddingLeft: '16px', paddingBottom: '8px' }}>
                  <div style={{ marginBottom: '12px' }}>
                    <div
                      style={{
                        fontSize: '10px',
                        fontWeight: '600',
                        color: theme.textMuted,
                        letterSpacing: '0.5px',
                        textTransform: 'uppercase',
                        fontFamily: FONTS.body,
                        padding: '4px 24px',
                      }}
                    >
                      AI-Powered
                    </div>
                    {AI_TOOLS.map((tool) => {
                      const IconComponent = tool.icon;
                      return (
                        <button
                          key={tool.path}
                          onClick={() => handleNav(tool.path)}
                          style={{
                            width: '100%',
                            padding: '8px 24px',
                            backgroundColor: 'transparent',
                            border: 'none',
                            color: theme.text,
                            fontSize: '13px',
                            fontWeight: '500',
                            fontFamily: FONTS.body,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            textAlign: 'left',
                          }}
                        >
                          <IconComponent size={14} style={{ color: theme.textMuted }} />
                          {tool.title}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Apps (expandable) */}
              <button
                onClick={() => setAppsExpanded(!appsExpanded)}
                style={navItemStyle}
              >
                <span>Apps</span>
                <CaretDown
                  size={16}
                  style={{
                    transform: appsExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s',
                    color: theme.textMuted,
                  }}
                />
              </button>

              {appsExpanded && (
                <div style={{ paddingLeft: '16px', paddingBottom: '8px' }}>
                  <div style={{ marginBottom: '12px' }}>
                    <div
                      style={{
                        fontSize: '10px',
                        fontWeight: '600',
                        color: theme.textMuted,
                        letterSpacing: '0.5px',
                        textTransform: 'uppercase',
                        fontFamily: FONTS.body,
                        padding: '4px 24px',
                      }}
                    >
                      Mobile Apps
                    </div>
                    <button
                      onClick={() => handleNav('/fuelyx')}
                      style={{
                        width: '100%',
                        padding: '8px 24px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: '#14b8a6',
                        fontSize: '13px',
                        fontWeight: '600',
                        fontFamily: FONTS.body,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        textAlign: 'left',
                      }}
                    >
                      Fuelyx
                    </button>
                  </div>
                </div>
              )}

              <div style={{ height: '1px', backgroundColor: theme.cardBorder, margin: '8px 24px' }} />

              <button onClick={() => handleNav('/about')} style={navItemStyle}>
                About
              </button>
              <button onClick={() => handleNav('/privacy')} style={navItemStyle}>
                Privacy
              </button>
            </div>

            {/* Account notice */}
            <div
              style={{
                padding: '16px 24px',
                borderTop: `1px solid ${theme.cardBorder}`,
                textAlign: 'center',
              }}
            >
              <button
                onClick={() => handleNav('/services')}
                style={{
                  width: '100%',
                  height: '42px',
                  backgroundColor: BRAND.blue,
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '500',
                  fontFamily: FONTS.body,
                  cursor: 'pointer',
                  boxShadow: '0 2px 12px rgba(0,74,172,0.35)',
                }}
              >
                View Services
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileDrawer;
