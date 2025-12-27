import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// Disable caching to ensure cookies are read fresh each time
export const dynamic = "force-dynamic";

function apiBase() {
  return process.env.baseApi;
}

export async function GET(req, { params }) {
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

  const { id } = await params;

  const res = await fetch(`${base}/api/v1/ai/chat/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
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
