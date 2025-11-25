"use client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function PrivacyCard({ onOpen }) {
  return (
    <Card className="flex flex-row items-center justify-between border border-[#515355] rounded-[15px] bg-[#212121] px-6 py-5">
      <p className="text-white text-base">خصوصية الحساب</p>
      <Button
        variant="outline"
        className="inline-flex items-center gap-2 border border-[#515355] rounded-[15px] bg-[#303030] h-12 px-3 cursor-pointer"
        onClick={onOpen}
      >
        <ArrowLeft className="size-5" />
      </Button>
    </Card>
  );
}