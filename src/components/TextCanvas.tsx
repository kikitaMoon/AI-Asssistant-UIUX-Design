
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
  children?: React.ReactNode; // For the bottom buttons
}

export const TextCanvas = ({ isOpen, onClose, onProcessText, processedResult, content, setContent, children }: TextCanvasProps) => {
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
    <div className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Type className="w-5 h-5 text-blue-500" />
          <h3 className="text-gray-900 dark:text-white font-medium">Text to Earth Canvas</h3>
          {fileName && (
            <span className="text-sm text-gray-500 dark:text-gray-400">({fileName})</span>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 h-8 w-8"
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
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 h-8 w-8"
            title="Upload Text File"
          >
            <Upload className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePaste}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 h-8 w-8"
            title="Paste from Clipboard"
          >
            <Clipboard className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClear}
            className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 hover:bg-gray-200 dark:hover:bg-gray-700 h-8 w-8"
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
          className="min-h-[150px] bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none focus:border-blue-500 dark:focus:border-blue-400"
          rows={6}
        />

        <div className="text-xs text-gray-500 dark:text-gray-400">
          Supported formats: .txt, .md, .csv, .json, .xml, .log
        </div>
      </div>

      {/* Bottom buttons area */}
      {children && (
        <div className="p-4 pt-0">
          {children}
        </div>
      )}
    </div>
  );
};
