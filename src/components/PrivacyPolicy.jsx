// PrivacyPolicy.jsx - Privacy Policy page for BrewedOps
import React from 'react';
import { Shield, Mail, Database, Lock, Eye, Trash2, Globe, Users, Zap, Bell, MapPin, RefreshCw } from 'lucide-react';
import SEO from './SEO';

// BREWEDOPS BRAND
const BRAND = { brown: '#3F200C', blue: '#004AAC', green: '#51AF43', cream: '#FFF0D4' };

const PrivacyPolicy = ({ onBack, onNavigate, isDark }) => {
  const theme = {
    bg: isDark ? '#0d0b09' : '#faf8f5',
    text: isDark ? '#f5f0eb' : '#3F200C',
    textMuted: isDark ? '#a09585' : '#7a6652',
    cardBg: isDark ? '#171411' : '#ffffff',
    cardBorder: isDark ? '#2a2420' : '#e8e0d4',
  };

  const lastUpdated = 'January 1, 2026';

  const Section = ({ icon: Icon, title, children }) => (
    <div style={{ marginBottom: '32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          backgroundColor: isDark ? '#004AAC20' : '#004AAC10', 
          borderRadius: '10px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          <Icon style={{ width: '20px', height: '20px', color: '#004AAC' }} />
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: '600', color: theme.text, margin: 0 }}>{title}</h2>
      </div>
      <div style={{ paddingLeft: '52px', color: theme.textMuted, fontSize: '15px', lineHeight: '1.7' }}>
        {children}
      </div>
    </div>
  );

  return (
    <>
    <SEO
      title="Privacy Policy | BrewedOps"
      description="Read the BrewedOps privacy policy. Learn how we handle your data across our free tools and Fuelyx nutrition app."
      keywords="BrewedOps privacy policy, data protection, Filipino VA tools privacy"
    />
    <div style={{
      minHeight: '100vh',
      backgroundColor: theme.bg,
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "'Montserrat', sans-serif"
    }}>
      {/* Header */}
      <header style={{
        padding: '16px 24px',
        borderBottom: '1px solid ' + theme.cardBorder,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: theme.bg,
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <button 
          onClick={() => onNavigate('home')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '8px 0'
          }}
        >
          <img
            src="https://i.imgur.com/R52jwPvt.png"
            alt="BrewedOps Logo"
            width={36}
            height={36}
            style={{ width: '36px', height: '36px', borderRadius: '10px' }}
          />
          <span style={{ 
            fontSize: '20px', 
            fontWeight: '700', 
            color: theme.text,
            letterSpacing: '-0.5px'
          }}>
            Brewed<span style={{ color: BRAND.blue }}>Ops</span>
          </span>
        </button>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '24px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {/* Page Header */}
          <div style={{ marginBottom: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <div style={{ 
                width: '56px', 
                height: '56px', 
                backgroundColor: isDark ? '#22c55e20' : '#22c55e15', 
                borderRadius: '14px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                <Shield style={{ width: '28px', height: '28px', color: '#22c55e' }} />
              </div>
              <div>
                <h1 style={{ fontSize: '32px', fontWeight: '700', color: theme.text, margin: 0 }}>Privacy Policy</h1>
                <p style={{ fontSize: '14px', color: theme.textMuted, margin: '4px 0 0' }}>Last updated: {lastUpdated}</p>
              </div>
            </div>
            
            <div style={{ 
              padding: '16px 20px', 
              backgroundColor: isDark ? '#3b82f615' : '#3b82f610', 
              borderRadius: '12px',
              border: '1px solid #3b82f640'
            }}>
              <p style={{ fontSize: '14px', color: theme.text, margin: 0, lineHeight: '1.6' }}>
                <strong>BrewedOps</strong> ("we", "our", or "us") is committed to protecting your privacy. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
                when you use our productivity platform with 18 tools for Filipino virtual assistants and freelancers,
                as well as our mobile application <strong>Fuelyx</strong> (nutrition & fitness tracker for Android).
              </p>
            </div>
          </div>

          <Section icon={Database} title="Information We Collect">
            <p><strong style={{ color: theme.text }}>Account Information:</strong></p>
            <ul style={{ margin: '8px 0 16px', paddingLeft: '20px' }}>
              <li>Email address (used for authentication)</li>
              <li>Display name (optional)</li>
              <li>Profile picture (if provided through OAuth)</li>
              <li>Password (stored securely hashed, never in plain text)</li>
            </ul>
            
            <p><strong style={{ color: theme.text }}>Financial Data You Enter (Finance Tracker & VAKita):</strong></p>
            <ul style={{ margin: '8px 0 16px', paddingLeft: '20px' }}>
              <li>Income entries and transactions</li>
              <li>Expense records and categorizations</li>
              <li>Client information (names, emails, billing rates, timezones)</li>
              <li>Invoice details and payment history</li>
              <li>Prospect/lead information</li>
              <li>Tax settings, TIN numbers, and calculations</li>
              <li>Wallet and account balances</li>
            </ul>

            <p><strong style={{ color: theme.text }}>Notes & Tasks (Brewed Notes & Task Manager):</strong></p>
            <ul style={{ margin: '8px 0 16px', paddingLeft: '20px' }}>
              <li>Note content with rich text formatting</li>
              <li>Task titles, descriptions, and completion status</li>
              <li>Categories and organizational data</li>
            </ul>
            
            <p><strong style={{ color: theme.text }}>Files Processed (Image, Video & Document Tools):</strong></p>
            <ul style={{ margin: '8px 0 16px', paddingLeft: '20px' }}>
              <li>Images, videos, and PDFs are processed <strong>locally in your browser</strong></li>
              <li>We do <strong>NOT</strong> upload, store, or access your files on our servers</li>
              <li>All processing happens on your device for privacy</li>
            </ul>
            
            <p><strong style={{ color: theme.text }}>Gmail Integration (Optional):</strong></p>
            <ul style={{ margin: '8px 0 16px', paddingLeft: '20px' }}>
              <li>When you connect your Gmail account, we request permission to send emails on your behalf</li>
              <li>We store OAuth tokens securely to maintain your connection</li>
              <li>We <strong>do not</strong> read, access, or store your emails or contacts</li>
              <li>We <strong>only</strong> use the Gmail API to send invoice emails that you explicitly request</li>
            </ul>

            <p><strong style={{ color: '#14b8a6' }}>Fuelyx Mobile App Data (Stored Locally on Your Device):</strong></p>
            <ul style={{ margin: '8px 0 16px', paddingLeft: '20px' }}>
              <li><strong>Food logs:</strong> What you eat, calorie intake, macronutrients (protein, carbs, fat, fiber)</li>
              <li><strong>Body metrics:</strong> Weight history, BMI calculations, body measurements</li>
              <li><strong>Fitness data:</strong> Workout logs, exercises completed, calories burned</li>
              <li><strong>Fasting records:</strong> Fasting start/end times, protocol history</li>
              <li><strong>Step data:</strong> Daily step counts from device pedometer</li>
              <li><strong>Goals & preferences:</strong> Calorie targets, macro goals, unit preferences</li>
              <li><strong>Achievements:</strong> Badges earned, streak data, milestones</li>
            </ul>

            <p><strong style={{ color: '#14b8a6' }}>Fuelyx Camera Access (AI Food Scanner):</strong></p>
            <ul style={{ margin: '8px 0 16px', paddingLeft: '20px' }}>
              <li>The AI Food Scanner requires camera permission to capture food photos</li>
              <li>Photos are processed <strong>locally on your device</strong> or sent to AI services for recognition</li>
              <li>We do <strong>NOT</strong> store your food photos on our servers</li>
              <li>You can revoke camera permission at any time in your device settings</li>
            </ul>

            <p><strong style={{ color: '#14b8a6' }}>Important - Fuelyx Data Storage:</strong></p>
            <ul style={{ margin: '8px 0 16px', paddingLeft: '20px' }}>
              <li>All Fuelyx data is stored <strong>locally on your Android device</strong></li>
              <li>We do <strong>NOT</strong> upload your health, nutrition, or fitness data to external servers</li>
              <li>Your data stays private on your device unless you choose to export it</li>
              <li>Uninstalling the app will delete all locally stored data</li>
            </ul>
            
            <p><strong style={{ color: theme.text }}>Automatically Collected:</strong></p>
            <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
              <li>Basic usage analytics (pages visited, features used)</li>
              <li>Device type and browser information</li>
              <li>IP address (for security purposes)</li>
            </ul>
          </Section>

          <Section icon={Eye} title="How We Use Your Information">
            <p>We use your information to:</p>
            <ul style={{ margin: '12px 0', paddingLeft: '20px' }}>
              <li>Provide and maintain our 18 productivity tools</li>
              <li>Process your financial data and generate reports</li>
              <li>Store your notes, tasks, and organizational data</li>
              <li>Send invoice emails through Gmail integration (when authorized)</li>
              <li>Improve our services based on usage patterns</li>
              <li>Communicate important updates about the service</li>
              <li>Ensure security and prevent fraud</li>
            </ul>
            <p style={{ marginTop: '12px' }}><strong style={{ color: '#14b8a6' }}>Fuelyx App:</strong></p>
            <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
              <li>Calculate daily calorie intake and nutritional totals</li>
              <li>Track your fasting windows and workout progress</li>
              <li>Generate analytics charts and progress reports</li>
              <li>Power the AI Food Scanner feature (camera access)</li>
              <li>Store achievements and streak data locally</li>
            </ul>
          </Section>

          <Section icon={Lock} title="Data Security">
            <p>We implement industry-standard security measures:</p>
            <ul style={{ margin: '12px 0', paddingLeft: '20px' }}>
              <li><strong style={{ color: theme.text }}>Encryption:</strong> All data transmitted using HTTPS/TLS encryption</li>
              <li><strong style={{ color: theme.text }}>Password Security:</strong> Passwords are hashed using bcrypt, never stored in plain text</li>
              <li><strong style={{ color: theme.text }}>Database Security:</strong> Data stored in Supabase with row-level security policies</li>
              <li><strong style={{ color: theme.text }}>OAuth Tokens:</strong> Stored encrypted, automatically refreshed and revocable</li>
              <li><strong style={{ color: theme.text }}>Local Processing:</strong> Image, video, and PDF tools process files locally - never uploaded</li>
            </ul>
          </Section>

          <Section icon={Users} title="Data Sharing">
            <p>We <strong style={{ color: theme.text }}>do not sell</strong> your personal information. We may share data only in these cases:</p>
            <ul style={{ margin: '12px 0', paddingLeft: '20px' }}>
              <li><strong style={{ color: theme.text }}>Service Providers:</strong> Supabase (database), Google (authentication & Gmail API)</li>
              <li><strong style={{ color: theme.text }}>Legal Requirements:</strong> When required by law or to protect rights</li>
              <li><strong style={{ color: theme.text }}>With Your Consent:</strong> When you explicitly authorize sharing</li>
            </ul>
          </Section>

          <Section icon={Globe} title="Third-Party Services">
            <p>BrewedOps integrates with these trusted services:</p>
            <ul style={{ margin: '12px 0', paddingLeft: '20px' }}>
              <li><strong style={{ color: theme.text }}>Supabase:</strong> Database and authentication (<a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: '#004AAC' }}>Privacy Policy</a>)</li>
              <li><strong style={{ color: theme.text }}>Google OAuth:</strong> Sign-in and Gmail integration (<a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: '#004AAC' }}>Privacy Policy</a>)</li>
              <li><strong style={{ color: theme.text }}>ExchangeRate-API:</strong> Currency conversion rates</li>
            </ul>
          </Section>

          <Section icon={Zap} title="Cookies & Local Storage">
            <p>BrewedOps uses minimal browser storage:</p>
            <ul style={{ margin: '12px 0', paddingLeft: '20px' }}>
              <li><strong style={{ color: theme.text }}>Authentication:</strong> Session tokens to keep you logged in</li>
              <li><strong style={{ color: theme.text }}>Preferences:</strong> Theme settings (dark/light mode), UI preferences</li>
              <li><strong style={{ color: theme.text }}>Performance:</strong> Cached data to improve app speed</li>
            </ul>
            <p style={{ marginTop: '12px' }}>
              We do not use tracking cookies or third-party analytics that follow you across the web.
            </p>
          </Section>

          <Section icon={Bell} title="Children's Privacy">
            <p>BrewedOps is not intended for use by anyone under the age of 18. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us immediately and we will delete such information.</p>
          </Section>

          <Section icon={Trash2} title="Data Retention & Deletion">
            <p><strong style={{ color: theme.text }}>BrewedOps Web Platform:</strong></p>
            <ul style={{ margin: '8px 0 16px', paddingLeft: '20px' }}>
              <li>Account data: Until you delete your account</li>
              <li>Financial records, notes, tasks: As long as your account exists</li>
              <li>OAuth tokens: Until you disconnect the service</li>
              <li>Files processed by tools: Never stored (processed locally)</li>
            </ul>

            <p><strong style={{ color: '#14b8a6' }}>Fuelyx Mobile App:</strong></p>
            <ul style={{ margin: '8px 0 16px', paddingLeft: '20px' }}>
              <li>All data stored locally on your device only</li>
              <li>Food logs, weight history, workouts: Until you clear app data or uninstall</li>
              <li>Camera photos for AI Scanner: Processed immediately, not stored permanently</li>
              <li>To delete all Fuelyx data: Uninstall the app or clear app data in Android settings</li>
            </ul>
            
            <p><strong style={{ color: theme.text }}>Deletion:</strong></p>
            <p>You can request deletion of your BrewedOps account and all associated data by contacting us. Upon request, we will:</p>
            <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
              <li>Delete all your personal information within 30 days</li>
              <li>Delete all financial data, notes, and tasks</li>
              <li>Revoke and delete any OAuth tokens</li>
              <li>Notify you when deletion is complete</li>
            </ul>
            <p style={{ marginTop: '12px', fontStyle: 'italic', color: theme.textMuted }}>
              Note: Fuelyx app data is stored locally on your device and is not accessible by us. You control your own data deletion.
            </p>
          </Section>

          <Section icon={Shield} title="Your Rights">
            <p>You have the right to:</p>
            <ul style={{ margin: '12px 0', paddingLeft: '20px' }}>
              <li><strong style={{ color: theme.text }}>Access:</strong> Request a copy of your personal data</li>
              <li><strong style={{ color: theme.text }}>Correction:</strong> Update or correct inaccurate information</li>
              <li><strong style={{ color: theme.text }}>Deletion:</strong> Request deletion of your data</li>
              <li><strong style={{ color: theme.text }}>Portability:</strong> Export your data in a machine-readable format</li>
              <li><strong style={{ color: theme.text }}>Withdraw Consent:</strong> Disconnect third-party services at any time</li>
            </ul>
            <p style={{ marginTop: '12px' }}>
              To exercise these rights, contact us at the email below. We will respond within 30 days.
            </p>
          </Section>

          <Section icon={RefreshCw} title="Changes to This Policy">
            <p>We may update this Privacy Policy from time to time. When we make changes:</p>
            <ul style={{ margin: '12px 0', paddingLeft: '20px' }}>
              <li>We will update the "Last updated" date at the top</li>
              <li>For significant changes, we will notify you via email or in-app notification</li>
              <li>Continued use after changes constitutes acceptance</li>
            </ul>
          </Section>

          {/* Contact */}
          <div style={{ 
            padding: '24px', 
            backgroundColor: theme.cardBg, 
            borderRadius: '12px',
            border: '1px solid ' + theme.cardBorder,
            marginTop: '40px'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: theme.text, margin: '0 0 12px' }}>Contact Us</h2>
            <p style={{ fontSize: '15px', color: theme.textMuted, margin: 0, lineHeight: '1.7' }}>
              If you have questions about this Privacy Policy or your data, please contact us at:
            </p>
            <p style={{ fontSize: '15px', color: '#004AAC', margin: '12px 0 0', fontWeight: '500' }}>
              brewedops@gmail.com
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ 
        padding: '24px', 
        borderTop: '1px solid ' + theme.cardBorder,
        textAlign: 'center'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '24px', 
          marginBottom: '12px',
          flexWrap: 'wrap'
        }}>
          <button 
            onClick={() => onNavigate('privacy')}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: '#004AAC', 
              fontSize: '13px', 
              cursor: 'pointer',
              fontWeight: '600',
              fontFamily: "'Montserrat', sans-serif"
            }}
          >
            Privacy Policy
          </button>
          <button 
            onClick={() => onNavigate('terms')}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: theme.textMuted, 
              fontSize: '13px', 
              cursor: 'pointer',
              fontFamily: "'Montserrat', sans-serif"
            }}
          >
            Terms of Service
          </button>
          <button 
            onClick={() => onNavigate('about')}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: theme.textMuted, 
              fontSize: '13px', 
              cursor: 'pointer',
              fontFamily: "'Montserrat', sans-serif"
            }}
          >
            About Us
          </button>
        </div>
        <p style={{ fontSize: '13px', color: theme.textMuted, margin: 0 }}>
          © {new Date().getFullYear()} BrewedOps by Kenneth V. All rights reserved.
        </p>
      </footer>
    </div>
    </>
  );
};

export default PrivacyPolicy;
