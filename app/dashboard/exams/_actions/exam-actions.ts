"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

// اسکیما اعتبارسنجی
const CreateExamSchema = z.object({
  title: z
    .string()
    .min(3, { message: "عنوان باید حداقل ۳ کاراکتر باشد" })
    .max(100),
  description: z.string().optional(),
  type: z.enum(["test", "survey"]).default("test"),
});

export type CreateExamState = {
  errors?: {
    title?: string[];
    description?: string[];
    type?: string[];
  };
  message?: string | null;
};

export async function createExamAction(
  prevState: CreateExamState,
  formData: FormData
) {
  const supabase = await createClient();

  // 1. احراز هویت
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { message: "لطفاً مجدداً وارد شوید." };
  }

  // 2. اعتبارسنجی داده‌ها
  const validatedFields = CreateExamSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    type: formData.get("type"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "لطفاً خطاهای فرم را برطرف کنید.",
    };
  }

  // 3. درج در دیتابیس
  const { data, error } = await supabase
    .from("exams")
    .insert({
      creator_id: user.id,
      title: validatedFields.data.title,
      description: validatedFields.data.description,
      type: validatedFields.data.type,
      status: "draft", // وضعیت پیش‌فرض
    })
    .select("id")
    .single();

  if (error) {
    console.error("Database Error:", error);
    return { message: "خطا در ارتباط با دیتابیس. لطفاً دوباره تلاش کنید." };
  }

  // 4. به‌روزرسانی کش و ریدایرکت به ویرایشگر
  revalidatePath("/dashboard/exams");
  redirect(`/dashboard/exams/${data.id}/questions`);
}
