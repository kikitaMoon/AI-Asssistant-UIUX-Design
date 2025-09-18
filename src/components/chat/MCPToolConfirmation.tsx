import React from 'react';
import { Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface MCPToolRequest {
  toolName: string;
  description: string;
  parameters?: Record<string, any>;
  riskLevel?: 'low' | 'medium' | 'high';
}

interface MCPToolConfirmationProps {
  isOpen: boolean;
  toolRequest?: MCPToolRequest;
  onConfirm: () => void;
  onCancel: () => void;
}

export const MCPToolConfirmation: React.FC<MCPToolConfirmationProps> = ({
  isOpen,
  toolRequest,
  onConfirm,
  onCancel,
}) => {
  if (!toolRequest) return null;

  const getRiskColor = (risk: string = 'low') => {
    switch (risk) {
      case 'high': return 'text-destructive';
      case 'medium': return 'text-warning';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Wrench className="w-4 h-4" />
            Tool Permission Required
          </AlertDialogTitle>
          <AlertDialogDescription className="text-left space-y-3">
            <p>The AI wants to use an external tool:</p>
            
            <div className="bg-muted rounded p-3 space-y-2">
              <div className="font-medium">{toolRequest.toolName}</div>
              <div className="text-sm text-muted-foreground">
                {toolRequest.description}
              </div>
              {toolRequest.riskLevel && (
                <div className={`text-xs ${getRiskColor(toolRequest.riskLevel)}`}>
                  Risk Level: {toolRequest.riskLevel.toUpperCase()}
                </div>
              )}
            </div>

            {toolRequest.parameters && Object.keys(toolRequest.parameters).length > 0 && (
              <div className="text-xs">
                <div className="font-medium mb-1">Parameters:</div>
                <div className="bg-background rounded p-2 font-mono">
                  {Object.entries(toolRequest.parameters).map(([key, value]) => (
                    <div key={key} className="truncate">
                      {key}: {String(value)}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>
            Deny
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            Allow
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};