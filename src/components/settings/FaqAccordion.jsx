"use client";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

export default function FaqAccordion({ items }) {
  const data = items?.length ? items : Array.from({ length: 5 }).map(() => ({
    q: "هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة",
    a: "هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا النص من مولد النص العربي، حيث يمكنك أن تولد مثل هذا النص أو العديد من النصوص الأخرى إضافة إلى زيادة عدد الحروف التي يولدها التطبيق.",
  }));
  return (
    <Card className="rounded-xl p-4 bg-background border-none">
      <p className="text-2xl font-semibold text-white text-center mb-6">الأسئلة الشائعة</p>
      <Accordion type="single" collapsible className="space-y-2 cursor-pointer">
        {data.map((it, i) => (
          <AccordionItem key={i} value={`item-${i}`} className="rounded-xl border bg-card px-4">
            <AccordionTrigger className="text-white py-4 cursor-pointer">{it.q}</AccordionTrigger>
            <AccordionContent className="text-white/90 py-4">{it.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Card>
  );
}