"use client";
import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SidebarInset } from "@/components/ui/sidebar";

export default function SettingsLayout({ children }) {
  const pathname = usePathname();
  const tabs = [
    { href: "/app/settings", label: "إعدادات" },
    { href: "/app/settings/profile", label: "الملف الشخصي" },
    { href: "/app/settings/billing", label: "الإشتراك" },
    { href: "/app/settings/usage", label: "الإستهلاك" },
  ];
  return (
    <SidebarInset className="min-h-screen p-4" dir="rtl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-white">الإعدادات</h1>
      </div>
      <div className="bg-card p-2 rounded-lg w-full grid grid-cols-2 md:grid-cols-4 gap-4">
        {tabs.map((t) => {
          const active = pathname === t.href;
          return (
            <Link
              key={t.href}
              href={t.href}
              className={
                active
                  ? "rounded-lg px-6 py-3 bg-primary text-primary-foreground text-center"
                  : "rounded-lg px-6 py-3 bg-background text-white text-center"
              }
            >
              {t.label}
            </Link>
          );
        })}
      </div>
      <div className="mt-6 container mx-auto max-w-6xl">{children}</div>
    </SidebarInset>
  );
}
