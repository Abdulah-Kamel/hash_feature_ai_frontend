"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

export default function GoogleCallback() {
  const router = useRouter();
  const sp = useSearchParams();
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = sp.get("credential") || sp.get("id_token") || "";
    (async () => {
      if (!token) {
        setError("No credential provided");
        setBusy(false);
        return;
      }
      try {
        const res = await fetch("/api/auth/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken: token }),
        });
        const json = await res.json();
        if (!res.ok) {
          const msg = json?.message || "فشل تسجيل الدخول بواسطة جوجل";
          if (/verify your otp code first/i.test(String(msg))) {
            let email = json?.data?.email || "";
            try {
              const payload = JSON.parse(atob(String(token).split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
              if (!email) email = payload?.email || "";
            } catch {}
            toast.info("يرجى التحقق من الحساب عبر الرمز المرسل", { position: "top-right", duration: 3000, classNames: "toast-info mt-14" });
            router.replace(`/otp${email ? `?email=${encodeURIComponent(email)}` : ""}`);
            return;
          }
          setError(msg);
          toast.error(msg, { position: "top-right", duration: 3000, classNames: "toast-error mt-14" });
          setBusy(false);
          return;
        }
        const active = !!(json?.data?.isActive || json?.user?.isActive);
        if (!active) {
          let email = json?.data?.email || "";
          try {
            const payload = JSON.parse(atob(String(token).split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
            if (!email) email = payload?.email || "";
          } catch {}
          toast.info("يرجى التحقق من الحساب عبر الرمز المرسل", { position: "top-right", duration: 3000, classNames: "toast-info mt-14" });
          router.replace(`/otp${email ? `?email=${encodeURIComponent(email)}` : ""}`);
          return;
        }
        toast.success("تم تسجيل الدخول بنجاح", { position: "top-right", duration: 3000, classNames: "toast-success mt-14" });
        router.replace("/dashboard/overview");
      } catch (e) {
        setError("Network error");
        toast.error("حدث خطأ في الشبكة", { position: "top-right", duration: 3000, classNames: "toast-error mt-14" });
        setBusy(false);
      }
    })();
  }, [router, sp]);

  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      {busy ? (
        <Spinner className="size-10" />
      ) : (
        <p className="text-white text-sm">{error || "تمت المعالجة"}</p>
      )}
    </div>
  );
}
