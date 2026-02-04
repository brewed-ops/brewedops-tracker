/**
 * MarkdownViewer Component
 * - Upload and view markdown files
 * - Clean, organized display with proper formatting
 * - Support for headings, lists, code blocks, tables, links, images
 * - Dark/Light mode support
 * - Copy and download functionality
 */

import React, { useState, useRef, useCallback } from 'react';
import { UploadSimple, FileText, Copy, Check, DownloadSimple, Trash, Eye, Code, X, FileArrowUp, Moon, Sun, Clock, TextT, Hash, TextAlignLeft } from '@phosphor-icons/react';

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
  linkColor: isDark ? '#60a5fa' : BRAND.blue,
  blockquoteBorder: isDark ? '#3b82f6' : BRAND.blue,
  tableBorder: isDark ? '#2a2420' : '#e8e0d4',
  tableHeaderBg: isDark ? '#1e1a16' : '#faf8f5',
});

// Parse markdown to HTML
const parseMarkdown = (markdown, theme) => {
  if (!markdown) return '';

  let html = markdown;

  // Escape HTML to prevent XSS
  const escapeHtml = (text) => {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  // Store code blocks temporarily to prevent them from being parsed
  const codeBlocks = [];
  const inlineCode = [];

  // Extract fenced code blocks first
  html = html.replace(/```(\w*)\n?([\s\S]*?)```/g, (match, lang, code) => {
    const index = codeBlocks.length;
    codeBlocks.push({ lang: lang || '', code: code.trim() });
    return `%%CODEBLOCK${index}%%`;
  });

  // Extract inline code
  html = html.replace(/`([^`]+)`/g, (match, code) => {
    const index = inlineCode.length;
    inlineCode.push(code);
    return `%%INLINECODE${index}%%`;
  });

  // Now escape the rest
  html = escapeHtml(html);

  // Helper to generate slug from heading text
  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special chars except spaces and hyphens
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim();
  };

  // Headers (must be at start of line) - with id attributes for anchor links
  html = html.replace(/^######\s+(.+)$/gm, (match, text) => {
    const id = generateSlug(text);
    return `<h6 id="${id}" style="font-size: 14px; font-weight: 600; margin: 16px 0 8px; color: ${theme.text}; font-family: ${FONTS.heading};">${text}</h6>`;
  });
  html = html.replace(/^#####\s+(.+)$/gm, (match, text) => {
    const id = generateSlug(text);
    return `<h5 id="${id}" style="font-size: 15px; font-weight: 600; margin: 16px 0 8px; color: ${theme.text}; font-family: ${FONTS.heading};">${text}</h5>`;
  });
  html = html.replace(/^####\s+(.+)$/gm, (match, text) => {
    const id = generateSlug(text);
    return `<h4 id="${id}" style="font-size: 16px; font-weight: 600; margin: 20px 0 10px; color: ${theme.text}; font-family: ${FONTS.heading};">${text}</h4>`;
  });
  html = html.replace(/^###\s+(.+)$/gm, (match, text) => {
    const id = generateSlug(text);
    return `<h3 id="${id}" style="font-size: 18px; font-weight: 600; margin: 24px 0 12px; color: ${theme.text}; font-family: ${FONTS.heading};">${text}</h3>`;
  });
  html = html.replace(/^##\s+(.+)$/gm, (match, text) => {
    const id = generateSlug(text);
    return `<h2 id="${id}" style="font-size: 22px; font-weight: 700; margin: 28px 0 14px; color: ${theme.text}; font-family: ${FONTS.heading}; border-bottom: 1px solid ${theme.cardBorder}; padding-bottom: 8px;">${text}</h2>`;
  });
  html = html.replace(/^#\s+(.+)$/gm, (match, text) => {
    const id = generateSlug(text);
    return `<h1 id="${id}" style="font-size: 28px; font-weight: 700; margin: 32px 0 16px; color: ${theme.text}; font-family: ${FONTS.heading}; border-bottom: 2px solid ${theme.cardBorder}; padding-bottom: 10px;">${text}</h1>`;
  });

  // Horizontal rules
  html = html.replace(/^(?:---|\*\*\*|___)$/gm, `<hr style="border: none; border-top: 1px solid ${theme.cardBorder}; margin: 24px 0;" />`);

  // Bold and Italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/___(.+?)___/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong style="font-weight: 600;">$1</strong>');
  html = html.replace(/__(.+?)__/g, '<strong style="font-weight: 600;">$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  html = html.replace(/_(.+?)_/g, '<em>$1</em>');

  // Strikethrough
  html = html.replace(/~~(.+?)~~/g, '<del style="text-decoration: line-through; opacity: 0.7;">$1</del>');

  // Links (handle both [text](url) and bare URLs)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, `<a href="$2" target="_blank" rel="noopener noreferrer" style="color: ${theme.linkColor}; text-decoration: none; border-bottom: 1px solid ${theme.linkColor}40;">$1</a>`);

  // Images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, `<img src="$2" alt="$1" style="max-width: 100%; height: auto; border-radius: 8px; margin: 16px 0; display: block;" />`);

  // Blockquotes
  html = html.replace(/^&gt;\s+(.+)$/gm, `<blockquote style="border-left: 4px solid ${theme.blockquoteBorder}; margin: 16px 0; padding: 12px 16px; background: ${theme.codeBg}; border-radius: 0 8px 8px 0; color: ${theme.textMuted}; font-style: italic;">$1</blockquote>`);

  // Unordered lists
  html = html.replace(/^[\-\*]\s+(.+)$/gm, `<li style="margin: 6px 0; color: ${theme.text};">$1</li>`);
  html = html.replace(/(<li[^>]*>.*<\/li>\n?)+/g, (match) => `<ul style="margin: 12px 0; padding-left: 24px; list-style-type: disc;">${match}</ul>`);

  // Ordered lists
  html = html.replace(/^\d+\.\s+(.+)$/gm, `<li style="margin: 6px 0; color: ${theme.text};">$1</li>`);
  // Don't double-wrap if already wrapped
  html = html.replace(/(?<!<ul[^>]*>)(<li[^>]*>.*<\/li>\n?)+(?!<\/ul>)/g, (match) => {
    if (!match.includes('<ul')) {
      return `<ol style="margin: 12px 0; padding-left: 24px; list-style-type: decimal;">${match}</ol>`;
    }
    return match;
  });

  // Task lists
  html = html.replace(/\[ \]/g, `<input type="checkbox" disabled style="margin-right: 8px; accent-color: ${BRAND.blue};" />`);
  html = html.replace(/\[x\]/gi, `<input type="checkbox" checked disabled style="margin-right: 8px; accent-color: ${BRAND.green};" />`);

  // Tables
  html = html.replace(/^\|(.+)\|$/gm, (match, content) => {
    const cells = content.split('|').map(cell => cell.trim());
    const isHeader = cells.every(cell => /^[-:]+$/.test(cell));
    if (isHeader) return '%%TABLE_SEPARATOR%%';
    return `<tr>${cells.map(cell => `<td style="padding: 10px 14px; border: 1px solid ${theme.tableBorder}; color: ${theme.text};">${cell}</td>`).join('')}</tr>`;
  });

  // Wrap table rows
  html = html.replace(/((<tr>.*<\/tr>\n?)+)/g, (match) => {
    const rows = match.split('%%TABLE_SEPARATOR%%');
    if (rows.length > 1) {
      const header = rows[0].replace(/<td/g, `<th style="padding: 10px 14px; border: 1px solid ${theme.tableBorder}; background: ${theme.tableHeaderBg}; font-weight: 600; color: ${theme.text};"`).replace(/<\/td>/g, '</th>');
      const body = rows.slice(1).join('');
      return `<table style="width: 100%; border-collapse: collapse; margin: 16px 0; border-radius: 8px; overflow: hidden;"><thead>${header}</thead><tbody>${body}</tbody></table>`;
    }
    return `<table style="width: 100%; border-collapse: collapse; margin: 16px 0;"><tbody>${match}</tbody></table>`;
  });
  html = html.replace(/%%TABLE_SEPARATOR%%/g, '');

  // Paragraphs - wrap remaining text blocks
  html = html.replace(/^(?!<[a-z]|%%)((?:[^\n]+\n?)+)/gm, (match) => {
    const trimmed = match.trim();
    if (trimmed && !trimmed.startsWith('<')) {
      return `<p style="margin: 12px 0; line-height: 1.7; color: ${theme.text};">${trimmed}</p>`;
    }
    return match;
  });

  // Restore code blocks with syntax highlighting colors
  codeBlocks.forEach((block, index) => {
    const langLabel = block.lang ? `<span style="position: absolute; top: 8px; right: 12px; font-size: 10px; color: ${theme.textMuted}; text-transform: uppercase; letter-spacing: 0.5px;">${escapeHtml(block.lang)}</span>` : '';
    html = html.replace(
      `%%CODEBLOCK${index}%%`,
      `<div style="position: relative; margin: 16px 0;"><pre style="background: ${theme.codeBg}; border: 1px solid ${theme.cardBorder}; border-radius: 8px; padding: 16px; overflow-x: auto; font-family: 'Fira Code', 'Monaco', monospace; font-size: 13px; line-height: 1.5;">${langLabel}<code style="color: ${theme.text};">${escapeHtml(block.code)}</code></pre></div>`
    );
  });

  // Restore inline code
  inlineCode.forEach((code, index) => {
    html = html.replace(
      `%%INLINECODE${index}%%`,
      `<code style="background: ${theme.codeBg}; padding: 2px 6px; border-radius: 4px; font-family: 'Fira Code', monospace; font-size: 0.9em; color: ${BRAND.blue};">${escapeHtml(code)}</code>`
    );
  });

  return html;
};

const MarkdownViewer = ({ isDark = true }) => {
  const theme = getTheme(isDark);
  const [markdown, setMarkdown] = useState('');
  const [fileName, setFileName] = useState('');
  const [copied, setCopied] = useState(false);
  const [showRaw, setShowRaw] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const contentRef = useRef(null);

  // Handle link clicks - anchor links scroll within page, external links open in new tab
  const handleContentClick = useCallback((e) => {
    const target = e.target;
    if (target.tagName === 'A' && target.href) {
      e.preventDefault();
      e.stopPropagation();

      const href = target.getAttribute('href');

      // Check if it's an anchor link (starts with #)
      if (href && href.startsWith('#')) {
        const elementId = href.substring(1);
        const element = document.getElementById(elementId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else {
        // External link - open in new tab
        window.open(target.href, '_blank', 'noopener,noreferrer');
      }
    }
  }, []);

  const handleFileUpload = useCallback((file) => {
    if (!file) return;

    if (!file.name.endsWith('.md') && !file.name.endsWith('.markdown') && !file.name.endsWith('.txt')) {
      alert('Please upload a markdown file (.md, .markdown, or .txt)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setMarkdown(e.target.result);
      setFileName(file.name);
    };
    reader.readAsText(file);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileUpload(file);
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName || 'document.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setMarkdown('');
    setFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const parsedHtml = parseMarkdown(markdown, theme);

  // Reading stats
  const readingStats = markdown ? (() => {
    const text = markdown.replace(/```[\s\S]*?```/g, '').replace(/`[^`]+`/g, '').replace(/[#*_~\[\]()>|\\-]/g, '');
    const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
    const chars = markdown.length;
    const lines = markdown.split('\n').length;
    const headings = (markdown.match(/^#{1,6}\s+/gm) || []).length;
    const readingTime = Math.max(1, Math.ceil(words / 200));
    return { words, chars, lines, headings, readingTime };
  })() : null;

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
    transition: 'all 0.2s ease',
  };

  return (
    <div style={{
      width: '100%',
      minHeight: 'calc(100vh - 160px)',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: theme.cardBg,
      borderRadius: '12px',
      border: '1px solid ' + theme.cardBorder,
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        borderBottom: '1px solid ' + theme.cardBorder,
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: `linear-gradient(135deg, ${BRAND.blue}, #8b5cf6)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <FileText size={16} style={{ color: '#fff' }} />
          </div>
          <div>
            <h1 style={{
              fontSize: '16px',
              fontWeight: '700',
              color: theme.text,
              margin: 0,
              fontFamily: FONTS.heading,
            }}>
              Markdown Viewer
            </h1>
            <p style={{ fontSize: '11px', color: theme.textMuted, margin: 0 }}>
              Upload and view markdown files beautifully
            </p>
          </div>
        </div>

        {markdown && (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setShowRaw(!showRaw)}
              style={{
                ...btnStyle,
                backgroundColor: showRaw ? (isDark ? '#1e1a16' : '#faf8f5') : 'transparent',
              }}
            >
              {showRaw ? <Eye size={14} /> : <Code size={14} />}
              {showRaw ? 'Preview' : 'Raw'}
            </button>
            <button onClick={handleCopy} style={btnStyle}>
              {copied ? <Check size={14} style={{ color: BRAND.green }} /> : <Copy size={14} />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
            <button onClick={handleDownload} style={btnStyle}>
              <DownloadSimple size={14} />
              Download
            </button>
            <button
              onClick={handleClear}
              style={{ ...btnStyle, color: '#ef4444', borderColor: '#ef444440' }}
            >
              <Trash size={14} />
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto', padding: markdown ? '0' : '24px' }}>
        {!markdown ? (
          /* Upload Area */
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            style={{
              height: '100%',
              minHeight: '300px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
              border: `2px dashed ${isDragging ? BRAND.blue : theme.cardBorder}`,
              borderRadius: '12px',
              backgroundColor: isDragging ? (isDark ? '#1e1a1620' : '#faf8f520') : 'transparent',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".md,.markdown,.txt"
              onChange={(e) => handleFileUpload(e.target.files[0])}
              style={{ display: 'none' }}
            />
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              backgroundColor: isDark ? '#1e1a16' : '#faf8f5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <FileArrowUp size={28} style={{ color: isDragging ? BRAND.blue : theme.textMuted }} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{
                fontSize: '16px',
                fontWeight: '600',
                color: theme.text,
                margin: '0 0 6px',
                fontFamily: FONTS.heading,
              }}>
                {isDragging ? 'Drop your file here' : 'Upload Markdown File'}
              </p>
              <p style={{ fontSize: '13px', color: theme.textMuted, margin: 0 }}>
                Drag & drop or click to browse
              </p>
              <p style={{ fontSize: '11px', color: theme.textMuted, margin: '8px 0 0' }}>
                Supports .md, .markdown, and .txt files
              </p>
            </div>
          </div>
        ) : (
          /* Markdown Display */
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* File name bar */}
            <div style={{
              padding: '8px 16px',
              backgroundColor: isDark ? '#0d0b09' : '#faf8f5',
              borderBottom: '1px solid ' + theme.cardBorder,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <FileText size={14} style={{ color: theme.textMuted }} />
              <span style={{ fontSize: '12px', color: theme.textMuted }}>{fileName}</span>
              <button
                onClick={() => fileInputRef.current?.click()}
                style={{
                  marginLeft: 'auto',
                  padding: '4px 10px',
                  backgroundColor: 'transparent',
                  border: '1px solid ' + theme.cardBorder,
                  borderRadius: '4px',
                  color: theme.textMuted,
                  fontSize: '11px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <UploadSimple size={12} />
                Change File
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".md,.markdown,.txt"
                onChange={(e) => handleFileUpload(e.target.files[0])}
                style={{ display: 'none' }}
              />
            </div>

            {/* Reading Stats Bar */}
            {readingStats && (
              <div style={{
                padding: '6px 16px',
                backgroundColor: isDark ? '#100e0b' : '#f5f0eb',
                borderBottom: '1px solid ' + theme.cardBorder,
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                flexWrap: 'wrap',
                flexShrink: 0,
              }}>
                <span style={{ fontSize: '11px', color: theme.textMuted, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={10} /> {readingStats.readingTime} min read
                </span>
                <span style={{ fontSize: '11px', color: theme.textMuted, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <TextT size={10} /> {readingStats.words.toLocaleString()} words
                </span>
                <span style={{ fontSize: '11px', color: theme.textMuted, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Hash size={10} /> {readingStats.chars.toLocaleString()} chars
                </span>
                <span style={{ fontSize: '11px', color: theme.textMuted, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <TextAlignLeft size={10} /> {readingStats.lines} lines
                </span>
                {readingStats.headings > 0 && (
                  <span style={{ fontSize: '11px', color: theme.textMuted }}>
                    {readingStats.headings} headings
                  </span>
                )}
              </div>
            )}

            {/* Content area */}
            <div style={{
              flex: 1,
              overflow: 'auto',
              padding: showRaw ? '16px' : '24px 32px',
              backgroundColor: showRaw ? (isDark ? '#0d0b09' : '#faf8f5') : theme.cardBg,
            }}>
              {showRaw ? (
                <pre style={{
                  margin: 0,
                  fontFamily: "'Fira Code', monospace",
                  fontSize: '13px',
                  lineHeight: '1.6',
                  color: theme.text,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}>
                  {markdown}
                </pre>
              ) : (
                <div
                  ref={contentRef}
                  onClick={handleContentClick}
                  style={{
                    maxWidth: '800px',
                    margin: '0 auto',
                    fontFamily: FONTS.body,
                    fontSize: '15px',
                    lineHeight: '1.7',
                    color: theme.text,
                  }}
                  dangerouslySetInnerHTML={{ __html: parsedHtml }}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarkdownViewer;
