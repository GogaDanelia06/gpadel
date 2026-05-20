"use client";

import Link from "next/link";
import { translations } from "@/types";
import { useLanguage } from "@/lib/LanguageContext";

export default function PaymentFailPage() {
  const { lang } = useLanguage();
  const t = translations[lang];

  return (
    <main className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Fail icon */}
        <div className="w-24 h-24 rounded-full bg-red-600/20 border-2 border-red-500/50 flex items-center justify-center mx-auto mb-8">
          <svg
            className="w-12 h-12 text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-black text-white mb-4">{t.payment_fail_title}</h1>
        <p className="text-slate-400 text-lg mb-10">{t.payment_fail_msg}</p>

        {/* Help */}
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 mb-8 text-left">
          <p className="text-slate-300 text-sm mb-4 font-semibold">
            {lang === "ka" ? "დახმარება გჭირდებათ?" : "Need help?"}
          </p>
          <a
            href="tel:+995599261322"
            className="flex items-center gap-3 text-slate-400 hover:text-green-400 transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            +995 599 261 322
          </a>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/book"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl transition-colors"
          >
            {t.payment_try_again}
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-slate-700/50 hover:border-slate-500 text-slate-400 hover:text-white font-semibold rounded-xl transition-all"
          >
            {t.payment_go_home}
          </Link>
        </div>
      </div>
    </main>
  );
}
