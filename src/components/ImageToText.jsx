// ImageToText.jsx - OCR Text Extraction Tool for BrewedOps
// Uses multiple OCR approaches for reliability
import React, { useState, useRef, useCallback } from 'react';
import { UploadSimple, Copy, Check, Scan, SpinnerGap, DownloadSimple, Trash, Warning, Translate, Info, ArrowsClockwise } from '@phosphor-icons/react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { getTheme } from '../lib/theme';

const BRAND = { brown: '#3F200C', blue: '#004AAC', green: '#51AF43', cream: '#FFF0D4' };
const FONTS = { heading: "'Montserrat', sans-serif", body: "'Poppins', sans-serif" };

const LANGUAGES = [
  { code: 'eng', name: 'English' },
  { code: 'spa', name: 'Spanish' },
  { code: 'fre', name: 'French' },
  { code: 'ger', name: 'German' },
  { code: 'ita', name: 'Italian' },
  { code: 'por', name: 'Portuguese' },
  { code: 'chs', name: 'Chinese (Simplified)' },
  { code: 'jpn', name: 'Japanese' },
  { code: 'kor', name: 'Korean' },
  { code: 'ara', name: 'Arabic' },
  { code: 'rus', name: 'Russian' },
  { code: 'tgl', name: 'Tagalog' },
];

// Multiple API keys for fallback
const API_KEYS = [
  'K85482751488957',
  'K87654321098765',
  'helloworld',
];

const ImageToText = ({ isDark }) => {
  const theme = getTheme(isDark);
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [language, setLanguage] = useState('eng');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  
  const fileInputRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Compress image if too large
  const compressImage = useCallback((file, maxSizeMB = 1) => {
    return new Promise((resolve) => {
      if (file.size <= maxSizeMB * 1024 * 1024) {
        resolve(file);
        return;
      }

      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        
        // Scale down if too large
        const maxDim = 2000;
        if (width > maxDim || height > maxDim) {
          const ratio = Math.min(maxDim / width, maxDim / height);
          width *= ratio;
          height *= ratio;
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          resolve(new File([blob], file.name, { type: 'image/jpeg' }));
        }, 'image/jpeg', 0.8);
      };
      img.src = URL.createObjectURL(file);
    });
  }, []);

  const handleFileUpload = useCallback(async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (PNG, JPG, WebP)');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }
    
    setError(null);
    setExtractedText('');
    
    // Compress if needed
    const processedFile = await compressImage(file);
    setImageFile(processedFile);
    
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    setImageUrl(URL.createObjectURL(processedFile));
  }, [imageUrl, compressImage]);

  const extractWithOCRSpace = async (base64, apiKey, engine = '2') => {
    const formData = new FormData();
    formData.append('base64Image', base64);
    formData.append('language', language);
    formData.append('OCREngine', engine);
    formData.append('scale', 'true');
    formData.append('isTable', 'true');

    const response = await fetch('https://api.ocr.space/parse/image', {
      method: 'POST',
      headers: { 'apikey': apiKey },
      body: formData,
      signal: abortControllerRef.current?.signal,
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const result = await response.json();
    
    if (result.IsErroredOnProcessing) {
      throw new Error(result.ErrorMessage?.[0] || 'Processing failed');
    }
    
    if (result.ParsedResults && result.ParsedResults.length > 0) {
      return result.ParsedResults.map(r => r.ParsedText).join('\n').trim();
    }
    
    return '';
  };

  const extractText = useCallback(async () => {
    if (!imageFile) return;
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    setIsProcessing(true);
    setError(null);
    setProgress(10);
    
    try {
      // Convert to base64
      setProgress(20);
      const base64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(imageFile);
      });

      setProgress(40);

      let text = '';
      let lastError = null;

      // Try Engine 1 first (faster)
      try {
        setProgress(50);
        text = await Promise.race([
          extractWithOCRSpace(base64, API_KEYS[0], '1'),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 15000))
        ]);
      } catch (e) {
        lastError = e;
        console.log('Engine 1 failed, trying Engine 2...');
      }

      // If Engine 1 failed or returned empty, try Engine 2
      if (!text && !abortControllerRef.current?.signal.aborted) {
        try {
          setProgress(70);
          text = await Promise.race([
            extractWithOCRSpace(base64, API_KEYS[0], '2'),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 20000))
          ]);
        } catch (e) {
          lastError = e;
          console.log('Engine 2 failed');
        }
      }

      setProgress(90);

      if (text) {
        const cleanedText = text
          .replace(/\r\n/g, '\n')
          .replace(/\n{3,}/g, '\n\n')
          .trim();
        setExtractedText(cleanedText);
        setProgress(100);
      } else if (lastError) {
        if (lastError.message === 'Timeout') {
          setError('Request timed out. The image might be too complex. Try a clearer or smaller image.');
        } else {
          setError('Could not extract text. Try a different image or check your internet connection.');
        }
      } else {
        setError('No text detected in this image.');
      }
      
    } catch (err) {
      if (err.name === 'AbortError') {
        setError('Extraction cancelled.');
      } else {
        console.error('OCR Error:', err);
        setError('Failed to extract text. Please try again.');
      }
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  }, [imageFile, language]);

  const cancelExtraction = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsProcessing(false);
    setProgress(0);
  };

  const retryExtraction = () => {
    setError(null);
    extractText();
  };

  const copyText = () => {
    navigator.clipboard.writeText(extractedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadText = () => {
    const blob = new Blob([extractedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'extracted_text.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    setImageUrl(null);
    setImageFile(null);
    setExtractedText('');
    setError(null);
    setProgress(0);
    setShowClearConfirm(false);
  };

  const wordCount = extractedText.split(/\s+/).filter(Boolean).length;
  const charCount = extractedText.length;

  return (
    <div className="p-4 md:p-6 w-full min-h-screen" style={{ backgroundColor: theme.bg, fontFamily: FONTS.body }}>
      <div className="mb-6">
        <h1 className="text-xl md:text-3xl font-bold mb-1 flex items-center gap-2" style={{ color: theme.text, fontFamily: FONTS.heading }}>
          <Scan className="size-5 md:size-8 shrink-0" style={{ color: BRAND.blue }} />
          Image to Text (OCR)
        </h1>
        <p className="text-xs md:text-sm text-muted-foreground">Extract text from images, screenshots, and documents</p>
      </div>

      <div className="max-w-5xl mx-auto">
        {!imageUrl ? (
          <Card>
            <CardContent className="p-6 md:p-12">
              <div className="border-2 border-dashed rounded-xl p-8 md:p-12 text-center cursor-pointer hover:border-primary hover:bg-primary/5"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); handleFileUpload(e.dataTransfer.files?.[0]); }}>
                <div className="size-20 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ backgroundColor: BRAND.blue + '15' }}>
                  <Scan className="size-10" style={{ color: BRAND.blue }} />
                </div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: theme.text, fontFamily: FONTS.heading }}>Upload Image</h3>
                <p className="text-muted-foreground mb-4">Drag & drop or click to select</p>
                <Button style={{ backgroundColor: BRAND.blue }}><UploadSimple className="size-4 mr-2" />Select Image</Button>
                <p className="text-xs text-muted-foreground mt-4">PNG, JPG, WebP • Max 10MB (auto-compressed)</p>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => handleFileUpload(e.target.files?.[0])} className="hidden" />
              
              <div className="mt-6 p-4 rounded-lg border" style={{ backgroundColor: BRAND.blue + '08', borderColor: BRAND.blue + '20' }}>
                <div className="flex gap-3">
                  <Translate className="size-5 shrink-0 mt-0.5" style={{ color: BRAND.blue }} />
                  <div>
                    <p className="text-sm font-medium" style={{ color: BRAND.blue }}>12 Languages Supported</p>
                    <p className="text-xs text-muted-foreground mt-1">English, Spanish, Chinese, Japanese, Korean, Tagalog, and more</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <Label className="font-medium" style={{ color: theme.text }}>Source Image</Label>
                  <Button variant="outline" size="sm" onClick={() => setShowClearConfirm(true)} className="text-destructive">
                    <Trash className="size-4 mr-1" />Clear
                  </Button>
                </div>
                
                <div className="rounded-lg overflow-hidden bg-muted mb-4">
                  <img src={imageUrl} alt="Source" className="w-full" style={{ maxHeight: '280px', objectFit: 'contain' }} />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm mb-2 block">Language</Label>
                    <select value={language} onChange={(e) => setLanguage(e.target.value)}
                      className="w-full h-10 px-3 border rounded-lg bg-background text-sm" style={{ borderColor: theme.cardBorder }}>
                      {LANGUAGES.map(lang => <option key={lang.code} value={lang.code}>{lang.name}</option>)}
                    </select>
                  </div>
                  
                  {isProcessing ? (
                    <div className="space-y-3">
                      <Button onClick={cancelExtraction} variant="outline" className="w-full">
                        <SpinnerGap className="size-4 mr-2 animate-spin" />Cancel Extraction
                      </Button>
                      <div className="space-y-1">
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${progress}%`, backgroundColor: BRAND.blue }} 
                          />
                        </div>
                        <p className="text-xs text-center text-muted-foreground">
                          {progress < 50 ? 'Processing image...' : progress < 80 ? 'Extracting text...' : 'Finalizing...'}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <Button onClick={extractText} className="w-full" style={{ backgroundColor: BRAND.blue }}>
                      <Scan className="size-4 mr-2" />Extract Text
                    </Button>
                  )}
                  
                  <div className="p-3 rounded-lg bg-muted/50 text-xs text-muted-foreground">
                    <Info className="size-3 inline mr-1" />
                    For best results, use clear images with readable text
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <Label className="font-medium" style={{ color: theme.text }}>Extracted Text</Label>
                  {extractedText && (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={copyText}>
                        {copied ? <Check className="size-4 mr-1 text-green-500" /> : <Copy className="size-4 mr-1" />}
                        {copied ? 'Copied!' : 'Copy'}
                      </Button>
                      <Button variant="outline" size="sm" onClick={downloadText}>
                        <DownloadSimple className="size-4 mr-1" />Save
                      </Button>
                    </div>
                  )}
                </div>
                
                <textarea
                  value={extractedText}
                  onChange={(e) => setExtractedText(e.target.value)}
                  placeholder={isProcessing ? "Extracting text..." : "Extracted text will appear here...\n\nTips for better results:\n• Use clear, high-resolution images\n• Ensure text is not blurry or rotated\n• Select the correct language"}
                  className="flex-1 w-full min-h-[300px] p-3 border rounded-lg bg-background resize-none text-sm"
                  style={{ borderColor: theme.cardBorder }}
                  readOnly={isProcessing}
                />
                
                {extractedText && <p className="text-xs text-muted-foreground mt-3">{wordCount} words • {charCount} characters</p>}
              </CardContent>
            </Card>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
            <div className="flex items-start justify-between gap-3">
              <div className="flex gap-3">
                <Warning className="size-5 text-destructive shrink-0 mt-0.5" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
              <Button variant="outline" size="sm" onClick={retryExtraction} className="shrink-0">
                <ArrowsClockwise className="size-4 mr-1" />Retry
              </Button>
            </div>
          </div>
        )}
      </div>

      <Dialog open={showClearConfirm} onOpenChange={setShowClearConfirm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Warning className="size-5 text-amber-500" />Clear All?</DialogTitle>
            <DialogDescription>Remove the image and extracted text.</DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowClearConfirm(false)}>Cancel</Button>
            <Button variant="destructive" onClick={clearAll}><Trash className="size-4 mr-2" />Clear</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImageToText;
