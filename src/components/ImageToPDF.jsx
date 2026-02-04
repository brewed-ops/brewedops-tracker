// ImageToPDF.jsx - Convert Images to PDF for BrewedOps
import React, { useState, useRef, useCallback } from 'react';
import { UploadSimple, DownloadSimple, Trash, ImageSquare, Plus, X, ArrowUp, ArrowDown, SpinnerGap, Warning, FileText } from '@phosphor-icons/react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { getTheme } from '../lib/theme';
import { PDFDocument } from 'pdf-lib';

const BRAND = { brown: '#3F200C', blue: '#004AAC', green: '#51AF43', cream: '#FFF0D4' };
const FONTS = { heading: "'Montserrat', sans-serif", body: "'Poppins', sans-serif" };

const PAGE_SIZES = [
  { id: 'a4', name: 'A4', width: 595.28, height: 841.89 },
  { id: 'letter', name: 'US Letter', width: 612, height: 792 },
  { id: 'legal', name: 'US Legal', width: 612, height: 1008 },
  { id: 'fit', name: 'Fit to Image', width: 0, height: 0 },
];

const ORIENTATIONS = [
  { id: 'portrait', name: 'Portrait' },
  { id: 'landscape', name: 'Landscape' },
];

const ImageToPDF = ({ isDark }) => {
  const theme = getTheme(isDark);
  const [images, setImages] = useState([]);
  const [pageSize, setPageSize] = useState('a4');
  const [orientation, setOrientation] = useState('portrait');
  const [margin, setMargin] = useState(20);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  
  const fileInputRef = useRef(null);

  const handleFileUpload = useCallback((files) => {
    if (!files || files.length === 0) return;
    setError(null);
    setPdfUrl(null);
    
    const imageFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (imageFiles.length !== files.length) {
      setError('Some files were skipped. Only images are supported.');
    }
    
    const newImages = imageFiles.map((file, i) => ({
      id: `${Date.now()}-${i}`,
      file,
      name: file.name,
      url: URL.createObjectURL(file),
    }));
    
    setImages(prev => [...prev, ...newImages]);
  }, []);

  const removeImage = (id) => {
    const img = images.find(i => i.id === id);
    if (img) URL.revokeObjectURL(img.url);
    setImages(images.filter(i => i.id !== id));
    setPdfUrl(null);
  };

  const moveImage = (index, direction) => {
    const newImages = [...images];
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= images.length) return;
    [newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]];
    setImages(newImages);
    setPdfUrl(null);
  };

  const convertToPDF = async () => {
    if (images.length === 0) return;
    
    setIsConverting(true);
    setError(null);
    
    try {
      const pdfDoc = await PDFDocument.create();
      const size = PAGE_SIZES.find(s => s.id === pageSize);
      
      for (const imgObj of images) {
        const imgBytes = await imgObj.file.arrayBuffer();
        let embeddedImg;
        
        if (imgObj.file.type === 'image/png') {
          embeddedImg = await pdfDoc.embedPng(imgBytes);
        } else {
          embeddedImg = await pdfDoc.embedJpg(imgBytes);
        }
        
        let pageWidth, pageHeight;
        
        if (pageSize === 'fit') {
          pageWidth = embeddedImg.width;
          pageHeight = embeddedImg.height;
        } else {
          pageWidth = orientation === 'portrait' ? size.width : size.height;
          pageHeight = orientation === 'portrait' ? size.height : size.width;
        }
        
        const page = pdfDoc.addPage([pageWidth, pageHeight]);
        
        // Calculate image dimensions to fit within margins
        const availableWidth = pageWidth - (margin * 2);
        const availableHeight = pageHeight - (margin * 2);
        
        const imgAspect = embeddedImg.width / embeddedImg.height;
        const pageAspect = availableWidth / availableHeight;
        
        let drawWidth, drawHeight;
        if (imgAspect > pageAspect) {
          drawWidth = availableWidth;
          drawHeight = availableWidth / imgAspect;
        } else {
          drawHeight = availableHeight;
          drawWidth = availableHeight * imgAspect;
        }
        
        const x = margin + (availableWidth - drawWidth) / 2;
        const y = margin + (availableHeight - drawHeight) / 2;
        
        page.drawImage(embeddedImg, {
          x,
          y,
          width: drawWidth,
          height: drawHeight,
        });
      }
      
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setPdfUrl(URL.createObjectURL(blob));
    } catch (err) {
      console.error('PDF creation error:', err);
      setError('Failed to create PDF. Some images may not be supported.');
    } finally {
      setIsConverting(false);
    }
  };

  const downloadPDF = () => {
    if (!pdfUrl) return;
    const a = document.createElement('a');
    a.href = pdfUrl;
    a.download = `images_${Date.now()}.pdf`;
    a.click();
  };

  const clearAll = () => {
    images.forEach(img => URL.revokeObjectURL(img.url));
    if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    setImages([]);
    setPdfUrl(null);
    setError(null);
    setShowClearConfirm(false);
  };

  return (
    <div className="p-4 md:p-6 w-full min-h-screen" style={{ backgroundColor: theme.bg, fontFamily: FONTS.body }}>
      <div className="mb-6">
        <h1 className="text-xl md:text-3xl font-bold mb-1 flex items-center gap-2" style={{ color: theme.text, fontFamily: FONTS.heading }}>
          <ImageSquare className="size-5 md:size-8 shrink-0" style={{ color: BRAND.blue }} />
          Image to PDF
        </h1>
        <p className="text-xs md:text-sm text-muted-foreground">Convert images to PDF documents</p>
      </div>

      <div className="max-w-3xl mx-auto space-y-4">
        {/* Upload Area */}
        <Card>
          <CardContent className="p-6">
            <div className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:border-primary hover:bg-primary/5"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); handleFileUpload(e.dataTransfer.files); }}>
              <ImageSquare className="size-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-semibold mb-2" style={{ color: theme.text }}>Add Images</h3>
              <p className="text-sm text-muted-foreground mb-4">PNG, JPG, WebP • Multiple files supported</p>
              <Button style={{ backgroundColor: BRAND.blue }}><Plus className="size-4 mr-2" />Add Images</Button>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={(e) => handleFileUpload(e.target.files)} className="hidden" />
          </CardContent>
        </Card>

        {/* Image List */}
        {images.length > 0 && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <Label className="font-medium" style={{ color: theme.text }}>{images.length} Image{images.length !== 1 ? 's' : ''}</Label>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}><Plus className="size-4 mr-1" />Add More</Button>
                  <Button variant="outline" size="sm" onClick={() => setShowClearConfirm(true)} className="text-destructive">
                    <Trash className="size-4 mr-1" />Clear
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                {images.map((img, index) => (
                  <div key={img.id} className="flex items-center gap-3 p-2 rounded-lg border" style={{ borderColor: theme.cardBorder }}>
                    <div className="flex flex-col gap-1">
                      <Button size="icon" variant="ghost" className="size-6" onClick={() => moveImage(index, -1)} disabled={index === 0}>
                        <ArrowUp className="size-3" />
                      </Button>
                      <Button size="icon" variant="ghost" className="size-6" onClick={() => moveImage(index, 1)} disabled={index === images.length - 1}>
                        <ArrowDown className="size-3" />
                      </Button>
                    </div>
                    <img src={img.url} alt={img.name} className="size-12 rounded object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate" style={{ color: theme.text }}>{img.name}</p>
                    </div>
                    <span className="text-xs text-muted-foreground w-6 text-center">{index + 1}</span>
                    <Button size="icon" variant="ghost" className="size-8 text-muted-foreground hover:text-destructive" onClick={() => removeImage(img.id)}>
                      <X className="size-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Settings */}
        {images.length > 0 && (
          <Card>
            <CardContent className="p-4">
              <Label className="font-medium mb-3 block" style={{ color: theme.text }}>PDF Settings</Label>
              
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm mb-2 block">Page Size</Label>
                  <select value={pageSize} onChange={(e) => { setPageSize(e.target.value); setPdfUrl(null); }}
                    className="w-full h-10 px-3 border rounded-lg" style={{ borderColor: theme.cardBorder }}>
                    {PAGE_SIZES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                
                {pageSize !== 'fit' && (
                  <div>
                    <Label className="text-sm mb-2 block">Orientation</Label>
                    <select value={orientation} onChange={(e) => { setOrientation(e.target.value); setPdfUrl(null); }}
                      className="w-full h-10 px-3 border rounded-lg" style={{ borderColor: theme.cardBorder }}>
                      {ORIENTATIONS.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                    </select>
                  </div>
                )}
                
                <div>
                  <Label className="text-sm mb-2 block">Margin: {margin}px</Label>
                  <input type="range" min={0} max={50} value={margin} onChange={(e) => { setMargin(parseInt(e.target.value)); setPdfUrl(null); }}
                    className="w-full mt-2" style={{ accentColor: BRAND.blue }} />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Convert Button */}
        {images.length > 0 && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {pdfUrl ? 'PDF ready for download!' : `${images.length} image${images.length !== 1 ? 's' : ''} ready to convert`}
                </div>
                {pdfUrl ? (
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setPdfUrl(null)}>Convert Again</Button>
                    <Button onClick={downloadPDF} style={{ backgroundColor: BRAND.green }}>
                      <DownloadSimple className="size-4 mr-2" />Download PDF
                    </Button>
                  </div>
                ) : (
                  <Button onClick={convertToPDF} disabled={isConverting} style={{ backgroundColor: BRAND.blue }}>
                    {isConverting ? <><SpinnerGap className="size-4 mr-2 animate-spin" />Converting...</> : <><FileText className="size-4 mr-2" />Create PDF</>}
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
            <DialogDescription>This will remove all {images.length} images.</DialogDescription>
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

export default ImageToPDF;
