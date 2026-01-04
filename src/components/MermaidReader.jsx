/**
 * MermaidReader Component
 * - Full-width preview (code collapsed by default)
 * - Auto-color with bright, distinct colors
 * - Pan & zoom whiteboard preview
 * - Save diagrams (max 10 per user)
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import mermaid from 'mermaid';
import { supabase } from '../lib/supabase';
import { Copy, Check, Download, RefreshCw, Code, Eye, Trash2, ChevronDown, GitBranch, ZoomIn, ZoomOut, Move, PanelLeftClose, PanelLeft, RotateCcw, Save, X, FileText, Clock, Loader2, FolderOpen, Wand2, Undo2 } from 'lucide-react';

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
  bg: isDark ? '#09090b' : '#f8fafc',
  cardBg: isDark ? '#18181b' : '#ffffff',
  cardBorder: isDark ? '#27272a' : '#e4e4e7',
  text: isDark ? '#fafafa' : '#09090b',
  textMuted: isDark ? '#a1a1aa' : '#71717a',
  inputBg: isDark ? '#27272a' : '#f4f4f5',
});

const MAX_SAVED_DIAGRAMS = 10;

// BRIGHT Color Classes for Auto-Coloring
const COLOR_CLASSES = `
    classDef startClass fill:#fef08a,stroke:#ca8a04,stroke-width:2px,color:#713f12
    classDef processClass fill:#bfdbfe,stroke:#2563eb,stroke-width:2px,color:#1e3a8a
    classDef decisionClass fill:#e9d5ff,stroke:#9333ea,stroke-width:2px,color:#581c87
    classDef successClass fill:#bbf7d0,stroke:#16a34a,stroke-width:2px,color:#14532d
    classDef errorClass fill:#fecaca,stroke:#dc2626,stroke-width:2px,color:#7f1d1d
    classDef warningClass fill:#fed7aa,stroke:#ea580c,stroke-width:2px,color:#7c2d12
    classDef endClass fill:#99f6e4,stroke:#0d9488,stroke-width:2px,color:#134e4a
    classDef ioClass fill:#fbcfe8,stroke:#db2777,stroke-width:2px,color:#831843`;

const TEMPLATES = [
  {
    name: 'Colorful Flowchart',
    code: `flowchart TD
    A([🚀 Start]):::startClass --> B[Process Data]:::processClass
    B --> C{Is Valid?}:::decisionClass
    C -->|Yes| D[✅ Save to DB]:::successClass
    C -->|No| E[❌ Show Error]:::errorClass
    D --> F[Send Email]:::ioClass
    E --> G[⚠️ Log Error]:::warningClass
    F --> H([🏁 End]):::endClass
    G --> H

    classDef startClass fill:#fef08a,stroke:#ca8a04,stroke-width:2px,color:#713f12
    classDef processClass fill:#bfdbfe,stroke:#2563eb,stroke-width:2px,color:#1e3a8a
    classDef decisionClass fill:#e9d5ff,stroke:#9333ea,stroke-width:2px,color:#581c87
    classDef successClass fill:#bbf7d0,stroke:#16a34a,stroke-width:2px,color:#14532d
    classDef errorClass fill:#fecaca,stroke:#dc2626,stroke-width:2px,color:#7f1d1d
    classDef warningClass fill:#fed7aa,stroke:#ea580c,stroke-width:2px,color:#7c2d12
    classDef endClass fill:#99f6e4,stroke:#0d9488,stroke-width:2px,color:#134e4a
    classDef ioClass fill:#fbcfe8,stroke:#db2777,stroke-width:2px,color:#831843`,
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

// Completely rewritten auto-color function
const autoColorFlowchart = (code) => {
  // Only process flowcharts
  const firstLine = code.trim().split('\n')[0].toLowerCase();
  if (!firstLine.startsWith('flowchart')) {
    return code;
  }

  // Step 1: Completely strip ALL existing class assignments and classDef lines
  let cleanCode = code
    // Remove :::anything patterns
    .replace(/:::[a-zA-Z_][a-zA-Z0-9_]*/g, '')
    // Remove classDef lines completely
    .replace(/^\s*classDef\s+.*$/gm, '')
    // Remove class assignment lines
    .replace(/^\s*class\s+.*$/gm, '')
    // Clean up multiple blank lines
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    .trim();

  // Step 2: Parse and identify all nodes
  const lines = cleanCode.split('\n');
  const nodeClasses = new Map();

  lines.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('%%') || trimmed.startsWith('flowchart')) return;

    // Find all node definitions in this line
    // Stadium shape ([text]) - start/end
    const stadiums = [...line.matchAll(/([A-Za-z][A-Za-z0-9_]*)\s*\(\[([^\]]*)\]\)/g)];
    stadiums.forEach(match => {
      const [, nodeId, text] = match;
      const lower = text.toLowerCase();
      if (lower.includes('start') || lower.includes('begin') || lower.includes('new') || lower.includes('🚀')) {
        nodeClasses.set(nodeId, 'startClass');
      } else if (lower.includes('end') || lower.includes('done') || lower.includes('close') || lower.includes('🏁') || lower.includes('finish')) {
        nodeClasses.set(nodeId, 'endClass');
      } else {
        nodeClasses.set(nodeId, 'processClass');
      }
    });

    // Circle shape ((text)) - start
    const circles = [...line.matchAll(/([A-Za-z][A-Za-z0-9_]*)\s*\(\(([^)]*)\)\)/g)];
    circles.forEach(match => {
      const [, nodeId, text] = match;
      const lower = text.toLowerCase();
      if (lower.includes('end')) {
        nodeClasses.set(nodeId, 'endClass');
      } else {
        nodeClasses.set(nodeId, 'startClass');
      }
    });

    // Diamond shape {text} - decision
    const diamonds = [...line.matchAll(/([A-Za-z][A-Za-z0-9_]*)\s*\{([^}]*)\}/g)];
    diamonds.forEach(match => {
      nodeClasses.set(match[1], 'decisionClass');
    });

    // Rectangle shape [text] - various types based on content
    const rectangles = [...line.matchAll(/([A-Za-z][A-Za-z0-9_]*)\s*\[([^\[\]]*)\](?!\()/g)];
    rectangles.forEach(match => {
      const [, nodeId, text] = match;
      if (nodeClasses.has(nodeId)) return; // Don't override

      const lower = text.toLowerCase();
      
      // Success keywords - GREEN
      if (lower.includes('✅') || lower.includes('success') || lower.includes('complete') || 
          lower.includes('approve') || lower.includes('accept') || lower.includes('enroll') || 
          lower.includes('won') || lower.includes('qualified') || lower.includes('closed') ||
          lower.includes('save to') || lower.includes('saved')) {
        nodeClasses.set(nodeId, 'successClass');
      }
      // Error keywords - RED  
      else if (lower.includes('❌') || lower.includes('error') || lower.includes('fail') || 
               lower.includes('reject') || lower.includes('cancel') || lower.includes('delete') || 
               lower.includes('lost') || lower.includes('not qualified') || lower.includes('disqualif')) {
        nodeClasses.set(nodeId, 'errorClass');
      }
      // Warning keywords - ORANGE
      else if (lower.includes('⚠') || lower.includes('warn') || lower.includes('retry') || 
               lower.includes('reschedule') || lower.includes('wait') || lower.includes('log') || 
               lower.includes('pending') || lower.includes('hold') || lower.includes('nurture') ||
               lower.includes('follow-up') || lower.includes('follow up') || lower.includes('remind')) {
        nodeClasses.set(nodeId, 'warningClass');
      }
      // I/O keywords - PINK
      else if (lower.includes('send') || lower.includes('email') || lower.includes('notify') || 
               lower.includes('sms') || lower.includes('call') || lower.includes('message') ||
               lower.includes('webhook') || lower.includes('api') || lower.includes('notification')) {
        nodeClasses.set(nodeId, 'ioClass');
      }
      // Default - BLUE
      else {
        nodeClasses.set(nodeId, 'processClass');
      }
    });
  });

  // Step 3: Build class assignment string
  const classAssignments = [];
  nodeClasses.forEach((className, nodeId) => {
    classAssignments.push(`    class ${nodeId} ${className}`);
  });

  // Step 4: Return clean code + class assignments + class definitions
  return cleanCode + '\n\n' + classAssignments.join('\n') + '\n' + COLOR_CLASSES;
};

// Save Modal
const SaveModal = ({ isOpen, onClose, onSave, isDark, theme, isLoading, currentName }) => {
  const [name, setName] = useState(currentName || '');
  const inputRef = useRef(null);
  useEffect(() => { if (isOpen) { setName(currentName || ''); setTimeout(() => inputRef.current?.focus(), 100); } }, [isOpen, currentName]);
  if (!isOpen) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={onClose}>
      <div style={{ backgroundColor: theme.cardBg, borderRadius: '12px', border: '1px solid ' + theme.cardBorder, padding: '24px', width: '100%', maxWidth: '400px', margin: '20px' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: theme.text, margin: 0, fontFamily: FONTS.heading }}>Save Diagram</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: theme.textMuted, cursor: 'pointer', padding: '4px' }}><X size={18} /></button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); if (name.trim()) onSave(name.trim()); }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: theme.textMuted, marginBottom: '6px', fontFamily: FONTS.body }}>Diagram Name</label>
          <input ref={inputRef} type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., User Login Flow" maxLength={50} style={{ width: '100%', height: '44px', padding: '0 12px', backgroundColor: theme.inputBg, border: '1px solid ' + theme.cardBorder, borderRadius: '8px', fontSize: '14px', color: theme.text, fontFamily: FONTS.body, outline: 'none', boxSizing: 'border-box' }} />
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button type="button" onClick={onClose} style={{ flex: 1, height: '40px', backgroundColor: 'transparent', border: '1px solid ' + theme.cardBorder, borderRadius: '8px', color: theme.text, fontSize: '13px', fontFamily: FONTS.body, cursor: 'pointer' }}>Cancel</button>
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
  const [isCodeCollapsed, setIsCodeCollapsed] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [savedDiagrams, setSavedDiagrams] = useState([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingDiagrams, setIsLoadingDiagrams] = useState(false);
  const [currentDiagramId, setCurrentDiagramId] = useState(null);
  const [currentDiagramName, setCurrentDiagramName] = useState('');
  
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [codeBeforeColor, setCodeBeforeColor] = useState(null); // Store original code for revert
  
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
        await supabase.from('mermaid_diagrams').update({ name, code, updated_at: new Date().toISOString() }).eq('id', currentDiagramId);
      } else {
        const { data } = await supabase.from('mermaid_diagrams').insert({ user_id: user.id, name, code }).select().single();
        setCurrentDiagramId(data.id);
      }
      setCurrentDiagramName(name);
      setShowSaveModal(false);
      await loadSavedDiagrams();
    } catch (err) { console.error('Failed to save:', err); alert('Failed to save.'); }
    finally { setIsSaving(false); }
  };

  const loadDiagram = (d) => { setCode(d.code); setCurrentDiagramId(d.id); setCurrentDiagramName(d.name); setCodeBeforeColor(null); setKey((k) => k + 1); setIsSidebarOpen(false); };
  const deleteDiagram = async (id) => {
    if (!confirm('Delete this diagram?')) return;
    try {
      await supabase.from('mermaid_diagrams').delete().eq('id', id);
      if (currentDiagramId === id) { setCurrentDiagramId(null); setCurrentDiagramName(''); }
      await loadSavedDiagrams();
    } catch (err) { console.error('Failed to delete:', err); }
  };
  const createNewDiagram = () => { setCode(TEMPLATES[1].code); setCurrentDiagramId(null); setCurrentDiagramName(''); setCodeBeforeColor(null); setKey((k) => k + 1); setIsSidebarOpen(false); };
  
  const handleAutoColor = () => { 
    // Only save original if we haven't already (prevents overwriting original with colored version)
    if (!codeBeforeColor) {
      setCodeBeforeColor(code);
    }
    setCode(autoColorFlowchart(code)); 
    setKey((k) => k + 1); 
  };
  
  const handleRevertColor = () => {
    if (codeBeforeColor) {
      setCode(codeBeforeColor);
      setCodeBeforeColor(null);
      setKey((k) => k + 1);
    }
  };

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'base',
      themeVariables: isDark ? {
        primaryColor: BRAND.blue, primaryTextColor: '#fff', primaryBorderColor: BRAND.blue,
        secondaryColor: '#8b5cf6', tertiaryColor: BRAND.green, lineColor: '#6b7280',
        textColor: '#f3f4f6', mainBkg: '#1f2937', nodeBorder: '#4b5563',
        pie1: BRAND.blue, pie2: '#8b5cf6', pie3: '#ec4899', pie4: BRAND.green, pie5: '#f59e0b', pie6: '#ef4444',
      } : {
        primaryColor: BRAND.blue, primaryTextColor: '#fff', primaryBorderColor: BRAND.blue,
        secondaryColor: '#8b5cf6', tertiaryColor: BRAND.green, lineColor: '#6b7280',
        textColor: BRAND.brown, mainBkg: '#f3f4f6', nodeBorder: '#d1d5db',
        pie1: BRAND.blue, pie2: '#8b5cf6', pie3: '#ec4899', pie4: BRAND.green, pie5: '#f59e0b', pie6: '#ef4444',
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
      const { svg } = await mermaid.render(`mermaid-${Date.now()}`, code);
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
    const a = document.createElement('a'); a.href = url; a.download = `${currentDiagramName || 'diagram'}.svg`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
  };

  const handleDownloadPNG = () => {
    if (!svgContent) return;
    const container = document.createElement('div');
    container.innerHTML = svgContent;
    container.style.cssText = 'position:absolute;left:-9999px';
    document.body.appendChild(container);
    const svgEl = container.querySelector('svg');
    if (!svgEl) { document.body.removeChild(container); return; }
    const bbox = svgEl.getBoundingClientRect();
    const w = Math.max(bbox.width, parseFloat(svgEl.getAttribute('width')) || 800);
    const h = Math.max(bbox.height, parseFloat(svgEl.getAttribute('height')) || 600);
    svgEl.setAttribute('width', w); svgEl.setAttribute('height', h);
    const svgStr = new XMLSerializer().serializeToString(svgEl);
    const url = URL.createObjectURL(new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' }));
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
        const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `${currentDiagramName || 'diagram'}.png`;
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
      }, 'image/png');
      URL.revokeObjectURL(url); document.body.removeChild(container);
    };
    img.onerror = () => { URL.revokeObjectURL(url); document.body.removeChild(container); };
    img.src = url;
  };

  const loadTemplate = (t) => { setCode(t.code); setCurrentDiagramId(null); setCurrentDiagramName(''); setCodeBeforeColor(null); setShowTemplates(false); setKey((k) => k + 1); };

  useEffect(() => {
    const h = (e) => { if (templateRef.current && !templateRef.current.contains(e.target)) setShowTemplates(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const btnStyle = { height: '32px', padding: '0 10px', backgroundColor: 'transparent', border: '1px solid ' + theme.cardBorder, borderRadius: '6px', color: theme.textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '12px', fontFamily: FONTS.body };

  return (
    <div style={{ width: '100%', height: 'calc(100vh - 160px)', minHeight: '500px', display: 'flex', flexDirection: 'column', backgroundColor: theme.cardBg, borderRadius: '12px', border: '1px solid ' + theme.cardBorder, overflow: 'hidden' }}>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

      {/* Header */}
      <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid ' + theme.cardBorder, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: `linear-gradient(135deg, ${BRAND.blue}, #8b5cf6)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <GitBranch size={16} style={{ color: '#fff' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '16px', fontWeight: '700', color: theme.text, margin: 0, fontFamily: FONTS.heading }}>Mermaid Diagram Viewer</h1>
            <p style={{ fontSize: '11px', color: theme.textMuted, margin: 0 }}>Create flowcharts, sequence diagrams, and more</p>
          </div>
        </div>
        {user && (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => setIsSidebarOpen(true)} style={btnStyle}><FolderOpen size={14} /> My Diagrams ({savedDiagrams.length}/{MAX_SAVED_DIAGRAMS})</button>
            <button onClick={() => setShowSaveModal(true)} disabled={!svgContent} style={{ ...btnStyle, backgroundColor: svgContent ? BRAND.blue : 'transparent', borderColor: svgContent ? BRAND.blue : theme.cardBorder, color: svgContent ? '#fff' : theme.textMuted }}>
              <Save size={14} /> {currentDiagramId ? 'Update' : 'Save'}
            </button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>
        {/* Code Panel */}
        {!isCodeCollapsed && (
          <div style={{ width: '300px', minWidth: '280px', borderRight: '1px solid ' + theme.cardBorder, display: 'flex', flexDirection: 'column', backgroundColor: theme.cardBg, flexShrink: 0 }}>
            <div style={{ padding: '8px 10px', borderBottom: '1px solid ' + theme.cardBorder, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Code size={14} style={{ color: theme.textMuted }} /><span style={{ fontSize: '12px', fontWeight: '600', color: theme.text }}>Code</span></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div ref={templateRef} style={{ position: 'relative' }}>
                  <button onClick={() => setShowTemplates(!showTemplates)} style={{ ...btnStyle, height: '26px', padding: '0 8px', fontSize: '11px' }}>Templates <ChevronDown size={10} /></button>
                  {showTemplates && (
                    <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '4px', backgroundColor: theme.cardBg, border: '1px solid ' + theme.cardBorder, borderRadius: '8px', boxShadow: '0 8px 32px rgba(0,0,0,0.3)', padding: '4px', zIndex: 100, minWidth: '160px' }}>
                      {TEMPLATES.map((t, i) => (<button key={i} onClick={() => loadTemplate(t)} style={{ width: '100%', padding: '6px 8px', backgroundColor: 'transparent', border: 'none', borderRadius: '4px', cursor: 'pointer', textAlign: 'left', fontSize: '11px', color: theme.text }}>{t.name}</button>))}
                    </div>
                  )}
                </div>
                <button onClick={handleCopy} style={{ ...btnStyle, width: '26px', height: '26px', padding: 0 }} title="Copy">{copied ? <Check size={12} style={{ color: BRAND.green }} /> : <Copy size={12} />}</button>
                <button onClick={() => { setCode(''); setSvgContent(''); setCurrentDiagramId(null); setCurrentDiagramName(''); setCodeBeforeColor(null); }} style={{ ...btnStyle, width: '26px', height: '26px', padding: 0 }} title="Clear"><Trash2 size={12} /></button>
              </div>
            </div>
            <div style={{ padding: '8px', flexShrink: 0, display: 'flex', gap: '4px' }}>
              <button onClick={handleAutoColor} style={{ flex: 1, height: '32px', backgroundColor: BRAND.green, border: 'none', borderRadius: '6px', color: '#fff', fontSize: '12px', fontWeight: '600', fontFamily: FONTS.body, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}><Wand2 size={14} /> Auto Color</button>
              {codeBeforeColor && (
                <button onClick={handleRevertColor} style={{ height: '32px', padding: '0 12px', backgroundColor: 'transparent', border: '1px solid ' + theme.cardBorder, borderRadius: '6px', color: theme.textMuted, fontSize: '12px', fontFamily: FONTS.body, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}><Undo2 size={14} /> Revert</button>
              )}
            </div>
            <textarea value={code} onChange={(e) => setCode(e.target.value)} placeholder="Enter Mermaid code..." spellCheck={false} style={{ flex: 1, padding: '10px', backgroundColor: isDark ? '#0a0a0b' : '#fafafa', border: 'none', outline: 'none', resize: 'none', fontSize: '11px', fontFamily: "'Fira Code', monospace", color: isDark ? '#e4e4e7' : '#27272a', lineHeight: '1.6', minHeight: 0 }} />
            {error && <div style={{ padding: '8px 10px', backgroundColor: isDark ? '#451a1a' : '#fef2f2', color: isDark ? '#fca5a5' : '#dc2626', fontSize: '10px', flexShrink: 0 }}>⚠️ {error}</div>}
          </div>
        )}

        {/* Preview Panel */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, backgroundColor: isDark ? '#0a0a0b' : '#f8fafc' }}>
          {/* Preview Header */}
          <div style={{ padding: '8px 12px', borderBottom: '1px solid ' + theme.cardBorder, display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: theme.cardBg, flexWrap: 'wrap', gap: '8px', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button onClick={() => setIsCodeCollapsed(!isCodeCollapsed)} style={{ ...btnStyle, width: '28px', height: '28px', padding: 0, backgroundColor: isCodeCollapsed ? (isDark ? '#27272a' : '#f4f4f5') : 'transparent' }} title={isCodeCollapsed ? 'Show Code' : 'Hide Code'}>{isCodeCollapsed ? <PanelLeft size={14} /> : <PanelLeftClose size={14} />}</button>
              <Eye size={14} style={{ color: theme.textMuted }} />
              <span style={{ fontSize: '12px', fontWeight: '600', color: theme.text }}>Preview</span>
              <span style={{ fontSize: '10px', color: theme.textMuted, backgroundColor: isDark ? '#27272a' : '#f4f4f5', padding: '2px 6px', borderRadius: '4px' }}>{Math.round(scale * 100)}%</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
              {isCodeCollapsed && (
                <>
                  <button onClick={handleAutoColor} style={{ ...btnStyle, height: '28px', backgroundColor: BRAND.green, borderColor: BRAND.green, color: '#fff' }}><Wand2 size={12} /> Auto Color</button>
                  {codeBeforeColor && (
                    <button onClick={handleRevertColor} style={{ ...btnStyle, height: '28px' }}><Undo2 size={12} /> Revert</button>
                  )}
                </>
              )}
              <button onClick={zoomOut} style={{ ...btnStyle, width: '28px', height: '28px', padding: 0 }}><ZoomOut size={14} /></button>
              <button onClick={zoomIn} style={{ ...btnStyle, width: '28px', height: '28px', padding: 0 }}><ZoomIn size={14} /></button>
              <button onClick={resetView} style={{ ...btnStyle, width: '28px', height: '28px', padding: 0 }}><RotateCcw size={14} /></button>
              <div style={{ width: '1px', height: '20px', backgroundColor: theme.cardBorder }} />
              <button onClick={() => setKey((k) => k + 1)} style={{ ...btnStyle, width: '28px', height: '28px', padding: 0 }}><RefreshCw size={14} /></button>
              <button onClick={handleDownloadSVG} disabled={!svgContent} style={{ ...btnStyle, height: '28px', opacity: svgContent ? 1 : 0.5 }}><Download size={12} /> SVG</button>
              <button onClick={handleDownloadPNG} disabled={!svgContent} style={{ ...btnStyle, height: '28px', backgroundColor: svgContent ? '#6366f1' : 'transparent', borderColor: svgContent ? '#6366f1' : theme.cardBorder, color: svgContent ? '#fff' : theme.textMuted }}><Download size={12} /> PNG</button>
            </div>
          </div>

          {/* Canvas */}
          <div ref={previewRef} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleMouseUp} onWheel={handleWheel} style={{ flex: 1, overflow: 'hidden', cursor: isDragging ? 'grabbing' : 'grab', backgroundImage: isDark ? 'radial-gradient(circle, #27272a 1px, transparent 1px)' : 'radial-gradient(circle, #d4d4d8 1px, transparent 1px)', backgroundSize: '20px 20px', position: 'relative', userSelect: 'none', minHeight: 0 }}>
            {svgContent ? (
              <div ref={svgRef} style={{ position: 'absolute', left: '50%', top: '50%', transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px)) scale(${scale})`, transformOrigin: 'center', transition: isDragging ? 'none' : 'transform 0.1s', padding: '20px', backgroundColor: isDark ? '#18181b' : '#fff', borderRadius: '8px', boxShadow: isDark ? '0 2px 16px rgba(0,0,0,0.4)' : '0 2px 16px rgba(0,0,0,0.08)' }} dangerouslySetInnerHTML={{ __html: svgContent }} />
            ) : (
              <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', color: theme.textMuted }}>
                <GitBranch size={48} style={{ marginBottom: '12px', opacity: 0.2 }} />
                <p style={{ fontSize: '13px', margin: 0 }}>{error ? 'Fix syntax error' : 'Enter code to preview'}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={{ padding: '6px 12px', borderTop: '1px solid ' + theme.cardBorder, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', backgroundColor: theme.cardBg, flexShrink: 0 }}>
            <span style={{ fontSize: '10px', color: theme.textMuted, display: 'flex', alignItems: 'center', gap: '4px' }}><Move size={10} /> Drag to pan</span>
            <span style={{ fontSize: '10px', color: theme.textMuted, display: 'flex', alignItems: 'center', gap: '4px' }}><ZoomIn size={10} /> Scroll to zoom</span>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      {isSidebarOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 999 }} onClick={() => setIsSidebarOpen(false)}>
          <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '300px', backgroundColor: theme.cardBg, borderLeft: '1px solid ' + theme.cardBorder, display: 'flex', flexDirection: 'column' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '16px', borderBottom: '1px solid ' + theme.cardBorder, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: theme.text, margin: 0 }}>My Diagrams ({savedDiagrams.length}/{MAX_SAVED_DIAGRAMS})</h3>
              <button onClick={() => setIsSidebarOpen(false)} style={{ background: 'none', border: 'none', color: theme.textMuted, cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <div style={{ padding: '12px' }}>
              <button onClick={createNewDiagram} style={{ width: '100%', height: '36px', backgroundColor: BRAND.blue, border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>+ New Diagram</button>
            </div>
            <div style={{ flex: 1, overflow: 'auto', padding: '0 12px 12px' }}>
              {isLoadingDiagrams ? (<div style={{ textAlign: 'center', padding: '40px 0' }}><Loader2 size={20} style={{ animation: 'spin 1s linear infinite', color: theme.textMuted }} /></div>
              ) : savedDiagrams.length === 0 ? (<div style={{ textAlign: 'center', padding: '40px 0', color: theme.textMuted }}><FileText size={28} style={{ marginBottom: '8px', opacity: 0.3 }} /><p style={{ fontSize: '12px', margin: 0 }}>No saved diagrams</p></div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {savedDiagrams.map((d) => (
                    <div key={d.id} style={{ padding: '10px', backgroundColor: currentDiagramId === d.id ? (isDark ? '#27272a' : '#f4f4f5') : 'transparent', border: '1px solid ' + (currentDiagramId === d.id ? BRAND.blue : theme.cardBorder), borderRadius: '6px', cursor: 'pointer' }} onClick={() => loadDiagram(d)}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '12px', fontWeight: '600', color: theme.text }}>{d.name}</span>
                        <button onClick={(e) => { e.stopPropagation(); deleteDiagram(d.id); }} style={{ background: 'none', border: 'none', color: theme.textMuted, cursor: 'pointer', padding: '2px' }}><Trash2 size={12} /></button>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}><Clock size={9} style={{ color: theme.textMuted }} /><span style={{ fontSize: '10px', color: theme.textMuted }}>{new Date(d.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span></div>
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
