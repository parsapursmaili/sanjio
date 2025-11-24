import { createClient } from "@/utils/supabase/server";
import { CreateExamDialog } from "./_components/create-exam-dialog";
import { ExamCard } from "./_components/exam-card";
import { Input } from "@/components/ui/input";
import { Search, LayoutGrid, ListFilter } from "lucide-react";
import { Button } from "@/components/ui/button";

// Metadata for SEO
export const metadata = {
  title: "مدیریت آزمون‌ها | سنجیو",
  description: "لیست و مدیریت آزمون‌های ساخته شده توسط شما",
};

export default async function ExamsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch Exams
  const { data: exams, error } = await supabase
    .from("exams")
    .select("*")
    .eq("creator_id", user?.id!)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header Section */}
      <div className="border-b border-border/40 bg-card/30 backdrop-blur-sm sticky top-0 z-10">
        <div className="container max-w-7xl mx-auto p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <h1 className="text-3xl font-black tracking-tight bg-gradient-to-l from-primary to-primary/60 bg-clip-text text-transparent">
                آزمون‌های من
              </h1>
              <p className="text-muted-foreground text-sm md:text-base">
                مدیریت آزمون‌ها، طراحی سوالات و مشاهده نتایج
              </p>
            </div>
            <CreateExamDialog />
          </div>

          {/* Filters & Search Toolbar */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="جستجو در آزمون‌ها..."
                className="pr-10 bg-background border-border/60 focus:bg-card transition-all"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="hidden sm:flex">
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="gap-2 text-muted-foreground">
                <ListFilter className="h-4 w-4" />
                <span>فیلتر</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="container max-w-7xl mx-auto p-6 md:p-8">
        {exams && exams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exams.map((exam, index) => (
              <ExamCard key={exam.id} exam={exam} index={index} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in-95 duration-500">
            <div className="bg-muted/30 p-6 rounded-full mb-6 ring-1 ring-border">
              <LayoutGrid className="h-12 w-12 text-muted-foreground/50" />
            </div>
            <h2 className="text-xl font-semibold mb-2">هیچ آزمونی یافت نشد</h2>
            <p className="text-muted-foreground max-w-md mb-8">
              شما هنوز آزمونی نساخته‌اید. برای شروع روی دکمه زیر کلیک کنید و
              اولین آزمون خود را ایجاد کنید.
            </p>
            <CreateExamDialog />
          </div>
        )}
      </div>
    </div>
  );
}
