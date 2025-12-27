import React, { memo, useState, useRef, useEffect } from "react";
import { Handle, Position } from "@xyflow/react";
import { ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import NodeContextMenu from "./NodeContextMenu";

const CustomNode = ({ id, data }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const nodeRef = useRef(null);

  // Use menuOpen as the "active" state for styling
  const isActive = menuOpen;
  
  // Expand/collapse state from parent container
  const hasChildren = data?.hasChildren || false;
  const isExpanded = data?.isExpanded || false;

  // Close menu when clicking outside
  useEffect(() => {
    if (!menuOpen) return;

    const handleClickOutside = (event) => {
      if (nodeRef.current && !nodeRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const handleAction = (actionId, nodeId) => {
    console.log("Action triggered:", actionId, "for node:", nodeId);
    data?.onAction?.(actionId, nodeId, data);
  };
  
  const handleToggleExpand = (e) => {
    e.stopPropagation();
    data?.onToggleExpand?.(id);
  };

  if (data?.skeleton) {
    return (
      <div className="px-3 py-2 shadow-sm rounded-xl bg-white border border-gray-200 min-w-[160px] flex items-center gap-3 relative">
        <Handle
          type="target"
          position={Position.Left}
          className="!w-3 !h-3 !bg-gray-300 !border-2 !border-white !-left-[6px]"
        />
        <div className="flex-1">
          <div className="h-3 rounded bg-gray-200 animate-pulse" />
        </div>
        <Handle
          type="source"
          position={Position.Right}
          className="!w-3 !h-3 !bg-gray-300 !border-2 !border-white !-right-[6px]"
        />
      </div>
    );
  }

  return (
    <div
      ref={nodeRef}
      className={`px-3 py-2 shadow-sm rounded-xl border min-w-[150px] flex items-center justify-between gap-3 relative transition-all duration-200 ${
        isActive
          ? "bg-primary border-primary text-white"
          : "bg-white border-gray-200 text-gray-700"
      }`}
    >
      {/* Target Handle (Left) */}
      <Handle
        type="target"
        position={Position.Left}
        className={`!w-3 !h-3 !border-2 !-left-[6px] ${
          isActive ? "!bg-white !border-primary" : "!bg-blue-500 !border-white"
        }`}
      />

      <div className={`text-left flex-1 font-medium text-sm ${isActive ? "text-white" : "text-gray-700"}`}>
        {data.label}
      </div>

      {/* Menu Toggle Button */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          setMenuOpen(!menuOpen);
        }}
        className={`p-1.5 rounded-lg border cursor-pointer transition-colors ${
          isActive
            ? "border-white/30 hover:bg-white/20"
            : "border-gray-100 hover:bg-gray-100"
        }`}
      >
        <ArrowUpDown className={`w-3.5 h-3.5 transform rotate-45 ${isActive ? "text-white" : ""}`} />
      </div>

      {/* Context Menu */}
      {menuOpen && (
        <NodeContextMenu
          nodeId={id}
          onAction={handleAction}
          onClose={() => setMenuOpen(false)}
        />
      )}

      {/* Source Handle / Expand Button (Right) */}
      {hasChildren ? (
        <div
          onClick={handleToggleExpand}
          className={`absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 z-10 ${
            isActive
              ? "bg-white text-primary border-2 border-primary"
              : "bg-blue-500 text-white border-2 border-white"
          }`}
        >
          <ChevronRight
            className={`w-4 h-4 transition-transform duration-300 ${
              isExpanded ? "rotate-180" : "rotate-0"
            }`} 
          />
        </div>
      ) : (
        <Handle
          type="source"
          position={Position.Right}
          className={`!w-3 !h-3 !border-2 !-right-[6px] ${
            isActive ? "!bg-white !border-primary" : "!bg-blue-500 !border-white"
          }`}
        />
      )}
      
      {/* Hidden source handle for edges when hasChildren */}
      {hasChildren && (
        <Handle
          type="source"
          position={Position.Right}
          className="!w-0 !h-0 !opacity-0 !-right-[6px]"
        />
      )}
    </div>
  );
};

export default memo(CustomNode);

