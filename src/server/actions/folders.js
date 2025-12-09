"use server";
import { serverApiClient } from "../api-client";
import { redirect } from "next/navigation";

export async function createFolder(data) {
  const res = await serverApiClient("/api/v1/folders", {
    method: "POST",
    body: JSON.stringify(data),
  });

  let final = null;
  try {
    final = await res.json();
    console.log(final);
  } catch (err) {
    console.log(err);
  }

  if (!res.ok) return { success: false, error: final?.message };
  return { success: true, data: final };
}

export async function getFolders() {
  const res = await serverApiClient("/api/v1/folders", { method: "GET" });

  let final = null;
  try {
    final = await res.json();
  } catch {}

  if (!res.ok) return { success: false, error: final?.message };
  const data = final?.data ?? final?.folders ?? final;
  return { success: true, data };
}

export async function updateFolder(id, data) {
  const res = await serverApiClient(`/api/v1/folders/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

  let final = null;
  try {
    final = await res.json();
  } catch {}

  if (!res.ok) return { success: false, error: final?.message };
  return { success: true, data: final };
}

export async function deleteFolder(id) {
  const res = await serverApiClient(`/api/v1/folders/${id}`, {
    method: "DELETE",
  });

  let final = null;
  try {
    final = await res.json();
  } catch {}

  if (!res.ok)
    return { success: false, error: final?.message || res.statusText };
  return { success: true, data: final };
}

export async function getFolder(id) {
  const res = await serverApiClient(`/api/v1/folders/${id}`, { method: "GET" });

  let final = null;
  try {
    final = await res.json();
  } catch {}

  if (!res.ok) return { success: false, error: final?.message };
  return { success: true, data: final?.data || final };
}
