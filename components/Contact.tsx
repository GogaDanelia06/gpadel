"use client";

import { Language, translations } from "@/types";

interface ContactProps {
  lang: Language;
}

export default function Contact({ lang }: ContactProps) {
  const t = translations[lang];

  const contactItems = [
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      label: t.contact_phone,
      value: "+995 599 261 322",
      href: "tel:+995599261322",
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      label: t.contact_address,
      value: "10 გრიგოლ აბაშიძის ქუჩა, Tskneti 0179",
      href: "https://maps.google.com/?q=Tskneti+Georgia",
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      label: t.contact_hours,
      value: t.contact_hours_value,
      href: null,
    },
  ];

  return (
    <section id="contact" className="py-24 bg-brand-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-primary-500 text-sm font-semibold uppercase tracking-widest">
            {lang === "ka" ? "კონტაქტი" : "Contact"}
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-black text-brand-ink">{t.contact_title}</h2>
          <p className="mt-4 text-brand-gray text-lg">
            {lang === "ka"
              ? "გამოგვიკავშირდით ნებისმიერ შეკითხვასთან დაკავშირებით"
              : "Get in touch for any questions or reservations"}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Contact info */}
          <div className="space-y-6">
            {contactItems.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-4 p-5 rounded-xl bg-white border border-brand-line shadow-sm hover:border-primary-400 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-primary-50 border border-primary-400 flex items-center justify-center text-primary-400 flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <p className="text-brand-gray text-sm mb-1">{item.label}</p>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="text-brand-ink font-medium hover:text-primary-400 transition-colors"
                      target={item.href.startsWith("http") ? "_blank" : undefined}
                      rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-brand-ink font-medium">{item.value}</p>
                  )}
                </div>
              </div>
            ))}

            {/* Phone CTA */}
            <a
              href="tel:+995599261322"
              className="flex items-center justify-center gap-3 w-full py-4 bg-primary-400 hover:bg-primary-500 text-white font-bold text-lg rounded-xl transition-colors shadow-md"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {lang === "ka" ? "დარეკე ახლა" : "Call Now"}
            </a>
          </div>

          {/* Map placeholder */}
          <div className="rounded-2xl overflow-hidden border border-brand-line shadow-sm h-80 lg:h-full min-h-[320px] bg-white relative">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2975.123456789!2d44.7458!3d41.7151!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDQyJzU0LjQiTiA0NMKwNDQnNDQuOSJF!5e0!3m2!1sen!2sge!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="GPadel location"
            />
            {/* Map overlay label */}
            <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg border border-brand-line shadow-sm">
              <p className="text-brand-ink text-sm font-semibold">GPadel Tskneti</p>
              <p className="text-brand-gray text-xs">10 Grigol Abashidze St.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
