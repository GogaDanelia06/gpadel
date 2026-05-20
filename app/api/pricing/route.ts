import { NextRequest, NextResponse } from "next/server";
import { calculateBookingPrice } from "@/lib/pricing";

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const date = params.get("date");
  const timeSlots =
    params.get("timeSlots")?.split(",").filter(Boolean) ?? [];
  const players = params.get("players") === "4" ? 4 : 2;
  if (!date || timeSlots.length === 0) {
    return NextResponse.json({ subtotal: 0, breakdown: [] });
  }
  const result = await calculateBookingPrice(date, timeSlots, players);
  return NextResponse.json(result);
}
