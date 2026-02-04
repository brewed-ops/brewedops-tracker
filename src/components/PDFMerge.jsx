// PDFMerge.jsx - PDF Merge Tool for BrewedOps
import React, { useState, useRef, useCallback } from 'react';
import { UploadSimple, DownloadSimple, Trash, Files, Plus, DotsSixVertical, X, SpinnerGap, Warning, ArrowUp, ArrowDown } from '@phosphor-icons/react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { getTheme } from '../lib/theme';
import { PDFDocument } from 'pdf-lib';

const BRAND = { brown: '#3F200C', blue: '#004AAC', green: '#51AF43', cream: '#FFF0D4' };
const FONTS = { heading: "'Montserrat', sans-serif", body: "'Poppins', sans-serif" };

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const PDFMerge = ({ isDark }) => {
  const theme = getTheme(isDark);
  const [files, setFiles] = useState([]);
  const [mergedUrl, setMergedUrl] = useState(null);
  const [isMerging, setIsMerging] = useState(false);
  const [error, setError] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  
  const fileInputRef = useRef(null);

  const handleFileUpload = useCallback((newFiles) => {
    if (!newFiles || newFiles.length === 0) return;
    setError(null);
    setMergedUrl(null);
    
    const pdfFiles = Array.from(newFiles).filter(f => f.type === 'application/pdf');
    if (pdfFiles.length !== newFiles.length) {
      setError('Some files were skipped. Only PDF files are supported.');
    }
    
    const filesToAdd = pdfFiles.map((file, i) => ({
      id: `${Date.now()}-${i}`,
      file,
      name: file.name,
      size: file.size,
    }));
    
    setFiles(prev => [...prev, ...filesToAdd]);
  }, []);

  const removeFile = (id) => {
    setFiles(files.filter(f => f.id !== id));
    setMergedUrl(null);
  };

  const moveFile = (index, direction) => {
    const newFiles = [...files];
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= files.length) return;
    [newFiles[index], newFiles[newIndex]] = [newFiles[newIndex], newFiles[index]];
    setFiles(newFiles);
    setMergedUrl(null);
  };

  const mergePDFs = async () => {
    if (files.length < 2) {
      setError('Please add at least 2 PDF files to merge.');
      return;
    }
    
    setIsMerging(true);
    setError(null);
    
    try {
      const mergedPdf = await PDFDocument.create();
      
      for (const fileObj of files) {
        const arrayBuffer = await fileObj.file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        pages.forEach(page => mergedPdf.addPage(page));
      }
      
      const mergedBytes = await mergedPdf.save();
      const blob = new Blob([mergedBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setMergedUrl(url);
    } catch (err) {
      console.error('Merge error:', err);
      setError('Failed to merge PDFs. Some files may be corrupted or protected.');
    } finally {
      setIsMerging(false);
    }
  };

  const downloadMerged = () => {
    if (!mergedUrl) return;
    const a = document.createElement('a');
    a.href = mergedUrl;
    a.download = `merged_${Date.now()}.pdf`;
    a.click();
  };

  const clearAll = () => {
    if (mergedUrl) URL.revokeObjectURL(mergedUrl);
    setFiles([]);
    setMergedUrl(null);
    setError(null);
    setShowClearConfirm(false);
  };

  const totalSize = files.reduce((sum, f) => sum + f.size, 0);

  return (
    <div className="p-4 md:p-6 w-full min-h-screen" style={{ backgroundColor: theme.bg, fontFamily: FONTS.body }}>
      <div className="mb-6">
        <h1 className="text-xl md:text-3xl font-bold mb-1 flex items-center gap-2" style={{ color: theme.text, fontFamily: FONTS.heading }}>
          <Files className="size-5 md:size-8 shrink-0" style={{ color: BRAND.blue }} />
          PDF Merge
        </h1>
        <p className="text-xs md:text-sm text-muted-foreground">Combine multiple PDF files into one document</p>
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        {/* Upload Area */}
        <Card>
          <CardContent className="p-6">
            <div className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:border-primary hover:bg-primary/5"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); handleFileUpload(e.dataTransfer.files); }}>
              <Files className="size-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-semibold mb-2" style={{ color: theme.text }}>Add PDF Files</h3>
              <p className="text-sm text-muted-foreground mb-4">Drag & drop or click to select</p>
              <Button style={{ backgroundColor: BRAND.blue }}><Plus className="size-4 mr-2" />Add PDFs</Button>
            </div>
            <input ref={fileInputRef} type="file" accept=".pdf" multiple onChange={(e) => handleFileUpload(e.target.files)} className="hidden" />
          </CardContent>
        </Card>

        {/* File List */}
        {files.length > 0 && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <Label className="font-medium" style={{ color: theme.text }}>{files.length} PDF{files.length !== 1 ? 's' : ''} • {formatFileSize(totalSize)}</Label>
                <Button variant="outline" size="sm" onClick={() => setShowClearConfirm(true)} className="text-destructive">
                  <Trash className="size-4 mr-1" />Clear All
                </Button>
              </div>
              
              <div className="space-y-2">
                {files.map((fileObj, index) => (
                  <div key={fileObj.id} className="flex items-center gap-3 p-3 rounded-lg border" style={{ borderColor: theme.cardBorder, backgroundColor: theme.cardBg }}>
                    <div className="flex flex-col gap-1">
                      <Button size="icon" variant="ghost" className="size-6" onClick={() => moveFile(index, -1)} disabled={index === 0}>
                        <ArrowUp className="size-3" />
                      </Button>
                      <Button size="icon" variant="ghost" className="size-6" onClick={() => moveFile(index, 1)} disabled={index === files.length - 1}>
                        <ArrowDown className="size-3" />
                      </Button>
                    </div>
                    <div className="size-10 rounded bg-red-500/10 flex items-center justify-center shrink-0">
                      <Files className="size-5 text-red-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate" style={{ color: theme.text }}>{fileObj.name}</p>
                      <p className="text-xs text-muted-foreground">{formatFileSize(fileObj.size)}</p>
                    </div>
                    <span className="text-xs text-muted-foreground w-6 text-center">{index + 1}</span>
                    <Button size="icon" variant="ghost" className="size-8 text-muted-foreground hover:text-destructive" onClick={() => removeFile(fileObj.id)}>
                      <X className="size-4" />
                    </Button>
                  </div>
                ))}
              </div>
              
              <p className="text-xs text-muted-foreground mt-3 text-center">Drag files to reorder. Files will be merged top to bottom.</p>
            </CardContent>
          </Card>
        )}

        {/* Merge Button */}
        {files.length > 0 && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {mergedUrl ? 'PDF merged successfully!' : `Ready to merge ${files.length} files`}
                </div>
                {mergedUrl ? (
                  <Button onClick={downloadMerged} style={{ backgroundColor: BRAND.green }}>
                    <DownloadSimple className="size-4 mr-2" />Download Merged PDF
                  </Button>
                ) : (
                  <Button onClick={mergePDFs} disabled={isMerging || files.length < 2} style={{ backgroundColor: BRAND.blue }}>
                    {isMerging ? <><SpinnerGap className="size-4 mr-2 animate-spin" />Merging...</> : <><Files className="size-4 mr-2" />Merge PDFs</>}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {error && (
          <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
            <div className="flex gap-3">
              <Warning className="size-5 text-destructive shrink-0" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          </div>
        )}
      </div>

      <Dialog open={showClearConfirm} onOpenChange={setShowClearConfirm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Warning className="size-5 text-amber-500" />Clear All?</DialogTitle>
            <DialogDescription>This will remove all {files.length} PDF files.</DialogDescription>
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

export default PDFMerge;
