import OtpClient from "@/components/otp/OtpClient";

export const metadata = {
  title: "التحقق من الرمز",
  description: "أدخل رمز التحقق المرسل إلى بريدك الإلكتروني",
  robots: {
    index: false,
    follow: true,
  },
};

export default function OtpPage({ searchParams }) {
  const defaultEmail =
    typeof searchParams?.email === "string" ? searchParams.email : "";
  return <OtpClient defaultEmail={defaultEmail} />;
}
