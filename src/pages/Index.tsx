import React, { useState } from 'react';
import { Send, Upload, Camera, Check, ChevronDown, ChevronRight, Code, Database, Shield, Lightbulb, Server, Bot, Zap, Brain, Cpu, Wrench, Plus, Earth } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuCheckboxItem } from '@/components/ui/dropdown-menu';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { useSidebar } from '@/components/ui/sidebar';
import { AppSidebar } from '../components/AppSidebar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Moon, Sun } from 'lucide-react';
import { TextCanvas } from '../components/TextCanvas';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface IndexContentProps {
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
}

const mcpServers = [
  {
    id: 'server1',
    name: 'Database Server',
    status: 'connected' as const,
    features: [
      { id: 'feature1', name: 'Query Database' },
      { id: 'feature2', name: 'Schema Analysis' }
    ]
  },
  {
    id: 'server2',
    name: 'File System',
    status: 'disconnected' as const,
    features: [
      { id: 'feature3', name: 'File Operations' },
      { id: 'feature4', name: 'Directory Listing' }
    ]
  },
  {
    id: 'server3',
    name: 'API Gateway',
    status: 'connected' as const,
    features: [
      { id: 'feature5', name: 'REST API' },
      { id: 'feature6', name: 'GraphQL' }
    ]
  }
];

const IndexContent = ({ isSettingsOpen, setIsSettingsOpen }: IndexContentProps) => {
  const [message, setMessage] = useState('');
  const [selectedModel, setSelectedModel] = useState('gpt-4');
  const [selectedServers, setSelectedServers] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [expandedServers, setExpandedServers] = useState<string[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isTextCanvasOpen, setIsTextCanvasOpen] = useState(false);
  const [processedTextResult, setProcessedTextResult] = useState<string>('');
  
  const { isDark, toggleTheme } = useTheme();
  const { open: sidebarOpen, isMobile } = useSidebar();

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
      icon: Code,
      sampleResponse: "Here are key strategies to optimize React performance:\n\n1. **Use React.memo()** for functional components\n2. **Implement useMemo()** for expensive calculations\n3. **Use useCallback()** for function props\n4. **Code splitting** with React.lazy()\n5. **Optimize bundle size** with tree shaking"
    },
    {
      text: "What are the best practices for TypeScript development?",
      icon: Database,
      sampleResponse: "TypeScript best practices include:\n\n1. **Enable strict mode** in tsconfig.json\n2. **Use proper type definitions** instead of 'any'\n3. **Leverage union types** and type guards\n4. **Create custom types** for better code organization\n5. **Use interfaces** for object shapes"
    },
    {
      text: "How do I implement authentication in a web app?",
      icon: Shield,
      sampleResponse: "Authentication implementation steps:\n\n1. **Choose authentication method** (JWT, OAuth, etc.)\n2. **Set up secure password hashing** (bcrypt)\n3. **Implement login/logout endpoints**\n4. **Use HTTPS** for all auth requests\n5. **Store tokens securely** (httpOnly cookies)\n6. **Add route protection** middleware"
    },
    {
      text: "What's the difference between REST and GraphQL APIs?",
      icon: Lightbulb,
      sampleResponse: "Key differences between REST and GraphQL:\n\n**REST:**\n- Multiple endpoints for different resources\n- Fixed data structure in responses\n- HTTP methods (GET, POST, PUT, DELETE)\n\n**GraphQL:**\n- Single endpoint for all operations\n- Client specifies exact data needed\n- Reduces over-fetching and under-fetching\n- Strong type system"
    }
  ];

  const handleSend = () => {
    if (message.trim()) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        content: message,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, newMessage]);
      console.log('Sending message:', message);
      console.log('Using model:', selectedModel);
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

  const handleSampleQuestion = (question: { text: string; sampleResponse: string }) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: question.text,
      timestamp: new Date()
    };
    
    const assistantMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: question.sampleResponse,
      timestamp: new Date()
    };

    setChatMessages([userMessage, assistantMessage]);
    setMessage('');
  };

  const handleNewChat = () => {
    setChatMessages([]);
    setMessage('');
    setIsTextCanvasOpen(false);
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

  const handleModelSelection = (modelId: string) => {
    setSelectedModel(modelId);
  };

  const handleTextToEarth = () => {
    setIsTextCanvasOpen(!isTextCanvasOpen);
    console.log('Text to Earth canvas toggled:', !isTextCanvasOpen);
  };

  const handleProcessText = (text: string) => {
    // Simulate text processing
    const processedResult = `Processed text (${text.length} characters):\n\n${text}\n\n--- Analysis ---\nWord count: ${text.split(/\s+/).length}\nCharacter count: ${text.length}\nLines: ${text.split('\n').length}`;
    setProcessedTextResult(processedResult);
    console.log('Text processed:', text);
  };

  const renderChatMessage = (msg: ChatMessage) => (
    <div key={msg.id} className={`mb-4 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
      <div className={`inline-block max-w-[80%] p-3 rounded-lg ${
        msg.role === 'user' 
          ? 'bg-blue-600 text-white' 
          : 'bg-gray-700 text-gray-100'
      }`}>
        <div className="whitespace-pre-wrap">{msg.content}</div>
        <div className={`text-xs mt-1 ${
          msg.role === 'user' ? 'text-blue-100' : 'text-gray-400'
        }`}>
          {msg.timestamp.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black flex flex-col p-4 transition-colors duration-300 overflow-hidden">
      {/* Top bar with sidebar trigger and new chat button */}
      <div className="mb-4 flex justify-between items-center">
        <SidebarTrigger />
        {(!sidebarOpen || isMobile) && (
          <Button
            onClick={handleNewChat}
            size="icon"
            variant="ghost"
            className="text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            <Plus className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Settings Dialog */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="bg-gray-800 text-white border-gray-700 max-w-6xl w-[80vw] h-[80vh] max-h-[80vh] p-0">
          <DialogHeader className="px-6 pt-3 pb-0">
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Settings
            </DialogTitle>
          </DialogHeader>
          <div className="flex h-full px-6 pb-6 pt-2">
            <Tabs defaultValue="general" orientation="vertical" className="flex w-full h-full">
              <TabsList className="flex flex-col h-full w-48 bg-gray-700 p-2 justify-start">
                <TabsTrigger 
                  value="general" 
                  className="w-full justify-start text-white data-[state=active]:bg-gray-600 mb-2 py-3"
                >
                  Theme
                </TabsTrigger>
                <TabsTrigger 
                  value="mcp" 
                  className="w-full justify-start text-white data-[state=active]:bg-gray-600 mb-2 py-3"
                >
                  MCP Server
                </TabsTrigger>
                <TabsTrigger 
                  value="llm" 
                  className="w-full justify-start text-white data-[state=active]:bg-gray-600 py-3"
                >
                  LLM Model Provider
                </TabsTrigger>
              </TabsList>
              <div className="flex-1 pl-6 overflow-auto">
                <TabsContent value="general" className="space-y-4 mt-0 h-full">
                  <div className="flex items-center justify-between">
                    <span>Theme</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleTheme}
                      className="text-white hover:bg-gray-700"
                    >
                      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="mcp" className="space-y-4 mt-0 h-full">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">MCP Servers</h3>
                    {mcpServers.map((server) => (
                      <div key={server.id} className="flex items-center justify-between p-2 bg-gray-700 rounded">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            server.status === 'connected' ? 'bg-green-500' : 'bg-red-500'
                          }`} />
                          <span>{server.name}</span>
                        </div>
                        <span className="text-sm text-gray-400">{server.status}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="llm" className="space-y-4 mt-0 h-full">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Available Models</h3>
                    <RadioGroup value={selectedModel} onValueChange={handleModelSelection}>
                      {availableModels.map((model) => {
                        const IconComponent = model.icon;
                        return (
                          <div key={model.id} className="flex items-center justify-between p-2 bg-gray-700 rounded">
                            <div className="flex items-center gap-2">
                              <IconComponent className={`w-4 h-4 ${model.color}`} />
                              <span>{model.name}</span>
                            </div>
                            <RadioGroupItem value={model.id} />
                          </div>
                        );
                      })}
                    </RadioGroup>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {chatMessages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full max-w-4xl">
              {/* Welcome Message */}
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
                  Hello, Sharon
                </h1>
                <p className="text-gray-400 text-lg">
                  How can I help you today?
                </p>
              </div>

              {/* Sample Questions with Icons */}
              <div className="text-center mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                  {sampleQuestions.map((item, index) => {
                    const IconComponent = item.icon;
                    return (
                      <button
                        key={index}
                        onClick={() => handleSampleQuestion(item)}
                        className="p-4 bg-[#303030] hover:bg-gray-600 rounded-lg text-white text-left transition-colors duration-200 flex flex-col items-start gap-3"
                      >
                        <IconComponent className="w-6 h-6 text-blue-400" />
                        <span className="text-sm leading-relaxed">{item.text}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 mb-4 overflow-y-auto scrollbar-hide">
            <div className="max-w-4xl mx-auto p-4">
              {chatMessages.map(renderChatMessage)}
            </div>
          </div>
        )}

        {/* Input Container with Text Canvas */}
        <div className="w-full max-w-4xl mx-auto">
          <div className="relative bg-[#303030] rounded-2xl shadow-lg overflow-hidden transition-colors duration-300">
            {/* Text Area */}
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message here..."
              className="w-full p-6 pb-20 resize-none border-none outline-none text-white placeholder-gray-400 text-lg bg-transparent h-[100px] overflow-hidden"
              rows={3}
            />

            {/* Bottom Button Container */}
            <div className="absolute bottom-0 left-0 right-0 p-4 transition-colors duration-300">
              <div className="flex items-center justify-between">
                {/* Left aligned buttons */}
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => console.log('Upload a file')}
                    className="p-2 rounded-lg hover:bg-gray-600 transition-colors duration-200 group"
                    title="Upload a file"
                  >
                    <Upload className="w-5 h-5 text-gray-300 group-hover:text-blue-400" />
                  </button>
                  
                  <button
                    onClick={handleTextToEarth}
                    className={`p-2 rounded-lg transition-colors duration-200 group ${
                      isTextCanvasOpen 
                        ? 'bg-blue-600 hover:bg-blue-700' 
                        : 'hover:bg-gray-600'
                    }`}
                    title="Text to Earth"
                  >
                    <Earth className={`w-5 h-5 ${
                      isTextCanvasOpen 
                        ? 'text-white' 
                        : 'text-gray-300 group-hover:text-blue-400'
                    }`} />
                  </button>
                  
                  <button
                    onClick={() => console.log('Take screenshot')}
                    className="p-2 rounded-lg hover:bg-gray-600 transition-colors duration-200 group"
                    title="Take screenshot"
                  >
                    <Camera className="w-5 h-5 text-gray-300 group-hover:text-blue-400" />
                  </button>
                  
                  {/* MCP Server dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        className="p-2 rounded-lg hover:bg-gray-600 transition-colors duration-200 group relative"
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

                  {/* Model Provider dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        className="p-2 rounded-lg hover:bg-gray-600 transition-colors duration-200 group relative"
                        title="Model Provider"
                      >
                        <Bot className="w-5 h-5 text-gray-300 group-hover:text-blue-400" />
                        {selectedModel && (
                          <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                            1
                          </span>
                        )}
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-64 bg-gray-800 border-gray-700">
                      <div className="px-2 py-1.5 text-sm font-semibold text-gray-300">
                        AI Models
                      </div>
                      <DropdownMenuSeparator />
                      <RadioGroup value={selectedModel} onValueChange={handleModelSelection} className="p-2">
                        {availableModels.map((model) => {
                          const IconComponent = model.icon;
                          return (
                            <div key={model.id} className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded">
                              <RadioGroupItem value={model.id} id={model.id} />
                              <label htmlFor={model.id} className="flex items-center gap-2 cursor-pointer flex-1">
                                <IconComponent className={`w-4 h-4 ${model.color}`} />
                                <span className="text-white">{model.name}</span>
                              </label>
                            </div>
                          );
                        })}
                      </RadioGroup>
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

            {/* Text Canvas - Extended from input box */}
            <TextCanvas 
              isOpen={isTextCanvasOpen} 
              onClose={() => setIsTextCanvasOpen(false)}
              onProcessText={handleProcessText}
              processedResult={processedTextResult}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const Index = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleNewChat = () => {
    console.log('New chat started');
  };

  const handleSettingsClick = () => {
    console.log('Settings clicked');
    setIsSettingsOpen(true);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar onNewChat={handleNewChat} onSettingsClick={handleSettingsClick} />
        <SidebarInset>
          <IndexContent isSettingsOpen={isSettingsOpen} setIsSettingsOpen={setIsSettingsOpen} />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Index;
