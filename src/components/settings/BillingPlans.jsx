"use client";
import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, SaudiRiyal } from "lucide-react";

function Feature({ children }) {
  return (
    <div className="flex items-center gap-2">
      <span className="size-3 rounded-full bg-green-500" />
      <p className="text-sm text-white/90">{children}</p>
    </div>
  );
}

export default function BillingPlans() {
  const [period, setPeriod] = React.useState("month");
  const price = period === "month" ? 59 : period === "quarter" ? 149 : 499;
  const options = [
    { v: "year", label: "سنة" },
    { v: "quarter", label: "3 شهور" },
    { v: "month", label: "شهر" },
  ];
  return (
    <div className="space-y-6 max-w-[770px] mx-auto py-4">
      <div className="mx-auto border border-[#383839] rounded-[15px] bg-[#30303080] p-1 grid grid-cols-3 text-white">
        {options.map((opt) => (
          <Button
            key={opt.v}
            variant={period === opt.v ? "default" : "ghost"}
            className="rounded-[15px] h-[32px]"
            onClick={() => setPeriod(opt.v)}
          >
            {opt.label}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <Card className="rounded-[20px] p-4 border border-[#515355] bg-[#303030] text-white gap-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xl font-semibold">الخطة المجانية</p>
            </div>
          </div>
          <p className="text-sm text-white/80 mt-2">
            طريقة رائعة لتجربة قوة الدراسة المعززة بالذكاء الاصطناعي.
          </p>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">مجاناً</p>
          </div>
          <div className="mt-4 space-y-3">
            <Feature>الوصول المحدود إلى الرسائل</Feature>
            <Feature>
              الوصول إلى الملاحظات واختبارات التدريب ووضع التعلم
            </Feature>
            <Feature>الحد الأقصى لحجم الملف: 50 ميجابايت</Feature>
            <Feature>حتى 50 صفحة/PDF</Feature>
          </div>
          <Button
            variant="outline"
            className="mt-auto w-full rounded-lg cursor-pointer py-5"
          >
            ابدأ الآن
          </Button>
        </Card>
        <Card className="rounded-[20px] p-4 border border-primary bg-[#303030] text-white gap-3">
          <div className="flex items-center justify-between">
            <p className="mt-3 text-xl font-semibold">المحترف</p>
            <div className="inline-flex items-center gap-2 bg-primary text-white rounded-lg px-3 py-2 text-xs">
              الأكثر شهرة
              <Sparkles className="size-4" />
            </div>
          </div>
          <p className="text-sm text-white/80 mt-2">
            طريقة رائعة لتجربة قوة الدراسة المعززة بالذكاء الاصطناعي.
          </p>
          <div className="text-right flex items-center gap-1">
            <p className="text-3xl font-bold">{price}</p>
            <SaudiRiyal className="size-8" />
          </div>
          <div className="mt-4 space-y-3">
            <Feature>الوصول المحدود إلى الرسائل</Feature>
            <Feature>
              الوصول إلى الملاحظات واختبارات التدريب ووضع التعلم
            </Feature>
            <Feature>الحد الأقصى لحجم الملف: 50 ميجابايت</Feature>
            <Feature>حتى 50 صفحة/PDF</Feature>
          </div>
          <Button className="mt-auto w-full rounded-lg cursor-pointer py-5">
            اشترك الآن
          </Button>
        </Card>
      </div>
    </div>
  );
}
