
import React, { useState } from 'react';
import { Send, Mic, Paperclip, Smile, Settings, Moon, Sun, Bot, Zap, Brain, Cpu, Wrench, Plus, Server, Upload, Camera, Check } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuCheckboxItem } from '@/components/ui/dropdown-menu';

const Index = () => {
  const [message, setMessage] = useState('');
  const [selectedModel, setSelectedModel] = useState('gpt-4');
  const [selectedServers, setSelectedServers] = useState<string[]>([]);
  const [mcpServers] = useState([
    { id: 'server1', name: 'Development Server', status: 'connected' },
    { id: 'server2', name: 'Production Server', status: 'connected' },
    { id: 'server3', name: 'Testing Server', status: 'disconnected' }
  ]);
  const { isDark, toggleTheme } = useTheme();

  const handleSend = () => {
    if (message.trim()) {
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

  const toggleServerSelection = (serverId: string) => {
    setSelectedServers(prev => 
      prev.includes(serverId) 
        ? prev.filter(id => id !== serverId)
        : [...prev, serverId]
    );
  };

  const handleAddNewServer = () => {
    console.log('Add new MCP server');
    // This would typically open a modal or navigate to a server configuration page
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex flex-col p-4 transition-colors duration-300">
      {/* Model Switcher at the very top */}
      <div className="w-full max-w-2xl mx-auto mb-8">
        <Select value={selectedModel} onValueChange={setSelectedModel}>
          <SelectTrigger className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <SelectValue placeholder="Select AI Model" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gpt-4">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-green-600" />
                ChatGPT (GPT-4)
              </div>
            </SelectItem>
            <SelectItem value="gpt-3.5">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-600" />
                ChatGPT (GPT-3.5)
              </div>
            </SelectItem>
            <SelectItem value="claude">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-purple-600" />
                Claude
              </div>
            </SelectItem>
            <SelectItem value="llama">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-orange-600" />
                LLAMA
              </div>
            </SelectItem>
            <SelectItem value="custom">
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-gray-600" />
                Custom Model
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center items-center gap-4 mb-4">
              <h1 className="text-4xl font-bold text-gray-800 dark:text-white">AI Assistant</h1>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDark ? (
                  <Sun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-600" />
                )}
              </button>
            </div>
            <p className="text-gray-600 dark:text-gray-300">How can I help you today?</p>
          </div>

          {/* Input Container */}
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-300">
            {/* Text Area */}
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message here..."
              className="w-full p-6 pb-20 resize-none border-none outline-none text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-lg min-h-[120px] max-h-[300px] bg-transparent"
              rows={3}
            />

            {/* Bottom Button Container */}
            <div className="absolute bottom-0 left-0 right-0 p-4 transition-colors duration-300">
              <div className="flex items-center justify-between">
                {/* Left aligned buttons */}
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => console.log('New Chat')}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 group"
                    title="New Chat"
                  >
                    <Plus className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                  </button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 group relative"
                        title="MCP Server"
                      >
                        <Server className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                        {selectedServers.length > 0 && (
                          <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                            {selectedServers.length}
                          </span>
                        )}
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56">
                      <div className="px-2 py-1.5 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        MCP Servers
                      </div>
                      <DropdownMenuSeparator />
                      {mcpServers.map((server) => (
                        <DropdownMenuCheckboxItem
                          key={server.id}
                          checked={selectedServers.includes(server.id)}
                          onCheckedChange={() => toggleServerSelection(server.id)}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${
                              server.status === 'connected' ? 'bg-green-500' : 'bg-red-500'
                            }`} />
                            <span>{server.name}</span>
                          </div>
                        </DropdownMenuCheckboxItem>
                      ))}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleAddNewServer} className="flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Add New Server
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <button
                    onClick={() => console.log('Upload a file')}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 group"
                    title="Upload a file"
                  >
                    <Upload className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                  </button>
                  
                  <button
                    onClick={() => console.log('Take screenshot')}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 group"
                    title="Take screenshot"
                  >
                    <Camera className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                  </button>
                  
                  <button
                    onClick={() => console.log('Add emoji')}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 group"
                    title="Add emoji"
                  >
                    <Smile className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                  </button>
                  
                  <button
                    onClick={() => console.log('Settings')}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 group"
                    title="Settings"
                  >
                    <Settings className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                  </button>
                </div>

                {/* Send button */}
                <button
                  onClick={handleSend}
                  disabled={!message.trim()}
                  className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-200 group"
                  title="Send message"
                >
                  <Send className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Press Enter to send, Shift + Enter for new line
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
