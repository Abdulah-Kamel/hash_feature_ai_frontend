"use client";
import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus } from "lucide-react";
import UploadDialogTrigger from "@/components/upload/UploadDialog";

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
      className="w-full flex items-center justify-end gap-2 rounded-xl bg-card px-3 py-2 text-sm hover:bg-card/80"
    >
      <span>{label}</span>
      <Checkbox checked={checked} readOnly className="data-[state=checked]:bg-primary" />
    </button>
  );
}

export default function ChatSidebar({ sources, onToggleSource }) {
  return (
    <Card className="bg-background rounded-2xl p-4 h-full flex flex-col justify-between">
      <div className="space-y-4">
        <SidebarSection title="المصادر">
          <div className="space-y-2">
            {sources.map((s, i) => (
              <SourceItem
                key={s.id}
                label={s.label}
                checked={s.checked}
                onToggle={() => onToggleSource?.(i)}
              />
            ))}
          </div>
        </SidebarSection>
        <UploadDialogTrigger>
          <Button variant="outline" className="w-full justify-end rounded-full bg-primary/10 text-primary">
            <span>أضف ملف جديد</span>
            <Plus className="size-4 ml-2" />
          </Button>
        </UploadDialogTrigger>
        <div className="h-px bg-border" />
        <p className="text-sm text-foreground/80">القائمة الرئيسية</p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between rounded-full bg-primary/10 px-4 py-2">
          <span className="text-sm">خطة مجانية</span>
        </div>
        <div className="flex items-center gap-3 rounded-xl bg-card p-3">
          <div className="flex-1 min-w-0 text-right">
            <p className="text-sm">محمود عبدالرحمن</p>
            <p className="text-xs text-foreground/70 truncate">mahmoudabdo@gmail.com</p>
          </div>
          <Avatar className="size-10 bg-primary">
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold">م</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </Card>
  );
}