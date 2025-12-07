import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Bot, X, MessageCircle } from 'lucide-react';
import { sendChatMessage } from '../api/client';

export const AiAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([
    { role: 'ai', text: "Welcome to Earth Care Food Company! 🌱 I'm your Gut-Brain Coach. Ask me how to improve your mood with food or about our zero-waste dairy!" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // ESC key to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      return () => window.removeEventListener('keydown', handleEsc);
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const response = await sendChatMessage(sessionId, userMessage);
      setMessages(prev => [...prev, { role: 'ai', text: response.message }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { 
        role: 'ai', 
        text: "I'm currently having trouble connecting. Please try again later." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[350px] sm:w-[400px] h-[500px] bg-white rounded-2xl shadow-2xl border border-earth-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-300">
          
          {/* Header */}
          <div className="bg-earth-800 p-4 flex justify-between items-center text-cream-50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cream-500 rounded-full text-earth-900">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="font-serif font-bold text-sm">Earth Care Coach</h3>
                <p className="text-xs text-earth-200 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Online & Ready to Help
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-earth-300 hover:text-white transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-cream-50/50">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`
                    max-w-[85%] rounded-2xl p-3 text-sm leading-relaxed shadow-sm
                    ${msg.role === 'user' 
                      ? 'bg-earth-600 text-white rounded-br-none' 
                      : 'bg-white border border-earth-100 text-earth-800 rounded-bl-none'
                    }
                  `}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-earth-100 rounded-2xl rounded-bl-none p-3 shadow-sm flex items-center gap-2 text-earth-500">
                  <Loader2 size={14} className="animate-spin" />
                  <span className="text-xs">Consulting nature...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-earth-100">
            <div className="flex gap-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
                placeholder="Ask about gut health..."
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-earth-50 border-transparent rounded-xl text-sm focus:bg-white focus:border-earth-300 focus:ring-1 focus:ring-earth-200 outline-none transition text-earth-800 placeholder-earth-400 disabled:opacity-60"
                aria-label="Message input"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="p-2 bg-earth-700 text-white rounded-xl hover:bg-earth-600 disabled:opacity-50 transition shadow-md"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center justify-center w-14 h-14 rounded-full shadow-xl transition-all duration-300 hover:scale-105 active:scale-95
          ${isOpen ? 'bg-earth-700 text-earth-300 rotate-90' : 'bg-cream-500 text-earth-900 hover:bg-cream-400'}
        `}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} fill="currentColor" />}
      </button>
    </div>
  );
};