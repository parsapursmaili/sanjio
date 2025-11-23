"use client";

import { useActionState, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { login, signup } from "./actions";
import {
  Loader2,
  Mail,
  Lock,
  User,
  ArrowLeft,
  Sparkles,
  Zap,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

// --- اسکیمای اعتبارسنجی ---
const authSchema = z.object({
  email: z.string().min(1, "ایمیل الزامی است").email("فرمت ایمیل صحیح نیست"),
  password: z.string().min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد"),
  fullName: z.string().optional(),
});

type AuthFormData = z.infer<typeof authSchema>;

export default function AuthPage() {
  const [isLoginMode, setIsLoginMode] = useState(true);

  const [loginState, loginAction, isLoginPending] = useActionState(login, null);
  const [signupState, signupAction, isSignupPending] = useActionState(
    signup,
    null
  );

  const state = isLoginMode ? loginState : signupState;
  const isPending = isLoginMode ? isLoginPending : isSignupPending;
  const formAction = isLoginMode ? loginAction : signupAction;

  const {
    register,
    trigger,
    formState: { errors },
    reset,
  } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
    mode: "onChange",
  });

  useEffect(() => {
    reset();
  }, [isLoginMode, reset]);

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-background font-sans selection:bg-primary/30">
      {/* --- پس‌زمینه متحرک (Background Blobs) --- */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 h-[500px] w-[500px] rounded-full bg-secondary/20 blur-[120px]" />
      </div>

      <div className="z-10 w-full max-w-5xl p-4 lg:p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex min-h-[600px] w-full overflow-hidden rounded-3xl border border-white/20 bg-white/60 shadow-2xl backdrop-blur-2xl dark:bg-black/40 dark:border-white/5"
        >
          {/* --- بخش فرم (سمت راست) --- */}
          <div className="relative flex w-full flex-col justify-center p-8 lg:w-1/2 lg:p-16">
            {/* سرتیتر */}
            <div className="mb-10 text-center lg:text-right">
              <AnimatePresence mode="wait">
                <motion.div
                  key={isLoginMode ? "login" : "signup"}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-2"
                >
                  <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
                    {isLoginMode ? "خوش‌آمدید 👋" : "شروع کنید 🚀"}
                  </h1>
                  <p className="text-muted-foreground">
                    {isLoginMode
                      ? "اطلاعات خود را برای ورود وارد کنید"
                      : "ساخت حساب کاربری در کمتر از ۱ دقیقه"}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* نمایش خطا */}
            <AnimatePresence>
              {state?.error && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: "auto", marginBottom: 24 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className="overflow-hidden rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive shadow-sm"
                >
                  {state.error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* فرم */}
            <form
              action={formAction}
              onSubmit={async (e) => {
                const isValid = await trigger();
                if (!isValid) e.preventDefault();
              }}
              className="space-y-5"
            >
              {/* فیلد نام (انیمیشنی) */}
              <AnimatePresence mode="popLayout">
                {!isLoginMode && (
                  <motion.div
                    initial={{ opacity: 0, y: -20, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -20, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-1 pb-2">
                      <label className="text-sm font-medium text-foreground/80">
                        نام و نام خانوادگی
                      </label>
                      <div className="relative group">
                        <User className="absolute right-3 top-3.5 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                        <input
                          {...register("fullName")}
                          required={!isLoginMode}
                          className={cn(
                            "h-12 w-full rounded-xl border border-border/50 bg-background/50 px-4 pr-10 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:bg-background focus:ring-4 focus:ring-primary/10",
                            errors.fullName &&
                              "border-destructive focus:ring-destructive/10"
                          )}
                          placeholder="مثال: علی رضایی"
                        />
                      </div>
                      {errors.fullName && (
                        <p className="text-xs text-destructive mr-1">
                          {errors.fullName.message}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ایمیل */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-foreground/80">
                  ایمیل
                </label>
                <div className="relative group">
                  <Mail className="absolute right-3 top-3.5 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <input
                    {...register("email")}
                    className={cn(
                      "h-12 w-full rounded-xl border border-border/50 bg-background/50 px-4 pr-10 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:bg-background focus:ring-4 focus:ring-primary/10",
                      errors.email &&
                        "border-destructive focus:ring-destructive/10"
                    )}
                    placeholder="name@example.com"
                    dir="ltr"
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-destructive mr-1 mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* پسورد */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-foreground/80">
                  رمز عبور
                </label>
                <div className="relative group">
                  <Lock className="absolute right-3 top-3.5 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <input
                    {...register("password")}
                    type="password"
                    className={cn(
                      "h-12 w-full rounded-xl border border-border/50 bg-background/50 px-4 pr-10 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:bg-background focus:ring-4 focus:ring-primary/10",
                      errors.password &&
                        "border-destructive focus:ring-destructive/10"
                    )}
                    placeholder="••••••••"
                    dir="ltr"
                  />
                </div>
                {errors.password && (
                  <p className="text-xs text-destructive mr-1 mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* دکمه سابمیت */}
              <motion.button
                type="submit"
                disabled={isPending}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative mt-4 flex h-12 w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-primary to-primary/90 text-white shadow-lg shadow-primary/25 transition-all hover:shadow-primary/40 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <div className="relative z-10 flex items-center gap-2 font-bold">
                  {isPending ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>لطفاً صبر کنید...</span>
                    </>
                  ) : isLoginMode ? (
                    <>
                      <span>ورود به حساب</span>
                      <ArrowLeft className="h-5 w-5" />
                    </>
                  ) : (
                    <>
                      <span>ثبت‌نام رایگان</span>
                      <Sparkles className="h-5 w-5" />
                    </>
                  )}
                </div>
              </motion.button>
            </form>

            {/* فوتر سوییچ */}
            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground">
                {isLoginMode
                  ? "حساب کاربری ندارید؟"
                  : "قبلاً ثبت‌نام کرده‌اید؟"}
                <button
                  type="button"
                  onClick={() => {
                    setIsLoginMode(!isLoginMode);
                    reset();
                  }}
                  className="mr-2 cursor-pointer font-bold text-primary underline-offset-4 hover:underline"
                >
                  {isLoginMode ? "ایجاد حساب" : "وارد شوید"}
                </button>
              </p>
            </div>
          </div>

          {/* --- بخش برندینگ (سمت چپ - فقط دسکتاپ) --- */}
          <div className="relative hidden w-1/2 overflow-hidden bg-primary lg:block">
            {/* گرادینت‌های پس‌زمینه */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-blue-600 to-indigo-700" />

            {/* اشکال متحرک */}
            <motion.div
              animate={{
                y: [0, -20, 0],
                rotate: [0, 5, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-20 top-20 h-96 w-96 rounded-full bg-white/10 blur-3xl"
            />
            <motion.div
              animate={{
                y: [0, 30, 0],
                rotate: [0, -5, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
              className="absolute -left-20 bottom-20 h-80 w-80 rounded-full bg-secondary/20 blur-3xl"
            />

            {/* محتوای روی برند */}
            <div className="relative z-10 flex h-full flex-col justify-between p-12 text-white">
              <div className="text-lg font-black tracking-widest opacity-80">
                SANJIO
              </div>

              <div className="space-y-8">
                <h2 className="text-5xl font-black leading-tight">
                  <span className="text-white/90">آیندهٔ</span> <br />
                  <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                    برگزاری آزمون
                  </span>
                </h2>

                <ul className="space-y-5">
                  <li className="flex items-center gap-4 text-lg font-medium text-white/90">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md">
                      <Zap className="h-5 w-5 text-yellow-300" />
                    </div>
                    سرعت بالا در ساخت آزمون
                  </li>
                  <li className="flex items-center gap-4 text-lg font-medium text-white/90">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md">
                      <ShieldCheck className="h-5 w-5 text-green-300" />
                    </div>
                    محیط امن و پایدار
                  </li>
                </ul>
              </div>

              <div className="flex items-center gap-4 text-sm font-medium text-white/60">
                <span>© ۱۴۰۴ سنجیو</span>
                <span className="h-1 w-1 rounded-full bg-white/40" />
                <span>نسخه ۴.۰</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
