"use client";

import { useExamStore } from "@/store/use-exam-store";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft } from "lucide-react";

export function ExamFooter() {
  const { nextQuestion, prevQuestion, currentQuestionIndex, questions } =
    useExamStore();

  const isFirst = currentQuestionIndex === 0;
  const isLast = currentQuestionIndex === questions.length - 1;

  return (
    <footer className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-md border-t border-border/50">
      <div className="container max-w-3xl mx-auto flex items-center justify-between">
        <Button
          variant="outline"
          onClick={prevQuestion}
          disabled={isFirst}
          className="w-32"
        >
          <ChevronRight className="w-4 h-4 ml-2" />
          سوال قبلی
        </Button>

        <Button
          onClick={nextQuestion}
          disabled={isLast} // در سوال آخر، دکمه تغییر می‌کند
          className="w-32"
        >
          سوال بعدی
          <ChevronLeft className="w-4 h-4 mr-2" />
        </Button>
      </div>
    </footer>
  );
}
