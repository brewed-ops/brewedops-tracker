// WordCounter.jsx - Word & Character Counter Tool for BrewedOps
import React, { useState, useMemo } from 'react';
import { FileText, Copy, Check, Trash2, AlertTriangle, Clock, Hash, Type, AlignLeft, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { getTheme } from '../lib/theme';

const BRAND = { brown: '#3F200C', blue: '#004AAC', green: '#51AF43', cream: '#FFF0D4' };
const FONTS = { heading: "'Montserrat', sans-serif", body: "'Poppins', sans-serif" };

const WordCounter = ({ isDark }) => {
  const theme = getTheme(isDark);
  const [inputText, setInputText] = useState('');
  const [copied, setCopied] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);

  // Calculate all stats
  const stats = useMemo(() => {
    const text = inputText;
    
    // Characters
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;
    
    // Words
    const words = text.trim() ? text.trim().split(/\s+/).filter(w => w.length > 0).length : 0;
    
    // Sentences (split by . ! ?)
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    
    // Paragraphs (split by double newlines or single newlines with content)
    const paragraphs = text.split(/\n\s*\n|\n/).filter(p => p.trim().length > 0).length;
    
    // Lines
    const lines = text.split('\n').length;
    
    // Reading time (avg 200 words per minute)
    const readingTimeMin = Math.ceil(words / 200);
    
    // Speaking time (avg 150 words per minute)
    const speakingTimeMin = Math.ceil(words / 150);
    
    // Average word length
    const avgWordLength = words > 0 ? (charactersNoSpaces / words).toFixed(1) : 0;
    
    // Unique words
    const wordList = text.toLowerCase().match(/\b[a-z]+\b/g) || [];
    const uniqueWords = new Set(wordList).size;
    
    // Letter frequency (top 5)
    const letterFreq = {};
    text.toLowerCase().replace(/[^a-z]/g, '').split('').forEach(letter => {
      letterFreq[letter] = (letterFreq[letter] || 0) + 1;
    });
    const topLetters = Object.entries(letterFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return {
      characters,
      charactersNoSpaces,
      words,
      sentences,
      paragraphs,
      lines,
      readingTimeMin,
      speakingTimeMin,
      avgWordLength,
      uniqueWords,
      topLetters
    };
  }, [inputText]);

  const copyText = () => {
    if (!inputText) return;
    navigator.clipboard.writeText(inputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearAll = () => {
    setInputText('');
    setShowClearModal(false);
  };

  const StatCard = ({ icon: Icon, label, value, subvalue, color = BRAND.blue }) => (
    <div 
      className="p-4 rounded-lg border"
      style={{ backgroundColor: color + '08', borderColor: color + '20' }}
    >
      <div className="flex items-center gap-2 mb-1">
        <Icon className="size-4" style={{ color }} />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <p className="text-2xl font-bold" style={{ color: theme.text }}>{value}</p>
      {subvalue && <p className="text-xs text-muted-foreground">{subvalue}</p>}
    </div>
  );

  return (
    <div className="p-4 md:p-6 w-full min-h-screen" style={{ backgroundColor: theme.bg, fontFamily: FONTS.body }}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl md:text-3xl font-bold mb-1 flex items-center gap-2" style={{ color: theme.text, fontFamily: FONTS.heading }}>
          <Hash className="size-5 md:size-8 shrink-0" style={{ color: BRAND.blue }} />
          Word Counter
        </h1>
        <p className="text-xs md:text-sm text-muted-foreground">Count words, characters, sentences, and more</p>
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-4">
          {/* Input Text */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardContent className="p-4 h-full flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <Label className="font-medium" style={{ color: theme.text }}>Your Text</Label>
                  <div className="flex gap-2">
                    {inputText && (
                      <>
                        <Button variant="outline" size="sm" onClick={copyText}>
                          {copied ? <Check className="size-4 mr-1 text-green-500" /> : <Copy className="size-4 mr-1" />}
                          {copied ? 'Copied!' : 'Copy'}
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setShowClearModal(true)} className="text-destructive">
                          <Trash2 className="size-4 mr-1" />Clear
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Start typing or paste your text here to see word count, character count, and more statistics..."
                  className="flex-1 w-full min-h-[300px] p-3 border rounded-lg bg-background resize-none text-sm"
                  style={{ borderColor: theme.cardBorder }}
                />
              </CardContent>
            </Card>
          </div>

          {/* Stats Panel */}
          <div className="space-y-4">
            {/* Main Stats */}
            <div className="grid grid-cols-2 gap-2">
              <StatCard 
                icon={FileText} 
                label="Words" 
                value={stats.words.toLocaleString()} 
              />
              <StatCard 
                icon={Type} 
                label="Characters" 
                value={stats.characters.toLocaleString()}
                subvalue={`${stats.charactersNoSpaces.toLocaleString()} without spaces`}
              />
              <StatCard 
                icon={AlignLeft} 
                label="Sentences" 
                value={stats.sentences.toLocaleString()} 
                color={BRAND.green}
              />
              <StatCard 
                icon={BookOpen} 
                label="Paragraphs" 
                value={stats.paragraphs.toLocaleString()} 
                color={BRAND.green}
              />
            </div>

            {/* Reading Time */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="size-4" style={{ color: BRAND.blue }} />
                  <span className="text-sm font-medium" style={{ color: theme.text }}>Estimated Time</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Reading time</span>
                    <span style={{ color: theme.text }}>{stats.readingTimeMin} min</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Speaking time</span>
                    <span style={{ color: theme.text }}>{stats.speakingTimeMin} min</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Stats */}
            <Card>
              <CardContent className="p-4">
                <span className="text-sm font-medium mb-3 block" style={{ color: theme.text }}>Additional Stats</span>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Lines</span>
                    <span style={{ color: theme.text }}>{stats.lines.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Unique words</span>
                    <span style={{ color: theme.text }}>{stats.uniqueWords.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Avg. word length</span>
                    <span style={{ color: theme.text }}>{stats.avgWordLength} chars</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Letters */}
            {stats.topLetters.length > 0 && (
              <Card>
                <CardContent className="p-4">
                  <span className="text-sm font-medium mb-3 block" style={{ color: theme.text }}>Most Used Letters</span>
                  <div className="flex gap-2">
                    {stats.topLetters.map(([letter, count], i) => (
                      <div 
                        key={letter}
                        className="flex-1 text-center p-2 rounded-lg"
                        style={{ backgroundColor: BRAND.blue + (20 - i * 4).toString(16).padStart(2, '0') }}
                      >
                        <span className="text-lg font-bold uppercase" style={{ color: theme.text }}>{letter}</span>
                        <p className="text-xs text-muted-foreground">{count}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Clear Confirmation Modal */}
      <Dialog open={showClearModal} onOpenChange={setShowClearModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="size-5 text-amber-500" />
              Clear Text?
            </DialogTitle>
            <DialogDescription>
              This will clear all your text. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowClearModal(false)}>Cancel</Button>
            <Button variant="destructive" onClick={clearAll}>
              <Trash2 className="size-4 mr-2" />Clear
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WordCounter;
