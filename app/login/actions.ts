"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export type ActionState = {
  error?: string;
  success?: string;
};

export async function login(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    // ترجمه ارورهای رایج سوپابیس
    let message = "خطا در برقراری ارتباط";
    if (error.message.includes("Invalid login credentials"))
      message = "ایمیل یا رمز عبور اشتباه است";
    return { error: message };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signup(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;

  // اعتبارسنجی سمت سرور (محض اطمینان)
  if (!fullName || fullName.trim().length < 3) {
    return { error: "لطفاً نام و نام خانوادگی معتبر وارد کنید" };
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName, // ذخیره نام در متادیتای کاربر
      },
    },
  });

  if (error) {
    let message = error.message;
    if (message.includes("User already registered"))
      message = "این ایمیل قبلاً ثبت شده است";
    if (message.includes("Password should be at least"))
      message = "رمز عبور باید حداقل ۶ رقم باشد";
    return { error: message };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}
