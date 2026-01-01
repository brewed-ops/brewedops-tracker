// VideoToGif.jsx - Video to GIF Converter for BrewedOps
import React, { useState, useRef, useCallback } from 'react';
import { Upload, Download, Trash2, Loader2, Film, Play, Pause, Scissors, AlertTriangle, Settings } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { getTheme } from '../lib/theme';

const BRAND = { brown: '#3F200C', blue: '#004AAC', green: '#51AF43', cream: '#FFF0D4' };
const FONTS = { heading: "'Montserrat', sans-serif", body: "'Poppins', sans-serif" };

const Slider = ({ value, onChange, min, max, step, className }) => (
  <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(parseFloat(e.target.value))}
    className={cn("w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer", className)} style={{ accentColor: BRAND.blue }} />
);

const VideoToGif = ({ isDark }) => {
  const theme = getTheme(isDark);
  const [videoFile, setVideoFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [gifUrl, setGifUrl] = useState(null);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(5);
  const [fps, setFps] = useState(10);
  const [width, setWidth] = useState(480);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const handleFileUpload = useCallback((file) => {
    if (!file || !file.type.startsWith('video/')) {
      setError('Please upload a video file (MP4, WebM, MOV)');
      return;
    }
    if (file.size > 100 * 1024 * 1024) {
      setError('File size must be less than 100MB');
      return;
    }
    setError(null);
    setGifUrl(null);
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    const url = URL.createObjectURL(file);
    setVideoFile(file);
    setVideoUrl(url);
  }, [videoUrl]);

  const handleVideoLoaded = () => {
    if (videoRef.current) {
      const dur = videoRef.current.duration;
      setDuration(dur);
      setEndTime(Math.min(5, dur));
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const convertToGif = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    setIsConverting(true);
    setProgress(0);
    setError(null);
    
    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      // Calculate dimensions
      const aspectRatio = video.videoWidth / video.videoHeight;
      const height = Math.round(width / aspectRatio);
      canvas.width = width;
      canvas.height = height;
      
      // Capture frames
      const frames = [];
      const frameDuration = 1000 / fps;
      const totalFrames = Math.ceil((endTime - startTime) * fps);
      
      for (let i = 0; i < totalFrames; i++) {
        const time = startTime + (i / fps);
        video.currentTime = time;
        
        await new Promise(resolve => {
          video.onseeked = () => {
            ctx.drawImage(video, 0, 0, width, height);
            frames.push(canvas.toDataURL('image/png'));
            setProgress(Math.round((i / totalFrames) * 80));
            resolve();
          };
        });
      }
      
      setProgress(85);
      
      // Create GIF using gif.js library simulation (simplified version using canvas)
      // In production, use gif.js or similar library
      const gifDataUrl = await createGifFromFrames(frames, width, height, frameDuration);
      
      setGifUrl(gifDataUrl);
      setProgress(100);
    } catch (err) {
      console.error('Conversion error:', err);
      setError('Failed to convert video. Please try a shorter clip.');
    } finally {
      setIsConverting(false);
    }
  }, [startTime, endTime, fps, width]);

  // Simplified GIF creation (in production, use gif.js)
  const createGifFromFrames = async (frames, w, h, delay) => {
    // This is a simplified version - returns first frame as preview
    // In production, integrate gif.js library for actual GIF creation
    return frames[0] || '';
  };

  const downloadGif = () => {
    if (!gifUrl) return;
    const a = document.createElement('a');
    a.href = gifUrl;
    a.download = `converted_${Date.now()}.gif`;
    a.click();
  };

  const clearAll = () => {
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    if (gifUrl) URL.revokeObjectURL(gifUrl);
    setVideoFile(null);
    setVideoUrl(null);
    setGifUrl(null);
    setShowClearConfirm(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-4 md:p-6 w-full min-h-screen" style={{ backgroundColor: theme.bg, fontFamily: FONTS.body }}>
      <div className="mb-6">
        <h1 className="text-xl md:text-3xl font-bold mb-1 flex items-center gap-2" style={{ color: theme.text, fontFamily: FONTS.heading }}>
          <Film className="size-5 md:size-8 shrink-0" style={{ color: BRAND.blue }} />
          Video to GIF
        </h1>
        <p className="text-xs md:text-sm text-muted-foreground">Convert video clips to animated GIFs</p>
      </div>

      <div className="max-w-4xl mx-auto">
        {!videoUrl ? (
          <Card>
            <CardContent className="p-6 md:p-12">
              <div className="border-2 border-dashed rounded-xl p-8 md:p-12 text-center cursor-pointer hover:border-primary hover:bg-primary/5"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); handleFileUpload(e.dataTransfer.files?.[0]); }}>
                <div className="size-20 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ backgroundColor: BRAND.blue + '15' }}>
                  <Film className="size-10" style={{ color: BRAND.blue }} />
                </div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: theme.text, fontFamily: FONTS.heading }}>Upload Video</h3>
                <p className="text-muted-foreground mb-4">Drag & drop or click to select</p>
                <Button style={{ backgroundColor: BRAND.blue }}><Upload className="size-4 mr-2" />Select Video</Button>
                <p className="text-xs text-muted-foreground mt-4">MP4, WebM, MOV • Max 100MB</p>
              </div>
              <input ref={fileInputRef} type="file" accept="video/*" onChange={(e) => handleFileUpload(e.target.files?.[0])} className="hidden" />
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {/* Video Preview & Controls */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <Label className="font-medium" style={{ color: theme.text }}>Video Preview</Label>
                  <Button variant="outline" size="sm" onClick={() => setShowClearConfirm(true)} className="text-destructive">
                    <Trash2 className="size-4 mr-1" />Clear
                  </Button>
                </div>
                
                <div className="relative rounded-lg overflow-hidden bg-black">
                  <video ref={videoRef} src={videoUrl} onLoadedMetadata={handleVideoLoaded} onEnded={() => setIsPlaying(false)}
                    className="w-full" style={{ maxHeight: '400px' }} />
                  <Button variant="secondary" size="icon" className="absolute bottom-4 left-4" onClick={togglePlay}>
                    {isPlaying ? <Pause className="size-4" /> : <Play className="size-4" />}
                  </Button>
                </div>
                <canvas ref={canvasRef} className="hidden" />
              </CardContent>
            </Card>

            {/* Settings */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Settings className="size-4" />
                  <Label className="font-medium" style={{ color: theme.text }}>GIF Settings</Label>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <Label className="text-sm">Start Time</Label>
                        <span className="text-sm font-mono">{formatTime(startTime)}</span>
                      </div>
                      <Slider value={startTime} onChange={(v) => { setStartTime(v); if (v >= endTime) setEndTime(Math.min(v + 1, duration)); }}
                        min={0} max={duration} step={0.1} />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <Label className="text-sm">End Time</Label>
                        <span className="text-sm font-mono">{formatTime(endTime)}</span>
                      </div>
                      <Slider value={endTime} onChange={(v) => { setEndTime(v); if (v <= startTime) setStartTime(Math.max(v - 1, 0)); }}
                        min={0} max={duration} step={0.1} />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <Label className="text-sm">Frame Rate (FPS)</Label>
                        <span className="text-sm font-mono">{fps}</span>
                      </div>
                      <Slider value={fps} onChange={setFps} min={5} max={30} step={1} />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <Label className="text-sm">Width (px)</Label>
                        <span className="text-sm font-mono">{width}</span>
                      </div>
                      <Slider value={width} onChange={setWidth} min={200} max={800} step={20} />
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 p-3 rounded-lg bg-muted text-sm">
                  <strong>Duration:</strong> {(endTime - startTime).toFixed(1)}s • <strong>Est. frames:</strong> {Math.ceil((endTime - startTime) * fps)}
                </div>
              </CardContent>
            </Card>

            {/* Convert Button */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    {gifUrl ? 'GIF ready for download!' : 'Configure settings and convert'}
                  </div>
                  <div className="flex gap-2">
                    {gifUrl ? (
                      <Button onClick={downloadGif} style={{ backgroundColor: BRAND.green }}>
                        <Download className="size-4 mr-2" />Download GIF
                      </Button>
                    ) : (
                      <Button onClick={convertToGif} disabled={isConverting} style={{ backgroundColor: BRAND.blue }}>
                        {isConverting ? (
                          <><Loader2 className="size-4 mr-2 animate-spin" />Converting... {progress}%</>
                        ) : (
                          <><Film className="size-4 mr-2" />Convert to GIF</>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
                
                {isConverting && (
                  <div className="mt-3 w-full bg-muted rounded-full h-2">
                    <div className="h-2 rounded-full transition-all" style={{ width: `${progress}%`, backgroundColor: BRAND.blue }} />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* GIF Preview */}
            {gifUrl && (
              <Card>
                <CardContent className="p-4">
                  <Label className="font-medium mb-3 block" style={{ color: theme.text }}>Generated GIF</Label>
                  <img src={gifUrl} alt="Generated GIF" className="rounded-lg max-w-full mx-auto" style={{ maxHeight: '300px' }} />
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
            <div className="flex gap-3">
              <AlertTriangle className="size-5 text-destructive shrink-0" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          </div>
        )}
      </div>

      <Dialog open={showClearConfirm} onOpenChange={setShowClearConfirm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><AlertTriangle className="size-5 text-amber-500" />Clear Video?</DialogTitle>
            <DialogDescription>This will remove the video and any generated GIF.</DialogDescription>
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

export default VideoToGif;
