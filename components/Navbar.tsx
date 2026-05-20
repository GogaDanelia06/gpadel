"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Language, translations } from "@/types";

interface NavbarProps {
  lang: Language;
  onLangChange: (lang: Language) => void;
}

export default function Navbar({ lang, onLangChange }: NavbarProps) {
  const t = translations[lang];
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/#home", label: t.nav_home },
    { href: "/#about", label: t.nav_about },
    { href: "/book", label: t.nav_book },
    { href: "/#contact", label: t.nav_contact },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-slate-900/95 backdrop-blur-md shadow-lg shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-white font-bold text-xl hover:text-green-400 transition-colors"
          >
            <span className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-sm font-black">
              G
            </span>
            <span>GPadel</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-slate-300 hover:text-white text-sm font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Lang toggle + CTA */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => onLangChange(lang === "ka" ? "en" : "ka")}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-slate-600 text-slate-300 hover:border-green-500 hover:text-green-400 text-sm font-medium transition-all"
            >
              <span className={lang === "ka" ? "text-white font-bold" : "text-slate-500"}>
                GE
              </span>
              <span className="text-slate-600">|</span>
              <span className={lang === "en" ? "text-white font-bold" : "text-slate-500"}>
                EN
              </span>
            </button>
            <Link
              href="/book"
              className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              {t.nav_book}
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-6 flex flex-col gap-1.5">
              <span
                className={`block h-0.5 bg-white transition-all ${
                  mobileOpen ? "rotate-45 translate-y-2" : ""
                }`}
              />
              <span
                className={`block h-0.5 bg-white transition-all ${
                  mobileOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block h-0.5 bg-white transition-all ${
                  mobileOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              />
            </div>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden bg-slate-900/98 backdrop-blur-md border-t border-slate-800 py-4 pb-6">
            <div className="flex flex-col gap-4 px-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-slate-300 hover:text-white text-base font-medium transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex items-center gap-3 pt-2 border-t border-slate-700">
                <button
                  onClick={() => {
                    onLangChange(lang === "ka" ? "en" : "ka");
                    setMobileOpen(false);
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-slate-600 text-slate-300 hover:border-green-500 hover:text-green-400 text-sm font-medium transition-all"
                >
                  <span className={lang === "ka" ? "text-white font-bold" : "text-slate-500"}>
                    GE
                  </span>
                  <span className="text-slate-600">|</span>
                  <span className={lang === "en" ? "text-white font-bold" : "text-slate-500"}>
                    EN
                  </span>
                </button>
                <Link
                  href="/book"
                  className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-sm font-semibold rounded-lg transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {t.nav_book}
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
