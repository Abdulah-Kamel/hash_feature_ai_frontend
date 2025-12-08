"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Zap,
  LayoutGrid,
  Plus,
  ShoppingBag,
  Folder as FolderIcon,
  ChevronDown,
  Settings,
  LogOut,
  ChevronUp,
  FileText,
  Trash2,
  Menu,
  ChevronRight,
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
  useSidebar,
} from "../ui/sidebar";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Skeleton } from "../ui/skeleton";
import logo from "@/assets/logo.svg";
import ChatSidebar from "@/components/chat/ChatSidebar";
import useAuth from "@/hooks/use-auth";
import { logout } from "@/server/actions/files";
import { getFolders, deleteFolder } from "@/server/actions/folders";
import { toast } from "sonner";
import UploadDialogTrigger from "@/components/upload/UploadDialog";
import { useFileStore } from "@/store/fileStore";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { apiClient } from "@/lib/api-client";

const Index = ({ variant = "global" }) => {
  // const { user } = useAuth(); // Removed as requested
  const { toggleSidebar, open } = useSidebar();
  const [folders, setFolders] = React.useState([]);
  const [foldersLoading, setFoldersLoading] = React.useState(false);
  const [foldersExpanded, setFoldersExpanded] = React.useState(true);
  const [deletingIds, setDeletingIds] = React.useState(new Set());
  const [profile, setProfile] = React.useState(null);
  const router = useRouter();

  // Fetch user folders on mount
  React.useEffect(() => {
    const loadUserFolders = async () => {
      setFoldersLoading(true);
      try {
        const res = await getFolders();
        if (res?.success) {
          const list = Array.isArray(res.data) ? res.data : [];
          setFolders(list);
        } else {
          setFolders([]);
        }
      } catch (error) {
        console.error("Error loading folders:", error);
        setFolders([]);
      }
      setFoldersLoading(false);
    };

    const loadProfile = async () => {
      try {
        const res = await apiClient("/api/profiles");
        const data = await res.json();
        if (data?.data) {
          setProfile(data.data);
        }
      } catch {}
    };

    loadUserFolders();
    loadProfile();

    // Listen for folders:refresh event
    const handleRefresh = () => {
      console.log("folders:refresh event received in SideBar, reloading...");
      loadUserFolders();
    };

    window.addEventListener("folders:refresh", handleRefresh);

    return () => {
      window.removeEventListener("folders:refresh", handleRefresh);
    };
  }, []);

  const handleDeleteFolder = async (folder) => {
    const folderId = folder._id || folder.id;
    if (!folderId) return;

    // Add to deleting set
    setDeletingIds((prev) => new Set(prev).add(folderId));

    const toastId = toast.loading("جارٍ حذف المجلد...");
    try {
      const res = await deleteFolder(folderId);
      if (res?.success) {
        toast.success("تم حذف المجلد بنجاح", { id: toastId });
        // Remove folder from local state
        setFolders((prev) => prev.filter((f) => (f._id || f.id) !== folderId));
        // Remove from deleting set
        setDeletingIds((prev) => {
          const next = new Set(prev);
          next.delete(folderId);
          return next;
        });
      } else {
        toast.error(res?.error || "فشل حذف المجلد", { id: toastId });
        setDeletingIds((prev) => {
          const next = new Set(prev);
          next.delete(folderId);
          return next;
        });
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء الحذف", { id: toastId });
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(folderId);
        return next;
      });
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      toast.error("حدث خطأ أثناء تسجيل الخروج");
    }
  };

  if (variant === "chat") {
    return <ChatSidebar />;
  }

  const userName = profile?.name || "";
  const userEmail = profile?.email || "";
  const initials = userName?.trim()?.charAt(0) || "م";
  const plan = profile?.plan || "free";

  return (
    <>
      <Button
        onClick={toggleSidebar}
        variant="ghost"
        size="icon"
        className={`fixed top-4 right-4 ${
          open ? "z-0" : "z-50"
        } bg-background/80 backdrop-blur-sm border shadow-sm hover:bg-accent cursor-pointer`}
      >
        <Menu className="size-5" />
      </Button>
      <Sidebar aria-label="الشريط الجانبي العام">
        <div className="justify-end me-3 mt-3 hidden md:flex absolute top-0 left-0">
          <Button
            onClick={toggleSidebar}
            variant="ghost"
            size="icon"
            className="cursor-pointer"
          >
            {open ? (
              <ChevronRight className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </Button>
        </div>
        <SidebarHeader className="p-4">
          <Link href="/dashboard/overview" className="flex items-center gap-3">
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
                    <Link href="/dashboard/settings/billing">
                      <Zap className="size-4" />
                      <span>اشترك الآن</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive className="py-5">
                    <Link href="/dashboard/overview">
                      <LayoutGrid className="size-4" />
                      <span>لوحة التحكم</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <UploadDialogTrigger
                    onUploaded={(fid) => {
                      if (fid)
                        router.push(
                          `/dashboard/folders/${encodeURIComponent(fid)}`
                        );
                      // Trigger refresh
                      window.dispatchEvent(new Event("folders:refresh"));
                    }}
                  >
                    <SidebarMenuButton className="py-5 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Plus className="size-4" />
                        <span>ملف جديد</span>
                      </div>
                    </SidebarMenuButton>
                  </UploadDialogTrigger>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarSeparator />

          {/* Folders Section */}
          <SidebarGroup className="w-full">
            <SidebarGroupLabel>المجلدات</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild={false}
                    isActive
                    className="py-5 cursor-pointer"
                    onClick={() => setFoldersExpanded(!foldersExpanded)}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <FolderIcon className="size-4" />
                        <span>كل المجلدات</span>
                      </div>
                      <ChevronDown
                        className={`size-4 transition-transform duration-200 ${
                          foldersExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                {foldersExpanded &&
                  (foldersLoading ? (
                    <>
                      {[1, 2, 3].map((i) => (
                        <SidebarMenuItem key={i}>
                          <SidebarMenuButton className="py-4 justify-start">
                            <div className="flex items-center gap-2 w-full">
                              <Skeleton className="size-4 rounded" />
                              <Skeleton className="h-4 flex-1" />
                            </div>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </>
                  ) : Array.isArray(folders) && folders.length > 0 ? (
                    folders.map((f) => {
                      const id = f._id || f.id;
                      const isDeleting = deletingIds.has(id);

                      return (
                        <SidebarMenuItem key={id || f.name}>
                          <SidebarMenuButton
                            asChild
                            className={`py-4 justify-between group transition-all duration-300 ${
                              isDeleting ? "opacity-50 pointer-events-none" : ""
                            }`}
                          >
                            <Link
                              href={`/dashboard/folders/${encodeURIComponent(
                                id
                              )}/stages`}
                              className="flex items-center justify-between w-full"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <FolderIcon className="size-4 shrink-0" />
                                <span className="truncate">{f.name}</span>
                              </div>
                              <div
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  if (!isDeleting) {
                                    handleDeleteFolder(f);
                                  }
                                }}
                                className={`opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-destructive cursor-pointer ${
                                  isDeleting
                                    ? "opacity-100 cursor-not-allowed"
                                    : ""
                                }`}
                              >
                                {isDeleting ? (
                                  <div className="size-4 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <Trash2 className="size-4" />
                                )}
                              </div>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })
                  ) : (
                    <SidebarMenuItem>
                      <SidebarMenuButton className="py-4 justify-start">
                        <span className="text-sm text-muted-foreground">
                          لا توجد مجلدات
                        </span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarSeparator />
        </SidebarContent>

        <SidebarFooter className="p-4 space-y-4">
          {/* Plan Button */}
          <Link href="/dashboard/settings/billing" className="block w-full">
            <Button
              variant="outline"
              className="w-full justify-start gap-2 border-sidebar-border hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-pointer"
            >
              <Zap className="size-4" />
              <span>{plan === "pro" ? "الخطة الاحترافية" : "خطة مجانية"}</span>
            </Button>
          </Link>

          {/* User Profile */}
          <DropdownMenu dir="rtl">
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-3 p-2 rounded-md hover:bg-sidebar-accent transition-colors cursor-pointer">
                <Avatar className="size-10 bg-primary">
                  <AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-sm font-medium text-sidebar-foreground truncate">
                    {userName || "—"}
                  </span>
                  <span className="text-xs text-sidebar-foreground/70 truncate">
                    {userEmail || "—"}
                  </span>
                </div>
                <ChevronUp className="size-4 text-sidebar-foreground/70" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings" className="cursor-pointer">
                  <Settings className="size-4 ml-2" />
                  الإعدادات
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer text-destructive focus:text-destructive"
              >
                <LogOut className="size-4 ml-2" />
                تسجيل الخروج
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      </Sidebar>
    </>
  );
};

export default Index;
