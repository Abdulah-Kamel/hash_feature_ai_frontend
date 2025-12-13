import { NextResponse } from "next/server";
import { cookies } from "next/headers";

function apiBase() {
  return process.env.baseApi;
}

export async function GET(req) {
  const base = apiBase();
  if (!base)
    return NextResponse.json(
      { message: "API base URL not configured" },
      { status: 500 }
    );
  const c = await cookies();
  const token = c.get("authToken")?.value;
  if (!token)
    return NextResponse.json({ message: "No token provided" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const fileId = searchParams.get("fileId");
  const url = `${base}/api/v1/ai/mind-maps?fileId=${encodeURIComponent(fileId)}`
  const res = await fetch(url, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  let final = null;
  try {
    final = await res.json();
  } catch {}
  if (!res.ok)
    return NextResponse.json(final || { message: res.statusText }, {
      status: res.status,
    });
  return NextResponse.json(final);
}
