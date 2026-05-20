"use client";

import { useState } from "react";
import { Language } from "@/types";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Courts from "@/components/Courts";
import Reviews from "@/components/Reviews";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function HomePage() {
  const [lang, setLang] = useState<Language>("ka");

  return (
    <>
      <Navbar lang={lang} onLangChange={setLang} />
      <main>
        <Hero lang={lang} />
        <About lang={lang} />
        <Courts lang={lang} />
        <Reviews lang={lang} />
        <Contact lang={lang} />
      </main>
      <Footer lang={lang} />
    </>
  );
}
