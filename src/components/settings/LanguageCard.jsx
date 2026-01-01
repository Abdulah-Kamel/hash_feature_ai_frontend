"use client";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

export default function LanguageCard({ value, onChange, languages = [{ value: "ar", label: "العربية" }, { value: "en", label: "English" }] }) {
  return (
    <Card className="rounded-xl p-4 space-y-3 bg-background flex flex-row items-center justify-between">
      <Label className="text-white">اللغة</Label>
      <Select value={value} onValueChange={onChange} dir="rtl">
        <SelectTrigger className="w-64 bg-card cursor-pointer">
          <SelectValue placeholder="اختر اللغة" />
        </SelectTrigger>
        <SelectContent>
          {languages.map((l) => (
            <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Card>
  );
}