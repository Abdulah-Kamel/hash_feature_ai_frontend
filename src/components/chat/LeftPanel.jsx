"use client";
import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import FlashcardsSwitcher from "./FlashcardsSwitcher"
import StageSwitcher from "./ٍStageSwitvher";

export default function LeftPanel() {
  const tabs = [
    { label: "الاختبارات", value: "tests" },
    { label: "كروت الفلاش", value: "flashcards" },
    { label: "المراحل", value: "stages" },
  ];

  return (
    <Card className="bg-background rounded-lg p-4 h-full border-none">
      <Tabs defaultValue="stages" className="h-full">
        <TabsList className="bg-card p-2 rounded-lg w-full grid grid-cols-3 gap-2">
          {tabs.map((t) => (
            <TabsTrigger
              key={t.value}
              value={t.value}
              className="rounded-lg px-6 py-3 text-sm flex-1 bg-background data-[state=active]:bg-primary data-[state=active]:text-primary-foreground cursor-pointer"
            >
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="stages" className="mt-4 space-y-4">
          <Button className="w-full h-14 rounded-lg bg-primary/20 text-primary-foreground justify-center gap-2 cursor-pointer">
            <PlusCircle className="size-6" />
            إنشاء مراحل
          </Button>
          <StageSwitcher />
        </TabsContent>
        <TabsContent value="flashcards" className="mt-4">
          <Button className="w-full h-14 rounded-lg bg-primary/20 text-primary-foreground justify-center gap-2 cursor-pointer">
            <PlusCircle className="size-6" />
            إنشاء كروت الفلاش
          </Button>
          <FlashcardsSwitcher />
        </TabsContent>
        <TabsContent value="tests" className="mt-4">
          <Button className="w-full h-14 rounded-lg bg-primary/20 text-primary-foreground justify-center gap-2 cursor-pointer">
            <PlusCircle className="size-6" />
            إنشاء اختبارات
          </Button>
        </TabsContent>
      </Tabs>
    </Card>
  );
}


