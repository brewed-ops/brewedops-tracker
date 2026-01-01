// ImageCompressor.jsx - Image Compression Tool for BrewedOps
// Features: Compress images, quality control, batch support, before/after comparison
import React, { useState, useRef, useCallback } from 'react';
import { 
  Upload, Download, Trash2, Loader2, CheckCircle, 
  AlertTriangle, ImageDown, Image, X, Plus, Info,
  ArrowRight, Percent
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

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
const SUPPORTED_FORMATS = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

// Quality presets
const QUALITY_PRESETS = [
  { id: 'low', label: 'Maximum Compression', value: 0.4, description: 'Smallest file, lower quality' },
  { id: 'medium', label: 'Balanced', value: 0.6, description: 'Good balance' },
  { id: 'high', label: 'High Quality', value: 0.8, description: 'Better quality, larger file' },
  { id: 'minimal', label: 'Minimal Compression', value: 0.92, description: 'Best quality, slight reduction' },
];

// Simple Slider component
const Slider = ({ value = 0.8, onChange, min = 0.1, max = 1, step = 0.05, className }) => (
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

// File size formatter
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Calculate savings percentage
const calcSavings = (original, compressed) => {
  if (!original || !compressed) return 0;
  return Math.round((1 - compressed / original) * 100);
};

const ImageCompressor = ({ isDark }) => {
  const theme = getTheme(isDark);
  
  // State
  const [files, setFiles] = useState([]);
  const [quality, setQuality] = useState(0.8);
  const [outputFormat, setOutputFormat] = useState('webp'); // webp gives best compression
  const [isCompressing, setIsCompressing] = useState(false);
  const [error, setError] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  
  // Refs
  const fileInputRef = useRef(null);

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
      filesToAdd.push({
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        file,
        originalUrl: url,
        originalSize: file.size,
        status: 'pending',
        compressedUrl: null,
        compressedBlob: null,
        compressedSize: null,
      });
    });
    
    setFiles(prev => [...prev, ...filesToAdd]);
  }, []);

  // Remove a file
  const removeFile = useCallback((id) => {
    setFiles(prev => {
      const file = prev.find(f => f.id === id);
      if (file) {
        if (file.originalUrl) URL.revokeObjectURL(file.originalUrl);
        if (file.compressedUrl) URL.revokeObjectURL(file.compressedUrl);
      }
      return prev.filter(f => f.id !== id);
    });
  }, []);

  // Clear all files
  const clearAll = useCallback(() => {
    files.forEach(f => {
      if (f.originalUrl) URL.revokeObjectURL(f.originalUrl);
      if (f.compressedUrl) URL.revokeObjectURL(f.compressedUrl);
    });
    setFiles([]);
    setShowClearConfirm(false);
    setError(null);
  }, [files]);

  // Compress a single image
  const compressImage = useCallback(async (fileObj) => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          
          const ctx = canvas.getContext('2d');
          
          // Fill white background for JPEG (no transparency)
          if (outputFormat === 'jpeg') {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }
          
          ctx.drawImage(img, 0, 0);
          
          const mimeType = outputFormat === 'jpeg' ? 'image/jpeg' : 
                          outputFormat === 'png' ? 'image/png' : 'image/webp';
          
          canvas.toBlob((blob) => {
            if (blob) {
              resolve({
                blob,
                url: URL.createObjectURL(blob),
                size: blob.size
              });
            } else {
              reject(new Error('Failed to compress'));
            }
          }, mimeType, quality);
        } catch (err) {
          reject(err);
        }
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = fileObj.originalUrl;
    });
  }, [quality, outputFormat]);

  // Compress all images
  const compressAll = useCallback(async () => {
    if (files.length === 0) return;
    
    setIsCompressing(true);
    setError(null);
    
    setFiles(prev => prev.map(f => ({ ...f, status: 'compressing' })));
    
    for (const fileObj of files) {
      try {
        const result = await compressImage(fileObj);
        
        setFiles(prev => prev.map(f => 
          f.id === fileObj.id 
            ? { 
                ...f, 
                status: 'done', 
                compressedUrl: result.url, 
                compressedBlob: result.blob,
                compressedSize: result.size 
              }
            : f
        ));
      } catch (err) {
        console.error('Compression error:', err);
        setFiles(prev => prev.map(f => 
          f.id === fileObj.id ? { ...f, status: 'error' } : f
        ));
      }
    }
    
    setIsCompressing(false);
  }, [files, compressImage]);

  // Download single file
  const downloadFile = useCallback((fileObj) => {
    if (!fileObj.compressedUrl || !fileObj.compressedBlob) return;
    
    const ext = outputFormat === 'jpeg' ? '.jpg' : outputFormat === 'png' ? '.png' : '.webp';
    const originalName = fileObj.file.name.replace(/\.[^/.]+$/, '');
    const newName = `${originalName}_compressed${ext}`;
    
    const link = document.createElement('a');
    link.href = fileObj.compressedUrl;
    link.download = newName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [outputFormat]);

  // Download all
  const downloadAll = useCallback(() => {
    const doneFiles = files.filter(f => f.status === 'done');
    doneFiles.forEach((fileObj, index) => {
      setTimeout(() => downloadFile(fileObj), index * 200);
    });
  }, [files, downloadFile]);

  // Stats
  const stats = {
    total: files.length,
    pending: files.filter(f => f.status === 'pending').length,
    done: files.filter(f => f.status === 'done').length,
    totalOriginal: files.reduce((sum, f) => sum + f.originalSize, 0),
    totalCompressed: files.filter(f => f.status === 'done').reduce((sum, f) => sum + (f.compressedSize || 0), 0),
  };

  const allDone = stats.done > 0 && stats.done === stats.total;
  const hasFiles = files.length > 0;

  return (
    <div className="p-4 md:p-6 w-full min-h-screen" style={{ backgroundColor: theme.bg, fontFamily: FONTS.body }}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-1 flex items-center gap-2" style={{ color: theme.text, fontFamily: FONTS.heading }}>
          <ImageDown className="size-6 md:size-8" style={{ color: BRAND.blue }} />
          Image Compressor
        </h1>
        <p className="text-sm text-muted-foreground">Reduce image file size without losing quality</p>
      </div>

      {!hasFiles ? (
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
                handleFileUpload(e.dataTransfer.files);
              }}
            >
              <div className="size-20 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ backgroundColor: BRAND.blue + '15' }}>
                <ImageDown className="size-10" style={{ color: BRAND.blue }} />
              </div>
              
              <h3 className="text-xl font-semibold mb-2" style={{ color: theme.text, fontFamily: FONTS.heading }}>
                Upload Images to Compress
              </h3>
              <p className="text-muted-foreground mb-4">Drag & drop or click to select</p>
              
              <Button style={{ backgroundColor: BRAND.blue }}>
                <Upload className="size-4 mr-2" />
                Select Images
              </Button>
              
              <p className="text-xs text-muted-foreground mt-4">
                PNG, JPG, WebP • Max 20MB each • Multiple files allowed
              </p>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={(e) => handleFileUpload(e.target.files)}
              className="hidden"
              multiple
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
              <div className="p-4 rounded-lg border" style={{ backgroundColor: BRAND.green + '08', borderColor: BRAND.green + '20' }}>
                <div className="flex gap-3">
                  <Percent className="size-5 flex-shrink-0 mt-0.5" style={{ color: BRAND.green }} />
                  <div>
                    <p className="text-sm font-medium" style={{ color: BRAND.green }}>Smart Compression</p>
                    <p className="text-xs text-muted-foreground mt-1">Reduce file sizes by up to 80% while maintaining visual quality.</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        // Compressor Screen
        <div className="space-y-4 max-w-4xl mx-auto">
          {/* Settings Bar */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center gap-4">
                {/* Output Format */}
                <div className="flex items-center gap-2">
                  <Label className="text-sm whitespace-nowrap">Format:</Label>
                  <div className="flex gap-1">
                    {['webp', 'jpeg', 'png'].map(fmt => (
                      <Button
                        key={fmt}
                        variant={outputFormat === fmt ? "default" : "outline"}
                        size="sm"
                        onClick={() => setOutputFormat(fmt)}
                        className="h-8 px-3 uppercase text-xs"
                        style={outputFormat === fmt ? { backgroundColor: BRAND.blue } : {}}
                      >
                        {fmt}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="h-6 w-px bg-border hidden md:block" />
                
                {/* Quality Slider */}
                <div className="flex items-center gap-3 flex-1 min-w-[200px]">
                  <Label className="text-sm whitespace-nowrap">Quality:</Label>
                  <Slider value={quality} onChange={setQuality} min={0.1} max={1} step={0.05} className="flex-1" />
                  <span className="text-sm font-mono w-12 text-right">{Math.round(quality * 100)}%</span>
                </div>
                
                {/* Actions */}
                <div className="flex items-center gap-2 ml-auto">
                  <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                    <Plus className="size-4 md:mr-2" />
                    <span className="hidden md:inline">Add More</span>
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setShowClearConfirm(true)} className="text-destructive hover:text-destructive">
                    <Trash2 className="size-4 md:mr-2" />
                    <span className="hidden md:inline">Clear All</span>
                  </Button>
                </div>
              </div>
              
              {/* Quality Presets */}
              <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t">
                <span className="text-xs text-muted-foreground mr-2">Presets:</span>
                {QUALITY_PRESETS.map(preset => (
                  <Button
                    key={preset.id}
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuality(preset.value)}
                    className={cn("h-7 text-xs", quality === preset.value && "bg-muted")}
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* File List */}
          <Card>
            <CardContent className="p-4">
              <div className="space-y-3">
                {files.map((fileObj) => (
                  <div 
                    key={fileObj.id}
                    className="flex items-center gap-3 p-3 rounded-lg border"
                    style={{ borderColor: theme.cardBorder, backgroundColor: theme.cardBg }}
                  >
                    {/* Thumbnail */}
                    <div className="size-12 md:size-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <img src={fileObj.originalUrl} alt={fileObj.file.name} className="w-full h-full object-cover" />
                    </div>
                    
                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate" style={{ color: theme.text }}>{fileObj.file.name}</p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-xs text-muted-foreground">{formatFileSize(fileObj.originalSize)}</span>
                        {fileObj.status === 'done' && fileObj.compressedSize && (
                          <>
                            <ArrowRight className="size-3 text-muted-foreground" />
                            <span className="text-xs font-medium" style={{ color: BRAND.green }}>{formatFileSize(fileObj.compressedSize)}</span>
                            <Badge className="text-[10px] px-1.5 py-0" style={{ backgroundColor: BRAND.green + '20', color: BRAND.green }}>
                              -{calcSavings(fileObj.originalSize, fileObj.compressedSize)}%
                            </Badge>
                          </>
                        )}
                      </div>
                    </div>
                    
                    {/* Status & Actions */}
                    <div className="flex items-center gap-2">
                      {fileObj.status === 'pending' && <Badge variant="outline" className="text-xs">Pending</Badge>}
                      {fileObj.status === 'compressing' && (
                        <Badge variant="outline" className="text-xs gap-1">
                          <Loader2 className="size-3 animate-spin" />
                          Compressing
                        </Badge>
                      )}
                      {fileObj.status === 'done' && (
                        <Button size="sm" variant="outline" onClick={() => downloadFile(fileObj)} className="h-8">
                          <Download className="size-4 md:mr-1" />
                          <span className="hidden md:inline">Download</span>
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
                <div className="text-sm text-muted-foreground">
                  {stats.total} file{stats.total !== 1 ? 's' : ''}
                  {stats.done > 0 && (
                    <span className="ml-3" style={{ color: BRAND.green }}>
                      Saved {formatFileSize(stats.totalOriginal - stats.totalCompressed)} ({calcSavings(stats.totalOriginal, stats.totalCompressed)}%)
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {allDone ? (
                    <Button onClick={downloadAll} style={{ backgroundColor: BRAND.green }}>
                      <Download className="size-4 mr-2" />
                      Download All ({stats.done})
                    </Button>
                  ) : (
                    <Button onClick={compressAll} disabled={isCompressing} style={{ backgroundColor: BRAND.blue }}>
                      {isCompressing ? <><Loader2 className="size-4 mr-2 animate-spin" />Compressing...</> : <><ImageDown className="size-4 mr-2" />Compress All</>}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/jpg,image/webp" onChange={(e) => handleFileUpload(e.target.files)} className="hidden" multiple />
        </div>
      )}
      
      {/* Clear Modal */}
      <Dialog open={showClearConfirm} onOpenChange={setShowClearConfirm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="size-5 text-amber-500" />
              Clear All Images?
            </DialogTitle>
            <DialogDescription>This will remove all {files.length} image{files.length !== 1 ? 's' : ''}.</DialogDescription>
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

export default ImageCompressor;
