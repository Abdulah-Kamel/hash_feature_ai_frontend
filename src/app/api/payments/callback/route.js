import { NextResponse } from "next/server";
import { cookies } from "next/headers";

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

  const dest = new URL(
    `/subscription-validation?id=${encodeURIComponent(
      id
    )}&status=${encodeURIComponent(status)}&message=${encodeURIComponent(
      message
    )}${planMonths ? `&planMonths=${encodeURIComponent(planMonths)}` : ""}`,
    req.url
  );
  return NextResponse.redirect(dest);
}
