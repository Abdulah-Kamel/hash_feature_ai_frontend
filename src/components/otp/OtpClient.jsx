"use client";
import { NavBar } from "@/components/navbar";
import Footer from "@/components/footer";
import Container from "@/components/container";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import FormField from "@/components/form/FormField";
import { Spinner } from "@/components/ui/spinner";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { handleVerifyOtp } from "@/server/actions/auth";
import useAuth from "@/hooks/use-auth";

export default function OtpClient({ defaultEmail = "" }) {
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const schema = z.object({
    email: z.string().email("البريد الإلكتروني غير صحيح"),
    code: z.coerce.string().min(4, "رمز التحقق غير صحيح"),
  });
  const { handleSubmit, control, reset, getValues } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: defaultEmail, code: "" },
  });
  useEffect(() => {
    let timer = null;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown((v) => (v > 0 ? v - 1 : 0)), 1000);
    }
    return () => { if (timer) clearInterval(timer); };
  }, [cooldown]);
  async function resend() {
    const email = getValues("email") || defaultEmail;
    if (!email || cooldown > 0) {
      if (!email) toast.error("يرجى إدخال البريد الإلكتروني أولاً", { position: "top-right", duration: 3000, classNames: "toast-error mt-14" });
      return;
    }
    try {
      const res = await fetch('/api/auth/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json?.message || 'تعذر إرسال الرمز', { position: 'top-right', duration: 3000, classNames: 'toast-error mt-14' });
        return;
      }
      toast.success('تم إرسال رمز جديد إلى بريدك الإلكتروني', { position: 'top-right', duration: 3000, classNames: 'toast-success mt-14' });
      setCooldown(60);
    } catch {
      toast.error('خطأ في الشبكة', { position: 'top-right', duration: 3000, classNames: 'toast-error mt-14' });
    }
  }
  async function onSubmit(data) {
    setLoading(true);
    const result = await handleVerifyOtp(data);
    setLoading(false);
    if (result.success) {
      toast.success("تم التحقق بنجاح", { position: "top-right", duration: 3000, classNames: "toast-success mt-14" });
      router.push("/app/overview");
      router.refresh();
    } else {
      toast.error(result.error || "حدث خطأ", { position: "top-right", duration: 3000, classNames: "toast-error mt-14" });
    }
  }
  return (
    <>
      <NavBar />
      <Container className="my-6 max-w-2xl flex flex-col justify-center items-center py-12 gap-10">
        <h1 className="text-3xl font-bold text-white">تحقق من الرمز</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <div className="flex flex-col gap-6">
            <FormField
              control={control}
              name="email"
              label="البريد الإلكتروني"
              placeholder="البريد الإلكتروني"
              type="email"
              autoComplete="email"
              className="bg-card text-white placeholder:text-white"
            />
            <FormField
              control={control}
              name="code"
              label="رمز التحقق"
              placeholder="ادخل رمز التحقق"
              type="text"
              className="bg-card text-white placeholder:text-white"
            />
            <Button
              type="submit"
              className="w-full cursor-pointer px-5 py-2 sm:py-6 rounded-lg"
              disabled={loading}
            >
              {loading ? <Spinner className="size-8" /> : "تحقق"}
            </Button>
            <div className="text-center">
              {cooldown > 0 ? (
                <span className="text-sm text-muted-foreground">
                  إعادة إرسال الرمز خلال {cooldown} ثانية
                </span>
              ) : (
                <button
                  type="button"
                  onClick={resend}
                  className="text-primary hover:underline text-sm cursor-pointer"
                >
                  إعادة إرسال الرمز
                </button>
              )}
            </div>
          </div>
        </form>
      </Container>
      <Footer />
    </>
  );
}
