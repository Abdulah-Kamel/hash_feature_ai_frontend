import { NextResponse } from "next/server";
import { cookies } from "next/headers";

function apiBase() {
  return process.env.baseApi;
}

export async function POST() {
  const base = apiBase();
  const c = await cookies();
  const refreshToken = c.get("refreshToken")?.value;

  if (!refreshToken) {
    return NextResponse.json({ message: "No refresh token" }, { status: 401 });
  }

  const res = await fetch(`${base}/api/v1/auth/refresh-token`, {
    method: "POST", // Assumption: Refresh endpoint uses POST
    headers: {
      "Content-Type": "application/json",
      "x-refresh-token": refreshToken,
    },
    // body: JSON.stringify({ refreshToken }), // Removed as token is in header
  });

  const final = await res.json();

  if (res.ok) {
    // Update cookies
    const token = final?.token || final?.accessToken;
    if (token) {
      c.set("authToken", token, {
        httpOnly: true,
        sameSite: "strict",
        path: "/",
      });
    }
    // Optionally update refresh token if rotated
    if (final?.refreshToken) {
      c.set("refreshToken", final.refreshToken, {
        httpOnly: true,
        sameSite: "strict",
        path: "/",
      });
    }
    return NextResponse.json({ success: true, ...final });
  }

  return NextResponse.json(final || { message: "Refresh failed" }, {
    status: res.status,
  });
}
