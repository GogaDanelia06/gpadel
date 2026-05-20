"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Courts from "@/components/Courts";
import Gallery from "@/components/Gallery";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { useLanguage } from "@/lib/LanguageContext";

export default function HomePage() {
  const { lang, setLang } = useLanguage();

  return (
    <>
      <Navbar lang={lang} onLangChange={setLang} />
      <main>
        <Hero lang={lang} />
        <About lang={lang} />
        <Courts lang={lang} />
        <Gallery lang={lang} />
        <Contact lang={lang} />
      </main>
      <Footer lang={lang} />
    </>
  );
}
