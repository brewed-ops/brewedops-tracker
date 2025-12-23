import React, { useState, useEffect, useRef } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, LineChart, Line, AreaChart, Area } from 'recharts';
import { Upload, FileText, Users, MessageSquare, AlertTriangle, Plus, LogOut, Eye, Trash2, X, Loader2, Download, Check, Search, ChevronDown, AlertCircle, Moon, Sun, Receipt, Menu, Banknote, TrendingUp, TrendingDown, DollarSign, CreditCard, Wallet, PiggyBank, ArrowUpRight, ArrowDownRight, Bell, Edit, Star, Gift, Snowflake, TreePine, Camera } from 'lucide-react';
import { supabase } from './lib/supabase';

// ============================================
// CONSTANTS
// ============================================

const CATEGORIES = [
  { value: 'utilities', label: 'Utilities', color: '#3b82f6' },
  { value: 'subscription', label: 'Subscription', color: '#8b5cf6' },
  { value: 'food', label: 'Food', color: '#f97316' },
  { value: 'shopping', label: 'Shopping', color: '#ec4899' },
  { value: 'healthcare', label: 'Healthcare', color: '#10b981' },
  { value: 'entertainment', label: 'Entertainment', color: '#f59e0b' },
  { value: 'other', label: 'Other', color: '#71717a' },
];

const CURRENCIES = [
  { symbol: '₱', label: 'PHP (₱)' },
  { symbol: '$', label: 'USD ($)' },
  { symbol: '€', label: 'EUR (€)' },
  { symbol: '£', label: 'GBP (£)' },
  { symbol: '¥', label: 'JPY (¥)' },
  { symbol: '₹', label: 'INR (₹)' },
];

// XP System Configuration
const XP_CONFIG = {
  addEntry: 10,
  addEntryWithReceipt: 20,
  addEntryWithNotes: 5,
  deleteEntry: -5,
  setBudget: 15,
  dailyLogin: 5,
  weekStreak: 50,
  first10Entries: 100,
  first50Entries: 250,
  first100Entries: 500,
};

// Level thresholds - XP needed to reach each level
const LEVEL_THRESHOLDS = [
  0,      // Level 1: 0 XP
  100,    // Level 2: 100 XP
  250,    // Level 3: 250 XP
  500,    // Level 4: 500 XP
  800,    // Level 5: 800 XP
  1200,   // Level 6: 1200 XP
  1700,   // Level 7: 1700 XP
  2300,   // Level 8: 2300 XP
  3000,   // Level 9: 3000 XP
  4000,   // Level 10: 4000 XP
  5500,   // Level 11+: continues pattern
  7500,
  10000,
  13000,
  17000,
  22000,
  28000,
  35000,
  45000,
  60000,
];

// Profile frame rewards - unlocked at specific levels
const PROFILE_FRAMES = [
  { level: 1, id: 'none', name: 'No Frame', border: 'none', glow: 'none' },
  { level: 2, id: 'bronze', name: 'Bronze Ring', border: '3px solid #cd7f32', glow: '0 0 8px #cd7f32' },
  { level: 3, id: 'silver', name: 'Silver Ring', border: '3px solid #c0c0c0', glow: '0 0 10px #c0c0c0' },
  { level: 5, id: 'gold', name: 'Golden Aura', border: '3px solid #ffd700', glow: '0 0 12px #ffd700' },
  { level: 7, id: 'emerald', name: 'Emerald Glow', border: '3px solid #50c878', glow: '0 0 14px #50c878' },
  { level: 10, id: 'diamond', name: 'Diamond Shine', border: '3px solid #b9f2ff', glow: '0 0 16px #b9f2ff, 0 0 24px #87ceeb' },
  { level: 12, id: 'ruby', name: 'Ruby Blaze', border: '3px solid #e0115f', glow: '0 0 14px #e0115f, 0 0 20px #ff6b6b' },
  { level: 15, id: 'cosmic', name: 'Cosmic Ring', border: '3px solid #9d4edd', glow: '0 0 16px #9d4edd, 0 0 24px #c77dff' },
  { level: 18, id: 'rainbow', name: 'Rainbow Pulse', border: '3px solid transparent', glow: '0 0 20px #ff0000, 0 0 20px #00ff00, 0 0 20px #0000ff', animation: 'rainbow-border' },
  { level: 20, id: 'legendary', name: 'Legendary Crown', border: '4px solid #ffd700', glow: '0 0 20px #ffd700, 0 0 30px #ff8c00, 0 0 40px #ff4500', animation: 'legendary-pulse' },
];

// Helper function to calculate level from XP
const calculateLevel = (xp) => {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) {
      return i + 1;
    }
  }
  return 1;
};

// Helper function to get XP needed for next level
const getXPForNextLevel = (currentLevel) => {
  if (currentLevel >= LEVEL_THRESHOLDS.length) {
    const lastThreshold = LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
    const extraLevels = currentLevel - LEVEL_THRESHOLDS.length;
    return Math.floor(lastThreshold * Math.pow(1.3, extraLevels + 1));
  }
  return LEVEL_THRESHOLDS[currentLevel];
};

// Helper function to get current level progress percentage
const getLevelProgress = (xp) => {
  const level = calculateLevel(xp);
  const currentLevelXP = LEVEL_THRESHOLDS[level - 1] || 0;
  const nextLevelXP = getXPForNextLevel(level);
  const progress = ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
  return Math.min(Math.max(progress, 0), 100);
};

// Helper function to get unlocked frames for a level
const getUnlockedFrames = (level) => {
  return PROFILE_FRAMES.filter(frame => frame.level <= level);
};

// Helper function to get frame by ID
const getFrameById = (frameId) => {
  return PROFILE_FRAMES.find(f => f.id === frameId) || PROFILE_FRAMES[0];
};

// Admin credentials


// Badge colors for light and dark mode
const getBadgeStyle = (type, isDark) => {
  const darkStyles = {
    utilities: { bg: '#1e3a5f', color: '#60a5fa', border: '#2563eb' },
    subscription: { bg: '#3b1f5e', color: '#a78bfa', border: '#7c3aed' },
    food: { bg: '#4a2c17', color: '#fb923c', border: '#ea580c' },
    shopping: { bg: '#4a1d3d', color: '#f472b6', border: '#db2777' },
    healthcare: { bg: '#134e3a', color: '#34d399', border: '#059669' },
    entertainment: { bg: '#4a3517', color: '#fbbf24', border: '#d97706' },
    other: { bg: '#27272a', color: '#a1a1aa', border: '#52525b' },
  };
  const lightStyles = {
    utilities: { bg: '#dbeafe', color: '#1d4ed8', border: '#93c5fd' },
    subscription: { bg: '#ede9fe', color: '#6d28d9', border: '#c4b5fd' },
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
// THEME HOOK
// ============================================
const getTheme = (isDark) => ({
  bg: isDark ? '#0a0a0b' : '#f4f4f5',
  cardBg: isDark ? '#18181b' : '#ffffff',
  cardBorder: isDark ? '#27272a' : '#e4e4e7',
  inputBg: isDark ? '#27272a' : '#ffffff',
  inputBorder: isDark ? '#3f3f46' : '#d4d4d8',
  text: isDark ? '#fafafa' : '#18181b',
  textMuted: isDark ? '#a1a1aa' : '#71717a',
  textSubtle: isDark ? '#71717a' : '#a1a1aa',
  textDim: isDark ? '#52525b' : '#d4d4d8',
  statBg: isDark ? '#27272a' : '#f4f4f5',
  toggleBg: isDark ? '#27272a' : '#e4e4e7',
  toggleActive: isDark ? '#3f3f46' : '#ffffff',
  barColor: isDark ? '#71717a' : '#a1a1aa',
});

// ============================================
// RESPONSIVE HOOK
// ============================================
const useWindowSize = () => {
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  
  useEffect(() => {
    const handleResize = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return size;
};

// ============================================
// FORMAT AMOUNT WITH COMMAS
// ============================================
const formatAmount = (amount) => {
  return amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// ============================================
// HOME PAGE (Landing) - shadcn inspired
// ============================================

const HomePage = ({ onNavigate, isDark, setIsDark }) => {
  const theme = getTheme(isDark);
  const { width } = useWindowSize();
  const isMobile = width < 768;
  const isSmall = width < 480;

  const features = [
    { Icon: Upload, title: 'Smart Receipt Scanning', desc: 'Upload receipts and let AI extract the details automatically' },
    { Icon: FileText, title: 'Smart Categories', desc: 'Organize expenses by utilities, food, shopping & more' },
    { Icon: Check, title: 'Cloud Sync', desc: 'Your data is securely stored and accessible anywhere' },
  ];

  // shadcn-style button
  const buttonPrimary = {
    height: '40px',
    padding: '0 16px',
    backgroundColor: isDark ? '#fafafa' : '#18181b',
    color: isDark ? '#18181b' : '#fafafa',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'opacity 0.2s'
  };

  const buttonOutline = {
    height: '40px',
    width: '40px',
    padding: '0',
    backgroundColor: 'transparent',
    border: `1px solid ${theme.cardBorder}`,
    borderRadius: '6px',
    color: theme.textMuted,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s, border-color 0.2s'
  };

  // shadcn-style card
  const cardStyle = {
    backgroundColor: theme.cardBg,
    borderRadius: '12px',
    border: `1px solid ${theme.cardBorder}`,
    padding: isSmall ? '12px' : '20px',
    overflow: 'hidden',
    boxSizing: 'border-box'
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: theme.bg }}>
      {/* Navigation - Full Width Container */}
      <div style={{
        borderBottom: `1px solid ${theme.cardBorder}`,
        backgroundColor: theme.bg
      }}>
        <nav style={{
          padding: isSmall ? '12px 16px' : '16px 48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              overflow: 'hidden'
            }}>
              <img src="https://i.imgur.com/R52jwPv.png" alt="BrewedOps Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <span style={{ fontSize: '16px', fontWeight: '600', color: theme.text }}>BrewedOps</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button onClick={() => setIsDark(!isDark)} style={buttonOutline}>
              {isDark ? <Sun style={{ width: '16px', height: '16px' }} /> : <Moon style={{ width: '16px', height: '16px' }} />}
            </button>
            <button onClick={() => onNavigate('login')} style={buttonPrimary}>
              Login
            </button>
          </div>
        </nav>
      </div>

      {/* Hero Section */}
      <section style={{
        padding: isSmall ? '48px 16px 64px' : '80px 24px 96px',
        maxWidth: '800px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          backgroundColor: isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.08)',
          border: `1px solid ${isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.15)'}`,
          borderRadius: '9999px',
          marginBottom: '24px'
        }}>
          <span style={{ fontSize: '12px', color: '#3b82f6', fontWeight: '500' }}>✨ Smart Expense Tracking</span>
        </div>
        
        <h1 style={{
          fontSize: isSmall ? '36px' : isMobile ? '48px' : '60px',
          fontWeight: '700',
          color: theme.text,
          margin: '0 0 16px',
          lineHeight: '1.1',
          letterSpacing: '-0.025em'
        }}>
          Track Every Peso,<br />
          <span style={{
            background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>Master Your Money</span>
        </h1>
        
        <p style={{
          fontSize: isSmall ? '16px' : '18px',
          color: theme.textMuted,
          maxWidth: '540px',
          margin: '0 auto 32px',
          lineHeight: '1.6'
        }}>
          Effortlessly manage your bills, receipts, and invoices. Upload documents, 
          track expenses by category, and gain insights into your spending.
        </p>
        
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => onNavigate('signup')}
            style={{
              ...buttonPrimary,
              height: '44px',
              padding: '0 24px',
              fontSize: '15px',
              borderRadius: '8px'
            }}
          >
            Get Started
            <span style={{ marginLeft: '4px' }}>→</span>
          </button>
          <button
            onClick={() => onNavigate('login')}
            style={{
              ...buttonOutline,
              width: 'auto',
              height: '44px',
              padding: '0 24px',
              fontSize: '15px',
              fontWeight: '500',
              borderRadius: '8px',
              color: theme.text
            }}
          >
            Sign In
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section style={{
        padding: isSmall ? '48px 16px' : '64px 24px',
        backgroundColor: isDark ? 'rgba(24, 24, 27, 0.5)' : 'rgba(250, 250, 250, 0.5)',
        borderTop: `1px solid ${theme.cardBorder}`,
        borderBottom: `1px solid ${theme.cardBorder}`
      }}>
        <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{
              fontSize: isSmall ? '24px' : '30px',
              fontWeight: '600',
              color: theme.text,
              margin: '0 0 12px',
              letterSpacing: '-0.025em'
            }}>
              Features
            </h2>
            <p style={{
              fontSize: '15px',
              color: theme.textMuted,
              maxWidth: '400px',
              margin: '0 auto'
            }}>
              Everything you need to manage your expenses effectively.
            </p>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: isSmall ? '1fr' : isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
            gap: '16px'
          }}>
            {features.map((feature, i) => (
              <div key={i} style={{ ...cardStyle, textAlign: 'center' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  backgroundColor: isDark ? '#27272a' : '#f4f4f5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                  marginLeft: 'auto',
                  marginRight: 'auto'
                }}>
                  <feature.Icon style={{ width: '20px', height: '20px', color: isDark ? '#a1a1aa' : '#71717a' }} />
                </div>
                <h3 style={{ fontSize: '14px', fontWeight: '600', color: theme.text, margin: '0 0 8px' }}>
                  {feature.title}
                </h3>
                <p style={{ fontSize: '13px', color: theme.textMuted, margin: 0, lineHeight: '1.5' }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{
        padding: isSmall ? '48px 16px' : '64px 24px',
        maxWidth: '900px',
        margin: '0 auto'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{
            fontSize: isSmall ? '24px' : '30px',
            fontWeight: '600',
            color: theme.text,
            margin: '0 0 12px',
            letterSpacing: '-0.025em'
          }}>
            How it works
          </h2>
          <p style={{
            fontSize: '15px',
            color: theme.textMuted
          }}>
            Get started in three simple steps.
          </p>
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: isSmall ? '1fr' : 'repeat(3, 1fr)',
          gap: '24px'
        }}>
          {[
            { step: '1', title: 'Create Account', desc: 'Sign up for free with just your email' },
            { step: '2', title: 'Add Expenses', desc: 'Upload receipts or add entries manually' },
            { step: '3', title: 'Track & Analyze', desc: 'View insights and spending patterns' },
          ].map((item, i) => (
            <div key={i} style={{ ...cardStyle, textAlign: 'center' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.1)',
                border: '2px solid #3b82f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                fontSize: '18px',
                fontWeight: '600',
                color: '#3b82f6'
              }}>
                {item.step}
              </div>
              <h3 style={{ fontSize: '15px', fontWeight: '600', color: theme.text, margin: '0 0 8px' }}>
                {item.title}
              </h3>
              <p style={{ fontSize: '13px', color: theme.textMuted, margin: 0 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: isSmall ? '0 16px 48px' : '0 24px 64px',
        maxWidth: '1600px',
        margin: '0 auto'
      }}>
        <div style={{
          ...cardStyle,
          backgroundColor: isDark ? '#18181b' : '#09090b',
          border: `1px solid ${isDark ? '#27272a' : '#27272a'}`,
          borderRadius: '12px',
          padding: isSmall ? '40px 24px' : '56px 40px',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: isSmall ? '24px' : '28px',
            fontWeight: '600',
            color: '#fafafa',
            margin: '0 0 12px',
            letterSpacing: '-0.025em'
          }}>
            Ready to take control?
          </h2>
          <p style={{
            fontSize: '15px',
            color: '#a1a1aa',
            margin: '0 0 24px',
            maxWidth: '400px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            Join users who trust BrewedOps for expense management.
          </p>
          <button
            onClick={() => onNavigate('signup')}
            style={{
              height: '44px',
              padding: '0 24px',
              backgroundColor: '#fafafa',
              color: '#18181b',
              border: 'none',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Get Started — It's Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: isSmall ? '20px 16px' : '24px',
        borderTop: `1px solid ${theme.cardBorder}`,
        textAlign: 'center'
      }}>
        <p style={{ fontSize: '13px', color: theme.textSubtle, margin: 0 }}>
          © 2025 BrewedOps Tracker by Kenneth V.
        </p>
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
  const [successMessage, setSuccessMessage] = useState('');
  
  const theme = getTheme(isDark);
  const { width } = useWindowSize();
  const isMobile = width < 480;

  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password validation
  const validatePassword = (password) => {
    const issues = [];
    if (password.length < 8) issues.push('At least 8 characters');
    if (!/[A-Z]/.test(password)) issues.push('One uppercase letter');
    if (!/[a-z]/.test(password)) issues.push('One lowercase letter');
    if (!/[0-9]/.test(password)) issues.push('One number');
    return issues;
  };

  const handleSubmit = async () => {
    setLoading(true);
    setErrors({});
    setSuccessMessage('');
     // Check for admin login FIRST
    
    const newErrors = {};

    // Validate email
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
// Validate nickname for signup
if (isSignup && !nickname.trim()) {
  newErrors.nickname = 'Nickname is required';
}

    // Validate password
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (isSignup) {
      const passwordIssues = validatePassword(password);
      if (passwordIssues.length > 0) {
        newErrors.password = `Password needs: ${passwordIssues.join(', ')}`;
      }
    }

    // Validate confirm password for signup
    if (isSignup) {
      if (!confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      if (isSignup) {
        // Signup with Supabase
        const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    data: {
      nickname: nickname.trim()
    }
  }
});
        
        if (error) throw error;
        
        if (data.user && !data.session) {
          setSuccessMessage('Please check your email for a confirmation link to complete your registration.');
          setLoading(false);
        } else if (data.user) {
          setSuccessMessage('Account created successfully!');
          onLogin(data.user);
        }
      } else {
        // Login with Supabase
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (error) throw error;
        const { data: adminData } = await supabase
  .from('admins')
  .select('id')
  .eq('id', data.user.id)
  .single();

if (adminData) {
  onLogin({ ...data.user, isAdmin: true });
} else {
  onLogin(data.user);
}
      }
    } catch (e) {
      setErrors({ general: e.message || 'Something went wrong. Please try again.' });
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setErrors({ email: 'Please enter your email first' });
      return;
    }
    
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      if (error) throw error;
      setSuccessMessage('Password reset email sent! Check your inbox.');
    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setLoading(false);
    }
  };

const switchMode = () => {
  setIsSignup(!isSignup);
  setErrors({});
  setSuccessMessage('');
  setPassword('');
  setConfirmPassword('');
  setNickname('');  // Add this line
};

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: theme.bg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: isMobile ? '12px' : '16px'
    }}>
      {/* Theme toggle in corner */}
      <div style={{
        position: 'absolute',
        top: '12px',
        right: '12px',
        display: 'flex',
        gap: '8px'
      }}>
        <button
          onClick={() => setIsDark(!isDark)}
          style={{
            width: '36px',
            height: '36px',
            backgroundColor: theme.cardBg,
            border: `1px solid ${theme.cardBorder}`,
            borderRadius: '8px',
            color: theme.textMuted,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {isDark ? <Sun style={{ width: '16px', height: '16px' }} /> : <Moon style={{ width: '16px', height: '16px' }} />}
        </button>
      </div>

      {/* Back button */}
      {onBack && (
        <button
          onClick={onBack}
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            height: '36px',
            padding: '0 12px',
            backgroundColor: theme.cardBg,
            border: `1px solid ${theme.cardBorder}`,
            borderRadius: '8px',
            color: theme.textMuted,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '14px'
          }}
        >
          ← Back
        </button>
      )}

      <div style={{
        width: '100%',
        maxWidth: '380px',
        backgroundColor: theme.cardBg,
        borderRadius: '12px',
        border: `1px solid ${theme.cardBorder}`,
        padding: isMobile ? '20px' : '32px'
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: isMobile ? '24px' : '32px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            overflow: 'hidden',
            margin: '0 auto 12px'
          }}>
            <img src="https://i.imgur.com/R52jwPv.png" alt="BrewedOps Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <h1 style={{ fontSize: isMobile ? '18px' : '20px', fontWeight: '600', color: theme.text, margin: '0 0 8px' }}>
            BrewedOps Tracker
          </h1>
          <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0 }}>
            Track your bills, receipts & invoices
          </p>
        </div>

        {/* Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* General Error */}
          {errors.general && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px',
              backgroundColor: isDark ? '#450a0a' : '#fef2f2',
              border: `1px solid ${isDark ? '#7f1d1d' : '#fecaca'}`,
              borderRadius: '8px'
            }}>
              <AlertCircle style={{ width: '16px', height: '16px', color: '#ef4444', flexShrink: 0 }} />
              <span style={{ fontSize: '14px', color: isDark ? '#fca5a5' : '#dc2626' }}>{errors.general}</span>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px',
              backgroundColor: isDark ? '#052e16' : '#f0fdf4',
              border: `1px solid ${isDark ? '#166534' : '#86efac'}`,
              borderRadius: '8px'
            }}>
              <Check style={{ width: '16px', height: '16px', color: '#22c55e', flexShrink: 0 }} />
              <span style={{ fontSize: '14px', color: isDark ? '#86efac' : '#166534' }}>{successMessage}</span>
            </div>
          )}

<div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: theme.text, marginBottom: '6px' }}>
              Email
            </label>
            <input
              type="email"
              placeholder=""
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrors({ ...errors, email: '' }); }}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              style={{
                width: '100%',
                height: '44px',
                backgroundColor: theme.inputBg,
                border: `1px solid ${errors.email ? '#ef4444' : theme.inputBorder}`,
                borderRadius: '8px',
                padding: '0 12px',
                fontSize: '16px',
                color: theme.text,
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
            {errors.email && (
              <p style={{ fontSize: '12px', color: '#ef4444', margin: '4px 0 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <AlertCircle style={{ width: '12px', height: '12px' }} />
                {errors.email}
              </p>
            )}
          </div>

       {/* Nickname - Only for Signup */}
          {isSignup && (
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: theme.text, marginBottom: '6px' }}>
                Nickname
              </label>
              <input
                type="text"
                placeholder=""
                value={nickname}
                onChange={(e) => { setNickname(e.target.value); setErrors({ ...errors, nickname: '' }); }}
                style={{
                  width: '100%',
                  height: '44px',
                  backgroundColor: theme.inputBg,
                  border: `1px solid ${errors.nickname ? '#ef4444' : theme.inputBorder}`,
                  borderRadius: '8px',
                  padding: '0 12px',
                  fontSize: '16px',
                  color: theme.text,
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              {errors.nickname && (
                <p style={{ fontSize: '12px', color: '#ef4444', margin: '4px 0 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <AlertCircle style={{ width: '12px', height: '12px' }} />
                  {errors.nickname}
                </p>
              )}
            </div>
          )}
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: theme.text, marginBottom: '6px' }}>
              Password
            </label>
            <input
              type="password"
              placeholder={isSignup ? 'ex. Sample12!@' : 'Enter your password'}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setErrors({ ...errors, password: '' }); }}
              onKeyDown={(e) => e.key === 'Enter' && !isSignup && handleSubmit()}
              style={{
                width: '100%',
                height: '44px',
                backgroundColor: theme.inputBg,
                border: `1px solid ${errors.password ? '#ef4444' : theme.inputBorder}`,
                borderRadius: '8px',
                padding: '0 12px',
                fontSize: '16px',
                color: theme.text,
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
            {errors.password && (
              <p style={{ fontSize: '12px', color: '#ef4444', margin: '4px 0 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <AlertCircle style={{ width: '12px', height: '12px' }} />
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password - Only for Signup */}
          {isSignup && (
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: theme.text, marginBottom: '6px' }}>
                Confirm Password
              </label>
              <input
                type="password"
                placeholder=""
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setErrors({ ...errors, confirmPassword: '' }); }}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                style={{
                  width: '100%',
                  height: '44px',
                  backgroundColor: theme.inputBg,
                  border: `1px solid ${errors.confirmPassword ? '#ef4444' : theme.inputBorder}`,
                  borderRadius: '8px',
                  padding: '0 12px',
                  fontSize: '16px',
                  color: theme.text,
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              {errors.confirmPassword && (
                <p style={{ fontSize: '12px', color: '#ef4444', margin: '4px 0 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <AlertCircle style={{ width: '12px', height: '12px' }} />
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          )}

         <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: '100%',
              height: '44px',
              backgroundColor: isDark ? '#fafafa' : '#18181b',
              color: isDark ? '#18181b' : '#fafafa',
              border: 'none',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              opacity: loading ? 0.7 : 1,
              marginTop: '4px'
            }}
          >
            {loading ? (
              <>
                <Loader2 style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} />
                {isSignup ? 'Creating Account...' : 'Signing In...'}
              </>
            ) : (
              isSignup ? 'Create Account' : 'Sign In'
            )}
          </button>

          {!isSignup && (
            <button
              onClick={handleForgotPassword}
              disabled={loading}
              style={{
                background: 'none',
                border: 'none',
                color: theme.textMuted,
                fontSize: '13px',
                cursor: loading ? 'not-allowed' : 'pointer',
                textDecoration: 'underline',
                padding: 0,
                marginTop: '8px',
                display: 'block',
                width: '100%',
                textAlign: 'center'
              }}
            >
              Forgot password?
            </button>
          )}

          <p style={{ textAlign: 'center', fontSize: '14px', color: theme.textSubtle }}>
            {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={switchMode}
              style={{
                background: 'none',
                border: 'none',
                color: theme.text,
                fontWeight: '500',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
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
  const isMobile = width < 768;
  const isSmall = width < 480;
  
  // Form states
  const [uploadMode, setUploadMode] = useState('file');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [manualForm, setManualForm] = useState({ name: '', amount: '', date: '', dueDate: '', notes: '', recurring: '' });
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
  
  // XP and Level System
  const [userXP, setUserXP] = useState(() => {
    const saved = localStorage.getItem(`userXP_${user.id}`);
    return saved ? parseInt(saved) : 0;
  });
  const [selectedFrame, setSelectedFrame] = useState(() => {
    const saved = localStorage.getItem(`selectedFrame_${user.id}`);
    return saved || 'none';
  });
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [levelUpData, setLevelUpData] = useState(null);
  const [showRewardsModal, setShowRewardsModal] = useState(false);
  
  // Christmas Theme
  const [isChristmasTheme, setIsChristmasTheme] = useState(() => {
    const saved = localStorage.getItem('christmasTheme');
    return saved === 'true';
  });
  
  // Bulk delete states
  const [selectedEntries, setSelectedEntries] = useState([]);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  const [showClearAllConfirm, setShowClearAllConfirm] = useState(false);
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

  // Save Christmas theme preference
  useEffect(() => {
    localStorage.setItem('christmasTheme', isChristmasTheme.toString());
  }, [isChristmasTheme]);

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
        file: newEntry.file
      };
      
      setEntries(prev => [savedEntry, ...prev]);
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
    setIsSaving(true);
    const newEntry = {
      type: selectedCategory,
      name: manualForm.name,
      amount: parseFloat(manualForm.amount) || 0,
      date: manualForm.date || new Date().toISOString().split('T')[0],
      dueDate: manualForm.dueDate || '',
      notes: manualForm.notes || '',
      recurring: manualForm.recurring || null
    };
    try {
      await saveEntry(newEntry);
      setSelectedCategory('');
      setManualForm({ name: '', amount: '', date: '', dueDate: '', notes: '', recurring: '' });
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
        const headers = lines[0].toLowerCase().split(',').map(h => h.trim().replace(/"/g, ''));
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
          
          entries.push({
            name: row.name || 'Unnamed Entry',
            amount: amount,
            type: category,
            date: row.date || new Date().toISOString().split('T')[0],
            dueDate: row.due_date || '',
            notes: row.notes || '',
            recurring: ['weekly', 'monthly', 'yearly'].includes(row.recurring?.toLowerCase()) ? row.recurring.toLowerCase() : null
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
        await saveEntry(entry);
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

const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
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
    const headers = ['Date', 'Category', 'Name', 'Amount', 'Due Date'];
    const rows = dataToExport.map(e => [
      e.date,
      CATEGORIES.find(c => c.value === e.type)?.label || e.type,
      `"${e.name.replace(/"/g, '""')}"`,
      e.amount.toFixed(2),
      e.dueDate || ''
    ]);
    
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
    <div style={{ minHeight: '100vh', backgroundColor: theme.bg }}>
      {/* Header */}
      <header style={{
        backgroundColor: isDark ? '#0a0a0b' : '#ffffff',
        borderBottom: `1px solid ${theme.cardBorder}`,
        padding: isSmall ? '14px 12px' : '18px 24px',
        position: 'sticky',
        top: 0,
        zIndex: 20
      }}>
        <div style={{ maxWidth: '1600px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: isSmall ? '10px' : '14px' }}>
            <img 
              src="https://i.imgur.com/R52jwPv.png" 
              alt="BrewedOps Logo" 
              style={{ 
                width: isSmall ? '36px' : '44px', 
                height: isSmall ? '36px' : '44px', 
                borderRadius: '50%', 
                objectFit: 'cover',
                flexShrink: 0 
              }} 
            />
            <h1 style={{ fontSize: isSmall ? '16px' : '18px', fontWeight: '600', color: theme.text, margin: 0 }}>BrewedOps Tracker</h1>
          </div>

          {/* Desktop Header Actions */}
          {!isMobile ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
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
                  border: `1px solid ${theme.cardBorder}`
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
              
              {/* Christmas Theme Toggle */}
              <button
                onClick={() => setIsChristmasTheme(!isChristmasTheme)}
                style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: isChristmasTheme ? '#dc2626' : 'transparent',
                  border: `1px solid ${isChristmasTheme ? '#dc2626' : theme.inputBorder}`,
                  borderRadius: '8px',
                  color: isChristmasTheme ? '#fff' : theme.textMuted,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title={isChristmasTheme ? 'Disable Christmas Theme' : 'Enable Christmas Theme'}
              >
                <TreePine style={{ width: '20px', height: '20px' }} />
              </button>
              
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                style={{
                  height: '40px',
                  backgroundColor: theme.inputBg,
                  border: `1px solid ${theme.inputBorder}`,
                  borderRadius: '8px',
                  padding: '0 12px',
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

              {/* Feedback Button */}
              <button
                onClick={() => setShowFeedback(true)}
                style={{
                  height: '40px',
                  padding: '0 16px',
                  backgroundColor: 'transparent',
                  border: `1px solid ${theme.inputBorder}`,
                  borderRadius: '8px',
                  color: theme.textMuted,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px'
                }}
              >
                <MessageSquare style={{ width: '18px', height: '18px' }} />
                Feedback
              </button>
              
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
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: profilePicture ? 'transparent' : '#3b82f6',
                    border: currentFrame.border !== 'none' ? currentFrame.border : '2px solid transparent',
                    color: '#fff',
                    fontSize: '18px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: currentFrame.glow !== 'none' ? currentFrame.glow : 'none',
                    transition: 'all 0.3s ease',
                    overflow: 'hidden',
                    padding: 0
                  }}
                >
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
                </button>

                {showProfileMenu && (
                  <div style={{
                    position: 'absolute',
                    top: '54px',
                    right: 0,
                    width: '200px',
                    backgroundColor: theme.cardBg,
                    border: `1px solid ${theme.cardBorder}`,
                    borderRadius: '8px',
                    boxShadow: isDark ? '0 4px 12px rgba(0,0,0,0.4)' : '0 4px 12px rgba(0,0,0,0.1)',
                    zIndex: 50,
                    overflow: 'hidden'
                  }}>
                    <div style={{ padding: '12px 16px', borderBottom: `1px solid ${theme.cardBorder}` }}>
                      <p style={{ fontSize: '14px', fontWeight: '600', color: theme.text, margin: 0 }}>{user.user_metadata?.nickname || 'User'}</p>
                      <p style={{ fontSize: '12px', color: theme.textMuted, margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</p>
                    </div>
                    <button
                      onClick={() => { setShowProfileMenu(false); setShowEditProfile(true); }}
                      style={{
                        width: '100%',
                        padding: '10px 16px',
                        backgroundColor: 'transparent',
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
                      <Edit style={{ width: '16px', height: '16px', color: theme.textMuted }} />
                      Edit Profile
                    </button>
                    <button
                      onClick={() => { setShowProfileMenu(false); onLogout(); }}
                      style={{
                        width: '100%',
                        padding: '10px 16px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        color: '#ef4444',
                        textAlign: 'left'
                      }}
                    >
                      <LogOut style={{ width: '16px', height: '16px' }} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Mobile Header Actions */
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* Mobile Level & XP Bar - Compact */}
              <div 
                onClick={() => setShowRewardsModal(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 10px',
                  backgroundColor: theme.statBg,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  border: `1px solid ${theme.cardBorder}`
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                  color: '#fff',
                  fontSize: '11px',
                  fontWeight: '700'
                }}>
                  {currentLevel}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: '55px' }}>
                  <div style={{
                    height: '5px',
                    backgroundColor: isDark ? '#27272a' : '#e4e4e7',
                    borderRadius: '3px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${levelProgress}%`,
                      background: 'linear-gradient(90deg, #22c55e, #10b981)',
                      borderRadius: '3px'
                    }} />
                  </div>
                  <span style={{ fontSize: '9px', color: theme.textMuted }}>{userXP} XP</span>
                </div>
              </div>

              {/* Christmas Theme Toggle - Mobile */}
              <button
                onClick={() => setIsChristmasTheme(!isChristmasTheme)}
                style={{
                  width: '36px',
                  height: '36px',
                  backgroundColor: isChristmasTheme ? '#dc2626' : 'transparent',
                  border: `1px solid ${isChristmasTheme ? '#dc2626' : theme.inputBorder}`,
                  borderRadius: '8px',
                  color: isChristmasTheme ? '#fff' : theme.textMuted,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <TreePine style={{ width: '18px', height: '18px' }} />
              </button>
              
              <button
                onClick={() => setIsDark(!isDark)}
                style={{
                  width: '36px',
                  height: '36px',
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
                {isDark ? <Sun style={{ width: '18px', height: '18px' }} /> : <Moon style={{ width: '18px', height: '18px' }} />}
              </button>
              
              {/* Mobile Profile Avatar with Dropdown */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    backgroundColor: profilePicture ? 'transparent' : '#3b82f6',
                    border: currentFrame.border !== 'none' ? currentFrame.border : '2px solid transparent',
                    color: '#fff',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: currentFrame.glow !== 'none' ? currentFrame.glow : 'none',
                    overflow: 'hidden',
                    padding: 0
                  }}
                >
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
                </button>

                {showProfileMenu && (
                  <div style={{
                    position: 'absolute',
                    top: '50px',
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
                        textAlign: 'left'
                      }}
                    >
                      <Edit style={{ width: '18px', height: '18px', color: theme.textMuted }} />
                      Edit Profile
                    </button>
                    <button
                      onClick={() => { setShowProfileMenu(false); setShowFeedback(true); }}
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
                        textAlign: 'left'
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

      {/* Tab Navigation */}
      <div style={{
        backgroundColor: isDark ? '#0a0a0b' : '#ffffff',
        borderBottom: `1px solid ${theme.cardBorder}`,
        padding: isSmall ? '0 12px' : '0 24px'
      }}>
        <div style={{ maxWidth: '1600px', margin: '0 auto', display: 'flex', gap: '4px', padding: '0 16px' }}>
          <button
            onClick={() => setActiveTab('dashboard')}
            style={{
              padding: '14px 18px',
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'dashboard' ? `2px solid ${isDark ? '#fafafa' : '#18181b'}` : '2px solid transparent',
              fontSize: '15px',
              fontWeight: '500',
              color: activeTab === 'dashboard' ? theme.text : theme.textMuted,
              cursor: 'pointer',
              transition: 'color 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('entries')}
            style={{
              padding: '14px 18px',
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'entries' ? `2px solid ${isDark ? '#fafafa' : '#18181b'}` : '2px solid transparent',
              fontSize: '15px',
              fontWeight: '500',
              color: activeTab === 'entries' ? theme.text : theme.textMuted,
              cursor: 'pointer',
              transition: 'color 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
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
          <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '12px 16px' }}>
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
                    backgroundColor: dashboardSubTab === 'bills' ? (isDark ? '#8b5cf6' : '#7c3aed') : (isDark ? '#52525b' : '#d4d4d8'),
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

      <main style={{ maxWidth: '1600px', margin: '0 auto', padding: isSmall ? '8px' : '24px 40px', boxSizing: 'border-box', overflow: 'hidden' }}>
        
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
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: theme.textMuted, marginBottom: '6px' }}>Notes (optional)</label>
                    <input 
                      type="text" 
                      placeholder="Add a memo or note..." 
                      value={manualForm.notes} 
                      onChange={(e) => setManualForm({ ...manualForm, notes: e.target.value })} 
                      style={inputStyle} 
                    />
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
                <div style={{ display: 'flex', gap: '8px' }}>
                  {(manualForm.name || manualForm.amount || manualForm.date || manualForm.dueDate || manualForm.notes || manualForm.recurring || selectedCategory) && (
                    <button 
                      onClick={() => {
                        setManualForm({ name: '', amount: '', date: '', dueDate: '', notes: '', recurring: '' });
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
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: isSmall ? '400px' : 'auto' }}>
                <thead style={{ position: 'sticky', top: 0, backgroundColor: theme.cardBg, zIndex: 1 }}>
                  <tr style={{ borderBottom: `1px solid ${theme.cardBorder}` }}>
                    <th style={{ padding: '8px 8px 8px 0', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: theme.textSubtle, width: isSmall ? '70px' : '90px' }}>Type</th>
                    <th style={{ padding: '8px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: theme.textSubtle }}>Name</th>
                    <th style={{ padding: '8px', textAlign: 'right', fontSize: '12px', fontWeight: '500', color: theme.textSubtle, width: '100px' }}>Amount</th>
                    <th style={{ padding: '8px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: theme.textSubtle, width: '90px' }}>Date</th>
                    <th style={{ padding: '8px 0 8px 8px', textAlign: 'right', fontSize: '12px', fontWeight: '500', color: theme.textSubtle, width: '90px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEntries.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', padding: '60px 16px' }}>
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
                          <td style={{ padding: '10px 8px', verticalAlign: 'middle' }}>
                            <span style={{ fontSize: '12px', color: theme.textSubtle }}>{new Date(entry.date).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}</span>
                          </td>
                          <td style={{ padding: '10px 0 10px 8px', verticalAlign: 'middle', textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: '2px', justifyContent: 'flex-end' }}>
                              {entry.file && (
                                <>
                                  <button onClick={() => setPreviewFile(entry)} style={{ width: '26px', height: '26px', backgroundColor: 'transparent', border: 'none', borderRadius: '4px', color: theme.textSubtle, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
                                    <Eye style={{ width: '14px', height: '14px' }} />
                                  </button>
                                  <button onClick={() => handleDownloadFile(entry)} style={{ width: '26px', height: '26px', backgroundColor: 'transparent', border: 'none', borderRadius: '4px', color: theme.textSubtle, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
                                    <Download style={{ width: '14px', height: '14px' }} />
                                  </button>
                                </>
                              )}
                              <button onClick={() => setEditingEntry({...entry, amount: entry.amount.toString()})} style={{ width: '26px', height: '26px', backgroundColor: 'transparent', border: 'none', borderRadius: '4px', color: theme.textSubtle, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
                                <Edit style={{ width: '14px', height: '14px' }} />
                              </button>
                              <button onClick={() => setDeletingEntry(entry)} style={{ width: '26px', height: '26px', backgroundColor: 'transparent', border: 'none', borderRadius: '4px', color: theme.textSubtle, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
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
                  ? 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)' 
                  : 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
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
                    <Bar dataKey="amount" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
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
                  ? 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)' 
                  : 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                border: 'none'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', fontWeight: '500' }}>Active Bills</span>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CreditCard style={{ width: '18px', height: '18px', color: '#fff' }} />
                  </div>
                </div>
                <p style={{ fontSize: '28px', fontWeight: '700', color: '#fff', margin: '0 0 8px' }}>{getRecurringEntries().length}</p>
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>Recurring expenses</span>
              </div>

              {/* Monthly Cost */}
              <div style={{
                ...cardStyle,
                background: isDark 
                  ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' 
                  : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                border: 'none'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', fontWeight: '500' }}>Monthly Cost</span>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Wallet style={{ width: '18px', height: '18px', color: '#fff' }} />
                  </div>
                </div>
                <p style={{ fontSize: '28px', fontWeight: '700', color: '#fff', margin: '0 0 8px' }}>{currency}{formatAmount(getMonthlyRecurringCost())}</p>
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>Estimated monthly</span>
              </div>

              {/* Yearly Cost */}
              <div style={{
                ...cardStyle,
                background: isDark 
                  ? 'linear-gradient(135deg, #059669 0%, #047857 100%)' 
                  : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                border: 'none'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', fontWeight: '500' }}>Yearly Cost</span>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <TrendingUp style={{ width: '18px', height: '18px', color: '#fff' }} />
                  </div>
                </div>
                <p style={{ fontSize: '28px', fontWeight: '700', color: '#fff', margin: '0 0 8px' }}>{currency}{formatAmount(getYearlyRecurringCost())}</p>
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>Estimated yearly</span>
              </div>

              {/* Due Soon */}
              <div style={{
                ...cardStyle,
                background: isDark 
                  ? 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)' 
                  : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                border: 'none'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', fontWeight: '500' }}>Due This Week</span>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Bell style={{ width: '18px', height: '18px', color: '#fff' }} />
                  </div>
                </div>
                <p style={{ fontSize: '28px', fontWeight: '700', color: '#fff', margin: '0 0 8px' }}>{getUpcomingBills().filter(b => b.daysUntil <= 7).length}</p>
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>Upcoming payments</span>
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
        {/* Edit Profile Modal */}
      {showEditProfile && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 50 }} onClick={() => setShowEditProfile(false)}>
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

      {/* Feedback Modal */}
      {showFeedback && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 50 }} onClick={() => setShowFeedback(false)}>
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
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 50 }} onClick={() => setShowClearAllConfirm(false)}>
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
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setShowClearAllConfirm(false)}
                style={{ flex: 1, height: '44px', backgroundColor: 'transparent', border: `1px solid ${theme.inputBorder}`, borderRadius: '8px', fontSize: '14px', fontWeight: '500', color: theme.text, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={handleClearAll}
                disabled={isDeleting}
                style={{ flex: 1, height: '44px', backgroundColor: '#ef4444', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '500', color: '#fff', cursor: isDeleting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', opacity: isDeleting ? 0.7 : 1 }}
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

      {/* Rewards Modal */}
      {showRewardsModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 50 }} onClick={() => setShowRewardsModal(false)}>
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
                      <div style={{
                        width: '50px',
                        height: '50px',
                        margin: '0 auto 8px',
                        borderRadius: '50%',
                        backgroundColor: isDark ? '#27272a' : '#e4e4e7',
                        border: frame.border,
                        boxShadow: isUnlocked ? frame.glow : 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
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
                      <p style={{ fontSize: '12px', fontWeight: '600', color: theme.text, margin: '0 0 2px' }}>{frame.name}</p>
                      <p style={{ fontSize: '10px', color: isUnlocked ? '#22c55e' : theme.textMuted, margin: 0 }}>
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

      {/* Christmas Theme Decorations */}
      {isChristmasTheme && (
        <>
          {/* Snow Animation */}
          <div style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            height: '100vh', 
            pointerEvents: 'none', 
            zIndex: 100,
            overflow: 'hidden'
          }}>
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  top: '-10px',
                  left: `${Math.random() * 100}%`,
                  width: `${Math.random() * 8 + 4}px`,
                  height: `${Math.random() * 8 + 4}px`,
                  backgroundColor: isDark ? '#fff' : '#a8d4ff',
                  borderRadius: '50%',
                  opacity: isDark ? (Math.random() * 0.7 + 0.3) : (Math.random() * 0.5 + 0.4),
                  boxShadow: isDark 
                    ? '0 0 4px rgba(255, 255, 255, 0.5)' 
                    : '0 0 6px rgba(100, 180, 255, 0.6), 0 0 2px rgba(0, 100, 200, 0.3)',
                  animation: `snowfall ${Math.random() * 3 + 4}s linear infinite`,
                  animationDelay: `${Math.random() * 5}s`
                }}
              />
            ))}
          </div>
          
          {/* Christmas Lights at top */}
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            display: 'flex',
            justifyContent: 'space-around',
            zIndex: 101,
            pointerEvents: 'none'
          }}>
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: ['#ef4444', '#22c55e', '#fbbf24', '#3b82f6'][i % 4],
                  boxShadow: `0 0 10px ${['#ef4444', '#22c55e', '#fbbf24', '#3b82f6'][i % 4]}`,
                  animation: `twinkle ${Math.random() * 1 + 0.5}s ease-in-out infinite alternate`,
                  animationDelay: `${Math.random() * 2}s`,
                  marginTop: '2px'
                }}
              />
            ))}
          </div>
          
          {/* Santa on header (right side) */}
          <div style={{
            position: 'fixed',
            top: '8px',
            right: '16px',
            fontSize: '32px',
            zIndex: 102,
            pointerEvents: 'none',
            animation: 'santaBounce 2s ease-in-out infinite'
          }}>
            🎅
          </div>
        </>
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
        @keyframes snowfall {
          0% { transform: translateY(-10px) rotate(0deg); }
          100% { transform: translateY(100vh) rotate(360deg); }
        }
        @keyframes twinkle {
          0% { opacity: 0.3; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes santaBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
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
    </div>
  );
};

// ============================================
// ADMIN DASHBOARD
// ============================================

const AdminDashboard = ({ onLogout, isDark, setIsDark }) => {
  const theme = getTheme(isDark);
  const { width } = useWindowSize();
  const isMobile = width < 768;
  const isSmall = width < 480;

  const [adminTab, setAdminTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userSearch, setUserSearch] = useState('');
  const [viewingUser, setViewingUser] = useState(null);
  const [viewingFeedback, setViewingFeedback] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [expenseSearch, setExpenseSearch] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [editUserForm, setEditUserForm] = useState({ nickname: '', email: '', password: '' });
  const [savingUser, setSavingUser] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchFeedbacks();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // First, try to get all profiles (users who have signed up)
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');
      
      // Then get all expenses
      const { data: expenses, error: expensesError } = await supabase
        .from('expenses')
        .select('*')
        .order('created_at', { ascending: false });

      if (expensesError) console.error('Expenses error:', expensesError);

      const userMap = {};
      
      // Add users from profiles table first (if available)
      if (profiles && !profilesError) {
        profiles.forEach(profile => {
          userMap[profile.id] = {
            id: profile.id,
            email: profile.email || profile.id,
            nickname: profile.nickname || profile.full_name || profile.username || 'User',
            expenses: [],
            totalSpent: 0,
            createdAt: profile.created_at || profile.updated_at
          };
        });
      }
      
      // Add/update users from expenses - match by user_id
      if (expenses && expenses.length > 0) {
        expenses.forEach(expense => {
          const userId = expense.user_id;
          if (userId && userMap[userId]) {
            // User exists from profiles, add expense
            userMap[userId].expenses.push(expense);
            userMap[userId].totalSpent += parseFloat(expense.amount) || 0;
            // Update email/nickname if we have better data from expenses
            if (expense.user_email && (!userMap[userId].email || userMap[userId].email === userId)) {
              userMap[userId].email = expense.user_email;
            }
            if (expense.user_nickname && userMap[userId].nickname === 'User') {
              userMap[userId].nickname = expense.user_nickname;
            }
          } else if (userId) {
            // User not in profiles, create from expense
            userMap[userId] = {
              id: userId,
              email: expense.user_email || userId,
              nickname: expense.user_nickname || 'User',
              expenses: [expense],
              totalSpent: parseFloat(expense.amount) || 0,
              createdAt: expense.created_at
            };
          }
        });
      }

      setUsers(Object.values(userMap));
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle editing user
  const handleEditUser = (user) => {
    setEditingUser(user);
    setEditUserForm({
      nickname: user.nickname || '',
      email: user.email || '',
      password: ''
    });
  };

  // Save user changes via Edge Function
  const handleSaveUser = async () => {
    if (!editingUser) return;
    setSavingUser(true);
    
    try {
      // Get the current session for authorization
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No active session');
      }

      // Call the edge function
      const response = await fetch(
        `${supabase.supabaseUrl}/functions/v1/admin-update-user`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            userId: editingUser.id,
            email: editUserForm.email !== editingUser.email ? editUserForm.email : undefined,
            password: editUserForm.password || undefined,
            nickname: editUserForm.nickname
          })
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update user');
      }

      // Update local state
      setUsers(prev => prev.map(u => 
        u.id === editingUser.id 
          ? { ...u, nickname: editUserForm.nickname, email: editUserForm.email }
          : u
      ));
      
      setEditingUser(null);
      alert(`User updated successfully! Updated: ${result.updated.join(', ')}`);
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user: ' + error.message);
    } finally {
      setSavingUser(false);
    }
  };

  const fetchFeedbacks = async () => {
    try {
      const { data, error } = await supabase
        .from('feedbacks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFeedbacks(data || []);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    if (!window.confirm('Delete this entry?')) return;
    try {
      const { error } = await supabase.from('expenses').delete().eq('id', expenseId);
      if (error) throw error;
      fetchUsers();
      if (viewingUser) {
        setViewingUser(prev => ({
          ...prev,
          expenses: prev.expenses.filter(e => e.id !== expenseId),
          totalSpent: prev.expenses.filter(e => e.id !== expenseId).reduce((sum, e) => sum + e.amount, 0)
        }));
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDeleteUser = async () => {
    if (!deletingUser) return;
    try {
      const { error } = await supabase.from('expenses').delete().eq('user_id', deletingUser.id);
      if (error) throw error;
      setUsers(prev => prev.filter(u => u.id !== deletingUser.id));
      setDeletingUser(null);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const openFeedbackDetail = (feedback) => {
    setViewingFeedback(feedback);
    if (!feedback.read) {
      supabase.from('feedbacks').update({ read: true }).eq('id', feedback.id).then(() => {
        setFeedbacks(prev => prev.map(f => f.id === feedback.id ? { ...f, read: true } : f));
      });
    }
  };

  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(userSearch.toLowerCase()) ||
    user.nickname?.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredExpenses = viewingUser?.expenses.filter(expense =>
    expense.name.toLowerCase().includes(expenseSearch.toLowerCase()) ||
    expense.category.toLowerCase().includes(expenseSearch.toLowerCase())
  ) || [];

  const unreadCount = feedbacks.filter(f => !f.read).length;
  const totalUsers = users.length;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: theme.bg }}>
      <header style={{ backgroundColor: isDark ? '#0a0a0b' : '#ffffff', borderBottom: `1px solid ${theme.cardBorder}`, padding: '16px 24px', position: 'sticky', top: 0, zIndex: 20 }}>
        <div style={{ maxWidth: '1600px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <img src="https://i.imgur.com/R52jwPv.png" alt="Logo" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #dc2626' }} />
            <div>
              <h1 style={{ fontSize: '17px', fontWeight: '600', color: theme.text, margin: 0 }}>BrewedOps Admin</h1>
              <p style={{ fontSize: '12px', color: '#dc2626', margin: 0, fontWeight: '500' }}>Administrator</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {!isSmall && <span style={{ fontSize: '14px', color: theme.textSubtle }}>admin@brewedops.com</span>}
            <button onClick={() => setIsDark(!isDark)} style={{ width: '36px', height: '36px', backgroundColor: 'transparent', border: `1px solid ${theme.inputBorder}`, borderRadius: '6px', color: theme.textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {isDark ? <Sun style={{ width: '16px', height: '16px' }} /> : <Moon style={{ width: '16px', height: '16px' }} />}
            </button>
            <button onClick={onLogout} style={{ height: '36px', padding: '0 14px', backgroundColor: '#dc2626', border: 'none', borderRadius: '6px', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '14px', fontWeight: '500' }}>
              <LogOut style={{ width: '15px', height: '15px' }} />{!isSmall && 'Logout'}
            </button>
          </div>
        </div>
      </header>

      <div style={{ backgroundColor: isDark ? '#0a0a0b' : '#ffffff', borderBottom: `1px solid ${theme.cardBorder}`, padding: '0 24px' }}>
        <div style={{ maxWidth: '1600px', margin: '0 auto', display: 'flex', gap: '4px', padding: '0 16px' }}>
          <button onClick={() => setAdminTab('users')} style={{ padding: '14px 18px', backgroundColor: 'transparent', border: 'none', borderBottom: adminTab === 'users' ? `2px solid ${isDark ? '#fafafa' : '#18181b'}` : '2px solid transparent', fontSize: '15px', fontWeight: '500', color: adminTab === 'users' ? theme.text : theme.textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users style={{ width: '16px', height: '16px' }} />All Users
          </button>
          <button onClick={() => setAdminTab('feedback')} style={{ padding: '14px 18px', backgroundColor: 'transparent', border: 'none', borderBottom: adminTab === 'feedback' ? `2px solid ${isDark ? '#fafafa' : '#18181b'}` : '2px solid transparent', fontSize: '15px', fontWeight: '500', color: adminTab === 'feedback' ? theme.text : theme.textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquare style={{ width: '16px', height: '16px' }} />Feedback
            {unreadCount > 0 && <span style={{ backgroundColor: '#dc2626', color: '#fff', fontSize: '11px', fontWeight: '600', padding: '2px 6px', borderRadius: '10px' }}>{unreadCount}</span>}
          </button>
        </div>
      </div>

      <main style={{ maxWidth: '1600px', margin: '0 auto', padding: isSmall ? '16px' : '24px 40px' }}>
        {adminTab === 'users' ? (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: isSmall ? '1fr 1fr' : 'repeat(2, 1fr)', gap: '16px', marginBottom: '24px', maxWidth: '500px' }}>
              <div style={{ padding: '20px', borderRadius: '12px', backgroundColor: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '13px', color: theme.textMuted }}>Total Users</span>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#3b82f620', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Users style={{ width: '18px', height: '18px', color: '#3b82f6' }} />
                  </div>
                </div>
                <p style={{ fontSize: '28px', fontWeight: '700', color: theme.text, margin: 0 }}>{totalUsers}</p>
              </div>
              <div style={{ padding: '20px', borderRadius: '12px', backgroundColor: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '13px', color: theme.textMuted }}>Total Feedbacks</span>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#8b5cf620', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <MessageSquare style={{ width: '18px', height: '18px', color: '#8b5cf6' }} />
                  </div>
                </div>
                <p style={{ fontSize: '28px', fontWeight: '700', color: theme.text, margin: 0 }}>{feedbacks.length}</p>
              </div>
            </div>

            <div style={{ backgroundColor: theme.cardBg, borderRadius: '12px', border: `1px solid ${theme.cardBorder}`, overflow: 'hidden' }}>
              <div style={{ padding: '20px', borderBottom: `1px solid ${theme.cardBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: '600', color: theme.text, margin: 0 }}>All Users</h2>
                  <p style={{ fontSize: '14px', color: theme.textMuted, margin: '4px 0 0' }}>Manage registered users</p>
                </div>
                <div style={{ position: 'relative' }}>
                  <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: theme.textMuted }} />
                  <input type="text" placeholder="Search..." value={userSearch} onChange={(e) => setUserSearch(e.target.value)} style={{ height: '36px', width: isSmall ? '100%' : '220px', paddingLeft: '38px', paddingRight: '12px', backgroundColor: theme.inputBg, border: `1px solid ${theme.inputBorder}`, borderRadius: '6px', fontSize: '14px', color: theme.text, outline: 'none' }} />
                </div>
              </div>

              {loading ? (
                <div style={{ padding: '60px 20px', textAlign: 'center' }}>
                  <Loader2 style={{ width: '32px', height: '32px', color: theme.textMuted, animation: 'spin 1s linear infinite', margin: '0 auto' }} />
                </div>
              ) : filteredUsers.length === 0 ? (
                <div style={{ padding: '60px 20px', textAlign: 'center' }}>
                  <Users style={{ width: '48px', height: '48px', color: theme.textMuted, margin: '0 auto 16px' }} />
                  <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0 }}>{userSearch ? 'No users found' : 'No users yet'}</p>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                    <thead>
                      <tr style={{ backgroundColor: theme.statBg }}>
                        <th style={{ textAlign: 'left', padding: '14px 20px', fontSize: '12px', fontWeight: '600', color: theme.textMuted, textTransform: 'uppercase' }}>User</th>
                        <th style={{ textAlign: 'center', padding: '14px 20px', fontSize: '12px', fontWeight: '600', color: theme.textMuted, textTransform: 'uppercase' }}>Entries</th>
                        <th style={{ textAlign: 'center', padding: '14px 20px', fontSize: '12px', fontWeight: '600', color: theme.textMuted, textTransform: 'uppercase' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user.id} style={{ borderBottom: `1px solid ${theme.cardBorder}` }}>
                          <td style={{ padding: '16px 20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '14px', fontWeight: '600' }}>{getInitial(user.nickname)}</div>
                              <div>
                                <p style={{ fontSize: '14px', fontWeight: '500', color: theme.text, margin: 0 }}>{user.nickname || 'User'}</p>
                                <p style={{ fontSize: '12px', color: theme.textMuted, margin: 0 }}>{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                            <span style={{ fontSize: '13px', padding: '4px 12px', borderRadius: '20px', backgroundColor: isDark ? '#1e3a5f' : '#dbeafe', color: isDark ? '#60a5fa' : '#1d4ed8' }}>{user.expenses.length} entries</span>
                          </td>
                          <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                              <button onClick={() => { setViewingUser(user); setExpenseSearch(''); }} style={{ width: '32px', height: '32px', backgroundColor: 'transparent', border: `1px solid ${theme.inputBorder}`, borderRadius: '6px', color: theme.textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="View Expenses">
                                <Eye style={{ width: '14px', height: '14px' }} />
                              </button>
                              <button onClick={() => handleEditUser(user)} style={{ width: '32px', height: '32px', backgroundColor: 'transparent', border: `1px solid ${theme.inputBorder}`, borderRadius: '6px', color: theme.textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Edit User">
                                <Edit style={{ width: '14px', height: '14px' }} />
                              </button>
                              <button onClick={() => setDeletingUser(user)} style={{ width: '32px', height: '32px', backgroundColor: 'transparent', border: '1px solid #dc2626', borderRadius: '6px', color: '#dc2626', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Delete User">
                                <Trash2 style={{ width: '14px', height: '14px' }} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        ) : (
          <div style={{ backgroundColor: theme.cardBg, borderRadius: '12px', border: `1px solid ${theme.cardBorder}`, overflow: 'hidden' }}>
            <div style={{ padding: '20px', borderBottom: `1px solid ${theme.cardBorder}` }}>
              <h2 style={{ fontSize: '18px', fontWeight: '600', color: theme.text, margin: 0 }}>User Feedback</h2>
              <p style={{ fontSize: '14px', color: theme.textMuted, margin: '4px 0 0' }}>{feedbacks.length} submissions</p>
            </div>
            {feedbacks.length === 0 ? (
              <div style={{ padding: '60px 20px', textAlign: 'center' }}>
                <MessageSquare style={{ width: '48px', height: '48px', color: theme.textMuted, margin: '0 auto 16px' }} />
                <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0 }}>No feedback yet</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {feedbacks.map((feedback) => (
                  <div key={feedback.id} onClick={() => openFeedbackDetail(feedback)} style={{ padding: '20px', borderBottom: `1px solid ${theme.cardBorder}`, backgroundColor: feedback.read ? 'transparent' : (isDark ? '#1e293b' : '#f0f9ff'), cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '14px', fontWeight: '600' }}>{getInitial(feedback.nickname)}</div>
                        <div>
                          <p style={{ fontSize: '14px', fontWeight: '600', color: theme.text, margin: 0 }}>{feedback.nickname || 'User'}</p>
                          <p style={{ fontSize: '12px', color: theme.textMuted, margin: 0 }}>{feedback.user_email}</p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {!feedback.read && <span style={{ backgroundColor: '#3b82f6', color: '#fff', fontSize: '10px', fontWeight: '600', padding: '2px 8px', borderRadius: '10px' }}>NEW</span>}
                        <span style={{ fontSize: '12px', color: theme.textMuted }}>{new Date(feedback.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <p style={{ fontSize: '14px', color: theme.text, margin: 0, lineHeight: '1.5', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{feedback.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {viewingUser && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '20px' }}>
          <div style={{ width: '100%', maxWidth: '700px', maxHeight: '80vh', backgroundColor: theme.cardBg, borderRadius: '12px', border: `1px solid ${theme.cardBorder}`, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '20px', borderBottom: `1px solid ${theme.cardBorder}`, flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '18px', fontWeight: '600' }}>{getInitial(viewingUser.nickname)}</div>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: theme.text, margin: 0 }}>{viewingUser.nickname || 'User'}</h3>
                    <p style={{ fontSize: '13px', color: theme.textMuted, margin: '2px 0 0' }}>{viewingUser.email}</p>
                  </div>
                </div>
                <button onClick={() => setViewingUser(null)} style={{ width: '32px', height: '32px', backgroundColor: 'transparent', border: `1px solid ${theme.inputBorder}`, borderRadius: '6px', color: theme.textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <X style={{ width: '16px', height: '16px' }} />
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: theme.textMuted }} />
                <input type="text" placeholder="Search entries..." value={expenseSearch} onChange={(e) => setExpenseSearch(e.target.value)} style={{ width: '100%', height: '40px', paddingLeft: '38px', paddingRight: '12px', backgroundColor: theme.inputBg, border: `1px solid ${theme.inputBorder}`, borderRadius: '6px', fontSize: '14px', color: theme.text, outline: 'none', boxSizing: 'border-box' }} />
              </div>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
              {filteredExpenses.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}><p style={{ fontSize: '14px', color: theme.textMuted, margin: 0 }}>No entries found</p></div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {filteredExpenses.map((expense) => {
                    const badge = getBadgeStyle(expense.category, isDark);
                    return (
                      <div key={expense.id} style={{ padding: '16px', backgroundColor: theme.statBg, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1 }}>
                          <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: badge.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <FileText style={{ width: '18px', height: '18px', color: badge.color }} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontSize: '14px', fontWeight: '500', color: theme.text, margin: 0 }}>{expense.name}</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', flexWrap: 'wrap' }}>
                              <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', backgroundColor: badge.bg, color: badge.color, textTransform: 'capitalize' }}>{expense.category}</span>
                              <span style={{ fontSize: '12px', color: theme.textMuted }}>{new Date(expense.date).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ fontSize: '16px', fontWeight: '600', color: theme.text }}>₱{formatAmount(expense.amount)}</span>
                          <button onClick={() => handleDeleteExpense(expense.id)} style={{ width: '32px', height: '32px', backgroundColor: 'transparent', border: '1px solid #dc2626', borderRadius: '6px', color: '#dc2626', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Trash2 style={{ width: '14px', height: '14px' }} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <div style={{ padding: '16px 20px', borderTop: `1px solid ${theme.cardBorder}`, backgroundColor: theme.statBg, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: '14px', color: theme.textMuted }}>{filteredExpenses.length} entries</span>
              <span style={{ fontSize: '16px', fontWeight: '600', color: theme.text }}>Total: ₱{formatAmount(viewingUser.totalSpent)}</span>
            </div>
          </div>
        </div>
      )}

      {deletingUser && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ width: '100%', maxWidth: '420px', backgroundColor: theme.cardBg, borderRadius: '12px', border: `1px solid ${theme.cardBorder}`, padding: '24px', textAlign: 'center', margin: '16px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: isDark ? '#450a0a' : '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <AlertTriangle style={{ width: '28px', height: '28px', color: '#dc2626' }} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: theme.text, margin: '0 0 8px' }}>Delete User?</h3>
            <p style={{ fontSize: '14px', color: theme.textMuted, margin: '0 0 8px' }}>Are you sure you want to delete this user?</p>
            <p style={{ fontSize: '15px', fontWeight: '600', color: theme.text, margin: '0 0 8px', padding: '8px 12px', backgroundColor: theme.statBg, borderRadius: '6px', display: 'inline-block' }}>{deletingUser.email}</p>
            <p style={{ fontSize: '13px', color: '#dc2626', margin: '12px 0 20px' }}>⚠️ This cannot be undone. All {deletingUser.expenses.length} entries will be removed.</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setDeletingUser(null)} style={{ flex: 1, height: '42px', backgroundColor: 'transparent', border: `1px solid ${theme.inputBorder}`, color: theme.text, borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleDeleteUser} style={{ flex: 1, height: '42px', backgroundColor: '#dc2626', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <Trash2 style={{ width: '16px', height: '16px' }} />Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '16px' }} onClick={() => setEditingUser(null)}>
          <div style={{ width: '100%', maxWidth: '450px', backgroundColor: theme.cardBg, borderRadius: '12px', border: `1px solid ${theme.cardBorder}`, overflow: 'hidden' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '20px', borderBottom: `1px solid ${theme.cardBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '18px', fontWeight: '600' }}>{getInitial(editingUser.nickname)}</div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: theme.text, margin: 0 }}>Edit User</h3>
                  <p style={{ fontSize: '12px', color: theme.textMuted, margin: '2px 0 0' }}>Update user information</p>
                </div>
              </div>
              <button onClick={() => setEditingUser(null)} style={{ width: '32px', height: '32px', backgroundColor: 'transparent', border: `1px solid ${theme.inputBorder}`, borderRadius: '6px', color: theme.textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X style={{ width: '16px', height: '16px' }} />
              </button>
            </div>
            
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Nickname */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: theme.textMuted, marginBottom: '6px' }}>Nickname</label>
                <input
                  type="text"
                  value={editUserForm.nickname}
                  onChange={(e) => setEditUserForm({ ...editUserForm, nickname: e.target.value })}
                  placeholder="Enter nickname"
                  style={{
                    width: '100%',
                    height: '42px',
                    padding: '0 12px',
                    backgroundColor: theme.inputBg,
                    border: `1px solid ${theme.inputBorder}`,
                    borderRadius: '6px',
                    fontSize: '14px',
                    color: theme.text,
                    outline: 'none'
                  }}
                />
              </div>
              
              {/* Email */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: theme.textMuted, marginBottom: '6px' }}>Email</label>
                <input
                  type="email"
                  value={editUserForm.email}
                  onChange={(e) => setEditUserForm({ ...editUserForm, email: e.target.value })}
                  placeholder="Enter email"
                  style={{
                    width: '100%',
                    height: '42px',
                    padding: '0 12px',
                    backgroundColor: theme.inputBg,
                    border: `1px solid ${theme.inputBorder}`,
                    borderRadius: '6px',
                    fontSize: '14px',
                    color: theme.text,
                    outline: 'none'
                  }}
                />
              </div>
              
              {/* Password */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: theme.textMuted, marginBottom: '6px' }}>
                  New Password <span style={{ fontWeight: '400', color: theme.textDim }}>(leave empty to keep current)</span>
                </label>
                <input
                  type="password"
                  value={editUserForm.password}
                  onChange={(e) => setEditUserForm({ ...editUserForm, password: e.target.value })}
                  placeholder="Enter new password"
                  style={{
                    width: '100%',
                    height: '42px',
                    padding: '0 12px',
                    backgroundColor: theme.inputBg,
                    border: `1px solid ${theme.inputBorder}`,
                    borderRadius: '6px',
                    fontSize: '14px',
                    color: theme.text,
                    outline: 'none'
                  }}
                />
                {editUserForm.password && editUserForm.password.length < 6 && (
                  <p style={{ fontSize: '12px', color: '#ef4444', margin: '6px 0 0' }}>Password must be at least 6 characters</p>
                )}
              </div>
              
              {/* User ID (read-only) */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: theme.textMuted, marginBottom: '6px' }}>User ID</label>
                <div style={{
                  width: '100%',
                  height: '42px',
                  padding: '0 12px',
                  backgroundColor: theme.statBg,
                  border: `1px solid ${theme.cardBorder}`,
                  borderRadius: '6px',
                  fontSize: '12px',
                  color: theme.textDim,
                  display: 'flex',
                  alignItems: 'center',
                  fontFamily: 'monospace',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {editingUser.id}
                </div>
              </div>
            </div>
            
            <div style={{ padding: '16px 20px', borderTop: `1px solid ${theme.cardBorder}`, backgroundColor: theme.statBg, display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => setEditingUser(null)} 
                style={{ height: '40px', padding: '0 20px', backgroundColor: 'transparent', border: `1px solid ${theme.inputBorder}`, borderRadius: '6px', fontSize: '14px', fontWeight: '500', color: theme.text, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveUser}
                disabled={savingUser || (editUserForm.password && editUserForm.password.length < 6)}
                style={{ 
                  height: '40px', 
                  padding: '0 20px', 
                  backgroundColor: isDark ? '#fafafa' : '#18181b', 
                  color: isDark ? '#18181b' : '#fafafa', 
                  border: 'none', 
                  borderRadius: '6px', 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  cursor: (savingUser || (editUserForm.password && editUserForm.password.length < 6)) ? 'not-allowed' : 'pointer',
                  opacity: (savingUser || (editUserForm.password && editUserForm.password.length < 6)) ? 0.6 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                {savingUser ? (
                  <>
                    <Loader2 style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check style={{ width: '16px', height: '16px' }} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {viewingFeedback && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '20px' }}>
          <div style={{ width: '100%', maxWidth: '500px', backgroundColor: theme.cardBg, borderRadius: '12px', border: `1px solid ${theme.cardBorder}`, overflow: 'hidden' }}>
            <div style={{ padding: '20px', borderBottom: `1px solid ${theme.cardBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '18px', fontWeight: '600' }}>{getInitial(viewingFeedback.nickname)}</div>
                <div>
                  <p style={{ fontSize: '16px', fontWeight: '600', color: theme.text, margin: 0 }}>{viewingFeedback.nickname || 'User'}</p>
                  <p style={{ fontSize: '13px', color: theme.textMuted, margin: '2px 0 0' }}>{viewingFeedback.user_email}</p>
                </div>
              </div>
              <button onClick={() => setViewingFeedback(null)} style={{ width: '32px', height: '32px', backgroundColor: 'transparent', border: `1px solid ${theme.inputBorder}`, borderRadius: '6px', color: theme.textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X style={{ width: '16px', height: '16px' }} />
              </button>
            </div>
            <div style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <MessageSquare style={{ width: '16px', height: '16px', color: theme.textMuted }} />
                <span style={{ fontSize: '13px', color: theme.textMuted }}>Submitted on {new Date(viewingFeedback.created_at).toLocaleDateString()}</span>
              </div>
              <p style={{ fontSize: '15px', color: theme.text, margin: 0, lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>{viewingFeedback.message}</p>
            </div>
            <div style={{ padding: '16px 20px', borderTop: `1px solid ${theme.cardBorder}`, backgroundColor: theme.statBg, display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setViewingFeedback(null)} style={{ height: '38px', padding: '0 20px', backgroundColor: isDark ? '#fafafa' : '#18181b', color: isDark ? '#18181b' : '#fafafa', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>Close</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};


// ============================================
// MAIN EXPORT
// ============================================

export default function App() {
  const [user, setUser] = useState(null);
  const [isDark, setIsDark] = useState(() => {
  const saved = localStorage.getItem('theme');
  return saved ? saved === 'dark' : true;
});
  const [currentPage, setCurrentPage] = useState('home');
  const [loading, setLoading] = useState(true);

  // Check for existing session on load
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
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
  
  const handleLogin = (userData) => {
    if (userData.isAdmin) {
      localStorage.setItem('isAdmin', 'true');
    } else {
      localStorage.removeItem('isAdmin');
    }
    setUser(userData);
  };

 const handleLogout = async () => {
    localStorage.removeItem('isAdmin');
    if (user?.isAdmin) {
      setUser(null);
      setCurrentPage('home');
      return;
    }
    await supabase.auth.signOut();
    setUser(null);
    setCurrentPage('home');
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
  
  // Admin Dashboard
if (user?.isAdmin) {
  return <AdminDashboard onLogout={handleLogout} isDark={isDark} setIsDark={setIsDark} />;
}

// User Dashboard  
if (user) {
  return <ExpenseTrackerApp user={user} onLogout={handleLogout} isDark={isDark} setIsDark={setIsDark} />;
}
  
  if (currentPage === 'login' || currentPage === 'signup') {
    return <LoginPage 
      onLogin={handleLogin} 
      onBack={() => setCurrentPage('home')} 
      isDark={isDark} 
      setIsDark={setIsDark}
      initialMode={currentPage}
    />;
  }
  
  return <HomePage onNavigate={setCurrentPage} isDark={isDark} setIsDark={setIsDark} />;
}
