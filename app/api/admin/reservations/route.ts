import { NextRequest, NextResponse } from "next/server";
import { readReservations } from "@/lib/reservations";
import { requireAdmin } from "@/lib/adminGuard";
import { Reservation } from "@/types";

export async function GET(request: NextRequest) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");
  const dateFrom = searchParams.get("from");
  const dateTo = searchParams.get("to");
  const court = searchParams.get("court");
  const status = searchParams.get("status");
  const q = (searchParams.get("q") || "").trim().toLowerCase();

  let list: Reservation[] = readReservations();

  if (date) {
    list = list.filter((r) => r.date === date);
  } else {
    if (dateFrom) list = list.filter((r) => r.date >= dateFrom);
    if (dateTo) list = list.filter((r) => r.date <= dateTo);
  }

  if (court === "1") list = list.filter((r) => r.courtId === 1);
  else if (court === "2") list = list.filter((r) => r.courtId === 2);

  if (status) {
    if (status === "blocked") {
      list = list.filter((r) => r.blocked === true);
    } else if (
      status === "paid" ||
      status === "pending" ||
      status === "failed"
    ) {
      list = list.filter((r) => r.paymentStatus === status && !r.blocked);
    }
  }

  if (q) {
    list = list.filter((r) => {
      return (
        (r.name || "").toLowerCase().includes(q) ||
        (r.phone || "").toLowerCase().includes(q) ||
        (r.email || "").toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q)
      );
    });
  }

  // Sort newest first
  list.sort((a, b) =>
    b.date.localeCompare(a.date) || (b.createdAt || "").localeCompare(a.createdAt || "")
  );

  return NextResponse.json({ reservations: list });
}
