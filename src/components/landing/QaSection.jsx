import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
const QaSection = () => {
  return (
    <div id="qa" className="w-full mt-24 scroll-mt-24">
      <div className="flex flex-col items-center justify-center gap-6 mb-12">
        <h3 className="text-4xl md:text-5xl font-bold text-white text-center">
          الأسئلة الشائعة
        </h3>
        <Accordion
          type="single"
          collapsible
          className="w-full max-w-6xl mx-auto"
          defaultValue="item-1"
          dir="rtl"
        >
          <AccordionItem
            value="item-1"
            className="bg-card border border-border/50 rounded-xl mb-4 px-6"
          >
            <AccordionTrigger className="text-white hover:no-underline text-right flex-row-reverse">
              <span className="text-lg font-semibold">ما هو هاش فلو؟ </span>
            </AccordionTrigger>
            <AccordionContent className="text-white/80 text-right leading-relaxed">
              هاش فلو منصة تعليمية مدعومة بالذكاء الاصطناعي، تساعدك تحوّل أي
              مادة دراسية إلى تجربة تعلم تفاعلية تشمل مراحل تعلم، اختبارات،
              بطاقات تعليمية، وخريطة ذهنية في مكان واحد.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            value="item-2"
            className="bg-card border border-border/50 rounded-xl mb-4 px-6"
          >
            <AccordionTrigger className="text-white hover:no-underline text-right flex-row-reverse">
              <span className="text-lg font-semibold">
                كيف أبدأ باستخدام هاش فلو؟
              </span>
            </AccordionTrigger>
            <AccordionContent className="text-white/80 text-right leading-relaxed">
              التسجيل بسيط وسريع. أنشئ حسابك، ارفع أول ملف، وابدأ التعلّم مباشرة
              بدون خطوات معقدة.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            value="item-3"
            className="bg-card border border-border/50 rounded-xl mb-4 px-6"
          >
            <AccordionTrigger className="text-white hover:no-underline text-right flex-row-reverse">
              <span className="text-lg font-semibold">
                هل الاختبارات تنشأ تلقائيا؟
              </span>
            </AccordionTrigger>
            <AccordionContent className="text-white/80 text-right leading-relaxed">
              نعم، يتم إنشاء الاختبارات تلقائيًا من نفس المحتوى اللي تذاكره،
              بحيث تكون الأسئلة مناسبة للمادة ولمستواك وتساعدك تقيس فهمك
              الحقيقي.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            value="item-4"
            className="bg-card border border-border/50 rounded-xl mb-4 px-6"
          >
            <AccordionTrigger className="text-white hover:no-underline text-right flex-row-reverse">
              <span className="text-lg font-semibold">
                هل هاش فلو مناسب للمراجعة قبل الاختبارات؟
              </span>
            </AccordionTrigger>
            <AccordionContent className="text-white/80 text-right leading-relaxed">
              نعم، هاش فلو مثالي للمراجعة السريعة قبل الاختبارات من خلال
              الملخصات، البطاقات التعليمية، والاختبارات القصيرة.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            value="item-5"
            className="bg-card border border-border/50 rounded-xl mb-4 px-6"
          >
            <AccordionTrigger className="text-white hover:no-underline text-right flex-row-reverse">
              <span className="text-lg font-semibold">
                هل يتطور المحتوى مع تقدمي في التعلم؟
              </span>
            </AccordionTrigger>
            <AccordionContent className="text-white/80 text-right leading-relaxed">
              نعم، كل ما استخدمت المنصة أكثر، تقدر تطوّر المحتوى، تعيد إنشاء
              الاختبارات، وتعمّق الشرح حسب مستواك الحالي.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default QaSection;
