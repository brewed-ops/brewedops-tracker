// FindReplace.jsx - Find and Replace Text Tool for BrewedOps
import React, { useState, useRef } from 'react';
import { MagnifyingGlass, Swap, Copy, Check, Trash, Warning, ArrowsClockwise, DownloadSimple } from '@phosphor-icons/react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { getTheme } from '../lib/theme';

const BRAND = { brown: '#3F200C', blue: '#004AAC', green: '#51AF43', cream: '#FFF0D4' };
const FONTS = { heading: "'Montserrat', sans-serif", body: "'Poppins', sans-serif" };

const FindReplace = ({ isDark }) => {
  const theme = getTheme(isDark);
  const [inputText, setInputText] = useState('');
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [resultText, setResultText] = useState('');
  const [matchCount, setMatchCount] = useState(0);
  const [replacedCount, setReplacedCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [wholeWord, setWholeWord] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);

  const handleReplace = () => {
    if (!inputText || !findText) {
      setResultText(inputText);
      setMatchCount(0);
      setReplacedCount(0);
      return;
    }

    let flags = 'g';
    if (!caseSensitive) flags += 'i';

    let pattern = findText;
    // Escape special regex characters
    pattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    if (wholeWord) {
      pattern = `\\b${pattern}\\b`;
    }

    try {
      const regex = new RegExp(pattern, flags);
      const matches = inputText.match(regex);
      const count = matches ? matches.length : 0;
      
      setMatchCount(count);
      setReplacedCount(count);
      setResultText(inputText.replace(regex, replaceText));
    } catch (e) {
      setResultText(inputText);
      setMatchCount(0);
      setReplacedCount(0);
    }
  };

  const handleFindCount = () => {
    if (!inputText || !findText) {
      setMatchCount(0);
      return;
    }

    let flags = 'g';
    if (!caseSensitive) flags += 'i';

    let pattern = findText;
    pattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    if (wholeWord) {
      pattern = `\\b${pattern}\\b`;
    }

    try {
      const regex = new RegExp(pattern, flags);
      const matches = inputText.match(regex);
      setMatchCount(matches ? matches.length : 0);
    } catch (e) {
      setMatchCount(0);
    }
  };

  const copyResult = () => {
    if (!resultText) return;
    navigator.clipboard.writeText(resultText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadResult = () => {
    if (!resultText) return;
    const blob = new Blob([resultText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'replaced_text.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setInputText('');
    setFindText('');
    setReplaceText('');
    setResultText('');
    setMatchCount(0);
    setReplacedCount(0);
    setShowClearModal(false);
  };

  return (
    <div className="p-4 md:p-6 w-full min-h-screen" style={{ backgroundColor: theme.bg, fontFamily: FONTS.body }}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl md:text-3xl font-bold mb-1 flex items-center gap-2" style={{ color: theme.text, fontFamily: FONTS.heading }}>
          <Swap className="size-5 md:size-8 shrink-0" style={{ color: BRAND.blue }} />
          Find & Replace
        </h1>
        <p className="text-xs md:text-sm text-muted-foreground">Find and replace text in your content instantly</p>
      </div>

      <div className="max-w-4xl mx-auto space-y-4">
        {/* Input Text */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Label className="font-medium" style={{ color: theme.text }}>Your Text</Label>
              {inputText && (
                <Button variant="outline" size="sm" onClick={() => setShowClearModal(true)} className="text-destructive">
                  <Trash className="size-4 mr-1" />Clear
                </Button>
              )}
            </div>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste or type your text here..."
              className="w-full h-40 p-3 border rounded-lg bg-background resize-none text-sm"
              style={{ borderColor: theme.cardBorder }}
            />
          </CardContent>
        </Card>

        {/* Find & Replace Controls */}
        <Card>
          <CardContent className="p-4">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Find */}
              <div>
                <Label className="text-sm mb-2 block">Find</Label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={findText}
                    onChange={(e) => setFindText(e.target.value)}
                    placeholder="Word or phrase to find..."
                    className="flex-1 h-10 px-3 border rounded-lg bg-background text-sm"
                    style={{ borderColor: theme.cardBorder }}
                  />
                  <Button variant="outline" onClick={handleFindCount} title="Count matches">
                    <MagnifyingGlass className="size-4" />
                  </Button>
                </div>
                {matchCount > 0 && (
                  <p className="text-xs mt-1" style={{ color: BRAND.green }}>
                    Found {matchCount} match{matchCount !== 1 ? 'es' : ''}
                  </p>
                )}
              </div>

              {/* Replace */}
              <div>
                <Label className="text-sm mb-2 block">Replace with</Label>
                <input
                  type="text"
                  value={replaceText}
                  onChange={(e) => setReplaceText(e.target.value)}
                  placeholder="New word or phrase..."
                  className="w-full h-10 px-3 border rounded-lg bg-background text-sm"
                  style={{ borderColor: theme.cardBorder }}
                />
              </div>
            </div>

            {/* Options */}
            <div className="flex flex-wrap gap-4 mt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={caseSensitive}
                  onChange={(e) => setCaseSensitive(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm" style={{ color: theme.text }}>Case sensitive</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={wholeWord}
                  onChange={(e) => setWholeWord(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm" style={{ color: theme.text }}>Whole word only</span>
              </label>
            </div>

            {/* Replace Button */}
            <Button 
              onClick={handleReplace} 
              className="w-full mt-4" 
              style={{ backgroundColor: BRAND.blue }}
              disabled={!inputText || !findText}
            >
              <ArrowsClockwise className="size-4 mr-2" />
              Replace All
            </Button>
          </CardContent>
        </Card>

        {/* Result */}
        {resultText && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <Label className="font-medium" style={{ color: theme.text }}>Result</Label>
                  {replacedCount > 0 && (
                    <p className="text-xs" style={{ color: BRAND.green }}>
                      Replaced {replacedCount} occurrence{replacedCount !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={copyResult}>
                    {copied ? <Check className="size-4 mr-1 text-green-500" /> : <Copy className="size-4 mr-1" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </Button>
                  <Button variant="outline" size="sm" onClick={downloadResult}>
                    <DownloadSimple className="size-4 mr-1" />Save
                  </Button>
                </div>
              </div>
              <textarea
                value={resultText}
                readOnly
                className="w-full h-40 p-3 border rounded-lg bg-muted/50 resize-none text-sm"
                style={{ borderColor: theme.cardBorder }}
              />
            </CardContent>
          </Card>
        )}
      </div>

      {/* Clear Confirmation Modal */}
      <Dialog open={showClearModal} onOpenChange={setShowClearModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Warning className="size-5 text-amber-500" />
              Clear All?
            </DialogTitle>
            <DialogDescription>
              This will clear all text fields. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowClearModal(false)}>Cancel</Button>
            <Button variant="destructive" onClick={clearAll}>
              <Trash className="size-4 mr-2" />Clear All
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FindReplace;
