"use client";

import { useEffect, useState } from "react";
import { useExamStore } from "@/store/use-exam-store";
import { ExamHeader } from "../_components/exam-header";
import { QuestionCard } from "../_components/question-card";
import { ExamFooter } from "../_components/exam-footer";
import { ExamSidebar } from "../_components/exam-sidebar";
import { Loader2 } from "lucide-react";
import { submitExamAction } from "../_actions/exam-take-actions";
import { toast } from "sonner";

interface Props {
  examId: string;
  initialQuestions: any[];
  startedAt: string;
  durationMinutes: number;
  examTitle: string;
  participationId: string;
}

export function ExamSession({
  examId,
  initialQuestions,
  startedAt,
  durationMinutes,
  examTitle,
  participationId,
}: Props) {
  const { initializeExam, nextQuestion, prevQuestion } = useExamStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    initializeExam(examId, initialQuestions);
    setIsReady(true);
  }, [examId, initialQuestions, initializeExam]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") nextQuestion();
      if (e.key === "ArrowRight") prevQuestion();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextQuestion, prevQuestion]);

  const startTime = new Date(startedAt).getTime();
  const durationMs = durationMinutes * 60 * 1000;
  const expiryTimestamp = new Date(startTime + durationMs);

  const handleExpire = async () => {
    try {
      toast.info("زمان آزمون به پایان رسید.");
      await submitExamAction(participationId);
      window.location.href = "/dashboard";
    } catch (e) {
      console.error(e);
    }
  };

  if (!isReady) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-background gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="text-muted-foreground font-medium">در حال بارگذاری...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20 relative flex flex-col" dir="rtl">
      <ExamHeader
        expiryTimestamp={expiryTimestamp}
        onExpire={handleExpire}
        title={examTitle}
        participationId={participationId}
      />

      <ExamSidebar />

      {/* تغییر حیاتی: حذف container و px-4 برای موبایل */}
      {/* در دسکتاپ (md) پدینگ میدهیم، اما در موبایل تمام عرض است */}
      <main className="flex-1 w-full pt-16 pb-20 md:py-24 md:px-6">
        <QuestionCard />
      </main>

      <ExamFooter />
    </div>
  );
}
