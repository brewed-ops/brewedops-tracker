/**
 * CronGenerator Component
 * - Visual cron schedule builder
 * - Generate cron expressions
 * - Preview next run times
 * - Common presets
 * - Copy for n8n, Make, GHL, Zapier
 */

import React, { useState, useEffect } from 'react';
import { Copy, Check, Clock, Calendar, Play, Info, CaretDown, Lightning, ArrowsClockwise } from '@phosphor-icons/react';

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
});

// Preset schedules
const PRESETS = [
  { name: 'Every minute', cron: '* * * * *', description: 'Runs every minute' },
  { name: 'Every 5 minutes', cron: '*/5 * * * *', description: 'Runs every 5 minutes' },
  { name: 'Every 15 minutes', cron: '*/15 * * * *', description: 'Runs every 15 minutes' },
  { name: 'Every 30 minutes', cron: '*/30 * * * *', description: 'Runs every 30 minutes' },
  { name: 'Every hour', cron: '0 * * * *', description: 'Runs at the start of every hour' },
  { name: 'Every day at midnight', cron: '0 0 * * *', description: 'Runs daily at 12:00 AM' },
  { name: 'Every day at 9 AM', cron: '0 9 * * *', description: 'Runs daily at 9:00 AM' },
  { name: 'Every day at 6 PM', cron: '0 18 * * *', description: 'Runs daily at 6:00 PM' },
  { name: 'Every Monday at 9 AM', cron: '0 9 * * 1', description: 'Runs every Monday at 9:00 AM' },
  { name: 'Weekdays at 9 AM', cron: '0 9 * * 1-5', description: 'Runs Mon-Fri at 9:00 AM' },
  { name: 'Every Sunday at midnight', cron: '0 0 * * 0', description: 'Runs every Sunday at 12:00 AM' },
  { name: 'First of month at midnight', cron: '0 0 1 * *', description: 'Runs on the 1st of each month' },
  { name: 'Every quarter', cron: '0 0 1 */3 *', description: 'Runs every 3 months on the 1st' },
  { name: 'Every year', cron: '0 0 1 1 *', description: 'Runs on January 1st at midnight' },
];

const DAYS_OF_WEEK = [
  { value: 0, label: 'Sun', fullLabel: 'Sunday' },
  { value: 1, label: 'Mon', fullLabel: 'Monday' },
  { value: 2, label: 'Tue', fullLabel: 'Tuesday' },
  { value: 3, label: 'Wed', fullLabel: 'Wednesday' },
  { value: 4, label: 'Thu', fullLabel: 'Thursday' },
  { value: 5, label: 'Fri', fullLabel: 'Friday' },
  { value: 6, label: 'Sat', fullLabel: 'Saturday' },
];

const MONTHS = [
  { value: 1, label: 'Jan' }, { value: 2, label: 'Feb' }, { value: 3, label: 'Mar' },
  { value: 4, label: 'Apr' }, { value: 5, label: 'May' }, { value: 6, label: 'Jun' },
  { value: 7, label: 'Jul' }, { value: 8, label: 'Aug' }, { value: 9, label: 'Sep' },
  { value: 10, label: 'Oct' }, { value: 11, label: 'Nov' }, { value: 12, label: 'Dec' },
];

// Parse cron expression to get next run times
const getNextRuns = (cronExpression, count = 5) => {
  try {
    const parts = cronExpression.split(' ');
    if (parts.length !== 5) return [];

    const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;
    const runs = [];
    const now = new Date();
    let current = new Date(now);
    current.setSeconds(0);
    current.setMilliseconds(0);

    const matchesField = (value, field, max, min = 0) => {
      if (field === '*') return true;
      if (field.includes('/')) {
        const [, step] = field.split('/');
        return value % parseInt(step) === 0;
      }
      if (field.includes('-')) {
        const [start, end] = field.split('-').map(Number);
        return value >= start && value <= end;
      }
      if (field.includes(',')) {
        return field.split(',').map(Number).includes(value);
      }
      return parseInt(field) === value;
    };

    const matchesCron = (date) => {
      const m = date.getMinutes();
      const h = date.getHours();
      const dom = date.getDate();
      const mon = date.getMonth() + 1;
      const dow = date.getDay();

      return matchesField(m, minute, 59) &&
             matchesField(h, hour, 23) &&
             matchesField(dom, dayOfMonth, 31, 1) &&
             matchesField(mon, month, 12, 1) &&
             matchesField(dow, dayOfWeek, 6);
    };

    // Find next runs
    let iterations = 0;
    const maxIterations = 525600; // 1 year in minutes

    while (runs.length < count && iterations < maxIterations) {
      current.setMinutes(current.getMinutes() + 1);
      if (matchesCron(current)) {
        runs.push(new Date(current));
      }
      iterations++;
    }

    return runs;
  } catch (e) {
    return [];
  }
};

// Generate human-readable description
const describeCron = (cronExpression) => {
  const parts = cronExpression.split(' ');
  if (parts.length !== 5) return 'Invalid cron expression';

  const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;

  // Check presets first
  const preset = PRESETS.find(p => p.cron === cronExpression);
  if (preset) return preset.description;

  let description = 'Runs ';

  // Minute
  if (minute === '*') {
    description += 'every minute';
  } else if (minute.includes('/')) {
    description += `every ${minute.split('/')[1]} minutes`;
  } else if (minute === '0') {
    description += 'at the start of the hour';
  } else {
    description += `at minute ${minute}`;
  }

  // Hour
  if (hour !== '*') {
    if (hour.includes('/')) {
      description += `, every ${hour.split('/')[1]} hours`;
    } else if (hour.includes('-')) {
      const [start, end] = hour.split('-');
      description += `, between ${start}:00 and ${end}:00`;
    } else {
      const h = parseInt(hour);
      const ampm = h >= 12 ? 'PM' : 'AM';
      const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
      description = description.replace('at the start of the hour', '');
      description = description.replace('at minute ' + minute, '');
      description += ` at ${h12}:${minute.padStart(2, '0')} ${ampm}`;
    }
  }

  // Day of week
  if (dayOfWeek !== '*') {
    if (dayOfWeek.includes('-')) {
      const [start, end] = dayOfWeek.split('-').map(Number);
      const startDay = DAYS_OF_WEEK.find(d => d.value === start)?.fullLabel;
      const endDay = DAYS_OF_WEEK.find(d => d.value === end)?.fullLabel;
      description += `, ${startDay} to ${endDay}`;
    } else if (dayOfWeek.includes(',')) {
      const days = dayOfWeek.split(',').map(d => DAYS_OF_WEEK.find(day => day.value === parseInt(d))?.label).join(', ');
      description += `, on ${days}`;
    } else {
      const day = DAYS_OF_WEEK.find(d => d.value === parseInt(dayOfWeek))?.fullLabel;
      description += `, every ${day}`;
    }
  }

  // Day of month
  if (dayOfMonth !== '*') {
    if (dayOfMonth.includes('/')) {
      description += `, every ${dayOfMonth.split('/')[1]} days`;
    } else {
      description += `, on day ${dayOfMonth}`;
    }
  }

  // Month
  if (month !== '*') {
    if (month.includes('/')) {
      description += `, every ${month.split('/')[1]} months`;
    } else {
      const monthName = MONTHS.find(m => m.value === parseInt(month))?.label;
      description += `, in ${monthName}`;
    }
  }

  return description;
};

// Main Component
const CronGenerator = ({ isDark = true }) => {
  const theme = getTheme(isDark);
  
  // Cron parts state
  const [minute, setMinute] = useState('0');
  const [hour, setHour] = useState('9');
  const [dayOfMonth, setDayOfMonth] = useState('*');
  const [month, setMonth] = useState('*');
  const [selectedDays, setSelectedDays] = useState([1, 2, 3, 4, 5]); // Mon-Fri default
  
  // UI state
  const [cronExpression, setCronExpression] = useState('0 9 * * 1-5');
  const [copied, setCopied] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [scheduleType, setScheduleType] = useState('daily'); // 'minutes', 'hourly', 'daily', 'weekly', 'monthly', 'custom'
  const [minuteInterval, setMinuteInterval] = useState('15');
  const [hourInterval, setHourInterval] = useState('1');

  // Build cron expression from state
  useEffect(() => {
    let cron = '';
    
    switch (scheduleType) {
      case 'minutes':
        cron = `*/${minuteInterval} * * * *`;
        break;
      case 'hourly':
        cron = hourInterval === '1' ? `0 * * * *` : `0 */${hourInterval} * * *`;
        break;
      case 'daily':
        cron = `${minute} ${hour} * * *`;
        break;
      case 'weekly':
        const dayOfWeekStr = selectedDays.length === 7 ? '*' : 
                            selectedDays.length === 0 ? '*' :
                            selectedDays.sort((a, b) => a - b).join(',');
        cron = `${minute} ${hour} * * ${dayOfWeekStr}`;
        break;
      case 'monthly':
        cron = `${minute} ${hour} ${dayOfMonth} * *`;
        break;
      case 'custom':
        cron = `${minute} ${hour} ${dayOfMonth} ${month} ${selectedDays.length === 7 || selectedDays.length === 0 ? '*' : selectedDays.sort((a, b) => a - b).join(',')}`;
        break;
      default:
        cron = '0 9 * * 1-5';
    }
    
    setCronExpression(cron);
  }, [scheduleType, minute, hour, dayOfMonth, month, selectedDays, minuteInterval, hourInterval]);

  const handlePresetSelect = (preset) => {
    setCronExpression(preset.cron);
    setScheduleType('custom');
    
    // Parse preset into fields
    const parts = preset.cron.split(' ');
    setMinute(parts[0]);
    setHour(parts[1]);
    setDayOfMonth(parts[2]);
    setMonth(parts[3]);
    
    // Parse day of week
    if (parts[4] === '*') {
      setSelectedDays([0, 1, 2, 3, 4, 5, 6]);
    } else if (parts[4].includes('-')) {
      const [start, end] = parts[4].split('-').map(Number);
      const days = [];
      for (let i = start; i <= end; i++) days.push(i);
      setSelectedDays(days);
    } else if (parts[4].includes(',')) {
      setSelectedDays(parts[4].split(',').map(Number));
    } else {
      setSelectedDays([parseInt(parts[4])]);
    }
    
    setShowPresets(false);
  };

  const toggleDay = (day) => {
    setSelectedDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day].sort((a, b) => a - b)
    );
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(cronExpression);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const nextRuns = getNextRuns(cronExpression);
  const description = describeCron(cronExpression);

  const btnStyle = {
    height: '32px',
    padding: '0 12px',
    backgroundColor: 'transparent',
    border: '1px solid ' + theme.cardBorder,
    borderRadius: '6px',
    color: theme.textMuted,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    fontSize: '12px',
    fontFamily: FONTS.body,
  };

  const tabStyle = (active) => ({
    padding: '8px 16px',
    backgroundColor: active ? BRAND.blue : 'transparent',
    border: 'none',
    borderRadius: '6px',
    color: active ? '#fff' : theme.textMuted,
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: active ? '600' : '400',
    fontFamily: FONTS.body,
    transition: 'all 0.15s ease',
  });

  return (
    <div style={{ width: '100%', height: 'calc(100vh - 160px)', minHeight: '500px', display: 'flex', flexDirection: 'column', backgroundColor: theme.cardBg, borderRadius: '12px', border: '1px solid ' + theme.cardBorder, overflow: 'hidden' }}>
      
      {/* Header */}
      <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid ' + theme.cardBorder, flexShrink: 0, flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: `linear-gradient(135deg, ${BRAND.green}, #22c55e)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={16} style={{ color: '#fff' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '16px', fontWeight: '700', color: theme.text, margin: 0, fontFamily: FONTS.heading }}>Cron Generator</h1>
            <p style={{ fontSize: '11px', color: theme.textMuted, margin: 0 }}>Build cron schedules for n8n, Make, GHL & more</p>
          </div>
        </div>
        
        {/* Presets Dropdown */}
        <div style={{ position: 'relative' }}>
          <button onClick={() => setShowPresets(!showPresets)} style={btnStyle}>
            <Lightning size={14} /> Presets <CaretDown size={12} />
          </button>
          {showPresets && (
            <div style={{ 
              position: 'absolute', 
              top: '100%', 
              right: 0, 
              marginTop: '4px', 
              backgroundColor: theme.cardBg, 
              border: '1px solid ' + theme.cardBorder, 
              borderRadius: '8px', 
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)', 
              padding: '4px', 
              zIndex: 100, 
              minWidth: '240px',
              maxHeight: '300px',
              overflowY: 'auto',
            }}>
              {PRESETS.map((preset, i) => (
                <button
                  key={i}
                  onClick={() => handlePresetSelect(preset)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDark ? '#1e1a16' : '#faf8f5'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <span style={{ fontSize: '12px', color: theme.text, fontWeight: '500' }}>{preset.name}</span>
                  <span style={{ fontSize: '10px', color: theme.textMuted, fontFamily: "'Fira Code', monospace" }}>{preset.cron}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto', minHeight: 0 }}>
        
        {/* Schedule Type Tabs */}
        <div style={{ padding: '12px 16px', borderBottom: '1px solid ' + theme.cardBorder, display: 'flex', gap: '4px', flexWrap: 'wrap', flexShrink: 0, backgroundColor: isDark ? '#100e0b' : '#faf8f5' }}>
          <button onClick={() => setScheduleType('minutes')} style={tabStyle(scheduleType === 'minutes')}>Minutes</button>
          <button onClick={() => setScheduleType('hourly')} style={tabStyle(scheduleType === 'hourly')}>Hourly</button>
          <button onClick={() => setScheduleType('daily')} style={tabStyle(scheduleType === 'daily')}>Daily</button>
          <button onClick={() => setScheduleType('weekly')} style={tabStyle(scheduleType === 'weekly')}>Weekly</button>
          <button onClick={() => setScheduleType('monthly')} style={tabStyle(scheduleType === 'monthly')}>Monthly</button>
          <button onClick={() => setScheduleType('custom')} style={tabStyle(scheduleType === 'custom')}>Custom</button>
        </div>

        {/* Builder Section */}
        <div style={{ padding: '20px', flex: 1, overflow: 'auto' }}>
          
          {/* Minutes Schedule */}
          {scheduleType === 'minutes' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '14px', color: theme.text }}>Run every</span>
              <select
                value={minuteInterval}
                onChange={(e) => setMinuteInterval(e.target.value)}
                style={{
                  padding: '8px 12px',
                  backgroundColor: theme.inputBg,
                  border: '1px solid ' + theme.cardBorder,
                  borderRadius: '6px',
                  color: theme.text,
                  fontSize: '14px',
                  fontFamily: FONTS.body,
                  cursor: 'pointer',
                }}
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
                <option value="30">30</option>
              </select>
              <span style={{ fontSize: '14px', color: theme.text }}>minutes</span>
            </div>
          )}

          {/* Hourly Schedule */}
          {scheduleType === 'hourly' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '14px', color: theme.text }}>Run every</span>
              <select
                value={hourInterval}
                onChange={(e) => setHourInterval(e.target.value)}
                style={{
                  padding: '8px 12px',
                  backgroundColor: theme.inputBg,
                  border: '1px solid ' + theme.cardBorder,
                  borderRadius: '6px',
                  color: theme.text,
                  fontSize: '14px',
                  fontFamily: FONTS.body,
                  cursor: 'pointer',
                }}
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="6">6</option>
                <option value="8">8</option>
                <option value="12">12</option>
              </select>
              <span style={{ fontSize: '14px', color: theme.text }}>hour(s) at minute 0</span>
            </div>
          )}

          {/* Daily Schedule */}
          {scheduleType === 'daily' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '14px', color: theme.text }}>Run every day at</span>
              <select
                value={hour}
                onChange={(e) => setHour(e.target.value)}
                style={{
                  padding: '8px 12px',
                  backgroundColor: theme.inputBg,
                  border: '1px solid ' + theme.cardBorder,
                  borderRadius: '6px',
                  color: theme.text,
                  fontSize: '14px',
                  fontFamily: FONTS.body,
                  cursor: 'pointer',
                }}
              >
                {Array.from({ length: 24 }, (_, i) => {
                  const ampm = i >= 12 ? 'PM' : 'AM';
                  const h12 = i === 0 ? 12 : i > 12 ? i - 12 : i;
                  return <option key={i} value={i}>{h12}:00 {ampm}</option>;
                })}
              </select>
              <span style={{ fontSize: '14px', color: theme.text }}>:</span>
              <select
                value={minute}
                onChange={(e) => setMinute(e.target.value)}
                style={{
                  padding: '8px 12px',
                  backgroundColor: theme.inputBg,
                  border: '1px solid ' + theme.cardBorder,
                  borderRadius: '6px',
                  color: theme.text,
                  fontSize: '14px',
                  fontFamily: FONTS.body,
                  cursor: 'pointer',
                }}
              >
                {Array.from({ length: 60 }, (_, m) => (
                  <option key={m} value={m}>{m.toString().padStart(2, '0')}</option>
                ))}
              </select>
            </div>
          )}

          {/* Weekly Schedule */}
          {scheduleType === 'weekly' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '14px', color: theme.text }}>Run at</span>
                <select
                  value={hour}
                  onChange={(e) => setHour(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    backgroundColor: theme.inputBg,
                    border: '1px solid ' + theme.cardBorder,
                    borderRadius: '6px',
                    color: theme.text,
                    fontSize: '14px',
                    fontFamily: FONTS.body,
                    cursor: 'pointer',
                  }}
                >
                  {Array.from({ length: 24 }, (_, i) => {
                    const ampm = i >= 12 ? 'PM' : 'AM';
                    const h12 = i === 0 ? 12 : i > 12 ? i - 12 : i;
                    return <option key={i} value={i}>{h12}:00 {ampm}</option>;
                  })}
                </select>
                <span style={{ fontSize: '14px', color: theme.text }}>:</span>
                <select
                  value={minute}
                  onChange={(e) => setMinute(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    backgroundColor: theme.inputBg,
                    border: '1px solid ' + theme.cardBorder,
                    borderRadius: '6px',
                    color: theme.text,
                    fontSize: '14px',
                    fontFamily: FONTS.body,
                    cursor: 'pointer',
                  }}
                >
                  {[0, 15, 30, 45].map(m => (
                    <option key={m} value={m}>{m.toString().padStart(2, '0')}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <span style={{ fontSize: '14px', color: theme.text, display: 'block', marginBottom: '8px' }}>On these days:</span>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {DAYS_OF_WEEK.map(day => (
                    <button
                      key={day.value}
                      onClick={() => toggleDay(day.value)}
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '8px',
                        border: '2px solid ' + (selectedDays.includes(day.value) ? BRAND.blue : theme.cardBorder),
                        backgroundColor: selectedDays.includes(day.value) ? BRAND.blue : 'transparent',
                        color: selectedDays.includes(day.value) ? '#fff' : theme.text,
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        fontFamily: FONTS.body,
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {day.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Monthly Schedule */}
          {scheduleType === 'monthly' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '14px', color: theme.text }}>Run on day</span>
                <select
                  value={dayOfMonth}
                  onChange={(e) => setDayOfMonth(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    backgroundColor: theme.inputBg,
                    border: '1px solid ' + theme.cardBorder,
                    borderRadius: '6px',
                    color: theme.text,
                    fontSize: '14px',
                    fontFamily: FONTS.body,
                    cursor: 'pointer',
                  }}
                >
                  {Array.from({ length: 31 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}{i === 0 ? 'st' : i === 1 ? 'nd' : i === 2 ? 'rd' : 'th'}</option>
                  ))}
                </select>
                <span style={{ fontSize: '14px', color: theme.text }}>of every month at</span>
                <select
                  value={hour}
                  onChange={(e) => setHour(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    backgroundColor: theme.inputBg,
                    border: '1px solid ' + theme.cardBorder,
                    borderRadius: '6px',
                    color: theme.text,
                    fontSize: '14px',
                    fontFamily: FONTS.body,
                    cursor: 'pointer',
                  }}
                >
                  {Array.from({ length: 24 }, (_, i) => {
                    const ampm = i >= 12 ? 'PM' : 'AM';
                    const h12 = i === 0 ? 12 : i > 12 ? i - 12 : i;
                    return <option key={i} value={i}>{h12}:00 {ampm}</option>;
                  })}
                </select>
              </div>
            </div>
          )}

          {/* Custom Schedule */}
          {scheduleType === 'custom' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <input
                  value={cronExpression}
                  onChange={(e) => setCronExpression(e.target.value)}
                  placeholder="* * * * *"
                  style={{
                    padding: '12px 16px',
                    backgroundColor: theme.inputBg,
                    border: '1px solid ' + theme.cardBorder,
                    borderRadius: '8px',
                    color: theme.text,
                    fontSize: '16px',
                    fontFamily: "'Fira Code', monospace",
                    flex: 1,
                    minWidth: '200px',
                    outline: 'none',
                  }}
                />
              </div>
              
              {/* Cron Format Reference */}
              <div style={{ padding: '12px', backgroundColor: isDark ? '#100e0b' : '#f5f0eb', borderRadius: '8px', border: '1px solid ' + theme.cardBorder }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                  <Info size={14} style={{ color: theme.textMuted }} />
                  <span style={{ fontSize: '11px', fontWeight: '600', color: theme.textMuted }}>CRON FORMAT</span>
                </div>
                <div style={{ fontFamily: "'Fira Code', monospace", fontSize: '12px', color: theme.text }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '300px', marginBottom: '4px' }}>
                    <span style={{ color: '#3b82f6' }}>*</span>
                    <span style={{ color: '#22c55e' }}>*</span>
                    <span style={{ color: '#f59e0b' }}>*</span>
                    <span style={{ color: '#ec4899' }}>*</span>
                    <span style={{ color: '#a855f7' }}>*</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '300px', fontSize: '10px', color: theme.textMuted }}>
                    <span style={{ color: '#3b82f6' }}>min</span>
                    <span style={{ color: '#22c55e' }}>hour</span>
                    <span style={{ color: '#f59e0b' }}>day</span>
                    <span style={{ color: '#ec4899' }}>month</span>
                    <span style={{ color: '#a855f7' }}>weekday</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Generated Cron Expression */}
          <div style={{ marginTop: '24px', padding: '20px', backgroundColor: isDark ? '#100e0b' : '#f5f0eb', borderRadius: '12px', border: '1px solid ' + theme.cardBorder }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '12px', fontWeight: '600', color: theme.textMuted }}>CRON EXPRESSION</span>
              <button onClick={handleCopy} style={{ ...btnStyle, height: '28px' }}>
                {copied ? <Check size={14} style={{ color: BRAND.green }} /> : <Copy size={14} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            
            <div style={{ 
              padding: '16px 20px', 
              backgroundColor: theme.cardBg, 
              borderRadius: '8px', 
              border: '2px solid ' + BRAND.blue,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <code style={{ fontSize: '24px', fontFamily: "'Fira Code', monospace", color: BRAND.blue, fontWeight: '600' }}>
                {cronExpression}
              </code>
            </div>

            {/* Human-readable description */}
            <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ArrowsClockwise size={14} style={{ color: BRAND.green }} />
              <span style={{ fontSize: '13px', color: theme.text }}>{description}</span>
            </div>
          </div>

          {/* Next Run Times */}
          {nextRuns.length > 0 && (
            <div style={{ marginTop: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Calendar size={16} style={{ color: theme.textMuted }} />
                <span style={{ fontSize: '12px', fontWeight: '600', color: theme.textMuted }}>NEXT 5 RUNS</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {nextRuns.map((run, i) => (
                  <div key={i} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px',
                    padding: '10px 14px',
                    backgroundColor: isDark ? '#100e0b' : '#f5f0eb',
                    borderRadius: '8px',
                    border: '1px solid ' + theme.cardBorder,
                  }}>
                    <Play size={12} style={{ color: BRAND.green }} />
                    <span style={{ fontSize: '13px', color: theme.text, fontFamily: FONTS.body }}>
                      {run.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span style={{ fontSize: '13px', color: BRAND.blue, fontWeight: '600', fontFamily: "'Fira Code', monospace" }}>
                      {run.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Platform Tips */}
          <div style={{ marginTop: '24px', padding: '16px', backgroundColor: isDark ? '#1e1a16' : '#fffbeb', borderRadius: '8px', border: '1px solid ' + (isDark ? '#332d26' : '#fde68a') }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Info size={14} style={{ color: '#f59e0b' }} />
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#f59e0b' }}>PLATFORM TIPS</span>
            </div>
            <div style={{ fontSize: '12px', color: theme.textMuted, lineHeight: '1.6' }}>
              <p style={{ margin: '0 0 6px 0' }}><strong>n8n:</strong> Use in Schedule Trigger node → Cron Expression mode</p>
              <p style={{ margin: '0 0 6px 0' }}><strong>Make:</strong> Scenario scheduling → Advanced → Enter cron expression</p>
              <p style={{ margin: '0 0 6px 0' }}><strong>GHL:</strong> Workflow triggers → Schedule → Custom cron</p>
              <p style={{ margin: '0' }}><strong>Zapier:</strong> Use "Schedule by Zapier" trigger (limited cron support)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CronGenerator;
