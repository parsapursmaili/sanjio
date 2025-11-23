import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  // 1. اتصال به سوپابیس
  const supabase = await createClient();

  // 2. یک کوئری ساده (مثلاً لیست آزمون‌ها)
  // نگران خالی بودن جدول نباشید، مهم این است که ارور اتصال ندهد
  const { data: exams, error } = await supabase.from("exams").select("*");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-2xl font-bold">تست اتصال به Supabase</h1>

      {error ? (
        <div className="p-4 bg-red-100 text-red-700 rounded">
          ❌ خطا در اتصال: {error.message}
        </div>
      ) : (
        <div className="p-4 bg-green-100 text-green-700 rounded">
          ✅ اتصال با موفقیت برقرار شد!
          <br />
          تعداد آزمون‌های پیدا شده: {exams?.length || 0}
        </div>
      )}
    </div>
  );
}
