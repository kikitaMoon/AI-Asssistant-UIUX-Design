
import React, { useState } from 'react';
import { Send, Mic, Paperclip, Smile, Settings, Moon, Sun, Bot, Zap, Brain, Cpu, Wrench, Plus, Server, Upload, Camera, Check, ChevronDown, ChevronRight, Code, Database, Shield, Lightbulb } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuCheckboxItem } from '@/components/ui/dropdown-menu';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '../components/AppSidebar';

const Index = () => {
  const [message, setMessage] = useState('');
  const [selectedModels, setSelectedModels] = useState<string[]>(['gpt-4']);
  const [selectedServers, setSelectedServers] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [expandedServers, setExpandedServers] = useState<string[]>([]);
  const [mcpServers] = useState([
    { 
      id: 'server1', 
      name: 'Development Server', 
      status: 'connected',
      features: [
        { id: 'dev-db', name: 'Database Access' },
        { id: 'dev-api', name: 'API Testing' },
        { id: 'dev-logs', name: 'Log Analysis' }
      ]
    },
    { 
      id: 'server2', 
      name: 'Production Server', 
      status: 'connected',
      features: [
        { id: 'prod-monitor', name: 'System Monitoring' },
        { id: 'prod-deploy', name: 'Deployment' },
        { id: 'prod-backup', name: 'Backup Management' }
      ]
    },
    { 
      id: 'server3', 
      name: 'Testing Server', 
      status: 'disconnected',
      features: [
        { id: 'test-suite', name: 'Test Suite' },
        { id: 'test-coverage', name: 'Coverage Reports' }
      ]
    }
  ]);
  const { isDark, toggleTheme } = useTheme();

  const availableModels = [
    { id: 'gpt-4', name: 'ChatGPT (GPT-4)', icon: Bot, color: 'text-green-600' },
    { id: 'gpt-3.5', name: 'ChatGPT (GPT-3.5)', icon: Zap, color: 'text-blue-600' },
    { id: 'claude', name: 'Claude', icon: Brain, color: 'text-purple-600' },
    { id: 'llama', name: 'LLAMA', icon: Cpu, color: 'text-orange-600' },
    { id: 'custom', name: 'Custom Model', icon: Wrench, color: 'text-gray-600' }
  ];

  const sampleQuestions = [
    {
      text: "How can I optimize my React application performance?",
      icon: Code
    },
    {
      text: "What are the best practices for TypeScript development?",
      icon: Database
    },
    {
      text: "How do I implement authentication in a web app?",
      icon: Shield
    },
    {
      text: "What's the difference between REST and GraphQL APIs?",
      icon: Lightbulb
    }
  ];

  const handleSend = () => {
    if (message.trim()) {
      console.log('Sending message:', message);
      console.log('Using models:', selectedModels);
      console.log('Selected servers:', selectedServers);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSampleQuestion = (question: string) => {
    setMessage(question);
  };

  const toggleServerSelection = (serverId: string) => {
    setSelectedServers(prev => 
      prev.includes(serverId) 
        ? prev.filter(id => id !== serverId)
        : [...prev, serverId]
    );
  };

  const toggleFeatureSelection = (featureId: string) => {
    setSelectedFeatures(prev => 
      prev.includes(featureId) 
        ? prev.filter(id => id !== featureId)
        : [...prev, featureId]
    );
  };

  const toggleServerExpansion = (serverId: string) => {
    setExpandedServers(prev => 
      prev.includes(serverId)
        ? prev.filter(id => id !== serverId)
        : [...prev, serverId]
    );
  };

  const handleAddNewServer = () => {
    console.log('Add new MCP server');
  };

  const toggleModelSelection = (modelId: string) => {
    setSelectedModels(prev => 
      prev.includes(modelId) 
        ? prev.filter(id => id !== modelId)
        : [...prev, modelId]
    );
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset>
          <div className="min-h-screen bg-black flex flex-col p-4 transition-colors duration-300">
            {/* Sidebar trigger */}
            <div className="mb-4">
              <SidebarTrigger />
            </div>

            {/* Main content area */}
            <div className="flex-1 flex items-center justify-center">
              <div className="w-full max-w-4xl">
                {/* Welcome Message */}
                <div className="text-center mb-8">
                  <h1 className="text-4xl font-bold text-white mb-2">
                    Welcome to AI Assistant
                  </h1>
                  <p className="text-gray-400 text-lg">
                    How can I help you today?
                  </p>
                </div>

                {/* Sample Questions with Icons */}
                <div className="text-center mb-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
                    {sampleQuestions.map((item, index) => {
                      const IconComponent = item.icon;
                      return (
                        <button
                          key={index}
                          onClick={() => handleSampleQuestion(item.text)}
                          className="p-4 bg-gray-800 hover:bg-gray-700 rounded-lg text-white text-left transition-colors duration-200 border border-gray-700 flex flex-col items-start gap-3"
                        >
                          <IconComponent className="w-6 h-6 text-blue-400" />
                          <span className="text-sm leading-relaxed">{item.text}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Input Container */}
                <div className="relative bg-gray-800 rounded-2xl shadow-lg border border-gray-700 overflow-hidden transition-colors duration-300">
                  {/* Text Area */}
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message here..."
                    className="w-full p-6 pb-20 resize-none border-none outline-none text-white placeholder-gray-400 text-lg bg-transparent h-[100px]"
                    rows={3}
                  />

                  {/* Bottom Button Container */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 transition-colors duration-300">
                    <div className="flex items-center justify-between">
                      {/* Left aligned buttons */}
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => console.log('Upload a file')}
                          className="p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 group"
                          title="Upload a file"
                        >
                          <Upload className="w-5 h-5 text-gray-300 group-hover:text-blue-400" />
                        </button>
                        
                        <button
                          onClick={() => console.log('Take screenshot')}
                          className="p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 group"
                          title="Take screenshot"
                        >
                          <Camera className="w-5 h-5 text-gray-300 group-hover:text-blue-400" />
                        </button>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              className="p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 group relative"
                              title="MCP Server"
                            >
                              <Server className="w-5 h-5 text-gray-300 group-hover:text-blue-400" />
                              {(selectedServers.length > 0 || selectedFeatures.length > 0) && (
                                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                  {selectedServers.length + selectedFeatures.length}
                                </span>
                              )}
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start" className="w-72 max-h-96 overflow-y-auto bg-gray-800 border-gray-700">
                            <div className="px-2 py-1.5 text-sm font-semibold text-gray-300">
                              MCP Servers
                            </div>
                            <DropdownMenuSeparator />
                            {mcpServers.map((server) => (
                              <div key={server.id}>
                                <Collapsible 
                                  open={expandedServers.includes(server.id)}
                                  onOpenChange={() => toggleServerExpansion(server.id)}
                                >
                                  <div className="flex items-center">
                                    <DropdownMenuCheckboxItem
                                      checked={selectedServers.includes(server.id)}
                                      onCheckedChange={() => toggleServerSelection(server.id)}
                                      className="flex items-center justify-between flex-1 pr-2 text-white"
                                      onSelect={(e) => e.preventDefault()}
                                    >
                                      <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${
                                          server.status === 'connected' ? 'bg-green-500' : 'bg-red-500'
                                        }`} />
                                        <span>{server.name}</span>
                                      </div>
                                    </DropdownMenuCheckboxItem>
                                    <CollapsibleTrigger asChild>
                                      <button 
                                        className="p-1 hover:bg-gray-700 rounded"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          toggleServerExpansion(server.id);
                                        }}
                                      >
                                        {expandedServers.includes(server.id) ? (
                                          <ChevronDown className="w-4 h-4 text-white" />
                                        ) : (
                                          <ChevronRight className="w-4 h-4 text-white" />
                                        )}
                                      </button>
                                    </CollapsibleTrigger>
                                  </div>
                                  <CollapsibleContent className="pl-6">
                                    {server.features.map((feature) => (
                                      <DropdownMenuCheckboxItem
                                        key={feature.id}
                                        checked={selectedFeatures.includes(feature.id)}
                                        onCheckedChange={() => toggleFeatureSelection(feature.id)}
                                        className="text-sm text-white"
                                        onSelect={(e) => e.preventDefault()}
                                      >
                                        {feature.name}
                                      </DropdownMenuCheckboxItem>
                                    ))}
                                  </CollapsibleContent>
                                </Collapsible>
                              </div>
                            ))}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleAddNewServer} className="flex items-center gap-2 text-white">
                              <Plus className="w-4 h-4" />
                              Add New Server
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              className="p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 group relative"
                              title="Model Provider"
                            >
                              <Bot className="w-5 h-5 text-gray-300 group-hover:text-blue-400" />
                              {selectedModels.length > 0 && (
                                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                  {selectedModels.length}
                                </span>
                              )}
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start" className="w-64 bg-gray-800 border-gray-700">
                            <div className="px-2 py-1.5 text-sm font-semibold text-gray-300">
                              AI Models
                            </div>
                            <DropdownMenuSeparator />
                            {availableModels.map((model) => {
                              const IconComponent = model.icon;
                              return (
                                <DropdownMenuCheckboxItem
                                  key={model.id}
                                  checked={selectedModels.includes(model.id)}
                                  onCheckedChange={() => toggleModelSelection(model.id)}
                                  className="text-white"
                                  onSelect={(e) => e.preventDefault()}
                                >
                                  <div className="flex items-center gap-2">
                                    <IconComponent className={`w-4 h-4 ${model.color}`} />
                                    <span>{model.name}</span>
                                  </div>
                                </DropdownMenuCheckboxItem>
                              );
                            })}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Send button */}
                      <button
                        onClick={handleSend}
                        disabled={!message.trim()}
                        className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-200 group"
                        title="Send message"
                      >
                        <Send className="w-5 h-5 text-white" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-6">
                  <p className="text-sm text-gray-400">
                    Press Enter to send, Shift + Enter for new line
                  </p>
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Index;
