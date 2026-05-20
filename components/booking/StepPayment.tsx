"use client";

import { useEffect, useState } from "react";
import { Language, translations } from "@/types";
import { BookingState } from "@/types";
import { useToast } from "@/components/ui/ToastProvider";

interface StepPaymentProps {
  lang: Language;
  booking: BookingState;
  onPaymentMethodChange: (method: "bog" | "tbc") => void;
  onBack: () => void;
}

function orderIndex(s: string): number {
  const [h] = s.split(":");
  const n = parseInt(h, 10);
  // 09–23 -> 9..23 ; 00 -> 24 ; 01 -> 25 (slots that fall after midnight)
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

interface AppliedDiscount {
  code: string;
  label: string;
  discount: number;
}

export default function StepPayment({
  lang,
  booking,
  onPaymentMethodChange,
  onBack,
}: StepPaymentProps) {
  const t = translations[lang];
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [subtotal, setSubtotal] = useState(0);
  const [breakdown, setBreakdown] = useState<BreakdownItem[]>([]);
  const [pricingLoading, setPricingLoading] = useState(false);

  // Discount-code UI state
  const [codeInput, setCodeInput] = useState("");
  const [applied, setApplied] = useState<AppliedDiscount | null>(null);
  const [codeError, setCodeError] = useState<string | null>(null);
  const [applyingCode, setApplyingCode] = useState(false);

  const hours = booking.timeSlots.length;
  const sortedSlots = [...booking.timeSlots].sort(
    (a, b) => orderIndex(a) - orderIndex(b)
  );

  const courtLabel =
    booking.courtId === 1
      ? `${t.court_1} (${t.court_1_desc})`
      : `${t.court_2} (${t.court_2_desc})`;

  // Fetch live subtotal via the pricing endpoint
  useEffect(() => {
    if (!booking.date || sortedSlots.length === 0) {
      setSubtotal(0);
      setBreakdown([]);
      return;
    }
    const ctrl = new AbortController();
    setPricingLoading(true);
    const url = `/api/pricing?date=${encodeURIComponent(
      booking.date
    )}&timeSlots=${encodeURIComponent(sortedSlots.join(","))}&players=${
      booking.players
    }`;
    fetch(url, { signal: ctrl.signal, cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { subtotal: 0, breakdown: [] }))
      .then((data: { subtotal: number; breakdown: BreakdownItem[] }) => {
        setSubtotal(data.subtotal);
        setBreakdown(data.breakdown ?? []);
      })
      .catch(() => {
        // ignore aborts
      })
      .finally(() => setPricingLoading(false));
    return () => ctrl.abort();
    // sortedSlots is derived from booking.timeSlots; depend on the source.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [booking.date, booking.timeSlots, booking.players]);

  // If players/slots/date change, any applied discount may have a stale total.
  // We don't drop the code — we re-validate against the new subtotal.
  useEffect(() => {
    if (!applied) return;
    let aborted = false;
    (async () => {
      try {
        const res = await fetch("/api/discount/validate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: applied.code, subtotal }),
        });
        const data = await res.json();
        if (aborted) return;
        if (res.ok && data.valid) {
          setApplied({
            code: data.code,
            label: data.label,
            discount: data.discount,
          });
        } else {
          setApplied(null);
        }
      } catch {
        // ignore
      }
    })();
    return () => {
      aborted = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subtotal]);

  const discount = applied?.discount ?? 0;
  const total = Math.max(0, subtotal - discount);

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

  async function handleApplyCode() {
    const code = codeInput.trim();
    if (!code) return;
    setApplyingCode(true);
    setCodeError(null);
    try {
      const res = await fetch("/api/discount/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, subtotal }),
      });
      const data = await res.json();
      if (res.ok && data.valid) {
        setApplied({
          code: data.code,
          label: data.label,
          discount: data.discount,
        });
        setCodeInput("");
        toast.success(t.code_applied);
      } else {
        setApplied(null);
        const msg = data.error || t.code_invalid;
        setCodeError(msg);
        toast.error(t.code_invalid);
      }
    } catch {
      setApplied(null);
      setCodeError(t.code_invalid);
      toast.error(t.code_invalid);
    } finally {
      setApplyingCode(false);
    }
  }

  function handleRemoveCode() {
    setApplied(null);
    setCodeError(null);
  }

  const handleConfirm = async () => {
    if (!booking.paymentMethod) return;
    if (hours < 1) return;
    setLoading(true);
    setError(null);

    try {
      // 1. Create reservation
      const resRes = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: booking.date,
          timeSlots: sortedSlots,
          courtId: booking.courtId,
          name: booking.name,
          phone: booking.phone,
          email: booking.email,
          players: booking.players,
          paymentMethod: booking.paymentMethod,
          discountCode: applied?.code,
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
          amount: total,
          timeSlots: sortedSlots,
          players: booking.players,
          courtId: booking.courtId,
          discountCode: applied?.code,
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
      const msg = err instanceof Error ? err.message : "An error occurred";
      setError(msg);
      toast.error(msg);
      setLoading(false);
    }
  };

  const hoursLabel =
    hours === 1
      ? lang === "ka"
        ? "1 საათი"
        : "1 hour"
      : lang === "ka"
      ? `${hours} საათი`
      : `${hours} hours`;

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
            <span className="text-brand-ink font-medium">
              {formatTimeRange(booking.timeSlots)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-brand-gray text-sm">{t.book_select_court}</span>
            <span className="text-brand-ink font-medium">{courtLabel}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-brand-gray text-sm">
              {lang === "ka" ? "ხანგრძლივობა" : "Duration"}
            </span>
            <span className="text-brand-ink font-medium">{hoursLabel}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-brand-gray text-sm">{t.book_summary_players}</span>
            <span className="text-brand-ink font-medium">
              {booking.players} {lang === "ka" ? "მოთამაშე" : "players"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-brand-gray text-sm">{lang === "ka" ? "სახელი" : "Name"}</span>
            <span className="text-brand-ink font-medium">{booking.name}</span>
          </div>

          {/* Per-slot breakdown */}
          {breakdown.length > 0 && (
            <div className="border-t border-brand-line pt-3 mt-1">
              <div className="text-xs font-semibold uppercase tracking-wider text-brand-mute mb-2">
                {t.price_breakdown}
              </div>
              <ul className="space-y-1 text-xs">
                {breakdown
                  .slice()
                  .sort(
                    (a, b) => orderIndex(a.time) - orderIndex(b.time)
                  )
                  .map((s) => (
                    <li
                      key={s.time}
                      className="flex justify-between text-brand-gray"
                    >
                      <span>
                        <span className="font-mono text-brand-ink">
                          {s.time}
                        </span>
                        <span className="text-brand-mute">
                          {" "}
                          · {s.ruleLabel}
                        </span>
                      </span>
                      <span className="text-brand-ink font-medium">
                        {s.price}₾
                      </span>
                    </li>
                  ))}
              </ul>
            </div>
          )}

          <div className="border-t border-brand-line pt-3 mt-3 space-y-2">
            {applied ? (
              <>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-brand-gray">{t.subtotal}</span>
                  <span className="text-brand-ink font-medium">{subtotal}₾</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-primary-500 font-medium">
                    {t.discount_label} ({applied.label})
                  </span>
                  <span className="text-primary-500 font-semibold">
                    −{discount}₾
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-brand-line">
                  <span className="text-brand-ink font-semibold">
                    {t.book_total}
                  </span>
                  <span
                    className={`text-2xl font-black text-primary-400 transition-opacity ${
                      pricingLoading ? "opacity-60" : ""
                    }`}
                  >
                    {total}₾
                  </span>
                </div>
              </>
            ) : (
              <div className="flex justify-between items-center">
                <span className="text-brand-ink font-semibold">
                  {t.book_total}
                </span>
                <span
                  className={`text-2xl font-black text-primary-400 transition-opacity ${
                    pricingLoading ? "opacity-60" : ""
                  }`}
                >
                  {total}₾
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Discount code */}
      <div>
        <h3 className="text-brand-ink font-semibold text-sm mb-2">
          {t.discount_code}
        </h3>
        {applied ? (
          <div className="flex items-center justify-between bg-primary-50 border border-primary-200 rounded-xl px-4 py-3">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-primary-500 font-bold">✓</span>
              <span className="text-brand-ink font-medium">
                {t.code_applied}:{" "}
                <span className="font-mono">{applied.code}</span>
              </span>
              <span className="text-brand-gray">({applied.label})</span>
            </div>
            <button
              type="button"
              onClick={handleRemoveCode}
              className="text-xs font-semibold text-brand-gray hover:text-red-500 transition-colors"
            >
              {t.remove_code}
            </button>
          </div>
        ) : (
          <>
            <div className="flex gap-2">
              <input
                type="text"
                value={codeInput}
                onChange={(e) => {
                  setCodeInput(e.target.value.toUpperCase());
                  if (codeError) setCodeError(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleApplyCode();
                  }
                }}
                placeholder="FIRST10"
                disabled={applyingCode}
                className="flex-1 px-4 py-2.5 bg-white border border-brand-line focus:border-primary-400 focus:ring-2 focus:ring-primary-100 rounded-lg text-brand-ink placeholder:text-brand-mute font-mono outline-none transition-colors disabled:opacity-50"
              />
              <button
                type="button"
                onClick={handleApplyCode}
                disabled={!codeInput.trim() || applyingCode || subtotal <= 0}
                className="px-5 py-2.5 bg-primary-400 hover:bg-primary-500 disabled:bg-brand-line disabled:text-brand-mute disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors text-sm whitespace-nowrap"
              >
                {applyingCode ? "…" : t.apply_code}
              </button>
            </div>
            {codeError && (
              <p className="mt-1.5 text-xs text-red-600">{codeError}</p>
            )}
          </>
        )}
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
          disabled={!booking.paymentMethod || loading || hours < 1}
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
