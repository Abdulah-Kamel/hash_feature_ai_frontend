"use client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export default function DeleteAccountCard({ onDelete }) {
  return (
    <Card className="rounded-xl p-4 space-y-3 bg-background flex md:flex-row items-center justify-between max-md:text-center">
      <div className="space-y-3">
        <label className="text-white">حذف الحساب</label>
        <p className="text-sm text-muted-foreground mt-2">عند حذف الحساب سوف يتم حذف جميع البيانات لدينا ولن نستطيع إستعادتها مرة أخرى</p>
      </div>
      <Button variant="destructive" className="rounded-lg w-56 cursor-pointer" onClick={onDelete}>
        حذف الحساب
        <Trash2 className="size-4 ml-2" />
      </Button>
    </Card>
  );
}