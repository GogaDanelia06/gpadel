"use client";

import Link from "next/link";
import { translations } from "@/types";
import { useLanguage } from "@/lib/LanguageContext";

export default function PaymentSuccessPage() {
  const { lang } = useLanguage();
  const t = translations[lang];

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Success icon */}
        <div className="w-24 h-24 rounded-full bg-primary-50 border-2 border-primary-400 flex items-center justify-center mx-auto mb-8">
          <svg
            className="w-12 h-12 text-primary-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-black text-brand-ink mb-4">{t.payment_success_title}</h1>
        <p className="text-brand-gray text-lg mb-10">{t.payment_success_msg}</p>

        {/* Confetti-like decoration */}
        <div className="flex justify-center gap-2 mb-10 text-2xl">
          <span>🎾</span>
          <span>🏆</span>
          <span>🎾</span>
        </div>

        {/* Info */}
        <div className="bg-brand-surface border border-brand-line rounded-2xl p-6 mb-8 text-left space-y-3">
          <div className="flex items-center gap-3 text-brand-ink text-sm">
            <svg className="w-5 h-5 text-primary-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {lang === "ka"
              ? "დასტური გაიგზავნება თქვენს ელ-ფოსტაზე"
              : "Confirmation sent to your email"}
          </div>
          <div className="flex items-center gap-3 text-brand-ink text-sm">
            <svg className="w-5 h-5 text-primary-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            10 გრიგოლ აბაშიძის ქუჩა, Tskneti 0179
          </div>
          <div className="flex items-center gap-3 text-brand-ink text-sm">
            <svg className="w-5 h-5 text-primary-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            +995 599 261 322
          </div>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-4 bg-primary-400 hover:bg-primary-500 text-white font-bold text-lg rounded-xl transition-colors shadow-md"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          {t.payment_go_home}
        </Link>
      </div>
    </main>
  );
}
