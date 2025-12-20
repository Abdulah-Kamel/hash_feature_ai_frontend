"use client";
import { Card } from "@/components/ui/card";
import { Linkedin, Instagram, Send, Twitter } from "lucide-react";
import Link from "next/link";

const socialLinks = [
  {
    name: "لينكد إن",
    icon: Linkedin,
    url: "https://www.linkedin.com/company/ihashflow",
    color: "bg-[#0077B5]",
  },
  {
    name: "تيليجرام",
    icon: Send,
    url: "https://t.me/ihashflow",
    color: "bg-[#26A5E4]",
  },
  {
    name: "انستجرام",
    icon: Instagram,
    url: "https://www.instagram.com/ihashflow",
    color: "bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737]",
  },
  {
    name: "تويتر (X)",
    icon: Twitter,
    url: "https://x.com/ihashflow",
    color: "bg-black",
  },
  {
    name: "تيك توك",
    icon: ({ className }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
      </svg>
    ),
    url: "https://tiktok.com/@ihashflow",
    color: "bg-black",
  },
];

function SocialLink({ name, icon: Icon, url, color }) {
  return (
    <Link
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border hover:border-primary/50 transition-all group cursor-pointer"
    >
      <div className={`size-10 grid place-items-center rounded-lg ${color}`}>
        <Icon className="size-5 text-white" />
      </div>
      <div className="flex-1">
        <p className="text-white font-medium">{name}</p>
        <p className="text-xs text-white/50 truncate">@ihashflow</p>
      </div>
      <div className="size-8 grid place-items-center rounded-full bg-white/5 group-hover:bg-primary/20 transition-colors">
        <svg
          className="size-4 text-white/50 group-hover:text-primary transition-colors"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
      </div>
    </Link>
  );
}

export default function SocialAccountsCard() {
  return (
    <Card className="rounded-xl bg-background p-4 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold text-white">
          حسابات التواصل الإجتماعي
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {socialLinks.map((link) => (
          <SocialLink key={link.name} {...link} />
        ))}
      </div>
    </Card>
  );
}