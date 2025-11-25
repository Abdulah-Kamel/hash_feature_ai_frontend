"use client";
import * as React from "react";
import { Card } from "@/components/ui/card";
import ProfileDetails from "@/components/settings/ProfileDetails";
import PasswordCard from "@/components/settings/PasswordCard";
import LogoutCard from "@/components/settings/LogoutCard";

export default function ProfileTabPage() {
  const [profile, setProfile] = React.useState({
    name: "محمود عمر",
    position: "طالب",
    country: "مصر",
    specialization: "إدارة أعمال",
    university: "جامعة الملك فهد",
    oldPassword: "",
    newPassword: "",
    newPassword2: "",
  });
  return (
    <div className="space-y-6" dir="rtl">
      <Card className="rounded-xl p-4 space-y-2 bg-background">
        <p className="text-2xl font-semibold text-white">تفاصيل الملف</p>
        <p className="text-sm text-muted-foreground">إدارة تفاصيل الملف الخاصة بك</p>
      </Card>
      <ProfileDetails profile={profile} setProfile={setProfile} />
      <PasswordCard profile={profile} setProfile={setProfile} />
      <LogoutCard />
    </div>
  );
}