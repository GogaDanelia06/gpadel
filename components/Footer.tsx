"use client";

import Link from "next/link";
import { Language, translations } from "@/types";

interface FooterProps {
  lang: Language;
}

export default function Footer({ lang }: FooterProps) {
  const t = translations[lang];

  return (
    <footer className="bg-brand-surface border-t border-brand-line text-brand-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="flex items-center gap-2 text-brand-ink font-bold text-xl mb-4"
            >
              <span className="w-8 h-8 rounded-full bg-primary-400 flex items-center justify-center text-sm font-black text-white">
                G
              </span>
              GPadel
            </Link>
            <p className="text-brand-gray text-sm leading-relaxed max-w-xs">
              {lang === "ka"
                ? "პრემიუმ პადელის კომპლექსი წყნეთში — ბუნების გულში, ქალაქის სიახლოვეს."
                : "Premium padel complex in Tskneti — in the heart of nature, close to the city."}
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-brand-ink font-semibold text-sm uppercase tracking-wider mb-4">
              {lang === "ka" ? "სწრაფი ბმულები" : "Quick Links"}
            </h3>
            <ul className="space-y-3">
              {[
                { href: "/#home", label: t.nav_home },
                { href: "/#about", label: t.nav_about },
                { href: "/book", label: t.nav_book },
                { href: "/#contact", label: t.nav_contact },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-brand-gray hover:text-primary-400 text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-brand-ink font-semibold text-sm uppercase tracking-wider mb-4">
              {lang === "ka" ? "კონტაქტი" : "Contact"}
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="tel:+995599261322"
                  className="text-brand-gray hover:text-primary-400 text-sm transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  +995 599 261 322
                </a>
              </li>
              <li className="text-brand-gray text-sm flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Tskneti 0179, Georgia
              </li>
              <li className="text-brand-gray text-sm flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                09:00 – 02:00
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-brand-line flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-brand-mute text-sm">{t.footer_rights}</p>
          {/* Plain anchor (not Next.js <Link>) so middleware redirect works on
              first click without needing a refresh. <Link> prefetches /admin
              which middleware redirects to /admin/login — the prefetched result
              gets cached and the click becomes a no-op. */}
          <a
            href="/admin"
            className="inline-flex items-center gap-1.5 text-brand-mute hover:text-primary-400 text-xs transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            {lang === "ka" ? "ადმინი" : "Admin"}
          </a>
        </div>
      </div>
    </footer>
  );
}
