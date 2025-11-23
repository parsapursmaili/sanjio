"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import {
  LayoutDashboard,
  GraduationCap,
  History,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  User,
  Bell,
  Search,
} from "lucide-react";

// --- Types ---
interface DashboardShellProps {
  children: React.ReactNode;
  user: any;
  profile: any;
}

// --- Menu Configuration ---
const NAV_ITEMS = [
  {
    title: "داشبورد",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "آزمون‌ها",
    href: "/dashboard/exams",
    icon: GraduationCap,
  },
  {
    title: "سوابق و نتایج",
    href: "/dashboard/history",
    icon: History,
  },
  {
    title: "تنظیمات پروفایل",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export default function DashboardShell({
  children,
  user,
  profile,
}: DashboardShellProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-background text-foreground overflow-hidden font-sans">
      {/* 1. Desktop Sidebar */}
      <aside className="hidden md:flex w-72 flex-col border-l border-border bg-card/50 backdrop-blur-xl h-full shadow-sm z-50">
        <SidebarContent profile={profile} />
      </aside>

      {/* 2. Mobile Sidebar (Drawer) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed right-0 top-0 bottom-0 w-3/4 max-w-xs bg-card border-l border-border z-50 md:hidden flex flex-col shadow-2xl"
            >
              <div className="absolute left-4 top-4">
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <SidebarContent profile={profile} isMobile />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* 3. Main Content Area */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-border bg-background/80 backdrop-blur-md flex items-center justify-between px-4 md:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 -mr-2 text-muted-foreground hover:bg-muted rounded-md"
            >
              <Menu size={20} />
            </button>

            {/* Search Bar (Visual Only for now) */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-full border border-border focus-within:ring-2 focus-within:ring-ring/20 transition-all w-64">
              <Search size={16} className="text-muted-foreground" />
              <input
                type="text"
                placeholder="جستجو در آزمون‌ها..."
                className="bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground/70 w-full"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative p-2 text-muted-foreground hover:text-primary hover:bg-muted rounded-full transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full ring-2 ring-background" />
            </button>

            {/* User Dropdown Trigger (Simple version) */}
            <div className="flex items-center gap-3 pr-3 border-r border-border">
              <div className="text-left hidden sm:block">
                <p className="text-sm font-medium text-foreground">
                  {profile?.full_name || "کاربر جدید"}
                </p>
                <p className="text-xs text-muted-foreground">دانش‌آموز</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary overflow-hidden">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={18} />
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          <div className="mx-auto max-w-6xl space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

// --- Sub-Component: Sidebar Content ---
function SidebarContent({
  profile,
  isMobile = false,
}: {
  profile: any;
  isMobile?: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    const promise = supabase.auth.signOut();
    toast.promise(promise, {
      loading: "در حال خروج...",
      success: "با موفقیت خارج شدید",
      error: "خطا در خروج",
    });
    await promise;
    router.push("/login");
  };

  return (
    <div className="flex flex-col h-full p-4">
      {/* Logo Area */}
      <div
        className={cn(
          "flex items-center gap-3 px-2 mb-8",
          isMobile ? "mt-8" : "mt-2"
        )}
      >
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
          <GraduationCap className="text-white" size={24} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">
            سنجیو
          </h1>
          <span className="text-xs text-muted-foreground font-medium">
            Sanjio Platform
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1.5">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative group block"
            >
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute inset-0 bg-primary/10 rounded-xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              )}
              <div
                className={cn(
                  "relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200",
                  isActive
                    ? "text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                )}
              >
                <item.icon
                  size={20}
                  className={cn(
                    "transition-colors",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground group-hover:text-foreground"
                  )}
                />
                <span>{item.title}</span>
                {isActive && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="mr-auto"
                  >
                    <ChevronRight size={16} />
                  </motion.div>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="mt-auto pt-4 border-t border-border space-y-2">
        {/* Support Card (Optional Marketing) */}
        {!isMobile && (
          <div className="mb-4 p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/50 border border-primary/10">
            <h4 className="text-sm font-bold text-foreground mb-1">
              پلن رایگان
            </h4>
            <p className="text-xs text-muted-foreground mb-3">
              شما در حال استفاده از نسخه پایه هستید.
            </p>
            <button className="w-full text-xs bg-primary text-white py-2 rounded-lg shadow-md shadow-primary/20 hover:bg-primary/90 transition-all">
              ارتقا حساب
            </button>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive transition-all duration-200 group"
        >
          <LogOut
            size={20}
            className="group-hover:rotate-12 transition-transform"
          />
          <span className="font-medium">خروج از حساب</span>
        </button>
      </div>
    </div>
  );
}
