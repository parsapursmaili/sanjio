"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { QuestionForm } from "./question-form";

interface CreateQuestionSheetProps {
  examId: string;
}

export function CreateQuestionSheet({ examId }: CreateQuestionSheetProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="lg" className="shadow-lg shadow-primary/20">
          <Plus className="w-5 h-5 ml-2" /> افزودن سوال جدید
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-full sm:max-w-xl md:max-w-2xl overflow-y-auto p-0 px-6 pt-6"
      >
        <SheetHeader className="pb-4 border-b">
          <SheetTitle className="text-xl">افزودن سوال جدید</SheetTitle>
          <SheetDescription>
            مشخصات سوال و گزینه‌های آن را با دقت وارد نمایید.
          </SheetDescription>
        </SheetHeader>

        {/* حالا اینجا پاس دادن تابع مجاز است چون هر دو سمت کلاینت هستند */}
        <QuestionForm examId={examId} onSuccess={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
