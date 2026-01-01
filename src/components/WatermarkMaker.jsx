// WatermarkMaker.jsx - Add Watermarks to Images for BrewedOps
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, Download, Trash2, Stamp, Type, Image, Move, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { getTheme } from '../lib/theme';

const BRAND = { brown: '#3F200C', blue: '#004AAC', green: '#51AF43', cream: '#FFF0D4' };
const FONTS = { heading: "'Montserrat', sans-serif", body: "'Poppins', sans-serif" };

const POSITIONS = [
  { id: 'tl', label: 'Top Left', x: 5, y: 5 },
  { id: 'tc', label: 'Top Center', x: 50, y: 5 },
  { id: 'tr', label: 'Top Right', x: 95, y: 5 },
  { id: 'ml', label: 'Middle Left', x: 5, y: 50 },
  { id: 'mc', label: 'Center', x: 50, y: 50 },
  { id: 'mr', label: 'Middle Right', x: 95, y: 50 },
  { id: 'bl', label: 'Bottom Left', x: 5, y: 95 },
  { id: 'bc', label: 'Bottom Center', x: 50, y: 95 },
  { id: 'br', label: 'Bottom Right', x: 95, y: 95 },
];

const WatermarkMaker = ({ isDark }) => {
  const theme = getTheme(isDark);
  const [imageUrl, setImageUrl] = useState(null);
  const [watermarkType, setWatermarkType] = useState('text');
  const [watermarkText, setWatermarkText] = useState('© BrewedOps');
  const [watermarkImage, setWatermarkImage] = useState(null);
  const [position, setPosition] = useState('br');
  const [opacity, setOpacity] = useState(50);
  const [fontSize, setFontSize] = useState(24);
  const [fontColor, setFontColor] = useState('#ffffff');
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(20);
  const [tiled, setTiled] = useState(false);
  const [resultUrl, setResultUrl] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  
  const fileInputRef = useRef(null);
  const watermarkInputRef = useRef(null);
  const canvasRef = useRef(null);

  const handleImageUpload = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) return;
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    setResultUrl(null);
  }, [imageUrl]);

  const handleWatermarkImageUpload = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) return;
    if (watermarkImage) URL.revokeObjectURL(watermarkImage);
    const url = URL.createObjectURL(file);
    setWatermarkImage(url);
  }, [watermarkImage]);

  const applyWatermark = useCallback(async () => {
    if (!imageUrl || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = async () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      ctx.globalAlpha = opacity / 100;
      
      const pos = POSITIONS.find(p => p.id === position);
      const baseX = (pos.x / 100) * canvas.width;
      const baseY = (pos.y / 100) * canvas.height;
      
      if (tiled) {
        // Tiled watermark
        const spacing = canvas.width / 4;
        ctx.save();
        ctx.rotate((rotation * Math.PI) / 180);
        
        for (let y = -canvas.height; y < canvas.height * 2; y += spacing) {
          for (let x = -canvas.width; x < canvas.width * 2; x += spacing) {
            if (watermarkType === 'text') {
              ctx.font = `bold ${fontSize}px Arial`;
              ctx.fillStyle = fontColor;
              ctx.textAlign = 'center';
              ctx.fillText(watermarkText, x, y);
            }
          }
        }
        ctx.restore();
      } else {
        // Single watermark
        ctx.save();
        ctx.translate(baseX, baseY);
        ctx.rotate((rotation * Math.PI) / 180);
        
        if (watermarkType === 'text') {
          ctx.font = `bold ${fontSize}px Arial`;
          ctx.fillStyle = fontColor;
          ctx.textAlign = pos.x === 50 ? 'center' : pos.x < 50 ? 'left' : 'right';
          ctx.textBaseline = pos.y === 50 ? 'middle' : pos.y < 50 ? 'top' : 'bottom';
          
          // Text shadow for visibility
          ctx.shadowColor = 'rgba(0,0,0,0.5)';
          ctx.shadowBlur = 4;
          ctx.shadowOffsetX = 2;
          ctx.shadowOffsetY = 2;
          
          ctx.fillText(watermarkText, 0, 0);
        } else if (watermarkType === 'image' && watermarkImage) {
          const wmImg = new window.Image();
          wmImg.crossOrigin = 'anonymous';
          wmImg.onload = () => {
            const wmWidth = (scale / 100) * canvas.width;
            const wmHeight = (wmImg.height / wmImg.width) * wmWidth;
            const offsetX = pos.x === 50 ? -wmWidth / 2 : pos.x < 50 ? 0 : -wmWidth;
            const offsetY = pos.y === 50 ? -wmHeight / 2 : pos.y < 50 ? 0 : -wmHeight;
            ctx.drawImage(wmImg, offsetX, offsetY, wmWidth, wmHeight);
            ctx.restore();
            setResultUrl(canvas.toDataURL('image/png'));
          };
          wmImg.src = watermarkImage;
          return;
        }
        ctx.restore();
      }
      
      setResultUrl(canvas.toDataURL('image/png'));
    };
    img.src = imageUrl;
  }, [imageUrl, watermarkType, watermarkText, watermarkImage, position, opacity, fontSize, fontColor, rotation, scale, tiled]);

  useEffect(() => {
    if (imageUrl) {
      applyWatermark();
    }
  }, [imageUrl, watermarkType, watermarkText, watermarkImage, position, opacity, fontSize, fontColor, rotation, scale, tiled, applyWatermark]);

  const downloadImage = () => {
    if (!resultUrl) return;
    const a = document.createElement('a');
    a.href = resultUrl;
    a.download = `watermarked_${Date.now()}.png`;
    a.click();
  };

  const clearAll = () => {
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    if (watermarkImage) URL.revokeObjectURL(watermarkImage);
    setImageUrl(null);
    setWatermarkImage(null);
    setResultUrl(null);
    setShowClearConfirm(false);
  };

  return (
    <div className="p-4 md:p-6 w-full min-h-screen" style={{ backgroundColor: theme.bg, fontFamily: FONTS.body }}>
      <div className="mb-6">
        <h1 className="text-xl md:text-3xl font-bold mb-1 flex items-center gap-2" style={{ color: theme.text, fontFamily: FONTS.heading }}>
          <Stamp className="size-5 md:size-8 shrink-0" style={{ color: BRAND.blue }} />
          Watermark Maker
        </h1>
        <p className="text-xs md:text-sm text-muted-foreground">Add text or image watermarks to your photos</p>
      </div>

      <div className="max-w-5xl mx-auto">
        {!imageUrl ? (
          <Card>
            <CardContent className="p-6 md:p-12">
              <div className="border-2 border-dashed rounded-xl p-8 md:p-12 text-center cursor-pointer hover:border-primary hover:bg-primary/5"
                onClick={() => fileInputRef.current?.click()}>
                <div className="size-20 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ backgroundColor: BRAND.blue + '15' }}>
                  <Stamp className="size-10" style={{ color: BRAND.blue }} />
                </div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: theme.text, fontFamily: FONTS.heading }}>Upload Image</h3>
                <p className="text-muted-foreground mb-4">Select an image to add watermark</p>
                <Button style={{ backgroundColor: BRAND.blue }}><Upload className="size-4 mr-2" />Select Image</Button>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => handleImageUpload(e.target.files?.[0])} className="hidden" />
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {/* Preview */}
            <div className="md:col-span-2">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <Label className="font-medium" style={{ color: theme.text }}>Preview</Label>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setShowClearConfirm(true)}><Trash2 className="size-4" /></Button>
                      <Button size="sm" onClick={downloadImage} style={{ backgroundColor: BRAND.green }} disabled={!resultUrl}>
                        <Download className="size-4 mr-2" />Download
                      </Button>
                    </div>
                  </div>
                  
                  {resultUrl && <img src={resultUrl} alt="Watermarked" className="w-full rounded-lg" style={{ maxHeight: '500px', objectFit: 'contain' }} />}
                  <canvas ref={canvasRef} className="hidden" />
                </CardContent>
              </Card>
            </div>

            {/* Controls */}
            <div className="space-y-4">
              {/* Watermark Type */}
              <Card>
                <CardContent className="p-4">
                  <Label className="font-medium mb-3 block" style={{ color: theme.text }}>Watermark Type</Label>
                  <div className="flex gap-2">
                    <Button variant={watermarkType === 'text' ? "default" : "outline"} size="sm" className="flex-1"
                      onClick={() => setWatermarkType('text')} style={watermarkType === 'text' ? { backgroundColor: BRAND.blue } : {}}>
                      <Type className="size-4 mr-2" />Text
                    </Button>
                    <Button variant={watermarkType === 'image' ? "default" : "outline"} size="sm" className="flex-1"
                      onClick={() => setWatermarkType('image')} style={watermarkType === 'image' ? { backgroundColor: BRAND.blue } : {}}>
                      <Image className="size-4 mr-2" />Image
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Watermark Content */}
              <Card>
                <CardContent className="p-4 space-y-4">
                  {watermarkType === 'text' ? (
                    <>
                      <div>
                        <Label className="text-sm mb-1 block">Text</Label>
                        <input type="text" value={watermarkText} onChange={(e) => setWatermarkText(e.target.value)}
                          className="w-full h-10 px-3 border rounded-lg" style={{ borderColor: theme.cardBorder }} />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-sm mb-1 block">Size: {fontSize}px</Label>
                          <input type="range" min={12} max={72} value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value))}
                            className="w-full" style={{ accentColor: BRAND.blue }} />
                        </div>
                        <div>
                          <Label className="text-sm mb-1 block">Color</Label>
                          <input type="color" value={fontColor} onChange={(e) => setFontColor(e.target.value)}
                            className="w-full h-9 rounded cursor-pointer" />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div>
                      <Label className="text-sm mb-2 block">Watermark Image</Label>
                      {watermarkImage ? (
                        <div className="relative">
                          <img src={watermarkImage} alt="Watermark" className="w-full h-20 object-contain rounded border" />
                          <Button size="icon" variant="destructive" className="absolute top-1 right-1 size-6"
                            onClick={() => { URL.revokeObjectURL(watermarkImage); setWatermarkImage(null); }}>
                            <Trash2 className="size-3" />
                          </Button>
                        </div>
                      ) : (
                        <Button variant="outline" className="w-full" onClick={() => watermarkInputRef.current?.click()}>
                          <Upload className="size-4 mr-2" />Upload Logo
                        </Button>
                      )}
                      <input ref={watermarkInputRef} type="file" accept="image/*" onChange={(e) => handleWatermarkImageUpload(e.target.files?.[0])} className="hidden" />
                      
                      <div className="mt-3">
                        <Label className="text-sm mb-1 block">Scale: {scale}%</Label>
                        <input type="range" min={5} max={50} value={scale} onChange={(e) => setScale(parseInt(e.target.value))}
                          className="w-full" style={{ accentColor: BRAND.blue }} />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Position & Settings */}
              <Card>
                <CardContent className="p-4 space-y-4">
                  <div>
                    <Label className="text-sm mb-2 block">Position</Label>
                    <div className="grid grid-cols-3 gap-1">
                      {POSITIONS.map(pos => (
                        <button key={pos.id} onClick={() => setPosition(pos.id)}
                          className={cn("h-8 rounded border text-xs", position === pos.id ? "bg-blue-500 text-white border-blue-500" : "border-muted hover:border-blue-300")}>
                          {pos.id.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm mb-1 block">Opacity: {opacity}%</Label>
                    <input type="range" min={10} max={100} value={opacity} onChange={(e) => setOpacity(parseInt(e.target.value))}
                      className="w-full" style={{ accentColor: BRAND.blue }} />
                  </div>
                  
                  <div>
                    <Label className="text-sm mb-1 block">Rotation: {rotation}°</Label>
                    <input type="range" min={-45} max={45} value={rotation} onChange={(e) => setRotation(parseInt(e.target.value))}
                      className="w-full" style={{ accentColor: BRAND.blue }} />
                  </div>
                  
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={tiled} onChange={(e) => setTiled(e.target.checked)} className="rounded" />
                    <span className="text-sm">Tiled (repeat pattern)</span>
                  </label>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      <Dialog open={showClearConfirm} onOpenChange={setShowClearConfirm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><AlertTriangle className="size-5 text-amber-500" />Clear Image?</DialogTitle>
            <DialogDescription>This will remove the current image.</DialogDescription>
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

export default WatermarkMaker;
