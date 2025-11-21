"use client";
import * as React from "react";
import { SidebarInset } from "@/components/ui/sidebar";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatThread from "@/components/chat/ChatThread";
import ChatInput from "@/components/chat/ChatInput";
import LeftPanel from "@/components/chat/LeftPanel";

export default function ChatPage() {
  const [input, setInput] = React.useState("");
  const [messages, setMessages] = React.useState([
    {
      id: "m1",
      author: "assistant",
      initials: "SL",
      time: "10:25",
      outgoing: false,
      content: <p>Hello! I’m your personal AI Assistant Slothpilot.</p>,
    },
    {
      id: "m2",
      author: "user",
      initials: "م",
      time: "11:25",
      outgoing: true,
      content: <p>أريد تلخيص لهذا المحاضرة</p>,
    },
    {
      id: "m3",
      author: "assistant",
      initials: "SL",
      time: "12:25",
      outgoing: false,
      content: (
        <div className="space-y-2">
          <p>
            Do Androids Dream of Electric Sheep? is a 1968 dystopian science fiction novel by American writer Philip K. Dick.
          </p>
          <ol className="list-decimal pr-5 space-y-1">
            <li>Androids and Humans: uneasy coexistence; androids rebel and escape to Earth.</li>
            <li>Empathy and Identity: Voigt-Kampff Test measures emotional responses.</li>
            <li>Status Symbols: owning real animals is a status symbol due to mass extinctions.</li>
          </ol>
        </div>
      ),
    },
  ]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        id: `m-${Date.now()}`,
        author: "user",
        initials: "م",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        outgoing: true,
        content: <p>{input}</p>,
      },
    ]);
    setInput("");
  };

  return (
    <SidebarInset className="min-h-screen">
      <ChatHeader />
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 min-h-[calc(100vh-64px)]">
        <div className="xl:col-span-2 h-full">
          <div className="h-full shadow-sm overflow-hidden flex flex-col border-l">
            <ChatThread messages={messages} />
            <ChatInput value={input} onChange={setInput} onSend={handleSend} />
          </div>
        </div>
        <div className="xl:col-span-2">
          <LeftPanel />
        </div>
      </div>
    </SidebarInset>
  );
}