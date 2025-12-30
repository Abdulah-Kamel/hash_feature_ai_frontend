"use client";

import React from "react";
import { useJobStore } from "@/store/jobStore";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Hourglass } from "react-loader-spinner";

export default function GlobalJobLoader() {
  const jobs = useJobStore((s) => s.jobs);

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

  if (!activeJob) return null;

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
            <Progress value={activeJob.progress || 0} className="h-2" />
            <p
              className="text-xs text-muted-foreground text-left tabular-nums"
              dir="ltr"
            >
              {Math.round(activeJob.progress || 0)}%
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
