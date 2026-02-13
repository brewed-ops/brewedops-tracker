import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Timer, Play, Pause, SkipForward, ArrowCounterClockwise, GearSix, SpeakerHigh, SpeakerSlash, CaretDown, CaretUp, Fire, Coffee, Lightning } from '@phosphor-icons/react';

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
  textSubtle: isDark ? '#9a8d80' : '#6b5f52',
  inputBg: isDark ? '#1e1a16' : '#faf8f5',
  inputBorder: isDark ? '#332d26' : '#e0d6c8',
  hoverBg: isDark ? '#2a2420' : '#f0e8dc',
});

// ============================================
// PHASE CONFIG
// ============================================
const PHASES = {
  work: { label: 'Focus', icon: Lightning, color: BRAND.blue, ringColor: BRAND.blue },
  shortBreak: { label: 'Short Break', icon: Coffee, color: BRAND.green, ringColor: BRAND.green },
  longBreak: { label: 'Long Break', icon: Fire, color: '#f59e0b', ringColor: '#f59e0b' },
};

const DEFAULT_SETTINGS = {
  workMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  sessionsBeforeLong: 4,
  autoStart: false,
  soundEnabled: true,
};

// ============================================
// HELPERS
// ============================================
const STORAGE_KEY = 'brewedops_pomodoro';

const loadSettings = () => {
  try {
    const stored = localStorage.getItem(`${STORAGE_KEY}_settings`);
    return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
};

const saveSettings = (settings) => {
  try { localStorage.setItem(`${STORAGE_KEY}_settings`, JSON.stringify(settings)); } catch {}
};

const loadStats = () => {
  try {
    const stored = localStorage.getItem(`${STORAGE_KEY}_stats`);
    if (!stored) return { today: getTodayKey(), sessions: 0, focusMinutes: 0, history: [] };
    const data = JSON.parse(stored);
    // Reset if it's a new day
    if (data.today !== getTodayKey()) {
      return { today: getTodayKey(), sessions: 0, focusMinutes: 0, history: [...(data.history || []), { date: data.today, sessions: data.sessions, focusMinutes: data.focusMinutes }].slice(-30) };
    }
    return data;
  } catch {
    return { today: getTodayKey(), sessions: 0, focusMinutes: 0, history: [] };
  }
};

const saveStats = (stats) => {
  try { localStorage.setItem(`${STORAGE_KEY}_stats`, JSON.stringify(stats)); } catch {}
};

const getTodayKey = () => new Date().toISOString().split('T')[0];

const formatTimer = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

const formatFocusTime = (minutes) => {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
};

// Web Audio beep
const playBeep = (enabled) => {
  if (!enabled) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const playTone = (freq, startTime, duration) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.3, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
      osc.start(startTime);
      osc.stop(startTime + duration);
    };
    // Three ascending tones
    playTone(523.25, ctx.currentTime, 0.15);
    playTone(659.25, ctx.currentTime + 0.18, 0.15);
    playTone(783.99, ctx.currentTime + 0.36, 0.3);
  } catch {}
};

// ============================================
// CIRCULAR PROGRESS RING
// ============================================
const ProgressRing = ({ progress, color, size, strokeWidth, isDark }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - progress * circumference;

  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      {/* Background track */}
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        fill="none"
        stroke={isDark ? '#2a2420' : '#e8e0d4'}
        strokeWidth={strokeWidth}
      />
      {/* Progress arc */}
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.5s ease' }}
      />
    </svg>
  );
};

// ============================================
// SETTINGS PANEL
// ============================================
const SettingsPanel = ({ settings, onChange, theme, isDark }) => {
  const SliderRow = ({ label, value, min, max, step, unit, onUpdate }) => (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
        <span style={{ fontSize: '13px', color: theme.text, fontFamily: FONTS.body }}>{label}</span>
        <span style={{ fontSize: '13px', fontWeight: '600', color: BRAND.blue, fontFamily: FONTS.heading }}>{value}{unit}</span>
      </div>
      <input
        type="range"
        min={min} max={max} step={step} value={value}
        onChange={(e) => onUpdate(Number(e.target.value))}
        style={{
          width: '100%', height: '6px', appearance: 'none',
          background: `linear-gradient(to right, ${BRAND.blue} 0%, ${BRAND.blue} ${((value - min) / (max - min)) * 100}%, ${isDark ? '#2a2420' : '#e0d6c8'} ${((value - min) / (max - min)) * 100}%, ${isDark ? '#2a2420' : '#e0d6c8'} 100%)`,
          borderRadius: '3px', outline: 'none', cursor: 'pointer',
        }}
      />
    </div>
  );

  return (
    <div style={{
      backgroundColor: theme.cardBg, border: `1px solid ${theme.cardBorder}`,
      borderRadius: '14px', padding: '20px', marginTop: '16px',
    }}>
      <SliderRow
        label="Focus Duration" value={settings.workMinutes}
        min={5} max={60} step={5} unit=" min"
        onUpdate={(v) => onChange({ ...settings, workMinutes: v })}
      />
      <SliderRow
        label="Short Break" value={settings.shortBreakMinutes}
        min={1} max={15} step={1} unit=" min"
        onUpdate={(v) => onChange({ ...settings, shortBreakMinutes: v })}
      />
      <SliderRow
        label="Long Break" value={settings.longBreakMinutes}
        min={5} max={30} step={5} unit=" min"
        onUpdate={(v) => onChange({ ...settings, longBreakMinutes: v })}
      />
      <SliderRow
        label="Sessions Before Long Break" value={settings.sessionsBeforeLong}
        min={2} max={8} step={1} unit=""
        onUpdate={(v) => onChange({ ...settings, sessionsBeforeLong: v })}
      />

      <div style={{
        display: 'flex', gap: '12px', marginTop: '8px', paddingTop: '16px',
        borderTop: `1px solid ${theme.cardBorder}`,
      }}>
        <button
          onClick={() => onChange({ ...settings, autoStart: !settings.autoStart })}
          style={{
            flex: 1, padding: '10px', backgroundColor: settings.autoStart ? BRAND.blue + '12' : 'transparent',
            border: `1px solid ${settings.autoStart ? BRAND.blue + '40' : theme.cardBorder}`,
            borderRadius: '10px', cursor: 'pointer', display: 'flex',
            alignItems: 'center', justifyContent: 'center', gap: '6px',
            fontSize: '12px', fontWeight: '500', color: settings.autoStart ? BRAND.blue : theme.textMuted,
            fontFamily: FONTS.body,
          }}
        >
          <SkipForward size={14} />
          Auto-start
        </button>
        <button
          onClick={() => onChange({ ...settings, soundEnabled: !settings.soundEnabled })}
          style={{
            flex: 1, padding: '10px', backgroundColor: settings.soundEnabled ? BRAND.green + '12' : 'transparent',
            border: `1px solid ${settings.soundEnabled ? BRAND.green + '40' : theme.cardBorder}`,
            borderRadius: '10px', cursor: 'pointer', display: 'flex',
            alignItems: 'center', justifyContent: 'center', gap: '6px',
            fontSize: '12px', fontWeight: '500', color: settings.soundEnabled ? BRAND.green : theme.textMuted,
            fontFamily: FONTS.body,
          }}
        >
          {settings.soundEnabled ? <SpeakerHigh size={14} /> : <SpeakerSlash size={14} />}
          Sound {settings.soundEnabled ? 'On' : 'Off'}
        </button>
      </div>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================
const PomodoroTimer = ({ isDark }) => {
  const theme = getTheme(isDark);
  const [settings, setSettings] = useState(loadSettings);
  const [stats, setStats] = useState(loadStats);
  const [phase, setPhase] = useState('work'); // work | shortBreak | longBreak
  const [timeLeft, setTimeLeft] = useState(settings.workMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const [taskName, setTaskName] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [isSmall, setIsSmall] = useState(window.innerWidth < 640);

  const intervalRef = useRef(null);

  // Responsive
  useEffect(() => {
    const onResize = () => setIsSmall(window.innerWidth < 640);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Get total seconds for current phase
  const getTotalSeconds = useCallback((p) => {
    switch (p) {
      case 'work': return settings.workMinutes * 60;
      case 'shortBreak': return settings.shortBreakMinutes * 60;
      case 'longBreak': return settings.longBreakMinutes * 60;
      default: return settings.workMinutes * 60;
    }
  }, [settings]);

  // Timer countdown
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, timeLeft]);

  // Phase completion
  useEffect(() => {
    if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      playBeep(settings.soundEnabled);

      if (phase === 'work') {
        const newSessionCount = sessionCount + 1;
        setSessionCount(newSessionCount);

        // Update stats
        const newStats = {
          ...stats,
          today: getTodayKey(),
          sessions: stats.sessions + 1,
          focusMinutes: stats.focusMinutes + settings.workMinutes,
        };
        setStats(newStats);
        saveStats(newStats);

        // Determine next phase
        const isLongBreak = newSessionCount % settings.sessionsBeforeLong === 0;
        const nextPhase = isLongBreak ? 'longBreak' : 'shortBreak';
        setPhase(nextPhase);
        setTimeLeft(getTotalSeconds(nextPhase));

        if (settings.autoStart) {
          setTimeout(() => setIsRunning(true), 500);
        }
      } else {
        // Break finished, back to work
        setPhase('work');
        setTimeLeft(getTotalSeconds('work'));

        if (settings.autoStart) {
          setTimeout(() => setIsRunning(true), 500);
        }
      }
    }
  }, [timeLeft, isRunning]);

  // Keyboard shortcut
  useEffect(() => {
    const handleKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.code === 'Space') {
        e.preventDefault();
        setIsRunning((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // Update page title
  useEffect(() => {
    if (isRunning) {
      document.title = `${formatTimer(timeLeft)} - ${PHASES[phase].label} | BrewedOps`;
    } else {
      document.title = 'Focus Timer | BrewedOps';
    }
    return () => { document.title = 'BrewedOps'; };
  }, [timeLeft, isRunning, phase]);

  // Persist settings
  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  const handleSettingsChange = (newSettings) => {
    setSettings(newSettings);
    // If not running, reset timer to new duration
    if (!isRunning) {
      setTimeLeft(
        phase === 'work' ? newSettings.workMinutes * 60 :
        phase === 'shortBreak' ? newSettings.shortBreakMinutes * 60 :
        newSettings.longBreakMinutes * 60
      );
    }
  };

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(getTotalSeconds(phase));
  };

  const skipPhase = () => {
    setIsRunning(false);
    if (phase === 'work') {
      const isLongBreak = (sessionCount + 1) % settings.sessionsBeforeLong === 0;
      const nextPhase = isLongBreak ? 'longBreak' : 'shortBreak';
      setPhase(nextPhase);
      setTimeLeft(getTotalSeconds(nextPhase));
    } else {
      setPhase('work');
      setTimeLeft(getTotalSeconds('work'));
    }
  };

  const switchPhase = (newPhase) => {
    setIsRunning(false);
    setPhase(newPhase);
    setTimeLeft(getTotalSeconds(newPhase));
  };

  const progress = 1 - timeLeft / getTotalSeconds(phase);
  const currentPhase = PHASES[phase];
  const PhaseIcon = currentPhase.icon;
  const ringSize = isSmall ? 240 : 280;

  // Session dots for current cycle
  const cycleLength = settings.sessionsBeforeLong;
  const currentCyclePosition = sessionCount % cycleLength;

  // Weekly stats from history
  const weeklyStats = useMemo(() => {
    const allDays = [...(stats.history || []), { date: stats.today, sessions: stats.sessions, focusMinutes: stats.focusMinutes }];
    const last7 = allDays.slice(-7);
    return {
      totalSessions: last7.reduce((sum, d) => sum + d.sessions, 0),
      totalMinutes: last7.reduce((sum, d) => sum + d.focusMinutes, 0),
      streak: calculateStreak(allDays),
    };
  }, [stats]);

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: isSmall ? '20px 16px' : '32px 24px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <div style={{
            width: '42px', height: '42px', borderRadius: '12px',
            backgroundColor: currentPhase.color + '12', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            transition: 'background-color 0.3s',
          }}>
            <Timer size={22} style={{ color: currentPhase.color, transition: 'color 0.3s' }} />
          </div>
          <h1 style={{
            fontSize: isSmall ? '22px' : '26px', fontWeight: '800',
            color: theme.text, fontFamily: FONTS.heading, margin: 0,
          }}>
            Focus Timer
          </h1>
        </div>
        <p style={{
          fontSize: '13px', color: theme.textMuted, fontFamily: FONTS.body, margin: 0,
        }}>
          Stay focused. Work in intervals. Press Space to start.
        </p>
      </div>

      {/* Phase Tabs */}
      <div style={{
        display: 'flex', backgroundColor: isDark ? '#1e1a16' : '#f0e8dc',
        borderRadius: '12px', padding: '4px', gap: '4px', marginBottom: '28px',
      }}>
        {Object.entries(PHASES).map(([key, p]) => {
          const Icon = p.icon;
          const isActive = phase === key;
          return (
            <button
              key={key}
              onClick={() => switchPhase(key)}
              style={{
                flex: 1, padding: '10px 8px', border: 'none', borderRadius: '10px',
                cursor: 'pointer', display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: '6px', fontSize: '12px',
                fontWeight: isActive ? '700' : '500', fontFamily: FONTS.body,
                backgroundColor: isActive ? theme.cardBg : 'transparent',
                color: isActive ? p.color : theme.textSubtle,
                boxShadow: isActive ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 0.2s',
              }}
            >
              <Icon size={14} />
              {!isSmall && p.label}
              {isSmall && p.label.split(' ')[0]}
            </button>
          );
        })}
      </div>

      {/* Timer Display */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        marginBottom: '24px',
      }}>
        {/* Circular Ring */}
        <div style={{ position: 'relative', width: ringSize, height: ringSize }}>
          <ProgressRing
            progress={progress}
            color={currentPhase.ringColor}
            size={ringSize}
            strokeWidth={8}
            isDark={isDark}
          />
          {/* Center Content */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              marginBottom: '8px',
            }}>
              <PhaseIcon size={16} style={{ color: currentPhase.color }} />
              <span style={{
                fontSize: '12px', fontWeight: '600', color: currentPhase.color,
                fontFamily: FONTS.body, textTransform: 'uppercase', letterSpacing: '1px',
              }}>
                {currentPhase.label}
              </span>
            </div>
            <div style={{
              fontSize: isSmall ? '52px' : '60px', fontWeight: '800',
              color: theme.text, fontFamily: FONTS.heading, lineHeight: '1',
              letterSpacing: '-2px',
            }}>
              {formatTimer(timeLeft)}
            </div>
            {taskName && (
              <div style={{
                fontSize: '12px', color: theme.textMuted, fontFamily: FONTS.body,
                marginTop: '8px', maxWidth: '180px', textAlign: 'center',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {taskName}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: '12px', marginBottom: '24px',
      }}>
        <button
          onClick={resetTimer}
          style={{
            width: '44px', height: '44px', backgroundColor: 'transparent',
            border: `1px solid ${theme.cardBorder}`, borderRadius: '12px',
            cursor: 'pointer', display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: theme.textMuted,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = theme.textMuted; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = theme.cardBorder; }}
          title="Reset"
        >
          <ArrowCounterClockwise size={18} />
        </button>

        <button
          onClick={toggleTimer}
          style={{
            width: '64px', height: '64px', backgroundColor: currentPhase.color,
            border: 'none', borderRadius: '50%', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#ffffff', boxShadow: `0 4px 20px ${currentPhase.color}40`,
            transition: 'transform 0.15s, box-shadow 0.15s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
          title={isRunning ? 'Pause' : 'Start'}
        >
          {isRunning ? <Pause size={24} fill="#fff" /> : <Play size={24} fill="#fff" style={{ marginLeft: '2px' }} />}
        </button>

        <button
          onClick={skipPhase}
          style={{
            width: '44px', height: '44px', backgroundColor: 'transparent',
            border: `1px solid ${theme.cardBorder}`, borderRadius: '12px',
            cursor: 'pointer', display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: theme.textMuted,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = theme.textMuted; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = theme.cardBorder; }}
          title="Skip to next"
        >
          <SkipForward size={18} />
        </button>
      </div>

      {/* Task Input */}
      <div style={{
        backgroundColor: theme.cardBg, border: `1px solid ${theme.cardBorder}`,
        borderRadius: '14px', padding: '16px', marginBottom: '16px',
      }}>
        <input
          type="text"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          placeholder="What are you working on?"
          style={{
            width: '100%', height: '40px', backgroundColor: theme.inputBg,
            border: `1px solid ${theme.inputBorder}`, borderRadius: '10px',
            padding: '0 14px', fontSize: '13px', color: theme.text,
            fontFamily: FONTS.body, outline: 'none', boxSizing: 'border-box',
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = currentPhase.color; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = theme.inputBorder; }}
        />
      </div>

      {/* Session Progress Dots */}
      <div style={{
        backgroundColor: theme.cardBg, border: `1px solid ${theme.cardBorder}`,
        borderRadius: '14px', padding: '16px', marginBottom: '16px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ fontSize: '12px', color: theme.textMuted, fontFamily: FONTS.body }}>
          Cycle Progress
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {Array.from({ length: cycleLength }).map((_, i) => (
            <div
              key={i}
              style={{
                width: '12px', height: '12px', borderRadius: '50%',
                backgroundColor: i < currentCyclePosition ? BRAND.blue :
                  (i === currentCyclePosition && phase === 'work') ? BRAND.blue + '40' :
                  isDark ? '#2a2420' : '#e0d6c8',
                border: (i === currentCyclePosition && phase === 'work') ? `2px solid ${BRAND.blue}` : '2px solid transparent',
                transition: 'background-color 0.3s',
              }}
            />
          ))}
          <span style={{ fontSize: '11px', color: theme.textSubtle, fontFamily: FONTS.body, marginLeft: '4px' }}>
            {currentCyclePosition}/{cycleLength}
          </span>
        </div>
      </div>

      {/* Today's Stats */}
      <div style={{
        backgroundColor: theme.cardBg, border: `1px solid ${theme.cardBorder}`,
        borderRadius: '14px', padding: '20px', marginBottom: '16px',
      }}>
        <div style={{ fontSize: '12px', fontWeight: '700', color: theme.textSubtle, fontFamily: FONTS.body, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '14px' }}>
          Today's Stats
        </div>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px',
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: '800', color: BRAND.blue, fontFamily: FONTS.heading }}>
              {stats.sessions}
            </div>
            <div style={{ fontSize: '11px', color: theme.textMuted, fontFamily: FONTS.body }}>Sessions</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: '800', color: BRAND.green, fontFamily: FONTS.heading }}>
              {formatFocusTime(stats.focusMinutes)}
            </div>
            <div style={{ fontSize: '11px', color: theme.textMuted, fontFamily: FONTS.body }}>Focus Time</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: '800', color: '#f59e0b', fontFamily: FONTS.heading }}>
              {weeklyStats.streak}d
            </div>
            <div style={{ fontSize: '11px', color: theme.textMuted, fontFamily: FONTS.body }}>Streak</div>
          </div>
        </div>

        {/* Mini week chart */}
        {stats.history && stats.history.length > 0 && (
          <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: `1px solid ${theme.cardBorder}` }}>
            <div style={{ fontSize: '11px', color: theme.textSubtle, fontFamily: FONTS.body, marginBottom: '10px' }}>
              Last 7 days: {weeklyStats.totalSessions} sessions, {formatFocusTime(weeklyStats.totalMinutes)} focused
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '40px' }}>
              {(() => {
                const allDays = [...(stats.history || []), { date: stats.today, sessions: stats.sessions, focusMinutes: stats.focusMinutes }];
                const last7 = allDays.slice(-7);
                const maxSessions = Math.max(...last7.map((d) => d.sessions), 1);
                return last7.map((day, i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1, borderRadius: '3px',
                      backgroundColor: day.sessions > 0 ? BRAND.blue : (isDark ? '#2a2420' : '#e8e0d4'),
                      height: `${Math.max((day.sessions / maxSessions) * 100, 8)}%`,
                      opacity: day.sessions > 0 ? (0.4 + (day.sessions / maxSessions) * 0.6) : 0.3,
                      transition: 'height 0.3s',
                    }}
                    title={`${day.date}: ${day.sessions} sessions`}
                  />
                ));
              })()}
            </div>
          </div>
        )}
      </div>

      {/* Settings Toggle */}
      <button
        onClick={() => setShowSettings(!showSettings)}
        style={{
          width: '100%', padding: '12px', backgroundColor: 'transparent',
          border: `1px solid ${theme.cardBorder}`, borderRadius: '14px',
          cursor: 'pointer', display: 'flex', alignItems: 'center',
          justifyContent: 'center', gap: '8px', fontSize: '13px',
          fontWeight: '500', color: theme.textMuted, fontFamily: FONTS.body,
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = BRAND.blue; e.currentTarget.style.color = BRAND.blue; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = theme.cardBorder; e.currentTarget.style.color = theme.textMuted; }}
      >
        <GearSix size={16} />
        Settings
        {showSettings ? <CaretUp size={14} /> : <CaretDown size={14} />}
      </button>

      {showSettings && (
        <SettingsPanel
          settings={settings}
          onChange={handleSettingsChange}
          theme={theme}
          isDark={isDark}
        />
      )}
    </div>
  );
};

// ============================================
// STREAK CALCULATOR
// ============================================
function calculateStreak(allDays) {
  if (!allDays || allDays.length === 0) return 0;
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(today.getDate() - i);
    const key = checkDate.toISOString().split('T')[0];
    const dayData = allDays.find((d) => d.date === key);
    if (dayData && dayData.sessions > 0) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }
  return streak;
}

export default PomodoroTimer;
