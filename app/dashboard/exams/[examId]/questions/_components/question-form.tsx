"use client";

import { useState, useTransition, useRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  questionSchema,
  type QuestionFormValues,
} from "@/lib/validations/question";
import {
  createQuestionAction,
  updateQuestionAction,
} from "../_actions/question-actions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Loader2,
  Plus,
  Trash2,
  Check,
  Calculator,
  PenLine,
  Trophy,
  LayoutList,
  Info,
  Edit,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MathToolbar } from "./math-toolbar";

interface QuestionFormProps {
  examId: string;
  onSuccess: () => void;
  initialData?: any;
}

export function QuestionForm({
  examId,
  onSuccess,
  initialData,
}: QuestionFormProps) {
  const [isPending, startTransition] = useTransition();
  const [showMath, setShowMath] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  const form = useForm<QuestionFormValues>({
    resolver: zodResolver(questionSchema),
    defaultValues: initialData
      ? {
          text: initialData.question_text,
          score: initialData.score,
          options: initialData.options.map((opt: any) => ({ text: opt.text })),
          correctOptionIndex: String(initialData.correct_option_id),
        }
      : {
          text: "",
          score: 1,
          options: [{ text: "" }, { text: "" }, { text: "" }, { text: "" }],
          correctOptionIndex: "0",
        },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "options",
  });

  const onSubmit = (data: QuestionFormValues) => {
    startTransition(async () => {
      if (initialData) {
        const payload = {
          question_text: data.text,
          score: data.score,
          options: data.options.map((o) => ({
            id: crypto.randomUUID(),
            text: o.text,
          })),
          correct_option_id: parseInt(data.correctOptionIndex),
        };

        code;
        Code;
        download;
        content_copy;
        expand_less;
        const result = await updateQuestionAction(
          initialData.id,
          examId,
          payload
        );
        if (result?.error) {
          toast.error("خطا در ویرایش", { description: result.error });
        } else {
          toast.success("سوال با موفقیت ویرایش شد");
          onSuccess();
        }
      } else {
        const result = await createQuestionAction(examId, data);
        if (result?.error) {
          toast.error("خطا در ثبت", { description: result.error });
        } else {
          toast.success("سوال با موفقیت ثبت شد");
          form.reset();
          onSuccess();
        }
      }
    });
  };

  const handleInsertMath = (latex: string) => {
    const textarea = textAreaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentVal = form.getValues("text") || "";
    const newVal =
      currentVal.substring(0, start) + latex + currentVal.substring(end);
    form.setValue("text", newVal, { shouldValidate: true });
    setTimeout(() => {
      textarea.focus();
      let newCursorPos = start + latex.length;
      if (latex.includes("{}")) newCursorPos = start + latex.indexOf("{") + 1;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const currentCorrectIndex = form.watch("correctOptionIndex");
  const questionText = form.watch("text");

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col min-h-full bg-slate-50/50 dark:bg-background px-1 pb-4"
      dir="rtl"
    >
      <div className="space-y-8 py-4">
        {/* === HEADER & QUESTION BOX === */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-600/20">
              {initialData ? (
                <Edit className="w-5 h-5 text-white" />
              ) : (
                <PenLine className="w-5 h-5 text-white" />
              )}
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">
                {initialData ? "ویرایش سوال" : "طراحی سوال"}
              </h3>
              <p className="text-xs text-muted-foreground">
                {initialData
                  ? "تغییرات مورد نظر را اعمال کنید"
                  : "متن سوال و بارم‌بندی را مشخص کنید"}
              </p>
            </div>
          </div>
          <div className="group relative rounded-2xl border bg-card shadow-sm transition-all duration-300 hover:shadow-md focus-within:shadow-xl focus-within:ring-1 focus-within:ring-indigo-500/30 overflow-hidden">
            <AnimatePresence>
              {showMath && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-slate-100/50 dark:bg-slate-900 border-b ltr"
                >
                  <div className="p-3">
                    <MathToolbar onInsert={handleInsertMath} isVisible={true} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <Textarea
              {...form.register("text")}
              ref={(e) => {
                form.register("text").ref(e);
                textAreaRef.current = e;
              }}
              placeholder="صورت سوال را با دقت بنویسید..."
              className="min-h-[140px] w-full resize-none border-0 bg-transparent p-5 text-base leading-7 focus-visible:ring-0 placeholder:text-slate-400"
            />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t bg-slate-50/80 dark:bg-slate-900/50 p-3 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMath(!showMath)}
                  className={cn(
                    "cursor-pointer text-xs gap-1.5 h-8 px-3 rounded-full border bg-white dark:bg-slate-800",
                    showMath && "text-indigo-600 border-indigo-200"
                  )}
                >
                  <Calculator className="w-3.5 h-3.5" />
                  {showMath ? "بستن پنل ریاضی" : "درج فرمول"}
                </Button>

                {questionText && (
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1 bg-white dark:bg-slate-800 px-2 py-1 rounded-full border">
                    <Info className="w-3 h-3" />
                    {questionText.length} کاراکتر
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 bg-white dark:bg-slate-800 border rounded-xl px-3 py-1.5 shadow-sm">
                <div className="flex flex-col items-end">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                    نمره سوال
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    (اختیاری)
                  </span>
                </div>
                <Separator orientation="vertical" className="h-8" />
                <Input
                  type="number"
                  placeholder="1"
                  {...form.register("score")}
                  className="w-16 h-8 text-center text-lg font-bold border-0 bg-transparent p-0 focus-visible:ring-0 text-indigo-600 placeholder:text-indigo-600/30"
                />
                <Trophy className="w-4 h-4 text-amber-500 mb-1" />
              </div>
            </div>
          </div>
          {form.formState.errors.text && (
            <p className="text-xs text-red-500 font-medium px-2 animate-pulse">
              {form.formState.errors.text.message}
            </p>
          )}
        </section>

        {/* === OPTIONS SECTION === */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-md text-emerald-600">
                <LayoutList className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-base text-slate-700 dark:text-slate-200">
                گزینه‌ها
              </h3>
            </div>

            {fields.length < 6 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ text: "" })}
                className="cursor-pointer h-8 text-xs border-dashed border-slate-300 hover:border-emerald-500 hover:text-emerald-600"
              >
                <Plus className="w-3 h-3 ml-1" /> گزینه جدید
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3">
            <AnimatePresence>
              {fields.map((field, index) => {
                const isSelected = currentCorrectIndex === index.toString();
                return (
                  <motion.div
                    key={field.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={cn(
                      "relative flex items-center gap-3 p-2 rounded-xl border-2 transition-all duration-300 group bg-card",
                      isSelected
                        ? "border-emerald-500 shadow-[0_4px_20px_-10px_rgba(16,185,129,0.4)] z-10"
                        : "border-transparent shadow-sm hover:border-slate-200"
                    )}
                  >
                    {/* Selection Visual */}
                    <div
                      onClick={() =>
                        form.setValue("correctOptionIndex", index.toString())
                      }
                      className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center cursor-pointer transition-all shrink-0 border",
                        isSelected
                          ? "bg-gradient-to-br from-emerald-500 to-teal-600 border-emerald-600 text-white scale-105 shadow-md"
                          : "bg-slate-50 border-slate-200 text-slate-400 hover:border-emerald-300 hover:text-emerald-500"
                      )}
                    >
                      {isSelected ? (
                        <Check className="w-6 h-6 stroke-[3]" />
                      ) : (
                        <span className="font-mono font-bold text-lg">
                          {index + 1}
                        </span>
                      )}
                    </div>

                    {/* Input Area */}
                    <div className="flex-1">
                      <Input
                        {...form.register(`options.${index}.text` as const)}
                        placeholder={`متن گزینه ${index + 1}`}
                        className={cn(
                          "border-0 shadow-none focus-visible:ring-0 bg-transparent px-1 text-sm font-medium",
                          isSelected &&
                            "text-emerald-950 dark:text-emerald-50 font-bold"
                        )}
                      />
                    </div>

                    {fields.length > 2 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
                        className={cn(
                          "cursor-pointer h-8 w-8 shrink-0 transition-all duration-200",
                          "text-slate-400 bg-slate-100/50 dark:bg-slate-800",
                          "hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30",
                          "opacity-100 sm:opacity-0 sm:bg-transparent sm:group-hover:opacity-100"
                        )}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}

                    {isSelected && (
                      <div className="absolute -top-2.5 left-4 bg-emerald-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm animate-in zoom-in pointer-events-none">
                        پاسخ صحیح
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
          {form.formState.errors.options && (
            <p className="text-xs text-red-500 text-center bg-red-50 p-1 rounded-md">
              {form.formState.errors.options.message}
            </p>
          )}
        </section>

        {/* === FOOTER === */}
        <div className="mt-8 flex flex-row items-center justify-end gap-3 pt-6 border-t border-slate-200 dark:border-slate-800">
          <Button
            type="button"
            variant="ghost"
            onClick={onSuccess}
            className="cursor-pointer text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          >
            انصراف
          </Button>

          <Button
            type="submit"
            disabled={isPending}
            className={cn(
              "cursor-pointer bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-lg shadow-indigo-500/25 min-w-[130px] transition-all active:scale-95",
              isPending && "opacity-80 cursor-not-allowed"
            )}
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : initialData ? (
              <Edit className="w-4 h-4 ml-2" />
            ) : (
              <Check className="w-4 h-4 ml-2" />
            )}
            {initialData ? "ذخیره تغییرات" : "ذخیره سوال"}
          </Button>
        </div>
      </div>
    </form>
  );
}
