import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, LineChart, Line, AreaChart, Area } from 'recharts';
import { Upload, FileText, Users, MessageSquare, AlertTriangle, Plus, LogOut, Eye, Trash2, X, Loader2, Download, Check, Search, ChevronDown, AlertCircle, Moon, Sun, Receipt, Menu, Banknote, TrendingUp, TrendingDown, DollarSign, CreditCard, Wallet, PiggyBank, ArrowUpRight, ArrowDownRight, Bell, Edit, Star, Gift, Camera, Trophy, Award, Flame, Settings, Mail, Minus, BarChart3, ChevronLeft, ChevronRight, LayoutDashboard, Calculator, Headset, PanelLeft } from 'lucide-react';
import { supabase } from './lib/supabase';
import TaskManager from './components/TaskManager';
import PDFEditor from './components/PDFEditor';
import BackgroundRemover from './components/BackgroundRemover';
import ImageCropper from './components/ImageCropper';
import ImageConverter from './components/ImageConverter';
import ImageCompressor from './components/ImageCompressor';
import ImageResizer from './components/ImageResizer';
import QRGenerator from './components/QRGenerator';
import ColorPicker from './components/ColorPicker';
import ImageToText from './components/ImageToText';
import PDFMerge from './components/PDFMerge';
import PDFSplit from './components/PDFSplit';
import ImageToPDF from './components/ImageToPDF';
import VideoCompressor from './components/VideoCompressor';
import VideoTrimmer from './components/VideoTrimmer';
import FinanceTracker from './components/FinanceTracker';


// shadcn Sidebar imports
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';

// ============================================
// BREWEDOPS BRAND CONFIGURATION
// ============================================
const BRAND = {
  brown: '#3F200C',      // Coffee Brown - Primary text
  blue: '#004AAC',       // Brand Blue - Buttons, accents
  green: '#51AF43',      // Success Green
  cream: '#FFF0D4',      // Light backgrounds
  black: '#000000',
};

const FONTS = {
  heading: "'Montserrat', sans-serif",
  body: "'Poppins', sans-serif",
};

// Inject Google Fonts and Global Styles
if (typeof document !== 'undefined' && !document.getElementById('brewedops-fonts')) {
  const link = document.createElement('link');
  link.id = 'brewedops-fonts';
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Poppins:wght@400;500;600&display=swap';
  document.head.appendChild(link);
  
  // Add comprehensive base font styles
  const style = document.createElement('style');
  style.id = 'brewedops-global-styles';
  style.textContent = `
    * { 
      font-family: 'Poppins', sans-serif; 
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    h1, h2, h3, h4, h5, h6 { 
      font-family: 'Montserrat', sans-serif; 
    }
    button, input, select, textarea {
      font-family: 'Poppins', sans-serif;
    }
    @keyframes spin { 
      from { transform: rotate(0deg); } 
      to { transform: rotate(360deg); } 
    }
    /* Brand text helper classes */
    .brand-heading { font-family: 'Montserrat', sans-serif; }
    .brand-body { font-family: 'Poppins', sans-serif; }
    .brand-text-brown { color: #3F200C; }
    .brand-text-blue { color: #004AAC; }
    .brand-text-green { color: #51AF43; }
  `;
  document.head.appendChild(style);
}

// Extracted components and utilities
import VAKita from './components/VAKita';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import AboutUs from './components/AboutUs';
import ResetPassword from './components/ResetPassword';
import AdminDashboard from './components/AdminDashboard';
import {
  CATEGORIES,
  CURRENCIES,
  WALLET_TYPES,
  DEFAULT_WALLETS,
  XP_CONFIG,
  LEVEL_THRESHOLDS,
  PROFILE_FRAMES,
  BADGE_TIERS,
  ACHIEVEMENT_CATEGORIES,
  ACHIEVEMENTS,
  WEEKLY_CHALLENGES,
} from './lib/constants';
import { getTheme } from './lib/theme';
import {
  calculateLevel,
  getXPForNextLevel,
  getLevelProgress,
  getUnlockedFrames,
  getFrameById,
  getAnimatedFrameStyle,
  getAvatarInnerStyle,
  getTierStyle,
} from './lib/gamification';
import { useWindowSize } from './lib/hooks';
import { formatAmount, getInitial } from './lib/utils';


// Badge colors for light and dark mode (kept here as it's UI-specific styling)
const getBadgeStyle = (type, isDark) => {
  const darkStyles = {
    utilities: { bg: '#1e3a5f', color: '#60a5fa', border: '#2563eb' },
    subscription: { bg: '#001a40', color: '#3373c4', border: '#003d8f' },
    food: { bg: '#4a2c17', color: '#fb923c', border: '#ea580c' },
    shopping: { bg: '#4a1d3d', color: '#f472b6', border: '#db2777' },
    healthcare: { bg: '#134e3a', color: '#34d399', border: '#059669' },
    entertainment: { bg: '#4a3517', color: '#fbbf24', border: '#d97706' },
    other: { bg: '#27272a', color: '#a1a1aa', border: '#52525b' },
  };
  const lightStyles = {
    utilities: { bg: '#dbeafe', color: '#1d4ed8', border: '#93c5fd' },
    subscription: { bg: '#ede9fe', color: '#003380', border: '#c4b5fd' },
    food: { bg: '#ffedd5', color: '#c2410c', border: '#fdba74' },
    shopping: { bg: '#fce7f3', color: '#be185d', border: '#f9a8d4' },
    healthcare: { bg: '#d1fae5', color: '#047857', border: '#6ee7b7' },
    entertainment: { bg: '#fef3c7', color: '#b45309', border: '#fcd34d' },
    other: { bg: '#f4f4f5', color: '#52525b', border: '#d4d4d8' },
  };
  const styles = isDark ? darkStyles : lightStyles;
  return styles[type] || styles.other;
};

// ============================================
// HOME PAGE (Landing) - BrewedOps Brand Design
// ============================================

const HomePage = ({ onNavigate, isDark, setIsDark }) => {
  const theme = getTheme(isDark);
  const { width } = useWindowSize();
  const isMobile = width < 768;
  const isSmall = width < 480;

  const btnPrimary = {
    height: '48px',
    padding: '0 28px',
    backgroundColor: BRAND.blue,
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '600',
    fontFamily: FONTS.body,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'all 0.2s ease',
  };

  const btnOutline = {
    height: '48px',
    padding: '0 28px',
    backgroundColor: 'transparent',
    color: theme.text,
    border: '1px solid ' + theme.cardBorder,
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '500',
    fontFamily: FONTS.body,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
  };

  const features = [
    { icon: '💰', title: 'Income Tracking', desc: 'Track all your earnings in multiple currencies with automatic PHP conversion using live exchange rates' },
    { icon: '📊', title: 'Expense Management', desc: 'Categorize and monitor your expenses, set budgets, and see where your money goes' },
    { icon: '🎯', title: 'Lead Tracking', desc: 'Track prospects from LinkedIn, Upwork, OnlineJobsPH, and other platforms through your sales pipeline' },
    { icon: '👥', title: 'Client Management', desc: 'Manage clients with timezone tracking, billing rates, and payment platform preferences' },
    { icon: '🧾', title: 'Invoice Generation', desc: 'Create professional invoices and send them directly via Gmail integration' },
    { icon: '🌍', title: 'ClientClock', desc: 'See all client timezones at a glance and find the best meeting overlap hours' },
    { icon: '📈', title: 'BIR Tax Calculator', desc: 'Calculate quarterly taxes automatically - choose between 8% flat rate or graduated rates' },
    { icon: '🏆', title: 'Gamification', desc: 'Earn XP, level up, unlock achievements and stay motivated to reach your financial goals' },
  ];



  return (
    <div style={{ minHeight: '100vh', backgroundColor: isDark ? theme.bg : '#ffffff' }}>
      {/* Nav */}
      <nav style={{
        padding: isSmall ? '12px 16px' : '16px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid ' + theme.cardBorder,
        backgroundColor: isDark ? theme.bg : '#ffffff',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <img src="https://i.imgur.com/R52jwPv.png" alt="Logo" style={{ width: isSmall ? '32px' : '36px', height: isSmall ? '32px' : '36px', borderRadius: '8px' }} />
          <span style={{ fontSize: isSmall ? '18px' : '20px', fontWeight: '700', fontFamily: FONTS.heading }}>
            <span style={{ color: isDark ? '#fff' : BRAND.brown }}>Brewed</span>
            <span style={{ color: BRAND.blue }}>Ops</span>
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: isSmall ? '6px' : '8px' }}>
          {/* Privacy - hide on mobile */}
          {!isMobile && (
          <a 
            href="/privacy" 
            style={{ 
              height: '40px', 
              padding: '0 14px', 
              backgroundColor: 'transparent', 
              color: theme.textMuted, 
              border: 'none', 
              fontSize: '14px', 
              fontWeight: '500', 
              fontFamily: FONTS.body,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none'
            }}
          >
            Privacy
          </a>
          )}
          {/* About - hide on mobile */}
          {!isMobile && (
          <button 
            onClick={() => onNavigate('about')} 
            style={{ 
              height: '40px', 
              padding: '0 14px', 
              backgroundColor: 'transparent', 
              color: theme.textMuted, 
              border: 'none', 
              fontSize: '14px', 
              fontWeight: '500', 
              fontFamily: FONTS.body,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            About
          </button>
          )}
          {/* Dark/Light Mode */}
          <button onClick={() => setIsDark(!isDark)} style={{ width: isSmall ? '36px' : '40px', height: isSmall ? '36px' : '40px', backgroundColor: 'transparent', border: '1px solid ' + theme.cardBorder, borderRadius: '10px', color: theme.textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {isDark ? <Sun style={{ width: '18px', height: '18px' }} /> : <Moon style={{ width: '18px', height: '18px' }} />}
          </button>
          {/* Sign Up - always show */}
          <button 
            onClick={() => onNavigate('signup')} 
            style={{ 
              height: isSmall ? '36px' : '40px', 
              padding: isSmall ? '0 12px' : '0 16px', 
              backgroundColor: BRAND.blue, 
              color: '#fff', 
              border: 'none', 
              borderRadius: '10px',
              fontSize: '14px', 
              fontWeight: '600',
              fontFamily: FONTS.body,
              cursor: 'pointer',
              flexShrink: 0
            }}
          >
            Sign Up
          </button>
          {/* Login - always show */}
          <button 
            onClick={() => onNavigate('login')} 
            style={{ 
              height: isSmall ? '36px' : '40px', 
              padding: isSmall ? '0 12px' : '0 16px', 
              backgroundColor: 'transparent', 
              color: theme.text, 
              border: '1px solid ' + theme.cardBorder, 
              borderRadius: '10px',
              fontSize: '14px', 
              fontWeight: '500',
              fontFamily: FONTS.body,
              cursor: 'pointer',
              flexShrink: 0
            }}
          >
            Login
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: isSmall ? '48px 20px 56px' : '72px 32px 80px', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', backgroundColor: isDark ? BRAND.blue + '20' : BRAND.cream, borderRadius: '100px', marginBottom: '24px', border: isDark ? 'none' : '1px solid ' + BRAND.blue + '20' }}>
          <span style={{ fontSize: '13px', color: BRAND.blue, fontWeight: '600', fontFamily: FONTS.body }}>🇵🇭 Built for Filipino VAs & Freelancers</span>
        </div>
        
        <h1 style={{ fontSize: isSmall ? '32px' : '52px', fontWeight: '800', color: isDark ? '#fff' : BRAND.brown, margin: '0 0 16px', lineHeight: '1.1', letterSpacing: '-0.03em', fontFamily: FONTS.heading }}>
          Your Complete Financial
          <br />
          <span style={{ color: BRAND.blue }}>& Client Management Hub</span>
        </h1>
        
        <p style={{ fontSize: isSmall ? '16px' : '18px', color: theme.textMuted, margin: '0 0 36px', lineHeight: '1.7', maxWidth: '650px', marginLeft: 'auto', marginRight: 'auto', fontFamily: FONTS.body }}>
          Track your income & expenses, manage clients across timezones, send professional invoices, 
          and calculate your BIR taxes — all in one powerful platform designed specifically for Filipino virtual assistants and freelancers.
        </p>
        
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => onNavigate('signup')} style={btnPrimary}>
            Start Free
            <ChevronRight style={{ width: '18px', height: '18px' }} />
          </button>
          <button onClick={() => onNavigate('login')} style={btnOutline}>
            Sign In
          </button>
        </div>
        
        {/* Privacy Policy link for Google OAuth compliance - must be easily visible */}
        <p style={{ fontSize: '13px', color: theme.textMuted, marginTop: '24px', fontFamily: FONTS.body }}>
          By signing up, you agree to our{' '}
          <a href="/terms" style={{ color: BRAND.blue, textDecoration: 'none', fontWeight: '500' }}>Terms of Service</a>
          {' '}and{' '}
          <a href="/privacy" style={{ color: BRAND.blue, textDecoration: 'none', fontWeight: '500' }}>Privacy Policy</a>
        </p>
      </section>

      {/* What is BrewedOps */}
      <section style={{ padding: isSmall ? '48px 20px' : '64px 32px', backgroundColor: isDark ? '#0a0a0b' : BRAND.cream, borderTop: '1px solid ' + theme.cardBorder }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: isSmall ? '24px' : '36px', fontWeight: '700', color: isDark ? '#fff' : BRAND.brown, margin: '0 0 16px', letterSpacing: '-0.02em', fontFamily: FONTS.heading }}>
            What is BrewedOps?
          </h2>
          <p style={{ fontSize: '16px', color: theme.textMuted, margin: '0 0 32px', lineHeight: '1.8', maxWidth: '700px', marginLeft: 'auto', marginRight: 'auto', fontFamily: FONTS.body }}>
            BrewedOps is an all-in-one financial tracking and client management system built specifically for 
            Filipino Virtual Assistants and Freelancers. Whether you're managing multiple international clients, 
            tracking income in different currencies, or preparing for your quarterly BIR tax filing — BrewedOps 
            has everything you need to run your freelance business professionally.
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: isSmall ? '1fr' : 'repeat(2, 1fr)', gap: '20px', textAlign: 'left' }}>
            <div style={{ padding: '24px', backgroundColor: isDark ? theme.cardBg : '#fff', borderRadius: '12px', border: '1px solid ' + theme.cardBorder }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{ width: '44px', height: '44px', backgroundColor: isDark ? BRAND.green + '20' : BRAND.green + '15', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '22px' }}>💵</span>
                </div>
                <h3 style={{ fontSize: '17px', fontWeight: '600', color: isDark ? '#fff' : BRAND.brown, margin: 0, fontFamily: FONTS.heading }}>Financial Tracking</h3>
              </div>
              <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0, lineHeight: '1.6', fontFamily: FONTS.body }}>
                Monitor all your income streams and expenses. Support for multiple currencies (USD, EUR, GBP, AUD) 
                with automatic PHP conversion using live exchange rates. Categorize transactions, set budgets, 
                and get insights into your financial health.
              </p>
            </div>
            
            <div style={{ padding: '24px', backgroundColor: isDark ? theme.cardBg : '#fff', borderRadius: '12px', border: '1px solid ' + theme.cardBorder }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{ width: '44px', height: '44px', backgroundColor: isDark ? BRAND.blue + '20' : BRAND.blue + '15', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '22px' }}>👥</span>
                </div>
                <h3 style={{ fontSize: '17px', fontWeight: '600', color: isDark ? '#fff' : BRAND.brown, margin: 0, fontFamily: FONTS.heading }}>VA Client Management</h3>
              </div>
              <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0, lineHeight: '1.6', fontFamily: FONTS.body }}>
                Manage your entire client pipeline from lead to paying customer. Track prospects from job platforms, 
                store client details with timezone info, manage billing rates, and never miss a follow-up with 
                our prospecting pipeline.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: isSmall ? '48px 16px' : '64px 32px', borderBottom: '1px solid ' + theme.cardBorder, backgroundColor: isDark ? theme.bg : '#fff' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{ fontSize: isSmall ? '24px' : '36px', fontWeight: '700', color: isDark ? '#fff' : BRAND.brown, textAlign: 'center', margin: '0 0 12px', letterSpacing: '-0.02em', fontFamily: FONTS.heading }}>
            Everything You Need to Succeed
          </h2>
          <p style={{ fontSize: '15px', color: theme.textMuted, textAlign: 'center', margin: '0 0 40px', fontFamily: FONTS.body }}>
            Powerful tools designed specifically for Filipino VAs and freelancers
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: isSmall ? '1fr' : isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: '16px' }}>
            {features.map((f, i) => (
              <div key={i} style={{ backgroundColor: isDark ? theme.cardBg : '#fff', borderRadius: '12px', border: '1px solid ' + theme.cardBorder, padding: '20px', transition: 'all 0.2s ease' }}>
                <span style={{ fontSize: '28px', display: 'block', marginBottom: '12px' }}>{f.icon}</span>
                <h3 style={{ fontSize: '15px', fontWeight: '600', color: isDark ? '#fff' : BRAND.brown, margin: '0 0 6px', fontFamily: FONTS.heading }}>{f.title}</h3>
                <p style={{ fontSize: '13px', color: theme.textMuted, margin: 0, lineHeight: '1.5', fontFamily: FONTS.body }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: isSmall ? '48px 20px' : '64px 32px', maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{ fontSize: isSmall ? '24px' : '36px', fontWeight: '700', color: isDark ? '#fff' : BRAND.brown, textAlign: 'center', margin: '0 0 40px', letterSpacing: '-0.02em', fontFamily: FONTS.heading }}>
          How It Works
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {[
            { num: '1', title: 'Sign Up for Free', desc: 'Create your account in seconds and start exploring all features immediately' },
            { num: '2', title: 'Add Your Clients & Income', desc: 'Import your existing clients, track prospects, and record your income from various platforms' },
            { num: '3', title: 'Send Invoices & Track Taxes', desc: 'Generate professional invoices, send via Gmail, and let BrewedOps calculate your quarterly BIR taxes' },
            { num: '4', title: 'Level Up & Grow', desc: 'Earn XP for your activities, unlock achievements, and watch your freelance business thrive' },
          ].map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: BRAND.blue, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: '700', flexShrink: 0, fontFamily: FONTS.heading }}>{step.num}</div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: isDark ? '#fff' : BRAND.brown, margin: '0 0 4px', fontFamily: FONTS.heading }}>{step.title}</h3>
                <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0, fontFamily: FONTS.body }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: isSmall ? '0 16px 48px' : '0 32px 64px', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ backgroundColor: BRAND.brown, borderRadius: '16px', padding: isSmall ? '40px 24px' : '48px', textAlign: 'center' }}>
          <h2 style={{ fontSize: isSmall ? '24px' : '28px', fontWeight: '700', color: '#fafafa', margin: '0 0 12px', fontFamily: FONTS.heading }}>
            Ready to Take Control of Your Finances?
          </h2>
          <p style={{ fontSize: '15px', color: '#d4d4d8', margin: '0 0 24px', fontFamily: FONTS.body }}>
            Join Filipino VAs and freelancers who are managing their business smarter with BrewedOps
          </p>
          <button onClick={() => onNavigate('signup')} style={{ height: '48px', padding: '0 32px', backgroundColor: BRAND.green, color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', fontFamily: FONTS.body, transition: 'all 0.2s ease' }}>
            Get Started — It's Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '24px 20px', borderTop: '1px solid ' + theme.cardBorder, textAlign: 'center', backgroundColor: isDark ? theme.bg : '#fff' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginBottom: '12px', flexWrap: 'wrap' }}>
          <a 
            href="/privacy"
            style={{ 
              color: theme.textMuted, 
              fontSize: '13px', 
              textDecoration: 'none',
              padding: '4px 0',
              fontFamily: FONTS.body,
            }}
            onMouseEnter={(e) => e.target.style.color = BRAND.blue}
            onMouseLeave={(e) => e.target.style.color = theme.textMuted}
          >
            Privacy Policy
          </a>
          <a 
            href="/terms"
            style={{ 
              color: theme.textMuted, 
              fontSize: '13px', 
              textDecoration: 'none',
              padding: '4px 0',
              fontFamily: FONTS.body,
            }}
            onMouseEnter={(e) => e.target.style.color = '#004AAC'}
            onMouseLeave={(e) => e.target.style.color = theme.textMuted}
          >
            Terms of Service
          </a>
          <a 
            href="/about"
            style={{ 
              color: theme.textMuted, 
              fontSize: '13px', 
              textDecoration: 'none',
              padding: '4px 0'
            }}
            onMouseEnter={(e) => e.target.style.color = '#004AAC'}
            onMouseLeave={(e) => e.target.style.color = theme.textMuted}
          >
            About Us
          </a>
          <a 
            href="mailto:brewedops@gmail.com"
            style={{ 
              color: theme.textMuted, 
              fontSize: '13px', 
              textDecoration: 'none',
              padding: '4px 0'
            }}
            onMouseEnter={(e) => e.target.style.color = '#004AAC'}
            onMouseLeave={(e) => e.target.style.color = theme.textMuted}
          >
            Contact
          </a>
        </div>
        <p style={{ fontSize: '13px', color: theme.textMuted, margin: 0 }}>© 2025 BrewedOps by Kenneth V.</p>
      </footer>
    </div>
  );
};

// ============================================
// LOGIN PAGE
// ============================================
const LoginPage = ({ onLogin, onBack, isDark, setIsDark, initialMode = 'login' }) => {
  const [isSignup, setIsSignup] = useState(initialMode === 'signup');
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const theme = getTheme(isDark);
  const { width } = useWindowSize();
  const isMobile = width < 480;

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) => {
    const issues = [];
    if (password.length < 8) issues.push('8+ chars');
    if (!/[A-Z]/.test(password)) issues.push('uppercase');
    if (!/[a-z]/.test(password)) issues.push('lowercase');
    if (!/[0-9]/.test(password)) issues.push('number');
    return issues;
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setErrors({});
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });
      if (error) throw error;
    } catch (e) {
      setErrors({ general: e.message || 'Google sign-in failed' });
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setErrors({});
    setSuccessMessage('');
    
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!validateEmail(email)) newErrors.email = 'Invalid email';
    if (isSignup && !nickname.trim()) newErrors.nickname = 'Nickname is required';
    if (!password) newErrors.password = 'Password is required';
    else if (isSignup) {
      const issues = validatePassword(password);
      if (issues.length > 0) newErrors.password = `Need: ${issues.join(', ')}`;
    }
    if (isSignup && !confirmPassword) newErrors.confirmPassword = 'Confirm password';
    else if (isSignup && password !== confirmPassword) newErrors.confirmPassword = 'Passwords don\'t match';

    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); setLoading(false); return; }

    try {
      if (isSignup) {
        const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { nickname: nickname.trim() } } });
        if (error) throw error;
        if (data.user && !data.session) { setSuccessMessage('Check your email to confirm!'); setLoading(false); }
        else if (data.user) { setSuccessMessage('Account created!'); onLogin(data.user); }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        const { data: adminData } = await supabase.from('admins').select('id').eq('id', data.user.id).single();
        onLogin(adminData ? { ...data.user, isAdmin: true } : data.user);
      }
    } catch (e) { setErrors({ general: e.message || 'Something went wrong' }); setLoading(false); }
  };

  const handleForgotPassword = async () => {
    if (!email) { setErrors({ email: 'Enter email first' }); return; }
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
      if (error) throw error;
      setSuccessMessage('Reset link sent!');
    } catch (e) { setErrors({ general: e.message }); }
    finally { setLoading(false); }
  };

  const switchMode = () => { setIsSignup(!isSignup); setErrors({}); setSuccessMessage(''); setPassword(''); setConfirmPassword(''); setNickname(''); };

  const inputStyle = (hasError) => ({
    width: '100%',
    height: '48px',
    backgroundColor: theme.inputBg,
    border: `1px solid ${hasError ? '#ef4444' : theme.inputBorder}`,
    borderRadius: '10px',
    padding: '0 14px',
    fontSize: '15px',
    fontFamily: FONTS.body,
    color: theme.text,
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s ease',
  });

  // Google Icon SVG
  const GoogleIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: isDark ? theme.bg : '#ffffff', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {onBack ? (
          <button onClick={onBack} style={{ height: '40px', padding: '0 14px', backgroundColor: 'transparent', border: '1px solid ' + theme.cardBorder, borderRadius: '10px', color: theme.text, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontFamily: FONTS.body }}>
            <ChevronLeft style={{ width: '18px', height: '18px' }} />
            Back
          </button>
        ) : <div />}
        <button onClick={() => setIsDark(!isDark)} style={{ width: '40px', height: '40px', backgroundColor: 'transparent', border: '1px solid ' + theme.cardBorder, borderRadius: '10px', color: theme.textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {isDark ? <Sun style={{ width: '18px', height: '18px' }} /> : <Moon style={{ width: '18px', height: '18px' }} />}
        </button>
      </div>

      {/* Form Container */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ width: '100%', maxWidth: '380px' }}>
          {/* Logo & Title */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <img src="https://i.imgur.com/R52jwPv.png" alt="Logo" style={{ width: '64px', height: '64px', borderRadius: '14px', marginBottom: '16px' }} />
            <h1 style={{ fontSize: '26px', fontWeight: '700', color: isDark ? '#fff' : BRAND.brown, margin: '0 0 6px', fontFamily: FONTS.heading }}>
              {isSignup ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0, fontFamily: FONTS.body }}>
              {isSignup ? 'Start managing your VA business' : 'Sign in to continue'}
            </p>
          </div>

          {/* Messages */}
          {errors.general && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 14px', backgroundColor: isDark ? '#451a1a' : '#fef2f2', border: '1px solid ' + (isDark ? '#7f1d1d' : '#fecaca'), borderRadius: '10px', marginBottom: '16px' }}>
              <AlertCircle style={{ width: '16px', height: '16px', color: '#ef4444', flexShrink: 0 }} />
              <span style={{ fontSize: '13px', color: isDark ? '#fca5a5' : '#dc2626', fontFamily: FONTS.body }}>{errors.general}</span>
            </div>
          )}
          {successMessage && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 14px', backgroundColor: isDark ? '#052e16' : '#f0fdf4', border: '1px solid ' + (isDark ? '#166534' : '#86efac'), borderRadius: '10px', marginBottom: '16px' }}>
              <Check style={{ width: '16px', height: '16px', color: BRAND.green, flexShrink: 0 }} />
              <span style={{ fontSize: '13px', color: isDark ? '#86efac' : '#166534', fontFamily: FONTS.body }}>{successMessage}</span>
            </div>
          )}

          {/* Google Sign In Button */}
          <button onClick={handleGoogleSignIn} disabled={googleLoading || loading} style={{ width: '100%', height: '48px', backgroundColor: isDark ? theme.cardBg : '#fff', color: theme.text, border: '1px solid ' + theme.cardBorder, borderRadius: '10px', fontSize: '15px', fontWeight: '500', fontFamily: FONTS.body, cursor: (googleLoading || loading) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '20px', opacity: (googleLoading || loading) ? 0.7 : 1, transition: 'all 0.2s ease' }}>
            {googleLoading ? <Loader2 style={{ width: '18px', height: '18px', animation: 'spin 1s linear infinite' }} /> : <GoogleIcon />}
            {googleLoading ? 'Connecting...' : (isSignup ? 'Sign up with Google' : 'Continue with Google')}
          </button>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: theme.cardBorder }} />
            <span style={{ fontSize: '13px', color: theme.textMuted, fontFamily: FONTS.body }}>or</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: theme.cardBorder }} />
          </div>

          {/* Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: theme.textMuted, marginBottom: '6px', fontFamily: FONTS.body }}>Email</label>
              <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setErrors({ ...errors, email: '' }); }} onKeyDown={(e) => e.key === 'Enter' && handleSubmit()} placeholder="you@example.com" style={inputStyle(errors.email)} />
              {errors.email && <p style={{ fontSize: '12px', color: '#ef4444', margin: '6px 0 0', fontFamily: FONTS.body }}>{errors.email}</p>}
            </div>

            {isSignup && (
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: theme.textMuted, marginBottom: '6px', fontFamily: FONTS.body }}>Nickname</label>
                <input type="text" value={nickname} onChange={(e) => { setNickname(e.target.value); setErrors({ ...errors, nickname: '' }); }} placeholder="What should we call you?" style={inputStyle(errors.nickname)} />
                {errors.nickname && <p style={{ fontSize: '12px', color: '#ef4444', margin: '6px 0 0', fontFamily: FONTS.body }}>{errors.nickname}</p>}
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: theme.textMuted, marginBottom: '6px', fontFamily: FONTS.body }}>Password</label>
              <input type="password" value={password} onChange={(e) => { setPassword(e.target.value); setErrors({ ...errors, password: '' }); }} onKeyDown={(e) => e.key === 'Enter' && !isSignup && handleSubmit()} placeholder={isSignup ? 'Min 8 chars, upper, lower, number' : '••••••••'} style={inputStyle(errors.password)} />
              {errors.password && <p style={{ fontSize: '12px', color: '#ef4444', margin: '6px 0 0', fontFamily: FONTS.body }}>{errors.password}</p>}
            </div>

            {isSignup && (
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: theme.textMuted, marginBottom: '6px', fontFamily: FONTS.body }}>Confirm Password</label>
                <input type="password" value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value); setErrors({ ...errors, confirmPassword: '' }); }} onKeyDown={(e) => e.key === 'Enter' && handleSubmit()} placeholder="••••••••" style={inputStyle(errors.confirmPassword)} />
                {errors.confirmPassword && <p style={{ fontSize: '12px', color: '#ef4444', margin: '6px 0 0', fontFamily: FONTS.body }}>{errors.confirmPassword}</p>}
              </div>
            )}

            <button onClick={handleSubmit} disabled={loading || googleLoading} style={{ width: '100%', height: '48px', backgroundColor: BRAND.blue, color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '600', fontFamily: FONTS.body, cursor: (loading || googleLoading) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: (loading || googleLoading) ? 0.7 : 1, marginTop: '6px', transition: 'all 0.2s ease' }}>
              {loading ? <><Loader2 style={{ width: '18px', height: '18px', animation: 'spin 1s linear infinite' }} />{isSignup ? 'Creating...' : 'Signing in...'}</> : (isSignup ? 'Create Account' : 'Sign In')}
            </button>

            {!isSignup && (
              <button onClick={handleForgotPassword} disabled={loading} style={{ background: 'none', border: 'none', color: theme.textMuted, fontSize: '13px', fontFamily: FONTS.body, cursor: 'pointer', padding: 0, textAlign: 'center' }}>
                Forgot password?
              </button>
            )}
          </div>

          {/* Switch Mode */}
          <p style={{ textAlign: 'center', fontSize: '14px', color: theme.textMuted, marginTop: '24px', fontFamily: FONTS.body }}>
            {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button onClick={switchMode} style={{ background: 'none', border: 'none', color: BRAND.blue, fontWeight: '600', cursor: 'pointer', fontFamily: FONTS.body }}>
              {isSignup ? 'Sign in' : 'Sign up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

// ============================================
// MAIN APP
// ============================================
const ExpenseTrackerApp = ({ user, onLogout, isDark, setIsDark }) => {
  // URL routing hooks
  const navigate = useNavigate();
  const location = useLocation();
  
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState(() => {
    const saved = localStorage.getItem('currency');
    return saved || '₱';
  });
 const [monthlyBudget, setMonthlyBudget] = useState(() => {
    const saved = localStorage.getItem('monthlyBudget');
    return saved ? parseFloat(saved) : 0;
  });
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [budgetInput, setBudgetInput] = useState(''); 

  const theme = getTheme(isDark);
  const { width } = useWindowSize();
  const isMobile = width < 1024;  // Account for sidebar width
  const isSmall = width < 768;    // Account for sidebar width
  
  // Form states
  const [uploadMode, setUploadMode] = useState('file');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [manualForm, setManualForm] = useState({ name: '', amount: '', date: '', dueDate: '', notes: '', recurring: '', walletId: '' });
  const [uploadedFile, setUploadedFile] = useState(null);
  const [pendingUpload, setPendingUpload] = useState(null);
  const [csvPreview, setCsvPreview] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadError, setUploadError] = useState('');
  
  // Filter states
  const [historyFilter, setHistoryFilter] = useState('All');
  const [historySearch, setHistorySearch] = useState('');
  const [dashboardView, setDashboardView] = useState('Month');
  const [dashboardCategory, setDashboardCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardSubTab, setDashboardSubTab] = useState('add-entry');
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [advancedDateFrom, setAdvancedDateFrom] = useState('');
  const [advancedDateTo, setAdvancedDateTo] = useState('');
  const [advancedCategory, setAdvancedCategory] = useState('all');
  
  // Analytics filter states
  const [analyticsShowFilter, setAnalyticsShowFilter] = useState(false);
  const [analyticsDateFrom, setAnalyticsDateFrom] = useState('');
  const [analyticsDateTo, setAnalyticsDateTo] = useState('');
  const [analyticsCategory, setAnalyticsCategory] = useState('all');
  const [analyticsCompareMonth, setAnalyticsCompareMonth] = useState('');
  
  // Modal state
  const [previewFile, setPreviewFile] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [editNickname, setEditNickname] = useState(user.user_metadata?.nickname || '');
  const [deletingEntry, setDeletingEntry] = useState(null);
  const [editingEntry, setEditingEntry] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState(null);
  
  // Profile Picture State - loads from user metadata (Supabase)
  const [profilePicture, setProfilePicture] = useState(user.user_metadata?.profile_picture || null);
  const [isUploadingPicture, setIsUploadingPicture] = useState(false);
  const fileInputRef = useRef(null);
  
  // Ref to track loaded achievements (prevents race conditions)
  const loadedAchievementsRef = useRef([]);
  
  // Ref to track loaded XP (prevents race conditions)
  const loadedXPRef = useRef(0);
  
  // XP and Level System
  const [userXP, setUserXP] = useState(0);
  const [selectedFrame, setSelectedFrame] = useState('none');
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [levelUpData, setLevelUpData] = useState(null);
  const [showRewardsModal, setShowRewardsModal] = useState(false);
  const [userDataLoaded, setUserDataLoaded] = useState(false);
  
  // Achievements & Badges System
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [showAchievementUnlock, setShowAchievementUnlock] = useState(false);
  const [newAchievement, setNewAchievement] = useState(null);
  const [showAchievementsModal, setShowAchievementsModal] = useState(false);
  
  // Streaks & Daily Check-ins
  const [currentStreak, setCurrentStreak] = useState(0);
  const [lastLoginDate, setLastLoginDate] = useState(null);
  const [todayEntryLogged, setTodayEntryLogged] = useState(false);
  const [checkedInToday, setCheckedInToday] = useState(false);
  
  // Weekly Challenge
  const [weeklyChallenge, setWeeklyChallenge] = useState(() => {
    // Generate default weekly challenge
    const randomChallenge = WEEKLY_CHALLENGES[Math.floor(Math.random() * WEEKLY_CHALLENGES.length)];
    return {
      ...randomChallenge,
      startDate: new Date().toISOString(),
      progress: 0,
      completed: false
    };
  });
  
  // Budget streak tracking
  const [budgetStreakMonths, setBudgetStreakMonths] = useState(0);
  
  // Sidebar State
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // URL-based routing for sections
  // (navigate and location are declared at the top of the component)
  
  // Derive activeSection from URL path
  const getActiveSectionFromPath = (pathname) => {
    switch (pathname) {
      case '/vakita': return 'vakita';
      case '/taskmanager': return 'taskmanager';
      case '/pdfeditor': return 'pdfeditor';
      case '/bgremover': return 'bgremover';
      case '/imagecropper': return 'imagecropper';
      case '/imageconverter': return 'imageconverter';
      case '/imagecompressor': return 'imagecompressor';
      case '/imageresizer': return 'imageresizer';
      case '/qrgenerator': return 'qrgenerator';
      case '/colorpicker': return 'colorpicker';
      case '/imagetotext': return 'imagetotext';
      case '/pdfmerge': return 'pdfmerge';
      case '/pdfsplit': return 'pdfsplit';
      case '/imagetopdf': return 'imagetopdf';
      case '/videocompressor': return 'videocompressor';
      case '/videotrimmer': return 'videotrimmer';
      default: return 'dashboard';
    }
  };
  
  const activeSection = getActiveSectionFromPath(location.pathname);
  
  // Navigation function that updates URL
  const setActiveSection = (section) => {
    switch (section) {
      case 'vakita': navigate('/vakita'); break;
      case 'taskmanager': navigate('/taskmanager'); break;
      case 'tasks': navigate('/taskmanager'); break;
      case 'pdfeditor': navigate('/pdfeditor'); break;
      case 'bgremover': navigate('/bgremover'); break;
      case 'imagecropper': navigate('/imagecropper'); break;
      case 'imageconverter': navigate('/imageconverter'); break;
      case 'imagecompressor': navigate('/imagecompressor'); break;
      case 'imageresizer': navigate('/imageresizer'); break;
      case 'qrgenerator': navigate('/qrgenerator'); break;
      case 'colorpicker': navigate('/colorpicker'); break;
      case 'imagetotext': navigate('/imagetotext'); break;
      case 'pdfmerge': navigate('/pdfmerge'); break;
      case 'pdfsplit': navigate('/pdfsplit'); break;
      case 'imagetopdf': navigate('/imagetopdf'); break;
      case 'videocompressor': navigate('/videocompressor'); break;
      case 'videotrimmer': navigate('/videotrimmer'); break;
      default: navigate('/'); break;
    }
  };
  
  // Multi-Wallet System
  const [wallets, setWallets] = useState([]);
  const [showAddFundsModal, setShowAddFundsModal] = useState(false);
  const [selectedWalletForFunds, setSelectedWalletForFunds] = useState(null);
  const [fundsAmount, setFundsAmount] = useState('');
  const [fundsNote, setFundsNote] = useState('');
  const [walletTransactions, setWalletTransactions] = useState(() => {
    const saved = localStorage.getItem(`walletTransactions_${user.id}`);
    return saved ? JSON.parse(saved) : [];
  });
  const [showEditWalletModal, setShowEditWalletModal] = useState(false);
  const [editingWallet, setEditingWallet] = useState(null);
  const [editWalletName, setEditWalletName] = useState('');
  
  // Wallet tab filters
  const [walletTransactionFilter, setWalletTransactionFilter] = useState('all'); // For transaction history
  const [walletSearch, setWalletSearch] = useState('');
  const [walletDateFrom, setWalletDateFrom] = useState('');
  const [walletDateTo, setWalletDateTo] = useState('');
  const [showWalletAdvancedFilter, setShowWalletAdvancedFilter] = useState(false);
  
  // Featured wallet per type (the one shown larger)
  const [featuredWallets, setFeaturedWallets] = useState({
    cash: null,
    ewallet: null,
    bank: null,
    credit: null
  });
  
  // Add Wallet Modal states
  const [showAddWalletModal, setShowAddWalletModal] = useState(false);
  const [selectedWalletType, setSelectedWalletType] = useState(null);
  const [newWalletName, setNewWalletName] = useState('');
  const [newWalletIcon, setNewWalletIcon] = useState('');
  const [newWalletColor, setNewWalletColor] = useState('');
  const [showDeleteWalletConfirm, setShowDeleteWalletConfirm] = useState(false);
  const [walletToDelete, setWalletToDelete] = useState(null);
  
  // Withdraw Modal states
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [selectedWalletForWithdraw, setSelectedWalletForWithdraw] = useState(null);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawNote, setWithdrawNote] = useState('');
  
  // Clear all wallets state
  const [showClearAllWalletsConfirm, setShowClearAllWalletsConfirm] = useState(false);
  const [clearWalletsConfirmText, setClearWalletsConfirmText] = useState('');
  
  // Bulk delete states
  const [selectedEntries, setSelectedEntries] = useState([]);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  const [showClearAllConfirm, setShowClearAllConfirm] = useState(false);
  const [clearEntriesConfirmText, setClearEntriesConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Auto-hide toast after 3 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

   // Save currency preference
  useEffect(() => {
    localStorage.setItem('currency', currency);
  }, [currency]);
// Save budget preference
  useEffect(() => {
    localStorage.setItem('monthlyBudget', monthlyBudget.toString());
  }, [monthlyBudget]);

// Warn before leaving with unsaved changes
  useEffect(() => {
    const hasUnsavedChanges = 
      pendingUpload !== null || 
      manualForm.name.trim() !== '' || 
      manualForm.amount !== '' ||
      uploadedFile !== null;

    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    if (hasUnsavedChanges) {
      window.addEventListener('beforeunload', handleBeforeUnload);
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [pendingUpload, manualForm.name, manualForm.amount, uploadedFile]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Save XP to localStorage
  useEffect(() => {
    localStorage.setItem(`userXP_${user.id}`, userXP.toString());
  }, [userXP, user.id]);

  // Save selected frame to localStorage
  useEffect(() => {
    localStorage.setItem(`selectedFrame_${user.id}`, selectedFrame);
  }, [selectedFrame, user.id]);

  // ============================================
  // SUPABASE DATA LOADING & SAVING
  // ============================================

  // Load all user data from Supabase on mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Load user profile
        const { data: profileData, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Error loading profile:', profileError);
        }

        if (profileData) {
          const loadedXP = profileData.xp || 0;
          setUserXP(loadedXP);
          loadedXPRef.current = loadedXP; // Set ref immediately
          setSelectedFrame(profileData.selected_frame || 'none');
          setCurrentStreak(profileData.current_streak || 0);
          setLastLoginDate(profileData.last_login_date || null);
          setTodayEntryLogged(profileData.today_entry_logged || false);
          setBudgetStreakMonths(profileData.budget_streak_months || 0);
          if (profileData.weekly_challenge) {
            // Check if it's still the same week
            const challengeWeek = getWeekNumber(new Date(profileData.weekly_challenge.startDate));
            const currentWeek = getWeekNumber(new Date());
            if (challengeWeek === currentWeek) {
              setWeeklyChallenge(profileData.weekly_challenge);
            }
          }
        } else {
          // Create initial profile
          await supabase.from('user_profiles').insert([{
            user_id: user.id,
            xp: 0,
            selected_frame: 'none',
            current_streak: 0,
            budget_streak_months: 0
          }]);
        }

        // Load achievements
        const { data: achievementsData, error: achievementsError } = await supabase
          .from('user_achievements')
          .select('achievement_id')
          .eq('user_id', user.id);

        if (achievementsError) {
          console.error('Error loading achievements:', achievementsError);
        } else if (achievementsData) {
          const achievementIds = achievementsData.map(a => a.achievement_id);
          setUnlockedAchievements(achievementIds);
          // Also set ref immediately to prevent race conditions
          loadedAchievementsRef.current = achievementIds;
        }

        // Load wallets
        const { data: walletsData, error: walletsError } = await supabase
          .from('wallets')
          .select('*')
          .eq('user_id', user.id)
          .order('wallet_id');

        if (walletsError) {
          console.error('Error loading wallets:', walletsError);
          // Don't create defaults on error - just use empty array
          // User can add wallets manually
        } else if (walletsData && walletsData.length > 0) {
          console.log('Loaded wallets from Supabase:', walletsData);
          setWallets(walletsData.map(w => ({
            id: w.wallet_id,
            name: w.name,
            icon: w.icon,
            color: w.color,
            type: w.type,
            balance: parseFloat(w.balance) || 0,
            editable: w.editable !== false // default to true if not set
          })));
        } else {
          // No wallets exist - create default Cash wallet only
          console.log('No wallets found, creating default Cash wallet');
          const defaultWallets = DEFAULT_WALLETS.map(w => ({
            user_id: user.id,
            wallet_id: w.id,
            name: w.name,
            icon: w.icon,
            color: w.color,
            type: w.type,
            balance: 0,
            editable: w.editable || false
          }));
          
          const { error: insertError } = await supabase.from('wallets').insert(defaultWallets);
          if (insertError) {
            console.error('Error creating default wallets:', insertError);
          }
          setWallets(DEFAULT_WALLETS.map(w => ({ ...w, balance: 0 })));
        }

        // Load wallet transactions
        const { data: txData, error: txError } = await supabase
          .from('wallet_transactions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (txError) {
          console.error('Error loading transactions:', txError);
        } else if (txData) {
          setWalletTransactions(txData.map(tx => ({
            id: tx.id,
            walletId: tx.wallet_id,
            walletName: tx.wallet_name,
            type: tx.type,
            amount: parseFloat(tx.amount),
            note: tx.note,
            balance: parseFloat(tx.balance),
            date: tx.created_at
          })));
        }

        setUserDataLoaded(true);
      } catch (e) {
        console.error('Failed to load user data:', e);
        setUserDataLoaded(true);
      }
    };

    loadUserData();
  }, [user.id]);

  // Set featured wallet for each type (first wallet of each type by default)
  useEffect(() => {
    if (wallets.length > 0) {
      setFeaturedWallets(prev => {
        const newFeatured = { ...prev };
        ['cash', 'ewallet', 'bank', 'credit'].forEach(type => {
          const typeWallets = wallets.filter(w => w.type === type);
          // If no featured wallet set, or current featured doesn't exist anymore, set first one
          if (!prev[type] || !typeWallets.find(w => w.id === prev[type])) {
            newFeatured[type] = typeWallets.length > 0 ? typeWallets[0].id : null;
          }
        });
        return newFeatured;
      });
    }
  }, [wallets]);

  // Save user profile to Supabase (debounced)
  useEffect(() => {
    if (!userDataLoaded) return;
    
    const saveProfile = async () => {
      try {
        await supabase
          .from('user_profiles')
          .upsert({
            user_id: user.id,
            xp: userXP,
            selected_frame: selectedFrame,
            current_streak: currentStreak,
            last_login_date: lastLoginDate,
            today_entry_logged: todayEntryLogged,
            today_entry_date: new Date().toDateString(),
            budget_streak_months: budgetStreakMonths,
            weekly_challenge: weeklyChallenge
          }, { onConflict: 'user_id' });
      } catch (e) {
        console.error('Failed to save profile:', e);
      }
    };

    const timeoutId = setTimeout(saveProfile, 1000);
    return () => clearTimeout(timeoutId);
  }, [userXP, selectedFrame, currentStreak, lastLoginDate, todayEntryLogged, budgetStreakMonths, weeklyChallenge, userDataLoaded, user.id]);

  // Save new achievements to Supabase (upsert to prevent duplicates)
  const saveAchievementToSupabase = async (achievementId) => {
    try {
      const { error } = await supabase
        .from('user_achievements')
        .upsert([{
          user_id: user.id,
          achievement_id: achievementId
        }], { 
          onConflict: 'user_id,achievement_id',
          ignoreDuplicates: true 
        });
      
      if (error && !error.message.includes('duplicate')) {
        console.error('Failed to save achievement:', error);
      }
    } catch (e) {
      console.error('Failed to save achievement:', e);
    }
  };

  // Save wallet balance to Supabase
  const saveWalletToSupabase = async (walletId, balance, name = null) => {
    try {
      const wallet = wallets.find(w => w.id === walletId);
      if (!wallet) return;
      
      // Use upsert to handle both insert and update cases
      const walletData = {
        user_id: user.id,
        wallet_id: walletId,
        name: name || wallet.name,
        icon: wallet.icon,
        color: wallet.color,
        type: wallet.type,
        balance: balance,
        editable: wallet.editable !== false
      };
      
      const { error } = await supabase
        .from('wallets')
        .upsert(walletData, { 
          onConflict: 'user_id,wallet_id'
        });
        
      if (error) {
        console.error('Error saving wallet:', error);
      } else {
        console.log('Wallet saved successfully:', walletId, 'Balance:', balance);
      }
    } catch (e) {
      console.error('Failed to save wallet:', e);
    }
  };

  // Save wallet transaction to Supabase
  const saveWalletTransactionToSupabase = async (transaction) => {
    try {
      await supabase.from('wallet_transactions').insert([{
        user_id: user.id,
        wallet_id: transaction.walletId,
        wallet_name: transaction.walletName,
        type: transaction.type,
        amount: transaction.amount,
        note: transaction.note,
        balance: transaction.balance
      }]);
    } catch (e) {
      console.error('Failed to save transaction:', e);
    }
  };

  // Check and update daily streak status on component mount
  useEffect(() => {
    if (!userDataLoaded) return;
    
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    
    // Check if already checked in today
    if (lastLoginDate === today) {
      setCheckedInToday(true);
    } else {
      setCheckedInToday(false);
      // Check if streak is broken (not yesterday and not today)
      if (lastLoginDate !== null && lastLoginDate !== yesterday) {
        // Streak was broken - reset to 0 (will become 1 when they check in)
        setCurrentStreak(0);
      }
    }
  }, [userDataLoaded, lastLoginDate]);

  // Handle daily check-in button click
  const handleDailyCheckIn = async () => {
    if (checkedInToday) return;
    
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    
    let newStreak = 1;
    
    if (lastLoginDate === yesterday) {
      // Consecutive day - extend streak
      newStreak = currentStreak + 1;
    }
    
    // Update local state
    setCurrentStreak(newStreak);
    setLastLoginDate(today);
    setCheckedInToday(true);
    
    // Save immediately to Supabase (don't wait for debounced save)
    try {
      await supabase
        .from('user_profiles')
        .upsert({
          user_id: user.id,
          current_streak: newStreak,
          last_login_date: today
        }, { onConflict: 'user_id' });
    } catch (e) {
      console.error('Failed to save check-in:', e);
    }
    
    awardXP(XP_CONFIG.dailyLogin, 'for daily check-in');
    
    // Check for week streak bonus
    if (newStreak % 7 === 0) {
      setTimeout(() => {
        awardXP(XP_CONFIG.weekStreak, 'for 7-day streak bonus!');
      }, 500);
    }
    
    showToast(`🔥 Day ${newStreak} streak! +${XP_CONFIG.dailyLogin} XP`, 'success');
  };

  // Helper function to get week number
  const getWeekNumber = (date) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  };

  // Function to check and unlock achievements
  // Keep refs in sync with state
  useEffect(() => {
    loadedAchievementsRef.current = unlockedAchievements;
  }, [unlockedAchievements]);
  
  useEffect(() => {
    loadedXPRef.current = userXP;
  }, [userXP]);
  
  const checkAchievements = (context = {}) => {
    if (!userDataLoaded) return;
    
    // Use refs for most up-to-date values
    const currentUnlocked = loadedAchievementsRef.current;
    const currentXP = loadedXPRef.current;
    const newUnlocks = [];
    
    ACHIEVEMENTS.forEach(achievement => {
      // Skip if already unlocked (check both state and ref)
      if (currentUnlocked.includes(achievement.id) || unlockedAchievements.includes(achievement.id)) return;
      
      let isUnlocked = false;
      const req = achievement.requirement;
      
      switch (req.type) {
        case 'entries':
          isUnlocked = entries.length >= req.count;
          break;
        case 'receipts':
          isUnlocked = entries.filter(e => e.file).length >= req.count;
          break;
        case 'budget_set':
          isUnlocked = monthlyBudget > 0;
          break;
        case 'under_budget_months':
          isUnlocked = budgetStreakMonths >= req.count;
          break;
        case 'login_streak':
          isUnlocked = currentStreak >= req.count;
          break;
        case 'categories_used':
          const usedCategories = new Set(entries.map(e => e.type));
          isUnlocked = usedCategories.size >= req.count;
          break;
        case 'single_expense':
          isUnlocked = entries.some(e => e.amount >= req.amount);
          break;
        case 'level':
          isUnlocked = calculateLevel(currentXP) >= req.count;
          break;
        case 'total_spent':
          const totalSpent = entries.reduce((sum, e) => sum + e.amount, 0);
          isUnlocked = totalSpent >= req.amount;
          break;
        case 'time_of_day':
          if (context.newEntry) {
            const hour = new Date().getHours();
            if (req.time === 'night') isUnlocked = hour >= 0 && hour < 5;
            if (req.time === 'early') isUnlocked = hour >= 4 && hour < 6;
          }
          break;
        case 'weekend_entries':
          const weekendEntries = entries.filter(e => {
            const day = new Date(e.date).getDay();
            return day === 0 || day === 6;
          });
          isUnlocked = weekendEntries.length >= req.count;
          break;
        case 'profile_picture':
          isUnlocked = profilePicture !== null;
          break;
        case 'frames_unlocked':
          isUnlocked = getUnlockedFrames(calculateLevel(currentXP)).length >= req.count;
          break;
        case 'achievements_unlocked':
          isUnlocked = unlockedAchievements.length >= req.count;
          break;
      }
      
      if (isUnlocked) {
        newUnlocks.push(achievement);
      }
    });
    
    // Process new unlocks
    if (newUnlocks.length > 0) {
      const newIds = newUnlocks.map(a => a.id);
      setUnlockedAchievements(prev => [...prev, ...newIds]);
      
      // Save achievements to Supabase
      newIds.forEach(id => saveAchievementToSupabase(id));
      
      // Award XP for each achievement
      newUnlocks.forEach(achievement => {
        const tier = getTierStyle(achievement.tier);
        awardXP(tier.xpReward, `for "${achievement.name}" badge!`);
      });
      
      // Show the first new achievement (can queue others)
      setNewAchievement(newUnlocks[0]);
      setShowAchievementUnlock(true);
    }
  };

  // Check achievements when relevant data changes
  // Use a ref to track if initial check has been done to prevent duplicate awards
  const initialAchievementCheckDone = useRef(false);
  
  useEffect(() => {
    // Don't check until data is fully loaded
    if (!userDataLoaded || loading) return;
    
    // Don't check if no entries yet (likely still loading)
    if (entries.length === 0) return;
    
    // Add a longer delay on initial load to ensure all state is settled
    if (!initialAchievementCheckDone.current) {
      const timer = setTimeout(() => {
        // Double-check that refs have been populated
        if (loadedAchievementsRef.current.length > 0 || loadedXPRef.current > 0) {
          initialAchievementCheckDone.current = true;
          checkAchievements();
        }
      }, 1000); // Increased to 1 second
      return () => clearTimeout(timer);
    } else {
      checkAchievements();
    }
  }, [entries.length, currentStreak, profilePicture, budgetStreakMonths, userDataLoaded, loading]);

  // Update weekly challenge progress
  const updateWeeklyChallengeProgress = (entry) => {
    if (weeklyChallenge.completed) return;
    
    let newProgress = weeklyChallenge.progress;
    let isCompleted = false;
    
    // Calculate progress based on challenge type
    if (weeklyChallenge.type === 'entries') {
      // Count entries this week
      const weekStart = getWeekStartDate(new Date());
      const weekEntries = entries.filter(e => new Date(e.date) >= weekStart);
      newProgress = weekEntries.length;
      isCompleted = newProgress >= weeklyChallenge.count;
    } else if (weeklyChallenge.type === 'receipts') {
      const weekStart = getWeekStartDate(new Date());
      const weekReceipts = entries.filter(e => e.file && new Date(e.date) >= weekStart);
      newProgress = weekReceipts.length;
      isCompleted = newProgress >= weeklyChallenge.count;
    } else if (weeklyChallenge.type === 'daily_log') {
      // Check if logged every day this week
      const weekStart = getWeekStartDate(new Date());
      const today = new Date();
      const daysLogged = new Set();
      entries.forEach(e => {
        const entryDate = new Date(e.date);
        if (entryDate >= weekStart) {
          daysLogged.add(entryDate.toDateString());
        }
      });
      const daysSinceWeekStart = Math.floor((today - weekStart) / 86400000) + 1;
      newProgress = daysLogged.size;
      isCompleted = daysLogged.size >= Math.min(daysSinceWeekStart, 7);
    } else if (weeklyChallenge.category) {
      // Category spending challenge
      const weekStart = getWeekStartDate(new Date());
      const categorySpent = entries
        .filter(e => e.type === weeklyChallenge.category && new Date(e.date) >= weekStart)
        .reduce((sum, e) => sum + e.amount, 0);
      newProgress = categorySpent;
      isCompleted = categorySpent <= weeklyChallenge.maxAmount;
    }
    
    if (isCompleted && !weeklyChallenge.completed) {
      setWeeklyChallenge(prev => ({ ...prev, progress: newProgress, completed: true }));
      awardXP(weeklyChallenge.xpReward, `for completing weekly challenge!`);
      showToast(`🎉 Weekly Challenge Complete! +${weeklyChallenge.xpReward} XP`, 'success');
    } else {
      setWeeklyChallenge(prev => ({ ...prev, progress: newProgress }));
    }
  };

  // Helper to get week start date (Monday)
  const getWeekStartDate = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  };

  // ============================================
  // MULTI-WALLET FUNCTIONS
  // ============================================

  // Add funds to a wallet
  const handleAddFunds = async () => {
    const amount = parseFloat(fundsAmount);
    if (isNaN(amount) || amount <= 0) {
      showToast('Please enter a valid amount', 'error');
      return;
    }

    // Update wallet balance
    const newBalance = selectedWalletForFunds.balance + amount;
    
    setWallets(prev => prev.map(w => 
      w.id === selectedWalletForFunds.id 
        ? { ...w, balance: newBalance }
        : w
    ));

    // Save to Supabase (await to ensure it's saved)
    await saveWalletToSupabase(selectedWalletForFunds.id, newBalance);

    // Add transaction record
    const transaction = {
      id: Date.now(),
      walletId: selectedWalletForFunds.id,
      walletName: selectedWalletForFunds.name,
      type: 'deposit',
      amount: amount,
      note: fundsNote || 'Added funds',
      date: new Date().toISOString(),
      balance: newBalance
    };
    setWalletTransactions(prev => [transaction, ...prev]);
    
    // Save transaction to Supabase
    await saveWalletTransactionToSupabase(transaction);

    showToast(`${currency}${amount.toLocaleString()} added to ${selectedWalletForFunds.name}`, 'success');
    setShowAddFundsModal(false);
    setFundsAmount('');
    setFundsNote('');
    setSelectedWalletForFunds(null);
  };

  // Handle withdraw/cashout from wallet
  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      showToast('Please enter a valid amount', 'error');
      return;
    }

    if (amount > selectedWalletForWithdraw.balance) {
      showToast('Insufficient balance', 'error');
      return;
    }

    // Update wallet balance
    const newBalance = selectedWalletForWithdraw.balance - amount;
    
    setWallets(prev => prev.map(w => 
      w.id === selectedWalletForWithdraw.id 
        ? { ...w, balance: newBalance }
        : w
    ));

    // Save to Supabase (await to ensure it's saved)
    await saveWalletToSupabase(selectedWalletForWithdraw.id, newBalance);

    // Add transaction record
    const transaction = {
      id: Date.now(),
      walletId: selectedWalletForWithdraw.id,
      walletName: selectedWalletForWithdraw.name,
      type: 'withdraw',
      amount: amount,
      note: withdrawNote || 'Withdrawal',
      date: new Date().toISOString(),
      balance: newBalance
    };
    setWalletTransactions(prev => [transaction, ...prev]);
    
    // Save transaction to Supabase
    await saveWalletTransactionToSupabase(transaction);

    showToast(`${currency}${amount.toLocaleString()} withdrawn from ${selectedWalletForWithdraw.name}`, 'success');
    setShowWithdrawModal(false);
    setWithdrawAmount('');
    setWithdrawNote('');
    setSelectedWalletForWithdraw(null);
  };

  // Deduct from wallet when expense is logged
  const deductFromWallet = async (walletId, amount, entryName) => {
    const wallet = wallets.find(w => w.id === walletId);
    if (!wallet) return;

    const newBalance = wallet.balance - amount;

    // Update wallet balance
    setWallets(prev => prev.map(w => 
      w.id === walletId 
        ? { ...w, balance: newBalance }
        : w
    ));

    // Save to Supabase
    await saveWalletToSupabase(walletId, newBalance);

    // Add transaction record
    const transaction = {
      id: Date.now(),
      walletId: walletId,
      walletName: wallet.name,
      type: 'expense',
      amount: -amount,
      note: entryName,
      date: new Date().toISOString(),
      balance: newBalance
    };
    setWalletTransactions(prev => [transaction, ...prev]);
    
    // Save transaction to Supabase
    await saveWalletTransactionToSupabase(transaction);
  };

  // Edit wallet name (for bank accounts)
  const handleEditWalletName = () => {
    if (!editWalletName.trim()) {
      showToast('Please enter a wallet name', 'error');
      return;
    }

    setWallets(prev => prev.map(w => 
      w.id === editingWallet.id 
        ? { ...w, name: editWalletName.trim() }
        : w
    ));

    // Save to Supabase
    saveWalletToSupabase(editingWallet.id, editingWallet.balance, editWalletName.trim());

    showToast('Wallet name updated', 'success');
    setShowEditWalletModal(false);
    setEditingWallet(null);
    setEditWalletName('');
  };

  // Add new wallet (max 4 per type for ewallet, bank, credit)
  const handleAddWallet = async (preset = null) => {
    const walletType = selectedWalletType;
    if (!walletType) return;

    // Check limit (4 max for ewallet, bank, credit)
    const typeWallets = wallets.filter(w => w.type === walletType.type);
    if (walletType.canAddMultiple && typeWallets.length >= 4) {
      showToast(`Maximum 4 ${walletType.label.toLowerCase()}s allowed`, 'error');
      return;
    }

    let name, icon, color;
    
    if (preset) {
      name = preset.name;
      icon = preset.icon;
      color = preset.color;
    } else {
      if (!newWalletName.trim()) {
        showToast('Please enter a wallet name', 'error');
        return;
      }
      name = newWalletName.trim();
      icon = newWalletIcon || walletType.icon;
      color = newWalletColor || walletType.color;
    }

    // Generate unique ID
    const walletId = `${walletType.type}_${Date.now()}`;

    const newWallet = {
      id: walletId,
      name: name,
      icon: icon,
      color: color,
      type: walletType.type,
      balance: 0,
      editable: true
    };

    // Add to local state
    setWallets(prev => [...prev, newWallet]);

    // Save to Supabase
    try {
      await supabase.from('wallets').insert([{
        user_id: user.id,
        wallet_id: walletId,
        name: name,
        icon: icon,
        color: color,
        type: walletType.type,
        balance: 0,
        editable: true
      }]);
    } catch (e) {
      console.error('Failed to save wallet:', e);
    }

    showToast(`${name} wallet added`, 'success');
    setShowAddWalletModal(false);
    setSelectedWalletType(null);
    setNewWalletName('');
    setNewWalletIcon('');
    setNewWalletColor('');
  };

  // Delete wallet
  const handleDeleteWallet = async () => {
    if (!walletToDelete) return;

    // Remove from local state
    setWallets(prev => prev.filter(w => w.id !== walletToDelete.id));

    // Delete from Supabase
    try {
      await supabase
        .from('wallets')
        .delete()
        .eq('user_id', user.id)
        .eq('wallet_id', walletToDelete.id);
      
      // Also delete related transactions
      await supabase
        .from('wallet_transactions')
        .delete()
        .eq('user_id', user.id)
        .eq('wallet_id', walletToDelete.id);
    } catch (e) {
      console.error('Failed to delete wallet:', e);
    }

    // Remove transactions from local state
    setWalletTransactions(prev => prev.filter(t => t.walletId !== walletToDelete.id));

    showToast(`${walletToDelete.name} deleted`, 'success');
    setShowDeleteWalletConfirm(false);
    setWalletToDelete(null);
  };

  // Clear all wallets and transactions
  const handleClearAllWallets = async () => {
    if (clearWalletsConfirmText.toLowerCase() !== 'delete') {
      showToast('Please type "delete" to confirm', 'error');
      return;
    }

    try {
      // Delete all wallet transactions
      await supabase
        .from('wallet_transactions')
        .delete()
        .eq('user_id', user.id);

      // Delete all wallets
      await supabase
        .from('wallets')
        .delete()
        .eq('user_id', user.id);

      // Clear local state
      setWallets([]);
      setWalletTransactions([]);
      setFeaturedWallets({ cash: null, ewallet: null, bank: null, credit: null });

      showToast('All wallets and transactions cleared', 'success');
    } catch (e) {
      console.error('Failed to clear wallets:', e);
      showToast('Failed to clear wallets', 'error');
    }

    setShowClearAllWalletsConfirm(false);
    setClearWalletsConfirmText('');
  };

  // Get wallets grouped by type
  const getWalletsByType = (type) => {
    return wallets.filter(w => w.type === type);
  };

  // Get total balance across all wallets
  const getTotalWalletBalance = () => {
    return wallets.reduce((sum, w) => sum + w.balance, 0);
  };

  // Get filtered wallet transactions
  const getFilteredWalletTransactions = () => {
    let filtered = walletTransactions;

    // Filter by wallet
    if (walletTransactionFilter !== 'all') {
      filtered = filtered.filter(t => t.walletId === walletTransactionFilter);
    }

    // Filter by search
    if (walletSearch.trim()) {
      const search = walletSearch.toLowerCase();
      filtered = filtered.filter(t => 
        t.note.toLowerCase().includes(search) ||
        t.walletName.toLowerCase().includes(search)
      );
    }

    // Filter by date range
    if (walletDateFrom) {
      filtered = filtered.filter(t => new Date(t.date) >= new Date(walletDateFrom));
    }
    if (walletDateTo) {
      const toDate = new Date(walletDateTo);
      toDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(t => new Date(t.date) <= toDate);
    }

    return filtered;
  };

  // Handle profile picture upload to Supabase Storage
  const handleProfilePictureUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showToast('Please select an image file', 'error');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      showToast('Image must be less than 2MB', 'error');
      return;
    }

    setIsUploadingPicture(true);

    try {
      // Compress/resize the image before uploading
      const compressImage = (file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
              const canvas = document.createElement('canvas');
              const maxSize = 400; // Max dimension for storage
              let width = img.width;
              let height = img.height;

              if (width > height) {
                if (width > maxSize) {
                  height *= maxSize / width;
                  width = maxSize;
                }
              } else {
                if (height > maxSize) {
                  width *= maxSize / height;
                  height = maxSize;
                }
              }

              canvas.width = width;
              canvas.height = height;

              const ctx = canvas.getContext('2d');
              ctx.drawImage(img, 0, 0, width, height);

              canvas.toBlob((blob) => {
                resolve(blob);
              }, 'image/jpeg', 0.85);
            };
            img.onerror = reject;
            img.src = event.target.result;
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      };

      // Compress the image
      const compressedBlob = await compressImage(file);
      
      // Generate unique filename
      const fileExt = 'jpg';
      const fileName = `${user.id}/profile.${fileExt}`;

      // Delete old profile picture if exists
      await supabase.storage
        .from('profile-pictures')
        .remove([fileName]);

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('profile-pictures')
        .upload(fileName, compressedBlob, {
          contentType: 'image/jpeg',
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(fileName);

      const publicUrl = `${urlData.publicUrl}?t=${Date.now()}`; // Add timestamp to bust cache

      // Update user metadata with the profile picture URL
      const { error: updateError } = await supabase.auth.updateUser({
        data: { profile_picture: publicUrl }
      });

      if (updateError) throw updateError;

      // Update local state
      setProfilePicture(publicUrl);
      setIsUploadingPicture(false);
      showToast('Profile picture updated!', 'success');

    } catch (error) {
      console.error('Upload error:', error);
      setIsUploadingPicture(false);
      showToast(error.message || 'Failed to upload picture', 'error');
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Remove profile picture from Supabase Storage
  const handleRemoveProfilePicture = async () => {
    setIsUploadingPicture(true);
    
    try {
      // Delete from Supabase Storage
      const fileName = `${user.id}/profile.jpg`;
      await supabase.storage
        .from('profile-pictures')
        .remove([fileName]);

      // Update user metadata to remove profile picture URL
      const { error: updateError } = await supabase.auth.updateUser({
        data: { profile_picture: null }
      });

      if (updateError) throw updateError;

      // Update local state
      setProfilePicture(null);
      showToast('Profile picture removed', 'success');
    } catch (error) {
      console.error('Remove error:', error);
      showToast('Failed to remove picture', 'error');
    }
    
    setIsUploadingPicture(false);
  };

  // Award XP function with level up check
  const awardXP = (amount, reason = '') => {
    setUserXP(prev => {
      const newXP = Math.max(0, prev + amount);
      const oldLevel = calculateLevel(prev);
      const newLevel = calculateLevel(newXP);
      
      // Check for level up
      if (newLevel > oldLevel) {
        const newFrames = PROFILE_FRAMES.filter(f => f.level === newLevel);
        setLevelUpData({
          oldLevel,
          newLevel,
          newFrames: newFrames.length > 0 ? newFrames : null
        });
        setShowLevelUp(true);
      }
      
      // Show XP toast
      if (amount > 0) {
        showToast(`+${amount} XP ${reason}`, 'success');
      }
      
      return newXP;
    });
  };

  // Calculate current level info
  const currentLevel = calculateLevel(userXP);
  const levelProgress = getLevelProgress(userXP);
  const currentLevelXP = LEVEL_THRESHOLDS[currentLevel - 1] || 0;
  const nextLevelXP = getXPForNextLevel(currentLevel);
  const unlockedFrames = getUnlockedFrames(currentLevel);
  const currentFrame = getFrameById(selectedFrame);

  // Load entries from Supabase
  useEffect(() => {
    const loadEntries = async () => {
      try {
        const { data, error } = await supabase
          .from('expenses')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: false });

        if (error) throw error;
        
        // Transform data to match our format
        const transformedData = data.map(expense => ({
          id: expense.id,
          name: expense.name,
          type: expense.category,
          amount: parseFloat(expense.amount),
          date: expense.date,
          dueDate: expense.due_date,
          notes: expense.notes || '',
          recurring: expense.recurring || null,
          walletId: expense.wallet_id || null,
          file: expense.file_name ? {
            name: expense.file_name,
            type: expense.file_type,
            data: expense.file_data
          } : null
        }));
        
        setEntries(transformedData);
      } catch (e) {
        console.error('Failed to load entries:', e);
      }
      setLoading(false);
    };
    loadEntries();
  }, [user]);

  // Save entry to Supabase
  const saveEntry = async (newEntry) => {
    try {
      const { data, error } = await supabase
  .from('expenses')
  .insert([{
    user_id: user.id,
    user_email: user.email,
    user_nickname: user.user_metadata?.nickname || 'User',
    name: newEntry.name,
    amount: newEntry.amount,
    category: newEntry.type,
    date: newEntry.date,
    due_date: newEntry.dueDate || null,
    notes: newEntry.notes || null,
    recurring: newEntry.recurring || null,
    wallet_id: newEntry.walletId || null,
    file_name: newEntry.file?.name || null,
    file_type: newEntry.file?.type || null,
    file_data: newEntry.file?.data || null
  }])
  .select()
  .single();

      if (error) throw error;
      
      const savedEntry = {
        id: data.id,
        name: data.name,
        type: data.category,
        amount: parseFloat(data.amount),
        date: data.date,
        dueDate: data.due_date,
        notes: data.notes || '',
        recurring: data.recurring || null,
        file: newEntry.file,
        walletId: newEntry.walletId || null
      };
      
      setEntries(prev => [savedEntry, ...prev]);
      
      // Deduct from wallet if specified
      if (newEntry.walletId) {
        deductFromWallet(newEntry.walletId, newEntry.amount, newEntry.name);
      }
      
      // Track today's entry for streak
      if (!todayEntryLogged) {
        setTodayEntryLogged(true);
      }
      
      // Update weekly challenge progress
      setTimeout(() => {
        updateWeeklyChallengeProgress(savedEntry);
        checkAchievements({ newEntry: true });
      }, 500);
      
      return savedEntry;
    } catch (e) {
      console.error('Failed to save:', e);
      throw e;
    }
  };

  // Delete entry from Supabase
  const deleteEntry = async (id) => {
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setEntries(prev => prev.filter(e => e.id !== id));
    } catch (e) {
      console.error('Failed to delete:', e);
    }
  };

  // Bulk delete selected entries
  const handleBulkDelete = async () => {
    if (selectedEntries.length === 0) return;
    
    setIsDeleting(true);
    let successCount = 0;
    let errorCount = 0;
    
    for (const id of selectedEntries) {
      try {
        const { error } = await supabase
          .from('expenses')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        successCount++;
      } catch (e) {
        errorCount++;
        console.error('Failed to delete entry:', e);
      }
    }
    
    // Update local state
    setEntries(prev => prev.filter(e => !selectedEntries.includes(e.id)));
    setSelectedEntries([]);
    setShowBulkDeleteConfirm(false);
    setIsDeleting(false);
    
    if (errorCount === 0) {
      showToast(`Successfully deleted ${successCount} entries`, 'success');
    } else {
      showToast(`Deleted ${successCount} entries, ${errorCount} failed`, 'error');
    }
  };

  // Clear all entries
  const handleClearAll = async () => {
    if (clearEntriesConfirmText.toLowerCase() !== 'delete') {
      showToast('Please type "delete" to confirm', 'error');
      return;
    }
    
    setIsDeleting(true);
    
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      setEntries([]);
      setSelectedEntries([]);
      setShowClearAllConfirm(false);
      setClearEntriesConfirmText('');
      showToast('All entries have been cleared', 'success');
    } catch (e) {
      console.error('Failed to clear all:', e);
      showToast('Failed to clear entries', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Toggle entry selection
  const toggleEntrySelection = (id) => {
    setSelectedEntries(prev => 
      prev.includes(id) 
        ? prev.filter(x => x !== id) 
        : [...prev, id]
    );
  };

  // Toggle select all (filtered entries)
  const toggleSelectAll = () => {
    if (selectedEntries.length === filteredEntries.length) {
      setSelectedEntries([]);
    } else {
      setSelectedEntries(filteredEntries.map(e => e.id));
    }
  };

  // File handling
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File too large. Maximum size is 5MB.');
      e.target.value = '';
      return;
    }
    if (!selectedCategory) {
      setUploadError('Please select a category first');
      e.target.value = '';
      return;
    }

    const mediaType = file.type || 'image/jpeg';
    if (!mediaType.startsWith('image/') && mediaType !== 'application/pdf') {
      setUploadError('Please upload an image or PDF file');
      e.target.value = '';
      return;
    }

    setUploadError('');
    setUploadedFile({
      file,
      name: file.name,
      type: mediaType,
      size: file.size,
      preview: mediaType.startsWith('image/') ? URL.createObjectURL(file) : null
    });
  };

  const clearAttachedFile = () => {
    if (uploadedFile?.preview) URL.revokeObjectURL(uploadedFile.preview);
    setUploadedFile(null);
    setUploadError('');
  };

  const processAttachedFile = async () => {
    if (!uploadedFile || !selectedCategory) return;
    setIsProcessing(true);

    try {
      const base64Data = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(uploadedFile.file);
      });

      const mediaType = uploadedFile.type;

      // Call Supabase Edge Function
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/extract-receipt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          base64Data,
          mediaType
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to extract data');
      }

      const extracted = await response.json();

      setPendingUpload({
        id: Date.now().toString(),
        type: selectedCategory,
        name: extracted.name || 'Unknown',
        amount: parseFloat(extracted.amount) || 0,
        date: extracted.date || new Date().toISOString().split('T')[0],
        dueDate: extracted.dueDate || '',
        createdAt: new Date().toISOString(),
        file: { data: base64Data, type: mediaType, name: uploadedFile.name }
      });
      clearAttachedFile();
    } catch (error) {
      console.error('Extraction failed:', error);
      showToast(`Failed to extract data: ${error.message}`, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

 const confirmPendingUpload = async () => {
    if (pendingUpload) {
      try {
        await saveEntry(pendingUpload);
        setPendingUpload(null);
        setSelectedCategory('');
        showToast('Entry saved successfully', 'success');
      } catch (e) {
        showToast('Failed to save entry', 'error');
      }
    }
  };

  const cancelPendingUpload = () => {
    setPendingUpload(null);
    clearAttachedFile();
    setSelectedCategory('');
  };

  const handleManualSubmit = async () => {
    if (!selectedCategory || !manualForm.name || !manualForm.amount) {
      showToast('Please fill required fields', 'error');
      return;
    }
    
    // Check if selected wallet has enough balance
    if (manualForm.walletId) {
      const selectedWallet = wallets.find(w => w.id === manualForm.walletId);
      if (selectedWallet && selectedWallet.balance < parseFloat(manualForm.amount)) {
        showToast(`Insufficient balance in ${selectedWallet.name}`, 'error');
        return;
      }
    }
    
    setIsSaving(true);
    const newEntry = {
      type: selectedCategory,
      name: manualForm.name,
      amount: parseFloat(manualForm.amount) || 0,
      date: manualForm.date || new Date().toISOString().split('T')[0],
      dueDate: manualForm.dueDate || '',
      notes: manualForm.notes || '',
      recurring: manualForm.recurring || null,
      walletId: manualForm.walletId || null
    };
    try {
      await saveEntry(newEntry);
      setSelectedCategory('');
      setManualForm({ name: '', amount: '', date: '', dueDate: '', notes: '', recurring: '', walletId: '' });
      showToast('Entry added successfully', 'success');
    } catch (e) {
      showToast('Failed to save entry', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // CSV Import Handlers
  const handleCsvFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        const lines = text.split('\n').filter(line => line.trim());
        
        if (lines.length < 2) {
          showToast('CSV file is empty or has no data rows', 'error');
          return;
        }
        
        // Parse headers
        const headers = lines[0].toLowerCase().split(',').map(h => h.trim().replace(/"/g, '').replace(/ /g, '_'));
        const requiredHeaders = ['name', 'amount', 'category'];
        const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
        
        if (missingHeaders.length > 0) {
          showToast(`Missing required headers: ${missingHeaders.join(', ')}`, 'error');
          return;
        }
        
        // Parse data rows
        const entries = [];
        const validCategories = ['utilities', 'subscription', 'food', 'shopping', 'healthcare', 'entertainment', 'other'];
        
        for (let i = 1; i < lines.length; i++) {
          const values = parseCSVLine(lines[i]);
          if (values.length < headers.length) continue;
          
          const row = {};
          headers.forEach((header, index) => {
            row[header] = values[index]?.trim().replace(/"/g, '') || '';
          });
          
          // Validate and transform
          const amount = parseFloat(row.amount);
          if (isNaN(amount) || amount <= 0) continue;
          
          let category = row.category?.toLowerCase() || 'other';
          if (!validCategories.includes(category)) category = 'other';
          
          // Handle wallet ID from import
          let walletId = row.wallet_id || '';
          
          // If wallet ID is provided but doesn't match any existing wallet, try to match by name
          if (walletId && !wallets.find(w => w.id === walletId)) {
            const walletName = row.wallet_name || '';
            const matchedWallet = wallets.find(w => w.name.toLowerCase() === walletName.toLowerCase());
            walletId = matchedWallet ? matchedWallet.id : '';
          }
          
          entries.push({
            name: row.name || 'Unnamed Entry',
            amount: amount,
            type: category,
            date: row.date || new Date().toISOString().split('T')[0],
            dueDate: row.due_date || '',
            notes: row.notes || '',
            recurring: ['weekly', 'monthly', 'yearly'].includes(row.recurring?.toLowerCase()) ? row.recurring.toLowerCase() : null,
            walletId: walletId
          });
        }
        
        if (entries.length === 0) {
          showToast('No valid entries found in CSV', 'error');
          return;
        }
        
        setCsvPreview(entries);
        showToast(`Found ${entries.length} entries ready to import`, 'success');
      } catch (error) {
        console.error('CSV parse error:', error);
        showToast('Failed to parse CSV file', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input
  };

  // Helper to parse CSV line (handles quoted values with commas)
  const parseCSVLine = (line) => {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current);
    return result;
  };

  const handleCsvImport = async () => {
    if (!csvPreview || csvPreview.length === 0) return;
    
    setIsSaving(true);
    let successCount = 0;
    let errorCount = 0;
    
    for (const entry of csvPreview) {
      try {
        // Save the entry (this already handles wallet deduction via deductFromWallet)
        const savedEntry = await saveEntry(entry);
        successCount++;
      } catch (e) {
        errorCount++;
        console.error('Failed to import entry:', e);
      }
    }
    
    setCsvPreview(null);
    setIsSaving(false);
    
    if (errorCount === 0) {
      showToast(`Successfully imported ${successCount} entries`, 'success');
    } else {
      showToast(`Imported ${successCount} entries, ${errorCount} failed`, 'error');
    }
  };

const getBudgetStatus = () => {
    if (monthlyBudget <= 0) return null;
    

    
    // Calculate month spending directly to avoid dependency on stats
    const now = new Date();
    const monthSpent = entries
      .filter(e => {
        const d = new Date(e.date);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      })
      .reduce((sum, e) => sum + e.amount, 0);
    
    const percentage = (monthSpent / monthlyBudget) * 100;
    const remaining = monthlyBudget - monthSpent;
    
    let status = 'safe';
    let color = '#2b5547ff';
    if (percentage >= 100) {
      status = 'over';
      color = '#ef4444';
    } else if (percentage >= 80) {
      status = 'warning';
      color = '#f59e0b';
    }
    
    return { spent: monthSpent, percentage: Math.min(percentage, 100), remaining, status, color };
  };
// Get all recurring/subscription entries
  const getRecurringEntries = () => {
    return entries.filter(e => e.recurring);
  };

  // Calculate next due date based on recurring type and last date
  const getNextDueDate = (entry) => {
    if (!entry.recurring) return null;
    
    const lastDate = new Date(entry.dueDate || entry.date);
    const today = new Date();
    let nextDate = new Date(lastDate);
    
    // Keep adding intervals until we get a future date
    while (nextDate <= today) {
      if (entry.recurring === 'weekly') {
        nextDate.setDate(nextDate.getDate() + 7);
      } else if (entry.recurring === 'monthly') {
        nextDate.setMonth(nextDate.getMonth() + 1);
      } else if (entry.recurring === 'yearly') {
        nextDate.setFullYear(nextDate.getFullYear() + 1);
      }
    }
    
    return nextDate;
  };

  // Get days until next due
  const getDaysUntilDue = (entry) => {
    const nextDue = getNextDueDate(entry);
    if (!nextDue) return null;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    nextDue.setHours(0, 0, 0, 0);
    
    const diffTime = nextDue - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Get bills sorted by upcoming due date
  const getUpcomingBills = () => {
    const recurring = getRecurringEntries();
    return recurring
      .map(entry => ({
        ...entry,
        nextDueDate: getNextDueDate(entry),
        daysUntil: getDaysUntilDue(entry)
      }))
      .sort((a, b) => a.daysUntil - b.daysUntil);
  };

  // Calculate total monthly recurring cost
  const getMonthlyRecurringCost = () => {
    const recurring = getRecurringEntries();
    return recurring.reduce((total, entry) => {
      if (entry.recurring === 'weekly') {
        return total + (entry.amount * 4.33); // Average weeks per month
      } else if (entry.recurring === 'monthly') {
        return total + entry.amount;
      } else if (entry.recurring === 'yearly') {
        return total + (entry.amount / 12);
      }
      return total;
    }, 0);
  };

  // Calculate total yearly recurring cost
  const getYearlyRecurringCost = () => {
    const recurring = getRecurringEntries();
    return recurring.reduce((total, entry) => {
      if (entry.recurring === 'weekly') {
        return total + (entry.amount * 52);
      } else if (entry.recurring === 'monthly') {
        return total + (entry.amount * 12);
      } else if (entry.recurring === 'yearly') {
        return total + entry.amount;
      }
      return total;
    }, 0);
  };


  const handleSubmitFeedback = async () => {
    if (!feedbackMessage.trim()) return;
    try {
      const { error } = await supabase.from('feedbacks').insert([{
        user_id: user.id,
        user_email: user.email,
        nickname: user.user_metadata?.nickname || 'User',
        message: feedbackMessage.trim()
      }]);
      if (error) throw error;
      setFeedbackSent(true);
      setTimeout(() => {
        setShowFeedback(false);
        setFeedbackMessage('');
        setFeedbackSent(false);
      }, 2000);
    } catch (e) {
      showToast('Failed to send feedback', 'error');
    }
  };
  const handleDeleteEntry = async () => {
    if (!deletingEntry) return;
    setIsSaving(true);
    try {
      await deleteEntry(deletingEntry.id);
      setDeletingEntry(null);
      showToast('Entry deleted successfully', 'success');
    } catch (e) {
      showToast('Failed to delete entry', 'error');
    } finally {
      setIsSaving(false);
    }
  };
  const handleUpdateEntry = async () => {
    if (!editingEntry) return;
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('expenses')
        .update({
          name: editingEntry.name,
          amount: parseFloat(editingEntry.amount),
          category: editingEntry.type,
          date: editingEntry.date,
          due_date: editingEntry.dueDate || null,
          notes: editingEntry.notes || null,
          recurring: editingEntry.recurring || null
        })
        .eq('id', editingEntry.id);

      if (error) throw error;

      setEntries(prev => prev.map(e => 
        e.id === editingEntry.id 
          ? { ...e, name: editingEntry.name, amount: parseFloat(editingEntry.amount), type: editingEntry.type, date: editingEntry.date, dueDate: editingEntry.dueDate, notes: editingEntry.notes, recurring: editingEntry.recurring }
          : e
      ));
      setEditingEntry(null);
      showToast('Entry updated successfully', 'success');
    } catch (e) {
      console.error('Failed to update:', e);
      showToast('Failed to update entry', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadFile = (entry) => {
    if (!entry.file) return;
    const link = document.createElement('a');
    link.href = `data:${entry.file.type};base64,${entry.file.data}`;
    link.download = entry.file.name || `${entry.name}.${entry.file.type.split('/')[1]}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export to CSV (uses filtered entries)
  const exportToCSV = () => {
    const dataToExport = getFilteredEntries();
    const headers = ['Date', 'Category', 'Name', 'Amount', 'Due Date', 'Wallet ID', 'Wallet Name'];
    const rows = dataToExport.map(e => {
      const wallet = wallets.find(w => w.id === e.walletId);
      return [
        e.date,
        CATEGORIES.find(c => c.value === e.type)?.label || e.type,
        `"${e.name.replace(/"/g, '""')}"`,
        e.amount.toFixed(2),
        e.dueDate || '',
        e.walletId || '',
        wallet ? `"${wallet.name}"` : ''
      ];
    });
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `brewedops-expenses-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Filters & Stats
  const getFilteredEntries = () => {
    let filtered = entries;
    const now = new Date();
    
    // Apply search filter
    if (historySearch.trim()) {
      const search = historySearch.toLowerCase();
      filtered = filtered.filter(e => e.name.toLowerCase().includes(search) || e.amount.toString().includes(search));
    }
    
    // Apply time filter (unless advanced filter is active)
    if (!showAdvancedFilter) {
      if (historyFilter === 'Today') {
        filtered = filtered.filter(e => new Date(e.date).toDateString() === now.toDateString());
      } else if (historyFilter === 'Week') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(e => new Date(e.date) >= weekAgo);
      } else if (historyFilter === 'Month') {
        filtered = filtered.filter(e => {
          const d = new Date(e.date);
          return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        });
      } else if (historyFilter === 'Year') {
        filtered = filtered.filter(e => new Date(e.date).getFullYear() === now.getFullYear());
      }
    } else {
      // Apply advanced date range filter
      if (advancedDateFrom) {
        filtered = filtered.filter(e => new Date(e.date) >= new Date(advancedDateFrom));
      }
      if (advancedDateTo) {
        filtered = filtered.filter(e => new Date(e.date) <= new Date(advancedDateTo));
      }
      // Apply advanced category filter
      if (advancedCategory !== 'all') {
        filtered = filtered.filter(e => e.type === advancedCategory);
      }
    }
    
    return filtered;
  };

  // Get filtered entries for Analytics tab
  const getAnalyticsFilteredEntries = () => {
    let filtered = entries;
    
    if (analyticsDateFrom) {
      filtered = filtered.filter(e => new Date(e.date) >= new Date(analyticsDateFrom));
    }
    if (analyticsDateTo) {
      filtered = filtered.filter(e => new Date(e.date) <= new Date(analyticsDateTo));
    }
    if (analyticsCategory !== 'all') {
      filtered = filtered.filter(e => e.type === analyticsCategory);
    }
    
    return filtered;
  };

  // Get analytics stats based on filtered data
  const getAnalyticsStats = () => {
    const now = new Date();
    const filtered = getAnalyticsFilteredEntries();
    
    return {
      today: filtered.filter(e => new Date(e.date).toDateString() === now.toDateString()).reduce((s, e) => s + e.amount, 0),
      month: filtered.filter(e => { const d = new Date(e.date); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); }).reduce((s, e) => s + e.amount, 0),
      year: filtered.filter(e => new Date(e.date).getFullYear() === now.getFullYear()).reduce((s, e) => s + e.amount, 0),
      total: filtered.reduce((s, e) => s + e.amount, 0),
      count: filtered.length
    };
  };

  // Get analytics category data
  const getAnalyticsCategoryData = () => {
    const filtered = getAnalyticsFilteredEntries();
    const totals = {};
    filtered.forEach(e => { totals[e.type] = (totals[e.type] || 0) + e.amount; });
    return CATEGORIES.map(c => ({ name: c.label, value: totals[c.value] || 0, color: c.color })).filter(c => c.value > 0);
  };

  // Get analytics monthly data
  const getAnalyticsMonthlyData = () => {
    const months = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      let monthEntries = getAnalyticsFilteredEntries().filter(e => { 
        const d = new Date(e.date); 
        return d.getMonth() === date.getMonth() && d.getFullYear() === date.getFullYear(); 
      });
      months.push({ 
        name: date.toLocaleDateString('en-US', { month: 'short' }), 
        fullName: date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        amount: monthEntries.reduce((s, e) => s + e.amount, 0),
        monthKey: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      });
    }
    return months;
  };

  // Get comparison data between two months
  const getComparisonData = () => {
    if (!analyticsCompareMonth) return null;
    
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const [compareYear, compareMonthNum] = analyticsCompareMonth.split('-').map(Number);
    
    let currentEntries = getAnalyticsFilteredEntries().filter(e => {
      const d = new Date(e.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });
    
    let compareEntries = getAnalyticsFilteredEntries().filter(e => {
      const d = new Date(e.date);
      return d.getMonth() === compareMonthNum - 1 && d.getFullYear() === compareYear;
    });
    
    const currentTotal = currentEntries.reduce((s, e) => s + e.amount, 0);
    const compareTotal = compareEntries.reduce((s, e) => s + e.amount, 0);
    const difference = currentTotal - compareTotal;
    const percentChange = compareTotal > 0 ? ((difference / compareTotal) * 100) : 0;
    
    return {
      currentMonth: new Date(currentYear, currentMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      compareMonth: new Date(compareYear, compareMonthNum - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      currentTotal,
      compareTotal,
      difference,
      percentChange,
      isIncrease: difference > 0
    };
  };

  const getStats = () => {
    const now = new Date();
    
    // Apply category filter
    let filtered = entries;
    if (dashboardCategory !== 'all') {
      filtered = filtered.filter(e => e.type === dashboardCategory);
    }
    
    return {
      today: filtered.filter(e => new Date(e.date).toDateString() === now.toDateString()).reduce((s, e) => s + e.amount, 0),
      month: filtered.filter(e => { const d = new Date(e.date); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); }).reduce((s, e) => s + e.amount, 0),
      year: filtered.filter(e => new Date(e.date).getFullYear() === now.getFullYear()).reduce((s, e) => s + e.amount, 0),
      total: filtered.reduce((s, e) => s + e.amount, 0)
    };
  };

  const getCategoryData = () => {
    const now = new Date();
    let filtered = entries;
    
    // Apply category filter first
    if (dashboardCategory !== 'all') {
      filtered = filtered.filter(e => e.type === dashboardCategory);
    }
    
    // Apply time filter
    if (dashboardView === 'Day') filtered = filtered.filter(e => new Date(e.date).toDateString() === now.toDateString());
    else if (dashboardView === 'Month') filtered = filtered.filter(e => { const d = new Date(e.date); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); });
    else if (dashboardView === 'Year') filtered = filtered.filter(e => new Date(e.date).getFullYear() === now.getFullYear());
    
    const totals = {};
    filtered.forEach(e => { totals[e.type] = (totals[e.type] || 0) + e.amount; });
    return CATEGORIES.map(c => ({ name: c.label, value: totals[c.value] || 0, color: c.color })).filter(c => c.value > 0);
  };

  const getMonthlyData = () => {
    const months = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      let monthEntries = entries.filter(e => { const d = new Date(e.date); return d.getMonth() === date.getMonth() && d.getFullYear() === date.getFullYear(); });
      
      // Apply category filter
      if (dashboardCategory !== 'all') {
        monthEntries = monthEntries.filter(e => e.type === dashboardCategory);
      }
      
      months.push({ name: date.toLocaleDateString('en-US', { month: 'short' }), amount: monthEntries.reduce((s, e) => s + e.amount, 0) });
    }
    return months;
  };

  const stats = getStats();
  const categoryData = getCategoryData();
  const monthlyData = getMonthlyData();
  const filteredEntries = getFilteredEntries();
  const budgetStatus = getBudgetStatus();
  
  

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: theme.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 style={{ width: '32px', height: '32px', color: theme.textSubtle, animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  const cardStyle = {
    backgroundColor: theme.cardBg,
    borderRadius: '12px',
    border: `1px solid ${theme.cardBorder}`,
    padding: isSmall ? '16px' : '20px'
  };

  const inputStyle = {
    width: '100%',
    height: isSmall ? '40px' : '36px',
    backgroundColor: theme.inputBg,
    border: `1px solid ${theme.inputBorder}`,
    borderRadius: '6px',
    padding: '0 12px',
    fontSize: isSmall ? '16px' : '14px',
    color: theme.text,
    outline: 'none',
    boxSizing: 'border-box'
  };

  const buttonStyle = (active) => ({
    padding: isSmall ? '8px 12px' : '6px 12px',
    backgroundColor: active ? theme.toggleActive : 'transparent',
    border: active ? `1px solid ${theme.inputBorder}` : '1px solid transparent',
    borderRadius: '6px',
    fontSize: '13px',
    color: active ? theme.text : theme.textSubtle,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    boxShadow: active && !isDark ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
    flex: isSmall ? 1 : 'none'
  });

  return (
    <div className={isDark ? 'dark' : ''} style={{ minHeight: '100vh', backgroundColor: theme.bg }}>
    <SidebarProvider defaultOpen={!isMobile}>
      {/* shadcn Sidebar - Uses URL routing internally */}
      <AppSidebar isDark={isDark} />

      <SidebarInset style={{ flex: 1, minWidth: 0, width: '100%' }}>
      {/* Header */}
      <header style={{
        backgroundColor: isDark ? '#0a0a0b' : '#ffffff',
        borderBottom: `1px solid ${theme.cardBorder}`,
        padding: isSmall ? '0 12px' : '0 24px',
        position: 'sticky',
        top: 0,
        zIndex: 20,
        height: isSmall ? '60px' : '72px',
        display: 'flex',
        alignItems: 'center',
      }}>
        <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Left side - Sidebar Trigger + Logo on mobile */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Mobile Sidebar Trigger - uses Sheet on mobile */}
            <SidebarTrigger 
              className="md:hidden" 
              style={{ 
                width: '36px', 
                height: '36px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                borderRadius: '8px',
                border: `1px solid ${theme.cardBorder}`,
                backgroundColor: 'transparent',
                color: theme.text,
                cursor: 'pointer',
                flexShrink: 0
              }} 
            />
            
            {isMobile && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img 
                  src="https://i.imgur.com/R52jwPv.png" 
                  alt="BrewedOps Logo" 
                  style={{ 
                    width: '28px', 
                    height: '28px', 
                    borderRadius: '6px', 
                    objectFit: 'cover',
                    flexShrink: 0 
                  }} 
                />
                <span style={{ 
                  fontFamily: "'Montserrat', sans-serif", 
                  fontWeight: '700', 
                  fontSize: '14px' 
                }}>
                  <span style={{ color: isDark ? '#fff' : BRAND.brown }}>Brewed</span>
                  <span style={{ color: BRAND.blue }}>Ops</span>
                </span>
              </div>
            )}
          </div>

          {/* Desktop Header Actions */}
          {!isMobile ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginLeft: 'auto' }}>
              {/* Level & XP Bar */}
              <div 
                onClick={() => setShowRewardsModal(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 14px',
                  backgroundColor: theme.statBg,
                  borderRadius: '10px',
                  cursor: 'pointer',
                  transition: 'transform 0.15s',
                  border: `1px solid ${theme.cardBorder}`,
                  height: '50px',
                  boxSizing: 'border-box'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: '700',
                  boxShadow: '0 2px 6px rgba(245, 158, 11, 0.3)'
                }}>
                  {currentLevel}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', minWidth: '90px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: theme.text }}>Level {currentLevel}</span>
                    <span style={{ fontSize: '11px', color: theme.textMuted }}>{userXP} XP</span>
                  </div>
                  <div style={{
                    height: '7px',
                    backgroundColor: isDark ? '#27272a' : '#e4e4e7',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${levelProgress}%`,
                      background: 'linear-gradient(90deg, #22c55e, #10b981)',
                      borderRadius: '4px',
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                </div>
                <Gift style={{ width: '18px', height: '18px', color: '#f59e0b' }} />
              </div>
              
              {/* Achievements Button with Streak */}
              <div 
                onClick={() => setShowAchievementsModal(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 14px',
                  backgroundColor: theme.statBg,
                  borderRadius: '10px',
                  cursor: 'pointer',
                  transition: 'transform 0.15s',
                  border: `1px solid ${theme.cardBorder}`,
                  height: '50px',
                  boxSizing: 'border-box'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <Trophy style={{ width: '20px', height: '20px', color: '#fbbf24' }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: theme.text }}>
                    {unlockedAchievements.length}/{ACHIEVEMENTS.length}
                  </span>
                  <span style={{ fontSize: '10px', color: theme.textMuted }}>Badges</span>
                </div>
                {(currentStreak > 0 || !checkedInToday) && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px',
                    padding: '4px 8px',
                    backgroundColor: checkedInToday ? (isDark ? '#14532d' : '#dcfce7') : (isDark ? '#7c2d12' : '#fed7aa'),
                    borderRadius: '12px',
                    position: 'relative'
                  }}>
                    <Flame style={{ width: '14px', height: '14px', color: checkedInToday ? '#22c55e' : '#f97316' }} />
                    {currentStreak > 0 && (
                      <span style={{ fontSize: '12px', fontWeight: '700', color: checkedInToday ? '#22c55e' : '#f97316' }}>{currentStreak}</span>
                    )}
                    {!checkedInToday && (
                      <span style={{
                        position: 'absolute',
                        top: '-2px',
                        right: '-2px',
                        width: '8px',
                        height: '8px',
                        backgroundColor: '#ef4444',
                        borderRadius: '50%',
                        border: `2px solid ${theme.cardBg}`
                      }} />
                    )}
                  </div>
                )}
              </div>
              
              <button
                onClick={() => setIsDark(!isDark)}
                style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: 'transparent',
                  border: `1px solid ${theme.inputBorder}`,
                  borderRadius: '8px',
                  color: theme.textMuted,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {isDark ? <Sun style={{ width: '20px', height: '20px' }} /> : <Moon style={{ width: '20px', height: '20px' }} />}
              </button>

              {/* Profile Avatar with Dropdown */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  style={{
                    ...getAnimatedFrameStyle(currentFrame, 48),
                    cursor: 'pointer',
                    border: currentFrame.gradient ? 'none' : (currentFrame.border !== 'none' ? currentFrame.border : '2px solid transparent'),
                    backgroundColor: currentFrame.gradient ? undefined : 'transparent',
                  }}
                >
                  <div style={{
                    ...getAvatarInnerStyle(currentFrame, 48, profilePicture ? 'transparent' : '#3b82f6'),
                  }}>
                    {profilePicture ? (
                      <img 
                        src={profilePicture} 
                        alt="Profile" 
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover',
                          borderRadius: '50%'
                        }} 
                      />
                    ) : (
                      getInitial(user.user_metadata?.nickname)
                    )}
                  </div>
                </button>

                {showProfileMenu && (
                  <div style={{
                    position: 'absolute',
                    top: '54px',
                    right: 0,
                    width: '220px',
                    backgroundColor: theme.cardBg,
                    border: `1px solid ${theme.cardBorder}`,
                    borderRadius: '10px',
                    boxShadow: isDark ? '0 4px 12px rgba(0,0,0,0.4)' : '0 4px 12px rgba(0,0,0,0.1)',
                    zIndex: 50,
                    overflow: 'hidden'
                  }}>
                    <div style={{ padding: '14px 16px', borderBottom: `1px solid ${theme.cardBorder}` }}>
                      <p style={{ fontSize: '15px', fontWeight: '600', color: theme.text, margin: 0 }}>{user.user_metadata?.nickname || 'User'}</p>
                      <p style={{ fontSize: '13px', color: theme.textMuted, margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</p>
                    </div>
                    
                    {/* Currency Selector */}
                    <div style={{ padding: '12px 16px', borderBottom: `1px solid ${theme.cardBorder}` }}>
                      <label style={{ fontSize: '12px', color: theme.textMuted, display: 'block', marginBottom: '8px' }}>Currency</label>
                      <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        style={{
                          width: '100%',
                          height: '36px',
                          backgroundColor: theme.inputBg,
                          border: `1px solid ${theme.inputBorder}`,
                          borderRadius: '6px',
                          padding: '0 10px',
                          fontSize: '14px',
                          color: theme.text,
                          cursor: 'pointer',
                          outline: 'none'
                        }}
                      >
                        {CURRENCIES.map(c => (
                          <option key={c.symbol} value={c.symbol}>{c.label}</option>
                        ))}
                      </select>
                    </div>
                    
                    <button
                      onClick={() => { console.log('[App] Edit Profile clicked'); setShowProfileMenu(false); setShowEditProfile(true); }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDark ? '#27272a' : '#f4f4f5'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        color: theme.text,
                        textAlign: 'left',
                        transition: 'background-color 0.15s'
                      }}
                    >
                      <Edit style={{ width: '18px', height: '18px', color: theme.textMuted }} />
                      Edit Profile
                    </button>
                    <button
                      onClick={() => { console.log('[App] Send Feedback clicked'); setShowProfileMenu(false); setShowFeedback(true); }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDark ? '#27272a' : '#f4f4f5'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        color: theme.text,
                        textAlign: 'left',
                        transition: 'background-color 0.15s'
                      }}
                    >
                      <MessageSquare style={{ width: '18px', height: '18px', color: theme.textMuted }} />
                      Send Feedback
                    </button>
                    <button
                      onClick={() => { setShowProfileMenu(false); onLogout(); }}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        color: '#ef4444',
                        textAlign: 'left'
                      }}
                    >
                      <LogOut style={{ width: '18px', height: '18px' }} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Mobile Header Actions */
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {/* Mobile Level & XP Bar - Compact */}
              <div 
                onClick={() => setShowRewardsModal(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 8px',
                  backgroundColor: theme.statBg,
                  borderRadius: '6px',
                  cursor: 'pointer',
                  border: `1px solid ${theme.cardBorder}`
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                  color: '#fff',
                  fontSize: '10px',
                  fontWeight: '700'
                }}>
                  {currentLevel}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', minWidth: '40px' }}>
                  <div style={{
                    height: '4px',
                    backgroundColor: isDark ? '#27272a' : '#e4e4e7',
                    borderRadius: '2px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${levelProgress}%`,
                      background: 'linear-gradient(90deg, #22c55e, #10b981)',
                      borderRadius: '2px'
                    }} />
                  </div>
                  <span style={{ fontSize: '8px', color: theme.textMuted }}>{userXP} XP</span>
                </div>
              </div>

              {/* Achievements Button - Mobile */}
              <button
                onClick={() => setShowAchievementsModal(true)}
                style={{
                  width: '32px',
                  height: '32px',
                  backgroundColor: 'transparent',
                  border: `1px solid ${theme.inputBorder}`,
                  borderRadius: '6px',
                  color: theme.textMuted,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}
              >
                <Trophy style={{ width: '16px', height: '16px', color: '#fbbf24' }} />
                {(currentStreak > 0 || !checkedInToday) && (
                  <div style={{
                    position: 'absolute',
                    top: '-3px',
                    right: '-3px',
                    minWidth: '14px',
                    height: '14px',
                    backgroundColor: checkedInToday ? '#22c55e' : '#f97316',
                    borderRadius: '7px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '8px',
                    fontWeight: '700',
                    color: '#fff',
                    padding: '0 3px'
                  }}>
                    {checkedInToday ? currentStreak : '!'}
                  </div>
                )}
              </button>
              
              <button
                onClick={() => setIsDark(!isDark)}
                style={{
                  width: '32px',
                  height: '32px',
                  backgroundColor: 'transparent',
                  border: `1px solid ${theme.inputBorder}`,
                  borderRadius: '6px',
                  color: theme.textMuted,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {isDark ? <Sun style={{ width: '16px', height: '16px' }} /> : <Moon style={{ width: '16px', height: '16px' }} />}
              </button>
              
              {/* Mobile Profile Avatar with Dropdown */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  style={{
                    ...getAnimatedFrameStyle(currentFrame, 36),
                    cursor: 'pointer',
                    border: currentFrame.gradient ? 'none' : (currentFrame.border !== 'none' ? currentFrame.border : '2px solid transparent'),
                    backgroundColor: currentFrame.gradient ? undefined : 'transparent',
                  }}
                >
                  <div style={{
                    ...getAvatarInnerStyle(currentFrame, 36, profilePicture ? 'transparent' : '#3b82f6'),
                  }}>
                    {profilePicture ? (
                      <img 
                        src={profilePicture} 
                        alt="Profile" 
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover',
                          borderRadius: '50%'
                        }} 
                      />
                    ) : (
                      getInitial(user.user_metadata?.nickname)
                    )}
                  </div>
                </button>

                {showProfileMenu && (
                  <div style={{
                    position: 'absolute',
                    top: '42px',
                    right: 0,
                    width: '220px',
                    backgroundColor: theme.cardBg,
                    border: `1px solid ${theme.cardBorder}`,
                    borderRadius: '10px',
                    boxShadow: isDark ? '0 4px 12px rgba(0,0,0,0.4)' : '0 4px 12px rgba(0,0,0,0.1)',
                    zIndex: 50,
                    overflow: 'hidden'
                  }}>
                    <div style={{ padding: '14px 16px', borderBottom: `1px solid ${theme.cardBorder}` }}>
                      <p style={{ fontSize: '15px', fontWeight: '600', color: theme.text, margin: 0 }}>{user.user_metadata?.nickname || 'User'}</p>
                      <p style={{ fontSize: '13px', color: theme.textMuted, margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</p>
                    </div>
                    
                    {/* Currency Selector in Mobile Menu */}
                    <div style={{ padding: '12px 16px', borderBottom: `1px solid ${theme.cardBorder}` }}>
                      <label style={{ fontSize: '13px', color: theme.textMuted, display: 'block', marginBottom: '8px' }}>Currency</label>
                      <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        style={{
                          width: '100%',
                          height: '36px',
                          backgroundColor: theme.inputBg,
                          border: `1px solid ${theme.inputBorder}`,
                          borderRadius: '6px',
                          padding: '0 10px',
                          fontSize: '14px',
                          color: theme.text,
                          cursor: 'pointer',
                          outline: 'none'
                        }}
                      >
                        {CURRENCIES.map(c => (
                          <option key={c.symbol} value={c.symbol}>{c.label}</option>
                        ))}
                      </select>
                    </div>
                    
                    <button
                      onClick={() => { setShowProfileMenu(false); setShowEditProfile(true); }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDark ? '#27272a' : '#f4f4f5'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        cursor: 'pointer',
                        fontSize: '15px',
                        color: theme.text,
                        textAlign: 'left',
                        transition: 'background-color 0.15s'
                      }}
                    >
                      <Edit style={{ width: '18px', height: '18px', color: theme.textMuted }} />
                      Edit Profile
                    </button>
                    <button
                      onClick={() => { setShowProfileMenu(false); setShowFeedback(true); }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDark ? '#27272a' : '#f4f4f5'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        cursor: 'pointer',
                        fontSize: '15px',
                        color: theme.text,
                        textAlign: 'left',
                        transition: 'background-color 0.15s'
                      }}
                    >
                      <MessageSquare style={{ width: '18px', height: '18px', color: theme.textMuted }} />
                      Send Feedback
                    </button>
                    <button
                      onClick={() => { setShowProfileMenu(false); onLogout(); }}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        cursor: 'pointer',
                        fontSize: '15px',
                        color: '#ef4444',
                        textAlign: 'left'
                      }}
                    >
                      <LogOut style={{ width: '18px', height: '18px' }} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

     {/* Conditional Content based on activeSection */}
{activeSection === 'vakita' ? (
  <VAKita user={user} isDark={isDark} />
) : activeSection === 'taskmanager' ? (
  <TaskManager user={user} isDark={isDark} clients={[]} />
) : activeSection === 'pdfeditor' ? (
  <PDFEditor isDark={isDark} />
) : activeSection === 'bgremover' ? (
  <BackgroundRemover isDark={isDark} />
) : activeSection === 'imagecropper' ? (
  <ImageCropper isDark={isDark} />
) : activeSection === 'imageconverter' ? (
  <ImageConverter isDark={isDark} />
) : activeSection === 'imagecompressor' ? (
  <ImageCompressor isDark={isDark} />
) : activeSection === 'imageresizer' ? (
  <ImageResizer isDark={isDark} />
) : activeSection === 'qrgenerator' ? (
  <QRGenerator isDark={isDark} />
) : activeSection === 'colorpicker' ? (
  <ColorPicker isDark={isDark} />
) : activeSection === 'imagetotext' ? (
  <ImageToText isDark={isDark} />
) : activeSection === 'pdfmerge' ? (
  <PDFMerge isDark={isDark} />
) : activeSection === 'pdfsplit' ? (
  <PDFSplit isDark={isDark} />
) : activeSection === 'imagetopdf' ? (
  <ImageToPDF isDark={isDark} />
) : activeSection === 'videocompressor' ? (
  <VideoCompressor isDark={isDark} />
) : activeSection === 'videotrimmer' ? (
  <VideoTrimmer isDark={isDark} />
) : (

     <>
      {/* Tab Navigation */}
      <div style={{
        backgroundColor: isDark ? '#0a0a0b' : '#ffffff',
        borderBottom: `1px solid ${theme.cardBorder}`,
        padding: isSmall ? '0 12px' : '0 24px'
      }}>
        <div style={{ width: '100%', display: 'flex', gap: '4px', padding: '0 16px', overflowX: 'auto' }}>
          <button
            onClick={() => setActiveTab('dashboard')}
            style={{
              padding: isSmall ? '12px 14px' : '14px 18px',
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'dashboard' ? `2px solid ${isDark ? '#fafafa' : '#18181b'}` : '2px solid transparent',
              fontSize: isSmall ? '13px' : '15px',
              fontWeight: '500',
              color: activeTab === 'dashboard' ? theme.text : theme.textMuted,
              cursor: 'pointer',
              transition: 'color 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              whiteSpace: 'nowrap'
            }}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('wallets')}
            style={{
              padding: isSmall ? '12px 14px' : '14px 18px',
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'wallets' ? `2px solid ${isDark ? '#fafafa' : '#18181b'}` : '2px solid transparent',
              fontSize: isSmall ? '13px' : '15px',
              fontWeight: '500',
              color: activeTab === 'wallets' ? theme.text : theme.textMuted,
              cursor: 'pointer',
              transition: 'color 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              whiteSpace: 'nowrap'
            }}
          >
            <Wallet style={{ width: '16px', height: '16px' }} />
            {!isSmall && 'Multi-Wallet'}
            {isSmall && 'Wallets'}
          </button>
          <button
            onClick={() => setActiveTab('entries')}
            style={{
              padding: isSmall ? '12px 14px' : '14px 18px',
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'entries' ? `2px solid ${isDark ? '#fafafa' : '#18181b'}` : '2px solid transparent',
              fontSize: isSmall ? '13px' : '15px',
              fontWeight: '500',
              color: activeTab === 'entries' ? theme.text : theme.textMuted,
              cursor: 'pointer',
              transition: 'color 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              whiteSpace: 'nowrap'
            }}
          >
            All Entries
            {entries.length > 0 && (
              <span style={{
                backgroundColor: activeTab === 'entries' ? (isDark ? '#3b82f6' : '#2563eb') : (isDark ? '#3f3f46' : '#e4e4e7'),
                color: activeTab === 'entries' ? '#fff' : theme.textMuted,
                fontSize: '12px',
                fontWeight: '600',
                padding: '3px 8px',
                borderRadius: '10px',
                minWidth: '22px',
                textAlign: 'center'
              }}>
                {entries.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Dashboard Sub-Tab Navigation */}
      {activeTab === 'dashboard' && (
        <div style={{
          backgroundColor: isDark ? '#0a0a0b' : '#ffffff',
          borderBottom: `1px solid ${theme.cardBorder}`,
          padding: isSmall ? '0 12px' : '0 24px'
        }}>
          <div style={{ width: '100%', padding: '12px 16px' }}>
            <div style={{ display: 'flex', gap: '6px', backgroundColor: theme.toggleBg, borderRadius: '8px', padding: '4px', width: 'fit-content' }}>
              <button
                onClick={() => setDashboardSubTab('add-entry')}
                style={{
                  padding: isSmall ? '8px 12px' : '8px 16px',
                  fontSize: '13px',
                  backgroundColor: dashboardSubTab === 'add-entry' ? theme.toggleActive : 'transparent',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: '500',
                  color: dashboardSubTab === 'add-entry' ? theme.text : theme.textSubtle,
                  cursor: 'pointer',
                  boxShadow: dashboardSubTab === 'add-entry' && !isDark ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                  transition: 'all 0.15s'
                }}
              >
                Add Entry
              </button>
              <button
                onClick={() => setDashboardSubTab('analytics')}
                style={{
                  padding: isSmall ? '8px 12px' : '8px 16px',
                  fontSize: '13px',
                  backgroundColor: dashboardSubTab === 'analytics' ? theme.toggleActive : 'transparent',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: '500',
                  color: dashboardSubTab === 'analytics' ? theme.text : theme.textSubtle,
                  cursor: 'pointer',
                  boxShadow: dashboardSubTab === 'analytics' && !isDark ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                  transition: 'all 0.15s'
                }}
              >
                Analytics
              </button>
              <button
                onClick={() => setDashboardSubTab('bills')}
                style={{
                  padding: isSmall ? '8px 12px' : '8px 16px',
                  fontSize: '13px',
                  backgroundColor: dashboardSubTab === 'bills' ? theme.toggleActive : 'transparent',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: '500',
                  color: dashboardSubTab === 'bills' ? theme.text : theme.textSubtle,
                  cursor: 'pointer',
                  boxShadow: dashboardSubTab === 'bills' && !isDark ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                  transition: 'all 0.15s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <CreditCard style={{ width: '14px', height: '14px' }} />
                Bills
                {entries.filter(e => e.recurring).length > 0 && (
                  <span style={{
                    backgroundColor: dashboardSubTab === 'bills' ? (isDark ? '#004AAC' : '#003d8f') : (isDark ? '#52525b' : '#d4d4d8'),
                    color: dashboardSubTab === 'bills' ? '#fff' : theme.textMuted,
                    fontSize: '10px',
                    fontWeight: '600',
                    padding: '2px 6px',
                    borderRadius: '8px',
                    minWidth: '16px',
                    textAlign: 'center'
                  }}>
                    {entries.filter(e => e.recurring).length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <main style={{ width: '100%', padding: isSmall ? '8px' : '24px 40px', boxSizing: 'border-box', overflow: 'hidden' }}>
        
        {activeTab === 'dashboard' && dashboardSubTab === 'add-entry' ? (
          <>
         {/* Top Section: Add Entry + History */}
        <div style={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row',
          gap: isSmall ? '12px' : '24px', 
          marginBottom: isSmall ? '12px' : '24px',
        }}>
          {/* Add New Entry Card */}
<div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', flex: isMobile ? 'none' : '1', minWidth: 0, maxWidth: '100%' }}>
            <h2 style={{ fontSize: isSmall ? '15px' : '16px', fontWeight: '600', color: theme.text, margin: 0, marginBottom: '16px', height: isMobile ? 'auto' : '36px', display: 'flex', alignItems: 'center' }}>Add New Entry</h2>
            
            {/* Mode Toggle */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
              <button onClick={() => { setUploadMode('file'); setUploadError(''); }} style={buttonStyle(uploadMode === 'file')}>
                <Upload style={{ width: '14px', height: '14px' }} />
                {isSmall ? 'Upload' : 'Upload File'}
              </button>
              <button onClick={() => { setUploadMode('manual'); setUploadError(''); }} style={buttonStyle(uploadMode === 'manual')}>
                <FileText style={{ width: '14px', height: '14px' }} />
                {isSmall ? 'Manual' : 'Manual Input'}
              </button>
            </div>

            {/* Category Select - Custom Dropdown */}
            <div style={{ marginBottom: '16px', position: 'relative' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: theme.textMuted, marginBottom: '6px' }}>
                Category *
              </label>
              <div style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                  style={{
                    ...inputStyle,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    textAlign: 'left'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {selectedCategory ? (
                      <>
                        <span style={{
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          backgroundColor: CATEGORIES.find(c => c.value === selectedCategory)?.color || '#71717a'
                        }} />
                        {CATEGORIES.find(c => c.value === selectedCategory)?.label}
                      </>
                    ) : (
                      <span style={{ color: theme.textDim }}>Select a category...</span>
                    )}
                  </span>
                  <ChevronDown style={{ width: '16px', height: '16px', color: theme.textMuted }} />
                </button>
                
                {categoryDropdownOpen && (
  <div style={{
    position: 'fixed',
    top: 'auto',
    left: 'auto',
    width: '280px',
    marginTop: '4px',
    backgroundColor: theme.cardBg,
    border: `1px solid ${theme.inputBorder}`,
    borderRadius: '6px',
    boxShadow: isDark ? '0 4px 12px rgba(0,0,0,0.4)' : '0 4px 12px rgba(0,0,0,0.1)',
    zIndex: 9999,
    overflow: 'hidden',
    maxHeight: '300px',
    overflowY: 'auto'
  }}>
                    {CATEGORIES.map(c => (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => {
                          setSelectedCategory(c.value);
                          setCategoryDropdownOpen(false);
                          setUploadError('');
                        }}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          backgroundColor: selectedCategory === c.value ? (isDark ? '#27272a' : '#f4f4f5') : 'transparent',
                          border: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          color: theme.text,
                          textAlign: 'left'
                        }}
                      >
                        <span style={{
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          backgroundColor: c.color,
                          flexShrink: 0
                        }} />
                        {c.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Pay from Wallet - Upload Section (smaller, inline style) */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: theme.textMuted, marginBottom: '4px' }}>
                Pay from Wallet <span style={{ fontWeight: '400', opacity: 0.7 }}>(optional)</span>
              </label>
              <select
                value={manualForm.walletId}
                onChange={(e) => setManualForm({ ...manualForm, walletId: e.target.value })}
                style={{ 
                  ...inputStyle, 
                  cursor: 'pointer',
                  height: '36px',
                  fontSize: '13px',
                  padding: '0 12px'
                }}
              >
                <option value="">No wallet</option>
                {WALLET_TYPES.map(wt => {
                  const typeWallets = wallets.filter(w => w.type === wt.type);
                  if (typeWallets.length === 0) return null;
                  return (
                    <optgroup key={wt.type} label={`${wt.icon} ${wt.label}`}>
                      {typeWallets.map(w => (
                        <option key={w.id} value={w.id}>
                          {w.name} ({currency}{w.balance.toLocaleString()})
                        </option>
                      ))}
                    </optgroup>
                  );
                })}
              </select>
            </div>

            {uploadMode === 'file' ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {pendingUpload ? (
                  <div style={{
                    border: `1px solid ${isDark ? '#065f46' : '#86efac'}`,
                    backgroundColor: isDark ? '#022c22' : '#f0fdf4',
                    borderRadius: '8px',
                    padding: isSmall ? '12px' : '16px',
                    marginTop: 'auto',
                    overflow: 'hidden'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981', flexShrink: 0 }} />
                      <span style={{ fontSize: '12px', fontWeight: '500', color: isDark ? '#34d399' : '#047857' }}>Extracted successfully</span>
                    </div>
                    <p style={{ fontSize: isSmall ? '13px' : '14px', fontWeight: '500', color: theme.text, margin: '0 0 4px', wordBreak: 'break-word', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{pendingUpload.name}</p>
                    <p style={{ fontSize: '13px', color: '#10b981', fontWeight: '600', margin: '0 0 12px' }}>{currency}{formatAmount(pendingUpload.amount)}</p>
                    <div style={{ display: 'flex', gap: '8px', flexDirection: isSmall ? 'column' : 'row' }}>
                      <button onClick={confirmPendingUpload} style={{ flex: 1, height: '40px', backgroundColor: isDark ? '#fafafa' : '#18181b', color: isDark ? '#18181b' : '#fafafa', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                        <Check style={{ width: '14px', height: '14px' }} /> Save Entry
                      </button>
                      <button onClick={cancelPendingUpload} style={{ height: '40px', backgroundColor: 'transparent', border: `1px solid ${theme.inputBorder}`, borderRadius: '6px', padding: '0 12px', fontSize: '13px', color: theme.textMuted, cursor: 'pointer' }}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : uploadedFile ? (
                  <div style={{
                    border: `1px solid ${isDark ? '#1e3a8a' : '#93c5fd'}`,
                    backgroundColor: isDark ? '#172554' : '#eff6ff',
                    borderRadius: '8px',
                    padding: isSmall ? '12px' : '16px',
                    marginTop: 'auto',
                    overflow: 'hidden'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3b82f6', flexShrink: 0 }} />
                      <span style={{ fontSize: '12px', fontWeight: '500', color: isDark ? '#60a5fa' : '#1d4ed8' }}>File attached</span>
                    </div>
                    <p style={{ fontSize: isSmall ? '13px' : '14px', color: theme.text, margin: '0 0 4px', wordBreak: 'break-word', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{uploadedFile.name}</p>
                    <p style={{ fontSize: '12px', color: theme.textSubtle, margin: '0 0 12px' }}>{(uploadedFile.size / 1024).toFixed(1)} KB</p>
                    <div style={{ display: 'flex', gap: '8px', flexDirection: isSmall ? 'column' : 'row' }}>
                      <button onClick={processAttachedFile} disabled={isProcessing} style={{ flex: 1, height: '40px', backgroundColor: isDark ? '#fafafa' : '#18181b', color: isDark ? '#18181b' : '#fafafa', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', opacity: isProcessing ? 0.7 : 1 }}>
                        {isProcessing ? <><Loader2 style={{ width: '14px', height: '14px', animation: 'spin 1s linear infinite' }} /> Extracting...</> : <><Upload style={{ width: '14px', height: '14px' }} /> Extract Data</>}
                      </button>
                      <button onClick={clearAttachedFile} disabled={isProcessing} style={{ height: '40px', backgroundColor: 'transparent', border: `1px solid ${theme.inputBorder}`, borderRadius: '6px', padding: '0 12px', fontSize: '13px', color: theme.textMuted, cursor: 'pointer' }}>
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <label style={{
                    display: 'block',
                    border: '2px dashed',
                    borderColor: selectedCategory ? theme.inputBorder : '#ef4444',
                    backgroundColor: selectedCategory ? 'transparent' : (isDark ? 'rgba(127, 29, 29, 0.1)' : '#fef2f2'),
                    borderRadius: '8px',
                    padding: isSmall ? '30px 16px' : '40px 20px',
                    textAlign: 'center',
                    cursor: selectedCategory ? 'pointer' : 'not-allowed',
                    marginTop: 'auto'
                  }}>
                    <Upload style={{ width: '28px', height: '28px', color: selectedCategory ? theme.textDim : '#ef4444', margin: '0 auto 8px' }} />
                    <p style={{ fontSize: '14px', color: selectedCategory ? theme.textMuted : '#ef4444', fontWeight: '500', margin: '0 0 4px' }}>
                      {selectedCategory ? 'Tap to upload' : 'Select a category first'}
                    </p>
                    <p style={{ fontSize: '12px', color: theme.textDim, margin: 0 }}>PDF or Image (max 10MB)</p>
                    <input type="file" accept="image/*,.pdf" onChange={handleFileSelect} disabled={!selectedCategory} style={{ display: 'none' }} />
                  </label>
                )}
              </div>
            ) : uploadMode === 'manual' ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ flex: 1 }} />
                <div style={{ display: 'grid', gridTemplateColumns: isSmall ? '1fr' : '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: theme.textMuted, marginBottom: '6px' }}>Name *</label>
                    <input placeholder="e.g., Electric Bill" value={manualForm.name} onChange={(e) => setManualForm({ ...manualForm, name: e.target.value })} style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: theme.textMuted, marginBottom: '6px' }}>Amount *</label>
                    <input type="number" step="0.01" placeholder="0.00" value={manualForm.amount} onChange={(e) => setManualForm({ ...manualForm, amount: e.target.value })} style={inputStyle} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: theme.textMuted, marginBottom: '6px' }}>Date</label>
                    <input type="date" value={manualForm.date} onChange={(e) => setManualForm({ ...manualForm, date: e.target.value })} style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: theme.textMuted, marginBottom: '6px' }}>Due Date</label>
                    <input type="date" value={manualForm.dueDate} onChange={(e) => setManualForm({ ...manualForm, dueDate: e.target.value })} style={inputStyle} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: theme.textMuted, marginBottom: '6px' }}>Pay from Wallet</label>
                    <select
                      value={manualForm.walletId}
                      onChange={(e) => setManualForm({ ...manualForm, walletId: e.target.value })}
                      style={{ ...inputStyle, cursor: 'pointer' }}
                    >
                      <option value="">No wallet (optional)</option>
                      {WALLET_TYPES.map(wt => {
                        const typeWallets = wallets.filter(w => w.type === wt.type);
                        if (typeWallets.length === 0) return null;
                        return (
                          <optgroup key={wt.type} label={`${wt.icon} ${wt.label}`}>
                            {typeWallets.map(w => (
                              <option key={w.id} value={w.id}>
                                {w.name} ({currency}{w.balance.toLocaleString()})
                              </option>
                            ))}
                          </optgroup>
                        );
                      })}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: theme.textMuted, marginBottom: '6px' }}>Recurring</label>
                    <select
                      value={manualForm.recurring}
                      onChange={(e) => setManualForm({ ...manualForm, recurring: e.target.value })}
                      style={{ ...inputStyle, cursor: 'pointer' }}
                    >
                      <option value="">None</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: theme.textMuted, marginBottom: '6px' }}>Notes (optional)</label>
                  <input 
                    type="text" 
                    placeholder="Add a memo or note..." 
                    value={manualForm.notes} 
                    onChange={(e) => setManualForm({ ...manualForm, notes: e.target.value })} 
                    style={inputStyle} 
                  />
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {(manualForm.name || manualForm.amount || manualForm.date || manualForm.dueDate || manualForm.notes || manualForm.recurring || manualForm.walletId || selectedCategory) && (
                    <button 
                      onClick={() => {
                        setManualForm({ name: '', amount: '', date: '', dueDate: '', notes: '', recurring: '', walletId: '' });
                        setSelectedCategory('');
                      }}
                      style={{ 
                        height: '44px', 
                        padding: '0 16px',
                        backgroundColor: 'transparent', 
                        border: `1px solid ${theme.inputBorder}`, 
                        borderRadius: '6px', 
                        fontSize: '14px', 
                        fontWeight: '500', 
                        color: theme.textMuted,
                        cursor: 'pointer', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        gap: '6px'
                      }}
                    >
                      <X style={{ width: '14px', height: '14px' }} />
                      Clear
                    </button>
                  )}
                  <button onClick={handleManualSubmit} disabled={!selectedCategory || isSaving} style={{ flex: 1, height: '44px', backgroundColor: isDark ? '#fafafa' : '#18181b', color: isDark ? '#18181b' : '#fafafa', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: (!selectedCategory || isSaving) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', opacity: (!selectedCategory || isSaving) ? 0.5 : 1 }}>
                    {isSaving ? <><Loader2 style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} /> Saving...</> : <><Plus style={{ width: '16px', height: '16px' }} /> Add Entry</>}
                  </button>
                </div>
              </div>
            ) : null}
          </div>

          {/* History Card */}
          <div style={{...cardStyle, display: 'flex', flexDirection: 'column', flex: isMobile ? 'none' : '1.5', minWidth: 0, maxWidth: '100%', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px', height: isMobile ? 'auto' : '36px' }}>
              <h2 style={{ fontSize: isSmall ? '15px' : '16px', fontWeight: '600', color: theme.text, margin: 0, display: 'flex', alignItems: 'center' }}>History</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: isMobile ? '1 1 100%' : 'none' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <Search style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', width: '14px', height: '14px', color: theme.textDim }} />
                  <input
                    placeholder="Search..."
                    value={historySearch}
                    onChange={(e) => setHistorySearch(e.target.value)}
                    style={{ ...inputStyle, width: '100%', paddingLeft: '32px' }}
                  />
                </div>
                <select value={historyFilter} onChange={(e) => setHistoryFilter(e.target.value)} style={{ ...inputStyle, width: isSmall ? '70px' : '80px', cursor: 'pointer', flexShrink: 0 }}>
                  <option>All</option>
                  <option>Today</option>
                  <option>Week</option>
                  <option>Month</option>
                  <option>Year</option>
                </select>
              </div>
            </div>

            {/* Table Container */}
            <div style={{ overflowX: 'auto', flex: 1, maxHeight: '280px', overflowY: filteredEntries.length > 5 ? 'auto' : 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                <thead style={{ position: 'sticky', top: 0, backgroundColor: theme.cardBg, zIndex: 1 }}>
                  <tr style={{ borderBottom: `1px solid ${theme.cardBorder}` }}>
                    <th style={{ padding: '8px 8px 8px 0', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: theme.textSubtle, width: isSmall ? '65px' : '85px' }}>Type</th>
                    <th style={{ padding: '8px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: theme.textSubtle, width: 'auto' }}>Name</th>
                    <th style={{ padding: '8px', textAlign: 'right', fontSize: '12px', fontWeight: '500', color: theme.textSubtle, width: isSmall ? '80px' : '90px' }}>Amount</th>
                    <th style={{ padding: '8px', textAlign: 'center', fontSize: '12px', fontWeight: '500', color: theme.textSubtle, width: isSmall ? '50px' : '70px' }}>Wallet</th>
                    <th style={{ padding: '8px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: theme.textSubtle, width: isSmall ? '75px' : '85px' }}>Date</th>
                    <th style={{ padding: '8px 0 8px 8px', textAlign: 'center', fontSize: '12px', fontWeight: '500', color: theme.textSubtle, width: isSmall ? '55px' : '65px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEntries.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '60px 16px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                          <div style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            backgroundColor: isDark ? '#27272a' : '#f4f4f5',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <FileText style={{ width: '36px', height: '36px', color: theme.textDim }} />
                          </div>
                          <div>
                            <p style={{ fontSize: '16px', fontWeight: '600', color: theme.textMuted, margin: '0 0 6px' }}>
                              {historySearch || advancedCategory !== 'all' || advancedDateFrom || advancedDateTo 
                                ? 'No matching entries found' 
                                : 'No expenses recorded yet'}
                            </p>
                            <p style={{ fontSize: '13px', color: theme.textDim, margin: 0, maxWidth: '300px' }}>
                              {historySearch || advancedCategory !== 'all' || advancedDateFrom || advancedDateTo 
                                ? 'Try adjusting your filters or search term' 
                                : 'Go to Dashboard to add your first expense'}
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredEntries.map(entry => {
                      const badge = getBadgeStyle(entry.type, isDark);
                      return (
                        <tr 
                          key={entry.id} 
                          onDoubleClick={() => setEditingEntry({...entry, amount: entry.amount.toString()})}
                          style={{ 
                            borderBottom: `1px solid ${theme.cardBorder}`,
                            cursor: 'pointer',
                            transition: 'background-color 0.15s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDark ? '#1f1f23' : '#fafafa'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <td style={{ padding: '10px 8px 10px 0', verticalAlign: 'middle' }}>
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              padding: '4px 8px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              fontWeight: '500',
                              backgroundColor: badge.bg,
                              color: badge.color,
                              border: `1px solid ${badge.border}`,
                              width: isSmall ? '60px' : '75px',
                              textTransform: 'capitalize'
                            }}>
                              {entry.type}
                            </span>
                          </td>
                          <td style={{ padding: '10px 8px', verticalAlign: 'middle', maxWidth: '200px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <p style={{ fontSize: '13px', fontWeight: '500', color: theme.text, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{entry.name}</p>
                              {entry.file && (
                                <span title="Has attachment" style={{ flexShrink: 0, cursor: 'pointer' }} onClick={() => setPreviewFile(entry)}>
                                  <FileText style={{ width: '12px', height: '12px', color: '#3b82f6' }} />
                                </span>
                              )}
                              {entry.recurring && (
                                <span style={{ 
                                  fontSize: '9px', 
                                  fontWeight: '600', 
                                  padding: '2px 5px', 
                                  borderRadius: '4px', 
                                  backgroundColor: isDark ? '#1e3a5f' : '#dbeafe', 
                                  color: isDark ? '#60a5fa' : '#1d4ed8',
                                  textTransform: 'uppercase',
                                  flexShrink: 0
                                }}>
                                  {entry.recurring === 'weekly' ? 'W' : entry.recurring === 'monthly' ? 'M' : 'Y'}
                                </span>
                              )}
                              {entry.notes && (
                                <span title={entry.notes} style={{ flexShrink: 0, cursor: 'help' }}>
                                  <MessageSquare style={{ width: '12px', height: '12px', color: theme.textMuted }} />
                                </span>
                              )}
                            </div>
                          </td>
                          <td style={{ padding: '10px 8px', verticalAlign: 'middle', textAlign: 'right' }}>
                            <span style={{ fontSize: '13px', fontWeight: '600', color: theme.text }}>{currency}{formatAmount(entry.amount)}</span>
                          </td>
                          <td style={{ padding: '10px 8px', verticalAlign: 'middle', textAlign: 'center' }}>
                            {entry.walletId ? (
                              (() => {
                                const wallet = wallets.find(w => w.id === entry.walletId);
                                return wallet ? (
                                  <span style={{ 
                                    display: 'inline-flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    gap: '3px',
                                    fontSize: '10px',
                                    padding: '2px 5px',
                                    borderRadius: '4px',
                                    backgroundColor: `${wallet.color}15`,
                                    color: wallet.color
                                  }}>
                                    <span style={{ fontSize: '11px' }}>{wallet.icon}</span>
                                  </span>
                                ) : (
                                  <span style={{ fontSize: '11px', color: theme.textDim }}>-</span>
                                );
                              })()
                            ) : (
                              <span style={{ fontSize: '11px', color: theme.textDim }}>-</span>
                            )}
                          </td>
                          <td style={{ padding: '10px 8px', verticalAlign: 'middle' }}>
                            <span style={{ fontSize: '11px', color: theme.textSubtle }}>{new Date(entry.date).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}</span>
                          </td>
                          <td style={{ padding: '10px 0 10px 8px', verticalAlign: 'middle', textAlign: 'center' }}>
                            <div style={{ display: 'flex', gap: '2px', justifyContent: 'center' }}>
                              {entry.file && (
                                <>
                                  <button onClick={() => setPreviewFile(entry)} style={{ width: '24px', height: '24px', backgroundColor: 'transparent', border: 'none', borderRadius: '4px', color: theme.textSubtle, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }} title="View file">
                                    <Eye style={{ width: '13px', height: '13px' }} />
                                  </button>
                                  <button onClick={() => handleDownloadFile(entry)} style={{ width: '24px', height: '24px', backgroundColor: 'transparent', border: 'none', borderRadius: '4px', color: theme.textSubtle, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }} title="Download file">
                                    <Download style={{ width: '13px', height: '13px' }} />
                                  </button>
                                </>
                              )}
                              <button onClick={() => setEditingEntry({...entry, amount: entry.amount.toString()})} style={{ width: '24px', height: '24px', backgroundColor: 'transparent', border: 'none', borderRadius: '4px', color: theme.textSubtle, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
                                <Edit style={{ width: '13px', height: '13px' }} />
                              </button>
                              <button onClick={() => setDeletingEntry(entry)} style={{ width: '24px', height: '24px', backgroundColor: 'transparent', border: 'none', borderRadius: '4px', color: theme.textSubtle, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
  <Trash2 style={{ width: '13px', height: '13px' }} />
</button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {filteredEntries.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', paddingTop: '12px', marginTop: 'auto', borderTop: `1px solid ${theme.cardBorder}` }}>
                <ChevronDown style={{ width: '16px', height: '16px', color: theme.textDim }} />
                <span style={{ fontSize: '12px', color: theme.textDim }}>{filteredEntries.length} items</span>
              </div>
            )}
          </div>
        </div>

{/* Recent Entries and Monthly Budget Side by Side */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', 
          gap: isSmall ? '12px' : '20px', 
          marginBottom: isSmall ? '12px' : '24px' 
        }}>
          {/* Recent Entries */}
          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h2 style={{ fontSize: isSmall ? '15px' : '16px', fontWeight: '600', color: theme.text, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Receipt style={{ width: '18px', height: '18px', color: theme.textMuted }} />
                Recent Entries
              </h2>
              {entries.length > 0 && (
                <button
                  onClick={() => setActiveTab('entries')}
                  style={{
                    fontSize: '13px',
                    color: '#3b82f6',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  View All
                  <ChevronDown style={{ width: '14px', height: '14px', transform: 'rotate(-90deg)' }} />
                </button>
              )}
            </div>
            
            {entries.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {entries.slice(0, 4).map(entry => {
                  const badge = getBadgeStyle(entry.type, isDark);
                  const categoryInfo = CATEGORIES.find(c => c.value === entry.type);
                  return (
                    <div 
                      key={entry.id}
                      onClick={() => setEditingEntry({...entry, amount: entry.amount.toString()})}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px',
                        backgroundColor: theme.statBg,
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'transform 0.15s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(2px)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
                    >
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        backgroundColor: badge.bg,
                        border: `1px solid ${badge.border}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <span style={{ fontSize: '14px' }}>
                          {entry.type === 'utilities' && '⚡'}
                          {entry.type === 'subscription' && '📱'}
                          {entry.type === 'food' && '🍔'}
                          {entry.type === 'shopping' && '🛍️'}
                          {entry.type === 'healthcare' && '💊'}
                          {entry.type === 'entertainment' && '🎬'}
                          {entry.type === 'other' && '📦'}
                        </span>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: '13px', fontWeight: '500', color: theme.text, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {entry.name}
                        </p>
                        <p style={{ fontSize: '11px', color: theme.textMuted, margin: '2px 0 0' }}>
                          {categoryInfo?.label} • {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                      <p style={{ fontSize: '14px', fontWeight: '600', color: theme.text, margin: 0, flexShrink: 0 }}>
                        {currency}{formatAmount(entry.amount)}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                padding: '32px 16px',
                backgroundColor: theme.statBg,
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: isDark ? '#27272a' : '#e4e4e7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '12px'
                }}>
                  <Receipt style={{ width: '24px', height: '24px', color: theme.textMuted }} />
                </div>
                <p style={{ fontSize: '14px', fontWeight: '500', color: theme.text, margin: '0 0 4px' }}>No entries yet</p>
                <p style={{ fontSize: '12px', color: theme.textMuted, margin: '0 0 16px' }}>Add your first expense to get started</p>
                <button
                  onClick={() => setDashboardSubTab('add-entry')}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#3b82f6',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Plus style={{ width: '14px', height: '14px' }} />
                  Add Entry
                </button>
              </div>
            )}
          </div>

          {/* Monthly Budget Card */}
          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h2 style={{ fontSize: isSmall ? '15px' : '16px', fontWeight: '600', color: theme.text, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Wallet style={{ width: '18px', height: '18px', color: theme.textMuted }} />
                Monthly Budget
              </h2>
              {monthlyBudget > 0 && (
                <button
                  onClick={() => { setBudgetInput(monthlyBudget.toString()); setShowBudgetModal(true); }}
                  style={{ fontSize: '12px', color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  Edit
                </button>
              )}
            </div>
            
            {monthlyBudget > 0 && budgetStatus ? (
              <div>
                {/* Budget Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ padding: '12px', backgroundColor: theme.statBg, borderRadius: '8px', textAlign: 'center' }}>
                    <p style={{ fontSize: '11px', color: theme.textMuted, margin: '0 0 4px', textTransform: 'uppercase' }}>Budget</p>
                    <p style={{ fontSize: '18px', fontWeight: '700', color: theme.text, margin: 0 }}>{currency}{formatAmount(monthlyBudget)}</p>
                  </div>
                  <div style={{ padding: '12px', backgroundColor: theme.statBg, borderRadius: '8px', textAlign: 'center' }}>
                    <p style={{ fontSize: '11px', color: theme.textMuted, margin: '0 0 4px', textTransform: 'uppercase' }}>Spent</p>
                    <p style={{ fontSize: '18px', fontWeight: '700', color: budgetStatus.color, margin: 0 }}>{currency}{formatAmount(budgetStatus.spent)}</p>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '12px', color: theme.textMuted }}>{budgetStatus.percentage.toFixed(0)}% used</span>
                    <span style={{ fontSize: '12px', fontWeight: '500', color: budgetStatus.status === 'over' ? '#ef4444' : theme.textMuted }}>
                      {budgetStatus.status === 'over' ? `Over by ${currency}${formatAmount(Math.abs(budgetStatus.remaining))}` : `${currency}${formatAmount(budgetStatus.remaining)} left`}
                    </span>
                  </div>
                  <div style={{ 
                    height: '10px', 
                    backgroundColor: isDark ? '#27272a' : '#e4e4e7', 
                    borderRadius: '5px', 
                    overflow: 'hidden'
                  }}>
                    <div style={{ 
                      height: '100%', 
                      width: `${Math.min(budgetStatus.percentage, 100)}%`, 
                      backgroundColor: budgetStatus.color,
                      borderRadius: '5px',
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                </div>
                
                {/* Status Alert */}
                {budgetStatus.status === 'over' && (
                  <div style={{ padding: '10px', backgroundColor: isDark ? 'rgba(239, 68, 68, 0.15)' : '#fee2e2', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertTriangle style={{ width: '14px', height: '14px', color: '#ef4444', flexShrink: 0 }} />
                    <span style={{ fontSize: '12px', color: isDark ? '#fca5a5' : '#dc2626' }}>Budget exceeded!</span>
                  </div>
                )}
                {budgetStatus.status === 'warning' && (
                  <div style={{ padding: '10px', backgroundColor: isDark ? 'rgba(245, 158, 11, 0.15)' : '#fef3c7', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertCircle style={{ width: '14px', height: '14px', color: '#f59e0b', flexShrink: 0 }} />
                    <span style={{ fontSize: '12px', color: isDark ? '#fcd34d' : '#b45309' }}>Approaching limit</span>
                  </div>
                )}
                {budgetStatus.status === 'safe' && (
                  <div style={{ padding: '10px', backgroundColor: isDark ? 'rgba(34, 197, 94, 0.15)' : '#dcfce7', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Check style={{ width: '14px', height: '14px', color: '#22c55e', flexShrink: 0 }} />
                    <span style={{ fontSize: '12px', color: isDark ? '#86efac' : '#166534' }}>On track this month</span>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: theme.statBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px'
                }}>
                  <PiggyBank style={{ width: '24px', height: '24px', color: theme.textMuted }} />
                </div>
                <p style={{ fontSize: '13px', color: theme.textMuted, margin: '0 0 12px' }}>Set a budget to track your spending</p>
                <button
                  onClick={() => { setBudgetInput(''); setShowBudgetModal(true); }}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: isDark ? '#fafafa' : '#18181b',
                    color: isDark ? '#18181b' : '#fafafa',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Set Budget
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Insights and Chart Section */}
        <div style={{ ...cardStyle, marginBottom: isSmall ? '12px' : '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
            <h2 style={{ fontSize: isSmall ? '14px' : '16px', fontWeight: '600', color: theme.text, margin: 0 }}>Spending Overview</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', flex: isSmall ? '1 1 100%' : 'none' }}>
              {/* Category Filter */}
              <select
                value={dashboardCategory}
                onChange={(e) => setDashboardCategory(e.target.value)}
                style={{
                  height: '32px',
                  backgroundColor: theme.inputBg,
                  border: `1px solid ${theme.inputBorder}`,
                  borderRadius: '6px',
                  padding: '0 6px',
                  fontSize: isSmall ? '11px' : '13px',
                  color: theme.text,
                  cursor: 'pointer',
                  outline: 'none',
                  flex: isSmall ? '1' : 'none',
                  minWidth: 0
                }}
              >
                <option value="all">All Categories</option>
                {CATEGORIES.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
              
              {/* Time Filter */}
              <div style={{ display: 'flex', gap: '2px', backgroundColor: theme.toggleBg, borderRadius: '6px', padding: '3px' }}>
                {['Day', 'Month', 'Year'].map(v => (
                  <button
                    key={v}
                    onClick={() => setDashboardView(v)}
                    style={{
                      padding: isSmall ? '4px 8px' : '6px 16px',
                      fontSize: isSmall ? '11px' : '13px',
                      backgroundColor: dashboardView === v ? theme.toggleActive : 'transparent',
                      border: 'none',
                      borderRadius: '4px',
                      fontWeight: '500',
                      color: dashboardView === v ? theme.text : theme.textSubtle,
                      cursor: 'pointer',
                      boxShadow: dashboardView === v && !isDark ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
                    }}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          {isSmall ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
              {[
                { label: 'Today', value: stats.today },
                { label: 'This Month', value: stats.month },
                { label: 'This Year', value: stats.year },
                { label: 'All Time', value: stats.total },
              ].map(stat => (
                <div key={stat.label} style={{ backgroundColor: theme.statBg, borderRadius: '8px', padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p style={{ fontSize: '13px', color: theme.textSubtle, margin: 0 }}>{stat.label}</p>
                  <p style={{ fontSize: '13px', fontWeight: '600', color: theme.text, margin: 0 }}>{currency}{formatAmount(stat.value)}</p>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: '12px', marginBottom: '16px' }}>
              {[
                { label: 'Today', value: stats.today },
                { label: 'This Month', value: stats.month },
                { label: 'This Year', value: stats.year },
                { label: 'All Time', value: stats.total },
              ].map(stat => (
                <div key={stat.label} style={{ backgroundColor: theme.statBg, borderRadius: '8px', padding: '14px' }}>
                  <p style={{ fontSize: '12px', color: theme.textSubtle, margin: '0 0 4px' }}>{stat.label}</p>
                  <p style={{ fontSize: '20px', fontWeight: '700', color: theme.text, margin: 0 }}>{currency}{formatAmount(stat.value)}</p>
                </div>
              ))}
            </div>
          )}

          {/* Insights and Chart Side by Side */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1.5fr', gap: '16px' }}>
            {/* 6-Month Insights */}
            <div style={{ backgroundColor: theme.statBg, borderRadius: '8px', padding: isSmall ? '12px' : '16px' }}>
              <p style={{ fontSize: '13px', fontWeight: '600', color: theme.text, margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <TrendingUp style={{ width: '14px', height: '14px', color: theme.textMuted }} />
                6-Month Insights
              </p>
              
              {(() => {
                const now = new Date();
                const currentMonth = now.getMonth();
                const currentYear = now.getFullYear();
                
                // Get last 6 months of data
                const monthlyTotals = [];
                for (let i = 5; i >= 0; i--) {
                  const targetMonth = new Date(currentYear, currentMonth - i, 1);
                  const monthEntries = entries.filter(e => {
                    const d = new Date(e.date);
                    return d.getMonth() === targetMonth.getMonth() && d.getFullYear() === targetMonth.getFullYear();
                  });
                  const total = monthEntries.reduce((sum, e) => sum + e.amount, 0);
                  monthlyTotals.push({
                    month: targetMonth.toLocaleDateString('en-US', { month: 'short' }),
                    fullMonth: targetMonth.toLocaleDateString('en-US', { month: 'long' }),
                    total,
                    entries: monthEntries.length
                  });
                }
                
                const thisMonth = monthlyTotals[5];
                const lastMonth = monthlyTotals[4];
                const monthChange = lastMonth.total > 0 ? ((thisMonth.total - lastMonth.total) / lastMonth.total * 100) : 0;
                const avgSpending = monthlyTotals.slice(0, 5).reduce((sum, m) => sum + m.total, 0) / 5;
                const vsAverage = avgSpending > 0 ? ((thisMonth.total - avgSpending) / avgSpending * 100) : 0;
                
                // Find highest and lowest months
                const sortedMonths = [...monthlyTotals].sort((a, b) => b.total - a.total);
                const highestMonth = sortedMonths[0];
                const lowestMonth = sortedMonths.filter(m => m.total > 0).pop() || sortedMonths[5];
                
                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {/* This Month vs Last Month */}
                    <div style={{ 
                      padding: '10px 12px', 
                      backgroundColor: theme.cardBg, 
                      borderRadius: '6px',
                      border: `1px solid ${theme.cardBorder}`
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontSize: '11px', color: theme.textMuted }}>vs Last Month</span>
                        <span style={{ 
                          fontSize: '12px', 
                          fontWeight: '600', 
                          color: monthChange > 0 ? '#ef4444' : monthChange < 0 ? '#22c55e' : theme.textMuted,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '2px'
                        }}>
                          {monthChange > 0 ? <TrendingUp style={{ width: '12px', height: '12px' }} /> : monthChange < 0 ? <TrendingDown style={{ width: '12px', height: '12px' }} /> : null}
                          {monthChange > 0 ? '+' : ''}{monthChange.toFixed(1)}%
                        </span>
                      </div>
                      <div style={{ fontSize: '11px', color: theme.textSubtle }}>
                        {thisMonth.fullMonth}: {currency}{formatAmount(thisMonth.total)} vs {lastMonth.month}: {currency}{formatAmount(lastMonth.total)}
                      </div>
                    </div>
                    
                    {/* vs 5-Month Average */}
                    <div style={{ 
                      padding: '10px 12px', 
                      backgroundColor: theme.cardBg, 
                      borderRadius: '6px',
                      border: `1px solid ${theme.cardBorder}`
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontSize: '11px', color: theme.textMuted }}>vs 5-Month Avg</span>
                        <span style={{ 
                          fontSize: '12px', 
                          fontWeight: '600', 
                          color: vsAverage > 0 ? '#ef4444' : vsAverage < 0 ? '#22c55e' : theme.textMuted 
                        }}>
                          {vsAverage > 0 ? '+' : ''}{vsAverage.toFixed(1)}%
                        </span>
                      </div>
                      <div style={{ fontSize: '11px', color: theme.textSubtle }}>
                        Avg: {currency}{formatAmount(avgSpending)}/month
                      </div>
                    </div>
                    
                    {/* Highest Spending Month */}
                    <div style={{ 
                      padding: '10px 12px', 
                      backgroundColor: isDark ? 'rgba(239, 68, 68, 0.1)' : '#fef2f2', 
                      borderRadius: '6px',
                      border: `1px solid ${isDark ? '#7f1d1d' : '#fecaca'}`
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '11px', color: isDark ? '#fca5a5' : '#dc2626' }}>📈 Highest</span>
                        <span style={{ fontSize: '12px', fontWeight: '600', color: '#ef4444' }}>{highestMonth.month}</span>
                      </div>
                      <div style={{ fontSize: '11px', color: theme.textSubtle, marginTop: '2px' }}>
                        {currency}{formatAmount(highestMonth.total)} ({highestMonth.entries} entries)
                      </div>
                    </div>
                    
                    {/* Lowest Spending Month */}
                    <div style={{ 
                      padding: '10px 12px', 
                      backgroundColor: isDark ? 'rgba(34, 197, 94, 0.1)' : '#dcfce7', 
                      borderRadius: '6px',
                      border: `1px solid ${isDark ? '#166534' : '#bbf7d0'}`
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '11px', color: isDark ? '#86efac' : '#166534' }}>📉 Lowest</span>
                        <span style={{ fontSize: '12px', fontWeight: '600', color: '#22c55e' }}>{lowestMonth.month}</span>
                      </div>
                      <div style={{ fontSize: '11px', color: theme.textSubtle, marginTop: '2px' }}>
                        {currency}{formatAmount(lowestMonth.total)} ({lowestMonth.entries} entries)
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Monthly Spending Trend Chart */}
            <div style={{ backgroundColor: theme.statBg, borderRadius: '8px', padding: isSmall ? '12px' : '16px' }}>
              <p style={{ fontSize: '13px', fontWeight: '600', color: theme.text, margin: '0 0 12px' }}>Monthly Spending Trend</p>
              <ResponsiveContainer width="100%" height={isSmall ? 160 : 180}>
                <BarChart data={monthlyData}>
                  <XAxis dataKey="name" tick={{ fontSize: isSmall ? 10 : 11, fill: theme.textSubtle }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: isSmall ? 10 : 11, fill: theme.textSubtle }} axisLine={false} tickLine={false} width={isSmall ? 35 : 45} />
                  <Tooltip formatter={(v) => `${currency}${formatAmount(v)}`} contentStyle={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.inputBorder}`, borderRadius: '6px', color: theme.text, fontSize: '12px' }} cursor={{ fill: 'transparent' }} />
                  <Bar dataKey="amount" fill={theme.barColor} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
          </>
        ) : activeTab === 'dashboard' && dashboardSubTab === 'analytics' ? (
          /* Analytics Tab */
          <>
            {/* Analytics Header with Filters */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: '600', color: theme.text, margin: '0 0 4px' }}>Financial Overview</h2>
                  <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0 }}>Track your spending patterns and financial health</p>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => setAnalyticsShowFilter(!analyticsShowFilter)}
                    style={{
                      height: '36px',
                      padding: '0 14px',
                      backgroundColor: analyticsShowFilter ? (isDark ? '#27272a' : '#f4f4f5') : 'transparent',
                      border: `1px solid ${analyticsShowFilter ? theme.text : theme.inputBorder}`,
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: '500',
                      color: analyticsShowFilter ? theme.text : theme.textMuted,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Search style={{ width: '14px', height: '14px' }} />
                    Advanced Filter
                    <ChevronDown style={{ width: '14px', height: '14px', transform: analyticsShowFilter ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                  </button>
                </div>
              </div>

              {/* Advanced Filter Panel */}
              {analyticsShowFilter && (
                <div style={{
                  padding: '16px',
                  backgroundColor: isDark ? '#1a1a1d' : '#fafafa',
                  border: `1px solid ${theme.cardBorder}`,
                  borderRadius: '8px',
                  display: 'flex',
                  gap: '16px',
                  flexWrap: 'wrap',
                  alignItems: 'flex-end'
                }}>
                  <div style={{ flex: '1', minWidth: '140px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: theme.textMuted, marginBottom: '6px' }}>
                      From Date
                    </label>
                    <input
                      type="date"
                      value={analyticsDateFrom}
                      onChange={(e) => setAnalyticsDateFrom(e.target.value)}
                      style={{ ...inputStyle, width: '100%' }}
                    />
                  </div>
                  <div style={{ flex: '1', minWidth: '140px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: theme.textMuted, marginBottom: '6px' }}>
                      To Date
                    </label>
                    <input
                      type="date"
                      value={analyticsDateTo}
                      onChange={(e) => setAnalyticsDateTo(e.target.value)}
                      style={{ ...inputStyle, width: '100%' }}
                    />
                  </div>
                  <div style={{ flex: '1', minWidth: '140px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: theme.textMuted, marginBottom: '6px' }}>
                      Category
                    </label>
                    <select
                      value={analyticsCategory}
                      onChange={(e) => setAnalyticsCategory(e.target.value)}
                      style={{ ...inputStyle, width: '100%', cursor: 'pointer' }}
                    >
                      <option value="all">All Categories</option>
                      {CATEGORIES.map(c => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                      ))}
                    </select>
                  </div>
                  <div style={{ flex: '1', minWidth: '140px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: theme.textMuted, marginBottom: '6px' }}>
                      Compare with Month
                    </label>
                    <input
                      type="month"
                      value={analyticsCompareMonth}
                      onChange={(e) => setAnalyticsCompareMonth(e.target.value)}
                      style={{ ...inputStyle, width: '100%' }}
                    />
                  </div>
                  <button
                    onClick={() => {
                      setAnalyticsDateFrom('');
                      setAnalyticsDateTo('');
                      setAnalyticsCategory('all');
                      setAnalyticsCompareMonth('');
                    }}
                    style={{
                      height: '36px',
                      padding: '0 12px',
                      backgroundColor: 'transparent',
                      border: `1px solid ${theme.inputBorder}`,
                      borderRadius: '6px',
                      fontSize: '13px',
                      color: theme.textMuted,
                      cursor: 'pointer'
                    }}
                  >
                    Clear All
                  </button>
                </div>
              )}

              {/* Month Comparison Card */}
              {analyticsCompareMonth && getComparisonData() && (
                <div style={{
                  marginTop: '16px',
                  padding: '16px',
                  backgroundColor: isDark ? '#1a1a1d' : '#fafafa',
                  border: `1px solid ${theme.cardBorder}`,
                  borderRadius: '8px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <TrendingUp style={{ width: '16px', height: '16px', color: theme.textMuted }} />
                    <span style={{ fontSize: '14px', fontWeight: '600', color: theme.text }}>Month Comparison</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)', gap: '16px' }}>
                    <div>
                      <p style={{ fontSize: '12px', color: theme.textMuted, margin: '0 0 4px' }}>{getComparisonData().currentMonth}</p>
                      <p style={{ fontSize: '20px', fontWeight: '700', color: theme.text, margin: 0 }}>{currency}{formatAmount(getComparisonData().currentTotal)}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '12px', color: theme.textMuted, margin: '0 0 4px' }}>{getComparisonData().compareMonth}</p>
                      <p style={{ fontSize: '20px', fontWeight: '700', color: theme.text, margin: 0 }}>{currency}{formatAmount(getComparisonData().compareTotal)}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '12px', color: theme.textMuted, margin: '0 0 4px' }}>Difference</p>
                      <p style={{ fontSize: '20px', fontWeight: '700', color: getComparisonData().isIncrease ? '#ef4444' : '#10b981', margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {getComparisonData().isIncrease ? <ArrowUpRight style={{ width: '18px', height: '18px' }} /> : <ArrowDownRight style={{ width: '18px', height: '18px' }} />}
                        {currency}{formatAmount(Math.abs(getComparisonData().difference))}
                      </p>
                    </div>
                    <div>
                      <p style={{ fontSize: '12px', color: theme.textMuted, margin: '0 0 4px' }}>Change</p>
                      <p style={{ 
                        fontSize: '20px', 
                        fontWeight: '700', 
                        color: getComparisonData().isIncrease ? '#ef4444' : '#10b981', 
                        margin: 0 
                      }}>
                        {getComparisonData().isIncrease ? '+' : '-'}{Math.abs(getComparisonData().percentChange).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Active Filters Indicator */}
              {(analyticsDateFrom || analyticsDateTo || analyticsCategory !== 'all') && (
                <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '12px', color: theme.textMuted }}>Active filters:</span>
                  {analyticsDateFrom && (
                    <span style={{ fontSize: '11px', padding: '4px 8px', backgroundColor: isDark ? '#27272a' : '#f4f4f5', borderRadius: '4px', color: theme.text }}>
                      From: {new Date(analyticsDateFrom).toLocaleDateString()}
                    </span>
                  )}
                  {analyticsDateTo && (
                    <span style={{ fontSize: '11px', padding: '4px 8px', backgroundColor: isDark ? '#27272a' : '#f4f4f5', borderRadius: '4px', color: theme.text }}>
                      To: {new Date(analyticsDateTo).toLocaleDateString()}
                    </span>
                  )}
                  {analyticsCategory !== 'all' && (
                    <span style={{ fontSize: '11px', padding: '4px 8px', backgroundColor: isDark ? '#27272a' : '#f4f4f5', borderRadius: '4px', color: theme.text }}>
                      {CATEGORIES.find(c => c.value === analyticsCategory)?.label}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Top Stats Cards */}
            {(() => {
              const analyticsStats = getAnalyticsStats();
              const analyticsCatData = getAnalyticsCategoryData();
              const analyticsMonthData = getAnalyticsMonthlyData();
              const filteredAnalyticsEntries = getAnalyticsFilteredEntries();
              return (
              <>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: isSmall ? '1fr' : isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', 
              gap: '16px', 
              marginBottom: '24px' 
            }}>
              {/* Total Spending Card */}
              <div style={{
                ...cardStyle,
                background: isDark 
                  ? 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)' 
                  : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                border: 'none'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', fontWeight: '500' }}>Total Spending</span>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CreditCard style={{ width: '18px', height: '18px', color: '#fff' }} />
                  </div>
                </div>
                <p style={{ fontSize: '28px', fontWeight: '700', color: '#fff', margin: '0 0 8px' }}>{currency}{formatAmount(analyticsStats.total)}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ArrowUpRight style={{ width: '14px', height: '14px', color: 'rgba(255,255,255,0.8)' }} />
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>{analyticsStats.count} entries</span>
                </div>
              </div>

              {/* This Month Card */}
              <div style={{
                ...cardStyle,
                background: isDark 
                  ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' 
                  : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                border: 'none'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', fontWeight: '500' }}>This Month</span>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Wallet style={{ width: '18px', height: '18px', color: '#fff' }} />
                  </div>
                </div>
                <p style={{ fontSize: '28px', fontWeight: '700', color: '#fff', margin: '0 0 8px' }}>{currency}{formatAmount(analyticsStats.month)}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <TrendingUp style={{ width: '14px', height: '14px', color: 'rgba(255,255,255,0.8)' }} />
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                </div>
              </div>

              {/* Average Per Entry */}
              <div style={{
                ...cardStyle,
                background: isDark 
                  ? 'linear-gradient(135deg, #059669 0%, #047857 100%)' 
                  : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                border: 'none'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', fontWeight: '500' }}>Avg. Per Entry</span>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <DollarSign style={{ width: '18px', height: '18px', color: '#fff' }} />
                  </div>
                </div>
                <p style={{ fontSize: '28px', fontWeight: '700', color: '#fff', margin: '0 0 8px' }}>{currency}{formatAmount(analyticsStats.count > 0 ? analyticsStats.total / analyticsStats.count : 0)}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>{analyticsStats.count} entries</span>
                </div>
              </div>

              {/* Today's Spending */}
              <div style={{
                ...cardStyle,
                background: isDark 
                  ? 'linear-gradient(135deg, #003d8f 0%, #003380 100%)' 
                  : 'linear-gradient(135deg, #004AAC 0%, #003d8f 100%)',
                border: 'none'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', fontWeight: '500' }}>Today</span>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <PiggyBank style={{ width: '18px', height: '18px', color: '#fff' }} />
                  </div>
                </div>
                <p style={{ fontSize: '28px', fontWeight: '700', color: '#fff', margin: '0 0 8px' }}>{currency}{formatAmount(analyticsStats.today)}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>{new Date().toLocaleDateString('en-US', { weekday: 'long' })}</span>
                </div>
              </div>
            </div>

            {/* Main Charts Row */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr', 
              gap: '16px', 
              marginBottom: '24px' 
            }}>
              {/* Spending Trend Line Chart */}
              <div style={cardStyle}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <div>
                    <h3 style={{ fontSize: '15px', fontWeight: '600', color: theme.text, margin: '0 0 4px' }}>Spending Trend</h3>
                    <p style={{ fontSize: '12px', color: theme.textMuted, margin: 0 }}>Last 6 months overview</p>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={analyticsMonthData}>
                    <defs>
                      <linearGradient id="colorSpending" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: theme.textSubtle }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: theme.textSubtle }} axisLine={false} tickLine={false} width={50} tickFormatter={(v) => `${currency}${v >= 1000 ? (v/1000).toFixed(0) + 'k' : v}`} />
                    <Tooltip formatter={(v) => `${currency}${formatAmount(v)}`} contentStyle={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.inputBorder}`, borderRadius: '8px', color: theme.text }} itemStyle={{ color: theme.text }} labelStyle={{ color: theme.text }} />
                    <Area type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorSpending)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Category Breakdown */}
              <div style={cardStyle}>
                <div style={{ marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: '600', color: theme.text, margin: '0 0 4px' }}>By Category</h3>
                  <p style={{ fontSize: '12px', color: theme.textMuted, margin: 0 }}>Expense distribution</p>
                </div>
                {analyticsCatData.length > 0 ? (
                  <>
                    <ResponsiveContainer width="100%" height={160}>
                      <PieChart>
                        <Pie 
                          data={analyticsCatData} 
                          cx="50%" 
                          cy="50%" 
                          innerRadius={45} 
                          outerRadius={70} 
                          paddingAngle={3} 
                          dataKey="value"
                        >
                          {analyticsCatData.map((entry, i) => <Cell key={`cell-${i}`} fill={entry.color} />)}
                        </Pie>
                        <Tooltip formatter={(v) => `${currency}${formatAmount(v)}`} contentStyle={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.inputBorder}`, borderRadius: '8px', color: theme.text }} itemStyle={{ color: theme.text }} labelStyle={{ color: theme.text }} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
                      {analyticsCatData.slice(0, 4).map((cat, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: cat.color }} />
                            <span style={{ fontSize: '13px', color: theme.textMuted }}>{cat.name}</span>
                          </div>
                          <span style={{ fontSize: '13px', fontWeight: '600', color: theme.text }}>{currency}{formatAmount(cat.value)}</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.textDim }}>No data</div>
                )}
              </div>
            </div>

            {/* Bottom Row */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', 
              gap: '16px' 
            }}>
              {/* Top Expenses */}
              <div style={cardStyle}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: '600', color: theme.text, margin: 0 }}>Top Expenses</h3>
                  <TrendingUp style={{ width: '16px', height: '16px', color: theme.textMuted }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[...filteredAnalyticsEntries].sort((a, b) => b.amount - a.amount).slice(0, 5).map((entry, i) => {
                    const catInfo = CATEGORIES.find(c => c.value === entry.type);
                    return (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ 
                          width: '32px', 
                          height: '32px', 
                          borderRadius: '8px', 
                          backgroundColor: isDark ? '#27272a' : '#f4f4f5',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px',
                          fontWeight: '600',
                          color: theme.textMuted
                        }}>
                          {i + 1}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: '13px', fontWeight: '500', color: theme.text, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{entry.name}</p>
                          <p style={{ fontSize: '11px', color: catInfo?.color || theme.textMuted, margin: '2px 0 0' }}>{catInfo?.label}</p>
                        </div>
                        <span style={{ fontSize: '13px', fontWeight: '600', color: theme.text }}>{currency}{formatAmount(entry.amount)}</span>
                      </div>
                    );
                  })}
                  {filteredAnalyticsEntries.length === 0 && (
                    <p style={{ fontSize: '13px', color: theme.textDim, textAlign: 'center', padding: '20px 0' }}>No entries found</p>
                  )}
                </div>
              </div>

              {/* Monthly Comparison */}
              <div style={cardStyle}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: '600', color: theme.text, margin: 0 }}>Monthly Compare</h3>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={analyticsMonthData} layout="vertical">
                    <XAxis type="number" tick={{ fontSize: 11, fill: theme.textSubtle }} axisLine={false} tickLine={false} tickFormatter={(v) => `${currency}${v >= 1000 ? (v/1000).toFixed(0) + 'k' : v}`} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: theme.textSubtle }} axisLine={false} tickLine={false} width={35} />
                    <Tooltip formatter={(v) => `${currency}${formatAmount(v)}`} contentStyle={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.inputBorder}`, borderRadius: '8px', color: theme.text }} itemStyle={{ color: theme.text }} labelStyle={{ color: theme.text }} />
                    <Bar dataKey="amount" fill="#004AAC" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Due Soon / Notifications */}
              <div style={cardStyle}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: '600', color: theme.text, margin: 0 }}>Due Soon</h3>
                  <Bell style={{ width: '16px', height: '16px', color: theme.textMuted }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {filteredAnalyticsEntries
                    .filter(e => e.dueDate && new Date(e.dueDate) >= new Date())
                    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
                    .slice(0, 5)
                    .map((entry, i) => {
                      const daysUntil = Math.ceil((new Date(entry.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
                      const isUrgent = daysUntil <= 3;
                      return (
                        <div key={i} style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '12px',
                          padding: '10px 12px',
                          backgroundColor: isUrgent ? (isDark ? 'rgba(239, 68, 68, 0.1)' : '#fef2f2') : theme.statBg,
                          borderRadius: '8px',
                          borderLeft: `3px solid ${isUrgent ? '#ef4444' : '#f59e0b'}`
                        }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontSize: '13px', fontWeight: '500', color: theme.text, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{entry.name}</p>
                            <p style={{ fontSize: '11px', color: isUrgent ? '#ef4444' : '#f59e0b', margin: '2px 0 0', fontWeight: '500' }}>
                              {daysUntil === 0 ? 'Due today' : daysUntil === 1 ? 'Due tomorrow' : `Due in ${daysUntil} days`}
                            </p>
                          </div>
                          <span style={{ fontSize: '13px', fontWeight: '600', color: theme.text }}>{currency}{formatAmount(entry.amount)}</span>
                        </div>
                      );
                    })}
                  {filteredAnalyticsEntries.filter(e => e.dueDate && new Date(e.dueDate) >= new Date()).length === 0 && (
                    <div style={{ 
                      padding: '24px 16px', 
                      textAlign: 'center',
                      backgroundColor: theme.statBg,
                      borderRadius: '8px'
                    }}>
                      <Check style={{ width: '24px', height: '24px', color: '#10b981', margin: '0 auto 8px' }} />
                      <p style={{ fontSize: '13px', color: theme.textMuted, margin: 0 }}>No upcoming dues</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
              </>
              );
            })()}
          </>
        ) : activeTab === 'wallets' ? (
          /* Multi-Wallet Tab */
          <div style={{ display: 'flex', flexDirection: 'column', gap: isSmall ? '12px' : '20px' }}>
            
            {/* 4 Wallet Type Cards - Side by Side */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: isSmall ? 'repeat(2, 1fr)' : isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', 
              gap: isSmall ? '8px' : '12px' 
            }}>
              {WALLET_TYPES.map(walletType => {
                const typeWallets = getWalletsByType(walletType.type);
                const selectedId = featuredWallets[walletType.type];
                const selectedWallet = typeWallets.find(w => w.id === selectedId) || typeWallets[0];
                const canAddMore = walletType.canAddMultiple ? typeWallets.length < 4 : typeWallets.length === 0;
                const typeTotal = typeWallets.reduce((sum, w) => sum + w.balance, 0);
                
                // Define colors for each type
                const typeColors = {
                  cash: '#22c55e',
                  ewallet: '#3b82f6',
                  bank: '#004AAC',
                  credit: '#ef4444'
                };
                const cardColor = typeColors[walletType.type];
                
                return (
                  <div
                    key={walletType.type}
                    style={{
                      borderRadius: isSmall ? '12px' : '16px',
                      backgroundColor: cardColor,
                      padding: isSmall ? '12px' : '20px',
                      position: 'relative',
                      overflow: 'hidden',
                      minHeight: isSmall ? '130px' : '180px',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    {/* Background decorations */}
                    <div style={{
                      position: 'absolute',
                      top: '-30px',
                      right: '-30px',
                      width: isSmall ? '60px' : '100px',
                      height: isSmall ? '60px' : '100px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255,255,255,0.1)'
                    }} />
                    <div style={{
                      position: 'absolute',
                      bottom: '-40px',
                      left: '-40px',
                      width: isSmall ? '80px' : '120px',
                      height: isSmall ? '80px' : '120px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255,255,255,0.05)'
                    }} />
                    
                    <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      {/* Header */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: isSmall ? '6px' : '12px' }}>
                        <p style={{ fontSize: isSmall ? '11px' : '13px', color: 'rgba(255,255,255,0.8)', margin: 0, fontWeight: '500' }}>
                          {walletType.label}
                        </p>
                        <div style={{ display: 'flex', gap: isSmall ? '3px' : '4px' }}>
                          {canAddMore && (
                            <button
                              onClick={() => {
                                setSelectedWalletType(walletType);
                                setShowAddWalletModal(true);
                              }}
                              style={{
                                width: isSmall ? '22px' : '28px',
                                height: isSmall ? '22px' : '28px',
                                backgroundColor: 'rgba(255,255,255,0.2)',
                                border: 'none',
                                borderRadius: isSmall ? '5px' : '6px',
                                color: '#fff',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              <Plus style={{ width: isSmall ? '11px' : '14px', height: isSmall ? '11px' : '14px' }} />
                            </button>
                          )}
                          <span style={{ 
                            width: isSmall ? '22px' : '28px',
                            height: isSmall ? '22px' : '28px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: isSmall ? '5px' : '6px',
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            fontSize: isSmall ? '12px' : '16px'
                          }}>{walletType.icon}</span>
                        </div>
                      </div>
                      
                      {/* Wallet Selector Dropdown */}
                      {typeWallets.length > 0 ? (
                        <>
                          <select
                            value={selectedWallet?.id || ''}
                            onChange={(e) => setFeaturedWallets(prev => ({ ...prev, [walletType.type]: e.target.value }))}
                            style={{
                              backgroundColor: 'rgba(255,255,255,0.2)',
                              border: 'none',
                              borderRadius: isSmall ? '6px' : '8px',
                              padding: isSmall ? '5px 8px' : '8px 12px',
                              color: '#fff',
                              fontSize: isSmall ? '11px' : '13px',
                              fontWeight: '500',
                              cursor: 'pointer',
                              marginBottom: isSmall ? '6px' : '12px',
                              appearance: 'none',
                              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                              backgroundRepeat: 'no-repeat',
                              backgroundPosition: isSmall ? 'right 6px center' : 'right 8px center',
                              backgroundSize: isSmall ? '12px' : '16px',
                              paddingRight: isSmall ? '24px' : '32px'
                            }}
                          >
                            {typeWallets.map(w => (
                              <option key={w.id} value={w.id} style={{ color: '#000', backgroundColor: '#fff' }}>
                                {w.icon} {w.name}
                              </option>
                            ))}
                          </select>
                          
                          {/* Selected Wallet Balance */}
                          <div style={{ flex: 1 }}>
                            <p style={{ 
                              fontSize: isSmall ? '18px' : '28px', 
                              fontWeight: '700', 
                              color: '#fff', 
                              margin: '0 0 4px'
                            }}>
                              {currency}{selectedWallet?.balance?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                            </p>
                            {typeWallets.length > 1 && (
                              <p style={{ fontSize: isSmall ? '9px' : '11px', color: 'rgba(255,255,255,0.6)', margin: 0 }}>
                                Total: {currency}{typeTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                              </p>
                            )}
                          </div>
                          
                          {/* Action Buttons */}
                          <div style={{ display: 'flex', gap: isSmall ? '3px' : '4px', marginTop: isSmall ? '6px' : '12px', flexWrap: 'wrap' }}>
                            <button
                              onClick={() => {
                                setSelectedWalletForFunds(selectedWallet);
                                setShowAddFundsModal(true);
                              }}
                              style={{
                                flex: '1 1 auto',
                                minWidth: isSmall ? '50px' : '70px',
                                height: isSmall ? '26px' : '32px',
                                backgroundColor: 'rgba(255,255,255,0.95)',
                                color: cardColor,
                                border: 'none',
                                borderRadius: isSmall ? '5px' : '6px',
                                fontSize: isSmall ? '10px' : '11px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: isSmall ? '2px' : '3px'
                              }}
                            >
                              <Plus style={{ width: isSmall ? '10px' : '11px', height: isSmall ? '10px' : '11px' }} />
                              Add
                            </button>
                            <button
                              onClick={() => {
                                setSelectedWalletForWithdraw(selectedWallet);
                                setShowWithdrawModal(true);
                              }}
                              style={{
                                flex: '1 1 auto',
                                minWidth: isSmall ? '55px' : '80px',
                                height: isSmall ? '26px' : '32px',
                                backgroundColor: 'rgba(255,255,255,0.2)',
                                color: '#fff',
                                border: 'none',
                                borderRadius: isSmall ? '5px' : '6px',
                                fontSize: isSmall ? '10px' : '11px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: isSmall ? '2px' : '3px'
                              }}
                            >
                              <ArrowDownRight style={{ width: isSmall ? '10px' : '11px', height: isSmall ? '10px' : '11px' }} />
                              {isSmall ? 'Out' : 'Withdraw'}
                            </button>
                            {selectedWallet?.editable && (
                              <button
                                onClick={() => {
                                  setEditingWallet(selectedWallet);
                                  setEditWalletName(selectedWallet.name);
                                  setShowEditWalletModal(true);
                                }}
                                style={{
                                  width: isSmall ? '26px' : '32px',
                                  height: isSmall ? '26px' : '32px',
                                  backgroundColor: 'rgba(255,255,255,0.2)',
                                  border: 'none',
                                  borderRadius: isSmall ? '5px' : '6px',
                                  color: '#fff',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  flexShrink: 0
                                }}
                              >
                                <Edit style={{ width: isSmall ? '10px' : '11px', height: isSmall ? '10px' : '11px' }} />
                              </button>
                            )}
                            {selectedWallet?.type !== 'cash' && (
                              <button
                                onClick={() => {
                                  setWalletToDelete(selectedWallet);
                                  setShowDeleteWalletConfirm(true);
                                }}
                                style={{
                                  width: isSmall ? '26px' : '32px',
                                  height: isSmall ? '26px' : '32px',
                                  backgroundColor: 'rgba(255,255,255,0.2)',
                                  border: 'none',
                                  borderRadius: isSmall ? '5px' : '6px',
                                  color: '#fff',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  flexShrink: 0
                                }}
                              >
                                <Trash2 style={{ width: isSmall ? '10px' : '12px', height: isSmall ? '10px' : '12px' }} />
                              </button>
                            )}
                          </div>
                        </>
                      ) : (
                        /* Empty State */
                        <div 
                          onClick={() => {
                            setSelectedWalletType(walletType);
                            setShowAddWalletModal(true);
                          }}
                          style={{ 
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            opacity: 0.8
                          }}
                        >
                          <Plus style={{ width: isSmall ? '24px' : '32px', height: isSmall ? '24px' : '32px', color: '#fff', marginBottom: isSmall ? '6px' : '8px' }} />
                          <p style={{ fontSize: isSmall ? '11px' : '13px', color: '#fff', margin: 0, textAlign: 'center' }}>
                            Add {walletType.label}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Total Balance Card */}
            <div style={{
              ...cardStyle,
              padding: isSmall ? '12px' : '20px',
              background: isDark 
                ? 'linear-gradient(135deg, #1e3a5f, #0f172a)' 
                : 'linear-gradient(135deg, #dbeafe, #eff6ff)',
              border: 'none'
            }}>
              <div style={{ display: 'flex', flexDirection: isSmall ? 'column' : 'row', alignItems: isSmall ? 'stretch' : 'flex-start', justifyContent: 'space-between', gap: isSmall ? '8px' : '12px' }}>
                <div style={{ marginBottom: isSmall ? '4px' : 0 }}>
                  <p style={{ fontSize: isSmall ? '10px' : '12px', color: theme.textMuted, margin: '0 0 4px' }}>Total Balance (All Wallets)</p>
                  <p style={{ 
                    fontSize: isSmall ? '22px' : '32px', 
                    fontWeight: '700', 
                    color: getTotalWalletBalance() >= 0 ? theme.text : '#ef4444', 
                    margin: 0 
                  }}>
                    {currency}{getTotalWalletBalance().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: isSmall ? '6px' : '8px', flexWrap: 'wrap', justifyContent: isSmall ? 'flex-start' : 'flex-end' }}>
                  {/* Group wallets by type */}
                  {WALLET_TYPES.map(wt => {
                    const typeWallets = wallets.filter(w => w.type === wt.type);
                    if (typeWallets.length === 0) return null;
                    const typeTotal = typeWallets.reduce((sum, w) => sum + w.balance, 0);
                    return (
                      <div key={wt.type} style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: isSmall ? '3px' : '4px',
                        padding: isSmall ? '3px 6px' : '4px 8px',
                        backgroundColor: `${wt.color}20`,
                        border: `1px solid ${wt.color}40`,
                        borderRadius: '6px'
                      }}>
                        <span style={{ fontSize: isSmall ? '10px' : '11px' }}>{wt.icon}</span>
                        <span style={{ fontSize: isSmall ? '9px' : '10px', fontWeight: '600', color: theme.text }}>
                          {currency}{typeTotal.toLocaleString()}
                        </span>
                        {typeWallets.length > 1 && (
                          <span style={{ 
                            fontSize: '8px', 
                            color: theme.textMuted,
                            backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                            padding: '1px 4px',
                            borderRadius: '3px'
                          }}>
                            {typeWallets.length}
                          </span>
                        )}
                      </div>
                    );
                  })}
                  {wallets.length > 0 && (
                    <button
                      onClick={() => setShowClearAllWalletsConfirm(true)}
                      style={{
                        padding: isSmall ? '3px 6px' : '4px 8px',
                        backgroundColor: 'transparent',
                        border: `1px solid ${isDark ? 'rgba(239,68,68,0.5)' : '#fecaca'}`,
                        borderRadius: '5px',
                        color: '#ef4444',
                        fontSize: isSmall ? '9px' : '10px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: isSmall ? '2px' : '3px'
                      }}
                    >
                      <Trash2 style={{ width: isSmall ? '9px' : '10px', height: isSmall ? '9px' : '10px' }} />
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            {/* Transaction History */}
            <div style={cardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h2 style={{ fontSize: isSmall ? '14px' : '16px', fontWeight: '600', color: theme.text, margin: 0 }}>Transaction History</h2>
                  <p style={{ fontSize: '12px', color: theme.textMuted, margin: '2px 0 0' }}>
                    {getFilteredWalletTransactions().length} transactions
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {/* Search */}
                  <div style={{ position: 'relative' }}>
                    <Search style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', width: '12px', height: '12px', color: theme.textDim }} />
                    <input
                      placeholder="Search..."
                      value={walletSearch}
                      onChange={(e) => setWalletSearch(e.target.value)}
                      style={{ ...inputStyle, width: isSmall ? '100px' : '130px', paddingLeft: '28px', height: '32px', fontSize: '12px' }}
                    />
                  </div>
                  
                  {/* Wallet Filter */}
                  <select
                    value={walletTransactionFilter}
                    onChange={(e) => setWalletTransactionFilter(e.target.value)}
                    style={{ ...inputStyle, width: isSmall ? '100px' : '120px', cursor: 'pointer', height: '32px', fontSize: '12px' }}
                  >
                    <option value="all">All Wallets</option>
                    {wallets.map(w => (
                      <option key={w.id} value={w.id}>{w.icon} {w.name}</option>
                    ))}
                  </select>
                  
                  {/* Advanced Filter Toggle */}
                  <button
                    onClick={() => setShowWalletAdvancedFilter(!showWalletAdvancedFilter)}
                    style={{
                      height: '32px',
                      padding: '0 10px',
                      backgroundColor: showWalletAdvancedFilter ? (isDark ? '#3b82f6' : '#2563eb') : 'transparent',
                      border: `1px solid ${showWalletAdvancedFilter ? 'transparent' : theme.inputBorder}`,
                      borderRadius: '6px',
                      color: showWalletAdvancedFilter ? '#fff' : theme.textMuted,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '12px'
                    }}
                  >
                    <ChevronDown style={{ width: '12px', height: '12px' }} />
                    {isSmall ? '' : 'Filter'}
                  </button>
                </div>
              </div>
              
              {/* Advanced Filters */}
              {showWalletAdvancedFilter && (
                <div style={{ 
                  display: 'flex', 
                  gap: '12px', 
                  marginBottom: '16px', 
                  padding: '12px', 
                  backgroundColor: theme.statBg, 
                  borderRadius: '8px',
                  flexWrap: 'wrap'
                }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: theme.textMuted, marginBottom: '4px' }}>From Date</label>
                    <input
                      type="date"
                      value={walletDateFrom}
                      onChange={(e) => setWalletDateFrom(e.target.value)}
                      style={{ ...inputStyle, width: '150px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: theme.textMuted, marginBottom: '4px' }}>To Date</label>
                    <input
                      type="date"
                      value={walletDateTo}
                      onChange={(e) => setWalletDateTo(e.target.value)}
                      style={{ ...inputStyle, width: '150px' }}
                    />
                  </div>
                  {(walletDateFrom || walletDateTo) && (
                    <button
                      onClick={() => { setWalletDateFrom(''); setWalletDateTo(''); }}
                      style={{
                        height: '36px',
                        padding: '0 12px',
                        backgroundColor: 'transparent',
                        border: `1px solid ${theme.inputBorder}`,
                        borderRadius: '6px',
                        color: theme.textMuted,
                        cursor: 'pointer',
                        fontSize: '12px',
                        alignSelf: 'flex-end'
                      }}
                    >
                      Clear
                    </button>
                  )}
                </div>
              )}
              
              {/* Transactions Table */}
              {getFilteredWalletTransactions().length === 0 ? (
                <div style={{ 
                  textAlign: 'center', 
                  padding: isSmall ? '30px 16px' : '40px 20px',
                  color: theme.textMuted 
                }}>
                  <Wallet style={{ width: isSmall ? '36px' : '48px', height: isSmall ? '36px' : '48px', margin: '0 auto 12px', opacity: 0.3 }} />
                  <p style={{ fontSize: isSmall ? '13px' : '15px', fontWeight: '500', margin: '0 0 4px' }}>No transactions yet</p>
                  <p style={{ fontSize: '12px', margin: 0 }}>Add funds or log expenses with a wallet</p>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                    <thead>
                      <tr style={{ borderBottom: `1px solid ${theme.cardBorder}` }}>
                        <th style={{ textAlign: 'left', padding: '10px 6px', fontSize: '10px', fontWeight: '600', color: theme.textMuted, textTransform: 'uppercase', width: isSmall ? '70px' : '90px' }}>Date</th>
                        <th style={{ textAlign: 'left', padding: '10px 6px', fontSize: '10px', fontWeight: '600', color: theme.textMuted, textTransform: 'uppercase', width: isSmall ? '70px' : '100px' }}>Wallet</th>
                        <th style={{ textAlign: 'left', padding: '10px 6px', fontSize: '10px', fontWeight: '600', color: theme.textMuted, textTransform: 'uppercase', width: 'auto' }}>Description</th>
                        <th style={{ textAlign: 'right', padding: '10px 6px', fontSize: '10px', fontWeight: '600', color: theme.textMuted, textTransform: 'uppercase', width: isSmall ? '80px' : '90px' }}>Amount</th>
                        <th style={{ textAlign: 'right', padding: '10px 6px', fontSize: '10px', fontWeight: '600', color: theme.textMuted, textTransform: 'uppercase', width: isSmall ? '70px' : '80px' }}>Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getFilteredWalletTransactions().slice(0, 50).map(tx => {
                        const wallet = wallets.find(w => w.id === tx.walletId);
                        return (
                          <tr key={tx.id} style={{ borderBottom: `1px solid ${theme.cardBorder}` }}>
                            <td style={{ padding: '10px 6px', fontSize: '11px', color: theme.textMuted }}>
                              {new Date(tx.date).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' })}
                            </td>
                            <td style={{ padding: '10px 6px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <span style={{ fontSize: '12px' }}>{wallet?.icon || '💰'}</span>
                                {!isSmall && <span style={{ fontSize: '11px', color: theme.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tx.walletName}</span>}
                              </div>
                            </td>
                            <td style={{ padding: '10px 6px', fontSize: '12px', color: theme.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {tx.note}
                              {tx.type === 'deposit' && (
                                <span style={{ 
                                  marginLeft: '6px',
                                  padding: '1px 5px',
                                  backgroundColor: isDark ? '#14532d' : '#dcfce7',
                                  color: '#22c55e',
                                  fontSize: '10px',
                                  fontWeight: '600',
                                  borderRadius: '4px'
                                }}>
                                  DEPOSIT
                                </span>
                              )}
                              {tx.type === 'withdraw' && (
                                <span style={{ 
                                  marginLeft: '6px',
                                  padding: '1px 5px',
                                  backgroundColor: isDark ? '#7f1d1d' : '#fecaca',
                                  color: '#ef4444',
                                  fontSize: '9px',
                                  fontWeight: '600',
                                  borderRadius: '3px'
                                }}>
                                  WITHDRAW
                                </span>
                              )}
                            </td>
                            <td style={{ 
                              padding: '10px 6px', 
                              fontSize: isSmall ? '11px' : '12px', 
                              fontWeight: '600',
                              color: tx.type === 'deposit' ? '#22c55e' : '#ef4444',
                              textAlign: 'right'
                            }}>
                              {tx.type === 'deposit' ? '+' : '-'}{currency}{Math.abs(tx.amount).toLocaleString()}
                            </td>
                            <td style={{ padding: '10px 6px', fontSize: isSmall ? '10px' : '11px', color: theme.textMuted, textAlign: 'right' }}>
                              {currency}{tx.balance.toLocaleString()}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        ) : activeTab === 'entries' ? (
          /* All Entries Tab */
          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h2 style={{ fontSize: isSmall ? '15px' : '16px', fontWeight: '600', color: theme.text, margin: 0 }}>All Entries</h2>
                <p style={{ fontSize: '13px', color: theme.textMuted, margin: '4px 0 0' }}>{entries.length} total entries</p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <label
                  style={{
                    height: '36px',
                    padding: '0 16px',
                    backgroundColor: 'transparent',
                    border: `1px solid ${theme.inputBorder}`,
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: '500',
                    color: theme.text,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <Upload style={{ width: '14px', height: '14px' }} />
                  Import CSV
                  <input type="file" accept=".csv" onChange={handleCsvFileSelect} style={{ display: 'none' }} />
                </label>
                <button
                  onClick={exportToCSV}
                  style={{
                    height: '36px',
                    padding: '0 16px',
                    backgroundColor: isDark ? '#fafafa' : '#18181b',
                    color: isDark ? '#18181b' : '#fafafa',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <Download style={{ width: '14px', height: '14px' }} />
                  Export CSV
                </button>
              </div>
            </div>

            {/* Bulk Actions Bar */}
            {(selectedEntries.length > 0 || entries.length > 0) && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                marginBottom: '16px',
                backgroundColor: selectedEntries.length > 0 ? (isDark ? '#1e3a5f' : '#dbeafe') : theme.statBg,
                borderRadius: '8px',
                border: selectedEntries.length > 0 ? `1px solid ${isDark ? '#2563eb' : '#93c5fd'}` : 'none'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {selectedEntries.length > 0 ? (
                    <>
                      <span style={{ fontSize: '14px', fontWeight: '600', color: isDark ? '#60a5fa' : '#1d4ed8' }}>
                        {selectedEntries.length} selected
                      </span>
                      <button
                        onClick={() => setSelectedEntries([])}
                        style={{
                          fontSize: '13px',
                          color: isDark ? '#93c5fd' : '#2563eb',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          textDecoration: 'underline'
                        }}
                      >
                        Clear selection
                      </button>
                    </>
                  ) : (
                    <span style={{ fontSize: '13px', color: theme.textMuted }}>
                      Select entries to delete multiple at once
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {selectedEntries.length > 0 && (
                    <button
                      onClick={() => setShowBulkDeleteConfirm(true)}
                      style={{
                        height: '32px',
                        padding: '0 12px',
                        backgroundColor: '#ef4444',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Trash2 style={{ width: '14px', height: '14px' }} />
                      Delete Selected
                    </button>
                  )}
                  {entries.length > 0 && (
                    <button
                      onClick={() => setShowClearAllConfirm(true)}
                      style={{
                        height: '32px',
                        padding: '0 12px',
                        backgroundColor: 'transparent',
                        border: `1px solid #ef4444`,
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontWeight: '500',
                        color: '#ef4444',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Trash2 style={{ width: '14px', height: '14px' }} />
                      Clear All
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* CSV Import Preview */}
            {csvPreview && (
              <div style={{
                marginBottom: '20px',
                border: `1px solid ${isDark ? '#065f46' : '#86efac'}`,
                backgroundColor: isDark ? '#022c22' : '#f0fdf4',
                borderRadius: '8px',
                padding: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981', flexShrink: 0 }} />
                    <span style={{ fontSize: '14px', fontWeight: '600', color: isDark ? '#34d399' : '#047857' }}>
                      {csvPreview.length} entries ready to import
                    </span>
                  </div>
                  <button 
                    onClick={() => setCsvPreview(null)} 
                    style={{ background: 'none', border: 'none', color: theme.textMuted, cursor: 'pointer', padding: '4px' }}
                  >
                    <X style={{ width: '16px', height: '16px' }} />
                  </button>
                </div>
                
                {/* Preview Table */}
                <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '12px', borderRadius: '6px', border: `1px solid ${theme.cardBorder}`, backgroundColor: theme.cardBg }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                    <thead style={{ position: 'sticky', top: 0, backgroundColor: theme.cardBg }}>
                      <tr>
                        <th style={{ padding: '8px', textAlign: 'left', borderBottom: `1px solid ${theme.cardBorder}`, color: theme.textMuted }}>Name</th>
                        <th style={{ padding: '8px', textAlign: 'left', borderBottom: `1px solid ${theme.cardBorder}`, color: theme.textMuted }}>Category</th>
                        <th style={{ padding: '8px', textAlign: 'left', borderBottom: `1px solid ${theme.cardBorder}`, color: theme.textMuted }}>Date</th>
                        <th style={{ padding: '8px', textAlign: 'right', borderBottom: `1px solid ${theme.cardBorder}`, color: theme.textMuted }}>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {csvPreview.slice(0, 5).map((entry, i) => (
                        <tr key={i} style={{ borderBottom: `1px solid ${theme.cardBorder}` }}>
                          <td style={{ padding: '8px', color: theme.text }}>{entry.name}</td>
                          <td style={{ padding: '8px', color: theme.textMuted, textTransform: 'capitalize' }}>{entry.type}</td>
                          <td style={{ padding: '8px', color: theme.textMuted }}>{entry.date}</td>
                          <td style={{ padding: '8px', textAlign: 'right', color: theme.text, fontWeight: '500' }}>{currency}{formatAmount(entry.amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {csvPreview.length > 5 && (
                    <p style={{ padding: '8px', fontSize: '11px', color: theme.textMuted, margin: 0, textAlign: 'center', backgroundColor: theme.statBg }}>
                      +{csvPreview.length - 5} more entries...
                    </p>
                  )}
                </div>
                
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <button 
                    onClick={() => setCsvPreview(null)} 
                    style={{ height: '36px', padding: '0 16px', backgroundColor: 'transparent', border: `1px solid ${theme.inputBorder}`, borderRadius: '6px', fontSize: '13px', color: theme.textMuted, cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleCsvImport} 
                    disabled={isSaving}
                    style={{ height: '36px', padding: '0 16px', backgroundColor: isDark ? '#fafafa' : '#18181b', color: isDark ? '#18181b' : '#fafafa', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '500', cursor: isSaving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '6px', opacity: isSaving ? 0.7 : 1 }}
                  >
                    {isSaving ? <><Loader2 style={{ width: '14px', height: '14px', animation: 'spin 1s linear infinite' }} /> Importing...</> : <><Check style={{ width: '14px', height: '14px' }} /> Import All</>}
                  </button>
                </div>
              </div>
            )}

            {/* Filters */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ position: 'relative', width: '200px', flexShrink: 0 }}>
                <Search style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', width: '14px', height: '14px', color: theme.textDim }} />
                <input
                  placeholder="Search..."
                  value={historySearch}
                  onChange={(e) => setHistorySearch(e.target.value)}
                  style={{ ...inputStyle, width: '100%', paddingLeft: '32px' }}
                />
              </div>
              <button
                onClick={() => {
                  setShowAdvancedFilter(!showAdvancedFilter);
                  if (showAdvancedFilter) {
                    setAdvancedDateFrom('');
                    setAdvancedDateTo('');
                    setAdvancedCategory('all');
                  }
                }}
                style={{
                  height: '36px',
                  padding: '0 12px',
                  backgroundColor: showAdvancedFilter ? (isDark ? '#27272a' : '#f4f4f5') : 'transparent',
                  border: `1px solid ${showAdvancedFilter ? theme.text : theme.inputBorder}`,
                  borderRadius: '6px',
                  fontSize: '13px',
                  color: showAdvancedFilter ? theme.text : theme.textMuted,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <ChevronDown style={{ width: '14px', height: '14px', transform: showAdvancedFilter ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                Advanced
              </button>
              {!showAdvancedFilter && (
                <select
                  value={historyFilter}
                  onChange={(e) => setHistoryFilter(e.target.value)}
                  style={{ ...inputStyle, width: 'auto', minWidth: '110px', cursor: 'pointer' }}
                >
                  <option value="All">All Time</option>
                  <option value="Today">Today</option>
                  <option value="Week">This Week</option>
                  <option value="Month">This Month</option>
                  <option value="Year">This Year</option>
                </select>
              )}
            </div>

            {/* Advanced Filter Panel */}
            {showAdvancedFilter && (
              <div style={{
                padding: '16px',
                backgroundColor: isDark ? '#1a1a1d' : '#fafafa',
                border: `1px solid ${theme.cardBorder}`,
                borderRadius: '8px',
                marginBottom: '16px',
                display: 'flex',
                gap: '16px',
                flexWrap: 'wrap',
                alignItems: 'flex-end'
              }}>
                <div style={{ flex: '1', minWidth: '140px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: theme.textMuted, marginBottom: '6px' }}>
                    From Date
                  </label>
                  <input
                    type="date"
                    value={advancedDateFrom}
                    onChange={(e) => setAdvancedDateFrom(e.target.value)}
                    style={{ ...inputStyle, width: '100%' }}
                  />
                </div>
                <div style={{ flex: '1', minWidth: '140px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: theme.textMuted, marginBottom: '6px' }}>
                    To Date
                  </label>
                  <input
                    type="date"
                    value={advancedDateTo}
                    onChange={(e) => setAdvancedDateTo(e.target.value)}
                    style={{ ...inputStyle, width: '100%' }}
                  />
                </div>
                <div style={{ flex: '1', minWidth: '140px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: theme.textMuted, marginBottom: '6px' }}>
                    Category
                  </label>
                  <select
                    value={advancedCategory}
                    onChange={(e) => setAdvancedCategory(e.target.value)}
                    style={{ ...inputStyle, width: '100%', cursor: 'pointer' }}
                  >
                    <option value="all">All Categories</option>
                    {CATEGORIES.map(c => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={() => {
                    setAdvancedDateFrom('');
                    setAdvancedDateTo('');
                    setAdvancedCategory('all');
                  }}
                  style={{
                    height: '36px',
                    padding: '0 12px',
                    backgroundColor: 'transparent',
                    border: `1px solid ${theme.inputBorder}`,
                    borderRadius: '6px',
                    fontSize: '13px',
                    color: theme.textMuted,
                    cursor: 'pointer'
                  }}
                >
                  Clear
                </button>
              </div>
            )}

            {/* Table */}
            <div style={{ overflowX: 'auto', maxHeight: '600px', overflowY: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '650px' }}>
                <thead style={{ position: 'sticky', top: 0, backgroundColor: theme.cardBg, zIndex: 1 }}>
                  <tr style={{ borderBottom: `1px solid ${theme.cardBorder}` }}>
                    <th style={{ padding: '12px 8px', textAlign: 'center', width: '40px' }}>
                      <input
                        type="checkbox"
                        checked={filteredEntries.length > 0 && selectedEntries.length === filteredEntries.length}
                        onChange={toggleSelectAll}
                        style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#3b82f6' }}
                      />
                    </th>
                    <th style={{ padding: '12px 8px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: theme.textSubtle, textTransform: 'uppercase' }}>Date</th>
                    <th style={{ padding: '12px 8px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: theme.textSubtle, textTransform: 'uppercase' }}>Category</th>
                    <th style={{ padding: '12px 8px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: theme.textSubtle, textTransform: 'uppercase' }}>Name</th>
                    <th style={{ padding: '12px 8px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: theme.textSubtle, textTransform: 'uppercase' }}>Amount</th>
                    <th style={{ padding: '12px 8px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: theme.textSubtle, textTransform: 'uppercase' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEntries.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '60px 16px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                          <div style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            backgroundColor: isDark ? '#27272a' : '#f4f4f5',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <FileText style={{ width: '36px', height: '36px', color: theme.textDim }} />
                          </div>
                          <div>
                            <p style={{ fontSize: '16px', fontWeight: '600', color: theme.textMuted, margin: '0 0 6px' }}>
                              {historySearch || advancedCategory !== 'all' || advancedDateFrom || advancedDateTo 
                                ? 'No matching entries found' 
                                : 'No expenses recorded yet'}
                            </p>
                            <p style={{ fontSize: '13px', color: theme.textDim, margin: 0, maxWidth: '300px' }}>
                              {historySearch || advancedCategory !== 'all' || advancedDateFrom || advancedDateTo 
                                ? 'Try adjusting your filters or search term' 
                                : 'Go to Dashboard to add your first expense'}
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredEntries.map(entry => {
                      const badge = getBadgeStyle(entry.type, isDark);
                      const categoryInfo = CATEGORIES.find(c => c.value === entry.type);
                      const isSelected = selectedEntries.includes(entry.id);
                      return (
                        <tr 
                          key={entry.id} 
                          onDoubleClick={() => setEditingEntry({...entry, amount: entry.amount.toString()})}
                          style={{ 
                            borderBottom: `1px solid ${theme.cardBorder}`,
                            cursor: 'pointer',
                            transition: 'background-color 0.15s',
                            backgroundColor: isSelected ? (isDark ? '#1e3a5f' : '#dbeafe') : 'transparent'
                          }}
                          onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = isDark ? '#1f1f23' : '#fafafa'; }}
                          onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent'; }}
                        >
                          <td style={{ padding: '12px 8px', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleEntrySelection(entry.id)}
                              style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#3b82f6' }}
                            />
                          </td>
                          <td style={{ padding: '12px 8px', fontSize: '13px', color: theme.textMuted }}>
                            {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </td>
                          <td style={{ padding: '12px 8px' }}>
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '4px 10px',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontWeight: '500',
                              backgroundColor: badge.bg,
                              color: badge.color,
                              border: `1px solid ${badge.border}`
                            }}>
                              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: categoryInfo?.color }} />
                              {categoryInfo?.label || entry.type}
                            </span>
                          </td>
                          <td style={{ padding: '12px 8px', fontSize: '14px', fontWeight: '500', color: theme.text, maxWidth: '250px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{entry.name}</span>
                              {entry.recurring && (
                                <span 
                                  title={`Recurring: ${entry.recurring}`}
                                  style={{ 
                                    fontSize: '10px', 
                                    fontWeight: '600', 
                                    padding: '2px 6px', 
                                    borderRadius: '4px', 
                                    backgroundColor: isDark ? '#1e3a5f' : '#dbeafe', 
                                    color: isDark ? '#60a5fa' : '#1d4ed8',
                                    textTransform: 'capitalize',
                                    flexShrink: 0,
                                    cursor: 'help'
                                  }}
                                >
                                  {entry.recurring}
                                </span>
                              )}
                              {entry.notes && (
                                <span title={entry.notes} style={{ flexShrink: 0, cursor: 'help' }}>
                                  <MessageSquare style={{ width: '13px', height: '13px', color: theme.textMuted }} />
                                </span>
                              )}
                            </div>
                          </td>
                          <td style={{ padding: '12px 8px', fontSize: '14px', fontWeight: '600', color: theme.text, textAlign: 'right' }}>
                            {currency}{formatAmount(entry.amount)}
                          </td>
                          <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                            <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                              {entry.file && (
                                <>
                                  <button onClick={() => setPreviewFile(entry)} style={{ width: '28px', height: '28px', backgroundColor: 'transparent', border: `1px solid ${theme.inputBorder}`, borderRadius: '4px', color: theme.textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Eye style={{ width: '14px', height: '14px' }} />
                                  </button>
                                  <button onClick={() => handleDownloadFile(entry)} style={{ width: '28px', height: '28px', backgroundColor: 'transparent', border: `1px solid ${theme.inputBorder}`, borderRadius: '4px', color: theme.textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Download style={{ width: '14px', height: '14px' }} />
                                  </button>
                                </>
                              )}
                              <button onClick={() => setEditingEntry({...entry, amount: entry.amount.toString()})} style={{ width: '28px', height: '28px', backgroundColor: 'transparent', border: `1px solid ${theme.inputBorder}`, borderRadius: '4px', color: theme.textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Edit style={{ width: '14px', height: '14px' }} />
                              </button>
                              <button onClick={() => setDeletingEntry(entry)} style={{ width: '28px', height: '28px', backgroundColor: 'transparent', border: `1px solid ${theme.inputBorder}`, borderRadius: '4px', color: theme.textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
  <Trash2 style={{ width: '14px', height: '14px' }} />
</button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

           {/* Summary Footer */}
            <div style={{ 
              marginTop: '16px', 
              paddingTop: '16px', 
              borderTop: `1px solid ${theme.cardBorder}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <span style={{ fontSize: '13px', color: theme.textMuted }}>
                Showing {filteredEntries.length} of {entries.length} entries
              </span>
              <span style={{ fontSize: '15px', fontWeight: '600', color: theme.text }}>
                Total: {currency}{formatAmount(filteredEntries.reduce((sum, e) => sum + e.amount, 0))}
              </span>
            </div>
          </div>
        ) : activeTab === 'dashboard' && dashboardSubTab === 'bills' ? (
          /* Bills & Subscriptions Tab */
          <>
            {/* Bills Header Stats */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: isSmall ? '1fr' : isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', 
              gap: '16px', 
              marginBottom: '24px' 
            }}>
              {/* Active Subscriptions */}
              <div style={{
                ...cardStyle,
                background: isDark 
                  ? 'linear-gradient(135deg, #374151 0%, #1f2937 100%)' 
                  : 'linear-gradient(135deg, #4b5563 0%, #374151 100%)',
                border: 'none'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', fontWeight: '500' }}>Active Bills</span>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CreditCard style={{ width: '18px', height: '18px', color: '#fff' }} />
                  </div>
                </div>
                <p style={{ fontSize: '28px', fontWeight: '700', color: '#fff', margin: '0 0 8px' }}>{getRecurringEntries().length}</p>
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>Recurring expenses</span>
              </div>

              {/* Monthly Cost */}
              <div style={{
                ...cardStyle,
                background: isDark 
                  ? 'linear-gradient(135deg, #3f3f46 0%, #27272a 100%)' 
                  : 'linear-gradient(135deg, #52525b 0%, #3f3f46 100%)',
                border: 'none'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', fontWeight: '500' }}>Monthly Cost</span>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Wallet style={{ width: '18px', height: '18px', color: '#fff' }} />
                  </div>
                </div>
                <p style={{ fontSize: '28px', fontWeight: '700', color: '#fff', margin: '0 0 8px' }}>{currency}{formatAmount(getMonthlyRecurringCost())}</p>
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>Estimated monthly</span>
              </div>

              {/* Yearly Cost */}
              <div style={{
                ...cardStyle,
                background: isDark 
                  ? 'linear-gradient(135deg, #44403c 0%, #292524 100%)' 
                  : 'linear-gradient(135deg, #57534e 0%, #44403c 100%)',
                border: 'none'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', fontWeight: '500' }}>Yearly Cost</span>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <TrendingUp style={{ width: '18px', height: '18px', color: '#fff' }} />
                  </div>
                </div>
                <p style={{ fontSize: '28px', fontWeight: '700', color: '#fff', margin: '0 0 8px' }}>{currency}{formatAmount(getYearlyRecurringCost())}</p>
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>Estimated yearly</span>
              </div>

              {/* Due Soon */}
              <div style={{
                ...cardStyle,
                background: isDark 
                  ? 'linear-gradient(135deg, #991b1b 0%, #7f1d1d 100%)' 
                  : 'linear-gradient(135deg, #b91c1c 0%, #991b1b 100%)',
                border: 'none'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', fontWeight: '500' }}>Due This Week</span>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Bell style={{ width: '18px', height: '18px', color: '#fff' }} />
                  </div>
                </div>
                <p style={{ fontSize: '28px', fontWeight: '700', color: '#fff', margin: '0 0 8px' }}>{getUpcomingBills().filter(b => b.daysUntil <= 7).length}</p>
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>Upcoming payments</span>
              </div>
            </div>

            {/* Upcoming Bills */}
            <div style={cardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: '600', color: theme.text, margin: 0 }}>Upcoming Bills</h2>
                  <p style={{ fontSize: '13px', color: theme.textMuted, margin: '4px 0 0' }}>Your next payments sorted by due date</p>
                </div>
                <button
                  onClick={() => { setDashboardSubTab('add-entry'); setUploadMode('manual'); }}
                  style={{
                    height: '36px',
                    padding: '0 14px',
                    backgroundColor: isDark ? '#fafafa' : '#18181b',
                    color: isDark ? '#18181b' : '#fafafa',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Plus style={{ width: '14px', height: '14px' }} />
                  Add Bill
                </button>
              </div>

              {getUpcomingBills().length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    backgroundColor: isDark ? '#27272a' : '#f4f4f5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px'
                  }}>
                    <CreditCard style={{ width: '36px', height: '36px', color: theme.textDim }} />
                  </div>
                  <p style={{ fontSize: '16px', fontWeight: '600', color: theme.textMuted, margin: '0 0 8px' }}>No recurring bills yet</p>
                  <p style={{ fontSize: '13px', color: theme.textDim, margin: '0 0 20px' }}>Add expenses with "Recurring" option to track them here</p>
                  <button
                    onClick={() => { setActiveTab('dashboard'); setUploadMode('manual'); }}
                    style={{
                      height: '40px',
                      padding: '0 20px',
                      backgroundColor: isDark ? '#fafafa' : '#18181b',
                      color: isDark ? '#18181b' : '#fafafa',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <Plus style={{ width: '16px', height: '16px' }} />
                    Add Your First Bill
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {getUpcomingBills().map((bill) => {
                    const badge = getBadgeStyle(bill.type, isDark);
                    const isUrgent = bill.daysUntil <= 3;
                    const isDueSoon = bill.daysUntil <= 7;
                    
                    return (
                      <div 
                        key={bill.id}
                        onClick={() => setEditingEntry({...bill, amount: bill.amount.toString()})}
                        style={{
                          padding: '16px',
                          backgroundColor: isUrgent ? (isDark ? 'rgba(239, 68, 68, 0.1)' : '#fef2f2') : isDueSoon ? (isDark ? 'rgba(245, 158, 11, 0.1)' : '#fffbeb') : theme.statBg,
                          borderRadius: '12px',
                          border: `1px solid ${isUrgent ? '#ef4444' : isDueSoon ? '#f59e0b' : 'transparent'}`,
                          cursor: 'pointer',
                          transition: 'transform 0.15s, box-shadow 0.15s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = isDark ? '0 4px 12px rgba(0,0,0,0.3)' : '0 4px 12px rgba(0,0,0,0.08)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '12px',
                            backgroundColor: badge.bg,
                            border: `1px solid ${badge.border}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}>
                            <span style={{ fontSize: '20px' }}>
                              {bill.type === 'utilities' && '⚡'}
                              {bill.type === 'subscription' && '📱'}
                              {bill.type === 'food' && '🍔'}
                              {bill.type === 'shopping' && '🛍️'}
                              {bill.type === 'healthcare' && '💊'}
                              {bill.type === 'entertainment' && '🎬'}
                              {bill.type === 'other' && '📦'}
                            </span>
                          </div>

                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                              <p style={{ fontSize: '15px', fontWeight: '600', color: theme.text, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {bill.name}
                              </p>
                              <span style={{ 
                                fontSize: '10px', 
                                fontWeight: '600', 
                                padding: '3px 8px', 
                                borderRadius: '4px', 
                                backgroundColor: isDark ? '#1e3a5f' : '#dbeafe', 
                                color: isDark ? '#60a5fa' : '#1d4ed8',
                                textTransform: 'capitalize',
                                flexShrink: 0
                              }}>
                                {bill.recurring}
                              </span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                              <span style={{ fontSize: '12px', color: theme.textMuted, textTransform: 'capitalize' }}>
                                {CATEGORIES.find(c => c.value === bill.type)?.label}
                              </span>
                              <span style={{ fontSize: '12px', color: theme.textDim }}>•</span>
                              <span style={{ fontSize: '12px', color: isUrgent ? '#ef4444' : isDueSoon ? '#f59e0b' : theme.textMuted, fontWeight: isUrgent || isDueSoon ? '600' : '400' }}>
                                {bill.daysUntil === 0 ? 'Due today!' : bill.daysUntil === 1 ? 'Due tomorrow' : `Due in ${bill.daysUntil} days`}
                              </span>
                            </div>
                          </div>

                          <div style={{ textAlign: 'right', flexShrink: 0 }}>
                            <p style={{ fontSize: '18px', fontWeight: '700', color: theme.text, margin: '0 0 4px' }}>
                              {currency}{formatAmount(bill.amount)}
                            </p>
                            <p style={{ fontSize: '12px', color: theme.textMuted, margin: 0 }}>
                              {bill.nextDueDate?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </p>
                          </div>

                          <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                            <button 
                              onClick={(e) => { e.stopPropagation(); setEditingEntry({...bill, amount: bill.amount.toString()}); }}
                              style={{ width: '32px', height: '32px', backgroundColor: 'transparent', border: `1px solid ${theme.inputBorder}`, borderRadius: '6px', color: theme.textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                              <Edit style={{ width: '14px', height: '14px' }} />
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); setDeletingEntry(bill); }}
                              style={{ width: '32px', height: '32px', backgroundColor: 'transparent', border: `1px solid ${theme.inputBorder}`, borderRadius: '6px', color: theme.textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                              <Trash2 style={{ width: '14px', height: '14px' }} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Bills by Category */}
            {getRecurringEntries().length > 0 && (
              <div style={{ ...cardStyle, marginTop: '24px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '600', color: theme.text, margin: '0 0 20px' }}>Bills by Category</h2>
                <div style={{ display: 'grid', gridTemplateColumns: isSmall ? '1fr' : isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: '16px' }}>
                  {CATEGORIES.map(category => {
                    const categoryBills = getRecurringEntries().filter(e => e.type === category.value);
                    if (categoryBills.length === 0) return null;
                    
                    const monthlyTotal = categoryBills.reduce((total, entry) => {
                      if (entry.recurring === 'weekly') return total + (entry.amount * 4.33);
                      if (entry.recurring === 'monthly') return total + entry.amount;
                      if (entry.recurring === 'yearly') return total + (entry.amount / 12);
                      return total;
                    }, 0);

                    return (
                      <div key={category.value} style={{
                        padding: '16px',
                        backgroundColor: theme.statBg,
                        borderRadius: '10px',
                        borderLeft: `4px solid ${category.color}`
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                          <span style={{ fontSize: '14px', fontWeight: '600', color: theme.text }}>{category.label}</span>
                          <span style={{ 
                            fontSize: '11px', 
                            padding: '3px 8px', 
                            borderRadius: '10px', 
                            backgroundColor: isDark ? '#27272a' : '#e4e4e7',
                            color: theme.textMuted
                          }}>
                            {categoryBills.length} bill{categoryBills.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                        <p style={{ fontSize: '20px', fontWeight: '700', color: category.color, margin: '0 0 4px' }}>
                          {currency}{formatAmount(monthlyTotal)}
                        </p>
                        <p style={{ fontSize: '12px', color: theme.textMuted, margin: 0 }}>per month</p>
                        
                        <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: `1px solid ${theme.cardBorder}` }}>
                          {categoryBills.slice(0, 3).map(bill => (
                            <div key={bill.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                              <span style={{ fontSize: '12px', color: theme.textMuted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '60%' }}>{bill.name}</span>
                              <span style={{ fontSize: '12px', fontWeight: '600', color: theme.text }}>{currency}{formatAmount(bill.amount)}</span>
                            </div>
                          ))}
                          {categoryBills.length > 3 && (
                            <p style={{ fontSize: '11px', color: theme.textDim, margin: '4px 0 0' }}>+{categoryBills.length - 3} more</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        ) : null}
      </main>

      {/* Add Funds Modal */}
      {showAddFundsModal && selectedWalletForFunds && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 50 }} onClick={() => { setShowAddFundsModal(false); setSelectedWalletForFunds(null); setFundsAmount(''); setFundsNote(''); }}>
          <div style={{ width: '100%', maxWidth: '400px', backgroundColor: theme.cardBg, borderRadius: '12px', border: `1px solid ${theme.cardBorder}`, overflow: 'hidden' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ 
              padding: '20px', 
              background: `linear-gradient(135deg, ${selectedWalletForFunds.color}22, ${selectedWalletForFunds.color}11)`,
              borderBottom: `1px solid ${theme.cardBorder}`
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '36px' }}>{selectedWalletForFunds.icon}</span>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: theme.text, margin: 0 }}>Add Funds</h3>
                  <p style={{ fontSize: '13px', color: theme.textMuted, margin: '2px 0 0' }}>{selectedWalletForFunds.name}</p>
                </div>
              </div>
              <p style={{ fontSize: '14px', color: theme.textMuted, margin: '12px 0 0' }}>
                Current Balance: <span style={{ fontWeight: '600', color: theme.text }}>{currency}{selectedWalletForFunds.balance.toLocaleString()}</span>
              </p>
            </div>
            
            <div style={{ padding: '20px' }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: theme.textMuted, marginBottom: '6px' }}>Amount *</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={fundsAmount}
                  onChange={(e) => setFundsAmount(e.target.value)}
                  style={{ ...inputStyle, width: '100%', fontSize: '18px', fontWeight: '600' }}
                  autoFocus
                />
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: theme.textMuted, marginBottom: '6px' }}>Note (optional)</label>
                <input
                  type="text"
                  placeholder="e.g., Salary, Transfer, etc."
                  value={fundsNote}
                  onChange={(e) => setFundsNote(e.target.value)}
                  style={{ ...inputStyle, width: '100%' }}
                />
              </div>
              
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => { setShowAddFundsModal(false); setSelectedWalletForFunds(null); setFundsAmount(''); setFundsNote(''); }}
                  style={{
                    flex: 1,
                    height: '44px',
                    backgroundColor: 'transparent',
                    border: `1px solid ${theme.inputBorder}`,
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: theme.textMuted,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddFunds}
                  disabled={!fundsAmount || parseFloat(fundsAmount) <= 0}
                  style={{
                    flex: 1,
                    height: '44px',
                    backgroundColor: selectedWalletForFunds.color,
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#fff',
                    cursor: !fundsAmount || parseFloat(fundsAmount) <= 0 ? 'not-allowed' : 'pointer',
                    opacity: !fundsAmount || parseFloat(fundsAmount) <= 0 ? 0.5 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Plus style={{ width: '16px', height: '16px' }} />
                  Add Funds
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && selectedWalletForWithdraw && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 50 }} onClick={() => { setShowWithdrawModal(false); setSelectedWalletForWithdraw(null); setWithdrawAmount(''); setWithdrawNote(''); }}>
          <div style={{ width: '100%', maxWidth: '400px', backgroundColor: theme.cardBg, borderRadius: '12px', border: `1px solid ${theme.cardBorder}`, overflow: 'hidden' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ 
              padding: '20px', 
              background: `linear-gradient(135deg, #ef4444, #dc2626)`,
              color: '#fff'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '28px' }}>{selectedWalletForWithdraw.icon}</span>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#fff', margin: 0 }}>Withdraw / Cashout</h3>
                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', margin: '2px 0 0' }}>{selectedWalletForWithdraw.name}</p>
                  </div>
                </div>
                <button onClick={() => { setShowWithdrawModal(false); setSelectedWalletForWithdraw(null); setWithdrawAmount(''); setWithdrawNote(''); }} style={{ width: '32px', height: '32px', backgroundColor: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '6px', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <X style={{ width: '18px', height: '18px' }} />
                </button>
              </div>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.9)', margin: '12px 0 0' }}>
                Available Balance: <span style={{ fontWeight: '600' }}>{currency}{selectedWalletForWithdraw.balance.toLocaleString()}</span>
              </p>
            </div>
            
            <div style={{ padding: '20px' }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: theme.textMuted, marginBottom: '6px' }}>Amount *</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  style={{ ...inputStyle, width: '100%', fontSize: '18px', fontWeight: '600' }}
                  autoFocus
                />
                {withdrawAmount && parseFloat(withdrawAmount) > selectedWalletForWithdraw.balance && (
                  <p style={{ fontSize: '12px', color: '#ef4444', margin: '6px 0 0' }}>
                    Insufficient balance
                  </p>
                )}
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: theme.textMuted, marginBottom: '6px' }}>Note (optional)</label>
                <input
                  type="text"
                  placeholder="e.g., ATM withdrawal, Transfer to bank, etc."
                  value={withdrawNote}
                  onChange={(e) => setWithdrawNote(e.target.value)}
                  style={{ ...inputStyle, width: '100%' }}
                />
              </div>
              
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => { setShowWithdrawModal(false); setSelectedWalletForWithdraw(null); setWithdrawAmount(''); setWithdrawNote(''); }}
                  style={{
                    flex: 1,
                    height: '44px',
                    backgroundColor: 'transparent',
                    border: `1px solid ${theme.inputBorder}`,
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: theme.textMuted,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleWithdraw}
                  disabled={!withdrawAmount || parseFloat(withdrawAmount) <= 0 || parseFloat(withdrawAmount) > selectedWalletForWithdraw.balance}
                  style={{
                    flex: 1,
                    height: '44px',
                    backgroundColor: '#ef4444',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#fff',
                    cursor: (!withdrawAmount || parseFloat(withdrawAmount) <= 0 || parseFloat(withdrawAmount) > selectedWalletForWithdraw.balance) ? 'not-allowed' : 'pointer',
                    opacity: (!withdrawAmount || parseFloat(withdrawAmount) <= 0 || parseFloat(withdrawAmount) > selectedWalletForWithdraw.balance) ? 0.5 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <ArrowDownRight style={{ width: '16px', height: '16px' }} />
                  Withdraw
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Wallet Name Modal */}
      {showEditWalletModal && editingWallet && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 50 }} onClick={() => { setShowEditWalletModal(false); setEditingWallet(null); setEditWalletName(''); }}>
          <div style={{ width: '100%', maxWidth: '360px', backgroundColor: theme.cardBg, borderRadius: '12px', border: `1px solid ${theme.cardBorder}`, padding: '24px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: theme.text, margin: 0 }}>Edit Wallet Name</h3>
              <button onClick={() => { setShowEditWalletModal(false); setEditingWallet(null); setEditWalletName(''); }} style={{ width: '32px', height: '32px', backgroundColor: 'transparent', border: 'none', color: theme.textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X style={{ width: '18px', height: '18px' }} />
              </button>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: theme.textMuted, marginBottom: '6px' }}>Wallet Name</label>
              <input
                type="text"
                placeholder="e.g., BDO Savings"
                value={editWalletName}
                onChange={(e) => setEditWalletName(e.target.value)}
                style={{ ...inputStyle, width: '100%' }}
                autoFocus
              />
            </div>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => { setShowEditWalletModal(false); setEditingWallet(null); setEditWalletName(''); }}
                style={{
                  flex: 1,
                  height: '40px',
                  backgroundColor: 'transparent',
                  border: `1px solid ${theme.inputBorder}`,
                  borderRadius: '6px',
                  fontSize: '14px',
                  color: theme.textMuted,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleEditWalletName}
                disabled={!editWalletName.trim()}
                style={{
                  flex: 1,
                  height: '40px',
                  backgroundColor: isDark ? '#fafafa' : '#18181b',
                  color: isDark ? '#18181b' : '#fafafa',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: !editWalletName.trim() ? 'not-allowed' : 'pointer',
                  opacity: !editWalletName.trim() ? 0.5 : 1
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Wallet Modal */}
      {showAddWalletModal && selectedWalletType && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 50 }} onClick={() => { setShowAddWalletModal(false); setSelectedWalletType(null); setNewWalletName(''); }}>
          <div style={{ width: '100%', maxWidth: '480px', backgroundColor: theme.cardBg, borderRadius: '12px', border: `1px solid ${theme.cardBorder}`, overflow: 'hidden' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ 
              padding: '20px', 
              background: `linear-gradient(135deg, ${selectedWalletType.color}22, ${selectedWalletType.color}11)`,
              borderBottom: `1px solid ${theme.cardBorder}`
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '32px' }}>{selectedWalletType.icon}</span>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', color: theme.text, margin: 0 }}>Add {selectedWalletType.label}</h3>
                    <p style={{ fontSize: '13px', color: theme.textMuted, margin: '2px 0 0' }}>Choose a preset or create custom</p>
                  </div>
                </div>
                <button onClick={() => { setShowAddWalletModal(false); setSelectedWalletType(null); setNewWalletName(''); }} style={{ width: '32px', height: '32px', backgroundColor: 'transparent', border: 'none', color: theme.textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <X style={{ width: '18px', height: '18px' }} />
                </button>
              </div>
            </div>
            
            <div style={{ padding: '20px', maxHeight: '400px', overflowY: 'auto' }}>
              {/* Preset Options */}
              {selectedWalletType.presets && selectedWalletType.presets.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: theme.textMuted, marginBottom: '12px' }}>Quick Add</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                    {selectedWalletType.presets.map((preset, idx) => {
                      const alreadyExists = wallets.some(w => w.name === preset.name);
                      return (
                        <button
                          key={idx}
                          onClick={() => !alreadyExists && handleAddWallet(preset)}
                          disabled={alreadyExists}
                          style={{
                            padding: '12px',
                            backgroundColor: alreadyExists ? theme.statBg : 'transparent',
                            border: `1px solid ${alreadyExists ? theme.cardBorder : preset.color}`,
                            borderRadius: '8px',
                            cursor: alreadyExists ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            opacity: alreadyExists ? 0.5 : 1,
                            transition: 'all 0.15s'
                          }}
                        >
                          <span style={{ fontSize: '20px' }}>{preset.icon}</span>
                          <div style={{ textAlign: 'left' }}>
                            <p style={{ fontSize: '13px', fontWeight: '500', color: theme.text, margin: 0 }}>{preset.name}</p>
                            {alreadyExists && (
                              <p style={{ fontSize: '10px', color: theme.textMuted, margin: '2px 0 0' }}>Already added</p>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              
              {/* Custom Wallet */}
              <div style={{ 
                padding: '16px', 
                backgroundColor: theme.statBg, 
                borderRadius: '8px',
                border: `1px solid ${theme.cardBorder}`
              }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: theme.textMuted, marginBottom: '12px' }}>
                  {selectedWalletType.presets ? 'Or Create Custom' : 'Wallet Details'}
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: theme.textMuted, marginBottom: '4px' }}>Name</label>
                    <input
                      type="text"
                      placeholder={`e.g., My ${selectedWalletType.label}`}
                      value={newWalletName}
                      onChange={(e) => setNewWalletName(e.target.value)}
                      style={{ ...inputStyle, width: '100%' }}
                    />
                  </div>
                  <button
                    onClick={() => handleAddWallet()}
                    disabled={!newWalletName.trim()}
                    style={{
                      height: '40px',
                      backgroundColor: selectedWalletType.color,
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: !newWalletName.trim() ? 'not-allowed' : 'pointer',
                      opacity: !newWalletName.trim() ? 0.5 : 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <Plus style={{ width: '16px', height: '16px' }} />
                    Add Custom {selectedWalletType.label}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Wallet Confirmation Modal */}
      {showDeleteWalletConfirm && walletToDelete && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 50 }} onClick={() => { setShowDeleteWalletConfirm(false); setWalletToDelete(null); }}>
          <div style={{ width: '100%', maxWidth: '400px', backgroundColor: theme.cardBg, borderRadius: '12px', border: `1px solid ${theme.cardBorder}`, padding: '24px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ 
                width: '56px', 
                height: '56px', 
                borderRadius: '50%', 
                backgroundColor: '#fef2f2', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}>
                <Trash2 style={{ width: '28px', height: '28px', color: '#ef4444' }} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: theme.text, margin: '0 0 8px' }}>Delete Wallet?</h3>
              <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0 }}>
                Are you sure you want to delete <strong>{walletToDelete.name}</strong>? 
                This will also remove all transaction history for this wallet.
              </p>
              {walletToDelete.balance !== 0 && (
                <p style={{ 
                  fontSize: '13px', 
                  color: '#f59e0b', 
                  margin: '12px 0 0',
                  padding: '8px 12px',
                  backgroundColor: isDark ? '#422006' : '#fef3c7',
                  borderRadius: '6px'
                }}>
                  ⚠️ This wallet has a balance of {currency}{walletToDelete.balance.toLocaleString()}
                </p>
              )}
            </div>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => { setShowDeleteWalletConfirm(false); setWalletToDelete(null); }}
                style={{
                  flex: 1,
                  height: '44px',
                  backgroundColor: 'transparent',
                  border: `1px solid ${theme.inputBorder}`,
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: theme.textMuted,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteWallet}
                style={{
                  flex: 1,
                  height: '44px',
                  backgroundColor: '#ef4444',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Trash2 style={{ width: '16px', height: '16px' }} />
                Delete Wallet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear All Wallets Confirmation Modal */}
      {showClearAllWalletsConfirm && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 50 }} onClick={() => { setShowClearAllWalletsConfirm(false); setClearWalletsConfirmText(''); }}>
          <div style={{ width: '100%', maxWidth: '420px', backgroundColor: theme.cardBg, borderRadius: '12px', border: `1px solid ${theme.cardBorder}`, padding: '24px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ 
                width: '56px', 
                height: '56px', 
                borderRadius: '50%', 
                backgroundColor: '#fef2f2', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}>
                <AlertTriangle style={{ width: '28px', height: '28px', color: '#ef4444' }} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: theme.text, margin: '0 0 8px' }}>Clear All Wallets?</h3>
              <p style={{ fontSize: '14px', color: theme.textMuted, margin: '0 0 16px' }}>
                This will permanently delete <strong>all {wallets.length} wallets</strong> and <strong>all {walletTransactions.length} transactions</strong>. This action cannot be undone.
              </p>
              
              <div style={{ 
                padding: '12px', 
                backgroundColor: isDark ? '#422006' : '#fef3c7', 
                borderRadius: '8px',
                marginBottom: '16px'
              }}>
                <p style={{ fontSize: '13px', color: isDark ? '#fcd34d' : '#92400e', margin: 0 }}>
                  ⚠️ Total balance to be deleted: <strong>{currency}{getTotalWalletBalance().toLocaleString()}</strong>
                </p>
              </div>
              
              <div style={{ textAlign: 'left' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: theme.textMuted, marginBottom: '6px' }}>
                  Type <strong style={{ color: '#ef4444' }}>delete</strong> to confirm:
                </label>
                <input
                  type="text"
                  value={clearWalletsConfirmText}
                  onChange={(e) => setClearWalletsConfirmText(e.target.value)}
                  placeholder="Type 'delete' here"
                  style={{ ...inputStyle, width: '100%' }}
                  autoFocus
                />
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => { setShowClearAllWalletsConfirm(false); setClearWalletsConfirmText(''); }}
                style={{
                  flex: 1,
                  height: '44px',
                  backgroundColor: 'transparent',
                  border: `1px solid ${theme.inputBorder}`,
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: theme.textMuted,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleClearAllWallets}
                disabled={clearWalletsConfirmText.toLowerCase() !== 'delete'}
                style={{
                  flex: 1,
                  height: '44px',
                  backgroundColor: clearWalletsConfirmText.toLowerCase() === 'delete' ? '#ef4444' : theme.statBg,
                  color: clearWalletsConfirmText.toLowerCase() === 'delete' ? '#fff' : theme.textMuted,
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: clearWalletsConfirmText.toLowerCase() === 'delete' ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Trash2 style={{ width: '16px', height: '16px' }} />
                Clear Everything
              </button>
            </div>
          </div>
        </div>
      )}

{/* Edit Entry Modal */}
      {editingEntry && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 50 }} onClick={() => setEditingEntry(null)}>
          <div style={{ width: '100%', maxWidth: '450px', backgroundColor: theme.cardBg, borderRadius: '12px', border: `1px solid ${theme.cardBorder}`, padding: '24px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: theme.text, margin: 0 }}>Edit Entry</h3>
              <button onClick={() => setEditingEntry(null)} style={{ width: '32px', height: '32px', backgroundColor: 'transparent', border: 'none', color: theme.textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X style={{ width: '18px', height: '18px' }} />
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: theme.text, marginBottom: '6px' }}>Name *</label>
                <input
                  type="text"
                  value={editingEntry.name}
                  onChange={(e) => setEditingEntry({...editingEntry, name: e.target.value})}
                  style={{ width: '100%', height: '44px', backgroundColor: theme.inputBg, border: `1px solid ${theme.inputBorder}`, borderRadius: '8px', padding: '0 12px', fontSize: '16px', color: theme.text, outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: theme.text, marginBottom: '6px' }}>Category *</label>
                <select
                  value={editingEntry.type}
                  onChange={(e) => setEditingEntry({...editingEntry, type: e.target.value})}
                  style={{ width: '100%', height: '44px', backgroundColor: theme.inputBg, border: `1px solid ${theme.inputBorder}`, borderRadius: '8px', padding: '0 12px', fontSize: '16px', color: theme.text, outline: 'none', boxSizing: 'border-box', cursor: 'pointer' }}
                >
                  {CATEGORIES.map(c => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: theme.text, marginBottom: '6px' }}>Amount *</label>
                <input
                  type="number"
                  step="0.01"
                  value={editingEntry.amount}
                  onChange={(e) => setEditingEntry({...editingEntry, amount: e.target.value})}
                  style={{ width: '100%', height: '44px', backgroundColor: theme.inputBg, border: `1px solid ${theme.inputBorder}`, borderRadius: '8px', padding: '0 12px', fontSize: '16px', color: theme.text, outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: theme.text, marginBottom: '6px' }}>Date</label>
                  <input
                    type="date"
                    value={editingEntry.date}
                    onChange={(e) => setEditingEntry({...editingEntry, date: e.target.value})}
                    style={{ width: '100%', height: '44px', backgroundColor: theme.inputBg, border: `1px solid ${theme.inputBorder}`, borderRadius: '8px', padding: '0 12px', fontSize: '16px', color: theme.text, outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: theme.text, marginBottom: '6px' }}>Due Date</label>
                  <input
                    type="date"
                    value={editingEntry.dueDate || ''}
                    onChange={(e) => setEditingEntry({...editingEntry, dueDate: e.target.value})}
                    style={{ width: '100%', height: '44px', backgroundColor: theme.inputBg, border: `1px solid ${theme.inputBorder}`, borderRadius: '8px', padding: '0 12px', fontSize: '16px', color: theme.text, outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: theme.text, marginBottom: '6px' }}>Notes (optional)</label>
                  <input
                    type="text"
                    placeholder="Add a memo or note..."
                    value={editingEntry.notes || ''}
                    onChange={(e) => setEditingEntry({...editingEntry, notes: e.target.value})}
                    style={{ width: '100%', height: '44px', backgroundColor: theme.inputBg, border: `1px solid ${theme.inputBorder}`, borderRadius: '8px', padding: '0 12px', fontSize: '16px', color: theme.text, outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: theme.text, marginBottom: '6px' }}>Recurring</label>
                  <select
                    value={editingEntry.recurring || ''}
                    onChange={(e) => setEditingEntry({...editingEntry, recurring: e.target.value || null})}
                    style={{ width: '100%', height: '44px', backgroundColor: theme.inputBg, border: `1px solid ${theme.inputBorder}`, borderRadius: '8px', padding: '0 12px', fontSize: '16px', color: theme.text, outline: 'none', boxSizing: 'border-box', cursor: 'pointer' }}
                  >
                    <option value="">None</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button
                onClick={() => setEditingEntry(null)}
                style={{ flex: 1, height: '44px', backgroundColor: 'transparent', border: `1px solid ${theme.inputBorder}`, borderRadius: '8px', fontSize: '14px', fontWeight: '500', color: theme.text, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateEntry}
                disabled={!editingEntry.name || !editingEntry.amount || isSaving}
                style={{ flex: 1, height: '44px', backgroundColor: isDark ? '#fafafa' : '#18181b', color: isDark ? '#18181b' : '#fafafa', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: (!editingEntry.name || !editingEntry.amount || isSaving) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', opacity: (!editingEntry.name || !editingEntry.amount || isSaving) ? 0.5 : 1 }}
              >
                {isSaving ? <><Loader2 style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} /> Saving...</> : <><Check style={{ width: '16px', height: '16px' }} /> Save Changes</>}
              </button>
            </div>
          </div>
        </div>
      )}

{/* Delete Entry Modal */}
      {deletingEntry && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 50 }} onClick={() => setDeletingEntry(null)}>
          <div style={{ width: '100%', maxWidth: '400px', backgroundColor: theme.cardBg, borderRadius: '12px', border: `1px solid ${theme.cardBorder}`, padding: '24px', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: isDark ? '#450a0a' : '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <AlertTriangle style={{ width: '28px', height: '28px', color: '#ef4444' }} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: theme.text, margin: '0 0 8px' }}>Delete Entry?</h3>
            <p style={{ fontSize: '14px', color: theme.textMuted, margin: '0 0 16px' }}>Are you sure you want to delete this entry? This action cannot be undone.</p>
            
            <div style={{ padding: '16px', backgroundColor: theme.statBg, borderRadius: '8px', marginBottom: '20px', textAlign: 'left' }}>
              <p style={{ fontSize: '14px', fontWeight: '600', color: theme.text, margin: '0 0 4px' }}>{deletingEntry.name}</p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', color: theme.textMuted, textTransform: 'capitalize' }}>{deletingEntry.type}</span>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#ef4444' }}>{currency}{formatAmount(deletingEntry.amount)}</span>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setDeletingEntry(null)}
                style={{ flex: 1, height: '44px', backgroundColor: 'transparent', border: `1px solid ${theme.inputBorder}`, borderRadius: '8px', fontSize: '14px', fontWeight: '500', color: theme.text, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteEntry}
                disabled={isSaving}
                style={{ flex: 1, height: '44px', backgroundColor: '#ef4444', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '500', color: '#fff', cursor: isSaving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', opacity: isSaving ? 0.7 : 1 }}
              >
                {isSaving ? <><Loader2 style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} /> Deleting...</> : <><Trash2 style={{ width: '16px', height: '16px' }} /> Delete</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Confirmation Modal */}
      {showBulkDeleteConfirm && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 50 }} onClick={() => setShowBulkDeleteConfirm(false)}>
          <div style={{ width: '100%', maxWidth: '450px', backgroundColor: theme.cardBg, borderRadius: '12px', border: `1px solid ${theme.cardBorder}`, padding: '24px', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: isDark ? '#450a0a' : '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <AlertTriangle style={{ width: '28px', height: '28px', color: '#ef4444' }} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: theme.text, margin: '0 0 8px' }}>Delete {selectedEntries.length} Entries?</h3>
            <p style={{ fontSize: '14px', color: theme.textMuted, margin: '0 0 20px' }}>
              Are you sure you want to delete <strong>{selectedEntries.length}</strong> selected entries? This action cannot be undone.
            </p>
            
            <div style={{ 
              padding: '16px', 
              backgroundColor: isDark ? '#450a0a' : '#fef2f2', 
              borderRadius: '8px', 
              marginBottom: '20px',
              border: `1px solid ${isDark ? '#7f1d1d' : '#fecaca'}`
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                <AlertTriangle style={{ width: '16px', height: '16px', color: '#ef4444' }} />
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#ef4444' }}>
                  Total: {currency}{formatAmount(entries.filter(e => selectedEntries.includes(e.id)).reduce((sum, e) => sum + e.amount, 0))}
                </span>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setShowBulkDeleteConfirm(false)}
                style={{ flex: 1, height: '44px', backgroundColor: 'transparent', border: `1px solid ${theme.inputBorder}`, borderRadius: '8px', fontSize: '14px', fontWeight: '500', color: theme.text, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={handleBulkDelete}
                disabled={isDeleting}
                style={{ flex: 1, height: '44px', backgroundColor: '#ef4444', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '500', color: '#fff', cursor: isDeleting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', opacity: isDeleting ? 0.7 : 1 }}
              >
                {isDeleting ? <><Loader2 style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} /> Deleting...</> : <><Trash2 style={{ width: '16px', height: '16px' }} /> Delete All Selected</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear All Entries Confirmation Modal */}
      {showClearAllConfirm && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 50 }} onClick={() => { setShowClearAllConfirm(false); setClearEntriesConfirmText(''); }}>
          <div style={{ width: '100%', maxWidth: '450px', backgroundColor: theme.cardBg, borderRadius: '12px', border: `1px solid ${theme.cardBorder}`, padding: '24px', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: isDark ? '#450a0a' : '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <AlertTriangle style={{ width: '28px', height: '28px', color: '#ef4444' }} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: theme.text, margin: '0 0 8px' }}>Clear All Entries?</h3>
            <p style={{ fontSize: '14px', color: theme.textMuted, margin: '0 0 20px' }}>
              This will permanently delete <strong>ALL {entries.length} entries</strong> from your account. This action cannot be undone!
            </p>
            
            <div style={{ 
              padding: '16px', 
              backgroundColor: isDark ? '#450a0a' : '#fef2f2', 
              borderRadius: '8px', 
              marginBottom: '20px',
              border: `1px solid ${isDark ? '#7f1d1d' : '#fecaca'}`
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: isDark ? '#fca5a5' : '#dc2626' }}>
                  You will lose all expense records including:
                </span>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <span style={{ fontSize: '12px', color: theme.textMuted }}>{entries.length} entries</span>
                  <span style={{ fontSize: '12px', color: theme.textMuted }}>•</span>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: '#ef4444' }}>{currency}{formatAmount(entries.reduce((sum, e) => sum + e.amount, 0))} total</span>
                </div>
              </div>
            </div>
            
            {/* Type delete to confirm */}
            <div style={{ textAlign: 'left', marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: theme.textMuted, marginBottom: '6px' }}>
                Type <strong style={{ color: '#ef4444' }}>delete</strong> to confirm:
              </label>
              <input
                type="text"
                value={clearEntriesConfirmText}
                onChange={(e) => setClearEntriesConfirmText(e.target.value)}
                placeholder="Type 'delete' here"
                style={{ ...inputStyle, width: '100%' }}
                autoFocus
              />
            </div>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => { setShowClearAllConfirm(false); setClearEntriesConfirmText(''); }}
                style={{ flex: 1, height: '44px', backgroundColor: 'transparent', border: `1px solid ${theme.inputBorder}`, borderRadius: '8px', fontSize: '14px', fontWeight: '500', color: theme.text, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={handleClearAll}
                disabled={isDeleting || clearEntriesConfirmText.toLowerCase() !== 'delete'}
                style={{ 
                  flex: 1, 
                  height: '44px', 
                  backgroundColor: clearEntriesConfirmText.toLowerCase() === 'delete' ? '#ef4444' : theme.statBg, 
                  border: 'none', 
                  borderRadius: '8px', 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  color: clearEntriesConfirmText.toLowerCase() === 'delete' ? '#fff' : theme.textMuted, 
                  cursor: (isDeleting || clearEntriesConfirmText.toLowerCase() !== 'delete') ? 'not-allowed' : 'pointer', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '6px', 
                  opacity: isDeleting ? 0.7 : 1 
                }}
              >
                {isDeleting ? <><Loader2 style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} /> Clearing...</> : <><Trash2 style={{ width: '16px', height: '16px' }} /> Clear Everything</>}
              </button>
            </div>
          </div>
        </div>
      )}



      {/* File Preview Modal */}
      {previewFile && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: isSmall ? '12px' : '16px', zIndex: 50 }} onClick={() => setPreviewFile(null)}>
          <div style={{ ...cardStyle, maxWidth: '500px', width: '100%', maxHeight: '90vh', overflow: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px', gap: '12px' }}>
              <div style={{ minWidth: 0, flex: 1 }}>
                <h3 style={{ fontSize: '15px', fontWeight: '600', color: theme.text, margin: 0, wordBreak: 'break-word' }}>{previewFile.name}</h3>
                <p style={{ fontSize: '12px', color: theme.textSubtle, margin: '4px 0 0', wordBreak: 'break-word' }}>{previewFile.file.name}</p>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                {!isSmall && (
                  <button onClick={() => handleDownloadFile(previewFile)} style={{ height: '32px', backgroundColor: 'transparent', border: `1px solid ${theme.inputBorder}`, borderRadius: '6px', padding: '0 12px', fontSize: '13px', color: theme.textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Download style={{ width: '14px', height: '14px' }} /> Download
                  </button>
                )}
                <button onClick={() => setPreviewFile(null)} style={{ width: '32px', height: '32px', backgroundColor: 'transparent', border: `1px solid ${theme.inputBorder}`, borderRadius: '6px', color: theme.textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <X style={{ width: '16px', height: '16px' }} />
                </button>
              </div>
            </div>
            {isSmall && (
              <button onClick={() => handleDownloadFile(previewFile)} style={{ width: '100%', height: '40px', backgroundColor: 'transparent', border: `1px solid ${theme.inputBorder}`, borderRadius: '6px', marginBottom: '12px', fontSize: '13px', color: theme.textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <Download style={{ width: '14px', height: '14px' }} /> Download File
              </button>
            )}
            <div style={{ backgroundColor: theme.bg, borderRadius: '8px', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}>
              {previewFile.file.type.startsWith('image/') ? (
                <img src={`data:${previewFile.file.type};base64,${previewFile.file.data}`} alt={previewFile.name} style={{ maxWidth: '100%', maxHeight: isSmall ? '250px' : '300px', objectFit: 'contain', borderRadius: '4px' }} />
              ) : previewFile.file.type === 'application/pdf' ? (
                <div style={{ textAlign: 'center', padding: '24px' }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '12px',
                    backgroundColor: isDark ? '#dc2626' : '#ef4444',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px'
                  }}>
                    <FileText style={{ width: '32px', height: '32px', color: '#fff' }} />
                  </div>
                  <p style={{ fontSize: '14px', fontWeight: '500', color: theme.text, margin: '0 0 4px' }}>PDF Document</p>
                  <p style={{ fontSize: '12px', color: theme.textMuted, margin: '0 0 16px', wordBreak: 'break-word' }}>{previewFile.file.name}</p>
                  <p style={{ fontSize: '11px', color: theme.textDim, margin: '0 0 16px' }}>
                    PDF preview is not available in this environment.<br />Click download to view the file.
                  </p>
                  <button 
                    onClick={() => handleDownloadFile(previewFile)} 
                    style={{ 
                      height: '36px', 
                      padding: '0 20px',
                      backgroundColor: isDark ? '#fafafa' : '#18181b',
                      color: isDark ? '#18181b' : '#fafafa',
                      border: 'none', 
                      borderRadius: '6px', 
                      fontSize: '13px', 
                      fontWeight: '500',
                      cursor: 'pointer', 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '8px' 
                    }}
                  >
                    <Download style={{ width: '14px', height: '14px' }} /> Download PDF
                  </button>
                </div>
              ) : (
                <p style={{ color: theme.textSubtle }}>Preview not available</p>
              )}
            </div>
          </div>
        </div>
      )}
{/* Budget Modal */}
      {showBudgetModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 50 }} onClick={() => setShowBudgetModal(false)}>
          <div style={{ width: '100%', maxWidth: '400px', backgroundColor: theme.cardBg, borderRadius: '12px', border: `1px solid ${theme.cardBorder}`, padding: '24px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: theme.text, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <PiggyBank style={{ width: '22px', height: '22px', color: '#3b82f6' }} />
                Monthly Budget
              </h3>
              <button onClick={() => setShowBudgetModal(false)} style={{ width: '32px', height: '32px', backgroundColor: 'transparent', border: 'none', color: theme.textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X style={{ width: '18px', height: '18px' }} />
              </button>
            </div>
            
            <p style={{ fontSize: '14px', color: theme.textMuted, margin: '0 0 20px' }}>
              Set a monthly spending limit to help track your expenses. You'll see warnings when approaching or exceeding your budget.
            </p>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: theme.text, marginBottom: '8px' }}>
                Budget Amount ({currency})
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', color: theme.textMuted }}>{currency}</span>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={budgetInput}
                  onChange={(e) => setBudgetInput(e.target.value)}
                  style={{ 
                    width: '100%', 
                    height: '48px', 
                    backgroundColor: theme.inputBg, 
                    border: `1px solid ${theme.inputBorder}`, 
                    borderRadius: '8px', 
                    padding: '0 14px 0 36px', 
                    fontSize: '18px', 
                    fontWeight: '500',
                    color: theme.text, 
                    outline: 'none', 
                    boxSizing: 'border-box' 
                  }}
                />
              </div>
            </div>
            
            {monthlyBudget > 0 && (
              <div style={{ 
                padding: '12px', 
                backgroundColor: theme.statBg, 
                borderRadius: '8px', 
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <span style={{ fontSize: '13px', color: theme.textMuted }}>Current budget:</span>
                <span style={{ fontSize: '14px', fontWeight: '600', color: theme.text }}>{currency}{formatAmount(monthlyBudget)}</span>
              </div>
            )}
            
            <div style={{ display: 'flex', gap: '12px' }}>
              {monthlyBudget > 0 && (
                <button
                  onClick={() => {
                    setMonthlyBudget(0);
                    setShowBudgetModal(false);
                    showToast('Budget removed', 'success');
                  }}
                  style={{ 
                    height: '44px', 
                    padding: '0 16px',
                    backgroundColor: 'transparent', 
                    border: `1px solid #ef4444`, 
                    borderRadius: '8px', 
                    fontSize: '14px', 
                    fontWeight: '500', 
                    color: '#ef4444', 
                    cursor: 'pointer'
                  }}
                >
                  Remove
                </button>
              )}
              <button
                onClick={() => setShowBudgetModal(false)}
                style={{ 
                  flex: monthlyBudget > 0 ? 'none' : 1,
                  height: '44px', 
                  padding: '0 16px',
                  backgroundColor: 'transparent', 
                  border: `1px solid ${theme.inputBorder}`, 
                  borderRadius: '8px', 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  color: theme.text, 
                  cursor: 'pointer' 
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const amount = parseFloat(budgetInput);
                  if (amount > 0) {
                    setMonthlyBudget(amount);
                    setShowBudgetModal(false);
                    showToast('Monthly budget set successfully', 'success');
                  } else {
                    showToast('Please enter a valid amount', 'error');
                  }
                }}
                style={{ 
                  flex: 1,
                  height: '44px', 
                  backgroundColor: isDark ? '#fafafa' : '#18181b', 
                  color: isDark ? '#18181b' : '#fafafa', 
                  border: 'none', 
                  borderRadius: '8px', 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <Check style={{ width: '16px', height: '16px' }} />
                Save Budget
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Level Up Modal */}
      {showLevelUp && levelUpData && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 60 }}>
          <div style={{ 
            width: '100%', 
            maxWidth: '400px', 
            backgroundColor: theme.cardBg, 
            borderRadius: '16px', 
            border: `2px solid #fbbf24`, 
            padding: '32px',
            textAlign: 'center',
            boxShadow: '0 0 40px rgba(251, 191, 36, 0.3)'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              margin: '0 auto 20px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 30px rgba(251, 191, 36, 0.5)',
              animation: 'pulse 1s ease-in-out infinite'
            }}>
              <Star style={{ width: '40px', height: '40px', color: '#fff' }} />
            </div>
            <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#fbbf24', margin: '0 0 8px' }}>LEVEL UP!</h2>
            <p style={{ fontSize: '16px', color: theme.text, margin: '0 0 20px' }}>
              You reached <strong>Level {levelUpData.newLevel}</strong>!
            </p>
            
            {levelUpData.newFrames && levelUpData.newFrames.length > 0 && (
              <div style={{ 
                padding: '16px', 
                backgroundColor: isDark ? '#1a1a1d' : '#fefce8', 
                borderRadius: '10px',
                marginBottom: '20px',
                border: `1px solid ${isDark ? '#fbbf24' : '#fde047'}`
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Gift style={{ width: '18px', height: '18px', color: '#f59e0b' }} />
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#f59e0b' }}>New Reward Unlocked!</span>
                </div>
                <p style={{ fontSize: '15px', fontWeight: '600', color: theme.text, margin: 0 }}>
                  {levelUpData.newFrames[0].name}
                </p>
                <p style={{ fontSize: '12px', color: theme.textMuted, margin: '4px 0 0' }}>
                  New profile frame available
                </p>
              </div>
            )}
            
            <button
              onClick={() => { setShowLevelUp(false); setLevelUpData(null); }}
              style={{
                width: '100%',
                height: '44px',
                background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                border: 'none',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: '600',
                color: '#fff',
                cursor: 'pointer'
              }}
            >
              Awesome!
            </button>
          </div>
        </div>
      )}

      {/* Achievement Unlock Modal */}
      {showAchievementUnlock && newAchievement && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 70 }}>
          <div style={{ 
            width: '100%', 
            maxWidth: '380px', 
            backgroundColor: theme.cardBg, 
            borderRadius: '20px', 
            border: `2px solid ${getTierStyle(newAchievement.tier).color}`, 
            padding: '32px 24px',
            textAlign: 'center',
            boxShadow: getTierStyle(newAchievement.tier).glow,
            animation: 'achievementPop 0.5s ease-out'
          }}>
            {/* Achievement Badge */}
            <div style={{
              width: '100px',
              height: '100px',
              margin: '0 auto 20px',
              borderRadius: '50%',
              background: getTierStyle(newAchievement.tier).bgGradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: getTierStyle(newAchievement.tier).glow,
              animation: getTierStyle(newAchievement.tier).animated ? 'badgeShine 2s ease-in-out infinite' : 'none',
              position: 'relative'
            }}>
              <span style={{ fontSize: '48px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>{newAchievement.icon}</span>
              {/* Tier indicator */}
              <div style={{
                position: 'absolute',
                bottom: '-5px',
                right: '-5px',
                padding: '4px 10px',
                borderRadius: '12px',
                background: getTierStyle(newAchievement.tier).bgGradient,
                border: `2px solid ${theme.cardBg}`,
                fontSize: '10px',
                fontWeight: '700',
                color: '#fff',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {newAchievement.tier}
              </div>
            </div>
            
            <p style={{ fontSize: '14px', fontWeight: '600', color: getTierStyle(newAchievement.tier).color, margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '2px' }}>
              Achievement Unlocked!
            </p>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: theme.text, margin: '0 0 8px' }}>{newAchievement.name}</h2>
            <p style={{ fontSize: '14px', color: theme.textMuted, margin: '0 0 20px' }}>{newAchievement.description}</p>
            
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '6px', 
              padding: '8px 16px', 
              backgroundColor: isDark ? '#1a1a1d' : '#f0fdf4', 
              borderRadius: '20px',
              marginBottom: '24px'
            }}>
              <span style={{ fontSize: '16px' }}>✨</span>
              <span style={{ fontSize: '16px', fontWeight: '700', color: '#22c55e' }}>+{getTierStyle(newAchievement.tier).xpReward} XP</span>
            </div>
            
            <button
              onClick={() => { setShowAchievementUnlock(false); setNewAchievement(null); }}
              style={{
                width: '100%',
                height: '48px',
                background: getTierStyle(newAchievement.tier).bgGradient,
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                color: '#fff',
                cursor: 'pointer',
                boxShadow: getTierStyle(newAchievement.tier).glow
              }}
            >
              Claim Reward
            </button>
          </div>
        </div>
      )}


      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes rainbow-border {
          0% { border-color: #ff0000; }
          17% { border-color: #ff8000; }
          33% { border-color: #ffff00; }
          50% { border-color: #00ff00; }
          67% { border-color: #0080ff; }
          83% { border-color: #8000ff; }
          100% { border-color: #ff0000; }
        }
        @keyframes legendary-pulse {
          0%, 100% { box-shadow: 0 0 20px #ffd700, 0 0 30px #ff8c00; }
          50% { box-shadow: 0 0 30px #ffd700, 0 0 50px #ff8c00, 0 0 70px #ff4500; }
        }
        
        /* Gen Z/Gen Alpha Animated Frame Effects */
        @keyframes pulse-bronze {
          0%, 100% { box-shadow: 0 0 10px #cd7f32; }
          50% { box-shadow: 0 0 20px #cd7f32, 0 0 30px #8b4513; }
        }
        @keyframes shimmer-silver {
          0% { box-shadow: 0 0 12px #c0c0c0, 0 0 20px #e8e8e8; filter: brightness(1); }
          50% { box-shadow: 0 0 20px #ffffff, 0 0 35px #c0c0c0; filter: brightness(1.2); }
          100% { box-shadow: 0 0 12px #c0c0c0, 0 0 20px #e8e8e8; filter: brightness(1); }
        }
        @keyframes glow-gold {
          0%, 100% { box-shadow: 0 0 15px #ffd700, 0 0 30px #daa520; filter: brightness(1); }
          50% { box-shadow: 0 0 25px #ffd700, 0 0 50px #ffec8b; filter: brightness(1.3); }
        }
        @keyframes mythic-glow {
          0%, 100% { 
            box-shadow: 0 0 20px #ff00ff, 0 0 40px #00ffff;
            filter: hue-rotate(0deg);
          }
          50% { 
            box-shadow: 0 0 40px #ff00ff, 0 0 60px #00ffff;
            filter: hue-rotate(30deg);
          }
        }
        @keyframes neon-flash {
          0%, 100% { 
            box-shadow: 0 0 15px #00ff00, 0 0 30px #00ff00, 0 0 45px #00ff00;
            filter: brightness(1);
          }
          50% { 
            box-shadow: 0 0 25px #00ff00, 0 0 50px #00ff00, 0 0 75px #00ff00;
            filter: brightness(1.5);
          }
        }
        @keyframes cosmic-swirl {
          0% { 
            box-shadow: 0 0 20px #4a0080, 0 0 40px #800080, 0 0 60px #ff00ff;
            filter: hue-rotate(0deg) brightness(1);
          }
          33% { 
            box-shadow: 0 0 25px #0000ff, 0 0 50px #4a0080, 0 0 75px #800080;
            filter: hue-rotate(120deg) brightness(1.2);
          }
          66% { 
            box-shadow: 0 0 30px #ff00ff, 0 0 55px #0000ff, 0 0 80px #4a0080;
            filter: hue-rotate(240deg) brightness(1.1);
          }
          100% { 
            box-shadow: 0 0 20px #4a0080, 0 0 40px #800080, 0 0 60px #ff00ff;
            filter: hue-rotate(360deg) brightness(1);
          }
        }
        @keyframes fire-border {
          0%, 100% { 
            box-shadow: 0 0 15px #ff4500, 0 0 30px #ff6600, 0 0 45px #ff8800;
            filter: brightness(1);
          }
          25% { 
            box-shadow: 0 0 20px #ff6600, 0 0 40px #ff8800, 0 0 55px #ffaa00;
            filter: brightness(1.2);
          }
          50% { 
            box-shadow: 0 0 25px #ff8800, 0 0 50px #ffaa00, 0 0 70px #ffcc00;
            filter: brightness(1.4);
          }
          75% { 
            box-shadow: 0 0 20px #ffaa00, 0 0 40px #ff8800, 0 0 55px #ff6600;
            filter: brightness(1.1);
          }
        }
        @keyframes ice-shimmer {
          0%, 100% { 
            box-shadow: 0 0 15px #00bfff, 0 0 30px #87ceeb, 0 0 45px #e0ffff;
            filter: brightness(1) saturate(1);
          }
          50% { 
            box-shadow: 0 0 25px #87ceeb, 0 0 50px #e0ffff, 0 0 70px #ffffff;
            filter: brightness(1.3) saturate(0.8);
          }
        }
        @keyframes electric-zap {
          0%, 100% { 
            box-shadow: 0 0 15px #ffff00, 0 0 30px #00ffff;
            filter: brightness(1);
          }
          25% { 
            box-shadow: 0 0 25px #00ffff, 0 0 50px #ffff00;
            filter: brightness(1.5);
          }
          50% { 
            box-shadow: 0 0 20px #ffff00, 0 0 40px #ffffff;
            filter: brightness(1.2);
          }
          75% { 
            box-shadow: 0 0 30px #ffffff, 0 0 55px #00ffff;
            filter: brightness(1.4);
          }
        }
        @keyframes shadow-pulse {
          0%, 100% { 
            box-shadow: 0 0 20px #1a1a2e, 0 0 40px #16213e, 0 0 60px #0f3460, inset 0 0 15px rgba(0,0,0,0.5);
            filter: brightness(0.9);
          }
          50% { 
            box-shadow: 0 0 30px #0f3460, 0 0 50px #1a1a2e, 0 0 70px #16213e, inset 0 0 25px rgba(0,0,0,0.3);
            filter: brightness(1.1);
          }
        }
        @keyframes diamond-sparkle {
          0% { filter: brightness(1) hue-rotate(0deg); opacity: 1; }
          25% { filter: brightness(1.5) hue-rotate(90deg); opacity: 0.95; }
          50% { filter: brightness(2) hue-rotate(180deg); opacity: 0.9; }
          75% { filter: brightness(1.5) hue-rotate(270deg); opacity: 0.95; }
          100% { filter: brightness(1) hue-rotate(360deg); opacity: 1; }
        }
        @keyframes aurora-flow {
          0% { 
            box-shadow: 0 0 20px #00ff88, 0 0 40px #00ffcc, 0 0 60px #00ccff;
            filter: hue-rotate(0deg);
          }
          33% { 
            box-shadow: 0 0 25px #ff00cc, 0 0 50px #ff0088, 0 0 70px #ff0044;
            filter: hue-rotate(120deg);
          }
          66% { 
            box-shadow: 0 0 30px #ffcc00, 0 0 55px #ff8800, 0 0 80px #ff4400;
            filter: hue-rotate(240deg);
          }
          100% { 
            box-shadow: 0 0 20px #00ff88, 0 0 40px #00ffcc, 0 0 60px #00ccff;
            filter: hue-rotate(360deg);
          }
        }
        @keyframes glitch-effect {
          0%, 100% { 
            transform: translate(0); 
            filter: hue-rotate(0deg);
            opacity: 1;
          }
          10% { transform: translate(-2px, 2px); filter: hue-rotate(90deg); }
          20% { transform: translate(2px, -2px); filter: hue-rotate(180deg); }
          30% { transform: translate(-1px, -1px); filter: hue-rotate(270deg); opacity: 0.8; }
          40% { transform: translate(1px, 1px); filter: hue-rotate(360deg); }
          50% { transform: translate(-2px, 0); filter: hue-rotate(45deg); opacity: 0.9; }
          55% { opacity: 0.9; }
        }
        @keyframes galaxy-rotate {
          0% { filter: hue-rotate(0deg); }
          100% { filter: hue-rotate(360deg); }
        }
        @keyframes rgb-rotate {
          0% { filter: hue-rotate(0deg) brightness(1); }
          50% { filter: hue-rotate(180deg) brightness(1.2); }
          100% { filter: hue-rotate(360deg) brightness(1); }
        }
        @keyframes legendary-crown {
          0%, 100% { 
            box-shadow: 0 0 30px #ffd700, 0 0 60px #ff8c00, 0 0 90px #ff4500;
            filter: brightness(1) saturate(1);
          }
          25% { 
            box-shadow: 0 0 40px #fff, 0 0 70px #ffd700, 0 0 100px #ff8c00;
            filter: brightness(1.3) saturate(1.2);
          }
          50% { 
            box-shadow: 0 0 50px #ffd700, 0 0 80px #fff, 0 0 110px #ffd700;
            filter: brightness(1.5) saturate(1);
          }
          75% { 
            box-shadow: 0 0 35px #ff8c00, 0 0 65px #ffd700, 0 0 95px #fff;
            filter: brightness(1.2) saturate(1.3);
          }
        }
        @keyframes void-pulse {
          0%, 100% { 
            box-shadow: 0 0 30px #000, 0 0 50px #1a0033, 0 0 70px #330066, inset 0 0 20px #000;
            filter: brightness(0.8);
          }
          50% { 
            box-shadow: 0 0 40px #1a0033, 0 0 70px #330066, 0 0 100px #4a0080, inset 0 0 30px #1a0033;
            filter: brightness(1);
          }
        }
        @keyframes holo-shift {
          0% { filter: hue-rotate(0deg) brightness(1.1); }
          25% { filter: hue-rotate(90deg) brightness(1.3); }
          50% { filter: hue-rotate(180deg) brightness(1.1); }
          75% { filter: hue-rotate(270deg) brightness(1.3); }
          100% { filter: hue-rotate(360deg) brightness(1.1); }
        }
        @keyframes celestial-glow {
          0%, 100% { 
            box-shadow: 0 0 40px #ffd700, 0 0 80px #fff, 0 0 120px #ffd700;
            filter: brightness(1) saturate(1);
          }
          25% { 
            box-shadow: 0 0 60px #fff, 0 0 100px #ffd700, 0 0 140px #ffaa00;
            filter: brightness(1.5) saturate(1.2);
          }
          50% { 
            box-shadow: 0 0 80px #ffd700, 0 0 120px #fff, 0 0 160px #ffd700;
            filter: brightness(2) saturate(1);
          }
          75% { 
            box-shadow: 0 0 50px #ffaa00, 0 0 90px #ffd700, 0 0 130px #fff;
            filter: brightness(1.3) saturate(1.3);
          }
        }
        
        @keyframes achievementPop {
          0% { transform: scale(0.5); opacity: 0; }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes badgeShine {
          0% { filter: brightness(1) saturate(1); }
          50% { filter: brightness(1.3) saturate(1.2); }
          100% { filter: brightness(1) saturate(1); }
        }
        @keyframes streakFire {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        * { box-sizing: border-box; }
        input, select, button { font-family: inherit; }
        input::placeholder { color: ${theme.textDim}; }
        select option { background: ${theme.cardBg}; color: ${theme.text}; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${theme.inputBorder}; border-radius: 3px; }
        @media (max-width: 480px) {
          input, select { font-size: 16px !important; }
        }
      `}</style>
      </>
      )}

      {/* Edit Profile Modal - Outside conditional so it works in VAKita too */}
      {showEditProfile && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 200 }} onClick={() => setShowEditProfile(false)}>
          <div style={{ width: '100%', maxWidth: '400px', backgroundColor: theme.cardBg, borderRadius: '12px', border: `1px solid ${theme.cardBorder}`, padding: '24px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: theme.text, margin: 0 }}>Edit Profile</h3>
              <button onClick={() => setShowEditProfile(false)} style={{ width: '32px', height: '32px', backgroundColor: 'transparent', border: 'none', color: theme.textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X style={{ width: '18px', height: '18px' }} />
              </button>
            </div>
            
            {/* Profile Picture Section */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px' }}>
              <div style={{ position: 'relative', marginBottom: '12px' }}>
                <div style={{ 
                  width: '100px', 
                  height: '100px', 
                  borderRadius: '50%', 
                  backgroundColor: profilePicture ? 'transparent' : '#3b82f6', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  color: '#fff', 
                  fontSize: '40px', 
                  fontWeight: '600',
                  overflow: 'hidden',
                  border: currentFrame.border !== 'none' ? currentFrame.border : `3px solid ${theme.cardBorder}`,
                  boxShadow: currentFrame.glow !== 'none' ? currentFrame.glow : 'none'
                }}>
                  {profilePicture ? (
                    <img 
                      src={profilePicture} 
                      alt="Profile" 
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover'
                      }} 
                    />
                  ) : (
                    getInitial(editNickname)
                  )}
                </div>
                
                {/* Camera button overlay */}
                <label style={{
                  position: 'absolute',
                  bottom: '0',
                  right: '0',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: isDark ? '#3b82f6' : '#2563eb',
                  border: `2px solid ${theme.cardBg}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'transform 0.2s'
                }}>
                  {isUploadingPicture ? (
                    <Loader2 style={{ width: '16px', height: '16px', color: '#fff', animation: 'spin 1s linear infinite' }} />
                  ) : (
                    <Camera style={{ width: '16px', height: '16px', color: '#fff' }} />
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureUpload}
                    style={{ display: 'none' }}
                    disabled={isUploadingPicture}
                  />
                </label>
              </div>
              
              {/* Upload/Remove buttons */}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <label style={{
                  fontSize: '13px',
                  color: '#3b82f6',
                  cursor: isUploadingPicture ? 'not-allowed' : 'pointer',
                  opacity: isUploadingPicture ? 0.5 : 1
                }}>
                  {isUploadingPicture ? 'Uploading...' : 'Change Photo'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureUpload}
                    style={{ display: 'none' }}
                    disabled={isUploadingPicture}
                  />
                </label>
                {profilePicture && (
                  <>
                    <span style={{ color: theme.textDim }}>•</span>
                    <button
                      onClick={handleRemoveProfilePicture}
                      style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '13px',
                        color: '#ef4444',
                        cursor: 'pointer',
                        padding: 0
                      }}
                    >
                      Remove
                    </button>
                  </>
                )}
              </div>
              <p style={{ fontSize: '11px', color: theme.textDim, margin: '8px 0 0', textAlign: 'center' }}>
                JPG, PNG or GIF. Max 2MB.
              </p>
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: theme.text, marginBottom: '6px' }}>Nickname</label>
              <input
                type="text"
                value={editNickname}
                onChange={(e) => setEditNickname(e.target.value)}
                style={{ width: '100%', height: '44px', backgroundColor: theme.inputBg, border: `1px solid ${theme.inputBorder}`, borderRadius: '8px', padding: '0 12px', fontSize: '16px', color: theme.text, outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: theme.text, marginBottom: '6px' }}>Email</label>
              <input
                type="email"
                value={user.email}
                disabled
                style={{ width: '100%', height: '44px', backgroundColor: theme.statBg, border: `1px solid ${theme.inputBorder}`, borderRadius: '8px', padding: '0 12px', fontSize: '16px', color: theme.textMuted, outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <button
              onClick={async () => {
                try {
                  const { error } = await supabase.auth.updateUser({ data: { nickname: editNickname } });
                  if (error) throw error;
                  setShowEditProfile(false);
                  showToast('Profile updated successfully!', 'success');
                } catch (e) {
                  showToast('Failed to update profile', 'error');
                }
              }}
              style={{ width: '100%', height: '44px', backgroundColor: isDark ? '#fafafa' : '#18181b', color: isDark ? '#18181b' : '#fafafa', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '500', cursor: 'pointer' }}
            >
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* Feedback Modal - Outside conditional so it works in VAKita too */}
      {showFeedback && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 200 }} onClick={() => setShowFeedback(false)}>
          <div style={{ width: '100%', maxWidth: '450px', backgroundColor: theme.cardBg, borderRadius: '12px', border: `1px solid ${theme.cardBorder}`, padding: '24px' }} onClick={(e) => e.stopPropagation()}>
            {feedbackSent ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <Check style={{ width: '32px', height: '32px', color: '#fff' }} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: theme.text, margin: '0 0 8px' }}>Thank You!</h3>
                <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0 }}>Your feedback has been submitted.</p>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: theme.text, margin: 0 }}>Send Feedback</h3>
                  <button onClick={() => setShowFeedback(false)} style={{ width: '32px', height: '32px', backgroundColor: 'transparent', border: 'none', color: theme.textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <X style={{ width: '18px', height: '18px' }} />
                  </button>
                </div>
                <p style={{ fontSize: '14px', color: theme.textMuted, margin: '0 0 16px' }}>We'd love to hear your thoughts, suggestions, or issues.</p>
                <textarea
                  value={feedbackMessage}
                  onChange={(e) => setFeedbackMessage(e.target.value)}
                  placeholder="Write your feedback here..."
                  style={{ width: '100%', height: '120px', backgroundColor: theme.inputBg, border: `1px solid ${theme.inputBorder}`, borderRadius: '8px', padding: '12px', fontSize: '14px', color: theme.text, outline: 'none', boxSizing: 'border-box', resize: 'none', fontFamily: 'inherit' }}
                />
                <button
                  onClick={handleSubmitFeedback}
                  disabled={!feedbackMessage.trim()}
                  style={{ width: '100%', height: '44px', backgroundColor: isDark ? '#fafafa' : '#18181b', color: isDark ? '#18181b' : '#fafafa', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '500', cursor: feedbackMessage.trim() ? 'pointer' : 'not-allowed', marginTop: '16px', opacity: feedbackMessage.trim() ? 1 : 0.5 }}
                >
                  Submit Feedback
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Rewards Modal */}
      {showRewardsModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 60 }} onClick={() => setShowRewardsModal(false)}>
          <div style={{ width: '100%', maxWidth: '500px', backgroundColor: theme.cardBg, borderRadius: '12px', border: `1px solid ${theme.cardBorder}`, overflow: 'hidden', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '20px', borderBottom: `1px solid ${theme.cardBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: theme.text, margin: 0 }}>Level & Rewards</h3>
                <p style={{ fontSize: '13px', color: theme.textMuted, margin: '4px 0 0' }}>Track your progress and unlock frames</p>
              </div>
              <button onClick={() => setShowRewardsModal(false)} style={{ width: '32px', height: '32px', backgroundColor: 'transparent', border: `1px solid ${theme.inputBorder}`, borderRadius: '6px', color: theme.textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X style={{ width: '16px', height: '16px' }} />
              </button>
            </div>
            
            <div style={{ padding: '20px', overflowY: 'auto' }}>
              {/* Current Level */}
              <div style={{ 
                padding: '20px', 
                background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', 
                borderRadius: '12px', 
                marginBottom: '20px',
                color: '#fff',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  margin: '0 auto 12px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  fontWeight: '700'
                }}>
                  {currentLevel}
                </div>
                <h4 style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 4px' }}>Level {currentLevel}</h4>
                <p style={{ fontSize: '14px', opacity: 0.9, margin: '0 0 16px' }}>{userXP} / {nextLevelXP} XP</p>
                <div style={{
                  height: '10px',
                  backgroundColor: 'rgba(255,255,255,0.3)',
                  borderRadius: '5px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${levelProgress}%`,
                    backgroundColor: '#fff',
                    borderRadius: '5px',
                    transition: 'width 0.3s ease'
                  }} />
                </div>
                <p style={{ fontSize: '12px', opacity: 0.8, margin: '8px 0 0' }}>
                  {Math.ceil(nextLevelXP - userXP)} XP to Level {currentLevel + 1}
                </p>
              </div>
              
              {/* Daily Check-In Section */}
              <div style={{ 
                padding: '16px', 
                backgroundColor: checkedInToday ? (isDark ? '#14532d' : '#dcfce7') : theme.statBg,
                borderRadius: '12px', 
                marginBottom: '20px',
                border: `1px solid ${checkedInToday ? '#22c55e' : theme.cardBorder}`
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      backgroundColor: checkedInToday ? '#22c55e' : (isDark ? '#7c2d12' : '#ffedd5'),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {checkedInToday ? (
                        <Check style={{ width: '24px', height: '24px', color: '#fff' }} />
                      ) : (
                        <Flame style={{ width: '24px', height: '24px', color: '#f97316' }} />
                      )}
                    </div>
                    <div>
                      <h4 style={{ fontSize: '15px', fontWeight: '600', color: theme.text, margin: 0 }}>
                        {checkedInToday ? 'Checked In!' : 'Daily Check-In'}
                      </h4>
                      <p style={{ fontSize: '12px', color: theme.textMuted, margin: '2px 0 0' }}>
                        {checkedInToday 
                          ? `🔥 ${currentStreak} day streak` 
                          : currentStreak > 0 
                            ? `Continue your ${currentStreak} day streak!`
                            : 'Start your streak today!'
                        }
                      </p>
                    </div>
                  </div>
                  
                  {!checkedInToday && (
                    <button
                      onClick={handleDailyCheckIn}
                      style={{
                        padding: '10px 20px',
                        backgroundColor: '#f97316',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      <Flame style={{ width: '14px', height: '14px' }} />
                      Check In
                    </button>
                  )}
                </div>
                
                {/* Streak bonus info */}
                {currentStreak > 0 && currentStreak % 7 !== 0 && (
                  <div style={{ 
                    marginTop: '12px', 
                    padding: '8px 12px', 
                    backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.05)', 
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <Gift style={{ width: '14px', height: '14px', color: '#f59e0b' }} />
                    <span style={{ fontSize: '11px', color: theme.textMuted }}>
                      {7 - (currentStreak % 7)} days until +{XP_CONFIG.weekStreak} XP bonus!
                    </span>
                  </div>
                )}
              </div>
              
              {/* XP Rewards Info */}
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '600', color: theme.text, margin: '0 0 12px' }}>How to Earn XP</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {[
                    { action: 'Add entry', xp: '+10 XP' },
                    { action: 'With receipt', xp: '+20 XP' },
                    { action: 'With notes', xp: '+5 XP' },
                    { action: 'Set budget', xp: '+15 XP' },
                    { action: '10 entries', xp: '+100 XP' },
                    { action: '50 entries', xp: '+250 XP' },
                  ].map((item, i) => (
                    <div key={i} style={{ 
                      padding: '8px 12px', 
                      backgroundColor: theme.statBg, 
                      borderRadius: '6px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span style={{ fontSize: '12px', color: theme.textMuted }}>{item.action}</span>
                      <span style={{ fontSize: '12px', fontWeight: '600', color: '#22c55e' }}>{item.xp}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Profile Frames */}
              <h4 style={{ fontSize: '14px', fontWeight: '600', color: theme.text, margin: '0 0 12px' }}>Profile Frames</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                {PROFILE_FRAMES.map((frame) => {
                  const isUnlocked = currentLevel >= frame.level;
                  const isSelected = selectedFrame === frame.id;
                  return (
                    <div 
                      key={frame.id}
                      onClick={() => isUnlocked && setSelectedFrame(frame.id)}
                      style={{ 
                        padding: '12px',
                        backgroundColor: isSelected ? (isDark ? '#1e3a5f' : '#dbeafe') : theme.statBg,
                        borderRadius: '10px',
                        border: isSelected ? '2px solid #3b82f6' : `1px solid ${theme.cardBorder}`,
                        cursor: isUnlocked ? 'pointer' : 'not-allowed',
                        opacity: isUnlocked ? 1 : 0.5,
                        transition: 'all 0.15s',
                        textAlign: 'center'
                      }}
                    >
                      {/* Animated Frame Preview */}
                      <div style={{
                        width: '56px',
                        height: '56px',
                        margin: '0 auto 8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <div style={{
                          ...getAnimatedFrameStyle(frame, 50),
                          border: frame.gradient ? 'none' : (frame.border !== 'none' ? frame.border : `2px solid ${theme.cardBorder}`),
                          backgroundColor: frame.gradient ? undefined : 'transparent',
                          opacity: isUnlocked ? 1 : 0.5,
                        }}>
                          <div style={{
                            ...getAvatarInnerStyle(frame, 50, isDark ? '#27272a' : '#e4e4e7'),
                          }}>
                            {isUnlocked ? (
                              profilePicture ? (
                                <img src={profilePicture} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                              ) : (
                                <span style={{ fontSize: '16px' }}>👤</span>
                              )
                            ) : (
                              <span style={{ fontSize: '14px' }}>🔒</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <p style={{ fontSize: '11px', fontWeight: '600', color: theme.text, margin: '0 0 2px' }}>{frame.name}</p>
                      <p style={{ fontSize: '9px', color: isUnlocked ? '#22c55e' : theme.textMuted, margin: 0 }}>
                        {isUnlocked ? (isSelected ? '✓ Equipped' : 'Click to equip') : `Lvl ${frame.level}`}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

 {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          padding: '14px 20px',
          backgroundColor: toast.type === 'success' ? '#10b981' : toast.type === 'error' ? '#ef4444' : '#3b82f6',
          color: '#fff',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          zIndex: 100,
          animation: 'slideIn 0.3s ease',
          maxWidth: '350px'
        }}>
          {toast.type === 'success' ? (
            <Check style={{ width: '18px', height: '18px', flexShrink: 0 }} />
          ) : (
            <AlertCircle style={{ width: '18px', height: '18px', flexShrink: 0 }} />
          )}
          <span style={{ fontSize: '14px', fontWeight: '500' }}>{toast.message}</span>
          <button 
            onClick={() => setToast(null)}
            style={{ 
              marginLeft: 'auto',
              background: 'none', 
              border: 'none', 
              color: '#fff', 
              cursor: 'pointer',
              padding: '0',
              display: 'flex',
              opacity: 0.8
            }}
          >
            <X style={{ width: '16px', height: '16px' }} />
          </button>
        </div>
      )}
      {/* Achievements Modal */}
      {showAchievementsModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 60 }} onClick={() => setShowAchievementsModal(false)}>
          <div style={{ width: '100%', maxWidth: '600px', backgroundColor: theme.cardBg, borderRadius: '16px', border: `1px solid ${theme.cardBorder}`, overflow: 'hidden', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }} onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div style={{ padding: '20px 24px', borderBottom: `1px solid ${theme.cardBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: '700', color: theme.text, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span>🏆</span> Achievements
                </h3>
                <p style={{ fontSize: '14px', color: theme.textMuted, margin: '4px 0 0' }}>
                  {unlockedAchievements.length} / {ACHIEVEMENTS.length} unlocked
                </p>
              </div>
              <button onClick={() => setShowAchievementsModal(false)} style={{ width: '36px', height: '36px', backgroundColor: 'transparent', border: `1px solid ${theme.inputBorder}`, borderRadius: '8px', color: theme.textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X style={{ width: '18px', height: '18px' }} />
              </button>
            </div>
            
            {/* Streak & Challenge Section */}
            <div style={{ padding: '16px 24px', borderBottom: `1px solid ${theme.cardBorder}`, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {/* Current Streak */}
              <div style={{ 
                padding: '16px', 
                background: isDark ? 'linear-gradient(135deg, #7c2d12, #9a3412)' : 'linear-gradient(135deg, #fed7aa, #fdba74)', 
                borderRadius: '12px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '32px', marginBottom: '4px' }}>🔥</div>
                <p style={{ fontSize: '28px', fontWeight: '700', color: isDark ? '#fff' : '#9a3412', margin: '0' }}>{currentStreak}</p>
                <p style={{ fontSize: '12px', color: isDark ? '#fed7aa' : '#c2410c', margin: '4px 0 0', fontWeight: '500' }}>Day Streak</p>
              </div>
              
              {/* Weekly Challenge */}
              <div style={{ 
                padding: '16px', 
                background: weeklyChallenge.completed 
                  ? (isDark ? 'linear-gradient(135deg, #14532d, #166534)' : 'linear-gradient(135deg, #bbf7d0, #86efac)')
                  : (isDark ? 'linear-gradient(135deg, #1e3a5f, #1e40af)' : 'linear-gradient(135deg, #dbeafe, #bfdbfe)'), 
                borderRadius: '12px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '24px', marginBottom: '4px' }}>{weeklyChallenge.icon}</div>
                <p style={{ fontSize: '13px', fontWeight: '600', color: weeklyChallenge.completed ? (isDark ? '#86efac' : '#166534') : (isDark ? '#93c5fd' : '#1e40af'), margin: '0 0 8px' }}>
                  {weeklyChallenge.completed ? '✓ Completed!' : weeklyChallenge.name}
                </p>
                {!weeklyChallenge.completed && (
                  <div style={{
                    height: '6px',
                    backgroundColor: 'rgba(255,255,255,0.3)',
                    borderRadius: '3px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${Math.min((weeklyChallenge.progress / (weeklyChallenge.count || weeklyChallenge.maxAmount || 1)) * 100, 100)}%`,
                      backgroundColor: '#fff',
                      borderRadius: '3px'
                    }} />
                  </div>
                )}
                <p style={{ fontSize: '10px', color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.5)', margin: '6px 0 0' }}>
                  +{weeklyChallenge.xpReward} XP
                </p>
              </div>
            </div>
            
            {/* Achievements List */}
            <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>
              {Object.entries(ACHIEVEMENT_CATEGORIES).map(([catKey, category]) => {
                const categoryAchievements = ACHIEVEMENTS.filter(a => a.category === catKey);
                const unlockedInCategory = categoryAchievements.filter(a => unlockedAchievements.includes(a.id)).length;
                
                return (
                  <div key={catKey} style={{ marginBottom: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                      <span style={{ fontSize: '20px' }}>{category.icon}</span>
                      <h4 style={{ fontSize: '16px', fontWeight: '600', color: theme.text, margin: 0 }}>{category.name}</h4>
                      <span style={{ fontSize: '12px', color: theme.textMuted, marginLeft: 'auto' }}>
                        {unlockedInCategory}/{categoryAchievements.length}
                      </span>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '10px' }}>
                      {categoryAchievements.map(achievement => {
                        const isUnlocked = unlockedAchievements.includes(achievement.id);
                        const tier = getTierStyle(achievement.tier);
                        
                        return (
                          <div
                            key={achievement.id}
                            style={{
                              padding: '14px',
                              backgroundColor: isUnlocked ? (isDark ? '#1a1a1d' : '#fafafa') : theme.statBg,
                              borderRadius: '12px',
                              border: isUnlocked ? `2px solid ${tier.color}` : `1px solid ${theme.cardBorder}`,
                              opacity: isUnlocked ? 1 : 0.6,
                              position: 'relative',
                              overflow: 'hidden'
                            }}
                          >
                            {/* Glow effect for unlocked */}
                            {isUnlocked && (
                              <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '3px',
                                background: tier.bgGradient
                              }} />
                            )}
                            
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                              <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '10px',
                                background: isUnlocked ? tier.bgGradient : (isDark ? '#27272a' : '#e4e4e7'),
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                              }}>
                                <span style={{ fontSize: '20px', filter: isUnlocked ? 'none' : 'grayscale(100%)' }}>
                                  {isUnlocked ? achievement.icon : '🔒'}
                                </span>
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{ 
                                  fontSize: '13px', 
                                  fontWeight: '600', 
                                  color: isUnlocked ? theme.text : theme.textMuted, 
                                  margin: '0 0 2px',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap'
                                }}>
                                  {achievement.name}
                                </p>
                                <p style={{ 
                                  fontSize: '11px', 
                                  color: theme.textMuted, 
                                  margin: 0,
                                  lineHeight: '1.3'
                                }}>
                                  {achievement.description}
                                </p>
                                {isUnlocked && (
                                  <span style={{
                                    display: 'inline-block',
                                    marginTop: '6px',
                                    padding: '2px 8px',
                                    borderRadius: '10px',
                                    background: tier.bgGradient,
                                    fontSize: '9px',
                                    fontWeight: '700',
                                    color: '#fff',
                                    textTransform: 'uppercase'
                                  }}>
                                    {tier.name}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      </SidebarInset>
    </SidebarProvider>
    </div>
  );
};

// ============================================
// MAIN APP CONTENT (with routing logic)
// ============================================
function AppContent() {
  const [user, setUser] = useState(null);
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true;
  });
  const [loading, setLoading] = useState(true);
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check for existing session on load
  useEffect(() => {
    // Check URL hash for recovery token BEFORE Supabase processes it
    const hash = window.location.hash;
    if (hash && hash.includes('type=recovery')) {
      console.log('Recovery mode detected in URL');
      setIsPasswordRecovery(true);
      sessionStorage.setItem('passwordRecovery', 'true');
    }
    
    // Also check if we already set recovery mode
    if (sessionStorage.getItem('passwordRecovery') === 'true') {
      setIsPasswordRecovery(true);
    }
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      // If in recovery mode, don't set user as logged in for main app
      if (sessionStorage.getItem('passwordRecovery') === 'true') {
        setLoading(false);
        return;
      }
      
      if (session?.user) {
        const isAdmin = localStorage.getItem('isAdmin') === 'true';
        setUser(isAdmin ? { ...session.user, isAdmin: true } : session.user);
      } else {
        localStorage.removeItem('isAdmin');
        setUser(null);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth event:', event);
      
      // Handle password recovery event
      if (event === 'PASSWORD_RECOVERY') {
        console.log('PASSWORD_RECOVERY event fired');
        setIsPasswordRecovery(true);
        sessionStorage.setItem('passwordRecovery', 'true');
        return;
      }
      
      // If in recovery mode, don't update user state
      if (sessionStorage.getItem('passwordRecovery') === 'true') {
        return;
      }
      
      if (session?.user) {
        const isAdmin = localStorage.getItem('isAdmin') === 'true';
        setUser(isAdmin ? { ...session.user, isAdmin: true } : session.user);
      } else {
        localStorage.removeItem('isAdmin');
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Save theme preference
  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  // Apply dark class to document root for shadcn/ui compatibility
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);
  
  const handleLogin = (userData) => {
    if (userData.isAdmin) {
      localStorage.setItem('isAdmin', 'true');
    } else {
      localStorage.removeItem('isAdmin');
    }
    setUser(userData);
    navigate('/');
  };

  const handleLogout = async () => {
    localStorage.removeItem('isAdmin');
    if (user?.isAdmin) {
      setUser(null);
      navigate('/');
      return;
    }
    await supabase.auth.signOut();
    setUser(null);
    navigate('/');
  };

  const handleNavigate = (page) => {
    switch(page) {
      case 'home':
        navigate('/');
        break;
      case 'login':
        navigate('/login');
        break;
      case 'signup':
        navigate('/signup');
        break;
      case 'privacy':
        navigate('/privacy');
        break;
      case 'terms':
        navigate('/terms');
        break;
      case 'about':
        navigate('/about');
        break;
      default:
        navigate('/');
    }
  };

  // Show loading screen
  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: isDark ? '#0a0a0b' : '#f4f4f5', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <Loader2 style={{ width: '32px', height: '32px', color: isDark ? '#71717a' : '#a1a1aa', animation: 'spin 1s linear infinite' }} />
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Password Recovery Mode - show reset page regardless of auth state
  if (isPasswordRecovery) {
    return <ResetPassword 
      isDark={isDark} 
      setIsDark={setIsDark} 
      onComplete={() => {
        // Clear recovery mode when password is reset
        sessionStorage.removeItem('passwordRecovery');
        setIsPasswordRecovery(false);
        setUser(null);
      }}
    />;
  }
  
  // Admin Dashboard
  if (user?.isAdmin) {
    return <AdminDashboard onLogout={handleLogout} isDark={isDark} setIsDark={setIsDark} />;
  }

  // User Dashboard  
  if (user) {
    return <ExpenseTrackerApp user={user} onLogout={handleLogout} isDark={isDark} setIsDark={setIsDark} />;
  }

  // Public routes
  return (
    <Routes>
      <Route path="/" element={<HomePage onNavigate={handleNavigate} isDark={isDark} setIsDark={setIsDark} />} />
      <Route path="/login" element={<LoginPage onLogin={handleLogin} onBack={() => navigate('/')} isDark={isDark} setIsDark={setIsDark} initialMode="login" />} />
      <Route path="/signup" element={<LoginPage onLogin={handleLogin} onBack={() => navigate('/')} isDark={isDark} setIsDark={setIsDark} initialMode="signup" />} />
      <Route path="/reset-password" element={<ResetPassword isDark={isDark} setIsDark={setIsDark} />} />
      <Route path="/privacy" element={<PrivacyPolicy onBack={() => navigate('/')} onNavigate={handleNavigate} isDark={isDark} />} />
      <Route path="/terms" element={<TermsOfService onBack={() => navigate('/')} onNavigate={handleNavigate} isDark={isDark} />} />
      <Route path="/about" element={<AboutUs onBack={() => navigate('/')} onNavigate={handleNavigate} isDark={isDark} />} />
      {/* Public tool routes - redirect to login */}
      <Route path="/vakita" element={<LoginPage onLogin={handleLogin} onBack={() => navigate('/')} isDark={isDark} setIsDark={setIsDark} initialMode="login" />} />
      <Route path="/taskmanager" element={<LoginPage onLogin={handleLogin} onBack={() => navigate('/')} isDark={isDark} setIsDark={setIsDark} initialMode="login" />} />
      <Route path="/pdfeditor" element={<PDFEditor isDark={isDark} />} />
      <Route path="/bgremover" element={<BackgroundRemover isDark={isDark} />} />
      <Route path="/imagecropper" element={<ImageCropper isDark={isDark} />} />
      <Route path="/imageconverter" element={<ImageConverter isDark={isDark} />} />
      <Route path="/imagecompressor" element={<ImageCompressor isDark={isDark} />} />
      <Route path="/imageresizer" element={<ImageResizer isDark={isDark} />} />
      <Route path="/qrgenerator" element={<QRGenerator isDark={isDark} />} />
      <Route path="/colorpicker" element={<ColorPicker isDark={isDark} />} />
      <Route path="/imagetotext" element={<ImageToText isDark={isDark} />} />
      <Route path="/pdfmerge" element={<PDFMerge isDark={isDark} />} />
      <Route path="/pdfsplit" element={<PDFSplit isDark={isDark} />} />
      <Route path="/imagetopdf" element={<ImageToPDF isDark={isDark} />} />
      <Route path="/videocompressor" element={<VideoCompressor isDark={isDark} />} />
      <Route path="/videotrimmer" element={<VideoTrimmer isDark={isDark} />} />
      <Route path="*" element={<HomePage onNavigate={handleNavigate} isDark={isDark} setIsDark={setIsDark} />} />
    </Routes>
  );
}

// ============================================
// MAIN EXPORT WITH BROWSER ROUTER
// ============================================
export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
