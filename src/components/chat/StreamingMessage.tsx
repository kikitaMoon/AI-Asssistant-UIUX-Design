import React, { useState, useEffect } from 'react';
import { Bot, User, Eye, EyeOff, Brain, Clock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface StreamingMessageProps {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
  thinking?: string;
  status?: 'processing' | 'thinking' | 'completed' | 'error';
  progress?: number;
  steps?: { step: string; completed: boolean; current: boolean }[];
  onRetry?: () => void;
}

export const StreamingMessage: React.FC<StreamingMessageProps> = ({
  id,
  role,
  content,
  timestamp,
  isStreaming = false,
  thinking,
  status = 'completed',
  progress,
  steps,
  onRetry
}) => {
  const [displayedContent, setDisplayedContent] = useState('');
  const [showThinking, setShowThinking] = useState(false);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);

  // Streaming text effect
  useEffect(() => {
    if (isStreaming && currentCharIndex < content.length) {
      const timer = setTimeout(() => {
        setDisplayedContent(content.substring(0, currentCharIndex + 1));
        setCurrentCharIndex(prev => prev + 1);
      }, 30); // Adjust speed as needed
      
      return () => clearTimeout(timer);
    } else if (!isStreaming) {
      setDisplayedContent(content);
    }
  }, [isStreaming, content, currentCharIndex]);

  const getStatusBadge = () => {
    switch (status) {
      case 'processing':
        return (
          <Badge variant="secondary" className="text-xs">
            Processing
          </Badge>
        );
      case 'thinking':
        return (
          <Badge variant="secondary" className="text-xs">
            Thinking
          </Badge>
        );
      case 'error':
        return (
          <Badge variant="destructive" className="text-xs">
            Error
          </Badge>
        );
      default:
        return null;
    }
  };

  const getStatusIcon = () => {
    if (role === 'user') {
      return <User className="w-4 h-4 text-muted-foreground flex-shrink-0" />;
    }
    return <Bot className="w-4 h-4 text-muted-foreground flex-shrink-0" />;
  };

  return (
    <div className={`group mb-6 animate-fade-in ${role === 'user' ? 'text-right' : 'text-left'}`}>
      <div className={`inline-block max-w-[85%] ${role === 'user' ? 'ml-auto' : 'mr-auto'}`}>
        {/* Message header with status */}
        <div className={`flex items-center gap-2 mb-2 ${role === 'user' ? 'justify-end' : 'justify-start'}`}>
          {role === 'assistant' && getStatusIcon()}
          <span className="text-xs text-muted-foreground">
            {role === 'user' ? 'You' : 'Assistant'}
          </span>
          {getStatusBadge()}
          <span className="text-xs text-muted-foreground">
            {timestamp.toLocaleTimeString()}
          </span>
        </div>

        {/* Thinking Process */}
        {(thinking || steps) && role === 'assistant' && (
          <div className="mb-3">
            <Collapsible open={showThinking} onOpenChange={setShowThinking}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-sm text-muted-foreground hover:text-foreground p-1 h-auto"
                >
                  {showThinking ? 'Hide steps' : 'Show steps'}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2">
                <div className="border rounded p-3 space-y-3 bg-muted/50">
                  {/* Step-by-step process */}
                  {steps && (
                    <div className="space-y-2">
                      {steps.map((step, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs mt-0.5 ${
                            step.completed ? 'bg-primary text-primary-foreground' : 
                            step.current ? 'bg-secondary text-secondary-foreground' : 
                            'bg-muted text-muted-foreground'
                          }`}>
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <div className={`text-sm ${
                              step.completed ? 'text-foreground' : 
                              step.current ? 'text-foreground' : 
                              'text-muted-foreground'
                            }`}>
                              {step.step}
                            </div>
                            {(step.current || step.completed) && thinking && (
                              <div className="mt-1 text-xs text-muted-foreground bg-background/50 rounded p-2">
                                {thinking.split('\n').slice(index * 2, (index + 1) * 2).join('\n') || 
                                 `Processing ${step.step.toLowerCase()}...`}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Simple thinking display if no steps */}
                  {thinking && !steps && (
                    <div className="text-sm text-muted-foreground bg-background/50 rounded p-2">
                      {thinking}
                    </div>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        )}

        {/* Main message content */}
        <div className={`relative rounded p-3 ${
          role === 'user' 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-muted border'
        }`}>
          {/* Streaming cursor */}
          <div className="whitespace-pre-wrap">
            {displayedContent}
            {isStreaming && (
              <span className="inline-block w-2 h-5 bg-blue-400 animate-pulse ml-1" />
            )}
          </div>
          
          {/* Error retry button */}
          {status === 'error' && onRetry && (
            <div className="mt-3 pt-3 border-t border-gray-600">
              <Button
                onClick={onRetry}
                size="sm"
                variant="outline"
                className="text-red-400 border-red-500/50 hover:bg-red-500/10"
              >
                <AlertCircle className="w-3 h-3 mr-1" />
                Retry
              </Button>
            </div>
          )}
        </div>

        {/* Message actions (visible on hover) */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 mt-1 flex gap-1">
          {role === 'assistant' && status === 'completed' && (
            <Button size="sm" variant="ghost" className="h-6 px-2 text-xs text-gray-400 hover:text-gray-200">
              Copy
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};