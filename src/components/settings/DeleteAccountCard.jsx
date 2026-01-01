"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { deleteMyAccount } from "@/server/actions/profile";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function DeleteAccountCard() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await deleteMyAccount();
      if (res.success) {
        toast.success("تم حذف الحساب بنجاح");
        router.push("/login");
      } else {
        toast.error(res.error || "فشل حذف الحساب");
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء حذف الحساب");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="rounded-xl p-4 space-y-3 bg-background flex md:flex-row items-center justify-between max-md:text-center">
      <div className="space-y-3">
        <label className="text-white">حذف الحساب</label>
        <p className="text-sm text-muted-foreground mt-2">
          عند حذف الحساب سوف يتم حذف جميع البيانات لدينا ولن نستطيع إستعادتها
          مرة أخرى
        </p>
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="destructive"
            className="rounded-lg w-56 cursor-pointer"
          >
            حذف الحساب
            <Trash2 className="size-4 ml-2" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md" dir="rtl">
          <DialogHeader className="text-right sm:text-right">
            <DialogTitle className="text-right">حذف الحساب نهائياً</DialogTitle>
            <DialogDescription className="text-right pt-2">
              هل أنت متأكد من أنك تريد حذف حسابك؟ هذا الإجراء لا يمكن التراجع
              عنه وسيتم مسح جميع بياناتك.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-row gap-2">
            <DialogClose asChild>
              <Button type="button" variant="secondary" className="cursor-pointer">
                إلغاء
              </Button>
            </DialogClose>
             <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
              className="px-6 cursor-pointer"
            >
              {loading ? "جاري الحذف..." : "حذف الحساب"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}