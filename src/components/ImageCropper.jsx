// ImageCropper.jsx - Professional Image Cropping Tool for BrewedOps
// Features: Crop, resize, rotate, flip, aspect ratios, zoom, drag
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Upload, Download, Trash2, Loader2, CheckCircle, 
  Clock, AlertTriangle, ZoomIn, ZoomOut, RotateCw, RotateCcw,
  FlipHorizontal, FlipVertical, Crop, Square, RectangleHorizontal,
  Smartphone, Monitor, Image, RefreshCw, Move, Maximize2, X, Check
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { getTheme } from '../lib/theme';

// Brand colors
const BRAND = { 
  brown: '#3F200C', 
  blue: '#004AAC', 
  green: '#51AF43', 
  cream: '#FFF0D4' 
};

const FONTS = {
  heading: "'Montserrat', sans-serif",
  body: "'Poppins', sans-serif",
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const SUPPORTED_FORMATS = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

// Aspect ratio presets
const ASPECT_RATIOS = [
  { id: 'free', label: 'Free', icon: Crop, ratio: null },
  { id: '1:1', label: '1:1', icon: Square, ratio: 1 },
  { id: '4:3', label: '4:3', icon: RectangleHorizontal, ratio: 4/3 },
  { id: '16:9', label: '16:9', icon: RectangleHorizontal, ratio: 16/9 },
  { id: '3:2', label: '3:2', icon: RectangleHorizontal, ratio: 3/2 },
  { id: '2:3', label: '2:3', icon: RectangleHorizontal, ratio: 2/3 },
  { id: '9:16', label: '9:16', icon: RectangleHorizontal, ratio: 9/16 },
];

// Simple Slider component
const Slider = ({ value = 1, onChange, min = 0.1, max = 3, step = 0.1, className }) => (
  <input
    type="range"
    min={min}
    max={max}
    step={step}
    value={value}
    onChange={(e) => onChange(parseFloat(e.target.value))}
    className={cn("w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer", className)}
    style={{ accentColor: BRAND.blue }}
  />
);

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

const ImageCropper = ({ isDark }) => {
  const theme = getTheme(isDark);
  
  // State
  const [originalImage, setOriginalImage] = useState(null);
  const [originalUrl, setOriginalUrl] = useState(null);
  const [croppedUrl, setCroppedUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [expiryTime, setExpiryTime] = useState(null);
  
  // Crop state
  const [cropArea, setCropArea] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [aspectRatio, setAspectRatio] = useState('free');
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  
  // Drag state
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // Image dimensions
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  const [displayScale, setDisplayScale] = useState(1);
  
  // Modals
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showDownloadSuccess, setShowDownloadSuccess] = useState(false);
  
  // Refs
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const imageRef = useRef(null);

  // Calculate display scale when image loads
  const calculateDisplayScale = useCallback((imgWidth, imgHeight, contWidth, contHeight) => {
    const scaleX = contWidth / imgWidth;
    const scaleY = contHeight / imgHeight;
    return Math.min(scaleX, scaleY, 1);
  }, []);

  // Initialize crop area when image loads
  const initializeCropArea = useCallback((imgWidth, imgHeight, scale) => {
    const displayWidth = imgWidth * scale;
    const displayHeight = imgHeight * scale;
    
    // Default crop area is 80% of the image centered
    const cropWidth = displayWidth * 0.8;
    const cropHeight = displayHeight * 0.8;
    const cropX = (displayWidth - cropWidth) / 2;
    const cropY = (displayHeight - cropHeight) / 2;
    
    setCropArea({
      x: cropX,
      y: cropY,
      width: cropWidth,
      height: cropHeight
    });
  }, []);

  // Handle file upload
  const handleFileUpload = useCallback((file) => {
    if (!file) return;
    
    setError(null);
    
    if (!SUPPORTED_FORMATS.includes(file.type)) {
      setError('Please upload a PNG, JPG, or WebP image.');
      return;
    }
    
    if (file.size > MAX_FILE_SIZE) {
      setError('File size must be less than 10MB.');
      return;
    }
    
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    
    img.onload = () => {
      setOriginalImage(file);
      setOriginalUrl(url);
      setImageDimensions({ width: img.width, height: img.height });
      
      // Reset transformations
      setZoom(1);
      setRotation(0);
      setFlipH(false);
      setFlipV(false);
      setAspectRatio('free');
      setCroppedUrl(null);
      setExpiryTime(null);
      
      // Calculate display scale after a short delay to get container dimensions
      setTimeout(() => {
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          const scale = calculateDisplayScale(img.width, img.height, rect.width - 40, rect.height - 40);
          setDisplayScale(scale);
          setContainerDimensions({ width: rect.width, height: rect.height });
          initializeCropArea(img.width, img.height, scale);
        }
      }, 100);
    };
    
    img.onerror = () => {
      setError('Failed to load image. Please try another file.');
      URL.revokeObjectURL(url);
    };
    
    img.src = url;
  }, [calculateDisplayScale, initializeCropArea]);

  // Handle aspect ratio change
  const handleAspectRatioChange = useCallback((ratioId) => {
    setAspectRatio(ratioId);
    
    const ratio = ASPECT_RATIOS.find(r => r.id === ratioId)?.ratio;
    if (!ratio) return; // Free ratio, don't adjust
    
    const displayWidth = imageDimensions.width * displayScale;
    const displayHeight = imageDimensions.height * displayScale;
    
    // Calculate new crop dimensions maintaining aspect ratio
    let newWidth, newHeight;
    
    if (ratio >= 1) {
      newWidth = Math.min(cropArea.width, displayWidth * 0.8);
      newHeight = newWidth / ratio;
      if (newHeight > displayHeight * 0.8) {
        newHeight = displayHeight * 0.8;
        newWidth = newHeight * ratio;
      }
    } else {
      newHeight = Math.min(cropArea.height, displayHeight * 0.8);
      newWidth = newHeight * ratio;
      if (newWidth > displayWidth * 0.8) {
        newWidth = displayWidth * 0.8;
        newHeight = newWidth / ratio;
      }
    }
    
    // Center the new crop area
    const newX = (displayWidth - newWidth) / 2;
    const newY = (displayHeight - newHeight) / 2;
    
    setCropArea({
      x: newX,
      y: newY,
      width: newWidth,
      height: newHeight
    });
  }, [cropArea, imageDimensions, displayScale]);

  // Mouse handlers for crop area
  const handleMouseDown = useCallback((e, action) => {
    e.preventDefault();
    e.stopPropagation();
    
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setDragStart({ x, y, cropArea: { ...cropArea } });
    
    if (action === 'move') {
      setIsDragging(true);
    } else {
      setIsResizing(action);
    }
  }, [cropArea]);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging && !isResizing) return;
    
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const deltaX = x - dragStart.x;
    const deltaY = y - dragStart.y;
    
    const displayWidth = imageDimensions.width * displayScale;
    const displayHeight = imageDimensions.height * displayScale;
    const ratio = ASPECT_RATIOS.find(r => r.id === aspectRatio)?.ratio;
    
    if (isDragging) {
      // Move crop area
      let newX = dragStart.cropArea.x + deltaX;
      let newY = dragStart.cropArea.y + deltaY;
      
      // Constrain to image bounds
      newX = Math.max(0, Math.min(displayWidth - cropArea.width, newX));
      newY = Math.max(0, Math.min(displayHeight - cropArea.height, newY));
      
      setCropArea(prev => ({ ...prev, x: newX, y: newY }));
    } else if (isResizing) {
      // Resize crop area
      let newCrop = { ...dragStart.cropArea };
      
      switch (isResizing) {
        case 'nw':
          newCrop.x = dragStart.cropArea.x + deltaX;
          newCrop.y = dragStart.cropArea.y + deltaY;
          newCrop.width = dragStart.cropArea.width - deltaX;
          newCrop.height = dragStart.cropArea.height - deltaY;
          break;
        case 'ne':
          newCrop.y = dragStart.cropArea.y + deltaY;
          newCrop.width = dragStart.cropArea.width + deltaX;
          newCrop.height = dragStart.cropArea.height - deltaY;
          break;
        case 'sw':
          newCrop.x = dragStart.cropArea.x + deltaX;
          newCrop.width = dragStart.cropArea.width - deltaX;
          newCrop.height = dragStart.cropArea.height + deltaY;
          break;
        case 'se':
          newCrop.width = dragStart.cropArea.width + deltaX;
          newCrop.height = dragStart.cropArea.height + deltaY;
          break;
        case 'n':
          newCrop.y = dragStart.cropArea.y + deltaY;
          newCrop.height = dragStart.cropArea.height - deltaY;
          break;
        case 's':
          newCrop.height = dragStart.cropArea.height + deltaY;
          break;
        case 'w':
          newCrop.x = dragStart.cropArea.x + deltaX;
          newCrop.width = dragStart.cropArea.width - deltaX;
          break;
        case 'e':
          newCrop.width = dragStart.cropArea.width + deltaX;
          break;
      }
      
      // Maintain aspect ratio if set
      if (ratio) {
        if (['n', 's', 'ne', 'nw', 'se', 'sw'].includes(isResizing)) {
          newCrop.width = newCrop.height * ratio;
        } else {
          newCrop.height = newCrop.width / ratio;
        }
      }
      
      // Minimum size
      newCrop.width = Math.max(50, newCrop.width);
      newCrop.height = Math.max(50, newCrop.height);
      
      // Constrain to image bounds
      if (newCrop.x < 0) {
        newCrop.width += newCrop.x;
        newCrop.x = 0;
      }
      if (newCrop.y < 0) {
        newCrop.height += newCrop.y;
        newCrop.y = 0;
      }
      if (newCrop.x + newCrop.width > displayWidth) {
        newCrop.width = displayWidth - newCrop.x;
      }
      if (newCrop.y + newCrop.height > displayHeight) {
        newCrop.height = displayHeight - newCrop.y;
      }
      
      setCropArea(newCrop);
    }
  }, [isDragging, isResizing, dragStart, imageDimensions, displayScale, aspectRatio, cropArea.width, cropArea.height]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(null);
  }, []);

  // Touch handlers for mobile
  const handleTouchStart = useCallback((e, action) => {
    const touch = e.touches[0];
    handleMouseDown({ 
      preventDefault: () => {}, 
      stopPropagation: () => {},
      clientX: touch.clientX, 
      clientY: touch.clientY 
    }, action);
  }, [handleMouseDown]);

  const handleTouchMove = useCallback((e) => {
    const touch = e.touches[0];
    handleMouseMove({ clientX: touch.clientX, clientY: touch.clientY });
  }, [handleMouseMove]);

  // Add global mouse listeners
  useEffect(() => {
    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
      
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchend', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp, handleTouchMove]);

  // Process and crop image
  const processCrop = useCallback(async () => {
    if (!originalUrl || !imageDimensions.width) return;
    
    setIsProcessing(true);
    setError(null);
    
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = originalUrl;
      });
      
      // Calculate actual crop coordinates (convert from display to actual image coords)
      const scaleX = imageDimensions.width / (imageDimensions.width * displayScale);
      const scaleY = imageDimensions.height / (imageDimensions.height * displayScale);
      
      const actualCrop = {
        x: cropArea.x * scaleX,
        y: cropArea.y * scaleY,
        width: cropArea.width * scaleX,
        height: cropArea.height * scaleY
      };
      
      // Set canvas size to crop dimensions
      canvas.width = actualCrop.width;
      canvas.height = actualCrop.height;
      
      // Apply transformations
      ctx.save();
      
      // Move to center for transformations
      ctx.translate(canvas.width / 2, canvas.height / 2);
      
      // Apply rotation
      ctx.rotate((rotation * Math.PI) / 180);
      
      // Apply flip
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
      
      // Draw the cropped portion
      ctx.drawImage(
        img,
        actualCrop.x, actualCrop.y, actualCrop.width, actualCrop.height,
        -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height
      );
      
      ctx.restore();
      
      // Convert to blob
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png', 1.0));
      const url = URL.createObjectURL(blob);
      
      setCroppedUrl(url);
      setExpiryTime(Date.now() + 5 * 60 * 1000); // 5 minutes
      
    } catch (err) {
      console.error('Crop error:', err);
      setError('Failed to crop image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }, [originalUrl, imageDimensions, displayScale, cropArea, rotation, flipH, flipV]);

  // Download cropped image
  const handleDownload = useCallback(() => {
    if (!croppedUrl) return;
    
    const link = document.createElement('a');
    link.href = croppedUrl;
    link.download = `cropped_${originalImage?.name || 'image'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setShowDownloadSuccess(true);
    setTimeout(() => setShowDownloadSuccess(false), 2000);
  }, [croppedUrl, originalImage]);

  // Clear and reset
  const handleClear = useCallback(() => {
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (croppedUrl) URL.revokeObjectURL(croppedUrl);
    
    setOriginalImage(null);
    setOriginalUrl(null);
    setCroppedUrl(null);
    setError(null);
    setExpiryTime(null);
    setCropArea({ x: 0, y: 0, width: 0, height: 0 });
    setZoom(1);
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setAspectRatio('free');
    setShowClearConfirm(false);
  }, [originalUrl, croppedUrl]);

  // Handle expiry
  const handleExpired = useCallback(() => {
    if (croppedUrl) URL.revokeObjectURL(croppedUrl);
    setCroppedUrl(null);
    setExpiryTime(null);
  }, [croppedUrl]);

  // Cleanup URLs on unmount
  useEffect(() => {
    return () => {
      if (originalUrl) URL.revokeObjectURL(originalUrl);
      if (croppedUrl) URL.revokeObjectURL(croppedUrl);
    };
  }, []);

  // Rotation handlers
  const rotateLeft = () => setRotation(r => (r - 90) % 360);
  const rotateRight = () => setRotation(r => (r + 90) % 360);

  // Get cursor for resize handles
  const getResizeCursor = (handle) => {
    const cursors = {
      nw: 'nwse-resize', ne: 'nesw-resize', sw: 'nesw-resize', se: 'nwse-resize',
      n: 'ns-resize', s: 'ns-resize', w: 'ew-resize', e: 'ew-resize'
    };
    return cursors[handle] || 'move';
  };

  return (
    <div className="p-4 md:p-6 w-full min-h-screen" style={{ backgroundColor: theme.bg, fontFamily: FONTS.body }}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl md:text-3xl font-bold mb-1 flex items-center gap-2" style={{ color: theme.text, fontFamily: FONTS.heading }}>
          <Crop className="size-5 md:size-8 shrink-0" style={{ color: BRAND.blue }} />
          Image Cropper
        </h1>
        <p className="text-xs md:text-sm text-muted-foreground">Crop, rotate, and resize your images with precision</p>
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
                if (file) handleFileUpload(file);
              }}
            >
              <div 
                className="size-20 rounded-full mx-auto mb-6 flex items-center justify-center"
                style={{ backgroundColor: BRAND.blue + '15' }}
              >
                <Image className="size-10" style={{ color: BRAND.blue }} />
              </div>
              
              <h3 className="text-xl font-semibold mb-2" style={{ color: theme.text, fontFamily: FONTS.heading }}>
                Upload Image
              </h3>
              <p className="text-muted-foreground mb-4">Drag & drop or click to select an image</p>
              
              <Button style={{ backgroundColor: BRAND.blue }}>
                <Upload className="size-4 mr-2" />
                Select Image
              </Button>
              
              <p className="text-xs text-muted-foreground mt-4">
                Supports PNG, JPG, WebP • Max 10MB
              </p>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={(e) => handleFileUpload(e.target.files?.[0])}
              className="hidden"
            />
            
            {error && (
              <div className="mt-4 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                <div className="flex gap-3">
                  <AlertTriangle className="size-5 text-destructive flex-shrink-0" />
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              </div>
            )}
            
            {/* Info Cards */}
            <div className="mt-6 space-y-3">
              <div className="p-4 rounded-lg border" style={{ backgroundColor: BRAND.blue + '08', borderColor: BRAND.blue + '20' }}>
                <div className="flex gap-3">
                  <Clock className="size-5 flex-shrink-0 mt-0.5" style={{ color: BRAND.blue }} />
                  <div>
                    <p className="text-sm font-medium" style={{ color: BRAND.blue }}>5-Minute Download Window</p>
                    <p className="text-xs text-muted-foreground mt-1">After cropping, you'll have 5 minutes to download your image.</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 rounded-lg border" style={{ backgroundColor: BRAND.green + '08', borderColor: BRAND.green + '20' }}>
                <div className="flex gap-3">
                  <Crop className="size-5 flex-shrink-0 mt-0.5" style={{ color: BRAND.green }} />
                  <div>
                    <p className="text-sm font-medium" style={{ color: BRAND.green }}>Precision Tools</p>
                    <p className="text-xs text-muted-foreground mt-1">Crop, rotate, flip, and use preset aspect ratios for perfect results.</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        // Editor Screen
        <div className="space-y-4">
          {/* Toolbar */}
          <Card>
            <CardContent className="p-3 md:p-4">
              <div className="flex flex-wrap items-center gap-2 md:gap-4">
                {/* Aspect Ratio Selector */}
                <div className="flex items-center gap-1 flex-wrap">
                  <Label className="text-xs text-muted-foreground mr-2 hidden md:block">Ratio:</Label>
                  {ASPECT_RATIOS.map((ratio) => (
                    <Button
                      key={ratio.id}
                      variant={aspectRatio === ratio.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleAspectRatioChange(ratio.id)}
                      className="h-8 px-2 md:px-3 text-xs"
                      style={aspectRatio === ratio.id ? { backgroundColor: BRAND.blue } : {}}
                    >
                      {ratio.label}
                    </Button>
                  ))}
                </div>
                
                <div className="h-6 w-px bg-border hidden md:block" />
                
                {/* Rotation & Flip */}
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="icon" className="size-8" onClick={rotateLeft} title="Rotate Left">
                    <RotateCcw className="size-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="size-8" onClick={rotateRight} title="Rotate Right">
                    <RotateCw className="size-4" />
                  </Button>
                  <Button 
                    variant={flipH ? "default" : "outline"} 
                    size="icon" 
                    className="size-8" 
                    onClick={() => setFlipH(!flipH)}
                    style={flipH ? { backgroundColor: BRAND.blue } : {}}
                    title="Flip Horizontal"
                  >
                    <FlipHorizontal className="size-4" />
                  </Button>
                  <Button 
                    variant={flipV ? "default" : "outline"} 
                    size="icon" 
                    className="size-8" 
                    onClick={() => setFlipV(!flipV)}
                    style={flipV ? { backgroundColor: BRAND.blue } : {}}
                    title="Flip Vertical"
                  >
                    <FlipVertical className="size-4" />
                  </Button>
                </div>
                
                <div className="h-6 w-px bg-border hidden md:block" />
                
                {/* Timer */}
                {expiryTime && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground hidden md:inline">Expires:</span>
                    <ExpiryTimer expiryTime={expiryTime} onExpired={handleExpired} />
                  </div>
                )}
                
                {/* Actions */}
                <div className="flex items-center gap-2 ml-auto">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowClearConfirm(true)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="size-4 md:mr-2" />
                    <span className="hidden md:inline">Clear</span>
                  </Button>
                  
                  {!croppedUrl ? (
                    <Button 
                      size="sm"
                      onClick={processCrop}
                      disabled={isProcessing}
                      style={{ backgroundColor: BRAND.blue }}
                    >
                      {isProcessing ? (
                        <Loader2 className="size-4 animate-spin md:mr-2" />
                      ) : (
                        <Check className="size-4 md:mr-2" />
                      )}
                      <span className="hidden md:inline">{isProcessing ? 'Processing...' : 'Apply Crop'}</span>
                    </Button>
                  ) : (
                    <Button 
                      size="sm"
                      onClick={handleDownload}
                      style={{ backgroundColor: BRAND.green }}
                    >
                      <Download className="size-4 md:mr-2" />
                      <span className="hidden md:inline">Download</span>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Canvas Area */}
          <Card>
            <CardContent className="p-4">
              <div 
                ref={containerRef}
                className="relative bg-muted/50 rounded-lg overflow-hidden flex items-center justify-center"
                style={{ 
                  minHeight: '400px',
                  maxHeight: '70vh',
                  touchAction: 'none'
                }}
              >
                {croppedUrl ? (
                  // Show cropped result
                  <div className="relative">
                    <img 
                      src={croppedUrl} 
                      alt="Cropped" 
                      className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-lg"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge style={{ backgroundColor: BRAND.green }} className="text-white">
                        <CheckCircle className="size-3 mr-1" />
                        Cropped
                      </Badge>
                    </div>
                  </div>
                ) : (
                  // Crop editor
                  <div className="relative" style={{ 
                    width: imageDimensions.width * displayScale,
                    height: imageDimensions.height * displayScale
                  }}>
                    {/* Original Image with overlay */}
                    <img
                      ref={imageRef}
                      src={originalUrl}
                      alt="Original"
                      className="block"
                      style={{
                        width: imageDimensions.width * displayScale,
                        height: imageDimensions.height * displayScale,
                        transform: `rotate(${rotation}deg) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1})`,
                        transformOrigin: 'center center'
                      }}
                      draggable={false}
                    />
                    
                    {/* Dark overlay outside crop area */}
                    <div 
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: `linear-gradient(to right, 
                          rgba(0,0,0,0.6) ${cropArea.x}px, 
                          transparent ${cropArea.x}px, 
                          transparent ${cropArea.x + cropArea.width}px, 
                          rgba(0,0,0,0.6) ${cropArea.x + cropArea.width}px)`
                      }}
                    />
                    
                    {/* Top overlay */}
                    <div 
                      className="absolute left-0 right-0 top-0 pointer-events-none"
                      style={{
                        height: cropArea.y,
                        backgroundColor: 'rgba(0,0,0,0.6)'
                      }}
                    />
                    
                    {/* Bottom overlay */}
                    <div 
                      className="absolute left-0 right-0 bottom-0 pointer-events-none"
                      style={{
                        height: imageDimensions.height * displayScale - cropArea.y - cropArea.height,
                        backgroundColor: 'rgba(0,0,0,0.6)'
                      }}
                    />
                    
                    {/* Crop selection box */}
                    <div
                      className="absolute border-2 cursor-move"
                      style={{
                        left: cropArea.x,
                        top: cropArea.y,
                        width: cropArea.width,
                        height: cropArea.height,
                        borderColor: BRAND.blue,
                        boxShadow: `0 0 0 9999px rgba(0,0,0,0.5)`
                      }}
                      onMouseDown={(e) => handleMouseDown(e, 'move')}
                      onTouchStart={(e) => handleTouchStart(e, 'move')}
                    >
                      {/* Grid lines */}
                      <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white/30" />
                        <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white/30" />
                        <div className="absolute top-1/3 left-0 right-0 h-px bg-white/30" />
                        <div className="absolute top-2/3 left-0 right-0 h-px bg-white/30" />
                      </div>
                      
                      {/* Resize handles */}
                      {['nw', 'ne', 'sw', 'se', 'n', 's', 'w', 'e'].map((handle) => {
                        const positions = {
                          nw: { left: -6, top: -6 },
                          ne: { right: -6, top: -6 },
                          sw: { left: -6, bottom: -6 },
                          se: { right: -6, bottom: -6 },
                          n: { left: '50%', top: -6, transform: 'translateX(-50%)' },
                          s: { left: '50%', bottom: -6, transform: 'translateX(-50%)' },
                          w: { left: -6, top: '50%', transform: 'translateY(-50%)' },
                          e: { right: -6, top: '50%', transform: 'translateY(-50%)' }
                        };
                        
                        const isCorner = ['nw', 'ne', 'sw', 'se'].includes(handle);
                        
                        return (
                          <div
                            key={handle}
                            className="absolute bg-white border-2 rounded-sm"
                            style={{
                              ...positions[handle],
                              width: isCorner ? 12 : 10,
                              height: isCorner ? 12 : 10,
                              borderColor: BRAND.blue,
                              cursor: getResizeCursor(handle)
                            }}
                            onMouseDown={(e) => handleMouseDown(e, handle)}
                            onTouchStart={(e) => handleTouchStart(e, handle)}
                          />
                        );
                      })}
                      
                      {/* Size indicator */}
                      <div 
                        className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded text-xs font-mono whitespace-nowrap"
                        style={{ backgroundColor: BRAND.blue, color: 'white' }}
                      >
                        {Math.round(cropArea.width / displayScale)} × {Math.round(cropArea.height / displayScale)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {error && (
                <div className="mt-4 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                  <div className="flex gap-3">
                    <AlertTriangle className="size-5 text-destructive flex-shrink-0" />
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Instructions */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Move className="size-4" />
                  <span>Drag to move</span>
                </div>
                <div className="flex items-center gap-2">
                  <Maximize2 className="size-4" />
                  <span>Drag corners to resize</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCw className="size-4" />
                  <span>Use toolbar to rotate/flip</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Clear Confirmation Modal */}
      <Dialog open={showClearConfirm} onOpenChange={setShowClearConfirm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="size-5 text-amber-500" />
              Clear Image?
            </DialogTitle>
            <DialogDescription>
              This will remove the current image and any edits. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowClearConfirm(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleClear}>
              <Trash2 className="size-4 mr-2" />
              Clear Image
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Download Success Toast */}
      {showDownloadSuccess && (
        <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-4">
          <Card className="shadow-lg">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="size-8 rounded-full flex items-center justify-center" style={{ backgroundColor: BRAND.green + '20' }}>
                <CheckCircle className="size-5" style={{ color: BRAND.green }} />
              </div>
              <div>
                <p className="font-medium text-sm" style={{ color: theme.text }}>Download Started</p>
                <p className="text-xs text-muted-foreground">Your cropped image is downloading.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ImageCropper;
