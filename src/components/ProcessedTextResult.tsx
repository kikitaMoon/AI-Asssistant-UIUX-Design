
import React, { useState } from 'react';
import { Save, Edit, Maximize, Minimize } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProcessedTextResultProps {
  result: string;
  timestamp: Date;
  onEdit: () => void;
}

export const ProcessedTextResult = ({ result, timestamp, onEdit }: ProcessedTextResultProps) => {
  const [isMaximized, setIsMaximized] = useState(false);

  // Function to detect and linkify entities (places, organizations, etc.)
  const linkifyEntities = (text: string) => {
    // Common patterns for entities that should be hyperlinked
    const patterns = [
      // Cities and places
      /\b(New York|Paris|London|Tokyo|Berlin|Sydney|Rome|Madrid|Amsterdam|Vienna|Prague|Barcelona|Venice|Athens|Dubai|Beijing|Delhi|Kyoto|Lisbon)\b/gi,
      // Countries
      /\b(USA|United States|France|Germany|Japan|Australia|Italy|Spain|Netherlands|Austria|Czech Republic|Greece|UAE|China|India|Portugal)\b/gi,
      // Famous landmarks and attractions
      /\b(Eiffel Tower|Great Wall|Colosseum|Big Ben|Statue of Liberty|Times Square|Central Park|Louvre|Notre Dame|Brandenburg Gate)\b/gi,
    ];

    let processedText = text;
    
    patterns.forEach(pattern => {
      processedText = processedText.replace(pattern, (match) => {
        const searchQuery = encodeURIComponent(match);
        return `<a href="https://www.google.com/search?q=${searchQuery}" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300 underline">${match}</a>`;
      });
    });

    return processedText;
  };

  return (
    <div className={`mb-4 ${isMaximized ? 'fixed inset-0 z-50 bg-background/95 backdrop-blur-sm p-4' : ''}`}>
      <div className={`${isMaximized ? 'h-full' : 'max-w-[80%]'} bg-gray-800 p-4 rounded-lg ${isMaximized ? 'flex flex-col' : ''}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Save className="w-4 h-4 text-green-400" />
            <span className="text-sm text-gray-300 font-medium">Processed Text Result</span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMaximized(!isMaximized)}
              className="text-gray-400 hover:text-white hover:bg-gray-700 h-7 w-7"
              title={isMaximized ? "Minimize" : "Maximize"}
            >
              {isMaximized ? <Minimize className="w-3 h-3" /> : <Maximize className="w-3 h-3" />}
            </Button>
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
        </div>
        <div 
          className={`bg-gray-900 rounded p-3 text-white text-sm whitespace-pre-wrap overflow-y-auto ${
            isMaximized ? 'flex-1' : 'max-h-[300px]'
          }`}
          dangerouslySetInnerHTML={{ __html: linkifyEntities(result) }}
        />
        <div className="text-xs text-gray-500 mt-2">
          {timestamp.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};
