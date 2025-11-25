"use client";
import { Flame } from "lucide-react";
import Image from "next/image";
import cute_octopus from "@/assets/cute-octopus.svg";

export default function StreakCard() {
  return (
    <div className="bg-primary rounded-xl p-4">
      <div className="flex items-center gap-3">
        <Flame className="size-10" />
        <div className="flex-1">
          <p className="text-white text-lg font-semibold">1 يوم</p>
          <p className="text-white/90 text-sm">ستريك التعلم, حافظ على الاستريك الخاص بك</p>
          <p className="text-white/80 text-xs">أطول مدة ستريك: 12 يوم</p>
        </div>
        <Image src={cute_octopus} className="size-25" alt="octopus" />
      </div>
      <div className="mt-5 flex items-center justify-between">
        {["الأحد","الأثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"].map((d) => (
          <div key={d} className="flex flex-col items-center gap-2">
            <span className="size-6 rounded-full bg-white/90" />
            <span className="text-white/90 text-xs">{d}</span>
          </div>
        ))}
      </div>
    </div>
  );
}