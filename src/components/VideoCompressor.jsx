// VideoCompressor.jsx - Video Compression Tool for BrewedOps
import React, { useState, useRef, useCallback } from 'react';
import { Upload, Download, Trash2, Film, Loader2, AlertTriangle, Settings, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/Badge';
import { getTheme } from '../lib/theme';

const BRAND = { brown: '#3F200C', blue: '#004AAC', green: '#51AF43', cream: '#FFF0D4' };
const FONTS = { heading: "'Montserrat', sans-serif", body: "'Poppins', sans-serif" };

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const formatDuration = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const QUALITY_PRESETS = [
  { id: 'high', label: 'High Quality', bitrate: 2500000, description: 'Best quality, larger file' },
  { id: 'medium', label: 'Balanced', bitrate: 1500000, description: 'Good quality, moderate size' },
  { id: 'low', label: 'Small Size', bitrate: 800000, description: 'Smaller file, lower quality' },
  { id: 'tiny', label: 'Minimum', bitrate: 400000, description: 'Smallest file, basic quality' },
];

const VideoCompressor = ({ isDark }) => {
  const theme = getTheme(isDark);
  const [videoFile, setVideoFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [videoInfo, setVideoInfo] = useState(null);
  const [compressedUrl, setCompressedUrl] = useState(null);
  const [compressedSize, setCompressedSize] = useState(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [quality, setQuality] = useState('medium');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);

  const handleFileUpload = useCallback((file) => {
    if (!file) return;
    if (!file.type.startsWith('video/')) {
      setError('Please upload a video file (MP4, WebM, MOV)');
      return;
    }
    if (file.size > 500 * 1024 * 1024) {
      setError('File size must be less than 500MB');
      return;
    }
    
    setError(null);
    setCompressedUrl(null);
    setCompressedSize(null);
    
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    const url = URL.createObjectURL(file);
    setVideoFile(file);
    setVideoUrl(url);
  }, [videoUrl]);

  const handleVideoLoaded = () => {
    if (videoRef.current) {
      setVideoInfo({
        duration: videoRef.current.duration,
        width: videoRef.current.videoWidth,
        height: videoRef.current.videoHeight,
      });
    }
  };

  const compressVideo = useCallback(async () => {
    if (!videoFile || !videoRef.current) return;
    
    setIsCompressing(true);
    setProgress(0);
    setError(null);
    
    try {
      const preset = QUALITY_PRESETS.find(p => p.id === quality);
      const video = videoRef.current;
      
      // Create canvas for frame capture
      const canvas = document.createElement('canvas');
      const targetWidth = Math.min(video.videoWidth, quality === 'tiny' ? 640 : quality === 'low' ? 854 : 1280);
      const targetHeight = Math.round(targetWidth * (video.videoHeight / video.videoWidth));
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');
      
      // Create MediaRecorder with lower bitrate
      const stream = canvas.captureStream(30);
      
      // Try to get audio track
      let audioTrack = null;
      try {
        const audioContext = new AudioContext();
        const source = audioContext.createMediaElementSource(video);
        const destination = audioContext.createMediaStreamDestination();
        source.connect(destination);
        source.connect(audioContext.destination);
        audioTrack = destination.stream.getAudioTracks()[0];
        if (audioTrack) {
          stream.addTrack(audioTrack);
        }
      } catch (e) {
        console.log('Audio extraction not supported, video only');
      }
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9',
        videoBitsPerSecond: preset.bitrate,
      });
      
      const chunks = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        setCompressedUrl(URL.createObjectURL(blob));
        setCompressedSize(blob.size);
        setIsCompressing(false);
        setProgress(100);
      };
      
      // Start recording and play video
      mediaRecorder.start();
      video.currentTime = 0;
      video.muted = true;
      
      const duration = video.duration;
      
      const processFrame = () => {
        if (video.ended || video.paused) {
          mediaRecorder.stop();
          return;
        }
        
        ctx.drawImage(video, 0, 0, targetWidth, targetHeight);
        setProgress(Math.round((video.currentTime / duration) * 95));
        requestAnimationFrame(processFrame);
      };
      
      video.onended = () => {
        mediaRecorder.stop();
      };
      
      await video.play();
      processFrame();
      
    } catch (err) {
      console.error('Compression error:', err);
      setError('Failed to compress video. Your browser may not support this feature.');
      setIsCompressing(false);
    }
  }, [videoFile, quality]);

  const downloadVideo = () => {
    if (!compressedUrl) return;
    const a = document.createElement('a');
    a.href = compressedUrl;
    a.download = `compressed_${Date.now()}.webm`;
    a.click();
  };

  const clearAll = () => {
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    if (compressedUrl) URL.revokeObjectURL(compressedUrl);
    setVideoFile(null);
    setVideoUrl(null);
    setVideoInfo(null);
    setCompressedUrl(null);
    setCompressedSize(null);
    setError(null);
    setShowClearConfirm(false);
  };

  const savings = videoFile && compressedSize ? Math.round((1 - compressedSize / videoFile.size) * 100) : 0;

  return (
    <div className="p-4 md:p-6 w-full min-h-screen" style={{ backgroundColor: theme.bg, fontFamily: FONTS.body }}>
      <div className="mb-6">
        <h1 className="text-xl md:text-3xl font-bold mb-1 flex items-center gap-2" style={{ color: theme.text, fontFamily: FONTS.heading }}>
          <Film className="size-5 md:size-8 shrink-0" style={{ color: BRAND.blue }} />
          Video Compressor
        </h1>
        <p className="text-xs md:text-sm text-muted-foreground">Reduce video file size while maintaining quality</p>
      </div>

      <div className="max-w-3xl mx-auto">
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
                <p className="text-xs text-muted-foreground mt-4">MP4, WebM, MOV • Max 500MB</p>
              </div>
              <input ref={fileInputRef} type="file" accept="video/*" onChange={(e) => handleFileUpload(e.target.files?.[0])} className="hidden" />
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {/* Video Preview */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <Label className="font-medium" style={{ color: theme.text }}>Video Preview</Label>
                  <Button variant="outline" size="sm" onClick={() => setShowClearConfirm(true)} className="text-destructive">
                    <Trash2 className="size-4 mr-1" />Clear
                  </Button>
                </div>
                
                <video ref={videoRef} src={videoUrl} onLoadedMetadata={handleVideoLoaded} controls className="w-full rounded-lg" style={{ maxHeight: '300px' }} />
                
                {videoInfo && (
                  <div className="flex flex-wrap gap-4 mt-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Size: </span>
                      <span className="font-medium" style={{ color: theme.text }}>{formatFileSize(videoFile.size)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Duration: </span>
                      <span className="font-medium" style={{ color: theme.text }}>{formatDuration(videoInfo.duration)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Resolution: </span>
                      <span className="font-medium" style={{ color: theme.text }}>{videoInfo.width}×{videoInfo.height}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quality Settings */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Settings className="size-4" />
                  <Label className="font-medium" style={{ color: theme.text }}>Compression Quality</Label>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {QUALITY_PRESETS.map(preset => (
                    <button key={preset.id} onClick={() => setQuality(preset.id)}
                      className={`p-3 rounded-lg border text-left transition-all ${quality === preset.id ? 'border-blue-500 bg-blue-500/10' : 'border-muted hover:border-blue-300'}`}>
                      <p className="font-medium text-sm" style={{ color: theme.text }}>{preset.label}</p>
                      <p className="text-xs text-muted-foreground mt-1">{preset.description}</p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Compress Button & Results */}
            <Card>
              <CardContent className="p-4">
                {compressedUrl ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center gap-4 py-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold" style={{ color: theme.text }}>{formatFileSize(videoFile.size)}</p>
                        <p className="text-xs text-muted-foreground">Original</p>
                      </div>
                      <ArrowRight className="size-6 text-muted-foreground" />
                      <div className="text-center">
                        <p className="text-2xl font-bold" style={{ color: BRAND.green }}>{formatFileSize(compressedSize)}</p>
                        <p className="text-xs text-muted-foreground">Compressed</p>
                      </div>
                      <Badge className="ml-2" style={{ backgroundColor: BRAND.green + '20', color: BRAND.green }}>
                        -{savings}%
                      </Badge>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => { setCompressedUrl(null); setCompressedSize(null); }} className="flex-1">
                        Compress Again
                      </Button>
                      <Button onClick={downloadVideo} className="flex-1" style={{ backgroundColor: BRAND.green }}>
                        <Download className="size-4 mr-2" />Download
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Button onClick={compressVideo} disabled={isCompressing} className="w-full" style={{ backgroundColor: BRAND.blue }}>
                      {isCompressing ? <><Loader2 className="size-4 mr-2 animate-spin" />Compressing... {progress}%</> : <><Film className="size-4 mr-2" />Compress Video</>}
                    </Button>
                    
                    {isCompressing && (
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="h-2 rounded-full transition-all" style={{ width: `${progress}%`, backgroundColor: BRAND.blue }} />
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
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
            <DialogDescription>Remove the video and any compressed output.</DialogDescription>
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

export default VideoCompressor;
