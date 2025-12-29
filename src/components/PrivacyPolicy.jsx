// PrivacyPolicy.jsx - Privacy Policy page for BrewedOps
import React from 'react';
import { ArrowLeft, Shield, Mail, Database, Lock, Eye, Trash2, Globe, Users, Zap, Bell, MapPin, RefreshCw } from 'lucide-react';

const PrivacyPolicy = ({ onBack, onNavigate, isDark }) => {
  const theme = {
    bg: isDark ? '#09090b' : '#ffffff',
    text: isDark ? '#fafafa' : '#18181b',
    textMuted: isDark ? '#a1a1aa' : '#71717a',
    cardBg: isDark ? '#18181b' : '#ffffff',
    cardBorder: isDark ? '#27272a' : '#e4e4e7',
  };

  const lastUpdated = 'December 29, 2025';

  const Section = ({ icon: Icon, title, children }) => (
    <div style={{ marginBottom: '32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          backgroundColor: isDark ? '#8b5cf620' : '#8b5cf610', 
          borderRadius: '10px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          <Icon style={{ width: '20px', height: '20px', color: '#8b5cf6' }} />
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: '600', color: theme.text, margin: 0 }}>{title}</h2>
      </div>
      <div style={{ paddingLeft: '52px', color: theme.textMuted, fontSize: '15px', lineHeight: '1.7' }}>
        {children}
      </div>
    </div>
  );

  const handleNavigate = (page) => {
    if (onNavigate) {
      onNavigate(page);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: theme.bg,
      display: 'flex',
      flexDirection: 'column'
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
          onClick={() => handleNavigate('home')}
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
            src="https://i.imgur.com/R52jwPv.png" 
            alt="BrewedOps Logo" 
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px'
            }}
          />
          <span style={{ 
            fontSize: '20px', 
            fontWeight: '700', 
            color: theme.text,
            letterSpacing: '-0.5px'
          }}>
            BrewedOps
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
                when you use our financial tracking and business management application.
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
          
          <p><strong style={{ color: theme.text }}>Financial Data You Enter:</strong></p>
          <ul style={{ margin: '8px 0 16px', paddingLeft: '20px' }}>
            <li>Income entries and transactions</li>
            <li>Expense records and categorizations</li>
            <li>Client information (names, emails, billing rates, timezones)</li>
            <li>Invoice details and payment history</li>
            <li>Prospect/lead information</li>
            <li>Tax settings, TIN numbers, and calculations</li>
            <li>Wallet and account balances</li>
          </ul>
          
          <p><strong style={{ color: theme.text }}>Gmail Integration (Optional):</strong></p>
          <ul style={{ margin: '8px 0 16px', paddingLeft: '20px' }}>
            <li>When you connect your Gmail account, we request permission to send emails on your behalf</li>
            <li>We store OAuth tokens securely to maintain your connection</li>
            <li>We <strong>do not</strong> read, access, or store your emails or contacts</li>
            <li>We <strong>only</strong> use the Gmail API to send invoice emails that you explicitly request to send</li>
          </ul>
          
          <p><strong style={{ color: theme.text }}>Third-Party Integrations (Optional):</strong></p>
          <ul style={{ margin: '8px 0 16px', paddingLeft: '20px' }}>
            <li><strong>GoHighLevel (GHL):</strong> If you connect your GHL account, we may access your CRM data, contacts, pipelines, and automation workflows as authorized by you</li>
            <li><strong>Other Integrations:</strong> Any future integrations will request only the minimum permissions needed and will be clearly disclosed before connection</li>
            <li>You can disconnect any integration at any time through your account settings</li>
          </ul>
          
          <p><strong style={{ color: theme.text }}>Automatically Collected:</strong></p>
          <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
            <li>Browser type and version</li>
            <li>Device information (type, operating system)</li>
            <li>IP address (for security purposes)</li>
            <li>Usage patterns and feature interactions (for improving the app)</li>
            <li>Error logs and performance data</li>
          </ul>
        </Section>

        <Section icon={Eye} title="How We Use Your Information">
          <p>We use the information we collect to:</p>
          <ul style={{ margin: '12px 0', paddingLeft: '20px' }}>
            <li><strong style={{ color: theme.text }}>Provide our services:</strong> Track your income/expenses, manage clients, generate invoices, calculate taxes, and provide business insights</li>
            <li><strong style={{ color: theme.text }}>Send emails:</strong> Only when you explicitly click "Send via Gmail" for invoices</li>
            <li><strong style={{ color: theme.text }}>Enable integrations:</strong> Connect with third-party services like GoHighLevel when you authorize them</li>
            <li><strong style={{ color: theme.text }}>Improve our app:</strong> Understand how users interact with BrewedOps to make it better</li>
            <li><strong style={{ color: theme.text }}>Provide support:</strong> Respond to your questions and requests</li>
            <li><strong style={{ color: theme.text }}>Security:</strong> Detect and prevent fraud, abuse, or unauthorized access</li>
            <li><strong style={{ color: theme.text }}>Communications:</strong> Send important updates about your account or our services (you can opt out of non-essential emails)</li>
          </ul>
          
          <div style={{ 
            padding: '16px', 
            backgroundColor: isDark ? '#22c55e15' : '#22c55e10', 
            borderRadius: '10px',
            border: '1px solid #22c55e40',
            marginTop: '16px'
          }}>
            <p style={{ margin: 0, fontSize: '14px' }}>
              <strong style={{ color: '#22c55e' }}>✓ We will never:</strong> Sell your data, share it with advertisers, 
              use it for purposes other than providing and improving BrewedOps, or access more data than necessary.
            </p>
          </div>
        </Section>

        <Section icon={Mail} title="Gmail API Usage">
          <p>BrewedOps uses the Gmail API with limited scope for a specific purpose:</p>
          
          <div style={{ 
            padding: '16px', 
            backgroundColor: isDark ? '#27272a' : '#f4f4f5', 
            borderRadius: '10px',
            margin: '16px 0'
          }}>
            <p style={{ margin: '0 0 12px', fontWeight: '600', color: theme.text }}>Scope: gmail.send</p>
            <p style={{ margin: 0 }}>
              This permission allows BrewedOps to send emails on your behalf <strong>only when you explicitly 
              request it</strong> by clicking the "Send via Gmail" button for an invoice.
            </p>
          </div>
          
          <p><strong style={{ color: theme.text }}>What we DO:</strong></p>
          <ul style={{ margin: '8px 0 16px', paddingLeft: '20px' }}>
            <li>Send invoice emails to your clients when you click "Send via Gmail"</li>
            <li>Store encrypted OAuth tokens to maintain your Gmail connection</li>
          </ul>
          
          <p><strong style={{ color: theme.text }}>What we DO NOT do:</strong></p>
          <ul style={{ margin: '8px 0 16px', paddingLeft: '20px' }}>
            <li>Read your emails</li>
            <li>Access your contacts</li>
            <li>Send emails without your explicit action</li>
            <li>Store any email content</li>
            <li>Use your Gmail for marketing or any other purpose</li>
          </ul>
          
          <p>
            You can disconnect your Gmail account at any time through the VAKita Profile settings. 
            This will revoke our access and delete all stored tokens.
          </p>
        </Section>

        <Section icon={Lock} title="Data Security">
          <p>We implement industry-standard security measures to protect your data:</p>
          <ul style={{ margin: '12px 0', paddingLeft: '20px' }}>
            <li><strong style={{ color: theme.text }}>Encryption:</strong> All data is encrypted in transit (HTTPS/TLS) and at rest</li>
            <li><strong style={{ color: theme.text }}>Secure Storage:</strong> Data is stored on Supabase, which provides enterprise-grade security</li>
            <li><strong style={{ color: theme.text }}>OAuth 2.0:</strong> We use Google's secure OAuth 2.0 protocol for Gmail integration</li>
            <li><strong style={{ color: theme.text }}>Token Security:</strong> Gmail tokens are stored securely and refreshed automatically</li>
            <li><strong style={{ color: theme.text }}>Access Control:</strong> Your data is only accessible by you through your authenticated account</li>
          </ul>
        </Section>

        <Section icon={Users} title="Data Sharing">
          <p>We do not sell, trade, or rent your personal information. We may share data only in these limited circumstances:</p>
          <ul style={{ margin: '12px 0', paddingLeft: '20px' }}>
            <li><strong style={{ color: theme.text }}>Service Providers:</strong> We use Supabase for database hosting and Google for authentication/email services. These providers only process data on our behalf.</li>
            <li><strong style={{ color: theme.text }}>Connected Integrations:</strong> When you connect third-party services (like GoHighLevel), data may be shared as necessary for the integration to function</li>
            <li><strong style={{ color: theme.text }}>Legal Requirements:</strong> If required by law, legal process, or to protect our rights, property, or safety</li>
            <li><strong style={{ color: theme.text }}>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your data may be transferred (you will be notified)</li>
            <li><strong style={{ color: theme.text }}>With Your Consent:</strong> Any other sharing would require your explicit permission</li>
          </ul>
        </Section>

        <Section icon={Globe} title="Third-Party Services">
          <p>BrewedOps integrates with the following third-party services:</p>
          <ul style={{ margin: '12px 0', paddingLeft: '20px' }}>
            <li><strong style={{ color: theme.text }}>Supabase:</strong> Database and authentication (<a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: '#8b5cf6' }}>Privacy Policy</a>)</li>
            <li><strong style={{ color: theme.text }}>Google Gmail API:</strong> Email sending (<a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: '#8b5cf6' }}>Privacy Policy</a>)</li>
            <li><strong style={{ color: theme.text }}>GoHighLevel (GHL):</strong> CRM and automation integration (<a href="https://www.gohighlevel.com/privacy-policy" target="_blank" rel="noopener noreferrer" style={{ color: '#8b5cf6' }}>Privacy Policy</a>)</li>
            <li><strong style={{ color: theme.text }}>ExchangeRate-API:</strong> Currency conversion rates (<a href="https://www.exchangerate-api.com/terms" target="_blank" rel="noopener noreferrer" style={{ color: '#8b5cf6' }}>Terms</a>)</li>
          </ul>
          <p style={{ marginTop: '12px' }}>
            Each integration requires your explicit authorization. You can review and revoke access to any connected service through your account settings at any time.
          </p>
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

        <Section icon={MapPin} title="International Data Transfers">
          <p>Your data may be processed in countries other than your own. Our service providers (Supabase, Google) maintain servers globally. We ensure that:</p>
          <ul style={{ margin: '12px 0', paddingLeft: '20px' }}>
            <li>All transfers comply with applicable data protection laws</li>
            <li>Service providers maintain appropriate security measures</li>
            <li>Your rights are protected regardless of where data is processed</li>
          </ul>
        </Section>

        <Section icon={Bell} title="Children's Privacy">
          <p>BrewedOps is not intended for use by anyone under the age of 18. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us immediately and we will delete such information.</p>
        </Section>

        <Section icon={Trash2} title="Data Retention & Deletion">
          <p><strong style={{ color: theme.text }}>Retention:</strong></p>
          <p>We retain your data for as long as your account is active or as needed to provide services. Specifically:</p>
          <ul style={{ margin: '8px 0 16px', paddingLeft: '20px' }}>
            <li>Account data: Until you delete your account</li>
            <li>Financial records: As long as your account exists (for your records)</li>
            <li>OAuth tokens: Until you disconnect the service</li>
            <li>Logs and analytics: Up to 90 days</li>
          </ul>
          
          <p><strong style={{ color: theme.text }}>Deletion:</strong></p>
          <p>You can request deletion of your account and all associated data by contacting us. Upon request, we will:</p>
          <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
            <li>Delete all your personal information within 30 days</li>
            <li>Delete all financial data you've entered</li>
            <li>Revoke and delete any OAuth tokens</li>
            <li>Remove your account from our systems</li>
            <li>Notify you when deletion is complete</li>
          </ul>
          
          <p style={{ marginTop: '16px' }}>
            <strong style={{ color: theme.text }}>Integration Disconnection:</strong> You can disconnect any connected service (Gmail, GHL, etc.) at any time through 
            Settings. This immediately revokes our access to that service.
          </p>
        </Section>

        <Section icon={Shield} title="Your Rights">
          <p>Depending on your location, you may have the following rights:</p>
          <ul style={{ margin: '12px 0', paddingLeft: '20px' }}>
            <li><strong style={{ color: theme.text }}>Access:</strong> Request a copy of your personal data</li>
            <li><strong style={{ color: theme.text }}>Correction:</strong> Update or correct inaccurate information</li>
            <li><strong style={{ color: theme.text }}>Deletion:</strong> Request deletion of your data ("right to be forgotten")</li>
            <li><strong style={{ color: theme.text }}>Portability:</strong> Export your data in a machine-readable format</li>
            <li><strong style={{ color: theme.text }}>Restriction:</strong> Request that we limit processing of your data</li>
            <li><strong style={{ color: theme.text }}>Objection:</strong> Object to certain types of processing</li>
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
          <p style={{ marginTop: '12px' }}>
            We encourage you to review this policy periodically.
          </p>
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
          <p style={{ fontSize: '15px', color: '#8b5cf6', margin: '12px 0 0', fontWeight: '500' }}>
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
            onClick={() => handleNavigate('privacy')}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: '#8b5cf6', 
              fontSize: '13px', 
              cursor: 'pointer',
              padding: '4px 0',
              fontWeight: '500'
            }}
          >
            Privacy Policy
          </button>
          <button 
            onClick={() => handleNavigate('terms')}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: theme.textMuted, 
              fontSize: '13px', 
              cursor: 'pointer',
              padding: '4px 0'
            }}
          >
            Terms of Service
          </button>
          <button 
            onClick={() => handleNavigate('about')}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: theme.textMuted, 
              fontSize: '13px', 
              cursor: 'pointer',
              padding: '4px 0'
            }}
          >
            About Us
          </button>
        </div>
        <p style={{ fontSize: '13px', color: theme.textMuted, margin: 0 }}>
          © {new Date().getFullYear()} BrewedOps. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;
