
import React from 'react';
import { Save, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProcessedTextResultProps {
  result: string;
  timestamp: Date;
  onEdit: () => void;
}

export const ProcessedTextResult = ({ result, timestamp, onEdit }: ProcessedTextResultProps) => {
  return (
    <div className="mb-4">
      <div className="max-w-[80%] bg-gray-800 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Save className="w-4 h-4 text-green-400" />
            <span className="text-sm text-gray-300 font-medium">Processed Text Result</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onEdit}
            className="text-gray-400 hover:text-white hover:bg-gray-700 h-7 w-7"
            title="Edit"
          >
            <Edit className="w-3 h-3" />
          </Button>
        </div>
        <div className="bg-gray-900 rounded p-3 text-white text-sm whitespace-pre-wrap max-h-[300px] overflow-y-auto">
          {result}
        </div>
        <div className="text-xs text-gray-500 mt-2">
          {timestamp.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};
