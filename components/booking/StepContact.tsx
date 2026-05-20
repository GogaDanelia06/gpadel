"use client";

import { useEffect, useState } from "react";
import { Language, translations } from "@/types";

interface StepContactProps {
  lang: Language;
  date: string;
  timeSlots: string[];
  courtId: 1 | 2;
  name: string;
  phone: string;
  email: string;
  players: 2 | 4;
  onNameChange: (v: string) => void;
  onPhoneChange: (v: string) => void;
  onEmailChange: (v: string) => void;
  onPlayersChange: (v: 2 | 4) => void;
  onNext: () => void;
  onBack: () => void;
}

function orderIndex(s: string): number {
  const [h] = s.split(":");
  const n = parseInt(h, 10);
  return n >= 9 ? n : n + 24;
}

function formatTimeRange(timeSlots: string[]): string {
  if (timeSlots.length === 0) return "—";
  const sorted = [...timeSlots].sort((a, b) => orderIndex(a) - orderIndex(b));
  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  const [lh] = last.split(":");
  const endHour = (parseInt(lh, 10) + 1) % 24;
  const end = `${String(endHour).padStart(2, "0")}:00`;
  return `${first} – ${end}`;
}

interface BreakdownItem {
  time: string;
  price: number;
  ruleLabel: string;
}

export default function StepContact({
  lang,
  date,
  timeSlots,
  courtId,
  name,
  phone,
  email,
  players,
  onNameChange,
  onPhoneChange,
  onEmailChange,
  onPlayersChange,
  onNext,
  onBack,
}: StepContactProps) {
  const t = translations[lang];

  const [subtotal, setSubtotal] = useState(0);
  const [breakdown, setBreakdown] = useState<BreakdownItem[]>([]);
  const [pricingLoading, setPricingLoading] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);

  useEffect(() => {
    if (!date || timeSlots.length === 0) {
      setSubtotal(0);
      setBreakdown([]);
      return;
    }
    const ctrl = new AbortController();
    setPricingLoading(true);
    const sortedSlots = [...timeSlots].sort(
      (a, b) => orderIndex(a) - orderIndex(b)
    );
    const url = `/api/pricing?date=${encodeURIComponent(
      date
    )}&timeSlots=${encodeURIComponent(sortedSlots.join(","))}&players=${players}`;
    fetch(url, { signal: ctrl.signal, cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { subtotal: 0, breakdown: [] }))
      .then((data: { subtotal: number; breakdown: BreakdownItem[] }) => {
        setSubtotal(data.subtotal);
        setBreakdown(data.breakdown ?? []);
      })
      .catch(() => {
        // Aborts or network errors — keep current state.
      })
      .finally(() => setPricingLoading(false));
    return () => ctrl.abort();
  }, [date, timeSlots, players]);

  const canProceed =
    name.trim().length >= 2 &&
    phone.trim().length >= 6 &&
    email.includes("@");

  const courtLabel =
    courtId === 1
      ? `${t.court_1} (${t.court_1_desc})`
      : `${t.court_2} (${t.court_2_desc})`;

  const formattedDate = date
    ? new Date(date + "T00:00:00").toLocaleDateString(
        lang === "ka" ? "ka-GE" : "en-GB",
        { weekday: "short", year: "numeric", month: "short", day: "numeric" }
      )
    : "—";

  const sortedBreakdown = [...breakdown].sort(
    (a, b) => orderIndex(a.time) - orderIndex(b.time)
  );

  return (
    <div className="space-y-6">
      {/* Order so far */}
      {timeSlots.length > 0 && (
        <div className="bg-brand-surface border border-brand-line rounded-2xl p-4 sm:p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1 text-sm">
              <div className="text-brand-ink">
                <span className="text-brand-gray">{t.book_summary_date} </span>
                <span className="font-medium">{formattedDate}</span>
              </div>
              <div className="text-brand-ink">
                <span className="text-brand-gray">{t.book_summary_time} </span>
                <span className="font-medium">{formatTimeRange(timeSlots)}</span>
                <span className="text-brand-mute"> · </span>
                <span className="font-medium">
                  {t.book_hours_selected.replace("{n}", String(timeSlots.length))}
                </span>
              </div>
              <div className="text-brand-ink">
                <span className="text-brand-gray">{t.book_select_court}: </span>
                <span className="font-medium">{courtLabel}</span>
              </div>
            </div>
            <div className="flex items-baseline gap-2 sm:flex-col sm:items-end">
              <span className="text-brand-gray text-xs">{t.book_total}</span>
              <span
                className={`text-2xl font-black text-primary-400 transition-opacity ${
                  pricingLoading ? "opacity-60" : ""
                }`}
              >
                {subtotal}₾
              </span>
            </div>
          </div>

          {sortedBreakdown.length > 0 && (
            <div className="mt-3 pt-3 border-t border-brand-line">
              <button
                type="button"
                onClick={() => setShowBreakdown((v) => !v)}
                className="text-xs font-semibold text-brand-gray hover:text-primary-500 transition-colors inline-flex items-center gap-1"
              >
                {t.price_breakdown}
                <svg
                  className={`w-3 h-3 transition-transform ${
                    showBreakdown ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {showBreakdown && (
                <ul className="mt-2 space-y-1 text-xs">
                  {sortedBreakdown.map((s) => (
                    <li
                      key={s.time}
                      className="flex justify-between text-brand-gray"
                    >
                      <span>
                        <span className="font-mono text-brand-ink">
                          {s.time}
                        </span>
                        <span className="text-brand-mute"> · {s.ruleLabel}</span>
                      </span>
                      <span className="text-brand-ink font-medium">
                        {s.price}₾
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      )}

      {/* Name */}
      <div>
        <label className="block text-brand-ink text-sm font-medium mb-2">
          {t.book_your_name} <span className="text-primary-400">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder={t.book_name_placeholder}
          className="w-full px-4 py-3 bg-white border border-brand-line focus:border-primary-400 focus:ring-2 focus:ring-primary-100 rounded-xl text-brand-ink placeholder:text-brand-mute outline-none transition-colors"
        />
      </div>

      {/* Phone */}
      <div>
        <label className="block text-brand-ink text-sm font-medium mb-2">
          {t.book_your_phone} <span className="text-primary-400">*</span>
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => onPhoneChange(e.target.value)}
          placeholder={t.book_phone_placeholder}
          className="w-full px-4 py-3 bg-white border border-brand-line focus:border-primary-400 focus:ring-2 focus:ring-primary-100 rounded-xl text-brand-ink placeholder:text-brand-mute outline-none transition-colors"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-brand-ink text-sm font-medium mb-2">
          {t.book_your_email} <span className="text-primary-400">*</span>
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          placeholder={t.book_email_placeholder}
          className="w-full px-4 py-3 bg-white border border-brand-line focus:border-primary-400 focus:ring-2 focus:ring-primary-100 rounded-xl text-brand-ink placeholder:text-brand-mute outline-none transition-colors"
        />
      </div>

      {/* Players */}
      <div>
        <label className="block text-brand-ink text-sm font-medium mb-3">
          {t.book_players} <span className="text-primary-400">*</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          {([2, 4] as const).map((n) => {
            const label = n === 2 ? t.book_players_2 : t.book_players_4;
            const sel = players === n;
            return (
              <button
                key={n}
                type="button"
                onClick={() => onPlayersChange(n)}
                className={`
                  flex flex-col items-center justify-center gap-1 py-5 px-4 rounded-xl border-2 transition-all font-medium
                  ${sel
                    ? "border-primary-400 bg-primary-50 text-brand-ink"
                    : "border-brand-line bg-white text-brand-gray hover:border-brand-mute hover:text-brand-ink"
                  }
                `}
              >
                <span className="text-2xl">{n === 2 ? "👥" : "👥👥"}</span>
                <span className="text-sm">{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-between pt-4">
        <button
          onClick={onBack}
          className="px-6 py-3 border border-brand-line hover:border-brand-gray text-brand-gray hover:text-brand-ink font-semibold rounded-xl transition-all"
        >
          ← {t.book_back}
        </button>
        <button
          onClick={onNext}
          disabled={!canProceed}
          className="px-8 py-3 bg-primary-400 hover:bg-primary-500 disabled:bg-brand-line disabled:text-brand-mute disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all"
        >
          {t.book_next} →
        </button>
      </div>
    </div>
  );
}
