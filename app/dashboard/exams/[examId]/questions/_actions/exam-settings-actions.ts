"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function toggleNegativeMarkingAction(
  examId: string,
  newState: boolean
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("exams")
    .update({ has_negative_marking: newState })
    .eq("id", examId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/dashboard/exams/${examId}/questions`);
}
export async function updateExamDurationAction(
  examId: string,
  duration: number
) {
  const supabase = await createClient();
  console.log("salam");
  const { error } = await supabase
    .from("exams")
    .update({ duration_minutes: duration })
    .eq("id", examId);

  if (error) {
    throw new Error("خطا در بروزرسانی زمان آزمون");
  }

  revalidatePath(`/dashboard/exams/${examId}/questions`);
}
