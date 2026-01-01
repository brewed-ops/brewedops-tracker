// CaseConverter.jsx - Text Case Converter Tool for BrewedOps
import React, { useState } from 'react';
import { CaseSensitive, Copy, Check, Trash2, AlertTriangle, Download, ArrowDown, ArrowUp, Type } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { getTheme } from '../lib/theme';

const BRAND = { brown: '#3F200C', blue: '#004AAC', green: '#51AF43', cream: '#FFF0D4' };
const FONTS = { heading: "'Montserrat', sans-serif", body: "'Poppins', sans-serif" };

const CaseConverter = ({ isDark }) => {
  const theme = getTheme(isDark);
  const [inputText, setInputText] = useState('');
  const [resultText, setResultText] = useState('');
  const [activeCase, setActiveCase] = useState(null);
  const [copied, setCopied] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);

  const convertCase = (type) => {
    if (!inputText) return;
    
    let result = '';
    setActiveCase(type);

    switch (type) {
      case 'lower':
        result = inputText.toLowerCase();
        break;
      case 'upper':
        result = inputText.toUpperCase();
        break;
      case 'title':
        // Title Case - First letter of each word capitalized
        result = inputText.toLowerCase().replace(/(?:^|\s|[-"'([{])+\S/g, (match) => match.toUpperCase());
        break;
      case 'sentence':
        // Sentence Case - First letter of each sentence capitalized
        result = inputText.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (match) => match.toUpperCase());
        break;
      case 'capitalize':
        // Capitalize First Letter Only
        result = inputText.charAt(0).toUpperCase() + inputText.slice(1).toLowerCase();
        break;
      case 'toggle':
        // Toggle Case - swap upper and lower
        result = inputText.split('').map(char => {
          if (char === char.toUpperCase()) return char.toLowerCase();
          return char.toUpperCase();
        }).join('');
        break;
      case 'alternate':
        // aLtErNaTe CaSe
        result = inputText.split('').map((char, i) => {
          return i % 2 === 0 ? char.toLowerCase() : char.toUpperCase();
        }).join('');
        break;
      default:
        result = inputText;
    }

    setResultText(result);
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
    a.download = 'converted_text.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setInputText('');
    setResultText('');
    setActiveCase(null);
    setShowClearModal(false);
  };

  const caseOptions = [
    { id: 'lower', label: 'lowercase', example: 'hello world', icon: ArrowDown },
    { id: 'upper', label: 'UPPERCASE', example: 'HELLO WORLD', icon: ArrowUp },
    { id: 'title', label: 'Title Case', example: 'Hello World', icon: Type },
    { id: 'sentence', label: 'Sentence case', example: 'Hello world. How are you?', icon: CaseSensitive },
    { id: 'capitalize', label: 'Capitalize first', example: 'Hello world', icon: CaseSensitive },
    { id: 'toggle', label: 'tOGGLE cASE', example: 'hELLO wORLD', icon: CaseSensitive },
    { id: 'alternate', label: 'aLtErNaTe', example: 'hElLo WoRlD', icon: CaseSensitive },
  ];

  return (
    <div className="p-4 md:p-6 w-full min-h-screen" style={{ backgroundColor: theme.bg, fontFamily: FONTS.body }}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl md:text-3xl font-bold mb-1 flex items-center gap-2" style={{ color: theme.text, fontFamily: FONTS.heading }}>
          <CaseSensitive className="size-5 md:size-8 shrink-0" style={{ color: BRAND.blue }} />
          Case Converter
        </h1>
        <p className="text-xs md:text-sm text-muted-foreground">Convert text between different letter cases</p>
      </div>

      <div className="max-w-4xl mx-auto space-y-4">
        {/* Input Text */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Label className="font-medium" style={{ color: theme.text }}>Your Text</Label>
              {inputText && (
                <Button variant="outline" size="sm" onClick={() => setShowClearModal(true)} className="text-destructive">
                  <Trash2 className="size-4 mr-1" />Clear
                </Button>
              )}
            </div>
            <textarea
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                setResultText('');
                setActiveCase(null);
              }}
              placeholder="Paste or type your text here..."
              className="w-full h-40 p-3 border rounded-lg bg-background resize-none text-sm"
              style={{ borderColor: theme.cardBorder }}
            />
            <p className="text-xs text-muted-foreground mt-2">
              {inputText.length} characters
            </p>
          </CardContent>
        </Card>

        {/* Case Options */}
        <Card>
          <CardContent className="p-4">
            <Label className="font-medium mb-3 block" style={{ color: theme.text }}>Choose Case Style</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {caseOptions.map(option => (
                <button
                  key={option.id}
                  onClick={() => convertCase(option.id)}
                  disabled={!inputText}
                  className={`p-3 rounded-lg border text-left transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:border-blue-500 ${
                    activeCase === option.id ? 'ring-2 ring-blue-500 border-blue-500' : ''
                  }`}
                  style={{ 
                    backgroundColor: activeCase === option.id ? BRAND.blue + '10' : theme.cardBg,
                    borderColor: activeCase === option.id ? BRAND.blue : theme.cardBorder 
                  }}
                >
                  <span className="font-medium text-sm block" style={{ color: theme.text }}>
                    {option.label}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {option.example}
                  </span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Result */}
        {resultText && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <Label className="font-medium" style={{ color: theme.text }}>Result</Label>
                  <p className="text-xs" style={{ color: BRAND.green }}>
                    Converted to {caseOptions.find(o => o.id === activeCase)?.label}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={copyResult}>
                    {copied ? <Check className="size-4 mr-1 text-green-500" /> : <Copy className="size-4 mr-1" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </Button>
                  <Button variant="outline" size="sm" onClick={downloadResult}>
                    <Download className="size-4 mr-1" />Save
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

        {/* Info */}
        <div className="p-4 rounded-lg border" style={{ backgroundColor: BRAND.blue + '08', borderColor: BRAND.blue + '20' }}>
          <p className="text-sm font-medium mb-2" style={{ color: BRAND.blue }}>Case Styles Explained</p>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li><strong>lowercase:</strong> all letters in small case</li>
            <li><strong>UPPERCASE:</strong> ALL LETTERS IN CAPITAL</li>
            <li><strong>Title Case:</strong> First Letter Of Each Word Capitalized</li>
            <li><strong>Sentence case:</strong> First letter of each sentence capitalized</li>
            <li><strong>Capitalize first:</strong> Only the very first letter is capitalized</li>
            <li><strong>tOGGLE cASE:</strong> Inverts the current case of each letter</li>
            <li><strong>aLtErNaTe:</strong> Alternates between lower and upper case</li>
          </ul>
        </div>
      </div>

      {/* Clear Confirmation Modal */}
      <Dialog open={showClearModal} onOpenChange={setShowClearModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="size-5 text-amber-500" />
              Clear All?
            </DialogTitle>
            <DialogDescription>
              This will clear all text. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowClearModal(false)}>Cancel</Button>
            <Button variant="destructive" onClick={clearAll}>
              <Trash2 className="size-4 mr-2" />Clear All
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CaseConverter;
