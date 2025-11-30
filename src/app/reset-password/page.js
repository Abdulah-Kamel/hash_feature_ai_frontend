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
import PasswordField from "@/components/form/PasswordField";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { handleResetPassword } from "@/server/actions/auth";

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const schema = z
    .object({
      email: z.string().email("البريد الإلكتروني غير صحيح"),
      password: z
        .string()
        .min(8, "كلمة السر يجب أن تكون 8 أحرف على الأقل"),
      confirmPassword: z.string(),
    })
    .refine((d) => d.password === d.confirmPassword, {
      path: ["confirmPassword"],
      message: "كلمات السر غير متطابقة",
    });
  const { handleSubmit, control } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });
  async function onSubmit(data) {
    setLoading(true);
    const result = await handleResetPassword({
      email: data.email,
      newPassword: data.password,
    });
    setLoading(false);
    if (result.success) {
      toast.success("تم إعادة تعيين كلمة السر", {
        position: "top-right",
        duration: 3000,
        classNames: "toast-success mt-14",
      });
      router.push("/login");
    } else {
      toast.error(result.error || "حدث خطأ", {
        position: "top-right",
        duration: 3000,
        classNames: "toast-error mt-14",
      });
    }
  }
  return (
    <>
      <NavBar />
      <Container className="my-6 max-w-2xl flex flex-col justify-center items-center py-12 gap-10">
        <h1 className="text-3xl font-bold text-white">إعادة تعيين كلمة السر</h1>
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
            
            <PasswordField
              control={control}
              name="password"
              label="كلمة السر الجديدة"
              placeholder="ادخل كلمة السر"
              autoComplete="new-password"
            />
            <PasswordField
              control={control}
              name="confirmPassword"
              label="تأكيد كلمة السر"
              placeholder="اعد ادخال كلمة السر"
              autoComplete="new-password"
            />
            <Button
              type="submit"
              className="w-full cursor-pointer px-5 py-2 sm:py-6 rounded-lg"
              disabled={loading}
            >
              {loading ? <Spinner className="size-8" /> : "إعادة تعيين"}
            </Button>
          </div>
        </form>
      </Container>
      <Footer />
    </>
  );
}
