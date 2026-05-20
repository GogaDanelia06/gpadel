"use client";

import { Reservation } from "@/types";
import { useMemo } from "react";

interface WeekGridProps {
  reservations: Reservation[];
  weekStart: Date; // Monday
  onEmptyClick?: (date: string, slot: string, courtId: 1 | 2) => void;
}

const TIME_SLOTS = (() => {
  const slots: string[] = [];
  for (let h = 9; h <= 23; h++) {
    slots.push(`${String(h).padStart(2, "0")}:00`);
  }
  slots.push("00:00");
  slots.push("01:00");
  return slots;
})();

function toDateOnly(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function weekdayLabel(d: Date): string {
  return d.toLocaleDateString("en-GB", { weekday: "short" });
}

function dayLabel(d: Date): string {
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
}

function CourtGrid({
  reservations,
  weekStart,
  courtId,
  onEmptyClick,
}: WeekGridProps & { courtId: 1 | 2 }) {
  const days = useMemo(() => {
    const arr: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      arr.push(d);
    }
    return arr;
  }, [weekStart]);

  // Index reservations by date+slot for this court.
  const lookup = useMemo(() => {
    const map = new Map<string, Reservation>();
    for (const r of reservations) {
      if (r.courtId !== courtId) continue;
      if (r.paymentStatus === "failed") continue;
      for (const s of r.timeSlots) {
        map.set(`${r.date}|${s}`, r);
      }
    }
    return map;
  }, [reservations, courtId]);

  return (
    <div className="bg-white border border-brand-line rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-brand-ink">Court {courtId}</h3>
        <span className="text-xs text-brand-mute">
          {courtId === 1 ? "Outdoor" : "Indoor"}
        </span>
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-[640px]">
          {/* Header row */}
          <div className="grid grid-cols-[60px_repeat(7,minmax(0,1fr))] gap-1 mb-1">
            <div className="text-[10px] uppercase tracking-wider text-brand-mute font-semibold py-1" />
            {days.map((d) => (
              <div
                key={d.toISOString()}
                className="text-center text-[10px] uppercase tracking-wider text-brand-mute font-semibold py-1"
              >
                <div>{weekdayLabel(d)}</div>
                <div className="text-brand-ink text-[11px] font-bold">
                  {dayLabel(d)}
                </div>
              </div>
            ))}
          </div>

          {/* Rows */}
          {TIME_SLOTS.map((slot) => (
            <div
              key={slot}
              className="grid grid-cols-[60px_repeat(7,minmax(0,1fr))] gap-1 mb-1"
            >
              <div className="text-[11px] text-brand-gray font-semibold flex items-center justify-end pr-2">
                {slot}
              </div>
              {days.map((d) => {
                const dateStr = toDateOnly(d);
                const r = lookup.get(`${dateStr}|${slot}`);
                if (!r) {
                  return (
                    <button
                      key={dateStr}
                      type="button"
                      onClick={() => onEmptyClick?.(dateStr, slot, courtId)}
                      className="h-9 rounded-md bg-brand-surface hover:bg-primary-50 border border-transparent hover:border-primary-200 transition-colors"
                      aria-label={`Block ${dateStr} ${slot}`}
                    />
                  );
                }
                if (r.blocked) {
                  return (
                    <div
                      key={dateStr}
                      className="h-9 rounded-md bg-brand-line text-brand-gray text-[10px] font-semibold flex items-center justify-center"
                      title={r.notes || "Blocked"}
                    >
                      Blocked
                    </div>
                  );
                }
                const pending = r.paymentStatus === "pending";
                return (
                  <div
                    key={dateStr}
                    className={`h-9 rounded-md text-[10px] font-semibold flex items-center justify-center truncate px-1.5 ${
                      pending
                        ? "bg-primary-100 text-primary-700"
                        : "bg-primary-400 text-white"
                    }`}
                    title={`${r.name} · ${r.phone}`}
                  >
                    <span className="truncate">{r.name || "—"}</span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function WeekGrid({
  reservations,
  weekStart,
  onEmptyClick,
}: WeekGridProps) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      <CourtGrid
        reservations={reservations}
        weekStart={weekStart}
        courtId={1}
        onEmptyClick={onEmptyClick}
      />
      <CourtGrid
        reservations={reservations}
        weekStart={weekStart}
        courtId={2}
        onEmptyClick={onEmptyClick}
      />
    </div>
  );
}
