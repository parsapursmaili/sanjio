"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation"; // اضافه شد
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AlertTriangle, MinusCircle } from "lucide-react";
import { toast } from "sonner";
import { toggleNegativeMarkingAction } from "../_actions/exam-settings-actions";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface ExamSettingsControlProps {
  examId: string;
  initialState: boolean;
}

export function ExamSettingsControl({
  examId,
  initialState,
}: ExamSettingsControlProps) {
  const router = useRouter(); // اضافه شد
  const [enabled, setEnabled] = useState(initialState);
  const [isPending, startTransition] = useTransition();

  const handleToggle = (checked: boolean) => {
    setEnabled(checked);

    startTransition(async () => {
      try {
        await toggleNegativeMarkingAction(examId, checked);
        toast.success(
          checked ? "نمره منفی برای آزمون فعال شد" : "نمره منفی غیرفعال شد"
        );
        router.refresh(); // اضافه شد: دریافت آخرین وضعیت از سرور
      } catch (error) {
        setEnabled(!checked);
        toast.error("خطا در تغییر تنظیمات");
      }
    });
  };

  return (
    <div
      // اضافه شدن onClick برای کلیک روی کل کادر
      onClick={() => !isPending && handleToggle(!enabled)}
      className={cn(
        // اضافه شدن cursor-pointer
        "cursor-pointer flex items-center gap-3 px-4 py-2 rounded-full border transition-all duration-300 select-none group",
        enabled
          ? "bg-rose-50 border-rose-200 shadow-sm dark:bg-rose-950/20 dark:border-rose-900"
          : "bg-background border-border hover:border-primary/30",
        isPending && "opacity-70 cursor-wait"
      )}
    >
      <div dir="ltr" className="flex items-center">
        <Switch
          id="negative-marking"
          checked={enabled}
          onCheckedChange={handleToggle}
          disabled={isPending}
          // جلوگیری از تداخل کلیک سوئیچ با کلیک پدر
          onClick={(e) => e.stopPropagation()}
          className={cn(
            "data-[state=checked]:bg-rose-500",
            isPending && "opacity-50"
          )}
        />
      </div>

      <div className="flex items-center gap-2">
        <Label
          htmlFor="negative-marking"
          className={cn(
            "pointer-events-none text-sm font-medium transition-colors flex items-center gap-1.5", // pointer-events-none added to let parent handle click
            enabled
              ? "text-rose-700 dark:text-rose-400"
              : "text-muted-foreground"
          )}
        >
          {enabled ? (
            <AlertTriangle className="w-4 h-4 animate-in zoom-in duration-300" />
          ) : (
            <MinusCircle className="w-4 h-4" />
          )}
          نمره منفی
        </Label>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className="cursor-help opacity-50 hover:opacity-100 transition-opacity p-0.5"
                onClick={(e) => e.stopPropagation()} // جلوگیری از تریگر شدن تغییر وضعیت با کلیک روی تول‌تیپ
              >
                <div className="w-1 h-1 bg-current rounded-full mb-0.5" />
                <div className="w-1 h-1 bg-current rounded-full mb-0.5" />
                <div className="w-1 h-1 bg-current rounded-full" />
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-xs text-center">
              <p>
                با فعال‌سازی این گزینه، به ازای هر{" "}
                <span className="text-rose-500 font-bold">۳ پاسخ غلط</span>،
                <span className="text-emerald-500 font-bold">
                  {" "}
                  ۱ پاسخ صحیح{" "}
                </span>
                حذف می‌شود.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
