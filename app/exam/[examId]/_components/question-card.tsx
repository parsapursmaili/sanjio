"use client";

import { useExamStore } from "@/store/use-exam-store";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Flag, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";

export function QuestionCard() {
  const {
    questions,
    currentQuestionIndex,
    answers,
    setAnswer,
    flagged,
    toggleFlag,
  } = useExamStore();

  const question = questions[currentQuestionIndex];
  if (!question) return null;

  const isFlagged = flagged.includes(question.id);
  const selectedOption = answers[question.id];
  const options = Array.isArray(question.options)
    ? question.options
    : JSON.parse(question.options);

  return (
    // کانتینر در دسکتاپ وسط‌چین می‌شود اما در موبایل عرض کامل دارد
    <div className="w-full h-full max-w-[1400px] mx-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="h-full flex flex-col"
        >
          {/* 
             طراحی کارت:
             - موبایل: rounded-none, shadow-none, border-0 (یکپارچه با صفحه)
             - دسکتاپ: rounded-2xl, shadow-sm, border (کارت معلق)
          */}
          <div className="flex flex-col flex-1 bg-background md:rounded-3xl md:border border-border/60 md:shadow-xl overflow-hidden min-h-[calc(100vh-140px)] md:min-h-fit">
            {/* 1. نوار اطلاعات سوال */}
            <div className="px-5 py-4 md:px-8 md:py-6 border-b border-border/40 bg-muted/5 flex items-center justify-between sticky top-16 md:static z-10 backdrop-blur-md">
              <div className="flex items-center gap-3 md:gap-4">
                {/* شماره سوال */}
                <div className="flex items-center justify-center w-9 h-9 md:w-11 md:h-11 rounded-xl bg-primary text-primary-foreground font-bold text-lg md:text-xl shadow-lg shadow-primary/20">
                  {currentQuestionIndex + 1}
                </div>
                {/* متن نوع سوال */}
                <div className="h-8 w-[1px] bg-border mx-1" />
                <span className="text-sm md:text-base font-medium text-muted-foreground">
                  سوال چند گزینه‌ای
                </span>
              </div>

              {/* دکمه نشان‌دار */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleFlag(question.id)}
                className={cn(
                  "rounded-full h-9 md:h-10 px-4 gap-2 transition-all",
                  isFlagged
                    ? "bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-500"
                    : "bg-transparent hover:bg-muted"
                )}
              >
                {isFlagged ? (
                  <Flag className="w-4 h-4 fill-current" />
                ) : (
                  <Bookmark className="w-4 h-4" />
                )}
                <span className="text-xs md:text-sm font-medium">
                  {isFlagged ? "نشان‌دار" : "نشان‌دار کردن"}
                </span>
              </Button>
            </div>

            {/* 2. بدنه و متن سوال */}
            <div className="p-5 md:p-10 lg:p-12">
              <h2 className="text-lg md:text-2xl lg:text-3xl font-medium md:font-bold leading-loose md:leading-10 text-foreground text-justify tracking-tight">
                {question.question_text}
              </h2>
            </div>

            {/* 3. لیست گزینه‌ها */}
            <div className="mt-auto bg-muted/10 border-t border-border/50 p-5 md:p-10 lg:p-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5">
                {options.map((opt: any, index: number) => {
                  const isSelected = selectedOption === index + 1;

                  return (
                    <div
                      key={index}
                      onClick={() => setAnswer(question.id, index + 1)}
                      className={cn(
                        "relative flex items-center p-4 md:p-6 rounded-xl md:rounded-2xl border-2 cursor-pointer transition-all duration-200 active:scale-[0.98]",
                        isSelected
                          ? "bg-primary/5 border-primary shadow-sm z-10"
                          : "bg-card border-border/60 hover:border-primary/30 hover:bg-muted/20"
                      )}
                    >
                      {/* ایندکس گزینه (A, B, C, D یا 1, 2, 3, 4) */}
                      <div
                        className={cn(
                          "w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-sm md:text-base font-bold shrink-0 ml-4 transition-colors",
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {index + 1}
                      </div>

                      {/* متن گزینه */}
                      <span
                        className={cn(
                          "text-base md:text-xl font-medium leading-relaxed",
                          isSelected
                            ? "text-foreground"
                            : "text-muted-foreground group-hover:text-foreground"
                        )}
                      >
                        {opt.text || opt}
                      </span>

                      {/* نوار رنگی نشانگر انتخاب (راست کارت) */}
                      {isSelected && (
                        <div className="absolute right-0 top-3 bottom-3 w-1 bg-primary rounded-l-full" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
