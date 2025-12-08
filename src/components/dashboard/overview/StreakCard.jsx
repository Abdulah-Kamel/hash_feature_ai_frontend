"use client";
import { Flame } from "lucide-react";
import Image from "next/image";
import cute_octopus from "@/assets/cute-octopus.svg";
import * as React from "react";
import { apiClient } from "@/lib/api-client";

export default function StreakCard() {
  const [currentStreak, setCurrentStreak] = React.useState(0);
  const [longestStreak, setLongestStreak] = React.useState(0);
  const [lastActive, setLastActive] = React.useState(null);
  const [userName, setUserName] = React.useState("");
  const [days, setDays] = React.useState([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);

  React.useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await apiClient("/api/profiles");
        const json = await res.json();
        if (!active) return;
        const d = json?.data || {};
        const cs = Math.max(0, d.currentStreak ?? 0);
        const ls = Math.max(0, d.longestStreak ?? 0);
        setUserName(d.name || "مستخدم");
        setCurrentStreak(cs);
        setLongestStreak(ls);
        setLastActive(d.lastActiveDate ? new Date(d.lastActiveDate) : null);
        const today = new Date();
        const todayIdx = today.getDay(); // 0 Sunday .. 6 Saturday
        const arr = Array(7).fill(false);
        for (let i = 0; i < Math.min(cs, 7); i++) {
          const idx = (todayIdx - i + 7) % 7;
          arr[idx] = true;
        }
        setDays(arr);
      } catch {}
    })();
    return () => {
      active = false;
    };
  }, []);

  const dayNames = [
    "الأحد",
    "الأثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
    "السبت",
  ];
  return (
    <div className="bg-primary rounded-xl py-4 px-6 sm:px-10 ">
      <div className="flex max-sm:flex-col items-center gap-3">
        <Flame className="size-10" />
        <div className="flex-1 space-y-1">
          <h2 className="font-semibold text-xl text-white">
            أهلا بك يا {userName || ""}!
          </h2>
          <p className="text-white/90 text-md">
            أطول مدة ستريك: {longestStreak} يوم
          </p>
          {lastActive && (
            <p className="text-white/90 text-md">
              آخر نشاط: {lastActive.toLocaleString("ar")}
            </p>
          )}
        </div>
        <Image src={cute_octopus} className="size-25" alt="octopus" />
      </div>
      <div className="mt-5 flex items-center justify-between gap-4">
        {dayNames.map((d, i) => (
          <div key={d} className="flex flex-col items-center gap-2">
            <span
              className={
                "size-4 md:size-6 rounded-full " +
                (days[i] ? "bg-white" : "bg-white/30")
              }
            />
            <span className="text-white/90 text-xs">{d}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
