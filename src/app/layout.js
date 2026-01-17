import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import RTLProvider from "@/components/providers/RTLProvider";
import { GoogleOAuthProvider } from "@react-oauth/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "هاش فلو - منصة التعلم الذكية",
    template: "%s | هاش فلو",
  },
  description:
    "منصة تعليمية ذكية تحول محاضراتك إلى مواد دراسية تفاعلية باستخدام الذكاء الاصطناعي",
  keywords: [
    "هاش فلو",
    "Hash Flow",
    "الذكاء الاصطناعي",
    "التعلم",
    "بطاقات تعليمية",
    "اختبارات",
    "خرائط ذهنية",
  ],
  icons: {
    icon: "/HFlogo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GoogleOAuthProvider
          clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
        >
          <RTLProvider>{children}</RTLProvider>
        </GoogleOAuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
