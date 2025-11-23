"use client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, ArrowLeft, Lightbulb, X, Check } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import StageFlashcardsResult from "@/components/chat/StageFlashcardsResult";

export default function StageFlashcards({ title = "الدرس الأول", total = 18, index = 1, onBack, items }) {
  const cards = useMemo(() => {
    const sample = [
      { q: "ما هو الذكاء الأصطناعي؟", a: "هو مجال يُعنى بصناعة أنظمة قادرة على أداء مهام تتطلب ذكاءً بشريًا." },
      { q: "اذكر تطبيقين للذكاء الاصطناعي؟", a: "مساعدات ذكية ومعالجة الصور، وأنظمة توصية." },
      { q: "ما الفرق بين التعلم المُراقَب وغير المُراقَب؟", a: "المراقَب يعتمد على بيانات معنونة، وغير المُراقَب يستكشف الأنماط ذاتيًا." },
      { q: "ما هو نموذج الشبكات العصبية؟", a: "بنية حسابية تستلهم عمل الدماغ لمعالجة البيانات والتعلم." },
      { q: "ما هي بيانات التدريب؟", a: "مجموعة أمثلة تُستخدم لتعليم النموذج قبل الاختبار." },
    ];
    const base = Array.isArray(items) && items.length ? items : sample;
    return Array.from({ length: total }, (_, i) => ({ ...base[i % base.length], id: i + 1 }));
  }, [items, total]);
  const [current, setCurrent] = useState(index);
  const [flipped, setFlipped] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [startAt] = useState(Date.now());
  const progress = Math.round((Math.min(current, cards.length) / cards.length) * 100);

  const goPrev = () => {
    setFlipped(false);
    setCurrent((c) => Math.max(1, c - 1));
  };
  const goNext = () => {
    setFlipped(false);
    setCurrent((c) => c + 1);
  };
  const markCorrect = () => {
    setCorrectCount((v) => v + 1);
    goNext();
  };
  const markWrong = () => {
    setWrongCount((v) => v + 1);
    goNext();
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") goNext();
      else if (e.key === "ArrowRight") goPrev();
      else if (e.key === " ") setFlipped((f) => !f);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (current > cards.length) {
    const durationMs = Date.now() - startAt;
    return (
      <StageFlashcardsResult
        title={title}
        total={cards.length}
        correct={correctCount}
        wrong={wrongCount}
        durationMs={durationMs}
        onBack={onBack}
        onRestart={() => {
          setCorrectCount(0);
          setWrongCount(0);
          setFlipped(false);
          setCurrent(1);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-xl font-semibold text-white">{title}</p>
        <Button onClick={onBack} variant="outline" className="rounded-full h-10 px-4 bg-card">
          العودة
          <ArrowRight className="size-5 ml-2" />
        </Button>
      </div>

      <div className="space-y-2">
        <div className="flex justify-end">
          <span className="border rounded-full bg-primary px-3 py-1 text-white text-sm">{current} / {cards.length}</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <div className="relative h-[454px]">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="absolute left-1/2 -translate-x-1/2 rounded-2xl bg-card shadow-sm pointer-events-none"
            style={{ top: 30 + i * 20, width: "92%", height: 420 - i * 10, opacity: 0.9 - i * 0.25 }}
          />
        ))}
        <Card
          onClick={() => setFlipped((f) => !f)}
          className="absolute py-0 border-0 shadow-none inset-0 rounded-2xl bg-gradient-to-b from-primary/80 to-primary text-white flex items-center justify-center cursor-pointer"
        >
          {!flipped ? (
            <div className="text-center space-y-4">
              <p className="text-2xl">{cards[current - 1].q}</p>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <p className="text-2xl">{cards[current - 1].a}</p>
            </div>
          )}
          <div className="mx-auto mt-4 w-fit border border-white rounded-full px-4 py-1">اضغط لقلب الكارت</div>

          <Lightbulb className="absolute left-6 bottom-6 size-5" />
        </Card>
      </div>
      <div className="flex items-center justify-center mt-10 gap-4">
        <Button onClick={markWrong} variant="outline" className="rounded-xl py-6 cursor-pointer px-6 border-red-500 text-red-500">
          <X className="size-5 mr-2" />
          أجبتها خطا
        </Button>
        <Button onClick={markCorrect} variant="outline" className="rounded-xl py-6 cursor-pointer px-6 border-emerald-600 text-emerald-600">
          <Check className="size-5 mr-2" />
          أجبتها صح
        </Button>
      </div>
      <div className="flex items-center justify-between mt-1">
        <Button onClick={goNext} variant="outline" className="rounded-xl py-6 cursor-pointer px-6 border-primary text-primary">
          <ArrowRight className="size-5 mr-2" />
          التالي
        </Button>
        <Button onClick={goPrev} variant="outline" className="rounded-xl py-6 cursor-pointer px-6">
          السابق
          <ArrowRight className="size-5 mr-2" />
        </Button>
      </div>
    </div>
  );
}