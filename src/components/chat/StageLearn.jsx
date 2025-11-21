"use client";
import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function StageLearn({ title = "القسم الأول - المرحلة الأولى: الذكاء الاصطناعي", onBack }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-semibold text-white flex-1">{title}</h1>
        <Button onClick={onBack} variant="outline" className="rounded-full p-4 bg-card cursor-pointer">
          العودة
          <ArrowRight className="size-5 ml-2" />
        </Button>
      </div>
      <div className="h-px bg-[#515355]" />

      <div>
        <h2 className="text-2xl font-semibold text-white text-right">ما هو الذكاء الأصطناعي؟</h2>
      </div>

      <div className="space-y-10">
        <section className="space-y-4 text-right">
          <h3 className="text-xl font-semibold text-white">مقدمة</h3>
          <div className="space-y-4">
            <p className="text-white/90 leading-7">
              هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا النص من مولد النص العربي، حيث يمكنك أن تولد مثل هذا النص أو العديد من النصوص الأخرى إضافة إلى زيادة عدد الحروف التي يولدها التطبيق. إذا كنت تحتاج إلى عدد أكبر من الفقرات يتيح لك مولد النص العربي زيادة عدد الفقرات كما تريد، النص لن يبدو مقسماً ولا يحوي أخطاءً لغوية، مولد النص العربي مفيد لمصممي المواقع على وجه الخصوص، حيث يحتاج العميل في كثير من الأحيان أن يطلع على صورة حقيقية لتصميم الموقع..
            </p>
            <p className="text-white/90 leading-7">
              هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا النص من مولد النص العربي، حيث يمكنك أن تولد مثل هذا النص أو العديد من النصوص الأخرى إضافة إلى زيادة عدد الحروف التي يولدها التطبيق. إذا كنت تحتاج إلى عدد أكبر من الفقرات يتيح لك مولد النص العربي زيادة عدد الفقرات كما تريد، النص لن يبدو مقسماً ولا يحوي أخطاءً لغوية، مولد النص العربي مفيد لمصممي المواقع على وجه الخصوص، حيث يحتاج العميل في كثير من الأحيان أن يطلع على صورة حقيقية لتصميم الموقع..
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}