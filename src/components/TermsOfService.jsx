// TermsOfService.jsx - Terms of Service page for BrewedOps
import React from 'react';
import { FileText, CheckCircle, Warning, Scales, Prohibit, ArrowsClockwise, Shield, Lightning, Globe, Lock } from '@phosphor-icons/react';
import SEO from './SEO';
import ScrollReveal from '@/components/ui/ScrollReveal';

// BREWEDOPS BRAND
const BRAND = { brown: '#3F200C', blue: '#004AAC', green: '#51AF43', cream: '#FFF0D4' };
const FONTS = { heading: "'Montserrat', sans-serif", body: "'Poppins', sans-serif" };

const TermsOfService = ({ onBack, onNavigate, isDark }) => {
  const theme = {
    bg: isDark ? '#0d0b09' : '#faf8f5',
    text: isDark ? '#f5f0eb' : '#3F200C',
    textMuted: isDark ? '#a09585' : '#7a6652',
    cardBg: isDark ? '#171411' : '#ffffff',
    cardBorder: isDark ? '#2a2420' : '#e8e0d4',
  };

  const lastUpdated = 'January 1, 2026';

  const Section = ({ icon: Icon, title, children, color = '#004AAC' }) => (
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
    <>
    <SEO
      title="Terms of Service | BrewedOps"
      description="Read the BrewedOps terms of service for our free productivity tools and Fuelyx nutrition app."
      keywords="BrewedOps terms of service, usage terms, Filipino VA tools"
    />
    <div style={{
      minHeight: '100vh',
      backgroundColor: theme.bg,
      display: 'flex',
      flexDirection: 'column',
      fontFamily: FONTS.heading
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
          <ScrollReveal>
          <div style={{ marginBottom: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <div style={{
                width: '56px',
                height: '56px',
                backgroundColor: isDark ? '#004AAC20' : '#004AAC15',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Scales style={{ width: '28px', height: '28px', color: '#004AAC' }} />
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
                productivity platform with 22+ tools for freelancers, as well as our mobile application <strong>Fuelyx</strong> (nutrition & fitness tracker). By using BrewedOps or Fuelyx, you agree to these Terms.
              </p>
            </div>
          </div>
          </ScrollReveal>

          <Section icon={CheckCircle} title="Acceptance of Terms" color="#22c55e">
            <p>By accessing or using BrewedOps, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these Terms, please do not use our service.</p>
            <p style={{ marginTop: '12px' }}>You must be at least 18 years old to use BrewedOps. By using our service, you represent that you are at least 18 years of age and have the legal capacity to enter into these Terms.</p>
          </Section>

          <Section icon={FileText} title="Description of Service">
            <p>BrewedOps is a comprehensive productivity platform with <strong style={{ color: theme.text }}>22+ free tools</strong> designed for Filipino virtual assistants and freelancers:</p>
            
            <p style={{ marginTop: '16px' }}><strong style={{ color: theme.text }}>Productivity Tools (4):</strong></p>
            <ul style={{ margin: '8px 0 16px', paddingLeft: '20px' }}>
              <li>Finance Tracker - Income, expenses, invoices, and tax calculations</li>
              <li>VAKita - VA earnings calculator and tracker</li>
              <li>Task Manager - Task organization and to-do lists</li>
              <li>Brewed Notes - Rich text notes with formatting</li>
            </ul>

            <p><strong style={{ color: theme.text }}>Image Tools (7):</strong></p>
            <ul style={{ margin: '8px 0 16px', paddingLeft: '20px' }}>
              <li>Background Remover, Image Cropper, Image Resizer</li>
              <li>Image Compressor, Image Converter, Color Picker, Image to PDF</li>
            </ul>

            <p><strong style={{ color: theme.text }}>Video Tools (2):</strong></p>
            <ul style={{ margin: '8px 0 16px', paddingLeft: '20px' }}>
              <li>Video Compressor, Video Trimmer</li>
            </ul>

            <p><strong style={{ color: theme.text }}>Document Tools (4):</strong></p>
            <ul style={{ margin: '8px 0 16px', paddingLeft: '20px' }}>
              <li>PDF Editor, PDF Merge, PDF Split, Markdown Viewer</li>
            </ul>

            <p><strong style={{ color: theme.text }}>Other Tools (9):</strong></p>
            <ul style={{ margin: '8px 0 16px', paddingLeft: '20px' }}>
              <li>QR Generator, Find & Replace, Case Converter, Word Counter, Mermaid Reader, JSON Formatter, Cron Generator, Timezone Converter, Focus Timer</li>
            </ul>

            <p><strong style={{ color: '#14b8a6' }}>Fuelyx Mobile App (Android):</strong></p>
            <ul style={{ margin: '8px 0 16px', paddingLeft: '20px' }}>
              <li>Calorie & macro tracking with 200+ Filipino foods database</li>
              <li>AI Food Scanner - camera-based food recognition</li>
              <li>Intermittent fasting timer with 6 protocols</li>
              <li>Workout logging and exercise tracking</li>
              <li>Weight tracking and progress analytics</li>
              <li>Step counter/pedometer integration</li>
              <li>Achievements, streaks, and badges</li>
            </ul>
            
            <p style={{ marginTop: '16px' }}>
              <strong style={{ color: theme.text }}>Important:</strong> BrewedOps provides tools for productivity, financial tracking, and file processing. 
              Fuelyx provides nutrition and fitness tracking tools.
              We are not financial advisors, accountants, nutritionists, or medical professionals. 
              Tax calculations are estimates only. Nutritional information is for general guidance.
              Always consult a qualified professional for financial, tax, health, and medical advice.
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
              <li>One account per person (no shared or team accounts currently)</li>
            </ul>
          </Section>

          <Section icon={Lightning} title="Acceptable Use">
            <p><strong style={{ color: theme.text }}>You agree to:</strong></p>
            <ul style={{ margin: '8px 0 16px', paddingLeft: '20px' }}>
              <li>Use BrewedOps only for lawful purposes</li>
              <li>Provide accurate information in your financial records</li>
              <li>Respect the intellectual property rights of others</li>
              <li>Maintain the confidentiality of your account</li>
            </ul>
            
            <p><strong style={{ color: theme.text }}>You agree NOT to:</strong></p>
            <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
              <li>Use the service for any illegal activities</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with the proper functioning of the service</li>
              <li>Upload malicious files or code</li>
              <li>Use automated tools to scrape or access data</li>
              <li>Misrepresent your identity or affiliation</li>
            </ul>
          </Section>

          <Section icon={Globe} title="File Processing Tools">
            <p>Our image, video, and document tools process files with the following terms:</p>
            <ul style={{ margin: '12px 0', paddingLeft: '20px' }}>
              <li><strong style={{ color: theme.text }}>Local Processing:</strong> All file processing happens in your browser - files are NOT uploaded to our servers</li>
              <li><strong style={{ color: theme.text }}>Your Responsibility:</strong> You are responsible for ensuring you have rights to process any files</li>
              <li><strong style={{ color: theme.text }}>No Guarantees:</strong> We do not guarantee specific results from file processing tools</li>
              <li><strong style={{ color: theme.text }}>File Limits:</strong> Tools may have size or format limitations</li>
            </ul>
          </Section>

          <Section icon={Warning} title="Disclaimer of Warranties" color="#f59e0b">
            <p>BrewedOps and Fuelyx are provided "AS IS" and "AS AVAILABLE" without warranties of any kind, either express or implied, including but not limited to:</p>
            <ul style={{ margin: '12px 0', paddingLeft: '20px' }}>
              <li>Warranties of merchantability or fitness for a particular purpose</li>
              <li>Warranties that the service will be uninterrupted or error-free</li>
              <li>Warranties regarding the accuracy of financial calculations or tax estimates</li>
              <li>Warranties regarding the results of file processing tools</li>
              <li>Warranties regarding the accuracy of nutritional information or calorie data</li>
              <li>Warranties regarding the accuracy of AI food recognition</li>
            </ul>
            <p style={{ marginTop: '12px' }}>
              <strong style={{ color: theme.text }}>Financial Disclaimer:</strong> Tax calculations and financial estimates are for informational purposes only. 
              Always verify with a qualified accountant or tax professional before making financial decisions.
            </p>
            <p style={{ marginTop: '12px' }}>
              <strong style={{ color: theme.text }}>Health Disclaimer:</strong> Fuelyx nutritional data, calorie estimates, and fitness tracking are for general informational purposes only. 
              The app is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a healthcare provider or registered dietitian before starting any diet or exercise program.
            </p>
          </Section>

          <Section icon={Shield} title="Limitation of Liability">
            <p>To the maximum extent permitted by law, BrewedOps and its creators shall not be liable for any:</p>
            <ul style={{ margin: '12px 0', paddingLeft: '20px' }}>
              <li>Indirect, incidental, special, or consequential damages</li>
              <li>Loss of profits, data, or business opportunities</li>
              <li>Damages arising from reliance on financial calculations or tax estimates</li>
              <li>Damages resulting from file processing or data loss</li>
            </ul>
            <p style={{ marginTop: '12px' }}>
              Our total liability shall not exceed the amount you paid to us (if any) 
              in the twelve (12) months preceding the claim, or $100, whichever is greater.
            </p>
          </Section>

          <Section icon={Lock} title="Intellectual Property">
            <p><strong style={{ color: theme.text }}>Our Property:</strong></p>
            <p>BrewedOps, including its design, features, code, and content, is owned by us and protected by intellectual property laws. You may not copy, modify, distribute, or create derivative works without our permission.</p>
            
            <p style={{ marginTop: '16px' }}><strong style={{ color: theme.text }}>Your Content:</strong></p>
            <p>You retain ownership of all data, files, notes, and content you create or upload. By using BrewedOps, you grant us a limited license to store and process your content solely to provide the service.</p>
            
            <p style={{ marginTop: '16px' }}><strong style={{ color: theme.text }}>Feedback:</strong></p>
            <p>If you provide feedback, suggestions, or ideas about BrewedOps, you grant us the right to use them without any obligation to you.</p>
          </Section>

          <Section icon={Prohibit} title="Termination" color="#ef4444">
            <p><strong style={{ color: theme.text }}>By You:</strong></p>
            <p>You may stop using BrewedOps at any time. You can request deletion of your account and data by contacting us. Upon deletion, your data will be removed within 30 days.</p>
            
            <p style={{ marginTop: '16px' }}><strong style={{ color: theme.text }}>By Us:</strong></p>
            <p>We may suspend or terminate your access to BrewedOps if you violate these Terms or engage in prohibited activities. We will make reasonable efforts to notify you before termination unless immediate action is required.</p>
            
            <p style={{ marginTop: '16px' }}><strong style={{ color: theme.text }}>Effect of Termination:</strong></p>
            <p>Upon termination, your right to use BrewedOps ceases immediately. We may delete your data after termination.</p>
          </Section>

          <Section icon={ArrowsClockwise} title="Changes to Terms">
            <p>We may update these Terms from time to time. When we make changes:</p>
            <ul style={{ margin: '12px 0', paddingLeft: '20px' }}>
              <li>We will update the "Last updated" date at the top of this page</li>
              <li>For significant changes, we will notify you via email or in-app notification</li>
              <li>Continued use of BrewedOps after changes constitutes acceptance of the new Terms</li>
              <li>If you disagree with changes, you may stop using the service and request account deletion</li>
            </ul>
          </Section>

          <Section icon={Scales} title="Governing Law & Disputes">
            <p><strong style={{ color: theme.text }}>Governing Law:</strong></p>
            <p>These Terms shall be governed by and construed in accordance with the laws of the Philippines, without regard to its conflict of law provisions.</p>
            
            <p style={{ marginTop: '16px' }}><strong style={{ color: theme.text }}>Dispute Resolution:</strong></p>
            <p>Any disputes arising from these Terms shall be resolved through good-faith negotiation first, then mediation if necessary, and litigation as a last resort in the appropriate courts in the Philippines.</p>
          </Section>

          {/* Contact */}
          <ScrollReveal>
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
            <p style={{ fontSize: '15px', color: '#004AAC', margin: '12px 0 0', fontWeight: '500' }}>
              brewedops@gmail.com
            </p>
          </div>
          </ScrollReveal>

          {/* Agreement Box */}
          <ScrollReveal>
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
          </ScrollReveal>
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
              color: theme.textMuted, 
              fontSize: '13px', 
              cursor: 'pointer',
              fontFamily: FONTS.body
            }}
          >
            Privacy Policy
          </button>
          <button 
            onClick={() => onNavigate('terms')}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: '#004AAC', 
              fontSize: '13px', 
              cursor: 'pointer',
              fontWeight: '600',
              fontFamily: FONTS.body
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
              fontFamily: FONTS.body
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

export default TermsOfService;
