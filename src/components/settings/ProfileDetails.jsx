"use client";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useRef, useEffect } from "react";
import { useProfileStore } from "@/store/profileStore";
import {
  updateMyProfile,
  updateMyProfileImage,
  removeMyProfileImage,
} from "@/server/actions/profile";
import { toast } from "sonner";
import { Loader2, Camera, Trash2, ImagePlus, Check } from "lucide-react";

export default function ProfileDetails() {
  const {
    profile,
    updateProfile,
    updateProfileImage,
    removeProfileImage: removeProfileImageStore,
  } = useProfileStore();

  const [formData, setFormData] = useState({
    name: profile?.name || "",
    country: profile?.country || "",
    position: profile?.position || "",
    major: profile?.major || "",
    faculty: profile?.faculty || "",
  });
  const [updating, setUpdating] = useState(false);
  const [success, setSuccess] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [tempProfileImage, setTempProfileImage] = useState(
    profile?.profileImageUrl || profile?.avatar
  );
  const fileInputRef = useRef(null);

  // Update form data when profile changes
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        country: profile.country || "",
        position: profile.position || "",
        major: profile.major || "",
        faculty: profile.faculty || "",
      });
      setTempProfileImage(profile.profileImageUrl || profile.avatar);
    }
  }, [profile]);

  if (!profile) return null;

  const initials =
    formData.name?.trim()?.charAt(0) || profile?.name?.trim()?.charAt(0) || "م";

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("يرجى اختيار ملف صورة");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("حجم الصورة يجب أن يكون أقل من 5 ميجابايت");
      return;
    }

    setUploadingImage(true);

    const imageFormData = new FormData();
    imageFormData.append("profileImage", file);

    const result = await updateMyProfileImage(imageFormData);
    if (result.success) {
      toast.success("تم تحديث صورة الملف الشخصي بنجاح");

      // Extract image URL from various possible response structures
      let imageUrl = null;

      if (result.data?.profileImage?.url) {
        imageUrl = result.data.profileImage.url;
      } else if (result.data?.profileImageUrl) {
        imageUrl = result.data.profileImageUrl;
      } else if (result.data?.url) {
        imageUrl = result.data.url;
      }

      if (imageUrl) {
        setTempProfileImage(imageUrl);
        updateProfileImage(imageUrl);
      }
    } else {
      toast.error(result.error || "فشل تحميل الصورة");
    }
    setUploadingImage(false);

    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = async () => {
    setUploadingImage(true);
    const result = await removeMyProfileImage();
    if (result.success) {
      setTempProfileImage(null);
      removeProfileImageStore();
      toast.success("تم حذف صورة الملف الشخصي بنجاح");
    } else {
      toast.error(result.error || "فشل حذف الصورة");
    }
    setUploadingImage(false);
  };

  const handleSave = async () => {
    // Validation
    if (!formData.name?.trim()) {
      toast.error("الاسم مطلوب");
      return;
    }

    setUpdating(true);

    const result = await updateMyProfile({
      name: formData.name,
      country: formData.country,
      major: formData.major,
      faculty: formData.faculty,
      position: formData.position,
    });

    if (result.success) {
      setSuccess(true);
      toast.success("تم تحديث الملف الشخصي بنجاح");

      // Update store with all form data
      updateProfile({
        ...formData,
        ...result.data,
      });

      // Delay to show success animation
      setTimeout(() => {
        setSuccess(false);
        setUpdating(false);
      }, 800);
    } else {
      toast.error(result.error || "فشل تحديث الملف الشخصي");
      setUpdating(false);
    }
  };

  return (
    <Card className="rounded-xl p-4 space-y-6 bg-background">
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold text-white">تفاصيل الملف الشخصي</p>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {/* Profile Image */}
        <div className="flex items-center justify-center">
          <div className="relative">
            {tempProfileImage ? (
              <div className="relative w-56 h-56">
                <Avatar className="w-full h-full">
                  <AvatarImage src={tempProfileImage} alt={formData.name} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-4xl">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                {uploadingImage && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                    <Loader2 className="size-8 animate-spin text-white" />
                  </div>
                )}
                <div className="absolute bottom-2 right-2 flex gap-2">
                  <Button
                    type="button"
                    size="icon"
                    variant="secondary"
                    className="rounded-full h-10 w-10"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                  >
                    <Camera className="size-4" />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    className="rounded-full h-10 w-10"
                    onClick={handleRemoveImage}
                    disabled={uploadingImage}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <Card
                className="rounded-2xl border bg-card w-56 h-56 grid place-items-center cursor-pointer hover:bg-card/80 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="text-center space-y-2">
                  {uploadingImage ? (
                    <Loader2 className="size-12 mx-auto animate-spin" />
                  ) : (
                    <>
                      <ImagePlus className="size-12 mx-auto" />
                      <p className="text-sm text-white/90">أرفق صورة</p>
                    </>
                  )}
                </div>
              </Card>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-white">الإسم *</Label>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="bg-card rounded-xl text-white"
              placeholder="أدخل اسمك"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white">البريد الإلكتروني</Label>
              <Input
                value={profile.email || ""}
                disabled
                className="bg-card rounded-xl text-white opacity-60 cursor-not-allowed"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white">رقم الهاتف</Label>
              <Input
                value={profile.phone || ""}
                disabled
                className="bg-card rounded-xl text-white opacity-60 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white">المنصب</Label>
              <Input
                value={formData.position}
                onChange={(e) =>
                  setFormData({ ...formData, position: e.target.value })
                }
                className="bg-card rounded-xl text-white"
                placeholder="أدخل منصبك"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white">الدولة</Label>
              <Input
                value={formData.country}
                onChange={(e) =>
                  setFormData({ ...formData, country: e.target.value })
                }
                className="bg-card rounded-xl text-white"
                placeholder="أدخل دولتك"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white">التخصص</Label>
              <Input
                value={formData.major}
                onChange={(e) =>
                  setFormData({ ...formData, major: e.target.value })
                }
                className="bg-card rounded-xl text-white"
                placeholder="أدخل تخصصك"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white">الجامعة</Label>
              <Input
                value={formData.faculty}
                onChange={(e) =>
                  setFormData({ ...formData, faculty: e.target.value })
                }
                className="bg-card rounded-xl text-white"
                placeholder="أدخل جامعتك"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-4 border-t border-border">
        <Button
          type="button"
          onClick={handleSave}
          disabled={updating}
          className={`rounded-xl transition-all ${
            success ? "bg-green-600 hover:bg-green-600" : ""
          }`}
        >
          {success ? (
            <Check className="size-4 me-2 animate-in zoom-in duration-300" />
          ) : updating ? (
            <Loader2 className="size-4 me-2 animate-spin" />
          ) : (
            <Check className="size-4 me-2" />
          )}
          {success ? "تم الحفظ" : "حفظ التغييرات"}
        </Button>
      </div>
    </Card>
  );
}
