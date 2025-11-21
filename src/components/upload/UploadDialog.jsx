"use client";
import * as React from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, Upload, X } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

function UploadDialogTrigger({ children }) {
  const [open, setOpen] = React.useState(false);
  const [workspace, setWorkspace] = React.useState("الذكاء الاصطناعي");
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="border-[#515355] bg-background rounded-2xl p-6">
        <DialogHeader className="justify-center">
          <DialogTitle className="text-xl font-semibold text-muted-foreground">ارفع الملف</DialogTitle>
        </DialogHeader>
        <DialogClose asChild>
          <button className="absolute top-4 right-4 size-8 grid place-items-center rounded-md bg-card">
            <X className="size-4 cursor-pointer" />
          </button>
        </DialogClose>
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm">مساحة العمل</p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center justify-between h-12 w-full rounded-xl border px-3 bg-card border-[#515355] cursor-pointer">
                  <span className="text-sm text-foreground/80">{workspace}</span>
                  <ChevronDown className="size-4 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-full min-w-[12rem]">
                {[
                  "الذكاء الاصطناعي",
                  "علوم الحاسب",
                  "الرياضيات",
                  "الفيزياء",
                ].map((opt) => (
                  <DropdownMenuItem key={opt} onSelect={() => setWorkspace(opt)}>
                    {opt}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="rounded-2xl border border-dashed border-[#515355] bg-card p-8 grid place-items-center text-center gap-4">
            <Upload className="size-8 text-muted-foreground" />
            <p className="text-sm">أرفق الملف هنا</p>
            <Button className="bg-primary text-primary-foreground px-10 py-5 cursor-pointer">ارفع الملف</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default UploadDialogTrigger;