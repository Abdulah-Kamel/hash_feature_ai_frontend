"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Brain, FileText, Check } from "lucide-react";
import { toast } from "sonner";
import { fetchFolderFiles } from "@/server/actions/files";
import { apiClient } from "@/lib/api-client";
import { useRouter } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function CreateMindMapDialog({
  open,
  onOpenChange,
  folderId,
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false); // Loading files
  const [generating, setGenerating] = useState(false); // Generating mind map
  const [files, setFiles] = useState([]);
  const [selectedFileId, setSelectedFileId] = useState(null);

  useEffect(() => {
    if (open && folderId) {
      loadFiles();
    } else {
      // Reset state when closed
      setFiles([]);
      setSelectedFileId(null);
      setLoading(false);
      setGenerating(false);
    }
  }, [open, folderId]);

  const loadFiles = async () => {
    setLoading(true);
    try {
      const res = await fetchFolderFiles(folderId);
      if (res.success) {
         // Handle inconsistent API response structure if necessary
         const fileList = Array.isArray(res.data?.data)
         ? res.data.data
         : Array.isArray(res.data)
         ? res.data
         : [];
        setFiles(fileList);
      } else {
        toast.error("فشل جلب الملفات");
      }
    } catch (error) {
      console.error("Error loading files:", error);
      toast.error("حدث خطأ أثناء تحميل الملفات");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!selectedFileId) {
      toast.error("يرجى اختيار ملف");
      return;
    }

    const selectedFile = files.find(f => f._id === selectedFileId || f.id === selectedFileId);
    if (!selectedFile) return;

    setGenerating(true);
    try {
      // Use filename as title, remove extension
      const title = selectedFile.originalName || selectedFile.name || "خريطة ذهنية";
      const cleanTitle = title.replace(/\.[^/.]+$/, "");

      const requestBody = {
        title: cleanTitle,
        folderId: folderId,
        fileIds: [selectedFileId],
        fileId: selectedFileId,
      };

      const response = await apiClient("/api/ai/mind-maps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "فشل إنشاء الخريطة الذهنية");
      }

      toast.success("تم إنشاء الخريطة الذهنية بنجاح");
      
      // Navigate to mind maps page or specific map
      // Assuming /dashboard/folders/[id]/mind-maps exists or similar
      // The user just asked to create it. We'll verify navigation.
      // For now, refresh and close.
      window.dispatchEvent(new Event("mindmap:refresh"));
      onOpenChange(false);
      
      // Optional: Navigate to the folder's mind maps view if it exists
      // router.push(`/dashboard/folders/${folderId}/mind-maps`);

    } catch (error) {
      console.error("Generate mind map error:", error);
      toast.error(error.message || "حدث خطأ غير متوقع");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle>إنشاء خريطة ذهنية</DialogTitle>
          <DialogDescription>
            اختر الملف الذي تريد تحويله إلى خريطة ذهنية
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {loading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : files.length === 0 ? (
            <div className="text-center p-8 text-muted-foreground bg-muted/30 rounded-lg border border-dashed">
              <FileText className="h-10 w-10 mx-auto mb-2 opacity-50" />
              <p>لا توجد ملفات في هذا المجلد</p>
            </div>
          ) : (
            <ScrollArea className="h-[300px] pr-4">
              <RadioGroup value={selectedFileId} onValueChange={setSelectedFileId} className="gap-3">
                {files.map((file) => (
                  <div key={file._id || file.id} className={`flex items-center space-x-3 space-x-reverse rounded-lg border p-4 cursor-pointer transition-all ${selectedFileId === (file._id || file.id) ? "border-primary bg-primary/5" : "hover:bg-muted/50"}`}>
                    <RadioGroupItem value={file._id || file.id} id={file._id || file.id} className="mt-1" />
                    <Label htmlFor={file._id || file.id} className="flex-1 cursor-pointer flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium dir-rtl">{file.originalName || file.name}</span>
                      </div>
                      {selectedFileId === (file._id || file.id) && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </ScrollArea>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={generating}
          >
            إلغاء
          </Button>
          <Button
            onClick={handleCreate}
            disabled={generating || !selectedFileId}
            className="gap-2"
          >
            {generating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Brain className="h-4 w-4" />
            )}
            {generating ? "جاري الإنشاء..." : "إنشاء الخريطة"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
