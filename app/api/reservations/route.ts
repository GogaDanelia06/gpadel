import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import {
  addReservation,
  getBookedSlotsForDate,
} from "@/lib/reservations";
import { Reservation } from "@/types";

const SLOT_REGEX = /^([01]\d|2[0-3]):00$/;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  if (!date) {
    return NextResponse.json({ error: "date param required" }, { status: 400 });
  }

  const bookedSlots = getBookedSlotsForDate(date);

  return NextResponse.json({ bookedSlots });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      date,
      timeSlots,
      name,
      phone,
      email,
      players,
      paymentMethod,
    } = body as {
      date?: string;
      timeSlots?: unknown;
      name?: string;
      phone?: string;
      email?: string;
      players?: 2 | 4;
      paymentMethod?: "bog" | "tbc";
    };

    if (
      !date ||
      !Array.isArray(timeSlots) ||
      !name ||
      !phone ||
      !email ||
      !players ||
      !paymentMethod
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (timeSlots.length < 1 || timeSlots.length > 8) {
      return NextResponse.json(
        { error: "timeSlots must contain between 1 and 8 entries" },
        { status: 400 }
      );
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

    // Conflict check — reject if any requested slot is already booked
    const alreadyBooked = getBookedSlotsForDate(date);
    const conflicts = timeSlots.filter((s) => alreadyBooked.includes(s));
    if (conflicts.length > 0) {
      return NextResponse.json(
        {
          error: "One or more selected time slots are already booked",
          conflicts,
        },
        { status: 409 }
      );
    }

    const pricePerHour = players === 4 ? 120 : 60;
    const price = pricePerHour * timeSlots.length;

    const reservation: Reservation = {
      id: uuidv4(),
      date,
      timeSlots,
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
