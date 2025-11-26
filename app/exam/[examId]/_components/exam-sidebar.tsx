"use client";

import { useExamStore } from "@/store/use-exam-store";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Flag, CheckCircle2, LayoutGrid, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ExamSidebar() {
  const {
    isSidebarOpen,
    toggleSidebar,
    questions,
    answers,
    flagged,
    currentQuestionIndex,
    goToQuestion,
  } = useExamStore();

  const answeredCount = Object.keys(answers).length;
  const total = questions.length;

  return (
    // تغییر side به right برای فارسی
    <Sheet open={isSidebarOpen} onOpenChange={toggleSidebar}>
      <SheetContent
        side="right"
        className="w-[320px] sm:w-[400px] bg-background/95 backdrop-blur-xl border-l border-border p-0 flex flex-col z-[100]"
      >
        {/* Header - Modern & Clean */}
        <SheetHeader className="px-6 py-5 border-b border-border/40 bg-muted/30">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-lg font-black text-foreground flex items-center gap-2">
              <LayoutGrid className="w-5 h-5 text-primary" />
              نقشه آزمون
            </SheetTitle>
            {/* دکمه بستن کاستوم */}
            <div
              onClick={toggleSidebar}
              className="p-1.5 rounded-full hover:bg-muted cursor-pointer transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </div>
          </div>

          {/* Stats Bar */}
          <div className="flex gap-2 mt-4">
            <div className="flex-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-2 flex flex-col items-center justify-center">
              <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                {answeredCount}
              </span>
              <span className="text-[10px] text-muted-foreground">
                پاسخ‌داده
              </span>
            </div>
            <div className="flex-1 bg-orange-500/10 border border-orange-500/20 rounded-lg p-2 flex flex-col items-center justify-center">
              <span className="text-xl font-bold text-orange-600 dark:text-orange-400">
                {flagged.length}
              </span>
              <span className="text-[10px] text-muted-foreground">
                نشان‌دار
              </span>
            </div>
            <div className="flex-1 bg-secondary border border-border rounded-lg p-2 flex flex-col items-center justify-center">
              <span className="text-xl font-bold text-foreground">
                {total - answeredCount}
              </span>
              <span className="text-[10px] text-muted-foreground">
                باقی‌مانده
              </span>
            </div>
          </div>
        </SheetHeader>

        {/* Scrollable Question Grid */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <div className="grid grid-cols-5 gap-3">
            {questions.map((q, idx) => {
              const isAnswered = answers[q.id] !== undefined;
              const isFlagged = flagged.includes(q.id);
              const isCurrent = currentQuestionIndex === idx;

              return (
                <button
                  key={q.id}
                  onClick={() => {
                    goToQuestion(idx);
                    toggleSidebar();
                  }}
                  className={cn(
                    "relative aspect-square flex flex-col items-center justify-center rounded-xl text-sm font-bold transition-all duration-300 shadow-sm hover:shadow-md active:scale-95",
                    isCurrent
                      ? "bg-foreground text-background ring-4 ring-primary/20 z-10 scale-110"
                      : isAnswered
                      ? "bg-primary text-primary-foreground shadow-primary/20"
                      : "bg-card border border-border hover:border-primary/50 hover:bg-muted",
                    isFlagged &&
                      !isCurrent &&
                      "ring-2 ring-orange-400 ring-offset-1 bg-orange-50 dark:bg-orange-900/20 text-orange-600"
                  )}
                >
                  {idx + 1}

                  {isFlagged && (
                    <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                  )}
                  {isAnswered && !isCurrent && (
                    <div className="absolute bottom-1">
                      <CheckCircle2 className="w-3 h-3 text-primary-foreground/70" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
