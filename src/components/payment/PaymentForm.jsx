"use client";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";

function amountFor(planMonths) {
  if (String(planMonths) === "1") return 59 * 100;
  if (String(planMonths) === "3") return 149 * 100;
  if (String(planMonths) === "12") return 499 * 100;
  return 59 * 100;
}

export default function PaymentForm({ planMonths = "1" }) {
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_MOYASAR_PUBLISHABLE_KEY;
    if (!key) {
      toast.error("مفتاح Moyasar غير مضبوط");
      return;
    }

    const ensureCss = () => {
      const exists = Array.from(document.styleSheets).some((s) =>
        String(s.href || "").includes("moyasar.css")
      );
      if (exists) return;
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://cdn.jsdelivr.net/npm/moyasar-payment-form@2.2.3/dist/moyasar.css";
      document.head.appendChild(link);
    };

    const initForm = () => {
      if (!window.Moyasar || !containerRef.current) return;
      containerRef.current.innerHTML = "";
      const el = document.createElement("div");
      el.className = "mysr-form";
      containerRef.current.appendChild(el);
      try {
        window.Moyasar.init({
          element: ".mysr-form",
          publishable_api_key: key,
          amount: amountFor(planMonths),
          currency: "SAR",
          description: `HashPlus Pro – ${planMonths} months`,
          methods: ["creditcard"],
          supported_networks: ["visa", "mastercard", "mada", "amex"],
          on_completed: async (payment) => {
            const cardToken = payment?.source?.token || "";
            if (!cardToken) {
              toast.error("فشل استخراج رمز البطاقة");
              return;
            }
            setLoading(true);
            const res = await apiClient("/api/payments/pro-plan", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ cardToken, planMonths: String(planMonths) }),
            });
            const json = await res.json().catch(() => ({}));
            setLoading(false);
            if (res.ok) {
              toast.success("تم الدفع بنجاح");
              window.location.href = "/dashboard/overview";
            } else {
              toast.error(json?.message || "فشل الدفع");
            }
          },
        });
      } catch (e) {
        toast.error("تعذر تهيئة نموذج الدفع");
      }
    };

    ensureCss();

    if (!window.Moyasar) {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/moyasar-payment-form@2.2.3/dist/moyasar.umd.min.js";
      script.async = true;
      script.onload = initForm;
      script.onerror = () => toast.error("تعذر تحميل مكتبة Moyasar");
      document.body.appendChild(script);
    } else {
      initForm();
    }

    return () => {
      if (containerRef.current) containerRef.current.innerHTML = "";
    };
  }, [planMonths]);

  return (
    <div className="space-y-4">
      <div ref={containerRef} />
      {loading && (
        <div className="text-sm text-white/80">جاري معالجة الدفع...</div>
      )}
    </div>
  );
}

