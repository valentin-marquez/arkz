import Sidebar from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { cn, getURL } from "@/lib/utils";
import { AuthProvider } from "@/providers/auth-provider";
import FramerProvider from "@/providers/framer-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import "@/styles/globals.css";
import type { Metadata } from "next";
import CloudflareWebAnalyticsProvider from "next-cloudflare-web-analytics";
import { Red_Hat_Display as FontSans } from "next/font/google";
import { PropsWithChildren } from "react";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(getURL()),
  title: {
    default: "Arkz: Ultimate Nikke Team Database | Goddess of Victory Guide",
    template: "%s | Arkz - Nikke: Goddess of Victory",
  },
  description:
    "Optimize your Nikke: Goddess of Victory squads with Arkz, the premier team database. Explore top-tier compositions, character stats, and game strategies for Story, Interception, and Tribe Tower modes.",
  keywords:
    "Nikke, Goddess of Victory, team builder, character database, mobile game strategy, Arkz, squad optimization, Story mode, Interception, Tribe Tower",
  authors: [
    { name: "Arkz Team" },
    { name: "Valentin Marquez", url: "https://nozz.dev/" },
  ],
  openGraph: {
    title: "Arkz: Ultimate Nikke Team Database | Goddess of Victory Guide",
    description:
      "Optimize your Nikke: Goddess of Victory squads with Arkz. Explore top-tier team compositions for Story, Interception, and Tribe Tower modes.",
    url: getURL(),
    siteName: "Arkz",
    images: [
      {
        url: getURL("/og-image.png"),
        width: 1200,
        height: 630,
        alt: "Arkz: Master Your Nikke Squads",
      },
    ],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Arkz: Ultimate Nikke Team Database",
    description:
      "Optimize your Nikke: Goddess of Victory squads with Arkz. Explore top-tier team compositions for all game modes.",
    images: [getURL("/logo.png")],
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      {
        url: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: getURL(),
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
      <AuthProvider>
        <FramerProvider>
          <body
            className={cn(
              "flex min-h-screen bg-background font-sans antialiased *:select-none ",
              fontSans.variable
            )}
          >
            <div className="flex min-h-screen w-full flex-col bg-muted/40">
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
                enableSystem={false}
              >
                <div className="flex w-full">
                  <div className="w-16 flex-shrink-0 sticky z-50">
                    <Sidebar />
                  </div>
                  <main className="flex-1 p-4 overflow-auto">{children}</main>
                </div>
                <Toaster />
              </ThemeProvider>
            </div>
          </body>
        </FramerProvider>
      </AuthProvider>
    </html>
  );
}
