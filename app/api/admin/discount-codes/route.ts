import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminGuard";
import { readCodes, writeCodes } from "@/lib/discounts";
import { DiscountCode } from "@/types";

export async function GET(request: NextRequest) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  const codes = await readCodes();
  return NextResponse.json({ codes });
}

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  const body = (await request.json().catch(() => ({}))) as Partial<DiscountCode>;
  const codeRaw = typeof body.code === "string" ? body.code.trim() : "";
  const code = codeRaw.toUpperCase();
  if (!/^[A-Z0-9_-]{2,40}$/.test(code)) {
    return NextResponse.json(
      { error: "Code must be 2-40 chars, A-Z 0-9 _-" },
      { status: 400 }
    );
  }
  if (body.type !== "percent" && body.type !== "fixed") {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }
  const value =
    typeof body.value === "number" && Number.isFinite(body.value)
      ? body.value
      : NaN;
  if (!Number.isFinite(value) || value <= 0) {
    return NextResponse.json({ error: "Invalid value" }, { status: 400 });
  }
  if (body.type === "percent" && (value > 100 || value < 1)) {
    return NextResponse.json(
      { error: "Percent must be 1-100" },
      { status: 400 }
    );
  }

  const maxUses =
    typeof body.maxUses === "number" && body.maxUses > 0
      ? Math.floor(body.maxUses)
      : undefined;
  const expiresAt =
    typeof body.expiresAt === "string" && body.expiresAt.length > 0
      ? body.expiresAt
      : undefined;

  const codes = await readCodes();
  if (codes.some((c) => c.code === code)) {
    return NextResponse.json(
      { error: "Code already exists" },
      { status: 409 }
    );
  }

  const fresh: DiscountCode = {
    code,
    type: body.type,
    value,
    uses: 0,
    active: body.active === false ? false : true,
    maxUses,
    expiresAt,
    createdAt: new Date().toISOString(),
  };

  codes.push(fresh);
  await writeCodes(codes);
  return NextResponse.json({ code: fresh }, { status: 201 });
}
