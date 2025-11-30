import { useEffect, useState, useCallback } from "react";
import StageDetail from "./StageDetail";
import StageCard from "./StageCard";
import StageLearn from "./StageLearn";
import { Spinner } from "@/components/ui/spinner";
import { useFileStore } from "@/store/fileStore";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function StageSwitcher() {
  const router = useRouter();
  const [mode, setMode] = useState("list");
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [selectedStage, setSelectedStage] = useState(null);
  const folderId = useFileStore((s) => s.folderId);
  const load = useCallback(async () => {
    if (!folderId) return;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/ai/stages?folderId=${encodeURIComponent(folderId)}`
      );
      const json = await res.json();
      if (!res.ok) {
        toast.error(json?.message || "تعذر جلب المراحل", {
          position: "top-right",
          duration: 3000,
        });
        setItems([]);
        if (res?.status) {
          if (res.status === 401) {
            router.push("/login");
            return;
          }
          console.error(res.status);
        }
      } else {
        const arr = Array.isArray(json?.data)
          ? json.data
          : Array.isArray(json)
          ? json
          : [];
        const normalized = arr.map((s) => ({
          id: s.id || s._id,
          title: s.title || "مرحلة",
          stagesCount: Array.isArray(s.stages)
            ? s.stages.length
            : s.stats?.totalStages ?? 0,
          progress: s.averageScore ?? 0,
          data: s,
        }));
        setItems(normalized);
      }
    } catch {
      setItems([]);
    }
    setLoading(false);
  }, [folderId]);

  useEffect(() => {
    const t = setTimeout(() => load(), 0);
    const fn = () => load();
    window.addEventListener("stages:refresh", fn);
    return () => {
      clearTimeout(t);
      window.removeEventListener("stages:refresh", fn);
    };
  }, [load]);

  if (mode === "detail") {
    return (
      <StageDetail
        onBack={() => setMode("list")}
        onLearn={(st) => {
          if (st) setSelectedStage(st);
          setMode("learn");
        }}
        onOpenStage={(st) => {
          setSelectedStage(st);
          setMode("learn");
        }}
        title={selected?.title || "القسم الأول"}
        stages={selected?.data?.stages || []}
      />
    );
  }
  if (mode === "learn") {
    return (
      <StageLearn
        onBack={() => setMode("detail")}
        title={`${selected?.title || "القسم"} - المرحلة ${
          selectedStage?.stageNumber || 1
        }`}
        content={selectedStage?.stageContent || ""}
      />
    );
  }
  return (
    <div className="space-y-4">
      {loading && (
        <div className="flex items-center gap-2 text-sm">
          <Spinner className="size-5" />
          <span>جارٍ تحميل المراحل...</span>
        </div>
      )}
      {!loading && items.length === 0 && (
        <div className="text-sm text-muted-foreground">لا توجد مراحل</div>
      )}
      {!loading &&
        items.map((it) => (
          <StageCard
            key={it.id}
            title={it.title}
            stagesCount={it.stagesCount}
            progress={it.progress}
            onOpen={() => {
              setSelected(it);
              setMode("detail");
            }}
          />
        ))}
    </div>
  );
}
