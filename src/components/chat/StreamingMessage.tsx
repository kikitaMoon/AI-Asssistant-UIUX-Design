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
          <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
            Processing
          </Badge>
        );
      case 'thinking':
        return (
          <Badge variant="secondary" className="bg-purple-500/20 text-purple-400 border-purple-500/30">
            <Brain className="w-3 h-3 mr-1 animate-pulse" />
            Thinking
          </Badge>
        );
      case 'completed':
        return (
          <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        );
      case 'error':
        return (
          <Badge variant="secondary" className="bg-red-500/20 text-red-400 border-red-500/30">
            <AlertCircle className="w-3 h-3 mr-1" />
            Error
          </Badge>
        );
      default:
        return null;
    }
  };

  const getStatusIcon = () => {
    if (role === 'user') {
      return <User className="w-4 h-4 text-blue-400 flex-shrink-0" />;
    }
    
    switch (status) {
      case 'thinking':
        return <Brain className="w-4 h-4 text-purple-400 flex-shrink-0 animate-pulse" />;
      case 'processing':
        return <Loader2 className="w-4 h-4 text-blue-400 flex-shrink-0 animate-spin" />;
      default:
        return <Bot className="w-4 h-4 text-green-400 flex-shrink-0" />;
    }
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

        {/* Integrated Progress & Thinking Process */}
        {((progress !== undefined && steps) || thinking) && role === 'assistant' && (
          <div className="mb-3">
            <Collapsible open={showThinking} onOpenChange={setShowThinking}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 p-2 h-auto w-full justify-start"
                >
                  <Brain className="w-3 h-3 mr-1" />
                  <span className="text-xs mr-2">
                    {showThinking ? 'Hide reasoning process' : 'Show reasoning process'}
                  </span>
                  {progress !== undefined && (
                    <span className="text-xs text-gray-400 ml-auto mr-2">
                      {Math.round(progress)}%
                    </span>
                  )}
                  {showThinking ? (
                    <EyeOff className="w-3 h-3" />
                  ) : (
                    <Eye className="w-3 h-3" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2">
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4 space-y-4">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-purple-300 flex items-center gap-1">
                      <Brain className="w-3 h-3" />
                      AI Reasoning Process
                    </div>
                    {progress !== undefined && (
                      <div className="text-xs text-purple-400">
                        {Math.round(progress)}% Complete
                      </div>
                    )}
                  </div>


                  {/* Step-by-step thinking process */}
                  {steps && (
                    <div className="space-y-3">
                      {steps.map((step, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center gap-2">
                            {step.completed ? (
                              <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                            ) : step.current ? (
                              <Loader2 className="w-4 h-4 text-blue-400 animate-spin flex-shrink-0" />
                            ) : (
                              <Clock className="w-4 h-4 text-gray-500 flex-shrink-0" />
                            )}
                            <span className={`text-sm font-medium ${
                              step.completed ? 'text-green-400' : 
                              step.current ? 'text-blue-400' : 
                              'text-gray-500'
                            }`}>
                              Step {index + 1}: {step.step}
                            </span>
                          </div>
                          
                          {/* Show thinking for current or completed steps */}
                          {(step.current || step.completed) && thinking && (
                            <div className="ml-6 pl-4 border-l-2 border-purple-500/30">
                              <div className="text-xs text-gray-400 mb-1">Reasoning:</div>
                              <div className="text-sm text-gray-300 bg-gray-800/50 rounded p-2 font-mono text-xs leading-relaxed">
                                {thinking.split('\n').slice(index * 2, (index + 1) * 2).join('\n') || 
                                 `Analyzing ${step.step.toLowerCase()}...`}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Full thinking process if no steps */}
                  {thinking && !steps && (
                    <div className="space-y-2">
                      <div className="text-xs text-gray-400">Complete reasoning process:</div>
                      <div className="text-sm text-gray-300 bg-gray-800/50 rounded p-3 font-mono text-xs leading-relaxed whitespace-pre-wrap">
                        {thinking}
                      </div>
                    </div>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        )}

        {/* Main message content */}
        <div className={`relative rounded-lg p-4 ${
          role === 'user' 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-700 text-gray-100 border border-gray-600'
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