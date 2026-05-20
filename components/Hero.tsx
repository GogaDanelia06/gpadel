"use client";

import Link from "next/link";
import { Language, translations } from "@/types";

interface HeroProps {
  lang: Language;
}

export default function Hero({ lang }: HeroProps) {
  const t = translations[lang];

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-brand-surface to-primary-50"
    >
      {/* Court lines overlay */}
      <div className="absolute inset-0 opacity-25">
        <svg
          className="w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="15" y="15" width="70" height="70" fill="none" stroke="#61CE70" strokeWidth="0.3" />
          <line x1="50" y1="15" x2="50" y2="85" stroke="#61CE70" strokeWidth="0.3" />
          <line x1="15" y1="50" x2="85" y2="50" stroke="#61CE70" strokeWidth="0.3" />
          <rect x="25" y="25" width="50" height="50" fill="none" stroke="#61CE70" strokeWidth="0.15" />
          <ellipse cx="50" cy="50" rx="8" ry="8" fill="none" stroke="#61CE70" strokeWidth="0.3" />
        </svg>
      </div>

      {/* Soft radial glow */}
      <div className="absolute inset-0 bg-gradient-radial from-primary-50 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto pt-20">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 border border-primary-400 text-primary-500 text-sm font-medium mb-8 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-primary-400 animate-pulse" />
          Tskneti, Georgia
        </div>

        {/* Main headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-brand-ink mb-6 leading-tight animate-slide-up">
          {lang === "ka" ? (
            <>
              <span className="block">ჯიპადელი</span>
              <span className="block text-primary-400">წყნეთში</span>
            </>
          ) : (
            <>
              <span className="block">GPadel</span>
              <span className="block text-primary-400">In Tskneti</span>
            </>
          )}
        </h1>

        {/* Subheadline */}
        <p className="text-lg sm:text-xl text-brand-gray mb-10 max-w-2xl mx-auto leading-relaxed animate-slide-up">
          {t.hero_subheadline}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up">
          <Link
            href="/book"
            className="px-8 py-4 bg-primary-400 hover:bg-primary-500 text-white font-bold text-lg rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            {t.hero_cta}
          </Link>
          <a
            href="#about"
            className="px-8 py-4 border-2 border-primary-400 text-primary-400 hover:bg-primary-50 font-semibold text-lg rounded-xl transition-all duration-200"
          >
            {lang === "ka" ? "გაიგე მეტი" : "Learn More"}
          </a>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-8 mt-16 text-center">
          <div>
            <div className="text-3xl font-black text-brand-ink">2</div>
            <div className="text-brand-gray text-sm mt-1">
              {lang === "ka" ? "კორტი" : "Courts"}
            </div>
          </div>
          <div className="w-px h-10 bg-brand-line" />
          <div>
            <div className="text-3xl font-black text-brand-ink">5.0</div>
            <div className="text-brand-gray text-sm mt-1">
              {lang === "ka" ? "რეიტინგი" : "Rating"} ★
            </div>
          </div>
          <div className="w-px h-10 bg-brand-line" />
          <div>
            <div className="text-3xl font-black text-brand-ink">17h</div>
            <div className="text-brand-gray text-sm mt-1">
              {lang === "ka" ? "ყოველდღე" : "Daily"}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />

      {/* Scroll indicator */}
      <a
        href="#about"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-brand-mute hover:text-primary-400 transition-colors animate-bounce"
        aria-label="Scroll down"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </a>
    </section>
  );
}
