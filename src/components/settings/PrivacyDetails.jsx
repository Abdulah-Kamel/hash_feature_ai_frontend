"use client";
import * as React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function PrivacyDetails({ open, onOpenChange }) {
  const Article = ({ title, body }) => (
    <div className="space-y-2">
      <p className="text-white text-xl font-semibold">{title}</p>
      <p className="text-white/90 text-sm leading-7">{body}</p>
    </div>
  );

  const bodyText =
    "هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا النص من مولد النص العربي، حيث يمكنك أن تولد مثل هذا النص أو العديد من النصوص الأخرى إضافة إلى زيادة عدد الحروف التي يولدها التطبيق. إذا كنت تحتاج إلى عدد أكبر من الفقرات يتيح لك مولد النص العربي زيادة عدد الفقرات كما تريد، النص لن يبدو مقسماً ولا يحوي أخطاءً لغوية، مولد النص العربي مفيد لمصممي المواقع على وجه الخصوص، حيث يحتاج العميل في كثير من الأحيان أن يطلع على صورة حقيقية لتصميم الموقع.";

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

          <Card className="rounded-2xl bg-card/60 border p-6 space-y-6">
            {Array.from({ length: 2 }).map((_, i) => (
              <Article
                key={i}
                title="هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة"
                body={bodyText}
              />
            ))}
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
