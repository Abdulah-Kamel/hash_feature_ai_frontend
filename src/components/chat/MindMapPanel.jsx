"use client";
import * as React from "react";
import { apiClient } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { PlusCircle, X, ArrowRight } from "lucide-react";
import StageCard from "./StageCard";
import SkeletonCard from "./SkeletonCard";
import { useFileStore } from "@/store/fileStore";
import { useAiContentStore } from "@/store/aiContentStore";
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
import EmptyState from "./EmptyState";
import MindMapContainer from "@/components/mindmap/mindMapContainer";

export default function MindMapPanel() {
  const [mode, setMode] = React.useState("list"); // list | view
  const [genBusy, setGenBusy] = React.useState(false);
  const [createOpen, setCreateOpen] = React.useState(false);
  const [createTitle, setCreateTitle] = React.useState("");
  const [selectedMap, setSelectedMap] = React.useState(null);
  const [mapsLoaded, setMapsLoaded] = React.useState(false);

  const folderId = useFileStore((s) => s.folderId);
  const getSelectedIds = useFileStore((s) => s.getSelectedIds);

  const mindMaps = useAiContentStore((s) => s.mindMaps);
  const mindMapsLoading = useAiContentStore((s) => s.mindMapsLoading);
  const setMindMaps = useAiContentStore((s) => s.setMindMaps);
  const setMindMapsLoading = useAiContentStore((s) => s.setMindMapsLoading);
  const setMindMapsGenerating = useAiContentStore(
    (s) => s.setMindMapsGenerating
  );

  const handleGenerateMindMap = async () => {
    if (genBusy) return;
    const ids = getSelectedIds();
    if (!(folderId && ids.length)) {
      toast.error("اختر الملفات ومساحة العمل أولاً", {
        position: "top-right",
        duration: 2500,
      });
      return;
    }

    const title = createTitle?.trim() || "خريطة ذهنية جديدة";
    setCreateOpen(false);
    setCreateTitle("");

    setGenBusy(true);
    setMindMapsGenerating?.(true);
    const payload = { title, folderId, fileIds: ids };

    try {
      const res = await apiClient(`/api/ai/mind-maps`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json?.message || "فشل إنشاء الخريطة الذهنية", {
          position: "top-right",
          duration: 3000,
        });
      } else {
        toast.success("تم إنشاء الخريطة الذهنية بنجاح", {
          position: "top-right",
          duration: 3000,
        });
        try {
          window.dispatchEvent(new Event("mindmap:refresh"));
        } catch {}
      }
    } catch {
      toast.error("حدث خطأ غير متوقع", {
        position: "top-right",
        duration: 3000,
      });
    }
    setGenBusy(false);
    setMindMapsGenerating?.(false);
  };

  const loadMindMaps = React.useCallback(async () => {
    if (!folderId) return;
    setMindMapsLoading?.(true);
    try {
      const res = await apiClient(
        `/api/ai/mind-maps?folderId=${encodeURIComponent(folderId)}`
      );
      const json = await res.json();
      if (!res.ok) {
        toast.error(json?.message || "تعذر جلب الخرائط الذهنية", {
          position: "top-right",
          duration: 3000,
        });
        setMindMaps?.([]);
      } else {
        const arr = Array.isArray(json?.data)
          ? json.data
          : Array.isArray(json)
          ? json
          : [];
        setMindMaps?.(arr);
      }
    } catch {
      setMindMaps?.([]);
    }
    setMindMapsLoading?.(false);
  }, [folderId, setMindMaps, setMindMapsLoading]);

  React.useEffect(() => {
    const fn = () => loadMindMaps();
    window.addEventListener("mindmap:refresh", fn);
    return () => {
      window.removeEventListener("mindmap:refresh", fn);
    };
  }, [loadMindMaps]);

  // Load on mount if folderId exists
  React.useEffect(() => {
    if (!mapsLoaded && folderId) {
      loadMindMaps();
      setMapsLoaded(true);
    }
  }, [mapsLoaded, folderId, loadMindMaps]);

  // Reset loaded state when folder changes
  React.useEffect(() => {
    setMapsLoaded(false);
  }, [folderId]);

  if (mode === "view" && selectedMap) {
    return (
      <div className="h-full flex flex-col">
        {/* Header with back button */}
        <div className="flex items-center justify-between gap-2 p-2 border-b border-border/50">
          <button
            onClick={() => {
              setMode("list");
              setSelectedMap(null);
            }}
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowRight className="w-5 h-5" />
            <span>العودة للقائمة</span>
          </button>
          <h2 className="text-lg font-semibold text-white">
            {selectedMap.title || "خريطة ذهنية"}
          </h2>
        </div>

        {/* MindMap Container */}
        <div className="flex-1">
          <MindMapContainer fileId={selectedMap.fileId || selectedMap._id} />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col max-w-7xl mx-auto">
      <div className="space-y-4 flex-1 overflow-y-auto">
        <Button
          onClick={() => setCreateOpen(true)}
          disabled={genBusy}
          className="w-full h-14 rounded-lg bg-primary/20 text-primary-foreground justify-center gap-2 cursor-pointer disabled:opacity-60"
        >
          {genBusy ? (
            <Spinner className="size-5" />
          ) : (
            <PlusCircle className="size-6" />
          )}
          إنشاء خريطة ذهنية
        </Button>

        <div className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {mindMapsLoading && (
            <>
              <SkeletonCard className="bg-linear-to-b from-secondary/80 to-secondary" />
              <SkeletonCard className="bg-linear-to-b from-secondary/80 to-secondary" />
              <SkeletonCard className="bg-linear-to-b from-secondary/80 to-secondary" />
            </>
          )}
          {!mindMapsLoading && (!mindMaps || mindMaps.length === 0) && (
            <div className="col-span-1 md:col-span-2">
              <EmptyState
                title="لا توجد خرائط ذهنية"
                message="انشئ خريطة ذهنية جديدة"
              />
            </div>
          )}
          {!mindMapsLoading &&
            mindMaps?.map((it) => {
              const title = it?.title || it?.fileName || "خريطة ذهنية";
              const nodesCount = Array.isArray(it?.MindMapData)
                ? it.MindMapData.reduce((acc, root) => {
                    const countNodes = (node) => {
                      let count = 1;
                      if (node?.children) {
                        node.children.forEach((child) => {
                          count += countNodes(child);
                        });
                      }
                      return count;
                    };
                    return acc + countNodes(root);
                  }, 0)
                : 0;

              return (
                <StageCard
                  key={it._id || it.id}
                  title={title}
                  stagesCount={nodesCount}
                  progress={0}
                  variant="purple"
                  countLabel=""
                  onOpen={() => {
                    setSelectedMap({
                      ...it,
                      fileId: it.fileId || it._id,
                    });
                    setMode("view");
                  }}
                />
              );
            })}
        </div>
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="border-[#515355] bg-background rounded-2xl p-6 w-[867px] max-w-[92vw]">
          <DialogClose asChild>
            <button className="absolute top-4 right-4 size-8 grid place-items-center rounded-md bg-card cursor-pointer">
              <X className="size-4" />
            </button>
          </DialogClose>
          <DialogHeader className="justify-center">
            <DialogTitle className="text-xl font-semibold text-muted-foreground">
              عنوان الخريطة الذهنية
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm">أدخل العنوان</p>
              <Input
                value={createTitle}
                onChange={(e) => setCreateTitle(e.target.value)}
                className="h-12 rounded-xl bg-card border-[#515355]"
              />
            </div>
            <div className="flex items-center gap-4 justify-end">
              <Button
                className="py-5 rounded-lg px-8 cursor-pointer"
                onClick={handleGenerateMindMap}
                disabled={genBusy}
              >
                {genBusy ? <Spinner className="size-5" /> : null}
                إنشاء
              </Button>
              <Button
                variant="outline"
                className="py-5 rounded-lg bg-card border-[#515355] cursor-pointer"
                onClick={() => setCreateOpen(false)}
              >
                إلغاء
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
