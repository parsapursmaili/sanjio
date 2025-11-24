"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Calculator, ChevronDown } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// دسته‌بندی علائم برای نظم بیشتر
const MATH_GROUPS = [
  {
    name: "عمومی",
    items: [
      { label: "xⁿ", insert: "^{}", desc: "توان دلخواه" },
      { label: "x₂", insert: "_{}", desc: "اندیس" },
      { label: "a/b", insert: "\\frac{}{}", desc: "کسر" },
      { label: "√", insert: "\\sqrt{}", desc: "رادیکال" },
      { label: "ⁿ√", insert: "\\sqrt[]{}", desc: "ریشه nام" },
    ],
  },
  {
    name: "عملگرها",
    items: [
      { label: "×", insert: "\\times", desc: "ضرب" },
      { label: "÷", insert: "\\div", desc: "تقسیم" },
      { label: "±", insert: "\\pm", desc: "مثبت/منفی" },
      { label: "≠", insert: "\\neq", desc: "نامساوی" },
      { label: "≈", insert: "\\approx", desc: "تقریبی" },
      { label: "≤", insert: "\\leq", desc: "کوچکتر مساوی" },
      { label: "≥", insert: "\\geq", desc: "بزرگتر مساوی" },
    ],
  },
  {
    name: "پیشرفته",
    items: [
      { label: "∞", insert: "\\infty", desc: "بی‌نهایت" },
      { label: "π", insert: "\\pi", desc: "پی" },
      { label: "Σ", insert: "\\sum_{}^{}", desc: "سیگما (جمع)" },
      { label: "∫", insert: "\\int_{}^{}", desc: "انتگرال" },
      { label: "lim", insert: "\\lim_{x \\to a}", desc: "حد" },
      { label: "θ", insert: "\\theta", desc: "تتا" },
      { label: "α", insert: "\\alpha", desc: "آلفا" },
      { label: "β", insert: "\\beta", desc: "بتا" },
      { label: "Δ", insert: "\\Delta", desc: "دلتا" },
    ],
  },
  {
    name: "مجموعه",
    items: [
      { label: "∈", insert: "\\in", desc: "عضو است" },
      { label: "∉", insert: "\\notin", desc: "عضو نیست" },
      { label: "∪", insert: "\\cup", desc: "اجتماع" },
      { label: "∩", insert: "\\cap", desc: "اشتراک" },
      { label: "∅", insert: "\\emptyset", desc: "تهی" },
      { label: "→", insert: "\\rightarrow", desc: "فلش راست" },
      { label: "⇒", insert: "\\Rightarrow", desc: "نتیجه می‌دهد" },
    ],
  },
];

interface MathToolbarProps {
  onInsert: (text: string) => void;
  isVisible: boolean;
}

export function MathToolbar({ onInsert, isVisible }: MathToolbarProps) {
  if (!isVisible) return null;

  return (
    <div className="border-b bg-muted/30 animate-in slide-in-from-top-2 fade-in duration-200">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex flex-col gap-2 p-2">
          {MATH_GROUPS.map((group, gIdx) => (
            <div key={gIdx} className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-muted-foreground bg-muted px-1.5 py-0.5 rounded w-14 text-center shrink-0">
                {group.name}
              </span>
              <div className="flex items-center gap-1">
                <TooltipProvider delayDuration={0}>
                  {group.items.map((tool, idx) => (
                    <Tooltip key={idx}>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-7 min-w-[32px] px-1 text-xs font-serif bg-background hover:bg-primary hover:text-white transition-colors border-dashed"
                          onClick={() => onInsert(tool.insert)}
                        >
                          {tool.label}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="text-xs font-sans">
                        {tool.desc}
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </TooltipProvider>
              </div>
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
