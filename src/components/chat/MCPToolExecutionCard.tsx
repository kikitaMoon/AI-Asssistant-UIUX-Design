import React from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  ExternalLink,
  Copy,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { MCPToolRequest, MCPInteractionState } from './MCPInteractionPanel';

interface MCPToolExecutionCardProps {
  toolRequest: MCPToolRequest;
  interactionState: MCPInteractionState;
  onCopyResult?: () => void;
  onDownloadResult?: () => void;
  onViewDetails?: () => void;
  className?: string;
}

export const MCPToolExecutionCard: React.FC<MCPToolExecutionCardProps> = ({
  toolRequest,
  interactionState,
  onCopyResult,
  onDownloadResult,
  onViewDetails,
  className
}) => {
  const getStatusBadge = () => {
    switch (interactionState.status) {
      case 'completed':
        return (
          <Badge className="bg-mcp-success/20 text-mcp-success border-mcp-success/30">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        );
      case 'error':
        return (
          <Badge className="bg-mcp-error/20 text-mcp-error border-mcp-error/30">
            <XCircle className="w-3 h-3 mr-1" />
            Failed
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge className="bg-muted text-muted-foreground border-muted-foreground/30">
            <XCircle className="w-3 h-3 mr-1" />
            Cancelled
          </Badge>
        );
      default:
        return (
          <Badge className="bg-mcp-request/20 text-mcp-request-foreground border-mcp-request/30">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
    }
  };

  const getDuration = () => {
    if (!interactionState.startTime || !interactionState.endTime) return null;
    const duration = Math.round((interactionState.endTime.getTime() - interactionState.startTime.getTime()) / 1000);
    return `${duration}s`;
  };

  return (
    <div className={cn(
      "relative overflow-hidden rounded-lg border transition-all duration-200 hover:shadow-md",
      "bg-card border-border",
      className
    )}>
      <div className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium text-sm text-foreground truncate">
                {toolRequest.toolName}
              </h4>
              {getStatusBadge()}
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {toolRequest.description}
            </p>
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-1">
            {onViewDetails && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onViewDetails}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
              >
                <ExternalLink className="w-3 h-3" />
              </Button>
            )}
            {interactionState.result?.success && onCopyResult && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onCopyResult}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
              >
                <Copy className="w-3 h-3" />
              </Button>
            )}
            {interactionState.result?.success && onDownloadResult && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onDownloadResult}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
              >
                <Download className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>

        {/* Result Summary */}
        {interactionState.result && (
          <div className="space-y-2">
            {interactionState.result.success ? (
              <div className="text-xs text-mcp-success">
                ✓ Tool executed successfully
                {interactionState.result.data && (
                  <div className="mt-1 text-muted-foreground">
                    {typeof interactionState.result.data === 'string' 
                      ? interactionState.result.data.substring(0, 100) + (interactionState.result.data.length > 100 ? '...' : '')
                      : `${Object.keys(interactionState.result.data).length} properties returned`
                    }
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-xs text-mcp-error">
                  <AlertTriangle className="w-3 h-3" />
                  Execution failed
                </div>
                {interactionState.result.error && (
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {interactionState.result.error}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border pt-2">
          <div className="flex items-center gap-3">
            {toolRequest.category && (
              <span className="capitalize">{toolRequest.category}</span>
            )}
            {toolRequest.riskLevel && (
              <span className={cn(
                "capitalize",
                toolRequest.riskLevel === 'high' && "text-mcp-error",
                toolRequest.riskLevel === 'medium' && "text-mcp-warning"
              )}>
                {toolRequest.riskLevel} risk
              </span>
            )}
          </div>
          {getDuration() && (
            <span>{getDuration()}</span>
          )}
        </div>
      </div>
    </div>
  );
};