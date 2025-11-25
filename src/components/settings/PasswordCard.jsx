"use client";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function PasswordCard({ profile, setProfile }) {
  return (
    <Card className="rounded-xl p-4 space-y-4 bg-background">
      <p className="text-lg font-semibold text-white">كلمة السر</p>
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label className="text-white">كلمة السر القديمة</Label>
          <Input type="password" value={profile.oldPassword} onChange={(e)=>setProfile(p=>({...p,oldPassword:e.target.value}))} className="bg-card rounded-xl text-white" />
        </div>
        <div className="space-y-2">
          <Label className="text-white">كلمة السر الجديدة</Label>
          <Input type="password" value={profile.newPassword} onChange={(e)=>setProfile(p=>({...p,newPassword:e.target.value}))} className="bg-card rounded-xl text-white" />
        </div>
        <div className="space-y-2">
          <Label className="text-white">إعادة كلمة السر الجديدة</Label>
          <Input type="password" value={profile.newPassword2} onChange={(e)=>setProfile(p=>({...p,newPassword2:e.target.value}))} className="bg-card rounded-xl text-white" />
        </div>
      </div>
      <Button className="rounded-xl w-32">حفظ</Button>
    </Card>
  );
}