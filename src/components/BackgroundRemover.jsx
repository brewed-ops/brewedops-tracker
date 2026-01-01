// BackgroundRemover.jsx - AI-Powered Background Removal Tool for BrewedOps
// Uses @imgly/background-removal for accurate client-side processing
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Upload, Download, Trash2, Image, Loader2, CheckCircle, 
  Clock, AlertTriangle, RefreshCw, ZoomIn, ZoomOut,
  Smartphone, Monitor, Sparkles, ImageOff, Eye, EyeOff
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { getTheme } from '../lib/theme';

// Simple Progress component
const Progress = ({ value = 0, className }) => (
  <div className={cn("h-2 w-full bg-muted rounded-full overflow-hidden", className)}>
    <div 
      className="h-full transition-all duration-300 ease-out rounded-full"
      style={{ width: `${Math.min(100, Math.max(0, value))}%`, backgroundColor: BRAND.blue }}
    />
  </div>
);

// Simple Slider component
const Slider = ({ value = [1], onValueChange, min = 0, max = 100, step = 0.1, className }) => (
  <input
    type="range"
    min={min}
    max={max}
    step={step}
    value={value[0]}
    onChange={(e) => onValueChange([parseFloat(e.target.value)])}
    className={cn("w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary", className)}
    style={{ accentColor: BRAND.blue }}
  />
);

const BRAND = { brown: '#3F200C', blue: '#004AAC', green: '#51AF43', cream: '#FFF0D4' };
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const SUPPORTED_FORMATS = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

// Expiry Timer Component
const ExpiryTimer = ({ expiryTime, onExpired }) => {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    if (!expiryTime) return;
    const update = () => {
      const r = Math.max(0, expiryTime - Date.now());
      setTimeLeft(r);
      if (r === 0) onExpired();
    };
    update();
    const i = setInterval(update, 1000);
    return () => clearInterval(i);
  }, [expiryTime, onExpired]);

  if (!timeLeft) return null;
  const minutes = Math.floor(timeLeft / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);

  return (
    <Badge 
      variant="outline" 
      className={cn(
        "gap-1.5 font-mono",
        timeLeft < 60000 ? "border-destructive text-destructive animate-pulse" : "border-amber-500 text-amber-500"
      )}
    >
      <Clock className="size-3" />
      {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
    </Badge>
  );
};

// Background color options for preview
const BG_OPTIONS = [
  { id: 'transparent', label: 'Transparent', color: 'transparent', pattern: true },
  { id: 'white', label: 'White', color: '#ffffff' },
  { id: 'black', label: 'Black', color: '#000000' },
  { id: 'blue', label: 'Blue', color: BRAND.blue },
  { id: 'green', label: 'Green', color: '#22c55e' },
  { id: 'red', label: 'Red', color: '#ef4444' },
];

const BackgroundRemover = ({ isDark }) => {
  const theme = getTheme(isDark);
  
  // State
  const [originalImage, setOriginalImage] = useState(null);
  const [originalUrl, setOriginalUrl] = useState(null);
  const [processedUrl, setProcessedUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState('');
  const [error, setError] = useState(null);
  const [expiryTime, setExpiryTime] = useState(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [previewBg, setPreviewBg] = useState('transparent');
  const [showOriginal, setShowOriginal] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [imageInfo, setImageInfo] = useState(null);
  
  const fileInputRef = useRef(null);
  const removeBackgroundRef = useRef(null);

  // Load the background removal library dynamically
  const loadLibrary = async () => {
    if (removeBackgroundRef.current) return removeBackgroundRef.current;
    
    try {
      setProgressText('Loading AI model...');
      // Try to import the library - it needs to be installed via npm
      const module = await import('@imgly/background-removal');
      removeBackgroundRef.current = module.removeBackground;
      return module.removeBackground;
    } catch (err) {
      console.error('Failed to load background removal library:', err);
      throw new Error(
        'Background removal library not installed. Please run: npm install @imgly/background-removal'
      );
    }
  };

  // Handle file upload
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset state
    setError(null);
    setProcessedUrl(null);
    setExpiryTime(null);
    setProgress(0);
    setShowOriginal(false);
    setZoom(1);

    // Validate file type
    if (!SUPPORTED_FORMATS.includes(file.type)) {
      setError('Please upload a valid image file (PNG, JPG, or WebP)');
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError('File size must be less than 10MB');
      return;
    }

    // Create preview URL
    const url = URL.createObjectURL(file);
    setOriginalUrl(url);
    setOriginalImage(file);

    // Get image dimensions
    const img = new window.Image();
    img.onload = () => {
      setImageInfo({
        name: file.name,
        size: (file.size / 1024).toFixed(1) + ' KB',
        dimensions: `${img.width} × ${img.height}`,
        type: file.type.split('/')[1].toUpperCase(),
      });
    };
    img.src = url;

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Process image - remove background
  const processImage = async () => {
    if (!originalImage) return;

    setIsProcessing(true);
    setError(null);
    setProgress(0);
    setProgressText('Initializing...');

    try {
      // Load library if not loaded
      const removeBackground = await loadLibrary();

      setProgressText('Processing image...');
      setProgress(20);

      // Process with progress updates
      const blob = await removeBackground(originalImage, {
        progress: (key, current, total) => {
          const percentage = Math.round((current / total) * 100);
          if (key === 'compute:inference') {
            setProgress(20 + (percentage * 0.7));
            setProgressText('Removing background...');
          } else if (key === 'fetch:model') {
            setProgress(percentage * 0.2);
            setProgressText('Loading AI model...');
          }
        },
      });

      setProgress(95);
      setProgressText('Finalizing...');

      // Create URL for processed image
      const processedBlobUrl = URL.createObjectURL(blob);
      setProcessedUrl(processedBlobUrl);
      
      // Set expiry time (5 minutes)
      setExpiryTime(Date.now() + 5 * 60 * 1000);
      
      setProgress(100);
      setProgressText('Complete!');
      setShowSuccessDialog(true);

    } catch (err) {
      console.error('Background removal failed:', err);
      setError(err.message || 'Failed to remove background. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle download
  const handleDownload = () => {
    if (!processedUrl) return;
    
    const link = document.createElement('a');
    link.href = processedUrl;
    const originalName = originalImage?.name?.replace(/\.[^/.]+$/, '') || 'image';
    link.download = `${originalName}_no_bg.png`;
    link.click();
  };

  // Handle expiry
  const handleExpired = () => {
    if (processedUrl) {
      URL.revokeObjectURL(processedUrl);
    }
    setProcessedUrl(null);
    setExpiryTime(null);
  };

  // Reset everything
  const handleReset = () => {
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (processedUrl) URL.revokeObjectURL(processedUrl);
    setOriginalImage(null);
    setOriginalUrl(null);
    setProcessedUrl(null);
    setExpiryTime(null);
    setError(null);
    setProgress(0);
    setImageInfo(null);
    setShowOriginal(false);
    setZoom(1);
  };

  // Cleanup URLs on unmount
  useEffect(() => {
    return () => {
      if (originalUrl) URL.revokeObjectURL(originalUrl);
      if (processedUrl) URL.revokeObjectURL(processedUrl);
    };
  }, []);

  // Checkerboard pattern for transparent background preview
  const checkerboardStyle = {
    backgroundImage: `
      linear-gradient(45deg, #ccc 25%, transparent 25%),
      linear-gradient(-45deg, #ccc 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, #ccc 75%),
      linear-gradient(-45deg, transparent 75%, #ccc 75%)
    `,
    backgroundSize: '20px 20px',
    backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
  };

  // Get background style for preview
  const getPreviewBgStyle = () => {
    const option = BG_OPTIONS.find(o => o.id === previewBg);
    if (option?.pattern) return checkerboardStyle;
    return { backgroundColor: option?.color || 'transparent' };
  };

  return (
    <div className="p-4 md:p-6 w-full min-h-screen" style={{ backgroundColor: theme.bg }}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl md:text-3xl font-bold mb-1 flex items-center gap-2" style={{ color: theme.text }}>
          <Sparkles className="size-5 md:size-8 shrink-0" style={{ color: BRAND.blue }} />
          Background Remover
        </h1>
        <p className="text-xs md:text-sm text-muted-foreground">Remove image backgrounds instantly with AI</p>
      </div>

      {/* Main Content */}
      {!originalImage ? (
        // Upload Screen
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-6 md:p-12">
            <div 
              className="border-2 border-dashed rounded-xl p-8 md:p-12 text-center cursor-pointer transition-all hover:border-primary hover:bg-primary/5"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const file = e.dataTransfer.files?.[0];
                if (file) {
                  const input = fileInputRef.current;
                  const dt = new DataTransfer();
                  dt.items.add(file);
                  input.files = dt.files;
                  handleFileUpload({ target: input });
                }
              }}
            >
              <div 
                className="size-16 md:size-20 rounded-full mx-auto mb-6 flex items-center justify-center" 
                style={{ backgroundColor: BRAND.blue + '15' }}
              >
                <Image className="size-8 md:size-10" style={{ color: BRAND.blue }} />
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2" style={{ color: theme.text }}>
                Upload Image
              </h3>
              <p className="text-muted-foreground mb-4 text-sm md:text-base">
                Drag & drop or click to select an image
              </p>
              <Button style={{ backgroundColor: BRAND.blue }}>
                <Upload className="size-4 mr-2" />Select Image
              </Button>
              <input 
                ref={fileInputRef} 
                type="file" 
                accept="image/png,image/jpeg,image/jpg,image/webp" 
                onChange={handleFileUpload} 
                className="hidden" 
              />
              <p className="text-xs text-muted-foreground mt-4">
                Supports PNG, JPG, WebP • Max 10MB
              </p>
            </div>

            {/* Info boxes */}
            <div className="mt-6 space-y-4">
              <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <div className="flex gap-3">
                  <Clock className="size-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-500">5-Minute Download Window</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      After processing, you'll have 5 minutes to download your image.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <div className="flex gap-3">
                  <Sparkles className="size-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-500">AI-Powered Accuracy</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Uses advanced AI to accurately detect and remove backgrounds from any image.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        // Editor Screen
        <div className="max-w-6xl mx-auto">
          {/* Toolbar */}
          <Card className="mb-4">
            <CardContent className="p-3 md:p-4">
              <div className="flex flex-wrap items-center gap-2 md:gap-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleReset}
                >
                  <RefreshCw className="size-4 mr-1 md:mr-2" />
                  <span className="hidden sm:inline">New Image</span>
                  <span className="sm:hidden">New</span>
                </Button>

                {!processedUrl && !isProcessing && (
                  <Button 
                    size="sm" 
                    onClick={processImage}
                    style={{ backgroundColor: BRAND.green }}
                  >
                    <Sparkles className="size-4 mr-1 md:mr-2" />
                    Remove Background
                  </Button>
                )}

                {processedUrl && (
                  <>
                    <Button 
                      size="sm" 
                      onClick={handleDownload}
                      style={{ backgroundColor: BRAND.blue }}
                    >
                      <Download className="size-4 mr-1 md:mr-2" />
                      Download PNG
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowOriginal(!showOriginal)}
                    >
                      {showOriginal ? <EyeOff className="size-4 mr-1 md:mr-2" /> : <Eye className="size-4 mr-1 md:mr-2" />}
                      <span className="hidden sm:inline">{showOriginal ? 'Show Result' : 'Show Original'}</span>
                      <span className="sm:hidden">{showOriginal ? 'Result' : 'Original'}</span>
                    </Button>
                  </>
                )}

                {expiryTime && (
                  <div className="flex items-center gap-2 ml-auto">
                    <span className="text-xs text-muted-foreground hidden sm:inline">Expires:</span>
                    <ExpiryTimer expiryTime={expiryTime} onExpired={handleExpired} />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Error message */}
          {error && (
            <div className="mb-4 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
              <div className="flex gap-3">
                <AlertTriangle className="size-5 text-destructive flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-destructive">Error</p>
                  <p className="text-xs text-muted-foreground mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Processing indicator */}
          {isProcessing && (
            <Card className="mb-4">
              <CardContent className="p-6">
                <div className="text-center">
                  <Loader2 className="size-10 animate-spin mx-auto mb-4" style={{ color: BRAND.blue }} />
                  <p className="font-medium mb-2" style={{ color: theme.text }}>{progressText}</p>
                  <Progress value={progress} className="max-w-md mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">{Math.round(progress)}%</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Image Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Main preview */}
            <Card className="lg:col-span-2">
              <CardContent className="p-4">
                <div 
                  className="relative rounded-lg overflow-hidden flex items-center justify-center min-h-[300px] md:min-h-[400px]"
                  style={processedUrl && !showOriginal ? getPreviewBgStyle() : { backgroundColor: isDark ? '#2a2a2b' : '#f5f5f5' }}
                >
                  {(showOriginal || !processedUrl) ? (
                    <img
                      src={originalUrl}
                      alt="Original"
                      className="max-w-full max-h-[500px] object-contain transition-transform"
                      style={{ transform: `scale(${zoom})` }}
                    />
                  ) : (
                    <img
                      src={processedUrl}
                      alt="Processed"
                      className="max-w-full max-h-[500px] object-contain transition-transform"
                      style={{ transform: `scale(${zoom})` }}
                    />
                  )}
                  
                  {/* Zoom label */}
                  {zoom !== 1 && (
                    <Badge className="absolute top-2 right-2" variant="secondary">
                      {Math.round(zoom * 100)}%
                    </Badge>
                  )}
                </div>

                {/* Zoom controls */}
                <div className="flex items-center gap-4 mt-4">
                  <ZoomOut className="size-4 text-muted-foreground" />
                  <Slider
                    value={[zoom]}
                    onValueChange={([v]) => setZoom(v)}
                    min={0.5}
                    max={2}
                    step={0.1}
                    className="flex-1"
                  />
                  <ZoomIn className="size-4 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            {/* Side panel */}
            <Card>
              <CardContent className="p-4 space-y-6">
                {/* Image info */}
                {imageInfo && (
                  <div>
                    <h3 className="font-semibold text-sm mb-3" style={{ color: theme.text }}>Image Info</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Name:</span>
                        <span className="truncate ml-2 max-w-[150px]" title={imageInfo.name}>{imageInfo.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Size:</span>
                        <span>{imageInfo.size}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Dimensions:</span>
                        <span>{imageInfo.dimensions}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Format:</span>
                        <span>{imageInfo.type}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Background preview options */}
                {processedUrl && (
                  <div>
                    <h3 className="font-semibold text-sm mb-3" style={{ color: theme.text }}>Preview Background</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {BG_OPTIONS.map(option => (
                        <button
                          key={option.id}
                          onClick={() => setPreviewBg(option.id)}
                          className={cn(
                            "h-10 rounded-lg border-2 transition-all",
                            previewBg === option.id ? "border-primary ring-2 ring-primary/20" : "border-muted hover:border-muted-foreground"
                          )}
                          style={option.pattern ? checkerboardStyle : { backgroundColor: option.color }}
                          title={option.label}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Preview only. Download is always transparent PNG.
                    </p>
                  </div>
                )}

                {/* Status */}
                <div>
                  <h3 className="font-semibold text-sm mb-3" style={{ color: theme.text }}>Status</h3>
                  {!processedUrl && !isProcessing && (
                    <div className="flex items-center gap-2 text-sm">
                      <div className="size-2 rounded-full bg-amber-500" />
                      <span>Ready to process</span>
                    </div>
                  )}
                  {isProcessing && (
                    <div className="flex items-center gap-2 text-sm">
                      <Loader2 className="size-4 animate-spin" style={{ color: BRAND.blue }} />
                      <span>Processing...</span>
                    </div>
                  )}
                  {processedUrl && (
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="size-4" style={{ color: BRAND.green }} />
                      <span>Background removed</span>
                    </div>
                  )}
                </div>

                {/* Tips */}
                <div>
                  <h3 className="font-semibold text-sm mb-3" style={{ color: theme.text }}>Tips</h3>
                  <ul className="text-xs text-muted-foreground space-y-2">
                    <li className="flex gap-2">
                      <span>•</span>
                      <span>Works best with clear subject separation</span>
                    </li>
                    <li className="flex gap-2">
                      <span>•</span>
                      <span>Higher resolution images give better results</span>
                    </li>
                    <li className="flex gap-2">
                      <span>•</span>
                      <span>Processing happens locally in your browser</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="size-5" style={{ color: BRAND.green }} />
              Background Removed!
            </DialogTitle>
            <DialogDescription>
              Your image has been processed successfully.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <div className="flex gap-3">
                <Clock className="size-5 text-amber-500 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">5-Minute Download Window</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Download your image before it expires.
                  </p>
                </div>
              </div>
            </div>
            {expiryTime && (
              <div className="flex items-center justify-center gap-2 mt-4">
                <span className="text-sm text-muted-foreground">Time remaining:</span>
                <ExpiryTimer expiryTime={expiryTime} onExpired={handleExpired} />
              </div>
            )}
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowSuccessDialog(false)}>
              Close
            </Button>
            <Button onClick={() => { handleDownload(); setShowSuccessDialog(false); }} style={{ backgroundColor: BRAND.blue }}>
              <Download className="size-4 mr-2" />
              Download PNG
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BackgroundRemover;
