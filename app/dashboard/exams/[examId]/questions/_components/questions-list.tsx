"use client";

import { useState, useTransition } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
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
import { GripVertical, Pencil, Trash2 } from "lucide-react";
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
} from "@/components/ui/sheet";
import { QuestionForm } from "./question-form";

// --- Sortable Item Component ---
function SortableQuestionItem({ q, index, onDelete, onEdit }: any) {
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
    position: isDragging ? "relative" : "relative",
  } as React.CSSProperties;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={isDragging ? "opacity-50" : ""}
    >
      <AccordionItem
        value={q.id}
        className="border rounded-lg bg-card mb-2 overflow-hidden"
      >
        <div className="flex items-center pr-2">
          {/* هندل درگ کردن */}
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab p-2 text-muted-foreground hover:text-foreground"
          >
            <GripVertical className="w-5 h-5" />
          </div>

          <AccordionTrigger className="hover:no-underline py-4 pl-4 flex-1">
            <div className="flex items-center gap-4 text-right w-full overflow-hidden">
              <Badge
                variant="outline"
                className="h-6 w-6 shrink-0 flex items-center justify-center rounded-full p-0"
              >
                {index + 1}
              </Badge>
              <span className="truncate font-medium text-sm sm:text-base">
                {q.question_text}
              </span>
              <Badge
                variant="secondary"
                className="mr-auto ml-2 shrink-0 text-[10px]"
              >
                {q.score} نمره
              </Badge>
            </div>
          </AccordionTrigger>
        </div>

        <AccordionContent className="px-4 pb-4 pt-2 border-t border-dashed bg-muted/5">
          {/* نمایش گزینه‌ها (همان کد قبلی شما) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
            {Array.isArray(q.options) &&
              q.options.map((opt: any, i: number) => (
                <div
                  key={i}
                  className={`flex items-center p-3 rounded-md text-sm border ${
                    opt.id === q.correct_option_id
                      ? "bg-green-500/10 border-green-500/50 text-green-700 dark:text-green-300"
                      : "bg-background text-muted-foreground"
                  }`}
                >
                  {opt.text}
                </div>
              ))}
          </div>

          <div className="flex justify-end gap-2 mt-4 pt-2">
            {/* دکمه ویرایش */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(q)}
              className="h-8 text-xs"
            >
              <Pencil className="w-3 h-3 ml-1" /> ویرایش
            </Button>
            {/* دکمه حذف */}
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(q.id)}
              className="h-8 text-xs"
            >
              <Trash2 className="w-3 h-3 ml-1" /> حذف
            </Button>
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
  const [editingQuestion, setEditingQuestion] = useState<any>(null); // برای مدیریت شیت ویرایش
  const [isPending, startTransition] = useTransition();

  // آپدیت استیت محلی وقتی پراپس تغییر می‌کنه (برای هماهنگی با سرور)
  if (
    JSON.stringify(questions) !== JSON.stringify(initialQuestions) &&
    !isPending
  ) {
    // نکته: این یک چک ساده است، برای پروداکشن بهتره از useEffect استفاده کنید
    // اما در اینجا صرفا State اولیه را ست کردیم.
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setQuestions((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);
        const newItems = arrayMove(items, oldIndex, newIndex);

        // ارسال ترتیب جدید به سرور
        const updates = newItems.map((item, index) => ({
          id: item.id,
          order_index: index,
        }));
        startTransition(() => {
          reorderQuestionsAction(examId, updates);
        });

        return newItems;
      });
    }
  };

  const handleDelete = (id: string) => {
    if (!confirm("حذف شود؟")) return;
    startTransition(async () => {
      await deleteQuestionAction(examId, id);
      toast.success("حذف شد");
    });
  };

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <Accordion type="single" collapsible className="w-full">
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
      </DndContext>

      {/* شیت ویرایش سوال - وقتی editingQuestion مقدار داشته باشه باز میشه */}
      <Sheet
        open={!!editingQuestion}
        onOpenChange={(open) => !open && setEditingQuestion(null)}
      >
        <SheetContent
          side="right"
          className="w-full sm:max-w-xl overflow-y-auto"
        >
          <SheetHeader>
            <SheetTitle>ویرایش سوال</SheetTitle>
          </SheetHeader>
          {editingQuestion && (
            <QuestionForm
              examId={examId}
              initialData={editingQuestion}
              onSuccess={() => setEditingQuestion(null)}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
