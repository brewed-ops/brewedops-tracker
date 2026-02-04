import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Globe, Clock, Plus, X, ArrowsLeftRight, MagnifyingGlass, PushPin, CaretDown } from '@phosphor-icons/react';

// ============================================
// BRAND CONFIG
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
  textSubtle: isDark ? '#6b5f52' : '#a09585',
  inputBg: isDark ? '#1e1a16' : '#faf8f5',
  inputBorder: isDark ? '#332d26' : '#e0d6c8',
  hoverBg: isDark ? '#2a2420' : '#f0e8dc',
});

// ============================================
// TIMEZONE DATABASE
// ============================================
const ALL_TIMEZONES = [
  { id: 'Asia/Manila', city: 'Manila', country: 'Philippines', region: 'Asia' },
  { id: 'America/New_York', city: 'New York', country: 'USA', region: 'Americas' },
  { id: 'America/Chicago', city: 'Chicago', country: 'USA', region: 'Americas' },
  { id: 'America/Denver', city: 'Denver', country: 'USA', region: 'Americas' },
  { id: 'America/Los_Angeles', city: 'Los Angeles', country: 'USA', region: 'Americas' },
  { id: 'America/Anchorage', city: 'Anchorage', country: 'USA', region: 'Americas' },
  { id: 'Pacific/Honolulu', city: 'Honolulu', country: 'USA', region: 'Americas' },
  { id: 'America/Toronto', city: 'Toronto', country: 'Canada', region: 'Americas' },
  { id: 'America/Vancouver', city: 'Vancouver', country: 'Canada', region: 'Americas' },
  { id: 'America/Sao_Paulo', city: 'Sao Paulo', country: 'Brazil', region: 'Americas' },
  { id: 'America/Mexico_City', city: 'Mexico City', country: 'Mexico', region: 'Americas' },
  { id: 'Europe/London', city: 'London', country: 'UK', region: 'Europe' },
  { id: 'Europe/Paris', city: 'Paris', country: 'France', region: 'Europe' },
  { id: 'Europe/Berlin', city: 'Berlin', country: 'Germany', region: 'Europe' },
  { id: 'Europe/Amsterdam', city: 'Amsterdam', country: 'Netherlands', region: 'Europe' },
  { id: 'Europe/Madrid', city: 'Madrid', country: 'Spain', region: 'Europe' },
  { id: 'Europe/Rome', city: 'Rome', country: 'Italy', region: 'Europe' },
  { id: 'Europe/Moscow', city: 'Moscow', country: 'Russia', region: 'Europe' },
  { id: 'Asia/Dubai', city: 'Dubai', country: 'UAE', region: 'Asia' },
  { id: 'Asia/Kolkata', city: 'Mumbai', country: 'India', region: 'Asia' },
  { id: 'Asia/Singapore', city: 'Singapore', country: 'Singapore', region: 'Asia' },
  { id: 'Asia/Hong_Kong', city: 'Hong Kong', country: 'China', region: 'Asia' },
  { id: 'Asia/Shanghai', city: 'Shanghai', country: 'China', region: 'Asia' },
  { id: 'Asia/Tokyo', city: 'Tokyo', country: 'Japan', region: 'Asia' },
  { id: 'Asia/Seoul', city: 'Seoul', country: 'South Korea', region: 'Asia' },
  { id: 'Asia/Bangkok', city: 'Bangkok', country: 'Thailand', region: 'Asia' },
  { id: 'Asia/Jakarta', city: 'Jakarta', country: 'Indonesia', region: 'Asia' },
  { id: 'Australia/Sydney', city: 'Sydney', country: 'Australia', region: 'Oceania' },
  { id: 'Australia/Melbourne', city: 'Melbourne', country: 'Australia', region: 'Oceania' },
  { id: 'Australia/Perth', city: 'Perth', country: 'Australia', region: 'Oceania' },
  { id: 'Pacific/Auckland', city: 'Auckland', country: 'New Zealand', region: 'Oceania' },
  { id: 'Africa/Cairo', city: 'Cairo', country: 'Egypt', region: 'Africa' },
  { id: 'Africa/Lagos', city: 'Lagos', country: 'Nigeria', region: 'Africa' },
  { id: 'Africa/Johannesburg', city: 'Johannesburg', country: 'South Africa', region: 'Africa' },
];

const DEFAULT_PINNED = [
  'Asia/Manila',
  'America/New_York',
  'America/Los_Angeles',
  'Europe/London',
  'Australia/Sydney',
];

// ============================================
// HELPERS
// ============================================
const getStoredPinned = () => {
  try {
    const stored = localStorage.getItem('brewedops_tz_pinned');
    return stored ? JSON.parse(stored) : DEFAULT_PINNED;
  } catch {
    return DEFAULT_PINNED;
  }
};

const getStoredFormat = () => {
  try {
    return localStorage.getItem('brewedops_tz_format') || '12h';
  } catch {
    return '12h';
  }
};

const formatTime = (date, tzId, is24h) => {
  try {
    return date.toLocaleTimeString('en-US', {
      timeZone: tzId,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: !is24h,
    });
  } catch {
    return '--:--:--';
  }
};

const formatTimeShort = (date, tzId, is24h) => {
  try {
    return date.toLocaleTimeString('en-US', {
      timeZone: tzId,
      hour: '2-digit',
      minute: '2-digit',
      hour12: !is24h,
    });
  } catch {
    return '--:--';
  }
};

const formatDate = (date, tzId) => {
  try {
    return date.toLocaleDateString('en-US', {
      timeZone: tzId,
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '---';
  }
};

const getUtcOffset = (tzId) => {
  try {
    const now = new Date();
    const utcStr = now.toLocaleString('en-US', { timeZone: 'UTC' });
    const tzStr = now.toLocaleString('en-US', { timeZone: tzId });
    const diffMs = new Date(tzStr) - new Date(utcStr);
    const diffHours = diffMs / (1000 * 60 * 60);
    const sign = diffHours >= 0 ? '+' : '';
    const hrs = Math.floor(Math.abs(diffHours));
    const mins = Math.round((Math.abs(diffHours) - hrs) * 60);
    return `UTC${sign}${diffHours < 0 ? '-' : ''}${hrs}${mins > 0 ? ':' + String(mins).padStart(2, '0') : ''}`;
  } catch {
    return 'UTC';
  }
};

const getTimeDiff = (fromTz, toTz) => {
  try {
    const now = new Date();
    const fromStr = now.toLocaleString('en-US', { timeZone: fromTz });
    const toStr = now.toLocaleString('en-US', { timeZone: toTz });
    const diffMs = new Date(toStr) - new Date(fromStr);
    const diffHours = diffMs / (1000 * 60 * 60);
    if (diffHours === 0) return 'Same time';
    const sign = diffHours > 0 ? '+' : '';
    const hrs = Math.abs(Math.floor(diffHours));
    const mins = Math.round((Math.abs(diffHours) - hrs) * 60);
    const label = hrs === 1 && mins === 0 ? 'hr' : 'hrs';
    return `${sign}${diffHours < 0 ? '-' : ''}${hrs}${mins > 0 ? ':' + String(mins).padStart(2, '0') : ''} ${label}`;
  } catch {
    return '--';
  }
};

const getDayStatus = (date, tzId) => {
  try {
    const hour = parseInt(date.toLocaleTimeString('en-US', { timeZone: tzId, hour: 'numeric', hour12: false }));
    if (hour >= 6 && hour < 12) return { label: 'Morning', color: '#f59e0b' };
    if (hour >= 12 && hour < 17) return { label: 'Afternoon', color: '#f97316' };
    if (hour >= 17 && hour < 21) return { label: 'Evening', color: '#8b5cf6' };
    return { label: 'Night', color: '#6366f1' };
  } catch {
    return { label: '', color: '#888' };
  }
};

const convertTime = (inputTime, fromTz, toTz) => {
  try {
    const today = new Date();
    const [hours, minutes] = inputTime.split(':').map(Number);
    const dateStr = today.toLocaleDateString('en-CA', { timeZone: fromTz });
    const fromDate = new Date(`${dateStr}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`);
    const utcMs = fromDate.getTime();
    const fromOffset = new Date(fromDate.toLocaleString('en-US', { timeZone: fromTz })) - new Date(fromDate.toLocaleString('en-US', { timeZone: 'UTC' }));
    const adjustedUtc = utcMs - fromOffset;
    const result = new Date(adjustedUtc);
    return result;
  } catch {
    return null;
  }
};

// ============================================
// TIMEZONE CARD
// ============================================
const TimezoneCard = ({ tz, now, theme, isDark, is24h, isHome, onRemove }) => {
  const dayStatus = getDayStatus(now, tz.id);
  const utcOffset = getUtcOffset(tz.id);
  const homeDiff = !isHome ? getTimeDiff('Asia/Manila', tz.id) : null;

  return (
    <div
      style={{
        backgroundColor: theme.cardBg,
        border: `1px solid ${isHome ? BRAND.blue + '40' : theme.cardBorder}`,
        borderRadius: '14px',
        padding: '20px',
        position: 'relative',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        ...(isHome ? { boxShadow: `0 0 0 1px ${BRAND.blue}20` } : {}),
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '15px', fontWeight: '700', color: theme.text, fontFamily: FONTS.heading }}>
              {tz.city}
            </span>
            {isHome && (
              <span style={{
                fontSize: '9px', fontWeight: '700', letterSpacing: '0.5px',
                color: BRAND.blue, backgroundColor: BRAND.blue + '15',
                padding: '2px 6px', borderRadius: '4px', fontFamily: FONTS.body,
              }}>
                YOU
              </span>
            )}
          </div>
          <div style={{ fontSize: '11px', color: theme.textMuted, fontFamily: FONTS.body, marginTop: '2px' }}>
            {tz.country} {utcOffset}
          </div>
        </div>
        {!isHome && (
          <button
            onClick={() => onRemove(tz.id)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: theme.textSubtle, padding: '2px',
              borderRadius: '4px', display: 'flex',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#ef4444'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = theme.textSubtle; }}
            title="Remove timezone"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Time */}
      <div style={{
        fontSize: '32px', fontWeight: '800', color: theme.text,
        fontFamily: FONTS.heading, letterSpacing: '-1px', lineHeight: '1.1',
      }}>
        {formatTimeShort(now, tz.id, is24h === '24h')}
      </div>
      <div style={{
        fontSize: '11px', color: theme.textMuted, fontFamily: FONTS.body, marginTop: '2px',
      }}>
        {formatTime(now, tz.id, is24h === '24h').split(' ')[0] !== formatTimeShort(now, tz.id, is24h === '24h')
          ? ''
          : ''
        }
      </div>

      {/* Date + Status */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginTop: '12px', paddingTop: '12px',
        borderTop: `1px solid ${theme.cardBorder}`,
      }}>
        <span style={{ fontSize: '12px', color: theme.textMuted, fontFamily: FONTS.body }}>
          {formatDate(now, tz.id)}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {homeDiff && (
            <span style={{
              fontSize: '10px', color: theme.textSubtle, fontFamily: FONTS.body,
              backgroundColor: isDark ? '#1e1a16' : '#faf8f5',
              padding: '2px 6px', borderRadius: '4px',
            }}>
              {homeDiff}
            </span>
          )}
          <span style={{
            fontSize: '9px', fontWeight: '600', letterSpacing: '0.3px',
            color: dayStatus.color, backgroundColor: dayStatus.color + '15',
            padding: '2px 8px', borderRadius: '4px', fontFamily: FONTS.body,
            textTransform: 'uppercase',
          }}>
            {dayStatus.label}
          </span>
        </div>
      </div>
    </div>
  );
};

// ============================================
// ADD TIMEZONE DROPDOWN
// ============================================
const AddTimezonePanel = ({ theme, isDark, pinnedIds, onAdd, onClose }) => {
  const [search, setSearch] = useState('');
  const available = useMemo(() => {
    return ALL_TIMEZONES.filter(
      (tz) => !pinnedIds.includes(tz.id) &&
        (tz.city.toLowerCase().includes(search.toLowerCase()) ||
         tz.country.toLowerCase().includes(search.toLowerCase()) ||
         tz.id.toLowerCase().includes(search.toLowerCase()))
    );
  }, [pinnedIds, search]);

  const grouped = useMemo(() => {
    const groups = {};
    available.forEach((tz) => {
      if (!groups[tz.region]) groups[tz.region] = [];
      groups[tz.region].push(tz);
    });
    return groups;
  }, [available]);

  return (
    <div style={{
      backgroundColor: theme.cardBg,
      border: `1px solid ${theme.cardBorder}`,
      borderRadius: '14px',
      padding: '20px',
      marginTop: '16px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <span style={{ fontSize: '14px', fontWeight: '600', color: theme.text, fontFamily: FONTS.heading }}>
          Add Timezone
        </span>
        <button
          onClick={onClose}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: theme.textMuted, display: 'flex', padding: '4px',
          }}
        >
          <X size={16} />
        </button>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: '14px' }}>
        <MagnifyingGlass size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: theme.textSubtle }} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search city or country..."
          style={{
            width: '100%', height: '40px', backgroundColor: theme.inputBg,
            border: `1px solid ${theme.inputBorder}`, borderRadius: '10px',
            padding: '0 14px 0 34px', fontSize: '13px', color: theme.text,
            fontFamily: FONTS.body, outline: 'none', boxSizing: 'border-box',
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = BRAND.blue; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = theme.inputBorder; }}
        />
      </div>

      {/* Results */}
      <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
        {Object.keys(grouped).length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: theme.textMuted, fontSize: '13px', fontFamily: FONTS.body }}>
            No matching timezones found
          </div>
        ) : (
          Object.entries(grouped).map(([region, tzs]) => (
            <div key={region} style={{ marginBottom: '12px' }}>
              <div style={{
                fontSize: '10px', fontWeight: '700', color: theme.textSubtle,
                letterSpacing: '0.8px', textTransform: 'uppercase',
                fontFamily: FONTS.body, marginBottom: '6px', padding: '0 4px',
              }}>
                {region}
              </div>
              {tzs.map((tz) => (
                <button
                  key={tz.id}
                  onClick={() => { onAdd(tz.id); setSearch(''); }}
                  style={{
                    width: '100%', padding: '8px 10px', backgroundColor: 'transparent',
                    border: 'none', borderRadius: '8px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    fontFamily: FONTS.body, textAlign: 'left',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = theme.hoverBg; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <div>
                    <span style={{ fontSize: '13px', fontWeight: '500', color: theme.text }}>{tz.city}</span>
                    <span style={{ fontSize: '11px', color: theme.textMuted, marginLeft: '6px' }}>{tz.country}</span>
                  </div>
                  <span style={{ fontSize: '11px', color: theme.textSubtle }}>{getUtcOffset(tz.id)}</span>
                </button>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================
const TimezoneConverter = ({ isDark }) => {
  const theme = getTheme(isDark);
  const [now, setNow] = useState(new Date());
  const [pinnedIds, setPinnedIds] = useState(getStoredPinned);
  const [timeFormat, setTimeFormat] = useState(getStoredFormat);
  const [showAddPanel, setShowAddPanel] = useState(false);

  // Converter state
  const [fromTz, setFromTz] = useState('Asia/Manila');
  const [toTz, setToTz] = useState('America/New_York');
  const [convertInput, setConvertInput] = useState('');
  const [convertedResult, setConvertedResult] = useState(null);

  const [isSmall, setIsSmall] = useState(window.innerWidth < 640);

  // Live clock tick
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Responsive
  useEffect(() => {
    const onResize = () => setIsSmall(window.innerWidth < 640);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Persist pinned
  useEffect(() => {
    try { localStorage.setItem('brewedops_tz_pinned', JSON.stringify(pinnedIds)); } catch {}
  }, [pinnedIds]);

  // Persist format
  useEffect(() => {
    try { localStorage.setItem('brewedops_tz_format', timeFormat); } catch {}
  }, [timeFormat]);

  // Set default convert input to current time
  useEffect(() => {
    if (!convertInput) {
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      setConvertInput(`${h}:${m}`);
    }
  }, []);

  // Auto-convert on input change
  useEffect(() => {
    if (convertInput && fromTz && toTz) {
      const result = convertTime(convertInput, fromTz, toTz);
      if (result) {
        setConvertedResult(result);
      }
    }
  }, [convertInput, fromTz, toTz]);

  const pinnedTimezones = useMemo(() => {
    return pinnedIds.map((id) => ALL_TIMEZONES.find((tz) => tz.id === id)).filter(Boolean);
  }, [pinnedIds]);

  const addTimezone = useCallback((tzId) => {
    setPinnedIds((prev) => [...prev, tzId]);
    setShowAddPanel(false);
  }, []);

  const removeTimezone = useCallback((tzId) => {
    setPinnedIds((prev) => prev.filter((id) => id !== tzId));
  }, []);

  const swapTimezones = () => {
    setFromTz(toTz);
    setToTz(fromTz);
  };

  const is24h = timeFormat === '24h';

  // Detect user timezone
  const userTz = useMemo(() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
      return 'Asia/Manila';
    }
  }, []);

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: isSmall ? '20px 16px' : '32px 24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{
            width: '42px', height: '42px', borderRadius: '12px',
            backgroundColor: BRAND.blue + '12', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Globe size={22} style={{ color: BRAND.blue }} />
          </div>
          <div>
            <h1 style={{
              fontSize: isSmall ? '22px' : '26px', fontWeight: '800',
              color: theme.text, fontFamily: FONTS.heading, margin: 0,
            }}>
              Timezone Converter
            </h1>
          </div>
        </div>
        <p style={{
          fontSize: '14px', color: theme.textMuted, fontFamily: FONTS.body,
          margin: '0 0 0 54px', lineHeight: '1.5',
        }}>
          Track time across cities your clients live in. Built for Filipino VAs working with global teams.
        </p>
      </div>

      {/* Your Current Time Bar */}
      <div style={{
        backgroundColor: isDark ? BRAND.blue + '15' : BRAND.blue + '08',
        border: `1px solid ${BRAND.blue}25`,
        borderRadius: '12px', padding: '14px 18px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: '10px', marginBottom: '24px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Clock size={16} style={{ color: BRAND.blue }} />
          <span style={{ fontSize: '13px', color: theme.textMuted, fontFamily: FONTS.body }}>
            Your time ({userTz.split('/').pop().replace(/_/g, ' ')}):
          </span>
          <span style={{ fontSize: '16px', fontWeight: '700', color: theme.text, fontFamily: FONTS.heading }}>
            {formatTime(now, userTz, is24h)}
          </span>
          <span style={{ fontSize: '12px', color: theme.textMuted, fontFamily: FONTS.body }}>
            {formatDate(now, userTz)}
          </span>
        </div>

        {/* 12h / 24h toggle */}
        <div style={{
          display: 'flex', backgroundColor: isDark ? '#1e1a16' : '#f0e8dc',
          borderRadius: '8px', padding: '3px', gap: '2px',
        }}>
          {['12h', '24h'].map((fmt) => (
            <button
              key={fmt}
              onClick={() => setTimeFormat(fmt)}
              style={{
                padding: '4px 12px', fontSize: '12px', fontWeight: '600',
                fontFamily: FONTS.body, border: 'none', borderRadius: '6px',
                cursor: 'pointer',
                backgroundColor: timeFormat === fmt ? (isDark ? '#2a2420' : '#ffffff') : 'transparent',
                color: timeFormat === fmt ? theme.text : theme.textSubtle,
                boxShadow: timeFormat === fmt ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              {fmt}
            </button>
          ))}
        </div>
      </div>

      {/* World Clocks Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isSmall ? '1fr' : 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '14px', marginBottom: '16px',
      }}>
        {pinnedTimezones.map((tz) => (
          <TimezoneCard
            key={tz.id}
            tz={tz}
            now={now}
            theme={theme}
            isDark={isDark}
            is24h={timeFormat}
            isHome={tz.id === 'Asia/Manila'}
            onRemove={removeTimezone}
          />
        ))}
      </div>

      {/* Add Timezone Button */}
      {!showAddPanel && (
        <button
          onClick={() => setShowAddPanel(true)}
          style={{
            width: '100%', padding: '14px', backgroundColor: 'transparent',
            border: `2px dashed ${theme.cardBorder}`, borderRadius: '14px',
            cursor: 'pointer', display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: '8px', fontSize: '13px',
            fontWeight: '500', color: theme.textMuted, fontFamily: FONTS.body,
            marginBottom: '28px', transition: 'border-color 0.2s, color 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = BRAND.blue;
            e.currentTarget.style.color = BRAND.blue;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = theme.cardBorder;
            e.currentTarget.style.color = theme.textMuted;
          }}
        >
          <Plus size={16} />
          Add Timezone
        </button>
      )}

      {/* Add Panel */}
      {showAddPanel && (
        <div style={{ marginBottom: '28px' }}>
          <AddTimezonePanel
            theme={theme}
            isDark={isDark}
            pinnedIds={pinnedIds}
            onAdd={addTimezone}
            onClose={() => setShowAddPanel(false)}
          />
        </div>
      )}

      {/* Quick Converter */}
      <div style={{
        backgroundColor: theme.cardBg,
        border: `1px solid ${theme.cardBorder}`,
        borderRadius: '14px', padding: isSmall ? '20px' : '24px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
          <ArrowsLeftRight size={16} style={{ color: BRAND.blue }} />
          <span style={{ fontSize: '15px', fontWeight: '700', color: theme.text, fontFamily: FONTS.heading }}>
            Quick Convert
          </span>
        </div>

        <div style={{
          display: 'flex', alignItems: isSmall ? 'stretch' : 'flex-end',
          gap: isSmall ? '12px' : '16px',
          flexDirection: isSmall ? 'column' : 'row',
        }}>
          {/* From */}
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '11px', fontWeight: '600', color: theme.textMuted, fontFamily: FONTS.body, marginBottom: '6px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              From
            </label>
            <select
              value={fromTz}
              onChange={(e) => setFromTz(e.target.value)}
              style={{
                width: '100%', height: '40px', backgroundColor: theme.inputBg,
                border: `1px solid ${theme.inputBorder}`, borderRadius: '10px',
                padding: '0 10px', fontSize: '13px', color: theme.text,
                fontFamily: FONTS.body, outline: 'none', cursor: 'pointer',
                appearance: 'none', boxSizing: 'border-box',
              }}
            >
              {ALL_TIMEZONES.map((tz) => (
                <option key={tz.id} value={tz.id}>{tz.city}, {tz.country}</option>
              ))}
            </select>
          </div>

          {/* Time Input */}
          <div style={{ minWidth: isSmall ? 'auto' : '120px' }}>
            <label style={{ fontSize: '11px', fontWeight: '600', color: theme.textMuted, fontFamily: FONTS.body, marginBottom: '6px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Time
            </label>
            <input
              type="time"
              value={convertInput}
              onChange={(e) => setConvertInput(e.target.value)}
              style={{
                width: '100%', height: '40px', backgroundColor: theme.inputBg,
                border: `1px solid ${theme.inputBorder}`, borderRadius: '10px',
                padding: '0 10px', fontSize: '14px', fontWeight: '600',
                color: theme.text, fontFamily: FONTS.heading, outline: 'none',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = BRAND.blue; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = theme.inputBorder; }}
            />
          </div>

          {/* Swap Button */}
          <button
            onClick={swapTimezones}
            style={{
              width: '40px', height: '40px', minWidth: '40px',
              backgroundColor: 'transparent', border: `1px solid ${theme.cardBorder}`,
              borderRadius: '10px', cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center', color: theme.textMuted,
              alignSelf: isSmall ? 'center' : 'flex-end',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = BRAND.blue; e.currentTarget.style.color = BRAND.blue; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = theme.cardBorder; e.currentTarget.style.color = theme.textMuted; }}
            title="Swap timezones"
          >
            <ArrowsLeftRight size={16} />
          </button>

          {/* To */}
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '11px', fontWeight: '600', color: theme.textMuted, fontFamily: FONTS.body, marginBottom: '6px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              To
            </label>
            <select
              value={toTz}
              onChange={(e) => setToTz(e.target.value)}
              style={{
                width: '100%', height: '40px', backgroundColor: theme.inputBg,
                border: `1px solid ${theme.inputBorder}`, borderRadius: '10px',
                padding: '0 10px', fontSize: '13px', color: theme.text,
                fontFamily: FONTS.body, outline: 'none', cursor: 'pointer',
                appearance: 'none', boxSizing: 'border-box',
              }}
            >
              {ALL_TIMEZONES.map((tz) => (
                <option key={tz.id} value={tz.id}>{tz.city}, {tz.country}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Conversion Result */}
        {convertedResult && (
          <div style={{
            marginTop: '18px', paddingTop: '18px',
            borderTop: `1px solid ${theme.cardBorder}`,
            display: 'flex', alignItems: isSmall ? 'flex-start' : 'center',
            justifyContent: 'space-between',
            flexDirection: isSmall ? 'column' : 'row', gap: '12px',
          }}>
            <div>
              <div style={{ fontSize: '12px', color: theme.textMuted, fontFamily: FONTS.body, marginBottom: '4px' }}>
                {ALL_TIMEZONES.find((t) => t.id === fromTz)?.city || fromTz} {convertInput}
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span style={{ fontSize: '11px', color: theme.textSubtle, fontFamily: FONTS.body }}>is</span>
                <span style={{ fontSize: '28px', fontWeight: '800', color: BRAND.blue, fontFamily: FONTS.heading }}>
                  {formatTimeShort(convertedResult, toTz, is24h)}
                </span>
                <span style={{ fontSize: '13px', color: theme.textMuted, fontFamily: FONTS.body }}>
                  in {ALL_TIMEZONES.find((t) => t.id === toTz)?.city || toTz}
                </span>
              </div>
              <div style={{ fontSize: '11px', color: theme.textSubtle, fontFamily: FONTS.body, marginTop: '2px' }}>
                {formatDate(convertedResult, toTz)} {getTimeDiff(fromTz, toTz)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimezoneConverter;
