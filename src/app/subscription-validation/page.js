"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, XCircle, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useWindowSize } from "react-use";
import Confetti from "react-confetti";
import { apiClient } from "@/lib/api-client";

function SubscriptionValidationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const paymentId = searchParams.get("id");
  const status = searchParams.get("status");
  const message = searchParams.get("message");
  const monthsParam = searchParams.get("planMonths");
  const [countdown, setCountdown] = useState(10);
  const { width, height } = useWindowSize();
  const [activating, setActivating] = useState(false);
  const [activated, setActivated] = useState(false);
  const [activationError, setActivationError] = useState("");

  const isSuccess = status === "paid";
  const isFailed = status && status !== "paid";

  useEffect(() => {
    const hasAnyId = sessionId || paymentId;
    if (!hasAnyId) {
      router.push("/dashboard/settings/billing");
      return;
    }

    // Countdown to auto-redirect
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/dashboard/settings/billing");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [sessionId, paymentId, router]);

  useEffect(() => {
    if (status !== "paid" || activated || activating) return;
    const months = monthsParam ? Number(monthsParam) : undefined;
    if (!paymentId || !months) return;
    (async () => {
      setActivating(true);
      setActivationError("");
      try {
        // Fetch email from profile
        const profRes = await apiClient("/api/profiles");
        const profJson = await profRes.json().catch(() => ({}));
        const email = profJson?.data?.email || "";
        const res = await apiClient("/api/payments/pro-plan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: paymentId, email, planMonths: months }),
        });

        const json = await res.json().catch(() => ({}));
        if (res.ok) {
          setActivated(true);
        } else {
          setActivationError(json?.message || "فشل تفعيل الاشتراك");
        }
      } catch {
        setActivationError("فشل تفعيل الاشتراك");
      } finally {
        setActivating(false);
      }
    })();
  }, [status, activated, activating, paymentId, monthsParam]);

  if (!sessionId && !paymentId) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Confetti only for success */}
      {isSuccess && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.2}
        />
      )}

      <div className="absolute inset-0 -z-10 h-full w-full">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/stars-bg.png')] bg-cover bg-center opacity-60 mix-blend-screen animate-pulse"></div>
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[120px] opacity-50 ${
          isSuccess ? 'bg-green-500/20' : isFailed ? 'bg-red-500/20' : 'bg-primary/20'
        }`}></div>
      </div>

      <Card className={`max-w-2xl w-full p-8 text-center space-y-6 backdrop-blur-sm shadow-2xl animate-in fade-in zoom-in duration-500 ${
        isSuccess ? 'bg-card/50 border-green-500/20' : isFailed ? 'bg-card/50 border-red-500/20' : 'bg-card/50 border-primary/20'
      }`}>
        {/* Icon based on status */}
        <div className="flex justify-center">
          {isSuccess ? (
            <div className="rounded-full bg-green-500/10 p-4 ring-4 ring-green-500/20 animate-bounce">
              <CheckCircle2 className="w-16 h-16 text-green-500" />
            </div>
          ) : isFailed ? (
            <div className="rounded-full bg-red-500/10 p-4 ring-4 ring-red-500/20">
              <XCircle className="w-16 h-16 text-red-500" />
            </div>
          ) : (
            <div className="rounded-full bg-yellow-500/10 p-4 ring-4 ring-yellow-500/20">
              <AlertCircle className="w-16 h-16 text-yellow-500" />
            </div>
          )}
        </div>

        {/* Title and message based on status */}
        <div className="space-y-2">
          {isSuccess ? (
            <>
              <h1 className="text-3xl font-bold text-foreground">
                تم الدفع بنجاح!
              </h1>
              <p className="text-muted-foreground text-lg">
                شكراً لاشتراكك في الباقة الاحترافية.
              </p>
            </>
          ) : isFailed ? (
            <>
              <h1 className="text-3xl font-bold text-red-500">
                فشلت عملية الدفع
              </h1>
              <p className="text-muted-foreground text-lg">
                {message || "عذراً، لم تتم عملية الدفع بنجاح. يرجى المحاولة مرة أخرى."}
              </p>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold text-foreground">
                جاري التحقق...
              </h1>
              <p className="text-muted-foreground text-lg">
                يتم التحقق من حالة الدفع.
              </p>
            </>
          )}
        </div>

        {/* Transaction details */}
        <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
          رقم العملية: <br />
          <span className="font-mono text-xs select-all">
            {sessionId || paymentId}
          </span>
          {status && (
            <div className="mt-2">
              الحالة:{" "}
              <span className={`font-mono text-xs ${
                isSuccess ? 'text-green-500' : isFailed ? 'text-red-500' : ''
              }`}>
                {status === "paid" ? "مدفوع" : status === "failed" ? "فشل" : status}
              </span>
            </div>
          )}
          {message && isFailed && (
            <div className="mt-1">
              السبب: <span className="font-mono text-xs text-red-400">{message}</span>
            </div>
          )}
          {isSuccess && (
            <div className="mt-3">
              {activating && (
                <div className="inline-flex items-center gap-2 text-white">
                  <Loader2 className="h-4 w-4 animate-spin" /> جاري تفعيل
                  الاشتراك...
                </div>
              )}
              {!activating && activated && (
                <div className="text-green-500">تم تفعيل الاشتراك بنجاح</div>
              )}
              {!activating && !activated && activationError && (
                <div className="text-red-500">{activationError}</div>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-4 pt-4">
          {isFailed ? (
            <Button asChild className="w-full text-lg h-12" size="lg" variant="destructive">
              <Link href="/dashboard/settings/billing">المحاولة مرة أخرى</Link>
            </Button>
          ) : (
            <Button asChild className="w-full text-lg h-12" size="lg">
              <Link href="/dashboard/settings/billing">العودة للوحة التحكم</Link>
            </Button>
          )}

          <p className="text-sm text-muted-foreground animate-pulse">
            سيتم تحويلك تلقائياً خلال {countdown} ثواني...
          </p>
        </div>
      </Card>
    </div>
  );
}

export default function SubscriptionValidationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <SubscriptionValidationContent />
    </Suspense>
  );
}
