
import React, { useState } from 'react';
import { Send, Mic, Paperclip, Smile, Settings, Moon, Sun, Bot, Zap, Brain, Cpu, Wrench } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Index = () => {
  const [message, setMessage] = useState('');
  const [selectedModel, setSelectedModel] = useState('gpt-4');
  const { isDark, toggleTheme } = useTheme();

  const handleSend = () => {
    if (message.trim()) {
      console.log('Sending message:', message);
      console.log('Using model:', selectedModel);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center p-4 transition-colors duration-300">
      {/* Model Switcher at the top */}
      <div className="w-full max-w-2xl mb-8">
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
                  onClick={() => console.log('Voice input')}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 group"
                  title="Voice input"
                >
                  <Mic className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                </button>
                
                <button
                  onClick={() => console.log('Attach file')}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 group"
                  title="Attach file"
                >
                  <Paperclip className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
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
  );
};

export default Index;
