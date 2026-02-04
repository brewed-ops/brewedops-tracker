// PDFEditor.jsx - Full-featured PDF Editor for BrewedOps
// Mobile detection, clear all modal, proper dialogs
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, Download, Save, Trash2, Type, Square, Circle, Minus, PenTool, MousePointer, RotateCcw, RotateCw, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, AlertTriangle, Clock, Bold, Italic, Underline, Palette, FileText, Loader2, CheckCircle, ArrowRight, Monitor, Smartphone, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/Badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { getTheme } from '../lib/theme';

const BRAND = { brown: '#3F200C', blue: '#004AAC', green: '#51AF43', cream: '#FFF0D4' };
const FONTS = [{ id: 'Arial', name: 'Arial' }, { id: 'Helvetica', name: 'Helvetica' }, { id: 'Times New Roman', name: 'Times New Roman' }, { id: 'Courier New', name: 'Courier New' }, { id: 'Georgia', name: 'Georgia' }, { id: 'Verdana', name: 'Verdana' }];
const FONT_SIZES = [12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 64, 72];
const COLORS = ['#000000', '#ffffff', '#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#6b7280', '#004AAC', '#3F200C'];
const STROKE_WIDTHS = [1, 2, 3, 4, 5, 8, 10];
const TOOLS = { SELECT: 'select', TEXT: 'text', RECTANGLE: 'rectangle', CIRCLE: 'circle', LINE: 'line', ARROW: 'arrow', CHECKMARK: 'checkmark', DRAW: 'draw', HIGHLIGHT: 'highlight' };
const MOBILE_BREAKPOINT = 768;
const generateId = () => Math.random().toString(36).substring(2, 15);

const loadPdfJs = () => new Promise((resolve, reject) => {
  if (window.pdfjsLib) { resolve(window.pdfjsLib); return; }
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
  script.onload = () => { window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'; resolve(window.pdfjsLib); };
  script.onerror = reject;
  document.head.appendChild(script);
});

const ToolButton = ({ icon: Icon, label, isActive, onClick, disabled }) => (
  <TooltipProvider delayDuration={200}><Tooltip><TooltipTrigger asChild>
    <Button variant={isActive ? "default" : "ghost"} size="icon" onClick={onClick} disabled={disabled} className={cn("size-9", isActive && "bg-primary text-primary-foreground")}><Icon className="size-4" /></Button>
  </TooltipTrigger><TooltipContent><p>{label}</p></TooltipContent></Tooltip></TooltipProvider>
);

const ColorPicker = ({ value, onChange, label }) => (
  <div className="space-y-2">
    <Label className="text-xs">{label}</Label>
    <div className="flex flex-wrap gap-1">
      {COLORS.map(color => <button key={color} onClick={() => onChange(color)} className={cn("size-6 rounded border-2 transition-all", value === color ? "border-primary scale-110" : "border-muted hover:scale-105")} style={{ backgroundColor: color }} />)}
    </div>
  </div>
);

const ExpiryTimer = ({ expiryTime, onExpired }) => {
  const [timeLeft, setTimeLeft] = useState(null);
  useEffect(() => {
    if (!expiryTime) return;
    const update = () => { const r = Math.max(0, expiryTime - Date.now()); setTimeLeft(r); if (r === 0) onExpired(); };
    update();
    const i = setInterval(update, 1000);
    return () => clearInterval(i);
  }, [expiryTime, onExpired]);
  if (!timeLeft) return null;
  return <Badge variant="outline" className={cn("gap-1.5 font-mono", timeLeft < 60000 ? "border-destructive text-destructive animate-pulse" : "border-amber-500 text-amber-500")}><Clock className="size-3" />{String(Math.floor(timeLeft / 60000)).padStart(2, '0')}:{String(Math.floor((timeLeft % 60000) / 1000)).padStart(2, '0')}</Badge>;
};

const CheckmarkIcon = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>;

// Mobile Warning Screen Component
const MobileWarningScreen = ({ isDark }) => {
  const theme = getTheme(isDark);
  
  return (
    <div className="p-4 md:p-6 w-full min-h-screen flex flex-col" style={{ backgroundColor: theme.bg }}>
      <div className="mb-6">
        <h1 className="text-xl font-bold flex items-center gap-2" style={{ color: theme.text }}>
          <FileText className="size-5" style={{ color: BRAND.blue }} />
          PDF Editor
        </h1>
      </div>
      
      <Card className="max-w-md mx-auto mt-8">
        <CardContent className="p-8 text-center">
          <div className="size-20 rounded-full mx-auto mb-6 flex items-center justify-center bg-amber-500/15">
            <Smartphone className="size-10 text-amber-500" />
          </div>
          
          <h2 className="text-xl font-bold mb-3" style={{ color: theme.text }}>
            Desktop Required
          </h2>
          
          <p className="text-muted-foreground mb-6">
            The PDF Editor is optimized for desktop use and requires a larger screen for the best editing experience.
          </p>
          
          <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 mb-6">
            <div className="flex items-start gap-3 text-left">
              <Monitor className="size-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-500">For the best experience</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Please access the PDF Editor from a desktop or laptop computer with a screen width of at least 768 pixels.
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">
              Features like drag, resize, and precise annotations require mouse input and more screen space.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Mobile Warning Popup Component
const MobileWarningPopup = ({ isOpen, onClose }) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <AlertTriangle className="size-5 text-amber-500" />
          Not Optimized for Mobile
        </DialogTitle>
        <DialogDescription>
          This editor works best on desktop devices.
        </DialogDescription>
      </DialogHeader>
      <div className="py-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="size-12 rounded-full flex items-center justify-center bg-amber-500/15 flex-shrink-0">
            <Smartphone className="size-6 text-amber-500" />
          </div>
          <div>
            <p className="text-sm font-medium">Limited Mobile Support</p>
            <p className="text-xs text-muted-foreground mt-1">
              Some features like drag, resize, and precise text placement may not work correctly on touch devices.
            </p>
          </div>
        </div>
        
        <div className="p-3 rounded-lg bg-muted/50 text-xs text-muted-foreground">
          <p className="font-medium mb-1">Recommended:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Use a desktop or laptop computer</li>
            <li>Minimum screen width: 768px</li>
            <li>Use a mouse for precise control</li>
          </ul>
        </div>
      </div>
      <DialogFooter>
        <Button onClick={onClose} style={{ backgroundColor: BRAND.blue }} className="w-full sm:w-auto">
          I Understand
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

// Clear All Confirmation Modal
const ClearAllModal = ({ isOpen, onClose, onConfirm }) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Trash2 className="size-5 text-destructive" />
          Clear All Annotations
        </DialogTitle>
        <DialogDescription>
          This action cannot be undone.
        </DialogDescription>
      </DialogHeader>
      <div className="py-4">
        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
          <p className="text-sm">
            Are you sure you want to delete <strong>all annotations</strong> on this page? 
            This will remove all text, shapes, drawings, and other elements you've added.
          </p>
        </div>
      </div>
      <DialogFooter className="gap-2 sm:gap-0">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="destructive" onClick={onConfirm}>
          <Trash2 className="size-4 mr-2" />
          Clear All
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

const PDFEditor = ({ isDark }) => {
  const theme = getTheme(isDark);
  const [pdfJs, setPdfJs] = useState(null);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageRendering, setPageRendering] = useState(false);
  const [activeTool, setActiveTool] = useState(TOOLS.SELECT);
  const [annotations, setAnnotations] = useState({});
  const [selectedId, setSelectedId] = useState(null);
  const [editingTextId, setEditingTextId] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingPath, setDrawingPath] = useState([]);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [zoom, setZoom] = useState(1);
  const [loading, setLoading] = useState(true);
  const [savedPdfUrl, setSavedPdfUrl] = useState(null);
  const [expiryTime, setExpiryTime] = useState(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [showMobileWarning, setShowMobileWarning] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [textSettings, setTextSettings] = useState({ fontFamily: 'Arial', fontSize: 24, fontColor: '#000000', bold: false, italic: false, underline: false });
  const [shapeSettings, setShapeSettings] = useState({ strokeColor: '#22c55e', fillColor: 'transparent', strokeWidth: 3 });

  const interactionRef = useRef({
    isDragging: false,
    isResizing: false,
    resizeHandle: null,
    startX: 0,
    startY: 0,
    startAnnotation: null,
  });

  const pdfCanvasRef = useRef(null);
  const annotationCanvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const textInputRef = useRef(null);

  const currentAnnotations = annotations[currentPage] || [];
  const selectedAnnotation = currentAnnotations.find(a => a.id === selectedId);
  const editingAnnotation = currentAnnotations.find(a => a.id === editingTextId);

  // Check for mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < MOBILE_BREAKPOINT;
      setIsMobile(mobile);
      // Show warning popup if user switches to mobile while editing
      if (mobile && pdfFile && !showMobileWarning) {
        setShowMobileWarning(true);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [pdfFile, showMobileWarning]);

  useEffect(() => { loadPdfJs().then(lib => { setPdfJs(lib); setLoading(false); }).catch(() => setLoading(false)); }, []);
  
  useEffect(() => { 
    if (editingTextId && textInputRef.current) { 
      setTimeout(() => {
        textInputRef.current?.focus(); 
        textInputRef.current?.select(); 
      }, 50);
    } 
  }, [editingTextId]);

  const renderPage = useCallback(async (pageNum) => {
    if (!pdfDoc || !pdfCanvasRef.current) return;
    setPageRendering(true);
    try {
      const page = await pdfDoc.getPage(pageNum);
      const viewport = page.getViewport({ scale: zoom * 1.5 });
      pdfCanvasRef.current.height = viewport.height;
      pdfCanvasRef.current.width = viewport.width;
      if (annotationCanvasRef.current) { 
        annotationCanvasRef.current.height = viewport.height; 
        annotationCanvasRef.current.width = viewport.width; 
      }
      await page.render({ canvasContext: pdfCanvasRef.current.getContext('2d'), viewport }).promise;
      setPageRendering(false);
    } catch (e) { console.error(e); setPageRendering(false); }
  }, [pdfDoc, zoom]);

  useEffect(() => { if (pdfDoc && currentPage) renderPage(currentPage); }, [pdfDoc, currentPage, zoom, renderPage]);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !pdfJs || file.type !== 'application/pdf') return;
    setPdfFile(file); setLoading(true); setPdfDoc(null);
    try {
      const doc = await pdfJs.getDocument({ data: await file.arrayBuffer() }).promise;
      setNumPages(doc.numPages); setCurrentPage(1); setAnnotations({}); setHistory([]); setHistoryIndex(-1); setSavedPdfUrl(null); setExpiryTime(null); setLoading(false);
      setTimeout(() => setPdfDoc(doc), 50);
    } catch (e) { console.error(e); setLoading(false); }
  };

  const saveToHistory = useCallback((newAnnotations) => { 
    setHistory(prev => {
      const h = prev.slice(0, historyIndex + 1); 
      h.push(JSON.stringify(newAnnotations)); 
      return h;
    });
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

  const undo = () => { 
    if (historyIndex > 0) { 
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex); 
      setAnnotations(JSON.parse(history[newIndex])); 
      setSelectedId(null); 
      setEditingTextId(null); 
    } 
  };
  
  const redo = () => { 
    if (historyIndex < history.length - 1) { 
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex); 
      setAnnotations(JSON.parse(history[newIndex])); 
    } 
  };
  
  const addAnnotation = useCallback((a) => { 
    setAnnotations(prev => {
      const newAnnotations = { ...prev, [currentPage]: [...(prev[currentPage] || []), a] };
      setTimeout(() => saveToHistory(newAnnotations), 0);
      return newAnnotations;
    });
    setSelectedId(a.id); 
  }, [currentPage, saveToHistory]);
  
  const updateAnnotation = useCallback((id, updates) => {
    setAnnotations(prev => ({
      ...prev,
      [currentPage]: (prev[currentPage] || []).map(a => a.id === id ? { ...a, ...updates } : a)
    }));
  }, [currentPage]);

  const commitToHistory = useCallback(() => {
    setAnnotations(prev => {
      saveToHistory(prev);
      return prev;
    });
  }, [saveToHistory]);
  
  const deleteAnnotation = useCallback((id) => { 
    setAnnotations(prev => {
      const newAnnotations = { ...prev, [currentPage]: (prev[currentPage] || []).filter(a => a.id !== id) };
      setTimeout(() => saveToHistory(newAnnotations), 0);
      return newAnnotations;
    });
    setSelectedId(null); 
    setEditingTextId(null); 
  }, [currentPage, saveToHistory]);

  const handleClearAll = () => {
    const newAnnotations = { ...annotations, [currentPage]: [] };
    setAnnotations(newAnnotations);
    saveToHistory(newAnnotations);
    setSelectedId(null);
    setEditingTextId(null);
    setShowClearDialog(false);
  };

  const getBounds = useCallback((a) => {
    if (!a) return null;
    const s = 1.5;
    switch (a.type) {
      case 'text':
        const textWidth = Math.max(120, (a.text || 'Type here').length * a.fontSize * 0.6 * s);
        return { x: a.x, y: a.y - a.fontSize * s, w: textWidth, h: a.fontSize * s + 10 };
      case 'rectangle':
        return { x: a.x, y: a.y, w: a.width, h: a.height };
      case 'circle':
        return { x: a.x - a.radius, y: a.y - a.radius, w: a.radius * 2, h: a.radius * 2 };
      case 'checkmark':
        return { x: a.x, y: a.y, w: a.size, h: a.size };
      case 'line':
      case 'arrow':
        const minX = Math.min(a.x1, a.x2);
        const minY = Math.min(a.y1, a.y2);
        const maxX = Math.max(a.x1, a.x2);
        const maxY = Math.max(a.y1, a.y2);
        return { x: minX - 10, y: minY - 10, w: maxX - minX + 20, h: maxY - minY + 20 };
      case 'draw':
      case 'highlight':
        if (!a.path || a.path.length === 0) return null;
        const xs = a.path.map(p => p.x);
        const ys = a.path.map(p => p.y);
        return { x: Math.min(...xs) - 10, y: Math.min(...ys) - 10, w: Math.max(...xs) - Math.min(...xs) + 20, h: Math.max(...ys) - Math.min(...ys) + 20 };
      default:
        return null;
    }
  }, []);
  
  const hitTest = useCallback((x, y, a) => { 
    const b = getBounds(a); 
    if (!b) return false;
    return x >= b.x - 10 && x <= b.x + b.w + 10 && y >= b.y - 10 && y <= b.y + b.h + 10; 
  }, [getBounds]);
  
  const getResizeHandle = useCallback((x, y, a) => {
    const b = getBounds(a); 
    if (!b) return null;
    const hs = 18;
    
    if (a.type === 'text') { 
      if (x >= b.x + b.w - 5 && x <= b.x + b.w + 15 && y >= b.y - 5 && y <= b.y + b.h + 5) return 'e'; 
      return null; 
    }
    
    const corners = [
      { name: 'nw', cx: b.x, cy: b.y },
      { name: 'ne', cx: b.x + b.w, cy: b.y },
      { name: 'sw', cx: b.x, cy: b.y + b.h },
      { name: 'se', cx: b.x + b.w, cy: b.y + b.h },
    ];
    
    for (const corner of corners) {
      if (Math.abs(x - corner.cx) < hs && Math.abs(y - corner.cy) < hs) {
        return corner.name;
      }
    }
    return null;
  }, [getBounds]);
  
  const getCoords = useCallback((e) => { 
    const c = annotationCanvasRef.current; 
    if (!c) return { x: 0, y: 0 }; 
    const r = c.getBoundingClientRect(); 
    return { 
      x: (e.clientX - r.left) * (c.width / r.width), 
      y: (e.clientY - r.top) * (c.height / r.height) 
    }; 
  }, []);

  const handleMouseDown = (e) => {
    if (editingTextId) return;
    
    const { x, y } = getCoords(e);
    const currentAnns = annotations[currentPage] || [];
    const selected = currentAnns.find(a => a.id === selectedId);
    
    if (activeTool === TOOLS.SELECT) {
      if (selected) { 
        const handle = getResizeHandle(x, y, selected); 
        if (handle) { 
          e.preventDefault();
          e.stopPropagation();
          interactionRef.current = {
            isResizing: true,
            isDragging: false,
            resizeHandle: handle,
            startX: x,
            startY: y,
            startAnnotation: { ...selected },
          };
          return; 
        } 
      }
      
      const clicked = [...currentAnns].reverse().find(a => hitTest(x, y, a));
      if (clicked) {
        e.preventDefault();
        e.stopPropagation();
        setSelectedId(clicked.id);
        interactionRef.current = {
          isDragging: true,
          isResizing: false,
          resizeHandle: null,
          startX: x,
          startY: y,
          startAnnotation: { ...clicked },
        };
      } else {
        setSelectedId(null);
        interactionRef.current = { isDragging: false, isResizing: false, resizeHandle: null, startX: 0, startY: 0, startAnnotation: null };
      }
      return;
    }
    
    if (activeTool === TOOLS.TEXT) { 
      e.preventDefault();
      const nt = { id: generateId(), type: 'text', x, y, text: '', ...textSettings }; 
      addAnnotation(nt); 
      setEditingTextId(nt.id); 
      setActiveTool(TOOLS.SELECT); 
      return; 
    }
    
    if (activeTool === TOOLS.CHECKMARK) { 
      e.preventDefault();
      addAnnotation({ id: generateId(), type: 'checkmark', x, y, size: 50, strokeColor: shapeSettings.strokeColor, strokeWidth: shapeSettings.strokeWidth }); 
      return; 
    }
    
    if ([TOOLS.DRAW, TOOLS.HIGHLIGHT, TOOLS.RECTANGLE, TOOLS.CIRCLE, TOOLS.LINE, TOOLS.ARROW].includes(activeTool)) { 
      e.preventDefault();
      setIsDrawing(true); 
      setDrawingPath([{ x, y }]); 
    }
  };

  const handleMouseMove = (e) => {
    const { x, y } = getCoords(e);
    const c = annotationCanvasRef.current;
    const interaction = interactionRef.current;
    const currentAnns = annotations[currentPage] || [];
    const selected = currentAnns.find(a => a.id === selectedId);
    
    if (c && activeTool === TOOLS.SELECT && !interaction.isDragging && !interaction.isResizing) {
      let cursor = 'default';
      if (selected) { 
        const handle = getResizeHandle(x, y, selected); 
        if (handle) {
          if (handle === 'e') cursor = 'ew-resize';
          else if (handle === 'nw' || handle === 'se') cursor = 'nwse-resize';
          else cursor = 'nesw-resize';
        } else if (hitTest(x, y, selected)) {
          cursor = 'move';
        }
      } else {
        const hovered = currentAnns.find(a => hitTest(x, y, a));
        if (hovered) cursor = 'pointer';
      }
      c.style.cursor = cursor;
    }
    
    if (interaction.isDragging && interaction.startAnnotation) {
      const dx = x - interaction.startX;
      const dy = y - interaction.startY;
      const start = interaction.startAnnotation;
      
      if (start.type === 'line' || start.type === 'arrow') {
        updateAnnotation(start.id, { x1: start.x1 + dx, y1: start.y1 + dy, x2: start.x2 + dx, y2: start.y2 + dy });
      } else if (start.type === 'draw' || start.type === 'highlight') {
        const newPath = start.path.map(p => ({ x: p.x + dx, y: p.y + dy }));
        updateAnnotation(start.id, { path: newPath });
      } else if (start.type === 'circle') {
        updateAnnotation(start.id, { x: start.x + dx, y: start.y + dy });
      } else {
        updateAnnotation(start.id, { x: start.x + dx, y: start.y + dy });
      }
      return;
    }
    
    if (interaction.isResizing && interaction.startAnnotation && interaction.resizeHandle) {
      const dx = x - interaction.startX;
      const dy = y - interaction.startY;
      const start = interaction.startAnnotation;
      const handle = interaction.resizeHandle;
      
      if (start.type === 'text') {
        const newSize = Math.max(12, Math.min(72, start.fontSize + dx * 0.5));
        updateAnnotation(start.id, { fontSize: Math.round(newSize) });
      } else if (start.type === 'rectangle') {
        let updates = {};
        if (handle === 'se') updates = { width: Math.max(20, start.width + dx), height: Math.max(20, start.height + dy) };
        else if (handle === 'sw') updates = { x: start.x + dx, width: Math.max(20, start.width - dx), height: Math.max(20, start.height + dy) };
        else if (handle === 'ne') updates = { y: start.y + dy, width: Math.max(20, start.width + dx), height: Math.max(20, start.height - dy) };
        else if (handle === 'nw') updates = { x: start.x + dx, y: start.y + dy, width: Math.max(20, start.width - dx), height: Math.max(20, start.height - dy) };
        updateAnnotation(start.id, updates);
      } else if (start.type === 'circle') {
        updateAnnotation(start.id, { radius: Math.max(10, start.radius + (dx + dy) * 0.5) });
      } else if (start.type === 'checkmark') {
        updateAnnotation(start.id, { size: Math.max(20, start.size + (dx + dy) * 0.5) });
      }
      
      interactionRef.current.startX = x;
      interactionRef.current.startY = y;
      interactionRef.current.startAnnotation = { ...currentAnns.find(a => a.id === start.id) };
      return;
    }
    
    if (isDrawing) setDrawingPath(p => [...p, { x, y }]);
  };

  const handleMouseUp = (e) => {
    const { x, y } = getCoords(e);
    const interaction = interactionRef.current;
    
    if (interaction.isDragging || interaction.isResizing) { 
      interactionRef.current = { isDragging: false, isResizing: false, resizeHandle: null, startX: 0, startY: 0, startAnnotation: null };
      commitToHistory();
      return; 
    }
    
    if (!isDrawing) return;
    setIsDrawing(false);
    
    const s = drawingPath[0]; 
    if (!s) return;
    
    if (activeTool === TOOLS.DRAW) addAnnotation({ id: generateId(), type: 'draw', path: [...drawingPath], strokeColor: shapeSettings.strokeColor, strokeWidth: shapeSettings.strokeWidth });
    else if (activeTool === TOOLS.HIGHLIGHT) addAnnotation({ id: generateId(), type: 'highlight', path: [...drawingPath], strokeColor: '#ffeb3b', strokeWidth: 20, opacity: 0.4 });
    else if (activeTool === TOOLS.RECTANGLE) addAnnotation({ id: generateId(), type: 'rectangle', x: Math.min(s.x, x), y: Math.min(s.y, y), width: Math.abs(x - s.x) || 60, height: Math.abs(y - s.y) || 40, ...shapeSettings });
    else if (activeTool === TOOLS.CIRCLE) addAnnotation({ id: generateId(), type: 'circle', x: s.x, y: s.y, radius: Math.sqrt((x - s.x) ** 2 + (y - s.y) ** 2) || 30, ...shapeSettings });
    else if (activeTool === TOOLS.LINE) addAnnotation({ id: generateId(), type: 'line', x1: s.x, y1: s.y, x2: x, y2: y, ...shapeSettings });
    else if (activeTool === TOOLS.ARROW) addAnnotation({ id: generateId(), type: 'arrow', x1: s.x, y1: s.y, x2: x, y2: y, ...shapeSettings });
    setDrawingPath([]);
  };

  const handleDoubleClick = (e) => {
    if (activeTool !== TOOLS.SELECT) return;
    const { x, y } = getCoords(e);
    const currentAnns = annotations[currentPage] || [];
    const clicked = [...currentAnns].reverse().find(a => hitTest(x, y, a));
    if (clicked && clicked.type === 'text') {
      setEditingTextId(clicked.id);
      setSelectedId(clicked.id);
    }
  };

  const handleTextChange = (e) => { if (editingTextId) updateAnnotation(editingTextId, { text: e.target.value }); };
  
  const handleTextKeyDown = (e) => { 
    if (e.key === 'Escape') { setEditingTextId(null); commitToHistory(); }
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); setEditingTextId(null); commitToHistory(); }
  };
  
  const handleTextBlur = () => {
    setTimeout(() => {
      if (editingTextId) {
        const currentAnns = annotations[currentPage] || [];
        const ann = currentAnns.find(a => a.id === editingTextId);
        if (ann && ann.text === '') deleteAnnotation(editingTextId);
        else { setEditingTextId(null); commitToHistory(); }
      }
    }, 100);
  };

  const renderAnnotations = useCallback(() => {
    const c = annotationCanvasRef.current; 
    if (!c) return;
    const ctx = c.getContext('2d'); 
    ctx.clearRect(0, 0, c.width, c.height);
    const sc = 1.5;
    const currentAnns = annotations[currentPage] || [];
    
    currentAnns.forEach(a => {
      if (a.type === 'text' && a.id === editingTextId) return;
      
      ctx.save();
      
      if (a.type === 'text') { 
        ctx.font = `${a.italic ? 'italic ' : ''}${a.bold ? 'bold ' : ''}${a.fontSize * sc}px ${a.fontFamily}`; 
        ctx.fillStyle = a.fontColor; 
        ctx.fillText(a.text || 'Type here', a.x, a.y); 
        if (a.underline) { 
          const w = ctx.measureText(a.text || 'Type here').width; 
          ctx.beginPath(); ctx.moveTo(a.x, a.y + 3); ctx.lineTo(a.x + w, a.y + 3); 
          ctx.strokeStyle = a.fontColor; ctx.lineWidth = 1; ctx.stroke(); 
        } 
      }
      
      if (a.type === 'rectangle') { 
        if (a.fillColor && a.fillColor !== 'transparent') { ctx.fillStyle = a.fillColor; ctx.fillRect(a.x, a.y, a.width, a.height); } 
        ctx.strokeStyle = a.strokeColor; ctx.lineWidth = a.strokeWidth; ctx.strokeRect(a.x, a.y, a.width, a.height); 
      }
      
      if (a.type === 'circle') { 
        ctx.beginPath(); ctx.arc(a.x, a.y, a.radius, 0, Math.PI * 2); 
        if (a.fillColor && a.fillColor !== 'transparent') { ctx.fillStyle = a.fillColor; ctx.fill(); } 
        ctx.strokeStyle = a.strokeColor; ctx.lineWidth = a.strokeWidth; ctx.stroke(); 
      }
      
      if (a.type === 'line') { ctx.beginPath(); ctx.moveTo(a.x1, a.y1); ctx.lineTo(a.x2, a.y2); ctx.strokeStyle = a.strokeColor; ctx.lineWidth = a.strokeWidth; ctx.lineCap = 'round'; ctx.stroke(); }
      
      if (a.type === 'arrow') { 
        ctx.beginPath(); ctx.moveTo(a.x1, a.y1); ctx.lineTo(a.x2, a.y2); ctx.strokeStyle = a.strokeColor; ctx.lineWidth = a.strokeWidth; ctx.lineCap = 'round'; ctx.stroke(); 
        const ang = Math.atan2(a.y2 - a.y1, a.x2 - a.x1), len = 15; 
        ctx.beginPath(); ctx.moveTo(a.x2, a.y2); ctx.lineTo(a.x2 - len * Math.cos(ang - Math.PI / 6), a.y2 - len * Math.sin(ang - Math.PI / 6)); ctx.lineTo(a.x2 - len * Math.cos(ang + Math.PI / 6), a.y2 - len * Math.sin(ang + Math.PI / 6)); ctx.closePath(); ctx.fillStyle = a.strokeColor; ctx.fill(); 
      }
      
      if (a.type === 'checkmark') { 
        const sz = a.size || 50; ctx.strokeStyle = a.strokeColor; ctx.lineWidth = a.strokeWidth || 4; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; 
        ctx.beginPath(); ctx.moveTo(a.x, a.y + sz * 0.5); ctx.lineTo(a.x + sz * 0.35, a.y + sz * 0.85); ctx.lineTo(a.x + sz, a.y + sz * 0.1); ctx.stroke(); 
      }
      
      if (a.type === 'draw' || a.type === 'highlight') { 
        if (a.path?.length > 1) { 
          ctx.beginPath(); ctx.moveTo(a.path[0].x, a.path[0].y); a.path.forEach(p => ctx.lineTo(p.x, p.y)); 
          ctx.strokeStyle = a.strokeColor; ctx.lineWidth = a.strokeWidth; ctx.lineCap = 'round'; 
          if (a.opacity) ctx.globalAlpha = a.opacity; ctx.stroke(); 
        } 
      }
      
      if (a.id === selectedId && a.id !== editingTextId) { 
        const b = getBounds(a); 
        if (b) { 
          ctx.strokeStyle = BRAND.blue; ctx.lineWidth = 2; ctx.setLineDash([6, 4]); ctx.strokeRect(b.x - 4, b.y - 4, b.w + 8, b.h + 8); ctx.setLineDash([]); 
          ctx.fillStyle = BRAND.blue; const hs = 10; 
          if (a.type === 'text') ctx.fillRect(b.x + b.w + 2, b.y + b.h / 2 - hs / 2, hs, hs);
          else {
            ctx.fillRect(b.x - 4 - hs / 2, b.y - 4 - hs / 2, hs, hs);
            ctx.fillRect(b.x + b.w + 4 - hs / 2, b.y - 4 - hs / 2, hs, hs);
            ctx.fillRect(b.x - 4 - hs / 2, b.y + b.h + 4 - hs / 2, hs, hs);
            ctx.fillRect(b.x + b.w + 4 - hs / 2, b.y + b.h + 4 - hs / 2, hs, hs);
          }
        } 
      }
      
      ctx.restore();
    });
    
    if (isDrawing && drawingPath.length > 1) { 
      ctx.beginPath(); ctx.moveTo(drawingPath[0].x, drawingPath[0].y); drawingPath.forEach(p => ctx.lineTo(p.x, p.y)); 
      ctx.strokeStyle = activeTool === TOOLS.HIGHLIGHT ? '#ffeb3b' : shapeSettings.strokeColor; 
      ctx.lineWidth = activeTool === TOOLS.HIGHLIGHT ? 20 : shapeSettings.strokeWidth; 
      ctx.globalAlpha = activeTool === TOOLS.HIGHLIGHT ? 0.4 : 1; ctx.lineCap = 'round'; ctx.stroke(); 
    }
  }, [annotations, currentPage, selectedId, editingTextId, isDrawing, drawingPath, activeTool, shapeSettings, getBounds]);

  useEffect(() => { renderAnnotations(); }, [renderAnnotations]);

  const getTextEditorStyle = () => {
    if (!editingAnnotation || !annotationCanvasRef.current) return { display: 'none' };
    const c = annotationCanvasRef.current, r = c.getBoundingClientRect(), sx = r.width / c.width, sy = r.height / c.height, sc = 1.5;
    return { position: 'absolute', left: (editingAnnotation.x * sx) + 'px', top: ((editingAnnotation.y - editingAnnotation.fontSize * sc) * sy) + 'px', fontFamily: editingAnnotation.fontFamily, fontSize: (editingAnnotation.fontSize * sc * sy) + 'px', fontWeight: editingAnnotation.bold ? 'bold' : 'normal', fontStyle: editingAnnotation.italic ? 'italic' : 'normal', textDecoration: editingAnnotation.underline ? 'underline' : 'none', color: editingAnnotation.fontColor, background: 'white', border: `2px solid ${BRAND.blue}`, borderRadius: '4px', padding: '4px 8px', outline: 'none', minWidth: '100px', zIndex: 1000, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' };
  };

  const handleSave = async () => {
    setEditingTextId(null); 
    if (!pdfCanvasRef.current || !annotationCanvasRef.current) return; 
    setIsSaving(true); 
    await new Promise(r => setTimeout(r, 150));
    try { 
      const cb = document.createElement('canvas'); cb.width = pdfCanvasRef.current.width; cb.height = pdfCanvasRef.current.height; 
      const cx = cb.getContext('2d'); cx.drawImage(pdfCanvasRef.current, 0, 0); cx.drawImage(annotationCanvasRef.current, 0, 0); 
      const blob = await new Promise(r => cb.toBlob(r, 'image/png')); 
      setSavedPdfUrl(URL.createObjectURL(blob)); setExpiryTime(Date.now() + 15 * 60 * 1000); setShowSaveDialog(true); 
    } catch (e) { console.error(e); } finally { setIsSaving(false); }
  };
  
  const handleDownload = () => { if (!savedPdfUrl) return; const l = document.createElement('a'); l.href = savedPdfUrl; l.download = `edited_${pdfFile?.name?.replace('.pdf', '') || 'document'}_page${currentPage}.png`; l.click(); };
  const handleExpired = () => { setSavedPdfUrl(null); setExpiryTime(null); };
  const updateSelectedTextStyle = (u) => { if (selectedAnnotation?.type === 'text') { updateAnnotation(selectedId, u); commitToHistory(); } setTextSettings(prev => ({ ...prev, ...u })); };

  // Show mobile warning screen if on mobile and no file loaded
  if (isMobile && !pdfFile) {
    return <MobileWarningScreen isDark={isDark} />;
  }

  // Upload screen
  if (!pdfFile) return (
    <div className="p-4 md:p-6 w-full min-h-screen" style={{ backgroundColor: theme.bg }}>
      <div className="mb-6">
        <h1 className="text-xl md:text-3xl font-bold mb-1 flex items-center gap-2" style={{ color: theme.text }}>
          <FileText className="size-5 md:size-8 shrink-0" style={{ color: BRAND.blue }} />
          PDF Editor
        </h1>
        <p className="text-xs md:text-sm text-muted-foreground">Edit PDFs with text, shapes, and drawings</p>
      </div>
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-6 md:p-12">
          {loading ? (
            <div className="text-center py-12"><Loader2 className="size-12 animate-spin mx-auto mb-4" style={{ color: BRAND.blue }} /><p className="text-muted-foreground">Loading PDF Editor...</p></div>
          ) : (
            <>
              <div className="border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all hover:border-primary hover:bg-primary/5" onClick={() => fileInputRef.current?.click()}>
                <div className="size-20 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ backgroundColor: BRAND.blue + '15' }}><Upload className="size-10" style={{ color: BRAND.blue }} /></div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: theme.text }}>Upload PDF to Edit</h3>
                <p className="text-muted-foreground mb-4">Click to select a PDF file</p>
                <Button style={{ backgroundColor: BRAND.blue }}><FileText className="size-4 mr-2" />Select PDF</Button>
                <input ref={fileInputRef} type="file" accept=".pdf" onChange={handleFileUpload} className="hidden" />
              </div>
              <div className="mt-6 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <div className="flex gap-3">
                  <AlertTriangle className="size-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-500">Important Notice</p>
                    <p className="text-xs text-muted-foreground mt-1">After saving, download will be available for <strong>15 minutes</strong>.</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <div className="flex gap-3">
                  <Monitor className="size-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-500">Desktop Recommended</p>
                    <p className="text-xs text-muted-foreground mt-1">This editor is optimized for desktop use. Mobile devices may have limited functionality.</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );

  // Editor screen
  return (
    <div className="flex flex-col h-screen w-full overflow-hidden" style={{ backgroundColor: theme.bg }}>
      {/* Toolbar */}
      <div className="border-b p-2 flex flex-wrap items-center gap-2" style={{ backgroundColor: theme.cardBg, borderColor: theme.cardBorder }}>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => { setPdfFile(null); setPdfDoc(null); }}><Upload className="size-4 mr-1" />New</Button>
          <Button size="sm" onClick={handleSave} disabled={isSaving} style={{ backgroundColor: BRAND.green }}>{isSaving ? <Loader2 className="size-4 mr-1 animate-spin" /> : <Save className="size-4 mr-1" />}Save</Button>
          {savedPdfUrl && <Button variant="outline" size="sm" onClick={handleDownload}><Download className="size-4 mr-1" />Download</Button>}
        </div>
        <Separator orientation="vertical" className="h-6" />
        <div className="flex items-center gap-1">
          <ToolButton icon={MousePointer} label="Select / Move / Resize" isActive={activeTool === TOOLS.SELECT} onClick={() => setActiveTool(TOOLS.SELECT)} />
          <ToolButton icon={Type} label="Text" isActive={activeTool === TOOLS.TEXT} onClick={() => setActiveTool(TOOLS.TEXT)} />
          <ToolButton icon={PenTool} label="Draw" isActive={activeTool === TOOLS.DRAW} onClick={() => setActiveTool(TOOLS.DRAW)} />
          <ToolButton icon={Square} label="Rectangle" isActive={activeTool === TOOLS.RECTANGLE} onClick={() => setActiveTool(TOOLS.RECTANGLE)} />
          <ToolButton icon={Circle} label="Circle" isActive={activeTool === TOOLS.CIRCLE} onClick={() => setActiveTool(TOOLS.CIRCLE)} />
          <ToolButton icon={Minus} label="Line" isActive={activeTool === TOOLS.LINE} onClick={() => setActiveTool(TOOLS.LINE)} />
          <ToolButton icon={ArrowRight} label="Arrow" isActive={activeTool === TOOLS.ARROW} onClick={() => setActiveTool(TOOLS.ARROW)} />
          <TooltipProvider delayDuration={200}><Tooltip><TooltipTrigger asChild><Button variant={activeTool === TOOLS.CHECKMARK ? "default" : "ghost"} size="icon" onClick={() => setActiveTool(TOOLS.CHECKMARK)} className={cn("size-9", activeTool === TOOLS.CHECKMARK && "bg-primary text-primary-foreground")}><CheckmarkIcon className="size-4" /></Button></TooltipTrigger><TooltipContent><p>Checkmark</p></TooltipContent></Tooltip></TooltipProvider>
          <ToolButton icon={Palette} label="Highlight" isActive={activeTool === TOOLS.HIGHLIGHT} onClick={() => setActiveTool(TOOLS.HIGHLIGHT)} />
        </div>
        <Separator orientation="vertical" className="h-6" />
        <div className="flex items-center gap-1">
          <ToolButton icon={RotateCcw} label="Undo" onClick={undo} disabled={historyIndex <= 0} />
          <ToolButton icon={RotateCw} label="Redo" onClick={redo} disabled={historyIndex >= history.length - 1} />
          <Button variant="ghost" size="sm" onClick={() => setShowClearDialog(true)} disabled={currentAnnotations.length === 0}><Trash2 className="size-4 mr-1" />Clear</Button>
        </div>
        <Separator orientation="vertical" className="h-6" />
        <div className="flex items-center gap-1">
          <ToolButton icon={ZoomOut} label="Zoom Out" onClick={() => setZoom(z => Math.max(0.5, z - 0.25))} />
          <Badge variant="outline" className="min-w-[50px] justify-center">{Math.round(zoom * 100)}%</Badge>
          <ToolButton icon={ZoomIn} label="Zoom In" onClick={() => setZoom(z => Math.min(3, z + 0.25))} />
        </div>
        <Separator orientation="vertical" className="h-6" />
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="size-8" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage <= 1}><ChevronLeft className="size-4" /></Button>
          <span className="text-sm min-w-[60px] text-center">{currentPage} / {numPages}</span>
          <Button variant="ghost" size="icon" className="size-8" onClick={() => setCurrentPage(p => Math.min(numPages, p + 1))} disabled={currentPage >= numPages}><ChevronRight className="size-4" /></Button>
        </div>
        {expiryTime && (<><Separator orientation="vertical" className="h-6" /><div className="flex items-center gap-2"><span className="text-xs text-muted-foreground">Expires:</span><ExpiryTimer expiryTime={expiryTime} onExpired={handleExpired} /></div></>)}
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-56 border-r p-3 overflow-y-auto hidden md:block" style={{ backgroundColor: theme.cardBg, borderColor: theme.cardBorder }}>
          <ScrollArea className="h-full">
            {(activeTool === TOOLS.TEXT || selectedAnnotation?.type === 'text') && (
              <div className="space-y-3">
                <h3 className="font-semibold text-sm" style={{ color: theme.text }}>Text Settings</h3>
                <div className="space-y-2">
                  <Label className="text-xs">Font</Label>
                  <Select value={selectedAnnotation?.fontFamily || textSettings.fontFamily} onValueChange={v => updateSelectedTextStyle({ fontFamily: v })}><SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger><SelectContent>{FONTS.map(f => <SelectItem key={f.id} value={f.id}><span style={{ fontFamily: f.id }}>{f.name}</span></SelectItem>)}</SelectContent></Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Size</Label>
                  <Select value={String(selectedAnnotation?.fontSize || textSettings.fontSize)} onValueChange={v => updateSelectedTextStyle({ fontSize: Number(v) })}><SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger><SelectContent>{FONT_SIZES.map(s => <SelectItem key={s} value={String(s)}>{s}px</SelectItem>)}</SelectContent></Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Style</Label>
                  <div className="flex gap-1">
                    <Button variant={(selectedAnnotation?.bold ?? textSettings.bold) ? "default" : "outline"} size="icon" className="size-8" onClick={() => updateSelectedTextStyle({ bold: !(selectedAnnotation?.bold ?? textSettings.bold) })}><Bold className="size-3" /></Button>
                    <Button variant={(selectedAnnotation?.italic ?? textSettings.italic) ? "default" : "outline"} size="icon" className="size-8" onClick={() => updateSelectedTextStyle({ italic: !(selectedAnnotation?.italic ?? textSettings.italic) })}><Italic className="size-3" /></Button>
                    <Button variant={(selectedAnnotation?.underline ?? textSettings.underline) ? "default" : "outline"} size="icon" className="size-8" onClick={() => updateSelectedTextStyle({ underline: !(selectedAnnotation?.underline ?? textSettings.underline) })}><Underline className="size-3" /></Button>
                  </div>
                </div>
                <ColorPicker label="Color" value={selectedAnnotation?.fontColor || textSettings.fontColor} onChange={c => updateSelectedTextStyle({ fontColor: c })} />
              </div>
            )}
            
            {[TOOLS.RECTANGLE, TOOLS.CIRCLE, TOOLS.LINE, TOOLS.ARROW, TOOLS.DRAW, TOOLS.CHECKMARK].includes(activeTool) && (
              <div className="space-y-3">
                <h3 className="font-semibold text-sm" style={{ color: theme.text }}>Shape Settings</h3>
                <ColorPicker label="Stroke Color" value={shapeSettings.strokeColor} onChange={c => setShapeSettings(s => ({ ...s, strokeColor: c }))} />
                {[TOOLS.RECTANGLE, TOOLS.CIRCLE].includes(activeTool) && <ColorPicker label="Fill Color" value={shapeSettings.fillColor} onChange={c => setShapeSettings(s => ({ ...s, fillColor: c }))} />}
                <div className="space-y-2">
                  <Label className="text-xs">Stroke Width</Label>
                  <div className="flex flex-wrap gap-1">{STROKE_WIDTHS.map(w => <Button key={w} variant={shapeSettings.strokeWidth === w ? "default" : "outline"} size="sm" className="size-7 p-0 text-xs" onClick={() => setShapeSettings(s => ({ ...s, strokeWidth: w }))}>{w}</Button>)}</div>
                </div>
              </div>
            )}
            
            {selectedAnnotation && (
              <div className="space-y-3 mt-4 pt-4 border-t">
                <h3 className="font-semibold text-sm" style={{ color: theme.text }}>Selected: {selectedAnnotation.type}</h3>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• Drag to move</p>
                  <p>• Drag {selectedAnnotation.type === 'text' ? 'right handle' : 'corner handles'} to resize</p>
                  {selectedAnnotation.type === 'text' && <p>• Double-click to edit</p>}
                </div>
                <Button variant="destructive" size="sm" className="w-full" onClick={() => deleteAnnotation(selectedId)}><Trash2 className="size-3 mr-1" />Delete</Button>
              </div>
            )}
            
            <div className="mt-4 pt-4 border-t">
              <h3 className="font-semibold text-sm mb-2" style={{ color: theme.text }}>Tips</h3>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Text tool → click to add</li>
                <li>• Double-click text to edit</li>
                <li>• Click + drag to move</li>
                <li>• Drag handles to resize</li>
              </ul>
            </div>
          </ScrollArea>
        </div>

        {/* Canvas area */}
        <div className="flex-1 overflow-auto p-4 md:p-6 flex justify-center items-start" style={{ backgroundColor: isDark ? '#1a1a1b' : '#e5e5e5' }}>
          {loading ? (
            <div className="flex items-center justify-center h-full"><Loader2 className="size-8 animate-spin" style={{ color: BRAND.blue }} /></div>
          ) : (
            <div className="relative shadow-2xl bg-white" style={{ minWidth: 300, minHeight: 400 }}>
              {pageRendering && <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10"><Loader2 className="size-8 animate-spin" style={{ color: BRAND.blue }} /></div>}
              <canvas ref={pdfCanvasRef} style={{ display: 'block', maxWidth: '100%', height: 'auto' }} />
              <canvas ref={annotationCanvasRef} className="absolute top-0 left-0" style={{ cursor: activeTool === TOOLS.SELECT ? 'default' : 'crosshair', maxWidth: '100%', height: 'auto' }} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} onDoubleClick={handleDoubleClick} />
              {editingAnnotation && <input ref={textInputRef} type="text" value={editingAnnotation.text} onChange={handleTextChange} onKeyDown={handleTextKeyDown} onBlur={handleTextBlur} placeholder="Type here..." style={getTextEditorStyle()} />}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Warning Popup */}
      <MobileWarningPopup isOpen={showMobileWarning} onClose={() => setShowMobileWarning(false)} />

      {/* Clear All Modal */}
      <ClearAllModal isOpen={showClearDialog} onClose={() => setShowClearDialog(false)} onConfirm={handleClearAll} />

      {/* Save dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle className="flex items-center gap-2"><CheckCircle className="size-5" style={{ color: BRAND.green }} />Saved Successfully!</DialogTitle></DialogHeader>
          <div className="py-4">
            <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <div className="flex gap-3"><Clock className="size-5 text-amber-500 flex-shrink-0" /><div><p className="text-sm font-medium">15-Minute Download Window</p><p className="text-xs text-muted-foreground mt-1">Download now before it expires.</p></div></div>
            </div>
            {expiryTime && <div className="flex items-center justify-center gap-2 mt-4"><span className="text-sm text-muted-foreground">Time remaining:</span><ExpiryTimer expiryTime={expiryTime} onExpired={handleExpired} /></div>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSaveDialog(false)}>Close</Button>
            <Button onClick={handleDownload} style={{ backgroundColor: BRAND.blue }}><Download className="size-4 mr-2" />Download</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PDFEditor;
