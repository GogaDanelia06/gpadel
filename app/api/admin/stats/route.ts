import { NextRequest, NextResponse } from "next/server";
import { readReservations } from "@/lib/reservations";
import { requireAdmin } from "@/lib/adminGuard";

function todayStr(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function startOfWeek(): Date {
  const d = new Date();
  const day = d.getDay(); // 0 = Sun
  const diff = (day + 6) % 7; // Monday-based
  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfWeek(): Date {
  const s = startOfWeek();
  s.setDate(s.getDate() + 7);
  return s;
}

function toDateOnly(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export async function GET(request: NextRequest) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  const all = readReservations();
  const today = todayStr();
  const weekStart = toDateOnly(startOfWeek());
  const weekEnd = toDateOnly(endOfWeek());

  const isReal = (r: { blocked?: boolean }) => !r.blocked;

  const todayItems = all.filter((r) => r.date === today && isReal(r));
  const weekItems = all.filter(
    (r) => r.date >= weekStart && r.date < weekEnd && isReal(r)
  );

  const todayCount = todayItems.length;
  const weekCount = weekItems.length;
  const todayRevenue = todayItems
    .filter((r) => r.paymentStatus === "paid")
    .reduce((sum, r) => sum + (r.price || 0), 0);
  const pendingCount = all.filter(
    (r) => r.paymentStatus === "pending" && isReal(r)
  ).length;

  return NextResponse.json({
    todayCount,
    weekCount,
    todayRevenue,
    pendingCount,
  });
}
