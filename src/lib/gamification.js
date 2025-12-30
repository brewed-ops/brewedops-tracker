// lib/gamification.js - Gamification utilities for BrewedOps
import { LEVEL_THRESHOLDS, PROFILE_FRAMES } from './constants';

/**
 * Calculate user level from XP
 * @param {number} xp - User's total XP
 * @returns {number} - User's level (1-25+)
 */
export const calculateLevel = (xp) => {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) {
      return i + 1;
    }
  }
  return 1;
};

/**
 * Get XP needed for next level
 * @param {number} xp - User's current XP
 * @returns {number} - XP needed for next level
 */
export const getXPForNextLevel = (xp) => {
  const currentLevel = calculateLevel(xp);
  if (currentLevel >= LEVEL_THRESHOLDS.length) {
    return LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1] + 50000; // Continue pattern
  }
  return LEVEL_THRESHOLDS[currentLevel];
};

/**
 * Get progress percentage to next level
 * @param {number} xp - User's current XP
 * @returns {number} - Progress percentage (0-100)
 */
export const getLevelProgress = (xp) => {
  const currentLevel = calculateLevel(xp);
  const currentLevelXP = LEVEL_THRESHOLDS[currentLevel - 1] || 0;
  const nextLevelXP = getXPForNextLevel(xp);
  const progress = ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
  return Math.min(Math.max(progress, 0), 100);
};

/**
 * Get all unlocked frames for a given level
 * @param {number} level - User's level
 * @returns {Array} - Array of unlocked frame objects
 */
export const getUnlockedFrames = (level) => {
  return PROFILE_FRAMES.filter(frame => frame.level <= level);
};

/**
 * Get frame by ID
 * @param {string} frameId - Frame ID
 * @returns {Object|null} - Frame object or null
 */
export const getFrameById = (frameId) => {
  return PROFILE_FRAMES.find(frame => frame.id === frameId) || null;
};

/**
 * Get animated frame style (outer container)
 * Supports both CSS-based and image-based frames
 * @param {Object} frame - Frame object
 * @param {number} size - Size in pixels
 * @returns {Object} - CSS style object
 */
export const getAnimatedFrameStyle = (frame, size = 48) => {
  if (!frame || frame.id === 'none') {
    return {
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    };
  }

  // Image-based frame
  if (frame.type === 'image' && frame.image) {
    return {
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      boxShadow: frame.glow || 'none',
    };
  }

  // CSS-based frame
  const baseStyle = {
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    border: frame.border || 'none',
    boxShadow: frame.glow || 'none',
  };

  // Add gradient border if present
  if (frame.gradient) {
    baseStyle.background = frame.gradient;
    baseStyle.padding = '3px';
  }

  // Add animation class reference
  if (frame.animation) {
    baseStyle.animation = `${frame.animation} 2s ease-in-out infinite`;
  }

  return baseStyle;
};

/**
 * Get inner avatar style
 * @param {Object} frame - Frame object
 * @param {number} size - Size in pixels
 * @param {string} bgColor - Background color for avatar
 * @returns {Object} - CSS style object
 */
export const getAvatarInnerStyle = (frame, size = 48, bgColor = '#3b82f6') => {
  const innerSize = frame && frame.gradient ? size - 6 : size - (frame?.border ? 6 : 0);
  
  return {
    width: `${Math.max(innerSize, size - 8)}px`,
    height: `${Math.max(innerSize, size - 8)}px`,
    borderRadius: '50%',
    backgroundColor: bgColor,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
    zIndex: 1,
  };
};

/**
 * Get image frame overlay style
 * For image-based frames, this creates the overlay element
 * @param {Object} frame - Frame object
 * @param {number} size - Size in pixels
 * @returns {Object} - CSS style object for the overlay image
 */
export const getFrameOverlayStyle = (frame, size = 48) => {
  if (!frame || frame.type !== 'image' || !frame.image) {
    return null;
  }

  // Frame overlay is slightly larger than avatar to create border effect
  const overlaySize = size + 16;
  
  return {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: `${overlaySize}px`,
    height: `${overlaySize}px`,
    backgroundImage: `url(${frame.image})`,
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    pointerEvents: 'none',
    zIndex: 2,
  };
};

/**
 * Get tier styling for achievements
 * @param {string} tier - Tier name (bronze, silver, gold, etc.)
 * @returns {Object} - Tier style object
 */
export const getTierStyle = (tier) => {
  const tiers = {
    bronze: { name: 'Bronze', color: '#cd7f32', bgGradient: 'linear-gradient(135deg, #cd7f32, #8b4513)' },
    silver: { name: 'Silver', color: '#c0c0c0', bgGradient: 'linear-gradient(135deg, #e8e8e8, #a8a8a8)' },
    gold: { name: 'Gold', color: '#ffd700', bgGradient: 'linear-gradient(135deg, #ffd700, #ff8c00)' },
    platinum: { name: 'Platinum', color: '#e5e4e2', bgGradient: 'linear-gradient(135deg, #e5e4e2, #8fbcbb)' },
    diamond: { name: 'Diamond', color: '#b9f2ff', bgGradient: 'linear-gradient(135deg, #b9f2ff, #87ceeb, #00bfff)' },
    legendary: { name: 'Legendary', color: '#ff6b35', bgGradient: 'linear-gradient(135deg, #ff6b35, #f7931e, #ffd700)' },
  };
  return tiers[tier] || tiers.bronze;
};

/**
 * CSS Keyframes for frame animations
 * Add this to your global styles or inject via styled-components
 */
export const FRAME_ANIMATIONS_CSS = `
  @keyframes pulse-bronze {
    0%, 100% { box-shadow: 0 0 10px #cd7f32; }
    50% { box-shadow: 0 0 20px #cd7f32, 0 0 30px #cd7f3280; }
  }
  
  @keyframes shimmer-silver {
    0%, 100% { box-shadow: 0 0 12px #c0c0c0, 0 0 20px #e8e8e8; }
    50% { box-shadow: 0 0 20px #c0c0c0, 0 0 35px #e8e8e8, 0 0 50px #ffffff40; }
  }
  
  @keyframes drip-gold {
    0%, 100% { box-shadow: 0 0 15px #ffd700, 0 0 25px #ffaa00; }
    50% { box-shadow: 0 0 25px #ffd700, 0 0 40px #ffaa00, 0 0 60px #ffd70040; }
  }
  
  @keyframes matrix-glow {
    0%, 100% { box-shadow: 0 0 15px #00ff41, 0 0 30px #003d00; }
    50% { box-shadow: 0 0 25px #00ff41, 0 0 45px #00ff4180, 0 0 60px #003d00; }
  }
  
  @keyframes ice-pulse {
    0%, 100% { box-shadow: 0 0 20px #00f7ff, 0 0 40px #0080ff; }
    50% { box-shadow: 0 0 30px #00f7ff, 0 0 60px #0080ff, 0 0 80px #00f7ff40; }
  }
  
  @keyframes fire-border {
    0%, 100% { box-shadow: 0 0 20px #ff4500, 0 0 40px #ff6600; }
    25% { box-shadow: 0 0 25px #ff6600, 0 0 50px #ff4500; }
    50% { box-shadow: 0 0 30px #ff4500, 0 0 60px #ff6600, 0 0 80px #ff000080; }
    75% { box-shadow: 0 0 25px #ff6600, 0 0 50px #ff4500; }
  }
  
  @keyframes neon-flicker {
    0%, 100% { box-shadow: 0 0 10px #ff00ff, 0 0 20px #00ffff; }
    25% { box-shadow: 0 0 15px #00ffff, 0 0 30px #ff00ff; }
    50% { box-shadow: 0 0 20px #ff00ff, 0 0 40px #00ffff, 0 0 60px #ff00ff40; }
    75% { box-shadow: 0 0 15px #00ffff, 0 0 30px #ff00ff; }
  }
  
  @keyframes galaxy-rotate {
    0% { filter: hue-rotate(0deg); }
    100% { filter: hue-rotate(360deg); }
  }
  
  @keyframes rgb-rotate {
    0% { filter: hue-rotate(0deg); box-shadow: 0 0 20px #ff0000; }
    33% { box-shadow: 0 0 20px #00ff00; }
    66% { box-shadow: 0 0 20px #0000ff; }
    100% { filter: hue-rotate(360deg); box-shadow: 0 0 20px #ff0000; }
  }
  
  @keyframes pulse-purple {
    0%, 100% { box-shadow: 0 0 15px #8b5cf6, 0 0 30px #6d28d9; }
    50% { box-shadow: 0 0 25px #8b5cf6, 0 0 50px #6d28d9, 0 0 70px #8b5cf640; }
  }
  
  @keyframes money-glow {
    0%, 100% { box-shadow: 0 0 20px #22c55e, 0 0 40px #16a34a; }
    50% { box-shadow: 0 0 30px #22c55e, 0 0 60px #16a34a, 0 0 80px #22c55e40; }
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.02); }
  }
  
  @keyframes twinkle {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.8; }
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-2px); }
  }
  
  @keyframes flash {
    0%, 90%, 100% { opacity: 1; }
    95% { opacity: 0.7; }
  }
  
  @keyframes breathe {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.03); }
  }
  
  @keyframes cosmic-pulse {
    0%, 100% { box-shadow: 0 0 30px #8b5cf6, 0 0 60px #6366f1; filter: hue-rotate(0deg); }
    50% { box-shadow: 0 0 40px #8b5cf6, 0 0 80px #6366f1; filter: hue-rotate(30deg); }
  }
  
  @keyframes legendary-glow {
    0%, 100% { box-shadow: 0 0 30px #ffd700, 0 0 60px #f59e0b; }
    25% { box-shadow: 0 0 40px #fbbf24, 0 0 80px #ffd700; }
    50% { box-shadow: 0 0 50px #ffd700, 0 0 100px #f59e0b, 0 0 120px #fbbf2450; }
    75% { box-shadow: 0 0 40px #fbbf24, 0 0 80px #ffd700; }
  }
  
  @keyframes champion-pulse {
    0%, 100% { box-shadow: 0 0 20px #8b5cf6, 0 0 40px #6d28d9; transform: scale(1); }
    50% { box-shadow: 0 0 35px #8b5cf6, 0 0 70px #6d28d9; transform: scale(1.02); }
  }
`;

export default {
  calculateLevel,
  getXPForNextLevel,
  getLevelProgress,
  getUnlockedFrames,
  getFrameById,
  getAnimatedFrameStyle,
  getAvatarInnerStyle,
  getFrameOverlayStyle,
  getTierStyle,
  FRAME_ANIMATIONS_CSS,
};
