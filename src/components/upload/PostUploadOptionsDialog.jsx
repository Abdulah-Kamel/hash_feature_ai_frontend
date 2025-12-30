"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Loader2, BookOpen, CreditCard, HelpCircle, Sparkles, X, ArrowRight, ArrowLeft, Brain } from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";

/**
 * Post-upload options dialog component
 * Multi-step process: Select content type → Enter title → Generate
 *
 * @param {boolean} open - Controls dialog visibility
 * @param {function} onOpenChange - Callback when dialog open state changes
 * @param {string} folderId - ID of the folder containing uploaded files
 * @param {array} fileIds - IDs of the uploaded files
 */
export default function PostUploadOptionsDialog({
  open,
  onOpenChange,
  folderId,
  fileIds = [],
}) {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: Select type, 2: Enter title
  const [selectedType, setSelectedType] = useState(null); // 'stages', 'flashcards', 'mcqs', 'mindmap', 'all'
  const [title, setTitle] = useState("");
  const [generating, setGenerating] = useState(false);

  // Debug: Log props
  console.log("PostUploadOptionsDialog props:", { folderId, fileIds });

  /**
   * Reset dialog state when closed
   */
  const handleClose = () => {
    setStep(1);
    setSelectedType(null);
    setTitle("");
    setGenerating(false);
    onOpenChange(false);
  };

  /**
   * Handle content type selection
   */
  const handleSelectType = (type) => {
    setSelectedType(type);
    setStep(2);
  };

  /**
   * Get display name for content type
   */
  const getTypeName = (type) => {
    switch (type) {
      case "stages":
        return "المراحل التعليمية";
      case "flashcards":
        return "البطاقات التعليمية";
      case "mcqs":
        return "الأسئلة";
      case "mindmap":
        return "الخريطة الذهنية";
      case "all":
        return "الكل";
      default:
        return "المحتوى";
    }
  };

  /**
   * Generate content with title and file IDs
   */
  const handleGenerate = async (type, contentTitle, navigate = true) => {
    if (!folderId) {
      toast.error("معرف المجلد مفقود");
      return false;
    }

    if (!contentTitle?.trim()) {
      toast.error("العنوان مطلوب");
      return false;
    }

    const endpoint =
      type === "stages"
        ? "/api/ai/stages"
        : type === "flashcards"
        ? "/api/ai/flashcards"
        : type === "mindmap"
        ? "/api/ai/mind-maps"
        : "/api/ai/mcq";

    try {
      // Prepare request body
      const requestBody = {
        title: contentTitle.trim(),
        folderId: folderId,
        fileIds: fileIds,
      };

      console.log("Generating content with:", requestBody);

      const response = await apiClient(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `فشل إنشاء ${getTypeName(type)}`);
      }

      // Determine content path for navigation
      const contentPath =
        type === "stages"
          ? "stages"
          : type === "flashcards"
          ? "flashcards"
          : type === "mindmap"
          ? "mindmap"
          : "tests";

      // Check for jobId to track progress
      const jobId = data.data?._id;

      if (jobId) {
        // Import store and tracker dynamically to avoid circular deps if any
        const { useJobStore } = await import("@/store/jobStore");
        const { jobTracker } = await import("@/lib/job-tracker");

        // Set job in store to show global loader
        useJobStore.getState().setJob(type, {
          id: jobId,
          status: "queued",
          progress: 0,
          type: type,
        });

        // Track job via WebSocket
        jobTracker.track(jobId, {
          onProgress: (progress, status) => {
            useJobStore
              .getState()
              .updateJob(type, { progress, status: "processing" });
          },
          onComplete: (result) => {
            useJobStore
              .getState()
              .updateJob(type, { status: "completed", progress: 100 });

            toast.success(`تم إنشاء ${getTypeName(type)} بنجاح`, {
              position: "top-right",
              duration: 3000,
            });

            // Dispatch refresh event
            const eventName =
              type === "stages"
                ? "stages:refresh"
                : type === "flashcards"
                ? "flashcards:refresh"
                : type === "mindmap"
                ? "mindmap:refresh"
                : "mcq:refresh";
            window.dispatchEvent(new Event(eventName));

            // Clear job and navigate
            setTimeout(() => {
              useJobStore.getState().clearJob(type);
              if (navigate) {
                router.push(`/dashboard/folders/${folderId}/${contentPath}`);
              }
            }, 1000);
          },
          onError: (error) => {
            useJobStore.getState().updateJob(type, { status: "failed" });
            toast.error(
              typeof error === "string"
                ? error
                : `فشل إنشاء ${getTypeName(type)}`
            );
            setTimeout(() => {
              useJobStore.getState().clearJob(type);
            }, 3000); // Keep failed state visible for a bit
          },
        });

        return true;
      } else {
        // Fallback for immediate response (no jobId)
        toast.success(`تم إنشاء ${getTypeName(type)} بنجاح`, {
          position: "top-right",
          duration: 3000,
        });

        // Dispatch refresh event
        const eventName =
          type === "stages"
            ? "stages:refresh"
            : type === "flashcards"
            ? "flashcards:refresh"
            : type === "mindmap"
            ? "mindmap:refresh"
            : "mcq:refresh";
        window.dispatchEvent(new Event(eventName));

        if (navigate) {
          router.push(`/dashboard/folders/${folderId}/${contentPath}`);
        }

        return true;
      }
    } catch (error) {
      console.error(`Generate ${type} error:`, error);
      toast.error(error.message || `حدث خطأ أثناء إنشاء ${getTypeName(type)}`);
      return false;
    }
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("يرجى إدخال عنوان");
      return;
    }

    setGenerating(true);

    if (selectedType === "all") {
      // Generate all types with the same title
      const results = await Promise.all([
        handleGenerate("stages", title, true),
        handleGenerate("flashcards", title, false),
        handleGenerate("mcqs", title, false),
        handleGenerate("mindmap", title, false),
      ]);

      if (results.every((r) => r)) {
        toast.success("تم بدء إنشاء جميع المحتويات", {
          position: "top-right",
          duration: 3000,
        });
        handleClose();
      }
    } else {
      // Generate single type
      const success = await handleGenerate(selectedType, title, true);
      if (success) {
        handleClose();
      }
    }

    setGenerating(false);
  };

  /**
   * Go back to type selection
   */
  const handleBack = () => {
    setStep(1);
    setTitle("");
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-3xl" dir="rtl">
        <DialogHeader>
          <DialogTitle>
            {step === 1 ? "ماذا تريد أن تنشئ؟" : "أدخل عنوان المحتوى"}
          </DialogTitle>
          <DialogDescription>
            {step === 1
              ? "اختر نوع المحتوى الذي تريد إنشاءه من الملف المرفوع"
              : `سيتم إنشاء ${getTypeName(selectedType)} بهذا العنوان`}
          </DialogDescription>
        </DialogHeader>

        {step === 1 ? (
          // Step 1: Select content type
          <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button
                  variant={selectedType === "stages" ? "default" : "outline"}
                  className={`h-auto py-6 flex flex-col gap-3 hover:bg-primary/5 hover:text-primary transition-all duration-300 group relative overflow-hidden border-2 ${
                    selectedType === "stages"
                      ? "border-primary bg-primary/5 shadow-lg shadow-primary/20 scale-[1.02]"
                      : "border-border/40 hover:border-primary/50"
                  }`}
                  onClick={() => handleSelectType("stages")}
                >
                  <div className={`p-3 rounded-xl transition-colors duration-300 ${
                    selectedType === "stages" ? "bg-primary text-white" : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white"
                  }`}>
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-base font-bold">مراحل تعليمية</span>
                    <p className="text-xs text-muted-foreground font-normal">تقسيم المحتوى إلى وحدات</p>
                  </div>
                </Button>

                <Button
                  variant={selectedType === "flashcards" ? "default" : "outline"}
                  className={`h-auto py-6 flex flex-col gap-3 hover:bg-orange-500/5 hover:text-orange-500 transition-all duration-300 group relative overflow-hidden border-2 ${
                    selectedType === "flashcards"
                      ? "border-orange-500 bg-orange-500/5 shadow-lg shadow-orange-500/20 scale-[1.02]"
                      : "border-border/40 hover:border-orange-500/50"
                  }`}
                  onClick={() => handleSelectType("flashcards")}
                >
                  <div className={`p-3 rounded-xl transition-colors duration-300 ${
                    selectedType === "flashcards" ? "bg-orange-500 text-white" : "bg-orange-500/10 text-orange-500 group-hover:bg-orange-500 group-hover:text-white"
                  }`}>
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-base font-bold">بطاقات</span>
                    <p className="text-xs text-muted-foreground font-normal">للمراجعة السريعة والحفظ</p>
                  </div>
                </Button>

                <Button
                  variant={selectedType === "mcqs" ? "default" : "outline"}
                  className={`h-auto py-6 flex flex-col gap-3 hover:bg-green-500/5 hover:text-green-500 transition-all duration-300 group relative overflow-hidden border-2 ${
                    selectedType === "mcqs"
                      ? "border-green-500 bg-green-500/5 shadow-lg shadow-green-500/20 scale-[1.02]"
                      : "border-border/40 hover:border-green-500/50"
                  }`}
                  onClick={() => handleSelectType("mcqs")}
                >
                  <div className={`p-3 rounded-xl transition-colors duration-300 ${
                    selectedType === "mcqs" ? "bg-green-500 text-white" : "bg-green-500/10 text-green-500 group-hover:bg-green-500 group-hover:text-white"
                  }`}>
                    <HelpCircle className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-base font-bold">أسئلة</span>
                    <p className="text-xs text-muted-foreground font-normal">اختبارات للمعلومات</p>
                  </div>
                </Button>

                <Button
                  variant={selectedType === "mindmap" ? "default" : "outline"}
                  className={`h-auto py-6 flex flex-col gap-3 hover:bg-purple-500/5 hover:text-purple-500 transition-all duration-300 group relative overflow-hidden border-2 ${
                    selectedType === "mindmap"
                      ? "border-purple-500 bg-purple-500/5 shadow-lg shadow-purple-500/20 scale-[1.02]"
                      : "border-border/40 hover:border-purple-500/50"
                  }`}
                  onClick={() => handleSelectType("mindmap")}
                >
                  <div className={`p-3 rounded-xl transition-colors duration-300 ${
                    selectedType === "mindmap" ? "bg-purple-500 text-white" : "bg-purple-500/10 text-purple-500 group-hover:bg-purple-500 group-hover:text-white"
                  }`}>
                    <Brain className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-base font-bold">خريطة ذهنية</span>
                    <p className="text-xs text-muted-foreground font-normal">تصور مرئي للمعلومات</p>
                  </div>
                </Button>
              </div>

            <Card
              className="p-4 cursor-pointer hover:bg-accent transition-colors border-primary/50"
              onClick={() => handleSelectType("all")}
            >
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-linear-to-br from-primary to-blue-500 p-3">
                  <Sparkles className="size-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">إنشاء الكل</p>
                  <p className="text-xs text-muted-foreground">
                    إنشاء جميع أنواع المحتوى
                  </p>
                </div>
                <ArrowLeft className="size-5 text-muted-foreground" />
              </div>
            </Card>
          </div>
        ) : (
          // Step 2: Enter title
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="content-title">العنوان *</Label>
              <Input
                id="content-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثال: الفصل الأول - مقدمة في البرمجة"
                className="bg-card rounded-xl"
                disabled={generating}
                required
                autoFocus
              />
              <p className="text-xs text-muted-foreground">
                سيتم استخدام هذا العنوان لتسمية المحتوى المُنشأ
              </p>
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={generating}
                className="rounded-xl"
              >
                <ArrowRight className="size-4 me-2" />
                رجوع
              </Button>
              <Button
                type="submit"
                disabled={generating || !title.trim()}
                className="rounded-xl"
              >
                {generating ? (
                  <Loader2 className="size-4 me-2 animate-spin" />
                ) : (
                  <Sparkles className="size-4 me-2" />
                )}
                {generating ? "جاري الإنشاء..." : "إنشاء"}
              </Button>
            </DialogFooter>
          </form>
        )}

        {step === 1 && (
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleClose}
              className="rounded-xl w-full"
            >
              <X className="size-4 me-2" />
              تخطي
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
