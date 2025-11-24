import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { QuestionsList } from "./_components/questions-list";
import { CreateQuestionSheet } from "./_components/create-question-sheet";
import {
  ArrowRight,
  Calculator,
  CheckCircle2,
  Database,
  LayoutList,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// تابع کمکی برای بررسی نمرات
const calculateStats = (questions: any[]) => {
  const totalScore = questions.reduce((acc, q) => acc + (q.score || 0), 0);
  const isEqualScoring =
    questions.length > 0 &&
    questions.every((q) => q.score === questions[0].score);
  return { totalScore, isEqualScoring, count: questions.length };
};

export default async function ExamQuestionsPage(props: {
  params: Promise<{ examId: string }>;
}) {
  const params = await props.params;
  const examId = params.examId;
  const supabase = await createClient();

  // 1. Fetch Data
  const { data: exam, error: examError } = await supabase
    .from("exams")
    .select("title, id")
    .eq("id", examId)
    .single();

  if (examError || !exam) notFound();

  // 2. Fetch Questions (Ordered)
  const { data: questions } = await supabase
    .from("questions")
    .select("*")
    .eq("exam_id", examId)
    .order("order_index", { ascending: true }) // استفاده از order_index
    .order("created_at", { ascending: true }); // فال‌بک

  const stats = calculateStats(questions || []);

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b pb-6">
        <div className="space-y-2">
          <Link
            href="/dashboard/exams"
            className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors w-fit"
          >
            <ArrowRight className="w-4 h-4" /> بازگشت به لیست
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            {exam.title}
            <Badge
              variant="outline"
              className="font-normal text-xs px-2 py-0.5"
            >
              طراحی سوال
            </Badge>
          </h1>
        </div>

        {/* دکمه افزودن - حل مشکل سلکت شدن: مطمئن شوید z-index هدر یا المان‌های دیگر روی این دکمه نیفتاده باشد */}
        <div className="relative z-10">
          <CreateQuestionSheet examId={examId} />
        </div>
      </div>

      {/* Stats Grid - آمار و ویژگی‌های درخواستی */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* کارت تعداد */}
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-primary/10 text-primary rounded-lg">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">
                تعداد سوال
              </p>
              <p className="text-2xl font-bold">{stats.count}</p>
            </div>
          </CardContent>
        </Card>

        {/* کارت مجموع نمرات */}
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">
                مجموع نمرات
              </p>
              <p className="text-2xl font-bold">{stats.totalScore}</p>
            </div>
          </CardContent>
        </Card>

        {/* کارت وضعیت نمره‌دهی (ویژگی جدید) */}
        <Card className="col-span-2 md:col-span-2">
          <CardContent className="p-4 flex items-center justify-between h-full">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-lg ${
                  stats.isEqualScoring
                    ? "bg-green-500/10 text-green-600"
                    : "bg-orange-500/10 text-orange-600"
                }`}
              >
                <LayoutList className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold">
                  {stats.isEqualScoring ? "نمره‌دهی یکنواخت" : "نمره‌دهی متغیر"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {stats.isEqualScoring
                    ? `هر سوال ${questions?.[0]?.score || 0} نمره دارد.`
                    : "سوالات نمرات متفاوتی دارند."}
                </p>
              </div>
            </div>
            {/* اینجا می‌توان بعداً دکمه‌ای برای یکسان‌سازی نمرات گذاشت */}
            {stats.isEqualScoring && (
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Questions List */}
      {!questions || questions.length === 0 ? (
        <div className="text-center py-20 bg-muted/20 rounded-xl border border-dashed flex flex-col items-center justify-center">
          <div className="bg-background p-4 rounded-full mb-4 shadow-sm">
            <Database className="w-8 h-8 text-muted-foreground/50" />
          </div>
          <p className="text-lg font-medium text-foreground">
            هنوز سوالی اضافه نشده است
          </p>
          <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">
            برای شروع طراحی آزمون، روی دکمه "افزودن سوال جدید" در بالای صفحه
            کلیک کنید.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1 text-xs text-muted-foreground">
            <span>لیست سوالات (قابل جابه‌جایی)</span>
            <span>{stats.count} مورد</span>
          </div>
          <QuestionsList questions={questions} examId={examId} />
        </div>
      )}
    </div>
  );
}
