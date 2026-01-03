import { NavBar } from "@/components/navbar";
import Footer from "@/components/footer";
import React from "react";
import Container from "@/components/container";
import HeroSection from "@/components/landing/HeroSection";
import ToolsSection from "@/components/landing/ToolsSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import TestimonialSection from "@/components/landing/TestimonialSection";
import PricingSection from "@/components/landing/PricingSection";
import QaSection from "@/components/landing/QaSection";

export const metadata = {
  title: "هاش بلس - حوّل المحاضرات إلى مواد دراسية تفاعلية",
  description:
    "تعلم أسرع x10 مرات مع الذكاء الاصطناعي لامتحاناتك. انضم إلى أكثر من 40 ألف طالب يتقنون امتحاناتهم باستخدام أدوات التعلم المدعومة بالذكاء الاصطناعي. حوّل أي محاضرة إلى بطاقات تعليمية واختبارات تدريبية وخرائط ذهنية بنقرة واحدة.",
  keywords: [
    "هاش بلس",
    "الذكاء الاصطناعي",
    "التعلم المعزز بالذكاء الاصطناعي",
    "تحويل المحاضرات",
    "بطاقات تعليمية",
    "اختبارات تدريبية",
    "خرائط ذهنية",
    "منصة تعليمية",
    "تعلم أسرع",
    "امتحانات",
    "مواد دراسية تفاعلية",
    "AI learning",
    "Hash Plus",
  ],
  openGraph: {
    title: "هاش بلس - حوّل المحاضرات إلى مواد دراسية تفاعلية",
    description:
      "تعلم أسرع x10 مرات مع الذكاء الاصطناعي لامتحاناتك. حوّل أي محاضرة إلى بطاقات تعليمية واختبارات تدريبية وخرائط ذهنية بنقرة واحدة.",
    url: "https://hashplus.com",
    images: [
      {
        url: "/og-home.jpg",
        width: 1200,
        height: 630,
        alt: "هاش بلس - منصة التعلم المعززة بالذكاء الاصطناعي",
      },
    ],
  },
};

export default function Home() {
  return (
    <>
      <NavBar />
      <div className="w-full overflow-x-hidden">
        <Container className="min-h-[85vh] bg-transparent flex flex-col items-center justify-center gap-12 px-5 lg:px-20 py-14">
          <HeroSection />
          <ToolsSection />
          <FeaturesSection />
          <TestimonialSection />
          <PricingSection />
          <QaSection />
        </Container>
      </div>
      <Footer />
    </>
  );
}
