// AboutUs.jsx - About Us page for BrewedOps
import React from 'react';
import { 
  Code, Heart, Mail, Phone, Sparkles, Zap, Users, Target, 
  Wallet, CheckSquare, FileText, Headset, Image, Film, FileEdit, QrCode,
  Coffee, Globe, Shield, Smartphone
} from 'lucide-react';

// BREWEDOPS BRAND
const BRAND = { brown: '#3F200C', blue: '#004AAC', green: '#51AF43', cream: '#FFF0D4' };

const AboutUs = ({ onBack, onNavigate, isDark }) => {
  const theme = {
    bg: isDark ? '#09090b' : '#ffffff',
    text: isDark ? '#fafafa' : '#18181b',
    textMuted: isDark ? '#a1a1aa' : '#71717a',
    cardBg: isDark ? '#18181b' : '#ffffff',
    cardBorder: isDark ? '#27272a' : '#e4e4e7',
  };

  const stats = [
    { value: '18', label: 'Free Tools' },
    { value: '1', label: 'Mobile App' },
    { value: '100%', label: 'Free to Use' },
    { value: '24/7', label: 'Available' },
  ];

  const toolCategories = [
    { name: 'Productivity', count: 4, icon: Wallet, color: '#004AAC', tools: 'Finance Tracker, VAKita, Task Manager, Brewed Notes' },
    { name: 'Image Tools', count: 7, icon: Image, color: '#8b5cf6', tools: 'BG Remover, Cropper, Resizer, Compressor, Converter, Color Picker, Image to PDF' },
    { name: 'Video Tools', count: 2, icon: Film, color: '#ef4444', tools: 'Video Compressor, Video Trimmer' },
    { name: 'Document Tools', count: 3, icon: FileEdit, color: '#22c55e', tools: 'PDF Editor, PDF Merge, PDF Split' },
    { name: 'Other Tools', count: 4, icon: QrCode, color: '#f59e0b', tools: 'QR Generator, Find & Replace, Case Converter, Word Counter' },
  ];

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: theme.bg,
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "'Montserrat', sans-serif"
    }}>
      {/* Import Google Fonts */}
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      
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
          <img 
            src="https://i.imgur.com/R52jwPv.png" 
            alt="BrewedOps Logo" 
            style={{ width: '36px', height: '36px', borderRadius: '10px' }}
          />
          <span style={{ 
            fontSize: '20px', 
            fontWeight: '700', 
            color: theme.text,
            letterSpacing: '-0.5px'
          }}>
            Brewed<span style={{ color: BRAND.blue }}>Ops</span>
          </span>
        </button>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '40px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          {/* Hero Section */}
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <div style={{
              width: '80px',
              height: '80px',
              backgroundColor: isDark ? '#004AAC20' : '#004AAC15',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px'
            }}>
              <Coffee style={{ width: '40px', height: '40px', color: '#004AAC' }} />
            </div>
            <h1 style={{ 
              fontSize: '42px', 
              fontWeight: '800', 
              color: theme.text, 
              margin: '0 0 16px',
              letterSpacing: '-1px'
            }}>
              About <span style={{ color: BRAND.blue }}>BrewedOps</span>
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
              A comprehensive productivity platform with 18 free tools built specifically for Filipino Virtual Assistants and Freelancers
            </p>
          </div>

          {/* Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '16px',
            marginBottom: '48px'
          }}>
            {stats.map((stat, idx) => (
              <div key={idx} style={{
                padding: '24px 16px',
                backgroundColor: theme.cardBg,
                borderRadius: '12px',
                border: `1px solid ${theme.cardBorder}`,
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '32px', fontWeight: '800', color: BRAND.blue, marginBottom: '4px' }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '13px', color: theme.textMuted, fontWeight: '500' }}>
                  {stat.label}
                </div>
              </div>
            ))}
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
              <h2 style={{ fontSize: '24px', fontWeight: '700', color: theme.text, margin: 0 }}>
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
              as a personal tool to manage freelance finances has evolved into a comprehensive platform with 
              <strong style={{ color: theme.text }}> 18 free tools</strong> designed specifically for the needs 
              of Filipino VAs and freelancers.
            </p>
            <p style={{ 
              fontSize: '16px', 
              color: theme.textMuted, 
              lineHeight: '1.8',
              margin: 0
            }}>
              From financial tracking with multi-currency support to image editing, PDF manipulation, and productivity 
              tools — every feature in BrewedOps was built with intention, understanding the unique challenges of 
              working remotely for clients around the world.
            </p>
          </div>

          {/* Tools Overview */}
          <div style={{
            padding: '32px',
            backgroundColor: isDark ? '#18181b' : '#f9fafb',
            borderRadius: '16px',
            border: '1px solid ' + theme.cardBorder,
            marginBottom: '32px'
          }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: theme.text, margin: '0 0 24px', textAlign: 'center' }}>
              18 Tools Across 5 Categories
            </h2>
            <div style={{ display: 'grid', gap: '16px' }}>
              {toolCategories.map((cat, idx) => (
                <div key={idx} style={{
                  padding: '20px',
                  backgroundColor: theme.cardBg,
                  borderRadius: '12px',
                  border: `1px solid ${theme.cardBorder}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px'
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: `${cat.color}15`,
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <cat.icon size={24} style={{ color: cat.color }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: '600', color: theme.text, margin: 0 }}>
                        {cat.name}
                      </h3>
                      <span style={{
                        padding: '2px 8px',
                        backgroundColor: `${cat.color}20`,
                        color: cat.color,
                        borderRadius: '100px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        {cat.count} tools
                      </span>
                    </div>
                    <p style={{ fontSize: '13px', color: theme.textMuted, margin: 0 }}>
                      {cat.tools}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fuelyx Mobile App Section */}
          <div style={{
            padding: '32px',
            backgroundColor: isDark ? '#0f172a' : '#f0fdfa',
            borderRadius: '16px',
            border: '1px solid ' + (isDark ? '#14b8a640' : '#14b8a630'),
            marginBottom: '32px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
              <img 
                src="https://i.imgur.com/RufDQlF.png" 
                alt="Fuelyx Logo" 
                style={{ width: '56px', height: '56px', borderRadius: '14px' }}
              />
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: '700', color: theme.text, margin: 0 }}>
                  Fuelyx <span style={{ color: '#14b8a6' }}>Mobile App</span>
                </h2>
                <p style={{ fontSize: '14px', color: theme.textMuted, margin: '4px 0 0' }}>
                  Nutrition & Fitness Tracker for Filipinos
                </p>
              </div>
            </div>
            
            <p style={{ 
              fontSize: '16px', 
              color: theme.textMuted, 
              lineHeight: '1.8',
              margin: '0 0 20px'
            }}>
              <strong style={{ color: theme.text }}>Fuelyx</strong> is our standalone Android mobile app designed to help Filipinos 
              track their nutrition, fitness, and health goals. Built with the same vibe coding approach as BrewedOps, 
              it features a comprehensive database of <strong style={{ color: theme.text }}>200+ Filipino foods</strong>.
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
              {[
                { icon: '📸', title: 'AI Food Scanner', desc: 'Snap & log food instantly' },
                { icon: '🍲', title: '200+ Filipino Foods', desc: 'Local dishes database' },
                { icon: '⏱️', title: 'Fasting Timer', desc: '6 IF protocols supported' },
                { icon: '💪', title: 'Workout Tracking', desc: 'Log exercises & calories' },
                { icon: '📊', title: 'Smart Analytics', desc: 'Charts & progress insights' },
                { icon: '🏆', title: 'Achievements', desc: 'Streaks & badge rewards' },
              ].map((feature, idx) => (
                <div key={idx} style={{
                  padding: '16px',
                  backgroundColor: theme.cardBg,
                  borderRadius: '10px',
                  border: '1px solid ' + theme.cardBorder,
                }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>{feature.icon}</div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: theme.text, marginBottom: '4px' }}>{feature.title}</div>
                  <div style={{ fontSize: '12px', color: theme.textMuted }}>{feature.desc}</div>
                </div>
              ))}
            </div>
            
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <a 
                href="/fuelyx"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #14b8a6, #10b981)',
                  color: '#fff',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                <Smartphone size={18} />
                Learn More & Download
              </a>
            </div>
          </div>

          {/* Features Highlights */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
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
              <Shield style={{ width: '32px', height: '32px', color: '#22c55e', margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: theme.text, margin: '0 0 8px' }}>
                Secure & Private
              </h3>
              <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0 }}>
                Your data stays safe with us
              </p>
            </div>
            <div style={{
              padding: '24px',
              backgroundColor: theme.cardBg,
              borderRadius: '12px',
              border: '1px solid ' + theme.cardBorder,
              textAlign: 'center'
            }}>
              <Globe style={{ width: '32px', height: '32px', color: '#3b82f6', margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: theme.text, margin: '0 0 8px' }}>
                Works Anywhere
              </h3>
              <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0 }}>
                Access from any device
              </p>
            </div>
            <div style={{
              padding: '24px',
              backgroundColor: theme.cardBg,
              borderRadius: '12px',
              border: '1px solid ' + theme.cardBorder,
              textAlign: 'center'
            }}>
              <Users style={{ width: '32px', height: '32px', color: '#004AAC', margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: theme.text, margin: '0 0 8px' }}>
                Built for VAs
              </h3>
              <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0 }}>
                Features tailored for freelancers
              </p>
            </div>
          </div>

          {/* Contact Section */}
          <div style={{
            padding: '32px',
            backgroundColor: isDark ? '#004AAC15' : '#004AAC10',
            borderRadius: '16px',
            border: '1px solid #004AAC40',
            textAlign: 'center'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              backgroundColor: isDark ? '#004AAC30' : '#004AAC20',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px'
            }}>
              <Heart style={{ width: '28px', height: '28px', color: '#004AAC' }} />
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: theme.text, margin: '0 0 12px' }}>
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
                  fontWeight: '500'
                }}
              >
                <Mail style={{ width: '20px', height: '20px', color: '#004AAC' }} />
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
                  fontWeight: '500'
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
              fontFamily: "'Montserrat', sans-serif"
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
              fontFamily: "'Montserrat', sans-serif"
            }}
          >
            Terms of Service
          </button>
          <button 
            onClick={() => onNavigate('about')}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: '#004AAC', 
              fontSize: '13px', 
              cursor: 'pointer',
              fontWeight: '600',
              fontFamily: "'Montserrat', sans-serif"
            }}
          >
            About Us
          </button>
        </div>
        <p style={{ fontSize: '13px', color: theme.textMuted, margin: 0 }}>
          © {new Date().getFullYear()} BrewedOps by Kenneth V. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default AboutUs;
