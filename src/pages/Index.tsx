import React, { useState } from 'react';
import { Send, Upload, Camera, Check, ChevronDown, ChevronRight, Code, Database, Shield, Lightbulb, Server, Bot, Zap, Brain, Cpu, Wrench, Plus, Earth, Map, RefreshCw, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
import { ProcessedTextResult } from '../components/ProcessedTextResult';
import { MapPanel } from '../components/MapPanel';
import { InfoCard } from '../components/InfoCard';
import { LoadingRibbon } from '@/components/ui/loading-ribbon';
import { ChatContainer } from '../components/chat/ChatContainer';
import { ChatStatusBar } from '../components/chat/ChatStatusBar';
import { ReasoningShowcase } from '../components/chat/ReasoningShowcase';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  type?: 'text' | 'processed-result' | 'info-card';
  isStreaming?: boolean;
  thinking?: string;
  status?: 'processing' | 'thinking' | 'completed' | 'error';
  progress?: number;
  steps?: { step: string; completed: boolean; current: boolean }[];
  cardData?: {
    title: string;
    imageUrl: string;
    description: string;
    source?: string;
    sourceUrl?: string;
    dataType?: string;
    author?: string;
    authorUrl?: string;
  };
}

interface IndexContentProps {
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
}

const mcpServers = [
  {
    id: 'server1',
    name: 'Database Server',
    description: 'Advanced database management and query execution server with support for multiple database engines.',
    status: 'connected' as const,
    version: '2.1.0',
    uptime: '99.9%',
    commands: ['db:query', 'db:schema', 'db:migrate', 'db:backup'],
    tools: ['PostgreSQL Connector', 'MySQL Adapter', 'Query Optimizer', 'Schema Analyzer'],
    features: [
      { id: 'feature1', name: 'Query Database', description: 'Execute SQL queries across multiple databases' },
      { id: 'feature2', name: 'Schema Analysis', description: 'Analyze and optimize database schemas' }
    ]
  },
  {
    id: 'server2',
    name: 'File System',
    description: 'Comprehensive file system operations with advanced file management capabilities and security features.',
    status: 'disconnected' as const,
    version: '1.8.5',
    uptime: '0%',
    commands: ['fs:read', 'fs:write', 'fs:delete', 'fs:search', 'fs:compress'],
    tools: ['File Explorer', 'Permission Manager', 'Backup System', 'Search Indexer'],
    features: [
      { id: 'feature3', name: 'File Operations', description: 'Read, write, and manage files with advanced permissions' },
      { id: 'feature4', name: 'Directory Listing', description: 'Browse and search directory structures efficiently' }
    ]
  },
  {
    id: 'server3',
    name: 'API Gateway',
    description: 'High-performance API gateway with load balancing, rate limiting, and comprehensive monitoring.',
    status: 'connected' as const,
    version: '3.2.1',
    uptime: '99.7%',
    commands: ['api:get', 'api:post', 'api:auth', 'api:monitor', 'api:cache'],
    tools: ['Load Balancer', 'Rate Limiter', 'Auth Manager', 'Analytics Dashboard'],
    features: [
      { id: 'feature5', name: 'REST API', description: 'Full REST API support with automatic documentation' },
      { id: 'feature6', name: 'GraphQL', description: 'GraphQL endpoint with schema introspection' }
    ]
  }
];

const IndexContent = ({ isSettingsOpen, setIsSettingsOpen }: IndexContentProps) => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [canvasContent, setCanvasContent] = useState('');
  const [selectedModel, setSelectedModel] = useState('gpt-4');
  const [selectedServers, setSelectedServers] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [expandedServers, setExpandedServers] = useState<string[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isTextCanvasOpen, setIsTextCanvasOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [chatStatus, setChatStatus] = useState<'idle' | 'thinking' | 'responding' | 'processing'>('idle');
  const [isConnected, setIsConnected] = useState(true);
  const [responseTime, setResponseTime] = useState<number>();
  const [tokensUsed, setTokensUsed] = useState<number>();
  const [isReasoningActive, setIsReasoningActive] = useState(false);
  const [showReasoningInChat, setShowReasoningInChat] = useState(false);
  
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
      text: "Can you search the top 3 World Imagery data ?",
      icon: Code,
      sampleResponse: "Here are the top 3 World Imagery datasets:\n\n1. **ESRI World Imagery** - High-resolution satellite imagery\n2. **Google Satellite** - Global satellite and aerial imagery\n3. **Bing Maps Aerial** - Microsoft's aerial imagery service\n\nThese datasets provide comprehensive global coverage with regular updates and high-quality imagery suitable for various applications including GIS analysis, mapping, and visualization.",
      showCard: true,
      cardData: [
        {
          title: "World Imagery - High Resolution Satellite Data",
          imageUrl: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=300&h=200&fit=crop",
          description: "Comprehensive global satellite imagery dataset providing high-resolution coverage for mapping, GIS analysis, and visualization applications. Updated regularly with the latest satellite captures.",
          source: "ESRI World Imagery Service",
          sourceUrl: "https://www.esri.com/en-us/arcgis/products/arcgis-online/services/world-imagery",
          dataType: "Image Layer",
          author: "Esri",
          authorUrl: "https://www.esri.com"
        },
        {
          title: "Google Satellite Imagery",
          imageUrl: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=300&h=200&fit=crop",
          description: "Google's comprehensive satellite and aerial imagery service providing global coverage with high-quality imagery for mapping and visualization applications.",
          source: "Google Maps Platform",
          sourceUrl: "https://developers.google.com/maps/documentation/maps-static/overview",
          dataType: "Image Layer",
          author: "Esri",
          authorUrl: "https://www.esri.com"
        },
        {
          title: "Bing Maps Aerial Imagery",
          imageUrl: "https://images.unsplash.com/photo-1517976487492-5750f3195933?w=300&h=200&fit=crop",
          description: "Microsoft's aerial imagery service offering detailed satellite and aerial photography for comprehensive geographic coverage and analysis.",
          source: "Microsoft Bing Maps",
          sourceUrl: "https://www.microsoft.com/en-us/maps/choose-your-bing-maps-api",
          dataType: "Image Layer",
          author: "Esri",
          authorUrl: "https://www.esri.com"
        }
      ]
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

  const handleSend = async () => {
    const contentToSend = isTextCanvasOpen ? canvasContent : message;
    
    if (contentToSend.trim()) {
      const startTime = Date.now();
      setChatStatus('thinking');
      
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        content: contentToSend,
        timestamp: new Date(),
        type: 'text',
        status: 'completed'
      };
      setChatMessages(prev => [...prev, newMessage]);
      
      // Simulate AI response with streaming and thinking
      setTimeout(async () => {
        setChatStatus('responding');
        
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: '',
          timestamp: new Date(),
          isStreaming: true,
          status: 'thinking',
          thinking: `Let me analyze this request: "${contentToSend}"

First, I'll break down what the user is asking:
1. Understanding the context and intent
2. Identifying key information needed
3. Structuring a helpful response

The user seems to be asking about: ${contentToSend.substring(0, 50)}...

I should provide a comprehensive answer that addresses their specific needs while being clear and actionable.`,
          progress: 0,
          steps: [
            { step: 'Analyzing request', completed: false, current: true },
            { step: 'Gathering information', completed: false, current: false },
            { step: 'Generating response', completed: false, current: false },
            { step: 'Finalizing answer', completed: false, current: false }
          ]
        };
        
        setChatMessages(prev => [...prev, assistantMessage]);
        
        // Simulate thinking phase
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Update status to processing with steps
        setChatMessages(prev => prev.map(msg => 
          msg.id === assistantMessage.id 
            ? { 
                ...msg, 
                status: 'processing',
                progress: 25,
                steps: msg.steps?.map((step, idx) => ({
                  ...step,
                  completed: idx === 0,
                  current: idx === 1
                }))
              }
            : msg
        ));
        
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Continue with more steps
        setChatMessages(prev => prev.map(msg => 
          msg.id === assistantMessage.id 
            ? { 
                ...msg, 
                progress: 60,
                steps: msg.steps?.map((step, idx) => ({
                  ...step,
                  completed: idx <= 1,
                  current: idx === 2
                }))
              }
            : msg
        ));
        
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Start streaming response
        const fullResponse = `Thank you for your question about "${contentToSend}". I've analyzed your request and here's a comprehensive response:

Based on your inquiry, I can provide several key insights and recommendations. This is a detailed explanation that demonstrates the streaming response feature.

Let me break this down into actionable points:
1. Understanding your specific context
2. Providing relevant information
3. Offering practical next steps

I hope this response addresses your question effectively. Is there anything specific you'd like me to elaborate on?`;
        
        setChatMessages(prev => prev.map(msg => 
          msg.id === assistantMessage.id 
            ? { 
                ...msg, 
                content: fullResponse,
                status: 'completed',
                isStreaming: false,
                progress: 100,
                steps: msg.steps?.map(step => ({
                  ...step,
                  completed: true,
                  current: false
                }))
              }
            : msg
        ));
        
        const endTime = Date.now();
        setResponseTime(endTime - startTime);
        setTokensUsed(Math.floor(Math.random() * 500) + 100);
        setChatStatus('idle');
      }, 500);
      
      // If canvas is open, process the text
      if (isTextCanvasOpen && canvasContent.trim()) {
        setCanvasContent('');
        setIsTextCanvasOpen(false);
      }
      
      console.log('Sending message:', contentToSend);
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

  const handleSampleQuestion = (question: { text: string; sampleResponse: string; showCard?: boolean; cardData?: any }) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: question.text,
      timestamp: new Date(),
      type: 'text',
      status: 'completed'
    };
    
    const assistantMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: question.sampleResponse,
      timestamp: new Date(),
      type: question.showCard ? 'info-card' : 'text',
      cardData: question.cardData,
      status: 'completed',
      thinking: `The user selected a sample question: "${question.text}"

This is a pre-defined response that demonstrates our capabilities. I should provide the prepared answer while maintaining context for follow-up questions.`
    };

    setChatMessages([userMessage, assistantMessage]);
    setMessage('');
  };

  const handleNewChat = () => {
    setChatMessages([]);
    setMessage('');
    setCanvasContent('');
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
    navigate('/add-server');
  };

  const handleModelSelection = (modelId: string) => {
    setSelectedModel(modelId);
  };

  const handleTextToEarth = () => {
    setIsTextCanvasOpen(!isTextCanvasOpen);
    console.log('Text to Earth canvas toggled:', !isTextCanvasOpen);
  };

  const handleProcessText = (text: string) => {
    console.log('Text processed:', text);
  };

  const handleEditProcessedResult = (content: string) => {
    setCanvasContent(content);
    setIsTextCanvasOpen(true);
  };

  const handleMapToggle = () => {
    setIsMapOpen(!isMapOpen);
  };

  const handleRefreshServers = async () => {
    setIsLoading(true);
    setLoadingMessage('Refreshing MCP servers...');
    console.log('Refreshing MCP servers');
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsLoading(false);
    setLoadingMessage('');
  };

  const handleConfigureServer = async (serverId: string) => {
    setIsLoading(true);
    setLoadingMessage('Configuring server...');
    console.log('Configuring server:', serverId);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    setLoadingMessage('');
  };

  const renderChatMessage = (msg: ChatMessage) => {
    if (msg.type === 'processed-result') {
      return (
        <ProcessedTextResult 
          key={msg.id}
          result={msg.content}
          timestamp={msg.timestamp}
          onEdit={() => handleEditProcessedResult(msg.content)}
        />
      );
    }

    if (msg.type === 'info-card' && msg.cardData) {
      return (
        <div key={msg.id} className="mb-6">
          {/* Multiple cards in vertical layout */}
          {Array.isArray(msg.cardData) ? (
            <div className="space-y-4">
              {msg.cardData.map((card, index) => (
                <InfoCard
                  key={index}
                  title={card.title}
                  imageUrl={card.imageUrl}
                  description={card.description}
                  source={card.source}
                  sourceUrl={card.sourceUrl}
                  dataType={card.dataType}
                  author={card.author}
                  authorUrl={card.authorUrl}
                  showBadges={true}
                  onAddData={() => console.log('Add Data clicked')}
                  onSubscribe={() => console.log('Subscribe clicked')}
                  onAuthoritative={() => console.log('Authoritative clicked')}
                />
              ))}
            </div>
          ) : (
            <InfoCard
              title={msg.cardData.title}
              imageUrl={msg.cardData.imageUrl}
              description={msg.cardData.description}
              source={msg.cardData.source}
              sourceUrl={msg.cardData.sourceUrl}
              dataType={msg.cardData.dataType}
              author={msg.cardData.author}
              authorUrl={msg.cardData.authorUrl}
              showBadges={true}
              onAddData={() => console.log('Add Data clicked')}
              onSubscribe={() => console.log('Subscribe clicked')}
              onAuthoritative={() => console.log('Authoritative clicked')}
            />
          )}
          <div className="mt-4 bg-gray-700 text-gray-100 p-3 rounded-lg max-w-2xl mx-auto">
            <div className="whitespace-pre-wrap">{msg.content}</div>
            <div className="text-xs mt-1 text-gray-400">
              {msg.timestamp.toLocaleTimeString()}
            </div>
          </div>
        </div>
      );
    }

    return (
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
  };

  return (
    <div className="min-h-screen bg-black flex flex-col p-4 transition-colors duration-300 overflow-hidden">
      {/* Top bar with sidebar trigger and new chat button */}
      <div className="mb-4 flex justify-between items-center">
        <SidebarTrigger />
        <div className="flex items-center gap-2">
          <Button
            onClick={handleMapToggle}
            size="icon"
            variant="ghost"
            className="text-gray-300 hover:bg-gray-700 hover:text-white"
            title="Toggle Map"
          >
            <Map className="w-4 h-4" />
          </Button>
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
      </div>

      {/* Settings Dialog */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="bg-gray-800 text-white border-gray-700 max-w-7xl w-[90vw] h-[85vh] max-h-[85vh] p-0 relative">
          <LoadingRibbon isVisible={isLoading} message={loadingMessage} />
          <DialogHeader className="px-6 pt-4 pb-2">
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-green-400 via-purple-500 to-purple-600 bg-clip-text text-transparent">
              Settings
            </DialogTitle>
          </DialogHeader>
          <div className="flex h-full">
            <Tabs defaultValue="general" orientation="vertical" className="flex w-full h-full">
              <TabsList className="flex flex-col h-full w-64 bg-gray-700 p-3 justify-start rounded-none">
                <TabsTrigger 
                  value="general" 
                  className="w-full justify-start text-white data-[state=active]:bg-gray-600 mb-3 py-4 px-4 text-base"
                >
                  Theme
                </TabsTrigger>
                <TabsTrigger 
                  value="mcp" 
                  className="w-full justify-start text-white data-[state=active]:bg-gray-600 mb-3 py-4 px-4 text-base"
                >
                  MCP Server
                </TabsTrigger>
                <TabsTrigger 
                  value="llm" 
                  className="w-full justify-start text-white data-[state=active]:bg-gray-600 py-4 px-4 text-base"
                >
                  LLM Model Provider
                </TabsTrigger>
              </TabsList>
              <div className="flex-1 p-6 overflow-auto bg-gray-750">
                <TabsContent value="general" className="space-y-6 mt-0 h-full">
                  <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                    <div>
                      <h3 className="text-lg font-semibold">Theme</h3>
                      <p className="text-gray-400 text-sm">Switch between light and dark mode</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleTheme}
                      className="text-white hover:bg-gray-600"
                    >
                      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="mcp" className="space-y-6 mt-0 h-full">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-semibold">MCP Servers</h3>
                        <p className="text-gray-400 mt-1">Manage your Model Context Protocol servers</p>
                      </div>
                      <div className="flex gap-3">
                        <Button
                          onClick={handleRefreshServers}
                          size="sm"
                          variant="outline"
                          className="text-white border-gray-600 hover:bg-gray-700"
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Refresh
                        </Button>
                        <Button
                          onClick={handleAddNewServer}
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Server
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid gap-6">
                      {mcpServers.map((server, index) => (
                        <div 
                          key={server.id} 
                          className="bg-gray-700 rounded-lg p-6 space-y-4 animate-bounce-in hover:animate-pulse-glow transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          {/* Server Header */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-3 h-3 rounded-full ${
                                server.status === 'connected' ? 'bg-green-500' : 'bg-red-500'
                              }`} />
                              <div>
                                <h4 className="text-lg font-semibold text-white">{server.name}</h4>
                                <p className="text-gray-300 text-sm capitalize">{server.status}</p>
                              </div>
                            </div>
                            <Button
                              onClick={() => handleConfigureServer(server.id)}
                              size="sm"
                              variant="ghost"
                              className="text-gray-300 hover:text-white hover:bg-gray-600 transition-all duration-200 hover:scale-105"
                              disabled={isLoading}
                            >
                              <Settings className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                              Config
                            </Button>
                          </div>

                          {/* Server Description */}
                          <p className="text-gray-300 text-sm leading-relaxed">
                            {server.description}
                          </p>

                          {/* Commands and Tools in vertical layout */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Commands Section */}
                            <div>
                              <h5 className="text-sm font-semibold text-gray-300 mb-3">Commands ({server.commands.length})</h5>
                              <div className="space-y-2">
                                {server.commands.map((command, index) => (
                                  <div key={index} className="flex items-center gap-2">
                                    <Code className="w-3 h-3 text-blue-400 flex-shrink-0" />
                                    <span className="px-2 py-1 bg-gray-600 text-gray-200 text-xs rounded font-mono">
                                      {command}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Tools Section */}
                            <div>
                              <h5 className="text-sm font-semibold text-gray-300 mb-3">Tools ({server.tools.length})</h5>
                              <div className="space-y-2">
                                {server.tools.map((tool, index) => (
                                  <div key={index} className="flex items-center gap-2">
                                    <Wrench className="w-3 h-3 text-green-400 flex-shrink-0" />
                                    <span className="text-gray-200 text-sm">{tool}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="llm" className="space-y-6 mt-0 h-full">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold">LLM Model Provider</h3>
                      <p className="text-gray-400 mt-1">Select your preferred language model</p>
                    </div>
                    <RadioGroup value={selectedModel} onValueChange={handleModelSelection} className="space-y-3">
                      {availableModels.map((model) => {
                        const IconComponent = model.icon;
                        return (
                          <div key={model.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                            <div className="flex items-center gap-3">
                              <IconComponent className={`w-5 h-5 ${model.color}`} />
                              <span className="text-white font-medium">{model.name}</span>
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
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isMapOpen ? 'mr-96' : ''}`}>
        {chatMessages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full max-w-4xl">
              {/* Welcome Message */}
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-purple-600 bg-clip-text text-transparent mb-2">
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
          <div className="flex-1 flex flex-col">
            <div className="flex-1 flex">
              <div className="flex-1">
                <ChatContainer
                  messages={chatMessages}
                  isLoading={chatStatus !== 'idle'}
                  onRetryMessage={(messageId) => console.log('Retry message:', messageId)}
                  showReasoning={showReasoningInChat}
                />
              </div>
            </div>
            <ChatStatusBar
              isConnected={isConnected}
              currentModel={selectedModel}
              responseTime={responseTime}
              tokensUsed={tokensUsed}
              status={chatStatus}
            />
          </div>
        )}

        {/* Input Container with Text Canvas */}
        <div className="w-full max-w-4xl mx-auto">
          <div className="relative bg-[#303030] rounded-2xl shadow-lg overflow-hidden transition-colors duration-300">
            {/* Text Canvas - Appears above the input area */}
            <TextCanvas 
              isOpen={isTextCanvasOpen} 
              onClose={() => setIsTextCanvasOpen(false)}
              onProcessText={handleProcessText}
              content={canvasContent}
              setContent={setCanvasContent}
            >
              {/* Bottom Button Container - moved inside TextCanvas */}
              <div className="flex items-center justify-between">
                {/* Left aligned buttons */}
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleTextToEarth}
                    className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors duration-200 group"
                    title="Text to Earth"
                  >
                    <Earth className="w-5 h-5 text-white" />
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
                  disabled={!canvasContent.trim()}
                  className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-200 group"
                  title="Send message"
                >
                  <Send className="w-5 h-5 text-white" />
                </button>
              </div>
            </TextCanvas>

            {/* Main Input Area - Hidden when canvas is open */}
            {!isTextCanvasOpen && (
              <>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message here..."
                  className="w-full p-6 pb-20 resize-none border-none outline-none text-white placeholder-gray-400 text-lg bg-transparent h-[100px] overflow-hidden"
                  rows={3}
                />

                {/* Bottom Button Container for regular input */}
                <div className="absolute bottom-0 left-0 right-0 p-4 transition-colors duration-300">
                  <div className="flex items-center justify-between">
                    {/* Left aligned buttons */}
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setShowReasoningInChat(!showReasoningInChat)}
                        className={`p-2 rounded-lg transition-colors duration-200 group ${
                          showReasoningInChat ? 'bg-primary text-primary-foreground' : 'hover:bg-gray-600'
                        }`}
                        title="Toggle step-by-step reasoning in responses"
                      >
                        <Brain className="w-5 h-5 text-gray-300 group-hover:text-blue-400" />
                      </button>
                      
                      <button
                        onClick={handleTextToEarth}
                        className="p-2 rounded-lg hover:bg-gray-600 transition-colors duration-200 group"
                        title="Text to Earth"
                      >
                        <Earth className="w-5 h-5 text-gray-300 group-hover:text-blue-400" />
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
              </>
            )}
          </div>
        </div>
      </div>

      {/* Map Panel */}
      <MapPanel isOpen={isMapOpen} onToggle={handleMapToggle} />
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
