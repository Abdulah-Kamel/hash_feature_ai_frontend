import { NavBar } from "@/components/navbar";
import Hero from "@/components/hero";
import Footer from "@/components/footer";

export const metadata = {
  title: "الرئيسية",
  description:
    "اكتشف أفضل منصة تعليمية رقمية في المنطقة. دورات متخصصة في البرمجة، التصميم، والتطوير مع خبراء معتمدين ومحتوى عالي الجودة.",
  keywords: [
    "الصفحة الرئيسية",
    "منصة تعليمية",
    "دورات تدريبية",
    "تعلم أونلاين",
    "برمجة",
    "تصميم",
    "تطوير مواقع",
  ],
  openGraph: {
    title: "Hash Plus - الرئيسية",
    description: "اكتشف أفضل منصة تعليمية رقمية في المنطقة",
    url: "https://hashplus.com",
    images: [
      {
        url: "/og-home.jpg",
        width: 1200,
        height: 630,
        alt: "Hash Plus - منصة التعليم الرقمي",
      },
    ],
  },
};

export default function Home() {
  return (
    <>
      <NavBar />
      <Hero />
      <Footer />
    </>
  );
}
