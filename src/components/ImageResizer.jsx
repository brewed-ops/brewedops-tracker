// ImageResizer.jsx - Image Resizing Tool for BrewedOps
// Features: Custom dimensions, social media presets, maintain aspect ratio, batch resize
import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  UploadSimple, DownloadSimple, Trash, SpinnerGap, CheckCircle,
  Warning, ArrowsIn, Image, X, Plus, Lock, LockOpen,
  ArrowRight, InstagramLogo, FacebookLogo, TwitterLogo, LinkedinLogo, YoutubeLogo, Monitor
} from '@phosphor-icons/react';
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

const MAX_FILE_SIZE = 20 * 1024 * 1024;
const SUPPORTED_FORMATS = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

// Social media presets
const SIZE_PRESETS = [
  { id: 'custom', label: 'Custom', width: null, height: null, icon: Monitor },
  { id: 'ig-square', label: 'Instagram Post', width: 1080, height: 1080, icon: InstagramLogo },
  { id: 'ig-portrait', label: 'Instagram Portrait', width: 1080, height: 1350, icon: InstagramLogo },
  { id: 'ig-story', label: 'Instagram Story', width: 1080, height: 1920, icon: InstagramLogo },
  { id: 'fb-post', label: 'Facebook Post', width: 1200, height: 630, icon: FacebookLogo },
  { id: 'fb-cover', label: 'Facebook Cover', width: 820, height: 312, icon: FacebookLogo },
  { id: 'twitter-post', label: 'Twitter Post', width: 1200, height: 675, icon: TwitterLogo },
  { id: 'twitter-header', label: 'Twitter Header', width: 1500, height: 500, icon: TwitterLogo },
  { id: 'linkedin-post', label: 'LinkedIn Post', width: 1200, height: 627, icon: LinkedinLogo },
  { id: 'linkedin-cover', label: 'LinkedIn Cover', width: 1584, height: 396, icon: LinkedinLogo },
  { id: 'youtube-thumb', label: 'YouTube Thumbnail', width: 1280, height: 720, icon: YoutubeLogo },
  { id: 'hd', label: 'HD (1280×720)', width: 1280, height: 720, icon: Monitor },
  { id: 'fullhd', label: 'Full HD (1920×1080)', width: 1920, height: 1080, icon: Monitor },
  { id: '4k', label: '4K (3840×2160)', width: 3840, height: 2160, icon: Monitor },
];

// File size formatter
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const ImageResizer = ({ isDark }) => {
  const theme = getTheme(isDark);
  
  // State
  const [files, setFiles] = useState([]);
  const [selectedPreset, setSelectedPreset] = useState('custom');
  const [customWidth, setCustomWidth] = useState(800);
  const [customHeight, setCustomHeight] = useState(600);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [originalAspectRatio, setOriginalAspectRatio] = useState(null);
  const [isResizing, setIsResizing] = useState(false);
  const [error, setError] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showPresetModal, setShowPresetModal] = useState(false);
  
  const fileInputRef = useRef(null);

  // Get current dimensions
  const getCurrentDimensions = useCallback(() => {
    const preset = SIZE_PRESETS.find(p => p.id === selectedPreset);
    if (preset && preset.width && preset.height) {
      return { width: preset.width, height: preset.height };
    }
    return { width: customWidth, height: customHeight };
  }, [selectedPreset, customWidth, customHeight]);

  // Handle width change with aspect ratio
  const handleWidthChange = (newWidth) => {
    setCustomWidth(newWidth);
    if (maintainAspectRatio && originalAspectRatio) {
      setCustomHeight(Math.round(newWidth / originalAspectRatio));
    }
  };

  // Handle height change with aspect ratio
  const handleHeightChange = (newHeight) => {
    setCustomHeight(newHeight);
    if (maintainAspectRatio && originalAspectRatio) {
      setCustomWidth(Math.round(newHeight * originalAspectRatio));
    }
  };

  // Handle file upload
  const handleFileUpload = useCallback((newFiles) => {
    if (!newFiles || newFiles.length === 0) return;
    
    setError(null);
    const filesToAdd = [];
    
    Array.from(newFiles).forEach((file) => {
      if (!SUPPORTED_FORMATS.includes(file.type)) {
        setError(`"${file.name}" is not supported. Use PNG, JPG, or WebP.`);
        return;
      }
      
      if (file.size > MAX_FILE_SIZE) {
        setError(`"${file.name}" exceeds 20MB limit.`);
        return;
      }
      
      const url = URL.createObjectURL(file);
      
      // Get original dimensions
      const img = new window.Image();
      img.onload = () => {
        const fileObj = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          file,
          originalUrl: url,
          originalWidth: img.width,
          originalHeight: img.height,
          status: 'pending',
          resizedUrl: null,
          resizedBlob: null,
        };
        
        setFiles(prev => [...prev, fileObj]);
        
        // Set aspect ratio from first image
        if (filesToAdd.length === 0 && !originalAspectRatio) {
          setOriginalAspectRatio(img.width / img.height);
          setCustomWidth(img.width);
          setCustomHeight(img.height);
        }
      };
      img.src = url;
    });
  }, [originalAspectRatio]);

  // Remove file
  const removeFile = useCallback((id) => {
    setFiles(prev => {
      const file = prev.find(f => f.id === id);
      if (file) {
        if (file.originalUrl) URL.revokeObjectURL(file.originalUrl);
        if (file.resizedUrl) URL.revokeObjectURL(file.resizedUrl);
      }
      return prev.filter(f => f.id !== id);
    });
  }, []);

  // Clear all
  const clearAll = useCallback(() => {
    files.forEach(f => {
      if (f.originalUrl) URL.revokeObjectURL(f.originalUrl);
      if (f.resizedUrl) URL.revokeObjectURL(f.resizedUrl);
    });
    setFiles([]);
    setShowClearConfirm(false);
    setOriginalAspectRatio(null);
  }, [files]);

  // Resize single image
  const resizeImage = useCallback(async (fileObj) => {
    const { width, height } = getCurrentDimensions();
    
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          
          // Fill white background for JPEG
          if (fileObj.file.type === 'image/jpeg') {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, width, height);
          }
          
          ctx.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob((blob) => {
            if (blob) {
              resolve({
                blob,
                url: URL.createObjectURL(blob),
                width,
                height
              });
            } else {
              reject(new Error('Failed to resize'));
            }
          }, fileObj.file.type, 0.92);
        } catch (err) {
          reject(err);
        }
      };
      
      img.onerror = () => reject(new Error('Failed to load'));
      img.src = fileObj.originalUrl;
    });
  }, [getCurrentDimensions]);

  // Resize all
  const resizeAll = useCallback(async () => {
    if (files.length === 0) return;
    
    setIsResizing(true);
    setError(null);
    
    setFiles(prev => prev.map(f => ({ ...f, status: 'resizing' })));
    
    for (const fileObj of files) {
      try {
        const result = await resizeImage(fileObj);
        setFiles(prev => prev.map(f => 
          f.id === fileObj.id 
            ? { ...f, status: 'done', resizedUrl: result.url, resizedBlob: result.blob, resizedWidth: result.width, resizedHeight: result.height }
            : f
        ));
      } catch (err) {
        setFiles(prev => prev.map(f => f.id === fileObj.id ? { ...f, status: 'error' } : f));
      }
    }
    
    setIsResizing(false);
  }, [files, resizeImage]);

  // Download
  const downloadFile = useCallback((fileObj) => {
    if (!fileObj.resizedUrl) return;
    
    const { width, height } = getCurrentDimensions();
    const ext = fileObj.file.type === 'image/png' ? '.png' : fileObj.file.type === 'image/webp' ? '.webp' : '.jpg';
    const originalName = fileObj.file.name.replace(/\.[^/.]+$/, '');
    const newName = `${originalName}_${width}x${height}${ext}`;
    
    const link = document.createElement('a');
    link.href = fileObj.resizedUrl;
    link.download = newName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [getCurrentDimensions]);

  // Download all
  const downloadAll = useCallback(() => {
    files.filter(f => f.status === 'done').forEach((fileObj, i) => {
      setTimeout(() => downloadFile(fileObj), i * 200);
    });
  }, [files, downloadFile]);

  const stats = {
    total: files.length,
    done: files.filter(f => f.status === 'done').length,
  };
  
  const allDone = stats.done > 0 && stats.done === stats.total;
  const hasFiles = files.length > 0;
  const { width: targetWidth, height: targetHeight } = getCurrentDimensions();

  return (
    <div className="p-4 md:p-6 w-full min-h-screen" style={{ backgroundColor: theme.bg, fontFamily: FONTS.body }}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl md:text-3xl font-bold mb-1 flex items-center gap-2" style={{ color: theme.text, fontFamily: FONTS.heading }}>
          <ArrowsIn className="size-5 md:size-8 shrink-0" style={{ color: BRAND.blue }} />
          Image Resizer
        </h1>
        <p className="text-xs md:text-sm text-muted-foreground">Resize images to exact dimensions or social media presets</p>
      </div>

      {!hasFiles ? (
        // Upload Screen
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-6 md:p-12">
            <div 
              className="border-2 border-dashed rounded-xl p-8 md:p-12 text-center cursor-pointer transition-all hover:border-primary hover:bg-primary/5"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); }}
              onDrop={(e) => { e.preventDefault(); handleFileUpload(e.dataTransfer.files); }}
            >
              <div className="size-20 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ backgroundColor: BRAND.blue + '15' }}>
                <ArrowsIn className="size-10" style={{ color: BRAND.blue }} />
              </div>
              
              <h3 className="text-xl font-semibold mb-2" style={{ color: theme.text, fontFamily: FONTS.heading }}>
                Upload Images to Resize
              </h3>
              <p className="text-muted-foreground mb-4">Drag & drop or click to select</p>
              
              <Button style={{ backgroundColor: BRAND.blue }}>
                <UploadSimple className="size-4 mr-2" />
                Select Images
              </Button>
              
              <p className="text-xs text-muted-foreground mt-4">PNG, JPG, WebP • Max 20MB each</p>
            </div>
            
            <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/jpg,image/webp" onChange={(e) => handleFileUpload(e.target.files)} className="hidden" multiple />
            
            {/* Preset Preview */}
            <div className="mt-6">
              <h4 className="text-sm font-medium mb-3" style={{ color: theme.text }}>Popular Presets</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {SIZE_PRESETS.filter(p => p.id !== 'custom').slice(0, 8).map(preset => (
                  <div key={preset.id} className="p-3 rounded-lg border text-center text-xs" style={{ borderColor: theme.cardBorder }}>
                    <preset.icon className="size-4 mx-auto mb-1 text-muted-foreground" />
                    <p className="font-medium truncate" style={{ color: theme.text }}>{preset.label}</p>
                    <p className="text-muted-foreground">{preset.width}×{preset.height}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        // Resizer Screen
        <div className="space-y-4 max-w-4xl mx-auto">
          {/* Settings Bar */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center gap-4">
                {/* Preset Selector */}
                <div className="flex items-center gap-2">
                  <Label className="text-sm whitespace-nowrap">Size:</Label>
                  <Button variant="outline" size="sm" onClick={() => setShowPresetModal(true)} className="min-w-[180px] justify-between">
                    <span className="truncate">
                      {selectedPreset === 'custom' ? `Custom (${targetWidth}×${targetHeight})` : SIZE_PRESETS.find(p => p.id === selectedPreset)?.label}
                    </span>
                    <ArrowRight className="size-4 ml-2" />
                  </Button>
                </div>
                
                {/* Custom Dimensions */}
                {selectedPreset === 'custom' && (
                  <>
                    <div className="h-6 w-px bg-border hidden md:block" />
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={customWidth}
                        onChange={(e) => handleWidthChange(parseInt(e.target.value) || 0)}
                        className="w-20 h-8 px-2 text-sm border rounded bg-background"
                        style={{ borderColor: theme.cardBorder, color: theme.text }}
                        min={1}
                        max={10000}
                      />
                      <span className="text-muted-foreground">×</span>
                      <input
                        type="number"
                        value={customHeight}
                        onChange={(e) => handleHeightChange(parseInt(e.target.value) || 0)}
                        className="w-20 h-8 px-2 text-sm border rounded bg-background"
                        style={{ borderColor: theme.cardBorder, color: theme.text }}
                        min={1}
                        max={10000}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        onClick={() => setMaintainAspectRatio(!maintainAspectRatio)}
                        title={maintainAspectRatio ? "Aspect ratio locked" : "Aspect ratio unlocked"}
                      >
                        {maintainAspectRatio ? <Lock className="size-4" style={{ color: BRAND.blue }} /> : <LockOpen className="size-4" />}
                      </Button>
                    </div>
                  </>
                )}
                
                {/* Actions */}
                <div className="flex items-center gap-2 ml-auto">
                  <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                    <Plus className="size-4 md:mr-2" /><span className="hidden md:inline">Add More</span>
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setShowClearConfirm(true)} className="text-destructive hover:text-destructive">
                    <Trash className="size-4 md:mr-2" /><span className="hidden md:inline">Clear</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* File List */}
          <Card>
            <CardContent className="p-4">
              <div className="space-y-3">
                {files.map((fileObj) => (
                  <div key={fileObj.id} className="flex items-center gap-3 p-3 rounded-lg border" style={{ borderColor: theme.cardBorder, backgroundColor: theme.cardBg }}>
                    <div className="size-12 md:size-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <img src={fileObj.originalUrl} alt={fileObj.file.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate" style={{ color: theme.text }}>{fileObj.file.name}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <span>{fileObj.originalWidth}×{fileObj.originalHeight}</span>
                        <ArrowRight className="size-3" />
                        <span style={{ color: BRAND.blue }}>{targetWidth}×{targetHeight}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {fileObj.status === 'pending' && <Badge variant="outline" className="text-xs">Pending</Badge>}
                      {fileObj.status === 'resizing' && <Badge variant="outline" className="text-xs gap-1"><SpinnerGap className="size-3 animate-spin" />Resizing</Badge>}
                      {fileObj.status === 'done' && (
                        <Button size="sm" variant="outline" onClick={() => downloadFile(fileObj)} className="h-8">
                          <DownloadSimple className="size-4 md:mr-1" /><span className="hidden md:inline">Download</span>
                        </Button>
                      )}
                      {fileObj.status === 'error' && <Badge variant="destructive" className="text-xs">Error</Badge>}
                      <Button size="icon" variant="ghost" onClick={() => removeFile(fileObj.id)} className="size-8 text-muted-foreground hover:text-destructive">
                        <X className="size-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Action Bar */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{stats.total} file{stats.total !== 1 ? 's' : ''} → {targetWidth}×{targetHeight}px</span>
                <div className="flex gap-2">
                  {allDone ? (
                    <Button onClick={downloadAll} style={{ backgroundColor: BRAND.green }}><DownloadSimple className="size-4 mr-2" />Download All</Button>
                  ) : (
                    <Button onClick={resizeAll} disabled={isResizing} style={{ backgroundColor: BRAND.blue }}>
                      {isResizing ? <><SpinnerGap className="size-4 mr-2 animate-spin" />Resizing...</> : <><ArrowsIn className="size-4 mr-2" />Resize All</>}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/jpg,image/webp" onChange={(e) => handleFileUpload(e.target.files)} className="hidden" multiple />
        </div>
      )}
      
      {/* Preset Modal */}
      <Dialog open={showPresetModal} onOpenChange={setShowPresetModal}>
        <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Choose Size Preset</DialogTitle>
          </DialogHeader>
          <div className="grid gap-2">
            {SIZE_PRESETS.map(preset => (
              <Button
                key={preset.id}
                variant={selectedPreset === preset.id ? "default" : "outline"}
                className="justify-start h-auto py-3"
                style={selectedPreset === preset.id ? { backgroundColor: BRAND.blue } : {}}
                onClick={() => { setSelectedPreset(preset.id); setShowPresetModal(false); }}
              >
                <preset.icon className="size-5 mr-3" />
                <div className="text-left">
                  <p className="font-medium">{preset.label}</p>
                  {preset.width && <p className="text-xs opacity-70">{preset.width} × {preset.height}px</p>}
                </div>
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Clear Modal */}
      <Dialog open={showClearConfirm} onOpenChange={setShowClearConfirm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Warning className="size-5 text-amber-500" />Clear All?</DialogTitle>
            <DialogDescription>Remove all {files.length} images?</DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowClearConfirm(false)}>Cancel</Button>
            <Button variant="destructive" onClick={clearAll}><Trash className="size-4 mr-2" />Clear All</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImageResizer;
