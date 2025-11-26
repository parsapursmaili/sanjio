"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export type ExamPublicData = {
  id: string;
  title: string;
  description: string | null;
  duration_minutes: number | null;
  start_time: string | null;
  end_time: string | null;
  question_count: number;
  has_negative_marking: boolean; // فرض بر این است که این فیلد را اضافه کرده‌اید یا از تنظیمات می‌خوانید
  status: "upcoming" | "active" | "expired";
  participation_status: "none" | "in_progress" | "finished";
};

export async function getExamPublicInfo(
  examId: string
): Promise<ExamPublicData> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // 1. Fetch Exam Details
  const { data: exam, error } = await supabase
    .from("exams")
    .select(
      "id, title, description, start_time, end_time, duration_minutes, questions(count)"
    )
    .eq("id", examId)
    .eq('status', 'published') // فقط آزمون‌های منتشر شده
    .single();

  if (error || !exam) {
    throw new Error("آزمون یافت نشد یا مجوز دسترسی ندارید.");
  }

  // 2. Check Existing Participation
  const { data: participation } = await supabase
    .from("participations")
    .select("status")
    .eq("exam_id", examId)
    .eq("user_id", user.id)
    .single();

  // 3. Calculate Status
  const now = new Date();
  let status: ExamPublicData["status"] = "active";

  if (exam.start_time && new Date(exam.start_time) > now) status = "upcoming";
  if (exam.end_time && new Date(exam.end_time) < now) status = "expired";

  return {
    id: exam.id,
    title: exam.title,
    description: exam.description,
    duration_minutes: exam.duration_minutes,
    start_time: exam.start_time,
    end_time: exam.end_time,
    question_count: exam.questions?.[0]?.count || 0,
    has_negative_marking: true, // موقتا هاردکد شده تا فیلدش را اضافه کنید
    status,
    participation_status: (participation?.status as any) || "none",
  };
}

// اکشن شروع آزمون
export async function startExamAction(examId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // بررسی اینکه قبلا شرکت نکرده باشد
  const { data: existing } = await supabase
    .from("participations")
    .select("id")
    .eq("exam_id", examId)
    .eq("user_id", user.id)
    .single();

  if (existing) {
    // اگر قبلا شروع کرده، فقط ریدایرکت کن
    return { success: true };
  }

  // ایجاد رکورد جدید
  const { error } = await supabase.from("participations").insert({
    user_id: user.id,
    exam_id: examId,
    started_at: new Date().toISOString(),
    status: "in_progress",
  });

  if (error) throw new Error("خطا در شروع آزمون");

  return { success: true };
}
