"use client";
import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Home, Settings, Zap } from "lucide-react";
import UploadDialogTrigger from "@/components/upload/UploadDialog";
import { useFileStore } from "@/store/fileStore";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "../ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo.svg";

function SidebarSection({ title, children }) {
  return (
    <div className="space-y-2">
      <p className="text-sm text-foreground/80">{title}</p>
      {children}
    </div>
  );
}

function SourceItem({ label, checked, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-start gap-2 rounded-xl bg-card px-3 py-2 text-sm hover:bg-card/80"
    >
      <Checkbox
        checked={checked}
        readOnly
        className="data-[state=checked]:bg-primary border-white"
      />
      <span>{label}</span>
    </button>
  );
}

export default function ChatSidebar() {
  const files = useFileStore((s) => s.files);
  const selectedIds = useFileStore((s) => s.selectedIds);
  const toggleSelect = useFileStore((s) => s.toggleSelect);
  console.log(selectedIds);

  const sources = React.useMemo(() => {
    return files.map((f) => ({
      id: f.id,
      label: f.name,
      checked: selectedIds.has ? selectedIds.has(f.id) : false,
    }));
  }, [files, selectedIds]);

  const onToggleSource = (i) => {
    const id = sources[i]?.id;
    if (id) toggleSelect(id);
  };

  return (
    <Sidebar aria-label="الشريط الجانبي العام">
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center gap-3">
          <Image src={logo} alt="Hash Plus Logo" className="h-8 w-auto" />
          <span className="text-xl font-bold text-sidebar-foreground">
            هاش بلس
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup title="الرئيسية">
          <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="py-5">
                  <Link href="/dashboard/overview">
                    <Home className="size-4" />
                    <span>الرئيسية</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup title="المصادر">
          <p className="text-sm text-foreground/80">اختر المصادر</p>
          <div className="space-y-2 mt-4">
            {sources.map((s, i) => (
              <SourceItem
                key={s.id}
                label={s.label}
                checked={s.checked}
                onToggle={() => onToggleSource(i)}
              />
            ))}
            {sources.length === 0 && (
              <div className="text-sm text-muted-foreground">لا توجد مصادر</div>
            )}
          </div>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Settings Section */}
        <SidebarGroup className="w-full">
          <SidebarGroupLabel>الإعدادات</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="py-5">
                  <Link href="/dashboard/settings/settings">
                    <Settings className="size-4" />
                    <span>الإعدادات</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 space-y-4">
        {/* Free Plan Button */}
        <Button
          variant="outline"
          className="w-full justify-start gap-2 border-sidebar-border hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <Zap className="size-4" />
          <span>خطة مجانية</span>
        </Button>

        {/* User Profile */}
        <div className="flex items-center gap-3 p-2 rounded-md hover:bg-sidebar-accent transition-colors cursor-pointer">
          <Avatar className="size-10 bg-primary">
            <AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold">
              م
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-sm font-medium text-sidebar-foreground truncate">
              محمود عبد الرحمن
            </span>
            <span className="text-xs text-sidebar-foreground/70 truncate">
              mahmoudabdo@gmail.com
            </span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
