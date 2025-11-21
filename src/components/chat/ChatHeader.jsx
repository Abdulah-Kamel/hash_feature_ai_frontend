"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Lock } from "lucide-react";

function ChatHeader() {
  return (
    <div className="flex items-center justify-between bg-sidebar px-4 py-3">
      <div className="flex items-center gap-2">
        <span className="text-sm text-white">الشات</span>
      </div>
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