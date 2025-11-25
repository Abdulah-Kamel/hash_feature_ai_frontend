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
import { useState } from "react";
import { useRouter } from "next/navigation";
import { handleVerifyOtp } from "@/server/actions/auth";

export default function OtpPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const schema = z.object({
    email: z.string().email("البريد الإلكتروني غير صحيح"),
    code: z.string().min(4, "رمز التحقق غير صحيح"),
  });
  const { handleSubmit, control, reset } = useForm({ resolver: zodResolver(schema), defaultValues: { email: "", code: "" } });
  async function onSubmit(data) {
    setLoading(true);
    const result = await handleVerifyOtp(data);
    setLoading(false);
    if (result.success) {
      toast.success("تم التحقق بنجاح", { position: "top-right", duration: 3000, classNames: "toast-success mt-14" });
      router.push("/reset-password");
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
            <FormField control={control} name="email" label="البريد الإلكتروني" placeholder="البريد الإلكتروني" type="email" autoComplete="email" className="bg-card text-white placeholder:text-white" />
            <FormField control={control} name="code" label="رمز التحقق" placeholder="ادخل رمز التحقق" className="bg-card text-white placeholder:text-white" />
            <Button type="submit" className="w-full cursor-pointer px-5 py-2 sm:py-6 rounded-lg" disabled={loading}>{loading ? <Spinner className="size-8" /> : "تحقق"}</Button>
          </div>
        </form>
      </Container>
      <Footer />
    </>
  );
}