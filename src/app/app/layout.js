"use client"
import React, { useEffect } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import Sidebar from "@/components/SideBar";
import { usePathname } from "next/navigation";
import { useSidebarVariant } from "@/store/sidebarStore";
import GlobalJobLoader from "@/components/GlobalJobLoader";

const Layout = ({ children }) => {
  const pathname = usePathname();
  const variant = useSidebarVariant((s) => s.variant);
  const setVariant = useSidebarVariant((s) => s.setVariant);

  useEffect(() => {
    const isChat = pathname?.startsWith("/app/folders/");
    setVariant(isChat ? "chat" : "global");
  }, [pathname, setVariant]);

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "19rem",
        "--sidebar-width-mobile": "19rem",
      }}
    >
      <Sidebar variant={variant} />
      <SidebarInset className="w-full h-full">{children}</SidebarInset>
      <GlobalJobLoader />
    </SidebarProvider>
  );
};

export default Layout;
