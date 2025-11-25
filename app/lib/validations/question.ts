// lib/validations/question.ts
import { z } from "zod";

export const questionSchema = z.object({
  text: z.string().min(3, "متن سوال خیلی کوتاه است"),
  score: z.coerce.number().min(1, "نمره باید حداقل ۱ باشد"),
  options: z
    .array(
      z.object({
        text: z.string().min(1, "متن گزینه نمی‌تواند خالی باشد"),
      })
    )
    .min(2, "حداقل ۲ گزینه لازم است"),
  // اصلاح شده: حذف required_error و استفاده از min برای اجباری کردن انتخاب
  correctOptionIndex: z.string().min(1, "انتخاب گزینه صحیح الزامی است"),
});

export type QuestionFormValues = z.infer<typeof questionSchema>;
