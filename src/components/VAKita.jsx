// VAKita.jsx - Income & Client Manager for Filipino VAs
// Renders INSIDE App.jsx main content area - App.jsx handles header with level/XP/achievements
// Data stored in Supabase for persistence
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { FileText, Clock, Plus, Trash2, Edit, Eye, X, Sun, Moon as MoonIcon, Coffee, Zap, Users, Bell, PiggyBank, Calculator, Receipt, BarChart3, Loader2, Target, UserPlus, CheckCircle, Info, Mail, Copy } from 'lucide-react';
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
  const [deleteModal, setDeleteModal] = useState({ show: false, type: '', id: null, name: '' });

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

  useEffect(() => {
    if (!user?.id) return;
    const loadData = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.from('user_profiles').select('vakita_clients, vakita_income, vakita_invoices, vakita_tax_settings, vakita_prospects').eq('user_id', user.id).single();
        if (error && error.code !== 'PGRST116') console.error('Error loading VAKita data:', error);
        if (data) {
          setClients(data.vakita_clients || []);
          setIncomeEntries(data.vakita_income || []);
          setInvoices(data.vakita_invoices || []);
          setProspects(data.vakita_prospects || []);
          setTaxSettings(data.vakita_tax_settings || { taxOption: '8percent', tinNumber: '' });
        }
      } catch (err) { console.error('Error loading VAKita data:', err); }
      finally { setLoading(false); }
    };
    loadData();
  }, [user?.id]);

  const saveToSupabase = useCallback(async (field, value) => {
    if (!user?.id) return;
    setSaving(true);
    try { const { error } = await supabase.from('user_profiles').update({ [field]: value }).eq('user_id', user.id); if (error) console.error('Error saving ' + field + ':', error); }
    catch (err) { console.error('Error saving ' + field + ':', err); }
    finally { setSaving(false); }
  }, [user?.id]);

  useEffect(() => { if (loading || !user?.id) return; const t = setTimeout(() => saveToSupabase('vakita_clients', clients), 500); return () => clearTimeout(t); }, [clients, loading, user?.id, saveToSupabase]);
  useEffect(() => { if (loading || !user?.id) return; const t = setTimeout(() => saveToSupabase('vakita_income', incomeEntries), 500); return () => clearTimeout(t); }, [incomeEntries, loading, user?.id, saveToSupabase]);
  useEffect(() => { if (loading || !user?.id) return; const t = setTimeout(() => saveToSupabase('vakita_invoices', invoices), 500); return () => clearTimeout(t); }, [invoices, loading, user?.id, saveToSupabase]);
  useEffect(() => { if (loading || !user?.id) return; const t = setTimeout(() => saveToSupabase('vakita_prospects', prospects), 500); return () => clearTimeout(t); }, [prospects, loading, user?.id, saveToSupabase]);
  useEffect(() => { if (loading || !user?.id) return; const t = setTimeout(() => saveToSupabase('vakita_tax_settings', taxSettings), 500); return () => clearTimeout(t); }, [taxSettings, loading, user?.id, saveToSupabase]);
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
[Your Name]`;
    
    return email;
  };
  
  const copyEmailToClipboard = (email) => {
    navigator.clipboard.writeText(email).then(() => {
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2000);
    });
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
      <div style={{ backgroundColor: isDark ? '#0a0a0b' : '#ffffff', borderBottom: '1px solid ' + theme.cardBorder, padding: isSmall ? '0 12px' : '0 24px' }}>
        <div style={{ maxWidth: '1600px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: isSmall ? '0' : '0 16px' }}>
          {/* Main category tabs - matching Finance Tracker style */}
          <div style={{ display: 'flex', gap: '0', alignItems: 'center' }}>
            <button 
              onClick={() => { if (!['prospecting', 'clients', 'invoices', 'dashboard'].includes(activeTab)) setActiveTab('prospecting'); }}
              style={{
                padding: isSmall ? '12px 14px' : '14px 18px',
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: ['prospecting', 'clients', 'invoices', 'dashboard'].includes(activeTab) ? '2px solid ' + (isDark ? '#fafafa' : '#18181b') : '2px solid transparent',
                fontSize: isSmall ? '13px' : '15px',
                fontWeight: '500',
                color: ['prospecting', 'clients', 'invoices', 'dashboard'].includes(activeTab) ? theme.text : theme.textMuted,
                cursor: 'pointer',
                transition: 'color 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                whiteSpace: 'nowrap'
              }}
            >
              Client Management
            </button>
            <button 
              onClick={() => setActiveTab('timezone')} 
              style={{
                padding: isSmall ? '12px 14px' : '14px 18px',
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: activeTab === 'timezone' ? '2px solid ' + (isDark ? '#fafafa' : '#18181b') : '2px solid transparent',
                fontSize: isSmall ? '13px' : '15px',
                fontWeight: '500',
                color: activeTab === 'timezone' ? theme.text : theme.textMuted,
                cursor: 'pointer',
                transition: 'color 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                whiteSpace: 'nowrap'
              }}
            >
              <Clock style={{ width: '16px', height: '16px' }} />
              {!isSmall && 'Timezone Manager'}
              {isSmall && 'Clock'}
            </button>
            <button 
              onClick={() => setActiveTab('tax')} 
              style={{
                padding: isSmall ? '12px 14px' : '14px 18px',
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: activeTab === 'tax' ? '2px solid ' + (isDark ? '#fafafa' : '#18181b') : '2px solid transparent',
                fontSize: isSmall ? '13px' : '15px',
                fontWeight: '500',
                color: activeTab === 'tax' ? theme.text : theme.textMuted,
                cursor: 'pointer',
                transition: 'color 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                whiteSpace: 'nowrap'
              }}
            >
              Tax
            </button>
          </div>
          
          {/* Exchange rate + saving indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
          padding: isSmall ? '0 12px' : '0 24px' 
        }}>
          <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '12px 16px' }}>
            <div style={{ display: 'flex', gap: '6px', backgroundColor: theme.toggleBg || (isDark ? '#18181b' : '#f4f4f5'), borderRadius: '8px', padding: '4px', width: 'fit-content' }}>
              <button 
                onClick={() => setActiveTab('prospecting')} 
                style={{
                  padding: '8px 14px',
                  backgroundColor: activeTab === 'prospecting' ? (isDark ? '#27272a' : '#ffffff') : 'transparent',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: activeTab === 'prospecting' ? theme.text : theme.textMuted,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: activeTab === 'prospecting' ? (isDark ? 'none' : '0 1px 2px rgba(0,0,0,0.05)') : 'none'
                }}
              >
                <Target style={{ width: '14px', height: '14px' }} />
                Leads
              </button>
              <button 
                onClick={() => setActiveTab('clients')} 
                style={{
                  padding: '8px 14px',
                  backgroundColor: activeTab === 'clients' ? (isDark ? '#27272a' : '#ffffff') : 'transparent',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: activeTab === 'clients' ? theme.text : theme.textMuted,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: activeTab === 'clients' ? (isDark ? 'none' : '0 1px 2px rgba(0,0,0,0.05)') : 'none'
                }}
              >
                <Users style={{ width: '14px', height: '14px' }} />
                Clients
              </button>
              <button 
                onClick={() => setActiveTab('invoices')} 
                style={{
                  padding: '8px 14px',
                  backgroundColor: activeTab === 'invoices' ? (isDark ? '#27272a' : '#ffffff') : 'transparent',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: activeTab === 'invoices' ? theme.text : theme.textMuted,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: activeTab === 'invoices' ? (isDark ? 'none' : '0 1px 2px rgba(0,0,0,0.05)') : 'none'
                }}
              >
                <FileText style={{ width: '14px', height: '14px' }} />
                Invoices
              </button>
              <button 
                onClick={() => setActiveTab('dashboard')} 
                style={{
                  padding: '8px 14px',
                  backgroundColor: activeTab === 'dashboard' ? (isDark ? '#27272a' : '#ffffff') : 'transparent',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: activeTab === 'dashboard' ? theme.text : theme.textMuted,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: activeTab === 'dashboard' ? (isDark ? 'none' : '0 1px 2px rgba(0,0,0,0.05)') : 'none'
                }}
              >
                <BarChart3 style={{ width: '14px', height: '14px' }} />
                Income
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ padding: isSmall ? '16px' : '24px', maxWidth: '1600px', margin: '0 auto' }}>
        {activeTab === 'prospecting' && (
          <div>
            <div style={{display:'grid',gridTemplateColumns:isSmall?'repeat(2,1fr)':'repeat(4,1fr)',gap:'12px',marginBottom:'24px'}}>
              <div style={{...card,padding:'16px',borderLeft:'4px solid #8b5cf6'}}><p style={{fontSize:'12px',color:theme.textMuted,margin:'0 0 4px'}}>Active Leads</p><p style={{fontSize:'24px',fontWeight:'700',color:theme.text,margin:0}}>{prospectStats.active}</p></div>
              <div style={{...card,padding:'16px',borderLeft:'4px solid #22c55e'}}><p style={{fontSize:'12px',color:theme.textMuted,margin:'0 0 4px'}}>Won</p><p style={{fontSize:'24px',fontWeight:'700',color:'#22c55e',margin:0}}>{prospectStats.won}</p></div>
              <div style={{...card,padding:'16px',borderLeft:'4px solid #ef4444'}}><p style={{fontSize:'12px',color:theme.textMuted,margin:'0 0 4px'}}>Lost</p><p style={{fontSize:'24px',fontWeight:'700',color:'#ef4444',margin:0}}>{prospectStats.lost}</p></div>
              <div style={{...card,padding:'16px',borderLeft:'4px solid #f59e0b'}}><p style={{fontSize:'12px',color:theme.textMuted,margin:'0 0 4px'}}>Win Rate</p><p style={{fontSize:'24px',fontWeight:'700',color:'#f59e0b',margin:0}}>{prospectStats.winRate}%</p></div>
            </div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'24px',flexWrap:'wrap',gap:'12px'}}>
              <div><h2 style={{fontSize:'20px',fontWeight:'600',color:theme.text,margin:0}}>Prospecting Pipeline</h2><p style={{fontSize:'14px',color:theme.textMuted,margin:'4px 0 0'}}>Track potential clients from lead to close</p></div>
              <button onClick={() => setShowProspectForm(true)} style={btnPrimary}><UserPlus style={{width:'18px',height:'18px'}}/>Add Lead</button>
            </div>
            {prospects.length === 0 ? (
              <div style={{...card,textAlign:'center',padding:'60px'}}><Target style={{width:'48px',height:'48px',color:theme.textMuted,margin:'0 auto 16px'}}/><p style={{fontSize:'16px',color:theme.text,margin:'0 0 8px'}}>No prospects yet</p><p style={{fontSize:'14px',color:theme.textMuted,margin:'0 0 20px'}}>Start tracking potential clients</p><button onClick={() => setShowProspectForm(true)} style={btnPrimary}><UserPlus style={{width:'16px',height:'16px'}}/>Add First Lead</button></div>
            ) : (
              <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
                {prospects.filter(p => !['won', 'lost'].includes(p.status)).map(prospect => {
                  const source = LEAD_SOURCES.find(s => s.id === prospect.source);
                  const status = PROSPECT_STATUSES.find(s => s.id === prospect.status);
                  return (
                    <div key={prospect.id} style={{...card,padding:'16px'}}>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:'12px',flexWrap:'wrap'}}>
                        <div style={{flex:1,minWidth:'200px'}}>
                          <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'8px'}}>
                            <span style={{display:'flex',alignItems:'center',justifyContent:'center',width:'32px',height:'32px'}}>{renderIcon(source?.icon || '🌐', 24)}</span>
                            <div><h3 style={{fontSize:'16px',fontWeight:'600',color:theme.text,margin:0}}>{prospect.name}</h3>{prospect.company && <p style={{fontSize:'13px',color:theme.textMuted,margin:'2px 0 0'}}>{prospect.company}</p>}</div>
                          </div>
                          <div style={{display:'flex',gap:'8px',flexWrap:'wrap',marginBottom:'8px'}}>
                            <span style={{padding:'4px 10px',borderRadius:'12px',fontSize:'12px',fontWeight:'600',...prospectStatusStyle(prospect.status)}}>{status?.icon} {status?.label}</span>
                            <span style={{padding:'4px 10px',borderRadius:'12px',fontSize:'12px',backgroundColor:theme.statBg,color:theme.textMuted}}>{source?.name}</span>
                          </div>
                          {prospect.notes && <p style={{fontSize:'13px',color:theme.textMuted,margin:'8px 0 0',lineHeight:'1.4'}}>{prospect.notes}</p>}
                        </div>
                        <div style={{display:'flex',gap:'8px',alignItems:'center',flexWrap:'wrap'}}>
                          {prospect.estimatedValue > 0 && <span style={{fontSize:'14px',fontWeight:'600',color:'#22c55e',padding:'6px 12px',backgroundColor:isDark?'#22c55e15':'#22c55e10',borderRadius:'8px'}}>{getSymbol(prospect.currency)}{formatAmount(prospect.estimatedValue)}{prospect.billingType === 'hourly' ? '/hr' : '/mo'}</span>}
                          <select value={prospect.status} onChange={(e) => handleProspectStatusChange(prospect, e.target.value)} style={{...select,width:'auto',minWidth:'140px',height:'36px',fontSize:'13px'}}>{PROSPECT_STATUSES.map(s => <option key={s.id} value={s.id}>{s.icon} {s.label}</option>)}</select>
                          {['negotiation', 'proposal', 'meeting'].includes(prospect.status) && <button onClick={() => convertToClient(prospect)} style={{...btnSuccess,height:'36px',padding:'0 12px',fontSize:'13px'}}><CheckCircle style={{width:'14px',height:'14px'}}/>Convert</button>}
                          <button onClick={()=>{setEditingProspect(prospect);setProspectForm({...prospect,estimatedValue:prospect.estimatedValue?.toString()||''});setShowProspectForm(true);}} style={{...btnGhost,width:'36px',height:'36px',padding:0}}><Edit style={{width:'14px',height:'14px'}}/></button>
                          <button onClick={()=>setDeleteModal({show:true,type:'prospect',id:prospect.id,name:prospect.name})} style={{...btnGhost,width:'36px',height:'36px',padding:0,color:'#ef4444'}}><Trash2 style={{width:'14px',height:'14px'}}/></button>
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
            <div style={{display:'grid',gridTemplateColumns:isSmall?'repeat(2,1fr)':'repeat(5,1fr)',gap:'12px',marginBottom:'24px'}}>
              <div style={{...card,padding:'14px',textAlign:'center'}}><p style={{fontSize:'11px',color:theme.textMuted,margin:'0 0 4px'}}>Total</p><p style={{fontSize:'20px',fontWeight:'700',color:theme.text,margin:0}}>{invoiceStats.total}</p></div>
              <div style={{...card,padding:'14px',textAlign:'center'}}><p style={{fontSize:'11px',color:theme.textMuted,margin:'0 0 4px'}}>Paid</p><p style={{fontSize:'20px',fontWeight:'700',color:'#22c55e',margin:0}}>{invoiceStats.paid}</p></div>
              <div style={{...card,padding:'14px',textAlign:'center'}}><p style={{fontSize:'11px',color:theme.textMuted,margin:'0 0 4px'}}>Pending</p><p style={{fontSize:'20px',fontWeight:'700',color:'#3b82f6',margin:0}}>{invoiceStats.pending}</p></div>
              <div style={{...card,padding:'14px',textAlign:'center'}}><p style={{fontSize:'11px',color:theme.textMuted,margin:'0 0 4px'}}>Overdue</p><p style={{fontSize:'20px',fontWeight:'700',color:'#ef4444',margin:0}}>{invoiceStats.overdue}</p></div>
              <div style={{...card,padding:'14px',textAlign:'center',gridColumn:isSmall?'span 2':'auto'}}><p style={{fontSize:'11px',color:theme.textMuted,margin:'0 0 4px'}}>Revenue</p><p style={{fontSize:'20px',fontWeight:'700',color:theme.text,margin:0}}>₱{formatAmount(invoiceStats.revenue)}</p></div>
            </div>
            <div style={{display:'flex',justifyContent:'flex-end',marginBottom:'20px'}}><button onClick={() => setShowInvoiceForm(true)} style={btnPrimary}><Plus style={{width:'18px',height:'18px'}}/>New Invoice</button></div>
            {invoices.length === 0 ? (<div style={{...card,textAlign:'center',padding:'60px'}}><FileText style={{width:'48px',height:'48px',color:theme.textMuted,margin:'0 auto 16px'}}/><p style={{fontSize:'16px',color:theme.text}}>No invoices yet</p></div>
            ) : (<div style={{display:'flex',flexDirection:'column',gap:'12px'}}>{invoices.map(inv => (<div key={inv.id} style={{...card,padding:'16px'}}><div style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'12px'}}><div><div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'4px'}}><span style={{fontSize:'15px',fontWeight:'600',color:theme.text}}>{inv.invoiceNumber}</span><span style={{padding:'4px 10px',borderRadius:'12px',fontSize:'12px',fontWeight:'600',...statusStyle(inv.status)}}>{inv.status}</span></div><p style={{fontSize:'14px',color:theme.textMuted,margin:0}}>{inv.clientName} • Due: {inv.dueDate||'Not set'}</p></div><div style={{display:'flex',alignItems:'center',gap:'16px'}}><div style={{textAlign:'right'}}><p style={{fontSize:'18px',fontWeight:'700',color:theme.text,margin:0}}>{getSymbol(inv.currency)}{formatAmount(inv.total)}</p><p style={{fontSize:'12px',color:theme.textMuted,margin:0}}>₱{formatAmount(inv.phpTotal)}</p></div><button onClick={()=>setViewingInvoice(inv)} style={{...btnGhost,width:'36px',height:'36px',padding:0}}><Eye style={{width:'16px',height:'16px'}}/></button><button onClick={()=>setEmailModal({show:true,invoice:inv})} style={{...btnGhost,width:'36px',height:'36px',padding:0}} title="Generate Email"><Mail style={{width:'16px',height:'16px'}}/></button><button onClick={()=>{setEditingInvoice(inv);setInvoiceForm({...inv});setShowInvoiceForm(true);}} style={{...btnGhost,width:'36px',height:'36px',padding:0}}><Edit style={{width:'16px',height:'16px'}}/></button><button onClick={()=>setDeleteModal({show:true,type:'invoice',id:inv.id,name:inv.invoiceNumber})} style={{...btnGhost,width:'36px',height:'36px',padding:0,color:'#ef4444'}}><Trash2 style={{width:'16px',height:'16px'}}/></button></div></div></div>))}</div>)}
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

      {showClientForm && (<div style={{position:'fixed',inset:0,backgroundColor:'rgba(0,0,0,0.6)',display:'flex',alignItems:'center',justifyContent:'center',padding:'16px',zIndex:50}} onClick={()=>{setShowClientForm(false);setEditingClient(null);}}><div style={{width:'100%',maxWidth:'500px',backgroundColor:theme.cardBg,borderRadius:'12px',border:'1px solid ' + theme.cardBorder,maxHeight:'90vh',overflow:'auto'}} onClick={e=>e.stopPropagation()}><div style={{padding:'20px',borderBottom:'1px solid ' + theme.cardBorder,display:'flex',justifyContent:'space-between',alignItems:'center'}}><h3 style={{fontSize:'18px',fontWeight:'600',color:theme.text,margin:0}}>{editingClient?'Edit':'Add'} Client</h3><button onClick={()=>{setShowClientForm(false);setEditingClient(null);}} style={{...btnGhost,width:'36px',height:'36px',padding:0}}><X style={{width:'18px',height:'18px'}}/></button></div><div style={{padding:'20px',display:'flex',flexDirection:'column',gap:'16px'}}><div style={{display:'grid',gridTemplateColumns:'1fr auto',gap:'12px'}}><div><label style={label}>Name *</label><input type="text" placeholder="Client name" value={clientForm.name} onChange={e=>setClientForm(p=>({...p,name:e.target.value}))} style={input}/></div><div><label style={label}>Color</label><input type="color" value={clientForm.color} onChange={e=>setClientForm(p=>({...p,color:e.target.value}))} style={{...input,width:'50px',padding:'4px',cursor:'pointer'}}/></div></div><div><label style={label}>Company</label><input type="text" placeholder="Company name" value={clientForm.company} onChange={e=>setClientForm(p=>({...p,company:e.target.value}))} style={input}/></div><div><label style={label}>Email</label><input type="email" placeholder="client@company.com" value={clientForm.email} onChange={e=>setClientForm(p=>({...p,email:e.target.value}))} style={input}/></div><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'}}><div><label style={label}>Timezone</label><select value={clientForm.timezone} onChange={e=>setClientForm(p=>({...p,timezone:e.target.value}))} style={select}>{TIMEZONES.map(t=><option key={t.id} value={t.id}>{t.flag} {t.city}</option>)}</select></div><div><label style={label}>Status</label><select value={clientForm.status} onChange={e=>setClientForm(p=>({...p,status:e.target.value}))} style={select}><option value="active">Active</option><option value="inactive">Inactive</option></select></div></div><div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'12px'}}><div><label style={label}>Rate</label><input type="number" placeholder="0" value={clientForm.rate} onChange={e=>setClientForm(p=>({...p,rate:e.target.value}))} style={input}/></div><div><label style={label}>Type</label><select value={clientForm.billingType} onChange={e=>setClientForm(p=>({...p,billingType:e.target.value}))} style={select}><option value="hourly">Hourly</option><option value="monthly">Monthly</option></select></div><div><label style={label}>Currency</label><select value={clientForm.currency} onChange={e=>setClientForm(p=>({...p,currency:e.target.value}))} style={select}>{CURRENCIES.map(c=><option key={c.code} value={c.code}>{c.code}</option>)}</select></div></div><div><label style={label}>Payment Platform</label><select value={clientForm.paymentPlatform} onChange={e=>setClientForm(p=>({...p,paymentPlatform:e.target.value}))} style={select}>{PLATFORMS.map(p=><option key={p.id} value={p.id}>{p.emoji} {p.name}</option>)}</select></div><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'}}><div><label style={label}>Business Hours Start</label><select value={clientForm.businessHoursStart} onChange={e=>setClientForm(p=>({...p,businessHoursStart:parseInt(e.target.value)}))} style={select}>{Array.from({length:24},(_,i)=><option key={i} value={i}>{i}:00</option>)}</select></div><div><label style={label}>Business Hours End</label><select value={clientForm.businessHoursEnd} onChange={e=>setClientForm(p=>({...p,businessHoursEnd:parseInt(e.target.value)}))} style={select}>{Array.from({length:24},(_,i)=><option key={i} value={i}>{i}:00</option>)}</select></div></div></div><div style={{padding:'20px',borderTop:'1px solid ' + theme.cardBorder,display:'flex',gap:'12px',justifyContent:'flex-end'}}><button onClick={()=>{setShowClientForm(false);setEditingClient(null);}} style={btnOutline}>Cancel</button><button onClick={saveClient} disabled={!clientForm.name} style={{...btnPrimary,opacity:clientForm.name?1:0.5}}>{editingClient?'Update':'Add'} Client</button></div></div></div>)}

      {showInvoiceForm && (<div style={{position:'fixed',inset:0,backgroundColor:'rgba(0,0,0,0.6)',display:'flex',alignItems:'center',justifyContent:'center',padding:'16px',zIndex:50}} onClick={()=>{setShowInvoiceForm(false);setEditingInvoice(null);}}><div style={{width:'100%',maxWidth:'600px',backgroundColor:theme.cardBg,borderRadius:'12px',border:'1px solid ' + theme.cardBorder,maxHeight:'90vh',overflow:'auto'}} onClick={e=>e.stopPropagation()}><div style={{padding:'20px',borderBottom:'1px solid ' + theme.cardBorder,display:'flex',justifyContent:'space-between',alignItems:'center'}}><h3 style={{fontSize:'18px',fontWeight:'600',color:theme.text,margin:0}}>{editingInvoice?'Edit':'New'} Invoice</h3><button onClick={()=>{setShowInvoiceForm(false);setEditingInvoice(null);}} style={{...btnGhost,width:'36px',height:'36px',padding:0}}><X style={{width:'18px',height:'18px'}}/></button></div><div style={{padding:'20px',display:'flex',flexDirection:'column',gap:'16px'}}><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'}}><div><label style={label}>Client</label><select value={invoiceForm.clientId} onChange={e=>setInvoiceForm(p=>({...p,clientId:e.target.value}))} style={select}><option value="">Select client</option>{clients.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></div><div><label style={label}>Invoice #</label><input type="text" value={invoiceForm.invoiceNumber} onChange={e=>setInvoiceForm(p=>({...p,invoiceNumber:e.target.value}))} style={input}/></div></div><div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'12px'}}><div><label style={label}>Issue Date</label><input type="date" value={invoiceForm.issueDate} onChange={e=>setInvoiceForm(p=>({...p,issueDate:e.target.value}))} style={input}/></div><div><label style={label}>Due Date</label><input type="date" value={invoiceForm.dueDate} onChange={e=>setInvoiceForm(p=>({...p,dueDate:e.target.value}))} style={input}/></div><div><label style={label}>Currency</label><select value={invoiceForm.currency} onChange={e=>setInvoiceForm(p=>({...p,currency:e.target.value}))} style={select}>{CURRENCIES.map(c=><option key={c.code} value={c.code}>{c.code}</option>)}</select></div></div><div><label style={label}>Line Items</label><div style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr auto',gap:'8px',marginBottom:'8px'}}><span style={{fontSize:'11px',color:theme.textMuted,fontWeight:'500'}}>Description</span><span style={{fontSize:'11px',color:theme.textMuted,fontWeight:'500'}}>Hours</span><span style={{fontSize:'11px',color:theme.textMuted,fontWeight:'500'}}>Rate</span><span style={{width:'40px'}}></span></div>{invoiceForm.items.map((item,idx)=>(<div key={idx} style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr auto',gap:'8px',marginBottom:'8px'}}><input type="text" placeholder="e.g. Web Development" value={item.description} onChange={e=>{const items=[...invoiceForm.items];items[idx].description=e.target.value;setInvoiceForm(p=>({...p,items}));}} style={input}/><input type="number" placeholder="0" value={item.hours} onChange={e=>{const items=[...invoiceForm.items];items[idx].hours=parseFloat(e.target.value)||0;setInvoiceForm(p=>({...p,items}));}} style={input}/><input type="number" placeholder="0" value={item.rate} onChange={e=>{const items=[...invoiceForm.items];items[idx].rate=parseFloat(e.target.value)||0;setInvoiceForm(p=>({...p,items}));}} style={input}/>{invoiceForm.items.length>1&&<button onClick={()=>setInvoiceForm(p=>({...p,items:p.items.filter((_,i)=>i!==idx)}))} style={{...btnGhost,width:'40px',padding:0,color:'#ef4444'}}><Trash2 style={{width:'14px',height:'14px'}}/></button>}{invoiceForm.items.length===1&&<span style={{width:'40px'}}></span>}</div>))}<button onClick={()=>setInvoiceForm(p=>({...p,items:[...p.items,{description:'',hours:1,rate:0}]}))} style={{...btnGhost,justifyContent:'flex-start'}}><Plus style={{width:'14px',height:'14px'}}/>Add Line</button></div><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'}}><div><label style={label}>Status</label><select value={invoiceForm.status} onChange={e=>setInvoiceForm(p=>({...p,status:e.target.value}))} style={select}>{STATUSES.map(s=><option key={s.id} value={s.id}>{s.label}</option>)}</select></div><div style={{padding:'12px',backgroundColor:theme.statBg,borderRadius:'8px',textAlign:'center'}}><p style={{fontSize:'12px',color:theme.textMuted,margin:'0 0 4px'}}>Total</p><p style={{fontSize:'20px',fontWeight:'700',color:theme.text,margin:0}}>{getSymbol(invoiceForm.currency)}{formatAmount(invoiceForm.items.reduce((s,i)=>s+((i.hours||1)*i.rate),0))}</p></div></div></div><div style={{padding:'20px',borderTop:'1px solid ' + theme.cardBorder,display:'flex',gap:'12px',justifyContent:'flex-end'}}><button onClick={()=>{setShowInvoiceForm(false);setEditingInvoice(null);}} style={btnOutline}>Cancel</button><button onClick={saveInvoice} disabled={!invoiceForm.clientId} style={{...btnPrimary,opacity:invoiceForm.clientId?1:0.5}}>{editingInvoice?'Update':'Create'} Invoice</button></div></div></div>)}

      {viewingInvoice && (<div style={{position:'fixed',inset:0,backgroundColor:'rgba(0,0,0,0.6)',display:'flex',alignItems:'center',justifyContent:'center',padding:'16px',zIndex:50}} onClick={()=>setViewingInvoice(null)}><div style={{width:'100%',maxWidth:'500px',backgroundColor:theme.cardBg,borderRadius:'12px',border:'1px solid ' + theme.cardBorder,maxHeight:'90vh',overflow:'auto'}} onClick={e=>e.stopPropagation()}><div style={{padding:'20px',borderBottom:'1px solid ' + theme.cardBorder,display:'flex',justifyContent:'space-between',alignItems:'center'}}><div><h3 style={{fontSize:'18px',fontWeight:'600',color:theme.text,margin:0}}>{viewingInvoice.invoiceNumber}</h3><p style={{fontSize:'13px',color:theme.textMuted,margin:'4px 0 0'}}>{viewingInvoice.clientName}</p></div><button onClick={()=>setViewingInvoice(null)} style={{...btnGhost,width:'36px',height:'36px',padding:0}}><X style={{width:'18px',height:'18px'}}/></button></div><div style={{padding:'20px'}}><div style={{display:'flex',justifyContent:'space-between',marginBottom:'20px'}}><div><p style={{fontSize:'13px',color:theme.textMuted,margin:0}}>Issue Date</p><p style={{fontSize:'14px',color:theme.text,margin:'4px 0 0'}}>{viewingInvoice.issueDate}</p></div><div style={{textAlign:'right'}}><p style={{fontSize:'13px',color:theme.textMuted,margin:0}}>Due Date</p><p style={{fontSize:'14px',color:theme.text,margin:'4px 0 0'}}>{viewingInvoice.dueDate||'Not set'}</p></div></div><div style={{marginBottom:'20px'}}><p style={{fontSize:'13px',fontWeight:'600',color:theme.textMuted,margin:'0 0 12px'}}>Line Items</p>{viewingInvoice.items?.map((item,idx)=>(<div key={idx} style={{display:'flex',justifyContent:'space-between',padding:'12px',backgroundColor:theme.statBg,borderRadius:'8px',marginBottom:'8px'}}><div><p style={{fontSize:'14px',color:theme.text,margin:0}}>{item.description||'Service'}</p><p style={{fontSize:'12px',color:theme.textMuted,margin:'4px 0 0'}}>{item.hours} hrs × {getSymbol(viewingInvoice.currency)}{item.rate}</p></div><p style={{fontSize:'14px',fontWeight:'600',color:theme.text,margin:0}}>{getSymbol(viewingInvoice.currency)}{formatAmount((item.hours||1)*item.rate)}</p></div>))}</div><div style={{padding:'16px',backgroundColor:isDark?'#22c55e15':'#22c55e10',borderRadius:'8px',display:'flex',justifyContent:'space-between',alignItems:'center'}}><span style={{fontSize:'16px',fontWeight:'600',color:theme.text}}>Total</span><div style={{textAlign:'right'}}><p style={{fontSize:'24px',fontWeight:'700',color:'#22c55e',margin:0}}>{getSymbol(viewingInvoice.currency)}{formatAmount(viewingInvoice.total)}</p><p style={{fontSize:'13px',color:theme.textMuted,margin:'4px 0 0'}}>₱{formatAmount(viewingInvoice.phpTotal)}</p></div></div></div></div></div>)}

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
              <div style={{marginTop:'16px',padding:'12px',backgroundColor:isDark?'#3b82f615':'#3b82f610',borderRadius:'8px',border:'1px solid #3b82f640'}}>
                <div style={{display:'flex',alignItems:'flex-start',gap:'10px'}}>
                  <Info style={{width:'16px',height:'16px',color:'#3b82f6',flexShrink:0,marginTop:'2px'}}/>
                  <p style={{fontSize:'13px',color:theme.textMuted,margin:0,lineHeight:'1.5'}}>
                    Copy this email template and paste it into your email client. Don't forget to replace <strong style={{color:theme.text}}>[Your Name]</strong> with your actual name before sending!
                  </p>
                </div>
              </div>
            </div>
            <div style={{padding:'20px',borderTop:'1px solid ' + theme.cardBorder,display:'flex',gap:'12px',justifyContent:'flex-end'}}>
              <button onClick={()=>{setEmailModal({show:false,invoice:null});setEmailCopied(false);}} style={btnOutline}>Close</button>
              <button 
                onClick={()=>copyEmailToClipboard(generateInvoiceEmail(emailModal.invoice))} 
                style={{
                  ...btnPrimary,
                  backgroundColor: emailCopied ? '#22c55e' : '#8b5cf6',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                {emailCopied ? <CheckCircle style={{width:'16px',height:'16px'}}/> : <Copy style={{width:'16px',height:'16px'}}/>}
                {emailCopied ? 'Copied!' : 'Copy to Clipboard'}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteModal.show && (<div style={{position:'fixed',inset:0,backgroundColor:'rgba(0,0,0,0.7)',display:'flex',alignItems:isSmall?'flex-end':'center',justifyContent:'center',padding:isSmall?0:'16px',zIndex:60}} onClick={()=>setDeleteModal({show:false,type:'',id:null,name:''})}><div style={{width:'100%',maxWidth:isSmall?'100%':'360px',backgroundColor:theme.cardBg,borderRadius:isSmall?'16px 16px 0 0':'12px',border:'1px solid ' + theme.cardBorder,borderBottom:isSmall?'none':('1px solid ' + theme.cardBorder),overflow:'hidden'}} onClick={e=>e.stopPropagation()}><div style={{padding:isSmall?'20px 20px 16px':'20px',textAlign:'center'}}><div style={{width:'48px',height:'48px',backgroundColor:isDark?'#ef444420':'#ef444410',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 12px'}}><Trash2 style={{width:'24px',height:'24px',color:'#ef4444'}}/></div><h3 style={{fontSize:'16px',fontWeight:'600',color:theme.text,margin:'0 0 6px'}}>Delete {deleteModal.type === 'prospect' ? 'Prospect' : deleteModal.type === 'client' ? 'Client' : deleteModal.type === 'invoice' ? 'Invoice' : 'Income'}?</h3><p style={{fontSize:'13px',color:theme.textMuted,margin:0,lineHeight:'1.4'}}><strong style={{color:theme.text}}>{deleteModal.name}</strong></p>{deleteModal.type === 'client' && <p style={{fontSize:'12px',color:'#f59e0b',margin:'8px 0 0'}}>⚠️ Income entries will also be removed</p>}</div><div style={{padding:isSmall?'12px 16px 24px':'12px 20px 16px',display:'flex',gap:'10px'}}><button onClick={()=>setDeleteModal({show:false,type:'',id:null,name:''})} style={{flex:1,height:'44px',backgroundColor:'transparent',color:theme.text,border:'1px solid ' + theme.cardBorder,borderRadius:'10px',fontSize:'14px',fontWeight:'500',cursor:'pointer'}}>Cancel</button><button onClick={confirmDelete} style={{flex:1,height:'44px',backgroundColor:'#ef4444',color:'#fff',border:'none',borderRadius:'10px',fontSize:'14px',fontWeight:'500',cursor:'pointer'}}>Delete</button></div></div></div>)}
    </>
  );
};

export default VAKita;
