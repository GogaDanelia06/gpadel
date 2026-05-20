"use client";

import { Language, translations } from "@/types";

interface ReviewsProps {
  lang: Language;
}

const reviews = [
  {
    name: "Zuka Chkonia",
    nameKa: "ზუკა ჩქონია",
    avatar: "ZC",
    rating: 5,
    dateEn: "A month ago",
    dateKa: "ერთი თვის წინ",
    textEn:
      "Absolutely fantastic padel courts! The facility is top-notch, with excellent court surfaces and great lighting for evening games. The staff is very friendly and helpful. The location in Tskneti surrounded by nature makes it a truly unique experience. Highly recommend for both beginners and experienced players!",
    textKa:
      "საოცარი პადელის კორტები! ობიექტი ძალიან მაღალი დონისაა — შესანიშნავი კორტის საფარი და კარგი განათება საღამოს თამაშებისთვის. პერსონალი ძალიან მეგობრული და სასარგებლოა. წყნეთში ბუნებით გარშემორტყმული მდებარეობა ნამდვილად უნიკალურ გამოცდილებას ქმნის. გირჩევ ყველას — დამწყებებს და გამოცდილ მოთამაშეებსაც!",
  },
  {
    name: "Barbare Barabadze",
    nameKa: "ბარბარე ბარაბაძე",
    avatar: "BB",
    rating: 5,
    dateEn: "2 weeks ago",
    dateKa: "2 კვირის წინ",
    textEn:
      "Best padel experience near Tbilisi! The courts are in perfect condition and the atmosphere is amazing. Love that it's in the mountains — feels like a mini escape from the city. The booking process was smooth and the price is very reasonable. Will definitely be coming back regularly!",
    textKa:
      "საუკეთესო პადელის გამოცდილება თბილისის მახლობლად! კორტები სრულყოფილ მდგომარეობაშია და ატმოსფერო უდიდესია. მიყვარს, რომ მთებშია — თითქოს ქალაქიდან გამოქცევა. დაჯავშნა გლუვად ჩაივლო და ფასი ძალიან გონივრულია. ნამდვილად დავბრუნდები!",
  },
];
export default function Reviews({ lang }: ReviewsProps) {
  const t = translations[lang];
  return (
    <section id="reviews" className="py-24 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-green-500 text-sm font-semibold uppercase tracking-widest">
            {lang === "ka" ? "Google მიმოხილვები" : "Google Reviews"}
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-black text-white">{t.reviews_title}</h2>
          <p className="mt-4 text-slate-400 text-lg">{t.reviews_subtitle}</p>
        </div>
        {/* Review cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {reviews.map((review, idx) => (
            <div
              key={idx}
              className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-8 hover:border-green-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-green-900/10"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${i < review.rating ? "text-yellow-400" : "text-slate-600"}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              {/* Review text */}
              <blockquote className="text-slate-300 text-base leading-relaxed mb-6">
                &ldquo;{lang === "ka" ? review.textKa : review.textEn}&rdquo;
              </blockquote>
              {/* Reviewer */}
              <div className="flex items-center gap-4 pt-5 border-t border-slate-700/50">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {review.avatar}
                </div>
                <div>
                  <div className="text-white font-semibold">
                    {lang === "ka" ? review.nameKa : review.name}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-slate-500 text-sm">
                      {lang === "ka" ? review.dateKa : review.dateEn}
                    </span>
                    <span className="text-slate-700">•</span>
                    <span className="flex items-center gap-1 text-slate-500 text-sm">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a6.033 6.033 0 110-12.064c1.498 0 2.866.549 3.921 1.453l2.814-2.814A9.969 9.969 0 0012.545 2C7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748l-9.426-.013z" />
                      </svg>
                      Google
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Overall rating */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-slate-800/60 border border-slate-700/50">
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-white font-bold text-lg">5.0</span>
            <span className="text-slate-400 text-sm">
              {lang === "ka" ? "Google-ზე" : "on Google"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
