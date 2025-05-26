
import React, { useState } from 'react';
import { Send, Mic, Paperclip, Smile, Settings } from 'lucide-react';

const Index = () => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      console.log('Sending message:', message);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">AI Assistant</h1>
          <p className="text-gray-600">How can I help you today?</p>
        </div>

        {/* Input Container */}
        <div className="relative bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Text Area */}
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message here..."
            className="w-full p-6 pb-20 resize-none border-none outline-none text-gray-800 placeholder-gray-400 text-lg min-h-[120px] max-h-[300px]"
            rows={3}
          />

          {/* Bottom Button Container */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-50 border-t border-gray-100">
            <div className="flex items-center justify-between">
              {/* Left aligned buttons */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => console.log('Voice input')}
                  className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-100 transition-colors duration-200 group"
                  title="Voice input"
                >
                  <Mic className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
                </button>
                
                <button
                  onClick={() => console.log('Attach file')}
                  className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-100 transition-colors duration-200 group"
                  title="Attach file"
                >
                  <Paperclip className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
                </button>
                
                <button
                  onClick={() => console.log('Add emoji')}
                  className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-100 transition-colors duration-200 group"
                  title="Add emoji"
                >
                  <Smile className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
                </button>
                
                <button
                  onClick={() => console.log('Settings')}
                  className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-100 transition-colors duration-200 group"
                  title="Settings"
                >
                  <Settings className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
                </button>
              </div>

              {/* Send button */}
              <button
                onClick={handleSend}
                disabled={!message.trim()}
                className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 group"
                title="Send message"
              >
                <Send className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Press Enter to send, Shift + Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
