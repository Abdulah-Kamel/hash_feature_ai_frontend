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
  const idToken = body?.idToken;
  if (!idToken)
    return NextResponse.json({ message: "Missing idToken" }, { status: 400 });
  const res = await fetch(`${base}/api/v1/auth/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });
  let final = null;
  try { final = await res.json(); } catch {}
  if (!res.ok)
    return NextResponse.json(final || { message: res.statusText }, { status: res.status });
  const c = await cookies();
  const token = final?.token || final?.accessToken;
  const refreshToken = final?.refreshToken;
  const user = final?.data || final?.user || null;
  if (token)
    c.set("authToken", token, {
      httpOnly: true,
      sameSite: "strict",
      path: "/",
      expires: new Date(Date.now() + 15 * 60 * 1000),
    });
  if (refreshToken)
    c.set("refreshToken", refreshToken, { httpOnly: true, sameSite: "strict", path: "/" });
  if (user)
    c.set("user", JSON.stringify(user), {
      httpOnly: true,
      sameSite: "strict",
      path: "/",
      expires: new Date(Date.now() + 15 * 60 * 1000),
    });
  return NextResponse.json(final);
}
