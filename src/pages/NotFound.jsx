import React from 'react';
import { useNavigate } from 'react-router-dom';
import { House, MagnifyingGlass } from '@phosphor-icons/react';
import { getTheme } from '../lib/theme';
import SEO from '../components/SEO';

const NotFound = ({ isDark }) => {
  const theme = getTheme(isDark);
  const navigate = useNavigate();

  return (
    <>
      <SEO
        title="Page Not Found | BrewedOps"
        description="The page you're looking for doesn't exist."
        noindex
      />
      <div style={{
        minHeight: '100vh',
        backgroundColor: theme.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        fontFamily: "'Poppins', sans-serif",
      }}>
        <div style={{
          maxWidth: '480px',
          width: '100%',
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: '120px',
            fontWeight: '800',
            color: isDark ? '#2a2420' : '#e8e0d4',
            lineHeight: '1',
            fontFamily: "'Montserrat', sans-serif",
            marginBottom: '8px',
          }}>
            404
          </div>
          <h1 style={{
            fontSize: '22px',
            fontWeight: '700',
            color: theme.text,
            margin: '0 0 8px',
            fontFamily: "'Montserrat', sans-serif",
          }}>
            Page not found
          </h1>
          <p style={{
            fontSize: '14px',
            color: theme.textMuted,
            margin: '0 0 32px',
            lineHeight: '1.6',
          }}>
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button
              onClick={() => navigate('/')}
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
              <House weight="bold" style={{ width: '16px', height: '16px' }} />
              Go Home
            </button>
            <button
              onClick={() => navigate('/services')}
              style={{
                height: '44px',
                padding: '0 20px',
                backgroundColor: 'transparent',
                color: theme.textMuted,
                border: `1px solid ${theme.cardBorder}`,
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <MagnifyingGlass weight="bold" style={{ width: '16px', height: '16px' }} />
              Services
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
