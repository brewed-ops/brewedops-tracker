// src/lib/utils.js
// Combined shadcn utilities + BrewedOps utilities

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// ============================================
// SHADCN UTILITY
// ============================================
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// ============================================
// BREWEDOPS UTILITIES
// ============================================

// Format currency amounts
// showSymbol defaults to FALSE - add currency symbol manually in JSX to avoid double symbols
export const formatAmount = (amount, currency = 'PHP', showSymbol = false) => {
  const num = Number(amount);
  if (amount === null || amount === undefined || isNaN(num)) {
    return showSymbol ? '₱0.00' : '0.00';
  }
  
  const symbols = {
    PHP: '₱',
    USD: '$',
    EUR: '€',
    GBP: '£',
    AUD: 'A$',
    CAD: 'C$',
    JPY: '¥',
    SGD: 'S$',
    HKD: 'HK$',
    NZD: 'NZ$',
  };
  
  const symbol = showSymbol ? (symbols[currency] || currency + ' ') : '';
  
  // For JPY, no decimal places
  if (currency === 'JPY') {
    return `${symbol}${Math.round(num).toLocaleString()}`;
  }
  
  return `${symbol}${num.toLocaleString(undefined, { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  })}`;
};

// Format number only (no currency symbol) - use this when you add ₱ manually
export const formatNumber = (amount) => {
  const num = Number(amount);
  if (amount === null || amount === undefined || isNaN(num)) return '0.00';
  return num.toLocaleString(undefined, { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  });
};

// Get initials from a name
export const getInitial = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Format date to readable string
export const formatDate = (date, options = {}) => {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  const defaultOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    ...options
  };
  
  return d.toLocaleDateString('en-US', defaultOptions);
};

// Format date to relative time (e.g., "2 hours ago")
export const formatRelativeTime = (date) => {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  const now = new Date();
  const diffMs = now - d;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffSecs < 60) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return formatDate(date);
};

// Capitalize first letter
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Truncate text with ellipsis
export const truncate = (str, length = 50) => {
  if (!str) return '';
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
};

// Generate a random ID
export const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Debounce function
export const debounce = (func, wait = 300) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Check if value is empty (null, undefined, empty string, empty array, empty object)
export const isEmpty = (value) => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string' && value.trim() === '') return true;
  if (Array.isArray(value) && value.length === 0) return true;
  if (typeof value === 'object' && Object.keys(value).length === 0) return true;
  return false;
};

// Parse currency string to number
export const parseCurrency = (str) => {
  if (typeof str === 'number') return str;
  if (!str) return 0;
  return parseFloat(str.replace(/[^0-9.-]+/g, '')) || 0;
};

// Calculate percentage
export const percentage = (value, total) => {
  if (!total || total === 0) return 0;
  return Math.round((value / total) * 100);
};

// Group array by key
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const groupKey = typeof key === 'function' ? key(item) : item[key];
    (result[groupKey] = result[groupKey] || []).push(item);
    return result;
  }, {});
};

// Sort array by key
export const sortBy = (array, key, direction = 'asc') => {
  return [...array].sort((a, b) => {
    const aVal = typeof key === 'function' ? key(a) : a[key];
    const bVal = typeof key === 'function' ? key(b) : b[key];
    
    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};

// Deep clone object
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

// Get nested object value safely
export const get = (obj, path, defaultValue = undefined) => {
  const keys = path.split('.');
  let result = obj;
  
  for (const key of keys) {
    if (result === null || result === undefined) return defaultValue;
    result = result[key];
  }
  
  return result ?? defaultValue;
};
