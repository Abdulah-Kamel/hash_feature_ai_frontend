"use client";

import React from "react";
import { useJobStore } from "@/store/jobStore";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Hourglass } from "react-loader-spinner";

export default function GlobalJobLoader() {
  const jobs = useJobStore((s) => s.jobs);
  const [simulatedProgress, setSimulatedProgress] = React.useState(0);

  // Find any active job
  const activeJobType = Object.keys(jobs).find((type) => {
    const job = jobs[type];
    return (
      job &&
      (job.status === "queued" ||
        job.status === "processing" ||
        job.status === "active")
    );
  });

  const activeJob = activeJobType ? jobs[activeJobType] : null;

  // Reset simulated progress when job changes or completes
  React.useEffect(() => {
    if (activeJob) {
      setSimulatedProgress(activeJob.progress || 0);
    } else {
      setSimulatedProgress(0);
    }
  }, [activeJob?.id]); // Depend on ID to reset for new jobs

  // Simulate progress
  React.useEffect(() => {
    if (!activeJob) return;

    // If we have actual progress from API, prioritize it if it's greater
    if (activeJob.progress > simulatedProgress) {
      setSimulatedProgress(activeJob.progress);
    }

    // Don't simulate past 90%
    if (simulatedProgress >= 90) return;

    const interval = setInterval(() => {
      setSimulatedProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        // Add random increment between 1 and 3
        const increment = Math.random() * 2 + 1;
        return Math.min(prev + increment, 90);
      });
    }, 800); // Update every 800ms

    return () => clearInterval(interval);
  }, [activeJob, simulatedProgress]);

  if (!activeJob) return null;

  const displayProgress = Math.max(activeJob?.progress || 0, simulatedProgress);

  const messages = {
    stages: "جاري تصميم المراحل التعليمية...",
    flashcards: "جاري إنشاء البطاقات التعليمية...",
    mcq: "جاري إعداد الأسئلة...",
    mindmap: "جاري رسم الخريطة الذهنية...",
  };

  return (
    <Dialog open={true}>
      <DialogContent
        className="sm:max-w-md [&>button]:hidden text-center"
        dir="rtl"
      >
        <div className="flex flex-col items-center justify-center py-8 space-y-6">
          <Hourglass
            visible={true}
            height="80"
            width="80"
            ariaLabel="hourglass-loading"
            wrapperStyle={{}}
            wrapperClass=""
            colors={["#6E83F5", "#BD6BEE"]}
          />
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">
              {messages[activeJobType] || "جاري المعالجة..."}
            </h3>
            <p className="text-sm text-muted-foreground">
              يرجى الانتظار، جاري إعداد المحتوى الخاص بك بالذكاء الاصطناعي
            </p>
          </div>
          <div className="w-full max-w-xs space-y-2">
            <Progress value={displayProgress} className="h-2" />
            <p
              className="text-xs text-muted-foreground text-left tabular-nums"
              dir="ltr"
            >
              {Math.round(displayProgress)}%
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
