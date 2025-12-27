"use client";
import * as React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Lock, UserX, Trash2 } from "lucide-react";

export default function PrivacyDetails({ open, onOpenChange }) {
  const privacyPoints = [
    {
      icon: Shield,
      title: "تخزين آمن",
      text: "جميع معلومات حسابك ومحتواك الدراسي تُخزن بشكل آمن.",
    },
    {
      icon: Lock,
      title: "حماية البيانات",
      text: "لا نشارك أي بيانات أو ملفات مع جهات خارجية دون إذنك الصريح.",
    },
    {
      icon: UserX,
      title: "أمان متقدم",
      text: "بياناتك الشخصية مثل الاسم، البريد الإلكتروني، وملفاتك تظل محمية باستخدام بروتوكولات أمان متقدمة.",
    },
    {
      icon: Trash2,
      title: "التحكم الكامل",
      text: "يمكنك تعديل أو حذف حسابك في أي وقت، مع ضمان إزالة جميع البيانات الخاصة بك من منصتنا.",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full bg-background p-0 lg:max-w-[800px]">
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto" dir="rtl">
          <div className="flex items-center justify-between">
            <Button
              onClick={() => onOpenChange(false)}
              variant="outline"
              className="rounded-xl bg-card cursor-pointer"
            >
              <ArrowRight className="size-5 mr-1" />
              العودة
            </Button>
            <div className="text-right space-y-2">
              <p className="text-3xl font-bold text-white">خصوصية الحساب</p>
              <p className="text-sm text-muted-foreground">
                تعرف على سياسات خصوصية الحساب
              </p>
            </div>
          </div>

          <Card className="rounded-2xl bg-card/60 border p-6 space-y-4">
            <p className="text-white/90 text-base leading-7">
              نحن في هاش فلو نولي أهمية كبيرة لحماية خصوصيتك وبياناتك الشخصية.
            </p>

            <div className="space-y-4">
              {privacyPoints.map((point, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 p-4 rounded-xl bg-background/50"
                >
                  <div className="size-10 grid place-items-center rounded-lg bg-primary/20 shrink-0">
                    <point.icon className="size-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-white font-semibold">{point.title}</p>
                    <p className="text-white/70 text-sm leading-6">
                      {point.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}

