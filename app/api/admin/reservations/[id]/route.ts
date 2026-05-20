import { NextRequest, NextResponse } from "next/server";
import {
  deleteReservation,
  findReservationById,
  updateReservation,
} from "@/lib/reservations";
import { requireAdmin } from "@/lib/adminGuard";

interface RouteContext {
  params: { id: string };
}

export async function PATCH(request: NextRequest, ctx: RouteContext) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  const id = ctx.params.id;
  const existing = findReservationById(id);
  if (!existing) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  const body = (await request.json().catch(() => ({}))) as {
    status?: "paid" | "pending" | "failed";
    notes?: string;
  };

  const patch: Record<string, unknown> = {};
  if (body.status === "paid" || body.status === "pending" || body.status === "failed") {
    patch.paymentStatus = body.status;
  }
  if (typeof body.notes === "string") {
    patch.notes = body.notes;
  }

  const updated = updateReservation(id, patch);
  return NextResponse.json({ reservation: updated });
}

export async function DELETE(request: NextRequest, ctx: RouteContext) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  const id = ctx.params.id;
  const ok = deleteReservation(id);
  if (!ok) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  return new NextResponse(null, { status: 204 });
}
