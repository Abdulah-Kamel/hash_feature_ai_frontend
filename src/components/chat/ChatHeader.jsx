"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Lock, PanelRight, PanelLeft, PanelLeftOpen, PanelLeftClose } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { useParams } from "next/navigation";
import { getFolder } from "@/server/actions/folders";

function ChatHeader({ chatOpen, onToggle }) {
  const { toggleSidebar, open: sidebarOpen } = useSidebar();
  const params = useParams();
  const [folderName, setFolderName] = React.useState("");

  React.useEffect(() => {
    async function loadFolderName() {
      if (!params?.id) return;
      try {
        const res = await getFolder(params.id);
        if (res?.success && res.data?.name) {
          setFolderName(res.data.name);
        }
      } catch (error) {
        console.error(error);
      }
    }
    loadFolderName();
  }, [params?.id]);

  return (
    <div className="flex items-center justify-between bg-sidebar px-4 py-3 relative">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-lg cursor-pointer"
          onClick={toggleSidebar}
          title={sidebarOpen ? "إخفاء الشريط الجانبي" : "إظهار الشريط الجانبي"}
        >
          {sidebarOpen ? (
            <PanelLeftClose className="size-5" />
          ) : (
            <PanelLeftOpen className="size-5" />
          )}
        </Button>
        <Button
          variant="ghost"
          className="rounded-lg cursor-pointer hidden sm:flex"
          onClick={onToggle}
        >
          <span className="ml-1 text-sm">
            {chatOpen ? (
              <PanelRight className="size-5" />
            ) : (
              <PanelLeft className="size-5" />
            )}
          </span>
          الشات
        </Button>
      </div>

      {/* Centered Folder Name */}
      <div className="flex-1 text-center">
        <span className="font-semibold text-lg">{folderName}</span>
      </div>
    </div>
  );
}

export default ChatHeader;