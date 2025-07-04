import React, { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';

interface ChatInputProps {
  onSearch: (searchData: any) => void;
}

const ChatInput = ({ onSearch }: ChatInputProps) => {
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const parseNaturalLanguage = (input: string) => {
    // Simple natural language parsing simulation
    const lowercaseInput = input.toLowerCase();
    
    // Extract cities
    const fromMatch = lowercaseInput.match(/from\s+([a-zA-Z\s]+?)(?:\s+to|\s+$)/);
    const toMatch = lowercaseInput.match(/to\s+([a-zA-Z\s]+?)(?:\s+on|\s+$)/);
    
    // Extract dates
    const datePatterns = [
      /tomorrow/,
      /next\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)/,
      /(\d{1,2}\/\d{1,2}\/\d{4})/,
      /(\d{1,2}-\d{1,2}-\d{4})/
    ];

    let departure = '';
    const today = new Date();
    
    if (lowercaseInput.includes('tomorrow')) {
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      departure = tomorrow.toISOString().split('T')[0];
    } else if (lowercaseInput.includes('next friday')) {
      const nextFriday = new Date(today);
      const daysUntilFriday = (5 - today.getDay() + 7) % 7 || 7;
      nextFriday.setDate(today.getDate() + daysUntilFriday);
      departure = nextFriday.toISOString().split('T')[0];
    }

    return {
      from: fromMatch ? fromMatch[1].trim() : '',
      to: toMatch ? toMatch[1].trim() : '',
      departure,
      passengers: 1,
      class: 'economy'
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsProcessing(true);
    
    // Simulate AI processing
    setTimeout(() => {
      const parsedData = parseNaturalLanguage(message);
      onSearch(parsedData);
      setIsProcessing(false);
      setMessage('');
    }, 1000);
  };

  const suggestions = [
    "I want to fly from Lagos to Abuja next Friday",
    "Find me flights from Port Harcourt to Lagos tomorrow",
    "Show me flights from Abuja to Kano this weekend"
  ];

  return (
    <div className="mt-8">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Sparkles className="h-5 w-5 text-yellow-500" />
          <span className="font-medium text-gray-700">Try natural language</span>
        </div>
        
        <form onSubmit={handleSubmit} className="flex space-x-3">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Try: 'I want to fly from Lagos to Abuja next Friday'"
            className="flex-1 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          <button
            type="submit"
            disabled={!message.trim() || isProcessing}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isProcessing ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </form>

        <div className="mt-4">
          <p className="text-sm text-gray-500 mb-2">Try these examples:</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => setMessage(suggestion)}
                className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;