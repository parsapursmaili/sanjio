"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  MoreVertical,
  Edit3,
  Trash2,
  BarChart2,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns-jalali";

const getStatusStyles = (status: string) => {
  switch (status) {
    case "published":
      return {
        bg: "bg-emerald-500/10",
        text: "text-emerald-600 dark:text-emerald-400",
        border: "border-emerald-500/20",
        label: "منتشر شده",
      };
    case "draft":
      return {
        bg: "bg-amber-500/10",
        text: "text-amber-600 dark:text-amber-400",
        border: "border-amber-500/20",
        label: "پیش‌نویس",
      };
    default:
      return {
        bg: "bg-slate-500/10",
        text: "text-slate-600",
        border: "border-slate-500/20",
        label: "نامشخص",
      };
  }
};

interface ExamCardProps {
  exam: any;
  index: number;
}

export function ExamCard({ exam, index }: ExamCardProps) {
  const status = getStatusStyles(exam.status);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group relative flex flex-col rounded-2xl border border-border/50 bg-card hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 overflow-hidden"
    >
      {/* Top Decoration */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/0 to-transparent group-hover:via-primary/60 transition-all duration-500" />

      {/* Header */}
      <div className="p-5 pb-2 flex justify-between items-start">
        <div
          className={`px-3 py-1 rounded-full text-[11px] font-bold border flex items-center gap-1.5 ${status.bg} ${status.text} ${status.border}`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              exam.status === "published" ? "bg-emerald-500" : "bg-amber-500"
            }`}
          />
          {status.label}
        </div>

        <DropdownMenu dir="rtl">
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 -ml-2 text-muted-foreground/60 hover:text-foreground hover:bg-muted/50 rounded-full transition-colors"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-44 rounded-xl shadow-lg border-border/60 bg-background/95 backdrop-blur-md"
          >
            <DropdownMenuItem asChild>
              <Link
                href={`/dashboard/exams/${exam.id}/questions`}
                className="cursor-pointer flex w-full items-center gap-2 py-2.5"
              >
                <Edit3 className="h-4 w-4 text-primary" />
                <span className="font-medium">ویرایش محتوا</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href={`/exam/${exam.id}`}
                target="_blank"
                className="cursor-pointer flex w-full items-center gap-2 py-2.5"
              >
                <Eye className="h-4 w-4" />
                <span className="font-medium">مشاهده پیش‌نمایش</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer flex items-center gap-2 py-2.5">
              <Trash2 className="h-4 w-4" />
              <span>حذف آزمون</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Content */}
      <div className="p-5 pt-2 flex-1 flex flex-col">
        <Link
          href={`/dashboard/exams/${exam.id}/questions`}
          className="block group-hover:text-primary transition-colors duration-300"
        >
          <h3 className="font-bold text-lg leading-tight mb-2 line-clamp-1 text-foreground/90">
            {exam.title}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground/80 line-clamp-2 mb-6 h-10 leading-relaxed font-light">
          {exam.description || "توضیحات تکمیلی برای این آزمون ثبت نشده است."}
        </p>

        {/* Footer Info */}
        <div className="mt-auto flex items-center gap-3 text-xs font-medium text-muted-foreground border-t border-border/40 pt-4">
          <div className="flex items-center gap-1.5 bg-muted/40 px-2.5 py-1.5 rounded-lg text-foreground/70">
            <Clock className="w-3.5 h-3.5 opacity-70" />
            <span dir="rtl">
              {exam.duration_minutes
                ? `${exam.duration_minutes} دقیقه`
                : "بی‌نهایت"}
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-1">
            <Calendar className="w-3.5 h-3.5 opacity-70" />
            <span dir="ltr" suppressHydrationWarning>
              {formatDistanceToNow(new Date(exam.created_at))} پیش
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
