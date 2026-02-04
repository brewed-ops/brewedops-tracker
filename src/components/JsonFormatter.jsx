/**
 * JsonFormatter Component
 * - Format & beautify JSON
 * - Validate JSON syntax
 * - Tree view explorer
 * - Minify JSON
 * - Convert JSON to other formats
 */

import React, { useState, useEffect, useRef } from 'react';
import { Copy, Check, Trash, BracketsCurly, CaretRight, CaretDown, WarningCircle, ArrowsIn, ArrowsOut, DownloadSimple, UploadSimple, ListBullets, Eye, Code, MagnifyingGlass } from '@phosphor-icons/react';

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
  codeBg: isDark ? '#0d0b09' : '#f5f0eb',
});

// Sample JSON for placeholder
const SAMPLE_JSON = `{
  "name": "John Doe",
  "email": "john@example.com",
  "age": 30,
  "isActive": true,
  "tags": ["automation", "n8n", "zapier"],
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "zip": "10001"
  },
  "orders": [
    { "id": 1, "product": "Widget", "price": 29.99 },
    { "id": 2, "product": "Gadget", "price": 49.99 }
  ]
}`;

// Check if a node or its descendants match the search term
const nodeMatchesSearch = (key, val, term) => {
  if (!term) return true;
  const lower = term.toLowerCase();
  if (key !== null && String(key).toLowerCase().includes(lower)) return true;
  if (val === null) return 'null'.includes(lower);
  if (typeof val !== 'object') return String(val).toLowerCase().includes(lower);
  if (Array.isArray(val)) return val.some((v, i) => nodeMatchesSearch(i, v, lower));
  return Object.entries(val).some(([k, v]) => nodeMatchesSearch(k, v, lower));
};

// Highlight matching text in search
const HighlightText = ({ text, searchTerm, color }) => {
  const str = String(text);
  if (!searchTerm) return <span style={{ color }}>{str}</span>;
  const idx = str.toLowerCase().indexOf(searchTerm.toLowerCase());
  if (idx === -1) return <span style={{ color }}>{str}</span>;
  return (
    <span style={{ color }}>
      {str.slice(0, idx)}
      <span style={{ backgroundColor: '#854d0e', color: '#fef08a', padding: '0 1px', borderRadius: '2px' }}>{str.slice(idx, idx + searchTerm.length)}</span>
      {str.slice(idx + searchTerm.length)}
    </span>
  );
};

// Tree Node Component
const TreeNode = ({ name, value, level = 0, isDark, theme, defaultExpanded = true, searchTerm = '' }) => {
  const [isExpanded, setIsExpanded] = useState(searchTerm ? true : (defaultExpanded && level < 2));

  // Auto-expand when search term changes and matches
  useEffect(() => {
    if (searchTerm && nodeMatchesSearch(name, value, searchTerm)) {
      setIsExpanded(true);
    }
  }, [searchTerm]);

  const renderValue = (val) => {
    if (val === null) return <HighlightText text="null" searchTerm={searchTerm} color="#f97316" />;
    if (typeof val === 'string') return <><span style={{ color: '#22c55e' }}>"</span><HighlightText text={val} searchTerm={searchTerm} color="#22c55e" /><span style={{ color: '#22c55e' }}>"</span></>;
    if (typeof val === 'number') return <HighlightText text={String(val)} searchTerm={searchTerm} color="#3b82f6" />;
    if (typeof val === 'boolean') return <HighlightText text={val.toString()} searchTerm={searchTerm} color="#a855f7" />;
    return null;
  };

  const isExpandable = typeof value === 'object' && value !== null;
  const isArray = Array.isArray(value);

  // Filter out non-matching nodes when searching
  if (searchTerm && !nodeMatchesSearch(name, value, searchTerm)) return null;

  if (!isExpandable) {
    return (
      <div style={{ paddingLeft: level * 16, display: 'flex', alignItems: 'center', gap: '4px', padding: '2px 0 2px ' + (level * 16 + 20) + 'px', fontSize: '12px', fontFamily: "'Fira Code', monospace" }}>
        {name !== null && <><span style={{ color: '#ec4899' }}>"</span><HighlightText text={name} searchTerm={searchTerm} color="#ec4899" /><span style={{ color: '#ec4899' }}>"</span></>}
        {name !== null && <span style={{ color: theme.textMuted }}>:</span>}
        {renderValue(value)}
      </div>
    );
  }

  const entries = isArray ? value.map((v, i) => [i, v]) : Object.entries(value);
  const bracketOpen = isArray ? '[' : '{';
  const bracketClose = isArray ? ']' : '}';

  return (
    <div style={{ fontSize: '12px', fontFamily: "'Fira Code', monospace" }}>
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          paddingLeft: level * 16,
          display: 'flex',
          alignItems: 'center',
          gap: '2px',
          cursor: 'pointer',
          padding: '2px 0 2px ' + (level * 16) + 'px',
          borderRadius: '4px',
        }}
      >
        {isExpanded ? <CaretDown size={14} style={{ color: theme.textMuted }} /> : <CaretRight size={14} style={{ color: theme.textMuted }} />}
        {name !== null && <><span style={{ color: '#ec4899' }}>"</span><HighlightText text={name} searchTerm={searchTerm} color="#ec4899" /><span style={{ color: '#ec4899' }}>"</span></>}
        {name !== null && <span style={{ color: theme.textMuted }}>: </span>}
        <span style={{ color: theme.textMuted }}>{bracketOpen}</span>
        {!isExpanded && (
          <>
            <span style={{ color: theme.textMuted, fontSize: '10px', marginLeft: '4px' }}>
              {entries.length} {isArray ? 'items' : 'keys'}
            </span>
            <span style={{ color: theme.textMuted }}>{bracketClose}</span>
          </>
        )}
      </div>
      {isExpanded && (
        <>
          {entries.map(([key, val], idx) => (
            <TreeNode key={key} name={isArray ? null : key} value={val} level={level + 1} isDark={isDark} theme={theme} defaultExpanded={searchTerm ? true : level < 1} searchTerm={searchTerm} />
          ))}
          <div style={{ paddingLeft: level * 16 + 20, color: theme.textMuted }}>{bracketClose}</div>
        </>
      )}
    </div>
  );
};

// Main Component
const JsonFormatter = ({ isDark = true }) => {
  const theme = getTheme(isDark);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [parsedJson, setParsedJson] = useState(null);
  const [copied, setCopied] = useState(false);
  const [indentSize, setIndentSize] = useState(2);
  const [viewMode, setViewMode] = useState('formatted'); // 'formatted', 'tree', 'minified'
  const [stats, setStats] = useState(null);
  const [treeSearch, setTreeSearch] = useState('');
  const [treeKey, setTreeKey] = useState(0);
  const [treeDefaultExpanded, setTreeDefaultExpanded] = useState(true);
  const fileInputRef = useRef(null);

  // Parse and format JSON
  const formatJson = (jsonString, indent = indentSize) => {
    if (!jsonString.trim()) {
      setOutput('');
      setError('');
      setParsedJson(null);
      setStats(null);
      return;
    }

    try {
      const parsed = JSON.parse(jsonString);
      const formatted = JSON.stringify(parsed, null, indent);
      setOutput(formatted);
      setParsedJson(parsed);
      setError('');
      
      // Calculate stats
      const countItems = (obj) => {
        let keys = 0, values = 0, arrays = 0, objects = 0;
        const traverse = (item) => {
          if (Array.isArray(item)) {
            arrays++;
            item.forEach(traverse);
          } else if (typeof item === 'object' && item !== null) {
            objects++;
            Object.entries(item).forEach(([k, v]) => {
              keys++;
              traverse(v);
            });
          } else {
            values++;
          }
        };
        traverse(obj);
        return { keys, values, arrays, objects };
      };
      setStats(countItems(parsed));
    } catch (e) {
      setError(e.message);
      setOutput('');
      setParsedJson(null);
      setStats(null);
    }
  };

  // Auto-format on input change
  useEffect(() => {
    const timer = setTimeout(() => formatJson(input), 300);
    return () => clearTimeout(timer);
  }, [input, indentSize]);

  const handleCopy = async (text) => {
    await navigator.clipboard.writeText(text || output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleMinify = () => {
    if (parsedJson) {
      const minified = JSON.stringify(parsedJson);
      setOutput(minified);
      setViewMode('minified');
    }
  };

  const handleBeautify = () => {
    if (parsedJson) {
      const formatted = JSON.stringify(parsedJson, null, indentSize);
      setOutput(formatted);
      setViewMode('formatted');
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError('');
    setParsedJson(null);
    setStats(null);
  };

  const handleLoadSample = () => {
    setInput(SAMPLE_JSON);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setInput(event.target.result);
      };
      reader.readAsText(file);
    }
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

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
    transition: 'all 0.15s ease',
  };

  const activeBtnStyle = {
    ...btnStyle,
    backgroundColor: BRAND.blue,
    borderColor: BRAND.blue,
    color: '#fff',
  };

  return (
    <div style={{ width: '100%', height: 'calc(100vh - 160px)', minHeight: '500px', display: 'flex', flexDirection: 'column', backgroundColor: theme.cardBg, borderRadius: '12px', border: '1px solid ' + theme.cardBorder, overflow: 'hidden' }}>
      
      {/* Header */}
      <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid ' + theme.cardBorder, flexShrink: 0, flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: `linear-gradient(135deg, ${BRAND.blue}, #3b82f6)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BracketsCurly size={16} style={{ color: '#fff' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '16px', fontWeight: '700', color: theme.text, margin: 0, fontFamily: FONTS.heading }}>JSON Formatter</h1>
            <p style={{ fontSize: '11px', color: theme.textMuted, margin: 0 }}>Format, validate, and explore JSON data</p>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button onClick={handleLoadSample} style={btnStyle}>
            <BracketsCurly size={14} /> Sample
          </button>
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".json" style={{ display: 'none' }} />
          <button onClick={() => fileInputRef.current?.click()} style={btnStyle}>
            <UploadSimple size={14} /> Upload
          </button>
          <button onClick={handleDownload} disabled={!output} style={{ ...btnStyle, opacity: output ? 1 : 0.5 }}>
            <DownloadSimple size={14} /> Download
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      {stats && (
        <div style={{ padding: '8px 16px', backgroundColor: isDark ? '#100e0b' : '#faf8f5', borderBottom: '1px solid ' + theme.cardBorder, display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', flexShrink: 0 }}>
          <span style={{ fontSize: '11px', color: BRAND.green, fontFamily: FONTS.body }}>✓ Valid JSON</span>
          <span style={{ fontSize: '11px', color: theme.textMuted }}>|</span>
          <span style={{ fontSize: '11px', color: theme.textMuted }}>{stats.keys} keys</span>
          <span style={{ fontSize: '11px', color: theme.textMuted }}>{stats.objects} objects</span>
          <span style={{ fontSize: '11px', color: theme.textMuted }}>{stats.arrays} arrays</span>
          <span style={{ fontSize: '11px', color: theme.textMuted }}>{output.length.toLocaleString()} chars</span>
        </div>
      )}

      {/* Error Bar */}
      {error && (
        <div style={{ padding: '10px 16px', backgroundColor: isDark ? '#451a1a' : '#fef2f2', borderBottom: '1px solid ' + (isDark ? '#7f1d1d' : '#fecaca'), display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <WarningCircle size={14} style={{ color: '#ef4444' }} />
          <span style={{ fontSize: '12px', color: isDark ? '#fca5a5' : '#dc2626', fontFamily: FONTS.body }}>Invalid JSON: {error}</span>
        </div>
      )}

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>
        
        {/* Input Panel */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRight: '1px solid ' + theme.cardBorder, minWidth: 0 }}>
          <div style={{ padding: '8px 12px', borderBottom: '1px solid ' + theme.cardBorder, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Code size={14} style={{ color: theme.textMuted }} />
              <span style={{ fontSize: '12px', fontWeight: '600', color: theme.text }}>Input</span>
            </div>
            <button onClick={handleClear} style={{ ...btnStyle, height: '26px', padding: '0 8px' }}>
              <Trash size={12} /> Clear
            </button>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your JSON here..."
            spellCheck={false}
            style={{
              flex: 1,
              padding: '12px',
              backgroundColor: theme.codeBg,
              border: 'none',
              outline: 'none',
              resize: 'none',
              fontSize: '12px',
              fontFamily: "'Fira Code', 'Consolas', monospace",
              color: isDark ? '#e8e0d4' : '#2a2420',
              lineHeight: '1.6',
              minHeight: 0,
            }}
          />
        </div>

        {/* Output Panel */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <div style={{ padding: '8px 12px', borderBottom: '1px solid ' + theme.cardBorder, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Eye size={14} style={{ color: theme.textMuted }} />
              <span style={{ fontSize: '12px', fontWeight: '600', color: theme.text }}>Output</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {/* View Mode Buttons */}
              <button onClick={handleBeautify} style={viewMode === 'formatted' ? activeBtnStyle : { ...btnStyle, height: '26px', padding: '0 8px' }}>
                <ArrowsOut size={12} /> Beautify
              </button>
              <button onClick={() => setViewMode('tree')} style={viewMode === 'tree' ? activeBtnStyle : { ...btnStyle, height: '26px', padding: '0 8px' }}>
                <ListBullets size={12} /> Tree
              </button>
              <button onClick={handleMinify} style={viewMode === 'minified' ? activeBtnStyle : { ...btnStyle, height: '26px', padding: '0 8px' }}>
                <ArrowsIn size={12} /> Minify
              </button>
              <div style={{ width: '1px', height: '20px', backgroundColor: theme.cardBorder, margin: '0 4px' }} />
              <button onClick={() => handleCopy()} disabled={!output} style={{ ...btnStyle, height: '26px', padding: '0 8px', opacity: output ? 1 : 0.5 }}>
                {copied ? <Check size={12} style={{ color: BRAND.green }} /> : <Copy size={12} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Indent Size Selector */}
          {viewMode === 'formatted' && (
            <div style={{ padding: '6px 12px', backgroundColor: isDark ? '#100e0b' : '#f5f0eb', borderBottom: '1px solid ' + theme.cardBorder, display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
              <span style={{ fontSize: '11px', color: theme.textMuted }}>Indent:</span>
              {[2, 4].map((size) => (
                <button
                  key={size}
                  onClick={() => setIndentSize(size)}
                  style={{
                    padding: '2px 8px',
                    backgroundColor: indentSize === size ? BRAND.blue : 'transparent',
                    border: '1px solid ' + (indentSize === size ? BRAND.blue : theme.cardBorder),
                    borderRadius: '4px',
                    color: indentSize === size ? '#fff' : theme.textMuted,
                    fontSize: '11px',
                    cursor: 'pointer',
                  }}
                >
                  {size} spaces
                </button>
              ))}
            </div>
          )}

          {/* Tree Toolbar */}
          {viewMode === 'tree' && parsedJson && (
            <div style={{ padding: '6px 12px', backgroundColor: isDark ? '#100e0b' : '#f5f0eb', borderBottom: '1px solid ' + theme.cardBorder, display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: theme.inputBg, border: '1px solid ' + theme.cardBorder, borderRadius: '6px', padding: '0 8px', height: '28px' }}>
                <MagnifyingGlass size={12} style={{ color: theme.textMuted, flexShrink: 0 }} />
                <input
                  type="text"
                  value={treeSearch}
                  onChange={(e) => setTreeSearch(e.target.value)}
                  placeholder="Search keys & values..."
                  style={{ flex: 1, border: 'none', outline: 'none', backgroundColor: 'transparent', fontSize: '11px', color: theme.text, fontFamily: FONTS.body }}
                />
                {treeSearch && (
                  <button onClick={() => setTreeSearch('')} style={{ background: 'none', border: 'none', color: theme.textMuted, cursor: 'pointer', padding: '0', fontSize: '14px', lineHeight: 1 }}>&times;</button>
                )}
              </div>
              <button
                onClick={() => { setTreeDefaultExpanded(true); setTreeKey(k => k + 1); }}
                style={{ ...btnStyle, height: '28px', padding: '0 8px', fontSize: '11px' }}
                title="Expand All"
              >
                <ArrowsOut size={11} /> Expand
              </button>
              <button
                onClick={() => { setTreeDefaultExpanded(false); setTreeSearch(''); setTreeKey(k => k + 1); }}
                style={{ ...btnStyle, height: '28px', padding: '0 8px', fontSize: '11px' }}
                title="Collapse All"
              >
                <ArrowsIn size={11} /> Collapse
              </button>
            </div>
          )}

          {/* Output Content */}
          <div style={{ flex: 1, overflow: 'auto', backgroundColor: theme.codeBg, minHeight: 0 }}>
            {viewMode === 'tree' && parsedJson ? (
              <div style={{ padding: '12px' }}>
                <TreeNode key={treeKey} name={null} value={parsedJson} isDark={isDark} theme={theme} defaultExpanded={treeDefaultExpanded} searchTerm={treeSearch} />
              </div>
            ) : (
              <pre style={{
                margin: 0,
                padding: '12px',
                fontSize: '12px',
                fontFamily: "'Fira Code', 'Consolas', monospace",
                color: isDark ? '#e8e0d4' : '#2a2420',
                lineHeight: '1.6',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}>
                {output || <span style={{ color: theme.textMuted }}>Formatted JSON will appear here...</span>}
              </pre>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: '8px 16px', borderTop: '1px solid ' + theme.cardBorder, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', backgroundColor: isDark ? '#100e0b' : '#faf8f5', flexShrink: 0 }}>
        <span style={{ fontSize: '10px', color: theme.textMuted }}>
          💡 Tip: Use Tree view to explore nested objects
        </span>
      </div>
    </div>
  );
};

export default JsonFormatter;
