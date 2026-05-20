import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminGuard";
import { readPricingRules, writePricingRules } from "@/lib/pricing";
import { PricingRule } from "@/types";

interface RouteContext {
  params: { id: string };
}

export async function PATCH(request: NextRequest, ctx: RouteContext) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  const id = ctx.params.id;
  const body = (await request.json().catch(() => ({}))) as Partial<PricingRule>;
  const rules = await readPricingRules();
  const idx = rules.findIndex((r) => r.id === id);
  if (idx === -1) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  const current = rules[idx];
  const next: PricingRule = {
    ...current,
    label:
      typeof body.label === "string" && body.label.trim().length > 0
        ? body.label.trim()
        : current.label,
    days:
      Array.isArray(body.days) &&
      body.days.every(
        (d) => typeof d === "number" && d >= 1 && d <= 7
      )
        ? (body.days as number[])
        : current.days,
    startHour:
      typeof body.startHour === "number" ? body.startHour : current.startHour,
    endHour: typeof body.endHour === "number" ? body.endHour : current.endHour,
    pricePerHour:
      typeof body.pricePerHour === "number" && body.pricePerHour >= 0
        ? body.pricePerHour
        : current.pricePerHour,
    fourPlayerMultiplier:
      typeof body.fourPlayerMultiplier === "number" &&
      body.fourPlayerMultiplier >= 0
        ? body.fourPlayerMultiplier
        : current.fourPlayerMultiplier,
  };

  if (next.endHour <= next.startHour || next.endHour > 26 || next.startHour < 0) {
    return NextResponse.json({ error: "Invalid hour range" }, { status: 400 });
  }
  if (next.days.length === 0) {
    return NextResponse.json({ error: "At least one day required" }, { status: 400 });
  }

  rules[idx] = next;
  await writePricingRules(rules);
  return NextResponse.json({ rule: next });
}

export async function DELETE(request: NextRequest, ctx: RouteContext) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  const id = ctx.params.id;
  const rules = await readPricingRules();
  const next = rules.filter((r) => r.id !== id);
  if (next.length === rules.length) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  await writePricingRules(next);
  return new NextResponse(null, { status: 204 });
}
