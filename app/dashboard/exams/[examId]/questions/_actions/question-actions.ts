"use server";

import { createClient } from "@/utils/supabase/server";
import { questionSchema } from "@/lib/validations/question";
import { revalidatePath } from "next/cache";

export async function createQuestionAction(examId: string, data: any) {
  const supabase = await createClient();

  // 1. اعتبارسنجی داده‌ها
  const validated = questionSchema.safeParse(data);

  if (!validated.success) {
    return {
      error: "اطلاعات ورودی نامعتبر است",
      details: validated.error.flatten(),
    };
  }

  const { text, score, options, correctOptionIndex } = validated.data;

  // تبدیل ایندکس رشته‌ای به عدد
  const correctIdx = parseInt(correctOptionIndex);

  // 2. فرمت کردن گزینه‌ها (ایجاد آیدی برای فرانت‌اند ولی ذخیره عدد در دیتابیس)
  // نکته: ما آیدی یونیک برای هر گزینه تولید می‌کنیم تا در JSON ذخیره شود
  const formattedOptions = options.map((opt) => ({
    id: crypto.randomUUID(),
    text: opt.text,
  }));

  // 3. درج در دیتابیس
  // نکته مهم: correct_option_id در دیتابیس شما Integer است (0, 1, 2...)
  const { error } = await supabase.from("questions").insert({
    exam_id: examId,
    question_text: text,
    score: score,
    options: formattedOptions, // آرایه JSON
    correct_option_id: correctIdx, // عدد (ایندکس) بجای UUID
  });

  if (error) {
    console.error("❌ Database Error:", error);
    return { error: "خطا در ذخیره سوال. لطفاً ورودی‌ها را بررسی کنید." };
  }

  revalidatePath(`/dashboard/exams/${examId}/questions`);
  return { success: true, message: "سوال با موفقیت ثبت شد." };
}

export async function deleteQuestionAction(examId: string, questionId: string) {
  const supabase = await createClient();
  await supabase.from("questions").delete().eq("id", questionId);
  revalidatePath(`/dashboard/exams/${examId}/questions`);
  return { success: true, message: "حذف شد" };
}
export async function updateQuestionAction(
  questionId: string,
  examId: string,
  data: any
) {
  const supabase = await createClient();

  // حذف id از دیتا برای جلوگیری از تغییر کلید اصلی
  const { id, ...updateData } = data;

  const { error } = await supabase
    .from("questions")
    .update({
      ...updateData,
      options: data.options, // اطمینان از ذخیره JSONB
    })
    .eq("id", questionId);

  if (error) return { error: error.message };

  revalidatePath(`/dashboard/exams/${examId}/questions`);
  return { message: "سوال با موفقیت ویرایش شد." };
}

export async function reorderQuestionsAction(
  examId: string,
  items: { id: string; order_index: number }[]
) {
  const supabase = await createClient();

  // برای پرفورمنس بهتر می‌توان از RPC استفاده کرد، اما فعلاً با Loop ساده انجام می‌دهیم
  // در پروداکشن بهتر است از یک کوئری واحد استفاده شود
  for (const item of items) {
    await supabase
      .from("questions")
      .update({ order_index: item.order_index })
      .eq("id", item.id);
  }

  revalidatePath(`/dashboard/exams/${examId}/questions`);
  return { message: "ترتیب سوالات ذخیره شد." };
}
