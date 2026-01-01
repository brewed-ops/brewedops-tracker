// ImageToText.jsx - OCR Text Extraction Tool for BrewedOps
import React, { useState, useRef, useCallback } from 'react';
import { Upload, Copy, Check, ScanText, Loader2, Download, Trash2, AlertTriangle, Languages } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { getTheme } from '../lib/theme';
import Tesseract from 'tesseract.js';

const BRAND = { brown: '#3F200C', blue: '#004AAC', green: '#51AF43', cream: '#FFF0D4' };
const FONTS = { heading: "'Montserrat', sans-serif", body: "'Poppins', sans-serif" };

const LANGUAGES = [
  { code: 'eng', name: 'English' },
  { code: 'spa', name: 'Spanish' },
  { code: 'fra', name: 'French' },
  { code: 'deu', name: 'German' },
  { code: 'ita', name: 'Italian' },
  { code: 'por', name: 'Portuguese' },
  { code: 'chi_sim', name: 'Chinese (Simplified)' },
  { code: 'jpn', name: 'Japanese' },
  { code: 'kor', name: 'Korean' },
  { code: 'ara', name: 'Arabic' },
];

const ImageToText = ({ isDark }) => {
  const theme = getTheme(isDark);
  const [imageUrl, setImageUrl] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [language, setLanguage] = useState('eng');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  
  const fileInputRef = useRef(null);

  const handleFileUpload = useCallback((file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }
    setError(null);
    setExtractedText('');
    const url = URL.createObjectURL(file);
    setImageUrl(url);
  }, []);

  const extractText = useCallback(async () => {
    if (!imageUrl) return;
    
    setIsProcessing(true);
    setProgress(0);
    setError(null);
    
    try {
      const result = await Tesseract.recognize(imageUrl, language, {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100));
          }
        }
      });
      
      setExtractedText(result.data.text);
    } catch (err) {
      console.error('OCR Error:', err);
      setError('Failed to extract text. Please try again.');
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  }, [imageUrl, language]);

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
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    setImageUrl(null);
    setExtractedText('');
    setError(null);
    setShowClearConfirm(false);
  };

  return (
    <div className="p-4 md:p-6 w-full min-h-screen" style={{ backgroundColor: theme.bg, fontFamily: FONTS.body }}>
      <div className="mb-6">
        <h1 className="text-xl md:text-3xl font-bold mb-1 flex items-center gap-2" style={{ color: theme.text, fontFamily: FONTS.heading }}>
          <ScanText className="size-5 md:size-8 shrink-0" style={{ color: BRAND.blue }} />
          Image to Text (OCR)
        </h1>
        <p className="text-xs md:text-sm text-muted-foreground">Extract text from images, screenshots, and documents</p>
      </div>

      <div className="max-w-4xl mx-auto">
        {!imageUrl ? (
          <Card>
            <CardContent className="p-6 md:p-12">
              <div className="border-2 border-dashed rounded-xl p-8 md:p-12 text-center cursor-pointer hover:border-primary hover:bg-primary/5"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); handleFileUpload(e.dataTransfer.files?.[0]); }}>
                <div className="size-20 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ backgroundColor: BRAND.blue + '15' }}>
                  <ScanText className="size-10" style={{ color: BRAND.blue }} />
                </div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: theme.text, fontFamily: FONTS.heading }}>Upload Image</h3>
                <p className="text-muted-foreground mb-4">Drag & drop or click to select an image</p>
                <Button style={{ backgroundColor: BRAND.blue }}><Upload className="size-4 mr-2" />Select Image</Button>
                <p className="text-xs text-muted-foreground mt-4">Supports PNG, JPG, WebP, GIF</p>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => handleFileUpload(e.target.files?.[0])} className="hidden" />
              
              <div className="mt-6 p-4 rounded-lg border" style={{ backgroundColor: BRAND.blue + '08', borderColor: BRAND.blue + '20' }}>
                <div className="flex gap-3">
                  <Languages className="size-5 shrink-0 mt-0.5" style={{ color: BRAND.blue }} />
                  <div>
                    <p className="text-sm font-medium" style={{ color: BRAND.blue }}>Multi-Language Support</p>
                    <p className="text-xs text-muted-foreground mt-1">Extract text in English, Spanish, French, Chinese, Japanese, and more.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Image Preview */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <Label className="font-medium" style={{ color: theme.text }}>Source Image</Label>
                  <Button variant="outline" size="sm" onClick={() => setShowClearConfirm(true)} className="text-destructive">
                    <Trash2 className="size-4 mr-1" />Clear
                  </Button>
                </div>
                
                <img src={imageUrl} alt="Source" className="w-full rounded-lg mb-4" style={{ maxHeight: '300px', objectFit: 'contain' }} />
                
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm mb-2 block">Language</Label>
                    <select value={language} onChange={(e) => setLanguage(e.target.value)}
                      className="w-full h-10 px-3 border rounded-lg bg-background" style={{ borderColor: theme.cardBorder }}>
                      {LANGUAGES.map(lang => (
                        <option key={lang.code} value={lang.code}>{lang.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <Button onClick={extractText} disabled={isProcessing} className="w-full" style={{ backgroundColor: BRAND.blue }}>
                    {isProcessing ? (
                      <><Loader2 className="size-4 mr-2 animate-spin" />Processing... {progress}%</>
                    ) : (
                      <><ScanText className="size-4 mr-2" />Extract Text</>
                    )}
                  </Button>
                  
                  {isProcessing && (
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="h-2 rounded-full transition-all" style={{ width: `${progress}%`, backgroundColor: BRAND.blue }} />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Extracted Text */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <Label className="font-medium" style={{ color: theme.text }}>Extracted Text</Label>
                  {extractedText && (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={copyText}>
                        {copied ? <Check className="size-4 mr-1 text-green-500" /> : <Copy className="size-4 mr-1" />}
                        {copied ? 'Copied!' : 'Copy'}
                      </Button>
                      <Button variant="outline" size="sm" onClick={downloadText}>
                        <Download className="size-4 mr-1" />Save
                      </Button>
                    </div>
                  )}
                </div>
                
                <textarea
                  value={extractedText}
                  onChange={(e) => setExtractedText(e.target.value)}
                  placeholder={isProcessing ? "Extracting text..." : "Extracted text will appear here..."}
                  className="w-full h-[300px] p-3 border rounded-lg bg-background resize-none font-mono text-sm"
                  style={{ borderColor: theme.cardBorder }}
                  readOnly={isProcessing}
                />
                
                {extractedText && (
                  <p className="text-xs text-muted-foreground mt-2">{extractedText.split(/\s+/).filter(Boolean).length} words • {extractedText.length} characters</p>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
            <div className="flex gap-3">
              <AlertTriangle className="size-5 text-destructive shrink-0" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          </div>
        )}
      </div>

      <Dialog open={showClearConfirm} onOpenChange={setShowClearConfirm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><AlertTriangle className="size-5 text-amber-500" />Clear All?</DialogTitle>
            <DialogDescription>This will remove the image and extracted text.</DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowClearConfirm(false)}>Cancel</Button>
            <Button variant="destructive" onClick={clearAll}><Trash2 className="size-4 mr-2" />Clear All</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImageToText;
