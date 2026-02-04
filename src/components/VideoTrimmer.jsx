// VideoTrimmer.jsx - Video Trimming Tool for BrewedOps
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { UploadSimple, DownloadSimple, Trash, Scissors, SpinnerGap, Warning, Play, Pause } from '@phosphor-icons/react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { getTheme } from '../lib/theme';

const BRAND = { brown: '#3F200C', blue: '#004AAC', green: '#51AF43', cream: '#FFF0D4' };
const FONTS = { heading: "'Montserrat', sans-serif", body: "'Poppins', sans-serif" };

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 10);
  return `${mins}:${secs.toString().padStart(2, '0')}.${ms}`;
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const VideoTrimmer = ({ isDark }) => {
  const theme = getTheme(isDark);
  const [videoFile, setVideoFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [trimmedUrl, setTrimmedUrl] = useState(null);
  const [trimmedSize, setTrimmedSize] = useState(null);
  const [isTrimming, setIsTrimming] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
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
    setTrimmedUrl(null);
    setTrimmedSize(null);
    
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    const url = URL.createObjectURL(file);
    setVideoFile(file);
    setVideoUrl(url);
  }, [videoUrl]);

  const handleVideoLoaded = () => {
    if (videoRef.current) {
      const dur = videoRef.current.duration;
      setDuration(dur);
      setStartTime(0);
      setEndTime(dur);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      
      // Stop at end time during preview
      if (videoRef.current.currentTime >= endTime) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      // Start from start time if at end or before start
      if (videoRef.current.currentTime < startTime || videoRef.current.currentTime >= endTime) {
        videoRef.current.currentTime = startTime;
      }
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const setCurrentAsStart = () => {
    if (currentTime < endTime) {
      setStartTime(currentTime);
    }
  };

  const setCurrentAsEnd = () => {
    if (currentTime > startTime) {
      setEndTime(currentTime);
    }
  };

  const previewTrim = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = startTime;
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const trimVideo = useCallback(async () => {
    if (!videoFile || !videoRef.current) return;
    
    setIsTrimming(true);
    setProgress(0);
    setError(null);
    
    try {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      
      const stream = canvas.captureStream(30);
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9',
        videoBitsPerSecond: 2500000,
      });
      
      const chunks = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        setTrimmedUrl(URL.createObjectURL(blob));
        setTrimmedSize(blob.size);
        setIsTrimming(false);
        setProgress(100);
      };
      
      // Set video to start time
      video.currentTime = startTime;
      video.muted = true;
      
      await new Promise(resolve => {
        video.onseeked = resolve;
      });
      
      mediaRecorder.start();
      
      const trimDuration = endTime - startTime;
      
      const processFrame = () => {
        if (video.currentTime >= endTime || video.ended) {
          mediaRecorder.stop();
          video.pause();
          return;
        }
        
        ctx.drawImage(video, 0, 0);
        const elapsed = video.currentTime - startTime;
        setProgress(Math.round((elapsed / trimDuration) * 95));
        requestAnimationFrame(processFrame);
      };
      
      await video.play();
      processFrame();
      
    } catch (err) {
      console.error('Trim error:', err);
      setError('Failed to trim video. Your browser may not support this feature.');
      setIsTrimming(false);
    }
  }, [videoFile, startTime, endTime]);

  const downloadVideo = () => {
    if (!trimmedUrl) return;
    const a = document.createElement('a');
    a.href = trimmedUrl;
    a.download = `trimmed_${Date.now()}.webm`;
    a.click();
  };

  const clearAll = () => {
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    if (trimmedUrl) URL.revokeObjectURL(trimmedUrl);
    setVideoFile(null);
    setVideoUrl(null);
    setDuration(0);
    setCurrentTime(0);
    setStartTime(0);
    setEndTime(0);
    setTrimmedUrl(null);
    setTrimmedSize(null);
    setError(null);
    setShowClearConfirm(false);
  };

  const trimDuration = endTime - startTime;

  return (
    <div className="p-4 md:p-6 w-full min-h-screen" style={{ backgroundColor: theme.bg, fontFamily: FONTS.body }}>
      <div className="mb-6">
        <h1 className="text-xl md:text-3xl font-bold mb-1 flex items-center gap-2" style={{ color: theme.text, fontFamily: FONTS.heading }}>
          <Scissors className="size-5 md:size-8 shrink-0" style={{ color: BRAND.blue }} />
          Video Trimmer
        </h1>
        <p className="text-xs md:text-sm text-muted-foreground">Cut and trim video clips to the perfect length</p>
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
                  <Scissors className="size-10" style={{ color: BRAND.blue }} />
                </div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: theme.text, fontFamily: FONTS.heading }}>Upload Video</h3>
                <p className="text-muted-foreground mb-4">Drag & drop or click to select</p>
                <Button style={{ backgroundColor: BRAND.blue }}><UploadSimple className="size-4 mr-2" />Select Video</Button>
                <p className="text-xs text-muted-foreground mt-4">MP4, WebM, MOV • Max 500MB</p>
              </div>
              <input ref={fileInputRef} type="file" accept="video/*" onChange={(e) => handleFileUpload(e.target.files?.[0])} className="hidden" />
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {/* Video Player */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <Label className="font-medium" style={{ color: theme.text }}>Video</Label>
                  <Button variant="outline" size="sm" onClick={() => setShowClearConfirm(true)} className="text-destructive">
                    <Trash className="size-4 mr-1" />Clear
                  </Button>
                </div>
                
                <div className="relative rounded-lg overflow-hidden bg-black">
                  <video
                    ref={videoRef}
                    src={videoUrl}
                    onLoadedMetadata={handleVideoLoaded}
                    onTimeUpdate={handleTimeUpdate}
                    onEnded={() => setIsPlaying(false)}
                    className="w-full"
                    style={{ maxHeight: '350px' }}
                  />
                  <Button size="icon" variant="secondary" className="absolute bottom-4 left-4 size-10" onClick={togglePlay}>
                    {isPlaying ? <Pause className="size-5" /> : <Play className="size-5" />}
                  </Button>
                  <div className="absolute bottom-4 right-4 px-2 py-1 bg-black/70 rounded text-white text-sm font-mono">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline & Controls */}
            <Card>
              <CardContent className="p-4">
                <Label className="font-medium mb-4 block" style={{ color: theme.text }}>Trim Selection</Label>
                
                {/* Timeline */}
                <div className="relative h-12 bg-muted rounded-lg mb-4 overflow-hidden">
                  {/* Selected region */}
                  <div 
                    className="absolute top-0 bottom-0 bg-blue-500/30"
                    style={{
                      left: `${(startTime / duration) * 100}%`,
                      width: `${((endTime - startTime) / duration) * 100}%`
                    }}
                  />
                  
                  {/* Current time indicator */}
                  <div 
                    className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg"
                    style={{ left: `${(currentTime / duration) * 100}%` }}
                  />
                  
                  {/* Start handle */}
                  <div 
                    className="absolute top-0 bottom-0 w-1 bg-green-500 cursor-ew-resize"
                    style={{ left: `${(startTime / duration) * 100}%` }}
                  />
                  
                  {/* End handle */}
                  <div 
                    className="absolute top-0 bottom-0 w-1 bg-red-500 cursor-ew-resize"
                    style={{ left: `${(endTime / duration) * 100}%` }}
                  />
                  
                  {/* Clickable area */}
                  <div 
                    className="absolute inset-0 cursor-pointer"
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = e.clientX - rect.left;
                      const percent = x / rect.width;
                      const time = percent * duration;
                      if (videoRef.current) {
                        videoRef.current.currentTime = time;
                      }
                    }}
                  />
                </div>
                
                {/* Time inputs */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label className="text-sm mb-2 block">Start Time</Label>
                    <div className="flex gap-2">
                      <input
                        type="range"
                        min={0}
                        max={duration}
                        step={0.1}
                        value={startTime}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          if (val < endTime) setStartTime(val);
                        }}
                        className="flex-1"
                        style={{ accentColor: BRAND.green }}
                      />
                      <span className="text-sm font-mono w-16 text-right" style={{ color: BRAND.green }}>{formatTime(startTime)}</span>
                    </div>
                    <Button variant="outline" size="sm" className="mt-2 w-full" onClick={setCurrentAsStart}>
                      Set Current as Start
                    </Button>
                  </div>
                  
                  <div>
                    <Label className="text-sm mb-2 block">End Time</Label>
                    <div className="flex gap-2">
                      <input
                        type="range"
                        min={0}
                        max={duration}
                        step={0.1}
                        value={endTime}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          if (val > startTime) setEndTime(val);
                        }}
                        className="flex-1"
                        style={{ accentColor: '#ef4444' }}
                      />
                      <span className="text-sm font-mono w-16 text-right text-red-500">{formatTime(endTime)}</span>
                    </div>
                    <Button variant="outline" size="sm" className="mt-2 w-full" onClick={setCurrentAsEnd}>
                      Set Current as End
                    </Button>
                  </div>
                </div>
                
                <div className="p-3 rounded-lg bg-muted text-sm text-center">
                  <strong>Clip Duration:</strong> {formatTime(trimDuration)} 
                  {videoFile && <span className="text-muted-foreground ml-2">• Original: {formatFileSize(videoFile.size)}</span>}
                </div>
                
                <Button variant="outline" onClick={previewTrim} className="w-full mt-3">
                  <Play className="size-4 mr-2" />Preview Selection
                </Button>
              </CardContent>
            </Card>

            {/* Trim Button & Results */}
            <Card>
              <CardContent className="p-4">
                {trimmedUrl ? (
                  <div className="space-y-4">
                    <div className="text-center py-2">
                      <p className="text-lg font-bold" style={{ color: BRAND.green }}>Trim Complete!</p>
                      <p className="text-sm text-muted-foreground">Output: {formatFileSize(trimmedSize)} • {formatTime(trimDuration)}</p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => { setTrimmedUrl(null); setTrimmedSize(null); }} className="flex-1">
                        Trim Again
                      </Button>
                      <Button onClick={downloadVideo} className="flex-1" style={{ backgroundColor: BRAND.green }}>
                        <DownloadSimple className="size-4 mr-2" />Download
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Button onClick={trimVideo} disabled={isTrimming || trimDuration <= 0} className="w-full" style={{ backgroundColor: BRAND.blue }}>
                      {isTrimming ? <><SpinnerGap className="size-4 mr-2 animate-spin" />Trimming... {progress}%</> : <><Scissors className="size-4 mr-2" />Trim Video</>}
                    </Button>
                    
                    {isTrimming && (
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
              <Warning className="size-5 text-destructive shrink-0" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          </div>
        )}
      </div>

      <Dialog open={showClearConfirm} onOpenChange={setShowClearConfirm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Warning className="size-5 text-amber-500" />Clear Video?</DialogTitle>
            <DialogDescription>Remove the video and any trimmed output.</DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowClearConfirm(false)}>Cancel</Button>
            <Button variant="destructive" onClick={clearAll}><Trash className="size-4 mr-2" />Clear</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VideoTrimmer;
