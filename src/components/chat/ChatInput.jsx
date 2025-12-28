"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Send, Paperclip, Mic, Smile } from "lucide-react";

function ChatInput({ value, onChange, onSend }) {
  const ref = React.useRef(null);
  const autoGrow = React.useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  }, []);

  React.useEffect(() => {
    autoGrow();
  }, [value, autoGrow]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="bg-background px-4 py-3 rounded-b-2xl">
      <div className="relative border border-[#515355] rounded-2xl bg-card p-4 min-h-[144px]">
        <textarea
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onInput={autoGrow}
          onKeyDown={handleKeyDown}
          aria-label="إدخال رسالة"
          placeholder="اكتب هنا"
          rows={1}
          className="w-full h-full resize-none bg-transparent pr-2 pl-1 pt-1 pb-16 outline-none text-foreground"
        />
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <Button
            onClick={onSend}
            className="rounded-full px-5 py-2 cursor-pointer"
          >
            ارسال <Send className="size-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ChatInput;