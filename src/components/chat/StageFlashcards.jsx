"use client";
import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Lightbulb } from "lucide-react";

export default function StageFlashcards({ title = "الدرس الأول", total = 18, index = 1, onBack }) {
  const [flipped, setFlipped] = React.useState(false);
  const progress = Math.round((index / total) * 100);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button onClick={onBack} variant="outline" className="rounded-full h-10 px-4 bg-card">
          العودة
          <ArrowRight className="size-5 ml-2" />
        </Button>
        <p className="text-xl font-semibold text-white">{title}</p>
      </div>
      <div className="space-y-2">
        <Progress value={progress} className="h-2" />
        <div className="flex justify-end">
          <span className="border border-white rounded-full bg-primary px-3 py-1 text-white text-sm">{index} / {total}</span>
        </div>
      </div>

      <div className="relative h-[454px]">
        <Card
          onClick={() => setFlipped((f) => !f)}
          className="absolute py-0 inset-0 rounded-2xl bg-gradient-to-b from-primary/80 to-primary text-white flex items-center justify-center cursor-pointer"
        >
          {!flipped ? (
            <div className="text-center space-y-4">
              <p className="text-2xl">ما هو الذكاء الأصطناعي؟</p>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <p className="text-2xl">هو مجال يُعنى بصناعة أنظمة قادرة على أداء مهام تتطلب ذكاءً بشريًا.</p>
            </div>
          )}
              <div className="mx-auto w-fit border border-white rounded-full px-4 py-1">اضغط لقلب الكارت</div>

          <Lightbulb className="absolute left-6 bottom-6 size-5" />
        </Card>
      </div>
    </div>
  );
}