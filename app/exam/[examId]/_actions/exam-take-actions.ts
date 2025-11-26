"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function getExamQuestionsSafe(examId: string) {
  const supabase = await createClient();

  // 1. احراز هویت
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // 2. بررسی مجوز شرکت (اصلاح شده: حذف created_at)
  const { data: participation, error } = await supabase
    .from("participations")
    .select("id, status, started_at") // <--- فقط started_at کافیست
    .eq("exam_id", examId)
    .eq("user_id", user.id)
    .single();

  if (error || !participation) {
    // اگر رکوردی نبود یا ارور داد
    throw new Error(
      "مجوز شرکت در آزمون وجود ندارد. لطفاً ابتدا در صفحه قبل دکمه شروع را بزنید."
    );
  }

  if (participation.status === "finished") {
    throw new Error("شما قبلاً این آزمون را به پایان رسانده‌اید.");
  }

  // 3. دریافت سوالات
  const { data: questions, error: qError } = await supabase
    .from("questions")
    .select("id, question_text, options, score, order_index")
    .eq("exam_id", examId)
    .order("order_index", { ascending: true });

  if (qError) {
    throw new Error("خطا در دریافت سوالات آزمون");
  }

  return {
    questions,
    participationId: participation.id,
    startedAt: participation.started_at,
  };
}
export async function submitExamAction(participationId: string) {
  const supabase = await createClient();

  // ثبت زمان پایان و تغییر وضعیت
  const { error } = await supabase
    .from("participations")
    .update({
      status: "finished",
      finished_at: new Date().toISOString(),
    })
    .eq("id", participationId);

  if (error) throw new Error("خطا در ثبت نهایی آزمون");

  // اینجا می‌توانید محاسبه نمره را هم انجام دهید (یا به یک تریگر بسپارید)

  return { success: true };
}
