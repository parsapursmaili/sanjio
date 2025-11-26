# Sanjio Project Documentation

## 🛠 Tech Stack

**Framework:** Next.js 16 (App Router)

### Dependencies

- **Data & State:**
  - `@supabase/supabase-js`
  - `@supabase/ssr`
  - `@tanstack/react-query`
  - `zustand`
- **Forms & Validation:**
  - `react-hook-form`
  - `zod`
  - `@hookform/resolvers`
- **UI & Animation:**
  - `lucide-react`
  - `framer-motion`
  - `sonner`
- **Styling Utilities:**
  - `clsx`
  - `tailwind-merge`
  - `class-variance-authority`
- **Utilities:**
  - `date-fns`, `date-fns-jalali`
  - `recharts`
  - `react-timer-hook`

---

## 🎨 Design System: Color Palette

**Format:** OKLCH (Tailwind v4)
_Note: These tokens are configured in `app/globals.css`._

### 1. Brand Colors (اصلی)

| Token         | Light Mode Value       | Dark Mode Value       | Usage                           |
| :------------ | :--------------------- | :-------------------- | :------------------------------ |
| **Primary**   | `oklch(62% 0.18 220)`  | `oklch(68% 0.22 220)` | دکمه‌های اصلی، برندینگ، لینک‌ها |
| **Secondary** | `oklch(95% 0.025 220)` | `oklch(22% 0.06 220)` | دکمه‌های ثانویه، سطوح فرعی      |
| **Accent**    | `oklch(92% 0.04 210)`  | `oklch(30% 0.1 215)`  | هاور (Hover)، آیتم‌های لیست     |

### 2. Base Colors (زمینه و متن)

| Token          | Light Mode Value         | Dark Mode Value        | Usage                |
| :------------- | :----------------------- | :--------------------- | :------------------- |
| **Background** | `oklch(99.5% 0.005 230)` | `oklch(11% 0.03 235)`  | پس‌زمینه اصلی صفحه   |
| **Foreground** | `oklch(15% 0.03 240)`    | `oklch(94% 0.015 230)` | رنگ اصلی متن         |
| **Card**       | `oklch(99% 0.006 230)`   | `oklch(15% 0.04 235)`  | کارت‌ها، پنل‌ها      |
| **Muted**      | `oklch(97% 0.012 230)`   | `oklch(20% 0.05 235)`  | پس‌زمینه‌های غیرفعال |
| **Muted FG**   | `oklch(45% 0.04 230)`    | `oklch(75% 0.04 230)`  | متن توضیحات، لیبل‌ها |

### 3. Semantic States (وضعیت‌های آزمون)

| Token           | Light Mode Value      | Dark Mode Value       | Usage                  |
| :-------------- | :-------------------- | :-------------------- | :--------------------- |
| **Success**     | `oklch(64% 0.19 150)` | `oklch(66% 0.22 150)` | پاسخ صحیح، عملیات موفق |
| **Warning**     | `oklch(78% 0.15 80)`  | `oklch(68% 0.18 80)`  | پاسخ شک‌دار، هشدار     |
| **Destructive** | `oklch(62% 0.22 25)`  | `oklch(62% 0.24 25)`  | پاسخ غلط، حذف، خطا     |

### 4. Charts (تحلیل داده)

| Token       | Value (Adaptive)      | Description              |
| :---------- | :-------------------- | :----------------------- |
| **Chart 1** | `oklch(62% 0.19 220)` | آبی اصلی                 |
| **Chart 2** | `oklch(65% 0.2 150)`  | سبز (عملکرد مثبت)        |
| **Chart 3** | `oklch(68% 0.18 50)`  | نارنجی/طلایی (خنثی/رتبه) |
| **Chart 4** | `oklch(65% 0.18 25)`  | قرمز (نقاط ضعف)          |
| **Chart 5** | `oklch(68% 0.16 300)` | بنفش (سایر موارد)        |

### 5. Form Elements (فرم‌ها)

| Token      | Light Mode Value       | Dark Mode Value       |
| :--------- | :--------------------- | :-------------------- |
| **Border** | `oklch(88% 0.018 235)` | `oklch(24% 0.05 235)` |
| **Input**  | `oklch(92% 0.018 235)` | `oklch(24% 0.05 235)` |
| **Ring**   | `oklch(62% 0.19 220)`  | `oklch(68% 0.22 220)` |

---

## 🗄️ Database Schema (Supabase/PostgreSQL)

```sql
-- Profiles (Linked to Auth)
CREATE TABLE public.profiles (
  id uuid NOT NULL REFERENCES auth.users(id),
  email text NOT NULL UNIQUE,
  full_name text,
  role USER-DEFINED DEFAULT 'student'::user_role,
  avatar_url text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT profiles_pkey PRIMARY KEY (id)
);

-- Exams
CREATE TABLE public.exams (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  creator_id uuid NOT NULL REFERENCES public.profiles(id),
  title text NOT NULL,
  description text,
  start_time timestamp with time zone,
  end_time timestamp with time zone,
  duration_minutes integer,
  type USER-DEFINED DEFAULT 'test'::exam_type,
  status USER-DEFINED DEFAULT 'draft'::exam_status,
  price numeric DEFAULT 0,
  is_featured boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT exams_pkey PRIMARY KEY (id)
);

-- Questions
CREATE TABLE public.questions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  exam_id uuid NOT NULL REFERENCES public.exams(id),
  question_text text NOT NULL,
  options jsonb NOT NULL DEFAULT '[]'::jsonb,
  correct_option_id integer,
  score integer DEFAULT 1,
  order_index integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT questions_pkey PRIMARY KEY (id)
);

-- Participations
CREATE TABLE public.participations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id),
  exam_id uuid NOT NULL REFERENCES public.exams(id),
  score integer DEFAULT 0,
  status text DEFAULT 'in_progress'::text,
  started_at timestamp with time zone DEFAULT now(),
  finished_at timestamp with time zone,
  CONSTRAINT participations_pkey PRIMARY KEY (id)
);

-- Answers
CREATE TABLE public.answers (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  participation_id uuid NOT NULL REFERENCES public.participations(id),
  question_id uuid NOT NULL REFERENCES public.questions(id),
  selected_option_id integer,
  is_correct boolean,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT answers_pkey PRIMARY KEY (id)
);
```

مراحل جلو رفته
Authentication Core: پیاده‌سازی کامل سیستم ورود/ثبت‌نام در مسیر /login با استفاده از Supabase Auth و Server Actions.
UI/UX: طراحی صفحه Auth با استایل Glassmorphism، انیمیشن‌های Framer Motion و پشتیبانی از حالت ریسپانسیو (موبایل/دسکتاپ).
Validation: اعتبارسنجی فرم‌ها با zod و react-hook-form با پیام‌های خطای فارسی و هندلینگ ارورهای سمت سرور.
Security: تنظیم Middleware برای محافظت از مسیرهای /dashboard و هدایت کاربران احراز هویت نشده.
Database: اتصال پروژه به Supabase برقرار شده و جداول دیتابیس طبق Schema بالا ایجاد شده‌اند.
**Dashboard Architecture:** پیاده‌سازی `DashboardShell` ریسپانسیو شامل سایدبار و هدر با انیمیشن‌های Framer Motion و مدیریت وضعیت (Client/Server Separation).
**Profile System:** تکمیل صفحه تنظیمات (/settings) با قابلیت ویرایش اطلاعات و آپلود آواتار به صورت Real-time.
**Storage & Optimization:** راه‌اندازی Supabase Storage با قوانین امنیتی (RLS) اصلاح‌شده؛ پیاده‌سازی فشرده‌سازی تصویر سمت کلاینت (Canvas API) و استراتژی **Cache Busting** برای مدیریت کش تصاویر.
**Backend Automation:** تنظیم SQL Triggers برای ایجاد خودکار ردیف پروفایل هنگام ثبت‌نام کاربر جدید.
Auth: پیاده‌سازی کامل در app/login با استفاده از Supabase Auth و Server Actions.
Middleware: محافظت از مسیر /dashboard در middleware.ts.
Triggers: تریگر SQL برای ساخت خودکار ردیف در جدول profiles هنگام ثبت‌نام.
۲. داشبورد و پروفایل:
Layout: پیاده‌سازی DashboardShell ریسپانسیو با انیمیشن در app/dashboard/layout.tsx.
Settings: فرم ویرایش پروفایل و آپلود آواتار (با فشرده‌سازی کلاینت و Cache Busting) در app/dashboard/settings.
۳. موتور آزمون (Exam Engine):
Database: فعال‌سازی RLS روی جدول exams برای امنیت داده‌ها.
Server Actions: هندلینگ ساخت آزمون در app/dashboard/exams/\_actions/exam-actions.ts.
UI:
CreateExamDialog: فرم پیشرفته راست‌چین (RTL Native) با Shadcn و Radix برای ساخت آزمون.
ExamCard: طراحی گلس‌مورفیسم کارت‌ها با وضعیت‌های رنگی در app/dashboard/exams/\_components.
Page: لیست‌گیری سروری آزمون‌ها در app/dashboard/exams/page.tsx.
**۴. ماژول پیشرفته طراحی سوال (Question Builder):**

- **مسیر اصلی:** `app/dashboard/exams/[examId]/questions`
- **معماری فرم:** پیاده‌سازی `QuestionForm` با استفاده از `useFieldArray` برای مدیریت داینامیک گزینه‌ها و `react-hook-form` با اعتبارسنجی دقیق `Zod` (هماهنگ‌سازی تایپ String برای رادیو باتن‌ها).
- **پشتیبانی ریاضی (LaTeX):** توسعه کامپوننت‌های `MathToolbar` (نوار ابزار فرمول) و `MathRenderer` (موتور KaTeX) برای درج و پیش‌نمایش زنده فرمول‌های ریاضی در متن سوال.
- **UI/UX:** بازطراحی کامل پنل به صورت **Sheet راست‌چین (RTL)** با هدر و فوتر چسبان (Sticky)، اصلاح چیدمان اینپوت‌ها و بهبود تجربه کاربری در موبایل/دسکتاپ.
- **Backend & Security:** به‌روزرسانی Schema دیتابیس (افزودن ستون `text`)، رفرش کردن کش API سوپابیس، و تنظیم دقیق **RLS Policies** برای اجازه درج (Insert) سوالات توسط کاربر احراز هویت شده.
  . بهینه‌سازی و تنظیمات پیشرفته آزمون (Exam Settings & UX):
  مدیریت نمرات: پیاده‌سازی سیستم نمره منفی (Schema Update + UI Toggle) و ابزار یکسان‌سازی نمرات با Server Action اختصاصی.
  پایداری Drag & Drop: رفع تداخل startTransition در جابه‌جایی سوالات و افزودن انیمیشن‌های لیست با dnd-kit.
  رابط کاربری نهایی: بازطراحی مدرن صفحه سوالات با کارت‌های آماری هوشمند، هدرهای گرادینت و اصلاح کامل چیدمان RTL در کامپوننت‌های کنترلی.
  زیرساخت عمومی: ایجاد صفحه لیست آزمون‌ها (app/exam/page.tsx) و لابی آزمون (app/(exam)/exams/[examId]/page.tsx) با طراحی Glassmorphism و بررسی هوشمند وضعیت کاربر (شروع/ادامه/پایان).
  هسته فنی آزمون: پیاده‌سازی ExamSession در مسیر app/(exam)/exams/[examId]/take با استفاده از Zustand (store/use-exam-store.ts) برای مدیریت State و ذخیره لوکال پاسخ‌ها (Persist) جهت جلوگیری از حذف دیتا هنگام رفرش.
  رابط کاربری (Zen Mode): توسعه کامپوننت‌های ExamHeader (تایمر چسبان با react-timer-hook)، QuestionCard (با انیمیشن‌های Framer Motion) و فوتر ناوبری بدون مزاحمت.
  امنیت و Backend: پیاده‌سازی Server Actionهای امن (exam-take-actions.ts) برای دریافت سوالات بدون ارسال پاسخ صحیح به کلاینت (Sanitization) و اصلاح کوئری‌ها.
  دیتابیس و RLS: تنظیم دقیق RLS Policies برای جداول participations و answers جهت اجازه ثبت رکورد توسط کاربر و رفع خطاهای دسترسی.
  مدیریت خطا: جایگزینی صفحه ۴۰۴ با رابط کاربری مدیریت خطا (Graceful Error Handling) برای راهنمایی کاربر در صورت بروز مشکل در مجوز یا دیتابیس.
