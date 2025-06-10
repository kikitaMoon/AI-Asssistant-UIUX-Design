
import React, { useState, useRef } from 'react';
import { Upload, X, Type, Clipboard, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface TextCanvasProps {
  isOpen: boolean;
  onClose: () => void;
  onProcessText: (text: string) => void;
  processedResult?: string;
  content: string;
  setContent: (content: string) => void;
}

export const TextCanvas = ({ isOpen, onClose, onProcessText, processedResult, content, setContent }: TextCanvasProps) => {
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('text/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setContent(text);
        setFileName(file.name);
      };
      reader.readAsText(file);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setContent(text);
      console.log('Text pasted from clipboard');
    } catch (err) {
      console.error('Failed to read clipboard:', err);
    }
  };

  const handleClear = () => {
    setContent('');
    setFileName('');
  };

  if (!isOpen) return null;

  return (
    <div className="absolute bottom-full left-0 right-0 bg-[#2a2a2a] rounded-t-2xl border border-border/20 mb-2 transition-all duration-300 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/20">
        <div className="flex items-center gap-2">
          <Type className="w-5 h-5 text-blue-400" />
          <h3 className="text-foreground font-medium">Text to Earth Canvas</h3>
          {fileName && (
            <span className="text-sm text-muted-foreground">({fileName})</span>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground hover:bg-accent h-8 w-8"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="p-4 space-y-4">
        {/* Action Buttons */}
        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.md,.csv,.json,.xml,.log"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            className="text-muted-foreground hover:text-foreground hover:bg-accent h-8 w-8"
            title="Upload Text File"
          >
            <Upload className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePaste}
            className="text-muted-foreground hover:text-foreground hover:bg-accent h-8 w-8"
            title="Paste from Clipboard"
          >
            <Clipboard className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClear}
            className="text-muted-foreground hover:text-red-400 hover:bg-accent h-8 w-8"
            title="Clear"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        {/* Text Input Area */}
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type, paste, or upload your text content here..."
          className="min-h-[150px] bg-background border-border text-foreground placeholder-muted-foreground resize-none"
          rows={6}
        />

        <div className="text-xs text-muted-foreground">
          Supported formats: .txt, .md, .csv, .json, .xml, .log
        </div>
      </div>
    </div>
  );
};
