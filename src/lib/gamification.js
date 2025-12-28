// ============================================
// GAMIFICATION - XP, Levels, Frames, Achievements helpers
// ============================================

import { LEVEL_THRESHOLDS, PROFILE_FRAMES, BADGE_TIERS } from './constants';

// Calculate level from XP
export const calculateLevel = (xp) => {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) {
      return i + 1;
    }
  }
  return 1;
};

// Get XP needed for next level
export const getXPForNextLevel = (currentLevel) => {
  if (currentLevel >= LEVEL_THRESHOLDS.length) {
    const lastThreshold = LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
    const extraLevels = currentLevel - LEVEL_THRESHOLDS.length;
    return Math.floor(lastThreshold * Math.pow(1.3, extraLevels + 1));
  }
  return LEVEL_THRESHOLDS[currentLevel];
};

// Get current level progress percentage
export const getLevelProgress = (xp) => {
  const level = calculateLevel(xp);
  const currentLevelXP = LEVEL_THRESHOLDS[level - 1] || 0;
  const nextLevelXP = getXPForNextLevel(level);
  const progress = ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
  return Math.min(Math.max(progress, 0), 100);
};

// Get unlocked frames for a level
export const getUnlockedFrames = (level) => {
  return PROFILE_FRAMES.filter(frame => frame.level <= level);
};

// Get frame by ID
export const getFrameById = (frameId) => {
  return PROFILE_FRAMES.find(f => f.id === frameId) || PROFILE_FRAMES[0];
};

// Get avatar wrapper style with animated frame
export const getAnimatedFrameStyle = (frame, size = 48) => {
  const baseStyle = {
    position: 'relative',
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };
  
  if (frame.id === 'none') {
    return { ...baseStyle };
  }
  
  // For gradient borders, we use a pseudo-element approach via wrapper
  if (frame.gradient) {
    return {
      ...baseStyle,
      background: frame.gradient,
      backgroundSize: '200% 200%',
      padding: frame.border?.split(' ')[0] || '3px',
      boxShadow: frame.glow !== 'none' ? frame.glow : 'none',
      animation: frame.animation ? `${frame.animation} ${frame.animation.includes('rotate') || frame.animation.includes('holo') ? '3s' : frame.animation.includes('glitch') ? '2s' : '2s'} linear infinite` : 'none',
    };
  }
  
  // For solid borders with animations
  return {
    ...baseStyle,
    border: frame.border,
    boxShadow: frame.glow !== 'none' ? frame.glow : 'none',
    animation: frame.animation ? `${frame.animation} 2s ease-in-out infinite` : 'none',
  };
};

// Get inner avatar style (the actual avatar circle inside the frame)
export const getAvatarInnerStyle = (frame, size = 48, bgColor = '#3b82f6') => {
  const borderWidth = frame.gradient ? (parseInt(frame.border?.split(' ')[0]) || 3) : 0;
  const innerSize = frame.gradient ? size - (borderWidth * 2) : size;
  
  return {
    width: `${innerSize}px`,
    height: `${innerSize}px`,
    borderRadius: '50%',
    backgroundColor: bgColor,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    color: '#fff',
    fontSize: `${Math.floor(innerSize * 0.4)}px`,
    fontWeight: '600',
  };
};

// Get tier styling from BADGE_TIERS
export const getTierStyle = (tier) => {
  return BADGE_TIERS[tier] || BADGE_TIERS.bronze;
};

// Frame animation keyframes CSS (to be injected into the page)
export const frameAnimationStyles = `
  @keyframes pulse-bronze {
    0%, 100% { box-shadow: 0 0 10px #cd7f32; }
    50% { box-shadow: 0 0 20px #cd7f32, 0 0 30px #cd7f32; }
  }
  
  @keyframes shimmer-silver {
    0% { box-shadow: 0 0 12px #c0c0c0, 0 0 20px #e8e8e8; }
    50% { box-shadow: 0 0 20px #e8e8e8, 0 0 30px #fff; }
    100% { box-shadow: 0 0 12px #c0c0c0, 0 0 20px #e8e8e8; }
  }
  
  @keyframes drip-gold {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
  
  @keyframes matrix-glow {
    0%, 100% { box-shadow: 0 0 15px #00ff41, 0 0 30px #003d00; }
    50% { box-shadow: 0 0 25px #00ff41, 0 0 50px #00ff41; }
  }
  
  @keyframes ice-pulse {
    0%, 100% { box-shadow: 0 0 20px #00f7ff, 0 0 40px #0080ff, 0 0 60px #00f7ff33; }
    50% { box-shadow: 0 0 30px #00f7ff, 0 0 60px #0080ff, 0 0 80px #00f7ff66; }
  }
  
  @keyframes fire-border {
    0%, 100% { background-position: 0% 50%; filter: brightness(1); }
    50% { background-position: 100% 50%; filter: brightness(1.2); }
  }
  
  @keyframes neon-flicker {
    0%, 100% { opacity: 1; }
    92% { opacity: 1; }
    93% { opacity: 0.8; }
    94% { opacity: 1; }
    95% { opacity: 0.9; }
    96% { opacity: 1; }
  }
  
  @keyframes galaxy-rotate {
    from { background-position: 0deg; }
    to { background-position: 360deg; }
  }
  
  @keyframes rgb-rotate {
    from { filter: hue-rotate(0deg); }
    to { filter: hue-rotate(360deg); }
  }
  
  @keyframes legendary-crown {
    0%, 100% { background-position: 0% 50%; box-shadow: 0 0 30px #ffd700, 0 0 60px #ff8c00; }
    50% { background-position: 100% 50%; box-shadow: 0 0 40px #fff, 0 0 80px #ffd700; }
  }
  
  @keyframes void-pulse {
    0%, 100% { box-shadow: 0 0 30px #000, 0 0 50px #1a0033, 0 0 70px #330066, inset 0 0 20px #000; }
    50% { box-shadow: 0 0 40px #1a0033, 0 0 70px #330066, 0 0 100px #4d0099, inset 0 0 30px #1a0033; }
  }
  
  @keyframes holo-shift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  
  @keyframes glitch-border {
    0%, 100% { box-shadow: 0 0 10px #00ff00, -3px 0 #ff0000, 3px 0 #0000ff; }
    25% { box-shadow: 0 0 10px #00ff00, 3px 0 #ff0000, -3px 0 #0000ff; }
    50% { box-shadow: 0 0 15px #00ff00, -2px 2px #ff0000, 2px -2px #0000ff; }
    75% { box-shadow: 0 0 10px #00ff00, 2px -2px #ff0000, -2px 2px #0000ff; }
  }
  
  @keyframes godmode-aura {
    0%, 100% { 
      background-position: 0deg;
      box-shadow: 0 0 40px #ffd700, 0 0 80px #fff, 0 0 120px #ffd700;
      filter: brightness(1);
    }
    50% { 
      background-position: 180deg;
      box-shadow: 0 0 60px #fff, 0 0 100px #ffd700, 0 0 150px #fff;
      filter: brightness(1.1);
    }
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
