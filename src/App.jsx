import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, LineChart, Line, AreaChart, Area } from 'recharts';
import { Upload, FileText, Users, MessageSquare, AlertTriangle, Plus, LogOut, Eye, Trash2, X, Loader2, Download, Check, Search, ChevronDown, AlertCircle, Moon, Sun, Receipt, Menu, Banknote, TrendingUp, TrendingDown, DollarSign, CreditCard, Wallet, PiggyBank, ArrowUpRight, ArrowDownRight, Bell, Edit } from 'lucide-react';
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
          © 2025 BrewedOps Tracker
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
              placeholder="you@example.com"
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
                placeholder="What should we call you?"
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
              placeholder={isSignup ? 'Minimum 8 characters' : 'Enter your password'}
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
                placeholder="Re-enter your password"
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
            {loading && <Loader2 style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} />}
            {isSignup ? 'Create Account' : 'Sign In'}
          </button>

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
  const [currency, setCurrency] = useState('₱');
  
  const theme = getTheme(isDark);
  const { width } = useWindowSize();
  const isMobile = width < 768;
  const isSmall = width < 480;
  
  // Form states
  const [uploadMode, setUploadMode] = useState('file');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [manualForm, setManualForm] = useState({ name: '', amount: '', date: '', dueDate: '' });
  const [uploadedFile, setUploadedFile] = useState(null);
  const [pendingUpload, setPendingUpload] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadError, setUploadError] = useState('');
  
  // Filter states
  const [historyFilter, setHistoryFilter] = useState('All');
  const [historySearch, setHistorySearch] = useState('');
  const [dashboardView, setDashboardView] = useState('Month');
  const [dashboardCategory, setDashboardCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('dashboard');
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

  // File handling
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
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
      const isImage = mediaType.startsWith('image/');

      const extractionPrompt = `Extract from this receipt/invoice and respond ONLY with JSON (no markdown):
{"name": "vendor name", "amount": number, "date": "YYYY-MM-DD or empty", "dueDate": "YYYY-MM-DD or empty"}`;

      const content = isImage
        ? [{ type: 'image', source: { type: 'base64', media_type: mediaType, data: base64Data } }, { type: 'text', text: extractionPrompt }]
        : [{ type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: base64Data } }, { type: 'text', text: extractionPrompt }];

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
  },
  body: JSON.stringify({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'user',
        content: isImage
          ? [
              { type: 'text', text: extractionPrompt },
              { type: 'image_url', image_url: { url: `data:${mediaType};base64,${base64Data}` } }
            ]
          : [
              { type: 'text', text: `${extractionPrompt}\n\nDocument content: ${atob(base64Data)}` }
            ]
      }
    ],
    max_tokens: 1000
  })
});

      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const data = await response.json();
const text = data.choices?.[0]?.message?.content || '';
const extracted = JSON.parse(text.replace(/```json|```/g, '').trim());

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
      alert(`Failed to extract data: ${error.message}`);
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
      } catch (e) {
        alert('Failed to save entry');
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
      alert('Please fill required fields');
      return;
    }
    const newEntry = {
      type: selectedCategory,
      name: manualForm.name,
      amount: parseFloat(manualForm.amount) || 0,
      date: manualForm.date || new Date().toISOString().split('T')[0],
      dueDate: manualForm.dueDate || ''
    };
    try {
      await saveEntry(newEntry);
      setSelectedCategory('');
      setManualForm({ name: '', amount: '', date: '', dueDate: '' });
    } catch (e) {
      alert('Failed to save entry');
    }
  };
const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
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
      alert('Failed to send feedback');
    }
  };
  const handleDeleteEntry = async (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      await deleteEntry(id);
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
        padding: isSmall ? '10px 12px' : '12px 24px',
        position: 'sticky',
        top: 0,
        zIndex: 20
      }}>
        <div style={{ maxWidth: '1600px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: isSmall ? '8px' : '12px' }}>
            <img 
              src="https://i.imgur.com/R52jwPv.png" 
              alt="BrewedOps Logo" 
              style={{ 
                width: isSmall ? '32px' : '36px', 
                height: isSmall ? '32px' : '36px', 
                borderRadius: '50%', 
                objectFit: 'cover',
                flexShrink: 0 
              }} 
            />
            <h1 style={{ fontSize: isSmall ? '14px' : '15px', fontWeight: '600', color: theme.text, margin: 0 }}>BrewedOps Tracker</h1>
          </div>

          {/* Desktop Header Actions */}
          {!isMobile ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                style={{
                  height: '32px',
                  backgroundColor: theme.inputBg,
                  border: `1px solid ${theme.inputBorder}`,
                  borderRadius: '6px',
                  padding: '0 8px',
                  fontSize: '13px',
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
                  height: '32px',
                  padding: '0 12px',
                  backgroundColor: 'transparent',
                  border: `1px solid ${theme.inputBorder}`,
                  borderRadius: '6px',
                  color: theme.textMuted,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '13px'
                }}
              >
                <MessageSquare style={{ width: '14px', height: '14px' }} />
                Feedback
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

              {/* Profile Avatar with Dropdown */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: '#3b82f6',
                    border: 'none',
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {getInitial(user.user_metadata?.nickname)}
                </button>

                {showProfileMenu && (
                  <div style={{
                    position: 'absolute',
                    top: '44px',
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
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                style={{
                  height: '32px',
                  backgroundColor: theme.inputBg,
                  border: `1px solid ${theme.inputBorder}`,
                  borderRadius: '6px',
                  padding: '0 6px',
                  fontSize: '12px',
                  color: theme.text,
                  cursor: 'pointer',
                  outline: 'none',
                  width: '70px'
                }}
              >
                {CURRENCIES.map(c => (
                  <option key={c.symbol} value={c.symbol}>{c.symbol} {c.label.split(' ')[0]}</option>
                ))}
              </select>
              
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
                {isDark ? <Sun style={{ width: '14px', height: '14px' }} /> : <Moon style={{ width: '14px', height: '14px' }} />}
              </button>
              
              <button
                onClick={onLogout}
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
                <LogOut style={{ width: '14px', height: '14px' }} />
              </button>
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
              padding: '12px 16px',
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'dashboard' ? `2px solid ${isDark ? '#fafafa' : '#18181b'}` : '2px solid transparent',
              fontSize: '14px',
              fontWeight: '500',
              color: activeTab === 'dashboard' ? theme.text : theme.textMuted,
              cursor: 'pointer',
              transition: 'color 0.2s'
            }}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            style={{
              padding: '12px 16px',
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'analytics' ? `2px solid ${isDark ? '#fafafa' : '#18181b'}` : '2px solid transparent',
              fontSize: '14px',
              fontWeight: '500',
              color: activeTab === 'analytics' ? theme.text : theme.textMuted,
              cursor: 'pointer',
              transition: 'color 0.2s'
            }}
          >
            Analytics
          </button>
          <button
            onClick={() => setActiveTab('entries')}
            style={{
              padding: '12px 16px',
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'entries' ? `2px solid ${isDark ? '#fafafa' : '#18181b'}` : '2px solid transparent',
              fontSize: '14px',
              fontWeight: '500',
              color: activeTab === 'entries' ? theme.text : theme.textMuted,
              cursor: 'pointer',
              transition: 'color 0.2s'
            }}
          >
            All Entries
          </button>
        </div>
      </div>

      <main style={{ maxWidth: '1600px', margin: '0 auto', padding: isSmall ? '8px' : '24px 40px', boxSizing: 'border-box', overflow: 'hidden' }}>
        
        {activeTab === 'dashboard' ? (
          <>
         {/* Top Section: Add Entry + History */}
        <div style={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row',
          gap: isSmall ? '12px' : '24px', 
          marginBottom: isSmall ? '12px' : '24px',
        }}>
          {/* Add New Entry Card */}
          <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', flex: isMobile ? 'none' : '1', minWidth: 0, maxWidth: '100%', overflow: 'hidden' }}>
            <h2 style={{ fontSize: isSmall ? '15px' : '16px', fontWeight: '600', color: theme.text, margin: 0, marginBottom: '16px', height: isMobile ? 'auto' : '36px', display: 'flex', alignItems: 'center' }}>Add New Entry</h2>
            
            {/* Mode Toggle */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
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
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    marginTop: '4px',
                    backgroundColor: theme.cardBg,
                    border: `1px solid ${theme.inputBorder}`,
                    borderRadius: '6px',
                    boxShadow: isDark ? '0 4px 12px rgba(0,0,0,0.4)' : '0 4px 12px rgba(0,0,0,0.1)',
                    zIndex: 50,
                    overflow: 'hidden'
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
            ) : (
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
                <button onClick={handleManualSubmit} disabled={!selectedCategory} style={{ height: '44px', backgroundColor: isDark ? '#fafafa' : '#18181b', color: isDark ? '#18181b' : '#fafafa', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', opacity: selectedCategory ? 1 : 0.5 }}>
                  <Plus style={{ width: '16px', height: '16px' }} /> Add Entry
                </button>
              </div>
            )}
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
                      <td colSpan={5} style={{ textAlign: 'center', padding: '40px 0', color: theme.textDim }}>No entries found</td>
                    </tr>
                  ) : (
                    filteredEntries.map(entry => {
                      const badge = getBadgeStyle(entry.type, isDark);
                      return (
                        <tr key={entry.id} style={{ borderBottom: `1px solid ${theme.cardBorder}` }}>
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
                            <p style={{ fontSize: '13px', fontWeight: '500', color: theme.text, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{entry.name}</p>
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
                              <button onClick={() => handleDeleteEntry(entry.id)} style={{ width: '26px', height: '26px', backgroundColor: 'transparent', border: 'none', borderRadius: '4px', color: theme.textSubtle, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
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

        {/* Dashboard Section */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '8px' }}>
            <h2 style={{ fontSize: isSmall ? '14px' : '16px', fontWeight: '600', color: theme.text, margin: 0 }}>Dashboard</h2>
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
                      fontSize: '13px',
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
          <div style={{ display: 'grid', gridTemplateColumns: isSmall ? '1fr 1fr' : 'repeat(4, 1fr)', gap: isSmall ? '8px' : '16px', marginBottom: '20px', overflow: 'hidden' }}>
            {[
              { label: 'Today', value: stats.today },
              { label: 'This Month', value: stats.month },
              { label: 'This Year', value: stats.year },
              { label: 'All Time', value: stats.total },
            ].map(stat => (
              <div key={stat.label} style={{ backgroundColor: theme.statBg, borderRadius: '8px', padding: isSmall ? '10px' : '16px', minWidth: 0 }}>
                <p style={{ fontSize: isSmall ? '10px' : '13px', color: theme.textSubtle, margin: '0 0 4px' }}>{stat.label}</p>
                <p style={{ fontSize: isSmall ? '13px' : '24px', fontWeight: '700', color: theme.text, margin: 0, wordBreak: 'break-all' }}>{currency}{formatAmount(stat.value)}</p>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px' }}>
            <div style={{ backgroundColor: theme.statBg, borderRadius: '8px', padding: isSmall ? '12px' : '16px' }}>
              <p style={{ fontSize: '13px', color: theme.textSubtle, margin: '0 0 16px' }}>Spending by Category</p>
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height={isSmall ? 180 : 200}>
                  <PieChart>
                    <Pie data={categoryData} cx="50%" cy="50%" innerRadius={isSmall ? 40 : 50} outerRadius={isSmall ? 65 : 80} paddingAngle={2} dataKey="value">
                      {categoryData.map((entry, i) => <Cell key={`cell-${i}`} fill={entry.color} />)}
                    </Pie>
                    <Tooltip formatter={(v) => `${currency}${formatAmount(v)}`} contentStyle={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.inputBorder}`, borderRadius: '6px', color: theme.text }} />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ height: isSmall ? '180px' : '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.textDim }}>No data</div>
              )}
            </div>

            <div style={{ backgroundColor: theme.statBg, borderRadius: '8px', padding: isSmall ? '12px' : '16px' }}>
              <p style={{ fontSize: '13px', color: theme.textSubtle, margin: '0 0 16px' }}>Monthly Spending Trend</p>
              <ResponsiveContainer width="100%" height={isSmall ? 180 : 200}>
                <BarChart data={monthlyData}>
                  <XAxis dataKey="name" tick={{ fontSize: isSmall ? 10 : 12, fill: theme.textSubtle }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: isSmall ? 10 : 12, fill: theme.textSubtle }} axisLine={false} tickLine={false} width={isSmall ? 35 : 40} />
                  <Tooltip formatter={(v) => `${currency}${formatAmount(v)}`} contentStyle={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.inputBorder}`, borderRadius: '6px', color: theme.text }} cursor={{ fill: 'transparent' }} />
                  <Bar dataKey="amount" fill={theme.barColor} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
          </>
        ) : activeTab === 'analytics' ? (
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
                    <Tooltip formatter={(v) => `${currency}${formatAmount(v)}`} contentStyle={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.inputBorder}`, borderRadius: '8px', color: theme.text }} />
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
                        <Tooltip formatter={(v) => `${currency}${formatAmount(v)}`} contentStyle={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.inputBorder}`, borderRadius: '8px', color: theme.text }} />
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
                    <Tooltip formatter={(v) => `${currency}${formatAmount(v)}`} contentStyle={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.inputBorder}`, borderRadius: '8px', color: theme.text }} />
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
        ) : (
          /* All Entries Tab */
          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h2 style={{ fontSize: isSmall ? '15px' : '16px', fontWeight: '600', color: theme.text, margin: 0 }}>All Entries</h2>
                <p style={{ fontSize: '13px', color: theme.textMuted, margin: '4px 0 0' }}>{entries.length} total entries</p>
              </div>
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
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                <thead style={{ position: 'sticky', top: 0, backgroundColor: theme.cardBg, zIndex: 1 }}>
                  <tr style={{ borderBottom: `1px solid ${theme.cardBorder}` }}>
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
                      <td colSpan={5} style={{ textAlign: 'center', padding: '40px 0', color: theme.textDim }}>No entries found</td>
                    </tr>
                  ) : (
                    filteredEntries.map(entry => {
                      const badge = getBadgeStyle(entry.type, isDark);
                      const categoryInfo = CATEGORIES.find(c => c.value === entry.type);
                      return (
                        <tr key={entry.id} style={{ borderBottom: `1px solid ${theme.cardBorder}` }}>
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
                            <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{entry.name}</div>
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
                              <button onClick={() => handleDeleteEntry(entry.id)} style={{ width: '28px', height: '28px', backgroundColor: 'transparent', border: `1px solid ${theme.inputBorder}`, borderRadius: '4px', color: theme.textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
        )}
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
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '32px', fontWeight: '600', marginBottom: '12px' }}>
                {getInitial(editNickname)}
              </div>
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
                  window.location.reload();
                } catch (e) {
                  alert('Failed to update profile');
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

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
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

  useEffect(() => {
    fetchUsers();
    fetchFeedbacks();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data: expenses, error } = await supabase
        .from('expenses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const userMap = {};
      expenses?.forEach(expense => {
        if (!userMap[expense.user_id]) {
          userMap[expense.user_id] = {
            id: expense.user_id,
            email: expense.user_email || expense.user_id,
            nickname: expense.user_nickname || 'User',
            expenses: [],
            totalSpent: 0,
            createdAt: expense.created_at
          };
        }
        userMap[expense.user_id].expenses.push(expense);
        userMap[expense.user_id].totalSpent += expense.amount;
      });

      setUsers(Object.values(userMap));
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
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
  const totalEntries = users.reduce((sum, user) => sum + user.expenses.length, 0);

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
                  <span style={{ fontSize: '13px', color: theme.textMuted }}>Total Entries</span>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#10b98120', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FileText style={{ width: '18px', height: '18px', color: '#10b981' }} />
                  </div>
                </div>
                <p style={{ fontSize: '28px', fontWeight: '700', color: theme.text, margin: 0 }}>{totalEntries}</p>
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
                        <th style={{ textAlign: 'right', padding: '14px 20px', fontSize: '12px', fontWeight: '600', color: theme.textMuted, textTransform: 'uppercase' }}>Total Spent</th>
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
                          <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                            <span style={{ fontSize: '14px', fontWeight: '600', color: theme.text }}>₱{formatAmount(user.totalSpent)}</span>
                          </td>
                          <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                              <button onClick={() => { setViewingUser(user); setExpenseSearch(''); }} style={{ width: '32px', height: '32px', backgroundColor: 'transparent', border: `1px solid ${theme.inputBorder}`, borderRadius: '6px', color: theme.textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Eye style={{ width: '14px', height: '14px' }} />
                              </button>
                              <button onClick={() => setDeletingUser(user)} style={{ width: '32px', height: '32px', backgroundColor: 'transparent', border: '1px solid #dc2626', borderRadius: '6px', color: '#dc2626', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
  const [isDark, setIsDark] = useState(true);
  const [currentPage, setCurrentPage] = useState('home');
  const [loading, setLoading] = useState(true);

  // Check for existing session on load
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);
  
  const handleLogin = (userData) => {
    setUser(userData);
  };

 const handleLogout = async () => {
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
