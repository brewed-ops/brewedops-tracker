// ImageToText.jsx - OCR Text Extraction Tool for BrewedOps
// Uses OCR.space API for better accuracy with ID cards, documents, etc.
import React, { useState, useRef, useCallback } from 'react';
import { Upload, Copy, Check, ScanText, Loader2, Download, Trash2, AlertTriangle, Languages, Wand2, Info } from 'lucide-react';
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
  { code: 'cht', name: 'Chinese (Traditional)' },
  { code: 'jpn', name: 'Japanese' },
  { code: 'kor', name: 'Korean' },
  { code: 'ara', name: 'Arabic' },
  { code: 'rus', name: 'Russian' },
  { code: 'hin', name: 'Hindi' },
  { code: 'tha', name: 'Thai' },
  { code: 'vie', name: 'Vietnamese' },
  { code: 'tgl', name: 'Tagalog' },
];

const OCR_ENGINES = [
  { id: '1', name: 'Standard (Fast)', description: 'Good for printed text' },
  { id: '2', name: 'Advanced (Accurate)', description: 'Better for complex layouts, IDs' },
];

const ImageToText = ({ isDark }) => {
  const theme = getTheme(isDark);
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [language, setLanguage] = useState('eng');
  const [ocrEngine, setOcrEngine] = useState('2');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  
  const fileInputRef = useRef(null);

  const handleFileUpload = useCallback((file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (PNG, JPG, WebP)');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB for OCR processing');
      return;
    }
    
    setError(null);
    setExtractedText('');
    setImageFile(file);
    
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    setImageUrl(URL.createObjectURL(file));
  }, [imageUrl]);

  const extractText = useCallback(async () => {
    if (!imageFile) return;
    
    setIsProcessing(true);
    setError(null);
    
    try {
      // Convert image to base64
      const base64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(imageFile);
      });

      // Use OCR.space free API
      const formData = new FormData();
      formData.append('base64Image', base64);
      formData.append('language', language);
      formData.append('OCREngine', ocrEngine);
      formData.append('isTable', 'true');
      formData.append('detectOrientation', 'true');
      formData.append('scale', 'true');

      const response = await fetch('https://api.ocr.space/parse/image', {
        method: 'POST',
        headers: {
          'apikey': 'K85482751488957', // Free tier API key
        },
        body: formData,
      });

      const result = await response.json();

      if (result.IsErroredOnProcessing) {
        throw new Error(result.ErrorMessage?.[0] || 'OCR processing failed');
      }

      if (result.ParsedResults && result.ParsedResults.length > 0) {
        const text = result.ParsedResults.map(r => r.ParsedText).join('\n').trim();
        
        if (!text) {
          setError('No text was detected in this image. Try a clearer image or different settings.');
        } else {
          // Clean up the text
          const cleanedText = text
            .replace(/\r\n/g, '\n')
            .replace(/\n{3,}/g, '\n\n')
            .trim();
          setExtractedText(cleanedText);
        }
      } else {
        setError('No text could be extracted from this image.');
      }
      
    } catch (err) {
      console.error('OCR Error:', err);
      setError(err.message || 'Failed to extract text. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }, [imageFile, language, ocrEngine]);

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
    setImageFile(null);
    setExtractedText('');
    setError(null);
    setShowClearConfirm(false);
  };

  const wordCount = extractedText.split(/\s+/).filter(Boolean).length;
  const charCount = extractedText.length;

  return (
    <div className="p-4 md:p-6 w-full min-h-screen" style={{ backgroundColor: theme.bg, fontFamily: FONTS.body }}>
      <div className="mb-6">
        <h1 className="text-xl md:text-3xl font-bold mb-1 flex items-center gap-2" style={{ color: theme.text, fontFamily: FONTS.heading }}>
          <ScanText className="size-5 md:size-8 shrink-0" style={{ color: BRAND.blue }} />
          Image to Text (OCR)
        </h1>
        <p className="text-xs md:text-sm text-muted-foreground">Extract text from images, IDs, screenshots, and documents</p>
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
                  <ScanText className="size-10" style={{ color: BRAND.blue }} />
                </div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: theme.text, fontFamily: FONTS.heading }}>Upload Image</h3>
                <p className="text-muted-foreground mb-4">Drag & drop or click to select an image</p>
                <Button style={{ backgroundColor: BRAND.blue }}><Upload className="size-4 mr-2" />Select Image</Button>
                <p className="text-xs text-muted-foreground mt-4">PNG, JPG, WebP, GIF, BMP • Max 5MB</p>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => handleFileUpload(e.target.files?.[0])} className="hidden" />
              
              <div className="mt-6 grid sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border" style={{ backgroundColor: BRAND.blue + '08', borderColor: BRAND.blue + '20' }}>
                  <div className="flex gap-3">
                    <Languages className="size-5 shrink-0 mt-0.5" style={{ color: BRAND.blue }} />
                    <div>
                      <p className="text-sm font-medium" style={{ color: BRAND.blue }}>16+ Languages</p>
                      <p className="text-xs text-muted-foreground mt-1">English, Chinese, Japanese, Korean, Arabic, Tagalog, and more</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 rounded-lg border" style={{ backgroundColor: BRAND.green + '08', borderColor: BRAND.green + '20' }}>
                  <div className="flex gap-3">
                    <Wand2 className="size-5 shrink-0 mt-0.5" style={{ color: BRAND.green }} />
                    <div>
                      <p className="text-sm font-medium" style={{ color: BRAND.green }}>Advanced OCR</p>
                      <p className="text-xs text-muted-foreground mt-1">Works with IDs, receipts, documents, and complex layouts</p>
                    </div>
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
                    <Trash2 className="size-4 mr-1" />Clear
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
                  
                  <div>
                    <Label className="text-sm mb-2 block">OCR Engine</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {OCR_ENGINES.map(engine => (
                        <button
                          key={engine.id}
                          onClick={() => setOcrEngine(engine.id)}
                          className={`p-3 rounded-lg border text-left transition-all ${ocrEngine === engine.id ? 'border-blue-500 bg-blue-500/10' : 'border-muted hover:border-blue-300'}`}
                        >
                          <p className="text-sm font-medium" style={{ color: theme.text }}>{engine.name}</p>
                          <p className="text-xs text-muted-foreground">{engine.description}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <Button onClick={extractText} disabled={isProcessing} className="w-full" style={{ backgroundColor: BRAND.blue }}>
                    {isProcessing ? <><Loader2 className="size-4 mr-2 animate-spin" />Extracting...</> : <><ScanText className="size-4 mr-2" />Extract Text</>}
                  </Button>
                  
                  <div className="p-3 rounded-lg bg-muted/50 text-xs text-muted-foreground">
                    <Info className="size-3 inline mr-1" />
                    Tip: For ID cards and complex documents, use "Advanced (Accurate)" engine
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
                        <Download className="size-4 mr-1" />Save
                      </Button>
                    </div>
                  )}
                </div>
                
                <textarea
                  value={extractedText}
                  onChange={(e) => setExtractedText(e.target.value)}
                  placeholder={isProcessing ? "Extracting text..." : "Extracted text will appear here...\n\nFor best results:\n• Use clear, high-resolution images\n• Make sure text is readable\n• Select the correct language\n• Try 'Advanced' engine for IDs"}
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
            <DialogDescription>Remove the image and extracted text.</DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowClearConfirm(false)}>Cancel</Button>
            <Button variant="destructive" onClick={clearAll}><Trash2 className="size-4 mr-2" />Clear</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImageToText;
