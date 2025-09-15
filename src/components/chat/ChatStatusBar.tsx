import React from 'react';
import { Bot, Wifi, WifiOff, Zap, Clock, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ChatStatusBarProps {
  isConnected: boolean;
  currentModel: string;
  responseTime?: number;
  tokensUsed?: number;
  status: 'idle' | 'thinking' | 'responding' | 'processing';
}

export const ChatStatusBar: React.FC<ChatStatusBarProps> = ({
  isConnected,
  currentModel,
  responseTime,
  tokensUsed,
  status
}) => {
  const getStatusInfo = () => {
    switch (status) {
      case 'thinking':
        return { icon: Clock, text: 'Analyzing your request...', color: 'text-purple-400' };
      case 'responding':
        return { icon: Zap, text: 'Generating response...', color: 'text-blue-400' };
      case 'processing':
        return { icon: Bot, text: 'Processing...', color: 'text-orange-400' };
      default:
        return { icon: CheckCircle, text: 'Ready', color: 'text-green-400' };
    }
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  return (
    <div className="border-t border-gray-700 bg-gray-800/50 backdrop-blur-sm px-4 py-2">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          {/* Connection status */}
          <div className="flex items-center gap-1">
            {isConnected ? (
              <Wifi className="w-3 h-3 text-green-400" />
            ) : (
              <WifiOff className="w-3 h-3 text-red-400" />
            )}
            <span className={isConnected ? 'text-green-400' : 'text-red-400'}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>

          {/* Current status */}
          <div className="flex items-center gap-1">
            <StatusIcon className={`w-3 h-3 ${statusInfo.color} ${status !== 'idle' ? 'animate-pulse' : ''}`} />
            <span className={statusInfo.color}>{statusInfo.text}</span>
          </div>

          {/* Model info */}
          <Badge variant="outline" className="text-xs border-gray-600 text-gray-400">
            <Bot className="w-3 h-3 mr-1" />
            {currentModel}
          </Badge>
        </div>

        <div className="flex items-center gap-4 text-gray-500">
          {/* Performance metrics */}
          {responseTime && (
            <span className="text-xs">
              Response: {responseTime}ms
            </span>
          )}
          {tokensUsed && (
            <span className="text-xs">
              Tokens: {tokensUsed.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};