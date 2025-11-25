"use client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Linkedin, Youtube, Facebook, Instagram, Send } from "lucide-react";

function Row({ icon: Icon, placeholder }) {
  return (
    <div className="flex items-center gap-3">
      <div className="size-8 grid place-items-center rounded-md bg-card border border-border">
        <Icon className="size-4 text-white" />
      </div>
      <Input placeholder={placeholder} className="flex-1 rounded-xl bg-card text-white placeholder:text-white/80" />
    </div>
  );
}

export default function SocialAccountsCard() {
  return (
    <Card className="rounded-xl bg-background p-4 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold text-white">حسابات التواصل الإجتماعي</p>
      </div>
      <div className="space-y-3">
        <Row icon={Linkedin} placeholder="حساب لينكد إن" />
        <Row icon={Send} placeholder="حساب تيليجرام" />
        <Row icon={Youtube} placeholder="حساب يوتيوب" />
        <Row icon={Facebook} placeholder="حساب فيسبوك" />
        <Row icon={Send} placeholder="حساب أكس" />
        <Row icon={Instagram} placeholder="حساب انستجرام" />
      </div>
    </Card>
  );
}