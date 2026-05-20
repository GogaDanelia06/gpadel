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
      gradient: "from-green-900/40 to-slate-800/80",
      accent: "bg-green-600",
      badge: lang === "ka" ? "პანორამა" : "Panorama",
    },
    {
      name: t.court2_name,
      desc: t.court2_desc,
      gradient: "from-blue-900/40 to-slate-800/80",
      accent: "bg-blue-600",
      badge: lang === "ka" ? "შიდა" : "Indoor",
    },
  ];

  const features = [
    t.court_feature_lights,
    t.court_feature_surface,
    t.court_feature_equipment,
  ];

  return (
    <section id="courts" className="py-24 bg-slate-800/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-green-500 text-sm font-semibold uppercase tracking-widest">
            {lang === "ka" ? "კორტები" : "Courts"}
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-black text-white">{t.courts_title}</h2>
          <p className="mt-4 text-slate-400 text-lg max-w-xl mx-auto">{t.courts_subtitle}</p>
        </div>

        {/* Court cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {courts.map((court, idx) => (
            <div
              key={idx}
              className={`group relative rounded-2xl bg-gradient-to-br ${court.gradient} border border-slate-700/50 overflow-hidden hover:border-green-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-green-900/20`}
            >
              {/* Court visual */}
              <div className="relative h-48 bg-gradient-to-b from-green-900/30 to-slate-900/50 flex items-center justify-center overflow-hidden">
                <svg
                  viewBox="0 0 200 120"
                  className="w-4/5 opacity-40 group-hover:opacity-60 transition-opacity"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect x="10" y="10" width="180" height="100" rx="2" fill="#166534" />
                  <rect x="10" y="10" width="180" height="100" rx="2" fill="none" stroke="#22c55e" strokeWidth="2" />
                  <line x1="100" y1="10" x2="100" y2="110" stroke="#22c55e" strokeWidth="1.5" />
                  <line x1="10" y1="60" x2="190" y2="60" stroke="white" strokeWidth="2.5" />
                  <rect x="35" y="30" width="60" height="30" fill="none" stroke="#16a34a" strokeWidth="1" />
                  <rect x="105" y="30" width="60" height="30" fill="none" stroke="#16a34a" strokeWidth="1" />
                  <circle cx="100" cy="35" r="6" fill="#facc15" />
                </svg>
                <span className={`absolute top-4 right-4 ${court.accent} text-white text-xs font-bold px-3 py-1 rounded-full`}>
                  {court.badge}
                </span>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-2xl font-black text-white mb-3">{court.name}</h3>
                <p className="text-slate-400 leading-relaxed mb-5">{court.desc}</p>

                {/* Features */}
                <div className="mb-6">
                  <p className="text-slate-500 text-xs uppercase tracking-wider mb-2">
                    {t.court_features_title}
                  </p>
                  <ul className="flex flex-wrap gap-2">
                    {features.map((f, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-1.5 text-sm text-slate-300 bg-slate-700/50 px-3 py-1.5 rounded-lg"
                      >
                        <span className="text-green-400">✓</span> {f}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Pricing */}
                <div className="flex items-center justify-between border-t border-slate-700/50 pt-5">
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-green-400">30₾</span>
                      <span className="text-slate-400 text-sm">
                        /{lang === "ka" ? "საათი" : "hour"}
                      </span>
                    </div>
                    <div className="text-slate-500 text-xs mt-0.5">{t.court_hour}</div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-baseline gap-1 justify-end">
                      <span className="text-xl font-bold text-white">120₾</span>
                      <span className="text-slate-400 text-sm">
                        /{lang === "ka" ? "საათი" : "hour"}
                      </span>
                    </div>
                    <div className="text-slate-500 text-xs mt-0.5">
                      {lang === "ka" ? "კორტი მთლიანად" : "Full court"}
                    </div>
                  </div>
                </div>

                <Link
                  href="/book"
                  className="mt-5 block w-full text-center py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl transition-colors"
                >
                  {t.court_book_now}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Pricing note */}
        <p className="text-center text-slate-500 text-sm mt-8">
          {lang === "ka"
            ? "* ფასები მოიცავს ინვენტარის გამოყენებას. ჯავშანი 1 საათიდან."
            : "* Prices include equipment use. Minimum booking 1 hour."}
        </p>
      </div>
    </section>
  );
}
