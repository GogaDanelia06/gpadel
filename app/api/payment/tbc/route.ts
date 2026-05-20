import { NextRequest, NextResponse } from "next/server";
import { createTBCOrder } from "@/lib/tbc";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reservationId, amount, timeSlots, players, courtId } = body as {
      reservationId?: string;
      amount?: number;
      timeSlots?: unknown;
      players?: 2 | 4;
      courtId?: 1 | 2;
    };
    // courtId is persisted at reservation creation; accepted here for forward compatibility.
    void courtId;

    if (!reservationId) {
      return NextResponse.json(
        {error: "reservationId required" }, 
        { status: 400 }
      );
    }

    let finalAmount = amount;
    if (Array.isArray(timeSlots) && players) {
      if (timeSlots.length < 1 || timeSlots.length > 8) {
        return NextResponse.json(
          { error: "timeSlots must contain between 1 and 8 entries" },
          { status: 400 }
        );
      }
      const pricePerHour = players === 4 ? 80 : 60;
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

    const { paymentUrl, orderId } = await createTBCOrder({
      externalOrderId: reservationId,
      amount: finalAmount,
      baseUrl,
    });

    return NextResponse.json({ paymentUrl, orderId });
  } catch (error) {
    console.error("TBC payment error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Payment initiation failed" },
      { status: 500 }
    );
  }
}
