// AboutUs.jsx - About Us page for BrewedOps
import React from 'react';
import { ArrowLeft, Coffee, Code, Heart, Mail, Phone, Sparkles, Zap, Users, Target } from 'lucide-react';

const AboutUs = ({ onBack, onNavigate, isDark }) => {
  const theme = {
    bg: isDark ? '#09090b' : '#ffffff',
    text: isDark ? '#fafafa' : '#18181b',
    textMuted: isDark ? '#a1a1aa' : '#71717a',
    cardBg: isDark ? '#18181b' : '#ffffff',
    cardBorder: isDark ? '#27272a' : '#e4e4e7',
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: theme.bg,
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <header style={{
        padding: '16px 24px',
        borderBottom: '1px solid ' + theme.cardBorder,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: theme.bg,
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <button 
          onClick={() => onNavigate('home')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '8px 0'
          }}
        >
          <div style={{
            width: '36px',
            height: '36px',
            backgroundColor: '#8b5cf6',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Coffee style={{ width: '20px', height: '20px', color: '#fff' }} />
          </div>
          <span style={{ 
            fontSize: '20px', 
            fontWeight: '700', 
            color: theme.text,
            letterSpacing: '-0.5px'
          }}>
            BrewedOps
          </span>
        </button>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '40px 24px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {/* Hero Section */}
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <div style={{
              width: '80px',
              height: '80px',
              backgroundColor: isDark ? '#8b5cf620' : '#8b5cf615',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px'
            }}>
              <Sparkles style={{ width: '40px', height: '40px', color: '#8b5cf6' }} />
            </div>
            <h1 style={{ 
              fontSize: '40px', 
              fontWeight: '700', 
              color: theme.text, 
              margin: '0 0 16px',
              letterSpacing: '-1px'
            }}>
              About BrewedOps
            </h1>
            <p style={{ 
              fontSize: '18px', 
              color: theme.textMuted, 
              margin: 0,
              lineHeight: '1.6',
              maxWidth: '600px',
              marginLeft: 'auto',
              marginRight: 'auto'
            }}>
              A financial tracking and business management system built for Filipino Virtual Assistants and Freelancers
            </p>
          </div>

          {/* Story Section */}
          <div style={{
            padding: '32px',
            backgroundColor: theme.cardBg,
            borderRadius: '16px',
            border: '1px solid ' + theme.cardBorder,
            marginBottom: '32px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                backgroundColor: isDark ? '#22c55e20' : '#22c55e15',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Code style={{ width: '22px', height: '22px', color: '#22c55e' }} />
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: '600', color: theme.text, margin: 0 }}>
                Built Through Vibe Coding
              </h2>
            </div>
            <p style={{ 
              fontSize: '16px', 
              color: theme.textMuted, 
              lineHeight: '1.8',
              margin: '0 0 16px'
            }}>
              BrewedOps was created by <strong style={{ color: theme.text }}>Kenneth</strong> through the power of 
              vibe coding — a creative approach where ideas flow naturally into functional software. What started 
              as a personal tool to manage freelance finances has evolved into a comprehensive platform designed 
              specifically for the needs of Filipino VAs and freelancers.
            </p>
            <p style={{ 
              fontSize: '16px', 
              color: theme.textMuted, 
              lineHeight: '1.8',
              margin: 0
            }}>
              Every feature in BrewedOps was built with intention: from tracking income in multiple currencies to 
              calculating Philippine taxes, from managing international clients across timezones to sending 
              professional invoices. It's a system that understands the unique challenges of working remotely 
              for clients around the world.
            </p>
          </div>

          {/* Features Highlights */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
            marginBottom: '32px'
          }}>
            <div style={{
              padding: '24px',
              backgroundColor: theme.cardBg,
              borderRadius: '12px',
              border: '1px solid ' + theme.cardBorder,
              textAlign: 'center'
            }}>
              <Zap style={{ width: '32px', height: '32px', color: '#f59e0b', margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: theme.text, margin: '0 0 8px' }}>
                Fast & Intuitive
              </h3>
              <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0 }}>
                Designed for efficiency and ease of use
              </p>
            </div>
            <div style={{
              padding: '24px',
              backgroundColor: theme.cardBg,
              borderRadius: '12px',
              border: '1px solid ' + theme.cardBorder,
              textAlign: 'center'
            }}>
              <Users style={{ width: '32px', height: '32px', color: '#3b82f6', margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: theme.text, margin: '0 0 8px' }}>
                Built for VAs
              </h3>
              <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0 }}>
                Features tailored for virtual assistants
              </p>
            </div>
            <div style={{
              padding: '24px',
              backgroundColor: theme.cardBg,
              borderRadius: '12px',
              border: '1px solid ' + theme.cardBorder,
              textAlign: 'center'
            }}>
              <Target style={{ width: '32px', height: '32px', color: '#8b5cf6', margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: theme.text, margin: '0 0 8px' }}>
                Goal-Oriented
              </h3>
              <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0 }}>
                Track progress and achieve your targets
              </p>
            </div>
          </div>

          {/* Contact Section */}
          <div style={{
            padding: '32px',
            backgroundColor: isDark ? '#8b5cf615' : '#8b5cf610',
            borderRadius: '16px',
            border: '1px solid #8b5cf640',
            textAlign: 'center'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              backgroundColor: isDark ? '#8b5cf630' : '#8b5cf620',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px'
            }}>
              <Heart style={{ width: '28px', height: '28px', color: '#8b5cf6' }} />
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: '600', color: theme.text, margin: '0 0 12px' }}>
              Get in Touch
            </h2>
            <p style={{ 
              fontSize: '15px', 
              color: theme.textMuted, 
              margin: '0 0 24px',
              lineHeight: '1.6'
            }}>
              Have questions, feedback, or just want to say hello? We'd love to hear from you!
            </p>
            
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '16px',
              maxWidth: '320px',
              margin: '0 auto'
            }}>
              <a 
                href="mailto:brewedops@gmail.com"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  padding: '14px 24px',
                  backgroundColor: theme.cardBg,
                  borderRadius: '10px',
                  border: '1px solid ' + theme.cardBorder,
                  textDecoration: 'none',
                  color: theme.text,
                  fontSize: '15px',
                  fontWeight: '500',
                  transition: 'all 0.2s'
                }}
              >
                <Mail style={{ width: '20px', height: '20px', color: '#8b5cf6' }} />
                brewedops@gmail.com
              </a>
              <a 
                href="tel:+639933074618"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  padding: '14px 24px',
                  backgroundColor: theme.cardBg,
                  borderRadius: '10px',
                  border: '1px solid ' + theme.cardBorder,
                  textDecoration: 'none',
                  color: theme.text,
                  fontSize: '15px',
                  fontWeight: '500',
                  transition: 'all 0.2s'
                }}
              >
                <Phone style={{ width: '20px', height: '20px', color: '#22c55e' }} />
                +63 993 307 4618
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ 
        padding: '24px', 
        borderTop: '1px solid ' + theme.cardBorder,
        textAlign: 'center'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '24px', 
          marginBottom: '12px',
          flexWrap: 'wrap'
        }}>
          <button 
            onClick={() => onNavigate('privacy')}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: theme.textMuted, 
              fontSize: '13px', 
              cursor: 'pointer',
              padding: '4px 0'
            }}
          >
            Privacy Policy
          </button>
          <button 
            onClick={() => onNavigate('terms')}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: theme.textMuted, 
              fontSize: '13px', 
              cursor: 'pointer',
              padding: '4px 0'
            }}
          >
            Terms of Service
          </button>
          <button 
            onClick={() => onNavigate('about')}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: '#8b5cf6', 
              fontSize: '13px', 
              cursor: 'pointer',
              padding: '4px 0',
              fontWeight: '500'
            }}
          >
            About Us
          </button>
        </div>
        <p style={{ fontSize: '13px', color: theme.textMuted, margin: 0 }}>
          © {new Date().getFullYear()} BrewedOps by Kenneth V.
        </p>
      </footer>
    </div>
  );
};

export default AboutUs;
