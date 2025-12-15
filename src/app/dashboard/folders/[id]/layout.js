"use client";
import * as React from "react";
import { apiClient } from "@/lib/api-client";
import { SidebarInset } from "@/components/ui/sidebar";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatThread from "@/components/chat/ChatThread";
import ChatInput from "@/components/chat/ChatInput";
import { useParams, useRouter } from "next/navigation";
import { fetchFolderFiles } from "@/server/actions/files";
import { useFileStore } from "@/store/fileStore";
import ChatSidebar from "@/components/chat/ChatSidebar";
import { Spinner } from "@/components/ui/spinner";
import FolderNav from "@/components/chat/FolderNav";
import { Card } from "@/components/ui/card";
import { usePathname } from "next/navigation";

export default function FolderLayout({ children }) {
  const [input, setInput] = React.useState("");
  const [chatOpen, setChatOpen] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState("chat"); // 'chat' or 'content'
  const pathname = usePathname();
  const isMindMap = pathname?.includes("/mindmap");
  const { id } = useParams();
  const router = useRouter();
  const setFolderId = useFileStore((s) => s.setFolderId);
  const setFiles = useFileStore((s) => s.setFiles);
  const folderId = useFileStore((s) => s.folderId);
  const getSelectedIds = useFileStore((s) => s.getSelectedIds);
  const [messages, setMessages] = React.useState([
    {
      id: "m1",
      author: "assistant",
      initials: "SL",
      time: "10:25",
      outgoing: false,
      content: <p>اهلا بك انا مساعدك هاش, كيف يمكنني مساعدتك اليوم؟</p>,
    },
  ]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const now = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    setMessages((prev) => [
      ...prev,
      {
        id: `m-${Date.now()}`,
        author: "user",
        initials: "م",
        time: now,
        outgoing: true,
        content: <p>{input}</p>,
      },
    ]);
    const payload = {
      folderId: folderId || id,
      userPrompt: input,
      fileIds: getSelectedIds(),
    };
    const loadingId = `m-loading-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      {
        id: loadingId,
        author: "assistant",
        initials: "SL",
        time: now,
        outgoing: false,
        content: (
          <div className="flex items-center">
            <Spinner className="size-4" />
          </div>
        ),
      },
    ]);
    try {
      setInput("");
      const res = await apiClient(`/api/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      const answer = json?.data?.answer || json?.message || "";
      const at = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      setMessages((prev) =>
        prev.map((m) =>
          m.id === loadingId
            ? {
                id: `m-${Date.now()}`,
                author: "assistant",
                initials: "SL",
                time: at,
                outgoing: false,
                content: <p>{answer}</p>,
              }
            : m
        )
      );
    } catch {
      const at = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      setMessages((prev) =>
        prev.map((m) =>
          m.id === loadingId
            ? {
                id: `m-${Date.now()}`,
                author: "assistant",
                initials: "SL",
                time: at,
                outgoing: false,
                content: <p>تعذر الحصول على الرد الآن</p>,
              }
            : m
        )
      );
    }
    setInput("");
  };

  const loadFiles = React.useCallback(async () => {
    if (!id) return;
    setFolderId(id);
    const res = await fetchFolderFiles(id);
    if (res?.success) {
      const items = Array.isArray(res.data?.data)
        ? res.data.data
        : Array.isArray(res.data)
        ? res.data
        : [];
      const normalized = items.map((it) => ({
        id: it._id,
        name: it.fileName,
      }));
      setFiles(normalized);

      // Auto-select all files
      if (normalized.length > 0) {
        useFileStore.getState().selectAll();
      }
    }
    if (res?.status) {
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      console.error(res.status);
    }
  }, [id, setFolderId, setFiles, router]);

  const fetchChatHistory = React.useCallback(async () => {
    if (!id) return;
    try {
      const res = await apiClient(`/api/ai/chat?folderId=${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const json = await res.json();

      if (json?.data && Array.isArray(json.data) && json.data.length > 0) {
        const historyMessages = [];
        const resource = json.data[0];

        if (resource.messages && Array.isArray(resource.messages)) {
          resource.messages.forEach((msg) => {
            // Add user question
            if (msg.question) {
              historyMessages.push({
                id: `msg-${msg._id}-q`,
                author: "user",
                initials: "م", // Me/User
                time: new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
                outgoing: true,
                content: <p>{msg.question}</p>,
              });
            }
            // Add AI answer
            if (msg.answer) {
              historyMessages.push({
                id: `msg-${msg._id}-a`,
                author: "assistant",
                initials: "SL", // SL/AI
                time: new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
                outgoing: false,
                content: <p className="whitespace-pre-wrap">{msg.answer}</p>,
              });
            }
          });
        }

        if (historyMessages.length > 0) {
          setMessages(historyMessages);
        }
      }
    } catch (error) {
      console.error("Failed to fetch chat history:", error);
    }
  }, [id]);

  // Set folderId immediately when id changes
  React.useEffect(() => {
    if (id) {
      setFolderId(id);
      fetchChatHistory();
    }
  }, [id, setFolderId, fetchChatHistory]);

  React.useEffect(() => {
    loadFiles();
    const fn = () => {
      console.log("files:refresh event received, reloading files...");
      loadFiles();
    };
    window.addEventListener("files:refresh", fn);
    return () => {
      window.removeEventListener("files:refresh", fn);
    };
  }, [loadFiles]);

  return (
    <SidebarInset className="">
      <ChatSidebar />
      {!isMindMap && (
        <ChatHeader
          chatOpen={chatOpen}
          onToggle={() => setChatOpen((v) => !v)}
        />
      )}

      {/* Mobile Tab Bar - Only visible on mobile */}
      {!isMindMap && (
        <div className="xl:hidden border-b bg-background sticky top-0 z-10">
          <div className="flex">
            <button
              onClick={() => setActiveTab("chat")}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-all ${
                activeTab === "chat"
                  ? "text-primary border-b-2 border-primary bg-primary/5"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              }`}
            >
              المحادثة
            </button>
            <button
              onClick={() => setActiveTab("content")}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-all ${
                activeTab === "content"
                  ? "text-primary border-b-2 border-primary bg-primary/5"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              }`}
            >
              المحتوى
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-4 min-h-[calc(100vh)]">
        {/* Chat Section - Hidden on mobile when content tab is active */}
        {!isMindMap && chatOpen && (
          <div
            className={`xl:col-span-2 max-h-[calc(100vh)] ${
              activeTab === "content" ? "hidden xl:block" : ""
            }`}
          >
            <div className="h-full shadow-sm overflow-hidden flex flex-col border-l">
              <ChatThread messages={messages} />
              <ChatInput
                value={input}
                onChange={setInput}
                onSend={handleSend}
              />
            </div>
          </div>
        )}

        {/* Content Section - Hidden on mobile when chat tab is active */}
        <div
          className={`${
            isMindMap
              ? "xl:col-span-4"
              : chatOpen
              ? "xl:col-span-2"
              : "xl:col-span-4"
          } ${isMindMap ? "" : activeTab === "chat" ? "hidden xl:block" : ""}`}
        >
          <Card className="bg-background rounded-lg p-4 h-full border-none flex flex-col overflow-y-auto">
            <div className="flex-1 overflow-hidden">{children}</div>
          </Card>
        </div>
      </div>
    </SidebarInset>
  );
}
