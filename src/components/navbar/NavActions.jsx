"use client";
import React from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  ShoppingCart,
  User,
  BookOpen,
  Heart,
  Settings,
  LogOut,
} from "lucide-react";
import { Button } from "../ui/button";

const NavActions = () => {
  return (
    <div className="hidden lg:flex items-center gap-2 lg:order-2">
      <div className="flex items-center gap-3">
        <Link href="/register">
          <Button
            variant="outline"
            className="bg-background border-white cursor-pointer rounded-lg"
          >
            <span className="text-sm text-foreground">انشاء حساب</span>
          </Button>
        </Link>
        <Link href="/login">
          <Button
            variant="outline"
            className="bg-primary hover:bg-primary/90 cursor-pointer rounded-lg"
          >
            <span className="text-sm text-foreground">تسجيل الدخول</span>
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NavActions;
