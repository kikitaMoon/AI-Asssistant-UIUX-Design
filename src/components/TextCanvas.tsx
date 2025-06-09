
import React, { useState, useRef } from 'react';
import { Upload, X, Save, Type, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface TextCanvasProps {
  isOpen: boolean;
  onClose: () => void;
  onProcessText: (text: string) => void;
  processedResult?: string;
}

export const TextCanvas = ({ isOpen, onClose, onProcessText, processedResult }: TextCanvasProps) => {
  const [content, setContent] = useState('');
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

  const handleProcessText = () => {
    if (content.trim()) {
      onProcessText(content);
      console.log('Processing text content:', content);
    }
  };

  const handleClear = () => {
    setContent('');
    setFileName('');
  };

  if (!isOpen) return null;

  return (
    <div className="bg-[#303030] rounded-b-2xl border-t border-gray-600 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-600">
        <div className="flex items-center gap-2">
          <Type className="w-5 h-5 text-blue-400" />
          <h3 className="text-white font-medium">Text to Earth Canvas</h3>
          {fileName && (
            <span className="text-sm text-gray-400">({fileName})</span>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-gray-400 hover:text-white hover:bg-gray-600 h-8 w-8"
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
            className="text-gray-400 hover:text-white hover:bg-gray-600 h-8 w-8"
            title="Upload Text File"
          >
            <Upload className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleProcessText}
            disabled={!content.trim()}
            className="text-gray-400 hover:text-white hover:bg-gray-600 disabled:text-gray-600 h-8 w-8"
            title="Process Text"
          >
            <Send className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClear}
            className="text-gray-400 hover:text-red-400 hover:bg-gray-600 h-8 w-8"
            title="Clear"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Text Input Area */}
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type, paste, or upload your text content here..."
          className="min-h-[150px] bg-gray-800 border-gray-600 text-white placeholder-gray-400 resize-none"
          rows={6}
        />

        {/* Processed Result Area */}
        {processedResult && (
          <div className="border-t border-gray-600 pt-4">
            <div className="flex items-center gap-2 mb-2">
              <Save className="w-4 h-4 text-green-400" />
              <span className="text-sm text-gray-300 font-medium">Processed Result:</span>
            </div>
            <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 text-white text-sm whitespace-pre-wrap max-h-[200px] overflow-y-auto">
              {processedResult}
            </div>
          </div>
        )}

        <div className="text-xs text-gray-400">
          Supported formats: .txt, .md, .csv, .json, .xml, .log
        </div>
      </div>
    </div>
  );
};
