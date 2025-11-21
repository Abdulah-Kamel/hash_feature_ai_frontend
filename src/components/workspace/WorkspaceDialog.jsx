"use client";
import * as React from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

function WorkspaceDialogTrigger({ children, defaultValue = "الذكاء الاصطناعي", onSave }) {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState(defaultValue);
  const handleSave = () => {
    onSave?.(name);
    setOpen(false);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="border-[#515355] bg-background rounded-2xl p-6 w-[867px] max-w-[92vw]">
        <DialogClose asChild>
          <button className="absolute top-4 right-4 size-8 grid place-items-center rounded-md bg-card cursor-pointer">
            <X className="size-4" />
          </button>
        </DialogClose>
        <DialogHeader className="justify-center">
          <DialogTitle className="text-xl font-semibold text-muted-foreground">ارفع الملف</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm">اسم مساحة العمل</p>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-12 rounded-xl bg-card border-[#515355]"
            />
          </div>
          <div className="flex items-center gap-4 justify-end">
            <Button className="py-5 rounded-lg px-8 cursor-pointer" onClick={handleSave}>حفظ</Button>
            <Button variant="outline" className="py-5 rounded-lg bg-card border-[#515355] cursor-pointer" onClick={() => setOpen(false)}>
              إلغاء
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default WorkspaceDialogTrigger;