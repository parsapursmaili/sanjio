"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

// اعتبارسنجی داده‌های ورودی
const CreateExamSchema = z.object({
  title: z
    .string()
    .min(3, { message: "عنوان آزمون باید حداقل ۳ کاراکتر باشد" }),
  description: z.string().optional(),
  type: z.enum(["test", "survey"]).default("test"),
});

export async function createExam(formData: FormData) {
  const supabase = await createClient();

  // دریافت کاربر فعلی
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const rawData = {
    title: formData.get("title"),
    description: formData.get("description"),
    type: formData.get("type"),
  };

  const validatedData = CreateExamSchema.safeParse(rawData);

  if (!validatedData.success) {
    return { error: validatedData.error.flatten().fieldErrors };
  }

  const { error, data } = await supabase
    .from("exams")
    .insert({
      ...validatedData.data,
      creator_id: user.id,
      status: "draft", // پیش‌فرض پیش‌نویس است
    })
    .select()
    .single();

  if (error) {
    return { message: "خطا در ایجاد آزمون" };
  }

  revalidatePath("/dashboard/exams");
  // ریدایرکت به صفحه ویرایش آزمون (برای افزودن سوالات در روزهای آینده)
  redirect(`/dashboard/exams/${data.id}/questions`);
}
