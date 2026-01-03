import OtpClient from "@/components/otp/OtpClient";

export default function OtpPage({ searchParams }) {
  const defaultEmail =
    typeof searchParams?.email === "string" ? searchParams.email : "";
  return <OtpClient defaultEmail={defaultEmail} />;
}
