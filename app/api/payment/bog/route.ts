import { NextRequest, NextResponse } from "next/server";
import { createBOGOrder } from "@/lib/bog";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reservationId, amount, timeSlots, players } = body as {
      reservationId?: string;
      amount?: number;
      timeSlots?: unknown;
      players?: 2 | 4;
    };

    if (!reservationId) {
      return NextResponse.json(
        { error: "reservationId required" },
        { status: 400 }
      );
    }

    // Compute amount from timeSlots + players when provided; fall back to client-provided amount.
    let finalAmount = amount;
    if (Array.isArray(timeSlots) && players) {
      if (timeSlots.length < 1 || timeSlots.length > 8) {
        return NextResponse.json(
          { error: "timeSlots must contain between 1 and 8 entries" },
          { status: 400 }
        );
      }
      const pricePerHour = players === 4 ? 120 : 60;
      finalAmount = pricePerHour * timeSlots.length;
    }

    if (!finalAmount || finalAmount <= 0) {
      return NextResponse.json(
        { error: "amount (or timeSlots+players) required" },
        { status: 400 }
      );
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      `https://${request.headers.get("host")}`;

    const { paymentUrl, orderId } = await createBOGOrder({
      externalOrderId: reservationId,
      amount: finalAmount,
      baseUrl,
    });

    return NextResponse.json({ paymentUrl, orderId });
  } catch (error) {
    console.error("BOG payment error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Payment initiation failed" },
      { status: 500 }
    );
  }
}
