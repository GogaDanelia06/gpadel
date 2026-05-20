import { NextRequest, NextResponse } from "next/server";
import { findCode, isValidCode, applyDiscount } from "@/lib/discounts";

export async function POST(req: NextRequest) {
  let body: { code?: unknown; subtotal?: unknown } = {};
  try {
    body = await req.json();
  } catch {
    // ignore — handled below
  }

  const codeInput = typeof body.code === "string" ? body.code.trim() : "";
  const subtotal =
    typeof body.subtotal === "number" && Number.isFinite(body.subtotal)
      ? body.subtotal
      : 0;

  if (!codeInput) {
    return NextResponse.json(
      { valid: false, error: "Code required" },
      { status: 400 }
    );
  }

  const found = await findCode(codeInput);
  if (!isValidCode(found)) {
    return NextResponse.json(
      { valid: false, error: "Invalid or expired code" },
      { status: 400 }
    );
  }

  const { discount, total } = applyDiscount(subtotal, found);
  const label =
    found.type === "percent" ? `${found.value}% off` : `${found.value}₾ off`;

  return NextResponse.json({
    valid: true,
    discount,
    total,
    label,
    code: found.code,
    type: found.type,
    value: found.value,
  });
}
