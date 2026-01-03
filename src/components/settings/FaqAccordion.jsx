"use client";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

const faqData = [
  {
    q: "ما هو هاش فلو؟",
    a: "هاش فلو منصة تعليمية مدعومة بالذكاء الاصطناعي، تساعدك تحوّل أي مادة دراسية إلى تجربة تعلم تفاعلية تشمل مراحل تعلم، اختبارات، بطاقات تعليمية، وخريطة ذهنية في مكان واحد.",
  },
  {
    q: "كيف أبدأ باستخدام هاش فلو؟",
    a: "التسجيل بسيط وسريع. أنشئ حسابك، ارفع أول ملف، وابدأ التعلّم مباشرة بدون خطوات معقدة.",
  },
  {
    q: "هل الاختبارات تنشأ تلقائيا؟",
    a: "نعم، يتم إنشاء الاختبارات تلقائيًا من نفس المحتوى اللي تذاكره، بحيث تكون الأسئلة مناسبة للمادة ولمستواك وتساعدك تقيس فهمك الحقيقي.",
  },
  {
    q: "هل هاش فلو مناسب للمراجعة قبل الاختبارات؟",
    a: "نعم، هاش فلو مثالي للمراجعة السريعة قبل الاختبارات من خلال الملخصات، البطاقات التعليمية، والاختبارات القصيرة.",
  },
  {
    q: "هل يتطور المحتوى مع تقدمي في التعلم؟",
    a: "نعم، كل ما استخدمت المنصة أكثر، تقدر تطوّر المحتوى، تعيد إنشاء الاختبارات، وتعمّق الشرح حسب مستواك الحالي.",
  },
];

export default function FaqAccordion({ items }) {
  const data = items?.length ? items : faqData;

  return (
    <Card className="rounded-xl p-4 bg-background border-none">
      <p className="text-2xl font-semibold text-white text-center mb-6">
        الأسئلة الشائعة
      </p>
      <Accordion
        type="single"
        collapsible
        className="space-y-2"
        defaultValue="item-0"
        dir="rtl"
      >
        {data.map((it, i) => (
          <AccordionItem
            key={i}
            value={`item-${i}`}
            className="bg-card border border-border/50 rounded-xl px-6"
          >
            <AccordionTrigger className="text-white hover:no-underline text-right flex-row-reverse cursor-pointer">
              <span className="text-lg font-semibold">{it.q}</span>
            </AccordionTrigger>
            <AccordionContent className="text-white/80 text-right leading-relaxed">
              {it.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Card>
  );
}