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
  const code = body?.code;

  if (!idToken && !code) {
    console.error("Missing idToken or code in request");
    return NextResponse.json(
      { message: "Missing idToken or code" },
      { status: 400 }
    );
  }

  let finalIdToken = idToken;

  // If we received an authorization code, exchange it for an ID token
  if (code) {
    console.log("Attempting to exchange code for tokens...");
    try {
      if (!process.env.GOOGLE_CLIENT_SECRET) {
        console.error("GOOGLE_CLIENT_SECRET is missing in environment");
        return NextResponse.json(
          {
            message: "Server configuration error: Missing Google Client Secret",
          },
          { status: 500 }
        );
      }

      const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          code,
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          redirect_uri: "postmessage",
          grant_type: "authorization_code",
        }),
      });
      
      if (!tokenResponse.ok) {
        const error = await tokenResponse.text();
        console.error("Token exchange failed:", error);
        return NextResponse.json(
          { message: "Failed to exchange authorization code" },
          { status: 400 }
        );
      }

      const tokens = await tokenResponse.json();
      finalIdToken = tokens.id_token;

      if (!finalIdToken) {
        console.error("No id_token in response:", tokens);
        return NextResponse.json(
          { message: "Failed to get ID token from Google" },
          { status: 400 }
        );
      }

    } catch (error) {
      console.error("Error exchanging code:", error);
      return NextResponse.json(
        { message: "Error exchanging authorization code" },
        { status: 500 }
      );
    }
  }

  if (!finalIdToken) {
    console.error("No ID token available to send to backend");
    return NextResponse.json(
      { message: "No ID token available" },
      { status: 400 }
    );
  }

  const payload = { token: finalIdToken };

  const res = await fetch(`${base}/api/v1/auth/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  let final = null;
  try {
    final = await res.json();
  } catch (e) {
    console.error("Failed to parse backend response:", e);
  }
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
    });
  if (refreshToken)
    c.set("refreshToken", refreshToken, { httpOnly: true, sameSite: "strict", path: "/" });
  if (user)
    c.set("user", JSON.stringify(user), {
      httpOnly: true,
      sameSite: "strict",
      path: "/",
    });
  return NextResponse.json(final);
}
