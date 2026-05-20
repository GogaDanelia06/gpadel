"use client";

import { useState } from "react";
import { Language, translations } from "@/types";
import { BookingState } from "@/types";

interface StepPaymentProps {
  lang: Language;
  booking: BookingState;
  onPaymentMethodChange: (method: "bog" | "tbc") => void;
  onBack: () => void;
}

export default function StepPayment({
  lang,
  booking,
  onPaymentMethodChange,
  onBack,
}: StepPaymentProps) {
  const t = translations[lang];
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const price = booking.players === 4 ? 120 : 60;

  const providers: { id: "bog" | "tbc"; name: string; desc: string }[] = [
    {
      id: "bog",
      name: t.book_bog,
      desc: lang === "ka" ? "საქართველოს ბანკი" : "Bank of Georgia",
    },
    {
      id: "tbc",
      name: t.book_tbc,
      desc: lang === "ka" ? "თიბისი ბანკი" : "TBC Bank",
    },
  ];

  const handleConfirm = async () => {
    if (!booking.paymentMethod) return;
    setLoading(true);
    setError(null);

    try {
      // 1. Create reservation
      const resRes = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: booking.date,
          timeSlot: booking.timeSlot,
          name: booking.name,
          phone: booking.phone,
          email: booking.email,
          players: booking.players,
          paymentMethod: booking.paymentMethod,
        }),
      });

      if (!resRes.ok) {
        const data = await resRes.json();
        throw new Error(data.error || "Failed to create reservation");
      }

      const { reservation } = await resRes.json();

      // 2. Initiate payment
      const payRes = await fetch(`/api/payment/${booking.paymentMethod}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reservationId: reservation.id,
          amount: price,
        }),
      });

      if (!payRes.ok) {
        const data = await payRes.json();
        throw new Error(data.error || "Payment initiation failed");
      }

      const { paymentUrl } = await payRes.json();

      // 3. Redirect to payment page
      window.location.href = paymentUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Order summary */}
      <div className="bg-brand-surface border border-brand-line rounded-2xl p-6">
        <h3 className="text-brand-ink font-bold text-lg mb-5">{t.book_summary}</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-brand-gray text-sm">{t.book_summary_date}</span>
            <span className="text-brand-ink font-medium">
              {booking.date
                ? new Date(booking.date + "T00:00:00").toLocaleDateString(
                    lang === "ka" ? "ka-GE" : "en-GB",
                    { weekday: "short", year: "numeric", month: "short", day: "numeric" }
                  )
                : "—"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-brand-gray text-sm">{t.book_summary_time}</span>
            <span className="text-brand-ink font-medium">{booking.timeSlot || "—"}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-brand-gray text-sm">{t.book_summary_players}</span>
            <span className="text-brand-ink font-medium">
              {booking.players}{" "}
              {lang === "ka" ? "მოთამაშე" : "players"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-brand-gray text-sm">{lang === "ka" ? "სახელი" : "Name"}</span>
            <span className="text-brand-ink font-medium">{booking.name}</span>
          </div>
          <div className="border-t border-brand-line pt-3 mt-3 flex justify-between items-center">
            <span className="text-brand-ink font-semibold">{t.book_summary_price}</span>
            <span className="text-2xl font-black text-primary-400">{price}₾</span>
          </div>
        </div>
      </div>

      {/* Payment method */}
      <div>
        <h3 className="text-brand-ink font-semibold text-lg mb-4">{t.book_payment_method}</h3>
        <div className="space-y-3">
          {providers.map((p) => {
            const sel = booking.paymentMethod === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => onPaymentMethodChange(p.id)}
                className={`
                  w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left
                  ${sel
                    ? "bg-white border-primary-400 ring-2 ring-primary-100"
                    : "bg-white border-brand-line hover:border-brand-mute"
                  }
                `}
              >
                {/* Payment icon */}
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center font-black text-white text-sm flex-shrink-0 ${
                    p.id === "bog" ? "bg-orange-500" : "bg-brand-blue"
                  }`}
                >
                  {p.id === "bog" ? "BOG" : "TBC"}
                </div>
                <div className="flex-1">
                  <div className="text-brand-ink font-semibold text-sm">{p.name}</div>
                  <div className="text-brand-gray text-xs">{p.desc}</div>
                </div>
                {/* Radio indicator */}
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    sel ? "border-primary-400 bg-primary-400" : "border-brand-line"
                  }`}
                >
                  {sel && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-300 rounded-xl px-4 py-3 text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* Buttons */}
      <div className="flex justify-between pt-4">
        <button
          onClick={onBack}
          disabled={loading}
          className="px-6 py-3 border border-brand-line hover:border-brand-gray text-brand-gray hover:text-brand-ink font-semibold rounded-xl transition-all disabled:opacity-50"
        >
          ← {t.book_back}
        </button>
        <button
          onClick={handleConfirm}
          disabled={!booking.paymentMethod || loading}
          className="px-8 py-4 bg-primary-400 hover:bg-primary-500 disabled:bg-brand-line disabled:text-brand-mute disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all flex items-center gap-2"
        >
          {loading ? (
            <>
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              {t.book_processing}
            </>
          ) : (
            <>
              {t.book_confirm}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
