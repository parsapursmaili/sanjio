"use client";

import { useActionState, useState } from "react";
import { createExamAction } from "../_actions/exam-actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  Plus,
  Sparkles,
  Type,
  FileText,
  CheckCircle2,
  ListTodo,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function CreateExamDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [state, action, isPending] = useActionState(createExamAction, {
    message: "",
    errors: {},
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="group relative overflow-hidden bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-primary/40 hover:-translate-y-0.5"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:animate-shimmer" />
          <Plus className="w-5 h-5 ml-2" />
          <span className="font-bold">آزمون جدید</span>
        </Button>
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-[500px] border-border/40 bg-background/95 backdrop-blur-xl shadow-2xl p-0 overflow-hidden"
        dir="rtl"
      >
        {/* نوار رنگی بالای مودال */}
        <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-primary/30 via-primary to-primary/30" />

        <div className="p-6 pb-2">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 bg-primary/10 rounded-xl ring-1 ring-primary/20 text-primary shadow-sm">
                <Sparkles className="w-5 h-5" />
              </div>
              <DialogTitle className="text-2xl font-black tracking-tight text-foreground">
                ساخت آزمون جدید
              </DialogTitle>
            </div>
            <DialogDescription className="text-right text-muted-foreground/90 text-sm leading-relaxed">
              مشخصات پایه را وارد کنید. پس از ساخت، به صفحه طراحی سوالات هدایت
              می‌شوید.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form action={action} className="space-y-5 p-6 pt-2">
          {/* ورودی عنوان آزمون */}
          <div className="space-y-2">
            <Label
              htmlFor="title"
              className="text-sm font-semibold text-foreground/90 flex items-center gap-1"
            >
              عنوان آزمون{" "}
              <span className="text-destructive text-lg leading-3">*</span>
            </Label>
            <div className="relative group">
              <Type className="absolute right-3.5 top-3.5 h-5 w-5 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
              <Input
                id="title"
                name="title"
                placeholder="مثلاً: آزمون جامع ریاضی دهم"
                className="pr-11 h-12 text-right bg-muted/30 border-border/60 hover:bg-muted/50 focus:bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all rounded-xl shadow-sm"
                required
              />
            </div>
            {state.errors?.title && (
              <p className="text-xs text-destructive font-medium animate-in slide-in-from-top-1 bg-destructive/5 p-2 rounded-lg border border-destructive/10">
                {state.errors.title[0]}
              </p>
            )}
          </div>

          {/* انتخاب نوع آزمون (اصلاح شده) */}
          <div className="space-y-2">
            <Label htmlFor="type" className="font-semibold text-foreground/90">
              نوع آزمون
            </Label>

            <Select name="type" defaultValue="test" dir="rtl">
              {/* 
                  تغییرات انجام شده: 
                  1. h-auto: ارتفاع خودکار بجای ثابت
                  2. min-h-[80px]: حداقل ارتفاع برای زیبایی
                  3. py-3: پدینگ بالا و پایین برای جلوگیری از چسبیدن متن
              */}
              <SelectTrigger className="h-auto min-h-[80px] w-full py-3 bg-muted/30 border-border/60 rounded-xl focus:ring-primary/20 hover:bg-muted/50 transition-all [&>svg]:right-auto [&>svg]:left-4 [&>svg]:text-muted-foreground">
                <SelectValue placeholder="انتخاب کنید" />
              </SelectTrigger>

              <SelectContent
                align="center"
                className="bg-background/95 backdrop-blur-xl border-border/60 shadow-xl max-h-[300px]"
              >
                <SelectItem
                  value="test"
                  className="cursor-pointer py-3 pr-2 focus:bg-primary/5 focus:text-primary rounded-lg my-1"
                >
                  <div className="flex items-start gap-3 text-right">
                    <div className="mt-1 p-1.5 bg-emerald-500/10 rounded-md text-emerald-600 shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-base">
                        آزمون تستی (نمره‌دار)
                      </span>
                      <span className="text-xs text-muted-foreground font-medium leading-tight">
                        دارای پاسخنامه کلیدی، محاسبه درصد و رتبه‌بندی
                      </span>
                    </div>
                  </div>
                </SelectItem>

                <SelectItem
                  value="survey"
                  className="cursor-pointer py-3 pr-2 focus:bg-primary/5 focus:text-primary rounded-lg my-1"
                >
                  <div className="flex items-start gap-3 text-right">
                    <div className="mt-1 p-1.5 bg-orange-500/10 rounded-md text-orange-600 shrink-0">
                      <ListTodo className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-base">
                        نظرسنجی / پرسشنامه
                      </span>
                      <span className="text-xs text-muted-foreground font-medium leading-tight">
                        بدون نمره منفی، گزینه صحیح و محدودیت زمانی
                      </span>
                    </div>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* توضیحات */}
          <div className="space-y-2">
            <Label
              htmlFor="description"
              className="font-semibold text-foreground/90"
            >
              توضیحات (اختیاری)
            </Label>
            <div className="relative group">
              <FileText className="absolute right-3.5 top-3.5 h-5 w-5 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
              <Textarea
                id="description"
                name="description"
                placeholder="توضیحات تکمیلی برای شرکت‌کنندگان..."
                className="pr-11 min-h-[90px] resize-none text-right bg-muted/30 border-border/60 hover:bg-muted/50 focus:bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all rounded-xl shadow-sm pt-3"
              />
            </div>
          </div>

          {/* نمایش خطاها */}
          {state.message && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium flex items-center gap-2 animate-in fade-in zoom-in-95">
              <div className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
              {state.message}
            </div>
          )}

          {/* دکمه‌ها */}
          <div className="flex items-center justify-between pt-4 border-t border-border/30">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsOpen(false)}
              className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl"
            >
              انصراف
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className={cn(
                "min-w-[150px] h-11 rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]",
                isPending ? "bg-primary/80" : "bg-primary hover:bg-primary/90"
              )}
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                  در حال ساخت...
                </>
              ) : (
                <>
                  ایجاد و ادامه
                  <span className="mr-2 opacity-70">←</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
