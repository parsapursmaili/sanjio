import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";

// Components
import { QuestionsList } from "./_components/questions-list";
import { CreateQuestionSheet } from "./_components/create-question-sheet";
import { ScoreDistributionCard } from "./_components/score-distribution-card";
import { ExamSettingsControl } from "./_components/exam-settings-control";
import { ExamDurationControl } from "./_components/exam-duration-control";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Icons
import {
  ArrowRight,
  Calculator,
  Database,
  FileEdit,
  Layers,
  LayoutDashboard,
  Sparkles,
} from "lucide-react";

// Helper: محاسبه آمار سوالات
const calculateStats = (questions: any[]) => {
  const count = questions.length;
  const totalScore = questions.reduce((acc, q) => acc + (q.score || 0), 0);

  if (count === 0)
    return { totalScore, isEqualScoring: true, count, firstScore: 0 };

  const firstScore = questions[0].score;
  const isEqualScoring = questions.every((q) => q.score === firstScore);

  return { totalScore, isEqualScoring, count, firstScore };
};

export default async function ExamQuestionsPage(props: {
  params: Promise<{ examId: string }>;
}) {
  const params = await props.params;
  const examId = params.examId;
  const supabase = await createClient();

  // 1. دریافت اطلاعات آزمون (شامل duration_minutes)
  const { data: exam, error: examError } = await supabase
    .from("exams")
    .select("title, id, has_negative_marking, duration_minutes")
    .eq("id", examId)
    .single();

  if (examError || !exam) notFound();

  // 2. دریافت لیست سوالات
  const { data: questions } = await supabase
    .from("questions")
    .select("*")
    .eq("exam_id", examId)
    .order("order_index", { ascending: true })
    .order("created_at", { ascending: true });

  const stats = calculateStats(questions || []);

  return (
    // Container: پدینگ کمتر در موبایل (px-3) برای استفاده حداکثری از فضا
    <div className="w-full max-w-5xl mx-auto py-5 px-3 sm:px-6 space-y-6 sm:space-y-8">
      {/* === Header Section === */}
      <div className="relative overflow-hidden rounded-2xl border bg-card p-5 sm:p-8 shadow-sm transition-all">
        {/* Background Decoration - سایز کوچک‌تر در موبایل */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 sm:w-64 sm:h-64 rounded-full bg-primary/5 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 sm:w-64 sm:h-64 rounded-full bg-blue-500/5 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col gap-6">
          {/* Top Row: Back Link & Title */}
          <div className="space-y-4">
            <Link
              href="/dashboard/exams"
              className="text-xs sm:text-sm text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors w-fit group"
            >
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
              بازگشت به لیست
            </Link>

            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                  <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight text-foreground line-clamp-1">
                    {exam.title}
                  </h1>
                  <Badge
                    variant="secondary"
                    className="font-normal text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border-primary/20"
                  >
                    <FileEdit className="w-3 h-3 mr-1" />
                    طراحی سوال
                  </Badge>
                </div>
                <p className="text-muted-foreground text-xs sm:text-sm max-w-xl">
                  مدیریت سوالات، تنظیم زمان‌بندی و نمره‌دهی آزمون.
                </p>
              </div>

              {/* Action Button - در موبایل تمام عرض */}
              <div className="w-full sm:w-auto">
                <CreateQuestionSheet examId={examId} />
              </div>
            </div>
          </div>

          <Separator className="bg-border/60" />

          {/* Bottom Row: Controls */}
          {/* در موبایل کنترل‌ها با فاصله کم کنار هم قرار می‌گیرند (scroll-x حذف شد) */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <ExamDurationControl
              examId={examId}
              initialDuration={exam.duration_minutes}
            />

            <div className="h-6 w-px bg-border hidden sm:block" />

            <ExamSettingsControl
              examId={examId}
              initialState={exam.has_negative_marking || false}
            />
          </div>
        </div>
      </div>

      {/* === Statistics Grid === */}
      {/* در موبایل 2 ستون، در دسکتاپ 4 ستون - برای فشردگی بهتر */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {/* کارت تعداد سوالات */}
        <Card className="bg-card/50 hover:bg-card transition-colors border-muted/60 shadow-sm">
          <CardContent className="p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="p-2 sm:p-3 bg-background border shadow-sm rounded-lg sm:rounded-xl text-foreground shrink-0">
              <Database className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-muted-foreground font-medium mb-0.5">
                تعداد سوالات
              </p>
              <p className="text-lg sm:text-2xl font-bold tracking-tight">
                {stats.count}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* کارت مجموع نمرات */}
        <Card className="bg-card/50 hover:bg-card transition-colors border-muted/60 shadow-sm">
          <CardContent className="p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="p-2 sm:p-3 bg-blue-500/10 text-blue-600 border border-blue-100/10 rounded-lg sm:rounded-xl shadow-sm shrink-0">
              <Calculator className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-muted-foreground font-medium mb-0.5">
                مجموع نمرات
              </p>
              <p className="text-lg sm:text-2xl font-bold tracking-tight text-blue-600 dark:text-blue-400">
                {stats.totalScore}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* کارت پیشرفته توزیع نمرات (2 ستون اشغال می‌کند) */}
        <div className="col-span-2">
          <ScoreDistributionCard
            examId={examId}
            totalScore={stats.totalScore}
            isEqualScoring={stats.isEqualScoring}
            firstQuestionScore={stats.firstScore}
          />
        </div>
      </div>

      {/* === Questions List Section === */}
      <div className="space-y-4">
        {/* List Header */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <div className="h-5 sm:h-6 w-1 bg-gradient-to-b from-primary to-violet-500 rounded-full"></div>
            <h3 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
              <LayoutDashboard className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
              لیست سوالات
            </h3>
          </div>

          {stats.count > 1 && (
            <Badge
              variant="outline"
              className="hidden sm:flex text-[10px] font-normal text-muted-foreground bg-background/50 backdrop-blur-sm"
            >
              <Layers className="w-3 h-3 mr-1" />
              برای تغییر ترتیب، سوالات را بکشید
            </Badge>
          )}
        </div>

        {/* Content */}
        {!questions || questions.length === 0 ? (
          <div className="text-center py-16 sm:py-24 bg-muted/20 rounded-2xl border-2 border-dashed border-muted-foreground/10 flex flex-col items-center justify-center group hover:border-primary/20 transition-all duration-300 mx-1">
            <div className="bg-background p-4 sm:p-6 rounded-full mb-4 shadow-sm ring-1 ring-border group-hover:scale-110 transition-transform duration-300">
              <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-muted-foreground/40 group-hover:text-primary/60 transition-colors" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">
              هنوز سوالی ثبت نشده است
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed px-4">
              بانک سوالات خالی است. از دکمه
              <span className="text-primary font-medium mx-1">
                "افزودن سوال جدید"
              </span>
              استفاده کنید.
            </p>
          </div>
        ) : (
          <QuestionsList questions={questions} examId={examId} />
        )}
      </div>
    </div>
  );
}
