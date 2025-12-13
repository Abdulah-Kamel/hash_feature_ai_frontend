import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { ArrowUpDown } from "lucide-react";

const CustomNode = ({ id, data, selected }) => {
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
      className={`px-3 py-2 shadow-sm rounded-xl bg-white border min-w-[150px] flex items-center justify-between gap-3 relative transition-all duration-200 ${
        selected ? "border-blue-500 ring-2 ring-blue-100" : "border-gray-200"
      }`}
    >
      {/* Target Handle (Left) */}
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-blue-500 !border-2 !border-white !-left-[6px]"
      />

      <div className="text-left flex-1 font-medium text-gray-700 text-sm">
        {data.label}
      </div>

      <div className="p-1.5 rounded-lg border border-gray-100 cursor-pointer hover:bg-gray-100">
        <ArrowUpDown className="w-3.5 h-3.5 transform rotate-45" />
      </div>

      {/* Source Handle (Right) */}
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-blue-500 !border-2 !border-white !-right-[6px]"
      />
    </div>
  );
};

export default memo(CustomNode);
