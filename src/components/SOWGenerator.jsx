import React, { useState, useEffect, useRef } from 'react';
import { FileText, SpinnerGap, Copy, Check, ArrowClockwise, WarningCircle, Lightbulb } from '@phosphor-icons/react';
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
const COOLDOWN_KEY = 'brewedops_sow_cooldown_end';
const COOLDOWN_MS = 1 * 60 * 1000; // 1 minute

// ============================================
// DOCUMENT TYPE OPTIONS
// ============================================
const DOC_TYPE_OPTIONS = [
  { value: 'sow', label: 'SOW', desc: 'Scope of Work document' },
  { value: 'freelance_contract', label: 'Freelance Contract', desc: 'Full freelance contract with legal clauses' },
  { value: 'service_agreement', label: 'Service Agreement', desc: 'Lighter service agreement' },
];

// ============================================
// PAYMENT TERMS OPTIONS
// ============================================
const PAYMENT_OPTIONS = [
  { value: 'hourly', label: 'Hourly', desc: 'Billed per hour worked' },
  { value: 'fixed_price', label: 'Fixed Price', desc: 'One-time project fee' },
  { value: 'monthly_retainer', label: 'Monthly Retainer', desc: 'Recurring monthly fee' },
  { value: 'milestone_based', label: 'Milestone-Based', desc: 'Payments tied to deliverables' },
];

// ============================================
// SYSTEM PROMPT
// ============================================
const SYSTEM_PROMPT = `You are an expert freelance business consultant who helps virtual assistants and freelancers create professional Scope of Work documents and freelance contracts. You follow best practices for clear, enforceable agreements.

## YOUR EXPERTISE
You generate documents that protect both the freelancer and the client by clearly defining:
- Scope of services and deliverables
- Timeline and milestones
- Payment terms and schedule
- Revision and change request process
- Termination and cancellation terms
- Confidentiality expectations

## DOCUMENT TYPES

### Scope of Work (SOW)
Structure:
1. Project Overview -- brief summary of the engagement
2. Scope of Services -- specific tasks and deliverables
3. Timeline -- start date, end date, key milestones
4. Deliverables -- what the client will receive
5. Payment Terms -- rate, schedule, payment method
6. Revisions -- number of included revisions, cost for extras
7. Out of Scope -- what is NOT included (prevents scope creep)
8. Communication -- reporting frequency, channels, response time
9. Termination -- notice period, final payment terms

### Freelance Contract
Includes everything in SOW plus:
- Parties and effective date
- Independent contractor status
- Intellectual property rights
- Confidentiality clause
- Liability limitations
- Dispute resolution
- Governing jurisdiction
- Signatures section

### Service Agreement
A lighter version focusing on:
- Services provided
- Compensation
- Term and termination
- Basic confidentiality
- General provisions

## STRICT RULES
- Use professional but plain language -- avoid unnecessary legal jargon
- Include placeholder brackets [CLIENT NAME], [YOUR NAME], [DATE] for customization
- Always include an "Out of Scope" section to prevent scope creep
- Payment terms must be specific (amounts, due dates, late fees)
- Include a revision/change request process
- Add a termination clause with notice period
- DISCLAIMER: Add a note that this is a template and should be reviewed by legal counsel

## OUTPUT FORMAT
Return the document in clean, structured plain text with clear section headers. Use numbered sections. No markdown formatting -- just clean text with line breaks.`;

// ============================================
// TIPS DATA
// ============================================
const TIPS = [
  { title: 'Always define "Out of Scope"', body: 'The #1 cause of freelancer frustration is scope creep. Listing what is NOT included protects you from unpaid extra work.' },
  { title: 'Be specific about revisions', body: 'State exactly how many revisions are included and what happens after. "2 rounds of revisions included; additional rounds at $X/hour."' },
  { title: 'Include payment milestones', body: 'For larger projects, tie payments to milestones rather than completion. This protects you from delayed payment on long engagements.' },
  { title: 'Add a termination clause', body: 'Both parties should be able to exit gracefully. A 14-day written notice with payment for work completed is standard.' },
];

// ============================================
// COPY BUTTON COMPONENT
// ============================================
const CopyButton = ({ text, isDark, label = 'Copy Document' }) => {
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
const SOWGenerator = ({ isDark }) => {
  const theme = getTheme(isDark);

  // Form state
  const [projectDescription, setProjectDescription] = useState('');
  const [services, setServices] = useState('');
  const [docType, setDocType] = useState('sow');
  const [paymentTerms, setPaymentTerms] = useState('hourly');

  // Generation state
  const [loading, setLoading] = useState(false);
  const [document, setDocument] = useState('');
  const [error, setError] = useState('');
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  const [wordCount, setWordCount] = useState(0);

  const resultsRef = useRef(null);
  const projectDescRef = useRef(null);

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
  }, [document]);

  // Word count
  useEffect(() => {
    if (document) {
      const words = document.trim().split(/\s+/).filter(Boolean).length;
      setWordCount(words);
    } else {
      setWordCount(0);
    }
  }, [document]);

  // Generate document
  const handleGenerate = async () => {
    if (!projectDescription.trim() || !services.trim()) return;
    if (cooldownRemaining > 0) return;

    setLoading(true);
    setError('');
    setDocument('');

    try {
      const docTypeLabel = DOC_TYPE_OPTIONS.find((o) => o.value === docType)?.label || 'SOW';
      const paymentLabel = PAYMENT_OPTIONS.find((o) => o.value === paymentTerms)?.label || 'Hourly';

      const userMessage = [
        `PROJECT DESCRIPTION:\n${projectDescription.trim()}`,
        `\nMY ROLE / SERVICES:\n${services.trim()}`,
        `\nDOCUMENT TYPE: ${docTypeLabel}`,
        `\nPAYMENT TERMS: ${paymentLabel}`,
      ].join('\n');

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
            temperature: 0.5,
            max_tokens: 3000,
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
            temperature: 0.5,
            max_tokens: 3000,
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

      setDocument(responseText.trim());
      localStorage.setItem(COOLDOWN_KEY, String(Date.now() + COOLDOWN_MS));
      setCooldownRemaining(COOLDOWN_MS);

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    } catch (err) {
      if (err.message === 'API_NOT_CONFIGURED') {
        setError('API not configured. Set VITE_OPENAI_EDGE_URL or VITE_OPENAI_API_KEY in your .env file.');
      } else {
        setError(err.message || 'Failed to generate document. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const cooldownSeconds = Math.ceil(cooldownRemaining / 1000);
  const canGenerate = projectDescription.trim().length > 0 && services.trim().length > 0 && cooldownRemaining <= 0 && !loading;

  // ============================================
  // FORMATTED RESULT RENDERER
  // ============================================
  const renderFormattedResult = (text) => {
    const lines = text.split('\n');
    const elements = [];
    let k = 0;

    for (let i = 0; i < lines.length; i++) {
      const trimmed = lines[i].trim();

      if (!trimmed) {
        elements.push(<div key={k++} style={{ height: '8px' }} />);
        continue;
      }

      // Numbered section headers: "1. PROJECT OVERVIEW"
      const sectionMatch = trimmed.match(/^(\d+)\.\s+(.+)/);
      if (sectionMatch && trimmed.length < 80 && !/[.;,]$/.test(trimmed)) {
        elements.push(
          <div key={k++} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginTop: i > 0 ? '20px' : '0',
            marginBottom: '8px',
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
              {sectionMatch[1]}
            </span>
            <span style={{
              fontSize: '14px',
              fontWeight: '700',
              color: theme.text,
              fontFamily: FONTS.heading,
              letterSpacing: '-0.2px',
            }}>
              {sectionMatch[2]}
            </span>
          </div>
        );
        continue;
      }

      // Bullet/dash items
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
              lineHeight: '1.8',
              flexShrink: 0,
              marginTop: '5px',
            }}>&#9679;</span>
            <span style={{
              fontSize: '13px',
              color: theme.text,
              fontFamily: FONTS.body,
              lineHeight: '1.8',
            }}>
              {bulletText}
            </span>
          </div>
        );
        continue;
      }

      // DISCLAIMER or Note line
      if (/^DISCLAIMER|^Note:/i.test(trimmed)) {
        elements.push(
          <div key={k++} style={{
            marginTop: '16px',
            padding: '12px 14px',
            backgroundColor: isDark ? '#1e1a16' : '#f5efe6',
            borderLeft: `3px solid ${theme.textMuted}`,
            borderRadius: '0 8px 8px 0',
          }}>
            <span style={{
              fontSize: '12px',
              color: theme.textMuted,
              fontFamily: FONTS.body,
              lineHeight: '1.6',
              fontStyle: 'italic',
            }}>
              {trimmed}
            </span>
          </div>
        );
        continue;
      }

      // Regular text
      elements.push(
        <p key={k++} style={{
          margin: '0 0 4px',
          fontSize: '13px',
          color: theme.text,
          fontFamily: FONTS.body,
          lineHeight: '1.8',
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
        title="Free AI SOW & Contract Generator | BrewedOps"
        description="Generate professional Scope of Work documents and freelance contracts. Free AI tool for VAs and freelancers."
        keywords="SOW generator, scope of work, freelance contract, VA tools"
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
            <FileText size={22} weight="duotone" style={{ color: BRAND.blue }} />
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
              AI SOW & Contract Generator
            </h2>
          </div>
        </div>
        <p style={{
          margin: 0,
          fontSize: '14px',
          color: theme.textMuted,
          lineHeight: '1.6',
        }}>
          Describe your project and services -- get a professional Scope of Work, freelance contract, or service agreement in seconds.
        </p>
      </div>

      {/* ---- FORM ---- */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '24px' }}>

        {/* Project Description */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '13px',
            fontWeight: '600',
            color: theme.text,
            fontFamily: FONTS.body,
            marginBottom: '6px',
          }}>
            Project Description <span style={{ color: BRAND.blue }}>*</span>
          </label>
          <textarea
            ref={projectDescRef}
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value.slice(0, 3000))}
            placeholder="Describe the project, goals, and what you'll deliver..."
            rows={6}
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
              {projectDescription.length}/3000
            </span>
          </div>
        </div>

        {/* Your Role / Services */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '13px',
            fontWeight: '600',
            color: theme.text,
            fontFamily: FONTS.body,
            marginBottom: '6px',
          }}>
            Your Role / Services <span style={{ color: BRAND.blue }}>*</span>
          </label>
          <textarea
            value={services}
            onChange={(e) => setServices(e.target.value.slice(0, 1500))}
            placeholder="E.g. Social media management, email management, data entry..."
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
              {services.length}/1500
            </span>
          </div>
        </div>

        {/* Document Type Selector */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '13px',
            fontWeight: '600',
            color: theme.text,
            fontFamily: FONTS.body,
            marginBottom: '8px',
          }}>
            Document Type
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {DOC_TYPE_OPTIONS.map((opt) => {
              const isActive = docType === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => setDocType(opt.value)}
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
                  title={opt.desc}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Payment Terms Selector */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '13px',
            fontWeight: '600',
            color: theme.text,
            fontFamily: FONTS.body,
            marginBottom: '8px',
          }}>
            Payment Terms
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {PAYMENT_OPTIONS.map((opt) => {
              const isActive = paymentTerms === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => setPaymentTerms(opt.value)}
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
                  title={opt.desc}
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
            Generating your document...
          </>
        ) : cooldownRemaining > 0 ? (
          `Wait ${cooldownSeconds}s to generate again`
        ) : (
          <>
            <FileText size={18} weight="bold" />
            Generate Document
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
      {document && !loading && (
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
              <FileText size={16} weight="bold" style={{ color: BRAND.blue }} />
              <span style={{
                fontSize: '14px',
                fontWeight: '700',
                color: theme.text,
                fontFamily: FONTS.heading,
              }}>
                Your Document
              </span>
              <span style={{
                fontSize: '11px',
                color: theme.textMuted,
                backgroundColor: isDark ? '#2a2420' : '#f5efe6',
                padding: '2px 8px',
                borderRadius: '100px',
                fontFamily: FONTS.body,
              }}>
                {wordCount} words
              </span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <CopyButton text={document} isDark={isDark} />
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

          {/* Document card */}
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
            {renderFormattedResult(document)}
          </div>
        </div>
      )}

      {/* ---- EMPTY STATE ---- */}
      {!loading && !document && !error && (
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
            <FileText size={26} weight="duotone" style={{ color: BRAND.blue }} />
          </div>
          <h3 style={{
            margin: '0 0 6px',
            fontSize: '16px',
            fontWeight: '700',
            color: theme.text,
            fontFamily: FONTS.heading,
          }}>
            Ready to generate your document
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
            Describe your project and services above. We'll generate a professional SOW, contract, or service agreement for you.
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
            Tips for Strong Contracts
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

export default SOWGenerator;
