import { NavBar } from "@/components/navbar";
import Footer from "@/components/footer";
import Container from "@/components/container";

import RegisterCard from "@/components/register/registerCard";

export const metadata = {
  title: "إنشاء حساب جديد",
  description:
    "أنشئ حسابك الجديد في Hash Flow وابدأ رحلتك التعليمية مع أفضل الدورات التدريبية المتخصصة.",
  keywords: [
    "إنشاء حساب",
    "تسجيل جديد",
    "حساب Hash Flow",
    "التسجيل",
    "عضوية جديدة",
    "انضم إلينا",
  ],
  openGraph: {
    title: "Hash Flow - إنشاء حساب جديد",
    description: "أنشئ حسابك الجديد وابدأ رحلتك التعليمية معنا",
    url: "https://hashplus.com/register",
    images: [
      {
        url: "/og-register.jpg",
        width: 1200,
        height: 630,
        alt: "Hash Flow - إنشاء حساب جديد",
      },
    ],
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function RegisterPage() {
  return (
    <>
      <NavBar />
      <Container className="my-6 grid md:grid-cols-2 grid-cols-1 py-12 gap-10">
        <RegisterCard />
      </Container>
      <Footer />
    </>
  );
}
