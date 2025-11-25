"use client";

import { useState, useTransition, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  defaultDropAnimationSideEffects,
  DropAnimation,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GripVertical, Pencil, Trash2, Sparkles } from "lucide-react";
import {
  deleteQuestionAction,
  reorderQuestionsAction,
} from "../_actions/question-actions";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { QuestionForm } from "./question-form";
import { cn } from "@/lib/utils";

// --- Sortable Item Component ---
function SortableQuestionItem({ q, index, onDelete, onEdit, isActive }: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: q.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : "auto",
  } as React.CSSProperties;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn("mb-3 group relative", isDragging && "opacity-30")}
    >
      {/* خط اتصال سمت راست برای زیبایی */}
      <div className="absolute -right-[13px] top-8 bottom-0 w-px bg-border group-last:hidden md:block hidden" />
      <div className="absolute -right-[17px] top-8 w-2 h-2 rounded-full bg-muted-foreground/20 group-hover:bg-primary group-hover:scale-125 transition-all md:block hidden" />

      <AccordionItem
        value={q.id}
        className={cn(
          "border rounded-xl bg-card transition-all duration-200 overflow-hidden",
          isActive
            ? "shadow-md ring-1 ring-primary/20 border-primary/30"
            : "hover:shadow-sm hover:border-primary/20"
        )}
      >
        <div className="flex items-center">
          {/* Drag Handle */}
          <div
            {...attributes}
            {...listeners}
            className="h-full self-stretch flex items-center justify-center px-3 cursor-grab active:cursor-grabbing text-muted-foreground/40 hover:text-foreground hover:bg-muted/40 transition-colors border-l border-transparent hover:border-border"
          >
            <GripVertical className="w-5 h-5" />
          </div>

          <AccordionTrigger className="hover:no-underline py-3 px-4 flex-1 data-[state=open]:bg-muted/5">
            <div className="flex items-center gap-3 w-full overflow-hidden">
              <div className="flex flex-col items-center justify-center min-w-[2rem]">
                <span className="text-xs font-bold text-muted-foreground">
                  Q.{index + 1}
                </span>
              </div>

              <div className="flex flex-col items-start flex-1 min-w-0 gap-0.5">
                <span className="truncate font-medium text-sm sm:text-base text-foreground w-full text-right">
                  {q.question_text}
                </span>
                <div className="flex items-center gap-2">
                  {/* اگر تگ یا دسته‌بندی دارید اینجا نمایش بدید */}
                  <span className="text-[10px] text-muted-foreground px-1.5 py-0.5 bg-muted rounded-sm">
                    {q.options?.length || 0} گزینه
                  </span>
                </div>
              </div>

              <Badge
                variant={q.score > 1 ? "default" : "secondary"}
                className="mr-auto ml-2 shrink-0 text-[10px] h-6 px-2 font-medium"
              >
                {q.score} نمره
              </Badge>
            </div>
          </AccordionTrigger>
        </div>

        <AccordionContent className="px-0 pb-0 pt-0">
          <div className="p-4 bg-muted/5 border-t border-dashed">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Array.isArray(q.options) &&
                q.options.map((opt: any, i: number) => (
                  <div
                    key={i}
                    className={cn(
                      "flex items-center p-3 rounded-lg text-sm border transition-colors relative overflow-hidden",
                      opt.id === q.correct_option_id
                        ? "bg-green-500/5 border-green-500/30 text-green-700 dark:text-green-300 shadow-sm"
                        : "bg-background border-border text-muted-foreground"
                    )}
                  >
                    {opt.id === q.correct_option_id && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500/50" />
                    )}
                    <span className="w-5 h-5 flex items-center justify-center text-[10px] border rounded-full mr-2 shrink-0 text-muted-foreground">
                      {i + 1}
                    </span>
                    {opt.text}
                  </div>
                ))}
            </div>

            <div className="flex justify-between items-center mt-6 pt-4 border-t">
              <div className="text-xs text-muted-foreground">
                شناسه:{" "}
                <span className="font-mono opacity-50">{q.id.slice(0, 8)}</span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(q)}
                  className="h-8 text-xs hover:bg-primary/5 hover:text-primary hover:border-primary/30"
                >
                  <Pencil className="w-3 h-3 ml-1.5" /> ویرایش
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(q.id)}
                  className="h-8 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-3 h-3 ml-1.5" /> حذف
                </Button>
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </div>
  );
}

// --- Main List Component ---
export function QuestionsList({
  questions: initialQuestions,
  examId,
}: {
  questions: any[];
  examId: string;
}) {
  const [questions, setQuestions] = useState(initialQuestions);
  const [editingQuestion, setEditingQuestion] = useState<any>(null);
  const [isPending, startTransition] = useTransition();
  const [activeId, setActiveId] = useState<string | null>(null); // برای درگ overlay

  // Sync with server state changes
  useEffect(() => {
    setQuestions(initialQuestions);
  }, [initialQuestions]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 }, // جلوگیری از درگ ناخواسته هنگام کلیک
    }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id) return;

    // 1. محاسبه آرایه جدید
    const oldIndex = questions.findIndex((item) => item.id === active.id);
    const newIndex = questions.findIndex((item) => item.id === over.id);
    const newItems = arrayMove(questions, oldIndex, newIndex);

    // 2. آپدیت استیت محلی (Optimistic UI)
    setQuestions(newItems);

    // 3. آماده‌سازی داده برای سرور
    const updates = newItems.map((item, index) => ({
      id: item.id,
      order_index: index,
    }));

    // 4. ارسال به سرور خارج از لوپ رندرینگ
    startTransition(() => {
      reorderQuestionsAction(examId, updates)
        .then(() => {}) // سایلنت ساکسس
        .catch(() => {
          toast.error("خطا در جابه‌جایی سوالات");
          setQuestions(initialQuestions); // Revert on error
        });
    });
  };

  const handleDelete = (id: string) => {
    toast("آیا از حذف این سوال اطمینان دارید؟", {
      action: {
        label: "حذف شود",
        onClick: () => {
          const previousQuestions = [...questions];
          setQuestions((q) => q.filter((item) => item.id !== id)); // Optimistic delete

          startTransition(async () => {
            try {
              await deleteQuestionAction(examId, id);
              toast.success("سوال حذف شد");
            } catch (e) {
              setQuestions(previousQuestions); // Revert
              toast.error("خطا در حذف سوال");
            }
          });
        },
      },
    });
  };

  // Drop animation config
  const dropAnimation: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: { opacity: "0.4" },
      },
    }),
  };

  const activeQuestion = questions.find((q) => q.id === activeId);

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <Accordion type="single" collapsible className="w-full space-y-1">
          <SortableContext
            items={questions.map((q) => q.id)}
            strategy={verticalListSortingStrategy}
          >
            {questions.map((q, index) => (
              <SortableQuestionItem
                key={q.id}
                q={q}
                index={index}
                onDelete={handleDelete}
                onEdit={setEditingQuestion}
              />
            ))}
          </SortableContext>
        </Accordion>

        {/* Drag Overlay: آیتمی که در حال حرکت است */}
        <DragOverlay dropAnimation={dropAnimation}>
          {activeId && activeQuestion ? (
            <div className="opacity-90 cursor-grabbing">
              <div className="bg-card border-primary border rounded-xl p-4 shadow-xl flex items-center gap-3">
                <Badge
                  variant="outline"
                  className="h-6 w-6 rounded-full p-0 flex items-center justify-center bg-background"
                >
                  ?
                </Badge>
                <span className="font-medium text-sm">
                  {activeQuestion.question_text}
                </span>
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <Sheet
        open={!!editingQuestion}
        onOpenChange={(open) => !open && setEditingQuestion(null)}
      >
        <SheetContent
          side="right"
          className="w-full sm:max-w-2xl overflow-y-auto sm:rounded-l-xl border-l sm:border-l shadow-2xl p-0"
        >
          <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b px-6 py-4">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <Pencil className="w-5 h-5 text-primary" />
                ویرایش سوال
              </SheetTitle>
              <SheetDescription>
                تغییرات خود را اعمال و سپس ذخیره کنید.
              </SheetDescription>
            </SheetHeader>
          </div>

          <div className="px-6 py-6">
            {editingQuestion && (
              <QuestionForm
                examId={examId}
                initialData={editingQuestion}
                onSuccess={() => {
                  setEditingQuestion(null);
                  toast.success("سوال ویرایش شد");
                }}
              />
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
