import { useEffect, useState } from "react";
import StageDetail from "./StageDetail";
import StageCard from "./StageCard";
import StageLearn from "./StageLearn";
import { Spinner } from "@/components/ui/spinner";
import { useFileStore } from "@/store/fileStore";
import { toast } from "sonner";

export default function StageSwitcher() {
  const [mode, setMode] = useState("list");
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const folderId = useFileStore((s) => s.folderId);

  const load = async () => {
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
        }));
        setItems(normalized);
      }
    } catch {
      setItems([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
    const fn = () => load();
    window.addEventListener("stages:refresh", fn);
    return () => window.removeEventListener("stages:refresh", fn);
  }, [folderId]);

  if (mode === "detail") {
    return (
      <StageDetail
        onBack={() => setMode("list")}
        onLearn={() => setMode("learn")}
        title="القسم الأول"
      />
    );
  }
  if (mode === "learn") {
    return (
      <StageLearn
        onBack={() => setMode("detail")}
        title="القسم الأول - المرحلة الأولى: الذكاء الاصطناعي"
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
            onOpen={() => setMode("detail")}
          />
        ))}
    </div>
  );
}
