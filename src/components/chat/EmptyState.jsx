"use client";
import * as React from "react";
import { CopyX } from "lucide-react";
import { Card } from "../ui/card";

export default function EmptyState({ title = "لا يوجد محتوى", message = "" }) {
  return (
    <Card className="flex flex-col items-center justify-center py-12 text-center space-y-1 gap-0 bg-primary/20">
      <div className="bg-primary/30 p-4 rounded-full animate-bounce">
        <CopyX className="size-8 text-primary" />
      </div>
      <p className="text-white font-medium text-xl">{title}</p>
      <p className="text-gray-300 font-medium text-lg mt-1">{message}</p>
    </Card>
  );
}
