"use client";

import Link from "next/link";
import { translations } from "@/types";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingWizard from "@/components/booking/BookingWizard";
import { useLanguage } from "@/lib/LanguageContext";

export default function BookPage() {
  const { lang, setLang } = useLanguage();
  const t = translations[lang];

  return (
    <>
      <Navbar lang={lang} onLangChange={setLang} />
      <main className="min-h-screen bg-white pt-24 pb-16">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="text-center">
            {/* Breadcrumb */}
            <div className="flex items-center justify-center gap-2 text-sm text-brand-mute mb-6">
              <Link href="/" className="hover:text-primary-400 transition-colors">
                {t.nav_home}
              </Link>
              <span>/</span>
              <span className="text-brand-ink">{t.nav_book}</span>
            </div>

            <span className="text-primary-500 text-sm font-semibold uppercase tracking-widest">
              {lang === "ka" ? "ონლაინ ჯავშანი" : "Online Booking"}
            </span>
            <h1 className="mt-3 text-3xl sm:text-4xl font-black text-brand-ink">
              {t.book_title}
            </h1>
            <p className="mt-4 text-brand-gray text-lg max-w-lg mx-auto">
              {lang === "ka"
                ? "შეარჩიეთ სასურველი თარიღი, დრო და გადაიხადეთ ონლაინ"
                : "Select your preferred date, time and pay online"}
            </p>
          </div>
        </div>

        {/* Wizard */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BookingWizard lang={lang} />
        </div>
        {/* Info bar */}
        <div className="max-w-2xl mx-auto px-4 mt-10">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-brand-gray">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              {lang === "ka" ? "უსაფრთხო გადახდა" : "Secure Payment"}
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {lang === "ka" ? "დასტური 1 წუთში" : "Confirmation in 1 min"}
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <a href="tel:+995599261322" className="hover:text-primary-400 transition-colors">
                +995 599 261 322
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer lang={lang} />
    </>
  );
}
