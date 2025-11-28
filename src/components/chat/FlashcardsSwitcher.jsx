import { useEffect, useState, useCallback } from "react";
import { Spinner } from "@/components/ui/spinner";
import { useFileStore } from "@/store/fileStore";
import { toast } from "sonner";

const { default: StageCard } = require("./StageCard");
const { default: StageFlashcards } = require("./StageFlashcards");

export default function FlashcardsSwitcher() {
  const [mode, setMode] = useState("list");
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const folderId = useFileStore((s) => s.folderId);

  const load = useCallback(async () => {
    if (!folderId) return;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/ai/flashcards?folderId=${encodeURIComponent(folderId)}`
      );
      const json = await res.json();
      if (!res.ok) {
        toast.error(json?.message || "تعذر جلب كروت الفلاش", {
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
        const normalized = arr.map((f) => {
          const total = Array.isArray(f.flashcards)
            ? f.flashcards.length
            : f.stats?.totalCards ?? 0;
          const answered = f.stats?.totalAnswered ?? 0;
          const progress = total > 0 ? Math.round((answered / total) * 100) : 0;
          return {
            id: f.id || f._id,
            title: f.title || "مجموعة كروت",
            stagesCount: total,
            progress,
          };
        });
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
    window.addEventListener("flashcards:refresh", fn);
    return () => {
      clearTimeout(t);
      window.removeEventListener("flashcards:refresh", fn);
    };
  }, [load]);

  if (mode === "view") {
    return (
      <StageFlashcards
        onBack={() => setMode("list")}
        title="الدرس الأول"
        total={10}
        index={1}
      />
    );
  }
  return (
    <div className="mt-4 space-y-4">
      {loading && (
        <div className="flex items-center gap-2 text-sm">
          <Spinner className="size-5" />
          <span>جارٍ تحميل الكروت...</span>
        </div>
      )}
      {!loading && items.length === 0 && (
        <div className="text-sm text-muted-foreground">لا توجد كروت</div>
      )}
      {!loading &&
        items.map((it) => (
          <StageCard
            key={it.id}
            title={it.title}
            stagesCount={it.stagesCount}
            progress={it.progress}
            onOpen={() => setMode("view")}
          />
        ))}
    </div>
  );
}
