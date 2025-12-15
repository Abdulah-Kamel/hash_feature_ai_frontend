"use client";

import React, { useState } from "react";
import { Send, Mic, Plus, X } from "lucide-react";

export default function MindMapChat({ 
  isOpen, 
  onClose, 
  activeNode,
  onSendMessage 
}) {
  const [message, setMessage] = useState("");

  if (!isOpen) return null;

  const handleSend = () => {
    if (!message.trim()) return;
    onSendMessage?.(message, activeNode);
    setMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4">
      <div className="bg-[#1a1a1a] rounded-2xl shadow-2xl border border-gray-700 overflow-hidden">
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
            disabled={!message.trim()}
            className={`p-2 rounded-full transition-colors cursor-pointer ${
              message.trim()
                ? "bg-primary hover:bg-primary/80"
                : "bg-gray-700"
            }`}
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
