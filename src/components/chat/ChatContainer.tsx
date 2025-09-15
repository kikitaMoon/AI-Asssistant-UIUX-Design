import React, { useEffect, useRef } from 'react';
import { StreamingMessage } from './StreamingMessage';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
  thinking?: string;
  status?: 'processing' | 'thinking' | 'completed' | 'error';
  progress?: number;
  steps?: { step: string; completed: boolean; current: boolean }[];
}

interface ChatContainerProps {
  messages: ChatMessage[];
  isLoading?: boolean;
  onRetryMessage?: (messageId: string) => void;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({
  messages,
  isLoading,
  onRetryMessage
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className="max-w-md mx-auto">
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              Start a Conversation
            </h3>
            <p className="text-gray-500 mb-6">
              Ask me anything or choose from the suggested questions below.
            </p>
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message) => (
            <StreamingMessage
              key={message.id}
              id={message.id}
              role={message.role}
              content={message.content}
              timestamp={message.timestamp}
              isStreaming={message.isStreaming}
              thinking={message.thinking}
              status={message.status}
              progress={message.progress}
              steps={message.steps}
              onRetry={() => onRetryMessage?.(message.id)}
            />
          ))}
          
          {/* Loading indicator for new message */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-700 border border-gray-600 rounded-lg p-4 max-w-[85%]">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <span className="text-sm text-gray-400 ml-2">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};