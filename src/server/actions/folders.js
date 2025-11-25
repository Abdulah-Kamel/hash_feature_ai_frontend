"use server";
import { cookies } from "next/headers";

export async function createFolder(data) {
  const c = await cookies();
  const token = c.get("authToken")?.value;
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${process.env.baseApi}/api/v1/folders`, {
    method: "POST",
    body: JSON.stringify(data),
    headers,
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
  const c = await cookies();
  const token = c.get("authToken")?.value;
  const headers = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${process.env.baseApi}/api/v1/folders`, { method: "GET", headers });
  let final = null;
  try {
    final = await res.json();
  } catch {}
  if (!res.ok) return { success: false, error: final?.message };
  const data = final?.data ?? final?.folders ?? final;
  return { success: true, data };
}

export async function updateFolder(id, data) {
  const c = await cookies();
  const token = c.get("authToken")?.value;
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${process.env.baseApi}/api/v1/folders/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
    headers,
  });
  let final = null;
  try {
    final = await res.json();
  } catch {}
  if (!res.ok) return { success: false, error: final?.message };
  return { success: true, data: final };
}

export async function deleteFolder(id) {
  const c = await cookies();
  const token = c.get("authToken")?.value;
  const headers = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${process.env.baseApi}/api/v1/folders/${id}`, { method: "DELETE", headers });
  let final = null;
  try {
    final = await res.json();
  } catch {}
  if (!res.ok) return { success: false, error: final?.message || res.statusText };
  return { success: true, data: final };
}
