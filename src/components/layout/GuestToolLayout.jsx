/**
 * GuestToolLayout Component
 * Layout wrapper for guest users accessing free tools at brewedops.com/[tool]
 * 
 * Features:
 * - Simple header with logo and login/signup buttons
 * - Tool content area
 * - CTA to sign up at bottom
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CaretLeft, CaretRight, SignIn } from '@phosphor-icons/react';
import SEO from '../SEO';
import ThemeToggle from '../ui/ThemeToggle';

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
// GUEST TOOL LAYOUT COMPONENT
// ============================================
const GuestToolLayout = ({ children, toolName, isDark, setIsDark }) => {
  const navigate = useNavigate();
  const theme = getTheme(isDark);
  const { width } = useWindowSize();
  const isSmall = width < 480;
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
    <SEO
      title={`${toolName} - Free Online Tool | BrewedOps`}
      description={`Use ${toolName} for free - no login required. Part of BrewedOps' suite of 30+ free tools for Filipino VAs and Freelancers.`}
      keywords={`${toolName}, free online tool, BrewedOps, Filipino VA tools`}
    />
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: isDark ? theme.bg : '#faf8f5',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ============================================ */}
      {/* HEADER */}
      {/* ============================================ */}
      <header
        style={{
          padding: isSmall ? '12px 16px' : '14px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: isDark ? theme.cardBg : '#ffffff',
          borderBottom: isScrolled ? '1px solid ' + theme.cardBorder : '1px solid transparent',
          transition: 'border-color 0.3s',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        {/* Left: Back + Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              width: '36px',
              height: '36px',
              backgroundColor: 'transparent',
              border: '1px solid ' + theme.cardBorder,
              borderRadius: '8px',
              color: theme.textMuted,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Back to Home"
            aria-label="Back to Home"
          >
            <CaretLeft size={18} />
          </button>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
            }}
            onClick={() => navigate('/')}
          >
            <img
              src="/BrewedOpsLogo-64.png"
              alt="BrewedOps Logo"
              width={32}
              height={32}
              style={{ width: '32px', height: '32px', borderRadius: '8px' }}
            />
            <span
              style={{
                fontSize: '18px',
                fontWeight: '700',
                fontFamily: FONTS.heading,
              }}
            >
              <span style={{ color: isDark ? '#fff' : BRAND.brown }}>Brewed</span>
              <span style={{ color: BRAND.blue }}>Ops</span>
            </span>
          </div>

          {/* Tool Name Badge */}
          {toolName && (
            <>
              <span style={{ color: theme.cardBorder, fontSize: '20px' }}>/</span>
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: theme.text,
                  fontFamily: FONTS.body,
                }}
              >
                {toolName}
              </span>
            </>
          )}
        </div>

        {/* Right: Theme + Auth Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Theme Toggle */}
          <ThemeToggle isDark={isDark} setIsDark={setIsDark} />

          {!isSmall && (
            <button
              onClick={() => navigate('/services')}
              style={{
                position: 'relative',
                overflow: 'hidden',
                height: '38px',
                padding: '0 22px',
                backgroundColor: '#004AAC',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '500',
                fontFamily: FONTS.body,
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
          )}
        </div>
      </header>

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
      `}</style>

      {/* ============================================ */}
      {/* MAIN CONTENT */}
      {/* ============================================ */}
      <main
        id="main-content"
        style={{
          flex: 1,
          padding: isSmall ? '16px' : '24px',
          maxWidth: '1200px',
          width: '100%',
          margin: '0 auto',
        }}
      >
        <div
          style={{
            backgroundColor: isDark ? theme.cardBg : '#ffffff',
            borderRadius: '16px',
            border: '1px solid ' + theme.cardBorder,
            padding: isSmall ? '16px' : '24px',
            minHeight: '500px',
          }}
        >
          {children}
        </div>
      </main>

      {/* ============================================ */}
      {/* BOTTOM CTA BANNER */}
      {/* ============================================ */}
      <div
        style={{
          padding: '16px 24px',
          backgroundColor: isDark ? BRAND.blue + '15' : BRAND.blue + '10',
          borderTop: '1px solid ' + (isDark ? BRAND.blue + '30' : BRAND.blue + '20'),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          flexWrap: 'wrap',
        }}
      >
        <p
          style={{
            fontSize: '14px',
            color: isDark ? '#fff' : BRAND.brown,
            margin: 0,
            fontFamily: FONTS.body,
          }}
        >
          <strong>More features coming soon!</strong> Finance Tracker, Task Manager & cross-device sync are on the way.
        </p>
        <button
          onClick={() => navigate('/')}
          style={{
            height: '36px',
            padding: '0 20px',
            backgroundColor: BRAND.blue,
            border: 'none',
            borderRadius: '8px',
            color: '#fff',
            fontSize: '13px',
            fontWeight: '600',
            fontFamily: FONTS.body,
            cursor: 'pointer',
          }}
        >
          Explore Tools
        </button>
      </div>
    </div>
    </>
  );
};

export default GuestToolLayout;
