import { NextRequest, NextResponse } from "next/server";
import { readReservations } from "@/lib/reservations";
import { requireAdmin } from "@/lib/adminGuard";

function csvEscape(value: string | number | undefined | null): string {
  if (value === undefined || value === null) return "";
  const s = String(value);
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export async function GET(request: NextRequest) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  const list = readReservations();

  const headers = [
    "id",
    "date",
    "timeSlots",
    "courtId",
    "name",
    "phone",
    "email",
    "players",
    "price",
    "paymentMethod",
    "paymentStatus",
    "blocked",
    "notes",
    "createdAt",
  ];

  const rows = list.map((r) =>
    [
      r.id,
      r.date,
      r.timeSlots.join("|"),
      r.courtId,
      r.name,
      r.phone,
      r.email,
      r.players,
      r.price,
      r.paymentMethod,
      r.paymentStatus,
      r.blocked ? "true" : "false",
      r.notes || "",
      r.createdAt || "",
    ]
      .map(csvEscape)
      .join(",")
  );

  const csv = [headers.join(","), ...rows].join("\n");

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="gpadel-reservations-${new Date()
        .toISOString()
        .slice(0, 10)}.csv"`,
    },
  });
}
