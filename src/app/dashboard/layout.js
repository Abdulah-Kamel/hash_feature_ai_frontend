import React from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import Sidebar from "@/components/SideBar";

const layout = ({ children }) => {
  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "19rem",
        "--sidebar-width-mobile": "19rem",
      }}
    >
      <Sidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
};

export default layout;
