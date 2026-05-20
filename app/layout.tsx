import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LanguageProvider } from "@/lib/LanguageContext";

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
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%2316a34a'/><text y='.9em' font-size='65' x='17'>G</text></svg>",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
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
      <body className="bg-slate-900 text-white antialiased">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
