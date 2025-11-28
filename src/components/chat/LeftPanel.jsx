"use client";
import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, X } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import FlashcardsSwitcher from "./FlashcardsSwitcher";
import StageSwitcher from "./ٍStageSwitvher";
import TestView from "./TestView";
import StageCard from "./StageCard";
import { useFileStore } from "@/store/fileStore";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export default function LeftPanel() {
  const [testsMode, setTestsMode] = React.useState("list");
  const [genBusy, setGenBusy] = React.useState(false);
  const [flashBusy, setFlashBusy] = React.useState(false);
  const [stageOpen, setStageOpen] = React.useState(false);
  const [flashOpen, setFlashOpen] = React.useState(false);
  const [stageTitle, setStageTitle] = React.useState("");
  const [flashTitle, setFlashTitle] = React.useState("");
  const folderId = useFileStore((s) => s.folderId);
  const getSelectedIds = useFileStore((s) => s.getSelectedIds);
  const tabs = [
    { label: "الاختبارات", value: "tests" },
    { label: "كروت الفلاش", value: "flashcards" },
    { label: "المراحل", value: "stages" },
  ];

  const handleGenerateStages = async () => {
    if (genBusy) return;
    const ids = getSelectedIds();
    if (!(folderId && ids.length)) {
      toast.error("اختر الملفات ومساحة العمل أولاً", {
        position: "top-right",
        duration: 2500,
      });
      return;
    }
    setGenBusy(true);
    const title = stageTitle?.trim() || "مرحلة جديدة";
    const payload = { title, folderId, fileIds: ids };
    try {
      const res = await fetch(`/api/ai/stages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json?.message || "فشل إنشاء المراحل", {
          position: "top-right",
          duration: 3000,
        });
      } else {
        toast.success("تم إنشاء المراحل بنجاح", {
          position: "top-right",
          duration: 3000,
        });
        try {
          window.dispatchEvent(new Event("stages:refresh"));
        } catch {}
        setStageOpen(false);
        setStageTitle("");
      }
    } catch {
      toast.error("حدث خطأ غير متوقع", {
        position: "top-right",
        duration: 3000,
      });
    }
    setGenBusy(false);
  };

  const handleGenerateFlashcards = async () => {
    if (flashBusy) return;
    const ids = getSelectedIds();
    if (!(folderId && ids.length)) {
      toast.error("اختر الملفات ومساحة العمل أولاً", {
        position: "top-right",
        duration: 2500,
      });
      return;
    }
    setFlashBusy(true);
    const title = flashTitle?.trim() || "كروت جديدة";
    const payload = { title, folderId, fileIds: ids };
    try {
      const res = await fetch(`/api/ai/flashcards`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json?.message || "فشل إنشاء كروت الفلاش", {
          position: "top-right",
          duration: 3000,
        });
      } else {
        toast.success("تم إنشاء كروت الفلاش بنجاح", {
          position: "top-right",
          duration: 3000,
        });
        try {
          window.dispatchEvent(new Event("flashcards:refresh"));
        } catch {}
        setFlashOpen(false);
        setFlashTitle("");
      }
    } catch {
      toast.error("حدث خطأ غير متوقع", {
        position: "top-right",
        duration: 3000,
      });
    }
    setFlashBusy(false);
  };

  return (
    <Card className="bg-background rounded-lg p-4 h-full border-none">
      <Tabs defaultValue="stages" className="h-full">
        <TabsList className="bg-card p-2 rounded-lg w-full grid grid-cols-3 gap-2">
          {tabs.map((t) => (
            <TabsTrigger
              key={t.value}
              value={t.value}
              className="rounded-lg px-6 py-3 text-sm flex-1 bg-background data-[state=active]:bg-primary data-[state=active]:text-primary-foreground cursor-pointer"
            >
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="stages" className="mt-4 space-y-4">
          <Button
            onClick={() => setStageOpen(true)}
            disabled={genBusy}
            className="w-full h-14 rounded-lg bg-primary/20 text-primary-foreground justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {genBusy ? (
              <Spinner className="size-5" />
            ) : (
              <PlusCircle className="size-6" />
            )}
            إنشاء مراحل
          </Button>
          <StageSwitcher />
        </TabsContent>
        <TabsContent value="flashcards" className="mt-4">
          <Button
            onClick={() => setFlashOpen(true)}
            disabled={flashBusy}
            className="w-full h-14 rounded-lg bg-primary/20 text-primary-foreground justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {flashBusy ? (
              <Spinner className="size-5" />
            ) : (
              <PlusCircle className="size-6" />
            )}
            إنشاء كروت الفلاش
          </Button>
          <FlashcardsSwitcher />
        </TabsContent>
        <TabsContent value="tests" className="mt-4">
          {testsMode === "view" ? (
            <TestView
              onBack={() => setTestsMode("list")}
              title="الدرس الأول"
              total={10}
              index={1}
            />
          ) : (
            <>
              <Button className="w-full h-14 rounded-lg bg-primary/20 text-primary-foreground justify-center gap-2 cursor-pointer">
                <PlusCircle className="size-6" />
                إنشاء اختبارات
              </Button>
              <div className="mt-4 space-y-4">
                {Array.from({ length: 2 }).map((_, i) => (
                  <StageCard
                    key={i}
                    title={`القسم ${i + 1}`}
                    stagesCount={5}
                    progress={89}
                    className="bg-secondary"
                    onOpen={() => setTestsMode("view")}
                  />
                ))}
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
      <Dialog open={stageOpen} onOpenChange={setStageOpen}>
        <DialogContent className="border-[#515355] bg-background rounded-2xl p-6 w-[867px] max-w-[92vw]">
          <DialogClose asChild>
            <button className="absolute top-4 right-4 size-8 grid place-items-center rounded-md bg-card cursor-pointer">
              <X className="size-4" />
            </button>
          </DialogClose>
          <DialogHeader className="justify-center">
            <DialogTitle className="text-xl font-semibold text-muted-foreground">
              عنوان المراحل
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm">أدخل العنوان</p>
              <Input
                value={stageTitle}
                onChange={(e) => setStageTitle(e.target.value)}
                className="h-12 rounded-xl bg-card border-[#515355]"
              />
            </div>
            <div className="flex items-center gap-4 justify-end">
              <Button
                className="py-5 rounded-lg px-8 cursor-pointer"
                onClick={handleGenerateStages}
                disabled={genBusy}
              >
                {genBusy ? <Spinner className="size-5" /> : null}
                إنشاء
              </Button>
              <Button
                variant="outline"
                className="py-5 rounded-lg bg-card border-[#515355] cursor-pointer"
                onClick={() => setStageOpen(false)}
              >
                إلغاء
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={flashOpen} onOpenChange={setFlashOpen}>
        <DialogContent className="border-[#515355] bg-background rounded-2xl p-6 w-[867px] max-w-[92vw]">
          <DialogClose asChild>
            <button className="absolute top-4 right-4 size-8 grid place-items-center rounded-md bg-card cursor-pointer">
              <X className="size-4" />
            </button>
          </DialogClose>
          <DialogHeader className="justify-center">
            <DialogTitle className="text-xl font-semibold text-muted-foreground">
              عنوان كروت الفلاش
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm">أدخل العنوان</p>
              <Input
                value={flashTitle}
                onChange={(e) => setFlashTitle(e.target.value)}
                className="h-12 rounded-xl bg-card border-[#515355]"
              />
            </div>
            <div className="flex items-center gap-4 justify-end">
              <Button
                className="py-5 rounded-lg px-8 cursor-pointer"
                onClick={handleGenerateFlashcards}
                disabled={flashBusy}
              >
                {flashBusy ? <Spinner className="size-5" /> : null}
                إنشاء
              </Button>
              <Button
                variant="outline"
                className="py-5 rounded-lg bg-card border-[#515355] cursor-pointer"
                onClick={() => setFlashOpen(false)}
              >
                إلغاء
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
