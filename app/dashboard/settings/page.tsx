import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { SettingsForm } from "./settings-form"; // این کامپوننت رو پایین‌تر کدش رو میدم
import { User, Camera } from "lucide-react";

export default async function SettingsPage() {
  const supabase = await createClient();

  // گرفتن اطلاعات کاربر
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <SettingsIcon className="w-8 h-8 text-primary" />
          تنظیمات حساب کاربری
        </h2>
        <p className="text-muted-foreground mt-2 text-lg">
          اطلاعات شخصی و پروفایل عمومی خود را مدیریت کنید.
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm">
        <SettingsForm user={user} profile={profile} />
      </div>
    </div>
  );
}

function SettingsIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
