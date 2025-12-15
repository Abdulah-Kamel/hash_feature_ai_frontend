"use client";

import React from "react";
import {
  Sparkles,
  MessageSquareText,
  LayoutGrid,
  ClipboardList,
  Layers,
  Trash2,
} from "lucide-react";

const actions = [
  {
    id: "ask-ai",
    label: "اسأل الذكاء الاصطناعي",
    icon: Sparkles,
  },
  {
    id: "explain",
    label: "شرح",
    icon: MessageSquareText,
  },
  {
    id: "quiz",
    label: "إنشاء إختبار",
    icon: ClipboardList,
  },
];

export default function NodeContextMenu({ nodeId, onAction, onClose }) {
  const handleAction = (actionId) => {
    onAction?.(actionId, nodeId);
    onClose?.();
  };

  return (
    <div
      className="absolute top-0 left-full ml-2 z-9999 w-60 bg-[#1a1a1a] border border-gray-700 rounded-xl shadow-2xl overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-700 flex items-center justify-end gap-2">
        <div className="w-5 h-5 rounded bg-gray-700 flex items-center justify-center">
          <LayoutGrid className="w-3 h-3 text-gray-400" />
        </div>
        <span className="text-white text-sm font-medium">التفاعل</span>
      </div>

      {/* Actions List */}
      <div className="p-2 space-y-1">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={() => handleAction(action.id)}
              className={`w-full flex items-center justify-end gap-2 px-3 py-2 rounded-lg transition-colors cursor-pointer hover:bg-gray-800 text-gray-300`}
            >
              <span className="text-sm">{action.label}</span>
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center `}
              >
                <Icon className={`w-4 h-4 ${action.id === "ask-ai" ? "fill-primary text-primary" : "text-gray-400"}`} />
              </div>
            </button>
          );
        })}
      </div> 
    </div>
  );
}
