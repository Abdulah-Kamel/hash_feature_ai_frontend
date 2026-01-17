"use client";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import googleIcon from "@/assets/google-icon.svg";
import Image from "next/image";
import { handleLogin } from "@/server/actions/auth";
import FormField from "@/components/form/FormField";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { AlertCircleIcon, Eye, EyeOff } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { useGoogleLogin } from "@react-oauth/google";

const LoginForm = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const formSchema = z.object({
    email: z.string().email("البريد الإلكتروني غير صحيح"),
    password: z.string().min(1, "كلمة السر مطلوبة"),
    rememberMe: z.boolean().optional(),
  });

  const { handleSubmit, control, reset } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  useEffect(() => {
    reset({
      email: "",
      password: "",
      rememberMe: false,
    });
  }, [reset]);

  const googleLogin = useGoogleLogin({
    flow: "auth-code",
    scope: "openid email profile",
    onSuccess: async (codeResponse) => {
      console.log("Google Auth Code Response:", codeResponse);
      try {
        const res = await fetch("/api/auth/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: codeResponse.code }),
        });
        const json = await res.json();
        if (!res.ok) {
          const msg = json?.message || "فشل تسجيل الدخول بواسطة جوجل";
          if (/verify your otp code first/i.test(String(msg))) {
            toast.info("يرجى التحقق من الحساب عبر الرمز المرسل", {
              position: "top-right",
              duration: 3000,
              classNames: "toast-info text-black mt-14",
            });
            router.push(`/otp`);
            return;
          }
          toast.error(msg, {
            position: "top-right",
            duration: 3000,
            classNames: "toast-error text-black mt-14",
          });
        } else {
          toast.success("تم تسجيل الدخول بنجاح", {
            position: "top-right",
            duration: 3000,
            classNames: "toast-success text-black mt-14",
          });
          router.push("/app/overview");
        }
      } catch (error) {
        console.error("Error during Google login:", error);
        toast.error("حدث خطأ أثناء تسجيل الدخول");
      }
    },
    onError: (errorResponse) => {
      console.error("Google Login Error:", errorResponse);
      toast.error("فشل تسجيل الدخول بواسطة جوجل");
    },
  });

  async function onSubmit(data) {
    setError("");
    setLoading(true);
    const result = await handleLogin(data);
    if (result.success) {
      setLoading(false);
      // Clear any refresh failed flags from previous sessions
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("auth_refresh_failed");
      }
      toast.success("تم تسجيل الدخول بنجاح", {
        position: "top-right",
        duration: 3000,
        classNames: "toast-success text-black mt-14",
      });
      router.push("/app/overview");
    } else {
      setLoading(false);
      const msg = result.error || "";
      if (/verify your otp code first/i.test(msg)) {
        toast.info("يرجى التحقق من الحساب عبر الرمز المرسل", {
          position: "top-right",
          duration: 3000,
          classNames: "toast-info text-black mt-14",
        });
        router.push(`/otp?email=${encodeURIComponent(data.email)}`);
        return;
      }
      setError(msg);
      toast.error(msg, {
        position: "top-right",
        duration: 3000,
        classNames: "toast-error text-black mt-14",
        description: <p className="font-light text-black">{msg}</p>,
      });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
        <Controller
          name="password"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <div className="flex justify-between items-center">
                <FieldLabel htmlFor={field.name}>كلمة السر</FieldLabel>
              </div>
              <div className="relative">
                <Input
                  {...field}
                  id={field.name}
                  type={showPassword ? "text" : "password"}
                  placeholder="ادخل كلمة السر"
                  className="h-10 sm:h-12 bg-card text-white placeholder:text-white"
                  aria-invalid={fieldState.invalid}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 left-0 cursor-pointer flex items-center px-3 text-gray-500"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-white" />
                  ) : (
                    <Eye className="w-5 h-5 text-white" />
                  )}
                </button>
              </div>
              <Link
                href={"/forget-password"}
                className="text-white text-end hover:underline"
              >
                نسيت كلمة السر؟
              </Link>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        {error && (
          <Alert variant="destructive" className="text-red-500">
            <AlertCircleIcon />
            <AlertTitle>خطأ اثناء تسجيل الدخول</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {/* Submit Buttons */}
        <div className="flex-col gap-2">
          <Button
            type="submit"
            className="w-full cursor-pointer px-5 py-2 sm:py-7 rounded-lg text-lg font-medium max-sm:text-xs"
            disabled={loading}
          >
            {loading ? <Spinner className="size-8" /> : "تسجيل الدخول"}
          </Button>

          {/* Custom Google Sign-In Button */}
          <div className="w-full mt-2">
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-gray-600"></div>
              <span className="flex-shrink-0 mx-4 text-gray-400">أو</span>
              <div className="flex-grow border-t border-gray-600"></div>
            </div>

            <Button
              type="button"
              onClick={() => googleLogin()}
              className="w-full h-12 bg-[#2D2D2D] hover:bg-[#3D3D3D] text-white flex items-center px-4 rounded-lg group border border-[#404040] cursor-pointer"
              variant="custom"
            >
              <span className="flex-1 flex items-center justify-center gap-2 text-center font-medium text-base">
                أكمل عن طريق جوجل
                <Image src={googleIcon} alt="Google" width={24} height={24} />
              </span>
            </Button>
          </div>

          <div className="mt-3 max-sm:text-xs text-center font-light">
            ليس لديك حساب؟
            <Link
              href="/register"
              className="ms-2 text-primary hover:underline"
            >
              انشاء حساب
            </Link>
          </div>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
