
import React from 'react';
import { Save } from 'lucide-react';

interface ProcessedTextResultProps {
  result: string;
  timestamp: Date;
}

export const ProcessedTextResult = ({ result, timestamp }: ProcessedTextResultProps) => {
  return (
    <div className="mb-4">
      <div className="inline-block max-w-[80%] bg-gray-700 text-gray-100 p-3 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Save className="w-4 h-4 text-green-400" />
          <span className="text-sm text-gray-300 font-medium">Processed Text Result:</span>
        </div>
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 text-white text-sm whitespace-pre-wrap max-h-[300px] overflow-y-auto">
          {result}
        </div>
        <div className="text-xs text-gray-400 mt-1">
          {timestamp.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};
