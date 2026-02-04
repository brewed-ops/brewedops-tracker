import React from 'react';
import {
  Sun,
  Moon,
  Tree,
  Trophy,
  Gift,
  Fire,
  PencilSimple,
  ChatText,
  SignOut,
  List
} from '@phosphor-icons/react';
import { getAnimatedFrameStyle, getAvatarInnerStyle, getInitial } from '../../lib/gamification';
import { ACHIEVEMENTS, CURRENCIES } from '../../lib/constants';

const Header = ({
  user,
  isDark,
  setIsDark,
  theme,
  isMobile,
  isSmall,
  // Gamification props
  userXP,
  currentLevel,
  levelProgress,
  currentFrame,
  unlockedAchievements,
  currentStreak,
  checkedInToday,
  // Profile props
  profilePicture,
  showProfileMenu,
  setShowProfileMenu,
  // Modal triggers
  setShowRewardsModal,
  setShowAchievementsModal,
  setShowEditProfile,
  setShowFeedback,
  // Christmas theme
  isChristmasTheme,
  setIsChristmasTheme,
  // Currency
  currency,
  setCurrency,
  // Logout
  onLogout,
  // Mobile menu
  mobileMenuOpen,
  setMobileMenuOpen,
}) => {
  return (
    <header style={{
      backgroundColor: isDark ? '#0d0b09' : '#ffffff',
      borderBottom: `1px solid ${theme.cardBorder}`,
      padding: '0 24px',
      position: 'sticky',
      top: 0,
      zIndex: 20,
      height: '72px',
      display: 'flex',
      alignItems: 'center',
    }}>
      <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: isMobile ? 'space-between' : 'flex-end' }}>
        {/* Show logo only on mobile (sidebar hidden) */}
        {isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: isSmall ? '6px' : '14px' }}>
            <img 
              src="https://i.imgur.com/R52jwPv.png" 
              alt="BrewedOps Logo" 
              style={{ 
                width: isSmall ? '32px' : '44px', 
                height: isSmall ? '32px' : '44px', 
                borderRadius: '50%', 
                objectFit: 'cover',
                flexShrink: 0 
              }} 
            />
            {!isSmall && (
              <h1 style={{ fontSize: isMobile ? '14px' : '18px', fontWeight: '600', color: theme.text, margin: 0 }}>BrewedOps Tracker</h1>
            )}
          </div>
        )}

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
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '90px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: theme.text }}>Level {currentLevel}</span>
                  <span style={{ fontSize: '10px', color: theme.textMuted }}>{userXP} XP</span>
                </div>
                <div style={{
                  height: '4px',
                  backgroundColor: isDark ? '#332d26' : '#e8e0d4',
                  borderRadius: '2px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${levelProgress}%`,
                    background: 'linear-gradient(90deg, #fbbf24, #f59e0b)',
                    borderRadius: '2px',
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
                border: `1px solid ${theme.cardBorder}`
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
                  <Fire style={{ width: '14px', height: '14px', color: checkedInToday ? '#22c55e' : '#f97316' }} />
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
              aria-label={isChristmasTheme ? 'Disable Christmas Theme' : 'Enable Christmas Theme'}
            >
              <Tree style={{ width: '20px', height: '20px' }} />
            </button>
            
            {/* Dark/Light Mode Toggle */}
            <button
              onClick={() => setIsDark(!isDark)}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
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
                <ProfileDropdown
                  user={user}
                  theme={theme}
                  isDark={isDark}
                  currency={currency}
                  setCurrency={setCurrency}
                  setShowProfileMenu={setShowProfileMenu}
                  setShowEditProfile={setShowEditProfile}
                  setShowFeedback={setShowFeedback}
                  onLogout={onLogout}
                />
              )}
            </div>
          </div>
        ) : (
          // Mobile Header Actions
          <MobileHeaderActions
            user={user}
            theme={theme}
            isDark={isDark}
            setIsDark={setIsDark}
            currentFrame={currentFrame}
            profilePicture={profilePicture}
            userXP={userXP}
            currentLevel={currentLevel}
            levelProgress={levelProgress}
            unlockedAchievements={unlockedAchievements}
            currentStreak={currentStreak}
            checkedInToday={checkedInToday}
            showProfileMenu={showProfileMenu}
            setShowProfileMenu={setShowProfileMenu}
            setShowRewardsModal={setShowRewardsModal}
            setShowAchievementsModal={setShowAchievementsModal}
            setShowEditProfile={setShowEditProfile}
            setShowFeedback={setShowFeedback}
            currency={currency}
            setCurrency={setCurrency}
            onLogout={onLogout}
          />
        )}
      </div>
    </header>
  );
};

// Profile Dropdown Component
const ProfileDropdown = ({
  user,
  theme,
  isDark,
  currency,
  setCurrency,
  setShowProfileMenu,
  setShowEditProfile,
  setShowFeedback,
  onLogout,
}) => (
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
        fontSize: '14px',
        color: theme.text,
        textAlign: 'left'
      }}
    >
      <PencilSimple style={{ width: '18px', height: '18px', color: theme.textMuted }} />
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
        fontSize: '14px',
        color: theme.text,
        textAlign: 'left'
      }}
    >
      <ChatText style={{ width: '18px', height: '18px', color: theme.textMuted }} />
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
      <SignOut style={{ width: '18px', height: '18px' }} />
      Logout
    </button>
  </div>
);

// Mobile Header Actions
const MobileHeaderActions = ({
  user,
  theme,
  isDark,
  setIsDark,
  currentFrame,
  profilePicture,
  userXP,
  currentLevel,
  levelProgress,
  unlockedAchievements,
  currentStreak,
  checkedInToday,
  showProfileMenu,
  setShowProfileMenu,
  setShowRewardsModal,
  setShowAchievementsModal,
  setShowEditProfile,
  setShowFeedback,
  currency,
  setCurrency,
  onLogout,
}) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
    {/* Compact Level Display */}
    <div 
      onClick={() => setShowRewardsModal(true)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 10px',
        backgroundColor: theme.statBg,
        borderRadius: '8px',
        cursor: 'pointer',
        border: `1px solid ${theme.cardBorder}`
      }}
    >
      <div style={{
        width: '24px',
        height: '24px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontSize: '11px',
        fontWeight: '700'
      }}>
        {currentLevel}
      </div>
    </div>
    
    {/* Streak indicator */}
    {(currentStreak > 0 || !checkedInToday) && (
      <div 
        onClick={() => setShowAchievementsModal(true)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '3px',
          padding: '6px 8px',
          backgroundColor: checkedInToday ? (isDark ? '#14532d' : '#dcfce7') : (isDark ? '#7c2d12' : '#fed7aa'),
          borderRadius: '8px',
          cursor: 'pointer'
        }}
      >
        <Fire style={{ width: '14px', height: '14px', color: checkedInToday ? '#22c55e' : '#f97316' }} />
        {currentStreak > 0 && (
          <span style={{ fontSize: '12px', fontWeight: '700', color: checkedInToday ? '#22c55e' : '#f97316' }}>{currentStreak}</span>
        )}
      </div>
    )}
    
    {/* Theme Toggle */}
    <button
      onClick={() => setIsDark(!isDark)}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
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
      {isDark ? <Sun style={{ width: '16px', height: '16px' }} /> : <Moon style={{ width: '16px', height: '16px' }} />}
    </button>
    
    {/* Profile Menu Button */}
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
            <PencilSimple style={{ width: '18px', height: '18px', color: theme.textMuted }} />
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
            <ChatText style={{ width: '18px', height: '18px', color: theme.textMuted }} />
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
            <SignOut style={{ width: '18px', height: '18px' }} />
            Logout
          </button>
        </div>
      )}
    </div>
  </div>
);

export default Header;
