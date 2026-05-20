import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { requireAdmin } from "@/lib/adminGuard";
import { readPricingRules, writePricingRules } from "@/lib/pricing";
import { PricingRule } from "@/types";

function parseRule(body: unknown): PricingRule | { error: string } {
  if (!body || typeof body !== "object") return { error: "Invalid body" };
  const b = body as Record<string, unknown>;
  const label = typeof b.label === "string" ? b.label.trim() : "";
  if (!label) return { error: "label required" };

  const days = Array.isArray(b.days)
    ? b.days.filter(
        (d): d is number =>
          typeof d === "number" && Number.isInteger(d) && d >= 1 && d <= 7
      )
    : [];
  if (days.length === 0) return { error: "days must include 1-7 values" };

  const startHour =
    typeof b.startHour === "number" && Number.isFinite(b.startHour)
      ? Math.floor(b.startHour)
      : NaN;
  const endHour =
    typeof b.endHour === "number" && Number.isFinite(b.endHour)
      ? Math.floor(b.endHour)
      : NaN;
  if (
    !Number.isInteger(startHour) ||
    !Number.isInteger(endHour) ||
    startHour < 0 ||
    endHour <= startHour ||
    endHour > 26
  ) {
    return { error: "Invalid hour range" };
  }

  const pricePerHour =
    typeof b.pricePerHour === "number" && b.pricePerHour >= 0
      ? Math.round(b.pricePerHour)
      : NaN;
  if (!Number.isFinite(pricePerHour))
    return { error: "pricePerHour must be a number" };

  const fourPlayerMultiplier =
    typeof b.fourPlayerMultiplier === "number" && b.fourPlayerMultiplier >= 0
      ? b.fourPlayerMultiplier
      : 2;

  return {
    id: typeof b.id === "string" && b.id ? b.id : uuidv4(),
    label,
    days,
    startHour,
    endHour,
    pricePerHour,
    fourPlayerMultiplier,
  };
}

export async function GET(request: NextRequest) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  const rules = await readPricingRules();
  return NextResponse.json({ rules });
}

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  const body = await request.json().catch(() => ({}));
  const parsed = parseRule({ ...body, id: undefined });
  if ("error" in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const rules = await readPricingRules();
  rules.push(parsed);
  await writePricingRules(rules);
  return NextResponse.json({ rule: parsed }, { status: 201 });
}
