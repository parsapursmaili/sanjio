import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import DashboardShell from "./dashboard-shell";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "داشبورد | سنجیو",
  description: "پنل مدیریت آزمون و عملکرد تحصیلی",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // 1. Check User Session
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  // 2. Fetch Profile Data (Optional: for showing name/avatar)
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    // پاس دادن اطلاعات کاربر به پوسته کلاینت
    <DashboardShell user={user} profile={profile}>
      {children}
    </DashboardShell>
  );
}
