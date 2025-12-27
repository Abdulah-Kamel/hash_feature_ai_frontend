import { NextResponse } from "next/server";

function apiBase() {
  return process.env.baseApi;
}

export async function POST(req) {
  const base = apiBase();
  if (!base)
    return NextResponse.json({ message: "API base URL not configured" }, { status: 500 });
  let body = {};
  try { body = await req.json(); } catch {}
  const email = body?.email;
  if (!email)
    return NextResponse.json({ message: "Missing email" }, { status: 400 });
  const res = await fetch(`${base}/api/v1/auth/request-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  let final = null;
  try { final = await res.json(); } catch {}
  if (!res.ok)
    return NextResponse.json(final || { message: res.statusText }, { status: res.status });
  return NextResponse.json(final);
}
