"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Camera, User, Mail, Save } from "lucide-react";
import { useRouter } from "next/navigation";

const profileSchema = z.object({
  full_name: z.string().min(3, "نام باید حداقل ۳ حرف باشد").max(50),
  email: z.string().email().readonly(),
});

export function SettingsForm({ user, profile }: { user: any; profile: any }) {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // --- مدیریت هوشمند کش ---
  // ما از "زمان آخرین آپدیت" به عنوان نسخه عکس استفاده می‌کنیم.
  // وقتی صفحه لود میشه، از دیتابیس میاد. وقتی آپلود میکنیم، خودمون دستی آپدیتش میکنیم.
  const [avatarVersion, setAvatarVersion] = useState(
    profile?.updated_at
      ? new Date(profile.updated_at).getTime()
      : new Date().getTime()
  );

  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    profile?.avatar_url
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: profile?.full_name || "",
      email: user?.email || "",
    },
  });

  const compressImage = async (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_SIZE = 300;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_SIZE) {
              height *= MAX_SIZE / width;
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width *= MAX_SIZE / height;
              height = MAX_SIZE;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) resolve(blob);
              else reject(new Error("خطا در فشرده‌سازی تصویر"));
            },
            "image/jpeg",
            0.85
          );
        };
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files || event.target.files.length === 0) return;
    const originalFile = event.target.files[0];

    if (originalFile.size > 5 * 1024 * 1024) {
      toast.error("حجم فایل اصلی نباید بیشتر از ۵ مگابایت باشد");
      return;
    }

    try {
      setUploading(true);
      toast.info("در حال پردازش و آپلود...");

      const compressedBlob = await compressImage(originalFile);
      const compressedFile = new File([compressedBlob], "avatar.jpg", {
        type: "image/jpeg",
      });

      const filePath = `${user.id}/avatar.jpg`;

      // 1. آپلود با کش طولانی (۱ سال)
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, compressedFile, {
          upsert: true,
          contentType: "image/jpeg",
          cacheControl: "31536000", // <--- کش برای یک سال (خیالت راحت باشه)
        });

      if (uploadError) throw uploadError;

      // 2. گرفتن لینک
      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath);

      // 3. آپدیت دیتابیس
      const newTimestamp = new Date().toISOString();
      const { error: dbError } = await supabase
        .from("profiles")
        .update({
          avatar_url: publicUrl,
          updated_at: newTimestamp, // تاریخ رو آپدیت میکنیم که کش باستر کار کنه
        })
        .eq("id", user.id);

      if (dbError) throw dbError;

      // 4. آپدیت استیت‌ها برای نمایش آنی
      setAvatarUrl(publicUrl);

      // *** جادوی اصلی اینجاست ***
      // با تغییر این عدد، لینک عکس عوض میشه (بدون تغییر فایل) و مرورگر مجبور میشه دوباره دانلود کنه
      setAvatarVersion(new Date().getTime());

      toast.success("عکس پروفایل تغییر کرد");
      router.refresh(); // رفرش کردن هدر سایت
    } catch (error: any) {
      console.error(error);
      toast.error("خطا: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: data.full_name,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;
      toast.success("اطلاعات ذخیره شد");
      router.refresh();
    } catch (error) {
      toast.error("خطا در ذخیره نام");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6 pb-6 border-b border-border">
        <div className="relative group">
          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-background ring-2 ring-border bg-muted flex items-center justify-center relative shadow-sm">
            {avatarUrl ? (
              <img
                // ترکیب URL اصلی با ورژن (تایم‌استمپ)
                // مثال: .../avatar.jpg?v=1715423000
                src={`${avatarUrl}?v=${avatarVersion}`}
                alt="Avatar"
                className="w-full h-full object-cover"
                // کلید هم عوض میشه تا ری‌اکت کامپوننت رو از اول بسازه
                key={`${avatarUrl}-${avatarVersion}`}
              />
            ) : (
              <User className="w-12 h-12 text-muted-foreground/50" />
            )}

            {uploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
            )}
          </div>

          <label className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full cursor-pointer hover:bg-primary/90 transition-all shadow-lg hover:scale-105 active:scale-95 z-10">
            <Camera size={18} />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              disabled={uploading}
            />
          </label>
        </div>

        <div className="flex-1 text-center sm:text-right space-y-2 pt-2">
          <h3 className="font-semibold text-foreground">عکس پروفایل</h3>
          <p className="text-sm text-muted-foreground">
            تصویر شما به صورت خودکار بهینه می‌شود.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            نام کامل
          </label>
          <input
            {...register("full_name")}
            className="w-full p-2.5 bg-muted/30 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          />
          {errors.full_name && (
            <p className="text-xs text-destructive mt-1">
              {errors.full_name.message as string}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">ایمیل</label>
          <input
            {...register("email")}
            disabled
            className="w-full p-2.5 bg-muted/50 border border-border/50 rounded-xl text-muted-foreground cursor-not-allowed text-left dir-ltr"
          />
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <button
          type="submit"
          disabled={loading || uploading}
          className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 disabled:opacity-50 transition-all shadow-lg shadow-primary/20"
        >
          {loading ? (
            <Loader2 className="animate-spin w-5 h-5" />
          ) : (
            <Save className="w-5 h-5" />
          )}
          <span>ذخیره تغییرات</span>
        </button>
      </div>
    </form>
  );
}
