/**
 * AI Text Extractor
 * Extract text from images and PDFs using OpenAI Vision API (gpt-4o-mini).
 *
 * Supports: JPEG, PNG, WebP, GIF, BMP, TIFF, PDF
 * - Images: base64 → OpenAI Vision API
 * - Text PDFs: pdf.js getTextContent() (fast, free)
 * - Scanned PDFs: render to canvas → base64 → OpenAI Vision API
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FileMagnifyingGlass, UploadSimple, SpinnerGap, Copy, Check, DownloadSimple, ArrowClockwise, WarningCircle, FileText, FilePdf, Trash, Eye } from '@phosphor-icons/react';
import SEO from './SEO';

// ============================================
// BRAND CONFIGURATION
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
});

// ============================================
// OPENAI CONFIGURATION
// ============================================
const OPENAI_CONFIG = {
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
  edgeFunctionUrl: import.meta.env.VITE_OPENAI_EDGE_URL || '',
  model: 'gpt-4o-mini',
};

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/bmp', 'image/tiff'];
const ACCEPTED_TYPES = [...ACCEPTED_IMAGE_TYPES, 'application/pdf'];
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
const MAX_PDF_PAGES = 20;

const EXTRACTION_PROMPT = `Extract ALL text from this image exactly as it appears. Preserve the original formatting, line breaks, and structure as closely as possible. If there are tables, recreate them using plain text alignment. If there are lists, preserve the list formatting. If no text is found, respond with "[No text detected]". Output only the extracted text, nothing else.`;

// ============================================
// PDF.JS CDN LOADER
// ============================================
const loadPdfJs = () =>
  new Promise((resolve, reject) => {
    if (window.pdfjsLib) {
      resolve(window.pdfjsLib);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    script.onload = () => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      resolve(window.pdfjsLib);
    };
    script.onerror = () => reject(new Error('Failed to load PDF processor.'));
    document.head.appendChild(script);
  });

// ============================================
// OPENAI VISION API CALL
// ============================================
const extractTextFromImage = async (base64DataUrl) => {
  if (OPENAI_CONFIG.edgeFunctionUrl) {
    // Production: call Supabase Edge Function
    const res = await fetch(OPENAI_CONFIG.edgeFunctionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ type: 'vision', image_url: base64DataUrl, prompt: EXTRACTION_PROMPT }),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `API error: ${res.status}`);
    }
    const data = await res.json();
    return data.content || '';
  }

  if (!OPENAI_CONFIG.apiKey) {
    throw new Error('API_NOT_CONFIGURED');
  }

  // Dev mode: direct OpenAI API call
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_CONFIG.apiKey}`,
    },
    body: JSON.stringify({
      model: OPENAI_CONFIG.model,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: EXTRACTION_PROMPT },
            { type: 'image_url', image_url: { url: base64DataUrl, detail: 'high' } },
          ],
        },
      ],
      max_tokens: 4096,
      temperature: 0.1,
    }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error?.message || `OpenAI API error: ${res.status}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
};

// ============================================
// RENDER PDF PAGE TO BASE64
// ============================================
const renderPageToBase64 = async (page) => {
  const scale = 2.0;
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement('canvas');
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const ctx = canvas.getContext('2d');
  await page.render({ canvasContext: ctx, viewport }).promise;
  return canvas.toDataURL('image/png');
};

// ============================================
// READ FILE AS BASE64
// ============================================
const readFileAsBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.readAsDataURL(file);
  });

// ============================================
// FORMAT FILE SIZE
// ============================================
const formatFileSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

// ============================================
// COPY BUTTON COMPONENT
// ============================================
const CopyButton = ({ text, isDark, label = true }) => {
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
        padding: '6px 12px',
        backgroundColor: 'transparent',
        border: `1px solid ${theme.cardBorder}`,
        borderRadius: '8px',
        color: copied ? BRAND.green : theme.textMuted,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        fontSize: '12px',
        fontFamily: FONTS.body,
        transition: 'all 0.2s',
      }}
    >
      {copied ? <Check size={13} /> : <Copy size={13} />}
      {label && (copied ? 'Copied' : 'Copy')}
    </button>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================
const COOLDOWN_KEY = 'brewedops_text_extractor_cooldown_end';
const COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes

const TextExtractor = ({ isDark }) => {
  const theme = getTheme(isDark);
  const fileInputRef = useRef(null);
  const resultsRef = useRef(null);

  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState(null); // 'image' | 'pdf'
  const [previewUrl, setPreviewUrl] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const [status, setStatus] = useState('idle'); // 'idle' | 'processing' | 'done' | 'error'
  const [progressLabel, setProgressLabel] = useState('');
  const [extractedText, setExtractedText] = useState('');
  const [error, setError] = useState('');
  const [cooldownRemaining, setCooldownRemaining] = useState(0);

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
  }, [status]);

  // Cleanup preview URL on unmount or file change
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // Scroll to results when done
  useEffect(() => {
    if (status === 'done' && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [status]);

  const handleFileSelect = useCallback((selectedFile) => {
    if (!selectedFile) return;

    // Validate type
    const isImage = selectedFile.type.startsWith('image/');
    const isPdf = selectedFile.type === 'application/pdf';
    if (!isImage && !isPdf) {
      setError('Unsupported file type. Please upload an image (JPEG, PNG, WebP, GIF, BMP, TIFF) or PDF.');
      return;
    }

    // Validate size
    if (selectedFile.size > MAX_FILE_SIZE) {
      setError(`File exceeds the 20MB limit. Your file is ${formatFileSize(selectedFile.size)}.`);
      return;
    }

    // Clear previous state
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setError('');
    setExtractedText('');
    setStatus('idle');

    setFile(selectedFile);
    setFileType(isImage ? 'image' : 'pdf');

    if (isImage) {
      setPreviewUrl(URL.createObjectURL(selectedFile));
    } else {
      setPreviewUrl(null);
    }
  }, [previewUrl]);

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) handleFileSelect(droppedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  };

  const handleClear = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setFileType(null);
    setPreviewUrl(null);
    setExtractedText('');
    setError('');
    setStatus('idle');
    setProgressLabel('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleExtract = async () => {
    if (!file) return;
    setStatus('processing');
    setError('');
    setExtractedText('');

    try {
      if (fileType === 'image') {
        setProgressLabel('Reading image...');
        const base64 = await readFileAsBase64(file);
        setProgressLabel('Extracting text with AI...');
        const text = await extractTextFromImage(base64);
        setExtractedText(text);
        setStatus('done');
        localStorage.setItem(COOLDOWN_KEY, String(Date.now() + COOLDOWN_MS));
        setCooldownRemaining(COOLDOWN_MS);
      } else if (fileType === 'pdf') {
        setProgressLabel('Loading PDF processor...');
        const pdfJs = await loadPdfJs();

        setProgressLabel('Opening PDF...');
        const arrayBuffer = await file.arrayBuffer();
        const doc = await pdfJs.getDocument({ data: arrayBuffer }).promise;
        const numPages = Math.min(doc.numPages, MAX_PDF_PAGES);

        if (doc.numPages > MAX_PDF_PAGES) {
          setError(`PDF has ${doc.numPages} pages. Processing first ${MAX_PDF_PAGES} pages only.`);
        }

        let allText = '';

        for (let i = 1; i <= numPages; i++) {
          setProgressLabel(`Processing page ${i} of ${numPages}...`);
          const page = await doc.getPage(i);

          // Try text extraction first (fast, free)
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map((item) => item.str).join(' ').trim();

          if (pageText.length > 20) {
            // Text-based PDF — use extracted text
            if (numPages > 1) {
              allText += `--- Page ${i} ---\n${pageText}\n\n`;
            } else {
              allText += pageText;
            }
          } else {
            // Scanned PDF — render to image and use Vision API
            setProgressLabel(`Scanning page ${i} of ${numPages} with AI...`);
            const base64 = await renderPageToBase64(page);
            const ocrText = await extractTextFromImage(base64);
            if (numPages > 1) {
              allText += `--- Page ${i} ---\n${ocrText}\n\n`;
            } else {
              allText += ocrText;
            }
          }
        }

        setExtractedText(allText.trim());
        setStatus('done');
        localStorage.setItem(COOLDOWN_KEY, String(Date.now() + COOLDOWN_MS));
        setCooldownRemaining(COOLDOWN_MS);
      }
    } catch (err) {
      if (err.message === 'API_NOT_CONFIGURED') {
        setError('OpenAI API key not configured. Add VITE_OPENAI_API_KEY to your .env file.');
      } else {
        setError(err.message || 'Failed to extract text. Please try again.');
      }
      setStatus('error');
    } finally {
      setProgressLabel('');
    }
  };

  const handleDownloadTxt = () => {
    if (!extractedText) return;
    const blob = new Blob([extractedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${file?.name?.replace(/\.[^.]+$/, '') || 'extracted'}_text.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const wordCount = extractedText ? extractedText.split(/\s+/).filter(Boolean).length : 0;
  const charCount = extractedText.length;

  return (
    <div style={{ fontFamily: FONTS.body }}>
      <SEO
        title="AI Text Extractor - OCR from Images & PDFs | BrewedOps"
        description="Extract text from images and PDFs using AI-powered OCR. Supports JPEG, PNG, WebP, GIF, BMP, TIFF, and scanned PDFs. Free online tool by BrewedOps."
        keywords="AI text extractor, OCR online, extract text from image, extract text from PDF, image to text, scanned PDF OCR, BrewedOps AI tools"
      />
      {/* Animation keyframes */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes progressBar {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '6px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            background: `linear-gradient(135deg, ${BRAND.blue}, #0066dd)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <FileMagnifyingGlass size={26} weight="bold" style={{ color: '#fff' }} />
          </div>
          <div>
            <h2 style={{
              margin: 0,
              fontSize: '24px',
              fontWeight: '800',
              color: theme.text,
              fontFamily: FONTS.heading,
              letterSpacing: '-0.02em',
            }}>
              AI Text Extractor
            </h2>
            <p style={{
              margin: '2px 0 0',
              fontSize: '15px',
              color: theme.textMuted,
              lineHeight: '1.5',
            }}>
              Extract text from images and PDFs using AI
            </p>
          </div>
        </div>
      </div>

      {/* Upload Zone */}
      {!file && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: `2px dashed ${dragOver ? BRAND.blue : theme.cardBorder}`,
            borderRadius: '16px',
            backgroundColor: dragOver
              ? (isDark ? BRAND.blue + '10' : BRAND.blue + '08')
              : (isDark ? '#171411' : '#ffffff'),
            padding: '48px 24px',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s',
            marginBottom: '24px',
            animation: 'fadeInUp 0.4s ease both',
          }}
        >
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '18px',
            background: isDark
              ? `linear-gradient(135deg, ${BRAND.blue}20, ${BRAND.green}15)`
              : `linear-gradient(135deg, ${BRAND.blue}15, ${BRAND.green}10)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
          }}>
            <UploadSimple size={32} weight="duotone" style={{ color: BRAND.blue }} />
          </div>
          <h3 style={{
            margin: '0 0 6px',
            fontSize: '17px',
            fontWeight: '700',
            color: theme.text,
            fontFamily: FONTS.heading,
          }}>
            Upload Image or PDF
          </h3>
          <p style={{
            margin: '0 0 20px',
            fontSize: '14px',
            color: theme.textMuted,
            lineHeight: '1.6',
          }}>
            Drag & drop a file here, or click to browse
          </p>
          <button
            onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
            style={{
              padding: '10px 24px',
              backgroundColor: BRAND.blue,
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '600',
              fontFamily: FONTS.body,
              cursor: 'pointer',
              marginBottom: '16px',
            }}
          >
            Select File
          </button>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px',
            justifyContent: 'center',
            marginTop: '4px',
          }}>
            {['JPEG', 'PNG', 'WebP', 'GIF', 'BMP', 'TIFF', 'PDF'].map((fmt) => (
              <span
                key={fmt}
                style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  color: theme.textMuted,
                  backgroundColor: isDark ? '#1e1a16' : '#f5f0eb',
                  padding: '3px 10px',
                  borderRadius: '20px',
                  letterSpacing: '0.3px',
                }}
              >
                {fmt}
              </span>
            ))}
          </div>
          <p style={{
            margin: '12px 0 0',
            fontSize: '12px',
            color: theme.textMuted,
            opacity: 0.7,
          }}>
            Max file size: 20MB
          </p>
          {cooldownRemaining > 0 && (
            <p style={{
              margin: '10px 0 0',
              fontSize: '13px',
              color: '#f59e0b',
              fontWeight: '600',
              fontFamily: FONTS.body,
            }}>
              Cooldown active — available in {Math.floor(cooldownRemaining / 60000)}:{String(Math.floor((cooldownRemaining % 60000) / 1000)).padStart(2, '0')}
            </p>
          )}
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(',')}
        onChange={(e) => handleFileSelect(e.target.files?.[0])}
        style={{ display: 'none' }}
      />

      {/* File Info + Preview */}
      {file && (
        <div style={{
          backgroundColor: theme.cardBg,
          border: `1px solid ${theme.cardBorder}`,
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '20px',
          animation: 'fadeInUp 0.4s ease both',
        }}>
          {/* File info bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: previewUrl ? '20px' : '0',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: fileType === 'pdf'
                  ? '#ef444420'
                  : BRAND.blue + '20',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                {fileType === 'pdf'
                  ? <FilePdf size={20} weight="duotone" style={{ color: '#ef4444' }} />
                  : <FileText size={20} weight="duotone" style={{ color: BRAND.blue }} />
                }
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{
                  margin: 0,
                  fontSize: '14px',
                  fontWeight: '600',
                  color: theme.text,
                  fontFamily: FONTS.body,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {file.name}
                </p>
                <p style={{
                  margin: '2px 0 0',
                  fontSize: '12px',
                  color: theme.textMuted,
                }}>
                  {formatFileSize(file.size)} &middot; {fileType === 'pdf' ? 'PDF Document' : file.type.split('/')[1]?.toUpperCase()}
                </p>
              </div>
            </div>
            <button
              onClick={handleClear}
              title="Remove file"
              style={{
                width: '36px',
                height: '36px',
                backgroundColor: 'transparent',
                border: `1px solid ${theme.cardBorder}`,
                borderRadius: '8px',
                color: theme.textMuted,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Trash size={16} />
            </button>
          </div>

          {/* Image Preview */}
          {previewUrl && (
            <div style={{
              backgroundColor: isDark ? '#0d0b09' : '#f5f0eb',
              border: `1px solid ${theme.cardBorder}`,
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              justifyContent: 'center',
              overflow: 'hidden',
            }}>
              <img
                src={previewUrl}
                alt="Preview"
                style={{
                  maxWidth: '100%',
                  maxHeight: '320px',
                  objectFit: 'contain',
                  borderRadius: '8px',
                }}
              />
            </div>
          )}
        </div>
      )}

      {/* Extract Button */}
      {file && status !== 'done' && (
        <div style={{ marginBottom: '24px' }}>
          <button
            onClick={handleExtract}
            disabled={status === 'processing' || cooldownRemaining > 0}
            style={{
              width: '100%',
              height: '52px',
              backgroundColor: status === 'processing'
                ? (isDark ? '#1a2e4a' : '#dbeafe')
                : cooldownRemaining > 0 ? (isDark ? '#2a2420' : '#e8e0d4') : BRAND.blue,
              color: status === 'processing' ? BRAND.blue : cooldownRemaining > 0 ? (isDark ? '#a09585' : '#7a6652') : '#fff',
              border: 'none',
              borderRadius: '12px',
              fontSize: '15px',
              fontWeight: '600',
              fontFamily: FONTS.body,
              cursor: status === 'processing' || cooldownRemaining > 0 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              opacity: cooldownRemaining > 0 ? 0.7 : 1,
              transition: 'all 0.2s',
            }}
          >
            {status === 'processing' ? (
              <>
                <SpinnerGap size={18} style={{ animation: 'spin 1s linear infinite' }} />
                {progressLabel || 'Processing...'}
              </>
            ) : cooldownRemaining > 0 ? (
              <>
                <FileMagnifyingGlass size={18} weight="bold" />
                {`Available in ${Math.floor(cooldownRemaining / 60000)}:${String(Math.floor((cooldownRemaining % 60000) / 1000)).padStart(2, '0')}`}
              </>
            ) : (
              <>
                <FileMagnifyingGlass size={18} weight="bold" />
                Extract Text
              </>
            )}
          </button>

          {/* Progress bar */}
          {status === 'processing' && (
            <div style={{
              marginTop: '12px',
              height: '4px',
              borderRadius: '2px',
              backgroundColor: isDark ? '#2a2420' : '#e8e0d4',
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                borderRadius: '2px',
                background: `linear-gradient(90deg, ${BRAND.blue}, ${BRAND.green}, ${BRAND.blue})`,
                backgroundSize: '200% 100%',
                animation: 'progressBar 1.5s linear infinite',
              }} />
            </div>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '10px',
          padding: '14px 16px',
          backgroundColor: isDark ? '#260a0a' : '#fef2f2',
          border: `1px solid ${isDark ? '#7f1d1d' : '#fecaca'}`,
          borderRadius: '10px',
          marginBottom: '24px',
          animation: 'fadeInUp 0.3s ease both',
        }}>
          <WarningCircle size={18} style={{ color: '#ef4444', flexShrink: 0, marginTop: '1px' }} />
          <p style={{
            margin: 0,
            fontSize: '13px',
            color: isDark ? '#fca5a5' : '#dc2626',
            fontFamily: FONTS.body,
            lineHeight: '1.5',
          }}>
            {error}
          </p>
        </div>
      )}

      {/* Results */}
      {status === 'done' && extractedText && (
        <div ref={resultsRef} style={{ animation: 'fadeInUp 0.4s ease both' }}>
          {/* Results header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
            paddingBottom: '14px',
            borderBottom: `2px solid ${theme.cardBorder}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Eye size={20} style={{ color: BRAND.green }} />
              <span style={{
                fontSize: '17px',
                fontWeight: '700',
                color: theme.text,
                fontFamily: FONTS.heading,
              }}>
                Extracted Text
              </span>
              <span style={{
                fontSize: '12px',
                padding: '3px 10px',
                backgroundColor: BRAND.green + '20',
                color: BRAND.green,
                borderRadius: '20px',
                fontWeight: '600',
              }}>
                {wordCount} words
              </span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <CopyButton text={extractedText} isDark={isDark} />
              <button
                onClick={handleDownloadTxt}
                style={{
                  padding: '6px 12px',
                  backgroundColor: 'transparent',
                  border: `1px solid ${theme.cardBorder}`,
                  borderRadius: '8px',
                  color: theme.textMuted,
                  fontSize: '12px',
                  fontFamily: FONTS.body,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                }}
              >
                <DownloadSimple size={13} />
                Download .txt
              </button>
            </div>
          </div>

          {/* Extracted text area */}
          <div style={{
            backgroundColor: theme.cardBg,
            border: `1px solid ${theme.cardBorder}`,
            borderRadius: '16px',
            overflow: 'hidden',
            marginBottom: '16px',
          }}>
            <textarea
              value={extractedText}
              onChange={(e) => setExtractedText(e.target.value)}
              style={{
                width: '100%',
                minHeight: '280px',
                padding: '24px',
                backgroundColor: 'transparent',
                border: 'none',
                color: theme.text,
                fontSize: '14px',
                fontFamily: "'Fira Code', 'Cascadia Code', 'Consolas', monospace",
                lineHeight: '1.8',
                resize: 'vertical',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            {/* Footer stats */}
            <div style={{
              padding: '10px 24px',
              borderTop: `1px solid ${theme.cardBorder}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <span style={{ fontSize: '12px', color: theme.textMuted }}>
                {wordCount} words &middot; {charCount} characters
              </span>
              <span style={{ fontSize: '12px', color: theme.textMuted, fontStyle: 'italic' }}>
                Editable — correct any mistakes above
              </span>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handleClear}
              style={{
                padding: '10px 20px',
                backgroundColor: 'transparent',
                border: `1px solid ${theme.cardBorder}`,
                borderRadius: '10px',
                color: theme.text,
                fontSize: '14px',
                fontWeight: '500',
                fontFamily: FONTS.body,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <ArrowClockwise size={16} />
              New Extraction
            </button>
          </div>
        </div>
      )}

      {/* Empty state capabilities info */}
      {!file && status === 'idle' && !error && (
        <div style={{
          backgroundColor: theme.cardBg,
          border: `1px solid ${theme.cardBorder}`,
          borderRadius: '16px',
          padding: '24px',
          animation: 'fadeInUp 0.4s ease 0.1s both',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '16px',
          }}>
            <FileMagnifyingGlass size={18} weight="bold" style={{ color: BRAND.blue }} />
            <span style={{
              fontSize: '14px',
              fontWeight: '700',
              color: theme.text,
              fontFamily: FONTS.heading,
            }}>
              AI-Powered Extraction
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { label: 'Images', desc: 'Extract text from photos, screenshots, scanned documents, and more' },
              { label: 'PDFs', desc: 'Process text-based and scanned PDFs with page-by-page extraction' },
              { label: 'Formatting', desc: 'Preserves original layout, tables, and list structures' },
            ].map((item) => (
              <div key={item.label} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <span style={{
                  color: BRAND.green,
                  fontSize: '7px',
                  marginTop: '7px',
                  flexShrink: 0,
                }}>&#x25CF;</span>
                <div>
                  <span style={{
                    fontSize: '13px',
                    fontWeight: '600',
                    color: theme.text,
                  }}>
                    {item.label}
                  </span>
                  <span style={{
                    fontSize: '13px',
                    color: theme.textMuted,
                  }}>
                    {' — '}{item.desc}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TextExtractor;
