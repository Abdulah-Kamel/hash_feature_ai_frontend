"use client";
import * as React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Check, CheckCheck, MoreHorizontal } from "lucide-react";

function ChatMessage({ author, initials, time, outgoing = false, children }) {
  return (
    <div className={cn("flex items-start gap-3", outgoing ? "justify-start" : "justify-end")}>
       {outgoing && (
        <Avatar className="size-10 bg-primary/10">
          <AvatarFallback className="bg-primary text-primary-foreground font-semibold">م</AvatarFallback>
        </Avatar>
      )}
      <div className={cn("max-w-[640px] w-fit", outgoing && "items-end")}> 
        <Card className={cn(
          "rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-xs",
          outgoing ? "bg-primary text-primary-foreground" : "bg-card"
        )}>
          {children}
        </Card>
        <div className={cn("mt-1 flex items-center gap-2", outgoing ? "justify-start" : "justify-end")}> 
          <span className={"text-xs text-foreground/70 tabular-nums"}>{time}</span>
          <CheckCheck className={cn("size-5", outgoing ? "text-primary-foreground/80" : "text-foreground/50")} />
        </div>
      </div>
     
      {!outgoing && (
        <Avatar className="size-10 bg-primary/10">
          <AvatarFallback className="bg-primary/20 text-primary font-semibold">{initials}</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}

export default ChatMessage;