"use client";

import { useEffect, useRef } from "react";
import katex from "katex";
import "katex/dist/katex.min.css"; // استایل‌های ریاضی

interface MathRendererProps {
  text: string;
  className?: string;
}

export function MathRenderer({ text, className }: MathRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      // این تابع متن معمولی را نگه می‌دارد و فقط بخش‌های ریاضی را تبدیل می‌کند
      // اما برای سادگی فعلاً کل متن را به عنوان potential math در نظر می‌گیریم
      // یا از قابلیت auto-render کاتک استفاده می‌کنیم.
      // اینجا یک روش ساده برای رندر mixed text می‌نویسیم:

      try {
        katex.render(text, containerRef.current, {
          throwOnError: false,
          output: "html", // برای سرعت بیشتر
          displayMode: false, // حالت inline
        });
      } catch (e) {
        containerRef.current.innerText = text; // اگر ارور داد خود متن را نشان بده
      }
    }
  }, [text]);

  // نکته: رندر کردن متن فارسی مخلوط با فرمول کمی پیچیده است.
  // برای MVP، ما فرض می‌کنیم اگر متن حاوی کاراکترهای خاص (\) باشد، سعی در رندر ریاضی دارد.
  // روش بهتر استفاده از dangerouslySetInnerHTML با پردازش سمت سرور است، اما اینجا کلاینت ساید کافیست.

  // بیایید یک نمایشگر ساده بسازیم:
  // اگر متن فرمول ریاضی است (با \ شروع شده) رندر کن، وگرنه متن معمولی.

  const isMath =
    text.includes("\\") || text.includes("{") || text.includes("^");

  if (!isMath) return <span className={className}>{text}</span>;

  return (
    <span
      ref={containerRef}
      className={`font-serif text-lg mx-1 inline-block dir-ltr ${className}`}
    />
  );
}
