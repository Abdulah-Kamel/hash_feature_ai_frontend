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
const LoginForm = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);
  const [googleReady, setGoogleReady] = useState(false);
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

  useEffect(() => {
    const existing = document.getElementById("google-signin-script");
    if (existing) {
      try {
        if (
          window.google?.accounts?.id &&
          document.getElementById("gsi-login-btn")
        ) {
          const btn = document.getElementById("gsi-login-btn");
          window.google.accounts.id.renderButton(btn, {
            theme: "filled_black",
            size: "large",
            text: "continue_with",
            shape: "pill",
            logo_alignment: "left",
          });
          try {
            btn.addEventListener(
              "click",
              () => {
                setGoogleBusy(true);
              },
              true
            );
          } catch {}
          setGoogleReady(true);
          setGoogleBusy(false);
          return;
        }
      } catch {}
    }
    const s = document.createElement("script");
    s.src = "https://accounts.google.com/gsi/client";
    s.async = true;
    s.defer = true;
    s.id = "google-signin-script";
    s.onload = () => {
      try {
        const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
        if (window.google && clientId) {
          window.google.accounts.id.initialize({
            client_id: clientId,
            ux_mode: "redirect",
            login_uri:
              typeof window !== "undefined"
                ? `${window.location.origin}/api/auth/google/callback`
                : undefined,
          });
          try {
            const btn = document.getElementById("gsi-login-btn");
            if (btn && window.google?.accounts?.id?.renderButton) {
              window.google.accounts.id.renderButton(btn, {
                theme: "filled_black",
                size: "large",
                text: "continue_with",
                shape: "pill",
                logo_alignment: "left",
              });
              try {
                btn.addEventListener(
                  "click",
                  () => {
                    setGoogleBusy(true);
                  },
                  true
                );
              } catch {}
            }
          } catch {}
          setGoogleReady(true);
        }
      } catch {}
    };
    document.body.appendChild(s);
  }, [router]);

  const onGoogleLogin = () => {
    if (googleBusy) return;
    if (window.google && googleReady) {
      try {
        window.google.accounts.id.prompt();
      } catch {}
    }
  };

  async function onSubmit(data) {
    setError("");
    setLoading(true);
    const result = await handleLogin(data);
    if (result.success) {
      setLoading(false);
      toast.success("تم تسجيل الدخول بنجاح", {
        position: "top-right",
        duration: 3000,
        classNames: "toast-success text-black mt-14",
      });
      router.push("/dashboard/overview");
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
          <div className="relative w-full mt-2">
            <Button
              variant="outline"
              className="w-full cursor-pointer px-5 py-2 sm:py-7 rounded-lg text-lg font-medium max-sm:text-xs"
              disabled={loading || googleBusy}
              onClick={onGoogleLogin}
              type="button"
            >
              {googleBusy ? (
                <Spinner className="size-8" />
              ) : (
                "اكمل عن طريق جوجل"
              )}
              <Image
                src={googleIcon}
                alt="google logog icon"
                className="h-5 w-5"
              />
            </Button>
            <div
              id="gsi-login-btn"
              className={`absolute inset-0 z-10 opacity-0 ${
                googleReady ? "pointer-events-auto" : "pointer-events-none"
              }`}
            />
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
