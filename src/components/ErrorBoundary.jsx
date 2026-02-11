import React from 'react';
import { WarningCircle, ArrowClockwise, House } from '@phosphor-icons/react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  // eslint-disable-next-line no-unused-vars
  componentDidCatch(error, errorInfo) {
    // Future: send to Sentry or similar error monitoring
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    // Read theme preference from localStorage (same key as App.jsx)
    let storedDark = true;
    try { storedDark = localStorage.getItem('brewedops-dark-mode') !== 'false'; } catch { /* ignore */ }
    const isDark = this.props.isDark ?? storedDark;
    const bg = isDark ? '#0d0b09' : '#faf8f5';
    const text = isDark ? '#f5f0eb' : '#3F200C';
    const muted = isDark ? '#a09585' : '#7a6652';
    const cardBg = isDark ? '#171411' : '#ffffff';
    const border = isDark ? '#2a2420' : '#e8e0d4';

    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        fontFamily: "'Poppins', sans-serif",
      }}>
        <div style={{
          maxWidth: '480px',
          width: '100%',
          backgroundColor: cardBg,
          border: `1px solid ${border}`,
          borderRadius: '16px',
          padding: '48px 32px',
          textAlign: 'center',
        }}>
          <WarningCircle
            weight="duotone"
            style={{ width: '56px', height: '56px', color: '#ef4444', marginBottom: '20px' }}
          />
          <h1 style={{
            fontSize: '22px',
            fontWeight: '700',
            color: text,
            margin: '0 0 8px',
            fontFamily: "'Montserrat', sans-serif",
          }}>
            Something went wrong
          </h1>
          <p style={{
            fontSize: '14px',
            color: muted,
            margin: '0 0 32px',
            lineHeight: '1.6',
          }}>
            An unexpected error occurred. Please try refreshing the page.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button
              onClick={() => window.location.reload()}
              style={{
                height: '44px',
                padding: '0 20px',
                backgroundColor: '#004AAC',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <ArrowClockwise weight="bold" style={{ width: '16px', height: '16px' }} />
              Refresh
            </button>
            <button
              onClick={() => { window.location.href = '/'; }}
              style={{
                height: '44px',
                padding: '0 20px',
                backgroundColor: 'transparent',
                color: muted,
                border: `1px solid ${border}`,
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <House weight="bold" style={{ width: '16px', height: '16px' }} />
              Home
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
