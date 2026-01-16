import { useEffect, useState, useCallback } from "react";
import { apiClient } from "@/lib/api-client";
import StageDetail from "./StageDetail";
import StageCard from "./StageCard";
import StageLearn from "./StageLearn";
import SkeletonCard from "./SkeletonCard";
import { Spinner } from "@/components/ui/spinner";
import { useFileStore } from "@/store/fileStore";
import { useAiContentStore } from "@/store/aiContentStore";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import TestView from "@/components/chat/TestView";
import EmptyState from "./EmptyState";

export default function StageSwitcher({ shouldLoad = false, onModeChange }) {
  const router = useRouter();
  const [mode, setMode] = useState("list");
  const [selected, setSelected] = useState(null);
  const [selectedStage, setSelectedStage] = useState(null);
  const [mcqData, setMcqData] = useState([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const folderId = useFileStore((s) => s.folderId);

  // Use store for stages data and loading states
  const stages = useAiContentStore((s) => s.stages);
  const loading = useAiContentStore((s) => s.stagesLoading);
  const isGenerating = useAiContentStore((s) => s.stagesGenerating);
  const setStages = useAiContentStore((s) => s.setStages);
  const setLoading = useAiContentStore((s) => s.setStagesLoading);

  // Notify parent when mode changes
  useEffect(() => {
    onModeChange?.(mode);
  }, [mode, onModeChange]);

  const load = useCallback(async () => {
    if (!folderId) return;
    setLoading(true);
    try {
      const res = await apiClient(
        `/api/ai/stages?folderId=${encodeURIComponent(folderId)}`
      );
      const json = await res.json();
      if (!res.ok) {
        toast.error(json?.message || "تعذر جلب المراحل", {
          position: "top-right",
          duration: 3000,
        });
        setStages([]);
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
        const normalized = arr.map((s) => {
          const stagesList = Array.isArray(s.stages) ? s.stages : [];
          const totalStages =
            stagesList.length > 0
              ? stagesList.length
              : s.stats?.totalStages ?? 0;
          const completedCount = stagesList.filter(
            (st) => st.status === "completed"
          ).length;
          const progress =
            totalStages > 0
              ? Math.round((completedCount / totalStages) * 100)
              : 0;

          return {
            id: s.id || s._id,
            title: s.title || "مرحلة",
            stagesCount: totalStages,
            progress: progress,
            data: s,
          };
        });
        setStages(normalized);
      }
    } catch {
      setStages([]);
    }
    setLoading(false);
    setHasLoaded(true);
  }, [folderId, router, setStages, setLoading]);

  useEffect(() => {
    const fn = () => load();
    window.addEventListener("stages:refresh", fn);
    return () => {
      window.removeEventListener("stages:refresh", fn);
    };
  }, [load]);

  // Load when tab becomes active
  useEffect(() => {
    if (shouldLoad && !hasLoaded && folderId) {
      load();
    }
  }, [shouldLoad, hasLoaded, folderId, load]);

  // Reset loaded state when folder changes
  useEffect(() => {
    setHasLoaded(false);
  }, [folderId]);

  // Update selected object when stages data changes
  useEffect(() => {
    console.log(selected);
    console.log(stages);
    
    if (selected && stages.length > 0) {
      const updatedSelected = stages.find((s) => s.id === selected.id);
      if (
        updatedSelected &&
        JSON.stringify(updatedSelected) !== JSON.stringify(selected)
      ) {
        setSelected(updatedSelected);
      }
    }
  }, [stages, selected?.id]); // Only depend on selected.id to prevent infinite loop

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
        title={`المرحلة ${selected?.title || "القسم"} -  ${
          selectedStage?.stageNumber || 1
        }`}
        content={selectedStage?.stageContent || ""}
        mcqs={[
          ...(Array.isArray(selectedStage?.stageMcq)
            ? selectedStage.stageMcq
            : []),
          ...(Array.isArray(selectedStage?.stageTF)
            ? selectedStage.stageTF
            : []),
        ]}
        onOpenMcq={() => {
          const arr = Array.isArray(selectedStage?.stageMcq)
            ? selectedStage.stageMcq
            : [];
          const mappedMcq = arr.map((m) => {
            const opts = Array.isArray(m.options) ? m.options : [];
            const correctIdx = Math.max(
              0,
              opts.findIndex((o) => o === m.answer)
            );
            return {
              q: m.question,
              options: opts,
              correct: correctIdx < 0 ? 0 : correctIdx,
            };
          });

          const tfArr = Array.isArray(selectedStage?.stageTF)
            ? selectedStage.stageTF
            : [];
          const mappedTf = tfArr.map((tf) => ({
            q: tf.statement,
            options: ["صح", "خطأ"],
            correct: tf.answer === true ? 0 : 1,
          }));

          setMcqData([...mappedMcq, ...mappedTf]);
          setMode("mcq");
        }}
      />
    );
  }

  if (mode === "mcq") {
    const handleNextStage = async () => {
      // Reload stages data to get updated status
      await load();

      // Get all stages from the selected item
      const allStages = selected?.data?.stages || [];
      const currentStageNumber = selectedStage?.stageNumber || 1;

      // Find the next stage
      const nextStage = allStages.find(
        (st) => st.stageNumber === currentStageNumber + 1
      );

      if (nextStage) {
        // Move to the next stage
        setSelectedStage(nextStage);
        setMode("learn");
        setMcqData([]);
      } else {
        setMode("detail");
        setMcqData([]);
      }
    };

    return (
      <TestView
        onBack={() => setMode("learn")}
        title={`اختبار المرحلة ${selected?.title || "القسم"} - ${
          selectedStage?.stageNumber || 1
        }`}
        total={Array.isArray(mcqData) ? mcqData.length : 0}
        index={1}
        data={mcqData}
        onNextStage={handleNextStage}
        onFinish={async ({ score }) => {
          const id = selected?.data?._id || selected?.data?.id || selected?.id;
          if (!id) return;
          try {
            const res = await apiClient(
              `/api/ai/stages?id=${encodeURIComponent(id)}`,
              {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  stageNumber: selectedStage?.stageNumber || 1,
                  score: score ?? 0,
                }),
              }
            );
            if (res && res.ok) {
              window.dispatchEvent(new Event("stages:refresh"));
            }
          } catch {}
        }}
      />
    );
  }

  return (
    <div className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      {(loading || isGenerating) && (
        <>
          <SkeletonCard className="bg-linear-to-b from-primary/80 to-primary" />
          <SkeletonCard className="bg-linear-to-b from-primary/80 to-primary" />
          <SkeletonCard className="bg-linear-to-b from-primary/80 to-primary" />
        </>
      )}
      {!loading && !isGenerating && stages.length === 0 && (
        <div className="col-span-1 md:col-span-2">
          <EmptyState title="لا توجد مراحل" message="انشئ مراحل جديدة" />
        </div>
      )}
      {!loading &&
        !isGenerating &&
        stages.map((it) => (
          <StageCard
            key={it.id}
            title={it.title}
            stagesCount={it.stagesCount}
            progress={it.progress}
            onOpen={() => {
              setSelected(it);
              setMode("detail");
            }}
            hasProgress={true}
          />
        ))}
    </div>
  );
}
