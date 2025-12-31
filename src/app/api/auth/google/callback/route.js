import { NextResponse } from "next/server";
import { cookies } from "next/headers";

function apiBase() {
  return process.env.baseApi;
}

function decodeEmailFromToken(token) {
  try {
    const [, payload] = String(token).split(".");
    if (!payload) return "";
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = JSON.parse(Buffer.from(normalized, "base64").toString("utf8"));
    return json?.email || "";
  } catch {
    return "";
  }
}

export async function POST(req) {
  const base = apiBase();
  if (!base)
    return NextResponse.json(
      { message: "API base URL not configured" },
      { status: 500 }
    );

  let token = "";
  try {
    const form = await req.formData();
    console.log("Google callback request form data:", form);
    token = form.get("credential") || form.get("id_token") || "";
  } catch {}
  if (!token)
    return NextResponse.redirect(
      new URL("/login?error=no_credential", req.url)
    );

  const res = await fetch(`${base}/api/v1/auth/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
  let final = null;
  try {
    final = await res.json();
  } catch {}

  if (!res.ok) {
    const msg = final?.message || "Login failed";
    const email = final?.data?.email || decodeEmailFromToken(token);
    if (/verify your otp code first/i.test(String(msg))) {
      const u = new URL(
        `/otp${email ? `?email=${encodeURIComponent(email)}` : ""}`,
        req.url
      );
      return NextResponse.redirect(u);
    }
    const u = new URL("/login?error=google_login_failed", req.url);
    return NextResponse.redirect(u);
  }

  const c = await cookies();
  const authToken = final?.token || final?.accessToken;
  const refreshToken = final?.refreshToken;
  const user = final?.data || final?.user || null;
  if (authToken)
    c.set("authToken", authToken, {
      httpOnly: true,
      sameSite: "strict",
      path: "/",
      expires: new Date(Date.now() + 15 * 60 * 1000),
    });
  if (refreshToken)
    c.set("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      path: "/",
    });
  if (user)
    c.set("user", JSON.stringify(user), {
      httpOnly: true,
      sameSite: "strict",
      path: "/",
      expires: new Date(Date.now() + 15 * 60 * 1000),
    });

  return NextResponse.redirect(new URL("/dashboard/overview", req.url));
}
