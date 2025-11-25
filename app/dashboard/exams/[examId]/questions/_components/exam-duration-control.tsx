"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Clock, History, CloudUpload, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { updateExamDurationAction } from "../_actions/exam-settings-actions";
import { toast } from "sonner";

interface ExamDurationControlProps {
  examId: string;
  initialDuration: number | null;
}

const PRESETS = [15, 30, 45, 60, 90, 120];

export function ExamDurationControl({
  examId,
  initialDuration,
}: ExamDurationControlProps) {
  const router = useRouter();

  // State برای مقدار فعلی (نمایش آنی)
  const [duration, setDuration] = useState<number>(initialDuration || 0);

  // وضعیت ذخیره‌سازی برای نمایش آیکون کوچک
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">(
    "idle"
  );
  const [isOpen, setIsOpen] = useState(false);

  // این Ref برای جلوگیری از پرش مقدار هنگام دریافت پراپ جدید از سرور است
  // وقتی ما خودمان مقدار را تغییر دادیم، نباید بلافاصله با مقدار قدیمی سرور بازنویسی شود
  const optimisticUpdate = useRef(false);

  useEffect(() => {
    if (!optimisticUpdate.current) {
      setDuration(initialDuration || 0);
    }
  }, [initialDuration]);

  const handleSave = async (value: number) => {
    // 1. آپدیت آنی UI (Optimistic Update)
    setDuration(value);
    optimisticUpdate.current = true;
    setSaveStatus("saving");

    try {
      // 2. ارسال درخواست به سرور (بدون منتظر نگه داشتن کاربر)
      await updateExamDurationAction(examId, value);

      // 3. موفقیت
      setSaveStatus("saved");
      toast.success(
        value === 0 ? "زمان نامحدود شد" : `زمان به ${value} دقیقه تغییر یافت`,
        { duration: 2000 } // نمایش کوتاه توست
      );

      // رفرش کردن دیتای پشت صحنه
      router.refresh();

      // بعد از کمی تاخیر، وضعیت را ریست کن و اجازه بده پراپ‌های سرور دوباره اعمال شوند
      setTimeout(() => {
        setSaveStatus("idle");
        optimisticUpdate.current = false;
      }, 2000);
    } catch (error) {
      // 4. بازگشت به حالت قبل در صورت خطا (Rollback)
      toast.error("خطا در ذخیره. دوباره تلاش کنید.");
      setDuration(initialDuration || 0);
      setSaveStatus("idle");
      optimisticUpdate.current = false;
    }
  };

  // هندل کردن اسلایدر
  const handleSliderChange = (vals: number[]) => {
    setDuration(vals[0]); // فقط تغییر عدد در UI
  };

  const handleSliderCommit = (vals: number[]) => {
    handleSave(vals[0]); // ذخیره نهایی
  };

  // هندل کردن اینپوت
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val) && val >= 0) setDuration(val);
  };

  const handleInputBlur = () => {
    if (duration !== (initialDuration || 0)) {
      handleSave(duration);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSave(duration);
      setIsOpen(false);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "cursor-pointer flex items-center gap-2 px-3 py-2 rounded-full border transition-all duration-300 text-xs sm:text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 select-none",
            duration > 0
              ? "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-950/20 dark:border-blue-900 dark:text-blue-400"
              : "bg-background border-border hover:border-primary/30 text-muted-foreground hover:text-foreground"
          )}
        >
          {/* مدیریت آیکون‌ها بر اساس وضعیت ذخیره */}
          {saveStatus === "saving" ? (
            <CloudUpload className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-bounce text-blue-500" />
          ) : saveStatus === "saved" ? (
            <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500 animate-in zoom-in" />
          ) : duration > 0 ? (
            <History className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          ) : (
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          )}

          <span className="tabular-nums">
            {duration > 0 ? formatDuration(duration) : "زمان آزمون"}
          </span>

          {/* متن وضعیت کوچک کنار دکمه اگر در حال ذخیره بود */}
          {saveStatus === "saving" && (
            <span className="mr-1 text-[10px] text-muted-foreground opacity-70 animate-pulse">
              ...
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent
        className="w-72 sm:w-80 p-0 overflow-hidden shadow-xl border-muted"
        align="start"
        sideOffset={8}
      >
        {/* هدر */}
        <div className="bg-muted/30 p-3 sm:p-4 border-b flex items-center justify-between">
          <span className="text-xs sm:text-sm font-semibold flex items-center gap-2">
            {saveStatus === "saving" ? (
              <CloudUpload className="w-4 h-4 text-primary animate-pulse" />
            ) : (
              <Clock className="w-4 h-4 text-primary" />
            )}
            تنظیم مدت زمان
          </span>
          {duration > 0 && (
            <Badge
              variant="secondary"
              className="text-[10px] sm:text-xs font-mono"
            >
              {formatDuration(duration)}
            </Badge>
          )}
        </div>

        <div className="p-4 sm:p-5 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <Label className="text-muted-foreground text-xs">دقیقه:</Label>
              <div className="relative w-24">
                <Input
                  type="number"
                  value={duration}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  onKeyDown={handleInputKeyDown}
                  className="h-8 text-center pr-2 pl-6 font-mono text-lg font-bold border-primary/20 focus-visible:ring-primary/20"
                />
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground pointer-events-none">
                  min
                </span>
              </div>
            </div>

            <Slider
              value={[duration]}
              min={0}
              max={180}
              step={5}
              onValueChange={handleSliderChange}
              onValueCommit={handleSliderCommit}
              className="py-2 cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">
              زمان‌های پیشنهادی
            </Label>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant="outline"
                className={cn(
                  "cursor-pointer hover:bg-muted active:scale-95 transition-all py-1.5 px-2.5",
                  duration === 0 && "bg-muted text-foreground"
                )}
                onClick={() => handleSave(0)}
              >
                نامحدود
              </Badge>
              {PRESETS.map((min) => (
                <Badge
                  key={min}
                  variant={duration === min ? "default" : "outline"}
                  className={cn(
                    "cursor-pointer transition-all active:scale-95 py-1.5 px-2.5",
                    duration === min
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "hover:bg-muted text-muted-foreground"
                  )}
                  onClick={() => handleSave(min)}
                >
                  {min}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function formatDuration(minutes: number): string {
  if (minutes === 0) return "نامحدود";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0 && m > 0) return `${h} ساعت و ${m} دقیقه`;
  if (h > 0) return `${h} ساعت`;
  return `${m} دقیقه`;
}
