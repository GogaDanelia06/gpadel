import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import {
  addReservation,
  getBookedSlotsForDate,
} from "@/lib/reservations";
import { calculateBookingPrice } from "@/lib/pricing";
import { findCode, isValidCode, applyDiscount } from "@/lib/discounts";
import { Reservation } from "@/types";

const SLOT_REGEX = /^([01]\d|2[0-3]):00$/;

function parseCourtId(value: string | null): 1 | 2 | null {
  if (value === "1") return 1;
  if (value === "2") return 2;
  return null;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");
  const courtId = parseCourtId(searchParams.get("courtId"));

  if (!date) {
    return NextResponse.json({ error: "date param required" }, { status: 400 });
  }
  if (!courtId) {
    return NextResponse.json(
      { error: "courtId param required (1 or 2)" },
      { status: 400 }
    );
  }

  const bookedSlots = getBookedSlotsForDate(date, courtId);

  return NextResponse.json({ bookedSlots });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      date,
      timeSlots,
      courtId,
      name,
      phone,
      email,
      players,
      paymentMethod,
      discountCode,
    } = body as {
      date?: string;
      timeSlots?: unknown;
      courtId?: number;
      name?: string;
      phone?: string;
      email?: string;
      players?: 2 | 4;
      paymentMethod?: "bog" | "tbc";
      discountCode?: string;
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

    if (courtId !== 1 && courtId !== 2) {
      return NextResponse.json(
        { error: "courtId must be 1 or 2" },
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

    // Conflict check — reject if any requested slot is already booked on THIS court
    const alreadyBooked = getBookedSlotsForDate(date, courtId);
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

    // Rule-based pricing
    const { subtotal } = await calculateBookingPrice(date, timeSlots, players);

    // Optional discount
    let appliedCode: string | undefined;
    let finalPrice = subtotal;
    if (typeof discountCode === "string" && discountCode.trim().length > 0) {
      const found = await findCode(discountCode);
      if (isValidCode(found)) {
        const { total } = applyDiscount(subtotal, found);
        finalPrice = total;
        appliedCode = found.code;
      }
    }

    const reservation: Reservation = {
      id: uuidv4(),
      date,
      timeSlots,
      courtId,
      name,
      phone,
      email,
      players,
      price: finalPrice,
      originalPrice: subtotal,
      discountCode: appliedCode,
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
