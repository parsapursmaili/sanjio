"use client";

import { useTransition } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, LayoutList, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { equalizeScoresAction } from "../_actions/question-actions";
import { cn } from "@/lib/utils";

interface ScoreStatsProps {
  examId: string;
  totalScore: number;
  isEqualScoring: boolean;
  firstQuestionScore: number;
}

export function ScoreDistributionCard({
  examId,
  totalScore,
  isEqualScoring,
  firstQuestionScore,
}: ScoreStatsProps) {
  const [isPending, startTransition] = useTransition();

  const handleEqualize = () => {
    startTransition(async () => {
      try {
        await equalizeScoresAction(examId);
        toast.success("نمرات تمام سوالات به ۱ تغییر کرد");
      } catch (error) {
        toast.error("خطا در بروزرسانی نمرات");
      }
    });
  };

  return (
    <Card className="col-span-2 overflow-hidden relative">
      <div
        className={cn(
          "absolute inset-0 opacity-[0.03] pointer-events-none",
          isEqualScoring
            ? "bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-green-500 to-transparent"
            : "bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-orange-500 to-transparent"
        )}
      />
      <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 h-full">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "p-2.5 rounded-xl shadow-sm mt-1 sm:mt-0",
              isEqualScoring
                ? "bg-green-500/10 text-green-600 dark:text-green-400"
                : "bg-orange-500/10 text-orange-600 dark:text-orange-400"
            )}
          >
            {isEqualScoring ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <LayoutList className="w-5 h-5" />
            )}
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-foreground">
              {isEqualScoring ? "نمره‌دهی یکنواخت" : "نمره‌دهی متغیر"}
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-[280px]">
              {isEqualScoring
                ? `تمام سوالات دارای بارم یکسان (${firstQuestionScore} نمره) هستند.`
                : "سوالات نمرات متفاوتی دارند. می‌توانید نمرات را یکسان کنید."}
            </p>
          </div>
        </div>

        {!isEqualScoring && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleEqualize}
            disabled={isPending}
            className="shrink-0 text-xs bg-background/50 hover:bg-background hover:text-primary border-dashed border-primary/30 hover:border-primary transition-all"
          >
            <RefreshCw
              className={cn("w-3.5 h-3.5 mr-1.5", isPending && "animate-spin")}
            />
            یکسان‌سازی (همه ۱ نمره)
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
