import { Red_Hat_Display as FontSans } from "next/font/google";
import "@/styles/globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import Sidebar from "@/components/admin/sidebar";
import routes from "@/lib/links";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <ThemeProvider
        defaultTheme="default"
        enableColorScheme
        disableTransitionOnChange
        enableSystem={false}
        themes={["default"]}
      >
        <body
          className={cn(
            "flex min-h-screen bg-background font-sans antialiased *:select-none",
            fontSans.variable
          )}
        >
          <div className="flex min-h-screen">
            <Sidebar items={routes} />
            <main className="flex-1 overflow-y-auto p-8">{children}</main>
            <Toaster />
          </div>
        </body>
      </ThemeProvider>
    </html>
  );
}
