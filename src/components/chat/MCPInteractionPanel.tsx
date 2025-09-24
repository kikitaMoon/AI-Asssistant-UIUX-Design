import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Loader2,
  ChevronDown,
  ChevronRight,
  Terminal,
  Database,
  Globe,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

export interface MCPToolRequest {
  id: string;
  toolName: string;
  description: string;
  parameters?: Record<string, any>;
  riskLevel?: 'low' | 'medium' | 'high';
  category?: 'system' | 'database' | 'network' | 'file';
  estimatedTime?: string;
}

export interface MCPInteractionState {
  status: 'idle' | 'requesting' | 'executing' | 'completed' | 'error' | 'cancelled';
  progress?: number;
  currentStep?: string;
  result?: {
    success: boolean;
    data?: any;
    error?: string;
  };
  startTime?: Date;
  endTime?: Date;
}

interface MCPInteractionPanelProps {
  toolRequest: MCPToolRequest;
  interactionState: MCPInteractionState;
  onApprove: () => void;
  onDeny: () => void;
  onCancel?: () => void;
  className?: string;
}

const getToolIcon = (category?: string) => {
  switch (category) {
    case 'system': return Settings;
    case 'database': return Database;
    case 'network': return Globe;
    case 'file': return FileText;
    default: return Terminal;
  }
};

const getRiskColor = (risk: string = 'low') => {
  switch (risk) {
    case 'high': return 'bg-mcp-error text-white';
    case 'medium': return 'bg-mcp-warning text-black';
    default: return 'bg-mcp-request text-mcp-request-foreground';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return 'text-mcp-success';
    case 'error': return 'text-mcp-error';
    case 'executing': return 'text-mcp-progress';
    case 'cancelled': return 'text-muted-foreground';
    default: return 'text-mcp-request-foreground';
  }
};

export const MCPInteractionPanel: React.FC<MCPInteractionPanelProps> = ({
  toolRequest,
  interactionState,
  onApprove,
  onDeny,
  onCancel,
  className
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [animationPhase, setAnimationPhase] = useState<'entering' | 'stable' | 'exiting'>('entering');

  const ToolIcon = getToolIcon(toolRequest.category);

  useEffect(() => {
    setAnimationPhase('stable');
  }, []);

  const renderRequestPhase = () => (
    <div className={cn(
      "relative overflow-hidden rounded-xl border transition-all duration-300",
      "bg-glass-bg backdrop-blur-md border-glass-border shadow-lg shadow-glass-shadow",
      animationPhase === 'entering' && "animate-bounce-in"
    )}>
      {/* Glass shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-glass-shimmer" />
      
      <div className="relative p-4 space-y-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 p-2 rounded-lg bg-mcp-request/20">
            <ToolIcon className="w-5 h-5 text-mcp-progress" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-foreground truncate">
                {toolRequest.toolName}
              </h3>
              <Badge className={getRiskColor(toolRequest.riskLevel)} variant="secondary">
                {toolRequest.riskLevel?.toUpperCase() || 'LOW'} RISK
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {toolRequest.description}
            </p>
            {toolRequest.estimatedTime && (
              <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>Est. {toolRequest.estimatedTime}</span>
              </div>
            )}
          </div>
        </div>

        {/* Parameters */}
        {toolRequest.parameters && Object.keys(toolRequest.parameters).length > 0 && (
          <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="w-full justify-between p-2 h-auto">
                <span className="text-sm font-medium">Parameters</span>
                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2">
              <div className="bg-muted/50 rounded-lg p-3 font-mono text-xs space-y-1">
                {Object.entries(toolRequest.parameters).map(([key, value]) => (
                  <div key={key} className="flex gap-2">
                    <span className="text-mcp-progress font-semibold min-w-0 truncate">{key}:</span>
                    <span className="text-foreground break-all">{JSON.stringify(value)}</span>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2 border-t border-border/50">
          <Button
            onClick={onDeny}
            variant="outline"
            size="sm"
            className="flex-1 border-border/50 hover:border-mcp-error hover:text-mcp-error"
          >
            <XCircle className="w-4 h-4 mr-2" />
            Deny
          </Button>
          <Button
            onClick={onApprove}
            size="sm"
            className="flex-1 bg-mcp-progress hover:bg-mcp-progress/90 text-white"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Approve
          </Button>
        </div>
      </div>
    </div>
  );

  const renderExecutionPhase = () => (
    <div className={cn(
      "relative overflow-hidden rounded-xl border transition-all duration-300",
      "bg-glass-bg backdrop-blur-md border-glass-border shadow-lg shadow-glass-shadow"
    )}>
      <div className="relative p-4 space-y-4">
        {/* Header with status */}
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 p-2 rounded-lg bg-mcp-progress/20">
            {interactionState.status === 'executing' ? (
              <Loader2 className="w-5 h-5 text-mcp-progress animate-spin" />
            ) : interactionState.status === 'completed' ? (
              <CheckCircle className="w-5 h-5 text-mcp-success" />
            ) : (
              <XCircle className="w-5 h-5 text-mcp-error" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground">{toolRequest.toolName}</h3>
            <p className={cn("text-sm font-medium", getStatusColor(interactionState.status))}>
              {interactionState.status === 'executing' && 'Executing tool...'}
              {interactionState.status === 'completed' && 'Execution completed'}
              {interactionState.status === 'error' && 'Execution failed'}
              {interactionState.status === 'cancelled' && 'Execution cancelled'}
            </p>
          </div>
          {interactionState.status === 'executing' && onCancel && (
            <Button
              onClick={onCancel}
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-mcp-error"
            >
              Cancel
            </Button>
          )}
        </div>

        {/* Progress */}
        {interactionState.status === 'executing' && (
          <div className="space-y-2">
            {interactionState.progress !== undefined && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Progress</span>
                  <span>{Math.round(interactionState.progress)}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-mcp-progress transition-all duration-300 rounded-full"
                    style={{ width: `${interactionState.progress}%` }}
                  />
                </div>
              </div>
            )}
            {interactionState.currentStep && (
              <p className="text-sm text-muted-foreground">
                {interactionState.currentStep}
              </p>
            )}
          </div>
        )}

        {/* Result */}
        {interactionState.result && (
          <div className={cn(
            "rounded-lg p-3 text-sm",
            interactionState.result.success 
              ? "bg-mcp-success/10 border border-mcp-success/20" 
              : "bg-mcp-error/10 border border-mcp-error/20"
          )}>
            {interactionState.result.success ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-mcp-success font-medium">
                  <CheckCircle className="w-4 h-4" />
                  Tool executed successfully
                </div>
                {interactionState.result.data && (
                  <pre className="text-xs bg-background/50 rounded p-2 overflow-auto">
                    {JSON.stringify(interactionState.result.data, null, 2)}
                  </pre>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-mcp-error font-medium">
                  <AlertTriangle className="w-4 h-4" />
                  Tool execution failed
                </div>
                {interactionState.result.error && (
                  <p className="text-mcp-error text-xs">
                    {interactionState.result.error}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Timing */}
        {interactionState.startTime && (
          <div className="text-xs text-muted-foreground">
            Started: {interactionState.startTime.toLocaleTimeString()}
            {interactionState.endTime && (
              <span className="ml-4">
                Duration: {Math.round((interactionState.endTime.getTime() - interactionState.startTime.getTime()) / 1000)}s
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className={cn("w-full max-w-md mx-auto", className)}>
      {interactionState.status === 'requesting' ? renderRequestPhase() : renderExecutionPhase()}
    </div>
  );
};