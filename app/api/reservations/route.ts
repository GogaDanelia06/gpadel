import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { addReservation, getReservationsByDate } from "@/lib/reservations";
import { Reservation } from "@/types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  if (!date) {
    return NextResponse.json({ error: "date param required" }, { status: 400 });
  }

  const reservations = getReservationsByDate(date);
  const bookedSlots = reservations
    .filter((r) => r.paymentStatus !== "failed")
    .map((r) => r.timeSlot);

  return NextResponse.json({ bookedSlots });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { date, timeSlot, name, phone, email, players, paymentMethod } = body;

    if (!date || !timeSlot || !name || !phone || !email || !players || !paymentMethod) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const price = players === 4 ? 120 : 60;

    const reservation: Reservation = {
      id: uuidv4(),
      date,
      timeSlot,
      name,
      phone,
      email,
      players,
      price,
      paymentMethod,
      paymentStatus: "pending",
      createdAt: new Date().toISOString(),
    };

    addReservation(reservation);

    return NextResponse.json({ reservation }, { status: 201 });
  } catch (error) {
    console.error("Reservation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
