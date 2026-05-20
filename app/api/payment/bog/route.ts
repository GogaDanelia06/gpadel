import { NextRequest, NextResponse } from "next/server";
import { createBOGOrder } from "@/lib/bog";
import { calculateBookingPrice } from "@/lib/pricing";
import {
  findCode,
  isValidCode,
  applyDiscount,
  incrementUse,
} from "@/lib/discounts";
import { findReservationById, updateReservation } from "@/lib/reservations";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      reservationId,
      timeSlots,
      players,
      courtId,
      discountCode,
    } = body as {
      reservationId?: string;
      amount?: number; // ignored; kept for backward compat
      timeSlots?: unknown;
      players?: 2 | 4;
      courtId?: 1 | 2;
      discountCode?: string;
    };
    // courtId is persisted at reservation creation; accepted here for forward compatibility.
    void courtId;

    if (!reservationId) {
      return NextResponse.json(
        { error: "reservationId required" },
        { status: 400 }
      );
    }

    const reservation = findReservationById(reservationId);
    if (!reservation) {
      return NextResponse.json(
        { error: "reservation not found" },
        { status: 404 }
      );
    }

    // Recompute amount from timeSlots + players (rule-based) when provided,
    // otherwise fall back to the persisted reservation values.
    const usedSlots =
      Array.isArray(timeSlots) &&
      timeSlots.every(
        (s): s is string =>
          typeof s === "string" && /^([01]\d|2[0-3]):00$/.test(s)
      )
        ? (timeSlots as string[])
        : reservation.timeSlots;
    const usedPlayers: 2 | 4 = players === 2 || players === 4
      ? players
      : reservation.players;

    if (usedSlots.length < 1 || usedSlots.length > 8) {
      return NextResponse.json(
        { error: "timeSlots must contain between 1 and 8 entries" },
        { status: 400 }
      );
    }

    const { subtotal } = await calculateBookingPrice(
      reservation.date,
      usedSlots,
      usedPlayers
    );

    // Apply discount (prefer body-provided code, fall back to one already on the reservation)
    const codeInput =
      (typeof discountCode === "string" && discountCode.trim().length > 0
        ? discountCode
        : reservation.discountCode) ?? "";

    let appliedCode: string | undefined;
    let finalAmount = subtotal;
    if (codeInput) {
      const found = await findCode(codeInput);
      if (isValidCode(found)) {
        const { total } = applyDiscount(subtotal, found);
        finalAmount = total;
        appliedCode = found.code;
      }
    }

    if (!finalAmount || finalAmount <= 0) {
      return NextResponse.json(
        { error: "amount required" },
        { status: 400 }
      );
    }

    // Persist current pricing snapshot on the reservation
    updateReservation(reservationId, {
      price: finalAmount,
      originalPrice: subtotal,
      discountCode: appliedCode,
    });

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      `https://${request.headers.get("host")}`;

    const { paymentUrl, orderId } = await createBOGOrder({
      externalOrderId: reservationId,
      amount: finalAmount,
      baseUrl,
    });

    if (appliedCode) {
      await incrementUse(appliedCode);
    }

    return NextResponse.json({ paymentUrl, orderId });
  } catch (error) {
    console.error("BOG payment error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Payment initiation failed" },
      { status: 500 }
    );
  }
}
