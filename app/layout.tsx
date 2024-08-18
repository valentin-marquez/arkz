import type { Metadata } from "next";
import { Anek_Latin as FontSans } from "next/font/google";
import "@/styles/globals.css";
import { cn, getURL } from "@/lib/utils";
import { PropsWithChildren } from "react";
import { ThemeProvider } from "@/providers/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import Sidebar from "@/components/ui/sidebar";
import { AuthProvider } from "@/providers/auth-provider";
import CloudflareWebAnalyticsProvider from "next-cloudflare-web-analytics";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const title = "Victorix";
const description = "Victorix is a Team Database for nikke players.";

export const metadata: Metadata = {
  metadataBase: new URL(getURL()),
  title,
  description,
  openGraph: {
    title,
    description,
  },
  icons: {
    icon: {
      url: "/logo-white.png",
      sizes: "564x564",
    },
  },
};

export default function RootLayout({
  children,
}: PropsWithChildren): JSX.Element {
  return (
    <html lang="en" suppressHydrationWarning>
      <CloudflareWebAnalyticsProvider
        token={process.env.NEXT_PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN || ""}
        enabled={
          process.env.NEXT_PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN !== undefined
        }
      />
      <ThemeProvider
        defaultTheme="default"
        enableColorScheme
        disableTransitionOnChange
        themes={[
          "default",
          "dorothy",
          "dark-dorothy",
          "red-hood",
          "dark-red-hood",
        ]}
      >
        <AuthProvider>
          <body
            className={cn(
              "flex min-h-screen bg-background font-sans antialiased *:select-none",
              fontSans.variable
            )}
          >
            <Sidebar />
            <main className="flex-1 p-4 overflow-auto">{children}</main>
            <Toaster />
          </body>
        </AuthProvider>
      </ThemeProvider>
    </html>
  );
}
