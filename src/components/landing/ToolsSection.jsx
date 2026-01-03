import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import Image from "next/image";
import { GitMerge, PencilLine } from "lucide-react";
import chat from "@/assets/landing_page/chat.png";
import stages from "@/assets/landing_page/stages.png";
import quiz from "@/assets/landing_page/quiz.png";
const ToolsSection = () => {
  return (
    <>
      <div id="tools" className="w-full mt-16 scroll-mt-24">
        <div className="flex flex-col items-center justify-center gap-4 mb-12">
          <h3 className="text-4xl font-medium text-white">الأدوات</h3>
          <p className="text-lg text-white/80">
            الادوات التي تساعدك على التعلم بسرعة
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 w-full max-w-7xl mx-auto">
          <Card>
            <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-[#363843] col-span-2 h-[300px] py-6 relative overflow-hidden rounded-2xl">
                <Image
                  src={chat}
                  alt="Tool 1"
                  width={500}
                  className="absolute top-2 -left-15 h-[280px]"
                />
              </div>
              <CardHeader className="col-span-2">
                <div className="flex flex-col gap-4 justify-center h-full">
                  <div className="flex items-center gap-2">
                    <div className="bg-background p-3 rounded-2xl w-fit">
                      <svg
                        width="40"
                        height="40"
                        viewBox="0 0 40 40"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6.66683 27.4998C6.66683 30.2613 8.90541 32.4998 11.6668 32.4998C11.6668 34.801 13.5323 36.6665 15.8335 36.6665C18.1347 36.6665 20.0002 34.801 20.0002 32.4998C20.0002 34.801 21.8656 36.6663 24.1668 36.6663C26.468 36.6663 28.3335 34.8009 28.3335 32.4997C31.0949 32.4997 33.3335 30.2611 33.3335 27.4997C33.3335 26.5519 33.0698 25.6657 32.6118 24.9105C34.9214 24.4688 36.6668 22.438 36.6668 19.9997C36.6668 17.5613 34.9214 15.5306 32.6118 15.0888C33.0698 14.3336 33.3335 13.4474 33.3335 12.4997C33.3335 9.73825 31.0949 7.49967 28.3335 7.49967C28.3335 5.19849 26.468 3.33301 24.1668 3.33301C21.8656 3.33301 20.0002 5.19864 20.0002 7.49983C20.0002 5.19865 18.1347 3.33317 15.8335 3.33317C13.5323 3.33317 11.6668 5.19865 11.6668 7.49983C8.90541 7.49983 6.66683 9.73841 6.66683 12.4998C6.66683 13.4476 6.93053 14.3338 7.38856 15.089C5.07894 15.5308 3.3335 17.5615 3.3335 19.9998C3.3335 22.4382 5.07894 24.4689 7.38856 24.9107C6.93053 25.6659 6.66683 26.5521 6.66683 27.4998Z"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12.5 24.1665L15.5698 14.9571C15.7272 14.485 16.169 14.1665 16.6667 14.1665C17.1643 14.1665 17.6061 14.485 17.7635 14.9571L20.8333 24.1665M25.8333 14.1665V24.1665M14.1667 20.8332H19.1667"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>

                    <CardTitle className="text-3xl text-white">
                      التحدث مع الذكاء الاصطناعي
                    </CardTitle>
                  </div>
                  <CardDescription className="text-base text-white/80">
                    تفاعل مع ذكاء اصطناعي يفهم محتواك الدراسي بأسلوب تعليمي
                    واضح. اسأله، ناقشه، واطلب منه التبسيط أو الشرح بالأمثلة،
                    وكأن عندك مدرس خاص متواجد معك في أي وقت.
                  </CardDescription>
                </div>
              </CardHeader>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <CardHeader className="col-span-2">
                <div className="flex flex-col gap-4 justify-center h-full">
                  <div className="flex items-center gap-2">
                    <div className="bg-background p-3 rounded-2xl w-fit">
                      <GitMerge className="w-10 h-10 text-white" />
                    </div>

                    <CardTitle className="text-3xl text-white">
                      إنشاء مراحل من خلال الملف
                    </CardTitle>
                  </div>
                  <CardDescription className="text-base text-white/80">
                    ارفع ملفاتك لذكاء الاصطناعي لتحويلها إلى مراحل تعليمية
                    منظمة. كل مرحلة مبنية بشكل تدريجي يساعدك على الفهم خطوة
                    بخطوة بدل التشتت بين الصفحات.
                  </CardDescription>
                </div>
              </CardHeader>
              <div className="bg-[#363843] col-span-2 h-[300px] py-6 relative overflow-hidden rounded-2xl">
                <Image
                  src={stages}
                  alt="Tool 2"
                  width={500}
                  className="absolute top-2 -right-2 h-[280px]"
                />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-2">
              <CardHeader className="col-span-2">
                <div className="flex flex-col gap-4 justify-center h-full">
                  <div className="flex items-center gap-2">
                    <div className="bg-background p-3 rounded-2xl w-fit">
                      <PencilLine className="w-10 h-10 text-white" />
                    </div>

                    <CardTitle className="text-3xl text-white">
                      إنشاء اختبارات مناسبة
                    </CardTitle>
                  </div>
                  <CardDescription className="text-base text-white/80">
                    أنشئ اختبارات ذكية مباشرة من محتواك الدراسي. الأسئلة تتكيف
                    مع مستواك وهدفك، وتساعدك على قياس فهمك الحقيقي والاستعداد
                    للاختبارات بثقة.
                  </CardDescription>
                </div>
              </CardHeader>
              <div className="bg-[#363843] col-span-2 h-[350px]  relative overflow-hidden rounded-2xl py-0">
                <Image
                  src={quiz}
                  alt="Tool 3"
                  width={500}
                  className="absolute top-1/2 -translate-y-1/2 -left-2 h-[320px]"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default ToolsSection;
