"use client";

import Link from "next/link";
import { Language, translations } from "@/types";

interface CourtsProps {
  lang: Language;
}

export default function Courts({ lang }: CourtsProps) {
  const t = translations[lang];

  const courts = [
    {
      name: t.court1_name,
      desc: t.court1_desc,
      accent: "bg-primary-400",
      badge: lang === "ka" ? "პანორამა" : "Panorama",
    },
    {
      name: t.court2_name,
      desc: t.court2_desc,
      accent: "bg-brand-blue",
      badge: lang === "ka" ? "შიდა" : "Indoor",
    },
  ];

  const features = [
    t.court_feature_lights,
    t.court_feature_surface,
    t.court_feature_equipment,
  ];

  return (
    <section id="courts" className="py-24 bg-brand-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-primary-500 text-sm font-semibold uppercase tracking-widest">
            {lang === "ka" ? "კორტები" : "Courts"}
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-black text-brand-ink">{t.courts_title}</h2>
          <p className="mt-4 text-brand-gray text-lg max-w-xl mx-auto">{t.courts_subtitle}</p>
        </div>

        {/* Court cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {courts.map((court, idx) => (
            <div
              key={idx}
              className="group relative rounded-2xl bg-white border border-brand-line shadow-md overflow-hidden hover:border-primary-400 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Court visual */}
              <div className="relative h-48 bg-gradient-to-b from-primary-50 to-brand-surface flex items-center justify-center overflow-hidden">
                <svg
                  viewBox="0 0 200 120"
                  className="w-4/5 opacity-60 group-hover:opacity-80 transition-opacity"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect x="10" y="10" width="180" height="100" rx="2" fill="#A8E5B1" />
                  <rect x="10" y="10" width="180" height="100" rx="2" fill="none" stroke="#61CE70" strokeWidth="2" />
                  <line x1="100" y1="10" x2="100" y2="110" stroke="#61CE70" strokeWidth="1.5" />
                  <line x1="10" y1="60" x2="190" y2="60" stroke="white" strokeWidth="2.5" />
                  <rect x="35" y="30" width="60" height="30" fill="none" stroke="#4FB45E" strokeWidth="1" />
                  <rect x="105" y="30" width="60" height="30" fill="none" stroke="#4FB45E" strokeWidth="1" />
                  <circle cx="100" cy="35" r="6" fill="#facc15" />
                </svg>
                <span className={`absolute top-4 right-4 ${court.accent} text-white text-xs font-bold px-3 py-1 rounded-full`}>
                  {court.badge}
                </span>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-2xl font-black text-brand-ink mb-3">{court.name}</h3>
                <p className="text-brand-gray leading-relaxed mb-5">{court.desc}</p>

                {/* Features */}
                <div className="mb-6">
                  <p className="text-brand-mute text-xs uppercase tracking-wider mb-2">
                    {t.court_features_title}
                  </p>
                  <ul className="flex flex-wrap gap-2">
                    {features.map((f, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-1.5 text-sm text-brand-ink bg-brand-surface px-3 py-1.5 rounded-lg"
                      >
                        <span className="text-primary-400">✓</span> {f}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Pricing */}
                <div className="flex items-center justify-between border-t border-brand-line pt-5">
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-primary-400">20₾</span>
                      <span className="text-brand-gray text-sm">
                        /{lang === "ka" ? "საათი" : "hour"}
                      </span>
                    </div>
                    <div className="text-brand-mute text-xs mt-0.5">{t.court_hour}</div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-baseline gap-1 justify-end">
                      <span className="text-xl font-bold text-brand-ink">80₾</span>
                      <span className="text-brand-gray text-sm">
                        /{lang === "ka" ? "საათი" : "hour"}
                      </span>
                    </div>
                    <div className="text-brand-mute text-xs mt-0.5">
                      {lang === "ka" ? "კორტი მთლიანად" : "Full court"}
                    </div>
                  </div>
                </div>

                <Link
                  href="/book"
                  className="mt-5 block w-full text-center py-3 bg-primary-400 hover:bg-primary-500 text-white font-bold rounded-xl transition-colors"
                >
                  {t.court_book_now}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Pricing note */}
        <p className="text-center text-brand-mute text-sm mt-8">
          {lang === "ka"
            ? "* ფასები მოიცავს ინვენტარის გამოყენებას. ჯავშანი 1 საათიდან."
            : "* Prices include equipment use. Minimum booking 1 hour."}
        </p>
      </div>
    </section>
  );
}
