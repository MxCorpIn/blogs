import Footer from "@/components/landing/Footer";
import Navbar from "@/components/landing/Navbar";
import { APP_URL } from "@/lib/constants";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import "./globals.css";

const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem("ossium-theme");var dark=t?t==="dark":true;var r=document.documentElement;r.classList.toggle("dark",dark);}catch(e){document.documentElement.classList.add("dark");}})();`;

const CRITICAL_CSS =
  "html,body{background:var(--background,#0e0f10);color:var(--foreground,#e5e5e5)}body{margin:0}";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: "ossium Blog | Open Source Learning Hub",
  description:
    "Guides, how-tos, and Q&A on open source contribution, GSoC, good first issues, GitHub workflows, and tools for contributors.",
  icons: {
    icon: [
      { url: "/ossium_logo.webp", type: "image/webp", sizes: "128x128" },
      { url: "/ossium_logo_64.png", type: "image/png", sizes: "64x64" },
    ],
    apple: [{ url: "/ossium_logo_64.png", type: "image/png", sizes: "64x64" }],
    shortcut: "/ossium_logo.webp",
  },
  keywords: [
    "open source blog",
    "contribute to open source",
    "gsoc guide",
    "good first issue",
    "github contribution guide",
    "open source for beginners",
    "ossium blog",
    "hacktoberfest guide",
  ],
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-image-preview": "large",
    },
  },
  alternates: {
    canonical: APP_URL,
    types: {
      "application/rss+xml": `${APP_URL}/feed.xml`,
    },
  },
  applicationName: "ossium Blog",
  category: "Technology",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f4f5" },
    { media: "(prefers-color-scheme: dark)", color: "#0e0f10" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        {/* Set theme before paint to avoid a flash of the wrong theme */}
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        {/* Critical above-the-fold paint (avoids white flash before main CSS) */}
        <style dangerouslySetInnerHTML={{ __html: CRITICAL_CSS }} />
        {/* AI / LLM discoverability (llmstxt.org) */}
        <link rel="llms" href="/llms.txt" />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <div className="relative min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <Analytics />
      </body>
    </html>
  );
}
