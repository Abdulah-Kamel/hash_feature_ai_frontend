"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Mic, Plus, X, Loader2, User, Bot } from "lucide-react";
import { apiClient } from "@/lib/api-client";

export default function MindMapChat({ 
  isOpen, 
  onClose, 
  activeNode,
  onSendMessage,
  fileId,
  folderId
}) {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!isOpen) return null;

  const handleSend = async () => {
    if (!message.trim() || isLoading) return;
    
    const userMessage = message;
    const userPrompt = `اشرح لى ${message}`;
    
    // Add user message to chat
    setMessages(prev => [...prev, { 
      type: 'user', 
      content: userMessage,
      timestamp: new Date()
    }]);
    
    setMessage("");
    setIsLoading(true);
    
    try {
      const res = await apiClient('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userPrompt,
          folderId: folderId || '',
          fileIds: fileId ? [fileId] : [],
        }),
      });
      
      const data = await res.json();
      
      // Add AI response to chat
      setMessages(prev => [...prev, { 
        type: 'ai', 
        content: data.response || data.message || data.data || 'تم استلام الرد',
        timestamp: new Date()
      }]);
      
      onSendMessage?.(userMessage, activeNode, data);
    } catch (error) {
      console.error('Chat API error:', error);
      setMessages(prev => [...prev, { 
        type: 'ai', 
        content: 'حدث خطأ أثناء المعالجة',
        isError: true,
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4">
      {/* Messages section - shows above chat input when there are messages */}
      {messages.length > 0 && (
        <div className="bg-[#1a1a1a] rounded-t-2xl border border-b-0 border-gray-700 max-h-80 overflow-y-auto mb-0">
          <div className="p-4 space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-3 ${msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.type === 'user' ? 'bg-primary' : 'bg-gray-700'
                }`}>
                  {msg.type === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>
                
                {/* Message bubble */}
                <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                  msg.type === 'user' 
                    ? 'bg-primary text-white' 
                    : msg.isError 
                      ? 'bg-red-900/50 text-red-300'
                      : 'bg-gray-800 text-gray-200'
                }`}>
                  <p className="text-sm whitespace-pre-wrap text-right" dir="rtl">
                    {msg.content}
                  </p>
                </div>
              </div>
            ))}
            
            {/* Loading indicator */}
            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-gray-800 rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>
      )}
      
      {/* Chat input */}
      <div className={`bg-[#1a1a1a] shadow-2xl border border-gray-700 overflow-hidden ${
        messages.length > 0 ? 'rounded-b-2xl' : 'rounded-2xl'
      }`}>
        <div className="flex justify-between items-center gap-2 py-2 px-3 border-b border-gray-700">
          {/* Active node indicator */}
          {activeNode && (
            <div className="px-4">
              <span className="text-xs text-gray-500">السؤال عن:</span>
              <span className="text-sm text-white mr-2">{activeNode.label}</span>
            </div>
          )}

          {/* Close button */}
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-700 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Input area */}
        <div className="p-3 flex items-center gap-3">
          {/* Input field */}
          <div className="flex-1 relative">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="مرحباً كيف يمكنني مساعدتك اليوم؟"
              className="w-full bg-transparent text-white text-sm placeholder-gray-500 outline-none py-2 text-right"
              dir="rtl"
            />
          </div>
          
          {/* Plus button */}
          <button className="p-2 rounded-full hover:bg-gray-700 transition-colors cursor-pointer">
            <Plus className="w-5 h-5 text-gray-400" />
          </button>

          {/* Mic button */}
          <button className="p-2 rounded-full hover:bg-gray-700 transition-colors cursor-pointer">
            <Mic className="w-5 h-5 text-gray-400" />
          </button>

          {/* Send button */}
          <button
            onClick={handleSend}
            disabled={!message.trim() || isLoading}
            className={`p-2 rounded-full transition-colors cursor-pointer ${
              message.trim() && !isLoading
                ? "bg-primary hover:bg-primary/80"
                : "bg-gray-700"
            }`}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 text-white animate-spin" />
            ) : (
              <Send className="w-5 h-5 text-white" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

