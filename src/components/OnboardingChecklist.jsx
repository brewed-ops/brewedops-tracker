import React, { useState, useEffect, useRef } from 'react';
import { ClipboardText, SpinnerGap, Copy, Check, ArrowClockwise, WarningCircle, Lightbulb } from '@phosphor-icons/react';
import SEO from './SEO';

// ============================================
// BRAND & THEME (matches project conventions)
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

const getTheme = (isDark) => ({
  bg: isDark ? '#0d0b09' : '#faf8f5',
  cardBg: isDark ? '#171411' : '#ffffff',
  cardBorder: isDark ? '#2a2420' : '#e8e0d4',
  text: isDark ? '#f5f0eb' : '#3F200C',
  textMuted: isDark ? '#a09585' : '#7a6652',
  inputBg: isDark ? '#1e1a16' : '#faf8f5',
  inputBorder: isDark ? '#332d26' : '#e0d6c8',
  errorBg: isDark ? '#260a0a' : '#fef2f2',
  errorBorder: isDark ? '#7f1d1d' : '#fecaca',
  errorText: isDark ? '#fca5a5' : '#dc2626',
  successBg: isDark ? '#0a2618' : '#ecfdf5',
  successBorder: isDark ? '#166534' : '#86efac',
});

// ============================================
// OPENAI CONFIG (Edge Function + fallback)
// ============================================
const OPENAI_CONFIG = {
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
  edgeFunctionUrl: import.meta.env.VITE_OPENAI_EDGE_URL || '',
  model: 'gpt-4o-mini',
};

// ============================================
// COOLDOWN CONFIG
// ============================================
const COOLDOWN_KEY = 'brewedops_onboarding_cooldown_end';
const COOLDOWN_MS = 1 * 60 * 1000; // 1 minute

// ============================================
// NICHE OPTIONS
// ============================================
const NICHE_OPTIONS = [
  { value: 'social-media', label: 'Social Media Management' },
  { value: 'email-inbox', label: 'Email/Inbox Management' },
  { value: 'general-admin', label: 'General Admin' },
  { value: 'bookkeeping', label: 'Bookkeeping' },
  { value: 'customer-service', label: 'Customer Service' },
  { value: 'crm-ghl', label: 'CRM/GHL Management' },
  { value: 'content-writing', label: 'Content Writing' },
  { value: 'ecommerce', label: 'E-commerce' },
];

// ============================================
// ENGAGEMENT TYPE OPTIONS
// ============================================
const ENGAGEMENT_OPTIONS = [
  { value: 'ongoing', label: 'Ongoing Monthly' },
  { value: 'project', label: 'Project-Based' },
  { value: 'trial', label: 'Trial Period' },
];

// ============================================
// SYSTEM PROMPT
// ============================================
const SYSTEM_PROMPT = `You are an expert virtual assistant business consultant who helps VAs create comprehensive client onboarding checklists. Your checklists help VAs look professional, set clear expectations, and gather everything needed to start working efficiently.

## YOUR EXPERTISE
You create actionable checklists that cover:
- Information to collect from the client
- Access and credentials to request
- Tools and accounts to set up
- Communication expectations to establish
- First-week priorities and quick wins
- Boundaries and scope to clarify upfront

## CHECKLIST STRUCTURE

### Section 1: Client Information to Collect
- Business name, website, social media handles
- Brand guidelines (colors, fonts, tone of voice)
- Target audience description
- Key competitors
- Business goals for the engagement

### Section 2: Access & Credentials
- Specific to the VA niche (social media logins, email access, CRM access, etc.)
- Password manager setup
- Tool access levels and permissions

### Section 3: Communication Setup
- Preferred communication channel (Slack, email, WhatsApp, etc.)
- Response time expectations
- Meeting schedule (weekly check-ins, daily standups)
- Reporting format and frequency
- Escalation process for urgent issues

### Section 4: Scope & Boundaries
- Confirmed list of tasks and responsibilities
- Working hours and timezone
- What is NOT included in the engagement
- Process for handling additional requests
- Revision and approval workflow

### Section 5: Tools & Systems
- Niche-specific tools to set up or get access to
- Project management tool (Asana, Trello, ClickUp)
- Time tracking setup
- File sharing and storage

### Section 6: First Week Plan
- Quick wins to demonstrate value immediately
- Priority tasks for the first 3-5 days
- Initial audit or assessment tasks
- Documentation of existing processes (SOPs)

## NICHE-SPECIFIC CUSTOMIZATION
Tailor the checklist based on the VA niche:
- Social Media: Content calendar access, Canva templates, scheduling tools, brand voice guide
- Email Management: Email client access, signature setup, priority/label system, response templates
- Bookkeeping: Accounting software access, bank feed connections, chart of accounts, receipt workflow
- CRM/GHL: Sub-account access, pipeline setup, automation review, integration connections
- Customer Service: Help desk access, knowledge base, escalation rules, response templates
- E-commerce: Store admin access, shipping accounts, inventory system, return policy
- Content Writing: Style guide, SEO tools, CMS access, editorial calendar
- General Admin: Calendar access, contact lists, document templates, filing system

## OUTPUT FORMAT
Return a structured checklist with clear sections and checkbox items. Use this format:
Section headers in CAPS followed by items with "[ ]" checkbox prefix.
Each item should be actionable and specific.
Include helpful notes in parentheses where relevant.
No markdown formatting -- plain text with checkboxes.

## STRICT RULES
- Every item must be actionable (starts with a verb)
- Include estimated time for completing the full onboarding
- Prioritize items by importance (most critical first in each section)
- Include at least one "quick win" task in the first-week section
- Customize heavily based on the selected niche
- Keep each item concise but specific`;

// ============================================
// TIPS DATA
// ============================================
const TIPS = [
  { title: 'Complete onboarding before starting work', body: 'Rushing into tasks without proper onboarding leads to mistakes and miscommunication. Take 1-2 days to get properly set up.' },
  { title: 'Document everything from day one', body: 'Create SOPs as you learn processes. This protects you if the client questions your work and helps future handoffs.' },
  { title: 'Set communication boundaries early', body: 'Agree on response times, working hours, and preferred channels upfront. This prevents burnout and unrealistic expectations.' },
  { title: 'Deliver a quick win in the first week', body: 'Completing one visible, impactful task early builds trust and shows the client they made the right hiring decision.' },
];

// ============================================
// COPY BUTTON COMPONENT
// ============================================
const CopyButton = ({ text, isDark, label = 'Copy Checklist' }) => {
  const [copied, setCopied] = useState(false);
  const theme = getTheme(isDark);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      title={copied ? 'Copied!' : 'Copy to clipboard'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '8px 14px',
        backgroundColor: copied ? (isDark ? '#0a2618' : '#ecfdf5') : 'transparent',
        border: `1px solid ${copied ? (isDark ? '#166534' : '#86efac') : theme.cardBorder}`,
        borderRadius: '8px',
        color: copied ? (isDark ? '#4ade80' : '#16a34a') : theme.text,
        fontSize: '13px',
        fontWeight: '500',
        fontFamily: FONTS.body,
        cursor: 'pointer',
        transition: 'all 0.15s ease',
      }}
    >
      {copied ? <Check size={14} weight="bold" /> : <Copy size={14} />}
      {copied ? 'Copied!' : label}
    </button>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================
const OnboardingChecklist = ({ isDark }) => {
  const theme = getTheme(isDark);

  // Form state
  const [niche, setNiche] = useState('social-media');
  const [clientDetails, setClientDetails] = useState('');
  const [engagementType, setEngagementType] = useState('ongoing');

  // Generation state
  const [loading, setLoading] = useState(false);
  const [checklist, setChecklist] = useState('');
  const [error, setError] = useState('');
  const [cooldownRemaining, setCooldownRemaining] = useState(0);

  const resultsRef = useRef(null);

  // Cooldown timer
  useEffect(() => {
    const checkCooldown = () => {
      const endTime = parseInt(localStorage.getItem(COOLDOWN_KEY) || '0', 10);
      const remaining = Math.max(0, endTime - Date.now());
      setCooldownRemaining(remaining);
      return remaining;
    };
    checkCooldown();
    const interval = setInterval(() => {
      if (checkCooldown() <= 0) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, [checklist]);

  // Generate checklist
  const handleGenerate = async () => {
    if (!niche) return;
    if (cooldownRemaining > 0) return;

    setLoading(true);
    setError('');
    setChecklist('');

    try {
      const nicheLabel = NICHE_OPTIONS.find((n) => n.value === niche)?.label || niche;
      const engagementLabel = ENGAGEMENT_OPTIONS.find((e) => e.value === engagementType)?.label || engagementType;

      const userMessage = [
        `VA NICHE / SERVICES: ${nicheLabel}`,
        `\nENGAGEMENT TYPE: ${engagementLabel}`,
        clientDetails.trim() ? `\nCLIENT DETAILS:\n${clientDetails.trim()}` : '',
      ].filter(Boolean).join('\n');

      const chatMessages = [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMessage },
      ];

      let responseText = '';

      if (OPENAI_CONFIG.edgeFunctionUrl) {
        const res = await fetch(OPENAI_CONFIG.edgeFunctionUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            type: 'chat',
            messages: chatMessages,
            temperature: 0.6,
            max_tokens: 2500,
          }),
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `API error: ${res.status}`);
        }
        const data = await res.json();
        responseText = data.content || '';
      } else if (OPENAI_CONFIG.apiKey) {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_CONFIG.apiKey}`,
          },
          body: JSON.stringify({
            model: OPENAI_CONFIG.model,
            messages: chatMessages,
            temperature: 0.6,
            max_tokens: 2500,
          }),
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error?.message || `OpenAI API error: ${res.status}`);
        }
        const data = await res.json();
        responseText = data.choices?.[0]?.message?.content || '';
      } else {
        throw new Error('API_NOT_CONFIGURED');
      }

      if (!responseText) {
        throw new Error('Empty response from API');
      }

      setChecklist(responseText.trim());
      localStorage.setItem(COOLDOWN_KEY, String(Date.now() + COOLDOWN_MS));
      setCooldownRemaining(COOLDOWN_MS);

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    } catch (err) {
      if (err.message === 'API_NOT_CONFIGURED') {
        setError('API not configured. Set VITE_OPENAI_EDGE_URL or VITE_OPENAI_API_KEY in your .env file.');
      } else {
        setError(err.message || 'Failed to generate checklist. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const cooldownSeconds = Math.ceil(cooldownRemaining / 1000);
  const canGenerate = niche.length > 0 && cooldownRemaining <= 0 && !loading;

  // ============================================
  // FORMATTED RESULT RENDERER
  // ============================================
  const renderFormattedResult = (text) => {
    const lines = text.split('\n');
    const elements = [];
    let k = 0;
    let sectionCount = 0;

    for (let i = 0; i < lines.length; i++) {
      const trimmed = lines[i].trim();

      if (!trimmed) {
        elements.push(<div key={k++} style={{ height: '6px' }} />);
        continue;
      }

      // Section headers: ALL CAPS lines (e.g. "CLIENT INFORMATION TO COLLECT")
      const isAllCaps = trimmed.length > 3 && trimmed === trimmed.toUpperCase() && /[A-Z]{2}/.test(trimmed) && !trimmed.startsWith('[ ]') && !trimmed.startsWith('[X]');
      const sectionNumMatch = trimmed.match(/^(?:SECTION\s+\d+|#{1,3})\s*[:./-]\s*(.+)/i);

      if (isAllCaps || sectionNumMatch) {
        sectionCount++;
        const headerText = sectionNumMatch ? sectionNumMatch[1] : trimmed;
        elements.push(
          <div key={k++} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginTop: i > 0 ? '18px' : '0',
            marginBottom: '10px',
            paddingBottom: '8px',
            borderBottom: `1px solid ${theme.cardBorder}`,
          }}>
            <span style={{
              fontSize: '11px',
              fontWeight: '700',
              color: BRAND.blue,
              backgroundColor: BRAND.blue + '15',
              width: '24px',
              height: '24px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              fontFamily: FONTS.body,
            }}>
              {sectionCount}
            </span>
            <span style={{
              fontSize: '13px',
              fontWeight: '700',
              color: theme.text,
              fontFamily: FONTS.heading,
              letterSpacing: '0.3px',
              textTransform: 'uppercase',
            }}>
              {headerText}
            </span>
          </div>
        );
        continue;
      }

      // Checkbox items: "[ ]" or "[X]"
      const checkboxMatch = trimmed.match(/^\[([xX ])\]\s*(.*)/);
      if (checkboxMatch) {
        const isChecked = checkboxMatch[1].toLowerCase() === 'x';
        const itemText = checkboxMatch[2];
        elements.push(
          <div key={k++} style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            paddingLeft: '10px',
            marginBottom: '6px',
          }}>
            <div style={{
              width: '18px',
              height: '18px',
              borderRadius: '4px',
              border: `2px solid ${isChecked ? BRAND.green : theme.inputBorder}`,
              backgroundColor: isChecked ? BRAND.green + '20' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              marginTop: '2px',
            }}>
              {isChecked && (
                <Check size={10} weight="bold" style={{ color: BRAND.green }} />
              )}
            </div>
            <span style={{
              fontSize: '13px',
              color: theme.text,
              fontFamily: FONTS.body,
              lineHeight: '1.6',
            }}>
              {itemText}
            </span>
          </div>
        );
        continue;
      }

      // Estimated time or completion info
      if (/^estimated|^total time|^completion/i.test(trimmed)) {
        elements.push(
          <div key={k++} style={{
            marginTop: '14px',
            padding: '10px 14px',
            backgroundColor: isDark ? BRAND.green + '10' : BRAND.green + '08',
            border: `1px solid ${isDark ? BRAND.green + '25' : BRAND.green + '20'}`,
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <ClipboardText size={14} style={{ color: BRAND.green, flexShrink: 0 }} />
            <span style={{
              fontSize: '13px',
              fontWeight: '600',
              color: theme.text,
              fontFamily: FONTS.body,
            }}>
              {trimmed}
            </span>
          </div>
        );
        continue;
      }

      // Bullet items (without checkbox)
      if (trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
        const bulletText = trimmed.replace(/^[-•]\s+/, '');
        elements.push(
          <div key={k++} style={{
            display: 'flex',
            gap: '10px',
            paddingLeft: '10px',
            marginBottom: '4px',
          }}>
            <span style={{
              color: BRAND.blue,
              fontSize: '8px',
              lineHeight: '1.6',
              flexShrink: 0,
              marginTop: '5px',
            }}>&#9679;</span>
            <span style={{
              fontSize: '13px',
              color: theme.text,
              fontFamily: FONTS.body,
              lineHeight: '1.6',
            }}>
              {bulletText}
            </span>
          </div>
        );
        continue;
      }

      // Regular text / notes
      elements.push(
        <p key={k++} style={{
          margin: '0 0 4px',
          fontSize: '13px',
          color: theme.textMuted,
          fontFamily: FONTS.body,
          lineHeight: '1.6',
          paddingLeft: '4px',
        }}>
          {trimmed}
        </p>
      );
    }

    return <div>{elements}</div>;
  };

  // ============================================
  // RENDER
  // ============================================
  return (
    <div style={{ fontFamily: FONTS.body, maxWidth: '720px', margin: '0 auto' }}>
      <SEO
        title="Free AI Client Onboarding Checklist | BrewedOps"
        description="Generate a comprehensive client onboarding checklist for your VA niche. Free AI tool for virtual assistants and freelancers."
        keywords="client onboarding checklist, VA onboarding, freelancer checklist, new client checklist"
      />

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>

      {/* ---- HEADER ---- */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: `linear-gradient(135deg, ${BRAND.blue}20, ${BRAND.green}20)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <ClipboardText size={22} weight="duotone" style={{ color: BRAND.blue }} />
          </div>
          <div>
            <h2 style={{
              margin: 0,
              fontSize: '22px',
              fontWeight: '800',
              color: theme.text,
              fontFamily: FONTS.heading,
              letterSpacing: '-0.3px',
            }}>
              AI Client Onboarding Checklist
            </h2>
          </div>
        </div>
        <p style={{
          margin: 0,
          fontSize: '14px',
          color: theme.textMuted,
          lineHeight: '1.6',
        }}>
          Select your VA niche and get a comprehensive onboarding checklist -- everything you need to collect, set up, and clarify before starting with a new client.
        </p>
      </div>

      {/* ---- FORM ---- */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '24px' }}>

        {/* VA Niche / Services */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '13px',
            fontWeight: '600',
            color: theme.text,
            fontFamily: FONTS.body,
            marginBottom: '8px',
          }}>
            VA Niche / Services <span style={{ color: BRAND.blue }}>*</span>
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {NICHE_OPTIONS.map((opt) => {
              const isActive = niche === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => setNiche(opt.value)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: isActive ? BRAND.blue : 'transparent',
                    color: isActive ? '#ffffff' : theme.text,
                    border: `1px solid ${isActive ? BRAND.blue : theme.inputBorder}`,
                    borderRadius: '100px',
                    fontSize: '13px',
                    fontWeight: isActive ? '600' : '400',
                    fontFamily: FONTS.body,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Client Details (optional) */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '13px',
            fontWeight: '600',
            color: theme.text,
            fontFamily: FONTS.body,
            marginBottom: '6px',
          }}>
            Client Details <span style={{ fontSize: '11px', fontWeight: '400', color: theme.textMuted }}>(optional)</span>
          </label>
          <textarea
            value={clientDetails}
            onChange={(e) => setClientDetails(e.target.value.slice(0, 1500))}
            placeholder="Tell us about the client: industry, business type, team size, tools they use..."
            rows={4}
            style={{
              width: '100%',
              backgroundColor: theme.inputBg,
              border: `1px solid ${theme.inputBorder}`,
              borderRadius: '10px',
              padding: '12px 14px',
              fontSize: '14px',
              fontFamily: FONTS.body,
              color: theme.text,
              outline: 'none',
              resize: 'vertical',
              lineHeight: '1.6',
              boxSizing: 'border-box',
              transition: 'border-color 0.15s ease',
            }}
            onFocus={(e) => { e.target.style.borderColor = BRAND.blue; }}
            onBlur={(e) => { e.target.style.borderColor = theme.inputBorder; }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
            <span style={{ fontSize: '11px', color: theme.textMuted }}>
              {clientDetails.length}/1500
            </span>
          </div>
        </div>

        {/* Engagement Type */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '13px',
            fontWeight: '600',
            color: theme.text,
            fontFamily: FONTS.body,
            marginBottom: '8px',
          }}>
            Engagement Type
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {ENGAGEMENT_OPTIONS.map((opt) => {
              const isActive = engagementType === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => setEngagementType(opt.value)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: isActive ? BRAND.blue : 'transparent',
                    color: isActive ? '#ffffff' : theme.text,
                    border: `1px solid ${isActive ? BRAND.blue : theme.inputBorder}`,
                    borderRadius: '100px',
                    fontSize: '13px',
                    fontWeight: isActive ? '600' : '400',
                    fontFamily: FONTS.body,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ---- GENERATE BUTTON ---- */}
      <button
        onClick={handleGenerate}
        disabled={!canGenerate}
        style={{
          width: '100%',
          height: '48px',
          backgroundColor: canGenerate ? BRAND.blue : (isDark ? '#2a2420' : '#e8e0d4'),
          color: canGenerate ? '#ffffff' : theme.textMuted,
          border: 'none',
          borderRadius: '10px',
          fontSize: '15px',
          fontWeight: '600',
          fontFamily: FONTS.body,
          cursor: canGenerate ? 'pointer' : 'not-allowed',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          transition: 'all 0.15s ease',
          boxShadow: canGenerate ? '0 2px 12px rgba(0,74,172,0.25)' : 'none',
          marginBottom: '24px',
        }}
      >
        {loading ? (
          <>
            <SpinnerGap size={18} style={{ animation: 'spin 1s linear infinite' }} />
            Building your checklist...
          </>
        ) : cooldownRemaining > 0 ? (
          `Wait ${cooldownSeconds}s to generate again`
        ) : (
          <>
            <ClipboardText size={18} weight="bold" />
            Generate Checklist
          </>
        )}
      </button>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

      {/* ---- ERROR ---- */}
      {error && (
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '10px',
          padding: '14px 16px',
          backgroundColor: theme.errorBg,
          border: `1px solid ${theme.errorBorder}`,
          borderRadius: '10px',
          marginBottom: '24px',
          animation: 'fadeInUp 0.3s ease',
        }}>
          <WarningCircle size={18} style={{ color: '#ef4444', flexShrink: 0, marginTop: '1px' }} />
          <p style={{ margin: 0, fontSize: '13px', color: theme.errorText, fontFamily: FONTS.body }}>
            {error}
          </p>
        </div>
      )}

      {/* ---- LOADING SKELETON ---- */}
      {loading && (
        <div style={{
          backgroundColor: theme.cardBg,
          border: `1px solid ${theme.cardBorder}`,
          borderRadius: '14px',
          padding: '24px',
          marginBottom: '24px',
        }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              style={{
                height: i === 5 ? '12px' : '14px',
                width: i === 5 ? '60%' : '100%',
                backgroundColor: isDark ? '#2a2420' : '#f0e8dc',
                borderRadius: '6px',
                marginBottom: i === 5 ? 0 : '12px',
                animation: 'pulse 1.5s ease infinite',
                animationDelay: `${i * 0.12}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* ---- RESULT ---- */}
      {checklist && !loading && (
        <div ref={resultsRef} style={{ animation: 'fadeInUp 0.4s ease', marginBottom: '24px' }}>
          {/* Result header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px',
            marginBottom: '14px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ClipboardText size={16} weight="bold" style={{ color: BRAND.blue }} />
              <span style={{
                fontSize: '14px',
                fontWeight: '700',
                color: theme.text,
                fontFamily: FONTS.heading,
              }}>
                Your Onboarding Checklist
              </span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <CopyButton text={checklist} isDark={isDark} />
              <button
                onClick={handleGenerate}
                disabled={!canGenerate}
                title="Regenerate"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  backgroundColor: 'transparent',
                  border: `1px solid ${theme.cardBorder}`,
                  borderRadius: '8px',
                  color: theme.text,
                  fontSize: '13px',
                  fontWeight: '500',
                  fontFamily: FONTS.body,
                  cursor: canGenerate ? 'pointer' : 'not-allowed',
                  opacity: canGenerate ? 1 : 0.5,
                  transition: 'all 0.15s ease',
                }}
              >
                <ArrowClockwise size={14} />
                Regenerate
              </button>
            </div>
          </div>

          {/* Checklist card */}
          <div style={{
            backgroundColor: theme.cardBg,
            border: `1px solid ${theme.cardBorder}`,
            borderRadius: '14px',
            padding: '24px',
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              borderRadius: '14px 14px 0 0',
              background: `linear-gradient(90deg, ${BRAND.blue}, ${BRAND.green})`,
            }} />
            {renderFormattedResult(checklist)}
          </div>
        </div>
      )}

      {/* ---- EMPTY STATE ---- */}
      {!loading && !checklist && !error && (
        <div style={{
          textAlign: 'center',
          padding: '40px 20px',
          animation: 'fadeInUp 0.4s ease',
        }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: `linear-gradient(135deg, ${BRAND.blue}18, ${BRAND.green}18)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 14px',
          }}>
            <ClipboardText size={26} weight="duotone" style={{ color: BRAND.blue }} />
          </div>
          <h3 style={{
            margin: '0 0 6px',
            fontSize: '16px',
            fontWeight: '700',
            color: theme.text,
            fontFamily: FONTS.heading,
          }}>
            Ready to build your checklist
          </h3>
          <p style={{
            margin: 0,
            fontSize: '13px',
            color: theme.textMuted,
            maxWidth: '360px',
            marginLeft: 'auto',
            marginRight: 'auto',
            lineHeight: '1.6',
          }}>
            Pick your VA niche above and we'll generate a complete onboarding checklist to use with your next client.
          </p>
        </div>
      )}

      {/* ---- TIPS SECTION ---- */}
      <div style={{
        backgroundColor: isDark ? `${BRAND.blue}08` : `${BRAND.blue}06`,
        border: `1px solid ${isDark ? BRAND.blue + '20' : BRAND.blue + '15'}`,
        borderRadius: '14px',
        padding: '20px',
        marginTop: '8px',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '14px',
        }}>
          <Lightbulb size={16} weight="fill" style={{ color: BRAND.blue }} />
          <span style={{
            fontSize: '13px',
            fontWeight: '700',
            color: theme.text,
            fontFamily: FONTS.heading,
            letterSpacing: '0.3px',
          }}>
            Onboarding Tips
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {TIPS.map((tip, i) => (
            <div key={i} style={{ display: 'flex', gap: '10px' }}>
              <span style={{
                fontSize: '11px',
                fontWeight: '700',
                color: BRAND.blue,
                backgroundColor: BRAND.blue + '15',
                width: '20px',
                height: '20px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: '1px',
              }}>
                {i + 1}
              </span>
              <div>
                <span style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: theme.text,
                  fontFamily: FONTS.body,
                }}>
                  {tip.title}
                </span>
                <p style={{
                  margin: '2px 0 0',
                  fontSize: '12px',
                  color: theme.textMuted,
                  lineHeight: '1.5',
                }}>
                  {tip.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OnboardingChecklist;
