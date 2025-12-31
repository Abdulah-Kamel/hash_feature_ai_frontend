import { NextResponse } from "next/server";
import { cookies } from "next/headers";

function getAppUrl(req) {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }
  const forwardedHost = req.headers.get("x-forwarded-host");
  if (forwardedHost) {
    const proto = req.headers.get("x-forwarded-proto") || "https";
    return `${proto}://${forwardedHost}`;
  }
  const host = req.headers.get("host");
  if (host) {
    const proto = process.env.NODE_ENV === "production" ? "https" : "http";
    return `${proto}://${host}`;
  }
  return req.nextUrl.origin;
}

export async function GET(req) {
  const u = new URL(req.url);
  const id = u.searchParams.get("id") || "";
  const status = u.searchParams.get("status") || "";
  const message = u.searchParams.get("message") || "";
  const planMonths = u.searchParams.get("planMonths") || "";

  try {
    if (id && status === "paid") {
      const c = await cookies();
      const token = c.get("authToken")?.value;
      const user = c.get("user")?.value;
      const base = process.env.baseApi;
      if (base && token && planMonths) {
        await fetch(`${base}/api/v1/payments/pro-plan`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            paymentId: id,
            email: user.email || "",
            planMonths: String(planMonths),
          }),
        }).catch(() => {});
      }
    }
  } catch {}

  const baseUrl = getAppUrl(req);
  const dest = new URL(
    `/subscription-validation?id=${encodeURIComponent(
      id
    )}&status=${encodeURIComponent(status)}&message=${encodeURIComponent(
      message
    )}${planMonths ? `&planMonths=${encodeURIComponent(planMonths)}` : ""}`,
    baseUrl
  );
  return NextResponse.redirect(dest);
}
