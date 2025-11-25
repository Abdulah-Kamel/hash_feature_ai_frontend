"use client";
import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function UsageTabPage() {
  return (
    <div className="space-y-6" dir="rtl">
      <Card className="rounded-xl p-4 bg-background">
        <div className="flex items-center justify-between">
          <p className="text-2xl font-semibold text-white">الاستهلاك</p>
          <p className="text-sm text-primary">الاستهلاك لخطة مجانية</p>
        </div>
      </Card>
      <Card className="rounded-xl p-6 bg-[#212121] border border-[#515355] space-y-6">
        <div className="space-y-1">
          <p className="text-xl font-semibold text-white">نظرة عامة على الاستخدام</p>
          <p className="text-sm text-muted-foreground">تتبع استخدامك وحدودك</p>
        </div>
        <div className="space-y-4">
          {[
            { label: "عدد الملفات المرفوعة", value: "1/3" },
            { label: "عدد الرسائل", value: "1/150" },
            { label: "عدد إنشاء نوع التعلم (فلاش كارد، اختبار، مرحلة)", value: "1/150" },
            { label: "عدد مساحات العمل", value: "1/150" },
          ].map((row, i) => (
            <div key={i} className="space-y-2">
              <div className="flex items-center justify-between text-white text-sm">
                <span>{row.value}</span>
                <span>{row.label}</span>
              </div>
              <div className="h-1.5 bg-card rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: "35%" }} />
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-3">
          {[
            { label: "عدد إنشاء نوع التعلم (فلاش كارد، اختبار، مرحلة)", value: "3 / يوم" },
            { label: "حجم الملف", value: "35 MB" },
            { label: "عدد الملفات المرفوعة في كل مساحة", value: "3 ملفات / أسبوع" },
            { label: "عدد مساحات العمل", value: "2" },
            { label: "عدد الرسائل اليومية", value: "150 رسالة/يوم" },
          ].map((it, i) => (
            <Card key={i} className="rounded-lg bg-[#303030] border border-[#454545] p-4 flex flex-row items-center justify-between">
              <p className="text-white">{it.label}</p>
              <p className="text-white text-lg font-semibold">{it.value}</p>
            </Card>
          ))}
        </div>
        <div className="grid">
          <Button className="rounded-xl h-12 bg-primary text-primary-foreground">ترقية خطتك</Button>
        </div>
      </Card>
    </div>
  );
}