"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useWindowSize } from "react-use";
import Confetti from "react-confetti";
import { apiClient } from "@/lib/api-client";

function SubscriptionSuccessContent() {
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
  }, [sessionId, router]);

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
        console.log(res);

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
      <Confetti
        width={width}
        height={height}
        recycle={false}
        numberOfPieces={500}
        gravity={0.2}
      />

      <div className="absolute inset-0 -z-10 h-full w-full">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/stars-bg.png')] bg-cover bg-center opacity-60 mix-blend-screen animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] opacity-50"></div>
      </div>

      <Card className="max-w-2xl w-full p-8 text-center space-y-6 bg-card/50 backdrop-blur-sm border-primary/20 shadow-2xl animate-in fade-in zoom-in duration-500">
        <div className="flex justify-center">
          <div className="rounded-full bg-green-500/10 p-4 ring-4 ring-green-500/20 animate-bounce">
            <CheckCircle2 className="w-16 h-16 text-green-500" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            تم الدفع بنجاح!
          </h1>
          <p className="text-muted-foreground text-lg">
            شكراً لاشتراكك في الباقة الاحترافية.
          </p>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
          رقم العملية: <br />
          <span className="font-mono text-xs select-all">
            {sessionId || paymentId}
          </span>
          {status && (
            <div className="mt-2">
              الحالة: <span className="font-mono text-xs">{status}</span>
            </div>
          )}
          {message && (
            <div className="mt-1">
              الرسالة: <span className="font-mono text-xs">{message}</span>
            </div>
          )}
          {status === "paid" && (
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

        <div className="space-y-4 pt-4">
          <Button asChild className="w-full text-lg h-12" size="lg">
            <Link href="/dashboard/settings/billing">العودة للوحة التحكم</Link>
          </Button>

          <p className="text-sm text-muted-foreground animate-pulse">
            سيتم تحويلك تلقائياً خلال {countdown} ثواني...
          </p>
        </div>
      </Card>
    </div>
  );
}

export default function SubscriptionSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <SubscriptionSuccessContent />
    </Suspense>
  );
}
