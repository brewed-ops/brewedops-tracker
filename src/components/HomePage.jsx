// HomePage.jsx - Landing page for BrewedOps
import React, { useState } from 'react';
import { 
  Wallet, CheckSquare, FileText, Headset,
  Image, Crop, Minimize2, ImageDown, RefreshCw, Palette, FileImage,
  Film, Scissors,
  FileEdit, FileStack, SplitSquareVertical,
  QrCode, Replace, CaseSensitive, Hash,
  ArrowRight, Sparkles, Zap, Shield, Globe, Users, Star, Coffee
} from 'lucide-react';

// BREWEDOPS BRAND
const BRAND = { brown: '#3F200C', blue: '#004AAC', green: '#51AF43', cream: '#FFF0D4' };

const HomePage = ({ onNavigate, onGetStarted, isDark }) => {
  const theme = {
    bg: isDark ? '#09090b' : '#ffffff',
    text: isDark ? '#fafafa' : '#18181b',
    textMuted: isDark ? '#a1a1aa' : '#71717a',
    cardBg: isDark ? '#18181b' : '#ffffff',
    cardBorder: isDark ? '#27272a' : '#e4e4e7',
  };

  // All 18 tools organized by category
  const toolCategories = [
    {
      name: 'Productivity',
      color: '#004AAC',
      tools: [
        { name: 'Finance Tracker', icon: Wallet, desc: 'Track income, expenses & invoices' },
        { name: 'VAKita', icon: Headset, desc: 'VA earnings calculator & tracker' },
        { name: 'Task Manager', icon: CheckSquare, desc: 'Organize tasks & to-dos' },
        { name: 'Brewed Notes', icon: FileText, desc: 'Rich text notes with formatting' },
      ]
    },
    {
      name: 'Image Tools',
      color: '#8b5cf6',
      tools: [
        { name: 'BG Remover', icon: Image, desc: 'Remove image backgrounds' },
        { name: 'Image Cropper', icon: Crop, desc: 'Crop & resize images' },
        { name: 'Image Resizer', icon: Minimize2, desc: 'Resize to any dimensions' },
        { name: 'Image Compressor', icon: ImageDown, desc: 'Compress without quality loss' },
        { name: 'Image Converter', icon: RefreshCw, desc: 'Convert between formats' },
        { name: 'Color Picker', icon: Palette, desc: 'Extract colors from images' },
        { name: 'Image to PDF', icon: FileImage, desc: 'Convert images to PDF' },
      ]
    },
    {
      name: 'Video Tools',
      color: '#ef4444',
      tools: [
        { name: 'Video Compressor', icon: Film, desc: 'Compress video files' },
        { name: 'Video Trimmer', icon: Scissors, desc: 'Trim & cut videos' },
      ]
    },
    {
      name: 'Document Tools',
      color: '#22c55e',
      tools: [
        { name: 'PDF Editor', icon: FileEdit, desc: 'Edit PDF documents' },
        { name: 'PDF Merge', icon: FileStack, desc: 'Combine multiple PDFs' },
        { name: 'PDF Split', icon: SplitSquareVertical, desc: 'Split PDFs into parts' },
      ]
    },
    {
      name: 'Other Tools',
      color: '#f59e0b',
      tools: [
        { name: 'QR Generator', icon: QrCode, desc: 'Create QR codes' },
        { name: 'Find & Replace', icon: Replace, desc: 'Search & replace text' },
        { name: 'Case Converter', icon: CaseSensitive, desc: 'Change text case' },
        { name: 'Word Counter', icon: Hash, desc: 'Count words & characters' },
      ]
    }
  ];

  const features = [
    { icon: Zap, title: 'Fast & Efficient', desc: 'All tools work instantly in your browser' },
    { icon: Shield, title: 'Secure & Private', desc: 'Your data stays on your device' },
    { icon: Globe, title: 'Works Anywhere', desc: 'Access from any device, anytime' },
    { icon: Users, title: 'Built for VAs', desc: 'Designed for Filipino freelancers' },
  ];

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: theme.bg,
      fontFamily: "'Montserrat', sans-serif"
    }}>
      {/* Import Google Fonts */}
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      
      {/* Header */}
      <header style={{
        padding: '16px 24px',
        borderBottom: `1px solid ${theme.cardBorder}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: theme.bg,
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img 
            src="https://i.imgur.com/R52jwPv.png" 
            alt="BrewedOps Logo" 
            style={{ width: '40px', height: '40px', borderRadius: '10px' }}
          />
          <span style={{ 
            fontSize: '22px', 
            fontWeight: '700', 
            color: theme.text,
            letterSpacing: '-0.5px'
          }}>
            Brewed<span style={{ color: BRAND.blue }}>Ops</span>
          </span>
        </div>
        <button
          onClick={onGetStarted}
          style={{
            padding: '10px 24px',
            backgroundColor: BRAND.blue,
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontFamily: "'Montserrat', sans-serif"
          }}
        >
          Get Started <ArrowRight size={16} />
        </button>
      </header>

      {/* Hero Section */}
      <section style={{
        padding: '60px 24px 80px',
        textAlign: 'center',
        background: isDark 
          ? 'linear-gradient(180deg, #09090b 0%, #18181b 100%)' 
          : 'linear-gradient(180deg, #ffffff 0%, #f4f4f5 100%)'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          backgroundColor: isDark ? '#004AAC20' : '#004AAC10',
          borderRadius: '100px',
          marginBottom: '24px'
        }}>
          <Coffee size={16} style={{ color: BRAND.blue }} />
          <span style={{ fontSize: '13px', color: BRAND.blue, fontWeight: '600' }}>
            18 Free Tools for Freelancers
          </span>
        </div>
        
        <h1 style={{ 
          fontSize: 'clamp(32px, 5vw, 52px)', 
          fontWeight: '800', 
          color: theme.text, 
          margin: '0 0 20px',
          lineHeight: '1.1',
          letterSpacing: '-1px'
        }}>
          Your All-in-One<br />
          <span style={{ color: BRAND.blue }}>Productivity Hub</span>
        </h1>
        
        <p style={{ 
          fontSize: '18px', 
          color: theme.textMuted, 
          margin: '0 auto 32px',
          maxWidth: '600px',
          lineHeight: '1.6'
        }}>
          Finance tracking, image editing, document tools, and more — everything a Filipino VA and freelancer needs, all in one place.
        </p>
        
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={onGetStarted}
            style={{
              padding: '14px 32px',
              backgroundColor: BRAND.blue,
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: "'Montserrat', sans-serif"
            }}
          >
            <Sparkles size={18} /> Start Free
          </button>
          <button
            onClick={() => document.getElementById('tools-section').scrollIntoView({ behavior: 'smooth' })}
            style={{
              padding: '14px 32px',
              backgroundColor: 'transparent',
              color: theme.text,
              border: `2px solid ${theme.cardBorder}`,
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              fontFamily: "'Montserrat', sans-serif"
            }}
          >
            Explore Tools
          </button>
        </div>
      </section>

      {/* Features Grid */}
      <section style={{ padding: '60px 24px', backgroundColor: theme.bg }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px'
          }}>
            {features.map((feature, idx) => (
              <div
                key={idx}
                style={{
                  padding: '24px',
                  backgroundColor: theme.cardBg,
                  borderRadius: '12px',
                  border: `1px solid ${theme.cardBorder}`,
                  textAlign: 'center'
                }}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: isDark ? '#004AAC20' : '#004AAC10',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px'
                }}>
                  <feature.icon size={24} style={{ color: BRAND.blue }} />
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: theme.text, margin: '0 0 8px' }}>
                  {feature.title}
                </h3>
                <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0 }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section id="tools-section" style={{ padding: '60px 24px', backgroundColor: isDark ? '#18181b' : '#f4f4f5' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: '700', color: theme.text, margin: '0 0 12px' }}>
              All 18 Tools Included
            </h2>
            <p style={{ fontSize: '16px', color: theme.textMuted, margin: 0 }}>
              Everything you need to run your freelance business efficiently
            </p>
          </div>

          {toolCategories.map((category, catIdx) => (
            <div key={catIdx} style={{ marginBottom: '40px' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px', 
                marginBottom: '20px' 
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: category.color
                }} />
                <h3 style={{ 
                  fontSize: '18px', 
                  fontWeight: '600', 
                  color: theme.text, 
                  margin: 0 
                }}>
                  {category.name}
                  <span style={{ 
                    fontSize: '14px', 
                    fontWeight: '400', 
                    color: theme.textMuted,
                    marginLeft: '8px'
                  }}>
                    ({category.tools.length} tools)
                  </span>
                </h3>
              </div>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                gap: '12px'
              }}>
                {category.tools.map((tool, toolIdx) => (
                  <div
                    key={toolIdx}
                    style={{
                      padding: '16px 20px',
                      backgroundColor: theme.cardBg,
                      borderRadius: '10px',
                      border: `1px solid ${theme.cardBorder}`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = category.color;
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = theme.cardBorder;
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <div style={{
                      width: '40px',
                      height: '40px',
                      backgroundColor: `${category.color}15`,
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <tool.icon size={20} style={{ color: category.color }} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '14px', fontWeight: '600', color: theme.text, margin: '0 0 2px' }}>
                        {tool.name}
                      </h4>
                      <p style={{ fontSize: '12px', color: theme.textMuted, margin: 0 }}>
                        {tool.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '80px 24px', backgroundColor: theme.bg, textAlign: 'center' }}>
        <div style={{
          maxWidth: '600px',
          margin: '0 auto',
          padding: '48px 32px',
          backgroundColor: isDark ? '#004AAC15' : '#004AAC08',
          borderRadius: '20px',
          border: `1px solid ${BRAND.blue}30`
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            backgroundColor: BRAND.blue,
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px'
          }}>
            <Star size={32} style={{ color: '#ffffff' }} />
          </div>
          <h2 style={{ fontSize: '28px', fontWeight: '700', color: theme.text, margin: '0 0 12px' }}>
            Ready to Boost Your Productivity?
          </h2>
          <p style={{ fontSize: '16px', color: theme.textMuted, margin: '0 0 28px' }}>
            Join thousands of Filipino freelancers using BrewedOps to manage their business.
          </p>
          <button
            onClick={onGetStarted}
            style={{
              padding: '16px 40px',
              backgroundColor: BRAND.blue,
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              fontFamily: "'Montserrat', sans-serif"
            }}
          >
            Get Started — It's Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ 
        padding: '32px 24px', 
        borderTop: `1px solid ${theme.cardBorder}`,
        backgroundColor: theme.bg
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '32px', 
            marginBottom: '20px',
            flexWrap: 'wrap'
          }}>
            <button 
              onClick={() => onNavigate('privacy')}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: theme.textMuted, 
                fontSize: '14px', 
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
                fontSize: '14px', 
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
                color: theme.textMuted, 
                fontSize: '14px', 
                cursor: 'pointer',
                fontFamily: "'Montserrat', sans-serif"
              }}
            >
              About Us
            </button>
          </div>
          <p style={{ fontSize: '13px', color: theme.textMuted, margin: 0 }}>
            © {new Date().getFullYear()} BrewedOps by Kenneth V. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
