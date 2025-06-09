
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
      <div className="max-w-[80%] bg-card p-4 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Save className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span className="text-sm text-muted-foreground font-medium">Processed Text Result</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onEdit}
            className="text-muted-foreground hover:text-foreground hover:bg-accent h-7 w-7"
            title="Edit"
          >
            <Edit className="w-3 h-3" />
          </Button>
        </div>
        <div className="bg-muted rounded p-3 text-foreground text-sm whitespace-pre-wrap max-h-[300px] overflow-y-auto">
          {result}
        </div>
        <div className="text-xs text-muted-foreground mt-2">
          {timestamp.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};
