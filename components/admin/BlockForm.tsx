"use client";

import { FormEvent, useState } from "react";

interface BlockFormProps {
  initialCourtId?: 1 | 2;
  initialDate?: string;
  initialStart?: string;
  onCreated?: () => void;
  compact?: boolean;
}

const TIME_OPTIONS = (() => {
  const slots: string[] = [];
  for (let h = 9; h <= 23; h++) {
    slots.push(`${String(h).padStart(2, "0")}:00`);
  }
  slots.push("00:00");
  slots.push("01:00");
  return slots;
})();

function slotsFromStart(start: string, hours: number): string[] {
  const startIdx = TIME_OPTIONS.indexOf(start);
  if (startIdx === -1) return [];
  return TIME_OPTIONS.slice(startIdx, startIdx + hours);
}

export default function BlockForm({
  initialCourtId = 1,
  initialDate = "",
  initialStart = "",
  onCreated,
  compact,
}: BlockFormProps) {
  const [courtId, setCourtId] = useState<1 | 2>(initialCourtId);
  const [date, setDate] = useState(initialDate || new Date().toISOString().slice(0, 10));
  const [start, setStart] = useState(initialStart || "09:00");
  const [hours, setHours] = useState(1);
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setOk(false);
    setSubmitting(true);

    const timeSlots = slotsFromStart(start, hours);
    if (timeSlots.length === 0) {
      setError("Invalid start time");
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/admin/block", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courtId, date, timeSlots, reason }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setError(data.error || "Failed to block");
        setSubmitting(false);
        return;
      }
      setOk(true);
      setReason("");
      onCreated?.();
    } catch {
      setError("Network error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className={`bg-white border border-brand-line rounded-2xl p-5 ${
        compact ? "" : "max-w-xl"
      }`}
    >
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs uppercase tracking-wider text-brand-gray font-semibold mb-1">
            Court
          </label>
          <select
            value={courtId}
            onChange={(e) => setCourtId(Number(e.target.value) as 1 | 2)}
            className="w-full px-3 py-2 bg-white border border-brand-line rounded-lg text-sm text-brand-ink outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
          >
            <option value={1}>Court 1 (Outdoor)</option>
            <option value={2}>Court 2 (Panorama)</option>
          </select>
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wider text-brand-gray font-semibold mb-1">
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-brand-line rounded-lg text-sm text-brand-ink outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wider text-brand-gray font-semibold mb-1">
            Start time
          </label>
          <select
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-brand-line rounded-lg text-sm text-brand-ink outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
          >
            {TIME_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wider text-brand-gray font-semibold mb-1">
            Hours
          </label>
          <select
            value={hours}
            onChange={(e) => setHours(parseInt(e.target.value, 10))}
            className="w-full px-3 py-2 bg-white border border-brand-line rounded-lg text-sm text-brand-ink outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((h) => (
              <option key={h} value={h}>
                {h}h
              </option>
            ))}
          </select>
        </div>
        <div className="col-span-2">
          <label className="block text-xs uppercase tracking-wider text-brand-gray font-semibold mb-1">
            Reason (optional)
          </label>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Maintenance, private event…"
            className="w-full px-3 py-2 bg-white border border-brand-line rounded-lg text-sm text-brand-ink outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 placeholder:text-brand-mute"
          />
        </div>
      </div>

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-red-600 text-sm">
          {error}
        </div>
      )}
      {ok && !error && (
        <div className="mt-4 bg-primary-50 border border-primary-200 rounded-lg px-3 py-2 text-primary-600 text-sm">
          Slot blocked.
        </div>
      )}

      <div className="mt-5 flex justify-end">
        <button
          type="submit"
          disabled={submitting}
          className="px-5 py-2.5 bg-primary-400 hover:bg-primary-500 disabled:opacity-50 text-white font-bold rounded-lg transition-colors text-sm"
        >
          {submitting ? "Blocking…" : "Block slot"}
        </button>
      </div>
    </form>
  );
}
