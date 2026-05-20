import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { addReservation, getBookedSlotsForDate } from "@/lib/reservations";
import { requireAdmin } from "@/lib/adminGuard";
import { Reservation } from "@/types";

const SLOT_REGEX = /^([01]\d|2[0-3]):00$/;

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  const body = (await request.json().catch(() => ({}))) as {
    courtId?: number;
    date?: string;
    timeSlots?: unknown;
    reason?: string;
  };

  const { courtId, date, timeSlots, reason } = body;

  if (courtId !== 1 && courtId !== 2) {
    return NextResponse.json({ error: "courtId must be 1 or 2" }, { status: 400 });
  }
  if (!date || typeof date !== "string") {
    return NextResponse.json({ error: "date required" }, { status: 400 });
  }
  if (!Array.isArray(timeSlots) || timeSlots.length < 1) {
    return NextResponse.json({ error: "timeSlots required" }, { status: 400 });
  }
  if (
    !timeSlots.every(
      (s): s is string => typeof s === "string" && SLOT_REGEX.test(s)
    )
  ) {
    return NextResponse.json(
      { error: "timeSlots contains invalid time format" },
      { status: 400 }
    );
  }

  // Conflict check on the same court
  const already = getBookedSlotsForDate(date, courtId);
  const conflicts = (timeSlots as string[]).filter((s) => already.includes(s));
  if (conflicts.length > 0) {
    return NextResponse.json(
      { error: "Conflicts with existing bookings", conflicts },
      { status: 409 }
    );
  }

  const reservation: Reservation = {
    id: uuidv4(),
    date,
    timeSlots: timeSlots as string[],
    courtId: courtId as 1 | 2,
    name: "ADMIN BLOCK",
    phone: "",
    email: "",
    players: 4,
    price: 0,
    paymentMethod: "bog",
    paymentStatus: "paid",
    createdAt: new Date().toISOString(),
    blocked: true,
    notes: typeof reason === "string" ? reason : undefined,
  };

  addReservation(reservation);
  return NextResponse.json({ reservation }, { status: 201 });
}
