"use client";

import { Language, translations } from "@/types";

interface AboutProps {
  lang: Language;
}

export default function About({ lang }: AboutProps) {
  const t = translations[lang];

  const features = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      label: lang === "ka" ? "პრემიუმ კომპლექსი" : "Premium Complex",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
      label: lang === "ka" ? "LED განათება" : "LED Lighting",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      label: lang === "ka" ? "ბუნებრივი გარემო" : "Nature Setting",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      label: lang === "ka" ? "09:00 — 02:00" : "09:00 — 02:00",
    },
  ];

  return (
    <section id="about" className="py-24 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <div>
            <span className="text-green-500 text-sm font-semibold uppercase tracking-widest">
              {lang === "ka" ? "ჩვენ შესახებ" : "About Us"}
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black text-white leading-tight">
              {lang === "ka" ? (
                <>
                  პადელის პირველი{" "}
                  <span className="text-green-400">პრემიუმ კომპლექსი</span>{" "}
                  წყნეთში
                </>
              ) : (
                <>
                  The First{" "}
                  <span className="text-green-400">Premium Padel Complex</span>{" "}
                  in Tskneti
                </>
              )}
            </h2>
            <p className="mt-6 text-slate-400 text-lg leading-relaxed">{t.about_p1}</p>
            <p className="mt-4 text-slate-400 text-lg leading-relaxed">{t.about_p2}</p>

            {/* Feature grid */}
            <div className="mt-10 grid grid-cols-2 gap-4">
              {features.map((f, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-4 rounded-xl bg-slate-800/60 border border-slate-700/50"
                >
                  <div className="text-green-400 flex-shrink-0">{f.icon}</div>
                  <span className="text-slate-300 text-sm font-medium">{f.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-green-900/50 to-slate-800 border border-slate-700/50 shadow-2xl">
              {/* Court illustration */}
              <div className="w-full h-full flex items-center justify-center p-8">
                <svg
                  viewBox="0 0 300 300"
                  className="w-full h-full opacity-80"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Court background */}
                  <rect x="30" y="30" width="240" height="240" rx="4" fill="#14532d" />
                  {/* Court lines */}
                  <rect x="30" y="30" width="240" height="240" rx="4" fill="none" stroke="#22c55e" strokeWidth="3" />
                  <line x1="150" y1="30" x2="150" y2="270" stroke="#22c55e" strokeWidth="2" />
                  <line x1="30" y1="150" x2="270" y2="150" stroke="#22c55e" strokeWidth="2" />
                  <rect x="55" y="55" width="190" height="190" fill="none" stroke="#16a34a" strokeWidth="1.5" />
                  {/* Net */}
                  <line x1="30" y1="150" x2="270" y2="150" stroke="white" strokeWidth="3" />
                  <circle cx="30" cy="150" r="4" fill="white" />
                  <circle cx="270" cy="150" r="4" fill="white" />
                  {/* Service boxes */}
                  <line x1="90" y1="55" x2="90" y2="150" stroke="#16a34a" strokeWidth="1" />
                  <line x1="210" y1="55" x2="210" y2="150" stroke="#16a34a" strokeWidth="1" />
                  <line x1="90" y1="150" x2="90" y2="245" stroke="#16a34a" strokeWidth="1" />
                  <line x1="210" y1="150" x2="210" y2="245" stroke="#16a34a" strokeWidth="1" />
                  {/* Ball */}
                  <circle cx="150" cy="100" r="12" fill="#facc15" />
                  <path d="M144 95 Q150 90 156 95" stroke="#a16207" strokeWidth="1.5" fill="none" />
                  <path d="M144 105 Q150 110 156 105" stroke="#a16207" strokeWidth="1.5" fill="none" />
                  {/* Players */}
                  <circle cx="100" cy="200" r="10" fill="#0ea5e9" />
                  <line x1="100" y1="210" x2="100" y2="235" stroke="#0ea5e9" strokeWidth="2" />
                  <line x1="100" y1="220" x2="85" y2="230" stroke="#0ea5e9" strokeWidth="2" />
                  <line x1="100" y1="220" x2="115" y2="215" stroke="#0ea5e9" strokeWidth="2" />
                  <circle cx="200" cy="200" r="10" fill="#f97316" />
                  <line x1="200" y1="210" x2="200" y2="235" stroke="#f97316" strokeWidth="2" />
                  <line x1="200" y1="220" x2="185" y2="215" stroke="#f97316" strokeWidth="2" />
                  <line x1="200" y1="220" x2="215" y2="230" stroke="#f97316" strokeWidth="2" />
                </svg>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-4 -right-4 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg shadow-green-900/50 font-bold">
              <div className="text-2xl">5.0 ★</div>
              <div className="text-xs opacity-80">
                {lang === "ka" ? "Google Rating" : "Google Rating"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
