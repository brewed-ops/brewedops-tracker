// ============================================
// CONSTANTS - Extracted from App.jsx
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

// XP System Configuration
export const XP_CONFIG = {
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
  60000,
];

// Profile frame rewards - unlocked at specific levels (Gen Z/Gen Alpha aesthetic)
export const PROFILE_FRAMES = [
  { level: 1, id: 'none', name: 'No Frame', border: 'none', glow: 'none', animation: null, gradient: null },
  { level: 2, id: 'bronze', name: 'Bronze Pulse', border: '3px solid #cd7f32', glow: '0 0 10px #cd7f32', animation: 'pulse-bronze', gradient: null },
  { level: 3, id: 'silver', name: 'Silver Wave', border: '3px solid #c0c0c0', glow: '0 0 12px #c0c0c0, 0 0 20px #e8e8e8', animation: 'shimmer-silver', gradient: null },
  { level: 5, id: 'gold', name: 'Golden Drip', border: '3px solid transparent', glow: '0 0 15px #ffd700, 0 0 25px #ffaa00', animation: 'drip-gold', gradient: 'linear-gradient(135deg, #ffd700, #ffaa00, #ffd700)' },
  { level: 7, id: 'emerald', name: 'Matrix Code', border: '3px solid #00ff41', glow: '0 0 15px #00ff41, 0 0 30px #003d00', animation: 'matrix-glow', gradient: null },
  { level: 10, id: 'ice', name: 'Frozen Aura', border: '3px solid #00f7ff', glow: '0 0 20px #00f7ff, 0 0 40px #0080ff, 0 0 60px #00f7ff33', animation: 'ice-pulse', gradient: null },
  { level: 12, id: 'fire', name: '🔥 Flame Ring', border: '4px solid transparent', glow: '0 0 20px #ff4500, 0 0 40px #ff6600, 0 0 60px #ff000066', animation: 'fire-border', gradient: 'linear-gradient(45deg, #ff0000, #ff4500, #ff6600, #ff4500, #ff0000)' },
  { level: 15, id: 'neon', name: 'Cyberpunk Neon', border: '3px solid transparent', glow: '0 0 10px #ff00ff, 0 0 20px #00ffff, 0 0 30px #ff00ff', animation: 'neon-flicker', gradient: 'linear-gradient(90deg, #ff00ff, #00ffff, #ff00ff)' },
  { level: 18, id: 'galaxy', name: '🌌 Galaxy Swirl', border: '4px solid transparent', glow: '0 0 25px #9d4edd, 0 0 50px #4361ee, 0 0 75px #7209b7', animation: 'galaxy-rotate', gradient: 'conic-gradient(from 0deg, #7209b7, #3a0ca3, #4361ee, #4cc9f0, #4361ee, #3a0ca3, #7209b7)' },
  { level: 20, id: 'rainbow', name: '🌈 RGB Gamer', border: '4px solid transparent', glow: '0 0 20px #ff0000, 0 0 40px #00ff00, 0 0 60px #0000ff', animation: 'rgb-rotate', gradient: 'conic-gradient(from 0deg, #ff0000, #ff8000, #ffff00, #00ff00, #00ffff, #0080ff, #8000ff, #ff0080, #ff0000)' },
  { level: 25, id: 'legendary', name: '👑 Legendary', border: '5px solid transparent', glow: '0 0 30px #ffd700, 0 0 60px #ff8c00, 0 0 90px #ff4500', animation: 'legendary-crown', gradient: 'linear-gradient(45deg, #ffd700, #fff, #ffd700, #ff8c00, #ffd700)' },
  { level: 30, id: 'void', name: '🕳️ Void Walker', border: '5px solid transparent', glow: '0 0 30px #000, 0 0 50px #1a0033, 0 0 70px #330066, inset 0 0 20px #000', animation: 'void-pulse', gradient: 'conic-gradient(from 0deg, #000000, #1a0033, #330066, #1a0033, #000000)' },
  { level: 35, id: 'holographic', name: '✨ Holographic', border: '4px solid transparent', glow: '0 0 20px #fff, 0 0 40px #88ffff', animation: 'holo-shift', gradient: 'linear-gradient(135deg, #ff9a9e, #fecfef, #a18cd1, #fbc2eb, #a6c1ee, #ffecd2, #ff9a9e)' },
  { level: 40, id: 'glitch', name: '⚡ Glitch Effect', border: '4px solid #00ff00', glow: '0 0 10px #00ff00, -3px 0 #ff0000, 3px 0 #0000ff', animation: 'glitch-border', gradient: null },
  { level: 50, id: 'godmode', name: '⚜️ GOD MODE', border: '6px solid transparent', glow: '0 0 40px #ffd700, 0 0 80px #fff, 0 0 120px #ffd700', animation: 'godmode-aura', gradient: 'conic-gradient(from 0deg, #ffd700, #fff, #ffd700, #ffaa00, #fff, #ffd700)' },
];

// Badge tiers with visual styling
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

// Achievement categories
export const ACHIEVEMENT_CATEGORIES = {
  entries: { name: 'Entry Master', icon: '📝', description: 'Track your expenses' },
  budget: { name: 'Budget Keeper', icon: '💰', description: 'Stay within budget' },
  streaks: { name: 'Consistency', icon: '🔥', description: 'Daily dedication' },
  milestones: { name: 'Milestones', icon: '🏆', description: 'Major achievements' },
  explorer: { name: 'Explorer', icon: '🧭', description: 'Try new features' },
  special: { name: 'Special', icon: '⭐', description: 'Rare achievements' }
};

// All achievements
export const ACHIEVEMENTS = [
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
];

// Weekly challenges
export const WEEKLY_CHALLENGES = [
  { id: 'log_7_days', name: 'Daily Logger', description: 'Log at least one expense every day this week', goal: 7, type: 'daily_logs', xpReward: 100 },
  { id: 'under_budget_week', name: 'Budget Week', description: 'Stay under daily budget every day this week', goal: 7, type: 'budget_days', xpReward: 150 },
  { id: 'receipt_collector', name: 'Receipt Hunter', description: 'Upload 5 receipts this week', goal: 5, type: 'receipts', xpReward: 75 },
  { id: 'category_variety', name: 'Variety Pack', description: 'Use 5 different categories this week', goal: 5, type: 'categories', xpReward: 80 },
  { id: 'note_taker', name: 'Detail Master', description: 'Add notes to 10 entries this week', goal: 10, type: 'notes', xpReward: 60 },
];
