"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Lock, ChevronLeft, PanelRight, PanelLeft } from "lucide-react";

function ChatHeader({ chatOpen, onToggle }) {
  return (
    <div className="flex items-center justify-between bg-sidebar px-4 py-3">
      <Button variant="ghost" className="rounded-lg cursor-pointer" onClick={onToggle}>
        <span className="ml-1 text-sm">{chatOpen ? <PanelRight className="size-5" /> : <PanelLeft className="size-5" />}</span>
        الشات
      </Button>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="rounded-lg">
          <MoreHorizontal className="size-5" />
        </Button>
        <Lock className="size-4 text-muted-foreground" />
      </div>
    </div>
  );
}

export default ChatHeader;