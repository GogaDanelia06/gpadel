"use client";

import { useCallback, useEffect, useState } from "react";
import { Language, translations } from "@/types";

interface GalleryProps {
  lang: Language;
}

const PHOTOS: { src: string; alt: string }[] = [
  {
    src: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=1200&q=80",
    alt: "Padel court overview",
  },
  {
    src: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=1200&q=80",
    alt: "Indoor padel arena",
  },
  {
    src: "https://images.unsplash.com/photo-1592656094267-764a45160876?w=1200&q=80",
    alt: "Player serving on court",
  },
  {
    src: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=1200&q=80",
    alt: "Court at golden hour",
  },
  {
    src: "https://images.unsplash.com/photo-1559586980-7bb4eea0fc78?w=1200&q=80",
    alt: "Tennis racquet on court",
  },
  {
    src: "https://images.unsplash.com/photo-1531315396756-905d68d21b56?w=1200&q=80",
    alt: "Sport facility view",
  },
  {
    src: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=1200&q=80&flip=1",
    alt: "Padel match in progress",
  },
  {
    src: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=1200&q=80&flip=1",
    alt: "Net detail",
  },
];

export default function Gallery({ lang }: GalleryProps) {
  const t = translations[lang];
  const [open, setOpen] = useState<number | null>(null);

  const close = useCallback(() => setOpen(null), []);
  const prev = useCallback(
    () =>
      setOpen((i) => (i === null ? i : (i - 1 + PHOTOS.length) % PHOTOS.length)),
    []
  );
  const next = useCallback(
    () => setOpen((i) => (i === null ? i : (i + 1) % PHOTOS.length)),
    []
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    // Lock body scroll while lightbox is open
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, close, prev, next]);

  return (
    <section id="gallery" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-primary-500 text-sm font-semibold uppercase tracking-widest">
            {lang === "ka" ? "გალერეა" : "Gallery"}
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-black text-brand-ink">
            {t.gallery_title}
          </h2>
          <p className="mt-4 text-brand-gray text-lg max-w-xl mx-auto">
            {t.gallery_subtitle}
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {PHOTOS.map((p, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setOpen(i)}
              className="group relative aspect-square overflow-hidden rounded-2xl bg-brand-surface border border-brand-line shadow-sm hover:shadow-md transition-all"
              aria-label={`Open photo ${i + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.src}
                alt={p.alt}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-ink/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {open !== null && (
        <div
          className="fixed inset-0 z-[60] bg-brand-ink/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={close}
          role="dialog"
          aria-modal="true"
        >
          {/* Close */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              close();
            }}
            className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/95 hover:bg-white text-brand-ink flex items-center justify-center shadow-md transition-colors"
            aria-label="Close"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Prev */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/95 hover:bg-white text-brand-ink flex items-center justify-center shadow-md transition-colors"
            aria-label="Previous photo"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Image */}
          <div
            className="relative max-w-5xl max-h-[85vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={PHOTOS[open].src}
              alt={PHOTOS[open].alt}
              className="w-full h-full object-contain rounded-2xl shadow-2xl max-h-[85vh]"
            />
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-white/95 text-brand-ink text-xs font-medium shadow-sm">
              {open + 1} / {PHOTOS.length}
            </div>
          </div>

          {/* Next */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/95 hover:bg-white text-brand-ink flex items-center justify-center shadow-md transition-colors"
            aria-label="Next photo"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      )}
    </section>
  );
}
