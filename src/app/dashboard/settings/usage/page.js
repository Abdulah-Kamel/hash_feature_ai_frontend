"use client";
import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PLANS } from "@/data/plans";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { apiClient } from "@/lib/api-client";

export default function UsageTabPage() {
  const [profile, setProfile] = React.useState();

  React.useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await apiClient("/api/profiles");
        const json = await res.json();
        if (!active) return;
        const d = json?.data || {};
        setProfile((p) => ({
          ...p,
          name: d?.name || p?.name,
          email: d?.email || p?.email,
          phone: d?.phone || p?.phone,
          plan: d?.plan || p?.plan,
          uploadsToday:
            typeof d?.uploadsToday === "number"
              ? d.uploadsToday
              : p?.uploadsToday,
          aiTokensToday:
            typeof d?.aiTokensToday === "number"
              ? d.aiTokensToday
              : p?.aiTokensToday,
          weeklyTriesUsed:
            typeof d?.weeklyTriesUsed === "number"
              ? d.weeklyTriesUsed
              : p?.weeklyTriesUsed,
          totalTries:
            typeof d?.totalTries === "number" ? d.totalTries : p?.totalTries,
          country: d?.country || p?.country,
          role: d?.role || p?.role,
          major: d?.major || p?.major,
          faculty: d?.faculty || p?.faculty,
        }));
      } catch {}
    })();
    return () => {
      active = false;
    };
  }, []);

  if (!profile) {
    return (
      <div className="space-y-6" dir="rtl">
        <Skeleton className="h-[88px] w-full rounded-xl bg-[#212121]" />
        <Card className="rounded-xl p-6 bg-[#212121] border border-[#515355] space-y-6">
          <div className="space-y-1">
            <Skeleton className="h-7 w-48 bg-[#303030]" />
            <Skeleton className="h-4 w-32 bg-[#303030]" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-24 bg-[#303030]" />
                  <Skeleton className="h-4 w-12 bg-[#303030]" />
                </div>
                <Skeleton className="h-1.5 w-full rounded-full bg-[#303030]" />
              </div>
            ))}
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton
                key={i}
                className="h-[62px] w-full rounded-lg bg-[#303030]"
              />
            ))}
          </div>
        </Card>
      </div>
    );
  }

  const planKey = profile?.plan || "free";
  const currentPlan = PLANS[planKey] || PLANS.free;

  // Data for progress bars
  const uploads = profile?.uploadsToday || 0;
  const uploadsMax = currentPlan.maxDailyUploads;

  const tokens = profile?.aiTokensToday || 0;
  const tokensMax = currentPlan.maxTokensPerDay;

  const tries = profile?.weeklyTriesUsed || 0;
  const triesMax = currentPlan.weeklyTries;

  // Note: Workspace usage is not available in profile data yet, placeholder 0
  const workspaces = profile?.totalFoldersCreated || 0;
  const workspacesMax = currentPlan.maxFolders;

  return (
    <div className="space-y-6" dir="rtl">
      <Card className="rounded-xl p-4 bg-background">
        <div className="flex items-center justify-between">
          <p className="text-2xl font-semibold text-white">الاستهلاك</p>
          <p className="text-sm text-primary">
            الاستهلاك لخطة {currentPlan.name === "free" ? "مجانية" : "احترافية"}
          </p>
        </div>
      </Card>
      <Card className="rounded-xl p-6 bg-[#212121] border border-[#515355] space-y-6">
        <div className="space-y-1">
          <p className="text-xl font-semibold text-white">
            نظرة عامة على الاستخدام
          </p>
          <p className="text-sm text-muted-foreground">تتبع استخدامك وحدودك</p>
        </div>
        <div className="space-y-4">
          {[
            {
              label: "عدد الملفات المرفوعة اليوم",
              value: `${uploads}/${uploadsMax}`,
              percent: uploadsMax
                ? Math.round((uploads / uploadsMax) * 100)
                : 0,
            },
            {
              label: "عدد tokens",
              value: `${tokens}/${tokensMax}`,
              percent: tokensMax ? Math.round((tokens / tokensMax) * 100) : 0,
            },
            {
              label: "عدد إنشاء نوع التعلم (فلاش كارد، اختبار، مرحلة)",
              value: `${tries}/${triesMax}`,
              percent: triesMax ? Math.round((tries / triesMax) * 100) : 0,
            },
            {
              label: "عدد مساحات العمل",
              value: `${workspaces}/${workspacesMax}`,
              percent: workspacesMax
                ? Math.round((workspaces / workspacesMax) * 100)
                : 0,
            },
          ].map((row, i) => (
            <div key={i} className="space-y-2">
              <div className="flex items-center justify-between text-white text-sm">
                <span>{row.label}</span>
                <span>{row.value}</span>
              </div>
              <div className="h-1.5 bg-card rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${Math.min(100, row.percent)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-3">
          {[
            {
              label: "عدد إنشاء نوع التعلم",
              value: `${currentPlan.weeklyTries} / أسبوع`,
            },
            { label: "حجم الملف", value: `${currentPlan.maxFileSize} MB` },
            {
              label: "عدد الملفات المرفوعة في كل مساحة",
              value: `${currentPlan.maxFilesPerFolder} ملفات`,
            },
            { label: "عدد مساحات العمل", value: `${currentPlan.maxFolders}` },
            {
              label: "عدد tokens",
              value: `${currentPlan.maxTokensPerDay}`,
            },
          ].map((it, i) => (
            <Card
              key={i}
              className="rounded-lg bg-[#303030] border border-[#454545] p-4 flex flex-row items-center justify-between"
            >
              <p className="text-white">{it.label}</p>
              <p className="text-white text-lg font-semibold">{it.value}</p>
            </Card>
          ))}
        </div>
        {profile?.plan === "pro" && (
          <div className="grid">
            <Link
              href="/dashboard/settings/billing"
              className="rounded-xl h-12 bg-primary text-primary-foreground flex items-center justify-center"
            >
              <p>ترقية خطتك</p>
            </Link>
          </div>
        )}
      </Card>
    </div>
  );
}