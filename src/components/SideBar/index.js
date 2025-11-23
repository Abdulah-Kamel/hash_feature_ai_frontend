"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Zap,
  LayoutGrid,
  Plus,
  ShoppingBag,
  Folder,
  ChevronDown,
  Settings,
} from "lucide-react";
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
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";
import logo from "@/assets/logo.svg";

const index = () => {
  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center gap-3">
          <Image src={logo} alt="Hash Plus Logo" className="h-8 w-auto" />
          <span className="text-xl font-bold text-sidebar-foreground">
            هاش بلس
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {/* Navigation Links */}
        <SidebarGroup className="w-full">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="py-5">
                  <Link href="/subscribe">
                    <Zap className="size-4" />
                    <span>اشترك الآن</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive className="py-5">
                  <Link href="/dashboard">
                    <LayoutGrid className="size-4" />
                    <span>لوحة التحكم</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="py-5">
                  <Link href="/dashboard/chat">
                    <Plus className="size-4" />
                    <span>ملف جديد</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="py-5">
                  <Link href="/marketplace">
                    <ShoppingBag className="size-4" />
                    <span>السوق</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Files Section */}
        <SidebarGroup className="w-full">
          <SidebarGroupLabel>الملفات</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive className="py-5">
                  <Link href="/files" className="justify-between">
                    <div className="flex items-center gap-2">
                      <Folder className="size-4" />
                      <span>كل الملفات</span>
                    </div>
                    <ChevronDown className="size-4" />
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Settings Section */}
        <SidebarGroup className="w-full">
          <SidebarGroupLabel>الإعدادات</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="py-5">
                  <Link href="/dashboard/settings">
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
};

export default index;
