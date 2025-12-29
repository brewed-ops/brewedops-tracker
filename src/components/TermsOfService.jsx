// TermsOfService.jsx - Terms of Service page for BrewedOps
import React from 'react';
import { ArrowLeft, FileText, CheckCircle, AlertTriangle, Scale, Ban, RefreshCw, Mail, Shield, Zap, Globe, Lock } from 'lucide-react';

const TermsOfService = ({ onBack, isDark }) => {
  const theme = {
    bg: isDark ? '#09090b' : '#ffffff',
    text: isDark ? '#fafafa' : '#18181b',
    textMuted: isDark ? '#a1a1aa' : '#71717a',
    cardBg: isDark ? '#18181b' : '#ffffff',
    cardBorder: isDark ? '#27272a' : '#e4e4e7',
  };

  const lastUpdated = 'December 29, 2024';

  const Section = ({ icon: Icon, title, children, color = '#8b5cf6' }) => (
    <div style={{ marginBottom: '32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          backgroundColor: isDark ? `${color}20` : `${color}10`, 
          borderRadius: '10px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          <Icon style={{ width: '20px', height: '20px', color: color }} />
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: '600', color: theme.text, margin: 0 }}>{title}</h2>
      </div>
      <div style={{ paddingLeft: '52px', color: theme.textMuted, fontSize: '15px', lineHeight: '1.7' }}>
        {children}
      </div>
    </div>
  );

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: theme.bg,
      padding: '24px'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          {onBack && (
            <button 
              onClick={onBack}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'transparent',
                border: 'none',
                color: theme.textMuted,
                fontSize: '14px',
                cursor: 'pointer',
                padding: '8px 0',
                marginBottom: '24px'
              }}
            >
              <ArrowLeft style={{ width: '18px', height: '18px' }} />
              Back to BrewedOps
            </button>
          )}
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
            <div style={{ 
              width: '56px', 
              height: '56px', 
              backgroundColor: isDark ? '#8b5cf620' : '#8b5cf615', 
              borderRadius: '14px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <Scale style={{ width: '28px', height: '28px', color: '#8b5cf6' }} />
            </div>
            <div>
              <h1 style={{ fontSize: '32px', fontWeight: '700', color: theme.text, margin: 0 }}>Terms of Service</h1>
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
              Welcome to <strong>BrewedOps</strong>! These Terms of Service ("Terms") govern your use of our 
              financial tracking application. By using BrewedOps, you agree to these Terms.
            </p>
          </div>
        </div>

        {/* Content */}
        <Section icon={CheckCircle} title="Acceptance of Terms" color="#22c55e">
          <p>By accessing or using BrewedOps, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these Terms, please do not use our service.</p>
          <p style={{ marginTop: '12px' }}>You must be at least 18 years old to use BrewedOps. By using our service, you represent that you are at least 18 years of age and have the legal capacity to enter into these Terms.</p>
        </Section>

        <Section icon={FileText} title="Description of Service">
          <p>BrewedOps is a financial tracking and business management application designed for freelancers and virtual assistants. Our service includes:</p>
          <ul style={{ margin: '12px 0', paddingLeft: '20px' }}>
            <li>Income and expense tracking with multi-currency support</li>
            <li>Client management and CRM features</li>
            <li>Invoice generation, management, and sending</li>
            <li>Prospect/lead tracking and pipeline management</li>
            <li>Tax calculation assistance (for Philippine taxes)</li>
            <li>Timezone management for international clients</li>
            <li>Gmail integration for sending invoices (optional)</li>
            <li>GoHighLevel (GHL) integration for CRM automation (optional, coming soon)</li>
            <li>Additional third-party integrations as they become available</li>
          </ul>
          <p style={{ marginTop: '12px' }}>
            <strong style={{ color: theme.text }}>Important:</strong> BrewedOps provides tools for financial tracking and tax estimation. 
            We are not financial advisors, accountants, or legal professionals. Tax calculations are estimates only. 
            Always consult a qualified professional for financial, tax, and legal advice.
          </p>
        </Section>

        <Section icon={Shield} title="User Accounts">
          <p><strong style={{ color: theme.text }}>Account Creation:</strong></p>
          <ul style={{ margin: '8px 0 16px', paddingLeft: '20px' }}>
            <li>You must provide accurate and complete information when creating an account</li>
            <li>You are responsible for maintaining the security of your account credentials</li>
            <li>You must use a valid email address that you have access to</li>
            <li>You must notify us immediately of any unauthorized access to your account</li>
          </ul>
          
          <p><strong style={{ color: theme.text }}>Account Responsibilities:</strong></p>
          <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
            <li>You are responsible for all activities that occur under your account</li>
            <li>You must not share your account credentials with others</li>
            <li>You must not create multiple accounts for deceptive purposes</li>
            <li>You must keep your account information up to date</li>
          </ul>
        </Section>

        <Section icon={Mail} title="Gmail Integration">
          <p>BrewedOps offers optional Gmail integration to send invoice emails directly. By connecting your Gmail account, you:</p>
          <ul style={{ margin: '12px 0', paddingLeft: '20px' }}>
            <li>Grant BrewedOps permission to send emails on your behalf when you explicitly request it</li>
            <li>Acknowledge that you are responsible for the content of emails sent through our service</li>
            <li>Agree to use this feature only for legitimate business purposes (sending invoices to your clients)</li>
            <li>Understand you can disconnect Gmail at any time through your profile settings</li>
          </ul>
          
          <div style={{ 
            padding: '16px', 
            backgroundColor: isDark ? '#f59e0b15' : '#f59e0b10', 
            borderRadius: '10px',
            border: '1px solid #f59e0b40',
            marginTop: '16px'
          }}>
            <p style={{ margin: 0, fontSize: '14px' }}>
              <strong style={{ color: '#f59e0b' }}>⚠️ Prohibited:</strong> You must not use the Gmail integration to send spam, 
              unsolicited emails, or any content that violates Google's Terms of Service.
            </p>
          </div>
        </Section>

        <Section icon={Zap} title="Third-Party Integrations">
          <p>BrewedOps may offer integrations with third-party services such as GoHighLevel (GHL), and other platforms. When using integrations:</p>
          <ul style={{ margin: '12px 0', paddingLeft: '20px' }}>
            <li>You must have proper authorization to connect your third-party accounts</li>
            <li>You are responsible for complying with the terms of service of each connected platform</li>
            <li>We are not responsible for actions taken by third-party services or changes to their APIs</li>
            <li>You can disconnect any integration at any time through your account settings</li>
            <li>Data synced between BrewedOps and third-party services is subject to both our Privacy Policy and the third party's privacy policy</li>
          </ul>
          
          <p style={{ marginTop: '12px' }}><strong style={{ color: theme.text }}>GoHighLevel (GHL) Integration:</strong></p>
          <p>When you connect your GHL account, you authorize BrewedOps to access and interact with your GHL data as needed for the integration features. This may include contacts, pipelines, automations, and other CRM data. You must comply with GHL's terms of service when using this integration.</p>
        </Section>

        <Section icon={Ban} title="Prohibited Uses" color="#ef4444">
          <p>You agree NOT to use BrewedOps to:</p>
          <ul style={{ margin: '12px 0', paddingLeft: '20px' }}>
            <li>Violate any applicable laws or regulations</li>
            <li>Send spam, unsolicited messages, or malicious content</li>
            <li>Infringe on the intellectual property rights of others</li>
            <li>Attempt to gain unauthorized access to our systems or other users' accounts</li>
            <li>Interfere with or disrupt our services or servers</li>
            <li>Upload malicious code, viruses, or harmful content</li>
            <li>Collect or harvest user data without authorization</li>
            <li>Impersonate another person, entity, or BrewedOps staff</li>
            <li>Use the service for illegal financial activities (money laundering, tax evasion, fraud, etc.)</li>
            <li>Reverse engineer, decompile, or attempt to extract source code</li>
            <li>Use automated systems (bots, scrapers) to access the service without permission</li>
            <li>Resell or redistribute access to BrewedOps without authorization</li>
          </ul>
        </Section>

        <Section icon={FileText} title="User Content & Data">
          <p><strong style={{ color: theme.text }}>Ownership:</strong></p>
          <p>You retain full ownership of all data and content you enter into BrewedOps (financial records, client information, invoices, etc.).</p>
          
          <p style={{ marginTop: '16px' }}><strong style={{ color: theme.text }}>License to Us:</strong></p>
          <p>By using BrewedOps, you grant us a limited, non-exclusive license to store, process, and display your data solely for the purpose of providing our services to you. This license terminates when you delete your account.</p>
          
          <p style={{ marginTop: '16px' }}><strong style={{ color: theme.text }}>Your Responsibilities:</strong></p>
          <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
            <li>You are responsible for the accuracy of data you enter</li>
            <li>You are responsible for maintaining backups of important data</li>
            <li>You must have the right to use any information you enter (e.g., client email addresses)</li>
            <li>You must not upload content that infringes on others' rights</li>
          </ul>
          
          <p style={{ marginTop: '16px' }}><strong style={{ color: theme.text }}>Data Export:</strong></p>
          <p>You may request an export of your data at any time by contacting us.</p>
        </Section>

        <Section icon={AlertTriangle} title="Disclaimers" color="#f59e0b">
          <p><strong style={{ color: theme.text }}>Service Provided "As Is":</strong></p>
          <p>BrewedOps is provided "as is" and "as available" without warranties of any kind, either express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, and non-infringement.</p>
          
          <p style={{ marginTop: '16px' }}><strong style={{ color: theme.text }}>No Financial Advice:</strong></p>
          <p>BrewedOps provides tools for financial tracking and tax estimation but does NOT provide financial, tax, or legal advice. Tax calculations are estimates only and should not be relied upon for filing taxes. Always consult a qualified accountant, tax professional, or attorney.</p>
          
          <p style={{ marginTop: '16px' }}><strong style={{ color: theme.text }}>Third-Party Services:</strong></p>
          <p>We are not responsible for the availability, accuracy, or actions of third-party services (Google Gmail API, GoHighLevel, exchange rate providers, etc.). Your use of third-party services is subject to their respective terms.</p>
          
          <p style={{ marginTop: '16px' }}><strong style={{ color: theme.text }}>Service Availability:</strong></p>
          <p>We do not guarantee uninterrupted or error-free service. We may perform maintenance, updates, or experience outages. We will make reasonable efforts to notify you of planned maintenance.</p>
        </Section>

        <Section icon={Scale} title="Limitation of Liability">
          <p>To the maximum extent permitted by law, BrewedOps and its creators shall not be liable for:</p>
          <ul style={{ margin: '12px 0', paddingLeft: '20px' }}>
            <li>Any indirect, incidental, special, consequential, or punitive damages</li>
            <li>Loss of profits, data, or business opportunities</li>
            <li>Inaccurate tax calculations or financial data</li>
            <li>Service interruptions or data loss</li>
            <li>Actions of third-party services</li>
          </ul>
          <p style={{ marginTop: '12px' }}>
            Our total liability for any claim arising from these Terms shall not exceed the amount you paid us 
            in the twelve (12) months preceding the claim, or $100, whichever is greater.
          </p>
        </Section>

        <Section icon={RefreshCw} title="Changes to Terms">
          <p>We may update these Terms from time to time. When we make changes:</p>
          <ul style={{ margin: '12px 0', paddingLeft: '20px' }}>
            <li>We will update the "Last updated" date at the top of this page</li>
            <li>For significant changes, we will notify you via email or in-app notification</li>
            <li>Continued use of BrewedOps after changes constitutes acceptance of the new Terms</li>
            <li>If you disagree with changes, you may stop using the service and request account deletion</li>
          </ul>
        </Section>

        <Section icon={Lock} title="Intellectual Property">
          <p><strong style={{ color: theme.text }}>Our Property:</strong></p>
          <p>BrewedOps, including its design, features, code, and content, is owned by us and protected by intellectual property laws. You may not copy, modify, distribute, or create derivative works without our permission.</p>
          
          <p style={{ marginTop: '16px' }}><strong style={{ color: theme.text }}>Feedback:</strong></p>
          <p>If you provide feedback, suggestions, or ideas about BrewedOps, you grant us the right to use them without any obligation to you.</p>
        </Section>

        <Section icon={Shield} title="Indemnification">
          <p>You agree to indemnify, defend, and hold harmless BrewedOps and its creators from any claims, damages, losses, or expenses (including legal fees) arising from:</p>
          <ul style={{ margin: '12px 0', paddingLeft: '20px' }}>
            <li>Your use of the service</li>
            <li>Your violation of these Terms</li>
            <li>Your violation of any third-party rights</li>
            <li>Content you submit or share through the service</li>
          </ul>
        </Section>

        <Section icon={Ban} title="Termination" color="#ef4444">
          <p><strong style={{ color: theme.text }}>By You:</strong></p>
          <p>You may stop using BrewedOps at any time. You can request deletion of your account and data by contacting us. Upon deletion, your data will be removed within 30 days.</p>
          
          <p style={{ marginTop: '16px' }}><strong style={{ color: theme.text }}>By Us:</strong></p>
          <p>We may suspend or terminate your access to BrewedOps if you violate these Terms or engage in prohibited activities. We will make reasonable efforts to notify you before termination unless immediate action is required due to:</p>
          <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
            <li>Violation of law</li>
            <li>Security threats</li>
            <li>Fraud or abuse</li>
            <li>Harm to other users</li>
          </ul>
          
          <p style={{ marginTop: '16px' }}><strong style={{ color: theme.text }}>Effect of Termination:</strong></p>
          <p>Upon termination, your right to use BrewedOps ceases immediately. Sections that by their nature should survive termination (such as Limitation of Liability, Indemnification, and Governing Law) will remain in effect.</p>
        </Section>

        <Section icon={Scale} title="Governing Law & Disputes">
          <p><strong style={{ color: theme.text }}>Governing Law:</strong></p>
          <p>These Terms shall be governed by and construed in accordance with the laws of the Philippines, without regard to its conflict of law provisions.</p>
          
          <p style={{ marginTop: '16px' }}><strong style={{ color: theme.text }}>Dispute Resolution:</strong></p>
          <p>Any disputes arising from these Terms or your use of BrewedOps shall be resolved as follows:</p>
          <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
            <li><strong>Good-faith negotiation:</strong> We will first attempt to resolve disputes amicably</li>
            <li><strong>Mediation:</strong> If negotiation fails, disputes may be submitted to mediation</li>
            <li><strong>Litigation:</strong> As a last resort, disputes may be submitted to the appropriate courts in the Philippines</li>
          </ul>
        </Section>

        <Section icon={Globe} title="General Provisions">
          <p><strong style={{ color: theme.text }}>Entire Agreement:</strong></p>
          <p>These Terms, together with our Privacy Policy, constitute the entire agreement between you and BrewedOps regarding the service.</p>
          
          <p style={{ marginTop: '16px' }}><strong style={{ color: theme.text }}>Severability:</strong></p>
          <p>If any provision of these Terms is found to be unenforceable, the remaining provisions will continue in full force and effect.</p>
          
          <p style={{ marginTop: '16px' }}><strong style={{ color: theme.text }}>Waiver:</strong></p>
          <p>Our failure to enforce any right or provision of these Terms shall not be considered a waiver of those rights.</p>
          
          <p style={{ marginTop: '16px' }}><strong style={{ color: theme.text }}>Assignment:</strong></p>
          <p>You may not assign or transfer these Terms without our consent. We may assign our rights and obligations without restriction.</p>
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
            If you have questions about these Terms of Service, please contact us at:
          </p>
          <p style={{ fontSize: '15px', color: '#8b5cf6', margin: '12px 0 0', fontWeight: '500' }}>
            support@brewedops.com
          </p>
        </div>

        {/* Agreement Box */}
        <div style={{ 
          padding: '20px', 
          backgroundColor: isDark ? '#22c55e15' : '#22c55e10', 
          borderRadius: '12px',
          border: '1px solid #22c55e40',
          marginTop: '24px',
          textAlign: 'center'
        }}>
          <CheckCircle style={{ width: '32px', height: '32px', color: '#22c55e', margin: '0 auto 12px' }} />
          <p style={{ fontSize: '15px', color: theme.text, margin: 0, fontWeight: '500' }}>
            By using BrewedOps, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
          </p>
        </div>

        {/* Footer */}
        <div style={{ 
          marginTop: '40px', 
          paddingTop: '24px', 
          borderTop: '1px solid ' + theme.cardBorder,
          textAlign: 'center'
        }}>
          <p style={{ fontSize: '13px', color: theme.textMuted, margin: 0 }}>
            © {new Date().getFullYear()} BrewedOps. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
