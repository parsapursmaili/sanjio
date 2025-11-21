import React from "react";

export default function DesignSystemPage() {
  return (
    <div
      dir="rtl"
      className="min-h-screen bg-background text-foreground font-sans pb-20"
    >
      {/* --- Header Section --- */}
      <header className="bg-card border-b border-border p-6 md:p-10 mb-8 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-primary">
              سنجیو (Sanjio){" "}
              <span className="text-foreground opacity-40 font-light text-2xl">
                | Design System v4.0
              </span>
            </h1>
            <p className="text-muted-foreground max-w-2xl text-lg">
              بررسی جامع پالت رنگی، تایپوگرافی و کامپوننت‌ها بر اساس موتور
              Tailwind v4 و فرمت رنگی OKLCH.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-sm border border-border w-fit">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              وضعیت سیستم: آماده برای بیلد (Next.js 15 Compatible)
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 space-y-20">
        {/* 1. PALETTE SHOWCASE */}
        <section className="space-y-6">
          <SectionTitle number="۱" title="پالت رنگی اصلی (Brand Colors)" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            <ColorCard
              label="Primary"
              sub="برندینگ / دکمه‌ها"
              bg="bg-primary"
              text="text-primary-foreground"
            />
            <ColorCard
              label="Secondary"
              sub="سطوح ثانویه"
              bg="bg-secondary"
              text="text-secondary-foreground"
            />
            <ColorCard
              label="Accent"
              sub="هاور / لیست‌ها"
              bg="bg-accent"
              text="text-accent-foreground"
            />
            <ColorCard
              label="Muted"
              sub="غیرفعال / توضیحات"
              bg="bg-muted"
              text="text-muted-foreground"
            />
            <ColorCard
              label="Card"
              sub="کارت‌ها / پنل‌ها"
              bg="bg-card"
              text="text-card-foreground"
              border
            />
            <ColorCard
              label="Destructive"
              sub="خطر / حذف"
              bg="bg-destructive"
              text="text-destructive-foreground"
            />
          </div>
        </section>

        {/* 2. EXAM STATUS COLORS (CRITICAL) */}
        <section className="space-y-6">
          <SectionTitle number="۲" title="وضعیت‌های آزمون (Exam States)" />
          <p className="text-muted-foreground">
            این رنگ‌ها قلب تپنده سیستم سنجیو برای نمایش درستی یا نادرستی پاسخ‌ها
            هستند.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Success State */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-success/10 border border-success/20">
              <div className="w-12 h-12 rounded-full bg-success flex items-center justify-center text-success-foreground text-xl font-bold shadow-md shadow-success/20">
                ✓
              </div>
              <div>
                <h4 className="font-bold text-success text-lg">پاسخ صحیح</h4>
                <p className="text-xs text-foreground/70">
                  استفاده: bg-success
                </p>
              </div>
            </div>

            {/* Warning State */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-warning/10 border border-warning/20">
              <div className="w-12 h-12 rounded-full bg-warning flex items-center justify-center text-warning-foreground text-xl font-bold shadow-md shadow-warning/20">
                !
              </div>
              <div>
                <h4 className="font-bold text-warning text-lg">
                  مرور / شک‌دار
                </h4>
                <p className="text-xs text-foreground/70">
                  استفاده: bg-warning
                </p>
              </div>
            </div>

            {/* Destructive State */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-destructive/10 border border-destructive/20">
              <div className="w-12 h-12 rounded-full bg-destructive flex items-center justify-center text-destructive-foreground text-xl font-bold shadow-md shadow-destructive/20">
                ✕
              </div>
              <div>
                <h4 className="font-bold text-destructive text-lg">پاسخ غلط</h4>
                <p className="text-xs text-foreground/70">
                  استفاده: bg-destructive
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. UI COMPONENTS & FORMS */}
        <section className="space-y-6">
          <SectionTitle
            number="۳"
            title="المان‌های رابط کاربری (UI Elements)"
          />

          <div className="grid md:grid-cols-2 gap-10">
            {/* Buttons */}
            <div className="space-y-4 p-6 rounded-2xl border border-border bg-card shadow-sm">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <span className="w-1 h-5 bg-primary rounded-full"></span>{" "}
                دکمه‌ها
              </h3>
              <div className="flex flex-wrap gap-3">
                <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition shadow-md shadow-primary/25">
                  Primary
                </button>
                <button className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition">
                  Secondary
                </button>
                <button className="px-4 py-2 rounded-lg border border-input bg-background hover:bg-accent hover:text-accent-foreground transition">
                  Outline
                </button>
                <button className="px-4 py-2 rounded-lg text-primary hover:bg-primary/10 transition">
                  Ghost
                </button>
                <button className="px-4 py-2 rounded-lg bg-destructive text-destructive-foreground hover:opacity-90 transition">
                  Destructive
                </button>
              </div>
            </div>

            {/* Inputs */}
            <div className="space-y-4 p-6 rounded-2xl border border-border bg-card shadow-sm">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <span className="w-1 h-5 bg-ring rounded-full"></span> فرم و
                ورودی‌ها
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-foreground/80">
                    ایمیل کاربری
                  </label>
                  <input
                    type="text"
                    placeholder="روی من کلیک کنید تا رنگ Ring را ببینید..."
                    className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:opacity-50"
                  />
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-4 h-4 border rounded bg-primary text-primary-foreground flex items-center justify-center text-[10px]">
                    ✓
                  </div>
                  <span>قوانین و مقررات سنجیو را می‌پذیرم.</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. REAL WORLD EXAM SIMULATION */}
        <section className="space-y-6">
          <SectionTitle
            number="۴"
            title="شبیه‌ساز محیط آزمون (The Exam Experience)"
          />

          <div className="max-w-4xl mx-auto border border-border rounded-2xl overflow-hidden bg-card shadow-lg">
            {/* Exam Header */}
            <div className="bg-secondary/40 border-b border-border p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="bg-primary/10 text-primary border border-primary/20 text-xs font-bold px-2 py-1 rounded">
                  سوال ۱۵ / ۵۰
                </span>
                <span className="text-sm font-medium text-muted-foreground hidden sm:block">
                  کنکور آزمایشی جامع ۱۴۰۴
                </span>
              </div>
              <div className="flex items-center gap-2 font-mono text-lg font-bold text-foreground">
                <span className="w-2 h-2 rounded-full bg-destructive animate-ping"></span>
                00:45:12
              </div>
            </div>

            {/* Question Body */}
            <div className="p-6 md:p-10">
              <p className="text-lg md:text-xl font-medium leading-relaxed text-foreground mb-8">
                اگر تابع{" "}
                <code className="bg-accent px-1 py-0.5 rounded font-mono text-primary">
                  f(x) = x² + 2x
                </code>{" "}
                باشد، مقدار مشتق تابع در نقطه{" "}
                <code className="bg-accent px-1 py-0.5 rounded font-mono text-primary">
                  x = 3
                </code>{" "}
                کدام است؟
              </p>

              <div className="space-y-3">
                {/* Option 1: Normal */}
                <div className="group flex items-center p-4 rounded-xl border border-input hover:border-primary/50 hover:bg-accent/50 cursor-pointer transition-all">
                  <span className="w-8 h-8 rounded-full border-2 border-muted flex items-center justify-center text-muted-foreground text-sm font-bold ml-4 group-hover:border-primary group-hover:text-primary">
                    ۱
                  </span>
                  <span className="text-foreground/80">گزینه اول: ۶</span>
                </div>

                {/* Option 2: Selected (User Choice) */}
                <div className="relative flex items-center p-4 rounded-xl border-2 border-primary bg-primary/5 cursor-pointer transition-all">
                  <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold ml-4 shadow-md">
                    ۲
                  </span>
                  <span className="font-bold text-foreground">
                    گزینه دوم: ۸ (انتخاب شما)
                  </span>
                  <div className="absolute left-4 w-2 h-2 rounded-full bg-primary"></div>
                </div>

                {/* Option 3: Correct (Analysis View) */}
                <div className="flex items-center p-4 rounded-xl border border-success bg-success/5 cursor-pointer transition-all">
                  <span className="w-8 h-8 rounded-full bg-success text-success-foreground flex items-center justify-center text-sm font-bold ml-4">
                    ۳
                  </span>
                  <span className="font-medium text-foreground/90">
                    گزینه سوم: ۱۰ (پاسخ صحیح کلید)
                  </span>
                </div>

                {/* Option 4: Wrong (Analysis View) */}
                <div className="flex items-center p-4 rounded-xl border border-destructive bg-destructive/5 cursor-pointer transition-all opacity-60">
                  <span className="w-8 h-8 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center text-sm font-bold ml-4">
                    ۴
                  </span>
                  <span className="font-medium text-foreground/90">
                    گزینه چهارم: ۱۲
                  </span>
                </div>
              </div>
            </div>

            {/* Exam Footer */}
            <div className="bg-muted/20 border-t border-border p-4 flex justify-between items-center">
              <button className="text-sm text-muted-foreground hover:text-destructive transition-colors">
                گزارش خطا در سوال
              </button>
              <div className="flex gap-3">
                <button className="px-5 py-2.5 rounded-lg border border-input bg-background hover:bg-accent transition-colors font-medium text-sm">
                  سوال قبلی
                </button>
                <button className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium text-sm shadow-lg shadow-primary/20">
                  ثبت و بعدی
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 5. ANALYTICS & CHARTS */}
        <section className="space-y-6 pb-20">
          <SectionTitle number="۵" title="تحلیل عملکرد (Analytics)" />

          <div className="grid md:grid-cols-2 gap-8">
            {/* Dashboard Card */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-1">روند پیشرفت تحصیلی</h3>
              <p className="text-sm text-muted-foreground mb-6">
                نمایش وضعیت در ۵ آزمون اخیر
              </p>

              <div className="flex items-end gap-2 h-48 w-full px-2">
                {/* Chart Bars simulated with CSS */}
                <div className="flex-1 bg-chart-1/20 rounded-t-lg relative group hover:bg-chart-1 transition-colors h-[40%]"></div>
                <div className="flex-1 bg-chart-1/20 rounded-t-lg relative group hover:bg-chart-1 transition-colors h-[65%]"></div>
                <div className="flex-1 bg-chart-1 rounded-t-lg relative group shadow-lg shadow-primary/20 h-[85%]">
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    ۸۵٪
                  </span>
                </div>
                <div className="flex-1 bg-chart-1/20 rounded-t-lg relative group hover:bg-chart-1 transition-colors h-[55%]"></div>
                <div className="flex-1 bg-chart-1/20 rounded-t-lg relative group hover:bg-chart-1 transition-colors h-[70%]"></div>
              </div>
            </div>

            {/* Chart Colors Palette */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-lg font-bold">پالت رنگی نمودارها</h3>
              <div className="space-y-3">
                <ChartRow color="bg-chart-1" name="Chart-1 (اصلی)" />
                <ChartRow color="bg-chart-2" name="Chart-2 (مثبت)" />
                <ChartRow color="bg-chart-3" name="Chart-3 (خنثی)" />
                <ChartRow color="bg-chart-4" name="Chart-4 (هشدار)" />
                <ChartRow color="bg-chart-5" name="Chart-5 (منفی)" />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

/* --- Helper Components --- */

function SectionTitle({ number, title }: { number: string; title: string }) {
  return (
    <div className="flex items-center gap-3 pb-4 border-b border-border/60">
      <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary font-bold border border-primary/20 text-sm">
        {number}
      </span>
      <h2 className="text-2xl font-bold text-foreground tracking-tight">
        {title}
      </h2>
    </div>
  );
}

function ColorCard({
  label,
  sub,
  bg,
  text,
  border = false,
}: {
  label: string;
  sub: string;
  bg: string;
  text: string;
  border?: boolean;
}) {
  return (
    <div
      className={`h-32 rounded-xl flex flex-col justify-between p-4 shadow-sm transition hover:scale-105 ${bg} ${text} ${
        border ? "border border-border" : ""
      }`}
    >
      <span className="font-bold text-lg tracking-wide">{label}</span>
      <span className="text-[10px] uppercase opacity-80 font-medium tracking-wider">
        {sub}
      </span>
    </div>
  );
}

function ChartRow({ color, name }: { color: string; name: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-12 h-12 rounded-lg ${color} shadow-sm`}></div>
      <span className="font-medium text-sm">{name}</span>
    </div>
  );
}
