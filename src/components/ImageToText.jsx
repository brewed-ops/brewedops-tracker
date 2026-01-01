// ImageToText.jsx - OCR Text Extraction Tool for BrewedOps
// Uses Tesseract.js with image preprocessing for better accuracy
import React, { useState, useRef, useCallback } from 'react';
import { Upload, Copy, Check, ScanText, Loader2, Download, Trash2, AlertTriangle, Languages, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { getTheme } from '../lib/theme';
import { createWorker } from 'tesseract.js';

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
  { code: 'rus', name: 'Russian' },
  { code: 'hin', name: 'Hindi' },
  { code: 'tha', name: 'Thai' },
  { code: 'vie', name: 'Vietnamese' },
];

const ImageToText = ({ isDark }) => {
  const theme = getTheme(isDark);
  const [imageUrl, setImageUrl] = useState(null);
  const [originalFile, setOriginalFile] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressStatus, setProgressStatus] = useState('');
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [language, setLanguage] = useState('eng');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [enhanceImage, setEnhanceImage] = useState(true);
  
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

  // Preprocess image for better OCR results
  const preprocessImage = useCallback((file) => {
    return new Promise((resolve) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Scale up small images for better OCR
        let width = img.width;
        let height = img.height;
        const minDimension = 1500;
        
        if (width < minDimension && height < minDimension) {
          const scale = minDimension / Math.max(width, height);
          width *= scale;
          height *= scale;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw image with white background
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        
        if (enhanceImage) {
          const imageData = ctx.getImageData(0, 0, width, height);
          const data = imageData.data;
          
          // Convert to grayscale and apply contrast enhancement
          for (let i = 0; i < data.length; i += 4) {
            // Grayscale using luminosity method
            const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
            
            // Increase contrast
            const contrast = 1.4;
            const factor = (259 * (contrast * 255 + 255)) / (255 * (259 - contrast * 255));
            let newValue = factor * (gray - 128) + 128;
            newValue = Math.max(0, Math.min(255, newValue));
            
            data[i] = newValue;
            data[i + 1] = newValue;
            data[i + 2] = newValue;
          }
          
          ctx.putImageData(imageData, 0, 0);
        }
        
        canvas.toBlob((blob) => {
          resolve(URL.createObjectURL(blob));
        }, 'image/png', 1.0);
      };
      img.src = URL.createObjectURL(file);
    });
  }, [enhanceImage]);

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
    setOriginalFile(file);
    
    const url = URL.createObjectURL(file);
    setImageUrl(url);
  }, []);

  const extractText = useCallback(async () => {
    if (!originalFile) return;
    
    setIsProcessing(true);
    setProgress(0);
    setProgressStatus('Initializing...');
    setError(null);
    
    let worker = null;
    let processedUrl = null;
    
    try {
      setProgressStatus('Preprocessing image...');
      setProgress(10);
      processedUrl = await preprocessImage(originalFile);
      
      setProgressStatus('Loading OCR engine...');
      setProgress(20);
      
      worker = await createWorker(language, 1, {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setProgress(30 + Math.round(m.progress * 60));
            setProgressStatus('Recognizing text...');
          } else if (m.status === 'loading language traineddata') {
            setProgressStatus('Loading language data...');
            setProgress(25);
          }
        }
      });
      
      const result = await worker.recognize(processedUrl);
      
      setProgress(95);
      setProgressStatus('Finalizing...');
      
      // Clean up the text
      let text = result.data.text || '';
      text = text
        .replace(/\n{3,}/g, '\n\n')
        .replace(/[ \t]+/g, ' ')
        .split('\n')
        .map(line => line.trim())
        .join('\n')
        .trim();
      
      if (!text) {
        setError('No text was detected in this image. Try a clearer image or different settings.');
      } else {
        setExtractedText(text);
      }
      
      setProgress(100);
      
    } catch (err) {
      console.error('OCR Error:', err);
      setError('Failed to extract text. Please try with a clearer image.');
    } finally {
      if (worker) await worker.terminate();
      if (processedUrl) URL.revokeObjectURL(processedUrl);
      setIsProcessing(false);
      setProgress(0);
      setProgressStatus('');
    }
  }, [originalFile, language, preprocessImage]);

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
    setOriginalFile(null);
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
                  <ScanText className="size-10" style={{ color: BRAND.blue }} />
                </div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: theme.text, fontFamily: FONTS.heading }}>Upload Image</h3>
                <p className="text-muted-foreground mb-4">Drag & drop or click to select an image</p>
                <Button style={{ backgroundColor: BRAND.blue }}><Upload className="size-4 mr-2" />Select Image</Button>
                <p className="text-xs text-muted-foreground mt-4">PNG, JPG, WebP • Max 10MB</p>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => handleFileUpload(e.target.files?.[0])} className="hidden" />
              
              <div className="mt-6 grid sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border" style={{ backgroundColor: BRAND.blue + '08', borderColor: BRAND.blue + '20' }}>
                  <div className="flex gap-3">
                    <Languages className="size-5 shrink-0 mt-0.5" style={{ color: BRAND.blue }} />
                    <div>
                      <p className="text-sm font-medium" style={{ color: BRAND.blue }}>Multi-Language</p>
                      <p className="text-xs text-muted-foreground mt-1">Supports 14+ languages</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 rounded-lg border" style={{ backgroundColor: BRAND.green + '08', borderColor: BRAND.green + '20' }}>
                  <div className="flex gap-3">
                    <Wand2 className="size-5 shrink-0 mt-0.5" style={{ color: BRAND.green }} />
                    <div>
                      <p className="text-sm font-medium" style={{ color: BRAND.green }}>Auto Enhancement</p>
                      <p className="text-xs text-muted-foreground mt-1">Better text recognition</p>
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
                  
                  <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border" style={{ borderColor: theme.cardBorder }}>
                    <input type="checkbox" checked={enhanceImage} onChange={(e) => setEnhanceImage(e.target.checked)} className="rounded" />
                    <div className="flex-1">
                      <p className="text-sm font-medium" style={{ color: theme.text }}>Enhance Image</p>
                      <p className="text-xs text-muted-foreground">Improve contrast for better OCR</p>
                    </div>
                    <Wand2 className="size-4 text-muted-foreground" />
                  </label>
                  
                  <Button onClick={extractText} disabled={isProcessing} className="w-full" style={{ backgroundColor: BRAND.blue }}>
                    {isProcessing ? <><Loader2 className="size-4 mr-2 animate-spin" />{progressStatus}</> : <><ScanText className="size-4 mr-2" />Extract Text</>}
                  </Button>
                  
                  {isProcessing && (
                    <div className="space-y-2">
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="h-2 rounded-full transition-all" style={{ width: `${progress}%`, backgroundColor: BRAND.blue }} />
                      </div>
                      <p className="text-xs text-center text-muted-foreground">{progress}%</p>
                    </div>
                  )}
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
                  placeholder={isProcessing ? "Extracting text..." : "Extracted text will appear here...\n\nFor best results:\n• Use clear, high-resolution images\n• Ensure text is not blurry or rotated\n• Select the correct language"}
                  className="flex-1 w-full min-h-[300px] p-3 border rounded-lg bg-background resize-none text-sm"
                  style={{ borderColor: theme.cardBorder, fontFamily: 'monospace' }}
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
