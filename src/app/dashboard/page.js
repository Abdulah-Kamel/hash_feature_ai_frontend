"use client";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { FileText, Flame, MoreHorizontal, MoreVertical } from "lucide-react";
import { Calendar } from "@/components/ui/calendar"
import UploadDialogTrigger from "@/components/upload/UploadDialog";
import WorkspaceDialogTrigger from "@/components/workspace/WorkspaceDialog";
import React from "react";
import cute_octopus from "@/assets/cute-octopus.svg"
import Image from "next/image";
const page = () => {
  const today = React.useMemo(() => new Date(), []);
  const [date, setDate] = React.useState(today);
  const [month, setMonth] = React.useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  return (
    <section className="p-2 xl:p-10 max-sm:conatiner">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <div className="bg-gradient-to-l from-primary to-secondary rounded-xl p-6 md:p-8 flex xl:flex-row flex-col justify-between items-center gap-6">
            <div className="flex-1">
              <h2 className="font-semibold text-2xl xl:text-3xl text-white">أهلا بك يا محمود!</h2>
              <div className="flex items-center gap-3 mt-4">
                <Avatar className="size-12 bg-white">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback className="bg-white text-primary text-lg">م</AvatarFallback>
                </Avatar>
                <p className="text-base font-medium text-white/90">محمود عبدالرحمن</p>
              </div>
            </div>
            <div className="flex 2xl:flex-row flex-col items-center gap-4">
              <UploadDialogTrigger>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent hover:bg-transparent shadow-lg px-6 py-8 xl:px-8 text-white cursor-pointer hover:shadow-2xl border-white/30"
                >
                  <FileText className="size-6" />
                  <div className="text-start">
                    <span className="text-base font-semibold">ملف جديد</span>
                    <p className="text-sm">إنشاء ملف جديد من خلال ملف PDF</p>
                  </div>
                </Button>
              </UploadDialogTrigger>
              <WorkspaceDialogTrigger>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent hover:bg-transparent shadow-lg px-6 py-8 xl:px-8 text-white cursor-pointer hover:shadow-2xl border-white/30"
                >
                  <FileText className="size-6" />
                  <div className="text-start">
                    <span className="text-base font-semibold">مجلد جديد</span>
                    <p className="text-sm">إنشاء مجلد جديد يحتوي على ملفات</p>
                  </div>
                </Button>
              </WorkspaceDialogTrigger>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg xl:text-xl font-semibold">مساحة العمل</h3>
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-card rounded-xl p-4 xl:p-5">
                  <div className="flex items-center gap-3">
                    <div className="grid grid-cols-3 gap-4 w-full">
                      <div className="flex flex-col items-start">
                        <span className="text-sm text-foreground/70">اسم المجلد</span>
                        <span className="text-sm font-medium">الذكاء الاصطناعي</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-foreground/70">عدد الملفات</span>
                        <span className="text-sm">2</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-foreground/70">تاريخ الإنشاء</span>
                        <span className="text-sm">02/025/2025</span>
                      </div>
                    </div>
                    <button className="rounded-xl p-2 text-foreground/80 cursor-pointer hover:bg-foreground/10">
                      <MoreHorizontal className="size-4" /> 
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="xl:col-span-1">
          <div className="rounded-xl space-y-5">
            <div className="bg-primary rounded-xl p-4">
              <div className="flex items-center gap-3">
               <Flame className="size-10" />
                <div className="flex-1">
                  <p className="text-white text-lg font-semibold">1 يوم</p>
                  <p className="text-white/90 text-sm">ستريك التعلم, حافظ على الاستريك الخاص بك</p>
                  <p className="text-white/80 text-xs">أطول مدة ستريك: 12 يوم</p>
                </div>
                <Image src={cute_octopus} className="size-25" />
              </div>
              <div className="mt-5 flex items-center justify-between">
                {[
                  "الأحد",
                  "الأثنين",
                  "الثلاثاء",
                  "الأربعاء",
                  "الخميس",
                  "الجمعة",
                  "السبت",
                ].map((d) => (
                  <div key={d} className="flex flex-col items-center gap-2">
                    <span className="size-6 rounded-full bg-white/90" />
                    <span className="text-white/90 text-xs">{d}</span>
                  </div>
                ))}
              </div>
            </div>

              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-lg border [--cell-size:--spacing(1)] p-6 md:[--cell-size:--spacing(6)] max-lg:max-h-[300px] w-full overflow-auto bg-card"
                buttonVariant="ghost"
              />
          </div>
        </div>
      </div>
    </section>
  );
};

export default page;
