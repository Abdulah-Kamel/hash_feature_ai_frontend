import React from "react";
import Link from "next/link";
import { Facebook, Instagram, Youtube, Twitter } from "lucide-react";
import logo from "../../assets/logo.svg";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border/50">
      <div className="px-4 lg:px-12 py-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <Link href="/" className="flex items-center gap-3">
              <Image src={logo} alt="Hash Plus Logo" className="h-11 w-auto" />
              <span className="text-2xl font-bold">هاش بلس</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="#"
                className="w-10 h-10 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
                aria-label="Facebook"
              >
                <Facebook className="w-6 h-6 text-white" />
              </Link>
              <Link
                href="#"
                className="w-10 h-10 rounded-lg flex items-center justify-center hover:opacity-80 transition-opacity"
                aria-label="Instagram"
              >
                <Instagram className="w-6 h-6 text-white" />
              </Link>
              <Link
                href="#"
                className="w-10 h-10 rounded-lg flex items-center justify-center hover:opacity-80 transition-opacity"
                aria-label="YouTube"
              >
                <Youtube className="w-6 h-6 text-white" />
              </Link>
              <Link
                href="#"
                className="w-10 h-10 rounded-lg flex items-center justify-center hover:opacity-80 transition-opacity"
                aria-label="Twitter"
              >
                <Twitter className="w-6 h-6 text-white" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t-2 border-white/10"></div>

      <div className="px-4 lg:px-12 py-4">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white">
            <p>كل الحقوق محفوظة</p>
            <p>{new Date().getFullYear()}</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
