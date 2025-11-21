# Sanjiyo Project Documentation

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

### 1. Brand Colors (اصلی)

رنگ‌های هویت بصری سنجیو.

| Token         | Light Mode Value       | Dark Mode Value       | Usage                           |
| :------------ | :--------------------- | :-------------------- | :------------------------------ |
| **Primary**   | `oklch(62% 0.18 220)`  | `oklch(68% 0.22 220)` | دکمه‌های اصلی، برندینگ، لینک‌ها |
| **Secondary** | `oklch(95% 0.025 220)` | `oklch(22% 0.06 220)` | دکمه‌های ثانویه، سطوح فرعی      |
| **Accent**    | `oklch(92% 0.04 210)`  | `oklch(30% 0.1 215)`  | هاور (Hover)، آیتم‌های لیست     |

### 2. Base Colors (زمینه و متن)

رنگ‌های پایه برای ساختار صفحه.

| Token          | Light Mode Value         | Dark Mode Value        | Usage                |
| :------------- | :----------------------- | :--------------------- | :------------------- |
| **Background** | `oklch(99.5% 0.005 230)` | `oklch(11% 0.03 235)`  | پس‌زمینه اصلی صفحه   |
| **Foreground** | `oklch(15% 0.03 240)`    | `oklch(94% 0.015 230)` | رنگ اصلی متن         |
| **Card**       | `oklch(99% 0.006 230)`   | `oklch(15% 0.04 235)`  | کارت‌ها، پنل‌ها      |
| **Muted**      | `oklch(97% 0.012 230)`   | `oklch(20% 0.05 235)`  | پس‌زمینه‌های غیرفعال |
| **Muted FG**   | `oklch(45% 0.04 230)`    | `oklch(75% 0.04 230)`  | متن توضیحات، لیبل‌ها |

### 3. Semantic States (وضعیت‌های آزمون)

رنگ‌های معنایی برای نمایش درستی/نادرستی پاسخ‌ها.

| Token           | Light Mode Value      | Dark Mode Value       | Usage                  |
| :-------------- | :-------------------- | :-------------------- | :--------------------- |
| **Success**     | `oklch(64% 0.19 150)` | `oklch(66% 0.22 150)` | پاسخ صحیح، عملیات موفق |
| **Warning**     | `oklch(78% 0.15 80)`  | `oklch(68% 0.18 80)`  | پاسخ شک‌دار، هشدار     |
| **Destructive** | `oklch(62% 0.22 25)`  | `oklch(62% 0.24 25)`  | پاسخ غلط، حذف، خطا     |

### 4. Charts (تحلیل داده)

پالت مخصوص نمودارها و تحلیل عملکرد.

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
