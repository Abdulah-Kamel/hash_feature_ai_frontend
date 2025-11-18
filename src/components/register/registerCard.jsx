"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import RegisterForm from "@/components/register/registerForm";
import Image from "next/image";
import heroImage from "@/assets/hero-image.svg";
import logo from "@/assets/logo.svg";

const RegisterCard = () => {
  return (
    <>
      <div className="space-y-8 relative overflow-hidden p-8 col-span-1 min-h-[500px]">
        <div className="absolute top-0 left-0 right-0 h-64 bg-linear-to-b from-primary/30 via-primary/10 to-transparent blur-3xl -z-10"></div>

        <div className="flex flex-col gap-5 relative z-10">
          <h2 className="text-3xl font-bold text-white drop-shadow-[0_0_15px_rgba(110,131,245,0.4)]">
            حوّل المحاضرات إلى مواد دراسية تفاعلية
          </h2>
          <p className="text-white/80">
            انضم إلى أكثر من 40 ألف طالب يتقنون امتحاناتهم باستخدام أدوات التعلم
            المدعومة بالذكاء الاصطناعي.
          </p>
        </div>
        <Image
          src={heroImage}
          alt="register"
          width={650}
          className="absolute -left-20 opacity-80"
        />
      </div>
      <Card className="bg-background border border-gray-50/20 shadow-lg p-6 gap-2 rounded-md col-span-1">
        <Image src={logo} alt="logo" width={48} className="mx-auto" />
        <h1 className="mb-3 font-bold sm:text-3xl text-center">
          سجل حسابك مع هاش بلس
        </h1>
        <CardContent>
          <RegisterForm />
        </CardContent>
      </Card>
    </>
  );
};

export default RegisterCard;
