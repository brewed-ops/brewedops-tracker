// ============================================
// UTILITY FUNCTIONS
// ============================================

import { CATEGORIES } from './constants';

// Format amount with commas and decimal places
export const formatAmount = (amount, decimals = 2) => {
  if (typeof amount !== 'number' || isNaN(amount)) return '0.00';
  return amount.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// Format currency with symbol
export const formatCurrency = (amount, symbol = '₱') => {
  return `${symbol}${formatAmount(amount)}`;
};

// Get category style based on theme
export const getCategoryStyle = (type, isDark) => {
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

// Get category by value
export const getCategoryByValue = (value) => {
  return CATEGORIES.find(c => c.value === value) || CATEGORIES[CATEGORIES.length - 1];
};

// Get category color
export const getCategoryColor = (value) => {
  const category = getCategoryByValue(value);
  return category?.color || '#71717a';
};

// Format date to readable string
export const formatDate = (date, options = {}) => {
  const d = new Date(date);
  const defaultOptions = { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric',
    ...options 
  };
  return d.toLocaleDateString('en-US', defaultOptions);
};

// Format date for input fields (YYYY-MM-DD)
export const formatDateForInput = (date) => {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

// Format relative time (e.g., "2 days ago")
export const formatRelativeTime = (date) => {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now - then;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return formatDate(date);
};

// Check if date is today
export const isToday = (date) => {
  const today = new Date();
  const d = new Date(date);
  return d.toDateString() === today.toDateString();
};

// Check if date is this month
export const isThisMonth = (date) => {
  const today = new Date();
  const d = new Date(date);
  return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
};

// Check if date is this year
export const isThisYear = (date) => {
  const today = new Date();
  const d = new Date(date);
  return d.getFullYear() === today.getFullYear();
};

// Get month name
export const getMonthName = (date, short = false) => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { month: short ? 'short' : 'long' });
};

// Generate unique ID
export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Truncate text with ellipsis
export const truncateText = (text, maxLength = 50) => {
  if (!text || text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

// Capitalize first letter
export const capitalizeFirst = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Parse CSV string
export const parseCSV = (csvString) => {
  const lines = csvString.split('\n');
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  
  return lines.slice(1).filter(line => line.trim()).map(line => {
    const values = line.split(',');
    return headers.reduce((obj, header, index) => {
      obj[header] = values[index]?.trim() || '';
      return obj;
    }, {});
  });
};

// Validate email
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password strength
export const validatePassword = (password) => {
  const issues = [];
  if (password.length < 8) issues.push('At least 8 characters');
  if (!/[A-Z]/.test(password)) issues.push('One uppercase letter');
  if (!/[a-z]/.test(password)) issues.push('One lowercase letter');
  if (!/[0-9]/.test(password)) issues.push('One number');
  return issues;
};

// Group array by key
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const groupKey = typeof key === 'function' ? key(item) : item[key];
    (result[groupKey] = result[groupKey] || []).push(item);
    return result;
  }, {});
};

// Sum array by key
export const sumBy = (array, key) => {
  return array.reduce((sum, item) => {
    const value = typeof key === 'function' ? key(item) : item[key];
    return sum + (parseFloat(value) || 0);
  }, 0);
};

// Sort array by key
export const sortBy = (array, key, ascending = true) => {
  return [...array].sort((a, b) => {
    const aVal = typeof key === 'function' ? key(a) : a[key];
    const bVal = typeof key === 'function' ? key(b) : b[key];
    
    if (aVal < bVal) return ascending ? -1 : 1;
    if (aVal > bVal) return ascending ? 1 : -1;
    return 0;
  });
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function
export const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Deep clone object
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

// Check if object is empty
export const isEmpty = (obj) => {
  if (obj === null || obj === undefined) return true;
  if (Array.isArray(obj)) return obj.length === 0;
  if (typeof obj === 'object') return Object.keys(obj).length === 0;
  if (typeof obj === 'string') return obj.trim().length === 0;
  return false;
};

// Get initials from name
export const getInitials = (name, maxLength = 2) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, maxLength)
    .join('');
};

// Get first initial from name
export const getInitial = (name) => {
  if (!name) return '?';
  return name.charAt(0).toUpperCase();
};

// Calculate percentage
export const calculatePercentage = (value, total) => {
  if (!total || total === 0) return 0;
  return Math.round((value / total) * 100);
};

// Clamp number between min and max
export const clamp = (num, min, max) => {
  return Math.min(Math.max(num, min), max);
};

// Random number between min and max
export const randomBetween = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

// Sleep/delay function
export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Copy to clipboard
export const copyToClipboard = async (text) => {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return true;
  }
  // Fallback
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    return true;
  } finally {
    textArea.remove();
  }
};
