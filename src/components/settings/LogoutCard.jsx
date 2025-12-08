"use client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function LogoutCard({ onLogout }) {
  return (
    <Card className="rounded-xl p-4 space-y-3 bg-background">
      <Button
        variant="outline"
        className="w-full h-12 rounded-xl bg-red-400 hover:bg-red-500/80 cursor-pointer"
        onClick={onLogout}
      >
        تسجيل الخروج
      </Button>
    </Card>
  );
}