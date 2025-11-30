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
  const [mcqOpen, setMcqOpen] = React.useState(false);
  const [stageTitle, setStageTitle] = React.useState("");
  const [flashTitle, setFlashTitle] = React.useState("");
  const [mcqTitle, setMcqTitle] = React.useState("");
  const [mcqLoading, setMcqLoading] = React.useState(false);
  const [mcqItems, setMcqItems] = React.useState([]);
  const [mcqView, setMcqView] = React.useState(null);
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

  const handleGenerateMcq = async () => {
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
    const title = mcqTitle?.trim() || "اختبار جديد";
    const payload = { title, folderId, fileIds: ids };
    try {
      const res = await fetch(`/api/ai/mcq`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json?.message || "فشل إنشاء الاختبار", {
          position: "top-right",
          duration: 3000,
        });
      } else {
        toast.success("تم إنشاء الاختبار بنجاح", {
          position: "top-right",
          duration: 3000,
        });
        try {
          window.dispatchEvent(new Event("mcq:refresh"));
        } catch {}
        setMcqOpen(false);
        setMcqTitle("");
      }
    } catch {
      toast.error("حدث خطأ غير متوقع", {
        position: "top-right",
        duration: 3000,
      });
    }
    setGenBusy(false);
  };

  const loadMcq = React.useCallback(async () => {
    if (!folderId) return;
    setMcqLoading(true);
    try {
      const res = await fetch(
        `/api/ai/mcq?folderId=${encodeURIComponent(folderId)}`
      );
      const json = await res.json();
      if (!res.ok) {
        toast.error(json?.message || "تعذر جلب الاختبارات", {
          position: "top-right",
          duration: 3000,
        });
        setMcqItems([]);
      } else {
        const arr = Array.isArray(json?.data)
          ? json.data
          : Array.isArray(json)
          ? json
          : [];
        setMcqItems(arr);
      }
    } catch {
      setMcqItems([]);
    }
    setMcqLoading(false);
  }, [folderId]);

  React.useEffect(() => {
    const t = setTimeout(() => loadMcq(), 0);
    const fn = () => loadMcq();
    window.addEventListener("mcq:refresh", fn);
    return () => {
      clearTimeout(t);
      window.removeEventListener("mcq:refresh", fn);
    };
  }, [loadMcq]);

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
          {testsMode === "view" && mcqView ? (
            <TestView
              onBack={() => setTestsMode("list")}
              title={mcqView.title}
              total={mcqView.data.length}
              index={1}
              data={mcqView.data}
            />
          ) : (
            <>
              <Button
                onClick={() => setMcqOpen(true)}
                className="w-full h-14 rounded-lg bg-primary/20 text-primary-foreground justify-center gap-2 cursor-pointer"
              >
                <PlusCircle className="size-6" />
                إنشاء اختبارات
              </Button>
              <div className="mt-4 space-y-4">
                {mcqLoading && (
                  <div className="flex items-center gap-2 text-sm">
                    <Spinner className="size-5" />
                    <span>جارٍ تحميل الاختبارات...</span>
                  </div>
                )}
                {!mcqLoading && mcqItems.length === 0 && (
                  <div className="text-sm text-muted-foreground">
                    لا توجد اختبارات
                  </div>
                )}
                {!mcqLoading &&
                  mcqItems.map((it) => {
                    const title = it?.title || "اختبار";
                    const total = Array.isArray(it?.mcq)
                      ? it.mcq.length
                      : it?.stats?.totalQuestions ?? 0;
                    const progress = 0;
                    const mapped = Array.isArray(it?.mcq)
                      ? it.mcq.map((q) => ({
                          q: q.question,
                          options: q.options || [],
                          correct: Math.max(
                            0,
                            (q.options || []).findIndex((o) => o === q.answer)
                          ),
                        }))
                      : [];
                    return (
                      <StageCard
                        key={it.id || it._id}
                        title={title}
                        stagesCount={total}
                        progress={progress}
                        className="bg-secondary"
                        onOpen={() => {
                          setMcqView({ title, data: mapped });
                          setTestsMode("view");
                        }}
                      />
                    );
                  })}
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
      <Dialog open={mcqOpen} onOpenChange={setMcqOpen}>
        <DialogContent className="border-[#515355] bg-background rounded-2xl p-6 w-[867px] max-w-[92vw]">
          <DialogClose asChild>
            <button className="absolute top-4 right-4 size-8 grid place-items-center rounded-md bg-card cursor-pointer">
              <X className="size-4" />
            </button>
          </DialogClose>
          <DialogHeader className="justify-center">
            <DialogTitle className="text-xl font-semibold text-muted-foreground">
              عنوان الاختبار
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm">أدخل العنوان</p>
              <Input
                value={mcqTitle}
                onChange={(e) => setMcqTitle(e.target.value)}
                className="h-12 rounded-xl bg-card border-[#515355]"
              />
            </div>
            <div className="flex items-center gap-4 justify-end">
              <Button
                className="py-5 rounded-lg px-8 cursor-pointer"
                onClick={handleGenerateMcq}
                disabled={genBusy}
              >
                {genBusy ? <Spinner className="size-5" /> : null}
                إنشاء
              </Button>
              <Button
                variant="outline"
                className="py-5 rounded-lg bg-card border-[#515355] cursor-pointer"
                onClick={() => setMcqOpen(false)}
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
