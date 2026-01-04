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
import PDFMerge from './components/PDFMerge';
import PDFSplit from './components/PDFSplit';
import ImageToPDF from './components/ImageToPDF';
import VideoCompressor from './components/VideoCompressor';
import VideoTrimmer from './components/VideoTrimmer';
import BrewedNotes from './components/BrewedNotes';
import FindReplace from './components/FindReplace';
import CaseConverter from './components/CaseConverter';
import WordCounter from './components/WordCounter';
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
// ICON CLOUD COMPONENT - Using Magic UI
// ============================================
// Note: Make sure you have installed: npx shadcn@latest add "https://magicui.design/r/icon-cloud.json"
import { IconCloud } from "@/components/ui/icon-cloud";

const IconCloudDemo = () => {
  // Maximum recognizable brand/tool icons
  const slugs = [
    // Design & Creative
    "adobephotoshop",
    "adobeillustrator",
    "adobepremierepro",
    "adobeaftereffects",
    "adobelightroom",
    "adobexd",
    "figma",
    "canva",
    "sketch",
    // Productivity & Notes
    "notion",
    "evernote",
    "todoist",
    "trello",
    "asana",
    "slack",
    "discord",
    "zoom",
    "microsoftteams",
    // Development & Code
    "github",
    "gitlab",
    "visualstudiocode",
    "react",
    "nodedotjs",
    "javascript",
    "typescript",
    "html5",
    "css3",
    // Cloud & Storage
    "googledrive",
    "dropbox",
    "icloud",
    "amazonaws",
    "googlecloud",
    "firebase",
    // Office & Documents
    "microsoftword",
    "microsoftexcel",
    "microsoftpowerpoint",
    "adobeacrobatreader",
    "googledocs",
    "googlesheets",
    // Finance & Business
    "stripe",
    "paypal",
    "shopify",
    "quickbooks",
    // Social & Communication
    "gmail",
    "whatsapp",
    "telegram",
    "linkedin",
    "twitter",
    "instagram",
    "facebook",
    "youtube",
    "tiktok",
    // Other Tools
    "zapier",
    "wordpress",
    "wix",
    "squarespace",
    "mailchimp",
    "hubspot",
    "salesforce",
    "monday",
    "clickup",
    "airtable",
  ];

  const images = slugs.map(
    (slug) => `https://cdn.simpleicons.org/${slug}/${slug}`
  );

  return (
    <div className="relative flex size-full items-center justify-center overflow-hidden">
      <IconCloud images={images} />
    </div>
  );
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

  // All 18 tools organized by category
  const toolCategories = [
    {
      name: 'Productivity',
      color: '#004AAC',
      tools: [
        { icon: '💰', title: 'Finance Tracker', desc: 'Track income, expenses, invoices & BIR taxes' },
        { icon: '🎧', title: 'VAKita', desc: 'VA earnings calculator & tracker' },
        { icon: '✅', title: 'Task Manager', desc: 'Organize tasks & to-dos' },
        { icon: '📝', title: 'Brewed Notes', desc: 'Rich text notes with formatting' },
      ]
    },
    {
      name: 'Image Tools',
      color: '#8b5cf6',
      tools: [
        { icon: '🖼️', title: 'BG Remover', desc: 'Remove image backgrounds' },
        { icon: '✂️', title: 'Image Cropper', desc: 'Crop & resize images' },
        { icon: '📐', title: 'Image Resizer', desc: 'Resize to any dimensions' },
        { icon: '📦', title: 'Image Compressor', desc: 'Compress without quality loss' },
        { icon: '🔄', title: 'Image Converter', desc: 'Convert between formats' },
        { icon: '🎨', title: 'Color Picker', desc: 'Extract colors from images' },
        { icon: '📄', title: 'Image to PDF', desc: 'Convert images to PDF' },
      ]
    },
    {
      name: 'Video Tools',
      color: '#ef4444',
      tools: [
        { icon: '🎬', title: 'Video Compressor', desc: 'Compress video files' },
        { icon: '✂️', title: 'Video Trimmer', desc: 'Trim & cut videos' },
      ]
    },
    {
      name: 'Document Tools',
      color: '#22c55e',
      tools: [
        { icon: '📑', title: 'PDF Editor', desc: 'Edit PDF documents' },
        { icon: '📚', title: 'PDF Merge', desc: 'Combine multiple PDFs' },
        { icon: '📂', title: 'PDF Split', desc: 'Split PDFs into parts' },
      ]
    },
    {
      name: 'Other Tools',
      color: '#f59e0b',
      tools: [
        { icon: '📱', title: 'QR Generator', desc: 'Create QR codes' },
        { icon: '🔍', title: 'Find & Replace', desc: 'Search & replace text' },
        { icon: '🔠', title: 'Case Converter', desc: 'Change text case' },
        { icon: '🔢', title: 'Word Counter', desc: 'Count words & characters' },
      ]
    }
  ];

  // Flatten for simple feature display
  const features = toolCategories.flatMap(cat => cat.tools);



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
          <span style={{ fontSize: '13px', color: BRAND.blue, fontWeight: '600', fontFamily: FONTS.body }}>☕ 18 Free Tools for Filipino VAs & Freelancers</span>
        </div>
        
        <h1 style={{ fontSize: isSmall ? '32px' : '52px', fontWeight: '800', color: isDark ? '#fff' : BRAND.brown, margin: '0 0 16px', lineHeight: '1.1', letterSpacing: '-0.03em', fontFamily: FONTS.heading }}>
          Your All-in-One
          <br />
          <span style={{ color: BRAND.blue }}>Productivity Hub</span>
        </h1>
        
        <p style={{ fontSize: isSmall ? '16px' : '18px', color: theme.textMuted, margin: '0 0 36px', lineHeight: '1.7', maxWidth: '650px', marginLeft: 'auto', marginRight: 'auto', fontFamily: FONTS.body }}>
          Finance tracking, image editing, document tools, and more — everything a Filipino VA and freelancer needs to manage their business, all in one powerful platform.
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
            BrewedOps is a comprehensive productivity platform with <strong style={{ color: isDark ? '#fff' : BRAND.brown }}>18 free tools</strong> built specifically for 
            Filipino Virtual Assistants and Freelancers. From financial tracking and tax calculations to image editing, 
            PDF manipulation, and productivity tools — everything you need to run your freelance business professionally.
          </p>
          
          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: isSmall ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
            {[
              { value: '18', label: 'Free Tools' },
              { value: '5', label: 'Categories' },
              { value: '100%', label: 'Free' },
              { value: '24/7', label: 'Available' },
            ].map((stat, i) => (
              <div key={i} style={{ padding: '20px 16px', backgroundColor: isDark ? theme.cardBg : '#fff', borderRadius: '12px', border: '1px solid ' + theme.cardBorder }}>
                <div style={{ fontSize: '28px', fontWeight: '800', color: BRAND.blue, marginBottom: '4px', fontFamily: FONTS.heading }}>{stat.value}</div>
                <div style={{ fontSize: '13px', color: theme.textMuted, fontWeight: '500', fontFamily: FONTS.body }}>{stat.label}</div>
              </div>
            ))}
          </div>
          
          {/* Icon Cloud */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            marginBottom: '40px',
            minHeight: isSmall ? '280px' : '350px'
          }}>
            <div style={{ position: 'relative', maxWidth: '500px', width: '100%' }}>
              <IconCloudDemo />
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: isSmall ? '1fr' : 'repeat(2, 1fr)', gap: '20px', textAlign: 'left' }}>
            <div style={{ padding: '24px', backgroundColor: isDark ? theme.cardBg : '#fff', borderRadius: '12px', border: '1px solid ' + theme.cardBorder }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{ width: '44px', height: '44px', backgroundColor: isDark ? BRAND.blue + '20' : BRAND.blue + '15', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '22px' }}>💼</span>
                </div>
                <h3 style={{ fontSize: '17px', fontWeight: '600', color: isDark ? '#fff' : BRAND.brown, margin: 0, fontFamily: FONTS.heading }}>Productivity Suite</h3>
              </div>
              <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0, lineHeight: '1.6', fontFamily: FONTS.body }}>
                Finance Tracker with multi-currency support, VAKita earnings calculator, Task Manager for organization, 
                and Brewed Notes with rich text formatting — all synced to your account.
              </p>
            </div>
            
            <div style={{ padding: '24px', backgroundColor: isDark ? theme.cardBg : '#fff', borderRadius: '12px', border: '1px solid ' + theme.cardBorder }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{ width: '44px', height: '44px', backgroundColor: isDark ? '#8b5cf6' + '20' : '#8b5cf6' + '15', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '22px' }}>🛠️</span>
                </div>
                <h3 style={{ fontSize: '17px', fontWeight: '600', color: isDark ? '#fff' : BRAND.brown, margin: 0, fontFamily: FONTS.heading }}>Media & Document Tools</h3>
              </div>
              <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0, lineHeight: '1.6', fontFamily: FONTS.body }}>
                7 image tools (BG remover, cropper, resizer, compressor, converter, color picker, image to PDF), 
                2 video tools, 3 PDF tools, plus QR generator and text utilities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* All 18 Tools */}
      <section style={{ padding: isSmall ? '48px 16px' : '64px 32px', borderBottom: '1px solid ' + theme.cardBorder, backgroundColor: isDark ? theme.bg : '#fff' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{ fontSize: isSmall ? '24px' : '36px', fontWeight: '700', color: isDark ? '#fff' : BRAND.brown, textAlign: 'center', margin: '0 0 12px', letterSpacing: '-0.02em', fontFamily: FONTS.heading }}>
            All 18 Tools Included
          </h2>
          <p style={{ fontSize: '15px', color: theme.textMuted, textAlign: 'center', margin: '0 0 40px', fontFamily: FONTS.body }}>
            Everything you need to run your freelance business efficiently
          </p>
          
          {/* Tools by Category */}
          {toolCategories.map((category, catIdx) => (
            <div key={catIdx} style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: category.color }} />
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: isDark ? '#fff' : BRAND.brown, margin: 0, fontFamily: FONTS.heading }}>
                  {category.name}
                  <span style={{ fontSize: '13px', fontWeight: '400', color: theme.textMuted, marginLeft: '8px', fontFamily: FONTS.body }}>
                    ({category.tools.length} tools)
                  </span>
                </h3>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: isSmall ? '1fr' : isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: '12px' }}>
                {category.tools.map((tool, toolIdx) => (
                  <div key={toolIdx} style={{ 
                    backgroundColor: isDark ? theme.cardBg : '#fff', 
                    borderRadius: '10px', 
                    border: '1px solid ' + theme.cardBorder, 
                    padding: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    transition: 'all 0.2s ease'
                  }}>
                    <div style={{ 
                      width: '40px', 
                      height: '40px', 
                      backgroundColor: category.color + '15', 
                      borderRadius: '10px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <span style={{ fontSize: '20px' }}>{tool.icon}</span>
                    </div>
                    <div>
                      <h4 style={{ fontSize: '14px', fontWeight: '600', color: isDark ? '#fff' : BRAND.brown, margin: '0 0 2px', fontFamily: FONTS.heading }}>{tool.title}</h4>
                      <p style={{ fontSize: '12px', color: theme.textMuted, margin: 0, fontFamily: FONTS.body }}>{tool.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: isSmall ? '48px 20px' : '64px 32px', maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{ fontSize: isSmall ? '24px' : '36px', fontWeight: '700', color: isDark ? '#fff' : BRAND.brown, textAlign: 'center', margin: '0 0 40px', letterSpacing: '-0.02em', fontFamily: FONTS.heading }}>
          How It Works
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {[
            { num: '1', title: 'Sign Up for Free', desc: 'Create your account in seconds and get instant access to all 18 tools' },
            { num: '2', title: 'Choose Your Tools', desc: 'Use Finance Tracker for income/expenses, image tools for editing, PDF tools for documents — mix and match' },
            { num: '3', title: 'Boost Your Productivity', desc: 'Manage your entire freelance business from one platform — track finances, organize tasks, process files' },
            { num: '4', title: 'Grow Your Business', desc: 'Send professional invoices, calculate taxes, and watch your freelance business thrive' },
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
            Ready to Boost Your Productivity?
          </h2>
          <p style={{ fontSize: '15px', color: '#d4d4d8', margin: '0 0 24px', fontFamily: FONTS.body }}>
            Join Filipino VAs and freelancers using all 18 tools to manage their business smarter
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
        <p style={{ fontSize: '13px', color: theme.textMuted, margin: 0 }}>© {new Date().getFullYear()} BrewedOps by Kenneth V.</p>
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
          redirectTo: 'https://tools.brewedops.com',
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
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: 'https://tools.brewedops.com/reset-password' });
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
            <img src="https://i.imgur.com/R52jwPv.png" alt="Logo" style={{ width: '64px', height: '64px', borderRadius: '14px', marginBottom: '16px', display: 'block', marginLeft: 'auto', marginRight: 'auto' }} />
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
  window.location.href = 'https://tools.brewedops.com';
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
    return <FinanceTracker 
  user={user} 
  onLogout={handleLogout} 
  isDark={isDark} 
  setIsDark={setIsDark} 
/>;
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
      <Route path="/brewednotes" element={<LoginPage onLogin={handleLogin} onBack={() => navigate('/')} isDark={isDark} setIsDark={setIsDark} initialMode="login" />} />
      <Route path="/pdfeditor" element={<PDFEditor isDark={isDark} />} />
      <Route path="/bgremover" element={<BackgroundRemover isDark={isDark} />} />
      <Route path="/imagecropper" element={<ImageCropper isDark={isDark} />} />
      <Route path="/imageconverter" element={<ImageConverter isDark={isDark} />} />
      <Route path="/imagecompressor" element={<ImageCompressor isDark={isDark} />} />
      <Route path="/imageresizer" element={<ImageResizer isDark={isDark} />} />
      <Route path="/qrgenerator" element={<QRGenerator isDark={isDark} />} />
      <Route path="/colorpicker" element={<ColorPicker isDark={isDark} />} />
      <Route path="/pdfmerge" element={<PDFMerge isDark={isDark} />} />
      <Route path="/pdfsplit" element={<PDFSplit isDark={isDark} />} />
      <Route path="/imagetopdf" element={<ImageToPDF isDark={isDark} />} />
      <Route path="/videocompressor" element={<VideoCompressor isDark={isDark} />} />
      <Route path="/videotrimmer" element={<VideoTrimmer isDark={isDark} />} />
      <Route path="/findreplace" element={<FindReplace isDark={isDark} />} />
      <Route path="/caseconverter" element={<CaseConverter isDark={isDark} />} />
      <Route path="/wordcounter" element={<WordCounter isDark={isDark} />} />
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
