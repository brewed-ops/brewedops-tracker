import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle,
  CalendarCheck,
  ArrowRight,
} from '@phosphor-icons/react';
import SEO from '@/components/SEO';
import ThemeToggle from '../components/ui/ThemeToggle';

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
  textSubtle: isDark ? '#6b5f52' : '#a09585',
});

// ============================================
// THANK YOU PAGE
// ============================================
function ThankYouPage({ isDark, setIsDark }) {
  const navigate = useNavigate();
  const theme = getTheme(isDark);
  const [countdown, setCountdown] = useState(20);

  // Default to light mode
  useEffect(() => {
    setIsDark(false);
  }, []);

  // Countdown + redirect
  useEffect(() => {
    if (countdown <= 0) {
      navigate('/services');
      return;
    }
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, navigate]);

  // Progress ring calculation
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const progress = ((20 - countdown) / 20) * circumference;

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: theme.bg,
      color: theme.text,
      display: 'flex',
      flexDirection: 'column',
    }}>
      <SEO
        title="You're Booked! | BrewedOps"
        description="Your strategy call is confirmed. We'll see you soon."
      />

      {/* Minimal header */}
      <nav style={{
        padding: '12px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: `1px solid ${theme.cardBorder}`,
        backgroundColor: theme.bg,
      }}>
        <div
          onClick={() => navigate('/')}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
        >
          <img
            src="https://i.imgur.com/R52jwPvt.png"
            alt="BrewedOps Logo"
            width={32}
            height={32}
            style={{ width: '32px', height: '32px', borderRadius: '8px' }}
          />
          <span style={{ fontSize: '18px', fontWeight: '700', fontFamily: FONTS.heading }}>
            <span style={{ color: isDark ? '#fff' : BRAND.brown }}>Brewed</span>
            <span style={{ color: BRAND.blue }}>Ops</span>
          </span>
        </div>
        <ThemeToggle isDark={isDark} setIsDark={setIsDark} />
      </nav>

      {/* Main content — centered */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
      }}>
        <div style={{ textAlign: 'center', maxWidth: '560px' }}>
          {/* Success icon */}
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: isDark ? 'rgba(81,175,67,0.15)' : 'rgba(81,175,67,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 28px',
          }}>
            <CheckCircle size={44} weight="fill" style={{ color: BRAND.green }} />
          </div>

          <h1 style={{
            fontSize: '42px',
            fontWeight: '800',
            fontFamily: FONTS.heading,
            lineHeight: '1.15',
            marginBottom: '16px',
            color: theme.text,
            letterSpacing: '-0.02em',
          }}>
            You're Booked!
          </h1>

          <p style={{
            fontSize: '20px',
            color: theme.textMuted,
            lineHeight: '1.6',
            fontFamily: FONTS.body,
            marginBottom: '12px',
          }}>
            Check your email for the confirmation details.
            <br />
            We're looking forward to mapping out your plan.
          </p>

          {/* What to expect */}
          <div style={{
            backgroundColor: theme.cardBg,
            border: `1px solid ${theme.cardBorder}`,
            borderRadius: '14px',
            padding: '24px',
            margin: '28px 0',
            textAlign: 'left',
          }}>
            <p style={{
              fontSize: '16px',
              fontWeight: '700',
              color: theme.text,
              fontFamily: FONTS.heading,
              margin: '0 0 12px',
            }}>
              What to expect on the call:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                'We\'ll audit which tasks are eating your time.',
                'You\'ll get a custom automation + delegation plan.',
                'Zero sales pressure — just clarity.',
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CalendarCheck size={18} weight="fill" style={{ color: BRAND.blue, flexShrink: 0 }} />
                  <p style={{
                    fontSize: '15px',
                    color: theme.text,
                    margin: 0,
                    fontFamily: FONTS.body,
                    lineHeight: '1.5',
                  }}>
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Countdown ring */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
            marginTop: '8px',
          }}>
            <div style={{ position: 'relative', width: '84px', height: '84px' }}>
              <svg width="84" height="84" style={{ transform: 'rotate(-90deg)' }}>
                {/* Background ring */}
                <circle
                  cx="42"
                  cy="42"
                  r={radius}
                  fill="none"
                  stroke={theme.cardBorder}
                  strokeWidth="4"
                />
                {/* Progress ring */}
                <circle
                  cx="42"
                  cy="42"
                  r={radius}
                  fill="none"
                  stroke={BRAND.blue}
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference - progress}
                  style={{ transition: 'stroke-dashoffset 1s linear' }}
                />
              </svg>
              <span style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: '22px',
                fontWeight: '800',
                fontFamily: FONTS.heading,
                color: theme.text,
              }}>
                {countdown}
              </span>
            </div>

            <p style={{
              fontSize: '14px',
              color: theme.textSubtle,
              fontFamily: FONTS.body,
              margin: 0,
            }}>
              Redirecting to Services in {countdown}s
            </p>

            <button
              onClick={() => navigate('/services')}
              style={{
                marginTop: '4px',
                padding: '12px 28px',
                backgroundColor: BRAND.blue,
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                fontWeight: '600',
                fontSize: '15px',
                fontFamily: FONTS.body,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
              }}
            >
              Go to Services Now
              <ArrowRight size={16} weight="bold" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ThankYouPage;
