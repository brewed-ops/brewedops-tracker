/**
 * MermaidReader Component
 * - Wide preview layout (code collapsed by default)
 * - Auto-color feature for flowcharts
 * - Pan & zoom whiteboard preview
 * - Save diagrams (max 10 per user)
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import mermaid from 'mermaid';
import { supabase } from '../lib/supabase';
import { Copy, Check, Download, RefreshCw, Code, Eye, Trash2, ChevronDown, GitBranch, ZoomIn, ZoomOut, Move, PanelLeftClose, PanelLeft, RotateCcw, Save, X, FileText, Clock, Loader2, FolderOpen, Wand2 } from 'lucide-react';

const BRAND = {
  brown: '#3F200C',
  blue: '#004AAC',
  green: '#51AF43',
};

const FONTS = {
  heading: "'Montserrat', sans-serif",
  body: "'Poppins', sans-serif",
};

const getTheme = (isDark) => ({
  bg: isDark ? '#09090b' : '#f8fafc',
  cardBg: isDark ? '#18181b' : '#ffffff',
  cardBorder: isDark ? '#27272a' : '#e4e4e7',
  text: isDark ? '#fafafa' : '#09090b',
  textMuted: isDark ? '#a1a1aa' : '#71717a',
  inputBg: isDark ? '#27272a' : '#f4f4f5',
});

const MAX_SAVED_DIAGRAMS = 10;

// Color class definitions for auto-coloring
const COLOR_CLASSES = `
    classDef start fill:#fef3c7,stroke:#f59e0b,stroke-width:2px,color:#92400e
    classDef process fill:#dbeafe,stroke:#3b82f6,stroke-width:2px,color:#1e40af
    classDef decision fill:#f3e8ff,stroke:#a855f7,stroke-width:2px,color:#6b21a8
    classDef success fill:#dcfce7,stroke:#22c55e,stroke-width:2px,color:#166534
    classDef error fill:#fee2e2,stroke:#ef4444,stroke-width:2px,color:#991b1b
    classDef warning fill:#fef9c3,stroke:#eab308,stroke-width:2px,color:#854d0e
    classDef endNode fill:#d1fae5,stroke:#10b981,stroke-width:2px,color:#065f46`;

// Sample Templates
const TEMPLATES = [
  {
    name: 'Colorful Flowchart',
    code: `flowchart TD
    A([🚀 Start]):::start --> B[Process Data]:::process
    B --> C{Is Valid?}:::decision
    C -->|Yes| D[✅ Save to DB]:::success
    C -->|No| E[❌ Show Error]:::error
    D --> F[Send Email]:::process
    E --> G[Log Error]:::warning
    F --> H([🏁 End]):::endNode
    G --> H

    classDef start fill:#fef3c7,stroke:#f59e0b,stroke-width:2px,color:#92400e
    classDef process fill:#dbeafe,stroke:#3b82f6,stroke-width:2px,color:#1e40af
    classDef decision fill:#f3e8ff,stroke:#a855f7,stroke-width:2px,color:#6b21a8
    classDef success fill:#dcfce7,stroke:#22c55e,stroke-width:2px,color:#166534
    classDef error fill:#fee2e2,stroke:#ef4444,stroke-width:2px,color:#991b1b
    classDef warning fill:#fef9c3,stroke:#eab308,stroke-width:2px,color:#854d0e
    classDef endNode fill:#d1fae5,stroke:#10b981,stroke-width:2px,color:#065f46`,
  },
  {
    name: 'Simple Flowchart',
    code: `flowchart TD
    A[Start] --> B{Decision?}
    B -->|Yes| C[Action 1]
    B -->|No| D[Action 2]
    C --> E[End]
    D --> E`,
  },
  {
    name: 'Sequence Diagram',
    code: `sequenceDiagram
    participant U as 👤 User
    participant A as 📱 App
    participant S as 🖥️ Server
    participant D as 🗄️ Database
    
    U->>A: Click Login
    A->>S: POST /auth/login
    S->>D: Query user
    D-->>S: User data
    S-->>A: JWT Token
    A-->>U: Redirect to Dashboard`,
  },
  {
    name: 'Lead Flow',
    code: `flowchart TD
    Start([New Lead]) --> A[Review]
    A --> B{Qualified?}
    B -->|Yes| C[Schedule Call]
    B -->|No| D[Send Rejection]
    C --> E{Call Done?}
    E -->|Yes| F[Create Proposal]
    E -->|No| G[Reschedule]
    G --> C
    F --> End([Close])
    D --> End`,
  },
  {
    name: 'Gantt Chart',
    code: `gantt
    title Project Timeline
    dateFormat YYYY-MM-DD
    section Planning
      Research        :a1, 2024-01-01, 7d
      Requirements    :a2, after a1, 5d
    section Development
      Frontend        :b1, after a2, 14d
      Backend         :b2, after a2, 14d
    section Launch
      Deploy          :c1, after b1, 2d`,
  },
  {
    name: 'Pie Chart',
    code: `pie showData
    title Tool Usage
    "Image Tools" : 42
    "PDF Tools" : 25
    "Video Tools" : 15
    "Other" : 18`,
  },
];

// Auto-color function for flowcharts
const autoColorFlowchart = (code) => {
  if (!code.trim().toLowerCase().startsWith('flowchart')) {
    return code;
  }

  // Remove existing classDef and class assignments
  let cleanCode = code
    .replace(/:::\w+/g, '')
    .replace(/\n\s*classDef\s+.*/g, '')
    .replace(/\n\s*class\s+.*/g, '')
    .trim();

  const lines = cleanCode.split('\n');
  const processedLines = lines.map(line => {
    if (line.trim().startsWith('%%') || !line.trim()) return line;
    
    let processedLine = line;
    
    // Stadium/pill shape - usually start/end: ([...])
    processedLine = processedLine.replace(/(\w+)\(\[([^\]]*)\]\)(?!:::)/g, (match, nodeId, text) => {
      const lower = text.toLowerCase();
      if (lower.includes('start') || lower.includes('begin') || lower.includes('🚀') || lower.includes('new')) return `${match}:::start`;
      if (lower.includes('end') || lower.includes('done') || lower.includes('finish') || lower.includes('🏁') || lower.includes('close') || lower.includes('archive')) return `${match}:::endNode`;
      return `${match}:::process`;
    });
    
    // Circle shape: ((text))
    processedLine = processedLine.replace(/(\w+)\(\(([^)]*)\)\)(?!:::)/g, (match) => `${match}:::start`);
    
    // Diamond/decision shape: {text} or {text?}
    processedLine = processedLine.replace(/(\w+)\{([^}]*)\}(?!:::)/g, (match) => `${match}:::decision`);
    
    // Rectangle shape: [text]
    processedLine = processedLine.replace(/(\w+)\[([^\]]*)\](?!:::)/g, (match, nodeId, text) => {
      const lower = text.toLowerCase();
      if (lower.includes('✅') || lower.includes('success') || lower.includes('save') || lower.includes('complete') || lower.includes('approve') || lower.includes('accept')) return `${match}:::success`;
      if (lower.includes('❌') || lower.includes('error') || lower.includes('fail') || lower.includes('reject') || lower.includes('cancel') || lower.includes('delete')) return `${match}:::error`;
      if (lower.includes('⚠') || lower.includes('warn') || lower.includes('retry') || lower.includes('reschedule') || lower.includes('wait') || lower.includes('log') || lower.includes('pending')) return `${match}:::warning`;
      return `${match}:::process`;
    });

    return processedLine;
  });

  return processedLines.join('\n') + '\n' + COLOR_CLASSES;
};

// Save Modal Component
const SaveModal = ({ isOpen, onClose, onSave, isDark, theme, isLoading, currentName }) => {
  const [name, setName] = useState(currentName || '');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setName(currentName || '');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, currentName]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) onSave(name.trim());
  };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={onClose}>
      <div style={{ backgroundColor: theme.cardBg, borderRadius: '12px', border: '1px solid ' + theme.cardBorder, padding: '24px', width: '100%', maxWidth: '400px', margin: '20px' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: theme.text, margin: 0, fontFamily: FONTS.heading }}>Save Diagram</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: theme.textMuted, cursor: 'pointer', padding: '4px' }}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: theme.textMuted, marginBottom: '6px', fontFamily: FONTS.body }}>Diagram Name</label>
          <input
            ref={inputRef}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., User Login Flow"
            maxLength={50}
            style={{ width: '100%', height: '44px', padding: '0 12px', backgroundColor: theme.inputBg, border: '1px solid ' + theme.cardBorder, borderRadius: '8px', fontSize: '14px', color: theme.text, fontFamily: FONTS.body, outline: 'none', boxSizing: 'border-box' }}
          />
          <p style={{ fontSize: '11px', color: theme.textMuted, margin: '6px 0 0', fontFamily: FONTS.body }}>{name.length}/50 characters</p>

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button type="button" onClick={onClose} style={{ flex: 1, height: '40px', backgroundColor: 'transparent', border: '1px solid ' + theme.cardBorder, borderRadius: '8px', color: theme.text, fontSize: '13px', fontWeight: '500', fontFamily: FONTS.body, cursor: 'pointer' }}>Cancel</button>
            <button type="submit" disabled={!name.trim() || isLoading} style={{ flex: 1, height: '40px', backgroundColor: name.trim() ? BRAND.blue : theme.cardBorder, border: 'none', borderRadius: '8px', color: '#fff', fontSize: '13px', fontWeight: '600', fontFamily: FONTS.body, cursor: name.trim() && !isLoading ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              {isLoading ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={14} />}
              {isLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main Component
const MermaidReader = ({ isDark = true, user = null }) => {
  const theme = getTheme(isDark);
  const [code, setCode] = useState(TEMPLATES[1].code);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [svgContent, setSvgContent] = useState('');
  const [key, setKey] = useState(0);
  const [isCodeCollapsed, setIsCodeCollapsed] = useState(true); // Collapsed by default
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Save state
  const [savedDiagrams, setSavedDiagrams] = useState([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingDiagrams, setIsLoadingDiagrams] = useState(false);
  const [currentDiagramId, setCurrentDiagramId] = useState(null);
  const [currentDiagramName, setCurrentDiagramName] = useState('');
  
  // Pan & Zoom state
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const previewRef = useRef(null);
  const templateRef = useRef(null);
  const svgRef = useRef(null);

  useEffect(() => { if (user) loadSavedDiagrams(); }, [user]);

  const loadSavedDiagrams = async () => {
    if (!user) return;
    setIsLoadingDiagrams(true);
    try {
      const { data, error } = await supabase.from('mermaid_diagrams').select('*').eq('user_id', user.id).order('updated_at', { ascending: false });
      if (error) throw error;
      setSavedDiagrams(data || []);
    } catch (err) { console.error('Failed to load:', err); }
    finally { setIsLoadingDiagrams(false); }
  };

  const saveDiagram = async (name) => {
    if (!user || !code.trim()) return;
    setIsSaving(true);
    try {
      if (!currentDiagramId && savedDiagrams.length >= MAX_SAVED_DIAGRAMS) {
        alert(`Maximum ${MAX_SAVED_DIAGRAMS} diagrams. Delete one first.`);
        setIsSaving(false);
        return;
      }
      if (currentDiagramId) {
        const { error } = await supabase.from('mermaid_diagrams').update({ name, code, updated_at: new Date().toISOString() }).eq('id', currentDiagramId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from('mermaid_diagrams').insert({ user_id: user.id, name, code }).select().single();
        if (error) throw error;
        setCurrentDiagramId(data.id);
      }
      setCurrentDiagramName(name);
      setShowSaveModal(false);
      await loadSavedDiagrams();
    } catch (err) { console.error('Failed to save:', err); alert('Failed to save.'); }
    finally { setIsSaving(false); }
  };

  const loadDiagram = (d) => { setCode(d.code); setCurrentDiagramId(d.id); setCurrentDiagramName(d.name); setKey((k) => k + 1); setIsSidebarOpen(false); };
  const deleteDiagram = async (id) => {
    if (!confirm('Delete this diagram?')) return;
    try {
      const { error } = await supabase.from('mermaid_diagrams').delete().eq('id', id);
      if (error) throw error;
      if (currentDiagramId === id) { setCurrentDiagramId(null); setCurrentDiagramName(''); }
      await loadSavedDiagrams();
    } catch (err) { console.error('Failed to delete:', err); }
  };
  const createNewDiagram = () => { setCode(TEMPLATES[1].code); setCurrentDiagramId(null); setCurrentDiagramName(''); setKey((k) => k + 1); setIsSidebarOpen(false); };
  const handleAutoColor = () => { setCode(autoColorFlowchart(code)); setKey((k) => k + 1); };

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'base',
      themeVariables: isDark ? {
        primaryColor: '#6366f1', primaryTextColor: '#fff', primaryBorderColor: '#818cf8',
        secondaryColor: '#8b5cf6', tertiaryColor: '#14b8a6', lineColor: '#6b7280',
        textColor: '#f3f4f6', mainBkg: '#1f2937', nodeBorder: '#4b5563',
        pie1: '#6366f1', pie2: '#8b5cf6', pie3: '#ec4899', pie4: '#22c55e', pie5: '#f59e0b', pie6: '#ef4444',
      } : {
        primaryColor: '#6366f1', primaryTextColor: '#fff', primaryBorderColor: '#4f46e5',
        secondaryColor: '#8b5cf6', tertiaryColor: '#14b8a6', lineColor: '#6b7280',
        textColor: '#1f2937', mainBkg: '#f3f4f6', nodeBorder: '#d1d5db',
        pie1: '#6366f1', pie2: '#8b5cf6', pie3: '#ec4899', pie4: '#22c55e', pie5: '#f59e0b', pie6: '#ef4444',
      },
      securityLevel: 'loose',
      fontFamily: FONTS.body,
      flowchart: { useMaxWidth: false, htmlLabels: true, curve: 'basis' },
      sequence: { useMaxWidth: false, wrap: true },
      gantt: { useMaxWidth: false },
    });
  }, [isDark]);

  const renderDiagram = useCallback(async () => {
    if (!code.trim()) { setError(''); setSvgContent(''); return; }
    try {
      await mermaid.parse(code);
      const id = `mermaid-${Date.now()}`;
      const { svg } = await mermaid.render(id, code);
      setSvgContent(svg);
      setError('');
      setScale(1);
      setPosition({ x: 0, y: 0 });
    } catch (err) { setError(err.message || 'Invalid syntax'); setSvgContent(''); }
  }, [code]);

  useEffect(() => { const t = setTimeout(() => renderDiagram(), 500); return () => clearTimeout(t); }, [code, renderDiagram, isDark, key]);

  const handleMouseDown = (e) => { if (e.button !== 0) return; setIsDragging(true); setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y }); };
  const handleMouseMove = (e) => { if (!isDragging) return; setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y }); };
  const handleMouseUp = () => setIsDragging(false);
  const handleTouchStart = (e) => { const t = e.touches[0]; setIsDragging(true); setDragStart({ x: t.clientX - position.x, y: t.clientY - position.y }); };
  const handleTouchMove = (e) => { if (!isDragging) return; const t = e.touches[0]; setPosition({ x: t.clientX - dragStart.x, y: t.clientY - dragStart.y }); };
  const handleWheel = (e) => { e.preventDefault(); setScale((p) => Math.min(Math.max(p + (e.deltaY > 0 ? -0.1 : 0.1), 0.2), 4)); };

  const zoomIn = () => setScale((p) => Math.min(p + 0.25, 4));
  const zoomOut = () => setScale((p) => Math.max(p - 0.25, 0.2));
  const resetView = () => { setScale(1); setPosition({ x: 0, y: 0 }); };
  const handleCopy = async () => { await navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  const handleDownloadSVG = () => {
    if (!svgContent) return;
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${currentDiagramName || 'diagram'}.svg`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadPNG = () => {
    if (!svgContent) return;
    const container = document.createElement('div');
    container.innerHTML = svgContent;
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    document.body.appendChild(container);
    const svgEl = container.querySelector('svg');
    if (!svgEl) { document.body.removeChild(container); return; }
    const bbox = svgEl.getBoundingClientRect();
    const w = Math.max(bbox.width, parseFloat(svgEl.getAttribute('width')) || 800);
    const h = Math.max(bbox.height, parseFloat(svgEl.getAttribute('height')) || 600);
    svgEl.setAttribute('width', w);
    svgEl.setAttribute('height', h);
    const svgStr = new XMLSerializer().serializeToString(svgEl);
    const svgBlob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = w * 2; canvas.height = h * 2;
      const ctx = canvas.getContext('2d');
      ctx.scale(2, 2);
      ctx.fillStyle = isDark ? '#18181b' : '#ffffff';
      ctx.fillRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);
      canvas.toBlob((blob) => {
        const pngUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = pngUrl; a.download = `${currentDiagramName || 'diagram'}.png`;
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        URL.revokeObjectURL(pngUrl);
      }, 'image/png');
      URL.revokeObjectURL(url);
      document.body.removeChild(container);
    };
    img.onerror = () => { URL.revokeObjectURL(url); document.body.removeChild(container); };
    img.src = url;
  };

  const loadTemplate = (t) => { setCode(t.code); setCurrentDiagramId(null); setCurrentDiagramName(''); setShowTemplates(false); setKey((k) => k + 1); };

  useEffect(() => {
    const h = (e) => { if (templateRef.current && !templateRef.current.contains(e.target)) setShowTemplates(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const btnStyle = { height: '32px', padding: '0 10px', backgroundColor: 'transparent', border: '1px solid ' + theme.cardBorder, borderRadius: '6px', color: theme.textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '12px', fontFamily: FONTS.body };
  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <div style={{ maxWidth: '100%', margin: '0 auto', padding: '0', position: 'relative' }}>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

      {/* Header */}
      <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <GitBranch size={18} style={{ color: '#fff' }} />
            </div>
            <h1 style={{ fontSize: '20px', fontWeight: '700', color: theme.text, margin: 0, fontFamily: FONTS.heading }}>Mermaid Diagram Viewer</h1>
            {currentDiagramName && <span style={{ fontSize: '13px', color: theme.textMuted, fontFamily: FONTS.body }}>— {currentDiagramName}</span>}
          </div>
          <p style={{ fontSize: '13px', color: theme.textMuted, margin: 0, fontFamily: FONTS.body }}>Create flowcharts, sequence diagrams, and more</p>
        </div>
        {user && (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => setIsSidebarOpen(true)} style={btnStyle}><FolderOpen size={14} /> My Diagrams ({savedDiagrams.length}/{MAX_SAVED_DIAGRAMS})</button>
            <button onClick={() => setShowSaveModal(true)} disabled={!svgContent} style={{ ...btnStyle, backgroundColor: svgContent ? BRAND.blue : 'transparent', borderColor: svgContent ? BRAND.blue : theme.cardBorder, color: svgContent ? '#fff' : theme.textMuted, opacity: svgContent ? 1 : 0.5 }}>
              <Save size={14} /> {currentDiagramId ? 'Update' : 'Save'}
            </button>
          </div>
        )}
      </div>

      {/* Main Content - Full width */}
      <div style={{ display: 'flex', gap: '12px', height: 'calc(100vh - 200px)', minHeight: '500px' }}>
        {/* Code Panel - Collapsible */}
        {!isCodeCollapsed && (
          <div style={{ width: '320px', minWidth: '280px', maxWidth: '320px', flexShrink: 0, backgroundColor: theme.cardBg, borderRadius: '12px', border: '1px solid ' + theme.cardBorder, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '10px 12px', borderBottom: '1px solid ' + theme.cardBorder, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Code size={14} style={{ color: theme.textMuted }} /><span style={{ fontSize: '12px', fontWeight: '600', color: theme.text, fontFamily: FONTS.body }}>Code</span></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div ref={templateRef} style={{ position: 'relative' }}>
                  <button onClick={() => setShowTemplates(!showTemplates)} style={btnStyle}>Templates <ChevronDown size={12} /></button>
                  {showTemplates && (
                    <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '4px', backgroundColor: theme.cardBg, border: '1px solid ' + theme.cardBorder, borderRadius: '8px', boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.5)' : '0 8px 32px rgba(0,0,0,0.15)', padding: '6px', zIndex: 100, minWidth: '180px' }}>
                      {TEMPLATES.map((t, i) => (<button key={i} onClick={() => loadTemplate(t)} style={{ width: '100%', padding: '8px 10px', backgroundColor: 'transparent', border: 'none', borderRadius: '6px', cursor: 'pointer', textAlign: 'left', fontSize: '12px', color: theme.text, fontFamily: FONTS.body }}>{t.name}</button>))}
                    </div>
                  )}
                </div>
                <button onClick={handleCopy} style={{ ...btnStyle, width: '32px', padding: 0 }} title="Copy">{copied ? <Check size={14} style={{ color: BRAND.green }} /> : <Copy size={14} />}</button>
                <button onClick={() => { setCode(''); setSvgContent(''); setCurrentDiagramId(null); setCurrentDiagramName(''); }} style={{ ...btnStyle, width: '32px', padding: 0 }} title="Clear"><Trash2 size={14} /></button>
              </div>
            </div>
            <div style={{ padding: '8px 12px', borderBottom: '1px solid ' + theme.cardBorder }}>
              <button onClick={handleAutoColor} style={{ ...btnStyle, width: '100%', backgroundColor: isDark ? '#3730a3' : '#eef2ff', borderColor: isDark ? '#4f46e5' : '#c7d2fe', color: isDark ? '#a5b4fc' : '#4338ca' }} title="Auto-color flowchart"><Wand2 size={14} /> Auto Color</button>
            </div>
            <textarea value={code} onChange={(e) => setCode(e.target.value)} placeholder="Enter Mermaid code..." spellCheck={false} style={{ flex: 1, padding: '12px', backgroundColor: isDark ? '#0a0a0b' : '#fafafa', border: 'none', outline: 'none', resize: 'none', fontSize: '12px', fontFamily: "'Fira Code', 'Consolas', monospace", color: isDark ? '#e4e4e7' : '#27272a', lineHeight: '1.7' }} />
            {error && <div style={{ padding: '10px 12px', backgroundColor: isDark ? '#451a1a' : '#fef2f2', borderTop: '1px solid ' + (isDark ? '#7f1d1d' : '#fecaca'), color: isDark ? '#fca5a5' : '#dc2626', fontSize: '11px', fontFamily: FONTS.body }}>⚠️ {error}</div>}
          </div>
        )}

        {/* Preview Panel - Takes full width when code collapsed */}
        <div style={{ flex: 1, backgroundColor: theme.cardBg, borderRadius: '12px', border: '1px solid ' + theme.cardBorder, overflow: 'hidden', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <div style={{ padding: '10px 12px', borderBottom: '1px solid ' + theme.cardBorder, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button onClick={() => setIsCodeCollapsed(!isCodeCollapsed)} style={{ ...btnStyle, width: '32px', padding: 0, backgroundColor: isCodeCollapsed ? (isDark ? '#27272a' : '#f4f4f5') : 'transparent' }} title={isCodeCollapsed ? 'Show Code' : 'Hide Code'}>{isCodeCollapsed ? <PanelLeft size={14} /> : <PanelLeftClose size={14} />}</button>
              <Eye size={14} style={{ color: theme.textMuted }} />
              <span style={{ fontSize: '12px', fontWeight: '600', color: theme.text, fontFamily: FONTS.body }}>Preview</span>
              <span style={{ fontSize: '11px', color: theme.textMuted, backgroundColor: isDark ? '#27272a' : '#f4f4f5', padding: '2px 8px', borderRadius: '4px' }}>{Math.round(scale * 100)}%</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
              {isCodeCollapsed && (
                <button onClick={handleAutoColor} style={{ ...btnStyle, backgroundColor: isDark ? '#3730a3' : '#eef2ff', borderColor: isDark ? '#4f46e5' : '#c7d2fe', color: isDark ? '#a5b4fc' : '#4338ca' }}><Wand2 size={14} /> Auto Color</button>
              )}
              <button onClick={zoomOut} style={{ ...btnStyle, width: '32px', padding: 0 }} title="Zoom Out"><ZoomOut size={14} /></button>
              <button onClick={zoomIn} style={{ ...btnStyle, width: '32px', padding: 0 }} title="Zoom In"><ZoomIn size={14} /></button>
              <button onClick={resetView} style={{ ...btnStyle, width: '32px', padding: 0 }} title="Reset"><RotateCcw size={14} /></button>
              <div style={{ width: '1px', height: '20px', backgroundColor: theme.cardBorder, margin: '0 4px' }} />
              <button onClick={() => setKey((k) => k + 1)} style={{ ...btnStyle, width: '32px', padding: 0 }} title="Refresh"><RefreshCw size={14} /></button>
              <button onClick={handleDownloadSVG} disabled={!svgContent} style={{ ...btnStyle, opacity: svgContent ? 1 : 0.5 }}><Download size={14} /> SVG</button>
              <button onClick={handleDownloadPNG} disabled={!svgContent} style={{ ...btnStyle, backgroundColor: svgContent ? '#6366f1' : 'transparent', borderColor: svgContent ? '#6366f1' : theme.cardBorder, color: svgContent ? '#fff' : theme.textMuted, opacity: svgContent ? 1 : 0.5 }}><Download size={14} /> PNG</button>
            </div>
          </div>

          <div ref={previewRef} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleMouseUp} onWheel={handleWheel} style={{ flex: 1, overflow: 'hidden', cursor: isDragging ? 'grabbing' : 'grab', backgroundColor: isDark ? '#0a0a0b' : '#f8fafc', backgroundImage: isDark ? 'radial-gradient(circle, #27272a 1px, transparent 1px)' : 'radial-gradient(circle, #d4d4d8 1px, transparent 1px)', backgroundSize: '24px 24px', position: 'relative', userSelect: 'none' }}>
            {svgContent ? (
              <div ref={svgRef} style={{ position: 'absolute', left: '50%', top: '50%', transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px)) scale(${scale})`, transformOrigin: 'center', transition: isDragging ? 'none' : 'transform 0.1s', padding: '40px', backgroundColor: isDark ? '#18181b' : '#fff', borderRadius: '12px', boxShadow: isDark ? '0 4px 24px rgba(0,0,0,0.4)' : '0 4px 24px rgba(0,0,0,0.08)' }} dangerouslySetInnerHTML={{ __html: svgContent }} />
            ) : (
              <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', color: theme.textMuted }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', opacity: 0.3 }}><GitBranch size={32} style={{ color: '#fff' }} /></div>
                <p style={{ fontSize: '14px', margin: 0, fontFamily: FONTS.body }}>{error ? 'Fix syntax error' : 'Enter code to preview'}</p>
              </div>
            )}
          </div>

          <div style={{ padding: '8px 12px', borderTop: '1px solid ' + theme.cardBorder, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', backgroundColor: isDark ? '#0f0f10' : '#fafafa' }}>
            <span style={{ fontSize: '11px', color: theme.textMuted, fontFamily: FONTS.body, display: 'flex', alignItems: 'center', gap: '4px' }}><Move size={12} /> Drag to pan</span>
            <span style={{ fontSize: '11px', color: theme.textMuted, fontFamily: FONTS.body, display: 'flex', alignItems: 'center', gap: '4px' }}><ZoomIn size={12} /> Scroll to zoom</span>
            <span style={{ fontSize: '11px', color: theme.textMuted, fontFamily: FONTS.body, display: 'flex', alignItems: 'center', gap: '4px' }}><PanelLeft size={12} /> {isCodeCollapsed ? 'Show' : 'Hide'} code</span>
          </div>
        </div>
      </div>

      {/* Saved Diagrams Sidebar */}
      {isSidebarOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 999 }} onClick={() => setIsSidebarOpen(false)}>
          <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '320px', backgroundColor: theme.cardBg, borderLeft: '1px solid ' + theme.cardBorder, display: 'flex', flexDirection: 'column' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '16px', borderBottom: '1px solid ' + theme.cardBorder, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: theme.text, margin: 0, fontFamily: FONTS.heading }}>My Diagrams ({savedDiagrams.length}/{MAX_SAVED_DIAGRAMS})</h3>
              <button onClick={() => setIsSidebarOpen(false)} style={{ background: 'none', border: 'none', color: theme.textMuted, cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <div style={{ padding: '12px 16px' }}>
              <button onClick={createNewDiagram} style={{ width: '100%', height: '40px', backgroundColor: BRAND.blue, border: 'none', borderRadius: '8px', color: '#fff', fontSize: '13px', fontWeight: '600', fontFamily: FONTS.body, cursor: 'pointer' }}>+ New Diagram</button>
            </div>
            <div style={{ flex: 1, overflow: 'auto', padding: '0 16px 16px' }}>
              {isLoadingDiagrams ? (<div style={{ textAlign: 'center', padding: '40px 0', color: theme.textMuted }}><Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} /></div>
              ) : savedDiagrams.length === 0 ? (<div style={{ textAlign: 'center', padding: '40px 0', color: theme.textMuted }}><FileText size={32} style={{ marginBottom: '8px', opacity: 0.3 }} /><p style={{ fontSize: '13px', margin: 0 }}>No saved diagrams</p></div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {savedDiagrams.map((d) => (
                    <div key={d.id} style={{ padding: '12px', backgroundColor: currentDiagramId === d.id ? (isDark ? '#27272a' : '#f4f4f5') : 'transparent', border: '1px solid ' + (currentDiagramId === d.id ? BRAND.blue : theme.cardBorder), borderRadius: '8px', cursor: 'pointer' }} onClick={() => loadDiagram(d)}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontSize: '13px', fontWeight: '600', color: theme.text }}>{d.name}</span>
                        <button onClick={(e) => { e.stopPropagation(); deleteDiagram(d.id); }} style={{ background: 'none', border: 'none', color: theme.textMuted, cursor: 'pointer', padding: '4px' }}><Trash2 size={14} /></button>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={10} style={{ color: theme.textMuted }} /><span style={{ fontSize: '11px', color: theme.textMuted }}>{formatDate(d.updated_at)}</span></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <SaveModal isOpen={showSaveModal} onClose={() => setShowSaveModal(false)} onSave={saveDiagram} isDark={isDark} theme={theme} isLoading={isSaving} currentName={currentDiagramName} />
    </div>
  );
};

export default MermaidReader;
