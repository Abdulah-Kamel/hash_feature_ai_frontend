"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import googleIcon from "@/assets/google-icon.svg";
import Image from "next/image";
import { handleRegister } from "@/components/register/registerActions";
import FormField from "@/components/form/FormField";
import PasswordField from "@/components/form/PasswordField";
import PhoneField from "@/components/form/PhoneField";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Controller } from "react-hook-form";
import PhoneInput, {
  isValidPhoneNumber,
  getCountryCallingCode,
} from "react-phone-number-input";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";

const RegisterForm = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const formSchema = z.object({
    name: z.string().min(3, "الاسم يجب أن يكون 3 أحرف على الأقل").max(255),
    email: z.string().email("البريد الإلكتروني غير صحيح"),
    phone: z
      .string("رقم الهاتف مطلوب")
      .min(1, "رقم الهاتف مطلوب")
      .refine((val) => isValidPhoneNumber(val), "رقم الهاتف غير صحيح"),
    password: z
      .string()
      .min(8, "كلمة السر يجب أن تكون 8 أحرف على الأقل")
      .max(255)
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
        "كلمة السر يجب أن تحتوي على حرف كبير، حرف صغير، رقم ورمز خاص"
      ),
    //     confirmPassword: z.string(),
    //     terms: z
    //       .boolean()
    //       .refine((val) => val === true, "يجب الموافقة على الشروط والأحكام"),
    //     role: z.string(),
    //   })
    //   .refine((data) => data.password === data.confirmPassword, {
    //     path: ["confirmPassword"],
    //     message: "كلمات السر غير متطابقة",
  });

  const { handleSubmit, control, reset } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      // confirmPassword: '',
      // terms: false,
    },
  });

  useEffect(() => {
    reset({
      name: "",
      email: "",
      phone: "",
      password: "",
      // confirmPassword: '',
      // terms: false,
    });
  }, [reset]);

  async function onSubmit(data) {
    setLoading(true);
    const result = await handleRegister(data);
    if (result.success) {
      setLoading(false);
      toast.success("تم إنشاء حساب بنجاح", {
        position: "top-right",
        duration: 3000,
        classNames: "toast-success text-black mt-14",
      });
      router.push("/otp");
    } else {
      setLoading(false);
      toast.error(result.error, {
        position: "top-right",
        duration: 3000,
        classNames: "toast-error text-black mt-14",
        description: <p className="font-light text-black">{result.error}</p>,
      });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-6">
        <FormField
          control={control}
          name="name"
          label="الاسم"
          placeholder="الاسم"
          autoComplete="name"
          className="bg-card text-white placeholder:text-white"
        />
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
          label="كلمة السر"
          placeholder="ادخل كلمة السر"
          autoComplete="new-password"
          className="bg-card text-white placeholder:text-white"
        />

        <div className="flex-col gap-2">
          <Button
            type="submit"
            className="w-full cursor-pointer px-5 py-2 sm:py-6 rounded-lg max-sm:text-xs"
            disabled={loading}
          >
            {loading ? <Spinner className="size-8" /> : "إنشاء حساب"}
          </Button>
          <Button
            variant="outline"
            className="w-full cursor-pointer px-5 py-2 sm:py-6 rounded-lg mt-2 max-sm:text-xs"
            disabled={loading}
          >
            {loading ? (
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
          <div className="max-sm:text-xs text-center mt-6 font-light">
            لديك حساب بالفعل؟
            <Link href="/login" className="ms-2 text-primary hover:underline">
              تسجيل الدخول
            </Link>
          </div>
        </div>
      </div>
    </form>
  );
};

export default RegisterForm;
