import React from "react";
import Link from "next/link";
import {
  Facebook,
  Instagram,
  Youtube,
  Twitter,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Send,
} from "lucide-react";
import logo from "@/assets/HashFlowlogo.png";
import saudiEconomyLogog from "@/assets/saudiEconomyLogog.svg";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border/50">
      <div className="px-4 lg:px-12 py-12">
        <div className="mx-auto max-w-7xl">
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-12 text-right"
            dir="rtl"
          >
            {/* Company Info Column */}
            <div className="space-y-4">
              <Link href="/" className="flex items-center gap-3">
                <Image
                  src={logo}
                  alt="Hash Plus Logo"
                  className="h-11 w-auto"
                />
              </Link>
              <p className="text-white/70 text-sm leading-relaxed">
                منصة فريدة للتعلم تحوّل عملية التعلم عملية بالمتعة
              </p>
              <div className="space-y-2 text-sm text-white/70">
                <p className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  المدينة المنورة - المملكة العربية السعودية
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  رقم التواصل: 966536960352+
                </p>
              </div>
              <div className="pt-2">
                <p className="text-sm text-white/70 mb-1">رقم السجل التجاري</p>
                <p className="text-white font-medium">4650279441</p>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Image
                  src={saudiEconomyLogog}
                  alt="Saudi Emblem"
                  width={100}
                  height={100}
                  className="opacity-70"
                />
                <div className="rounded-lg p-2">
                  <p className="text-xs text-white/70">السجل التجاري</p>
                  <p className="text-white font-bold">4650279441</p>
                </div>
              </div>
            </div>

            {/* Important Links Column */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">روابط مهمة</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/"
                    className="text-white/70 hover:text-white transition-colors text-sm"
                  >
                    سياسات المنصة
                  </Link>
                </li>
                <li>
                  <Link
                    href="/"
                    className="text-white/70 hover:text-white transition-colors text-sm"
                  >
                    الشروط والأحكام
                  </Link>
                </li>
                <li>
                  <Link
                    href="/"
                    className="text-white/70 hover:text-white transition-colors text-sm"
                  >
                    عن المنصة
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Column */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">تواصل معنا</h3>
              <div className="space-y-3 text-sm text-white/70">
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  ihashplus@gmail.com
                </p>
                <Link
                  href="https://t.me/ihashflow"
                  target="_blank"
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  https://t.me/ihashflow
                </Link>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <Link
                  href="https://www.linkedin.com/company/ihashflow"
                  target="_blank"
                  className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5 text-white" />
                </Link>
                <Link
                  href="https://t.me/ihashflow"
                  target="_blank"
                  className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                  aria-label="Telegram"
                >
                  <Send className="w-5 h-5 text-white" />
                </Link>
                <Link
                  href="https://www.instagram.com/ihashflow"
                  target="_blank"
                  className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5 text-white" />
                </Link>
                <Link
                  href="https://x.com/ihashflow"
                  target="_blank"
                  className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5 text-white" />
                </Link>
                <Link
                  href="https://tiktok.com/@ihashflow"
                  target="_blank"
                  className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                  aria-label="TikTok"
                >
                  <svg
                    className="w-5 h-5 text-white"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

