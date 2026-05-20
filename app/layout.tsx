import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LanguageProvider } from "@/lib/LanguageContext";
import { ToastProvider } from "@/components/ui/ToastProvider";

export const metadata: Metadata = {
  title: "GPadel | ჯიპადელი წყნეთში",
  description:
    "GPadel — premium padel courts in Tskneti, Georgia. Book your court online. Open daily 09:00–02:00. ჯიპადელი წყნეთში — ​ პადელის პრემიუმ კორტები.",
  keywords: [
    "padel",
    "padel court",
    "Tskneti",
    "Georgia",
    "sport",
    "პადელი",
    "წყნეთი",
    "საქართველო",
    "GPadel",
  ],
  authors: [{ name: "GPadel" }],
  manifest: "/manifest.webmanifest",
  applicationName: "GPadel",
  appleWebApp: {
    capable: true,
    title: "GPadel",
    statusBarStyle: "default",
  },
  openGraph: {
    title: "GPadel | ჯიპადელი წყნეთში",
    description: "Premium padel courts in Tskneti, Georgia. Book online!",
    siteName: "GPadel",
    locale: "ka_GE",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: ["/icon.svg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ka" className="scroll-smooth">
      <body className="bg-white text-brand-ink antialiased">
        <LanguageProvider>
          <ToastProvider>{children}</ToastProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
