// ColorPicker.jsx - Color Picker & Palette Generator for BrewedOps
import React, { useState, useRef, useCallback } from 'react';
import { UploadSimple, Copy, Check, Palette, Eyedropper, Plus, Trash, DownloadSimple, ArrowsClockwise } from '@phosphor-icons/react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { getTheme } from '../lib/theme';

const BRAND = { brown: '#3F200C', blue: '#004AAC', green: '#51AF43', cream: '#FFF0D4' };
const FONTS = { heading: "'Montserrat', sans-serif", body: "'Poppins', sans-serif" };

// Color conversion utilities
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : null;
};

const rgbToHsl = (r, g, b) => {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) { h = s = 0; }
  else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
};

const hslToHex = (h, s, l) => {
  s /= 100; l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = n => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

const generatePalette = (baseHex, type) => {
  const rgb = hexToRgb(baseHex);
  if (!rgb) return [baseHex];
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  
  switch (type) {
    case 'complementary':
      return [baseHex, hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l)];
    case 'triadic':
      return [baseHex, hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l), hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l)];
    case 'analogous':
      return [hslToHex((hsl.h - 30 + 360) % 360, hsl.s, hsl.l), baseHex, hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l)];
    case 'split':
      return [baseHex, hslToHex((hsl.h + 150) % 360, hsl.s, hsl.l), hslToHex((hsl.h + 210) % 360, hsl.s, hsl.l)];
    case 'shades':
      return [hslToHex(hsl.h, hsl.s, 90), hslToHex(hsl.h, hsl.s, 70), hslToHex(hsl.h, hsl.s, 50), hslToHex(hsl.h, hsl.s, 30), hslToHex(hsl.h, hsl.s, 10)];
    default:
      return [baseHex];
  }
};

const ColorPicker = ({ isDark }) => {
  const theme = getTheme(isDark);
  const [imageUrl, setImageUrl] = useState(null);
  const [pickedColors, setPickedColors] = useState([]);
  const [selectedColor, setSelectedColor] = useState('#004AAC');
  const [paletteType, setPaletteType] = useState('analogous');
  const [copied, setCopied] = useState(null);
  const [isPickerActive, setIsPickerActive] = useState(false);
  
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  const handleFileUpload = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    setPickedColors([]);
  }, []);

  const handleImageClick = useCallback((e) => {
    if (!isPickerActive || !canvasRef.current || !imageRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const pixel = ctx.getImageData(x * scaleX, y * scaleY, 1, 1).data;
    const hex = `#${[pixel[0], pixel[1], pixel[2]].map(x => x.toString(16).padStart(2, '0')).join('')}`;
    
    setPickedColors(prev => [...prev.slice(-9), hex]);
    setSelectedColor(hex);
  }, [isPickerActive]);

  const handleImageLoad = useCallback((e) => {
    const img = e.target;
    const canvas = canvasRef.current;
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
  }, []);

  const copyColor = (color, format) => {
    let text = color;
    if (format === 'rgb') {
      const rgb = hexToRgb(color);
      text = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    } else if (format === 'hsl') {
      const rgb = hexToRgb(color);
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      text = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
    }
    navigator.clipboard.writeText(text);
    setCopied(color + format);
    setTimeout(() => setCopied(null), 1500);
  };

  const palette = generatePalette(selectedColor, paletteType);
  const rgb = hexToRgb(selectedColor);
  const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : { h: 0, s: 0, l: 0 };

  return (
    <div className="p-4 md:p-6 w-full min-h-screen" style={{ backgroundColor: theme.bg, fontFamily: FONTS.body }}>
      <div className="mb-6">
        <h1 className="text-xl md:text-3xl font-bold mb-1 flex items-center gap-2" style={{ color: theme.text, fontFamily: FONTS.heading }}>
          <Palette className="size-5 md:size-8 shrink-0" style={{ color: BRAND.blue }} />
          Color Picker
        </h1>
        <p className="text-xs md:text-sm text-muted-foreground">Pick colors from images and generate palettes</p>
      </div>

      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
        {/* Image Picker */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <Label className="font-medium" style={{ color: theme.text }}>Color Picker</Label>
              <Button variant={isPickerActive ? "default" : "outline"} size="sm" onClick={() => setIsPickerActive(!isPickerActive)}
                style={isPickerActive ? { backgroundColor: BRAND.blue } : {}}>
                <Eyedropper className="size-4 mr-2" />{isPickerActive ? 'Active' : 'Pick Color'}
              </Button>
            </div>

            {!imageUrl ? (
              <div className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:border-primary hover:bg-primary/5"
                onClick={() => fileInputRef.current?.click()}>
                <UploadSimple className="size-10 mx-auto mb-3 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Upload image to pick colors</p>
              </div>
            ) : (
              <div className="relative">
                <img ref={imageRef} src={imageUrl} alt="Pick colors" onLoad={handleImageLoad} onClick={handleImageClick}
                  className={cn("w-full rounded-lg", isPickerActive && "cursor-crosshair")} style={{ maxHeight: '300px', objectFit: 'contain' }} />
                <canvas ref={canvasRef} className="hidden" />
                <Button variant="outline" size="sm" className="absolute top-2 right-2" onClick={() => { setImageUrl(null); setPickedColors([]); }}>
                  <Trash className="size-4" />
                </Button>
              </div>
            )}

            <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => handleFileUpload(e.target.files?.[0])} className="hidden" />

            {pickedColors.length > 0 && (
              <div className="mt-4">
                <Label className="text-sm mb-2 block">Picked Colors</Label>
                <div className="flex flex-wrap gap-2">
                  {pickedColors.map((color, i) => (
                    <button key={i} className="size-10 rounded-lg border-2 shadow-sm hover:scale-110 transition-transform"
                      style={{ backgroundColor: color, borderColor: color === selectedColor ? BRAND.blue : 'transparent' }}
                      onClick={() => setSelectedColor(color)} title={color} />
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Color Details & Palette */}
        <div className="space-y-4">
          {/* Selected Color */}
          <Card>
            <CardContent className="p-4">
              <Label className="font-medium mb-3 block" style={{ color: theme.text }}>Selected Color</Label>
              <div className="flex gap-4">
                <div className="size-24 rounded-xl shadow-lg" style={{ backgroundColor: selectedColor }} />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <input type="color" value={selectedColor} onChange={(e) => setSelectedColor(e.target.value)} className="size-8 rounded cursor-pointer" />
                    <input type="text" value={selectedColor.toUpperCase()} onChange={(e) => setSelectedColor(e.target.value)}
                      className="flex-1 h-8 px-2 text-sm font-mono border rounded" style={{ borderColor: theme.cardBorder }} />
                    <Button size="icon" variant="ghost" className="size-8" onClick={() => copyColor(selectedColor, 'hex')}>
                      {copied === selectedColor + 'hex' ? <Check className="size-4 text-green-500" /> : <Copy className="size-4" />}
                    </Button>
                  </div>
                  <div className="text-xs space-y-1 text-muted-foreground">
                    <div className="flex justify-between cursor-pointer hover:text-foreground" onClick={() => copyColor(selectedColor, 'rgb')}>
                      <span>RGB: {rgb?.r}, {rgb?.g}, {rgb?.b}</span>
                      {copied === selectedColor + 'rgb' && <Check className="size-3 text-green-500" />}
                    </div>
                    <div className="flex justify-between cursor-pointer hover:text-foreground" onClick={() => copyColor(selectedColor, 'hsl')}>
                      <span>HSL: {hsl.h}°, {hsl.s}%, {hsl.l}%</span>
                      {copied === selectedColor + 'hsl' && <Check className="size-3 text-green-500" />}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Palette Generator */}
          <Card>
            <CardContent className="p-4">
              <Label className="font-medium mb-3 block" style={{ color: theme.text }}>Generate Palette</Label>
              <div className="flex flex-wrap gap-2 mb-4">
                {['analogous', 'complementary', 'triadic', 'split', 'shades'].map(type => (
                  <Button key={type} variant={paletteType === type ? "default" : "outline"} size="sm" onClick={() => setPaletteType(type)}
                    className="capitalize" style={paletteType === type ? { backgroundColor: BRAND.blue } : {}}>
                    {type}
                  </Button>
                ))}
              </div>
              <div className="flex gap-2">
                {palette.map((color, i) => (
                  <div key={i} className="flex-1 text-center">
                    <button className="w-full aspect-square rounded-lg shadow-sm hover:scale-105 transition-transform border"
                      style={{ backgroundColor: color }} onClick={() => { setSelectedColor(color); copyColor(color, 'hex'); }} title={color} />
                    <p className="text-[10px] font-mono mt-1 text-muted-foreground">{color.toUpperCase()}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;
