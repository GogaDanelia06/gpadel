import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminGuard";
import { readCodes, writeCodes } from "@/lib/discounts";
import { DiscountCode } from "@/types";

interface RouteContext {
  params: { code: string };
}

export async function PATCH(request: NextRequest, ctx: RouteContext) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  const codeKey = ctx.params.code?.toUpperCase();
  const body = (await request.json().catch(() => ({}))) as Partial<DiscountCode>;

  const codes = await readCodes();
  const idx = codes.findIndex((c) => c.code === codeKey);
  if (idx === -1) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  const current = codes[idx];
  const next: DiscountCode = { ...current };

  if (typeof body.active === "boolean") next.active = body.active;
  if (body.type === "percent" || body.type === "fixed") next.type = body.type;
  if (typeof body.value === "number" && body.value > 0) {
    if (next.type === "percent" && body.value > 100) {
      return NextResponse.json(
        { error: "Percent must be 1-100" },
        { status: 400 }
      );
    }
    next.value = body.value;
  }
  if (typeof body.maxUses === "number") {
    next.maxUses = body.maxUses > 0 ? Math.floor(body.maxUses) : undefined;
  } else if (body.maxUses === null) {
    next.maxUses = undefined;
  }
  if (typeof body.expiresAt === "string") {
    next.expiresAt = body.expiresAt.length > 0 ? body.expiresAt : undefined;
  } else if (body.expiresAt === null) {
    next.expiresAt = undefined;
  }
  if (typeof body.uses === "number" && body.uses >= 0) {
    next.uses = Math.floor(body.uses);
  }

  codes[idx] = next;
  await writeCodes(codes);
  return NextResponse.json({ code: next });
}

export async function DELETE(request: NextRequest, ctx: RouteContext) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  const codeKey = ctx.params.code?.toUpperCase();
  const codes = await readCodes();
  const next = codes.filter((c) => c.code !== codeKey);
  if (next.length === codes.length) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  await writeCodes(next);
  return new NextResponse(null, { status: 204 });
}
