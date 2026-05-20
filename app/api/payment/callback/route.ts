import { NextRequest, NextResponse } from "next/server";
import { updateReservationStatus } from "@/lib/reservations";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const provider = searchParams.get("provider");
  const orderId = searchParams.get("orderId");

  if (!provider || !orderId) {
    return NextResponse.json(
      { error: "provider and orderId required" },
      { status: 400 }
    );
  }

  // In a real integration, here you would:
  // 1. Verify the callback signature/token from the payment provider
  // 2. Query the provider's API to confirm the payment status
  // 3. Only then mark the reservation as paid

  // For now, we mark as paid on callback (providers call this on success)
  const updated = updateReservationStatus(orderId, "paid", orderId);

  if (!updated) {
    return NextResponse.json({ error: "Reservation not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, orderId, provider });
}

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const provider = searchParams.get("provider");
  const orderId = searchParams.get("orderId");

  if (!provider || !orderId) {
    return NextResponse.json(
      { error: "provider and orderId required" },
      { status: 400 }
    );
  }

  let body: Record<string, unknown> = {};
  try {
    body = await request.json();
  } catch {
    // body may not be JSON
  }

  // Determine status from provider callback body
  // BOG sends { status: "completed" | "rejected" | ... }
  // TBC sends { status: "Succeeded" | "Failed" | ... }
  let status: "paid" | "failed" = "paid";

  if (provider === "bog") {
    const bogStatus = (body as { status?: string }).status;
    if (bogStatus && !["completed", "succeeded"].includes(bogStatus.toLowerCase())) {
      status = "failed";
    }
  } else if (provider === "tbc") {
    const tbcStatus = (body as { status?: string }).status;
    if (tbcStatus && !["succeeded", "completed"].includes(tbcStatus.toLowerCase())) {
      status = "failed";
    }
  }

  updateReservationStatus(orderId, status, orderId);

  return NextResponse.json({ success: true });
}
