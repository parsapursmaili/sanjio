import { Metadata } from "next";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "اتاق آزمون | سنجیو",
  description: "سامانه برگزاری آزمون آنلاین",
};

export default function ExamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body className="font-sans antialiased bg-background text-foreground selection:bg-primary/20">
        {/* Background Pattern: یک پترن مشبک بسیار محو برای حس تکنیکال بودن */}
        <div className="fixed inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

        {/* Ambient Glow: نور محیطی برای جذابیت بصری */}
        <div className="fixed left-0 top-0 -z-10 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[100px]" />
        <div className="fixed right-0 bottom-0 -z-10 h-[500px] w-[500px] rounded-full bg-secondary/10 blur-[100px]" />

        <main className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8">
          {children}
        </main>

        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}
