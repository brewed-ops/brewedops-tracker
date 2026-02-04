import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, Lock, Image, Scissors, Move, Minimize2, RefreshCw, Palette, FileImage, Film, FileEdit, Merge, Split, BookOpen, QrCode, Search, Type, Hash, GitBranch, Braces, Clock } from 'lucide-react';

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
      { icon: Move, title: 'Image Resizer', path: '/imageresizer' },
      { icon: Minimize2, title: 'Image Compressor', path: '/imagecompressor' },
      { icon: RefreshCw, title: 'Image Converter', path: '/imageconverter' },
      { icon: Palette, title: 'Color Picker', path: '/colorpicker' },
      { icon: FileImage, title: 'Image to PDF', path: '/imagetopdf' },
    ],
  },
  {
    name: 'Video Tools',
    tools: [
      { icon: Film, title: 'Video Compressor', path: '/videocompressor' },
      { icon: Scissors, title: 'Video Trimmer', path: '/videotrimmer' },
    ],
  },
  {
    name: 'Document Tools',
    tools: [
      { icon: FileEdit, title: 'PDF Editor', path: '/pdfeditor' },
      { icon: Merge, title: 'PDF Merge', path: '/pdfmerge' },
      { icon: Split, title: 'PDF Split', path: '/pdfsplit' },
      { icon: BookOpen, title: 'Markdown Viewer', path: '/markdownviewer' },
    ],
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
    ],
  },
];

const MobileDrawer = ({ isOpen, onClose, isDark, navigate, onNavigate }) => {
  const [toolsExpanded, setToolsExpanded] = useState(false);

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
                <ChevronDown
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

              <button
                onClick={() => handleNav('/fuelyx')}
                style={{ ...navItemStyle, color: '#14b8a6', fontWeight: '600' }}
              >
                Fuelyx
              </button>

              <div style={{ height: '1px', backgroundColor: theme.cardBorder, margin: '8px 24px' }} />

              <button onClick={() => handleNav('/about')} style={navItemStyle}>
                About
              </button>
              <button onClick={() => handleNav('/privacy')} style={navItemStyle}>
                Privacy
              </button>
            </div>

            {/* Auth Buttons */}
            <div
              style={{
                padding: '20px 24px',
                borderTop: `1px solid ${theme.cardBorder}`,
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              <button
                onClick={() => handleAction('login')}
                style={{
                  width: '100%',
                  height: '44px',
                  backgroundColor: 'transparent',
                  color: theme.text,
                  border: `1px solid ${theme.cardBorder}`,
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '500',
                  fontFamily: FONTS.body,
                  cursor: 'pointer',
                }}
              >
                Login
              </button>
              <button
                onClick={() => handleAction('signup')}
                style={{
                  width: '100%',
                  height: '44px',
                  backgroundColor: BRAND.blue,
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '600',
                  fontFamily: FONTS.body,
                  cursor: 'pointer',
                }}
              >
                Sign Up Free
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileDrawer;
