"use server";
import { serverApiClient } from "../api-client";
import { redirect } from "next/navigation";

export async function uploadFiles(formData) {
  const folderId = formData.get("folderId");
  const files = formData.getAll("files");
  if (!folderId) return { success: false, error: "Missing folderId" };
  if (!files || files.length === 0)
    return { success: false, error: "No files provided" };

  const fd = new FormData();
  for (const file of files) fd.append("files", file);

  try {
    // serverApiClient will automatically handle Content-Type for FormData
    // Add timeout for large file uploads (5 minutes)
    const res = await serverApiClient(`/api/v1/folders/${folderId}/files`, {
      method: "POST",
      body: fd,
      signal: AbortSignal.timeout(300000), // 5 minutes timeout
    });

    let final = null;
    try {
      final = await res.json();
    } catch (parseError) {
      console.error("Failed to parse response:", parseError);
    }

    if (!res.ok) {
      return { success: false, error: final?.message || res.statusText };
    }
    return { success: true, data: final };
  } catch (error) {
    // Handle timeout and network errors
    if (error.name === "TimeoutError") {
      return {
        success: false,
        error: "Upload timeout - file may be too large or connection too slow",
      };
    }
    if (error.name === "AbortError") {
      return { success: false, error: "Upload was cancelled" };
    }
    console.error("Upload error:", error);
    return { success: false, error: error.message || "Upload failed" };
  }
}

export async function fetchFolderFiles(folderId) {
  if (!folderId) return { success: false, error: "Missing folderId" };

  const res = await serverApiClient(`/api/v1/folders/${folderId}/files`, {
    method: "GET",
  });

  let final = null;
  try {
    final = await res.json();
  } catch {}

  if (!res.ok)
    return { success: false, error: final?.message || res.statusText };
  return { success: true, data: final };
}

export async function deleteFile(folderId, fileId) {
  if (!folderId || !fileId) return { success: false, error: "Missing IDs" };

  const res = await serverApiClient(`/api/v1/folders/${folderId}/files`, {
    method: "DELETE",
    body: JSON.stringify({ fileIds: [fileId] }),
  });

  let final = null;
  try {
    final = await res.json();
  } catch {}

  if (!res.ok)
    return { success: false, error: final?.message || res.statusText };
  return { success: true, data: final };
}

export async function logout() {
  // Logout typically clears cookies, handled by the component calling server action or simple redirect
  // But here we might want to tell backend to invalidate?
  // Previous implementation just cleared cookie.
  // We can't access `cookies().delete` directly in api-client helper easily without passing context.
  // So we keep original logic here but importing cookies.
  const { cookies } = await import("next/headers");
  const c = await cookies();
  c.delete("authToken");
  c.delete("refreshToken");
  redirect("/login");
}

export async function fetchUserFiles() {
  const res = await serverApiClient(`/api/v1/profiles/files`, {
    method: "GET",
  });

  let final = null;
  try {
    final = await res.json();
  } catch {}

  if (!res.ok)
    return { success: false, error: final?.message || res.statusText };
  console.log(final);
  
  return { success: true, data: final };
}
