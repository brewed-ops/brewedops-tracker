import React, { useState, useEffect, useRef } from 'react';
import { CalendarDots, SpinnerGap, Copy, Check, ArrowClockwise, WarningCircle, Lightbulb } from '@phosphor-icons/react';
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
const COOLDOWN_KEY = 'brewedops_calendar_cooldown_end';
const COOLDOWN_MS = 1 * 60 * 1000; // 1 minute

// ============================================
// PLATFORM OPTIONS
// ============================================
const PLATFORM_OPTIONS = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'x', label: 'X (Twitter)' },
];

// ============================================
// DURATION OPTIONS
// ============================================
const DURATION_OPTIONS = [
  { value: '7', label: '7 Days' },
  { value: '14', label: '14 Days' },
  { value: '30', label: '30 Days' },
];

// ============================================
// FREQUENCY OPTIONS
// ============================================
const FREQUENCY_OPTIONS = [
  { value: 'daily', label: 'Daily' },
  { value: '3x/week', label: '3x/week' },
  { value: '5x/week', label: '5x/week' },
];

// ============================================
// SYSTEM PROMPT
// ============================================
const SYSTEM_PROMPT = `You are an expert social media strategist who helps virtual assistants and freelancers create comprehensive content calendars. You follow proven content strategy principles to maximize engagement and consistency.

## YOUR EXPERTISE
You create structured content calendars that include:
- Specific post topics for each day
- Platform-specific formatting guidance
- Content type variety (educational, promotional, engagement, storytelling)
- Strategic posting times
- Hashtag suggestions
- Caption hooks/angles for each post

## CONTENT PILLAR FRAMEWORK
If the user provides content pillars, use them. Otherwise, suggest a balanced mix:
- Educational/Value (30%) -- tips, how-tos, industry insights
- Behind-the-scenes/Personal (25%) -- day-in-the-life, process, team
- Engagement/Community (20%) -- questions, polls, user-generated content
- Promotional (15%) -- services, offers, case studies, testimonials
- Trending/Timely (10%) -- industry news, seasonal content, trends

## PLATFORM-SPECIFIC RULES

### Instagram
- Reels get 2x reach of static posts -- prioritize video content
- Carousels with educational content perform well
- Use 20-30 relevant hashtags
- Best times: 11am-1pm, 7-9pm
- Include CTA in every caption

### Facebook
- Native video outperforms links
- Questions and polls drive engagement
- Avoid external links in post body (kills reach)
- Best times: 1-4pm weekdays
- Groups content for community building

### LinkedIn
- Personal stories with business lessons perform best
- First line is the hook (before "see more")
- Put links in comments, not post body
- Best times: Tue-Thu, 7-8am, 12pm, 5-6pm
- 1,200-1,500 characters is the sweet spot

### TikTok
- Hook in first 1-2 seconds
- Keep videos under 30 seconds to start
- Use trending sounds
- Native, unpolished content outperforms produced
- Best times: 7-9am, 12-3pm, 7-11pm

### X (Twitter)
- Tweets under 100 characters get more engagement
- Threads teach and build authority
- Quote tweets with insight beat plain retweets
- Engage with replies and mentions
- 3-10 posts per day including replies

## OUTPUT FORMAT
Return a structured calendar in this format:

DAY 1 -- [Day of Week]
Platform: [Platform name]
Content Type: [Reel/Carousel/Text Post/Story/Thread]
Topic: [Specific topic]
Caption Hook: [Opening line to grab attention]
Hashtags: [5-10 relevant hashtags]
Best Time to Post: [Time with timezone note]
Notes: [Any additional tips for this post]

[Repeat for each day]

At the end, include:
CONTENT TIPS FOR THIS CALENDAR
- 3-4 specific tips based on the niche and platforms chosen

## STRICT RULES
- Every post must have a specific, actionable topic (not vague like "share something educational")
- Vary content types throughout the calendar (don't repeat the same format back to back)
- Include at least one engagement-focused post per week (question, poll, or UGC prompt)
- Hashtags must be relevant to the specific post topic, not generic
- Caption hooks should follow proven formulas: curiosity, story, value, or contrarian
- If multiple platforms are selected, distribute posts across them with platform-appropriate formats
- Never suggest the exact same content for multiple platforms -- adapt the format and angle`;

// ============================================
// TIPS DATA
// ============================================
const TIPS = [
  { title: 'Batch your content creation', body: 'Set aside 2-3 hours per week to create all content at once. Batching is more efficient than creating posts daily and keeps your messaging consistent.' },
  { title: 'Follow the 80/20 rule', body: '80% of your content should educate, entertain, or inspire. Only 20% should be promotional. Audiences unfollow accounts that only sell.' },
  { title: 'Repurpose across platforms', body: 'One blog post can become a LinkedIn carousel, an Instagram Reel, a Twitter thread, and 3 Stories. Work smarter, not harder.' },
  { title: 'Track what works and double down', body: 'Review your analytics weekly. When a post type gets 2-3x normal engagement, create more content like it. Let data guide your strategy.' },
];

// ============================================
// COPY BUTTON COMPONENT
// ============================================
const CopyButton = ({ text, isDark, label = 'Copy Calendar' }) => {
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
const ContentCalendar = ({ isDark }) => {
  const theme = getTheme(isDark);

  // Form state
  const [businessNiche, setBusinessNiche] = useState('');
  const [platforms, setPlatforms] = useState([]);
  const [duration, setDuration] = useState('7');
  const [contentPillars, setContentPillars] = useState('');
  const [frequency, setFrequency] = useState('daily');

  // Generation state
  const [loading, setLoading] = useState(false);
  const [calendar, setCalendar] = useState('');
  const [error, setError] = useState('');
  const [cooldownRemaining, setCooldownRemaining] = useState(0);

  const resultsRef = useRef(null);
  const nicheRef = useRef(null);

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
  }, [calendar]);

  // Toggle platform selection
  const togglePlatform = (value) => {
    setPlatforms((prev) =>
      prev.includes(value)
        ? prev.filter((p) => p !== value)
        : [...prev, value]
    );
  };

  // Generate calendar
  const handleGenerate = async () => {
    if (!businessNiche.trim() || platforms.length === 0) return;
    if (cooldownRemaining > 0) return;

    setLoading(true);
    setError('');
    setCalendar('');

    try {
      const selectedPlatformLabels = platforms.map(
        (p) => PLATFORM_OPTIONS.find((opt) => opt.value === p)?.label || p
      );

      const userMessage = [
        `BUSINESS / NICHE:\n${businessNiche.trim()}`,
        `\nPLATFORMS: ${selectedPlatformLabels.join(', ')}`,
        `\nCALENDAR DURATION: ${duration} days`,
        `\nPOSTING FREQUENCY: ${frequency}`,
        contentPillars.trim() ? `\nCONTENT PILLARS: ${contentPillars.trim()}` : '',
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
            temperature: 0.7,
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

      setCalendar(responseText.trim());
      localStorage.setItem(COOLDOWN_KEY, String(Date.now() + COOLDOWN_MS));
      setCooldownRemaining(COOLDOWN_MS);

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    } catch (err) {
      if (err.message === 'API_NOT_CONFIGURED') {
        setError('API not configured. Set VITE_OPENAI_EDGE_URL or VITE_OPENAI_API_KEY in your .env file.');
      } else {
        setError(err.message || 'Failed to generate calendar. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const cooldownSeconds = Math.ceil(cooldownRemaining / 1000);
  const canGenerate = businessNiche.trim().length > 0 && platforms.length > 0 && cooldownRemaining <= 0 && !loading;

  // ============================================
  // FORMATTED RESULT RENDERER
  // ============================================
  const renderFormattedResult = (text) => {
    const lines = text.split('\n');
    const elements = [];
    let k = 0;
    let inDayCard = false;
    let dayCardHeader = '';
    let dayCardFields = [];

    const flushDayCard = () => {
      if (!dayCardHeader) return;
      elements.push(
        <div key={k++} style={{
          backgroundColor: isDark ? '#1e1a16' : '#f9f6f2',
          border: `1px solid ${theme.cardBorder}`,
          borderRadius: '10px',
          padding: '16px',
          marginBottom: '12px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '12px',
            paddingBottom: '10px',
            borderBottom: `1px solid ${theme.cardBorder}`,
          }}>
            <CalendarDots size={16} weight="bold" style={{ color: BRAND.blue }} />
            <span style={{
              fontSize: '14px',
              fontWeight: '700',
              color: theme.text,
              fontFamily: FONTS.heading,
            }}>
              {dayCardHeader}
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {dayCardFields.map((fl, idx) => {
              const colonIdx = fl.indexOf(':');
              if (colonIdx > 0 && colonIdx < 30) {
                const label = fl.substring(0, colonIdx).trim();
                const value = fl.substring(colonIdx + 1).trim();
                return (
                  <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                    <span style={{
                      fontSize: '10px',
                      fontWeight: '600',
                      color: BRAND.blue,
                      fontFamily: FONTS.body,
                      minWidth: '90px',
                      flexShrink: 0,
                      textTransform: 'uppercase',
                      letterSpacing: '0.3px',
                      paddingTop: '3px',
                    }}>
                      {label}
                    </span>
                    <span style={{
                      fontSize: '13px',
                      color: theme.text,
                      fontFamily: FONTS.body,
                      lineHeight: '1.6',
                    }}>
                      {value}
                    </span>
                  </div>
                );
              }
              return (
                <p key={idx} style={{
                  margin: 0,
                  fontSize: '13px',
                  color: theme.text,
                  fontFamily: FONTS.body,
                  lineHeight: '1.6',
                }}>
                  {fl}
                </p>
              );
            })}
          </div>
        </div>
      );
      dayCardHeader = '';
      dayCardFields = [];
    };

    for (let i = 0; i < lines.length; i++) {
      const trimmed = lines[i].trim();

      if (!trimmed) {
        if (inDayCard && dayCardFields.length > 0) {
          flushDayCard();
          inDayCard = false;
        } else if (!inDayCard) {
          elements.push(<div key={k++} style={{ height: '6px' }} />);
        }
        continue;
      }

      // Day headers: "DAY 1", "DAY 1 -- Monday"
      if (/^DAY\s+\d+/i.test(trimmed)) {
        if (inDayCard) flushDayCard();
        inDayCard = true;
        dayCardHeader = trimmed;
        continue;
      }

      if (inDayCard) {
        dayCardFields.push(trimmed);
        continue;
      }

      // "CONTENT TIPS" section header
      if (/^CONTENT\s+TIPS/i.test(trimmed)) {
        elements.push(
          <div key={k++} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginTop: '20px',
            marginBottom: '12px',
            paddingBottom: '8px',
            borderBottom: `1px solid ${theme.cardBorder}`,
          }}>
            <Lightbulb size={16} weight="bold" style={{ color: BRAND.green }} />
            <span style={{
              fontSize: '14px',
              fontWeight: '700',
              color: theme.text,
              fontFamily: FONTS.heading,
            }}>
              {trimmed}
            </span>
          </div>
        );
        continue;
      }

      // Bullet/tip items
      if (trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
        const bulletText = trimmed.replace(/^[-•]\s+/, '');
        elements.push(
          <div key={k++} style={{
            display: 'flex',
            gap: '10px',
            paddingLeft: '4px',
            marginBottom: '6px',
          }}>
            <span style={{
              color: BRAND.green,
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

      // Regular text
      elements.push(
        <p key={k++} style={{
          margin: '0 0 4px',
          fontSize: '13px',
          color: theme.text,
          fontFamily: FONTS.body,
          lineHeight: '1.6',
        }}>
          {trimmed}
        </p>
      );
    }

    // Flush any remaining day card
    if (inDayCard) flushDayCard();

    return <div>{elements}</div>;
  };

  // ============================================
  // RENDER
  // ============================================
  return (
    <div style={{ fontFamily: FONTS.body, maxWidth: '720px', margin: '0 auto' }}>
      <SEO
        title="Free AI Content Calendar Generator | BrewedOps"
        description="Generate a complete social media content calendar for any niche. Free AI tool for VAs, freelancers, and social media managers."
        keywords="content calendar generator, social media calendar, content planning, VA tools"
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
            <CalendarDots size={22} weight="duotone" style={{ color: BRAND.blue }} />
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
              AI Content Calendar
            </h2>
          </div>
        </div>
        <p style={{
          margin: 0,
          fontSize: '14px',
          color: theme.textMuted,
          lineHeight: '1.6',
        }}>
          Describe your business and pick your platforms -- get a complete, ready-to-use content calendar in seconds.
        </p>
      </div>

      {/* ---- FORM ---- */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '24px' }}>

        {/* Business / Niche */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '13px',
            fontWeight: '600',
            color: theme.text,
            fontFamily: FONTS.body,
            marginBottom: '6px',
          }}>
            Business / Niche <span style={{ color: BRAND.blue }}>*</span>
          </label>
          <textarea
            ref={nicheRef}
            value={businessNiche}
            onChange={(e) => setBusinessNiche(e.target.value.slice(0, 1500))}
            placeholder="Describe the business, industry, and target audience..."
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
              {businessNiche.length}/1500
            </span>
          </div>
        </div>

        {/* Platforms (multi-select) */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '13px',
            fontWeight: '600',
            color: theme.text,
            fontFamily: FONTS.body,
            marginBottom: '8px',
          }}>
            Platforms <span style={{ color: BRAND.blue }}>*</span>
            <span style={{ fontSize: '11px', fontWeight: '400', color: theme.textMuted, marginLeft: '8px' }}>
              (select one or more)
            </span>
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {PLATFORM_OPTIONS.map((opt) => {
              const isActive = platforms.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  onClick={() => togglePlatform(opt.value)}
                  aria-pressed={isActive}
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

        {/* Calendar Duration */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '13px',
            fontWeight: '600',
            color: theme.text,
            fontFamily: FONTS.body,
            marginBottom: '8px',
          }}>
            Calendar Duration
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {DURATION_OPTIONS.map((opt) => {
              const isActive = duration === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => setDuration(opt.value)}
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

        {/* Content Pillars (optional) */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '13px',
            fontWeight: '600',
            color: theme.text,
            fontFamily: FONTS.body,
            marginBottom: '6px',
          }}>
            Content Pillars <span style={{ fontSize: '11px', fontWeight: '400', color: theme.textMuted }}>(optional)</span>
          </label>
          <input
            type="text"
            value={contentPillars}
            onChange={(e) => setContentPillars(e.target.value.slice(0, 500))}
            placeholder="E.g. Educational, Behind-the-scenes, Promotional, Client stories..."
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
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
            <span style={{ fontSize: '11px', color: theme.textMuted }}>
              {contentPillars.length}/500
            </span>
          </div>
        </div>

        {/* Posting Frequency */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '13px',
            fontWeight: '600',
            color: theme.text,
            fontFamily: FONTS.body,
            marginBottom: '8px',
          }}>
            Posting Frequency
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {FREQUENCY_OPTIONS.map((opt) => {
              const isActive = frequency === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => setFrequency(opt.value)}
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
            Building your calendar...
          </>
        ) : cooldownRemaining > 0 ? (
          `Wait ${cooldownSeconds}s to generate again`
        ) : (
          <>
            <CalendarDots size={18} weight="bold" />
            Generate Calendar
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
      {calendar && !loading && (
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
              <CalendarDots size={16} weight="bold" style={{ color: BRAND.blue }} />
              <span style={{
                fontSize: '14px',
                fontWeight: '700',
                color: theme.text,
                fontFamily: FONTS.heading,
              }}>
                Your Content Calendar
              </span>
              <span style={{
                fontSize: '11px',
                color: theme.textMuted,
                backgroundColor: isDark ? '#2a2420' : '#f5efe6',
                padding: '2px 8px',
                borderRadius: '100px',
                fontFamily: FONTS.body,
              }}>
                {duration} days
              </span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <CopyButton text={calendar} isDark={isDark} />
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

          {/* Calendar card */}
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
            {renderFormattedResult(calendar)}
          </div>
        </div>
      )}

      {/* ---- EMPTY STATE ---- */}
      {!loading && !calendar && !error && (
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
            <CalendarDots size={26} weight="duotone" style={{ color: BRAND.blue }} />
          </div>
          <h3 style={{
            margin: '0 0 6px',
            fontSize: '16px',
            fontWeight: '700',
            color: theme.text,
            fontFamily: FONTS.heading,
          }}>
            Ready to plan your content
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
            Describe your business above, pick your platforms, and we'll build a content calendar tailored to your niche.
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
            Content Calendar Tips
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

export default ContentCalendar;
