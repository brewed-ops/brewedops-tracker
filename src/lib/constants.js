// ============================================
// CONSTANTS - Extracted from App.jsx
// Updated with VAKita achievements and XP
// ============================================

export const CATEGORIES = [
  { value: 'utilities', label: 'Utilities', color: '#3b82f6' },
  { value: 'subscription', label: 'Subscription', color: '#8b5cf6' },
  { value: 'food', label: 'Food', color: '#f97316' },
  { value: 'shopping', label: 'Shopping', color: '#ec4899' },
  { value: 'healthcare', label: 'Healthcare', color: '#10b981' },
  { value: 'entertainment', label: 'Entertainment', color: '#f59e0b' },
  { value: 'other', label: 'Other', color: '#71717a' },
];

export const CURRENCIES = [
  { symbol: '₱', label: 'PHP (₱)' },
  { symbol: '$', label: 'USD ($)' },
  { symbol: '€', label: 'EUR (€)' },
  { symbol: '£', label: 'GBP (£)' },
  { symbol: '¥', label: 'JPY (¥)' },
  { symbol: '₹', label: 'INR (₹)' },
];

// Wallet type configurations (for adding new wallets)
export const WALLET_TYPES = [
  { type: 'cash', label: 'Cash', icon: '💵', color: '#22c55e', canAddMultiple: false },
  { type: 'ewallet', label: 'E-Wallet', icon: '📱', color: '#0066ff', canAddMultiple: true, 
    presets: [
      { name: 'GCash', icon: '📱', color: '#0066ff' },
      { name: 'Maya', icon: '💜', color: '#7c3aed' },
      { name: 'Coins.ph', icon: '🪙', color: '#f59e0b' },
      { name: 'GrabPay', icon: '🚗', color: '#22c55e' },
      { name: 'ShopeePay', icon: '🛒', color: '#f97316' },
      { name: 'PayPal', icon: '🅿️', color: '#0070ba' },
    ]
  },
  { type: 'bank', label: 'Bank Account', icon: '🏦', color: '#6366f1', canAddMultiple: true,
    presets: [
      { name: 'BDO', icon: '🏦', color: '#0033a0' },
      { name: 'BPI', icon: '🏦', color: '#c8102e' },
      { name: 'Metrobank', icon: '🏦', color: '#00529b' },
      { name: 'UnionBank', icon: '🏦', color: '#f7931e' },
      { name: 'Landbank', icon: '🏦', color: '#006f45' },
      { name: 'PNB', icon: '🏦', color: '#1e3a8a' },
      { name: 'Security Bank', icon: '🏦', color: '#e11d48' },
      { name: 'RCBC', icon: '🏦', color: '#dc2626' },
      { name: 'Chinabank', icon: '🏦', color: '#b91c1c' },
      { name: 'EastWest', icon: '🏦', color: '#0ea5e9' },
    ]
  },
  { type: 'credit', label: 'Credit Card', icon: '💳', color: '#ef4444', canAddMultiple: true,
    presets: [
      { name: 'Visa', icon: '💳', color: '#1a1f71' },
      { name: 'Mastercard', icon: '💳', color: '#eb001b' },
      { name: 'BDO Credit Card', icon: '💳', color: '#0033a0' },
      { name: 'BPI Credit Card', icon: '💳', color: '#c8102e' },
      { name: 'Metrobank Credit Card', icon: '💳', color: '#00529b' },
      { name: 'Security Bank Credit Card', icon: '💳', color: '#e11d48' },
      { name: 'Citi Credit Card', icon: '💳', color: '#003b70' },
      { name: 'RCBC Credit Card', icon: '💳', color: '#dc2626' },
    ]
  },
];

// Default wallets for new users
export const DEFAULT_WALLETS = [
  { id: 'cash', name: 'Cash', icon: '💵', color: '#22c55e', type: 'cash', editable: false },
];

// XP System Configuration (includes VAKita actions)
export const XP_CONFIG = {
  // Finance Tracker XP (existing)
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
  
  // VAKita XP - Client Management (NEW)
  addClient: 30,
  editClient: 5,
  firstClient: 100,
  fiveClients: 150,
  tenClients: 300,
  twentyClients: 500,
  
  // VAKita XP - Income Tracking (NEW)
  addIncome: 15,
  firstIncome: 50,
  incomeStreak: 25,
  income10k: 100,
  income50k: 200,
  income100k: 500,
  income500k: 1000,
  income1m: 2000,
  
  // VAKita XP - Invoicing (NEW)
  createInvoice: 20,
  firstInvoice: 75,
  sendInvoice: 10,
  invoicePaid: 40,
  tenInvoices: 200,
  fiftyInvoices: 500,
  
  // VAKita XP - Prospects/Leads (NEW)
  addProspect: 10,
  firstProspect: 25,
  tenProspects: 100,
  convertProspect: 50,
  fiveConversions: 200,
  
  // VAKita XP - Tax & Business Setup (NEW)
  setupTaxSettings: 50,
  addTinNumber: 30,
  calculateQuarterlyTax: 30,
  setupBusinessProfile: 40,
  connectGmail: 75,
};

// Level thresholds - XP needed to reach each level
export const LEVEL_THRESHOLDS = [
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
  60000,  // Level 20
  80000,  // Level 21
  100000, // Level 22
  125000, // Level 23
  150000, // Level 24
  200000, // Level 25
];

// Profile frame rewards - unlocked at specific levels
// Supports both CSS-based frames and image-based frames
// For image frames: use transparent PNG that overlays the avatar
// Recommended image size: 200x200px or 300x300px with transparent center
export const PROFILE_FRAMES = [
  // CSS-based frames (original)
  { level: 1, id: 'none', name: 'No Frame', type: 'css', border: 'none', glow: 'none', animation: null, gradient: null, image: null },
  { level: 2, id: 'bronze', name: 'Bronze Pulse', type: 'css', border: '3px solid #cd7f32', glow: '0 0 10px #cd7f32', animation: 'pulse-bronze', gradient: null, image: null },
  { level: 3, id: 'silver', name: 'Silver Wave', type: 'css', border: '3px solid #c0c0c0', glow: '0 0 12px #c0c0c0, 0 0 20px #e8e8e8', animation: 'shimmer-silver', gradient: null, image: null },
  { level: 5, id: 'gold', name: 'Golden Drip', type: 'css', border: '3px solid transparent', glow: '0 0 15px #ffd700, 0 0 25px #ffaa00', animation: 'drip-gold', gradient: 'linear-gradient(135deg, #ffd700, #ffaa00, #ffd700)', image: null },
  { level: 7, id: 'emerald', name: 'Matrix Code', type: 'css', border: '3px solid #00ff41', glow: '0 0 15px #00ff41, 0 0 30px #003d00', animation: 'matrix-glow', gradient: null, image: null },
  { level: 10, id: 'ice', name: 'Frozen Aura', type: 'css', border: '3px solid #00f7ff', glow: '0 0 20px #00f7ff, 0 0 40px #0080ff, 0 0 60px #00f7ff33', animation: 'ice-pulse', gradient: null, image: null },
  { level: 12, id: 'fire', name: '🔥 Flame Ring', type: 'css', border: '4px solid transparent', glow: '0 0 20px #ff4500, 0 0 40px #ff6600, 0 0 60px #ff000066', animation: 'fire-border', gradient: 'linear-gradient(45deg, #ff0000, #ff4500, #ff6600, #ff4500, #ff0000)', image: null },
  { level: 15, id: 'neon', name: 'Cyberpunk Neon', type: 'css', border: '3px solid transparent', glow: '0 0 10px #ff00ff, 0 0 20px #00ffff, 0 0 30px #ff00ff', animation: 'neon-flicker', gradient: 'linear-gradient(90deg, #ff00ff, #00ffff, #ff00ff)', image: null },
  { level: 18, id: 'galaxy', name: '🌌 Galaxy Swirl', type: 'css', border: '4px solid transparent', glow: '0 0 25px #9d4edd, 0 0 50px #4361ee, 0 0 75px #7209b7', animation: 'galaxy-rotate', gradient: 'conic-gradient(from 0deg, #7209b7, #3a0ca3, #4361ee, #4cc9f0, #4361ee, #3a0ca3, #7209b7)', image: null },
  { level: 20, id: 'rainbow', name: '🌈 RGB Gamer', type: 'css', border: '4px solid transparent', glow: '0 0 20px #ff0000, 0 0 40px #00ff00, 0 0 60px #0000ff', animation: 'rgb-rotate', gradient: 'conic-gradient(from 0deg, #ff0000, #ff8000, #ffff00, #00ff00, #00ffff, #0080ff, #8000ff, #ff0080, #ff0000)', image: null },
  
  // VAKita Special Frames (CSS)
  { level: 8, id: 'va_star', name: '⭐ VA Star', type: 'css', border: '3px solid #8b5cf6', glow: '0 0 15px #8b5cf6, 0 0 30px #6d28d9', animation: 'pulse-purple', gradient: null, image: null },
  { level: 16, id: 'money_maker', name: '💰 Money Maker', type: 'css', border: '4px solid transparent', glow: '0 0 20px #22c55e, 0 0 40px #16a34a', animation: 'money-glow', gradient: 'linear-gradient(135deg, #22c55e, #16a34a, #15803d)', image: null },
  
  // ============================================
  // IMAGE-BASED FRAMES (PNG overlays)
  // Upload your frames to Imgur, Cloudinary, or your own CDN
  // Replace the placeholder URLs with your actual frame images
  // ============================================
  
  // Gaming/Esports Style Frames
  { level: 4, id: 'gaming_basic', name: '🎮 Gamer I', type: 'image', image: 'https://i.imgur.com/PLACEHOLDER1.png', glow: '0 0 10px #6366f1', animation: null },
  { level: 9, id: 'gaming_pro', name: '🎮 Gamer Pro', type: 'image', image: 'https://i.imgur.com/PLACEHOLDER2.png', glow: '0 0 15px #8b5cf6', animation: 'pulse' },
  { level: 14, id: 'gaming_elite', name: '🎮 Gamer Elite', type: 'image', image: 'https://i.imgur.com/PLACEHOLDER3.png', glow: '0 0 20px #a855f7, 0 0 40px #7c3aed', animation: 'pulse' },
  
  // Cute/Kawaii Style Frames
  { level: 6, id: 'kawaii_hearts', name: '💕 Heart Frame', type: 'image', image: 'https://i.imgur.com/PLACEHOLDER4.png', glow: '0 0 12px #ec4899', animation: null },
  { level: 11, id: 'kawaii_stars', name: '✨ Starry Frame', type: 'image', image: 'https://i.imgur.com/PLACEHOLDER5.png', glow: '0 0 15px #fbbf24', animation: 'twinkle' },
  
  // Nature/Element Frames
  { level: 13, id: 'cherry_blossom', name: '🌸 Sakura', type: 'image', image: 'https://i.imgur.com/PLACEHOLDER6.png', glow: '0 0 15px #f472b6', animation: 'float' },
  { level: 17, id: 'lightning', name: '⚡ Thunder', type: 'image', image: 'https://i.imgur.com/PLACEHOLDER7.png', glow: '0 0 20px #facc15, 0 0 40px #eab308', animation: 'flash' },
  
  // Premium/Legendary Frames
  { level: 19, id: 'dragon', name: '🐉 Dragon Lord', type: 'image', image: 'https://i.imgur.com/PLACEHOLDER8.png', glow: '0 0 25px #ef4444, 0 0 50px #dc2626', animation: 'breathe' },
  { level: 22, id: 'cosmic', name: '🌌 Cosmic', type: 'image', image: 'https://i.imgur.com/PLACEHOLDER9.png', glow: '0 0 30px #8b5cf6, 0 0 60px #6366f1', animation: 'cosmic-pulse' },
  { level: 25, id: 'legendary_crown', name: '👑 Legendary', type: 'image', image: 'https://i.imgur.com/PLACEHOLDER10.png', glow: '0 0 30px #ffd700, 0 0 60px #f59e0b, 0 0 90px #fbbf2450', animation: 'legendary-glow' },
  
  // Filipino/VA Themed Frames
  { level: 21, id: 'ph_pride', name: '🇵🇭 Pinoy Pride', type: 'image', image: 'https://i.imgur.com/PLACEHOLDER11.png', glow: '0 0 15px #0038a8, 0 0 30px #ce1126', animation: null },
  { level: 23, id: 'va_champion', name: '🏆 VA Champion', type: 'image', image: 'https://i.imgur.com/PLACEHOLDER12.png', glow: '0 0 20px #8b5cf6, 0 0 40px #6d28d9', animation: 'champion-pulse' },
  { level: 24, id: 'boss_mode', name: '👔 Boss Mode', type: 'image', image: 'https://i.imgur.com/PLACEHOLDER13.png', glow: '0 0 25px #1e293b, 0 0 50px #334155', animation: null },
];

// Badge tier styling
export const BADGE_TIERS = {
  bronze: {
    name: 'Bronze',
    color: '#cd7f32',
    bgGradient: 'linear-gradient(135deg, #cd7f32, #8b4513)',
    glow: '0 0 10px rgba(205, 127, 50, 0.5)',
    xpReward: 50
  },
  silver: {
    name: 'Silver',
    color: '#c0c0c0',
    bgGradient: 'linear-gradient(135deg, #e8e8e8, #a8a8a8)',
    glow: '0 0 12px rgba(192, 192, 192, 0.6)',
    xpReward: 100
  },
  gold: {
    name: 'Gold',
    color: '#ffd700',
    bgGradient: 'linear-gradient(135deg, #ffd700, #ff8c00)',
    glow: '0 0 15px rgba(255, 215, 0, 0.6)',
    xpReward: 200
  },
  platinum: {
    name: 'Platinum',
    color: '#e5e4e2',
    bgGradient: 'linear-gradient(135deg, #e5e4e2, #8fbcbb)',
    glow: '0 0 18px rgba(229, 228, 226, 0.7)',
    xpReward: 350
  },
  diamond: {
    name: 'Diamond',
    color: '#b9f2ff',
    bgGradient: 'linear-gradient(135deg, #b9f2ff, #87ceeb, #00bfff)',
    glow: '0 0 20px rgba(185, 242, 255, 0.8), 0 0 30px rgba(135, 206, 235, 0.4)',
    xpReward: 500
  },
  legendary: {
    name: 'Legendary',
    color: '#ff6b35',
    bgGradient: 'linear-gradient(135deg, #ff6b35, #f7931e, #ffd700, #ff6b35)',
    glow: '0 0 25px rgba(255, 107, 53, 0.8), 0 0 40px rgba(247, 147, 30, 0.5)',
    xpReward: 1000,
    animated: true
  }
};

// Achievement categories (updated with VAKita categories)
export const ACHIEVEMENT_CATEGORIES = {
  entries: { name: 'Entry Master', icon: '📝', description: 'Track your expenses' },
  budget: { name: 'Budget Keeper', icon: '💰', description: 'Stay within budget' },
  streaks: { name: 'Consistency', icon: '🔥', description: 'Daily dedication' },
  milestones: { name: 'Milestones', icon: '🏆', description: 'Major achievements' },
  explorer: { name: 'Explorer', icon: '🧭', description: 'Try new features' },
  special: { name: 'Special', icon: '⭐', description: 'Rare achievements' },
  // VAKita Categories (NEW)
  va_business: { name: 'VA Business', icon: '💼', description: 'Grow your VA business' },
  clients: { name: 'Client Champion', icon: '👥', description: 'Master client management' },
  income: { name: 'Income Legend', icon: '💵', description: 'Grow your income' },
  invoicing: { name: 'Invoice Pro', icon: '🧾', description: 'Invoice like a pro' },
  tax: { name: 'Tax Savvy', icon: '📊', description: 'Stay tax compliant' },
};

// All achievements (merged existing + new VAKita achievements)
export const ACHIEVEMENTS = [
  // ============================================
  // EXISTING FINANCE TRACKER ACHIEVEMENTS
  // ============================================
  
  // Entry achievements
  { id: 'first_entry', name: 'First Step', description: 'Add your first expense entry', category: 'entries', tier: 'bronze', icon: '👣', requirement: { type: 'entries', count: 1 } },
  { id: 'entries_10', name: 'Getting Started', description: 'Log 10 expense entries', category: 'entries', tier: 'bronze', icon: '📊', requirement: { type: 'entries', count: 10 } },
  { id: 'entries_25', name: 'Tracker', description: 'Log 25 expense entries', category: 'entries', tier: 'silver', icon: '📈', requirement: { type: 'entries', count: 25 } },
  { id: 'entries_50', name: 'Dedicated Tracker', description: 'Log 50 expense entries', category: 'entries', tier: 'silver', icon: '📋', requirement: { type: 'entries', count: 50 } },
  { id: 'entries_100', name: 'Century Club', description: 'Log 100 expense entries', category: 'entries', tier: 'gold', icon: '💯', requirement: { type: 'entries', count: 100 } },
  { id: 'entries_250', name: 'Expense Expert', description: 'Log 250 expense entries', category: 'entries', tier: 'platinum', icon: '🎯', requirement: { type: 'entries', count: 250 } },
  { id: 'entries_500', name: 'Master Tracker', description: 'Log 500 expense entries', category: 'entries', tier: 'diamond', icon: '👑', requirement: { type: 'entries', count: 500 } },
  { id: 'entries_1000', name: 'Legendary Accountant', description: 'Log 1000 expense entries', category: 'entries', tier: 'legendary', icon: '🏛️', requirement: { type: 'entries', count: 1000 } },
  
  // Receipt achievements
  { id: 'first_receipt', name: 'Paper Trail', description: 'Upload your first receipt', category: 'entries', tier: 'bronze', icon: '🧾', requirement: { type: 'receipts', count: 1 } },
  { id: 'receipts_10', name: 'Receipt Collector', description: 'Upload 10 receipts', category: 'entries', tier: 'silver', icon: '📎', requirement: { type: 'receipts', count: 10 } },
  { id: 'receipts_50', name: 'Documentation Pro', description: 'Upload 50 receipts', category: 'entries', tier: 'gold', icon: '📁', requirement: { type: 'receipts', count: 50 } },
  { id: 'receipts_100', name: 'Receipt Scanner Pro', description: 'Upload 100 receipts', category: 'entries', tier: 'diamond', icon: '🗄️', requirement: { type: 'receipts', count: 100 } },
  
  // Budget achievements
  { id: 'first_budget', name: 'Budget Beginner', description: 'Set your first monthly budget', category: 'budget', tier: 'bronze', icon: '🎯', requirement: { type: 'budget_set', count: 1 } },
  { id: 'under_budget_1', name: 'Budget Keeper', description: 'Stay under budget for 1 month', category: 'budget', tier: 'silver', icon: '✅', requirement: { type: 'under_budget_months', count: 1 } },
  { id: 'under_budget_3', name: 'Budget Master', description: 'Stay under budget for 3 months straight', category: 'budget', tier: 'gold', icon: '🏅', requirement: { type: 'under_budget_months', count: 3 } },
  { id: 'under_budget_6', name: 'Financial Discipline', description: 'Stay under budget for 6 months straight', category: 'budget', tier: 'platinum', icon: '💎', requirement: { type: 'under_budget_months', count: 6 } },
  { id: 'under_budget_12', name: 'Year of Savings', description: 'Stay under budget for 12 months straight', category: 'budget', tier: 'legendary', icon: '🌟', requirement: { type: 'under_budget_months', count: 12 } },
  
  // Streak achievements
  { id: 'streak_3', name: 'Getting Warmed Up', description: 'Log expenses 3 days in a row', category: 'streaks', tier: 'bronze', icon: '🔥', requirement: { type: 'login_streak', count: 3 } },
  { id: 'streak_7', name: 'Week Warrior', description: 'Log expenses 7 days in a row', category: 'streaks', tier: 'silver', icon: '📅', requirement: { type: 'login_streak', count: 7 } },
  { id: 'streak_14', name: 'Two Week Champion', description: 'Log expenses 14 days in a row', category: 'streaks', tier: 'gold', icon: '⚡', requirement: { type: 'login_streak', count: 14 } },
  { id: 'streak_30', name: 'Monthly Master', description: 'Log expenses 30 days in a row', category: 'streaks', tier: 'platinum', icon: '🌙', requirement: { type: 'login_streak', count: 30 } },
  { id: 'streak_60', name: 'Unstoppable', description: 'Log expenses 60 days in a row', category: 'streaks', tier: 'diamond', icon: '💫', requirement: { type: 'login_streak', count: 60 } },
  { id: 'streak_100', name: 'Legendary Dedication', description: 'Log expenses 100 days in a row', category: 'streaks', tier: 'legendary', icon: '🔱', requirement: { type: 'login_streak', count: 100 } },
  
  // Category exploration
  { id: 'all_categories', name: 'Category Explorer', description: 'Use all expense categories', category: 'explorer', tier: 'silver', icon: '🧭', requirement: { type: 'categories_used', count: 7 } },
  { id: 'big_spender', name: 'Big Purchase', description: 'Log an expense over ₱10,000', category: 'explorer', tier: 'silver', icon: '💸', requirement: { type: 'single_expense', amount: 10000 } },
  { id: 'whale', name: 'Whale Alert', description: 'Log an expense over ₱50,000', category: 'explorer', tier: 'gold', icon: '🐋', requirement: { type: 'single_expense', amount: 50000 } },
  
  // XP & Level achievements
  { id: 'level_5', name: 'Rising Star', description: 'Reach Level 5', category: 'milestones', tier: 'silver', icon: '⭐', requirement: { type: 'level', count: 5 } },
  { id: 'level_10', name: 'Established', description: 'Reach Level 10', category: 'milestones', tier: 'gold', icon: '🌟', requirement: { type: 'level', count: 10 } },
  { id: 'level_15', name: 'Veteran', description: 'Reach Level 15', category: 'milestones', tier: 'platinum', icon: '✨', requirement: { type: 'level', count: 15 } },
  { id: 'level_20', name: 'Legend', description: 'Reach Level 20', category: 'milestones', tier: 'legendary', icon: '👑', requirement: { type: 'level', count: 20 } },
  
  // Total spending milestones
  { id: 'total_10k', name: 'Ten Thousand', description: 'Track ₱10,000 in total expenses', category: 'milestones', tier: 'bronze', icon: '📊', requirement: { type: 'total_spent', amount: 10000 } },
  { id: 'total_50k', name: 'Fifty Thousand', description: 'Track ₱50,000 in total expenses', category: 'milestones', tier: 'silver', icon: '📈', requirement: { type: 'total_spent', amount: 50000 } },
  { id: 'total_100k', name: 'Hundred Grand', description: 'Track ₱100,000 in total expenses', category: 'milestones', tier: 'gold', icon: '💰', requirement: { type: 'total_spent', amount: 100000 } },
  { id: 'total_500k', name: 'Half Million', description: 'Track ₱500,000 in total expenses', category: 'milestones', tier: 'platinum', icon: '🏦', requirement: { type: 'total_spent', amount: 500000 } },
  { id: 'total_1m', name: 'Millionaire Tracker', description: 'Track ₱1,000,000 in total expenses', category: 'milestones', tier: 'legendary', icon: '💎', requirement: { type: 'total_spent', amount: 1000000 } },
  
  // Special/Time-based
  { id: 'night_owl', name: 'Night Owl', description: 'Log an expense after midnight', category: 'special', tier: 'bronze', icon: '🦉', requirement: { type: 'time_based', condition: 'after_midnight' } },
  { id: 'early_bird', name: 'Early Bird', description: 'Log an expense before 6 AM', category: 'special', tier: 'bronze', icon: '🐦', requirement: { type: 'time_based', condition: 'before_6am' } },
  { id: 'weekend_warrior', name: 'Weekend Warrior', description: 'Log expenses on 5 weekends', category: 'special', tier: 'silver', icon: '🎉', requirement: { type: 'weekend_logs', count: 5 } },

  // ============================================
  // NEW VAKITA ACHIEVEMENTS
  // ============================================
  
  // VA Business Setup
  { id: 'va_journey_begins', name: 'VA Journey Begins', description: 'Set up your VAKita profile', category: 'va_business', tier: 'bronze', icon: '🚀', requirement: { type: 'vakita_profile_setup' } },
  { id: 'gmail_connected', name: 'Email Pro', description: 'Connect your Gmail account', category: 'va_business', tier: 'silver', icon: '📧', requirement: { type: 'gmail_connected' } },
  { id: 'tax_setup', name: 'Tax Ready', description: 'Configure your BIR tax settings', category: 'va_business', tier: 'silver', icon: '📋', requirement: { type: 'tax_settings_configured' } },
  { id: 'first_quarter_tax', name: 'Tax Season Ready', description: 'Calculate your first quarterly tax', category: 'va_business', tier: 'gold', icon: '🧮', requirement: { type: 'quarterly_tax_calculated' } },
  { id: 'full_setup', name: 'Business Ready', description: 'Complete full VAKita setup (profile, tax, Gmail)', category: 'va_business', tier: 'gold', icon: '💼', requirement: { type: 'full_vakita_setup' } },
  
  // Client/Prospect Management
  { id: 'first_prospect', name: 'Lead Hunter', description: 'Add your first prospect', category: 'clients', tier: 'bronze', icon: '🎯', requirement: { type: 'prospects', count: 1 } },
  { id: 'prospects_10', name: 'Pipeline Builder', description: 'Add 10 prospects to your pipeline', category: 'clients', tier: 'silver', icon: '📋', requirement: { type: 'prospects', count: 10 } },
  { id: 'prospects_25', name: 'Lead Machine', description: 'Add 25 prospects', category: 'clients', tier: 'gold', icon: '🔥', requirement: { type: 'prospects', count: 25 } },
  { id: 'prospects_50', name: 'Prospecting Pro', description: 'Add 50 prospects', category: 'clients', tier: 'platinum', icon: '⚡', requirement: { type: 'prospects', count: 50 } },
  { id: 'first_client', name: 'Client Getter', description: 'Add your first client', category: 'clients', tier: 'bronze', icon: '🤝', requirement: { type: 'clients', count: 1 } },
  { id: 'clients_5', name: 'Growing Business', description: 'Have 5 clients', category: 'clients', tier: 'silver', icon: '📈', requirement: { type: 'clients', count: 5 } },
  { id: 'clients_10', name: 'Client Magnet', description: 'Have 10 clients', category: 'clients', tier: 'gold', icon: '🧲', requirement: { type: 'clients', count: 10 } },
  { id: 'clients_20', name: 'Agency Mode', description: 'Have 20 clients', category: 'clients', tier: 'platinum', icon: '🏢', requirement: { type: 'clients', count: 20 } },
  { id: 'clients_50', name: 'Client Empire', description: 'Have 50 clients', category: 'clients', tier: 'legendary', icon: '👑', requirement: { type: 'clients', count: 50 } },
  { id: 'first_conversion', name: 'Closer', description: 'Convert your first prospect to client', category: 'clients', tier: 'silver', icon: '✨', requirement: { type: 'prospect_converted' } },
  { id: 'conversions_5', name: 'Deal Maker', description: 'Convert 5 prospects to clients', category: 'clients', tier: 'gold', icon: '💫', requirement: { type: 'prospects_converted', count: 5 } },
  { id: 'conversions_10', name: 'Conversion King', description: 'Convert 10 prospects to clients', category: 'clients', tier: 'platinum', icon: '🏆', requirement: { type: 'prospects_converted', count: 10 } },
  
  // Income Tracking
  { id: 'first_income', name: 'First Payday', description: 'Record your first income', category: 'income', tier: 'bronze', icon: '💰', requirement: { type: 'income_entries', count: 1 } },
  { id: 'income_entries_10', name: 'Steady Income', description: 'Record 10 income entries', category: 'income', tier: 'silver', icon: '💵', requirement: { type: 'income_entries', count: 10 } },
  { id: 'income_entries_50', name: 'Income Machine', description: 'Record 50 income entries', category: 'income', tier: 'gold', icon: '🤑', requirement: { type: 'income_entries', count: 50 } },
  { id: 'income_entries_100', name: 'Money Master', description: 'Record 100 income entries', category: 'income', tier: 'platinum', icon: '💎', requirement: { type: 'income_entries', count: 100 } },
  { id: 'total_income_10k', name: '10K Club', description: 'Reach ₱10,000 total income', category: 'income', tier: 'bronze', icon: '🎉', requirement: { type: 'total_income', amount: 10000 } },
  { id: 'total_income_50k', name: '50K Milestone', description: 'Reach ₱50,000 total income', category: 'income', tier: 'silver', icon: '🌟', requirement: { type: 'total_income', amount: 50000 } },
  { id: 'total_income_100k', name: '100K Achiever', description: 'Reach ₱100,000 total income', category: 'income', tier: 'gold', icon: '💎', requirement: { type: 'total_income', amount: 100000 } },
  { id: 'total_income_500k', name: 'Half Million Hero', description: 'Reach ₱500,000 total income', category: 'income', tier: 'platinum', icon: '🏆', requirement: { type: 'total_income', amount: 500000 } },
  { id: 'total_income_1m', name: 'Millionaire VA', description: 'Reach ₱1,000,000 total income', category: 'income', tier: 'legendary', icon: '👑', requirement: { type: 'total_income', amount: 1000000 } },
  { id: 'monthly_income_streak', name: 'Consistent Earner', description: 'Record income for 3 consecutive months', category: 'income', tier: 'gold', icon: '📊', requirement: { type: 'monthly_income_streak', count: 3 } },
  { id: 'income_streak_6', name: 'Half Year Hustle', description: 'Record income for 6 consecutive months', category: 'income', tier: 'platinum', icon: '🔥', requirement: { type: 'monthly_income_streak', count: 6 } },
  { id: 'income_streak_12', name: 'Year of Earnings', description: 'Record income for 12 consecutive months', category: 'income', tier: 'legendary', icon: '🏅', requirement: { type: 'monthly_income_streak', count: 12 } },
  
  // Invoicing
  { id: 'first_invoice', name: 'Invoice Creator', description: 'Create your first invoice', category: 'invoicing', tier: 'bronze', icon: '📄', requirement: { type: 'invoices_created', count: 1 } },
  { id: 'invoices_10', name: 'Invoice Regular', description: 'Create 10 invoices', category: 'invoicing', tier: 'silver', icon: '📑', requirement: { type: 'invoices_created', count: 10 } },
  { id: 'invoices_50', name: 'Billing Expert', description: 'Create 50 invoices', category: 'invoicing', tier: 'gold', icon: '📚', requirement: { type: 'invoices_created', count: 50 } },
  { id: 'invoices_100', name: 'Invoice Legend', description: 'Create 100 invoices', category: 'invoicing', tier: 'platinum', icon: '🏛️', requirement: { type: 'invoices_created', count: 100 } },
  { id: 'first_paid_invoice', name: 'Getting Paid', description: 'Mark your first invoice as paid', category: 'invoicing', tier: 'bronze', icon: '✅', requirement: { type: 'invoices_paid', count: 1 } },
  { id: 'paid_invoices_10', name: 'Payment Pro', description: 'Have 10 paid invoices', category: 'invoicing', tier: 'silver', icon: '💳', requirement: { type: 'invoices_paid', count: 10 } },
  { id: 'paid_invoices_50', name: 'Collection Master', description: 'Have 50 paid invoices', category: 'invoicing', tier: 'gold', icon: '💰', requirement: { type: 'invoices_paid', count: 50 } },
  { id: 'invoice_streak', name: 'Billing Streak', description: 'Send invoices 3 months in a row', category: 'invoicing', tier: 'gold', icon: '🔥', requirement: { type: 'monthly_invoice_streak', count: 3 } },
  { id: 'first_email_invoice', name: 'Email Sender', description: 'Send your first invoice via email', category: 'invoicing', tier: 'silver', icon: '📧', requirement: { type: 'invoice_emailed' } },
  
  // Tax
  { id: 'tin_added', name: 'TIN Ready', description: 'Add your TIN number', category: 'tax', tier: 'bronze', icon: '🔢', requirement: { type: 'tin_added' } },
  { id: 'tax_type_selected', name: 'Tax Aware', description: 'Choose your tax computation type', category: 'tax', tier: 'bronze', icon: '📝', requirement: { type: 'tax_type_selected' } },
  { id: 'q1_tax', name: 'Q1 Done', description: 'Calculate Q1 taxes', category: 'tax', tier: 'silver', icon: '1️⃣', requirement: { type: 'quarterly_tax', quarter: 1 } },
  { id: 'q2_tax', name: 'Q2 Done', description: 'Calculate Q2 taxes', category: 'tax', tier: 'silver', icon: '2️⃣', requirement: { type: 'quarterly_tax', quarter: 2 } },
  { id: 'q3_tax', name: 'Q3 Done', description: 'Calculate Q3 taxes', category: 'tax', tier: 'silver', icon: '3️⃣', requirement: { type: 'quarterly_tax', quarter: 3 } },
  { id: 'q4_tax', name: 'Q4 Done', description: 'Calculate Q4 taxes', category: 'tax', tier: 'silver', icon: '4️⃣', requirement: { type: 'quarterly_tax', quarter: 4 } },
  { id: 'all_quarters', name: 'Full Year Compliant', description: 'Calculate taxes for all 4 quarters', category: 'tax', tier: 'gold', icon: '📅', requirement: { type: 'all_quarters_calculated' } },
  { id: 'tax_two_years', name: 'Tax Veteran', description: 'Complete 2 full years of tax calculations', category: 'tax', tier: 'platinum', icon: '🎖️', requirement: { type: 'tax_years_completed', count: 2 } },
];

// Weekly challenges (includes VAKita challenges)
export const WEEKLY_CHALLENGES = [
  // Existing Finance Tracker challenges
  { id: 'log_7_days', name: 'Daily Logger', description: 'Log at least one expense every day this week', goal: 7, type: 'daily_logs', xpReward: 100, icon: '📝' },
  { id: 'under_budget_week', name: 'Budget Week', description: 'Stay under daily budget every day this week', goal: 7, type: 'budget_days', xpReward: 150, icon: '💰' },
  { id: 'receipt_collector', name: 'Receipt Hunter', description: 'Upload 5 receipts this week', goal: 5, type: 'receipts', xpReward: 75, icon: '🧾' },
  { id: 'category_variety', name: 'Variety Pack', description: 'Use 5 different categories this week', goal: 5, type: 'categories', xpReward: 80, icon: '🗂️' },
  { id: 'note_taker', name: 'Detail Master', description: 'Add notes to 10 entries this week', goal: 10, type: 'notes', xpReward: 60, icon: '📋' },
  
  // VAKita Weekly Challenges (NEW)
  { id: 'client_outreach', name: 'Client Outreach', description: 'Add 3 new prospects this week', goal: 3, type: 'new_prospects', xpReward: 125, icon: '🎯' },
  { id: 'invoice_week', name: 'Invoice Week', description: 'Create 2 invoices this week', goal: 2, type: 'invoices_created', xpReward: 100, icon: '📄' },
  { id: 'income_tracker', name: 'Income Tracker', description: 'Log 3 income entries this week', goal: 3, type: 'income_entries', xpReward: 100, icon: '💵' },
  { id: 'follow_up_week', name: 'Follow-Up Week', description: 'Update status on 5 prospects', goal: 5, type: 'prospect_updates', xpReward: 80, icon: '📞' },
  { id: 'client_care', name: 'Client Care', description: 'Log activity with 3 different clients', goal: 3, type: 'client_activities', xpReward: 90, icon: '💼' },
];
