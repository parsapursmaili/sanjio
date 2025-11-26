"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Clock,
  AlertTriangle,
  FileText,
  CheckCircle2,
  Calendar,
  Play,
  ArrowLeft,
  ShieldCheck,
  Wifi,
} from "lucide-react";
import { format } from "date-fns-jalali";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  startExamAction,
  type ExamPublicData,
} from "../_actions/exam-public-actions";

interface Props {
  exam: ExamPublicData;
}

export function ExamIntroCard({ exam }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isAccepted, setIsAccepted] = useState(false);

  const handleStart = () => {
    if (!isAccepted) {
      toast.error("لطفاً قوانین آزمون را مطالعه و تایید کنید.");
      return;
    }

    startTransition(async () => {
      try {
        const result = await startExamAction(exam.id);
        if (result.success) {
          toast.success("آزمون با موفقیت شروع شد. موفق باشید!");
          router.push(`/exam/${exam.id}/take`); // ریدایرکت به صفحه سوالات
        }
      } catch (error) {
        toast.error("خطا در شروع آزمون. لطفاً مجدد تلاش کنید.");
      }
    });
  };

  // وضعیت دکمه بر اساس زمان و وضعیت کاربر
  const getActionButton = () => {
    if (exam.participation_status === "finished") {
      return (
        <Button
          variant="outline"
          className="w-full gap-2"
          onClick={() => router.push("/dashboard")}
        >
          <CheckCircle2 className="w-4 h-4 text-green-500" />
          شما در این آزمون شرکت کرده‌اید
        </Button>
      );
    }
    if (exam.participation_status === "in_progress") {
      return (
        <Button
          className="w-full gap-2"
          onClick={() => router.push(`/exam/${exam.id}/take`)}
        >
          <Play className="w-4 h-4" />
          ادامه آزمون
        </Button>
      );
    }
    if (exam.status === "upcoming") {
      return (
        <Button disabled variant="secondary" className="w-full">
          آزمون هنوز شروع نشده است
        </Button>
      );
    }
    if (exam.status === "expired") {
      return (
        <Button disabled variant="destructive" className="w-full opacity-80">
          زمان آزمون به پایان رسیده است
        </Button>
      );
    }

    return (
      <div className="space-y-4 w-full">
        {/* Agreement Checkbox Custom UI */}
        <div
          onClick={() => setIsAccepted(!isAccepted)}
          className={cn(
            "flex items-start gap-3 p-3 rounded-lg border border-transparent transition-all cursor-pointer select-none",
            isAccepted ? "bg-primary/5 border-primary/20" : "hover:bg-muted/50"
          )}
        >
          <div
            className={cn(
              "w-5 h-5 rounded border flex items-center justify-center mt-0.5 transition-colors",
              isAccepted
                ? "bg-primary border-primary text-primary-foreground"
                : "border-muted-foreground/30"
            )}
          >
            {isAccepted && <CheckCircle2 className="w-3.5 h-3.5" />}
          </div>
          <p className="text-xs text-muted-foreground leading-5">
            تایید می‌کنم که از{" "}
            <span className="text-foreground font-medium">اینترنت پایدار</span>{" "}
            استفاده می‌کنم و قوانین مربوط به تقلب را مطالعه کرده‌ام.
          </p>
        </div>

        <Button
          className="w-full h-12 text-lg font-medium shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
          onClick={handleStart}
          disabled={isPending || !isAccepted}
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin border-2 border-white/20 border-t-white rounded-full w-5 h-5"></span>
              در حال آماده‌سازی...
            </span>
          ) : (
            <>
              شروع آزمون
              <ArrowLeft className="w-5 h-5 mr-2" />
            </>
          )}
        </Button>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-2xl"
    >
      <Card className="border-border/50 shadow-2xl backdrop-blur-xl bg-card/80 overflow-hidden">
        {/* Header Section with Gradient */}
        <div className="relative h-32 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 flex flex-col justify-end">
          <div className="absolute top-4 left-4">
            <Badge
              variant={exam.status === "active" ? "default" : "secondary"}
              className="px-3 py-1"
            >
              {exam.status === "active"
                ? "در حال برگزاری"
                : exam.status === "upcoming"
                ? "آینده"
                : "به پایان رسیده"}
            </Badge>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
            {exam.title}
          </h1>
        </div>

        <CardContent className="p-6 md:p-8 space-y-8">
          {/* Description */}
          {exam.description && (
            <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
              {exam.description}
            </p>
          )}

          {/* Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <InfoItem
              icon={<Clock className="w-5 h-5 text-blue-500" />}
              label="مدت زمان"
              value={`${exam.duration_minutes} دقیقه`}
            />
            <InfoItem
              icon={<FileText className="w-5 h-5 text-purple-500" />}
              label="تعداد سوال"
              value={`${exam.question_count} سوال`}
            />
            <InfoItem
              icon={<AlertTriangle className="w-5 h-5 text-orange-500" />}
              label="نمره منفی"
              value={exam.has_negative_marking ? "دارد (۱/۳)" : "ندارد"}
            />
            <InfoItem
              icon={<Calendar className="w-5 h-5 text-pink-500" />}
              label="تاریخ برگزاری"
              value={
                exam.start_time
                  ? format(new Date(exam.start_time), "d MMMM")
                  : "نامشخص"
              }
            />
          </div>

          <Separator className="bg-border/50" />

          {/* System Check List */}
          <div className="bg-muted/30 rounded-xl p-4 border border-border/50">
            <h3 className="text-sm font-semibold flex items-center gap-2 mb-3 text-foreground">
              <ShieldCheck className="w-4 h-4 text-primary" />
              پیش‌نیازهای فنی
            </h3>
            <ul className="space-y-2">
              <CheckItem text="از مرورگر Chrome یا Firefox به‌روز استفاده کنید." />
              <CheckItem text="فیلترشکن (VPN) خود را ترجیحاً خاموش کنید." />
              <CheckItem text="پس از شروع، از صفحه خارج نشوید (تایمر متوقف نمی‌شود)." />
            </ul>
          </div>
        </CardContent>

        <CardFooter className="p-6 md:p-8 pt-0 flex flex-col gap-4">
          {getActionButton()}
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground/60">
            <Wifi className="w-3 h-3" />
            اتصال شما امن و رمزنگاری شده است
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

// Sub-components for cleaner code
function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-muted/20 border border-border/30 hover:bg-muted/40 transition-colors text-center group">
      <div className="mb-2 p-2 rounded-full bg-background shadow-sm group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <span className="text-xs text-muted-foreground mb-1">{label}</span>
      <span className="text-sm font-bold text-foreground">{value}</span>
    </div>
  );
}

function CheckItem({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-2 text-xs text-muted-foreground">
      <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
      {text}
    </li>
  );
}
