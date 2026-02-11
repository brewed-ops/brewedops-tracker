import React, { useState, useEffect, useRef } from 'react';
import { Eye } from '@phosphor-icons/react';

const MODES = [
  { id: 'none', label: 'Normal', filter: 'none' },
  { id: 'high-contrast', label: 'High Contrast', filter: 'contrast(1.4) saturate(1.3)' },
  { id: 'deuteranopia', label: 'Red-Green', filter: 'url(#deuteranopia)' },
  { id: 'tritanopia', label: 'Blue-Yellow', filter: 'url(#tritanopia)' },
  { id: 'grayscale', label: 'Grayscale', filter: 'grayscale(1) contrast(1.2)' },
];

const AccessibilityToggle = () => {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState(() => localStorage.getItem('a11y-mode') || 'none');
  const panelRef = useRef(null);

  useEffect(() => {
    const root = document.documentElement;
    const selected = MODES.find((m) => m.id === mode);
    if (selected) {
      root.style.filter = selected.filter === 'none' ? '' : selected.filter;
    }
    localStorage.setItem('a11y-mode', mode);
  }, [mode]);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const handleKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  return (
    <>
      {/* SVG filter definitions for color blindness correction */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }} aria-hidden="true">
        <defs>
          <filter id="deuteranopia">
            <feColorMatrix type="matrix" values="
              0.625 0.375 0     0 0
              0.7   0.3   0     0 0
              0     0.3   0.7   0 0
              0     0     0     1 0
            " />
          </filter>
          <filter id="tritanopia">
            <feColorMatrix type="matrix" values="
              0.95  0.05  0     0 0
              0     0.433 0.567 0 0
              0     0.475 0.525 0 0
              0     0     0     1 0
            " />
          </filter>
        </defs>
      </svg>

      <div ref={panelRef} style={{ position: 'fixed', bottom: '20px', left: '20px', zIndex: 9998 }}>
        {/* Toggle button */}
        <button
          onClick={() => setOpen(!open)}
          aria-label="Color blind accessibility options"
          aria-expanded={open}
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            backgroundColor: mode !== 'none' ? '#004AAC' : 'rgba(63, 32, 12, 0.85)',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 12px rgba(0,0,0,0.25)',
            transition: 'background-color 0.2s',
          }}
        >
          <Eye size={22} weight={mode !== 'none' ? 'fill' : 'regular'} />
        </button>

        {/* Options panel */}
        {open && (
          <div
            role="menu"
            aria-label="Color blind mode options"
            style={{
              position: 'absolute',
              bottom: '54px',
              left: '0',
              backgroundColor: '#1a1714',
              borderRadius: '12px',
              padding: '8px',
              minWidth: '170px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              border: '1px solid #2a2420',
            }}
          >
            <div
              style={{
                fontSize: '10px',
                fontWeight: '600',
                color: '#8a7e72',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                padding: '6px 10px 4px',
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              Color Blind Mode
            </div>
            {MODES.map((m) => (
              <button
                key={m.id}
                role="menuitem"
                onClick={() => {
                  setMode(m.id);
                  setOpen(false);
                }}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  backgroundColor: mode === m.id ? '#004AAC' : 'transparent',
                  color: mode === m.id ? '#fff' : '#e0d6c8',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: mode === m.id ? '600' : '400',
                  fontFamily: "'Poppins', sans-serif",
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'block',
                  transition: 'background-color 0.15s',
                }}
              >
                {m.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default AccessibilityToggle;
