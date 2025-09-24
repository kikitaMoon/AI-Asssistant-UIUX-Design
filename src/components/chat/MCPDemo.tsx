import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MCPInteractionPanel, MCPToolRequest, MCPInteractionState } from './MCPInteractionPanel';
import { MCPToolExecutionCard } from './MCPToolExecutionCard';

export const MCPDemo: React.FC = () => {
  const [currentDemo, setCurrentDemo] = useState<'request' | 'execution' | 'completed' | null>(null);
  const [executionHistory, setExecutionHistory] = useState<Array<{
    request: MCPToolRequest;
    state: MCPInteractionState;
  }>>([]);

  const sampleToolRequest: MCPToolRequest = {
    id: 'demo-tool-1',
    toolName: 'file_search',
    description: 'Search through project files to find specific patterns or content',
    category: 'file',
    riskLevel: 'low',
    estimatedTime: '2-3 seconds',
    parameters: {
      query: 'useState',
      fileTypes: ['.tsx', '.ts'],
      maxResults: 10
    }
  };

  const requestState: MCPInteractionState = {
    status: 'requesting'
  };

  const executionState: MCPInteractionState = {
    status: 'executing',
    progress: 65,
    currentStep: 'Scanning file system...',
    startTime: new Date(Date.now() - 2000)
  };

  const completedState: MCPInteractionState = {
    status: 'completed',
    startTime: new Date(Date.now() - 5000),
    endTime: new Date(Date.now() - 1000),
    result: {
      success: true,
      data: {
        matches: [
          { file: 'src/components/Chat.tsx', line: 15, context: 'const [messages, setMessages] = useState([]);' },
          { file: 'src/hooks/useAuth.tsx', line: 8, context: 'const [user, setUser] = useState(null);' }
        ],
        totalFiles: 47,
        totalMatches: 12
      }
    }
  };

  const handleApprove = () => {
    setCurrentDemo('execution');
    setTimeout(() => {
      setCurrentDemo('completed');
      setExecutionHistory(prev => [...prev, {
        request: sampleToolRequest,
        state: completedState
      }]);
    }, 3000);
  };

  const handleDeny = () => {
    setCurrentDemo(null);
  };

  const startDemo = () => {
    setCurrentDemo('request');
  };

  const resetDemo = () => {
    setCurrentDemo(null);
    setExecutionHistory([]);
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold">MCP Tool Interaction Demo</h2>
        <p className="text-sm text-muted-foreground">
          Experience Claude-style tool interaction flow with confirmation, execution, and results
        </p>
      </div>

      <div className="flex gap-2 justify-center">
        <Button onClick={startDemo} disabled={currentDemo !== null}>
          Start Demo
        </Button>
        <Button onClick={resetDemo} variant="outline">
          Reset
        </Button>
      </div>

      {/* Current Interaction */}
      {currentDemo && (
        <div className="space-y-4">
          <h3 className="font-medium text-center">Current Interaction</h3>
          <MCPInteractionPanel
            toolRequest={sampleToolRequest}
            interactionState={
              currentDemo === 'request' ? requestState :
              currentDemo === 'execution' ? executionState :
              completedState
            }
            onApprove={handleApprove}
            onDeny={handleDeny}
          />
        </div>
      )}

      {/* Execution History */}
      {executionHistory.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-medium text-center">Execution History</h3>
          <div className="space-y-3">
            {executionHistory.map((item, index) => (
              <MCPToolExecutionCard
                key={index}
                toolRequest={item.request}
                interactionState={item.state}
                onCopyResult={() => {
                  navigator.clipboard.writeText(JSON.stringify(item.state.result?.data, null, 2));
                }}
                onViewDetails={() => {
                  console.log('View details:', item);
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Usage Guide */}
      <div className="bg-muted/50 rounded-lg p-4 text-sm space-y-2">
        <h4 className="font-medium">How it works:</h4>
        <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
          <li>AI requests permission to use an external tool</li>
          <li>User sees tool details with risk assessment</li>
          <li>User approves or denies the request</li>
          <li>If approved, tool executes with progress indication</li>
          <li>Results are displayed with action options</li>
          <li>Execution history is maintained for reference</li>
        </ol>
      </div>
    </Card>
  );
};