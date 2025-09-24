import React from 'react';
import { MCPInteractionPanel, MCPToolRequest, MCPInteractionState } from './MCPInteractionPanel';
import {
  AlertDialog,
  AlertDialogContent,
} from '@/components/ui/alert-dialog';

// Interface moved to MCPInteractionPanel

interface MCPToolConfirmationProps {
  isOpen: boolean;
  toolRequest?: {
    toolName: string;
    description: string;
    parameters?: Record<string, any>;
    riskLevel?: 'low' | 'medium' | 'high';
  };
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

  const mcpRequest: MCPToolRequest = {
    id: 'confirmation',
    toolName: toolRequest.toolName,
    description: toolRequest.description,
    parameters: toolRequest.parameters,
    riskLevel: toolRequest.riskLevel
  };

  const interactionState: MCPInteractionState = {
    status: 'requesting'
  };

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="max-w-lg border-0 bg-transparent shadow-none p-0">
        <MCPInteractionPanel
          toolRequest={mcpRequest}
          interactionState={interactionState}
          onApprove={onConfirm}
          onDeny={onCancel}
        />
      </AlertDialogContent>
    </AlertDialog>
  );
};