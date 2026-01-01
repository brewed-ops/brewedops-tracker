// MemeGenerator.jsx - Meme Creator for BrewedOps
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, Download, Trash2, Smile, Type, Plus, X, Move, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { getTheme } from '../lib/theme';

const BRAND = { brown: '#3F200C', blue: '#004AAC', green: '#51AF43', cream: '#FFF0D4' };
const FONTS = { heading: "'Montserrat', sans-serif", body: "'Poppins', sans-serif" };

const MEME_FONTS = [
  { id: 'impact', name: 'Impact', style: 'Impact, sans-serif' },
  { id: 'arial', name: 'Arial Black', style: 'Arial Black, sans-serif' },
  { id: 'comic', name: 'Comic Sans', style: 'Comic Sans MS, cursive' },
  { id: 'times', name: 'Times', style: 'Times New Roman, serif' },
];

const TEMPLATES = [
  { id: 'drake', name: 'Drake', url: 'https://i.imgflip.com/30b1gx.jpg' },
  { id: 'distracted', name: 'Distracted BF', url: 'https://i.imgflip.com/1ur9b0.jpg' },
  { id: 'button', name: 'Two Buttons', url: 'https://i.imgflip.com/1g8my4.jpg' },
  { id: 'change', name: 'Change My Mind', url: 'https://i.imgflip.com/24y43o.jpg' },
];

const MemeGenerator = ({ isDark }) => {
  const theme = getTheme(isDark);
  const [imageUrl, setImageUrl] = useState(null);
  const [texts, setTexts] = useState([
    { id: 1, text: 'TOP TEXT', x: 50, y: 10, fontSize: 40, color: '#ffffff', font: 'impact', align: 'center' },
    { id: 2, text: 'BOTTOM TEXT', x: 50, y: 90, fontSize: 40, color: '#ffffff', font: 'impact', align: 'center' },
  ]);
  const [selectedText, setSelectedText] = useState(null);
  const [showTemplates, setShowTemplates] = useState(false);
  
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

  const handleFileUpload = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const url = URL.createObjectURL(file);
    setImageUrl(url);
  }, []);

  const selectTemplate = (template) => {
    setImageUrl(template.url);
    setShowTemplates(false);
  };

  const updateText = (id, updates) => {
    setTexts(texts.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const addText = () => {
    const newId = Math.max(...texts.map(t => t.id), 0) + 1;
    setTexts([...texts, { id: newId, text: 'NEW TEXT', x: 50, y: 50, fontSize: 30, color: '#ffffff', font: 'impact', align: 'center' }]);
    setSelectedText(newId);
  };

  const removeText = (id) => {
    setTexts(texts.filter(t => t.id !== id));
    if (selectedText === id) setSelectedText(null);
  };

  const drawMeme = useCallback(() => {
    if (!canvasRef.current || !imageUrl) return null;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    
    return new Promise((resolve) => {
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        texts.forEach(t => {
          const x = (t.x / 100) * canvas.width;
          const y = (t.y / 100) * canvas.height;
          const fontSize = (t.fontSize / 100) * canvas.height * 0.15;
          
          ctx.font = `bold ${fontSize}px ${MEME_FONTS.find(f => f.id === t.font)?.style || 'Impact'}`;
          ctx.textAlign = t.align;
          ctx.textBaseline = 'middle';
          
          // Stroke (outline)
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = fontSize / 10;
          ctx.strokeText(t.text.toUpperCase(), x, y);
          
          // Fill
          ctx.fillStyle = t.color;
          ctx.fillText(t.text.toUpperCase(), x, y);
        });
        
        resolve(canvas.toDataURL('image/png'));
      };
      img.src = imageUrl;
    });
  }, [imageUrl, texts]);

  const downloadMeme = async () => {
    const dataUrl = await drawMeme();
    if (!dataUrl) return;
    
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `meme_${Date.now()}.png`;
    a.click();
  };

  const clearAll = () => {
    if (imageUrl && !imageUrl.startsWith('https://')) URL.revokeObjectURL(imageUrl);
    setImageUrl(null);
    setTexts([
      { id: 1, text: 'TOP TEXT', x: 50, y: 10, fontSize: 40, color: '#ffffff', font: 'impact', align: 'center' },
      { id: 2, text: 'BOTTOM TEXT', x: 50, y: 90, fontSize: 40, color: '#ffffff', font: 'impact', align: 'center' },
    ]);
    setSelectedText(null);
  };

  const selected = texts.find(t => t.id === selectedText);

  return (
    <div className="p-4 md:p-6 w-full min-h-screen" style={{ backgroundColor: theme.bg, fontFamily: FONTS.body }}>
      <div className="mb-6">
        <h1 className="text-xl md:text-3xl font-bold mb-1 flex items-center gap-2" style={{ color: theme.text, fontFamily: FONTS.heading }}>
          <Smile className="size-5 md:size-8 shrink-0" style={{ color: BRAND.blue }} />
          Meme Generator
        </h1>
        <p className="text-xs md:text-sm text-muted-foreground">Create funny memes with custom text</p>
      </div>

      <div className="max-w-5xl mx-auto">
        {!imageUrl ? (
          <Card>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Upload */}
                <div className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:border-primary hover:bg-primary/5"
                  onClick={() => fileInputRef.current?.click()}>
                  <Upload className="size-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-semibold mb-2" style={{ color: theme.text }}>Upload Your Image</h3>
                  <p className="text-sm text-muted-foreground">PNG, JPG, WebP</p>
                </div>
                
                {/* Templates */}
                <div className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:border-primary hover:bg-primary/5"
                  onClick={() => setShowTemplates(true)}>
                  <Smile className="size-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-semibold mb-2" style={{ color: theme.text }}>Use Template</h3>
                  <p className="text-sm text-muted-foreground">Popular meme formats</p>
                </div>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => handleFileUpload(e.target.files?.[0])} className="hidden" />
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {/* Meme Preview */}
            <div className="md:col-span-2">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <Label className="font-medium" style={{ color: theme.text }}>Meme Preview</Label>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={clearAll}><Trash2 className="size-4" /></Button>
                      <Button size="sm" onClick={downloadMeme} style={{ backgroundColor: BRAND.green }}>
                        <Download className="size-4 mr-2" />Download
                      </Button>
                    </div>
                  </div>
                  
                  <div className="relative bg-muted rounded-lg overflow-hidden">
                    <img src={imageUrl} alt="Meme" className="w-full" style={{ maxHeight: '500px', objectFit: 'contain' }} />
                    {texts.map(t => (
                      <div key={t.id} className={cn("absolute cursor-move select-none", selectedText === t.id && "ring-2 ring-blue-500")}
                        style={{
                          left: `${t.x}%`, top: `${t.y}%`, transform: 'translate(-50%, -50%)',
                          fontSize: `${t.fontSize * 0.5}px`, fontFamily: MEME_FONTS.find(f => f.id === t.font)?.style,
                          color: t.color, textShadow: '2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000',
                          fontWeight: 'bold', textAlign: t.align, whiteSpace: 'nowrap'
                        }}
                        onClick={() => setSelectedText(t.id)}>
                        {t.text.toUpperCase()}
                      </div>
                    ))}
                  </div>
                  <canvas ref={canvasRef} className="hidden" />
                </CardContent>
              </Card>
            </div>

            {/* Text Controls */}
            <div className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <Label className="font-medium" style={{ color: theme.text }}>Text Layers</Label>
                    <Button size="sm" variant="outline" onClick={addText}><Plus className="size-4 mr-1" />Add</Button>
                  </div>
                  
                  <div className="space-y-2">
                    {texts.map(t => (
                      <div key={t.id} className={cn("flex items-center gap-2 p-2 rounded-lg cursor-pointer border",
                        selectedText === t.id ? "border-blue-500 bg-blue-500/10" : "border-transparent hover:bg-muted")}
                        onClick={() => setSelectedText(t.id)}>
                        <Type className="size-4 text-muted-foreground" />
                        <span className="flex-1 truncate text-sm">{t.text || 'Empty'}</span>
                        <Button size="icon" variant="ghost" className="size-6" onClick={(e) => { e.stopPropagation(); removeText(t.id); }}>
                          <X className="size-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {selected && (
                <Card>
                  <CardContent className="p-4 space-y-4">
                    <Label className="font-medium" style={{ color: theme.text }}>Edit Text</Label>
                    
                    <input type="text" value={selected.text} onChange={(e) => updateText(selected.id, { text: e.target.value })}
                      className="w-full h-10 px-3 border rounded-lg" style={{ borderColor: theme.cardBorder }} placeholder="Enter text" />
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs mb-1 block">Font</Label>
                        <select value={selected.font} onChange={(e) => updateText(selected.id, { font: e.target.value })}
                          className="w-full h-9 px-2 text-sm border rounded" style={{ borderColor: theme.cardBorder }}>
                          {MEME_FONTS.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <Label className="text-xs mb-1 block">Color</Label>
                        <input type="color" value={selected.color} onChange={(e) => updateText(selected.id, { color: e.target.value })}
                          className="w-full h-9 rounded cursor-pointer" />
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-xs mb-1 block">Size: {selected.fontSize}</Label>
                      <input type="range" min={20} max={80} value={selected.fontSize}
                        onChange={(e) => updateText(selected.id, { fontSize: parseInt(e.target.value) })}
                        className="w-full" style={{ accentColor: BRAND.blue }} />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs mb-1 block">X: {selected.x}%</Label>
                        <input type="range" min={0} max={100} value={selected.x}
                          onChange={(e) => updateText(selected.id, { x: parseInt(e.target.value) })}
                          className="w-full" style={{ accentColor: BRAND.blue }} />
                      </div>
                      <div>
                        <Label className="text-xs mb-1 block">Y: {selected.y}%</Label>
                        <input type="range" min={0} max={100} value={selected.y}
                          onChange={(e) => updateText(selected.id, { y: parseInt(e.target.value) })}
                          className="w-full" style={{ accentColor: BRAND.blue }} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Templates Modal */}
      <Dialog open={showTemplates} onOpenChange={setShowTemplates}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Choose Template</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            {TEMPLATES.map(t => (
              <div key={t.id} className="cursor-pointer rounded-lg overflow-hidden border hover:border-blue-500 transition-colors"
                onClick={() => selectTemplate(t)}>
                <img src={t.url} alt={t.name} className="w-full aspect-square object-cover" />
                <p className="text-xs text-center py-2 bg-muted">{t.name}</p>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MemeGenerator;
