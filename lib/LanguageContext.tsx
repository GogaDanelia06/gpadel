"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Language } from "@/types";

const STORAGE_KEY = "gpadel.lang";

interface LanguageContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Start with "ka" to match server render, then hydrate from localStorage
  const [lang, setLangState] = useState<Language>("ka");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "ka" || stored === "en") {
        setLangState(stored);
      }
    } catch {
      // localStorage unavailable — ignore
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
      document.documentElement.lang = lang;
    } catch {
      // ignore
    }
  }, [lang, hydrated]);

  const setLang = (next: Language) => setLangState(next);

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return ctx;
}
