// VAKita.jsx - Income & Client Manager for Filipino VAs
// Renders INSIDE App.jsx main content area - App.jsx handles header with level/XP/achievements
// Data stored in Supabase for persistence
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { FileText, Clock, Plus, Trash2, Edit, Eye, X, Sun, Moon as MoonIcon, Coffee, Zap, Users, Bell, PiggyBank, Calculator, Receipt, BarChart3, Loader2, Target, UserPlus, CheckCircle, Info, Mail, Copy, Send, Settings } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { getTheme } from '../lib/theme';
import { useWindowSize } from '../lib/hooks';
import { formatAmount } from '../lib/utils';

const TIMEZONES = [
  { id: 'America/New_York', name: 'Eastern', city: 'New York', flag: '🇺🇸' },
  { id: 'America/Chicago', name: 'Central', city: 'Chicago', flag: '🇺🇸' },
  { id: 'America/Los_Angeles', name: 'Pacific', city: 'Los Angeles', flag: '🇺🇸' },
  { id: 'America/Toronto', name: 'Eastern', city: 'Toronto', flag: '🇨🇦' },
  { id: 'Europe/London', name: 'GMT/BST', city: 'London', flag: '🇬🇧' },
  { id: 'Europe/Berlin', name: 'CET', city: 'Berlin', flag: '🇩🇪' },
  { id: 'Asia/Dubai', name: 'Gulf', city: 'Dubai', flag: '🇦🇪' },
  { id: 'Asia/Singapore', name: 'SGT', city: 'Singapore', flag: '🇸🇬' },
  { id: 'Asia/Manila', name: 'PHT', city: 'Manila', flag: '🇵🇭' },
  { id: 'Asia/Tokyo', name: 'JST', city: 'Tokyo', flag: '🇯🇵' },
  { id: 'Australia/Sydney', name: 'AEST', city: 'Sydney', flag: '🇦🇺' },
];

const PLATFORMS = [
  { id: 'wise', name: 'Wise', icon: 'https://cdn.simpleicons.org/wise/9FE870', emoji: '💸' },
  { id: 'payoneer', name: 'Payoneer', icon: 'https://cdn.simpleicons.org/payoneer/FF4800', emoji: '🔵' },
  { id: 'paypal', name: 'PayPal', icon: 'https://cdn.simpleicons.org/paypal/00457C', emoji: '🅿️' },
  { id: 'gcash', name: 'GCash', icon: '📱', emoji: '📱' },
  { id: 'maya', name: 'Maya', icon: '💜', emoji: '💜' },
  { id: 'bank', name: 'Bank', icon: '🏦', emoji: '🏦' },
];

const LEAD_SOURCES = [
  { id: 'linkedin', name: 'LinkedIn', icon: 'https://cdn.simpleicons.org/linkedin/0A66C2', emoji: '💼' },
  { id: 'onlinejobsph', name: 'OnlineJobsPH', icon: '🇵🇭', emoji: '🇵🇭' },
  { id: 'upwork', name: 'Upwork', icon: 'https://cdn.simpleicons.org/upwork/14A800', emoji: '🟢' },
  { id: 'facebook', name: 'Facebook', icon: 'https://cdn.simpleicons.org/facebook/0866FF', emoji: '📘' },
  { id: 'tiktok', name: 'TikTok', icon: 'https://cdn.simpleicons.org/tiktok/ffffff', emoji: '🎵' },
  { id: 'instagram', name: 'Instagram', icon: 'https://cdn.simpleicons.org/instagram/E4405F', emoji: '📸' },
  { id: 'twitter', name: 'Twitter/X', icon: 'https://cdn.simpleicons.org/x/ffffff', emoji: '🐦' },
  { id: 'fiverr', name: 'Fiverr', icon: 'https://cdn.simpleicons.org/fiverr/1DBF73', emoji: '🟩' },
  { id: 'referral', name: 'Referral', icon: '🤝', emoji: '🤝' },
  { id: 'coldoutreach', name: 'Cold Outreach', icon: '📧', emoji: '📧' },
  { id: 'other', name: 'Other', icon: '🌐', emoji: '🌐' },
];

const PROSPECT_STATUSES = [
  { id: 'new', label: 'New Lead', color: '#6b7280', icon: '🆕' },
  { id: 'contacted', label: 'Contacted', color: '#3b82f6', icon: '📨' },
  { id: 'responded', label: 'Responded', color: '#8b5cf6', icon: '💬' },
  { id: 'meeting', label: 'Meeting Set', color: '#f59e0b', icon: '📅' },
  { id: 'proposal', label: 'Proposal Sent', color: '#ec4899', icon: '📄' },
  { id: 'negotiation', label: 'Negotiation', color: '#14b8a6', icon: '🤝' },
  { id: 'won', label: 'Won! 🎉', color: '#22c55e', icon: '✅' },
  { id: 'lost', label: 'Lost', color: '#ef4444', icon: '❌' },
];

const CURRENCIES = [
  { code: 'PHP', symbol: '₱', rate: 1 },
  { code: 'USD', symbol: '$', rate: 56.50 },
  { code: 'EUR', symbol: '€', rate: 61.20 },
  { code: 'GBP', symbol: '£', rate: 71.80 },
  { code: 'AUD', symbol: 'A$', rate: 36.40 },
];

const STATUSES = [
  { id: 'draft', label: 'Draft', color: '#6b7280' },
  { id: 'sent', label: 'Sent', color: '#3b82f6' },
  { id: 'paid', label: 'Paid', color: '#22c55e' },
  { id: 'overdue', label: 'Overdue', color: '#ef4444' },
];

const TAX_BRACKETS = [
  { min: 0, max: 250000, rate: 0, base: 0 },
  { min: 250001, max: 400000, rate: 0.15, base: 0 },
  { min: 400001, max: 800000, rate: 0.20, base: 22500 },
  { min: 800001, max: 2000000, rate: 0.25, base: 102500 },
  { min: 2000001, max: 8000000, rate: 0.30, base: 402500 },
  { min: 8000001, max: Infinity, rate: 0.35, base: 2202500 },
];

// Helper to render icon - if it's a URL, render as img; otherwise render as text/emoji
const renderIcon = (icon, size = 20, fallback = '🌐') => {
  if (icon && icon.startsWith('http')) {
    return (
      <img 
        src={icon} 
        alt="" 
        style={{ width: size, height: size, objectFit: 'contain' }} 
        onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling && (e.target.nextSibling.style.display = 'inline'); }}
      />
    );
  }
  return <span style={{ fontSize: size }}>{icon || fallback}</span>;
};

const VAKita = ({ user, isDark }) => {
  const theme = getTheme(isDark);
  const { width } = useWindowSize();
  const isMobile = width < 768;
  const isSmall = width < 480;

  const [activeTab, setActiveTab] = useState(() => {
    try { return localStorage.getItem('vakita_tab_' + user?.id) || 'prospecting'; } catch { return 'prospecting'; }
  });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [incomeEntries, setIncomeEntries] = useState([]);
  const [clients, setClients] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [prospects, setProspects] = useState([]);
  const [taxSettings, setTaxSettings] = useState({ taxOption: '8percent', tinNumber: '' });
  const [liveRate, setLiveRate] = useState(null);
  const [lastRateUpdate, setLastRateUpdate] = useState(null);
  const [showRateTooltip, setShowRateTooltip] = useState(false);

  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [showClientForm, setShowClientForm] = useState(false);
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [showProspectForm, setShowProspectForm] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [editingProspect, setEditingProspect] = useState(null);
  const [viewingInvoice, setViewingInvoice] = useState(null);
  const [showOverlap, setShowOverlap] = useState(false);
  const [showOverlapTooltip, setShowOverlapTooltip] = useState(false);
  const [emailModal, setEmailModal] = useState({ show: false, invoice: null });
  const [emailCopied, setEmailCopied] = useState(false);
  const [sendEmailModal, setSendEmailModal] = useState({ show: false, invoice: null, recipientEmail: '' });
  const [paidConfirmModal, setPaidConfirmModal] = useState({ show: false, invoice: null });
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [vakitaProfile, setVakitaProfile] = useState({ 
    name: '', 
    email: '', 
    businessName: '', 
    gmailConnected: false,
    gmailEmail: null,
    useGmail: false 
  });
  const [gmailConnecting, setGmailConnecting] = useState(false);
  const [activities, setActivities] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [deleteModal, setDeleteModal] = useState({ show: false, type: '', id: null, name: '' });
  const notificationRef = useRef(null);

  // Close notifications dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    
    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  const [incomeForm, setIncomeForm] = useState({ clientId: '', amount: '', currency: 'USD', platform: 'wise', date: new Date().toISOString().split('T')[0], description: '' });
  const [clientForm, setClientForm] = useState({ name: '', company: '', email: '', timezone: 'America/New_York', billingType: 'hourly', rate: '', currency: 'USD', paymentPlatform: 'wise', businessHoursStart: 9, businessHoursEnd: 17, status: 'active', color: '#3b82f6' });
  const [invoiceForm, setInvoiceForm] = useState({ clientId: '', invoiceNumber: '', issueDate: new Date().toISOString().split('T')[0], dueDate: '', currency: 'USD', items: [{ description: '', hours: 1, rate: 0 }], status: 'draft' });
  const [prospectForm, setProspectForm] = useState({ name: '', company: '', email: '', source: 'linkedin', status: 'new', notes: '', estimatedValue: '', currency: 'USD', billingType: 'monthly' });
  const [selectedMonth, setSelectedMonth] = useState(() => { const n = new Date(); return n.getFullYear() + '-' + String(n.getMonth()+1).padStart(2,'0'); });

  useEffect(() => { if (user?.id) localStorage.setItem('vakita_tab_' + user.id, activeTab); }, [activeTab, user?.id]);
  useEffect(() => { const t = setInterval(() => setCurrentTime(new Date()), 1000); return () => clearInterval(t); }, []);
  
  // Fetch live USD/PHP exchange rate
  useEffect(() => {
    const fetchRate = async () => {
      try {
        const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await res.json();
        if (data?.rates?.PHP) {
          setLiveRate(data.rates.PHP);
          setLastRateUpdate(new Date());
        }
      } catch (err) { console.log('Could not fetch exchange rate'); }
    };
    fetchRate();
    const interval = setInterval(fetchRate, 300000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, []);

  const [dataLoaded, setDataLoaded] = useState(false);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (!user?.id) return;
    const loadData = async () => {
      setLoading(true);
      console.log('[VAKita] Loading data for user:', user.id);
      try {
        const { data, error } = await supabase.from('user_profiles').select('vakita_clients, vakita_income, vakita_invoices, vakita_tax_settings, vakita_prospects, vakita_profile, vakita_activities, gmail_email, gmail_connected_at').eq('user_id', user.id).single();
        console.log('[VAKita] Loaded data:', data);
        console.log('[VAKita] Load error:', error);
        if (error && error.code !== 'PGRST116') console.error('Error loading VAKita data:', error);
        if (data) {
          console.log('[VAKita] Setting clients:', data.vakita_clients);
          setClients(data.vakita_clients || []);
          setIncomeEntries(data.vakita_income || []);
          setInvoices(data.vakita_invoices || []);
          setProspects(data.vakita_prospects || []);
          setTaxSettings(data.vakita_tax_settings || { taxOption: '8percent', tinNumber: '' });
          
          // Load profile with Gmail status from database
          const savedProfile = data.vakita_profile || { name: '', email: '', businessName: '' };
          setVakitaProfile({
            ...savedProfile,
            gmailConnected: !!data.gmail_connected_at,
            gmailEmail: data.gmail_email || null,
            useGmail: savedProfile.useGmail || false
          });
          
          setActivities(data.vakita_activities || []);
        }
      } catch (err) { console.error('Error loading VAKita data:', err); }
      finally { 
        setLoading(false);
        // Use setTimeout to ensure state updates have propagated before allowing saves
        setTimeout(() => {
          console.log('[VAKita] Enabling saves after initial load');
          isInitialMount.current = false;
          setDataLoaded(true);
        }, 500);
      }
    };
    loadData();
  }, [user?.id]);

  const saveToSupabase = useCallback(async (field, value) => {
    if (!user?.id) {
      console.log('[VAKita] Save blocked - no user id');
      return;
    }
    if (isInitialMount.current) {
      console.log('[VAKita] Save blocked - initial mount for field:', field);
      return;
    }
    console.log('[VAKita] Saving', field, ':', value);
    setSaving(true);
    try { 
      const { error } = await supabase.from('user_profiles').update({ [field]: value }).eq('user_id', user.id); 
      if (error) {
        console.error('[VAKita] Error saving ' + field + ':', error);
      } else {
        console.log('[VAKita] Successfully saved', field);
      }
    }
    catch (err) { console.error('[VAKita] Error saving ' + field + ':', err); }
    finally { setSaving(false); }
  }, [user?.id]);

  // Only save AFTER initial data has been loaded (dataLoaded = true AND isInitialMount = false)
  useEffect(() => { 
    if (!dataLoaded || !user?.id || isInitialMount.current) {
      console.log('[VAKita] Clients save skipped - dataLoaded:', dataLoaded, 'isInitialMount:', isInitialMount.current);
      return;
    }
    console.log('[VAKita] Scheduling clients save:', clients);
    const t = setTimeout(() => saveToSupabase('vakita_clients', clients), 500); 
    return () => clearTimeout(t); 
  }, [clients, dataLoaded, user?.id, saveToSupabase]);
  
  useEffect(() => { if (!dataLoaded || !user?.id || isInitialMount.current) return; const t = setTimeout(() => saveToSupabase('vakita_income', incomeEntries), 500); return () => clearTimeout(t); }, [incomeEntries, dataLoaded, user?.id, saveToSupabase]);
  useEffect(() => { if (!dataLoaded || !user?.id || isInitialMount.current) return; const t = setTimeout(() => saveToSupabase('vakita_invoices', invoices), 500); return () => clearTimeout(t); }, [invoices, dataLoaded, user?.id, saveToSupabase]);
  useEffect(() => { if (!dataLoaded || !user?.id || isInitialMount.current) return; const t = setTimeout(() => saveToSupabase('vakita_prospects', prospects), 500); return () => clearTimeout(t); }, [prospects, dataLoaded, user?.id, saveToSupabase]);
  useEffect(() => { if (!dataLoaded || !user?.id || isInitialMount.current) return; const t = setTimeout(() => saveToSupabase('vakita_tax_settings', taxSettings), 500); return () => clearTimeout(t); }, [taxSettings, dataLoaded, user?.id, saveToSupabase]);
  useEffect(() => { if (!dataLoaded || !user?.id || isInitialMount.current || !vakitaProfile.name) return; const t = setTimeout(() => saveToSupabase('vakita_profile', vakitaProfile), 500); return () => clearTimeout(t); }, [vakitaProfile, dataLoaded, user?.id, saveToSupabase]);
  useEffect(() => { if (!dataLoaded || !user?.id || isInitialMount.current || activities.length === 0) return; const t = setTimeout(() => saveToSupabase('vakita_activities', activities), 500); return () => clearTimeout(t); }, [activities, dataLoaded, user?.id, saveToSupabase]);
  useEffect(() => { if(showInvoiceForm && !editingInvoice) setInvoiceForm(p => ({...p, invoiceNumber: 'INV-' + new Date().getFullYear() + '-' + String(invoices.length+1).padStart(4,'0')})); }, [showInvoiceForm, editingInvoice, invoices.length]);

  const getRate = (c) => CURRENCIES.find(x => x.code === c)?.rate || 1;
  const toPHP = (amt, cur) => amt * getRate(cur);
  const getSymbol = (c) => CURRENCIES.find(x => x.code === c)?.symbol || '$';
  const getTime = (tz) => { try { return currentTime.toLocaleTimeString('en-US', { timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: true }); } catch { return '--:--'; } };
  const getHour = (tz) => { try { return parseInt(currentTime.toLocaleTimeString('en-US', { timeZone: tz, hour: 'numeric', hour12: false })); } catch { return 12; } };
  const getDate = (tz) => { try { return currentTime.toLocaleDateString('en-US', { timeZone: tz, weekday: 'short', month: 'short', day: 'numeric' }); } catch { return '---'; } };
  const getStatus = (tz, s, e) => { const h = getHour(tz); if(h >= s && h < e) return { label: 'Business', color: '#22c55e', icon: Coffee }; if(h >= 6 && h < 22) return { label: 'Available', color: '#f59e0b', icon: Sun }; return { label: 'Sleeping', color: '#6b7280', icon: MoonIcon }; };
  const calcGraduatedTax = (income) => { if (income <= 250000) return 0; for (const b of TAX_BRACKETS) { if (income <= b.max) return b.base + ((income - b.min + 1) * b.rate); } return 0; };

  const monthlyStats = useMemo(() => {
    const [y, m] = selectedMonth.split('-').map(Number);
    const entries = incomeEntries.filter(e => { const d = new Date(e.date); return d.getFullYear() === y && d.getMonth()+1 === m; });
    const byPlatform = {}; let total = 0;
    entries.forEach(e => { const php = toPHP(e.amount, e.currency); total += php; byPlatform[e.platform] = (byPlatform[e.platform] || 0) + php; });
    const pm = m === 1 ? 12 : m-1, py = m === 1 ? y-1 : y;
    const prev = incomeEntries.filter(e => { const d = new Date(e.date); return d.getFullYear() === py && d.getMonth()+1 === pm; }).reduce((s,e) => s + toPHP(e.amount, e.currency), 0);
    return { entries, total, byPlatform, change: prev > 0 ? ((total - prev) / prev * 100) : 0 };
  }, [incomeEntries, selectedMonth]);

  const sixMonthAvg = useMemo(() => {
    const now = new Date(); let total = 0, months = 0;
    for(let i = 0; i < 6; i++) { const d = new Date(now.getFullYear(), now.getMonth()-i, 1); const me = incomeEntries.filter(e => { const ed = new Date(e.date); return ed.getFullYear() === d.getFullYear() && ed.getMonth() === d.getMonth(); }); if(me.length) { total += me.reduce((s, e) => s + toPHP(e.amount, e.currency), 0); months++; } }
    return months ? total / months : 0;
  }, [incomeEntries]);

  const quarterlyTax = useMemo(() => {
    const now = new Date(), q = Math.floor(now.getMonth()/3)+1, qS = (q-1)*3, year = now.getFullYear();
    const yearEntries = incomeEntries.filter(e => new Date(e.date).getFullYear() === year);
    const yearGross = yearEntries.reduce((s, e) => s + toPHP(e.amount, e.currency), 0);
    const qEntries = incomeEntries.filter(e => { const d = new Date(e.date); return d.getFullYear() === year && d.getMonth() >= qS && d.getMonth() < qS+3; });
    const qGross = qEntries.reduce((s, e) => s + toPHP(e.amount, e.currency), 0);
    const projected = (now.getMonth() + 1) > 0 ? (yearGross / (now.getMonth() + 1)) * 12 : 0;
    const tax8 = Math.max(0, qGross - 62500) * 0.08;
    const taxGrad = calcGraduatedTax(projected) / 4;
    const dues = { 1: 'April 15', 2: 'August 15', 3: 'November 15', 4: 'January 15' };
    return { quarter: q, year, qGross, yearGross, projected, tax8, taxGrad, tax: taxSettings.taxOption === '8percent' ? tax8 : taxGrad, due: dues[q], nearVAT: projected > 2500000 };
  }, [incomeEntries, taxSettings.taxOption]);

  const invoiceStats = useMemo(() => ({ total: invoices.length, paid: invoices.filter(i => i.status === 'paid').length, pending: invoices.filter(i => i.status === 'sent').length, overdue: invoices.filter(i => i.status === 'overdue').length, revenue: invoices.filter(i => i.status === 'paid').reduce((s, i) => s + (i.phpTotal || 0), 0), pendingAmt: invoices.filter(i => ['sent','overdue'].includes(i.status)).reduce((s, i) => s + (i.phpTotal || 0), 0) }), [invoices]);
  const prospectStats = useMemo(() => ({ total: prospects.length, active: prospects.filter(p => !['won', 'lost'].includes(p.status)).length, won: prospects.filter(p => p.status === 'won').length, lost: prospects.filter(p => p.status === 'lost').length, winRate: prospects.filter(p => ['won', 'lost'].includes(p.status)).length > 0 ? Math.round((prospects.filter(p => p.status === 'won').length / prospects.filter(p => ['won', 'lost'].includes(p.status)).length) * 100) : 0 }), [prospects]);

  const findOverlap = () => { const active = clients.filter(c => c.status === 'active'); if(active.length < 2) return []; const overlaps = []; for(let h = 0; h < 24; h++) { let ok = true; for(const c of active) { const ch = getHour(c.timezone); const diff = ch - getHour('Asia/Manila'); const test = (h + diff + 24) % 24; if(test < c.businessHoursStart || test >= c.businessHoursEnd) { ok = false; break; } } if(ok) overlaps.push(h); } return overlaps; };
  const formatOverlap = (hrs) => !hrs.length ? 'No overlap' : hrs.map(h => (h%12||12) + (h<12?'AM':'PM')).join(', ');

  const saveIncome = () => { const client = clients.find(c => c.id === incomeForm.clientId); const newEntry = { id: 'inc_' + Date.now(), ...incomeForm, amount: parseFloat(incomeForm.amount) || 0, clientName: client?.name || 'Unknown', phpAmount: toPHP(parseFloat(incomeForm.amount) || 0, incomeForm.currency), createdAt: new Date().toISOString() }; setIncomeEntries(p => [newEntry, ...p]); setShowIncomeForm(false); setIncomeForm({ clientId: '', amount: '', currency: 'USD', platform: 'wise', date: new Date().toISOString().split('T')[0], description: '' }); };
  const saveClient = () => { const client = { id: editingClient?.id || 'client_' + Date.now(), ...clientForm, rate: parseFloat(clientForm.rate) || 0, createdAt: editingClient?.createdAt || new Date().toISOString() }; if(editingClient) setClients(p => p.map(c => c.id === editingClient.id ? client : c)); else setClients(p => [client, ...p]); setShowClientForm(false); setEditingClient(null); setClientForm({ name: '', company: '', email: '', timezone: 'America/New_York', billingType: 'hourly', rate: '', currency: 'USD', paymentPlatform: 'wise', businessHoursStart: 9, businessHoursEnd: 17, status: 'active', color: '#3b82f6' }); };
  const confirmDelete = () => {
    const { type, id } = deleteModal;
    if (type === 'client') { setClients(p => p.filter(c => c.id !== id)); setIncomeEntries(p => p.filter(e => e.clientId !== id)); }
    else if (type === 'invoice') { setInvoices(p => p.filter(i => i.id !== id)); }
    else if (type === 'income') { setIncomeEntries(p => p.filter(e => e.id !== id)); }
    else if (type === 'prospect') { setProspects(p => p.filter(pr => pr.id !== id)); }
    setDeleteModal({ show: false, type: '', id: null, name: '' });
  };
  const saveInvoice = () => { const client = clients.find(c => c.id === invoiceForm.clientId); const total = invoiceForm.items.reduce((s, i) => s + ((i.hours||1) * i.rate), 0); const inv = { id: editingInvoice?.id || 'inv_' + Date.now(), ...invoiceForm, clientName: client?.name || 'Unknown', total, phpTotal: toPHP(total, invoiceForm.currency), createdAt: editingInvoice?.createdAt || new Date().toISOString() }; if(editingInvoice) setInvoices(p => p.map(i => i.id === editingInvoice.id ? inv : i)); else setInvoices(p => [inv, ...p]); setShowInvoiceForm(false); setEditingInvoice(null); setInvoiceForm({ clientId: '', invoiceNumber: '', issueDate: new Date().toISOString().split('T')[0], dueDate: '', currency: 'USD', items: [{ description: '', hours: 1, rate: 0 }], status: 'draft' }); };
  
  // Generate professional invoice email template
  const generateInvoiceEmail = (inv) => {
    const client = clients.find(c => c.id === inv.clientId);
    const clientFirstName = inv.clientName?.split(' ')[0] || 'there';
    const currencySymbol = getSymbol(inv.currency);
    const senderName = vakitaProfile.name || '[Your Name]';
    
    // Build line items description
    const itemsList = inv.items?.map(item => {
      const itemTotal = (item.hours || 1) * item.rate;
      return `• ${item.description || 'Service'}: ${item.hours} hour${item.hours !== 1 ? 's' : ''} × ${currencySymbol}${item.rate} = ${currencySymbol}${formatAmount(itemTotal)}`;
    }).join('\n') || '• Services rendered';
    
    const email = `Subject: Invoice ${inv.invoiceNumber} - ${inv.clientName}

Hi ${clientFirstName},

I hope this message finds you well!

I've prepared the invoice for the work completed. Please find the details below:

Invoice Number: ${inv.invoiceNumber}
Issue Date: ${inv.issueDate}
Due Date: ${inv.dueDate || 'At your earliest convenience'}

Work Summary:
${itemsList}

Total Amount: ${currencySymbol}${formatAmount(inv.total)}

Please let me know if you have any questions about this invoice or if you'd like any additional details about the work completed.

Thank you so much for the opportunity to work with you. I truly appreciate your trust and look forward to continuing our collaboration!

Warm regards,
${senderName}`;
    
    return email;
  };
  
  const copyEmailToClipboard = (email) => {
    navigator.clipboard.writeText(email).then(() => {
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2000);
    });
  };
  
  // Show toast notification
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };
  
  // Add activity to log
  const addActivity = (title, description, type = 'info') => {
    const newActivity = {
      id: 'act_' + Date.now(),
      title,
      description,
      type,
      read: false,
      createdAt: new Date().toISOString()
    };
    setActivities(prev => [newActivity, ...prev].slice(0, 50)); // Keep last 50 activities
  };
  
  // Mark activities as read
  const markActivitiesAsRead = () => {
    setActivities(prev => prev.map(a => ({ ...a, read: true })));
  };
  
  // Get unread activity count
  const unreadCount = activities.filter(a => !a.read).length;
  
  // Open send email modal
  const openSendEmailModal = (inv) => {
    const client = clients.find(c => c.id === inv.clientId);
    setSendEmailModal({ 
      show: true, 
      invoice: inv, 
      recipientEmail: client?.email || '' 
    });
  };
  
  // Send email via Gmail API or mailto fallback
  const sendInvoiceEmail = async () => {
    const inv = sendEmailModal.invoice;
    const recipientEmail = sendEmailModal.recipientEmail;
    
    if (!recipientEmail) {
      showToast('Please enter a recipient email', 'error');
      return;
    }
    
    const emailContent = generateInvoiceEmail(inv);
    
    // Extract subject from email content
    const subjectMatch = emailContent.match(/Subject: (.+)\n/);
    const subject = subjectMatch ? subjectMatch[1] : `Invoice ${inv.invoiceNumber}`;
    
    // Get body (everything after Subject line)
    const body = emailContent.replace(/Subject: .+\n\n/, '');
    
    // Check if Gmail is connected and user wants to use it
    if (vakitaProfile.gmailConnected && vakitaProfile.useGmail) {
      setSendEmailModal(prev => ({ ...prev, sending: true }));
      try {
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/gmail-send`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
          },
          body: JSON.stringify({
            userId: user.id,
            to: recipientEmail,
            subject: subject,
            body: body
          })
        });
        
        const data = await response.json();
        
        if (!response.ok || data.error) {
          throw new Error(data.error || 'Failed to send email');
        }
        
        // Log activity
        addActivity(
          'Invoice Email Sent',
          `Sent ${inv.invoiceNumber} to ${recipientEmail} via Gmail`,
          'email'
        );
        
        showToast(`Email sent successfully to ${recipientEmail}!`, 'success');
        setSendEmailModal({ show: false, invoice: null, recipientEmail: '', sending: false });
        setEmailModal({ show: false, invoice: null });
      } catch (error) {
        console.error('Gmail send error:', error);
        showToast('Failed to send via Gmail. Try again or use email client.', 'error');
        setSendEmailModal(prev => ({ ...prev, sending: false }));
      }
    } else {
      // Fallback to mailto
      const mailtoLink = `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.open(mailtoLink, '_blank');
      
      // Log activity
      addActivity(
        'Invoice Email Drafted',
        `Opened email client for ${inv.invoiceNumber} to ${recipientEmail}`,
        'email'
      );
      
      showToast(`Email client opened for ${inv.invoiceNumber}`);
      setSendEmailModal({ show: false, invoice: null, recipientEmail: '', sending: false });
      setEmailModal({ show: false, invoice: null });
    }
  };
  
  // Connect Gmail account via Supabase Edge Function
  const connectGmail = async () => {
    setGmailConnecting(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/gmail-auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          userId: user.id,
          returnUrl: window.location.origin + '/?section=vakita'
        })
      });
      
      const data = await response.json();
      
      if (data.authUrl) {
        // Redirect to Google OAuth
        window.location.href = data.authUrl;
      } else {
        throw new Error(data.error || 'Failed to get auth URL');
      }
    } catch (error) {
      console.error('Gmail connect error:', error);
      showToast('Failed to connect Gmail. Please try again.', 'error');
      setGmailConnecting(false);
    }
  };
  
  // Disconnect Gmail account
  const disconnectGmail = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/gmail-disconnect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ userId: user.id })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setVakitaProfile(prev => ({
          ...prev,
          gmailConnected: false,
          gmailEmail: null,
          useGmail: false
        }));
        showToast('Gmail disconnected successfully');
      } else {
        throw new Error(data.error || 'Failed to disconnect');
      }
    } catch (error) {
      console.error('Gmail disconnect error:', error);
      showToast('Failed to disconnect Gmail', 'error');
    }
  };
  
  // Check for Gmail callback params on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const gmailConnected = params.get('gmail_connected');
    const gmailEmail = params.get('gmail_email');
    const gmailError = params.get('gmail_error');
    
    if (gmailConnected === 'true' && gmailEmail) {
      setVakitaProfile(prev => ({
        ...prev,
        gmailConnected: true,
        gmailEmail: gmailEmail,
        useGmail: true
      }));
      showToast(`Gmail connected: ${gmailEmail}`, 'success');
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname);
    } else if (gmailError) {
      showToast(`Gmail connection failed: ${gmailError}`, 'error');
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);
  
  // Save VAKita profile
  const saveVakitaProfile = () => {
    addActivity('Profile Updated', 'VAKita profile settings saved', 'settings');
    showToast('Profile saved successfully!');
    setShowProfileModal(false);
  };
  
  // Handle invoice status change - show confirmation for "paid" status
  const handleInvoiceStatusChange = (inv, newStatus) => {
    if (newStatus === 'paid' && inv.status !== 'paid') {
      // Show confirmation modal before marking as paid
      setPaidConfirmModal({ show: true, invoice: inv });
    } else if (inv.status !== 'paid') {
      // Allow status change for non-paid invoices
      setInvoices(p => p.map(i => i.id === inv.id ? {...i, status: newStatus} : i));
    }
  };
  
  // Confirm marking invoice as paid - creates income entry and locks invoice
  const confirmMarkAsPaid = () => {
    const inv = paidConfirmModal.invoice;
    if (!inv) return;
    
    const paidAt = new Date().toISOString();
    const client = clients.find(c => c.id === inv.clientId);
    
    // Update invoice with paid status and timestamp
    setInvoices(p => p.map(i => i.id === inv.id ? {
      ...i, 
      status: 'paid', 
      paidAt: paidAt,
      lockedAt: paidAt
    } : i));
    
    // Create income entry from the paid invoice
    const newIncome = {
      id: 'inc_' + Date.now(),
      clientId: inv.clientId,
      clientName: inv.clientName,
      amount: inv.total,
      currency: inv.currency,
      platform: client?.paymentPlatform || 'wise',
      date: new Date().toISOString().split('T')[0],
      description: `Invoice ${inv.invoiceNumber} - ${inv.items?.map(i => i.description).filter(Boolean).join(', ') || 'Services'}`,
      phpAmount: inv.phpTotal,
      fromInvoice: inv.id,
      createdAt: paidAt
    };
    
    setIncomeEntries(p => [newIncome, ...p]);
    
    // Log activity and show toast
    addActivity('Invoice Paid', `${inv.invoiceNumber} marked as paid - ${getSymbol(inv.currency)}${formatAmount(inv.total)}`, 'payment');
    showToast(`${inv.invoiceNumber} marked as paid!`);
    
    setPaidConfirmModal({ show: false, invoice: null });
  };
  
  const saveProspect = () => { const prospect = { id: editingProspect?.id || 'prospect_' + Date.now(), ...prospectForm, estimatedValue: parseFloat(prospectForm.estimatedValue) || 0, createdAt: editingProspect?.createdAt || new Date().toISOString(), updatedAt: new Date().toISOString() }; if(editingProspect) setProspects(p => p.map(pr => pr.id === editingProspect.id ? prospect : pr)); else setProspects(p => [prospect, ...p]); setShowProspectForm(false); setEditingProspect(null); setProspectForm({ name: '', company: '', email: '', source: 'linkedin', status: 'new', notes: '', estimatedValue: '', currency: 'USD', billingType: 'monthly' }); };
  const convertToClient = (prospect) => { const newClient = { id: 'client_' + Date.now(), name: prospect.name, company: prospect.company || '', email: prospect.email || '', timezone: 'America/New_York', billingType: prospect.billingType || 'hourly', rate: prospect.estimatedValue || 0, currency: prospect.currency || 'USD', paymentPlatform: 'wise', businessHoursStart: 9, businessHoursEnd: 17, status: 'active', color: '#22c55e', createdAt: new Date().toISOString(), fromProspect: prospect.id }; setClients(p => [newClient, ...p]); setProspects(p => p.map(pr => pr.id === prospect.id ? {...pr, status: 'won', updatedAt: new Date().toISOString()} : pr)); setActiveTab('clients'); };
  
  // Handle prospect status change - auto-convert to client when "won"
  const handleProspectStatusChange = (prospect, newStatus) => {
    if (newStatus === 'won') {
      // Auto-convert to client when status changes to won
      const newClient = { 
        id: 'client_' + Date.now(), 
        name: prospect.name, 
        company: prospect.company || '', 
        email: prospect.email || '', 
        timezone: 'America/New_York', 
        billingType: prospect.billingType || 'hourly', 
        rate: prospect.estimatedValue || 0, 
        currency: prospect.currency || 'USD', 
        paymentPlatform: 'wise', 
        businessHoursStart: 9, 
        businessHoursEnd: 17, 
        status: 'active', 
        color: '#22c55e', 
        createdAt: new Date().toISOString(), 
        fromProspect: prospect.id 
      };
      setClients(p => [newClient, ...p]);
      setProspects(p => p.map(pr => pr.id === prospect.id ? {...pr, status: 'won', updatedAt: new Date().toISOString()} : pr));
    } else {
      // Just update the status
      setProspects(p => p.map(pr => pr.id === prospect.id ? {...pr, status: newStatus, updatedAt: new Date().toISOString()} : pr));
    }
  };

  const card = { backgroundColor: theme.cardBg, borderRadius: '12px', border: '1px solid ' + theme.cardBorder, padding: isSmall ? '16px' : '20px' };
  const input = { width: '100%', height: '40px', backgroundColor: theme.inputBg, border: '1px solid ' + theme.inputBorder, borderRadius: '8px', padding: '0 12px', fontSize: '14px', color: theme.text, outline: 'none', boxSizing: 'border-box' };
  const select = { ...input, cursor: 'pointer' };
  const textarea = { ...input, height: '80px', padding: '12px', resize: 'vertical' };
  const btnPrimary = { height: '40px', padding: '0 16px', backgroundColor: '#8b5cf6', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' };
  const btnOutline = { ...btnPrimary, backgroundColor: 'transparent', color: theme.text, border: '1px solid ' + theme.cardBorder };
  const btnGhost = { height: '36px', padding: '0 12px', backgroundColor: 'transparent', color: theme.textMuted, border: 'none', borderRadius: '6px', fontSize: '13px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' };
  const btnSuccess = { ...btnPrimary, backgroundColor: '#22c55e' };
  const tab = (a) => ({ padding: isSmall ? '12px 10px' : '14px 18px', backgroundColor: 'transparent', border: 'none', borderBottom: a ? '2px solid #8b5cf6' : '2px solid transparent', fontSize: isSmall ? '11px' : '15px', fontWeight: '500', color: a ? (isDark ? '#fff' : '#18181b') : theme.textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: isSmall ? '0' : '8px', whiteSpace: 'nowrap', flexShrink: 0, minWidth: isSmall ? '44px' : 'auto' });
  const label = { display: 'block', fontSize: '13px', fontWeight: '500', color: theme.textMuted, marginBottom: '6px' };
  const statusStyle = (s) => { const st = STATUSES.find(x => x.id === s) || STATUSES[0]; return { backgroundColor: isDark ? st.color + '20' : st.color + '15', color: st.color }; };
  const prospectStatusStyle = (s) => { const st = PROSPECT_STATUSES.find(x => x.id === s) || PROSPECT_STATUSES[0]; return { backgroundColor: isDark ? st.color + '20' : st.color + '15', color: st.color }; };

  if (loading) return (<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px', flexDirection: 'column', gap: '16px' }}><Loader2 style={{ width: '32px', height: '32px', color: '#8b5cf6', animation: 'spin 1s linear infinite' }} /><p style={{ fontSize: '14px', color: theme.textMuted }}>Loading VAKita...</p><style>{'@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }'}</style></div>);

  return (
    <>
      <div style={{ backgroundColor: isDark ? '#0a0a0b' : '#ffffff', borderBottom: '1px solid ' + theme.cardBorder, padding: isSmall ? '0 8px' : '0 24px' }}>
        <div style={{ maxWidth: '1600px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: isSmall ? '0' : '0 16px', gap: isSmall ? '4px' : '0' }}>
          {/* Main category tabs - matching Finance Tracker style */}
          <div style={{ display: 'flex', gap: '0', alignItems: 'center', flex: 1, overflow: 'auto', minWidth: 0 }}>
            <button 
              onClick={() => { if (!['prospecting', 'clients', 'invoices', 'dashboard'].includes(activeTab)) setActiveTab('prospecting'); }}
              style={{
                padding: isSmall ? '12px 8px' : '14px 18px',
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: ['prospecting', 'clients', 'invoices', 'dashboard'].includes(activeTab) ? '2px solid ' + (isDark ? '#fafafa' : '#18181b') : '2px solid transparent',
                fontSize: isSmall ? '12px' : '15px',
                fontWeight: '500',
                color: ['prospecting', 'clients', 'invoices', 'dashboard'].includes(activeTab) ? theme.text : theme.textMuted,
                cursor: 'pointer',
                transition: 'color 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}
            >
              {isSmall ? 'Clients' : 'Client Management'}
            </button>
            <button 
              onClick={() => setActiveTab('timezone')} 
              style={{
                padding: isSmall ? '12px 8px' : '14px 18px',
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: activeTab === 'timezone' ? '2px solid ' + (isDark ? '#fafafa' : '#18181b') : '2px solid transparent',
                fontSize: isSmall ? '12px' : '15px',
                fontWeight: '500',
                color: activeTab === 'timezone' ? theme.text : theme.textMuted,
                cursor: 'pointer',
                transition: 'color 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: isSmall ? '4px' : '8px',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}
            >
              <Clock style={{ width: isSmall ? '14px' : '16px', height: isSmall ? '14px' : '16px' }} />
              {isSmall ? 'Time' : 'Timezone Manager'}
            </button>
            <button 
              onClick={() => setActiveTab('tax')} 
              style={{
                padding: isSmall ? '12px 8px' : '14px 18px',
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: activeTab === 'tax' ? '2px solid ' + (isDark ? '#fafafa' : '#18181b') : '2px solid transparent',
                fontSize: isSmall ? '12px' : '15px',
                fontWeight: '500',
                color: activeTab === 'tax' ? theme.text : theme.textMuted,
                cursor: 'pointer',
                transition: 'color 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}
            >
              Tax
            </button>
          </div>
          
          {/* Notification Bell, Profile Settings, Exchange rate + saving indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Notification Bell */}
            <div style={{ position: 'relative' }} ref={notificationRef}>
              <button 
                onClick={() => { setShowNotifications(!showNotifications); if (!showNotifications) markActivitiesAsRead(); }}
                style={{
                  ...btnGhost,
                  width: '36px',
                  height: '36px',
                  padding: 0,
                  position: 'relative'
                }}
                title="Notifications"
              >
                <Bell style={{ width: '18px', height: '18px' }} />
                {unreadCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '4px',
                    right: '4px',
                    width: '16px',
                    height: '16px',
                    backgroundColor: '#ef4444',
                    borderRadius: '50%',
                    fontSize: '10px',
                    fontWeight: '700',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
              {showNotifications && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: isSmall ? '-60px' : 0,
                  width: isSmall ? 'calc(100vw - 32px)' : '320px',
                  maxWidth: '320px',
                  maxHeight: '400px',
                  overflow: 'auto',
                  backgroundColor: theme.cardBg,
                  border: '1px solid ' + theme.cardBorder,
                  borderRadius: '12px',
                  boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.5)' : '0 8px 32px rgba(0,0,0,0.15)',
                  zIndex: 100
                }}>
                  <div style={{ padding: '14px 16px', borderBottom: '1px solid ' + theme.cardBorder }}>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: theme.text }}>Recent Activity</span>
                  </div>
                  {activities.length === 0 ? (
                    <div style={{ padding: '32px 16px', textAlign: 'center' }}>
                      <Bell style={{ width: '32px', height: '32px', color: theme.textMuted, marginBottom: '8px', opacity: 0.5 }} />
                      <p style={{ fontSize: '13px', color: theme.textMuted, margin: 0 }}>No recent activity</p>
                    </div>
                  ) : (
                    <div style={{ padding: '8px' }}>
                      {activities.slice(0, 10).map(act => (
                        <div key={act.id} style={{
                          padding: '10px 12px',
                          borderRadius: '8px',
                          backgroundColor: act.read ? 'transparent' : (isDark ? '#3b82f610' : '#3b82f608'),
                          marginBottom: '4px'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                            <span style={{ 
                              fontSize: '12px', 
                              color: act.type === 'payment' ? '#22c55e' : act.type === 'email' ? '#3b82f6' : '#8b5cf6'
                            }}>
                              {act.type === 'payment' ? '💰' : act.type === 'email' ? '✉️' : '📋'}
                            </span>
                            <span style={{ fontSize: '13px', fontWeight: '500', color: theme.text }}>{act.title}</span>
                          </div>
                          <p style={{ fontSize: '12px', color: theme.textMuted, margin: '0 0 0 22px' }}>{act.description}</p>
                          <p style={{ fontSize: '11px', color: theme.textMuted, margin: '4px 0 0 22px', opacity: 0.7 }}>
                            {new Date(act.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* VAKita Profile Settings Button */}
            <button 
              onClick={() => setShowProfileModal(true)}
              style={{
                ...btnGhost,
                width: '36px',
                height: '36px',
                padding: 0
              }}
              title="VAKita Settings"
            >
              <Settings style={{ width: '18px', height: '18px' }} />
            </button>
            
            {liveRate && !isSmall && (
              <div 
                style={{ position: 'relative', flexShrink: 0 }}
                onMouseEnter={() => setShowRateTooltip(true)}
                onMouseLeave={() => setShowRateTooltip(false)}
              >
                <span style={{ 
                  fontSize: '12px', 
                  color: '#22c55e', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px', 
                  padding: '6px 12px', 
                  backgroundColor: isDark ? '#22c55e15' : '#22c55e10', 
                  borderRadius: '8px', 
                  fontWeight: '600',
                  cursor: 'pointer',
                  border: '1px solid ' + (isDark ? '#22c55e30' : '#22c55e25')
                }}>
                  <span style={{ width: '6px', height: '6px', backgroundColor: '#22c55e', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
                  $1 = ₱{liveRate.toFixed(2)}
                </span>
                {showRateTooltip && (
                  <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    padding: '12px 14px',
                    backgroundColor: theme.cardBg,
                    border: '1px solid ' + theme.cardBorder,
                    borderRadius: '10px',
                    boxShadow: isDark ? '0 4px 16px rgba(0,0,0,0.5)' : '0 4px 16px rgba(0,0,0,0.15)',
                    zIndex: 100,
                    minWidth: '220px',
                    whiteSpace: 'nowrap'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                      <span style={{ width: '8px', height: '8px', backgroundColor: '#22c55e', borderRadius: '50%' }} />
                      <span style={{ fontSize: '14px', fontWeight: '600', color: theme.text }}>Live Exchange Rate</span>
                    </div>
                    <div style={{ fontSize: '13px', color: theme.text, marginBottom: '6px' }}>
                      <span style={{ color: theme.textMuted }}>Rate:</span> $1 USD = ₱{liveRate.toFixed(4)} PHP
                    </div>
                    {lastRateUpdate && (
                      <div style={{ fontSize: '12px', color: theme.textMuted, marginBottom: '10px' }}>
                        <span style={{ fontWeight: '500' }}>Updated:</span> {lastRateUpdate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    )}
                    <div style={{ 
                      fontSize: '11px', 
                      color: theme.textMuted, 
                      paddingTop: '10px', 
                      borderTop: '1px solid ' + theme.cardBorder,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <Info style={{ width: '12px', height: '12px' }} />
                      Source: ExchangeRate-API.com
                    </div>
                  </div>
                )}
                <style>{`
                  @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                  }
                `}</style>
              </div>
            )}
            {saving && <span style={{ fontSize: '12px', color: theme.textMuted, display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}><Loader2 style={{ width: '12px', height: '12px', animation: 'spin 1s linear infinite' }} />{isSmall ? '' : 'Saving...'}</span>}
          </div>
        </div>
      </div>
      
      {/* Sub-tabs for Client Management - matching Finance Tracker sub-tab style */}
      {['prospecting', 'clients', 'invoices', 'dashboard'].includes(activeTab) && (
        <div style={{ 
          backgroundColor: isDark ? '#0a0a0b' : '#ffffff', 
          borderBottom: '1px solid ' + theme.cardBorder, 
          padding: isSmall ? '0 8px' : '0 24px' 
        }}>
          <div style={{ maxWidth: '1600px', margin: '0 auto', padding: isSmall ? '10px 8px' : '12px 16px' }}>
            <div style={{ display: 'flex', gap: isSmall ? '4px' : '6px', backgroundColor: theme.toggleBg || (isDark ? '#18181b' : '#f4f4f5'), borderRadius: '8px', padding: '4px', width: isSmall ? '100%' : 'fit-content', overflow: 'auto' }}>
              <button 
                onClick={() => setActiveTab('prospecting')} 
                style={{
                  padding: isSmall ? '8px 10px' : '8px 14px',
                  backgroundColor: activeTab === 'prospecting' ? (isDark ? '#27272a' : '#ffffff') : 'transparent',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: isSmall ? '12px' : '13px',
                  fontWeight: '500',
                  color: activeTab === 'prospecting' ? theme.text : theme.textMuted,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: isSmall ? '4px' : '6px',
                  boxShadow: activeTab === 'prospecting' ? (isDark ? 'none' : '0 1px 2px rgba(0,0,0,0.05)') : 'none',
                  flex: isSmall ? 1 : 'none',
                  justifyContent: 'center',
                  whiteSpace: 'nowrap'
                }}
              >
                <Target style={{ width: isSmall ? '12px' : '14px', height: isSmall ? '12px' : '14px' }} />
                Leads
              </button>
              <button 
                onClick={() => setActiveTab('clients')} 
                style={{
                  padding: isSmall ? '8px 10px' : '8px 14px',
                  backgroundColor: activeTab === 'clients' ? (isDark ? '#27272a' : '#ffffff') : 'transparent',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: isSmall ? '12px' : '13px',
                  fontWeight: '500',
                  color: activeTab === 'clients' ? theme.text : theme.textMuted,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: isSmall ? '4px' : '6px',
                  boxShadow: activeTab === 'clients' ? (isDark ? 'none' : '0 1px 2px rgba(0,0,0,0.05)') : 'none',
                  flex: isSmall ? 1 : 'none',
                  justifyContent: 'center',
                  whiteSpace: 'nowrap'
                }}
              >
                <Users style={{ width: isSmall ? '12px' : '14px', height: isSmall ? '12px' : '14px' }} />
                Clients
              </button>
              <button 
                onClick={() => setActiveTab('invoices')} 
                style={{
                  padding: isSmall ? '8px 10px' : '8px 14px',
                  backgroundColor: activeTab === 'invoices' ? (isDark ? '#27272a' : '#ffffff') : 'transparent',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: isSmall ? '12px' : '13px',
                  fontWeight: '500',
                  color: activeTab === 'invoices' ? theme.text : theme.textMuted,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: isSmall ? '4px' : '6px',
                  boxShadow: activeTab === 'invoices' ? (isDark ? 'none' : '0 1px 2px rgba(0,0,0,0.05)') : 'none',
                  flex: isSmall ? 1 : 'none',
                  justifyContent: 'center',
                  whiteSpace: 'nowrap'
                }}
              >
                <FileText style={{ width: isSmall ? '12px' : '14px', height: isSmall ? '12px' : '14px' }} />
                {isSmall ? 'Inv.' : 'Invoices'}
              </button>
              <button 
                onClick={() => setActiveTab('dashboard')} 
                style={{
                  padding: isSmall ? '8px 10px' : '8px 14px',
                  backgroundColor: activeTab === 'dashboard' ? (isDark ? '#27272a' : '#ffffff') : 'transparent',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: isSmall ? '12px' : '13px',
                  fontWeight: '500',
                  color: activeTab === 'dashboard' ? theme.text : theme.textMuted,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: isSmall ? '4px' : '6px',
                  boxShadow: activeTab === 'dashboard' ? (isDark ? 'none' : '0 1px 2px rgba(0,0,0,0.05)') : 'none',
                  flex: isSmall ? 1 : 'none',
                  justifyContent: 'center',
                  whiteSpace: 'nowrap'
                }}
              >
                <BarChart3 style={{ width: isSmall ? '12px' : '14px', height: isSmall ? '12px' : '14px' }} />
                Income
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ padding: isSmall ? '12px 8px' : '24px', maxWidth: '1600px', margin: '0 auto' }}>
        {activeTab === 'prospecting' && (
          <div>
            <div style={{display:'grid',gridTemplateColumns:isSmall?'repeat(2,1fr)':'repeat(4,1fr)',gap:isSmall?'8px':'12px',marginBottom:isSmall?'16px':'24px'}}>
              <div style={{...card,padding:isSmall?'12px':'16px',borderLeft:'4px solid #8b5cf6'}}><p style={{fontSize:isSmall?'11px':'12px',color:theme.textMuted,margin:'0 0 4px'}}>Active Leads</p><p style={{fontSize:isSmall?'20px':'24px',fontWeight:'700',color:theme.text,margin:0}}>{prospectStats.active}</p></div>
              <div style={{...card,padding:isSmall?'12px':'16px',borderLeft:'4px solid #22c55e'}}><p style={{fontSize:isSmall?'11px':'12px',color:theme.textMuted,margin:'0 0 4px'}}>Won</p><p style={{fontSize:isSmall?'20px':'24px',fontWeight:'700',color:'#22c55e',margin:0}}>{prospectStats.won}</p></div>
              <div style={{...card,padding:isSmall?'12px':'16px',borderLeft:'4px solid #ef4444'}}><p style={{fontSize:isSmall?'11px':'12px',color:theme.textMuted,margin:'0 0 4px'}}>Lost</p><p style={{fontSize:isSmall?'20px':'24px',fontWeight:'700',color:'#ef4444',margin:0}}>{prospectStats.lost}</p></div>
              <div style={{...card,padding:isSmall?'12px':'16px',borderLeft:'4px solid #f59e0b'}}><p style={{fontSize:isSmall?'11px':'12px',color:theme.textMuted,margin:'0 0 4px'}}>Win Rate</p><p style={{fontSize:isSmall?'20px':'24px',fontWeight:'700',color:'#f59e0b',margin:0}}>{prospectStats.winRate}%</p></div>
            </div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:isSmall?'16px':'24px',flexWrap:'wrap',gap:'12px'}}>
              <div><h2 style={{fontSize:isSmall?'16px':'20px',fontWeight:'600',color:theme.text,margin:0}}>Prospecting Pipeline</h2>{!isSmall && <p style={{fontSize:'14px',color:theme.textMuted,margin:'4px 0 0'}}>Track potential clients from lead to close</p>}</div>
              <button onClick={() => setShowProspectForm(true)} style={{...btnPrimary,height:isSmall?'36px':'40px',padding:isSmall?'0 12px':'0 16px',fontSize:isSmall?'13px':'14px'}}><UserPlus style={{width:isSmall?'16px':'18px',height:isSmall?'16px':'18px'}}/>{isSmall?'Add':'Add Lead'}</button>
            </div>
            {prospects.length === 0 ? (
              <div style={{...card,textAlign:'center',padding:isSmall?'40px 20px':'60px'}}><Target style={{width:isSmall?'36px':'48px',height:isSmall?'36px':'48px',color:theme.textMuted,margin:'0 auto 16px'}}/><p style={{fontSize:isSmall?'14px':'16px',color:theme.text,margin:'0 0 8px'}}>No prospects yet</p><p style={{fontSize:isSmall?'12px':'14px',color:theme.textMuted,margin:'0 0 20px'}}>Start tracking potential clients</p><button onClick={() => setShowProspectForm(true)} style={{...btnPrimary,height:isSmall?'36px':'40px'}}><UserPlus style={{width:'16px',height:'16px'}}/>Add First Lead</button></div>
            ) : (
              <div style={{display:'flex',flexDirection:'column',gap:isSmall?'8px':'12px'}}>
                {prospects.filter(p => !['won', 'lost'].includes(p.status)).map(prospect => {
                  const source = LEAD_SOURCES.find(s => s.id === prospect.source);
                  const status = PROSPECT_STATUSES.find(s => s.id === prospect.status);
                  return (
                    <div key={prospect.id} style={{...card,padding:isSmall?'12px':'16px'}}>
                      <div style={{display:'flex',flexDirection:isSmall?'column':'row',justifyContent:'space-between',alignItems:isSmall?'stretch':'flex-start',gap:'12px'}}>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'8px'}}>
                            <span style={{display:'flex',alignItems:'center',justifyContent:'center',width:isSmall?'28px':'32px',height:isSmall?'28px':'32px',flexShrink:0}}>{renderIcon(source?.icon || '🌐', isSmall?20:24)}</span>
                            <div style={{minWidth:0}}><h3 style={{fontSize:isSmall?'14px':'16px',fontWeight:'600',color:theme.text,margin:0,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{prospect.name}</h3>{prospect.company && <p style={{fontSize:isSmall?'12px':'13px',color:theme.textMuted,margin:'2px 0 0',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{prospect.company}</p>}</div>
                          </div>
                          <div style={{display:'flex',gap:'6px',flexWrap:'wrap',marginBottom:'8px'}}>
                            <span style={{padding:isSmall?'3px 8px':'4px 10px',borderRadius:'12px',fontSize:isSmall?'11px':'12px',fontWeight:'600',...prospectStatusStyle(prospect.status)}}>{status?.icon} {status?.label}</span>
                            <span style={{padding:isSmall?'3px 8px':'4px 10px',borderRadius:'12px',fontSize:isSmall?'11px':'12px',backgroundColor:theme.statBg,color:theme.textMuted}}>{source?.name}</span>
                          </div>
                          {prospect.notes && !isSmall && <p style={{fontSize:'13px',color:theme.textMuted,margin:'8px 0 0',lineHeight:'1.4'}}>{prospect.notes}</p>}
                        </div>
                        <div style={{display:'flex',gap:'8px',alignItems:'center',flexWrap:'wrap',justifyContent:isSmall?'space-between':'flex-end'}}>
                          {prospect.estimatedValue > 0 && <span style={{fontSize:isSmall?'13px':'14px',fontWeight:'600',color:'#22c55e',padding:isSmall?'4px 10px':'6px 12px',backgroundColor:isDark?'#22c55e15':'#22c55e10',borderRadius:'8px'}}>{getSymbol(prospect.currency)}{formatAmount(prospect.estimatedValue)}{prospect.billingType === 'hourly' ? '/hr' : '/mo'}</span>}
                          <div style={{display:'flex',gap:'6px',alignItems:'center'}}>
                            <select value={prospect.status} onChange={(e) => handleProspectStatusChange(prospect, e.target.value)} style={{...select,width:'auto',minWidth:isSmall?'110px':'140px',height:isSmall?'32px':'36px',fontSize:isSmall?'12px':'13px',padding:'0 8px'}}>{PROSPECT_STATUSES.map(s => <option key={s.id} value={s.id}>{s.icon} {s.label}</option>)}</select>
                            {['negotiation', 'proposal', 'meeting'].includes(prospect.status) && !isSmall && <button onClick={() => convertToClient(prospect)} style={{...btnSuccess,height:'36px',padding:'0 12px',fontSize:'13px'}}><CheckCircle style={{width:'14px',height:'14px'}}/>Convert</button>}
                            <button onClick={()=>{setEditingProspect(prospect);setProspectForm({...prospect,estimatedValue:prospect.estimatedValue?.toString()||''});setShowProspectForm(true);}} style={{...btnGhost,width:isSmall?'32px':'36px',height:isSmall?'32px':'36px',padding:0}}><Edit style={{width:'14px',height:'14px'}}/></button>
                            <button onClick={()=>setDeleteModal({show:true,type:'prospect',id:prospect.id,name:prospect.name})} style={{...btnGhost,width:isSmall?'32px':'36px',height:isSmall?'32px':'36px',padding:0,color:'#ef4444'}}><Trash2 style={{width:'14px',height:'14px'}}/></button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {prospects.filter(p => ['won', 'lost'].includes(p.status)).length > 0 && (
                  <><h3 style={{fontSize:'14px',fontWeight:'600',color:theme.textMuted,margin:'24px 0 12px',paddingTop:'16px',borderTop:'1px solid ' + theme.cardBorder}}>Closed ({prospects.filter(p => ['won', 'lost'].includes(p.status)).length})</h3>
                  {prospects.filter(p => ['won', 'lost'].includes(p.status)).map(prospect => { 
                    const source = LEAD_SOURCES.find(s => s.id === prospect.source); 
                    const status = PROSPECT_STATUSES.find(s => s.id === prospect.status); 
                    const alreadyClient = clients.some(c => c.fromProspect === prospect.id);
                    return (
                      <div key={prospect.id} style={{...card,padding:'14px',opacity:0.7}}>
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                          <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
                            <span style={{display:'flex',alignItems:'center',justifyContent:'center',width:'24px',height:'24px'}}>{renderIcon(source?.icon, 18)}</span>
                            <span style={{fontSize:'14px',color:theme.text}}>{prospect.name}</span>
                            <span style={{padding:'3px 8px',borderRadius:'10px',fontSize:'11px',fontWeight:'600',...prospectStatusStyle(prospect.status)}}>{status?.label}</span>
                            {alreadyClient && <span style={{padding:'3px 8px',borderRadius:'10px',fontSize:'11px',fontWeight:'500',backgroundColor:isDark?'#22c55e20':'#22c55e15',color:'#22c55e'}}>✓ Client</span>}
                          </div>
                          <div style={{display:'flex',alignItems:'center',gap:'6px'}}>
                            {prospect.status === 'won' && !alreadyClient && (
                              <button onClick={() => convertToClient(prospect)} style={{...btnSuccess,height:'28px',padding:'0 10px',fontSize:'12px'}}>
                                <UserPlus style={{width:'12px',height:'12px'}}/>Add as Client
                              </button>
                            )}
                            <button onClick={()=>setDeleteModal({show:true,type:'prospect',id:prospect.id,name:prospect.name})} style={{...btnGhost,width:'32px',height:'32px',padding:0,color:'#ef4444'}}><Trash2 style={{width:'14px',height:'14px'}}/></button>
                          </div>
                        </div>
                      </div>
                    ); 
                  })}</>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'clients' && (
          <div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'24px',flexWrap:'wrap',gap:'12px'}}>
              <div><h2 style={{fontSize:'20px',fontWeight:'600',color:theme.text,margin:0}}>Clients</h2><p style={{fontSize:'14px',color:theme.textMuted,margin:'4px 0 0'}}>{clients.filter(c=>c.status==='active').length} active</p></div>
              <button onClick={() => setShowClientForm(true)} style={btnPrimary}><Plus style={{width:'18px',height:'18px'}}/>Add Client</button>
            </div>
            {clients.length === 0 ? (<div style={{...card,textAlign:'center',padding:'60px'}}><Users style={{width:'48px',height:'48px',color:theme.textMuted,margin:'0 auto 16px'}}/><p style={{fontSize:'16px',color:theme.text}}>No clients yet</p><button onClick={() => setShowClientForm(true)} style={{...btnPrimary,marginTop:'16px'}}><Plus style={{width:'16px',height:'16px'}}/>Add Client</button></div>
            ) : (
              <div style={{display:'grid',gridTemplateColumns:isSmall?'1fr':isMobile?'repeat(2,1fr)':'repeat(3,1fr)',gap:'16px'}}>
                {clients.map(c => { const tz = TIMEZONES.find(t=>t.id===c.timezone); const ts = getStatus(c.timezone,c.businessHoursStart,c.businessHoursEnd); const Icon = ts.icon; const income = incomeEntries.filter(e=>e.clientId===c.id).reduce((s,e)=>s+(e.phpAmount||0),0); const pf = PLATFORMS.find(p=>p.id===c.paymentPlatform);
                  return (<div key={c.id} style={{...card,borderLeft:'4px solid ' + c.color,opacity:c.status==='active'?1:0.6}}>
                    <div style={{display:'flex',justifyContent:'space-between',marginBottom:'12px'}}><div><h3 style={{fontSize:'16px',fontWeight:'600',color:theme.text,margin:0}}>{c.name}</h3>{c.company && <p style={{fontSize:'13px',color:theme.textMuted,margin:'2px 0 0'}}>{c.company}</p>}</div><div style={{display:'flex',gap:'4px'}}><button onClick={()=>{setEditingClient(c);setClientForm({...c,rate:c.rate?.toString()||''});setShowClientForm(true);}} style={{...btnGhost,width:'32px',height:'32px',padding:0}}><Edit style={{width:'14px',height:'14px'}}/></button><button onClick={()=>setDeleteModal({show:true,type:'client',id:c.id,name:c.name})} style={{...btnGhost,width:'32px',height:'32px',padding:0,color:'#ef4444'}}><Trash2 style={{width:'14px',height:'14px'}}/></button></div></div>
                    <div style={{display:'flex',alignItems:'center',gap:'8px',padding:'8px 10px',backgroundColor:theme.statBg,borderRadius:'6px',marginBottom:'12px'}}><span style={{fontSize:'18px',lineHeight:1,width:'24px',textAlign:'center',color:theme.text}}>{tz?.flag||'🌐'}</span><div style={{flex:1}}><p style={{fontSize:'13px',fontWeight:'500',color:theme.text,margin:0}}>{getTime(c.timezone)}</p><p style={{fontSize:'11px',color:theme.textMuted,margin:0}}>{tz?.city || 'Unknown'}</p></div><div style={{display:'flex',alignItems:'center',gap:'4px',padding:'4px 8px',backgroundColor:isDark?ts.color+'20':ts.color+'15',borderRadius:'12px'}}><Icon style={{width:'12px',height:'12px',color:ts.color}}/><span style={{fontSize:'11px',fontWeight:'500',color:ts.color}}>{ts.label}</span></div></div>
                    <div style={{display:'flex',gap:'8px',marginBottom:'12px',flexWrap:'wrap'}}><span style={{padding:'6px 10px',backgroundColor:theme.statBg,borderRadius:'6px',fontSize:'12px',color:theme.text}}>{getSymbol(c.currency)}{c.rate}{c.billingType==='hourly'?'/hr':'/mo'}</span><span style={{padding:'6px 10px',backgroundColor:theme.statBg,borderRadius:'6px',fontSize:'12px',color:theme.text,display:'flex',alignItems:'center',gap:'6px'}}>{renderIcon(pf?.icon, 16)} {pf?.name}</span></div>
                    <div style={{paddingTop:'12px',borderTop:'1px solid ' + theme.cardBorder,display:'flex',justifyContent:'space-between'}}><span style={{fontSize:'12px',color:theme.textMuted}}>Lifetime</span><span style={{fontSize:'14px',fontWeight:'600',color:'#22c55e'}}>₱{formatAmount(income)}</span></div>
                  </div>);
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
              <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} style={{ ...select, width: 'auto', minWidth: '180px' }}>{Array.from({length:12}, (_,i) => { const d = new Date(); d.setMonth(d.getMonth()-i); const v = d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0'); return <option key={v} value={v}>{d.toLocaleDateString('en-US', {month:'long',year:'numeric'})}</option>; })}</select>
              <button onClick={() => setShowIncomeForm(true)} style={btnPrimary}><Plus style={{width:'18px',height:'18px'}}/>Record Income</button>
            </div>
            <div style={{...card, marginBottom: '24px', background: isDark ? 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(34,197,94,0.1))' : 'linear-gradient(135deg, rgba(139,92,246,0.05), rgba(34,197,94,0.05))'}}>
              <p style={{fontSize:'14px',color:theme.textMuted,margin:'0 0 4px'}}>Monthly Income</p>
              <div style={{display:'flex',alignItems:'baseline',gap:'12px',flexWrap:'wrap'}}><span style={{fontSize:'36px',fontWeight:'700',color:theme.text}}>₱{formatAmount(monthlyStats.total)}</span>{monthlyStats.change !== 0 && <span style={{fontSize:'14px',fontWeight:'600',color:monthlyStats.change>0?'#22c55e':'#ef4444'}}>{monthlyStats.change>0?'↑':'↓'} {Math.abs(monthlyStats.change).toFixed(1)}%</span>}</div>
              {Object.keys(monthlyStats.byPlatform).length > 0 && (<div style={{display:'flex',gap:'12px',flexWrap:'wrap',marginTop:'16px',paddingTop:'16px',borderTop:'1px solid ' + theme.cardBorder}}>{Object.entries(monthlyStats.byPlatform).map(([p,v]) => { const pf = PLATFORMS.find(x=>x.id===p); return <div key={p} style={{display:'flex',alignItems:'center',gap:'8px',padding:'8px 12px',backgroundColor:isDark?'rgba(255,255,255,0.05)':'rgba(0,0,0,0.03)',borderRadius:'8px'}}><span style={{display:'flex',alignItems:'center',justifyContent:'center',width:'20px',height:'20px'}}>{renderIcon(pf?.icon||'💰', 18)}</span><span style={{fontSize:'13px',color:theme.text}}>{pf?.name}: ₱{formatAmount(v)}</span></div>; })}</div>)}
            </div>
            <div style={{display:'grid',gridTemplateColumns:isSmall?'1fr 1fr':'repeat(4, 1fr)',gap:'12px',marginBottom:'24px'}}>
              <div style={{...card,padding:'16px',borderLeft:'4px solid #8b5cf6'}}><p style={{fontSize:'12px',color:theme.textMuted,margin:'0 0 4px'}}>6-Month Avg</p><p style={{fontSize:'20px',fontWeight:'700',color:theme.text,margin:0}}>₱{formatAmount(sixMonthAvg)}</p></div>
              <div style={{...card,padding:'16px',borderLeft:'4px solid #f59e0b'}}><p style={{fontSize:'12px',color:theme.textMuted,margin:'0 0 4px'}}>Pending</p><p style={{fontSize:'20px',fontWeight:'700',color:theme.text,margin:0}}>₱{formatAmount(invoiceStats.pendingAmt)}</p></div>
              <div style={{...card,padding:'16px',borderLeft:'4px solid #22c55e'}}><p style={{fontSize:'12px',color:theme.textMuted,margin:'0 0 4px'}}>Revenue</p><p style={{fontSize:'20px',fontWeight:'700',color:theme.text,margin:0}}>₱{formatAmount(invoiceStats.revenue)}</p></div>
              <div style={{...card,padding:'16px',borderLeft:'4px solid #ef4444'}}><p style={{fontSize:'12px',color:theme.textMuted,margin:'0 0 4px'}}>Q{quarterlyTax.quarter} Tax</p><p style={{fontSize:'20px',fontWeight:'700',color:theme.text,margin:0}}>₱{formatAmount(quarterlyTax.tax)}</p></div>
            </div>
            <div style={card}><h3 style={{fontSize:'16px',fontWeight:'600',color:theme.text,margin:'0 0 16px'}}>Recent Income</h3>
              {monthlyStats.entries.length === 0 ? (<div style={{textAlign:'center',padding:'40px'}}><Receipt style={{width:'40px',height:'40px',color:theme.textMuted,margin:'0 auto 12px'}}/><p style={{fontSize:'14px',color:theme.textMuted}}>No income this month</p></div>
              ) : (<div style={{display:'flex',flexDirection:'column',gap:'8px'}}>{monthlyStats.entries.slice(0,10).map(e => { const pf = PLATFORMS.find(p=>p.id===e.platform); return (<div key={e.id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px',backgroundColor:theme.statBg,borderRadius:'8px'}}><div style={{display:'flex',alignItems:'center',gap:'12px'}}><span style={{display:'flex',alignItems:'center',justifyContent:'center',width:'28px',height:'28px'}}>{renderIcon(pf?.icon||'💰', 20)}</span><div><p style={{fontSize:'14px',fontWeight:'500',color:theme.text,margin:0}}>{e.clientName}</p><p style={{fontSize:'12px',color:theme.textMuted,margin:0}}>{e.date}</p></div></div><div style={{display:'flex',alignItems:'center',gap:'12px'}}><div style={{textAlign:'right'}}><p style={{fontSize:'14px',fontWeight:'600',color:theme.text,margin:0}}>{getSymbol(e.currency)}{formatAmount(e.amount)}</p><p style={{fontSize:'12px',color:theme.textMuted,margin:0}}>₱{formatAmount(e.phpAmount)}</p></div><button onClick={()=>setDeleteModal({show:true,type:'income',id:e.id,name:e.clientName+' - '+getSymbol(e.currency)+formatAmount(e.amount)})} style={{...btnGhost,width:'32px',height:'32px',padding:0,color:'#ef4444'}}><Trash2 style={{width:'14px',height:'14px'}}/></button></div></div>); })}</div>)}
            </div>
          </div>
        )}

        {activeTab === 'invoices' && (
          <div>
            <div style={{display:'grid',gridTemplateColumns:isSmall?'repeat(2,1fr)':'repeat(5,1fr)',gap:isSmall?'8px':'12px',marginBottom:isSmall?'16px':'24px'}}>
              <div style={{...card,padding:isSmall?'10px':'14px',textAlign:'center'}}><p style={{fontSize:isSmall?'10px':'11px',color:theme.textMuted,margin:'0 0 4px'}}>Total</p><p style={{fontSize:isSmall?'18px':'20px',fontWeight:'700',color:theme.text,margin:0}}>{invoiceStats.total}</p></div>
              <div style={{...card,padding:isSmall?'10px':'14px',textAlign:'center'}}><p style={{fontSize:isSmall?'10px':'11px',color:theme.textMuted,margin:'0 0 4px'}}>Paid</p><p style={{fontSize:isSmall?'18px':'20px',fontWeight:'700',color:'#22c55e',margin:0}}>{invoiceStats.paid}</p></div>
              <div style={{...card,padding:isSmall?'10px':'14px',textAlign:'center'}}><p style={{fontSize:isSmall?'10px':'11px',color:theme.textMuted,margin:'0 0 4px'}}>Pending</p><p style={{fontSize:isSmall?'18px':'20px',fontWeight:'700',color:'#3b82f6',margin:0}}>{invoiceStats.pending}</p></div>
              <div style={{...card,padding:isSmall?'10px':'14px',textAlign:'center'}}><p style={{fontSize:isSmall?'10px':'11px',color:theme.textMuted,margin:'0 0 4px'}}>Overdue</p><p style={{fontSize:isSmall?'18px':'20px',fontWeight:'700',color:'#ef4444',margin:0}}>{invoiceStats.overdue}</p></div>
              <div style={{...card,padding:isSmall?'10px':'14px',textAlign:'center',gridColumn:isSmall?'span 2':'auto'}}><p style={{fontSize:isSmall?'10px':'11px',color:theme.textMuted,margin:'0 0 4px'}}>Revenue</p><p style={{fontSize:isSmall?'18px':'20px',fontWeight:'700',color:theme.text,margin:0}}>₱{formatAmount(invoiceStats.revenue)}</p></div>
            </div>
            <div style={{display:'flex',justifyContent:'flex-end',marginBottom:isSmall?'12px':'20px'}}><button onClick={() => setShowInvoiceForm(true)} style={{...btnPrimary,height:isSmall?'36px':'40px',padding:isSmall?'0 12px':'0 16px',fontSize:isSmall?'13px':'14px'}}><Plus style={{width:isSmall?'16px':'18px',height:isSmall?'16px':'18px'}}/>{isSmall?'New':'New Invoice'}</button></div>
            {invoices.length === 0 ? (<div style={{...card,textAlign:'center',padding:isSmall?'40px 20px':'60px'}}><FileText style={{width:isSmall?'36px':'48px',height:isSmall?'36px':'48px',color:theme.textMuted,margin:'0 auto 16px'}}/><p style={{fontSize:isSmall?'14px':'16px',color:theme.text}}>No invoices yet</p></div>
            ) : (<div style={{display:'flex',flexDirection:'column',gap:isSmall?'8px':'12px'}}>{invoices.map(inv => { const isPaid = inv.status === 'paid'; return (<div key={inv.id} style={{...card,padding:isSmall?'12px':'16px',opacity:isPaid?0.85:1}}>
              <div style={{display:'flex',flexDirection:isSmall?'column':'row',justifyContent:'space-between',alignItems:isSmall?'stretch':'center',gap:isSmall?'10px':'12px'}}>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'4px',flexWrap:'wrap'}}>
                    <span style={{fontSize:isSmall?'13px':'15px',fontWeight:'600',color:theme.text}}>{inv.invoiceNumber}</span>
                    {isPaid ? (
                      <div style={{display:'flex',alignItems:'center',gap:'6px',flexWrap:'wrap'}}>
                        <span style={{padding:isSmall?'3px 8px':'4px 10px',borderRadius:'8px',fontSize:isSmall?'11px':'12px',fontWeight:'600',backgroundColor:'#22c55e20',color:'#22c55e'}}>✓ Paid</span>
                        {inv.paidAt && !isSmall && <span style={{fontSize:'11px',color:theme.textMuted}}>{new Date(inv.paidAt).toLocaleDateString('en-US', {month:'short',day:'numeric'})}</span>}
                      </div>
                    ) : (
                      <select value={inv.status} onChange={(e)=>handleInvoiceStatusChange(inv, e.target.value)} style={{padding:isSmall?'3px 6px':'4px 8px',borderRadius:'8px',fontSize:isSmall?'11px':'12px',fontWeight:'600',border:'none',cursor:'pointer',backgroundColor:STATUSES.find(s=>s.id===inv.status)?.color+'20',color:STATUSES.find(s=>s.id===inv.status)?.color}}>{STATUSES.map(s=><option key={s.id} value={s.id}>{s.label}</option>)}</select>
                    )}
                  </div>
                  <p style={{fontSize:isSmall?'12px':'14px',color:theme.textMuted,margin:0,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{inv.clientName} • Due: {inv.dueDate||'Not set'}</p>
                </div>
                <div style={{display:'flex',alignItems:'center',gap:'8px',justifyContent:isSmall?'space-between':'flex-end'}}>
                  <div style={{textAlign:isSmall?'left':'right'}}>
                    <p style={{fontSize:isSmall?'16px':'18px',fontWeight:'700',color:isPaid?'#22c55e':theme.text,margin:0}}>{getSymbol(inv.currency)}{formatAmount(inv.total)}</p>
                    <p style={{fontSize:isSmall?'11px':'12px',color:theme.textMuted,margin:0}}>₱{formatAmount(inv.phpTotal)}</p>
                  </div>
                  <div style={{display:'flex',gap:'4px'}}>
                    <button onClick={()=>setViewingInvoice(inv)} style={{...btnGhost,width:isSmall?'28px':'32px',height:isSmall?'28px':'32px',padding:0}} title="View"><Eye style={{width:isSmall?'14px':'15px',height:isSmall?'14px':'15px'}}/></button>
                    <button onClick={()=>setEmailModal({show:true,invoice:inv})} style={{...btnGhost,width:isSmall?'28px':'32px',height:isSmall?'28px':'32px',padding:0}} title="Email"><Mail style={{width:isSmall?'14px':'15px',height:isSmall?'14px':'15px'}}/></button>
                    <button onClick={()=>{if(!isPaid){setEditingInvoice(inv);setInvoiceForm({...inv});setShowInvoiceForm(true);}}} style={{...btnGhost,width:isSmall?'28px':'32px',height:isSmall?'28px':'32px',padding:0,opacity:isPaid?0.4:1,cursor:isPaid?'not-allowed':'pointer'}} disabled={isPaid}><Edit style={{width:isSmall?'14px':'15px',height:isSmall?'14px':'15px'}}/></button>
                    <button onClick={()=>{if(!isPaid)setDeleteModal({show:true,type:'invoice',id:inv.id,name:inv.invoiceNumber});}} style={{...btnGhost,width:isSmall?'28px':'32px',height:isSmall?'28px':'32px',padding:0,color:'#ef4444',opacity:isPaid?0.4:1,cursor:isPaid?'not-allowed':'pointer'}} disabled={isPaid}><Trash2 style={{width:isSmall?'14px':'15px',height:isSmall?'14px':'15px'}}/></button>
                  </div>
                </div>
              </div>
            </div>); })}</div>)}
          </div>
        )}

        {activeTab === 'timezone' && (
          <div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'24px',flexWrap:'wrap',gap:'12px'}}>
              <div><h2 style={{fontSize:'20px',fontWeight:'600',color:theme.text,margin:0}}>ClientClock</h2><p style={{fontSize:'14px',color:theme.textMuted,margin:'4px 0 0'}}>Client timezones at a glance</p></div>
              <div style={{ position: 'relative' }}
                onMouseEnter={() => setShowOverlapTooltip(true)}
                onMouseLeave={() => setShowOverlapTooltip(false)}
              >
                <button onClick={()=>setShowOverlap(!showOverlap)} style={{...btnOutline,backgroundColor:showOverlap?(isDark?'#22c55e20':'#22c55e15'):'transparent',borderColor:showOverlap?'#22c55e':theme.cardBorder,color:showOverlap?'#22c55e':theme.text}}><Zap style={{width:'16px',height:'16px'}}/>Find Overlap</button>
                {showOverlapTooltip && !showOverlap && (
                  <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    padding: '12px 14px',
                    backgroundColor: theme.cardBg,
                    border: '1px solid ' + theme.cardBorder,
                    borderRadius: '10px',
                    boxShadow: isDark ? '0 4px 16px rgba(0,0,0,0.5)' : '0 4px 16px rgba(0,0,0,0.15)',
                    zIndex: 100,
                    width: '280px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <Zap style={{ width: '16px', height: '16px', color: '#22c55e' }} />
                      <span style={{ fontSize: '14px', fontWeight: '600', color: theme.text }}>Find Overlap</span>
                    </div>
                    <p style={{ fontSize: '13px', color: theme.textMuted, margin: 0, lineHeight: '1.5' }}>
                      Calculates the best meeting times when all your active clients are within their business hours. Shows overlapping hours in your local timezone (Philippines).
                    </p>
                    <p style={{ fontSize: '12px', color: theme.textMuted, margin: '8px 0 0', fontStyle: 'italic' }}>
                      💡 Requires at least 2 active clients to work.
                    </p>
                  </div>
                )}
              </div>
            </div>
            {showOverlap && clients.filter(c=>c.status==='active').length >= 2 && (<div style={{...card,marginBottom:'24px',background:isDark?'linear-gradient(135deg, rgba(34,197,94,0.1), rgba(34,197,94,0.05))':'linear-gradient(135deg, rgba(34,197,94,0.08), rgba(34,197,94,0.02))',border:'1px solid #22c55e40'}}><div style={{display:'flex',alignItems:'center',gap:'12px'}}><div style={{width:'40px',height:'40px',backgroundColor:'#22c55e20',borderRadius:'10px',display:'flex',alignItems:'center',justifyContent:'center'}}><Zap style={{width:'20px',height:'20px',color:'#22c55e'}}/></div><div><p style={{fontSize:'14px',fontWeight:'600',color:theme.text,margin:0}}>Best Meeting Times (Your Time)</p><p style={{fontSize:'16px',fontWeight:'700',color:'#22c55e',margin:'4px 0 0'}}>{formatOverlap(findOverlap())}</p></div></div></div>)}
            {clients.length === 0 ? (<div style={{...card,textAlign:'center',padding:'60px'}}><Clock style={{width:'48px',height:'48px',color:theme.textMuted,margin:'0 auto 16px'}}/><p style={{fontSize:'16px',color:theme.text}}>No clients yet</p></div>
            ) : (<div style={{display:'grid',gridTemplateColumns:isSmall?'1fr':'repeat(auto-fill, minmax(280px, 1fr))',gap:'16px'}}>{clients.filter(c=>c.status==='active').map(c => { const tz = TIMEZONES.find(t=>t.id===c.timezone); const ts = getStatus(c.timezone,c.businessHoursStart,c.businessHoursEnd); const Icon = ts.icon; return (<div key={c.id} style={{...card,borderLeft:'4px solid ' + c.color}}><div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'16px'}}><div><h3 style={{fontSize:'16px',fontWeight:'600',color:theme.text,margin:0}}>{c.name}</h3><p style={{fontSize:'13px',color:theme.textMuted,margin:'2px 0 0'}}>{tz?.city || c.timezone}</p></div><span style={{fontSize:'24px',color:theme.text}}>{tz?.flag||'🌐'}</span></div><div style={{textAlign:'center',padding:'20px 0',borderTop:'1px solid ' + theme.cardBorder,borderBottom:'1px solid ' + theme.cardBorder,marginBottom:'16px'}}><p style={{fontSize:'42px',fontWeight:'700',color:theme.text,margin:0,fontVariantNumeric:'tabular-nums'}}>{getTime(c.timezone)}</p><p style={{fontSize:'14px',color:theme.textMuted,margin:'4px 0 0'}}>{getDate(c.timezone)}</p></div><div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><div style={{display:'flex',alignItems:'center',gap:'6px',padding:'6px 12px',backgroundColor:isDark?ts.color+'20':ts.color+'15',borderRadius:'20px'}}><Icon style={{width:'14px',height:'14px',color:ts.color}}/><span style={{fontSize:'13px',fontWeight:'500',color:ts.color}}>{ts.label}</span></div><span style={{fontSize:'12px',color:theme.textMuted}}>{c.businessHoursStart}:00 - {c.businessHoursEnd}:00</span></div></div>); })}</div>)}
          </div>
        )}

        {activeTab === 'tax' && (
          <div>
            <div style={{marginBottom:'24px'}}><h2 style={{fontSize:'20px',fontWeight:'600',color:theme.text,margin:0}}>BIR Tax Helper</h2><p style={{fontSize:'14px',color:theme.textMuted,margin:'4px 0 0'}}>Quarterly tax calculator for Filipino freelancers</p></div>
            <div style={{...card,marginBottom:'24px',background:isDark?'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(59,130,246,0.05))':'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(59,130,246,0.02))',border:'1px solid #3b82f640'}}><div style={{display:'flex',gap:'12px'}}><Info style={{width:'20px',height:'20px',color:'#3b82f6',flexShrink:0,marginTop:'2px'}}/><div><p style={{fontSize:'14px',fontWeight:'600',color:theme.text,margin:'0 0 8px'}}>How this works</p><ul style={{fontSize:'13px',color:theme.textMuted,margin:0,paddingLeft:'16px',lineHeight:'1.6'}}><li><strong>TIN Number:</strong> Store your Tax ID for easy reference when filing</li><li><strong>8% Flat Rate:</strong> Pay 8% on gross income above ₱250K/year. Best if you have few expenses</li><li><strong>Graduated Rates:</strong> Tax brackets from 0-35%. Better if you have deductible expenses</li><li>Select the option you registered with BIR</li></ul></div></div></div>
            <div style={{...card,marginBottom:'24px'}}><h3 style={{fontSize:'16px',fontWeight:'600',color:theme.text,margin:'0 0 16px'}}>Tax Settings</h3><div style={{display:'grid',gridTemplateColumns:isSmall?'1fr':'1fr 1fr',gap:'16px'}}><div><label style={label}>TIN Number</label><input type="text" placeholder="XXX-XXX-XXX-XXX" value={taxSettings.tinNumber} onChange={(e) => setTaxSettings(p => ({...p, tinNumber: e.target.value}))} style={input}/></div><div><label style={label}>Tax Option</label><div style={{display:'flex',gap:'8px'}}><button onClick={() => setTaxSettings(p => ({...p, taxOption: '8percent'}))} style={{...btnOutline,flex:1,backgroundColor:taxSettings.taxOption==='8percent'?'#8b5cf6':'transparent',color:taxSettings.taxOption==='8percent'?'#fff':theme.text,borderColor:taxSettings.taxOption==='8percent'?'#8b5cf6':theme.cardBorder}}>8% Flat</button><button onClick={() => setTaxSettings(p => ({...p, taxOption: 'graduated'}))} style={{...btnOutline,flex:1,backgroundColor:taxSettings.taxOption==='graduated'?'#8b5cf6':'transparent',color:taxSettings.taxOption==='graduated'?'#fff':theme.text,borderColor:taxSettings.taxOption==='graduated'?'#8b5cf6':theme.cardBorder}}>Graduated</button></div></div></div></div>
            <div style={{display:'grid',gridTemplateColumns:isSmall?'1fr':'repeat(2, 1fr)',gap:'16px',marginBottom:'24px'}}>
              <div style={{...card,background:isDark?'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(139,92,246,0.05))':'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(139,92,246,0.02))'}}><p style={{fontSize:'14px',color:theme.textMuted,margin:'0 0 8px'}}>Q{quarterlyTax.quarter} {quarterlyTax.year} Gross</p><p style={{fontSize:'32px',fontWeight:'700',color:theme.text,margin:'0 0 8px'}}>₱{formatAmount(quarterlyTax.qGross)}</p><p style={{fontSize:'13px',color:theme.textMuted}}>YTD: ₱{formatAmount(quarterlyTax.yearGross)}</p></div>
              <div style={{...card,background:isDark?'linear-gradient(135deg, rgba(239,68,68,0.1), rgba(239,68,68,0.05))':'linear-gradient(135deg, rgba(239,68,68,0.08), rgba(239,68,68,0.02))'}}><p style={{fontSize:'14px',color:theme.textMuted,margin:'0 0 8px'}}>Est. Tax Due ({taxSettings.taxOption === '8percent' ? '8%' : 'Grad'})</p><p style={{fontSize:'32px',fontWeight:'700',color:'#ef4444',margin:'0 0 8px'}}>₱{formatAmount(quarterlyTax.tax)}</p><p style={{fontSize:'13px',color:theme.textMuted}}>Due: {quarterlyTax.due}</p></div>
            </div>
            <div style={{...card,marginBottom:'24px'}}><h3 style={{fontSize:'16px',fontWeight:'600',color:theme.text,margin:'0 0 16px'}}>Tax Comparison</h3><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px'}}><div style={{padding:'16px',backgroundColor:taxSettings.taxOption==='8percent'?(isDark?'#8b5cf615':'#8b5cf610'):theme.statBg,borderRadius:'8px',border:taxSettings.taxOption==='8percent'?'2px solid #8b5cf6':'1px solid ' + theme.cardBorder}}><p style={{fontSize:'13px',fontWeight:'600',color:taxSettings.taxOption==='8percent'?'#8b5cf6':theme.textMuted,margin:'0 0 8px'}}>8% Flat Rate {taxSettings.taxOption==='8percent'&&'✓'}</p><p style={{fontSize:'24px',fontWeight:'700',color:theme.text,margin:0}}>₱{formatAmount(quarterlyTax.tax8)}</p></div><div style={{padding:'16px',backgroundColor:taxSettings.taxOption==='graduated'?(isDark?'#8b5cf615':'#8b5cf610'):theme.statBg,borderRadius:'8px',border:taxSettings.taxOption==='graduated'?'2px solid #8b5cf6':'1px solid ' + theme.cardBorder}}><p style={{fontSize:'13px',fontWeight:'600',color:taxSettings.taxOption==='graduated'?'#8b5cf6':theme.textMuted,margin:'0 0 8px'}}>Graduated {taxSettings.taxOption==='graduated'&&'✓'}</p><p style={{fontSize:'24px',fontWeight:'700',color:theme.text,margin:0}}>₱{formatAmount(quarterlyTax.taxGrad)}</p></div></div></div>
            
            {/* BIR Policy Source Links */}
            <div style={{...card,background:isDark?'linear-gradient(135deg, rgba(34,197,94,0.1), rgba(34,197,94,0.05))':'linear-gradient(135deg, rgba(34,197,94,0.08), rgba(34,197,94,0.02))',border:'1px solid #22c55e40'}}>
              <h3 style={{fontSize:'16px',fontWeight:'600',color:theme.text,margin:'0 0 16px',display:'flex',alignItems:'center',gap:'8px'}}>
                <FileText style={{width:'18px',height:'18px',color:'#22c55e'}}/>
                BIR Policy References
              </h3>
              <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
                <a 
                  href="https://www.bir.gov.ph/income-tax" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{
                    display:'flex',
                    alignItems:'center',
                    gap:'10px',
                    padding:'12px 16px',
                    backgroundColor:isDark?'rgba(255,255,255,0.05)':'rgba(0,0,0,0.03)',
                    borderRadius:'8px',
                    textDecoration:'none',
                    color:theme.text,
                    border:'1px solid ' + theme.cardBorder,
                    transition:'all 0.2s'
                  }}
                >
                  <span style={{fontSize:'20px'}}>🏛️</span>
                  <div style={{flex:1}}>
                    <p style={{fontSize:'14px',fontWeight:'500',margin:0,color:theme.text}}>BIR Income Tax Information</p>
                    <p style={{fontSize:'12px',color:theme.textMuted,margin:'2px 0 0'}}>Official BIR page on income tax forms and requirements</p>
                  </div>
                  <span style={{fontSize:'14px',color:'#22c55e'}}>↗</span>
                </a>
                <a 
                  href="https://www.bir.gov.ph/bir-forms?tab=Income+Tax+Return" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{
                    display:'flex',
                    alignItems:'center',
                    gap:'10px',
                    padding:'12px 16px',
                    backgroundColor:isDark?'rgba(255,255,255,0.05)':'rgba(0,0,0,0.03)',
                    borderRadius:'8px',
                    textDecoration:'none',
                    color:theme.text,
                    border:'1px solid ' + theme.cardBorder,
                    transition:'all 0.2s'
                  }}
                >
                  <span style={{fontSize:'20px'}}>📝</span>
                  <div style={{flex:1}}>
                    <p style={{fontSize:'14px',fontWeight:'500',margin:0,color:theme.text}}>BIR Forms - Income Tax Returns</p>
                    <p style={{fontSize:'12px',color:theme.textMuted,margin:'2px 0 0'}}>Download Form 1701Q, 1701A, and other tax forms</p>
                  </div>
                  <span style={{fontSize:'14px',color:'#22c55e'}}>↗</span>
                </a>
                <a 
                  href="https://www.bir.gov.ph" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{
                    display:'flex',
                    alignItems:'center',
                    gap:'10px',
                    padding:'12px 16px',
                    backgroundColor:isDark?'rgba(255,255,255,0.05)':'rgba(0,0,0,0.03)',
                    borderRadius:'8px',
                    textDecoration:'none',
                    color:theme.text,
                    border:'1px solid ' + theme.cardBorder,
                    transition:'all 0.2s'
                  }}
                >
                  <span style={{fontSize:'20px'}}>🌐</span>
                  <div style={{flex:1}}>
                    <p style={{fontSize:'14px',fontWeight:'500',margin:0,color:theme.text}}>BIR Official Website</p>
                    <p style={{fontSize:'12px',color:theme.textMuted,margin:'2px 0 0'}}>Bureau of Internal Revenue main portal</p>
                  </div>
                  <span style={{fontSize:'14px',color:'#22c55e'}}>↗</span>
                </a>
                <a 
                  href="https://efps.bir.gov.ph" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{
                    display:'flex',
                    alignItems:'center',
                    gap:'10px',
                    padding:'12px 16px',
                    backgroundColor:isDark?'rgba(255,255,255,0.05)':'rgba(0,0,0,0.03)',
                    borderRadius:'8px',
                    textDecoration:'none',
                    color:theme.text,
                    border:'1px solid ' + theme.cardBorder,
                    transition:'all 0.2s'
                  }}
                >
                  <span style={{fontSize:'20px'}}>💻</span>
                  <div style={{flex:1}}>
                    <p style={{fontSize:'14px',fontWeight:'500',margin:0,color:theme.text}}>eFPS - Electronic Filing & Payment</p>
                    <p style={{fontSize:'12px',color:theme.textMuted,margin:'2px 0 0'}}>File and pay taxes online through BIR's eFPS</p>
                  </div>
                  <span style={{fontSize:'14px',color:'#22c55e'}}>↗</span>
                </a>
              </div>
              <p style={{fontSize:'11px',color:theme.textMuted,margin:'16px 0 0',fontStyle:'italic'}}>
                💡 Tip: Always consult with a registered tax professional for personalized advice. These calculations are estimates only.
              </p>
            </div>
          </div>
        )}
      </div>

      {showProspectForm && (<div style={{position:'fixed',inset:0,backgroundColor:'rgba(0,0,0,0.6)',display:'flex',alignItems:'center',justifyContent:'center',padding:'16px',zIndex:50}} onClick={()=>{setShowProspectForm(false);setEditingProspect(null);}}><div style={{width:'100%',maxWidth:'500px',backgroundColor:theme.cardBg,borderRadius:'12px',border:'1px solid ' + theme.cardBorder,maxHeight:'90vh',overflow:'auto'}} onClick={e=>e.stopPropagation()}><div style={{padding:'20px',borderBottom:'1px solid ' + theme.cardBorder,display:'flex',justifyContent:'space-between',alignItems:'center'}}><h3 style={{fontSize:'18px',fontWeight:'600',color:theme.text,margin:0}}>{editingProspect?'Edit':'Add'} Prospect</h3><button onClick={()=>{setShowProspectForm(false);setEditingProspect(null);}} style={{...btnGhost,width:'36px',height:'36px',padding:0}}><X style={{width:'18px',height:'18px'}}/></button></div><div style={{padding:'20px',display:'flex',flexDirection:'column',gap:'16px'}}><div><label style={label}>Name *</label><input type="text" placeholder="John Smith" value={prospectForm.name} onChange={e=>setProspectForm(p=>({...p,name:e.target.value}))} style={input}/></div><div><label style={label}>Company</label><input type="text" placeholder="Acme Inc" value={prospectForm.company} onChange={e=>setProspectForm(p=>({...p,company:e.target.value}))} style={input}/></div><div><label style={label}>Email</label><input type="email" placeholder="john@acme.com" value={prospectForm.email} onChange={e=>setProspectForm(p=>({...p,email:e.target.value}))} style={input}/></div><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'}}><div><label style={label}>Source</label><select value={prospectForm.source} onChange={e=>setProspectForm(p=>({...p,source:e.target.value}))} style={select}>{LEAD_SOURCES.map(s=><option key={s.id} value={s.id}>{s.emoji} {s.name}</option>)}</select></div><div><label style={label}>Status</label><select value={prospectForm.status} onChange={e=>setProspectForm(p=>({...p,status:e.target.value}))} style={select}>{PROSPECT_STATUSES.map(s=><option key={s.id} value={s.id}>{s.icon} {s.label}</option>)}</select></div></div><div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'12px'}}><div><label style={label}>Est. Rate</label><input type="number" placeholder="0" value={prospectForm.estimatedValue} onChange={e=>setProspectForm(p=>({...p,estimatedValue:e.target.value}))} style={input}/></div><div><label style={label}>Type</label><select value={prospectForm.billingType || 'monthly'} onChange={e=>setProspectForm(p=>({...p,billingType:e.target.value}))} style={select}><option value="hourly">Hourly</option><option value="monthly">Monthly</option></select></div><div><label style={label}>Currency</label><select value={prospectForm.currency} onChange={e=>setProspectForm(p=>({...p,currency:e.target.value}))} style={select}>{CURRENCIES.map(c=><option key={c.code} value={c.code}>{c.symbol} {c.code}</option>)}</select></div></div><div><label style={label}>Notes</label><textarea placeholder="Details about this lead..." value={prospectForm.notes} onChange={e=>setProspectForm(p=>({...p,notes:e.target.value}))} style={textarea}/></div></div><div style={{padding:'20px',borderTop:'1px solid ' + theme.cardBorder,display:'flex',gap:'12px',justifyContent:'flex-end'}}><button onClick={()=>{setShowProspectForm(false);setEditingProspect(null);}} style={btnOutline}>Cancel</button><button onClick={saveProspect} disabled={!prospectForm.name} style={{...btnPrimary,opacity:prospectForm.name?1:0.5}}>{editingProspect?'Update':'Add'} Prospect</button></div></div></div>)}

      {showIncomeForm && (<div style={{position:'fixed',inset:0,backgroundColor:'rgba(0,0,0,0.6)',display:'flex',alignItems:'center',justifyContent:'center',padding:'16px',zIndex:50}} onClick={()=>setShowIncomeForm(false)}><div style={{width:'100%',maxWidth:'450px',backgroundColor:theme.cardBg,borderRadius:'12px',border:'1px solid ' + theme.cardBorder,maxHeight:'90vh',overflow:'auto'}} onClick={e=>e.stopPropagation()}><div style={{padding:'20px',borderBottom:'1px solid ' + theme.cardBorder,display:'flex',justifyContent:'space-between',alignItems:'center'}}><h3 style={{fontSize:'18px',fontWeight:'600',color:theme.text,margin:0}}>Record Income</h3><button onClick={()=>setShowIncomeForm(false)} style={{...btnGhost,width:'36px',height:'36px',padding:0}}><X style={{width:'18px',height:'18px'}}/></button></div><div style={{padding:'20px',display:'flex',flexDirection:'column',gap:'16px'}}><div><label style={label}>Client</label><select value={incomeForm.clientId} onChange={e=>setIncomeForm(p=>({...p,clientId:e.target.value}))} style={select}><option value="">Select client</option>{clients.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></div><div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:'12px'}}><div><label style={label}>Amount</label><input type="number" placeholder="0" value={incomeForm.amount} onChange={e=>setIncomeForm(p=>({...p,amount:e.target.value}))} style={input}/></div><div><label style={label}>Currency</label><select value={incomeForm.currency} onChange={e=>setIncomeForm(p=>({...p,currency:e.target.value}))} style={select}>{CURRENCIES.map(c=><option key={c.code} value={c.code}>{c.code}</option>)}</select></div></div><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'}}><div><label style={label}>Platform</label><select value={incomeForm.platform} onChange={e=>setIncomeForm(p=>({...p,platform:e.target.value}))} style={select}>{PLATFORMS.map(p=><option key={p.id} value={p.id}>{p.emoji} {p.name}</option>)}</select></div><div><label style={label}>Date</label><input type="date" value={incomeForm.date} onChange={e=>setIncomeForm(p=>({...p,date:e.target.value}))} style={input}/></div></div>{incomeForm.amount && <div style={{padding:'12px',backgroundColor:theme.statBg,borderRadius:'8px',textAlign:'center'}}><p style={{fontSize:'13px',color:theme.textMuted,margin:'0 0 4px'}}>PHP Equivalent</p><p style={{fontSize:'20px',fontWeight:'700',color:'#22c55e',margin:0}}>₱{formatAmount(toPHP(parseFloat(incomeForm.amount)||0,incomeForm.currency))}</p></div>}</div><div style={{padding:'20px',borderTop:'1px solid ' + theme.cardBorder,display:'flex',gap:'12px',justifyContent:'flex-end'}}><button onClick={()=>setShowIncomeForm(false)} style={btnOutline}>Cancel</button><button onClick={saveIncome} disabled={!incomeForm.clientId||!incomeForm.amount} style={{...btnPrimary,opacity:(incomeForm.clientId&&incomeForm.amount)?1:0.5}}>Save Income</button></div></div></div>)}

      {showClientForm && (<div style={{position:'fixed',inset:0,backgroundColor:'rgba(0,0,0,0.6)',display:'flex',alignItems:isSmall?'flex-end':'center',justifyContent:'center',padding:isSmall?'0':'16px',zIndex:50}} onClick={()=>{setShowClientForm(false);setEditingClient(null);}}><div style={{width:'100%',maxWidth:'500px',backgroundColor:theme.cardBg,borderRadius:isSmall?'16px 16px 0 0':'12px',border:'1px solid ' + theme.cardBorder,maxHeight:isSmall?'85vh':'90vh',overflow:'auto'}} onClick={e=>e.stopPropagation()}><div style={{padding:isSmall?'16px':'20px',borderBottom:'1px solid ' + theme.cardBorder,display:'flex',justifyContent:'space-between',alignItems:'center',position:'sticky',top:0,backgroundColor:theme.cardBg,zIndex:1}}><h3 style={{fontSize:isSmall?'16px':'18px',fontWeight:'600',color:theme.text,margin:0}}>{editingClient?'Edit':'Add'} Client</h3><button onClick={()=>{setShowClientForm(false);setEditingClient(null);}} style={{...btnGhost,width:'36px',height:'36px',padding:0}}><X style={{width:'18px',height:'18px'}}/></button></div><div style={{padding:isSmall?'16px':'20px',display:'flex',flexDirection:'column',gap:isSmall?'12px':'16px'}}><div style={{display:'grid',gridTemplateColumns:'1fr auto',gap:'12px'}}><div><label style={label}>Name *</label><input type="text" placeholder="Client name" value={clientForm.name} onChange={e=>setClientForm(p=>({...p,name:e.target.value}))} style={input}/></div><div><label style={label}>Color</label><input type="color" value={clientForm.color} onChange={e=>setClientForm(p=>({...p,color:e.target.value}))} style={{...input,width:'50px',padding:'4px',cursor:'pointer'}}/></div></div><div><label style={label}>Company</label><input type="text" placeholder="Company name" value={clientForm.company} onChange={e=>setClientForm(p=>({...p,company:e.target.value}))} style={input}/></div><div><label style={label}>Email</label><input type="email" placeholder="client@company.com" value={clientForm.email} onChange={e=>setClientForm(p=>({...p,email:e.target.value}))} style={input}/></div><div style={{display:'grid',gridTemplateColumns:isSmall?'1fr':'1fr 1fr',gap:'12px'}}><div><label style={label}>Timezone</label><select value={clientForm.timezone} onChange={e=>setClientForm(p=>({...p,timezone:e.target.value}))} style={select}>{TIMEZONES.map(t=><option key={t.id} value={t.id}>{t.flag} {t.city}</option>)}</select></div><div><label style={label}>Status</label><select value={clientForm.status} onChange={e=>setClientForm(p=>({...p,status:e.target.value}))} style={select}><option value="active">Active</option><option value="inactive">Inactive</option></select></div></div><div style={{display:'grid',gridTemplateColumns:isSmall?'1fr 1fr':'1fr 1fr 1fr',gap:'12px'}}><div><label style={label}>Rate</label><input type="number" placeholder="0" value={clientForm.rate} onChange={e=>setClientForm(p=>({...p,rate:e.target.value}))} style={input}/></div><div><label style={label}>Type</label><select value={clientForm.billingType} onChange={e=>setClientForm(p=>({...p,billingType:e.target.value}))} style={select}><option value="hourly">Hourly</option><option value="monthly">Monthly</option></select></div><div style={{gridColumn:isSmall?'span 2':'auto'}}><label style={label}>Currency</label><select value={clientForm.currency} onChange={e=>setClientForm(p=>({...p,currency:e.target.value}))} style={select}>{CURRENCIES.map(c=><option key={c.code} value={c.code}>{c.code}</option>)}</select></div></div><div><label style={label}>Payment Platform</label><select value={clientForm.paymentPlatform} onChange={e=>setClientForm(p=>({...p,paymentPlatform:e.target.value}))} style={select}>{PLATFORMS.map(p=><option key={p.id} value={p.id}>{p.emoji} {p.name}</option>)}</select></div><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'}}><div><label style={label}>Hours Start</label><select value={clientForm.businessHoursStart} onChange={e=>setClientForm(p=>({...p,businessHoursStart:parseInt(e.target.value)}))} style={select}>{Array.from({length:24},(_,i)=><option key={i} value={i}>{i}:00</option>)}</select></div><div><label style={label}>Hours End</label><select value={clientForm.businessHoursEnd} onChange={e=>setClientForm(p=>({...p,businessHoursEnd:parseInt(e.target.value)}))} style={select}>{Array.from({length:24},(_,i)=><option key={i} value={i}>{i}:00</option>)}</select></div></div></div><div style={{padding:isSmall?'16px':'20px',borderTop:'1px solid ' + theme.cardBorder,display:'flex',gap:'12px',justifyContent:'flex-end',position:'sticky',bottom:0,backgroundColor:theme.cardBg}}><button onClick={()=>{setShowClientForm(false);setEditingClient(null);}} style={btnOutline}>Cancel</button><button onClick={saveClient} disabled={!clientForm.name} style={{...btnPrimary,opacity:clientForm.name?1:0.5}}>{editingClient?'Update':'Add'} Client</button></div></div></div>)}

      {showInvoiceForm && (<div style={{position:'fixed',inset:0,backgroundColor:'rgba(0,0,0,0.6)',display:'flex',alignItems:isSmall?'flex-end':'center',justifyContent:'center',padding:isSmall?'0':'16px',zIndex:50}} onClick={()=>{setShowInvoiceForm(false);setEditingInvoice(null);}}><div style={{width:'100%',maxWidth:'600px',backgroundColor:theme.cardBg,borderRadius:isSmall?'16px 16px 0 0':'12px',border:'1px solid ' + theme.cardBorder,maxHeight:isSmall?'90vh':'90vh',overflow:'auto'}} onClick={e=>e.stopPropagation()}><div style={{padding:isSmall?'16px':'20px',borderBottom:'1px solid ' + theme.cardBorder,display:'flex',justifyContent:'space-between',alignItems:'center',position:'sticky',top:0,backgroundColor:theme.cardBg,zIndex:1}}><h3 style={{fontSize:isSmall?'16px':'18px',fontWeight:'600',color:theme.text,margin:0}}>{editingInvoice?'Edit':'New'} Invoice</h3><button onClick={()=>{setShowInvoiceForm(false);setEditingInvoice(null);}} style={{...btnGhost,width:'36px',height:'36px',padding:0}}><X style={{width:'18px',height:'18px'}}/></button></div><div style={{padding:isSmall?'16px':'20px',display:'flex',flexDirection:'column',gap:isSmall?'12px':'16px'}}><div style={{display:'grid',gridTemplateColumns:isSmall?'1fr':'1fr 1fr',gap:'12px'}}><div><label style={label}>Client</label><select value={invoiceForm.clientId} onChange={e=>setInvoiceForm(p=>({...p,clientId:e.target.value}))} style={select}><option value="">Select client</option>{clients.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></div><div><label style={label}>Invoice #</label><input type="text" value={invoiceForm.invoiceNumber} onChange={e=>setInvoiceForm(p=>({...p,invoiceNumber:e.target.value}))} style={input}/></div></div><div style={{display:'grid',gridTemplateColumns:isSmall?'1fr 1fr':'1fr 1fr 1fr',gap:'12px'}}><div><label style={label}>Issue Date</label><input type="date" value={invoiceForm.issueDate} onChange={e=>setInvoiceForm(p=>({...p,issueDate:e.target.value}))} style={input}/></div><div><label style={label}>Due Date</label><input type="date" value={invoiceForm.dueDate} onChange={e=>setInvoiceForm(p=>({...p,dueDate:e.target.value}))} style={input}/></div><div style={{gridColumn:isSmall?'span 2':'auto'}}><label style={label}>Currency</label><select value={invoiceForm.currency} onChange={e=>setInvoiceForm(p=>({...p,currency:e.target.value}))} style={select}>{CURRENCIES.map(c=><option key={c.code} value={c.code}>{c.code}</option>)}</select></div></div><div><label style={label}>Line Items</label>{!isSmall && <div style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr auto',gap:'8px',marginBottom:'8px'}}><span style={{fontSize:'11px',color:theme.textMuted,fontWeight:'500'}}>Description</span><span style={{fontSize:'11px',color:theme.textMuted,fontWeight:'500'}}>Hours</span><span style={{fontSize:'11px',color:theme.textMuted,fontWeight:'500'}}>Rate</span><span style={{width:'40px'}}></span></div>}{invoiceForm.items.map((item,idx)=>(<div key={idx} style={{display:'grid',gridTemplateColumns:isSmall?'1fr':'2fr 1fr 1fr auto',gap:'8px',marginBottom:'8px',padding:isSmall?'12px':'0',backgroundColor:isSmall?theme.statBg:'transparent',borderRadius:isSmall?'8px':'0'}}>{isSmall && <div style={{gridColumn:'span 2',display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'4px'}}><span style={{fontSize:'12px',color:theme.textMuted}}>Item {idx+1}</span>{invoiceForm.items.length>1&&<button onClick={()=>setInvoiceForm(p=>({...p,items:p.items.filter((_,i)=>i!==idx)}))} style={{...btnGhost,width:'28px',height:'28px',padding:0,color:'#ef4444'}}><Trash2 style={{width:'14px',height:'14px'}}/></button>}</div>}<input type="text" placeholder={isSmall?'Description':'e.g. Web Development'} value={item.description} onChange={e=>{const items=[...invoiceForm.items];items[idx].description=e.target.value;setInvoiceForm(p=>({...p,items}));}} style={{...input,gridColumn:isSmall?'span 2':'auto'}}/><input type="number" placeholder={isSmall?'Hours':'0'} value={item.hours} onChange={e=>{const items=[...invoiceForm.items];items[idx].hours=parseFloat(e.target.value)||0;setInvoiceForm(p=>({...p,items}));}} style={input}/><input type="number" placeholder={isSmall?'Rate':'0'} value={item.rate} onChange={e=>{const items=[...invoiceForm.items];items[idx].rate=parseFloat(e.target.value)||0;setInvoiceForm(p=>({...p,items}));}} style={input}/>{!isSmall && invoiceForm.items.length>1&&<button onClick={()=>setInvoiceForm(p=>({...p,items:p.items.filter((_,i)=>i!==idx)}))} style={{...btnGhost,width:'40px',padding:0,color:'#ef4444'}}><Trash2 style={{width:'14px',height:'14px'}}/></button>}{!isSmall && invoiceForm.items.length===1&&<span style={{width:'40px'}}></span>}</div>))}<button onClick={()=>setInvoiceForm(p=>({...p,items:[...p.items,{description:'',hours:1,rate:0}]}))} style={{...btnGhost,justifyContent:'flex-start'}}><Plus style={{width:'14px',height:'14px'}}/>Add Line</button></div><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'}}><div><label style={label}>Status</label><select value={invoiceForm.status} onChange={e=>setInvoiceForm(p=>({...p,status:e.target.value}))} style={select}>{STATUSES.map(s=><option key={s.id} value={s.id}>{s.label}</option>)}</select></div><div style={{padding:'12px',backgroundColor:theme.statBg,borderRadius:'8px',textAlign:'center'}}><p style={{fontSize:'12px',color:theme.textMuted,margin:'0 0 4px'}}>Total</p><p style={{fontSize:isSmall?'18px':'20px',fontWeight:'700',color:theme.text,margin:0}}>{getSymbol(invoiceForm.currency)}{formatAmount(invoiceForm.items.reduce((s,i)=>s+((i.hours||1)*i.rate),0))}</p></div></div></div><div style={{padding:isSmall?'16px':'20px',borderTop:'1px solid ' + theme.cardBorder,display:'flex',gap:'12px',justifyContent:'flex-end',position:'sticky',bottom:0,backgroundColor:theme.cardBg}}><button onClick={()=>{setShowInvoiceForm(false);setEditingInvoice(null);}} style={btnOutline}>Cancel</button><button onClick={saveInvoice} disabled={!invoiceForm.clientId} style={{...btnPrimary,opacity:invoiceForm.clientId?1:0.5}}>{editingInvoice?'Update':'Create'}</button></div></div></div>)}

      {viewingInvoice && (<div style={{position:'fixed',inset:0,backgroundColor:'rgba(0,0,0,0.6)',display:'flex',alignItems:'center',justifyContent:'center',padding:'16px',zIndex:50}} onClick={()=>setViewingInvoice(null)}><div style={{width:'100%',maxWidth:'500px',backgroundColor:theme.cardBg,borderRadius:'12px',border:'1px solid ' + theme.cardBorder,maxHeight:'90vh',overflow:'auto'}} onClick={e=>e.stopPropagation()}><div style={{padding:'20px',borderBottom:'1px solid ' + theme.cardBorder,display:'flex',justifyContent:'space-between',alignItems:'center'}}><div><h3 style={{fontSize:'18px',fontWeight:'600',color:theme.text,margin:0}}>{viewingInvoice.invoiceNumber}</h3><p style={{fontSize:'13px',color:theme.textMuted,margin:'4px 0 0'}}>{viewingInvoice.clientName}</p></div><button onClick={()=>setViewingInvoice(null)} style={{...btnGhost,width:'36px',height:'36px',padding:0}}><X style={{width:'18px',height:'18px'}}/></button></div><div style={{padding:'20px'}}><div style={{display:'flex',justifyContent:'space-between',marginBottom:'20px'}}><div><p style={{fontSize:'13px',color:theme.textMuted,margin:0}}>Issue Date</p><p style={{fontSize:'14px',color:theme.text,margin:'4px 0 0'}}>{viewingInvoice.issueDate}</p></div><div style={{textAlign:'right'}}><p style={{fontSize:'13px',color:theme.textMuted,margin:0}}>Due Date</p><p style={{fontSize:'14px',color:theme.text,margin:'4px 0 0'}}>{viewingInvoice.dueDate||'Not set'}</p></div></div><div style={{marginBottom:'20px'}}><p style={{fontSize:'13px',fontWeight:'600',color:theme.textMuted,margin:'0 0 12px'}}>Line Items</p>{viewingInvoice.items?.map((item,idx)=>(<div key={idx} style={{display:'flex',justifyContent:'space-between',padding:'12px',backgroundColor:theme.statBg,borderRadius:'8px',marginBottom:'8px'}}><div><p style={{fontSize:'14px',color:theme.text,margin:0}}>{item.description||'Service'}</p><p style={{fontSize:'12px',color:theme.textMuted,margin:'4px 0 0'}}>{item.hours} hrs × {getSymbol(viewingInvoice.currency)}{item.rate}</p></div><p style={{fontSize:'14px',fontWeight:'600',color:theme.text,margin:0}}>{getSymbol(viewingInvoice.currency)}{formatAmount((item.hours||1)*item.rate)}</p></div>))}</div><div style={{padding:'16px',backgroundColor:isDark?'#22c55e15':'#22c55e10',borderRadius:'8px',display:'flex',justifyContent:'space-between',alignItems:'center'}}><span style={{fontSize:'16px',fontWeight:'600',color:theme.text}}>Total</span><div style={{textAlign:'right'}}><p style={{fontSize:'24px',fontWeight:'700',color:'#22c55e',margin:0}}>{getSymbol(viewingInvoice.currency)}{formatAmount(viewingInvoice.total)}</p><p style={{fontSize:'13px',color:theme.textMuted,margin:'4px 0 0'}}>₱{formatAmount(viewingInvoice.phpTotal)}</p></div></div></div></div></div>)}

      {/* Paid Confirmation Modal */}
      {paidConfirmModal.show && paidConfirmModal.invoice && (
        <div style={{position:'fixed',inset:0,backgroundColor:'rgba(0,0,0,0.7)',display:'flex',alignItems:'center',justifyContent:'center',padding:'16px',zIndex:60}} onClick={()=>setPaidConfirmModal({show:false,invoice:null})}>
          <div style={{width:'100%',maxWidth:'420px',backgroundColor:theme.cardBg,borderRadius:'12px',border:'1px solid ' + theme.cardBorder,overflow:'hidden'}} onClick={e=>e.stopPropagation()}>
            <div style={{padding:'24px',textAlign:'center'}}>
              <div style={{width:'56px',height:'56px',backgroundColor:isDark?'#22c55e20':'#22c55e15',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px'}}>
                <CheckCircle style={{width:'28px',height:'28px',color:'#22c55e'}}/>
              </div>
              <h3 style={{fontSize:'18px',fontWeight:'600',color:theme.text,margin:'0 0 8px'}}>Mark Invoice as Paid?</h3>
              <p style={{fontSize:'14px',color:theme.textMuted,margin:'0 0 16px',lineHeight:'1.5'}}>
                You are about to mark <strong style={{color:theme.text}}>{paidConfirmModal.invoice.invoiceNumber}</strong> as paid.
              </p>
              <div style={{backgroundColor:isDark?'#f59e0b15':'#f59e0b10',border:'1px solid #f59e0b40',borderRadius:'8px',padding:'12px',marginBottom:'8px'}}>
                <div style={{display:'flex',alignItems:'flex-start',gap:'10px',textAlign:'left'}}>
                  <span style={{fontSize:'16px'}}>⚠️</span>
                  <div>
                    <p style={{fontSize:'13px',fontWeight:'600',color:'#f59e0b',margin:'0 0 4px'}}>This action cannot be undone</p>
                    <ul style={{fontSize:'12px',color:theme.textMuted,margin:0,paddingLeft:'16px',lineHeight:'1.6'}}>
                      <li>The invoice will be locked and cannot be edited or deleted</li>
                      <li>An income entry of <strong style={{color:theme.text}}>{getSymbol(paidConfirmModal.invoice.currency)}{formatAmount(paidConfirmModal.invoice.total)}</strong> will be automatically recorded</li>
                      <li>A timestamp will be saved for your records</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div style={{padding:'16px 24px 24px',display:'flex',gap:'12px'}}>
              <button onClick={()=>setPaidConfirmModal({show:false,invoice:null})} style={{flex:1,height:'44px',backgroundColor:'transparent',color:theme.text,border:'1px solid ' + theme.cardBorder,borderRadius:'10px',fontSize:'14px',fontWeight:'500',cursor:'pointer'}}>Cancel</button>
              <button onClick={confirmMarkAsPaid} style={{flex:1,height:'44px',backgroundColor:'#22c55e',color:'#fff',border:'none',borderRadius:'10px',fontSize:'14px',fontWeight:'500',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:'8px'}}><CheckCircle style={{width:'16px',height:'16px'}}/>Confirm Paid</button>
            </div>
          </div>
        </div>
      )}

      {/* Email Template Modal */}
      {emailModal.show && emailModal.invoice && (
        <div style={{position:'fixed',inset:0,backgroundColor:'rgba(0,0,0,0.7)',display:'flex',alignItems:'center',justifyContent:'center',padding:'16px',zIndex:60}} onClick={()=>{setEmailModal({show:false,invoice:null});setEmailCopied(false);}}>
          <div style={{width:'100%',maxWidth:'600px',backgroundColor:theme.cardBg,borderRadius:'12px',border:'1px solid ' + theme.cardBorder,maxHeight:'90vh',overflow:'auto'}} onClick={e=>e.stopPropagation()}>
            <div style={{padding:'20px',borderBottom:'1px solid ' + theme.cardBorder,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
                <div style={{width:'40px',height:'40px',backgroundColor:isDark?'#8b5cf620':'#8b5cf610',borderRadius:'10px',display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <Mail style={{width:'20px',height:'20px',color:'#8b5cf6'}}/>
                </div>
                <div>
                  <h3 style={{fontSize:'18px',fontWeight:'600',color:theme.text,margin:0}}>Invoice Email Template</h3>
                  <p style={{fontSize:'13px',color:theme.textMuted,margin:'2px 0 0'}}>{emailModal.invoice.invoiceNumber} • {emailModal.invoice.clientName}</p>
                </div>
              </div>
              <button onClick={()=>{setEmailModal({show:false,invoice:null});setEmailCopied(false);}} style={{...btnGhost,width:'36px',height:'36px',padding:0}}><X style={{width:'18px',height:'18px'}}/></button>
            </div>
            <div style={{padding:'20px'}}>
              <div style={{
                backgroundColor: isDark ? '#18181b' : '#f9fafb',
                border: '1px solid ' + theme.cardBorder,
                borderRadius: '8px',
                padding: '16px',
                fontFamily: 'monospace',
                fontSize: '13px',
                lineHeight: '1.6',
                color: theme.text,
                whiteSpace: 'pre-wrap',
                maxHeight: '400px',
                overflow: 'auto'
              }}>
                {generateInvoiceEmail(emailModal.invoice)}
              </div>
              {!vakitaProfile.name ? (
                <div style={{marginTop:'16px',padding:'12px',backgroundColor:isDark?'#f59e0b15':'#f59e0b10',borderRadius:'8px',border:'1px solid #f59e0b40'}}>
                  <div style={{display:'flex',alignItems:'flex-start',gap:'10px'}}>
                    <Info style={{width:'16px',height:'16px',color:'#f59e0b',flexShrink:0,marginTop:'2px'}}/>
                    <p style={{fontSize:'13px',color:theme.textMuted,margin:0,lineHeight:'1.5'}}>
                      <strong style={{color:'#f59e0b'}}>Tip:</strong> Set up your <button onClick={()=>{setEmailModal({show:false,invoice:null});setShowProfileModal(true);}} style={{background:'none',border:'none',color:'#3b82f6',cursor:'pointer',padding:0,fontSize:'13px',textDecoration:'underline'}}>VAKita profile</button> to auto-fill your name in emails!
                    </p>
                  </div>
                </div>
              ) : (
                <div style={{marginTop:'16px',padding:'12px',backgroundColor:isDark?'#22c55e15':'#22c55e10',borderRadius:'8px',border:'1px solid #22c55e40'}}>
                  <div style={{display:'flex',alignItems:'flex-start',gap:'10px'}}>
                    <CheckCircle style={{width:'16px',height:'16px',color:'#22c55e',flexShrink:0,marginTop:'2px'}}/>
                    <p style={{fontSize:'13px',color:theme.textMuted,margin:0,lineHeight:'1.5'}}>
                      Email signed as <strong style={{color:theme.text}}>{vakitaProfile.name}</strong>. Ready to send!
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div style={{padding:'20px',borderTop:'1px solid ' + theme.cardBorder,display:'flex',gap:'12px',justifyContent:'flex-end',flexWrap:'wrap'}}>
              <button onClick={()=>{setEmailModal({show:false,invoice:null});setEmailCopied(false);}} style={btnOutline}>Close</button>
              <button 
                onClick={()=>copyEmailToClipboard(generateInvoiceEmail(emailModal.invoice))} 
                style={{
                  ...btnPrimary,
                  backgroundColor: emailCopied ? '#22c55e' : '#6b7280',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                {emailCopied ? <CheckCircle style={{width:'16px',height:'16px'}}/> : <Copy style={{width:'16px',height:'16px'}}/>}
                {emailCopied ? 'Copied!' : 'Copy'}
              </button>
              <button 
                onClick={()=>openSendEmailModal(emailModal.invoice)} 
                style={{
                  ...btnPrimary,
                  backgroundColor: '#3b82f6',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Send style={{width:'16px',height:'16px'}}/>
                Send Email
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Send Email Modal */}
      {sendEmailModal.show && sendEmailModal.invoice && (
        <div style={{position:'fixed',inset:0,backgroundColor:'rgba(0,0,0,0.7)',display:'flex',alignItems:'center',justifyContent:'center',padding:'16px',zIndex:70}} onClick={()=>setSendEmailModal({show:false,invoice:null,recipientEmail:'',sending:false})}>
          <div style={{width:'100%',maxWidth:'450px',backgroundColor:theme.cardBg,borderRadius:'12px',border:'1px solid ' + theme.cardBorder}} onClick={e=>e.stopPropagation()}>
            <div style={{padding:'20px',borderBottom:'1px solid ' + theme.cardBorder,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
                <div style={{width:'40px',height:'40px',backgroundColor:isDark?'#3b82f620':'#3b82f610',borderRadius:'10px',display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <Send style={{width:'20px',height:'20px',color:'#3b82f6'}}/>
                </div>
                <div>
                  <h3 style={{fontSize:'18px',fontWeight:'600',color:theme.text,margin:0}}>Send Invoice Email</h3>
                  <p style={{fontSize:'13px',color:theme.textMuted,margin:'2px 0 0'}}>{sendEmailModal.invoice.invoiceNumber}</p>
                </div>
              </div>
              <button onClick={()=>setSendEmailModal({show:false,invoice:null,recipientEmail:'',sending:false})} style={{...btnGhost,width:'36px',height:'36px',padding:0}}><X style={{width:'18px',height:'18px'}}/></button>
            </div>
            <div style={{padding:'20px'}}>
              <div style={{marginBottom:'16px'}}>
                <label style={label}>Recipient Email *</label>
                <input 
                  type="email" 
                  placeholder="client@example.com"
                  value={sendEmailModal.recipientEmail}
                  onChange={e => setSendEmailModal(p => ({...p, recipientEmail: e.target.value}))}
                  style={input}
                  disabled={sendEmailModal.sending}
                />
                {clients.find(c => c.id === sendEmailModal.invoice.clientId)?.email && (
                  <p style={{fontSize:'12px',color:theme.textMuted,margin:'6px 0 0'}}>
                    Client email: <button 
                      onClick={() => setSendEmailModal(p => ({...p, recipientEmail: clients.find(c => c.id === p.invoice.clientId)?.email}))}
                      style={{background:'none',border:'none',color:'#3b82f6',cursor:'pointer',padding:0,fontSize:'12px',textDecoration:'underline'}}
                      disabled={sendEmailModal.sending}
                    >
                      {clients.find(c => c.id === sendEmailModal.invoice.clientId)?.email}
                    </button>
                  </p>
                )}
              </div>
              {!vakitaProfile.name && (
                <div style={{padding:'12px',backgroundColor:isDark?'#f59e0b15':'#f59e0b10',borderRadius:'8px',border:'1px solid #f59e0b40',marginBottom:'16px'}}>
                  <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                    <span style={{fontSize:'14px'}}>⚠️</span>
                    <p style={{fontSize:'13px',color:theme.textMuted,margin:0}}>
                      Set up your <button onClick={() => {setSendEmailModal({show:false,invoice:null,recipientEmail:'',sending:false});setShowProfileModal(true);}} style={{background:'none',border:'none',color:'#3b82f6',cursor:'pointer',padding:0,fontSize:'13px',textDecoration:'underline'}}>VAKita profile</button> to auto-fill your name in emails.
                    </p>
                  </div>
                </div>
              )}
              
              {/* Gmail Status Info */}
              {vakitaProfile.gmailConnected && vakitaProfile.useGmail ? (
                <div style={{padding:'12px',backgroundColor:isDark?'#22c55e15':'#22c55e10',borderRadius:'8px',border:'1px solid #22c55e40'}}>
                  <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
                    <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                    <p style={{fontSize:'12px',color:theme.textMuted,margin:0,lineHeight:'1.5'}}>
                      <strong style={{color:'#22c55e'}}>Gmail connected</strong> — Email will be sent directly from {vakitaProfile.gmailEmail || 'your Gmail'}.
                    </p>
                  </div>
                </div>
              ) : (
                <div style={{padding:'12px',backgroundColor:isDark?'#3b82f615':'#3b82f610',borderRadius:'8px'}}>
                  <p style={{fontSize:'12px',color:theme.textMuted,margin:0,lineHeight:'1.5'}}>
                    <strong style={{color:theme.text}}>Note:</strong> This will open your default email app with the invoice email pre-filled.
                    {!vakitaProfile.gmailConnected && (
                      <span> <button onClick={() => {setSendEmailModal({show:false,invoice:null,recipientEmail:'',sending:false});setShowProfileModal(true);}} style={{background:'none',border:'none',color:'#3b82f6',cursor:'pointer',padding:0,fontSize:'12px',textDecoration:'underline'}}>Connect Gmail</button> to send directly.</span>
                    )}
                  </p>
                </div>
              )}
            </div>
            <div style={{padding:'20px',borderTop:'1px solid ' + theme.cardBorder,display:'flex',gap:'12px',justifyContent:'flex-end'}}>
              <button onClick={()=>setSendEmailModal({show:false,invoice:null,recipientEmail:'',sending:false})} style={btnOutline} disabled={sendEmailModal.sending}>Cancel</button>
              <button 
                onClick={sendInvoiceEmail}
                disabled={!sendEmailModal.recipientEmail || sendEmailModal.sending}
                style={{
                  ...btnPrimary,
                  backgroundColor: vakitaProfile.gmailConnected && vakitaProfile.useGmail ? '#22c55e' : '#3b82f6',
                  opacity: sendEmailModal.recipientEmail && !sendEmailModal.sending ? 1 : 0.5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                {sendEmailModal.sending ? (
                  <>
                    <Loader2 style={{width:'16px',height:'16px',animation:'spin 1s linear infinite'}}/>
                    Sending...
                  </>
                ) : vakitaProfile.gmailConnected && vakitaProfile.useGmail ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                    Send via Gmail
                  </>
                ) : (
                  <>
                    <Send style={{width:'16px',height:'16px'}}/>
                    Open Email Client
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VAKita Profile Modal */}
      {showProfileModal && (
        <div style={{position:'fixed',inset:0,backgroundColor:'rgba(0,0,0,0.7)',display:'flex',alignItems:'center',justifyContent:'center',padding:'16px',zIndex:70}} onClick={()=>setShowProfileModal(false)}>
          <div style={{width:'100%',maxWidth:'480px',maxHeight:'90vh',backgroundColor:theme.cardBg,borderRadius:'12px',border:'1px solid ' + theme.cardBorder,overflow:'hidden',display:'flex',flexDirection:'column'}} onClick={e=>e.stopPropagation()}>
            <div style={{padding:'20px',borderBottom:'1px solid ' + theme.cardBorder,display:'flex',justifyContent:'space-between',alignItems:'center',flexShrink:0}}>
              <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
                <div style={{width:'40px',height:'40px',backgroundColor:isDark?'#8b5cf620':'#8b5cf610',borderRadius:'10px',display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <Settings style={{width:'20px',height:'20px',color:'#8b5cf6'}}/>
                </div>
                <div>
                  <h3 style={{fontSize:'18px',fontWeight:'600',color:theme.text,margin:0}}>VAKita Profile</h3>
                  <p style={{fontSize:'13px',color:theme.textMuted,margin:'2px 0 0'}}>Your business information</p>
                </div>
              </div>
              <button onClick={()=>setShowProfileModal(false)} style={{...btnGhost,width:'36px',height:'36px',padding:0}}><X style={{width:'18px',height:'18px'}}/></button>
            </div>
            <div style={{padding:'20px',display:'flex',flexDirection:'column',gap:'16px',overflow:'auto',flex:1}}>
              <div>
                <label style={label}>Your Name *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Juan dela Cruz"
                  value={vakitaProfile.name}
                  onChange={e => setVakitaProfile(p => ({...p, name: e.target.value}))}
                  style={input}
                />
                <p style={{fontSize:'11px',color:theme.textMuted,margin:'4px 0 0'}}>Used in email signatures</p>
              </div>
              <div>
                <label style={label}>Business Name (Optional)</label>
                <input 
                  type="text" 
                  placeholder="e.g. JD Virtual Services"
                  value={vakitaProfile.businessName || ''}
                  onChange={e => setVakitaProfile(p => ({...p, businessName: e.target.value}))}
                  style={input}
                />
              </div>
              
              {/* Gmail Integration Section */}
              <div style={{borderTop:'1px solid ' + theme.cardBorder,paddingTop:'16px',marginTop:'4px'}}>
                <label style={{...label,display:'flex',alignItems:'center',gap:'8px',marginBottom:'12px'}}>
                  <Mail style={{width:'16px',height:'16px',color:'#ea4335'}}/>
                  Gmail Integration
                </label>
                
                {vakitaProfile.gmailConnected ? (
                  <div style={{padding:'14px',backgroundColor:isDark?'#22c55e15':'#22c55e10',borderRadius:'10px',border:'1px solid #22c55e40'}}>
                    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'12px'}}>
                      <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
                        <div style={{width:'32px',height:'32px',backgroundColor:'#fff',borderRadius:'8px',display:'flex',alignItems:'center',justifyContent:'center'}}>
                          <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                        </div>
                        <div>
                          <p style={{fontSize:'14px',fontWeight:'500',color:theme.text,margin:0}}>Connected</p>
                          <p style={{fontSize:'12px',color:theme.textMuted,margin:'2px 0 0'}}>{vakitaProfile.gmailEmail || 'Gmail account'}</p>
                        </div>
                      </div>
                      <button 
                        onClick={disconnectGmail}
                        style={{...btnGhost,fontSize:'12px',color:'#ef4444',padding:'6px 10px'}}
                      >
                        Disconnect
                      </button>
                    </div>
                    
                    {/* Use Gmail toggle */}
                    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',paddingTop:'12px',borderTop:'1px solid #22c55e30'}}>
                      <div>
                        <p style={{fontSize:'13px',fontWeight:'500',color:theme.text,margin:0}}>Send emails via Gmail</p>
                        <p style={{fontSize:'11px',color:theme.textMuted,margin:'2px 0 0'}}>Directly send without opening email client</p>
                      </div>
                      <button 
                        onClick={() => setVakitaProfile(p => ({...p, useGmail: !p.useGmail}))}
                        style={{
                          width:'44px',
                          height:'24px',
                          borderRadius:'12px',
                          border:'none',
                          backgroundColor: vakitaProfile.useGmail ? '#22c55e' : (isDark ? '#3f3f46' : '#d4d4d8'),
                          cursor:'pointer',
                          position:'relative',
                          transition:'background-color 0.2s'
                        }}
                      >
                        <div style={{
                          width:'20px',
                          height:'20px',
                          borderRadius:'50%',
                          backgroundColor:'#fff',
                          position:'absolute',
                          top:'2px',
                          left: vakitaProfile.useGmail ? '22px' : '2px',
                          transition:'left 0.2s',
                          boxShadow:'0 1px 3px rgba(0,0,0,0.2)'
                        }}/>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{padding:'14px',backgroundColor:isDark?'#27272a':'#f4f4f5',borderRadius:'10px',border:'1px solid ' + theme.cardBorder}}>
                    <p style={{fontSize:'13px',color:theme.textMuted,margin:'0 0 12px',lineHeight:'1.5'}}>
                      Connect your Gmail to send invoice emails directly without opening your email client.
                    </p>
                    <button 
                      onClick={connectGmail}
                      disabled={gmailConnecting}
                      style={{
                        display:'flex',
                        alignItems:'center',
                        justifyContent:'center',
                        gap:'10px',
                        width:'100%',
                        height:'44px',
                        backgroundColor:'#fff',
                        border:'1px solid #dadce0',
                        borderRadius:'8px',
                        fontSize:'14px',
                        fontWeight:'500',
                        color:'#3c4043',
                        cursor: gmailConnecting ? 'not-allowed' : 'pointer',
                        opacity: gmailConnecting ? 0.7 : 1
                      }}
                    >
                      {gmailConnecting ? (
                        <Loader2 style={{width:'18px',height:'18px',animation:'spin 1s linear infinite'}}/>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                      )}
                      {gmailConnecting ? 'Connecting...' : 'Connect Gmail Account'}
                    </button>
                    <p style={{fontSize:'11px',color:theme.textMuted,margin:'10px 0 0',textAlign:'center'}}>
                      We only request permission to send emails on your behalf.
                    </p>
                  </div>
                )}
              </div>
              
              <div style={{padding:'14px',backgroundColor:isDark?'#3b82f615':'#3b82f610',borderRadius:'8px',border:'1px solid #3b82f640'}}>
                <p style={{fontSize:'13px',color:theme.textMuted,margin:0,lineHeight:'1.5'}}>
                  💡 <strong style={{color:theme.text}}>Tip:</strong> Your name will automatically appear in invoice email signatures.
                </p>
              </div>
            </div>
            <div style={{padding:'20px',borderTop:'1px solid ' + theme.cardBorder,display:'flex',gap:'12px',justifyContent:'flex-end',flexShrink:0}}>
              <button onClick={()=>setShowProfileModal(false)} style={btnOutline}>Cancel</button>
              <button 
                onClick={saveVakitaProfile}
                disabled={!vakitaProfile.name}
                style={{
                  ...btnPrimary,
                  opacity: vakitaProfile.name ? 1 : 0.5
                }}
              >
                Save Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.show && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          padding: '14px 20px',
          backgroundColor: toast.type === 'error' ? '#ef4444' : '#22c55e',
          color: '#fff',
          borderRadius: '10px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          animation: 'slideIn 0.3s ease'
        }}>
          {toast.type === 'error' ? '❌' : '✓'}
          <span style={{ fontSize: '14px', fontWeight: '500' }}>{toast.message}</span>
        </div>
      )}
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>

      {deleteModal.show && (<div style={{position:'fixed',inset:0,backgroundColor:'rgba(0,0,0,0.7)',display:'flex',alignItems:isSmall?'flex-end':'center',justifyContent:'center',padding:isSmall?0:'16px',zIndex:60}} onClick={()=>setDeleteModal({show:false,type:'',id:null,name:''})}><div style={{width:'100%',maxWidth:isSmall?'100%':'360px',backgroundColor:theme.cardBg,borderRadius:isSmall?'16px 16px 0 0':'12px',border:'1px solid ' + theme.cardBorder,borderBottom:isSmall?'none':('1px solid ' + theme.cardBorder),overflow:'hidden'}} onClick={e=>e.stopPropagation()}><div style={{padding:isSmall?'20px 20px 16px':'20px',textAlign:'center'}}><div style={{width:'48px',height:'48px',backgroundColor:isDark?'#ef444420':'#ef444410',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 12px'}}><Trash2 style={{width:'24px',height:'24px',color:'#ef4444'}}/></div><h3 style={{fontSize:'16px',fontWeight:'600',color:theme.text,margin:'0 0 6px'}}>Delete {deleteModal.type === 'prospect' ? 'Prospect' : deleteModal.type === 'client' ? 'Client' : deleteModal.type === 'invoice' ? 'Invoice' : 'Income'}?</h3><p style={{fontSize:'13px',color:theme.textMuted,margin:0,lineHeight:'1.4'}}><strong style={{color:theme.text}}>{deleteModal.name}</strong></p>{deleteModal.type === 'client' && <p style={{fontSize:'12px',color:'#f59e0b',margin:'8px 0 0'}}>⚠️ Income entries will also be removed</p>}</div><div style={{padding:isSmall?'12px 16px 24px':'12px 20px 16px',display:'flex',gap:'10px'}}><button onClick={()=>setDeleteModal({show:false,type:'',id:null,name:''})} style={{flex:1,height:'44px',backgroundColor:'transparent',color:theme.text,border:'1px solid ' + theme.cardBorder,borderRadius:'10px',fontSize:'14px',fontWeight:'500',cursor:'pointer'}}>Cancel</button><button onClick={confirmDelete} style={{flex:1,height:'44px',backgroundColor:'#ef4444',color:'#fff',border:'none',borderRadius:'10px',fontSize:'14px',fontWeight:'500',cursor:'pointer'}}>Delete</button></div></div></div>)}
    </>
  );
};

export default VAKita;
