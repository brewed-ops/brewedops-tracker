import React, { useState, useEffect, useRef } from 'react';
import { PenNib, SpinnerGap, Copy, Check, ArrowClockwise, WarningCircle, Lightbulb, CaretDown, TextAa } from '@phosphor-icons/react';
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
const COOLDOWN_KEY = 'brewedops_proposal_cooldown_end';
const COOLDOWN_MS = 1 * 60 * 1000; // 1 minute

// ============================================
// TONE OPTIONS
// ============================================
const TONE_OPTIONS = [
  { value: 'professional', label: 'Professional', desc: 'Polished and business-like' },
  { value: 'friendly', label: 'Friendly', desc: 'Warm and approachable' },
  { value: 'confident', label: 'Confident', desc: 'Bold and results-driven' },
  { value: 'conversational', label: 'Conversational', desc: 'Natural and easy-going' },
];

// ============================================
// SYSTEM PROMPT
// ============================================
const SYSTEM_PROMPT = `You are an expert Upwork proposal writer who helps virtual assistants and freelancers win clients. You follow professional proposal-writing best practices to create specific, genuine, and results-focused proposals.

When given a job description, the applicant's skills/experience, a desired tone, and an optional portfolio link, generate a winning Upwork proposal.

## PROPOSAL WRITING FRAMEWORK

### 1. Opening Hook (Executive Summary Principle)
- Lead with the CLIENT'S benefit, not your features
- Reference the client's SPECIFIC problem or goal from the job post
- Make it compelling enough to stand alone — clients often stop reading after the first sentence
- NEVER start with "Dear Hiring Manager", "I am writing to apply", or "I saw your job posting"

### 2. Understanding Section (Show Your Homework)
- Demonstrate you READ the job post by referencing specific details, challenges, or goals
- Use the client's own language and terminology from the posting
- Acknowledge their situation before pitching yourself
- This is what separates winning proposals from generic spam

### 3. Solution & Value (Outcomes Over Activities)
- Connect YOUR skills directly to THEIR specific needs
- Focus on outcomes and results, not just what you'll do — explain the WHY, not just the WHAT
- Include a brief, relevant example or metric when possible (e.g., "I managed a similar inbox that received 200+ emails/day and brought response time down to under 2 hours")
- If a portfolio link is provided, weave it in naturally as proof — don't just dump a link

### 4. Call to Action (Remove Friction)
- End with a clear, confident next step
- Ask a specific question about their project — it shows genuine interest and opens dialogue
- Make it easy for them to say yes (e.g., "I'm available to start this week — would you like to do a quick test task?")
- Create appropriate urgency without being pushy

## KISS METHOD (Keep It Simple & Straightforward)
Apply KISS throughout the entire proposal:
- Use short sentences. One idea per sentence. If a sentence needs a comma to add a second thought, split it into two.
- Use simple, everyday words — never use a complex word when a simple one works ("use" not "utilize", "help" not "facilitate", "start" not "commence")
- Cut every word that doesn't earn its place. If removing a word doesn't change the meaning, remove it.
- No jargon or buzzwords unless the job post itself uses them. Mirror the client's vocabulary level.
- Write at an 8th-grade reading level. The client is busy and skimming — make every word instantly clear.
- One paragraph = one point. Don't stack multiple ideas into a single paragraph.
- Avoid filler openings within sentences ("In addition to that", "Furthermore", "It is worth noting that") — just state the point.

## STRICT RULES
- Keep the proposal between 150-250 words (Upwork sweet spot — clients review dozens)
- Write in first person, flowing paragraphs — do NOT use bullet points or headers
- Do NOT use filler phrases: "I believe I am the perfect candidate", "I am confident that", "I am highly motivated"
- Do NOT use overly formal or robotic language
- Do NOT make claims you can't back up — be honest about experience level
- Match the requested tone consistently throughout
- Justify the applicant's value through specific proof, not adjectives

## OUTPUT FORMAT
Return ONLY the proposal text. No headers, no labels, no explanations, no markdown formatting — just the ready-to-paste proposal.`;

// ============================================
// TIPS DATA
// ============================================
const TIPS = [
  { title: 'Show you did your homework', body: 'Reference specific details from the job post. Use the client\'s own words. Clients instantly filter out generic copy-paste proposals.' },
  { title: 'Lead with their problem, not your resume', body: 'Open with what the client needs — not who you are. Demonstrate understanding before you pitch your solution.' },
  { title: 'Prove it with outcomes', body: 'Instead of "I\'m experienced in email management," say "I managed 200+ emails/day and cut response time to under 2 hours." Results beat adjectives.' },
  { title: 'End with a specific question', body: 'Close with a question about their project. It shows genuine interest and makes replying easy. "Would you like me to start with the landing page first?"' },
];

// ============================================
// COPY BUTTON COMPONENT
// ============================================
const CopyButton = ({ text, isDark, label = 'Copy Proposal' }) => {
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
const ProposalWriter = ({ isDark }) => {
  const theme = getTheme(isDark);

  // Form state
  const [jobDescription, setJobDescription] = useState('');
  const [skills, setSkills] = useState('');
  const [tone, setTone] = useState('professional');
  const [portfolioLink, setPortfolioLink] = useState('');

  // Generation state
  const [loading, setLoading] = useState(false);
  const [proposal, setProposal] = useState('');
  const [error, setError] = useState('');
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  const [wordCount, setWordCount] = useState(0);

  const resultsRef = useRef(null);
  const jobDescRef = useRef(null);

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
  }, [proposal]);

  // Word count
  useEffect(() => {
    if (proposal) {
      const words = proposal.trim().split(/\s+/).filter(Boolean).length;
      setWordCount(words);
    } else {
      setWordCount(0);
    }
  }, [proposal]);

  // Generate proposal
  const handleGenerate = async () => {
    if (!jobDescription.trim() || !skills.trim()) return;
    if (cooldownRemaining > 0) return;

    setLoading(true);
    setError('');
    setProposal('');

    try {
      const userMessage = [
        `JOB DESCRIPTION:\n${jobDescription.trim()}`,
        `\nMY SKILLS & EXPERIENCE:\n${skills.trim()}`,
        `\nDESIRED TONE: ${tone}`,
        portfolioLink.trim() ? `\nPORTFOLIO LINK: ${portfolioLink.trim()}` : '',
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
            temperature: 0.7,
            max_tokens: 1000,
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
            temperature: 0.7,
            max_tokens: 1000,
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

      setProposal(responseText.trim());
      localStorage.setItem(COOLDOWN_KEY, String(Date.now() + COOLDOWN_MS));
      setCooldownRemaining(COOLDOWN_MS);

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    } catch (err) {
      if (err.message === 'API_NOT_CONFIGURED') {
        setError('API not configured. Set VITE_OPENAI_EDGE_URL or VITE_OPENAI_API_KEY in your .env file.');
      } else {
        setError(err.message || 'Failed to generate proposal. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const cooldownSeconds = Math.ceil(cooldownRemaining / 1000);
  const canGenerate = jobDescription.trim().length > 0 && skills.trim().length > 0 && cooldownRemaining <= 0 && !loading;

  // ============================================
  // RENDER
  // ============================================
  return (
    <div style={{ fontFamily: FONTS.body, maxWidth: '720px', margin: '0 auto' }}>
      <SEO
        title="Free AI Proposal Writer for VAs | BrewedOps"
        description="Generate winning Upwork proposals in seconds. Free AI tool for virtual assistants and freelancers — paste a job post, get a tailored proposal."
        keywords="AI proposal writer, Upwork proposal generator, virtual assistant tools, freelancer proposal, VA tools, free proposal writer"
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
            <PenNib size={22} weight="duotone" style={{ color: BRAND.blue }} />
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
              AI Proposal Writer
            </h2>
          </div>
        </div>
        <p style={{
          margin: 0,
          fontSize: '14px',
          color: theme.textMuted,
          lineHeight: '1.6',
        }}>
          Paste an Upwork job post and your skills — get a tailored, ready-to-send proposal in seconds.
        </p>
      </div>

      {/* ---- FORM ---- */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '24px' }}>

        {/* Job Description */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '13px',
            fontWeight: '600',
            color: theme.text,
            fontFamily: FONTS.body,
            marginBottom: '6px',
          }}>
            Job Description <span style={{ color: BRAND.blue }}>*</span>
          </label>
          <textarea
            ref={jobDescRef}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value.slice(0, 3000))}
            placeholder="Paste the Upwork job post here — the more detail, the better your proposal..."
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
              {jobDescription.length}/3000
            </span>
          </div>
        </div>

        {/* Skills & Experience */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '13px',
            fontWeight: '600',
            color: theme.text,
            fontFamily: FONTS.body,
            marginBottom: '6px',
          }}>
            Your Skills & Experience <span style={{ color: BRAND.blue }}>*</span>
          </label>
          <textarea
            value={skills}
            onChange={(e) => setSkills(e.target.value.slice(0, 1500))}
            placeholder="E.g. 3 years as a VA, experienced in email management, social media, Canva, Google Workspace, basic bookkeeping..."
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
              {skills.length}/1500
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

        {/* Portfolio Link (optional) */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '13px',
            fontWeight: '600',
            color: theme.text,
            fontFamily: FONTS.body,
            marginBottom: '6px',
          }}>
            Portfolio Link <span style={{ fontSize: '11px', fontWeight: '400', color: theme.textMuted }}>(optional)</span>
          </label>
          <input
            type="url"
            value={portfolioLink}
            onChange={(e) => setPortfolioLink(e.target.value)}
            placeholder="https://your-portfolio.com"
            style={{
              width: '100%',
              height: '44px',
              backgroundColor: theme.inputBg,
              border: `1px solid ${theme.inputBorder}`,
              borderRadius: '10px',
              padding: '0 14px',
              fontSize: '14px',
              fontFamily: FONTS.body,
              color: theme.text,
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'border-color 0.15s ease',
            }}
            onFocus={(e) => { e.target.style.borderColor = BRAND.blue; }}
            onBlur={(e) => { e.target.style.borderColor = theme.inputBorder; }}
          />
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
            Crafting your proposal...
          </>
        ) : cooldownRemaining > 0 ? (
          `Wait ${cooldownSeconds}s to generate again`
        ) : (
          <>
            <PenNib size={18} weight="bold" />
            Generate Proposal
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
      {proposal && !loading && (
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
                Your Proposal
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
              <CopyButton text={proposal} isDark={isDark} />
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

          {/* Proposal card */}
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
              {proposal}
            </p>
          </div>
        </div>
      )}

      {/* ---- EMPTY STATE ---- */}
      {!loading && !proposal && !error && (
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
            <PenNib size={26} weight="duotone" style={{ color: BRAND.blue }} />
          </div>
          <h3 style={{
            margin: '0 0 6px',
            fontSize: '16px',
            fontWeight: '700',
            color: theme.text,
            fontFamily: FONTS.heading,
          }}>
            Ready to write your proposal
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
            Paste an Upwork job post above and tell us about your skills. We'll craft a proposal that gets replies.
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
            Tips for Winning Proposals
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

export default ProposalWriter;
