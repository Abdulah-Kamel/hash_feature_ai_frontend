"use client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PLANS } from "@/data/plans";

export default function UsageCard({ profile }) {
  const planKey = "free";

  return (
    <div className="space-y-6" dir="rtl">
      <Card className="rounded-xl p-4 bg-background border-none">
        <div className="flex items-center justify-between">
          <p className="text-2xl font-semibold text-white">الاستهلاك</p>
          <p className="text-sm text-primary">الاستهلاك لخطة {planKey}</p>
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
          {(() => {
            const uploadsMax = PLANS[planKey].maxDailyUploads;
            const messagesMax = PLANS[planKey].maxTokensPerDay;
            const triesMax = PLANS[planKey].weeklyTries;

            const uploads = profile?.uploadsToday || 0;
            const tokens = profile?.aiTokensToday || 0;
            const tries = profile?.weeklyTriesUsed || 0;

            const rows = [
              {
                label: "عدد الملفات المرفوعة اليوم",
                value: `${uploads}/${uploadsMax}`,
                percent: uploadsMax
                  ? Math.round((uploads / uploadsMax) * 100)
                  : 0,
              },
              {
                label: "عدد الكلمات اليوم (AI Tokens)",
                value: `${tokens}/${messagesMax}`,
                percent: messagesMax
                  ? Math.round((tokens / messagesMax) * 100)
                  : 0,
              },
              {
                label: "عدد المحاولات الأسبوعية",
                value: `${tries}/${triesMax}`,
                percent: triesMax ? Math.round((tries / triesMax) * 100) : 0,
              },
            ];
            return rows.map((row, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between text-white text-sm">
                  <span>{row.value}</span>
                  <span>{row.label}</span>
                </div>
                <div className="h-1.5 bg-card rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${Math.min(100, row.percent)}%` }}
                  />
                </div>
              </div>
            ));
          })()}
        </div>
        <div className="grid">
          <Button className="rounded-lg h-12 bg-primary text-primary-foreground cursor-pointer">
            ترقية خطتك
          </Button>
        </div>
      </Card>
    </div>
  );
}
