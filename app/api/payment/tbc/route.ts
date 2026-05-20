import { NextRequest, NextResponse } from "next/server";
import { createTBCOrder } from "@/lib/tbc";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reservationId, amount } = body;

    if (!reservationId || !amount) {
      return NextResponse.json(
        { error: "reservationId and amount required" },
        { status: 400 }
      );
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      `https://${request.headers.get("host")}`;

    const { paymentUrl, orderId } = await createTBCOrder({
      externalOrderId: reservationId,
      amount,
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
