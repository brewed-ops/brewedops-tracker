// ImageConverter.jsx - Image Format Converter for BrewedOps
// Features: Convert between formats (PNG, JPG, WebP, GIF, BMP), quality control, resize, batch convert
import React, { useState, useRef, useCallback } from 'react';
import {
  UploadSimple, DownloadSimple, Trash, SpinnerGap, CheckCircle,
  Clock, Warning, ArrowsClockwise, Image, FileImage,
  GearSix, CaretDown, X, Plus, Check, Info
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

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const SUPPORTED_INPUT = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif', 'image/bmp'];

// Output format options
const OUTPUT_FORMATS = [
  { id: 'png', label: 'PNG', mime: 'image/png', ext: '.png', description: 'Lossless, supports transparency' },
  { id: 'jpeg', label: 'JPEG', mime: 'image/jpeg', ext: '.jpg', description: 'Smaller file size, no transparency' },
  { id: 'webp', label: 'WebP', mime: 'image/webp', ext: '.webp', description: 'Modern format, best compression' },
  { id: 'gif', label: 'GIF', mime: 'image/gif', ext: '.gif', description: '256 colors, supports animation' },
  { id: 'bmp', label: 'BMP', mime: 'image/bmp', ext: '.bmp', description: 'Uncompressed, large file size' },
];

// Quality presets
const QUALITY_PRESETS = [
  { id: 'low', label: 'Low', value: 0.5, description: 'Smallest file size' },
  { id: 'medium', label: 'Medium', value: 0.75, description: 'Balanced' },
  { id: 'high', label: 'High', value: 0.9, description: 'Better quality' },
  { id: 'max', label: 'Maximum', value: 1.0, description: 'Best quality' },
];

// Simple Slider component
const Slider = ({ value = 0.9, onChange, min = 0.1, max = 1, step = 0.05, className }) => (
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

// Format badge component
const FormatBadge = ({ format, size = 'default' }) => {
  const colors = {
    png: 'bg-purple-500/15 text-purple-500 border-purple-500/30',
    jpeg: 'bg-orange-500/15 text-orange-500 border-orange-500/30',
    jpg: 'bg-orange-500/15 text-orange-500 border-orange-500/30',
    webp: 'bg-green-500/15 text-green-500 border-green-500/30',
    gif: 'bg-pink-500/15 text-pink-500 border-pink-500/30',
    bmp: 'bg-blue-500/15 text-blue-500 border-blue-500/30',
  };
  
  return (
    <span className={cn(
      "uppercase font-mono font-semibold border rounded px-1.5 py-0.5",
      size === 'small' ? 'text-[10px]' : 'text-xs',
      colors[format.toLowerCase()] || 'bg-muted text-muted-foreground'
    )}>
      {format}
    </span>
  );
};

// File size formatter
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Get format from mime type
const getFormatFromMime = (mime) => {
  const map = {
    'image/png': 'PNG',
    'image/jpeg': 'JPEG',
    'image/jpg': 'JPEG',
    'image/webp': 'WebP',
    'image/gif': 'GIF',
    'image/bmp': 'BMP',
  };
  return map[mime] || 'Unknown';
};

const ImageConverter = ({ isDark }) => {
  const theme = getTheme(isDark);
  
  // State
  const [files, setFiles] = useState([]); // Array of { id, file, originalUrl, preview, status, convertedUrl, convertedSize }
  const [outputFormat, setOutputFormat] = useState('jpeg');
  const [quality, setQuality] = useState(0.9);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  
  // Refs
  const fileInputRef = useRef(null);

  // Handle file upload
  const handleFileUpload = useCallback((newFiles) => {
    if (!newFiles || newFiles.length === 0) return;
    
    setError(null);
    const filesToAdd = [];
    
    Array.from(newFiles).forEach((file) => {
      if (!SUPPORTED_INPUT.includes(file.type)) {
        setError(`"${file.name}" is not a supported format. Use PNG, JPG, WebP, GIF, or BMP.`);
        return;
      }
      
      if (file.size > MAX_FILE_SIZE) {
        setError(`"${file.name}" exceeds 10MB limit.`);
        return;
      }
      
      const url = URL.createObjectURL(file);
      filesToAdd.push({
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        file,
        originalUrl: url,
        preview: url,
        status: 'pending', // pending, converting, done, error
        convertedUrl: null,
        convertedBlob: null,
        convertedSize: null,
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
        if (file.convertedUrl) URL.revokeObjectURL(file.convertedUrl);
      }
      return prev.filter(f => f.id !== id);
    });
  }, []);

  // Clear all files
  const clearAll = useCallback(() => {
    files.forEach(f => {
      if (f.originalUrl) URL.revokeObjectURL(f.originalUrl);
      if (f.convertedUrl) URL.revokeObjectURL(f.convertedUrl);
    });
    setFiles([]);
    setShowClearConfirm(false);
    setError(null);
  }, [files]);

  // Convert a single image
  const convertImage = useCallback(async (fileObj) => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          
          const ctx = canvas.getContext('2d');
          
          // For JPEG/BMP, fill background with white (no transparency support)
          const format = OUTPUT_FORMATS.find(f => f.id === outputFormat);
          if (format && (format.id === 'jpeg' || format.id === 'bmp')) {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }
          
          ctx.drawImage(img, 0, 0);
          
          // Convert to blob
          const mimeType = format?.mime || 'image/jpeg';
          const useQuality = ['jpeg', 'webp'].includes(outputFormat) ? quality : undefined;
          
          canvas.toBlob((blob) => {
            if (blob) {
              resolve({
                blob,
                url: URL.createObjectURL(blob),
                size: blob.size
              });
            } else {
              reject(new Error('Failed to create blob'));
            }
          }, mimeType, useQuality);
        } catch (err) {
          reject(err);
        }
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = fileObj.originalUrl;
    });
  }, [outputFormat, quality]);

  // Convert all images
  const convertAll = useCallback(async () => {
    if (files.length === 0) return;
    
    setIsConverting(true);
    setError(null);
    
    // Mark all as converting
    setFiles(prev => prev.map(f => ({ ...f, status: 'converting' })));
    
    for (const fileObj of files) {
      try {
        const result = await convertImage(fileObj);
        
        setFiles(prev => prev.map(f => 
          f.id === fileObj.id 
            ? { 
                ...f, 
                status: 'done', 
                convertedUrl: result.url, 
                convertedBlob: result.blob,
                convertedSize: result.size 
              }
            : f
        ));
      } catch (err) {
        console.error('Conversion error:', err);
        setFiles(prev => prev.map(f => 
          f.id === fileObj.id 
            ? { ...f, status: 'error' }
            : f
        ));
      }
    }
    
    setIsConverting(false);
  }, [files, convertImage]);

  // Download single file
  const downloadFile = useCallback((fileObj) => {
    if (!fileObj.convertedUrl || !fileObj.convertedBlob) return;
    
    const format = OUTPUT_FORMATS.find(f => f.id === outputFormat);
    const originalName = fileObj.file.name.replace(/\.[^/.]+$/, '');
    const newName = `${originalName}${format?.ext || '.jpg'}`;
    
    const link = document.createElement('a');
    link.href = fileObj.convertedUrl;
    link.download = newName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [outputFormat]);

  // Download all converted files
  const downloadAll = useCallback(() => {
    const convertedFiles = files.filter(f => f.status === 'done');
    convertedFiles.forEach((fileObj, index) => {
      setTimeout(() => downloadFile(fileObj), index * 200);
    });
  }, [files, downloadFile]);

  // Get stats
  const stats = {
    total: files.length,
    pending: files.filter(f => f.status === 'pending').length,
    converting: files.filter(f => f.status === 'converting').length,
    done: files.filter(f => f.status === 'done').length,
    error: files.filter(f => f.status === 'error').length,
  };

  const allDone = stats.done > 0 && stats.done === stats.total;
  const hasFiles = files.length > 0;

  return (
    <div className="p-4 md:p-6 w-full min-h-screen" style={{ backgroundColor: theme.bg, fontFamily: FONTS.body }}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl md:text-3xl font-bold mb-1 flex items-center gap-2" style={{ color: theme.text, fontFamily: FONTS.heading }}>
          <ArrowsClockwise className="size-5 md:size-8 shrink-0" style={{ color: BRAND.blue }} />
          Image Converter
        </h1>
        <p className="text-xs md:text-sm text-muted-foreground">Convert images between PNG, JPEG, WebP, GIF, and BMP</p>
      </div>

      {/* Main Content */}
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
              <div 
                className="size-20 rounded-full mx-auto mb-6 flex items-center justify-center"
                style={{ backgroundColor: BRAND.blue + '15' }}
              >
                <FileImage className="size-10" style={{ color: BRAND.blue }} />
              </div>
              
              <h3 className="text-xl font-semibold mb-2" style={{ color: theme.text, fontFamily: FONTS.heading }}>
                Upload Images
              </h3>
              <p className="text-muted-foreground mb-4">Drag & drop or click to select images</p>
              
              <Button style={{ backgroundColor: BRAND.blue }}>
                <UploadSimple className="size-4 mr-2" />
                Select Images
              </Button>
              
              <p className="text-xs text-muted-foreground mt-4">
                Supports PNG, JPG, WebP, GIF, BMP • Max 10MB each • Multiple files allowed
              </p>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp,image/gif,image/bmp"
              onChange={(e) => handleFileUpload(e.target.files)}
              className="hidden"
              multiple
            />
            
            {error && (
              <div className="mt-4 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                <div className="flex gap-3">
                  <Warning className="size-5 text-destructive flex-shrink-0" />
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              </div>
            )}
            
            {/* Format Info */}
            <div className="mt-6 grid gap-3">
              <h4 className="text-sm font-medium" style={{ color: theme.text }}>Supported Formats</h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {OUTPUT_FORMATS.map(format => (
                  <div 
                    key={format.id}
                    className="p-3 rounded-lg border text-center"
                    style={{ borderColor: theme.cardBorder }}
                  >
                    <FormatBadge format={format.id} />
                    <p className="text-[10px] text-muted-foreground mt-1.5 leading-tight">{format.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        // Converter Screen
        <div className="space-y-4 max-w-4xl mx-auto">
          {/* Settings Bar */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center gap-4">
                {/* Output Format */}
                <div className="flex items-center gap-2">
                  <Label className="text-sm whitespace-nowrap">Convert to:</Label>
                  <div className="flex gap-1">
                    {OUTPUT_FORMATS.map(format => (
                      <Button
                        key={format.id}
                        variant={outputFormat === format.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => setOutputFormat(format.id)}
                        className="h-8 px-2 md:px-3"
                        style={outputFormat === format.id ? { backgroundColor: BRAND.blue } : {}}
                      >
                        {format.label}
                      </Button>
                    ))}
                  </div>
                </div>
                
                {/* Quality (only for JPEG/WebP) */}
                {(outputFormat === 'jpeg' || outputFormat === 'webp') && (
                  <>
                    <div className="h-6 w-px bg-border hidden md:block" />
                    <div className="flex items-center gap-3 flex-1 min-w-[200px]">
                      <Label className="text-sm whitespace-nowrap">Quality:</Label>
                      <Slider 
                        value={quality} 
                        onChange={setQuality}
                        min={0.1}
                        max={1}
                        step={0.05}
                        className="flex-1"
                      />
                      <span className="text-sm font-mono w-12 text-right">{Math.round(quality * 100)}%</span>
                    </div>
                  </>
                )}
                
                {/* Actions */}
                <div className="flex items-center gap-2 ml-auto">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Plus className="size-4 md:mr-2" />
                    <span className="hidden md:inline">Add More</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowClearConfirm(true)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash className="size-4 md:mr-2" />
                    <span className="hidden md:inline">Clear All</span>
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
                  <div 
                    key={fileObj.id}
                    className="flex items-center gap-3 p-3 rounded-lg border"
                    style={{ borderColor: theme.cardBorder, backgroundColor: theme.cardBg }}
                  >
                    {/* Thumbnail */}
                    <div className="size-12 md:size-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <img 
                        src={fileObj.preview} 
                        alt={fileObj.file.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate" style={{ color: theme.text }}>
                        {fileObj.file.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <FormatBadge format={getFormatFromMime(fileObj.file.type)} size="small" />
                        <span className="text-xs text-muted-foreground">
                          {formatFileSize(fileObj.file.size)}
                        </span>
                        {fileObj.status === 'done' && fileObj.convertedSize && (
                          <>
                            <span className="text-xs text-muted-foreground">→</span>
                            <FormatBadge format={outputFormat} size="small" />
                            <span className="text-xs" style={{ color: BRAND.green }}>
                              {formatFileSize(fileObj.convertedSize)}
                            </span>
                            {fileObj.convertedSize < fileObj.file.size && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-500/15 text-green-500">
                                -{Math.round((1 - fileObj.convertedSize / fileObj.file.size) * 100)}%
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                    
                    {/* Status & Actions */}
                    <div className="flex items-center gap-2">
                      {fileObj.status === 'pending' && (
                        <Badge variant="outline" className="text-xs">Pending</Badge>
                      )}
                      {fileObj.status === 'converting' && (
                        <Badge variant="outline" className="text-xs gap-1">
                          <SpinnerGap className="size-3 animate-spin" />
                          Converting
                        </Badge>
                      )}
                      {fileObj.status === 'done' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => downloadFile(fileObj)}
                          className="h-8"
                        >
                          <DownloadSimple className="size-4 md:mr-1" />
                          <span className="hidden md:inline">Download</span>
                        </Button>
                      )}
                      {fileObj.status === 'error' && (
                        <Badge variant="destructive" className="text-xs">Error</Badge>
                      )}
                      
                      <Button 
                        size="icon" 
                        variant="ghost"
                        onClick={() => removeFile(fileObj.id)}
                        className="size-8 text-muted-foreground hover:text-destructive"
                      >
                        <X className="size-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              {error && (
                <div className="mt-4 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                  <div className="flex gap-3">
                    <Warning className="size-5 text-destructive flex-shrink-0" />
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Action Bar */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{stats.total} file{stats.total !== 1 ? 's' : ''}</span>
                  {stats.done > 0 && (
                    <span className="flex items-center gap-1" style={{ color: BRAND.green }}>
                      <CheckCircle className="size-4" />
                      {stats.done} converted
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  {allDone ? (
                    <Button 
                      onClick={downloadAll}
                      style={{ backgroundColor: BRAND.green }}
                    >
                      <DownloadSimple className="size-4 mr-2" />
                      Download All ({stats.done})
                    </Button>
                  ) : (
                    <Button 
                      onClick={convertAll}
                      disabled={isConverting || stats.pending === 0}
                      style={{ backgroundColor: BRAND.blue }}
                    >
                      {isConverting ? (
                        <>
                          <SpinnerGap className="size-4 mr-2 animate-spin" />
                          Converting...
                        </>
                      ) : (
                        <>
                          <ArrowsClockwise className="size-4 mr-2" />
                          Convert {stats.pending > 0 ? `(${stats.pending})` : 'All'}
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Info */}
          {(outputFormat === 'jpeg' || outputFormat === 'bmp') && (
            <div className="p-4 rounded-lg border" style={{ backgroundColor: BRAND.blue + '08', borderColor: BRAND.blue + '20' }}>
              <div className="flex gap-3">
                <Info className="size-5 flex-shrink-0 mt-0.5" style={{ color: BRAND.blue }} />
                <div>
                  <p className="text-sm font-medium" style={{ color: BRAND.blue }}>
                    {outputFormat === 'jpeg' ? 'Transparency Note' : 'Large File Size'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {outputFormat === 'jpeg' 
                      ? 'JPEG does not support transparency. Transparent areas will be filled with white.'
                      : 'BMP files are uncompressed and will be larger than the original.'}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Hidden file input for adding more */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp,image/gif,image/bmp"
            onChange={(e) => handleFileUpload(e.target.files)}
            className="hidden"
            multiple
          />
        </div>
      )}
      
      {/* Clear Confirmation Modal */}
      <Dialog open={showClearConfirm} onOpenChange={setShowClearConfirm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Warning className="size-5 text-amber-500" />
              Clear All Images?
            </DialogTitle>
            <DialogDescription>
              This will remove all {files.length} image{files.length !== 1 ? 's' : ''} and any converted files. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowClearConfirm(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={clearAll}>
              <Trash className="size-4 mr-2" />
              Clear All
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImageConverter;
