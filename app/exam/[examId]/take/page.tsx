import { getExamQuestionsSafe } from "../_actions/exam-take-actions";
import { getExamPublicInfo } from "../_actions/exam-public-actions";
import { ExamSession } from "./exam-session";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Home, RefreshCw, ArrowRight } from "lucide-react";

export default async function TakeExamPage({
  params,
}: {
  params: Promise<{ examId: string }>;
}) {
  const { examId } = await params;

  try {
    const [questionsData, examInfo] = await Promise.all([
      getExamQuestionsSafe(examId),
      getExamPublicInfo(examId),
    ]);

    return (
      <ExamSession
        examId={examId}
        initialQuestions={questionsData.questions}
        startedAt={questionsData.startedAt}
        durationMinutes={examInfo.duration_minutes || 60}
        examTitle={examInfo.title}
        participationId={questionsData.participationId} // <--- این خط را حتما اضافه کنید
      />
    );
  } catch (error: any) {
    // اینجا به جای notFound، صفحه خطا را رندر می‌کنیم
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background text-center space-y-6">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-4 animate-in zoom-in duration-300">
          <AlertTriangle className="w-10 h-10 text-red-500" />
        </div>

        <h1 className="text-2xl font-bold text-foreground">
          دسترسی به آزمون امکان‌پذیر نیست
        </h1>

        <div className="max-w-md p-6 bg-card rounded-xl border border-destructive/20 shadow-sm text-sm text-muted-foreground leading-relaxed">
          <p className="mb-2 font-medium text-foreground">متن خطا:</p>
          <code className="bg-muted px-2 py-1 rounded text-xs block mb-4">
            {error.message}
          </code>
          <p>
            این خطا معمولاً زمانی رخ می‌دهد که شما دکمه «شروع آزمون» را در مرحله
            قبل نزده باشید، یا اینکه زمان آزمون به پایان رسیده باشد.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs">
          {/* دکمه حیاتی: بازگشت به صفحه شروع برای کلیک مجدد روی دکمه شروع */}
          <Link href={`/exam/${examId}`} className="w-full">
            <Button className="w-full gap-2" size="lg">
              <RefreshCw className="w-4 h-4" />
              بازگشت و شروع مجدد
            </Button>
          </Link>

          <Link href="/dashboard" className="w-full">
            <Button variant="outline" className="w-full gap-2" size="lg">
              <Home className="w-4 h-4" />
              داشبورد من
            </Button>
          </Link>
        </div>
      </div>
    );
  }
}
