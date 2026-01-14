"use client";
import * as React from "react";
import { useParams } from "next/navigation";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronDown, Upload, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { getFolders } from "@/server/actions/folders";
import useAuth from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { useFileStore } from "@/store/fileStore";
import { uploadFilesWithProgress, getFileInfo } from "@/lib/upload-utils";
import UploadProgressDialog from "./UploadProgressDialog";
import PostUploadOptionsDialog from "./PostUploadOptionsDialog";

function UploadDialogTrigger({ children, onUploaded }) {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [workspace, setWorkspace] = React.useState("");
  const [folders, setFolders] = React.useState([]);
  const [foldersLoading, setFoldersLoading] = React.useState(false);
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [selectedFolderId, setSelectedFolderId] = React.useState("");
  const [selectedFiles, setSelectedFiles] = React.useState([]);
  const [uploadBusy, setUploadBusy] = React.useState(false);
  const setIsUploading = useFileStore((s) => s.setIsUploading);

  // Progress dialog state
  const [showProgress, setShowProgress] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [uploadStatus, setUploadStatus] = React.useState("uploading");
  const [currentFileName, setCurrentFileName] = React.useState("");
  const [currentFileSize, setCurrentFileSize] = React.useState(0);

  // Options dialog state
  const [showOptions, setShowOptions] = React.useState(false);
  const [uploadedFolderId, setUploadedFolderId] = React.useState("");
  const [uploadedFileIds, setUploadedFileIds] = React.useState([]);

  const params = useParams();
  const folderId = params?.id;

  const loadFolders = React.useCallback(async () => {
    if (authLoading || !isAuthenticated) return;
    setFoldersLoading(true);
    const res = await getFolders();
    if (res?.success && Array.isArray(res.data)) {
      setFolders(res.data);
    } else {
      setFolders([]);
    }
    setFoldersLoading(false);
  }, [authLoading, isAuthenticated]);

  React.useEffect(() => {
    if (dialogOpen) {
      if (folderId) {
        setSelectedFolderId(folderId);
      }
      loadFolders();
    } else {
      // Reset state when dialog closes (after animation)
      const timer = setTimeout(() => {
        setWorkspace("");
        setSelectedFolderId("");
        setSelectedFiles([]);
        setUploadBusy(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [dialogOpen, loadFolders, folderId]);

  const onSelectFolder = (f) => {
    setWorkspace(f.name);
    setSelectedFolderId(f._id || f.id || "");
  };

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    open: openFileDialog,
  } = useDropzone({
    noClick: true,
    multiple: true,
    onDropAccepted: (files) => setSelectedFiles((prev) => [...prev, ...files]),
  });

  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const canSubmit = selectedFiles.length > 0 && !uploadBusy;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    // Get first file info for display
    const firstFile = selectedFiles[0];
    if (firstFile) {
      const fileInfo = getFileInfo(firstFile);
      setCurrentFileName(fileInfo.name);
      setCurrentFileSize(fileInfo.size);
    }

    // Close upload dialog and show progress
    setDialogOpen(false);
    setShowProgress(true);
    setUploadProgress(0);
    setUploadStatus("uploading");

    // Start loading state
    setUploadBusy(true);
    setIsUploading(true);

    const fd = new FormData();
    fd.append("folderId", selectedFolderId);
    for (const f of selectedFiles) fd.append("files", f);

    try {
      const res = await uploadFilesWithProgress(
        fd,
        (progress) => setUploadProgress(progress),
        (status) => setUploadStatus(status)
      );

      console.log(res);

      if (!res?.success) {
        setShowProgress(false);
        toast.error(res?.error || "فشل رفع الملفات", {
          position: "top-right",
          duration: 3000,
        });
      } else {
        // Show complete status briefly
        setUploadStatus("complete");
        setUploadProgress(100);

        // Extract file IDs from response
        // API returns: { results: { uploaded: [...], duplicates: [...], failed: [...] } }
        const uploadedFiles = res.data?.results?.uploaded || [];
        const duplicateFiles = res.data?.results?.duplicates || [];
        const failedFiles = res.data?.results?.failed || [];

        // Combine uploaded and duplicate file IDs
        const allFiles = [...uploadedFiles, ...duplicateFiles];
        const fileIds = allFiles.map((f) => f._id || f.id).filter(Boolean);

        console.log("Uploaded file IDs:", fileIds);

        // Show appropriate message based on results
        const summary = res.data?.summary;
        if (summary) {
          if (summary.duplicates > 0 && summary.uploaded === 0) {
            toast.warning(`تم تجاهل ${summary.duplicates} ملف مكرر`, {
              position: "top-right",
              duration: 5000,
            });
          } else if (summary.duplicates > 0) {
            toast.warning(
              `تم رفع ${summary.uploaded} ملف، ${summary.duplicates} ملف مكرر`,
              {
                position: "top-right",
                duration: 5000,
              }
            );
          }
          if (summary.failed > 0) {
            toast.error(`فشل رفع ${summary.failed} ملف`, {
              position: "top-right",
              duration: 5000,
              description: res?.data?.results.failed[0]?.error,
            });
            setShowOptions(false);
          }
        }

        // Wait a moment then show options dialog
        setTimeout(() => {
          setShowProgress(false);

          if (fileIds.length > 0) {
            // Get folderId from response if new folder was created, or use selectedFolderId
            const responseFolderId = uploadedFiles[0]?.folderId;
            const targetFolderId = responseFolderId || selectedFolderId;

            setUploadedFolderId(targetFolderId);
            setUploadedFileIds(fileIds);

            // Only show options if we have a valid folderId
            if (targetFolderId) {
              setShowOptions(true);
            }
          }
        }, 800);

        try {
          window.dispatchEvent(new Event("files:refresh"));
        } catch {}
        try {
          if (typeof onUploaded === "function") onUploaded(selectedFolderId);
        } catch {}
      }
    } catch (error) {
      setShowProgress(false);
      console.error("Upload error:", error);
      toast.error(error.message || "حدث خطأ غير متوقع", {
        position: "top-right",
        duration: 3000,
      });
    }

    setUploadBusy(false);
    setIsUploading(false);
    setSelectedFiles([]);
  };

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="border-[#515355] bg-background rounded-2xl p-6 sm:max-w-[50vw] w-full flex flex-col">
          <DialogHeader className="justify-center">
            <DialogClose asChild>
              <button className="absolute top-4 right-4 size-8 grid place-items-center rounded-md bg-card">
                <X className="size-4 cursor-pointer" />
              </button>
            </DialogClose>
            <DialogTitle className="text-xl font-semibold text-muted-foreground">
              ارفع الملف
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2 mt-3 h-full flex-1 flex-col justify-center">
            <div className="space-y-4 flex-1 flex flex-col">
              <form
                onSubmit={handleSubmit}
                className="flex-1 flex flex-col min-h-0"
              >
                <input type="hidden" name="folderId" value={selectedFolderId} />

                <div
                  {...getRootProps({
                    className: `rounded-2xl border border-dashed border-[#515355] bg-card p-8 grid place-items-center text-center gap-4 transition-all duration-300 flex-1 flex flex-col justify-center ${
                      isDragActive
                        ? "border-primary bg-primary/5 scale-[1.01] shadow-lg"
                        : "hover:border-primary/50"
                    }`,
                  })}
                >
                  <input {...getInputProps({ name: "files" })} />
                  <Upload
                    className={`size-8 transition-all duration-300 ${
                      isDragActive
                        ? "text-primary scale-110"
                        : "text-muted-foreground"
                    }`}
                  />
                  <p
                    className={`text-sm transition-colors duration-300 ${
                      isDragActive ? "text-primary font-medium" : ""
                    }`}
                  >
                    {isDragActive
                      ? "أسقط الملفات هنا"
                      : "اسحب وأفلت الملفات هنا أو اخترها"}
                  </p>
                  <div className="flex sm:flex-row flex-col items-center gap-3">
                    <Button
                      type="button"
                      onClick={() => openFileDialog()}
                      className="bg-primary text-primary-foreground px-10 py-5 cursor-pointer"
                    >
                      اختر الملفات
                    </Button>
                    <Button
                      type="submit"
                      disabled={!canSubmit || uploadBusy}
                      className="bg-secondary text-white px-10 py-5 cursor-pointer disabled:opacity-60"
                    >
                      ارفع الملف
                    </Button>
                  </div>
                  {selectedFiles.length > 0 && (
                    <div className="mt-4 text-left w-full">
                      <p className="text-sm mb-2">الملفات المختارة:</p>
                      <ul className="text-xs space-y-2">
                        {selectedFiles.map((f, i) => (
                          <li
                            key={i}
                            className="flex items-center justify-between bg-background/50 p-2 rounded border border-border/50"
                          >
                            <span className="text-muted-foreground truncate max-w-[200px]">
                              {f.name} (
                              {Math.round((f.size / 1024 / 1024) * 100) / 100}{" "}
                              MB)
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeFile(i);
                              }}
                              className="text-muted-foreground hover:text-destructive transition-colors p-1 cursor-pointer"
                            >
                              <X className="size-3" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Upload Progress Dialog */}
      <UploadProgressDialog
        open={showProgress}
        progress={uploadProgress}
        fileName={currentFileName}
        fileSize={currentFileSize}
        status={uploadStatus}
      />

      {/* Post-Upload Options Dialog */}
      <PostUploadOptionsDialog
        open={showOptions}
        onOpenChange={setShowOptions}
        folderId={uploadedFolderId}
        fileIds={uploadedFileIds}
      />
    </>
  );
}

export default UploadDialogTrigger;
