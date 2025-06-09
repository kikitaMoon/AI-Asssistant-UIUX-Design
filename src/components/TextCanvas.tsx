
import React, { useState, useRef } from 'react';
import { Upload, X, Save, Type } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface TextCanvasProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TextCanvas = ({ isOpen, onClose }: TextCanvasProps) => {
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

  const handleSave = () => {
    console.log('Saving text content:', content);
    // Here you would typically save the content or send it to the chat
  };

  const handleClear = () => {
    setContent('');
    setFileName('');
  };

  if (!isOpen) return null;

  return (
    <div className="bg-[#303030] rounded-lg border border-gray-600 p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
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
          className="text-gray-400 hover:text-white hover:bg-gray-600"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-4">
        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.md,.csv,.json,.xml,.log"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Text File
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSave}
            disabled={!content.trim()}
            className="bg-blue-600 border-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-600 disabled:border-gray-600"
          >
            <Save className="w-4 h-4 mr-2" />
            Process Text
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClear}
            className="bg-red-600 border-red-600 text-white hover:bg-red-700"
          >
            Clear
          </Button>
        </div>

        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type, paste, or upload your text content here..."
          className="min-h-[200px] bg-gray-800 border-gray-600 text-white placeholder-gray-400 resize-none"
          rows={8}
        />

        <div className="text-xs text-gray-400">
          Supported formats: .txt, .md, .csv, .json, .xml, .log
        </div>
      </div>
    </div>
  );
};
