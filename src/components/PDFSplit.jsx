// PDFSplit.jsx - PDF Split Tool for BrewedOps
import React, { useState, useRef, useCallback } from 'react';
import { UploadSimple, DownloadSimple, Trash, Scissors, SpinnerGap, Warning, FileText, Check } from '@phosphor-icons/react';
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

const PDFSplit = ({ isDark }) => {
  const theme = getTheme(isDark);
  const [file, setFile] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [selectedPages, setSelectedPages] = useState([]);
  const [splitMode, setSplitMode] = useState('select'); // 'select', 'range', 'all'
  const [rangeStart, setRangeStart] = useState(1);
  const [rangeEnd, setRangeEnd] = useState(1);
  const [splitFiles, setSplitFiles] = useState([]);
  const [isSplitting, setIsSplitting] = useState(false);
  const [error, setError] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  
  const fileInputRef = useRef(null);

  const handleFileUpload = useCallback(async (uploadedFile) => {
    if (!uploadedFile || uploadedFile.type !== 'application/pdf') {
      setError('Please upload a PDF file.');
      return;
    }
    
    setError(null);
    setSplitFiles([]);
    
    try {
      const arrayBuffer = await uploadedFile.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const pages = pdf.getPageCount();
      
      setFile(uploadedFile);
      setPageCount(pages);
      setSelectedPages([]);
      setRangeStart(1);
      setRangeEnd(pages);
    } catch (err) {
      console.error('PDF load error:', err);
      setError('Failed to load PDF. The file may be corrupted or protected.');
    }
  }, []);

  const togglePage = (pageNum) => {
    setSelectedPages(prev => 
      prev.includes(pageNum) 
        ? prev.filter(p => p !== pageNum)
        : [...prev, pageNum].sort((a, b) => a - b)
    );
  };

  const selectAll = () => setSelectedPages([...Array(pageCount)].map((_, i) => i + 1));
  const selectNone = () => setSelectedPages([]);

  const splitPDF = async () => {
    if (!file) return;
    
    setIsSplitting(true);
    setError(null);
    setSplitFiles([]);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const sourcePdf = await PDFDocument.load(arrayBuffer);
      const results = [];
      
      if (splitMode === 'all') {
        // Split into individual pages
        for (let i = 0; i < pageCount; i++) {
          const newPdf = await PDFDocument.create();
          const [page] = await newPdf.copyPages(sourcePdf, [i]);
          newPdf.addPage(page);
          const bytes = await newPdf.save();
          const blob = new Blob([bytes], { type: 'application/pdf' });
          results.push({
            id: `page-${i + 1}`,
            name: `page_${i + 1}.pdf`,
            url: URL.createObjectURL(blob),
            size: blob.size,
          });
        }
      } else if (splitMode === 'range') {
        // Extract range
        const newPdf = await PDFDocument.create();
        const pageIndices = [];
        for (let i = rangeStart - 1; i < rangeEnd; i++) {
          pageIndices.push(i);
        }
        const pages = await newPdf.copyPages(sourcePdf, pageIndices);
        pages.forEach(page => newPdf.addPage(page));
        const bytes = await newPdf.save();
        const blob = new Blob([bytes], { type: 'application/pdf' });
        results.push({
          id: 'range',
          name: `pages_${rangeStart}-${rangeEnd}.pdf`,
          url: URL.createObjectURL(blob),
          size: blob.size,
        });
      } else {
        // Extract selected pages
        if (selectedPages.length === 0) {
          setError('Please select at least one page.');
          setIsSplitting(false);
          return;
        }
        const newPdf = await PDFDocument.create();
        const pageIndices = selectedPages.map(p => p - 1);
        const pages = await newPdf.copyPages(sourcePdf, pageIndices);
        pages.forEach(page => newPdf.addPage(page));
        const bytes = await newPdf.save();
        const blob = new Blob([bytes], { type: 'application/pdf' });
        results.push({
          id: 'selected',
          name: `selected_pages.pdf`,
          url: URL.createObjectURL(blob),
          size: blob.size,
        });
      }
      
      setSplitFiles(results);
    } catch (err) {
      console.error('Split error:', err);
      setError('Failed to split PDF.');
    } finally {
      setIsSplitting(false);
    }
  };

  const downloadFile = (fileObj) => {
    const a = document.createElement('a');
    a.href = fileObj.url;
    a.download = fileObj.name;
    a.click();
  };

  const downloadAll = () => {
    splitFiles.forEach((f, i) => setTimeout(() => downloadFile(f), i * 200));
  };

  const clearAll = () => {
    splitFiles.forEach(f => URL.revokeObjectURL(f.url));
    setFile(null);
    setPageCount(0);
    setSelectedPages([]);
    setSplitFiles([]);
    setError(null);
    setShowClearConfirm(false);
  };

  return (
    <div className="p-4 md:p-6 w-full min-h-screen" style={{ backgroundColor: theme.bg, fontFamily: FONTS.body }}>
      <div className="mb-6">
        <h1 className="text-xl md:text-3xl font-bold mb-1 flex items-center gap-2" style={{ color: theme.text, fontFamily: FONTS.heading }}>
          <Scissors className="size-5 md:size-8 shrink-0" style={{ color: BRAND.blue }} />
          PDF Split
        </h1>
        <p className="text-xs md:text-sm text-muted-foreground">Extract pages or split PDF into multiple files</p>
      </div>

      <div className="max-w-3xl mx-auto space-y-4">
        {!file ? (
          <Card>
            <CardContent className="p-6 md:p-12">
              <div className="border-2 border-dashed rounded-xl p-8 md:p-12 text-center cursor-pointer hover:border-primary hover:bg-primary/5"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); handleFileUpload(e.dataTransfer.files?.[0]); }}>
                <div className="size-20 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ backgroundColor: BRAND.blue + '15' }}>
                  <Scissors className="size-10" style={{ color: BRAND.blue }} />
                </div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: theme.text, fontFamily: FONTS.heading }}>Upload PDF to Split</h3>
                <p className="text-muted-foreground mb-4">Drag & drop or click to select</p>
                <Button style={{ backgroundColor: BRAND.blue }}><UploadSimple className="size-4 mr-2" />Select PDF</Button>
              </div>
              <input ref={fileInputRef} type="file" accept=".pdf" onChange={(e) => handleFileUpload(e.target.files?.[0])} className="hidden" />
            </CardContent>
          </Card>
        ) : (
          <>
            {/* File Info */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="size-12 rounded bg-red-500/10 flex items-center justify-center">
                      <FileText className="size-6 text-red-500" />
                    </div>
                    <div>
                      <p className="font-medium" style={{ color: theme.text }}>{file.name}</p>
                      <p className="text-sm text-muted-foreground">{formatFileSize(file.size)} • {pageCount} pages</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setShowClearConfirm(true)} className="text-destructive">
                    <Trash className="size-4 mr-1" />Clear
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Split Mode */}
            <Card>
              <CardContent className="p-4">
                <Label className="font-medium mb-3 block" style={{ color: theme.text }}>Split Mode</Label>
                <div className="flex flex-wrap gap-2 mb-4">
                  {[
                    { id: 'select', label: 'Select Pages' },
                    { id: 'range', label: 'Page Range' },
                    { id: 'all', label: 'All Pages (Individual)' },
                  ].map(mode => (
                    <Button key={mode.id} variant={splitMode === mode.id ? "default" : "outline"} size="sm"
                      onClick={() => setSplitMode(mode.id)} style={splitMode === mode.id ? { backgroundColor: BRAND.blue } : {}}>
                      {mode.label}
                    </Button>
                  ))}
                </div>

                {splitMode === 'select' && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-muted-foreground">{selectedPages.length} of {pageCount} selected</span>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={selectAll}>Select All</Button>
                        <Button variant="ghost" size="sm" onClick={selectNone}>Clear</Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
                      {[...Array(pageCount)].map((_, i) => {
                        const pageNum = i + 1;
                        const isSelected = selectedPages.includes(pageNum);
                        return (
                          <button key={pageNum} onClick={() => togglePage(pageNum)}
                            className={cn("aspect-square rounded-lg border-2 text-sm font-medium transition-all",
                              isSelected ? "border-blue-500 bg-blue-500 text-white" : "border-muted hover:border-blue-300")}>
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {splitMode === 'range' && (
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <Label className="text-sm mb-1 block">From Page</Label>
                      <input type="number" min={1} max={pageCount} value={rangeStart}
                        onChange={(e) => setRangeStart(Math.min(parseInt(e.target.value) || 1, rangeEnd))}
                        className="w-full h-10 px-3 border rounded-lg" style={{ borderColor: theme.cardBorder }} />
                    </div>
                    <div className="flex-1">
                      <Label className="text-sm mb-1 block">To Page</Label>
                      <input type="number" min={rangeStart} max={pageCount} value={rangeEnd}
                        onChange={(e) => setRangeEnd(Math.max(parseInt(e.target.value) || pageCount, rangeStart))}
                        className="w-full h-10 px-3 border rounded-lg" style={{ borderColor: theme.cardBorder }} />
                    </div>
                  </div>
                )}

                {splitMode === 'all' && (
                  <p className="text-sm text-muted-foreground">Each page will be saved as a separate PDF file ({pageCount} files).</p>
                )}
              </CardContent>
            </Card>

            {/* Split Button */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    {splitFiles.length > 0 ? `${splitFiles.length} file(s) ready` : 'Configure and split'}
                  </div>
                  {splitFiles.length > 0 ? (
                    <div className="flex gap-2">
                      {splitFiles.length > 1 && (
                        <Button variant="outline" onClick={downloadAll}><DownloadSimple className="size-4 mr-2" />Download All</Button>
                      )}
                      <Button onClick={() => setSplitFiles([])} variant="outline">Split Again</Button>
                    </div>
                  ) : (
                    <Button onClick={splitPDF} disabled={isSplitting} style={{ backgroundColor: BRAND.blue }}>
                      {isSplitting ? <><SpinnerGap className="size-4 mr-2 animate-spin" />Splitting...</> : <><Scissors className="size-4 mr-2" />Split PDF</>}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Split Results */}
            {splitFiles.length > 0 && (
              <Card>
                <CardContent className="p-4">
                  <Label className="font-medium mb-3 block" style={{ color: theme.text }}>Split Files</Label>
                  <div className="space-y-2">
                    {splitFiles.map(f => (
                      <div key={f.id} className="flex items-center gap-3 p-3 rounded-lg border" style={{ borderColor: theme.cardBorder }}>
                        <FileText className="size-5 text-red-500" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{f.name}</p>
                          <p className="text-xs text-muted-foreground">{formatFileSize(f.size)}</p>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => downloadFile(f)}>
                          <DownloadSimple className="size-4 mr-1" />Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
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
            <DialogTitle className="flex items-center gap-2"><Warning className="size-5 text-amber-500" />Clear PDF?</DialogTitle>
            <DialogDescription>This will remove the PDF and all split files.</DialogDescription>
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

export default PDFSplit;
