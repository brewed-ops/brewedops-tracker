// ResetPassword.jsx - Password Reset page for BrewedOps
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, CheckCircle, AlertCircle, Loader2, Sun, Moon, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';

// ============================================
// BREWEDOPS BRAND CONFIGURATION
// ============================================
const BRAND = {
  brown: '#3F200C',
  blue: '#004AAC',
  green: '#51AF43',
  cream: '#FFF0D4',
};

const FONTS = {
  heading: "'Montserrat', sans-serif",
  body: "'Poppins', sans-serif",
};

// Inject Google Fonts if not already loaded
if (typeof document !== 'undefined' && !document.getElementById('brewedops-fonts')) {
  const link = document.createElement('link');
  link.id = 'brewedops-fonts';
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Poppins:wght@400;500;600&display=swap';
  document.head.appendChild(link);
}

const ResetPassword = ({ isDark, setIsDark, onComplete }) => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isValidSession, setIsValidSession] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  const theme = {
    bg: isDark ? '#0a0a0a' : '#ffffff',
    cardBg: isDark ? '#141414' : '#ffffff',
    cardBorder: isDark ? '#262626' : '#e2e8f0',
    text: isDark ? '#fafafa' : BRAND.brown,
    textMuted: isDark ? '#a1a1aa' : '#64748b',
    inputBg: isDark ? '#1a1a1a' : '#f8fafc',
  };

  // Check if user has a valid session for password reset
  useEffect(() => {
    const checkSession = async () => {
      try {
        // Check if we're in recovery mode (set by App.jsx)
        const isRecoveryMode = sessionStorage.getItem('passwordRecovery') === 'true';
        
        // Check URL hash for recovery token
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const type = hashParams.get('type');

        if (type === 'recovery' && accessToken) {
          // Set the session with the recovery token
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: hashParams.get('refresh_token') || '',
          });

          if (error) {
            console.error('Session error:', error);
            setError('Invalid or expired reset link. Please request a new one.');
            setIsValidSession(false);
          } else if (data.session) {
            setIsValidSession(true);
            // Clear the hash from URL for cleaner look
            window.history.replaceState(null, '', window.location.pathname);
          }
        } else if (isRecoveryMode) {
          // We're in recovery mode, check for existing session
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            setIsValidSession(true);
          } else {
            setError('Session expired. Please request a new password reset link.');
            setIsValidSession(false);
          }
        } else {
          // Check if there's an existing session
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            setIsValidSession(true);
          } else {
            setError('No valid reset session found. Please request a new password reset link.');
            setIsValidSession(false);
          }
        }
      } catch (err) {
        console.error('Check session error:', err);
        setError('Something went wrong. Please try again.');
        setIsValidSession(false);
      } finally {
        setCheckingSession(false);
      }
    };

    checkSession();
  }, []);

  const validatePassword = (pwd) => {
    const issues = [];
    if (pwd.length < 8) issues.push('8+ characters');
    if (!/[A-Z]/.test(pwd)) issues.push('uppercase letter');
    if (!/[a-z]/.test(pwd)) issues.push('lowercase letter');
    if (!/[0-9]/.test(pwd)) issues.push('number');
    return issues;
  };

  const getPasswordStrength = (pwd) => {
    if (!pwd) return { label: '', color: '', width: '0%' };
    const issues = validatePassword(pwd);
    if (issues.length === 0) return { label: 'Strong', color: '#22c55e', width: '100%' };
    if (issues.length === 1) return { label: 'Good', color: '#84cc16', width: '75%' };
    if (issues.length === 2) return { label: 'Fair', color: '#f59e0b', width: '50%' };
    return { label: 'Weak', color: '#ef4444', width: '25%' };
  };

  const handleResetPassword = async () => {
    setError('');
    
    // Validate password
    const issues = validatePassword(password);
    if (issues.length > 0) {
      setError(`Password needs: ${issues.join(', ')}`);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        throw error;
      }

      setSuccess(true);
      
      // Clear recovery mode and sign out
      sessionStorage.removeItem('passwordRecovery');
      
      // Sign out after password change so user can log in with new password
      setTimeout(async () => {
        await supabase.auth.signOut();
        if (onComplete) {
          onComplete();
        }
        navigate('/login');
      }, 2500);

    } catch (err) {
      console.error('Reset password error:', err);
      setError(err.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const strength = getPasswordStrength(password);

  const inputStyle = {
    width: '100%',
    height: '48px',
    padding: '0 44px 0 14px',
    backgroundColor: theme.inputBg,
    border: `1px solid ${theme.cardBorder}`,
    borderRadius: '10px',
    fontSize: '15px',
    color: theme.text,
    outline: 'none',
    boxSizing: 'border-box',
  };

  const btnPrimary = {
    width: '100%',
    height: '48px',
    backgroundColor: '#004AAC',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: loading ? 'not-allowed' : 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    opacity: loading ? 0.7 : 1,
  };

  // Loading state while checking session
  if (checkingSession) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: theme.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{ textAlign: 'center' }}>
          <Loader2 style={{ width: '40px', height: '40px', color: '#004AAC', animation: 'spin 1s linear infinite' }} />
          <p style={{ marginTop: '16px', color: theme.textMuted }}>Verifying reset link...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: theme.bg,
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <button
          onClick={() => navigate('/login')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'transparent',
            border: `1px solid ${theme.cardBorder}`,
            borderRadius: '10px',
            padding: '10px 16px',
            color: theme.text,
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          <ArrowLeft style={{ width: '18px', height: '18px' }} />
          Back to Login
        </button>
        <button
          onClick={() => setIsDark(!isDark)}
          style={{
            width: '40px',
            height: '40px',
            backgroundColor: 'transparent',
            border: `1px solid ${theme.cardBorder}`,
            borderRadius: '10px',
            color: theme.textMuted,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {isDark ? <Sun style={{ width: '18px', height: '18px' }} /> : <Moon style={{ width: '18px', height: '18px' }} />}
        </button>
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}>
        <div style={{
          width: '100%',
          maxWidth: '400px',
          backgroundColor: theme.cardBg,
          borderRadius: '16px',
          border: `1px solid ${theme.cardBorder}`,
          padding: '32px',
        }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <img
              src="https://i.imgur.com/R52jwPv.png"
              alt="BrewedOps Logo"
              style={{ width: '56px', height: '56px', borderRadius: '14px', marginBottom: '16px' }}
            />
            <h1 style={{ fontSize: '24px', fontWeight: '700', color: theme.text, margin: '0 0 8px' }}>
              {success ? 'Password Updated!' : 'Reset Password'}
            </h1>
            <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0 }}>
              {success ? 'Redirecting to login...' : isValidSession ? 'Enter your new password below' : 'Unable to verify reset link'}
            </p>
          </div>

          {/* Success State */}
          {success && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
              padding: '24px 0',
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                backgroundColor: isDark ? '#052e16' : '#f0fdf4',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <CheckCircle style={{ width: '32px', height: '32px', color: '#22c55e' }} />
              </div>
              <p style={{ fontSize: '14px', color: theme.textMuted, textAlign: 'center' }}>
                Your password has been successfully updated.<br />
                You will be redirected to login shortly.
              </p>
            </div>
          )}

          {/* Error State - Invalid Session */}
          {!isValidSession && !success && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
              padding: '24px 0',
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                backgroundColor: isDark ? '#451a1a' : '#fef2f2',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <AlertCircle style={{ width: '32px', height: '32px', color: '#ef4444' }} />
              </div>
              <p style={{ fontSize: '14px', color: theme.textMuted, textAlign: 'center' }}>
                {error || 'This reset link is invalid or has expired.'}
              </p>
              <button
                onClick={() => navigate('/login')}
                style={{
                  ...btnPrimary,
                  width: 'auto',
                  padding: '0 24px',
                }}
              >
                Request New Reset Link
              </button>
            </div>
          )}

          {/* Password Form */}
          {isValidSession && !success && (
            <>
              {/* Error Message */}
              {error && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 14px',
                  backgroundColor: isDark ? '#451a1a' : '#fef2f2',
                  border: `1px solid ${isDark ? '#7f1d1d' : '#fecaca'}`,
                  borderRadius: '10px',
                  marginBottom: '20px',
                }}>
                  <AlertCircle style={{ width: '16px', height: '16px', color: '#ef4444', flexShrink: 0 }} />
                  <span style={{ fontSize: '13px', color: isDark ? '#fca5a5' : '#dc2626' }}>{error}</span>
                </div>
              )}

              {/* New Password */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: theme.textMuted,
                  marginBottom: '8px',
                }}>
                  New Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    style={inputStyle}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: theme.textMuted,
                      cursor: 'pointer',
                      padding: '4px',
                    }}
                  >
                    {showPassword ? <EyeOff style={{ width: '18px', height: '18px' }} /> : <Eye style={{ width: '18px', height: '18px' }} />}
                  </button>
                </div>
                
                {/* Password Strength Indicator */}
                {password && (
                  <div style={{ marginTop: '8px' }}>
                    <div style={{
                      height: '4px',
                      backgroundColor: isDark ? '#262626' : '#e2e8f0',
                      borderRadius: '2px',
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        height: '100%',
                        width: strength.width,
                        backgroundColor: strength.color,
                        transition: 'all 0.3s ease',
                      }} />
                    </div>
                    <p style={{
                      fontSize: '12px',
                      color: strength.color,
                      margin: '4px 0 0',
                    }}>
                      {strength.label}
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: theme.textMuted,
                  marginBottom: '8px',
                }}>
                  Confirm New Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    style={{
                      ...inputStyle,
                      borderColor: confirmPassword && password !== confirmPassword ? '#ef4444' : theme.cardBorder,
                    }}
                    disabled={loading}
                    onKeyDown={(e) => e.key === 'Enter' && handleResetPassword()}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: theme.textMuted,
                      cursor: 'pointer',
                      padding: '4px',
                    }}
                  >
                    {showConfirmPassword ? <EyeOff style={{ width: '18px', height: '18px' }} /> : <Eye style={{ width: '18px', height: '18px' }} />}
                  </button>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p style={{ fontSize: '12px', color: '#ef4444', margin: '6px 0 0' }}>
                    Passwords do not match
                  </p>
                )}
                {confirmPassword && password === confirmPassword && password && (
                  <p style={{ fontSize: '12px', color: '#22c55e', margin: '6px 0 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle style={{ width: '12px', height: '12px' }} /> Passwords match
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                onClick={handleResetPassword}
                disabled={loading || !password || !confirmPassword || password !== confirmPassword}
                style={{
                  ...btnPrimary,
                  opacity: (loading || !password || !confirmPassword || password !== confirmPassword) ? 0.5 : 1,
                  cursor: (loading || !password || !confirmPassword || password !== confirmPassword) ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? (
                  <>
                    <Loader2 style={{ width: '18px', height: '18px', animation: 'spin 1s linear infinite' }} />
                    Updating...
                  </>
                ) : (
                  <>
                    <Lock style={{ width: '18px', height: '18px' }} />
                    Update Password
                  </>
                )}
              </button>

              {/* Password Requirements */}
              <div style={{
                marginTop: '20px',
                padding: '14px',
                backgroundColor: isDark ? '#1a1a1a' : '#f8fafc',
                borderRadius: '10px',
              }}>
                <p style={{ fontSize: '12px', color: theme.textMuted, margin: '0 0 8px', fontWeight: '500' }}>
                  Password must have:
                </p>
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                  {[
                    { check: password.length >= 8, text: 'At least 8 characters' },
                    { check: /[A-Z]/.test(password), text: 'One uppercase letter' },
                    { check: /[a-z]/.test(password), text: 'One lowercase letter' },
                    { check: /[0-9]/.test(password), text: 'One number' },
                  ].map((req, i) => (
                    <li key={i} style={{
                      fontSize: '12px',
                      color: req.check ? '#22c55e' : theme.textMuted,
                      marginBottom: '4px',
                    }}>
                      {req.text}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: '16px', textAlign: 'center' }}>
        <p style={{ fontSize: '13px', color: theme.textMuted, margin: 0 }}>
          © {new Date().getFullYear()} BrewedOps by Kenneth V.
        </p>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder { color: ${theme.textMuted}; opacity: 0.7; }
      `}</style>
    </div>
  );
};

export default ResetPassword;
