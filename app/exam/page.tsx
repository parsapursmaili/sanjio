import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { format } from "date-fns-jalali";
import {
  ArrowLeft,
  Clock,
  CalendarDays,
  Search,
  Filter,
  Sparkles,
  GraduationCap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

// این خط باعث می‌شود لیست همیشه به‌روز باشد (Cache نشود)
export const dynamic = "force-dynamic";

export default async function ExamListPage() {
  const supabase = await createClient();

  // دریافت لیست آزمون‌های منتشر شده
  const { data: exams } = await supabase
    .from("exams")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4 py-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20 mb-2">
          <Sparkles className="w-3 h-3" />
          <span>فصل آزمون‌های ۱۴۰۴</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">
          مرکز آزمون <span className="text-primary">سنجیو</span>
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto text-lg">
          آزمون مورد نظر خود را انتخاب کنید و مهارت‌های خود را به چالش بکشید.
        </p>
      </div>

      {/* Search & Filters (فعلا نمایشی) */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card/50 backdrop-blur-sm border border-border/50 p-2 rounded-2xl max-w-3xl mx-auto shadow-sm">
        <div className="relative w-full sm:flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="جستجو در آزمون‌ها..."
            className="bg-transparent border-none shadow-none focus-visible:ring-0 pr-10"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl flex-1 sm:flex-none bg-background/50"
          >
            <Filter className="w-4 h-4 ml-2" />
            فیلتر
          </Button>
          <Button size="sm" className="rounded-xl flex-1 sm:flex-none">
            جستجو
          </Button>
        </div>
      </div>

      {/* Grid of Exams */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exams && exams.length > 0 ? (
          exams.map((exam) => (
            <Link
              href={`/exam/${exam.id}`}
              key={exam.id}
              className="group block"
            >
              <Card className="h-full border-border/40 bg-card/40 backdrop-blur-md hover:bg-card/80 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 overflow-hidden flex flex-col">
                {/* Decorative Banner */}
                <div className="h-2 bg-gradient-to-r from-primary/40 via-secondary/40 to-primary/40 group-hover:h-3 transition-all" />

                <div className="p-6 flex flex-col flex-1">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2.5 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-300">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        exam.status === "draft"
                          ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                          : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                      }
                    >
                      {exam.duration_minutes} دقیقه
                    </Badge>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {exam.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-6 flex-1">
                    {exam.description ||
                      "بدون توضیحات تکمیلی. برای مشاهده جزئیات کلیک کنید."}
                  </p>

                  {/* Footer Info */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border/30 pt-4 mt-auto">
                    <div className="flex items-center gap-1.5">
                      <CalendarDays className="w-3.5 h-3.5" />
                      {exam.start_time
                        ? format(new Date(exam.start_time), "d MMMM yyyy")
                        : "بدون تاریخ"}
                    </div>
                    <div className="flex items-center text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
                      ورود
                      <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-center space-y-4 bg-muted/20 rounded-3xl border border-dashed border-border">
            <div className="p-4 rounded-full bg-muted/50">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-medium">هیچ آزمونی یافت نشد</h3>
              <p className="text-sm text-muted-foreground">
                هنوز آزمونی منتشر نشده است. لطفاً از پنل مدیریت آزمون بسازید.
              </p>
            </div>
            <Link href="/dashboard/exams">
              <Button variant="secondary">برو به پنل مدیریت</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
