"use client";
import { useMemo, useState } from "react";
import { Calendar } from "@/components/ui/calendar";

export default function OverviewCalendar() {
  const today = useMemo(() => new Date(), []);
  const [date, setDate] = useState(today);
  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-lg border [--cell-size:--spacing(1)] p-6 md:[--cell-size:--spacing(6)] max-lg:max-h-[300px] w-full overflow-auto bg-card"
      buttonVariant="ghost"
    />
  );
}