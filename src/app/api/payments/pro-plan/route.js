import { NextResponse } from "next/server";
import { cookies } from "next/headers";

function apiBase() {
  return process.env.baseApi;
}

export async function POST(req) {
  const base = apiBase();
  if (!base)
    return NextResponse.json(
      { message: "API base URL not configured" },
      { status: 500 }
    );

  let body = {};
  try { body = await req.json(); } catch {}
  const cardToken = body?.cardToken;
  const planMonths = body?.planMonths;
  if (!cardToken || !planMonths)
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );

  const c = await cookies();
  const token = c.get("authToken")?.value;
  if (!token)
    return NextResponse.json({ message: "No token provided" }, { status: 401 });

  const res = await fetch(`${base}/api/v1/payments/pro-plan`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ cardToken, planMonths }),
  });

  let final = null;
  try { final = await res.json(); } catch {}
  if (!res.ok)
    return NextResponse.json(final || { message: res.statusText }, { status: res.status });
  return NextResponse.json(final);
}

