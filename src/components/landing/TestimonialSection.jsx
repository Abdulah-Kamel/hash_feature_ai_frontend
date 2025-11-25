import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "../ui/card";
import { GitMerge, PencilLine } from "lucide-react";
import { Link } from "lucide-react";
import { ArrowLeft } from "lucide-react";
const TestimonialSection = () => {
  return (
    <div className="w-full mt-24">
      <div className="flex flex-col items-center justify-center gap-6 mb-12">
        <h3 className="text-4xl md:text-5xl font-bold text-white text-center">
          كل ما تحتاجه للتعلم الفعال
        </h3>
        <p className="text-lg md:text-xl text-white/80 text-center max-w-3xl leading-relaxed">
          حوّل أي مادة دراسية إلى تجربة تعليمية تفاعلية. تساعدك أدواتنا المدعمة
          بالذكاء الاصطناعي على فهم محتواك وحفظه وإتقانه بفعالية أكبر من أي وقت
          مضى.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-7xl mx-auto">
        <Card
          className=" md:col-span-2 col-span-1 border-2 border-transparent hover:border-feature-green/50 transition-all duration-300"
          style={{ backgroundColor: "var(--feature-green)" }}
        >
          <CardHeader className="space-y-4">
            <div className="bg-[#278F5C] p-3 rounded-xl w-14 flex justify-center">
              <GitMerge className="w-6 h-6 text-white/90" />
            </div>
            <div className="flex justify-between items-start">
              <CardTitle className="text-2xl text-white">
                إنشاء مراحل من خلال الملف
              </CardTitle>
            </div>
            <CardDescription className="text-white/80">
              هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد
              هذا النص من مولد النص العربي، حيث يمكنك أن تولد مثل هذا النص أو
              العديد من النصوص الأخرى إضافة إلى زيادة عدد الحروف التي يولدها هذا
              النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا
              النص من مولد النص العربي، حيث يمكنك أن تولد مثل هذا النص أو العديد
              من النصوص الأخرى إضافة إلى زيادة عدد الحروف التي يولدها هذا النص
              هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا النص
              من مولد النص العربي، حيث يمكنك أن تولد مثل هذا النص أو العديد من
              النصوص الأخرى
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Link
              href="#"
              className="flex items-center gap-2 text-white/90 hover:text-white transition-colors"
            >
              تعلم أكثر <ArrowLeft className="w-5 h-5" />
            </Link>
          </CardFooter>
        </Card>
        <Card className="bg-[#33E2BD]/40 md:col-span-1 col-span-1 border-2 border-transparent hover:border-feature-green/50 transition-all duration-300 flex-col justify-between">
          <CardHeader className="space-y-4">
            <div className="bg-[#33E2BD] flex justify-center p-3 rounded-xl w-14">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 16.4996C4 18.1565 5.34315 19.4996 7 19.4996C7 20.8803 8.11929 21.9996 9.5 21.9996C10.8807 21.9996 12 20.8803 12 19.4996C12 20.8803 13.1193 21.9995 14.5 21.9995C15.8807 21.9995 17 20.8802 17 19.4995C18.6569 19.4995 20 18.1564 20 16.4995C20 15.9309 19.8418 15.3991 19.567 14.946C20.9527 14.681 22 13.4625 22 11.9995C22 10.5365 20.9527 9.31807 19.567 9.05301C19.8418 8.59988 20 8.06817 20 7.49951C20 5.84266 18.6569 4.49951 17 4.49951C17 3.1188 15.8807 1.99951 14.5 1.99951C13.1193 1.99951 12 3.11889 12 4.49961C12 3.11889 10.8807 1.99961 9.5 1.99961C8.11929 1.99961 7 3.11889 7 4.49961C5.34315 4.49961 4 5.84275 4 7.49961C4 8.06827 4.15822 8.59997 4.43304 9.0531C3.04727 9.31816 2 10.5366 2 11.9996C2 13.4626 3.04727 14.6811 4.43304 14.9461C4.15822 15.3992 4 15.9309 4 16.4996Z"
                  stroke="black"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7.5 14.4995L9.34189 8.97385C9.43631 8.69058 9.7014 8.49951 10 8.49951C10.2986 8.49951 10.5637 8.69058 10.6581 8.97385L12.5 14.4995M15.5 8.49951V14.4995M8.5 12.4995H11.5"
                  stroke="black"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="flex justify-between items-start">
              <CardTitle className="text-2xl text-white">
                الذكاء الاصطناعي
              </CardTitle>
            </div>
            <CardDescription className="text-white/80">
              هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد
              هذا النص من مولد النص العربي، حيث يمكنك أن تولد مثل هذا النص أو
              العديد من النصوص الأخرى إضافة إلى زيادة عدد الحروف التي يولدها
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Link
              href="#"
              className="flex items-center gap-2 text-white/90 hover:text-white transition-colors"
            >
              تعلم أكثر <ArrowLeft className="w-5 h-5" />
            </Link>
          </CardFooter>
        </Card>
        <Card className="bg-[#6E83F5]/40 md:col-span-1 col-span-1 border-2 border-transparent hover:border-feature-green/50 transition-all duration-300 flex-col justify-between">
          <CardHeader className="space-y-4">
            <div className="bg-[#6E83F5] flex justify-center p-3 rounded-xl w-14">
              <PencilLine className="w-6 h-6 text-white/90" />
            </div>
            <div className="flex justify-between items-start">
              <CardTitle className="text-2xl text-white">
                إنشاء اختبارات مناسبة
              </CardTitle>
            </div>
            <CardDescription className="text-white/80">
              هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد
              هذا النص من مولد النص العربي، حيث يمكنك أن تولد مثل هذا النص أو
              العديد من النصوص الأخرى إضافة إلى زيادة عدد الحروف التي يولدها
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Link
              href="#"
              className="flex items-center gap-2 text-white/90 hover:text-white transition-colors"
            >
              تعلم أكثر <ArrowLeft className="w-5 h-5" />
            </Link>
          </CardFooter>
        </Card>
        <Card className="bg-[#BD6BEE]/40 md:col-span-2 col-span-1 border-2 border-transparent hover:border-feature-green/50 transition-all duration-300 flex-col justify-between">
          <CardHeader className="space-y-4">
            <div className="bg-[#BD6BEE] flex justify-center p-3 rounded-xl w-14">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18.85 12.75H16.15C13.49 12.75 12.25 11.51 12.25 8.85V5.15C12.25 2.49 13.49 1.25 16.15 1.25H18.85C21.51 1.25 22.75 2.49 22.75 5.15V8.85C22.75 11.51 21.51 12.75 18.85 12.75ZM16.15 2.75C14.31 2.75 13.75 3.31 13.75 5.15V8.85C13.75 10.69 14.31 11.25 16.15 11.25H18.85C20.69 11.25 21.25 10.69 21.25 8.85V5.15C21.25 3.31 20.69 2.75 18.85 2.75H16.15Z"
                  fill="white"
                />
                <path
                  d="M7.85 22.75H5.15C2.49 22.75 1.25 21.51 1.25 18.85V15.15C1.25 12.49 2.49 11.25 5.15 11.25H7.85C10.51 11.25 11.75 12.49 11.75 15.15V18.85C11.75 21.51 10.51 22.75 7.85 22.75ZM5.15 12.75C3.31 12.75 2.75 13.31 2.75 15.15V18.85C2.75 20.69 3.31 21.25 5.15 21.25H7.85C9.69 21.25 10.25 20.69 10.25 18.85V15.15C10.25 13.31 9.69 12.75 7.85 12.75H5.15Z"
                  fill="white"
                />
                <path
                  d="M15.0002 22.75C14.7302 22.75 14.4802 22.6 14.3502 22.37C14.2202 22.14 14.2202 21.85 14.3602 21.62L15.4102 19.87C15.6202 19.51 16.0802 19.4 16.4402 19.61C16.8002 19.82 16.9102 20.28 16.7002 20.64L16.4302 21.09C19.1902 20.44 21.2602 17.96 21.2602 15C21.2602 14.59 21.6002 14.25 22.0102 14.25C22.4202 14.25 22.7602 14.59 22.7602 15C22.7502 19.27 19.2702 22.75 15.0002 22.75Z"
                  fill="white"
                />
                <path
                  d="M2 9.75C1.59 9.75 1.25 9.41 1.25 9C1.25 4.73 4.73 1.25 9 1.25C9.27 1.25 9.52 1.4 9.65 1.63C9.78 1.86 9.78 2.15 9.64 2.38L8.59 4.14C8.38 4.49 7.92 4.61 7.56 4.39C7.21 4.18 7.09 3.72 7.31 3.36L7.58 2.91C4.81 3.56 2.75 6.04 2.75 9C2.75 9.41 2.41 9.75 2 9.75Z"
                  fill="white"
                />
              </svg>
            </div>
            <div className="flex justify-between items-start">
              <CardTitle className="text-2xl text-white">
                التعلم من خلال كروت الفلاش
              </CardTitle>
            </div>
            <CardDescription className="text-white/80">
              هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد
              هذا النص من مولد النص العربي، حيث يمكنك أن تولد مثل هذا النص أو
              العديد من النصوص الأخرى إضافة إلى زيادة عدد الحروف التي يولدها هذا
              النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا
              النص من مولد النص العربي، حيث يمكنك أن تولد مثل هذا النص أو العديد
              من النصوص الأخرى إضافة إلى زيادة عدد الحروف التي يولدها هذا النص
              هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا النص
              من مولد النص العربي، حيث يمكنك أن تولد مثل هذا النص أو العديد من
              النصوص الأخرى
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Link
              href="#"
              className="flex items-center gap-2 text-white/90 hover:text-white transition-colors"
            >
              تعلم أكثر <ArrowLeft className="w-5 h-5" />
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default TestimonialSection;
