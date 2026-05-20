"use client";

import { Reservation } from "@/types";
import { useState } from "react";
import { useToast } from "@/components/ui/ToastProvider";

interface ReservationTableProps {
  reservations: Reservation[];
  onChange?: () => void;
  emptyHint?: string;
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
  return `${first}–${end}`;
}

function StatusPill({ r }: { r: Reservation }) {
  if (r.blocked) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 text-[11px] font-semibold rounded-full bg-brand-line text-brand-gray">
        Blocked
      </span>
    );
  }
  if (r.paymentStatus === "paid") {
    return (
      <span className="inline-flex items-center px-2 py-0.5 text-[11px] font-semibold rounded-full bg-primary-50 text-primary-600">
        Paid
      </span>
    );
  }
  if (r.paymentStatus === "pending") {
    return (
      <span className="inline-flex items-center px-2 py-0.5 text-[11px] font-semibold rounded-full bg-amber-50 text-amber-600">
        Pending
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 text-[11px] font-semibold rounded-full bg-red-50 text-red-600">
      Failed
    </span>
  );
}

export default function ReservationTable({
  reservations,
  onChange,
  emptyHint,
}: ReservationTableProps) {
  const [busyId, setBusyId] = useState<string | null>(null);
  const toast = useToast();

  async function markPaid(id: string) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/reservations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "paid" }),
      });
      if (res.ok) {
        toast.success("Marked as paid");
        onChange?.();
      } else {
        toast.error("Could not update reservation");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setBusyId(null);
    }
  }

  async function cancelOne(id: string) {
    if (!confirm("Delete this reservation? This cannot be undone.")) return;
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/reservations/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Reservation removed");
        onChange?.();
      } else {
        toast.error("Could not remove reservation");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setBusyId(null);
    }
  }

  if (reservations.length === 0) {
    return (
      <div className="bg-white border border-brand-line rounded-2xl p-10 text-center text-brand-gray">
        {emptyHint || "No reservations found."}
      </div>
    );
  }

  return (
    <div className="bg-white border border-brand-line rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-brand-surface text-brand-gray uppercase text-[11px] tracking-wider">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Date</th>
              <th className="px-4 py-3 text-left font-semibold">Time</th>
              <th className="px-4 py-3 text-left font-semibold">Court</th>
              <th className="px-4 py-3 text-left font-semibold">Customer</th>
              <th className="px-4 py-3 text-left font-semibold">Phone</th>
              <th className="px-4 py-3 text-left font-semibold">Hours</th>
              <th className="px-4 py-3 text-left font-semibold">Total</th>
              <th className="px-4 py-3 text-left font-semibold">Status</th>
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-line">
            {reservations.map((r) => (
              <tr key={r.id} className="hover:bg-brand-surface/60 transition-colors">
                <td className="px-4 py-3 text-brand-ink font-medium">{r.date}</td>
                <td className="px-4 py-3 text-brand-ink">{formatTimeRange(r.timeSlots)}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border border-brand-line text-brand-ink bg-white">
                    Court {r.courtId}
                  </span>
                </td>
                <td className="px-4 py-3 text-brand-ink">
                  {r.blocked ? (
                    <span className="text-brand-gray italic">—</span>
                  ) : (
                    <>
                      <div className="font-medium">{r.name}</div>
                      {r.email && (
                        <div className="text-[11px] text-brand-mute truncate max-w-[160px]">
                          {r.email}
                        </div>
                      )}
                    </>
                  )}
                </td>
                <td className="px-4 py-3 text-brand-gray">
                  {r.blocked ? "—" : r.phone || "—"}
                </td>
                <td className="px-4 py-3 text-brand-ink">{r.timeSlots.length}h</td>
                <td className="px-4 py-3 text-brand-ink font-semibold">
                  {r.blocked ? "—" : `${r.price}₾`}
                </td>
                <td className="px-4 py-3">
                  <StatusPill r={r} />
                </td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  {!r.blocked && r.paymentStatus === "pending" && (
                    <button
                      onClick={() => markPaid(r.id)}
                      disabled={busyId === r.id}
                      className="text-[12px] font-semibold px-2.5 py-1 rounded-md bg-primary-50 text-primary-600 hover:bg-primary-100 disabled:opacity-50"
                    >
                      Mark paid
                    </button>
                  )}{" "}
                  <button
                    onClick={() => cancelOne(r.id)}
                    disabled={busyId === r.id}
                    className="text-[12px] font-semibold px-2.5 py-1 rounded-md text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    {r.blocked ? "Unblock" : "Cancel"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
