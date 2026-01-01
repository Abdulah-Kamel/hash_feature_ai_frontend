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
  const folderId = searchParams.get("folderId");
  const url = `${base}/api/v1/ai/mind-maps?folderId=${encodeURIComponent(
    folderId
  )}`;
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

export async function POST(req) {
  const base = apiBase();
  if (!base)
    return NextResponse.json(
      { message: "API base URL not configured" },
      { status: 500 }
    );

  const c = await cookies();
  const token = c.get("authToken")?.value;

  if (!token) {
    return NextResponse.json({ message: "No token provided" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const response = await fetch(`${base}/api/v1/ai/mind-maps`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
        // Forward the backend error
        return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error("Mind Map Generation Error:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
