"use server";
import { cookies } from "next/headers";

function apiBase() {
  return process.env.baseApi;
}

export async function uploadFiles(formData) {
  const base = apiBase();
  if (!base) return { success: false, error: "API base URL not configured" };
  const c = await cookies();
  const token = c.get("authToken")?.value;
  if (!token) return { success: false, error: "No token provided" };

  const folderId = formData.get("folderId");
  const files = formData.getAll("files");
  if (!folderId) return { success: false, error: "Missing folderId" };
  if (!files || files.length === 0)
    return { success: false, error: "No files provided" };

  const fd = new FormData();
  for (const file of files) fd.append("files", file);
  const res = await fetch(`${base}/api/v1/folders/${folderId}/files`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: fd,
  });
  let final = null;
  try { final = await res.json(); } catch {}
  if (!res.ok) return { success: false, error: final?.message || res.statusText };
  return { success: true, data: final };
}
