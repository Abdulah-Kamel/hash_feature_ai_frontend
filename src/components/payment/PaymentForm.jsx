"use client";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";

function amountFor(planMonths) {
  if (String(planMonths) === "1") return 29 * 100;
  if (String(planMonths) === "3") return 79 * 100;
  if (String(planMonths) === "12") return 179 * 100;
  return 29 * 100;
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
      link.href =
        "https://cdn.jsdelivr.net/npm/moyasar-payment-form@2.2.3/dist/moyasar.css";
      document.head.appendChild(link);
    };

    const ensureOverrides = () => {
      if (document.getElementById("mysr-custom-style")) return;
      const style = document.createElement("style");
      style.id = "mysr-custom-style";
      style.textContent = `
        .mysr-form, .mysr-form * { color: #fff !important; }
        .mysr-form .text-black, .mysr-form [class*='text-black'] { color: #fff !important; }
        .mysr-form input,
        .mysr-form .mysr-input,
        .mysr-form .mysr-input input,
        .mysr-form input[type="text"],
        .mysr-form input[type="tel"],
        .mysr-form input[type="password"],
        .mysr-form [style*='color'] {
          color: #fff !important;
          -webkit-text-fill-color: #fff !important;
          background-color: #1f1f1f !important;
          border-color: #515355 !important;
        }
        /* Center card brand icons beside the card number */
        .mysr-form .mysr-input { display: flex !important; align-items: center !important; }
        .mysr-form .mysr-input input { flex: 1 !important; }
        .mysr-form .mysr-input img, .mysr-form .mysr-input svg { align-self: center !important; vertical-align: middle !important; }
        .mysr-form ::placeholder,
        .mysr-form input::-webkit-input-placeholder,
        .mysr-form input:-ms-input-placeholder,
        .mysr-form input::-ms-input-placeholder {
          color: #bbb !important;
        }
        .mysr-form .mysr-button,
        .mysr-form button[type="submit"] {
          color: #fff !important;
        }
      `;
      document.head.appendChild(style);
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
          callback_url: `${
            window.location.origin
          }/api/payments/callback?planMonths=${encodeURIComponent(
            String(planMonths),
          )}`,
          amount: amountFor(planMonths),
          currency: "SAR",
          description: `HashPlus Pro – ${planMonths} months`,
          methods: ["creditcard", "applepay"],
          apple_pay: {
            country: "SA",
            label: "HashPlus",
            validate_merchant_url:
              "https://api.moyasar.com/v1/applepay/initiate",
          },
          supported_networks: ["visa", "mastercard", "mada", "amex"],
          on_completed: async () => {},
        });
      } catch (e) {
        toast.error("تعذر تهيئة نموذج الدفع");
      }
    };

    ensureCss();
    ensureOverrides();

    if (!window.Moyasar) {
      const script = document.createElement("script");
      script.src =
        "https://cdn.jsdelivr.net/npm/moyasar-payment-form@2.2.3/dist/moyasar.umd.min.js";
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
