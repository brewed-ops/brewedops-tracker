/**
 * GHL Scenario Generator
 * AI-powered tool that generates GoHighLevel business scenarios
 * for practicing CRM automation workflows.
 *
 * Outputs structured sections:
 * 1. Industry & Business Type
 * 2. Business Scenario
 * 3. Client Requests
 * 4. KPIs to Track
 * 5. Recommended GHL Automations & Workflows
 * 6. Visual Aid - GHL Workflow Diagram
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Lightning, ArrowRight, SpinnerGap, Copy, Check, ArrowClockwise, Buildings, ChartLineUp, UsersThree, Gear, FlowArrow, Eye, CaretDown, WarningCircle } from '@phosphor-icons/react';
import mermaid from 'mermaid';
import SEO from './SEO';

// ============================================
// BRAND CONFIGURATION
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
});

// ============================================
// OPENAI CONFIGURATION
// ============================================
// Production: set VITE_OPENAI_EDGE_URL to proxy through Supabase Edge Function
// Fallback: VITE_OPENAI_API_KEY for direct calls (key will be in client bundle)
const OPENAI_CONFIG = {
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
  edgeFunctionUrl: import.meta.env.VITE_OPENAI_EDGE_URL || '',
  model: 'gpt-4o-mini',
};

// ============================================
// SYSTEM PROMPT
// ============================================
const SYSTEM_PROMPT = `You are a GoHighLevel (GHL) CRM and automation expert. When given a business type or industry, generate a concise business scenario for practicing GHL automation.

Your response MUST follow this EXACT format with these section headers. Keep everything short and to the point.

## Industry & Business Type
State the industry and business type in 1-2 lines.

## Business Scenario
2-3 sentences max. State the business situation and their main challenge.

## Client Requests
List exactly 3-4 short, specific requests. One line each. Format as a bullet list using "- ".

## KPIs to Track
List exactly 3-4 key metrics. One line each. Format as a bullet list using "- ".

## Recommended GHL Automations & Workflows
List exactly 3-4 automations. For each, write one line: the name and what it does. No sub-bullets. Format as a bullet list using "- ".

## Visual Aid - GHL Workflow Diagram
Output a Mermaid flowchart diagram using TD (top-down) direction. Use this exact format:
\`\`\`mermaid
graph TD
    A[New Lead] --> B[Auto SMS Response]
    B --> C[Book Appointment]
    C --> D[Send Reminder]
    D --> E[Job Completed]
    E --> F[Request Review]
\`\`\`
Keep it to 5-7 nodes. Short labels only. Use --> for connections. Use square brackets [] for node labels. Output ONLY the mermaid code block, nothing else.

Be concise. No filler text. No lengthy explanations.`;

// ============================================
// SECTION ICONS MAP
// ============================================
const SECTION_CONFIG = {
  'Industry & Business Type': { icon: Buildings, color: BRAND.blue },
  'Business Scenario': { icon: Lightning, color: '#f59e0b' },
  'Client Requests': { icon: UsersThree, color: BRAND.green },
  'KPIs to Track': { icon: ChartLineUp, color: '#8b5cf6' },
  'Recommended GHL Automations & Workflows': { icon: Gear, color: '#ef4444' },
  'Visual Aid - GHL Workflow Diagram': { icon: FlowArrow, color: '#14b8a6' },
};

// ============================================
// INDUSTRY SUGGESTIONS
// ============================================
const INDUSTRY_SUGGESTIONS = [
  'HVAC Service Company',
  'Auto Repair Shop',
  'Real Estate Agency',
  'Dental Clinic',
  'Fitness Gym',
  'Law Firm',
  'Roofing Contractor',
  'Med Spa / Aesthetics',
  'Insurance Agency',
  'Home Cleaning Service',
  'Photography Studio',
  'Chiropractic Office',
];

// ============================================
// PARSE RESPONSE INTO SECTIONS
// ============================================
const parseResponse = (text) => {
  const sections = [];
  const sectionRegex = /## ([^\n]+)\n([\s\S]*?)(?=\n## |$)/g;
  let match;

  while ((match = sectionRegex.exec(text)) !== null) {
    const title = match[1].trim();
    const content = match[2].trim();
    if (title) sections.push({ title, content });
  }

  // Fallback: if parsing fails, return raw text as single section
  if (sections.length === 0 && text.trim()) {
    sections.push({ title: 'Generated Scenario', content: text.trim() });
  }

  return sections;
};

// ============================================
// COPY BUTTON COMPONENT
// ============================================
const CopyButton = ({ text, isDark }) => {
  const [copied, setCopied] = useState(false);
  const theme = getTheme(isDark);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = text;
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
        padding: '4px 8px',
        backgroundColor: 'transparent',
        border: `1px solid ${theme.cardBorder}`,
        borderRadius: '6px',
        color: copied ? BRAND.green : theme.textMuted,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        fontSize: '11px',
        fontFamily: FONTS.body,
        transition: 'all 0.2s',
      }}
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
};

// ============================================
// MERMAID DIAGRAM COMPONENT
// ============================================
const MermaidDiagram = ({ code, isDark }) => {
  const [svg, setSvg] = useState('');
  const [error, setError] = useState('');
  const containerRef = useRef(null);

  // Extract mermaid code from markdown fences if present
  const cleanCode = code
    .replace(/```mermaid\s*/gi, '')
    .replace(/```\s*/g, '')
    .trim();

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'base',
      themeVariables: isDark ? {
        primaryColor: BRAND.blue,
        primaryTextColor: '#fff',
        primaryBorderColor: BRAND.blue,
        lineColor: '#6b7280',
        textColor: '#f3f4f6',
        mainBkg: '#1e1a16',
        nodeBorder: '#4b5563',
      } : {
        primaryColor: BRAND.blue,
        primaryTextColor: '#fff',
        primaryBorderColor: BRAND.blue,
        lineColor: '#6b7280',
        textColor: BRAND.brown,
        mainBkg: '#e8e0d4',
        nodeBorder: '#d1d5db',
      },
      securityLevel: 'loose',
      fontFamily: FONTS.body,
      flowchart: { useMaxWidth: true, htmlLabels: true, curve: 'basis', padding: 16 },
    });
  }, [isDark]);

  const renderDiagram = useCallback(async () => {
    if (!cleanCode) return;
    try {
      await mermaid.parse(cleanCode);
      const { svg: renderedSvg } = await mermaid.render(`ghl-mermaid-${Date.now()}`, cleanCode);
      setSvg(renderedSvg);
      setError('');
    } catch {
      setError('Could not render diagram');
      setSvg('');
    }
  }, [cleanCode]);

  useEffect(() => {
    renderDiagram();
  }, [renderDiagram]);

  if (error) {
    return (
      <pre style={{
        margin: 0,
        fontFamily: "'Fira Code', 'Cascadia Code', 'Consolas', monospace",
        fontSize: '14px',
        color: isDark ? '#f5f0eb' : '#3F200C',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        lineHeight: '2.2',
      }}>
        {cleanCode}
      </pre>
    );
  }

  return (
    <div
      ref={containerRef}
      style={{ display: 'flex', justifyContent: 'center' }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};

// ============================================
// SECTION CARD COMPONENT
// ============================================
const SectionCard = ({ title, content, isDark, index }) => {
  const theme = getTheme(isDark);
  const config = SECTION_CONFIG[title] || { icon: Lightning, color: BRAND.blue };
  const IconComponent = config.icon;
  const isVisualAid = title.includes('Visual Aid');
  const sectionNumber = index + 1;

  const renderInlineFormatting = (text) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} style={{ color: theme.text, fontWeight: '600' }}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  const renderContent = (text) => {
    return text.split('\n').map((line, i) => {
      // Bullet list items (- item) or numbered items (1. item) — both render as bullets
      if (/^[-*]\s/.test(line.trim()) || /^\d+\.\s/.test(line)) {
        const cleanLine = line.replace(/^[\s]*[-*]\s*/, '').replace(/^\d+\.\s*/, '');
        return (
          <div key={i} style={{ display: 'flex', gap: '14px', marginBottom: '12px', lineHeight: '1.75', alignItems: 'flex-start' }}>
            <span style={{
              color: config.color,
              fontSize: '7px',
              marginTop: '10px',
              flexShrink: 0,
            }}>&#x25CF;</span>
            <span style={{ color: theme.text, fontSize: '15px', flex: 1 }}>
              {renderInlineFormatting(cleanLine)}
            </span>
          </div>
        );
      }
      if (!line.trim()) return <div key={i} style={{ height: '8px' }} />;
      return (
        <p key={i} style={{ margin: '0 0 8px', color: theme.text, fontSize: '15px', lineHeight: '1.85' }}>
          {renderInlineFormatting(line)}
        </p>
      );
    });
  };

  return (
    <div
      style={{
        backgroundColor: isDark ? '#171411' : '#ffffff',
        border: `1px solid ${isDark ? '#2a2420' : '#e8e0d4'}`,
        borderRadius: '16px',
        padding: '28px',
        marginBottom: '20px',
        animation: `fadeInUp 0.4s ease ${index * 0.08}s both`,
      }}
    >
      {/* Section Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{
            width: '32px',
            height: '32px',
            borderRadius: '9px',
            backgroundColor: config.color,
            color: '#fff',
            fontSize: '14px',
            fontWeight: '800',
            fontFamily: FONTS.heading,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            {sectionNumber}
          </span>
          <h3 style={{
            margin: 0,
            fontSize: '18px',
            fontWeight: '700',
            color: theme.text,
            fontFamily: FONTS.heading,
            letterSpacing: '-0.01em',
          }}>
            {title}
          </h3>
        </div>
        <CopyButton text={content} isDark={isDark} />
      </div>

      {/* Section Content */}
      <div>
        {isVisualAid ? (
          <div style={{
            backgroundColor: isDark ? '#0d0b09' : '#f5f0eb',
            border: `1px solid ${isDark ? '#2a2420' : '#e8e0d4'}`,
            borderRadius: '12px',
            padding: '28px',
            overflowX: 'auto',
          }}>
            <MermaidDiagram code={content} isDark={isDark} />
          </div>
        ) : (
          <div style={{ fontSize: '15px', fontFamily: FONTS.body }}>
            {renderContent(content)}
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================
const COOLDOWN_KEY = 'brewedops_ghl_cooldown_end';
const COOLDOWN_MS = 1 * 60 * 1000; // 1 minute

const GHLScenarioGenerator = ({ isDark }) => {
  const theme = getTheme(isDark);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sections, setSections] = useState([]);
  const [error, setError] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  const resultsRef = useRef(null);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

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
  }, [sections]);

  // Close suggestions on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target) &&
        inputRef.current && !inputRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Scroll to results when generated
  useEffect(() => {
    if (sections.length > 0 && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [sections]);

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError('');
    setSections([]);

    try {
      let responseText = '';

      const chatMessages = [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `Generate a detailed GHL scenario for: ${input.trim()}` },
      ];

      if (OPENAI_CONFIG.edgeFunctionUrl) {
        const res = await fetch(OPENAI_CONFIG.edgeFunctionUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ type: 'chat', messages: chatMessages, temperature: 0.8, max_tokens: 2000 }),
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
            temperature: 0.8,
            max_tokens: 2000,
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

      const parsed = parseResponse(responseText);
      setSections(parsed);
      // Set 5-minute cooldown
      localStorage.setItem(COOLDOWN_KEY, String(Date.now() + COOLDOWN_MS));
      setCooldownRemaining(COOLDOWN_MS);
    } catch (err) {
      if (err.message === 'API_NOT_CONFIGURED') {
        setError('API not configured. Set VITE_OPENAI_EDGE_URL or VITE_OPENAI_API_KEY in your .env file.');
      } else {
        setError(err.message || 'Failed to generate scenario. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setInput('');
    setSections([]);
    setError('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !loading) {
      handleGenerate();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
    setShowSuggestions(false);
    // Auto-generate after selecting suggestion
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  // Copy all sections
  const handleCopyAll = async () => {
    const fullText = sections.map(s => `## ${s.title}\n${s.content}`).join('\n\n');
    try {
      await navigator.clipboard.writeText(fullText);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = fullText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
  };

  return (
    <div style={{ fontFamily: FONTS.body }}>
      <SEO
        title="GHL Scenario Generator - AI-Powered GoHighLevel Practice Tool | BrewedOps"
        description="Generate realistic GoHighLevel CRM practice scenarios with AI. Get business scenarios, client requests, KPIs, automation workflows, and Mermaid diagrams — free online tool by BrewedOps."
        keywords="GHL scenario generator, GoHighLevel practice, CRM automation, GHL workflows, AI business scenarios, BrewedOps AI tools"
      />
      {/* Animation keyframes */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '6px' }}>
          <img
            src="https://i.imgur.com/2KaYt7S.jpeg"
            alt="GoHighLevel"
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              objectFit: 'cover',
            }}
          />
          <div>
            <h2 style={{
              margin: 0,
              fontSize: '24px',
              fontWeight: '800',
              color: theme.text,
              fontFamily: FONTS.heading,
              letterSpacing: '-0.02em',
            }}>
              GHL Scenario Generator
            </h2>
            <p style={{
              margin: '2px 0 0',
              fontSize: '15px',
              color: theme.textMuted,
              lineHeight: '1.5',
            }}>
              Generate realistic GoHighLevel practice scenarios with AI
            </p>
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div style={{ marginBottom: '28px' }}>
        <label style={{
          display: 'block',
          fontSize: '14px',
          fontWeight: '600',
          color: theme.textMuted,
          marginBottom: '10px',
          fontFamily: FONTS.body,
        }}>
          Enter an industry or business type
        </label>
        <div style={{ position: 'relative' }}>
          <div style={{
            display: 'flex',
            gap: '10px',
            alignItems: 'stretch',
          }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => !input && setShowSuggestions(true)}
                placeholder="e.g., HVAC Service Company, Dental Clinic, Real Estate Agency..."
                style={{
                  width: '100%',
                  height: '52px',
                  backgroundColor: isDark ? '#0d0b09' : '#faf8f5',
                  border: `1px solid ${isDark ? '#2a2420' : '#e8e0d4'}`,
                  borderRadius: '12px',
                  padding: '0 18px',
                  fontSize: '15px',
                  fontFamily: FONTS.body,
                  color: theme.text,
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s',
                }}
                disabled={loading}
              />
              {/* Suggestions dropdown */}
              {showSuggestions && (
                <div
                  ref={suggestionsRef}
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    marginTop: '4px',
                    backgroundColor: isDark ? '#171411' : '#ffffff',
                    border: `1px solid ${isDark ? '#2a2420' : '#e8e0d4'}`,
                    borderRadius: '10px',
                    boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.5)' : '0 8px 32px rgba(0,0,0,0.1)',
                    padding: '8px',
                    zIndex: 50,
                    maxHeight: '240px',
                    overflowY: 'auto',
                  }}
                >
                  <div style={{
                    fontSize: '10px',
                    fontWeight: '600',
                    color: theme.textMuted,
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                    padding: '4px 8px 8px',
                    fontFamily: FONTS.body,
                  }}>
                    Popular Industries
                  </div>
                  {INDUSTRY_SUGGESTIONS.map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => handleSuggestionClick(suggestion)}
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        borderRadius: '6px',
                        color: theme.text,
                        fontSize: '13px',
                        fontFamily: FONTS.body,
                        cursor: 'pointer',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'background-color 0.15s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = isDark ? '#2a2420' : '#f5f0eb';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <Buildings size={14} style={{ color: theme.textMuted }} />
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={handleGenerate}
              disabled={loading || !input.trim() || cooldownRemaining > 0}
              style={{
                height: '52px',
                padding: '0 28px',
                backgroundColor: loading ? (isDark ? '#1a2e4a' : '#dbeafe') : cooldownRemaining > 0 ? (isDark ? '#2a2420' : '#e8e0d4') : BRAND.blue,
                color: loading ? BRAND.blue : cooldownRemaining > 0 ? (isDark ? '#a09585' : '#7a6652') : '#fff',
                border: 'none',
                borderRadius: '12px',
                fontSize: '15px',
                fontWeight: '600',
                fontFamily: FONTS.body,
                cursor: loading || !input.trim() || cooldownRemaining > 0 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                opacity: (!input.trim() && !loading) || cooldownRemaining > 0 ? 0.7 : 1,
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
              }}
            >
              {loading ? (
                <>
                  <SpinnerGap size={16} style={{ animation: 'spin 1s linear infinite' }} />
                  Generating...
                </>
              ) : cooldownRemaining > 0 ? (
                <>
                  <Lightning size={16} weight="fill" />
                  {`${Math.floor(cooldownRemaining / 60000)}:${String(Math.floor((cooldownRemaining % 60000) / 1000)).padStart(2, '0')}`}
                </>
              ) : (
                <>
                  <Lightning size={16} weight="fill" />
                  Generate
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div style={{ marginBottom: '24px' }}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              style={{
                backgroundColor: isDark ? '#171411' : '#ffffff',
                border: `1px solid ${isDark ? '#2a2420' : '#e8e0d4'}`,
                borderRadius: '14px',
                padding: '24px',
                marginBottom: '16px',
                animation: 'pulse 1.5s ease infinite',
                animationDelay: `${i * 0.15}s`,
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '16px',
              }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: isDark ? '#2a2420' : '#f0ebe4',
                }} />
                <div style={{
                  width: '180px',
                  height: '16px',
                  borderRadius: '4px',
                  backgroundColor: isDark ? '#2a2420' : '#f0ebe4',
                }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ width: '100%', height: '12px', borderRadius: '4px', backgroundColor: isDark ? '#1e1a16' : '#f5f0eb' }} />
                <div style={{ width: '85%', height: '12px', borderRadius: '4px', backgroundColor: isDark ? '#1e1a16' : '#f5f0eb' }} />
                <div style={{ width: '70%', height: '12px', borderRadius: '4px', backgroundColor: isDark ? '#1e1a16' : '#f5f0eb' }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error message */}
      {error && (
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '10px',
          padding: '14px 16px',
          backgroundColor: isDark ? '#260a0a' : '#fef2f2',
          border: `1px solid ${isDark ? '#7f1d1d' : '#fecaca'}`,
          borderRadius: '10px',
          marginBottom: '24px',
        }}>
          <WarningCircle size={18} style={{ color: '#ef4444', flexShrink: 0, marginTop: '1px' }} />
          <div>
            <p style={{ margin: 0, fontSize: '13px', color: isDark ? '#fca5a5' : '#dc2626', fontFamily: FONTS.body, lineHeight: '1.5' }}>
              {error}
            </p>
          </div>
        </div>
      )}

      {/* Results */}
      {sections.length > 0 && (
        <div ref={resultsRef}>
          {/* Results header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px',
            paddingBottom: '16px',
            borderBottom: `2px solid ${isDark ? '#2a2420' : '#e8e0d4'}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Eye size={20} style={{ color: BRAND.blue }} />
              <span style={{ fontSize: '18px', fontWeight: '700', color: theme.text, fontFamily: FONTS.heading }}>
                Generated Scenario
              </span>
              <span style={{
                fontSize: '12px',
                padding: '3px 10px',
                backgroundColor: BRAND.green + '20',
                color: BRAND.green,
                borderRadius: '20px',
                fontWeight: '600',
              }}>
                {sections.length} sections
              </span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={handleCopyAll}
                style={{
                  padding: '6px 12px',
                  backgroundColor: 'transparent',
                  border: `1px solid ${theme.cardBorder}`,
                  borderRadius: '8px',
                  color: theme.textMuted,
                  fontSize: '12px',
                  fontFamily: FONTS.body,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Copy size={12} />
                Copy All
              </button>
              <button
                onClick={handleReset}
                style={{
                  padding: '6px 12px',
                  backgroundColor: 'transparent',
                  border: `1px solid ${theme.cardBorder}`,
                  borderRadius: '8px',
                  color: theme.textMuted,
                  fontSize: '12px',
                  fontFamily: FONTS.body,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <ArrowClockwise size={12} />
                New Scenario
              </button>
            </div>
          </div>

          {/* Section Cards */}
          {sections.map((section, index) => (
            <SectionCard
              key={section.title}
              title={section.title}
              content={section.content}
              isDark={isDark}
              index={index}
            />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && sections.length === 0 && !error && (
        <div style={{
          textAlign: 'center',
          padding: '48px 20px',
          borderRadius: '14px',
          border: `1px dashed ${theme.cardBorder}`,
          backgroundColor: isDark ? '#171411' + '60' : '#ffffff60',
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            background: `linear-gradient(135deg, ${BRAND.blue}20, #14b8a620)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <Lightning size={28} weight="duotone" style={{ color: BRAND.blue }} />
          </div>
          <h3 style={{
            margin: '0 0 8px',
            fontSize: '16px',
            fontWeight: '700',
            color: theme.text,
            fontFamily: FONTS.heading,
          }}>
            Ready to Generate
          </h3>
          <p style={{
            margin: '0 0 20px',
            fontSize: '13px',
            color: theme.textMuted,
            maxWidth: '400px',
            marginLeft: 'auto',
            marginRight: 'auto',
            lineHeight: '1.6',
          }}>
            Enter a business type above to generate a complete GHL automation scenario — including workflows, KPIs, and a visual diagram.
          </p>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            justifyContent: 'center',
          }}>
            {INDUSTRY_SUGGESTIONS.slice(0, 6).map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => {
                  setInput(suggestion);
                  inputRef.current?.focus();
                }}
                style={{
                  padding: '6px 14px',
                  backgroundColor: isDark ? '#1e1a16' : '#f5f0eb',
                  border: `1px solid ${theme.cardBorder}`,
                  borderRadius: '20px',
                  color: theme.text,
                  fontSize: '12px',
                  fontFamily: FONTS.body,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = BRAND.blue;
                  e.currentTarget.style.color = BRAND.blue;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = theme.cardBorder;
                  e.currentTarget.style.color = theme.text;
                }}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GHLScenarioGenerator;
