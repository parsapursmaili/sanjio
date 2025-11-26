"use client";

import { useState } from "react";
// import { useRouter } from 'next/navigation' // <-- حذف شود چون باعث باگ استایل میشود
import { useExamStore } from "@/store/use-exam-store";
import { Button } from "@/components/ui/button";
import { Clock, Menu, LogOut, Loader2, AlertTriangle } from "lucide-react";
import { useTimer } from "react-timer-hook";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { submitExamAction } from "../_actions/exam-take-actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Props {
  expiryTimestamp: Date;
  onExpire: () => void;
  title: string;
  participationId: string;
}

export function ExamHeader({
  expiryTimestamp,
  onExpire,
  title,
  participationId,
}: Props) {
  // const router = useRouter() <-- حذف
  const { questions, answers, toggleSidebar } = useExamStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = questions.length;
  const progress =
    totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;

  const { seconds, minutes, hours } = useTimer({
    expiryTimestamp,
    onExpire,
  });

  const formatTime = (val: number) => val.toString().padStart(2, "0");
  const isLowTime = hours === 0 && minutes < 5;

  const handleFinishExam = async () => {
    setIsSubmitting(true);
    try {
      await submitExamAction(participationId);
      toast.success("آزمون با موفقیت ثبت شد.");

      // FIX: استفاده از window.location برای ریست کامل استایل‌ها هنگام بازگشت به داشبورد
      window.location.href = "/dashboard";
    } catch (error) {
      toast.error("خطا در ثبت آزمون. لطفاً دوباره تلاش کنید.");
      setIsSubmitting(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-white/10 shadow-sm supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-7xl mx-auto h-16 flex items-center justify-between px-4">
        {/* راست: منو و عنوان */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="hover:bg-primary/10 text-muted-foreground hover:text-primary cursor-pointer rounded-xl"
          >
            <Menu className="w-6 h-6" />
          </Button>

          <div className="flex flex-col">
            <h1 className="text-sm font-bold text-foreground truncate max-w-[150px] md:max-w-xs">
              {title}
            </h1>
          </div>
        </div>

        {/* وسط: تایمر */}
        <div
          className={cn(
            "hidden md:flex items-center gap-3 px-4 py-1.5 rounded-2xl border transition-all duration-500",
            isLowTime
              ? "bg-red-500/10 text-red-600 border-red-500/30 animate-pulse"
              : "bg-secondary/50 text-foreground border-border/50"
          )}
        >
          <Clock className="w-4 h-4" />
          <span className="font-mono font-bold text-lg tracking-widest pt-0.5">
            {formatTime(hours)}:{formatTime(minutes)}:{formatTime(seconds)}
          </span>
        </div>

        {/* چپ: دکمه پایان (اصلاح شده) */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              size="sm"
              className="shadow-lg shadow-red-500/20 hover:shadow-red-500/40 transition-all cursor-pointer px-4 rounded-xl"
            >
              <LogOut className="w-4 h-4 ml-2" />
              <span className="font-medium">اتمام آزمون</span>
            </Button>
          </AlertDialogTrigger>

          {/* FIX: اضافه کردن جهت RTL */}
          <AlertDialogContent dir="rtl" className="sm:max-w-[425px] gap-6">
            <AlertDialogHeader className="space-y-3">
              <div className="flex items-center gap-2 text-red-500">
                <AlertTriangle className="w-6 h-6" />
                <AlertDialogTitle className="text-xl">
                  پایان آزمون؟
                </AlertDialogTitle>
              </div>
              <AlertDialogDescription className="text-right text-base leading-relaxed">
                شما به{" "}
                <span className="font-bold text-foreground mx-1">
                  {answeredCount}
                </span>{" "}
                سوال از
                <span className="font-bold text-foreground mx-1">
                  {totalQuestions}
                </span>{" "}
                سوال پاسخ داده‌اید.
                <br />
                آیا از ثبت نهایی اطمینان دارید؟
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-2 sm:gap-0">
              <AlertDialogCancel className="cursor-pointer rounded-xl">
                بازگشت
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleFinishExam}
                className="bg-red-600 hover:bg-red-700 cursor-pointer rounded-xl"
                disabled={isSubmitting}
              >
                {isSubmitting ? "در حال ثبت..." : "بله، پایان آزمون"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* نوار پیشرفت */}
      <div className="absolute bottom-0 left-0 w-full h-[3px] bg-secondary/50">
        <div
          className="h-full bg-primary shadow-[0_0_15px_rgba(var(--primary),0.6)] transition-all duration-700 ease-in-out rounded-r-full"
          style={{ width: `${progress}%` }}
        />
      </div>
    </header>
  );
}
