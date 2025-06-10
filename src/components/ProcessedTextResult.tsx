
import React, { useState } from 'react';
import { Save, Edit, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProcessedTextResultProps {
  result: string;
  timestamp: Date;
  onEdit: () => void;
}

export const ProcessedTextResult = ({ result, timestamp, onEdit }: ProcessedTextResultProps) => {
  const [isMaximized, setIsMaximized] = useState(false);

  // Function to detect and wrap entities with links
  const renderTextWithLinks = (text: string) => {
    // Simple regex patterns for common entities
    const patterns = [
      { regex: /\b(https?:\/\/[^\s]+)\b/g, type: 'url' },
      { regex: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, type: 'email' },
      { regex: /\b(?:React|TypeScript|JavaScript|CSS|HTML|Node\.js|Python|SQL)\b/g, type: 'technology' },
      { regex: /\b(?:API|REST|GraphQL|JWT|OAuth|HTTPS)\b/g, type: 'concept' },
    ];

    let processedText = text;
    let linkIndex = 0;

    patterns.forEach(({ regex, type }) => {
      processedText = processedText.replace(regex, (match) => {
        linkIndex++;
        return `<a href="#" class="text-blue-400 hover:text-blue-300 underline" title="${type}: ${match}" data-entity="${match}" data-type="${type}">${match}</a>`;
      });
    });

    return { __html: processedText };
  };

  const handleEntityClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'A' && target.dataset.entity) {
      e.preventDefault();
      console.log('Entity clicked:', target.dataset.entity, 'Type:', target.dataset.type);
      // Here you could open a modal, search, or navigate to relevant information
    }
  };

  return (
    <div className={`mb-4 transition-all duration-300 ${isMaximized ? 'fixed inset-4 z-50 bg-background/95 backdrop-blur-sm rounded-lg' : ''}`}>
      <div className={`${isMaximized ? 'h-full flex flex-col' : 'max-w-[80%]'} bg-card border border-border/20 rounded-lg shadow-sm`}>
        <div className="flex items-center justify-between p-4 border-b border-border/20">
          <div className="flex items-center gap-2">
            <Save className="w-4 h-4 text-green-400" />
            <span className="text-sm text-muted-foreground font-medium">Processed Text Result</span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMaximized(!isMaximized)}
              className="text-muted-foreground hover:text-foreground hover:bg-accent h-7 w-7"
              title={isMaximized ? "Minimize" : "Maximize"}
            >
              {isMaximized ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
            </Button>
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
        </div>
        <div 
          className={`bg-muted/20 p-4 text-foreground text-sm whitespace-pre-wrap ${isMaximized ? 'flex-1 overflow-y-auto' : 'max-h-[300px] overflow-y-auto'}`}
          dangerouslySetInnerHTML={renderTextWithLinks(result)}
          onClick={handleEntityClick}
        />
        <div className="text-xs text-muted-foreground p-4 pt-2 border-t border-border/10">
          {timestamp.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};
