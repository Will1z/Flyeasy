import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Plane, Calendar, MapPin, Users, Sparkles, CheckCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFlightContext } from '../../context/FlightContext';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';
import { chatWithAI } from '../../services/api';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  data?: any;
  actions?: MessageAction[];
}

interface MessageAction {
  type: 'search' | 'book' | 'modify';
  label: string;
  data: any;
}

const AIChat = () => {
  const navigate = useNavigate();
  const { setSearchParams, setFlights, setSelectedFlight } = useFlightContext();
  const { isAuthenticated } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hello! I'm your personal travel assistant. I can help you find and book flights using natural language. Just tell me where you'd like to go and when!",
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationState, setConversationState] = useState<any>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const parseNaturalLanguage = (input: string) => {
    const lowercaseInput = input.toLowerCase();
    
    // Extract cities/airports
    const fromPatterns = [
      /from\s+([a-zA-Z\s]+?)(?:\s+to|\s+$)/,
      /leaving\s+([a-zA-Z\s]+?)(?:\s+to|\s+$)/,
      /departing\s+([a-zA-Z\s]+?)(?:\s+to|\s+$)/
    ];
    
    const toPatterns = [
      /to\s+([a-zA-Z\s]+?)(?:\s+on|\s+in|\s+$)/,
      /going\s+to\s+([a-zA-Z\s]+?)(?:\s+on|\s+in|\s+$)/,
      /flying\s+to\s+([a-zA-Z\s]+?)(?:\s+on|\s+in|\s+$)/
    ];

    let from = '';
    let to = '';

    for (const pattern of fromPatterns) {
      const match = lowercaseInput.match(pattern);
      if (match) {
        from = match[1].trim();
        break;
      }
    }

    for (const pattern of toPatterns) {
      const match = lowercaseInput.match(pattern);
      if (match) {
        to = match[1].trim();
        break;
      }
    }

    // Extract dates
    let departure = '';
    const today = new Date();
    
    if (lowercaseInput.includes('tomorrow')) {
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      departure = tomorrow.toISOString().split('T')[0];
    } else if (lowercaseInput.includes('next week')) {
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);
      departure = nextWeek.toISOString().split('T')[0];
    } else if (lowercaseInput.includes('next friday')) {
      const nextFriday = new Date(today);
      const daysUntilFriday = (5 - today.getDay() + 7) % 7 || 7;
      nextFriday.setDate(today.getDate() + daysUntilFriday);
      departure = nextFriday.toISOString().split('T')[0];
    } else if (lowercaseInput.includes('next monday')) {
      const nextMonday = new Date(today);
      const daysUntilMonday = (1 - today.getDay() + 7) % 7 || 7;
      nextMonday.setDate(today.getDate() + daysUntilMonday);
      departure = nextMonday.toISOString().split('T')[0];
    }

    // Extract passenger count
    let passengers = 1;
    const passengerMatch = lowercaseInput.match(/(\d+)\s+(?:passenger|person|people|traveler)/);
    if (passengerMatch) {
      passengers = parseInt(passengerMatch[1]);
    }

    // Extract class preference
    let flightClass = 'economy';
    if (lowercaseInput.includes('business') || lowercaseInput.includes('business class')) {
      flightClass = 'business';
    } else if (lowercaseInput.includes('first') || lowercaseInput.includes('first class')) {
      flightClass = 'first';
    } else if (lowercaseInput.includes('premium')) {
      flightClass = 'premium';
    }

    return {
      from: from.charAt(0).toUpperCase() + from.slice(1),
      to: to.charAt(0).toUpperCase() + to.slice(1),
      departure,
      passengers,
      class: flightClass
    };
  };

  const generateAIResponse = (userInput: string, parsedData: any) => {
    const { from, to, departure, passengers, class: flightClass } = parsedData;
    
    // Check if we have enough information
    if (!from && !to) {
      return {
        content: "I'd love to help you find flights! Could you tell me where you'd like to fly from and to? For example, you could say 'I want to fly from Lagos to Dubai next Friday'.",
        actions: []
      };
    }

    if (!from) {
      return {
        content: `Great! I see you want to go to ${to}. Where would you like to depart from?`,
        actions: []
      };
    }

    if (!to) {
      return {
        content: `Perfect! You're departing from ${from}. Where would you like to fly to?`,
        actions: []
      };
    }

    if (!departure) {
      return {
        content: `Excellent! I found your route: ${from} to ${to}. When would you like to travel? You can say something like 'tomorrow', 'next Friday', or give me a specific date.`,
        actions: []
      };
    }

    // We have all the information needed
    const formattedDate = new Date(departure).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return {
      content: `Perfect! I found everything I need:
      
✈️ **Route:** ${from} → ${to}
📅 **Date:** ${formattedDate}
👥 **Passengers:** ${passengers} ${passengers === 1 ? 'guest' : 'guests'}
⭐ **Class:** ${flightClass.charAt(0).toUpperCase() + flightClass.slice(1)}

Let me search for the best flights for you!`,
      actions: [
        {
          type: 'search',
          label: 'Search Flights',
          data: { from, to, departure, passengers, class: flightClass }
        }
      ]
    };
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    try {
      // Send conversation to backend
      const aiReply = await chatWithAI([
        ...messages.map(m => ({ role: m.type === 'user' ? 'user' : 'assistant', content: m.content })),
        { role: 'user', content: input }
      ]);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiReply,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error: any) {
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), type: 'ai', content: 'Sorry, I could not process your request.', timestamp: new Date() }]);
    }
    setIsTyping(false);
  };

  const handleAction = async (action: MessageAction) => {
    if (action.type === 'search') {
      setIsTyping(true);
      
      // Simulate flight search
      setTimeout(() => {
        const mockFlights = [
          {
            id: '1',
            airline: 'Emirates',
            from: action.data.from,
            to: action.data.to,
            departure: '08:30',
            arrival: '10:45',
            duration: '2h 15m',
            price: 285000,
            stops: 0,
            aircraft: 'Boeing 777-300ER',
            class: action.data.class
          },
          {
            id: '2',
            airline: 'Qatar Airways',
            from: action.data.from,
            to: action.data.to,
            departure: '14:20',
            arrival: '16:35',
            duration: '2h 15m',
            price: 320000,
            stops: 0,
            aircraft: 'Airbus A350',
            class: action.data.class
          }
        ];

        setSearchParams(action.data);
        setFlights(mockFlights);

        const resultsMessage: Message = {
          id: Date.now().toString(),
          type: 'ai',
          content: `🎉 Great news! I found ${mockFlights.length} excellent flights for your journey. Here are your options:

**Flight 1: Emirates**
⏰ Departure: 08:30 → Arrival: 10:45
💰 Price: ₦285,000
✈️ Aircraft: Boeing 777-300ER

**Flight 2: Qatar Airways**
⏰ Departure: 14:20 → Arrival: 16:35
💰 Price: ₦320,000
✈️ Aircraft: Airbus A350

Would you like to book one of these flights or see more details?`,
          timestamp: new Date(),
          data: { flights: mockFlights },
          actions: [
            {
              type: 'book',
              label: 'Book Emirates Flight',
              data: mockFlights[0]
            },
            {
              type: 'book',
              label: 'Book Qatar Airways Flight',
              data: mockFlights[1]
            }
          ]
        };

        setMessages(prev => [...prev, resultsMessage]);
        setIsTyping(false);
      }, 2000);
    } else if (action.type === 'book') {
      if (!isAuthenticated) {
        toast.error('Please sign in to book flights');
        navigate('/login');
        return;
      }

      setSelectedFlight(action.data);
      navigate(`/booking/${action.data.id}`);
      
      const bookingMessage: Message = {
        id: Date.now().toString(),
        type: 'ai',
        content: `Perfect choice! I'm taking you to complete your booking for the ${action.data.airline} flight. You'll be able to enter passenger details and payment information on the next page.`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, bookingMessage]);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const suggestions = [
    "I want to fly from Lagos to Dubai next Friday",
    "Find me business class flights to London tomorrow",
    "Book 2 passengers from Abuja to New York next week",
    "Show me first class flights to Paris"
  ];

  return (
    <div className="max-w-4xl mx-auto h-[600px] bg-white rounded-3xl shadow-2xl border border-champagne-200 overflow-hidden">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-navy-800 to-navy-900 p-6 text-white">
        <div className="flex items-center space-x-4">
          <div className="bg-gradient-to-r from-gold-400 to-champagne-400 p-3 rounded-full">
            <Bot className="h-6 w-6 text-navy-900" />
          </div>
          <div>
            <h3 className="font-serif text-xl font-bold">Flyeasy AI Assistant</h3>
            <p className="font-sans text-sm text-ivory-200">Your personal travel concierge</p>
          </div>
          <div className="ml-auto flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="font-sans text-sm">Online</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 h-[400px]">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start space-x-3 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`p-2 rounded-full ${
                message.type === 'user' 
                  ? 'bg-navy-100' 
                  : 'bg-gradient-to-r from-gold-400 to-champagne-400'
              }`}>
                {message.type === 'user' ? (
                  <User className="h-4 w-4 text-navy-800" />
                ) : (
                  <Bot className="h-4 w-4 text-navy-900" />
                )}
              </div>
              
              <div className={`rounded-2xl p-4 ${
                message.type === 'user'
                  ? 'bg-navy-800 text-white'
                  : 'bg-champagne-50 text-charcoal-800 border border-champagne-200'
              }`}>
                <div className="font-sans whitespace-pre-line">{message.content}</div>
                
                {message.actions && message.actions.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {message.actions.map((action, index) => (
                      <button
                        key={index}
                        onClick={() => handleAction(action)}
                        className="block w-full bg-gradient-to-r from-navy-800 to-navy-900 text-white px-4 py-2 rounded-xl hover:from-navy-700 hover:to-navy-800 transition-all font-sans font-medium text-sm"
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}
                
                <div className={`text-xs mt-2 ${
                  message.type === 'user' ? 'text-ivory-300' : 'text-charcoal-500'
                }`}>
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-3 max-w-[80%]">
              <div className="bg-gradient-to-r from-gold-400 to-champagne-400 p-2 rounded-full">
                <Bot className="h-4 w-4 text-navy-900" />
              </div>
              <div className="bg-champagne-50 border border-champagne-200 rounded-2xl p-4">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-charcoal-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-charcoal-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-charcoal-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-champagne-200 p-6">
        <div className="flex space-x-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Tell me where you'd like to fly..."
            className="flex-1 px-4 py-3 border border-champagne-200 rounded-xl focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all font-sans text-charcoal-800"
          />
          <button
            onClick={handleSendMessage}
            disabled={!input.trim() || isTyping}
            className="bg-gradient-to-r from-navy-800 to-navy-900 text-white px-6 py-3 rounded-xl hover:from-navy-700 hover:to-navy-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>

        {/* Suggestions */}
        <div className="mt-4">
          <p className="font-sans text-sm text-charcoal-500 mb-2">Try these examples:</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => setInput(suggestion)}
                className="font-sans text-xs bg-champagne-100 hover:bg-champagne-200 text-charcoal-700 px-3 py-1 rounded-full transition-colors"
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

export default AIChat;