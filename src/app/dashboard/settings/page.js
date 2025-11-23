"use client";
import * as React from "react";
import { SidebarInset } from "@/components/ui/sidebar";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Linkedin,
  Youtube,
  Facebook,
  Instagram,
  Send,
  Trash2,
  ArrowLeft,
  ImagePlus,
} from "lucide-react";
import PrivacyDetails from "@/components/settings/PrivacyDetails";

function SocialRow({ icon: Icon, placeholder }) {
  return (
    <div className="flex items-center gap-3">
      <div className="size-8 grid place-items-center rounded-md bg-card border border-border">
        <Icon className="size-4 text-white" />
      </div>
      <Input
        placeholder={placeholder}
        className="flex-1 rounded-xl bg-card text-white placeholder:text-white/80"
      />
    </div>
  );
}

export default function SettingsPage() {
  const [tab, setTab] = React.useState("settings");
  const [lang, setLang] = React.useState("ar");
  const [privacyOpen, setPrivacyOpen] = React.useState(false);
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
  const [privacy, setPrivacy] = React.useState("public");
  const languages = [
    { value: "ar", label: "العربية" },
    { value: "en", label: "English" },
  ];

  return (
    <SidebarInset className="min-h-screen p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-white">الإعدادات</h1>
      </div>
      <Tabs value={tab} onValueChange={setTab} className="space-y-6" dir="rtl">
        <TabsList className="bg-card p-2 rounded-lg w-full grid grid-cols-4 gap-2">
          <TabsTrigger
            value="settings"
            className="rounded-lg px-6 py-3 bg-background data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            إعدادات
          </TabsTrigger>
          <TabsTrigger
            value="profile"
            className="rounded-lg px-6 py-3 bg-background data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            الملف الشخصي
          </TabsTrigger>
          <TabsTrigger
            value="billing"
            className="rounded-lg px-6 py-3 bg-background data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            الإشتراك
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="rounded-lg px-6 py-3 bg-background data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            الإشعارات
          </TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="space-y-6">
          <Card className="rounded-xl bg-background p-6 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold text-white">
                حسابات التواصل الإجتماعي
              </p>
            </div>
            <div className="space-y-3">
              <SocialRow icon={Linkedin} placeholder="حساب لينكد إن" />
              <SocialRow icon={Send} placeholder="حساب تيليجرام" />
              <SocialRow icon={Youtube} placeholder="حساب يوتيوب" />
              <SocialRow icon={Facebook} placeholder="حساب فيسبوك" />
              <SocialRow icon={Send} placeholder="حساب أكس" />
              <SocialRow icon={Instagram} placeholder="حساب انستجرام" />
            </div>
          </Card>

          <Card className="rounded-xl p-6 space-y-3 bg-background flex flex-row items-center justify-between">
            <Label className="text-white">اللغة</Label>
            <Select value={lang} onValueChange={setLang} dir="rtl">
              <SelectTrigger className="w-64 bg-card cursor-pointer">
                <SelectValue placeholder="اختر اللغة" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((l) => (
                  <SelectItem key={l.value} value={l.value}>
                    {l.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Card>

          <Card className="flex flex-row items-center justify-between border border-[#515355] rounded-[15px] bg-[#212121] px-6 py-5">
            <p className="text-white text-base">خصوصية الحساب</p>
            <Button
              variant={"outline"}
              className="inline-flex items-center gap-2 border border-[#515355] rounded-[15px] bg-[#303030] h-12 px-3 cursor-pointer"
              onClick={() => setPrivacyOpen(true)}
            >
              <ArrowLeft className="size-5" />
            </Button>
          </Card>
          <PrivacyDetails open={privacyOpen} onOpenChange={setPrivacyOpen} />

          <Card className="rounded-xl p-6 space-y-3 bg-background flex md:flex-row items-center justify-between max-md:text-center">
            <div className="space-y-3">
              <label className="text-white">حذف الحساب</label>
              <p className="text-sm text-muted-foreground mt-2">
                عند حذف الحساب سوف يتم حذف جميع البيانات لدينا ولن نستطيع
                إستعادتها مرة أخرى
              </p>
            </div>

            <Button
              variant="destructive"
              className="rounded-lg w-56 cursor-pointer"
            >
              حذف الحساب
              <Trash2 className="size-4 ml-2" />
            </Button>
          </Card>
        </TabsContent>

        <TabsContent value="profile" dir="rtl" className="space-y-6">
          <Card className="rounded-xl p-6 space-y-2 bg-background">
            <p className="text-2xl font-semibold text-white">تفاصيل الملف</p>
            <p className="text-sm text-muted-foreground">
              إدارة تفاصيل الملف الخاصة بك
            </p>
          </Card>

          <Card className="rounded-xl p-6 space-y-6 bg-background">
            <p className="text-lg font-semibold text-white">
              تفاصيل الملف الشخصي
            </p>
            <div className="grid grid-cols-1 gap-6">
              <div className="flex items-center">
                <Card className="rounded-2xl border bg-card w-full max-w-sm h-56 grid place-items-center">
                  <div className="text-center space-y-2">
                    <ImagePlus className="size-10 mx-auto" />
                    <p className="text-white/90">أرفق الملف هنا</p>
                  </div>
                </Card>
              </div>
              <div className="space-y-4">
                <Label className="text-white">الإسم</Label>
                <Input
                  value={profile.name}
                  onChange={(e) =>
                    setProfile((p) => ({ ...p, name: e.target.value }))
                  }
                  className="bg-card rounded-xl text-white"
                />

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white">المنصب</Label>
                    <Select
                      value={profile.position}
                      onValueChange={(v) =>
                        setProfile((p) => ({ ...p, position: v }))
                      }
                    >
                      <SelectTrigger className="bg-card rounded-xl w-full cursor-pointer">
                        <SelectValue placeholder="اختر المنصب" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="طالب">طالب</SelectItem>
                        <SelectItem value="مدرّس">مدرّس</SelectItem>
                        <SelectItem value="باحث">باحث</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">الدولة</Label>
                    <Input
                      value={profile.country}
                      onChange={(e) =>
                        setProfile((p) => ({ ...p, country: e.target.value }))
                      }
                      className="bg-card rounded-xl text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white">التخصص</Label>
                    <Select
                      value={profile.specialization}
                      onValueChange={(v) =>
                        setProfile((p) => ({ ...p, specialization: v }))
                      }
                    >
                      <SelectTrigger className="bg-card rounded-xl w-full cursor-pointer">
                        <SelectValue placeholder="اختر التخصص" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="إدارة أعمال">إدارة أعمال</SelectItem>
                        <SelectItem value="علوم حاسوب">علوم حاسوب</SelectItem>
                        <SelectItem value="هندسة">هندسة</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">الجامعة</Label>
                    <Input
                      value={profile.university}
                      onChange={(e) =>
                        setProfile((p) => ({
                          ...p,
                          university: e.target.value,
                        }))
                      }
                      className="bg-card rounded-xl text-white"
                    />
                  </div>
                </div>

                <Button className="rounded-xl w-32">حفظ</Button>
              </div>
            </div>
          </Card>

          <Card className="rounded-xl p-6 space-y-4 bg-background">
            <p className="text-lg font-semibold text-white">كلمة السر</p>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label className="text-white">كلمة السر القديمة</Label>
                <Input
                  type="password"
                  value={profile.oldPassword}
                  onChange={(e) =>
                    setProfile((p) => ({ ...p, oldPassword: e.target.value }))
                  }
                  className="bg-card rounded-xl text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">كلمة السر الجديدة</Label>
                <Input
                  type="password"
                  value={profile.newPassword}
                  onChange={(e) =>
                    setProfile((p) => ({ ...p, newPassword: e.target.value }))
                  }
                  className="bg-card rounded-xl text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">إعادة كلمة السر الجديدة</Label>
                <Input
                  type="password"
                  value={profile.newPassword2}
                  onChange={(e) =>
                    setProfile((p) => ({ ...p, newPassword2: e.target.value }))
                  }
                  className="bg-card rounded-xl text-white"
                />
              </div>
            </div>
            <Button className="rounded-xl w-32">حفظ</Button>
          </Card>

          <Card className="rounded-xl p-6 space-y-3 bg-background">
            <Button variant="outline" className="w-full h-12 rounded-xl">
              تسجيل الخروج
            </Button>
          </Card>
        </TabsContent>
        <TabsContent value="billing">
          <Card className="rounded-xl p-6">
            <p className="text-muted-foreground">إدارة الإشتراك قادمًا.</p>
          </Card>
        </TabsContent>
        <TabsContent value="notifications">
          <Card className="rounded-xl p-6">
            <p className="text-muted-foreground">إشعارات النظام قادمًا.</p>
          </Card>
        </TabsContent>
      </Tabs>
    </SidebarInset>
  );
}
