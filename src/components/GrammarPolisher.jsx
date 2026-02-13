import React, { useState, useEffect, useRef } from 'react';
import { TextAa, SpinnerGap, Copy, Check, ArrowClockwise, WarningCircle, Lightbulb } from '@phosphor-icons/react';
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
const COOLDOWN_KEY = 'brewedops_grammar_cooldown_end';
const COOLDOWN_MS = 1 * 60 * 1000;

// ============================================
// TONE OPTIONS
// ============================================
const TONE_OPTIONS = [
  { value: 'none', label: 'Grammar Only', desc: 'Fix errors without changing tone' },
  { value: 'professional', label: 'Professional', desc: 'Formal and business-appropriate' },
  { value: 'friendly', label: 'Friendly', desc: 'Warm and approachable' },
  { value: 'confident', label: 'Confident', desc: 'Assertive and direct' },
  { value: 'concise', label: 'Concise', desc: 'Brief and to-the-point' },
  { value: 'empathetic', label: 'Empathetic', desc: 'Understanding and supportive' },
];

// ============================================
// CONTEXT OPTIONS
// ============================================
const CONTEXT_OPTIONS = [
  { value: 'general', label: 'General' },
  { value: 'email', label: 'Email' },
  { value: 'chat', label: 'Chat Message' },
  { value: 'social', label: 'Social Media Post' },
  { value: 'document', label: 'Document / Report' },
  { value: 'proposal', label: 'Proposal / Pitch' },
];

// ============================================
// SYSTEM PROMPT
// ============================================
const SYSTEM_PROMPT = `You are an expert writing editor who helps virtual assistants, freelancers, and professionals polish their written English. You follow strict grammar correction principles.

## CORE RULES
- Fix only actual errors: spelling, grammar, punctuation, subject-verb agreement
- Preserve the author's voice, word choices, and sentence structure
- Never rewrite for "improvement" when only grammar correction is requested
- When uncertain if something is an error, leave it unchanged
- If the text has no errors, return it unchanged
- Match the original formatting: if the input has no capitals, the output should match
- Code-switching and loanwords are often intentional -- do not "correct" them

## TONE ADJUSTMENT
When a target tone is specified (not "none"), adjust the text to match that tone AFTER correcting grammar:
- Professional: Formal, business-appropriate, confident
- Friendly: Warm, approachable, conversational
- Confident: Assertive, direct, authoritative
- Concise: Brief, to-the-point, remove filler words and redundancy
- Empathetic: Understanding, compassionate, supportive
Tone adjustment may rephrase sentences but must NEVER change the core meaning.

## CONTEXT AWARENESS
The user will specify a writing context (email, chat, social media, document, proposal, or general). Adjust your corrections to match the expected formality level:
- Email/Document/Proposal: Higher standards for grammar and formality
- Chat/Social Media: More lenient with fragments, informal constructions, and abbreviations
- General: Balanced approach

## COMMON NON-NATIVE ENGLISH PATTERNS
Pay special attention to these frequent issues:
- Missing or incorrect articles (a/an/the)
- Preposition errors (in/on/at/for/to)
- Subject-verb agreement with collective nouns
- Tense consistency across sentences
- Run-on sentences and comma splices
- Redundant words and phrases ("return back", "repeat again")
- Direct translations that sound unnatural in English

## COMMON TRAPS TO AVOID
- Overcorrection: changing style or "improving" phrasing when only errors were requested
- False positives: flagging intentional fragments, informal constructions, or dialect features
- Changing meaning: a "fix" that alters what the author intended to say
- Adding words: inserting articles, conjunctions, or transitions not in the original

## OUTPUT FORMAT
Return ONLY the corrected/polished text. No explanations, no labels, no markdown formatting, no quotes around the text.
If the text has no errors and no tone change is needed, return the original text exactly as-is.`;

// ============================================
// TIPS DATA
// ============================================
const TIPS = [
  { title: 'Check articles (a, an, the)', body: 'One of the most common issues for non-native speakers. "I sent email" should be "I sent an email." When in doubt, read the sentence aloud.' },
  { title: 'Keep tenses consistent', body: 'If you start in past tense, stay in past tense. "I completed the task and send the report" should be "I completed the task and sent the report."' },
  { title: 'Remove filler words', body: 'Words like "actually", "basically", "just", and "really" often add nothing. "I just wanted to basically check in" becomes "I wanted to check in."' },
  { title: 'Match tone to audience', body: 'An email to a client needs a different tone than a message to a teammate. Use the tone selector above to adjust your writing for the right audience.' },
];

// ============================================
// COPY BUTTON COMPONENT
// ============================================
const CopyButton = ({ text, isDark, label = 'Copy Text' }) => {
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
const GrammarPolisher = ({ isDark }) => {
  const theme = getTheme(isDark);

  // Form state
  const [inputText, setInputText] = useState('');
  const [tone, setTone] = useState('none');
  const [context, setContext] = useState('general');

  // Generation state
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  const [wordCount, setWordCount] = useState(0);

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
  }, [result]);

  // Word count
  useEffect(() => {
    if (result) {
      const words = result.trim().split(/\s+/).filter(Boolean).length;
      setWordCount(words);
    } else {
      setWordCount(0);
    }
  }, [result]);

  // Generate polished text
  const handleGenerate = async () => {
    if (!inputText.trim()) return;
    if (cooldownRemaining > 0) return;

    setLoading(true);
    setError('');
    setResult('');

    try {
      const toneInstruction = tone === 'none'
        ? 'TONE: None (grammar correction only, do not change the tone)'
        : `TONE: ${tone} (correct grammar AND adjust tone to be ${tone})`;

      const userMessage = [
        `TEXT TO POLISH:\n${inputText.trim()}`,
        `\n${toneInstruction}`,
        `\nCONTEXT: ${context} (adjust formality expectations accordingly)`,
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
            temperature: 0.3,
            max_tokens: 2000,
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
            temperature: 0.3,
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

      setResult(responseText.trim());
      localStorage.setItem(COOLDOWN_KEY, String(Date.now() + COOLDOWN_MS));
      setCooldownRemaining(COOLDOWN_MS);

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    } catch (err) {
      if (err.message === 'API_NOT_CONFIGURED') {
        setError('API not configured. Set VITE_OPENAI_EDGE_URL or VITE_OPENAI_API_KEY in your .env file.');
      } else {
        setError(err.message || 'Failed to polish text. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const cooldownSeconds = Math.ceil(cooldownRemaining / 1000);
  const canGenerate = inputText.trim().length > 0 && cooldownRemaining <= 0 && !loading;

  // ============================================
  // RENDER
  // ============================================
  return (
    <div style={{ fontFamily: FONTS.body, maxWidth: '720px', margin: '0 auto' }}>
      <SEO
        title="Free AI Grammar & Tone Polisher | BrewedOps"
        description="Polish your writing with AI. Fix grammar, spelling, and tone instantly. Free tool for virtual assistants and freelancers."
        keywords="AI grammar checker, tone adjuster, writing polisher, grammar tool, VA tools, freelancer writing tool"
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
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
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
            <TextAa size={22} weight="duotone" style={{ color: BRAND.blue }} />
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
              AI Grammar & Tone Polisher
            </h2>
          </div>
        </div>
        <p style={{
          margin: 0,
          fontSize: '14px',
          color: theme.textMuted,
          lineHeight: '1.6',
        }}>
          Paste your text below to fix grammar, spelling, and punctuation. Optionally adjust tone for any audience.
        </p>
      </div>

      {/* ---- FORM ---- */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '24px' }}>

        {/* Text Input */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '13px',
            fontWeight: '600',
            color: theme.text,
            fontFamily: FONTS.body,
            marginBottom: '6px',
          }}>
            Your Text <span style={{ color: BRAND.blue }}>*</span>
          </label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value.slice(0, 5000))}
            placeholder="Paste your email, message, or any text you want to polish..."
            rows={8}
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
              {inputText.length}/5000
            </span>
          </div>
        </div>

        {/* Tone Selector */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '13px',
            fontWeight: '600',
            color: theme.text,
            fontFamily: FONTS.body,
            marginBottom: '8px',
          }}>
            Tone
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {TONE_OPTIONS.map((opt) => {
              const isActive = tone === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => setTone(opt.value)}
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

        {/* Context Selector */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '13px',
            fontWeight: '600',
            color: theme.text,
            fontFamily: FONTS.body,
            marginBottom: '8px',
          }}>
            Writing Context <span style={{ fontSize: '11px', fontWeight: '400', color: theme.textMuted }}>(helps set formality level)</span>
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {CONTEXT_OPTIONS.map((opt) => {
              const isActive = context === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => setContext(opt.value)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: isActive ? BRAND.green : 'transparent',
                    color: isActive ? '#ffffff' : theme.text,
                    border: `1px solid ${isActive ? BRAND.green : theme.inputBorder}`,
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
        aria-label="Polish text"
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
            Polishing your text...
          </>
        ) : cooldownRemaining > 0 ? (
          `Wait ${cooldownSeconds}s to polish again`
        ) : (
          <>
            <TextAa size={18} weight="bold" />
            Polish Text
          </>
        )}
      </button>

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
      {result && !loading && (
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
              <TextAa size={16} weight="bold" style={{ color: BRAND.blue }} />
              <span style={{
                fontSize: '14px',
                fontWeight: '700',
                color: theme.text,
                fontFamily: FONTS.heading,
              }}>
                Polished Text
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
              <CopyButton text={result} isDark={isDark} />
              <button
                onClick={handleGenerate}
                disabled={!canGenerate}
                title="Regenerate"
                aria-label="Regenerate polished text"
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

          {/* Result card */}
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
            <p style={{
              margin: 0,
              fontSize: '14px',
              color: theme.text,
              fontFamily: FONTS.body,
              lineHeight: '1.8',
              whiteSpace: 'pre-wrap',
            }}>
              {result}
            </p>
          </div>
        </div>
      )}

      {/* ---- EMPTY STATE ---- */}
      {!loading && !result && !error && (
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
            <TextAa size={26} weight="duotone" style={{ color: BRAND.blue }} />
          </div>
          <h3 style={{
            margin: '0 0 6px',
            fontSize: '16px',
            fontWeight: '700',
            color: theme.text,
            fontFamily: FONTS.heading,
          }}>
            Ready to polish your writing
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
            Paste your text above and hit Polish. We will fix grammar, spelling, and adjust tone to match your audience.
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
            Writing Tips for VAs
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

export default GrammarPolisher;
