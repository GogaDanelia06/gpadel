import { NextRequest, NextResponse } from "next/server";
import { calculateBookingPrice } from "@/lib/pricing";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const date = searchParams.get("date");
  const slots = searchParams.get("timeSlots");

  if (!date || !slots) {
    return NextResponse.json({ subtotal: 0, breakdown: [] });
  }

  const timeSlots = slots
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const players = 4 as const;

  const result = await calculateBookingPrice(date, timeSlots, players);

  return NextResponse.json(result);
}